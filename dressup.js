const dressupScene = document.querySelector(".dressup-scene");
const dressupCharacter = document.querySelector(".dressup-character");
const dressupCharacterPop = document.querySelector(".dressup-character-pop");
const dressupSparkles = document.querySelector(".dressup-sparkles");
const dressupDialogue = document.querySelector(".dressup-dialogue");
const dressupDialogueText = dressupDialogue.querySelector("p");
const dressupBgmButton = document.querySelector(".dressup-bgm-toggle");
const dressupBackButton = document.querySelector(".dressup-back-button");
const dressupSuitcase = document.querySelector(".dressup-suitcase-hotspot");
const bearCostumeWrap = document.querySelector(".bear-costume-wrap");
const bearCostumeHit = document.querySelector(".bear-costume-hit");
const dressupConfirmButton = document.querySelector(".dressup-confirm-button");
const garmentSlots = [...document.querySelectorAll(".garment-slot")];
const dressupCharacterHotspot = document.querySelector(".dressup-character-hotspot");

// 使用两个角色图层交叉切换：新素材会先在不可见图层完成加载，
// 再与旧素材交叉淡入淡出，从根本上避免更换 src 时的白闪。
const dressupCharacterBuffer = dressupCharacter.cloneNode(false);
dressupCharacterBuffer.classList.add("dressup-character-buffer");
dressupCharacterBuffer.alt = "";
dressupCharacterBuffer.setAttribute("aria-hidden", "true");
dressupCharacterBuffer.style.display = "none";
dressupCharacterBuffer.style.opacity = "0";
dressupCharacter.after(dressupCharacterBuffer);
const dressupCharacterLayers = [dressupCharacter, dressupCharacterBuffer];

const dressupCharacterSources = {
  pajamaStill: "assets/dressup/trim/character-pajama-still.png",
  pajamaGif: "assets/dressup/trim/character-pajama.gif",
  cuteez: "assets/dressup/trim/character-cuteez.png",
  plaid: "assets/dressup/trim/character-striped.png",
  henley: "assets/dressup/trim/character-plaid.png",
  bear: "assets/dressup/trim/character-bear.png",
};

const dressupCharacterGeometry = {
  [dressupCharacterSources.pajamaStill]: [0.6771, 26.6667, 33.6458, 68.7037],
  [dressupCharacterSources.pajamaGif]: [0.6771, 26.6667, 33.6458, 68.7037],
  [dressupCharacterSources.cuteez]: [2.7604, 28.3333, 30.1562, 66.5741],
  [dressupCharacterSources.plaid]: [2.7604, 28.3333, 30.1562, 66.5741],
  [dressupCharacterSources.henley]: [2.9167, 29.0741, 30, 65.8333],
  [dressupCharacterSources.bear]: [2.6562, 27.037, 30.7812, 67.8704],
};

const dressupCopy = {
  en: {
    pajamaQuestion: "What should I wear today~?",
    confirm: "CONFIRM",
    plaid: "Oh, you like this one too?",
    cuteez: "This one’s a little embarrassing… ₍ᐢ⸝⸝･•･⸝⸝ᐢ₎",
    henley: "Nice and comfy~",
    bear: "It is cute but… let’s pick something else for today~",
  },
  zh: {
    pajamaQuestion: "今天要穿什么呢~？",
    confirm: "确定",
    plaid: "诶，你也喜欢这一件吗？",
    cuteez: "这个有点害羞呢 ₍ᐢ⸝⸝･•･⸝⸝ᐢ₎",
    henley: "很舒服的衣服~",
    bear: "虽然是很可爱啦，但是今天还是换一件吧~",
  },
  ko: {
    pajamaQuestion: "오늘은 뭘 입을까~?",
    confirm: "확인",
    plaid: "어? 너도 이거 좋아해?",
    cuteez: "이건 좀 부끄럽네… ₍ᐢ⸝⸝･•･⸝⸝ᐢ₎",
    henley: "진짜 편한 옷이야~",
    bear: "귀엽긴 한데… 오늘은 다른 걸 입자~",
  },
};

