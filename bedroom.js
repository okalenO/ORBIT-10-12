const bedroomScene = document.querySelector(".bedroom-scene");
const darkRoomVideo = document.querySelector(".room-dark-video");
const interactionLayer = document.querySelector(".interaction-layer");
const bubble = document.querySelector(".character-bubble");
const bubbleText = bubble.querySelector("p");
const sitUpCharacter = document.querySelector(".character-sit-up img");
const bedroomOutfitCharacter = document.querySelector(".bedroom-outfit-character");
const bedroomOutfitImage = bedroomOutfitCharacter.querySelector("img");
const phoneModal = document.querySelector(".phone-modal");
const phoneCloseButton = document.querySelector(".phone-modal-close");
const bedroomBgmButton = document.querySelector(".bedroom-bgm-toggle");
const bedroomBackButton = document.querySelector(".bedroom-back-button");
const sceneReturnMask = document.querySelector(".scene-return-mask");

const bedroomOutfitSources = {
  cuteez: {
    src: "assets/dressup/trim/character-cuteez.png",
    geometry: [2.7604, 28.3333, 30.1562, 66.5741],
  },
  plaid: {
    src: "assets/dressup/trim/character-striped.png",
    geometry: [2.7604, 28.3333, 30.1562, 66.5741],
  },
  henley: {
    src: "assets/dressup/trim/character-plaid.png",
    geometry: [2.9167, 29.0741, 30, 65.8333],
  },
};

const bedroomCopy = {
  en: {
    sleepAgain: "Let me sleep a little longer…",
    alreadyAwake: "I’m already awake… zzZ",
    curtainWake: "It’s so bright… okay, okay, I’m getting up…",
    specialDay: "Today is a special day.",
    awakeReally: "I’m awake… I’m awake, really…",
    lookingFor: "What are you looking for?",
    soccer: "I haven’t played soccer with my friends in ages.",
    suitcase: "Ah… I still haven’t unpacked since I got back, hehe.",
    humidifier: "It’s really good for my throat~~",
    computer: "Maybe I should play a round tonight…?",
    pillow: "Should we sleep a little longer…? There’s still a lot to do today.",
  },
  zh: {
    sleepAgain: "再睡一会儿……",
    alreadyAwake: "我已经醒了……zzZ",
    curtainWake: "好亮……好啦，我起床啦……",
    specialDay: "今天是个特别的日子呢。",
    awakeReally: "我醒了…我醒了……",
    lookingFor: "你在找什么呀？",
    soccer: "好久没和朋友们踢足球了呢。",
    suitcase: "啊……回来之后我还没整理，嘿嘿。",
    humidifier: "对嗓子很好呢~~",
    computer: "今天晚上要不开一把……？",
    pillow: "要继续睡一会儿吗…？\n今天还有很多事要做呢。",
  },
  ko: {
    sleepAgain: "조금만 더 잘래…",
    alreadyAwake: "나 이미 깼어… zzZ",
    curtainWake: "너무 밝아… 알겠어, 이제 일어날게…",
    specialDay: "오늘은 특별한 날이네.",
    awakeReally: "일어났어… 진짜 일어났다니까…",
    lookingFor: "뭘 찾고 있어?",
    soccer: "친구들이랑 축구 안 한 지 꽤 됐네.",
    suitcase: "아… 돌아온 뒤로 아직 정리도 못 했네, 헤헤.",
    humidifier: "목에 좋지~~",
    computer: "오늘 밤에 한 판 할까…?",
    pillow: "조금 더 잘까…? 오늘은 아직 할 일이 많아.",
  },
};

const sceneClasses = [
  "is-entering",
  "is-room-visible",
  "is-room-ready",
  "is-curtain-ready",
  "is-curtain-hint",
  "is-curtains-open",
  "is-light-on",
  "is-sleep-interactive",
  "is-wake-queued",
  "is-waking",
  "is-phone-visible",
  "is-awake",
  "is-wardrobe-open",
  "is-wardrobe-zooming",
  "is-wardrobe-transitioning",
  "has-dressed-character",
];

let bedroomLanguage = window.orbitMenu?.getLanguage?.() || "en";
let bedroomState = "inactive";
let sleepClickCount = 0;
let lastAwakeLine = "";
let currentBubbleKey = "";
let wardrobeWasOpened = false;
let bubbleHideTimer;
let sceneTimers = [];
let curtainHintStarted = false;
let returnMaskTimer;
let returnRevealTimer;

function schedule(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  sceneTimers.push(timer);
  return timer;
}

function clearSceneTimers() {
  sceneTimers.forEach((timer) => window.clearTimeout(timer));
  sceneTimers = [];
  window.clearTimeout(bubbleHideTimer);
}

function textFor(key) {
  const languageCopy = bedroomCopy[bedroomLanguage] || bedroomCopy.en;
  return languageCopy[key] || bedroomCopy.en[key] || key;
}

function hideBubble() {
  bubble.classList.remove("is-visible", "is-resetting");
  currentBubbleKey = "";
}

