const stage = document.querySelector("#menuStage");
const startButton = document.querySelector(".start-button");
const bgmButton = document.querySelector(".bgm-button");
const bgmState = document.querySelector(".bgm-state");
const languageControl = document.querySelector(".language-control");
const languageButton = document.querySelector(".language-button");
const languageOptions = document.querySelectorAll("[data-lang]");
const returnButton = document.querySelector(".return-button");

const copy = {
  en: {
    talkCharacter: "Talk to Jongho",
    start: "START",
    bgm: "BGM",
    language: "LANGUAGE",
    bedroom: "BEDROOM",
    outfit: "WARDROBE · OUTFIT",
    backBedroom: "BACK TO BEDROOM",
    return: "RETURN TO MENU",
    sceneBgm: "Toggle BGM",
    sceneBack: "Back to previous screen",
    rotateTitle: "ROTATE YOUR PHONE",
    rotateBody: "This experience is designed for landscape view.",
    on: "ON",
    off: "OFF",
  },
  zh: {
    talkCharacter: "和钟浩说话",
    start: "开始",
    bgm: "音乐",
    language: "语言",
    bedroom: "卧室",
    outfit: "衣柜 · 换装",
    backBedroom: "返回卧室",
    return: "返回菜单",
    sceneBgm: "音乐开关",
    sceneBack: "返回上一界面",
    rotateTitle: "请旋转手机",
    rotateBody: "本游戏建议使用横屏体验。",
    on: "开启",
    off: "关闭",
  },
  ko: {
    talkCharacter: "종호에게 말 걸기",
    start: "시작",
    bgm: "음악",
    language: "언어",
    bedroom: "침실",
    outfit: "옷장 · 옷 고르기",
    backBedroom: "침실로 돌아가기",
    return: "메뉴로 돌아가기",
    sceneBgm: "음악 켜기 또는 끄기",
    sceneBack: "이전 화면으로 돌아가기",
    rotateTitle: "휴대폰을 돌려 주세요",
    rotateBody: "가로 화면으로 플레이해 주세요.",
    on: "켜짐",
    off: "꺼짐",
  },
};

let language = "en";
let bgmEnabled = true;
let transitionTimer;

const orbitSceneBgm = (() => {
  const tracks = {
    menu: { src: "assets/audio/bgm/all-about-you.mp3", volume: .18 },
    bedroom: { src: "assets/audio/bgm/bedroom-lullaby.mp3", volume: .14 },
    street: { src: "assets/audio/bgm/good-day.mp3", volume: .16 },
    restaurant: { src: "assets/audio/bgm/beyond-the-sea.mp3", volume: .09 },
    epilogue: { src: "assets/audio/bgm/all-about-you.mp3", volume: .18 },
  };
  const players = new Map();
  let desiredKey = "menu";
  let activeKey = null;
  let unlocked = false;

  function playerFor(key) {
    if (!tracks[key]) return null;
    if (!players.has(key)) {
      const audio = new Audio(tracks[key].src);
      audio.loop = true;
      audio.preload = "auto";
      audio.playsInline = true;
      players.set(key, audio);
    }
    return players.get(key);
  }

  function fade(audio, target, duration, pauseAfter = false, resetAfter = false) {
    if (!audio) return;
    const fadeId = (audio._orbitFadeId || 0) + 1;
    audio._orbitFadeId = fadeId;
    const start = audio.volume;
    const startedAt = performance.now();
    const step = now => {
      if (audio._orbitFadeId !== fadeId) return;
      const progress = Math.max(0, Math.min(1, (now - startedAt) / Math.max(1, duration)));
      audio.volume = Math.max(0, Math.min(1, start + (target - start) * (1 - Math.pow(1 - progress, 2))));
      if (progress < 1) requestAnimationFrame(step);
      else if (pauseAfter) {
        audio.pause();
        if (resetAfter) audio.currentTime = 0;
      }
    };
    requestAnimationFrame(step);
  }

  async function enter(key, duration = 1200) {
    desiredKey = key;
    const next = playerFor(key);
    if (!next || !unlocked || !bgmEnabled) return;
    if (activeKey === key) {
      if (next.paused) await next.play().catch(() => {});
      fade(next, tracks[key].volume, duration);
      return;
    }
    const previousKey = activeKey;
    const previous = previousKey ? playerFor(previousKey) : null;
    activeKey = key;
    next.currentTime = 0;
    next.volume = 0;
    await next.play().catch(() => {});
    if (activeKey !== key || !bgmEnabled) return;
    fade(next, tracks[key].volume, duration);
    if (previous && previous !== next) fade(previous, 0, Math.min(duration, 1000), true, true);
  }

  function stop(duration = 1000) {
    desiredKey = null;
    if (!activeKey) return;
    const previous = playerFor(activeKey);
    activeKey = null;
    fade(previous, 0, duration, true, true);
  }

  function setEnabled(enabled) {
    if (!enabled) {
      players.forEach(audio => fade(audio, 0, 320, true, false));
      return;
    }
    if (desiredKey) enter(desiredKey, 600);
  }

  function preload(key) {
    const audio = playerFor(key);
    if (audio?.readyState === HTMLMediaElement.HAVE_NOTHING) audio.load();
  }

  function unlock() {
    unlocked = true;
    window.setTimeout(() => {
      if (bgmEnabled && desiredKey) enter(desiredKey, 850);
    }, 0);
  }

  document.addEventListener("pointerdown", unlock, { once: true, capture: true });
  document.addEventListener("keydown", unlock, { once: true, capture: true });
  preload("menu");
  preload("bedroom");
  return { enter, stop, preload, setEnabled, current: () => desiredKey };
})();