const outfitState = window.orbitGameState;

const slotMotion = garmentSlots.map((slot, index) => ({
  slot,
  index,
  x: 0,
  velocity: 0,
  target: 0,
  angle: 0,
  angleVelocity: 0,
}));

let dressupLanguage = window.orbitMenu?.getLanguage?.() || "en";
let currentOutfit = "pajama";
let selectedSlot = null;
let suitcaseClicks = 0;
let currentDialogueKey = "";
let dialogueTimer;
let dialogueShowTimer;
let pajamaWaitTimer;
let pajamaPlayTimer;
let sparkleTimer;
let exitTimer;
let activeDrag = null;
let motionFrame;
let activeCharacterLayerIndex = 0;
let characterSwapToken = 0;
let sceneEntryToken = 0;

const imageReadyCache = new Map();

function ensureImageReady(src) {
  if (!src) return Promise.resolve();
  if (imageReadyCache.has(src)) return imageReadyCache.get(src);

  const ready = new Promise((resolve) => {
    const image = new Image();
    const finish = () => resolve();
    image.onload = finish;
    image.onerror = finish;
    image.src = src;
    if (image.complete) finish();
  });

  imageReadyCache.set(src, ready);
  return ready;
}

function applyCharacterGeometry(layer, src) {
  const [x, y, width, height] =
    dressupCharacterGeometry[src] || dressupCharacterGeometry[dressupCharacterSources.pajamaStill];
  layer.style.setProperty("--character-x", `${x}%`);
  layer.style.setProperty("--character-y", `${y}%`);
  layer.style.setProperty("--character-w", `${width}%`);
  layer.style.setProperty("--character-h", `${height}%`);
}

function prepareDressupScene() {
  const sceneSources = [...dressupScene.querySelectorAll("img[src]")].map((image) =>
    image.getAttribute("src"),
  );
  const sources = [...new Set([...sceneSources, ...Object.values(dressupCharacterSources)])];
  return Promise.all(sources.map(ensureImageReady));
}

function cancelCharacterAnimations() {
  dressupCharacterLayers.forEach((layer) => {
    layer.getAnimations().forEach((animation) => animation.cancel());
  });
}

function resetCharacterLayers(src = dressupCharacterSources.pajamaStill) {
  characterSwapToken += 1;
  cancelCharacterAnimations();
  activeCharacterLayerIndex = 0;

  dressupCharacterLayers.forEach((layer, index) => {
    layer.src = src;
    applyCharacterGeometry(layer, src);
    layer.style.display = index === 0 ? "block" : "none";
    layer.style.opacity = index === 0 ? "1" : "0";
    layer.style.transform = "translate3d(0, 0, 0) scale(1) rotate(0deg)";
  });
}

async function crossfadeCharacterSource(
  src,
  { duration = 500, outgoingDuration = 210, restart = false, subtle = false } = {},
) {
  const token = ++characterSwapToken;
  await ensureImageReady(src);
  if (token !== characterSwapToken) return false;

  const outgoing = dressupCharacterLayers[activeCharacterLayerIndex];
  const nextIndex = activeCharacterLayerIndex === 0 ? 1 : 0;
  const incoming = dressupCharacterLayers[nextIndex];

  cancelCharacterAnimations();
  incoming.style.display = "block";
  if (restart) incoming.removeAttribute("src");
  incoming.src = src;
  applyCharacterGeometry(incoming, src);

  try {
    await incoming.decode();
  } catch (_) {
    // 个别浏览器不会为 GIF 返回 decode promise，预加载缓存仍可避免空白帧。
  }
  if (token !== characterSwapToken) return false;

  const incomingStart = subtle
    ? { opacity: 0, transform: "translate3d(0, 0, 0) scale(0.985) rotate(0deg)" }
    : { opacity: 0, transform: "translate3d(0, 1.2%, 0) scale(0.9) rotate(2deg)" };
  const outgoingEnd = subtle
    ? { opacity: 0, transform: "translate3d(0, 0, 0) scale(1.01) rotate(0deg)" }
    : { opacity: 0, transform: "translate3d(0, -0.6%, 0) scale(0.94) rotate(-1.5deg)" };
  const finalFrame = {
    opacity: 1,
    transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)",
  };

  // 先写入动画结束状态，快速连点取消动画时也不会闪回旧素材。
  outgoing.style.opacity = "0";
  outgoing.style.transform = outgoingEnd.transform;
  incoming.style.opacity = "1";
  incoming.style.transform = finalFrame.transform;

  const outgoingAnimation = outgoing.animate(
    [
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)" },
      outgoingEnd,
    ],
    { duration: outgoingDuration, easing: "ease-in", fill: "forwards" },
  );
  const incomingAnimation = incoming.animate([incomingStart, finalFrame], {
    duration,
    easing: "cubic-bezier(0.18, 0.9, 0.2, 1.18)",
    fill: "forwards",
  });

  activeCharacterLayerIndex = nextIndex;
  await Promise.allSettled([outgoingAnimation.finished, incomingAnimation.finished]);
  if (token !== characterSwapToken) return false;

  outgoing.style.display = "none";
  outgoingAnimation.cancel();
  incomingAnimation.cancel();
  return true;
}