function showDialogue(key, duration = 4400) {
  window.clearTimeout(bubbleHideTimer);
  bubble.classList.remove("is-visible");
  bubble.classList.add("is-resetting");
  currentBubbleKey = key;
  const sleepingLines = ["sleepAgain", "alreadyAwake", "curtainWake"];
  bubble.dataset.anchor = sleepingLines.includes(key) ? "sleep" : "awake";
  bubbleText.textContent = textFor(key);
  void bubble.offsetWidth;
  bubble.classList.remove("is-resetting");
  bubble.classList.add("is-visible");
  bubbleHideTimer = window.setTimeout(hideBubble, duration);
}

function shakeLayer(className) {
  const layer = document.querySelector(`.${className}`);
  if (!layer) return;
  layer.classList.remove("is-shaking");
  void layer.offsetWidth;
  layer.classList.add("is-shaking");
  window.setTimeout(() => layer.classList.remove("is-shaking"), 700);
}

function openCurtains() {
  if (bedroomState !== "curtain") return;
  bedroomState = "openingCurtains";
  bedroomScene.classList.remove("is-curtain-ready", "is-curtain-hint");
  bedroomScene.classList.add("is-curtains-open");
  schedule(() => bedroomScene.classList.add("is-light-on"), 900);
  schedule(() => {
    bedroomScene.classList.add("is-sleep-interactive");
    bedroomState = "sleepClicks";
  }, 2600);
}

function beginWakeAnimation() {
  if (bedroomState !== "wakeQueued") return;
  bedroomState = "waking";
  bedroomScene.classList.remove("is-wake-queued", "is-sleep-interactive");
  bedroomScene.classList.add("is-waking");
  bubble.dataset.anchor = "awake";

  const cleanSource = sitUpCharacter.getAttribute("src").split("?")[0];
  sitUpCharacter.setAttribute("src", `${cleanSource}?play=${Date.now()}`);

  // Let the phone enter while the sit-up animation is still playing.
  schedule(() => {
    if (bedroomState === "waking") {
      bedroomScene.classList.add("is-phone-visible");
    }
  }, 900);

  // Open the awake interactions after the entrance beat while keeping the GIF looping.
  schedule(() => {
    bedroomScene.classList.add("is-awake");
    bedroomScene.classList.remove("is-waking");
    bedroomState = "awake";
  }, 5000);
}

function handleCharacterClick() {
  if (bedroomState === "sleepClicks") {
    sleepClickCount += 1;

    if (sleepClickCount === 1) {
      showDialogue("sleepAgain", 4300);
      return;
    }

    if (sleepClickCount === 2) {
      showDialogue("alreadyAwake", 4200);
      return;
    }

    if (sleepClickCount === 3) {
      bedroomState = "wakeQueued";
      bedroomScene.classList.add("is-wake-queued");
      showDialogue("curtainWake", 5000);
      schedule(beginWakeAnimation, 2400);
    }
    return;
  }

  if (bedroomState === "awake") {
    if (bedroomScene.classList.contains("has-dressed-character")) {
      showDialogue("specialDay");
      return;
    }
    const options = ["specialDay", "awakeReally", "lookingFor"].filter(
      (key) => key !== lastAwakeLine,
    );
    lastAwakeLine = options[Math.floor(Math.random() * options.length)];
    showDialogue(lastAwakeLine);
  }
}

function openPhone() {
  if (bedroomState !== "awake") return;
  phoneModal.classList.add("is-open");
  phoneModal.setAttribute("aria-hidden", "false");
  phoneCloseButton.focus();
}

function closePhone() {
  phoneModal.classList.remove("is-open");
  phoneModal.setAttribute("aria-hidden", "true");
}

function applyBedroomOutfit(outfit) {
  const config = bedroomOutfitSources[outfit];
  if (!config) return;
  const [x, y, width, height] = config.geometry;
  bedroomOutfitImage.src = config.src;
  bedroomOutfitCharacter.style.setProperty("--sprite-x", `${x}%`);
  bedroomOutfitCharacter.style.setProperty("--sprite-y", `${y}%`);
  bedroomOutfitCharacter.style.setProperty("--sprite-w", `${width}%`);
  bedroomOutfitCharacter.style.setProperty("--sprite-h", `${height}%`);
  bedroomOutfitCharacter.setAttribute("aria-hidden", "false");
  bedroomScene.classList.add("has-dressed-character");
}

function toggleWardrobeDoor() {
  if (bedroomState !== "awake") return;
  if (bedroomScene.classList.contains("is-wardrobe-open")) {
    bedroomScene.classList.remove("is-wardrobe-open");
    wardrobeWasOpened = false;
    return;
  }
  openWardrobe();
}