function applyLanguage(nextLanguage) {
  language = copy[nextLanguage] ? nextLanguage : "en";
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (copy[language][key]) element.textContent = copy[language][key];
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const key = element.dataset.i18nAria;
    if (copy[language][key]) element.setAttribute("aria-label", copy[language][key]);
  });

  bgmState.textContent = bgmEnabled ? copy[language].on : copy[language].off;
  languageControl.classList.remove("is-open");
  languageButton.setAttribute("aria-expanded", "false");
  window.dispatchEvent(new CustomEvent("orbit-language-change", { detail: { language } }));
}

function toggleLanguageMenu() {
  const isOpen = languageControl.classList.toggle("is-open");
  languageButton.setAttribute("aria-expanded", String(isOpen));
}

function toggleBgm() {
  bgmEnabled = !bgmEnabled;
  bgmButton.setAttribute("aria-pressed", String(bgmEnabled));
  bgmState.textContent = bgmEnabled ? copy[language].on : copy[language].off;
  orbitSceneBgm.setEnabled(bgmEnabled);
  window.dispatchEvent(new CustomEvent("orbit-bgm-change", { detail: { enabled: bgmEnabled } }));
}

function startGame() {
  if (stage.classList.contains("is-transitioning")) return;
  languageControl.classList.remove("is-open");
  stage.classList.add("is-transitioning");
  transitionTimer = window.setTimeout(() => {
    window.enterBedroomScene?.();
    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add("is-bedroom")));
  }, 1840);
}

function resetMenu() {
  window.clearTimeout(transitionTimer);
  window.resetBeachScene?.();
  window.resetEpilogueScene?.();
  window.resetFinaleScene?.();
  window.resetRestaurantScene?.();
  window.resetStreetScene?.();
  window.resetDressupScene?.();
  window.resetBedroomScene?.();
  window.orbitGameState.currentScene = "menu";
  window.orbitGameState.selectedDrink = null;
  window.orbitGameState.restaurantResult = null;
  window.orbitGameState.beachResult = null;
  stage.classList.remove("is-bedroom", "is-transitioning", "is-dressup");
  orbitSceneBgm.enter("menu");
}

languageButton.addEventListener("click", toggleLanguageMenu);
bgmButton.addEventListener("click", toggleBgm);
startButton.addEventListener("click", startGame);
returnButton?.addEventListener("click", resetMenu);

languageOptions.forEach((option) => {
  option.addEventListener("click", () => applyLanguage(option.dataset.lang));
});

document.addEventListener("click", (event) => {
  if (!languageControl.contains(event.target)) {
    languageControl.classList.remove("is-open");
    languageButton.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    languageControl.classList.remove("is-open");
    languageButton.setAttribute("aria-expanded", "false");
  }
});

applyLanguage("en");

window.orbitMenu = {
  getLanguage: () => language,
  getBgmEnabled: () => bgmEnabled,
  setLanguage: applyLanguage,
  toggleBgm,
  resetMenu,
};
window.orbitBgm = orbitSceneBgm;