function dressupText(key) {
  const languageCopy = dressupCopy[dressupLanguage] || dressupCopy.en;
  return languageCopy[key] || dressupCopy.en[key] || key;
}

function hideDressupDialogue() {
  window.clearTimeout(dialogueShowTimer);
  dressupDialogue.classList.remove("is-visible", "is-resetting");
  currentDialogueKey = "";
}

function showDressupDialogue(key, duration = 4600, delay = 620) {
  window.clearTimeout(dialogueShowTimer);
  window.clearTimeout(dialogueTimer);
  dressupDialogue.classList.remove("is-visible");
  currentDialogueKey = key;
  dialogueShowTimer = window.setTimeout(() => {
    dressupDialogue.classList.add("is-resetting");
    dressupDialogueText.textContent = dressupText(key);
    void dressupDialogue.offsetWidth;
    dressupDialogue.classList.remove("is-resetting");
    dressupDialogue.classList.add("is-visible");
    dialogueTimer = window.setTimeout(hideDressupDialogue, duration);
  }, delay);
}

function updateConfirmButton() {
  const normalOutfits = ["cuteez", "plaid", "henley"];
  const canConfirm =
    normalOutfits.includes(currentOutfit) &&
    outfitState.selectedOutfit === currentOutfit &&
    outfitState.previewOutfit !== "bear";
  dressupConfirmButton.disabled = !canConfirm;
}

function clearPajamaTimers() {
  window.clearTimeout(pajamaWaitTimer);
  window.clearTimeout(pajamaPlayTimer);
}

function schedulePajamaMotion() {
  clearPajamaTimers();
  if (currentOutfit !== "pajama" || !dressupScene.classList.contains("is-visible")) return;

  const wait = 4200 + Math.random() * 2300;
  pajamaWaitTimer = window.setTimeout(async () => {
    const entryToken = sceneEntryToken;
    if (currentOutfit !== "pajama" || !dressupScene.classList.contains("is-visible")) return;
    const changed = await crossfadeCharacterSource(dressupCharacterSources.pajamaGif, {
      duration: 160,
      outgoingDuration: 160,
      restart: true,
      subtle: true,
    });
    if (!changed || entryToken !== sceneEntryToken || currentOutfit !== "pajama") return;
    pajamaPlayTimer = window.setTimeout(async () => {
      if (entryToken !== sceneEntryToken || currentOutfit !== "pajama" ||
          !dressupScene.classList.contains("is-visible")) return;
      await crossfadeCharacterSource(dressupCharacterSources.pajamaStill, {
        duration: 180,
        outgoingDuration: 180,
        subtle: true,
      });
      if (entryToken === sceneEntryToken) schedulePajamaMotion();
    }, 2320);
  }, wait);
}