function openWardrobe() {
  if (bedroomState !== "awake") return;
  clearSceneTimers();
  bedroomState = "wardrobe";
  hideBubble();
  closePhone();
  bedroomScene.classList.add("is-wardrobe-transitioning");
  window.prepareDressupScene?.();

  if (!wardrobeWasOpened) {
    wardrobeWasOpened = true;
    bedroomScene.classList.add("is-wardrobe-open");

    // 先让衣柜门完整打开，再开始推进镜头。
    schedule(() => {
      bedroomScene.classList.add("is-wardrobe-zooming");
    }, 1050);

    schedule(async () => {
      const entered = await window.enterDressupScene?.();
      if (entered === false) return;
      schedule(() => {
        bedroomScene.setAttribute("aria-hidden", "true");
      }, 700);
    }, 2180);
    return;
  }

  // 衣柜已经打开时，不重复播放开门，只推进镜头。
  requestAnimationFrame(() => {
    bedroomScene.classList.add("is-wardrobe-zooming");
  });
  schedule(async () => {
    const entered = await window.enterDressupScene?.();
    if (entered === false) return;
    schedule(() => {
      bedroomScene.setAttribute("aria-hidden", "true");
    }, 700);
  }, 1080);
}

function returnToBedroom() {
  clearSceneTimers();
  window.exitDressupScene?.();
  bedroomScene.setAttribute("aria-hidden", "false");
  bedroomState = "returning";

  requestAnimationFrame(() => {
    bedroomScene.classList.remove("is-wardrobe-zooming");
  });

  // 等镜头完全退回后再恢复热点；衣柜门保持打开。
  schedule(() => {
    bedroomScene.classList.remove("is-wardrobe-transitioning");
    bedroomState = "awake";
  }, 1240);
}

function handleRoomAction(event) {
  const hotspot = event.target.closest(".room-hotspot");
  if (!hotspot) return;

  const action = hotspot.dataset.action;
  if (action === "curtain") openCurtains();
  if (action === "character") handleCharacterClick();
  if (action === "phone") openPhone();
  if (action === "wardrobe") toggleWardrobeDoor();

  if (action === "shake" || action === "dialogue" || action === "dialogue-only") {
    if (bedroomState !== "awake") return;
    if (action !== "dialogue-only") shakeLayer(hotspot.dataset.layer);
    if (action !== "shake") showDialogue(hotspot.dataset.copy);
  }
}

function enterBedroomScene() {
  resetBedroomScene();
  bedroomState = "entering";
  bedroomScene.setAttribute("aria-hidden", "false");
  bedroomScene.classList.add("is-entering");
  darkRoomVideo.currentTime = 0;
  darkRoomVideo.play().catch(() => {});

  schedule(() => bedroomScene.classList.add("is-room-visible"), 1600);
  schedule(() => {
    bedroomScene.classList.add("is-room-ready", "is-curtain-ready");
    bedroomState = "curtain";
  }, 2900);
  schedule(() => {
    if (bedroomState !== "curtain") return;
    bedroomScene.classList.add("is-curtain-hint");
    curtainHintStarted = true;
  }, 8000);
}

function updateBedroomBgm(enabled) {
  bedroomBgmButton.classList.toggle("is-muted", !enabled);
  bedroomBgmButton.setAttribute("aria-pressed", String(enabled));
}

function returnToPreviousScene() {
  if (sceneReturnMask.classList.contains("is-active")) return;
  closePhone();
  hideBubble();
  sceneReturnMask.classList.add("is-active");

  window.clearTimeout(returnMaskTimer);
  window.clearTimeout(returnRevealTimer);
  returnMaskTimer = window.setTimeout(() => {
    window.orbitMenu?.resetMenu?.();
    returnRevealTimer = window.setTimeout(() => {
      sceneReturnMask.classList.remove("is-active");
    }, 140);
  }, 760);
}

function resetBedroomScene() {
  clearSceneTimers();
  closePhone();
  hideBubble();
  sceneClasses.forEach((className) => bedroomScene.classList.remove(className));
  bedroomScene.setAttribute("aria-hidden", "true");
  darkRoomVideo.pause();
  darkRoomVideo.currentTime = 0;
  bedroomState = "inactive";
  wardrobeWasOpened = false;
  bedroomOutfitCharacter.setAttribute("aria-hidden", "true");
  sleepClickCount = 0;
  lastAwakeLine = "";
  sitUpCharacter.setAttribute("src", sitUpCharacter.getAttribute("src").split("?")[0]);
}

interactionLayer.addEventListener("click", handleRoomAction);
phoneCloseButton.addEventListener("click", closePhone);
bedroomBgmButton.addEventListener("click", () => window.orbitMenu?.toggleBgm?.());
bedroomBackButton.addEventListener("click", returnToPreviousScene);

phoneModal.addEventListener("click", (event) => {
  if (event.target === phoneModal) closePhone();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && phoneModal.classList.contains("is-open")) {
    closePhone();
  }
});

window.addEventListener("orbit-language-change", (event) => {
  bedroomLanguage = event.detail.language;
  if (currentBubbleKey) bubbleText.textContent = textFor(currentBubbleKey);
});

window.addEventListener("orbit-bgm-change", (event) => {
  updateBedroomBgm(event.detail.enabled);
});

updateBedroomBgm(window.orbitMenu?.getBgmEnabled?.() ?? true);

window.enterBedroomScene = enterBedroomScene;
window.resetBedroomScene = resetBedroomScene;
window.returnToBedroomFromDressup = returnToBedroom;
window.applyBedroomOutfit = applyBedroomOutfit;
