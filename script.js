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
  window.dispatchEvent(new CustomEvent("orbit-bgm-change", { detail: { enabled: bgmEnabled } }));
}

function startGame() {
  if (stage.classList.contains("is-transitioning")) return;
  languageControl.classList.remove("is-open");
  stage.classList.add("is-transitioning");
  transitionTimer = window.setTimeout(() => {
    stage.classList.add("is-bedroom");
    window.enterBedroomScene?.();
  }, 1840);
}

function resetMenu() {
  window.clearTimeout(transitionTimer);
  window.resetDressupScene?.();
  window.resetBedroomScene?.();
  stage.classList.remove("is-bedroom", "is-transitioning", "is-dressup");
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
  toggleBgm,
  resetMenu,
};