function playCharacterSwap(outfit) {
  if (currentOutfit === outfit) return;
  clearPajamaTimers();
  window.clearTimeout(sparkleTimer);
  currentOutfit = outfit;
  dressupCharacterHotspot.disabled = outfit !== "pajama";

  dressupSparkles.classList.remove("is-active");
  void dressupSparkles.offsetWidth;
  dressupSparkles.classList.add("is-active");
  crossfadeCharacterSource(dressupCharacterSources[outfit]);

  sparkleTimer = window.setTimeout(() => {
    dressupSparkles.classList.remove("is-active");
  }, 720);
}

function chooseNormalOutfit(outfit) {
  if (!dressupScene.classList.contains("is-visible")) return;
  const nextSlot = garmentSlots.find((slot) => slot.dataset.outfit === outfit);
  if (!nextSlot || nextSlot.classList.contains("is-selected")) return;

  garmentSlots.forEach((slot) => slot.classList.remove("is-hovered"));
  if (selectedSlot && selectedSlot !== nextSlot) selectedSlot.classList.remove("is-selected");
  selectedSlot = nextSlot;
  selectedSlot.classList.add("is-selected");
  bearCostumeWrap.classList.remove("is-previewing", "is-hovered");

  outfitState.selectedOutfit = outfit;
  outfitState.previewOutfit = null;
  playCharacterSwap(outfit);
  showDressupDialogue(outfit);
  updateConfirmButton();
}

function previewBearCostume() {
  if (!dressupScene.classList.contains("is-visible")) return;
  if (!bearCostumeWrap.classList.contains("is-unlocked")) return;
  if (selectedSlot) selectedSlot.classList.remove("is-selected");
  selectedSlot = null;
  bearCostumeWrap.classList.add("is-previewing");
  outfitState.previewOutfit = "bear";
  playCharacterSwap("bear");
  showDressupDialogue("bear", 5200);
  updateConfirmButton();
}

function revealBearCostume() {
  suitcaseClicks = 3;
  outfitState.bearUnlocked = true;
  bearCostumeWrap.classList.remove("is-hovered");
  bearCostumeWrap.classList.add("is-unlocked");
}

function confirmDressupSelection() {
  if (!dressupScene.classList.contains("is-visible")) return;
  if (dressupConfirmButton.disabled) return;
  const outfit = outfitState.selectedOutfit;
  if (!["cuteez", "plaid", "henley"].includes(outfit) || currentOutfit === "bear") return;
  outfitState.confirmedOutfit = outfit;
  outfitState.previewOutfit = null;
  window.applyBedroomOutfit?.(outfit);
  window.returnToBedroomFromDressup?.();
}

function handleSuitcaseClick() {
  if (!dressupScene.classList.contains("is-visible")) return;
  if (outfitState.bearUnlocked) return;
  suitcaseClicks += 1;
  dressupSuitcase.classList.remove("is-tapped");
  void dressupSuitcase.offsetWidth;
  dressupSuitcase.classList.add("is-tapped");
  window.setTimeout(() => dressupSuitcase.classList.remove("is-tapped"), 460);
  if (suitcaseClicks >= 3) revealBearCostume();
}

function setLinkedTargets(activeIndex, displacement) {
  slotMotion.forEach((state) => {
    const distance = Math.abs(state.index - activeIndex);
    const weight = distance === 0 ? 1 : distance === 1 ? 0.56 : 0.3;
    state.target = displacement * weight;
  });
}

function releaseGarments() {
  slotMotion.forEach((state) => {
    state.target = 0;
  });
}

function clearActiveGarmentDrag() {
  if (activeDrag) {
    const hit = activeDrag.state.slot.querySelector(".garment-hit");
    const pointerId = activeDrag.pointerId;
    activeDrag = null;
    if (hit.hasPointerCapture(pointerId)) hit.releasePointerCapture(pointerId);
  }
  releaseGarments();
}

function beginGarmentDrag(event, state) {
  if (!dressupScene.classList.contains("is-visible")) return;
  
  event.preventDefault();
  event.currentTarget.setPointerCapture(event.pointerId);
  activeDrag = {
    state,
    pointerId: event.pointerId,
    startX: event.clientX,
    lastX: event.clientX,
    lastTime: performance.now(),
    moved: false,
  };
}

