(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const bridge = window.parent !== window ? window.parent.orbitBeach : null;
  const settings = bridge?.getSettings() || {};

  const stage = $("#stage");
  const scene = $("#beachScene");
  const transition = $("#transition");
  const birdLayer = $("#birdLayer");
  const introCharacter = $("#introCharacter");
  const introCharacterArt = $("#introCharacterArt");
  const photoCharacter = $("#photoCharacter");
  const dialogue = $("#characterDialogue");
  const mainAction = $("#mainAction");
  const cameraUi = $("#cameraUi");
  const cameraHint = $("#cameraHint");
  const reviewPanel = $("#reviewPanel");
  const reviewPhoto = $("#reviewPhoto");
  const reviewFrame = $("#reviewFrame");
  const retakeButton = $("#retakeButton");
  const finishButton = $("#finishButton");
  const finalPanel = $("#finalPanel");
  const finalPhoto = $("#finalPhoto");
  const finalFrame = $("#finalFrame");
  const putAwayButton = $("#putAwayButton");
  const anotherPhotoButton = $("#anotherPhotoButton");
  const saveButton = $("#saveButton");
  const soundButton = $("#soundButton");
  const backButton = $("#backButton");
  const oceanAudio = $("#oceanAudio");
  const ejectAudio = $("#ejectAudio");
  const chimeAudio = $("#chimeAudio");
  const captureCanvas = $("#captureCanvas");
  const saveCanvas = $("#saveCanvas");

  const copy = {
    zh: {
      language: "中文", place: "海边", enter: "点击进入", takePhotos: "来拍照吧",
      desktopHint: "移动鼠标控制相机，单击拍摄", touchHint: "拖动相框寻找角度，松开拍摄",
      chooseFrame: "选择拍立得边框", retake: "重新拍摄", finish: "完成", putAway: "收起来", anotherPhoto: "再拍一张",
      sillyLine: "我是不是拍得有点奇怪……要不要再拍一张？", photoOk: "OK！", nicePhoto: "拍得不错呢！", sitThere: "去那边坐坐吧~", go: "走吧",
      save: "保存到本地", soundOn: "关闭海浪声", soundOff: "开启海浪声", back: "返回上一界面",
    },
    ko: {
      language: "한국어", place: "바닷가", enter: "눌러서 들어가기", takePhotos: "사진 찍자",
      desktopHint: "마우스로 카메라를 움직이고 클릭해서 촬영하세요", touchHint: "프레임을 끌어 움직이고 손을 떼면 촬영돼요",
      chooseFrame: "폴라로이드 프레임 고르기", retake: "다시 찍기", finish: "완료", putAway: "간직하기", anotherPhoto: "한 장 더 찍기",
      sillyLine: "나 좀 이상하게 나온 것 같은데…… 다시 찍을까?", photoOk: "OK!", nicePhoto: "잘 찍었네!", sitThere: "저쪽에 가서 좀 앉아 있자~", go: "가자",
      save: "기기에 저장", soundOn: "파도 소리 끄기", soundOff: "파도 소리 켜기", back: "이전 화면으로",
    },
    en: {
      language: "ENGLISH", place: "THE BEACH", enter: "CLICK TO ENTER", takePhotos: "LET'S TAKE PHOTOS",
      desktopHint: "MOVE THE CAMERA WITH YOUR MOUSE · CLICK TO SHOOT", touchHint: "DRAG THE FRAME · RELEASE TO SHOOT",
      chooseFrame: "CHOOSE A POLAROID FRAME", retake: "RETAKE", finish: "DONE", putAway: "KEEP IT", anotherPhoto: "TAKE ANOTHER",
      sillyLine: "I look a little strange in this one… want to take another?", photoOk: "OK!", nicePhoto: "That came out nicely!", sitThere: "Let's go sit over there~", go: "LET'S GO",
      save: "SAVE TO DEVICE", soundOn: "MUTE OCEAN", soundOff: "PLAY OCEAN", back: "GO BACK",
    },
  };

  const outfitAliases = {
    cuteez: "cuteez", plaid: "plaid", striped: "striped", henley: "striped",
    check: "plaid", grid: "plaid", 格子: "plaid", 亨利: "striped",
  };
  const queryOutfit = new URLSearchParams(location.search).get("outfit");

  function readLocalValue(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  function resolveOutfit() {
    const integratedOutfit = ({ cuteez: "cuteez", plaid: "striped", henley: "plaid" })[String(settings.outfit || "").toLowerCase()];
    if (integratedOutfit) return integratedOutfit;
    const candidates = [
      queryOutfit,
      readLocalValue("orbit:selectedOutfit"),
      readLocalValue("orbit:outfit"),
      readLocalValue("selectedOutfit"),
    ];
    for (const value of candidates) {
      const normalized = String(value || "").toLowerCase().trim();
      if (outfitAliases[normalized]) return outfitAliases[normalized];
      if (normalized.includes("cuteez")) return "cuteez";
      if (normalized.includes("plaid") || normalized.includes("check")) return "plaid";
      if (normalized.includes("striped") || normalized.includes("henley")) return "striped";
    }
    return "plaid";
  }

  function resolveLanguage() {
    const candidates = [
      settings.language,
      new URLSearchParams(location.search).get("lang"),
      readLocalValue("orbit:language"),
      readLocalValue("orbit:lang"),
      readLocalValue("language"),
    ];
    for (const value of candidates) {
      const normalized = String(value || "").toLowerCase().trim();
      if (["zh", "zh-cn", "cn", "中文"].includes(normalized)) return "zh";
      if (["ko", "kr", "한국어"].includes(normalized)) return "ko";
      if (["en", "english"].includes(normalized)) return "en";
    }
    return "zh";
  }

  const state = {
    language: resolveLanguage(),
    phase: "transition",
    outfit: resolveOutfit(),
    pose: "01",
    shotCount: 0,
    selectedFrame: 1,
    firstPhotoResult: null,
    lastShotData: "",
    lastShotSnapshot: null,
    lastShotPose: "01",
    randomSillyStreak: 0,
    sillyCooldown: 0,
    guaranteedSillyUsed: false,
    sillyLocked: false,
    moveTimer: 0,
    poseTimer: 0,
    dialogueTimer: 0,
    birdTimer: 0,
    lensX: 960,
    lensY: 540,
    draggingLens: false,
    dragMoved: false,
    soundOn: typeof settings.sound === "boolean" ? settings.sound : true,
    audioContext: null,
    oceanTargetVolume: 0,
  };

  const exportImages = {};
  Object.entries(window.ORBIT_INLINE_ASSETS || {}).forEach(([key, source]) => {
    const image = new Image();
    image.src = source;
    exportImages[key] = image;
  });

  const poseSrc = (pose) => `./assets/beach-${state.outfit}-${pose}.png`;
  const standingSrc = () => `./assets/character-${state.outfit}.png`;
  const frameSrc = (frame) => `./assets/polaroid-frame-0${frame}.png`;
  const t = (key) => copy[state.language][key] || copy.zh[key] || key;

  async function ensureExportImage(key) {
    const image = exportImages[key];
    if (!image) return null;
    if (!image.complete || !image.naturalWidth) {
      try { await image.decode(); } catch (_) { return null; }
    }
    return image;
  }

  function applyLanguage() {
    $$('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
    cameraHint.textContent = matchMedia("(pointer: coarse)").matches ? t("touchHint") : t("desktopHint");
    soundButton.setAttribute("aria-label", t(state.soundOn ? "soundOn" : "soundOff"));
    backButton.setAttribute("aria-label", t("back"));
    saveButton.setAttribute("aria-label", t("save"));
    saveButton.title = t("save");
  }

  function resizeStage() {
    const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.setProperty("--stage-scale", String(scale));
  }

  function stagePoint(event) {
    const rect = stage.getBoundingClientRect();
    const scale = rect.width / 1920;
    return {
      x: (event.clientX - rect.left) / scale,
      y: (event.clientY - rect.top) / scale,
    };
  }

  function showDialogue(key, duration = 3600) {
    clearTimeout(state.dialogueTimer);
    dialogue.textContent = t(key);
    dialogue.classList.add("is-visible");
    state.dialogueTimer = window.setTimeout(() => dialogue.classList.remove("is-visible"), duration);
  }

  function setMainAction(visible, handler, labelKey = null) {
    if (labelKey) {
      mainAction.dataset.i18n = labelKey;
      mainAction.textContent = t(labelKey);
    }
    mainAction.classList.toggle("is-hidden", !visible);
    mainAction.onclick = visible ? handler : null;
  }

  function scheduleBirdFlock(delay = 7000 + Math.random() * 6500) {
    clearTimeout(state.birdTimer);
    state.birdTimer = window.setTimeout(spawnBirdFlock, delay);
  }

  function spawnBirdFlock() {
    if (state.phase === "complete") return;
    const flock = document.createElement("div");
    const duration = 9 + Math.random() * 4;
    flock.className = "bird-flock";
    flock.style.setProperty("--bird-y", `${105 + Math.random() * 250}px`);
    flock.style.setProperty("--bird-drift", `${-35 - Math.random() * 95}px`);
    flock.style.setProperty("--bird-duration", `${duration}s`);
    const count = 2 + Math.floor(Math.random() * 3);
    for (let index = 0; index < count; index += 1) {
      const bird = document.createElement("span");
      bird.className = "bird";
      bird.style.setProperty("--bird-x", `${index * 42 + Math.random() * 18}px`);
      bird.style.setProperty("--bird-offset", `${index % 2 ? 22 : 0}px`);
      bird.style.setProperty("--bird-scale", String(.72 + Math.random() * .48));
      flock.appendChild(bird);
    }
    birdLayer.appendChild(flock);
    window.setTimeout(() => flock.remove(), duration * 1000 + 500);
    scheduleBirdFlock(14500 + Math.random() * 15000);
  }

  function createAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!state.audioContext) state.audioContext = new AudioContextClass();
    return state.audioContext;
  }

  function playWindChime() {
    if (!state.soundOn) return;
    chimeAudio.currentTime = 0;
    chimeAudio.volume = .78;
    chimeAudio.play().catch(() => {});
  }

  function playShutter() {
    const context = createAudioContext();
    if (!context) return;
    context.resume().catch(() => {});
    const length = Math.floor(context.sampleRate * .16);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length * .13));
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    filter.type = "bandpass";
    filter.frequency.value = 1250;
    filter.Q.value = .8;
    gain.gain.value = .34;
    source.buffer = buffer;
    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
  }

  function fadeOceanTo(volume, duration = 1600) {
    state.oceanTargetVolume = Math.max(0, Math.min(1, volume));
    const start = oceanAudio.volume;
    const started = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - started) / duration);
      oceanAudio.volume = start + (state.oceanTargetVolume - start) * progress;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function tryPlayOcean() {
    if (!state.soundOn) return;
    oceanAudio.muted = false;
    oceanAudio.loop = true;
    oceanAudio.play().catch(() => {});
  }

  function unlockAudio() {
    state.audioContext?.resume().catch(() => {});
    tryPlayOcean();
    document.removeEventListener("pointerdown", unlockAudio, true);
    document.removeEventListener("keydown", unlockAudio, true);
  }

  function scheduleVisualTransition() {
    window.setTimeout(() => {
      bridge?.onSceneReady?.();
      scene.classList.add("is-visible");
      transition.classList.add("is-leaving");
      scheduleBirdFlock();
    }, 3000);
    window.setTimeout(() => {
      transition.classList.remove("is-active");
      window.setTimeout(beginCharacterIntro, 950);
    }, 4700);
  }

  function startTransition() {
    if (state.phase !== "transition") return;
    state.phase = "entering";
    scheduleVisualTransition();

    // Audio is deliberately isolated from the visual timers: even if a
    // browser rejects audio initialization, the black transition still exits.
    try {
      if (!bridge) playWindChime();
      oceanAudio.loop = true;
      oceanAudio.muted = false;
      oceanAudio.volume = 0;
      oceanAudio.currentTime = 0;
      tryPlayOcean();
    } catch (_) {
      // The picture transition must never be blocked by optional audio.
    }

    window.setTimeout(() => {
      if (!state.soundOn) return;
      tryPlayOcean();
      fadeOceanTo(1, 1300);
    }, 1600);
  }

  function beginCharacterIntro() {
    state.phase = "intro";
    introCharacterArt.src = standingSrc();
    introCharacter.className = "intro-character is-peeking";
    window.setTimeout(() => {
      introCharacter.classList.remove("is-peeking");
      introCharacter.classList.add("is-standing", "is-settling");
    }, 1350);
    window.setTimeout(() => {
      introCharacter.classList.remove("is-settling");
      introCharacter.classList.add("is-idle");
      setMainAction(true, preparePhotoMode, "takePhotos");
    }, 3550);
  }

  function preparePhotoMode() {
    if (state.phase !== "intro") return;
    state.phase = "photo-prelude";
    setMainAction(false, null);
    showDialogue("photoOk", 1550);
    window.setTimeout(() => { introCharacter.className = "intro-character is-hidden"; }, 1450);
    window.setTimeout(beginPhotoMode, 2050);
  }

  function clearPhotoTimers() {
    clearTimeout(state.moveTimer);
    clearTimeout(state.poseTimer);
  }

  function scheduleMovement(initial = false) {
    if (state.phase !== "camera") return;
    const x = 320 + Math.random() * 1280;
    const y = 260 + Math.random() * 470;
    const duration = initial ? 4500 : 5200 + Math.random() * 2600;
    photoCharacter.style.transitionDuration = `${duration}ms`;
    photoCharacter.style.left = `${x}px`;
    photoCharacter.style.top = `${y}px`;
    state.moveTimer = window.setTimeout(() => scheduleMovement(false), duration + 120);
  }

  function chooseNextPose() {
    if (state.sillyLocked) return "silly";
    if (state.shotCount >= 5 && !state.guaranteedSillyUsed) {
      state.guaranteedSillyUsed = true;
      state.sillyLocked = true;
      return "silly";
    }

    if (state.sillyCooldown > 0) state.sillyCooldown -= 1;
    const canRandomSilly = state.sillyCooldown === 0;
    const randomSilly = canRandomSilly && Math.random() < .1;
    if (randomSilly) {
      state.randomSillyStreak += 1;
      if (state.randomSillyStreak >= 2) {
        state.sillyCooldown = 4;
        state.randomSillyStreak = 0;
      }
      return "silly";
    }
    state.randomSillyStreak = 0;
    return ["01", "02", "03"][Math.floor(Math.random() * 3)];
  }

  function switchPose() {
    if (state.phase !== "camera") return;
    const pose = chooseNextPose();
    state.pose = pose;
    photoCharacter.src = poseSrc(pose);
    photoCharacter.classList.remove("is-pose-changing");
    void photoCharacter.offsetWidth;
    photoCharacter.classList.add("is-pose-changing");
    if (state.sillyLocked) return;
    state.poseTimer = window.setTimeout(switchPose, 3300 + Math.random() * 1900);
  }

  function beginPhotoMode() {
    state.phase = "camera";
    clearPhotoTimers();
    setMainAction(false, null);
    reviewPanel.classList.remove("is-active");
    reviewPanel.setAttribute("aria-hidden", "true");
    scene.classList.remove("is-reviewing");
    finalPanel.classList.remove("is-active", "is-put-away");
    finalPanel.setAttribute("aria-hidden", "true");
    dialogue.classList.remove("is-visible");
    introCharacter.className = "intro-character is-hidden";
    state.pose = "01";
    photoCharacter.src = poseSrc("01");
    photoCharacter.className = "photo-character";
    photoCharacter.style.transitionDuration = "0ms";
    photoCharacter.style.left = "960px";
    photoCharacter.style.top = "520px";
    void photoCharacter.offsetWidth;
    photoCharacter.classList.add("is-active");
    cameraUi.classList.add("is-active");
    cameraUi.setAttribute("aria-hidden", "false");
    updateLens(960, 540);
    state.moveTimer = window.setTimeout(() => scheduleMovement(true), 900);
    state.poseTimer = window.setTimeout(switchPose, state.shotCount >= 5 && !state.guaranteedSillyUsed ? 1500 : 3500);
  }

  function updateLens(x, y) {
    state.lensX = Math.max(260, Math.min(1660, x));
    state.lensY = Math.max(300, Math.min(780, y));
    cameraUi.style.setProperty("--lens-x", `${state.lensX}px`);
    cameraUi.style.setProperty("--lens-y", `${state.lensY}px`);
  }

  function getShotSnapshot() {
    const lensWidth = 470;
    const lensHeight = 550;
    const characterWidth = Number.parseFloat(getComputedStyle(photoCharacter).width) || 390;
    const naturalWidth = photoCharacter.naturalWidth || 731;
    const naturalHeight = photoCharacter.naturalHeight || 767;
    const characterHeight = characterWidth * naturalHeight / naturalWidth;
    return {
      cropLeft: state.lensX - lensWidth / 2,
      cropTop: state.lensY - lensHeight / 2,
      lensWidth,
      lensHeight,
      characterLeft: Number.parseFloat(photoCharacter.style.left) - characterWidth / 2,
      characterTop: Number.parseFloat(photoCharacter.style.top) - characterHeight / 2,
      characterWidth,
      characterHeight,
      pose: state.pose,
      outfit: state.outfit,
    };
  }

  function renderSnapshot(container, snapshot = state.lastShotSnapshot) {
    if (!container || !snapshot) return;
    const backgroundImage = container.querySelector(".snapshot-background");
    const characterImage = container.querySelector(".snapshot-character");
    backgroundImage.src = "./assets/beach-background.jpg";
    backgroundImage.style.width = `${1920 / snapshot.lensWidth * 100}%`;
    backgroundImage.style.height = `${1080 / snapshot.lensHeight * 100}%`;
    backgroundImage.style.left = `${-snapshot.cropLeft / snapshot.lensWidth * 100}%`;
    backgroundImage.style.top = `${-snapshot.cropTop / snapshot.lensHeight * 100}%`;
    characterImage.src = `./assets/beach-${snapshot.outfit}-${snapshot.pose}.png`;
    characterImage.style.left = `${(snapshot.characterLeft - snapshot.cropLeft) / snapshot.lensWidth * 100}%`;
    characterImage.style.top = `${(snapshot.characterTop - snapshot.cropTop) / snapshot.lensHeight * 100}%`;
    characterImage.style.width = `${snapshot.characterWidth / snapshot.lensWidth * 100}%`;
    characterImage.style.height = `${snapshot.characterHeight / snapshot.lensHeight * 100}%`;
  }

  function drawShotToCanvas(snapshot = state.lastShotSnapshot) {
    if (!snapshot) return "";
    const context = captureCanvas.getContext("2d");
    const scaleX = captureCanvas.width / snapshot.lensWidth;
    const scaleY = captureCanvas.height / snapshot.lensHeight;
    const inlineBackground = exportImages["beach-background.jpg"];
    const inlineCharacter = exportImages[`beach-${snapshot.outfit}-${snapshot.pose}.png`];
    const background = inlineBackground?.complete && inlineBackground.naturalWidth ? inlineBackground : $("#beachBackground");
    const character = inlineCharacter?.complete && inlineCharacter.naturalWidth ? inlineCharacter : photoCharacter;

    try {
      context.clearRect(0, 0, captureCanvas.width, captureCanvas.height);
      context.filter = "saturate(1.14) contrast(1.025) brightness(1.015)";
      context.drawImage(
        background,
        snapshot.cropLeft / 1920 * background.naturalWidth,
        snapshot.cropTop / 1080 * background.naturalHeight,
        snapshot.lensWidth / 1920 * background.naturalWidth,
        snapshot.lensHeight / 1080 * background.naturalHeight,
        0, 0, captureCanvas.width, captureCanvas.height,
      );
      context.drawImage(
        character,
        (snapshot.characterLeft - snapshot.cropLeft) * scaleX,
        (snapshot.characterTop - snapshot.cropTop) * scaleY,
        snapshot.characterWidth * scaleX,
        snapshot.characterHeight * scaleY,
      );
      context.filter = "none";
      return captureCanvas.toDataURL("image/jpeg", .9);
    } catch (_) {
      context.filter = "none";
      // file:// previews can taint canvas. The CSS snapshot below still keeps
      // the review flow usable, while hosted builds retain full export.
      return "";
    }
  }

  function takePhoto() {
    if (state.phase !== "camera") return;
    state.phase = "capturing";
    clearPhotoTimers();
    state.shotCount += 1;
    state.lastShotPose = state.pose;
    state.sillyLocked = false;
    playShutter();
    cameraUi.classList.add("is-flashing");
    state.lastShotSnapshot = getShotSnapshot();
    const dataUrl = drawShotToCanvas(state.lastShotSnapshot);
    state.lastShotData = dataUrl;
    window.setTimeout(() => {
      cameraUi.classList.remove("is-flashing", "is-active");
      cameraUi.setAttribute("aria-hidden", "true");
      photoCharacter.classList.remove("is-active", "is-pose-changing");
      introCharacterArt.src = standingSrc();
      introCharacter.className = "intro-character is-standing is-idle";
      renderSnapshot(reviewPhoto);
      reviewFrame.src = frameSrc(state.selectedFrame);
      reviewPanel.classList.add("is-active");
      reviewPanel.setAttribute("aria-hidden", "false");
      scene.classList.add("is-reviewing");
      state.phase = "review";
      if (state.lastShotPose === "silly") showDialogue("sillyLine", 5600);
    }, 180);
  }

  function selectFrame(frame) {
    state.selectedFrame = Number(frame);
    $$(".frame-option").forEach((button) => button.classList.toggle("is-selected", Number(button.dataset.frame) === state.selectedFrame));
    reviewFrame.src = frameSrc(state.selectedFrame);
    finalFrame.src = frameSrc(state.selectedFrame);
  }

  function finishPhoto() {
    if (state.phase !== "review") return;
    state.phase = "final";
    reviewPanel.classList.remove("is-active");
    reviewPanel.setAttribute("aria-hidden", "true");
    scene.classList.remove("is-reviewing");
    introCharacter.className = "intro-character is-hidden";
    renderSnapshot(finalPhoto);
    finalFrame.src = frameSrc(state.selectedFrame);
    ejectAudio.currentTime = 0;
    ejectAudio.volume = state.soundOn ? .72 : 0;
    ejectAudio.play().catch(() => {});
    finalPanel.classList.add("is-active");
    finalPanel.setAttribute("aria-hidden", "false");
    persistResult();
  }

  function persistResult() {
    const result = {
      outfit: state.outfit,
      photo: state.lastShotData,
      frame: state.selectedFrame,
      pose: state.lastShotPose,
      shotCount: state.shotCount,
      snapshot: state.lastShotSnapshot,
    };
    state.firstPhotoResult ||= result;
    window.ORBIT_BEACH_RESULT = state.firstPhotoResult;
    window.ORBIT_BEACH_LATEST_RESULT = result;
    bridge?.updateResult(state.firstPhotoResult);
    try { localStorage.setItem("orbit:beachPhoto", JSON.stringify(state.firstPhotoResult)); } catch (_) { /* local quota may be unavailable */ }
    window.dispatchEvent(new CustomEvent("orbit:beach-photo", { detail: { current: result, first: state.firstPhotoResult } }));
  }

  function takeAnotherPhoto() {
    if (state.phase !== "final") return;
    state.phase = "photo-prelude";
    finalPanel.classList.remove("is-active", "is-put-away");
    finalPanel.setAttribute("aria-hidden", "true");
    window.setTimeout(beginPhotoMode, 650);
  }

  function putAway() {
    if (state.phase !== "final") return;
    state.phase = "ending";
    finalPanel.classList.add("is-put-away");
    introCharacterArt.src = standingSrc();
    introCharacter.className = "intro-character is-standing is-idle";
    window.setTimeout(() => {
      finalPanel.classList.remove("is-active");
      finalPanel.setAttribute("aria-hidden", "true");
      showDialogue("nicePhoto", 2800);
    }, 850);
    window.setTimeout(() => showDialogue("sitThere", 4200), 3900);
    window.setTimeout(() => setMainAction(true, goNextScene, "go"), 8200);
  }

  function goNextScene() {
    if (state.phase !== "ending") return;
    state.phase = "complete";
    clearTimeout(state.birdTimer);
    setMainAction(false, null);
    fadeOceanTo(0, 800);
    document.body.classList.add("is-next-scene");
    window.setTimeout(() => {
      oceanAudio.pause();
      const detail = state.firstPhotoResult || { outfit: state.outfit, photo: state.lastShotData, frame: state.selectedFrame, snapshot: state.lastShotSnapshot };
      window.ORBIT_BEACH_COMPLETE = detail;
      window.dispatchEvent(new CustomEvent("orbit:beach-complete", { detail }));
      if (typeof window.ORBIT_GO_TO_NEXT_SCENE === "function") window.ORBIT_GO_TO_NEXT_SCENE(detail);
    }, 1150);
  }

  function resumeFromFinale() {
    document.documentElement.classList.remove("is-scene-paused");
    document.body.classList.remove("is-next-scene", "is-returning");
    state.phase = "ending";
    finalPanel.classList.remove("is-active", "is-put-away");
    finalPanel.setAttribute("aria-hidden", "true");
    introCharacterArt.src = standingSrc();
    introCharacter.className = "intro-character is-standing is-idle";
    setMainAction(true, goNextScene, "go");
    if (state.soundOn) {
      tryPlayOcean();
      fadeOceanTo(1, 900);
    }
  }

  function pauseForFinale() {
    document.documentElement.classList.add("is-scene-paused");
    oceanAudio.pause();
    ejectAudio.pause();
    chimeAudio.pause();
  }

  async function savePhoto() {
    if (!state.lastShotSnapshot) return;
    const selectedFrame = state.selectedFrame;
    const selectedSnapshot = state.lastShotSnapshot;
    await Promise.all([
      ensureExportImage("beach-background.jpg"),
      ensureExportImage(`beach-${selectedSnapshot.outfit}-${selectedSnapshot.pose}.png`),
    ]);
    if (!state.lastShotData) state.lastShotData = drawShotToCanvas(selectedSnapshot);
    if (!state.lastShotData) return;
    const context = saveCanvas.getContext("2d");
    const shot = new Image();
    shot.src = state.lastShotData;
    const frame = new Image();
    frame.src = frameSrc(selectedFrame);
    await Promise.all([shot.decode(), frame.decode()]);
    if (!frame?.naturalWidth) return;
    context.clearRect(0, 0, saveCanvas.width, saveCanvas.height);
    context.drawImage(shot, 160, 150, 1185, 1385);
    context.drawImage(frame, 0, 0, 1505, 2000);
    const blob = await new Promise((resolve) => saveCanvas.toBlob(resolve, "image/png"));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `ORBIT-10-12-beach-frame-${selectedFrame}-${Date.now()}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function toggleSound() {
    if (bridge?.toggleSound) {
      bridge.toggleSound();
      return;
    }
    state.soundOn = !state.soundOn;
    soundButton.classList.toggle("is-muted", !state.soundOn);
    soundButton.setAttribute("aria-pressed", String(state.soundOn));
    if (state.soundOn) {
      oceanAudio.play().catch(() => {});
      fadeOceanTo(1, 900);
    } else {
      fadeOceanTo(0, 500);
      window.setTimeout(() => { if (!state.soundOn) oceanAudio.pause(); }, 520);
    }
    applyLanguage();
  }

  function goBack() {
    document.body.classList.add("is-returning");
    window.setTimeout(() => {
      if (bridge?.returnToRestaurant) bridge.returnToRestaurant();
      else if (history.length > 1) history.back();
      else location.reload();
    }, 650);
  }

  cameraUi.addEventListener("pointermove", (event) => {
    if (state.phase !== "camera") return;
    const point = stagePoint(event);
    if (event.pointerType === "mouse" || state.draggingLens) updateLens(point.x, point.y);
    if (state.draggingLens) state.dragMoved = true;
  });
  cameraUi.addEventListener("pointerdown", (event) => {
    if (state.phase !== "camera") return;
    const point = stagePoint(event);
    updateLens(point.x, point.y);
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      state.draggingLens = true;
      state.dragMoved = false;
      cameraUi.setPointerCapture(event.pointerId);
    }
  });
  cameraUi.addEventListener("pointerup", (event) => {
    if (state.phase !== "camera") return;
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      state.draggingLens = false;
      cameraUi.releasePointerCapture?.(event.pointerId);
    }
    takePhoto();
  });
  cameraUi.addEventListener("click", (event) => {
    if (event.pointerType === "mouse") takePhoto();
  });

  retakeButton.addEventListener("click", beginPhotoMode);
  finishButton.addEventListener("click", finishPhoto);
  putAwayButton.addEventListener("click", putAway);
  anotherPhotoButton.addEventListener("click", takeAnotherPhoto);
  saveButton.addEventListener("click", savePhoto);
  soundButton.addEventListener("click", toggleSound);
  backButton.addEventListener("click", goBack);
  $$(".frame-option").forEach((button) => button.addEventListener("click", () => selectFrame(button.dataset.frame)));
  window.addEventListener("resize", resizeStage);
  document.addEventListener("pointerdown", unlockAudio, true);
  document.addEventListener("keydown", unlockAudio, true);

  ["cuteez", "plaid", "striped"].forEach((outfit) => {
    const standingImage = new Image();
    standingImage.src = `./assets/character-${outfit}.png`;
    ["01", "02", "03", "silly"].forEach((pose) => {
      const image = new Image();
      image.src = `./assets/beach-${outfit}-${pose}.png`;
    });
  });
  [1, 2, 3].forEach((frame) => {
    const image = new Image();
    image.src = frameSrc(frame);
  });
  window.ORBIT_START_BEACH_SCENE = startTransition;
  window.orbitBeachScene = {
    setLanguage(next) {
      if (!copy[next]) return;
      state.language = next;
      document.documentElement.lang = next === "zh" ? "zh-CN" : next;
      applyLanguage();
    },
    setSound(enabled) {
      state.soundOn = Boolean(enabled);
      soundButton.classList.toggle("is-muted", !state.soundOn);
      soundButton.setAttribute("aria-pressed", String(state.soundOn));
      if (state.soundOn) {
        tryPlayOcean();
        fadeOceanTo(1, 900);
      } else {
        fadeOceanTo(0, 500);
        window.setTimeout(() => { if (!state.soundOn) oceanAudio.pause(); }, 520);
      }
      applyLanguage();
    },
    resumeFromFinale,
    pauseForFinale,
  };

  introCharacterArt.src = standingSrc();
  photoCharacter.src = poseSrc("01");
  soundButton.classList.toggle("is-muted", !state.soundOn);
  soundButton.setAttribute("aria-pressed", String(state.soundOn));
  applyLanguage();
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : state.language;
  resizeStage();
  window.setTimeout(startTransition, 120);
})();