function moveGarmentDrag(event) {
  if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
  const now = performance.now();
  const elapsed = Math.max(8, now - activeDrag.lastTime);
  const delta = event.clientX - activeDrag.startX;
  const maxTravel = document.querySelector(".stage").clientWidth * 0.052;
  const limited = Math.max(-maxTravel, Math.min(maxTravel, delta));

  if (Math.abs(delta) > 8) activeDrag.moved = true;
  setLinkedTargets(activeDrag.state.index, limited);

  const pointerVelocity = ((event.clientX - activeDrag.lastX) / elapsed) * 16.67;
  activeDrag.state.angleVelocity += Math.max(-2.2, Math.min(2.2, pointerVelocity * 0.32));
  activeDrag.lastX = event.clientX;
  activeDrag.lastTime = now;
}

function endGarmentDrag(event) {
  if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
  const { state, moved } = activeDrag;
  activeDrag = null;
  releaseGarments();
  if (!moved) chooseNormalOutfit(state.slot.dataset.outfit);
}

function cancelGarmentDrag(event) {
  if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
  activeDrag = null;
  releaseGarments();
}

function updateGarmentMotion() {
  slotMotion.forEach((state) => {
    const force = (state.target - state.x) * 0.13;
    state.velocity = (state.velocity + force) * 0.74;
    state.x += state.velocity;

    const targetAngle = Math.max(-4.2, Math.min(4.2, -state.velocity * 0.48));
    state.angleVelocity += (targetAngle - state.angle) * 0.15;
    state.angleVelocity *= 0.7;
    state.angle += state.angleVelocity;

    if (Math.abs(state.target - state.x) < 0.02 && Math.abs(state.velocity) < 0.02) {
      state.x = state.target;
      state.velocity = 0;
    }
    if (Math.abs(state.angle) < 0.02 && Math.abs(state.angleVelocity) < 0.02) {
      state.angle = 0;
      state.angleVelocity = 0;
    }

    state.slot.style.transform = `translate3d(${state.x.toFixed(2)}px, 0, 0) rotate(${state.angle.toFixed(2)}deg)`;
  });
  motionFrame = window.requestAnimationFrame(updateGarmentMotion);
}

function resetGarmentMotion() {
  slotMotion.forEach((state) => {
    state.x = 0;
    state.velocity = 0;
    state.target = 0;
    state.angle = 0;
    state.angleVelocity = 0;
    state.slot.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
  });
}

function updateDressupBgm(enabled) {
  dressupBgmButton.classList.toggle("is-muted", !enabled);
  dressupBgmButton.setAttribute("aria-pressed", String(enabled));
}

function resetDressupState({ clearProgress = false } = {}) {
  clearActiveGarmentDrag();
  window.clearTimeout(dialogueTimer);
  window.clearTimeout(dialogueShowTimer);
  window.clearTimeout(sparkleTimer);
  clearPajamaTimers();
  hideDressupDialogue();
  garmentSlots.forEach((slot) => slot.classList.remove("is-selected", "is-hovered"));
  bearCostumeWrap.classList.remove("is-unlocked", "is-previewing", "is-hovered");
  dressupCharacterPop.classList.remove("is-leaving", "is-arriving");
  dressupSparkles.classList.remove("is-active");
  if (clearProgress) {
    outfitState.selectedOutfit = null;
    outfitState.confirmedOutfit = null;
    outfitState.bearUnlocked = false;
  }

  outfitState.previewOutfit = null;
  selectedSlot = outfitState.selectedOutfit
    ? garmentSlots.find((slot) => slot.dataset.outfit === outfitState.selectedOutfit) || null
    : null;
  selectedSlot?.classList.add("is-selected");
  suitcaseClicks = 0;
  currentOutfit = outfitState.selectedOutfit || "pajama";
  dressupCharacterHotspot.disabled = currentOutfit !== "pajama";
  if (outfitState.bearUnlocked) {
    suitcaseClicks = 3;
    bearCostumeWrap.classList.add("is-unlocked");
  }
  resetCharacterLayers(dressupCharacterSources[currentOutfit] || dressupCharacterSources.pajamaStill);
  resetGarmentMotion();
  updateConfirmButton();
}

async function enterDressupScene() {
  const token = ++sceneEntryToken;
  window.clearTimeout(exitTimer);
  await prepareDressupScene();
  if (token !== sceneEntryToken) return false;
  resetDressupState();
  outfitState.currentScene = "dressup";
  dressupScene.setAttribute("aria-hidden", "false");
  document.querySelector(".stage").classList.add("is-dressup");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (token !== sceneEntryToken) return;
    dressupScene.classList.add("is-visible");
    window.setTimeout(schedulePajamaMotion, 650);
  }));
  return true;
}

function exitDressupScene() {
  sceneEntryToken += 1;
  characterSwapToken += 1;
  cancelCharacterAnimations();
  clearActiveGarmentDrag();
  window.clearTimeout(dialogueTimer);
  window.clearTimeout(sparkleTimer);
  clearPajamaTimers();
  hideDressupDialogue();
  dressupScene.classList.remove("is-visible");
  document.querySelector(".stage").classList.remove("is-dressup");
  window.clearTimeout(exitTimer);
  exitTimer = window.setTimeout(() => {
    dressupScene.setAttribute("aria-hidden", "true");
  }, 640);
}

function resetDressupScene() {
  exitDressupScene();
  resetDressupState({ clearProgress: true });
}

slotMotion.forEach((state) => {
  const hit = state.slot.querySelector(".garment-hit");
  hit.addEventListener("pointerdown", (event) => beginGarmentDrag(event, state));
  hit.addEventListener("pointermove", moveGarmentDrag);
  hit.addEventListener("pointerup", endGarmentDrag);
  hit.addEventListener("pointercancel", cancelGarmentDrag);
  hit.addEventListener("pointerenter", () => {
    if (!state.slot.classList.contains("is-selected")) state.slot.classList.add("is-hovered");
  });
  hit.addEventListener("pointerleave", () => state.slot.classList.remove("is-hovered"));
  hit.addEventListener("click", (event) => {
    if (event.detail === 0 && !state.slot.classList.contains("is-selected")) {
      chooseNormalOutfit(state.slot.dataset.outfit);
    }
  });
});

dressupSuitcase.addEventListener("click", handleSuitcaseClick);
dressupCharacterHotspot.addEventListener("click", () => {
  if (dressupScene.classList.contains("is-visible") && currentOutfit === "pajama") {
    showDressupDialogue("pajamaQuestion", 4600, 0);
  }
});
bearCostumeHit.addEventListener("click", previewBearCostume);
bearCostumeHit.addEventListener("pointerenter", () => {
  if (!bearCostumeWrap.classList.contains("is-previewing")) {
    bearCostumeWrap.classList.add("is-hovered");
  }
});
bearCostumeHit.addEventListener("pointerleave", () => bearCostumeWrap.classList.remove("is-hovered"));
dressupConfirmButton.addEventListener("click", confirmDressupSelection);
dressupBgmButton.addEventListener("click", () => window.orbitMenu?.toggleBgm?.());
dressupBackButton.addEventListener("click", () => window.returnToBedroomFromDressup?.());

window.addEventListener("orbit-language-change", (event) => {
  dressupLanguage = event.detail.language;
  dressupConfirmButton.textContent = dressupText("confirm");
  if (currentDialogueKey) dressupDialogueText.textContent = dressupText(currentDialogueKey);
});

window.addEventListener("orbit-bgm-change", (event) => {
  updateDressupBgm(event.detail.enabled);
});

updateDressupBgm(window.orbitMenu?.getBgmEnabled?.() ?? true);
dressupConfirmButton.textContent = dressupText("confirm");
prepareDressupScene();
motionFrame = window.requestAnimationFrame(updateGarmentMotion);

window.prepareDressupScene = prepareDressupScene;
window.enterDressupScene = enterDressupScene;
window.exitDressupScene = exitDressupScene;
window.resetDressupScene = resetDressupScene;


// v2.6 state synchronization helpers
window.getDressupConfirmedOutfit = () => outfitState.confirmedOutfit;
