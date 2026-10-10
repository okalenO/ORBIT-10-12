(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const bridge = window.parent !== window ? window.parent.orbitRestaurant : null;
  const settings = bridge?.getSettings() || {};

  const STORAGE = {
    cake: "orbit:restaurantCakeDesign",
    card: "orbit:restaurantCard",
    sound: "orbit:bgmEnabled",
  };

  const stage = $("#stage");
  const scene = $("#restaurantScene");
  const bg1 = $("#bg1");
  const bg2 = $("#bg2");
  const bg3 = $("#bg3");
  const bgBlank = $("#bgBlank");
  const tableMenu = $("#tableMenu");
  const servedFood = $("#servedFood");
  const subtitle = $("#subtitle");
  const characterDialogue = $("#characterDialogue");
  const waiter = $("#waiter");
  const waiterDialogue = $("#waiterDialogue");
  const waiterCake = $("#waiterCake");
  const waiterCakeDecorations = $("#waiterCakeDecorations");
  const mainAction = $("#mainAction");
  const soundButton = $("#soundButton");
  const backButton = $("#backButton");
  const menuOverlay = $("#menuOverlay");
  const cakeWorkbench = $("#cakeWorkbench");
  const pipingBag = $("#pipingBag");
  const creamBorder = $("#creamBorder");
  const cardTeaser = $("#cardTeaser");
  const cardOverlay = $("#cardOverlay");
  const cardMessage = $("#cardMessage");
  const cardSignature = $("#cardSignature");
  const saveCardButton = $("#saveCardButton");
  const transition = $("#transition");
  const nextScene = $("#nextScene");

  const copy = {
    zh: {
      language: "中文",
      transitionPlace: "餐厅",
      introButton: "对话",
      narrator: "钟浩最近很有名呢，如果被认出来的话，会不会请钟浩现场跳一下 BAD 呢。",
      reactionEmbarrassed: "这个……不行吧……太害羞了……",
      reactionOrder: "我们点菜吧。",
      menuHint: "选择一道菜，替它画上圈吧",
      dishGukbap: "韩式汤饭",
      dishCutlet: "炸猪排套餐",
      dishJokbal: "猪蹄",
      foodClickHint: "点击食物继续",
      full: "吃饱了~好吃捏~~",
      restroom: "我去一下卫生间噢",
      waiterOffer: "现在要不要准备一下蛋糕呢？",
      prepareCake: "准备蛋糕",
      cakeHint: "把喜欢的装饰放到蛋糕上吧",
      finishCake: "完成啦",
      cardOpen: "写一张贺卡",
      cardTitle: "A CARD FOR JONGHO",
      cardMessageLabel: "祝福语  To. Jongho",
      cardMessagePlaceholder: "把想说的话写在这里……",
      cardSignatureLabel: "署名",
      cardSignaturePlaceholder: "你的名字",
      cardLocalOnly: "内容仅保存在你的设备中，请放心写下想说的话。",
      saveCard: "写好了",
      surprise: "等下再给钟浩一个惊喜吧",
      finalLine: "那我们走吧？",
      go: "走吧",
      beachTransitionPlace: "海边",
      nextPlaceholder: "下一幕待接入",
      soundOn: "关闭背景音乐",
      soundOff: "开启背景音乐",
      back: "返回上一界面",
    },
    ko: {
      language: "한국어",
      transitionPlace: "식당",
      introButton: "대화하기",
      narrator: "종호 요즘 유명하잖아. 혹시 알아보면 여기서 갑자기 BAD를 춰 달라고 하는 거 아닐까?",
      reactionEmbarrassed: "이건…… 안 되지…… 너무 부끄러운데……",
      reactionOrder: "우리 주문하자.",
      menuHint: "먹고 싶은 메뉴에 동그라미를 그려 주세요",
      dishGukbap: "국밥",
      dishCutlet: "돈가스 정식",
      dishJokbal: "족발",
      foodClickHint: "음식을 눌러 계속하기",
      full: "배부르다~ 맛있었어~~",
      restroom: "화장실 좀 다녀올게~",
      waiterOffer: "지금 케이크를 준비해 볼까요?",
      prepareCake: "케이크 준비하기",
      cakeHint: "마음에 드는 장식을 케이크 위에 올려 주세요",
      finishCake: "다 됐어요",
      cardOpen: "카드 쓰기",
      cardTitle: "A CARD FOR JONGHO",
      cardMessageLabel: "축하 메시지  To. Jongho",
      cardMessagePlaceholder: "하고 싶은 말을 자유롭게 적어 주세요……",
      cardSignatureLabel: "이름",
      cardSignaturePlaceholder: "당신의 이름",
      cardLocalOnly: "작성한 내용은 이 기기에만 저장됩니다. 편하게 마음을 남겨 주세요.",
      saveCard: "다 썼어요",
      surprise: "이따 종호에게 깜짝 선물로 줘요",
      finalLine: "그럼 이제 갈까?",
      go: "가자",
      beachTransitionPlace: "바닷가",
      nextPlaceholder: "다음 장면 연결 예정",
      soundOn: "배경 음악 끄기",
      soundOff: "배경 음악 켜기",
      back: "이전 화면으로",
    },
    en: {
      language: "ENGLISH",
      transitionPlace: "RESTAURANT",
      introButton: "TALK",
      narrator: "Jongho is so well-known these days. What if someone recognizes him and asks him to dance to BAD right here?",
      reactionEmbarrassed: "That… might be a little much… I'd be too embarrassed.",
      reactionOrder: "Let's order first.",
      menuHint: "Choose a dish and circle it",
      dishGukbap: "KOREAN SOUP & RICE",
      dishCutlet: "PORK CUTLET SET",
      dishJokbal: "JOKBAL",
      foodClickHint: "TAP THE FOOD TO CONTINUE",
      full: "I'm full~ That was so good~~",
      restroom: "I'm going to the restroom for a moment.",
      waiterOffer: "Shall we prepare the cake now?",
      prepareCake: "PREPARE THE CAKE",
      cakeHint: "Place your favorite decorations on the cake",
      finishCake: "FINISH",
      cardOpen: "WRITE A CARD",
      cardTitle: "A CARD FOR JONGHO",
      cardMessageLabel: "MESSAGE  To. Jongho",
      cardMessagePlaceholder: "Write anything you would like to say……",
      cardSignatureLabel: "FROM",
      cardSignaturePlaceholder: "Your name",
      cardLocalOnly: "Your message is saved only on this device, so feel free to write from the heart.",
      saveCard: "DONE",
      surprise: "Let's surprise Jongho with it later.",
      finalLine: "Shall we go?",
      go: "LET'S GO",
      beachTransitionPlace: "THE BEACH",
      nextPlaceholder: "NEXT SCENE TO BE CONNECTED",
      soundOn: "TURN BGM OFF",
      soundOff: "TURN BGM ON",
      back: "GO BACK",
    },
  };

  const dishes = {
    gukbap: "./assets/food-gukbap.png",
    cutlet: "./assets/food-pork-cutlet.png",
    jokbal: "./assets/food-jokbal.png",
  };

  function readJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* local preview may block storage */ }
  }

  const savedCard = readJson(STORAGE.card, { message: "", signature: "" });
  const savedCake = readJson(STORAGE.cake, { pieces: [] });
  const savedSound = (() => {
    try { return window.localStorage.getItem(STORAGE.sound) !== "false"; } catch (_) { return true; }
  })();

  const state = {
    language: copy[settings.language] ? settings.language : "zh",
    phase: "transition",
    action: null,
    actionKey: null,
    selectedDish: null,
    transitionFinished: false,
    timers: new Set(),
    placedPieces: new Set(),
    drag: null,
    pipingDone: false,
    soundOn: typeof settings.sound === "boolean" ? settings.sound : savedSound,
    cakeDesign: savedCake,
    card: savedCard,
  };

  function t(key) { return copy[state.language][key] || copy.zh[key] || key; }

  function later(callback, delay) {
    const id = window.setTimeout(() => {
      state.timers.delete(id);
      callback();
    }, delay);
    state.timers.add(id);
    return id;
  }

  function syncExport() {
    window.ORBIT_RESTAURANT_RESULT = {
      selectedDish: state.selectedDish,
      cakeDesign: state.cakeDesign,
      card: state.card,
    };
    bridge?.updateResult(window.ORBIT_RESTAURANT_RESULT);
    window.dispatchEvent(new CustomEvent("orbit:restaurant-updated", { detail: window.ORBIT_RESTAURANT_RESULT }));
  }

  function setBackground(name) {
    [bg1, bg2, bg3, bgBlank].forEach((image) => image.classList.remove("is-active"));
    const target = name === "bg2" ? bg2 : name === "bg3" ? bg3 : name === "blank" ? bgBlank : bg1;
    target.classList.add("is-active");
    scene.classList.toggle("is-blank", name === "blank");
  }

  function setLiveText(element, key, visible = true) {
    element.dataset.copyKey = key || "";
    element.textContent = key ? t(key) : "";
    element.classList.toggle("is-visible", Boolean(key && visible));
  }

  function hideLiveText(element) {
    element.classList.remove("is-visible");
  }

  function setAction(key, handler, disabled = false) {
    state.actionKey = key;
    state.action = handler;
    mainAction.textContent = key ? t(key) : "";
    mainAction.disabled = disabled;
    mainAction.classList.toggle("is-hidden", !key);
  }

  function updateSoundButton() {
    soundButton.classList.toggle("is-muted", !state.soundOn);
    soundButton.setAttribute("aria-pressed", String(state.soundOn));
    soundButton.setAttribute("aria-label", t(state.soundOn ? "soundOn" : "soundOff"));
    const audio = $("#bgmAudio");
    if (audio) {
      audio.muted = !state.soundOn;
      if (state.soundOn) audio.play().catch(() => {});
    }
  }

  function applyLanguage() {
    document.documentElement.lang = state.language === "zh" ? "zh-CN" : state.language;
    $$('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      element.textContent = t(key);
    });
    $$('[data-i18n-placeholder]').forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    [subtitle, characterDialogue, waiterDialogue].forEach((element) => {
      if (element.dataset.copyKey) element.textContent = t(element.dataset.copyKey);
    });
    if (state.actionKey) mainAction.textContent = t(state.actionKey);
    backButton.setAttribute("aria-label", t("back"));
    updateSoundButton();
  }

  function finishTransition() {
    if (state.transitionFinished) return;
    state.transitionFinished = true;
    scene.classList.add("is-revealed");
    transition.classList.add("is-leaving");
    later(() => {
      transition.classList.remove("is-active", "is-leaving");
      state.phase = "intro";
      setAction("introButton", startIntroDialogue);
    }, 1150);
  }

  function startIntroDialogue() {
    if (state.phase !== "intro") return;
    state.phase = "intro-dialogue";
    setAction(null, null);
    setLiveText(subtitle, "narrator");
    later(() => hideLiveText(subtitle), 5100);
    later(() => setBackground("bg2"), 5600);
    later(() => setLiveText(characterDialogue, "reactionEmbarrassed"), 6900);
    later(() => hideLiveText(characterDialogue), 10800);
    later(() => setBackground("bg3"), 11200);
    later(() => setLiveText(characterDialogue, "reactionOrder"), 12000);
    later(() => hideLiveText(characterDialogue), 15400);
    later(() => {
      state.phase = "menu-ready";
      tableMenu.disabled = false;
      tableMenu.classList.add("is-ready");
    }, 16000);
  }

  function openMenu() {
    if (state.phase !== "menu-ready") return;
    state.phase = "menu-open";
    tableMenu.disabled = true;
    tableMenu.classList.remove("is-ready");
    menuOverlay.classList.add("is-open");
    menuOverlay.setAttribute("aria-hidden", "false");
    later(() => setBackground("bg1"), 180);
  }

  function selectDish(dishId) {
    if (state.phase !== "menu-open" || !dishes[dishId]) return;
    state.phase = "menu-selected";
    state.selectedDish = dishId;
    syncExport();
    $$(".dish-choice").forEach((button) => {
      button.disabled = true;
      button.classList.toggle("is-selected", button.dataset.dish === dishId);
    });
    later(() => {
      menuOverlay.classList.remove("is-open");
      menuOverlay.setAttribute("aria-hidden", "true");
      tableMenu.classList.add("is-hidden");
      serveFood(dishId);
    }, 1500);
  }

  function serveFood(dishId) {
    state.phase = "food-arriving";
    servedFood.src = dishes[dishId];
    servedFood.classList.remove("is-poofing", "is-ready");
    servedFood.tabIndex = -1;
    void servedFood.offsetWidth;
    servedFood.classList.add("is-visible");
    later(() => {
      state.phase = "food-ready";
      servedFood.classList.add("is-ready");
      servedFood.tabIndex = 0;
    }, 1100);
  }

  function consumeFood() {
    if (state.phase !== "food-ready") return;
    state.phase = "food-consuming";
    servedFood.classList.remove("is-ready");
    servedFood.tabIndex = -1;
    servedFood.classList.add("is-poofing");
    later(() => servedFood.classList.remove("is-visible", "is-poofing"), 1050);
    later(() => setLiveText(characterDialogue, "full"), 1800);
    later(() => hideLiveText(characterDialogue), 5900);
    later(() => setLiveText(characterDialogue, "restroom"), 6600);
    later(() => hideLiveText(characterDialogue), 10100);
    later(() => setBackground("blank"), 11100);
    later(showWaiterOffer, 12400);
  }

  function showWaiterOffer() {
    state.phase = "waiter-offer";
    waiter.classList.remove("is-offstage", "is-leaving", "has-cake");
    void waiter.offsetWidth;
    waiter.classList.add("is-in");
    setLiveText(waiterDialogue, "waiterOffer");
    later(() => setAction("prepareCake", beginCakeGame), 1700);
  }

  function beginCakeGame() {
    if (state.phase !== "waiter-offer") return;
    state.phase = "cake";
    setAction(null, null);
    tableMenu.classList.add("is-hidden");
    servedFood.classList.remove("is-visible", "is-poofing", "is-ready");
    waiter.classList.remove("is-in");
    waiter.classList.add("is-leaving");
    later(() => {
      waiter.classList.add("is-offstage");
      waiter.classList.remove("is-leaving");
      waiterDialogue.textContent = "";
      waiterDialogue.dataset.copyKey = "";
      cakeWorkbench.classList.add("is-active");
      setAction("finishCake", confirmCake, state.placedPieces.size < 3);
    }, 1150);
  }

  function saveCakeDesign() {
    const pieces = $$(".cake-piece.is-placed").map((piece) => ({
      id: piece.dataset.piece,
      x: Number.parseFloat(piece.style.left),
      y: Number.parseFloat(piece.style.top),
      zone: piece.classList.contains("is-head-snapped") ? "bearHead" : "cake",
    }));
    state.cakeDesign = { pieces, pipingDone: state.pipingDone };
    writeJson(STORAGE.cake, state.cakeDesign);
    syncExport();
  }

  function buildWaiterCakePreview() {
    waiterCakeDecorations.replaceChildren();
    waiterCake.classList.toggle("has-cream", Boolean(state.cakeDesign.pipingDone));

    const cakeLeft = 655;
    const cakeTop = 429;
    const cakeSize = 610;

    state.cakeDesign.pieces.forEach((savedPiece) => {
      const source = $(`.cake-piece[data-piece="${savedPiece.id}"] img`);
      if (!source) return;

      const decoration = source.cloneNode(false);
      const isHeadPiece = savedPiece.zone === "bearHead";
      const displaySize = isHeadPiece ? 108 : 94;
      decoration.className = "waiter-cake-decoration";
      decoration.alt = "";
      decoration.draggable = false;
      decoration.style.left = `${((savedPiece.x - cakeLeft) / cakeSize) * 100}%`;
      decoration.style.top = `${((savedPiece.y - cakeTop) / cakeSize) * 100}%`;
      decoration.style.width = `${(displaySize / cakeSize) * 100}%`;
      decoration.style.height = `${(displaySize / cakeSize) * 100}%`;
      waiterCakeDecorations.append(decoration);
    });
  }

  function confirmCake() {
    if (state.phase !== "cake" || state.placedPieces.size < 3 || pipingBag.classList.contains("is-piping")) return;
    state.phase = "card-ready";
    saveCakeDesign();
    buildWaiterCakePreview();
    setAction(null, null);
    cakeWorkbench.classList.add("is-locked");
    later(() => cardTeaser.classList.add("is-visible"), 650);
  }

  function openCard() {
    if (state.phase !== "card-ready") return;
    state.phase = "card-open";
    cardMessage.value = state.card.message || "";
    cardSignature.value = state.card.signature || "";
    cardOverlay.classList.add("is-open");
    cardOverlay.setAttribute("aria-hidden", "false");
    later(() => cardMessage.focus(), 550);
  }

  function saveCard() {
    if (state.phase !== "card-open") return;
    state.card = {
      message: cardMessage.value,
      signature: cardSignature.value,
    };
    writeJson(STORAGE.card, state.card);
    syncExport();
    cardOverlay.classList.remove("is-open");
    cardOverlay.setAttribute("aria-hidden", "true");
    cardTeaser.classList.remove("is-visible");
    later(handoffCake, 450);
  }

  function handoffCake() {
    state.phase = "handoff";
    buildWaiterCakePreview();
    cakeWorkbench.classList.add("is-handing-over");
    waiter.classList.remove("is-offstage", "is-leaving", "has-cake");
    void waiter.offsetWidth;
    waiter.classList.add("is-in");
    later(() => waiter.classList.add("has-cake"), 750);
    later(() => setLiveText(subtitle, "surprise"), 1150);
    later(() => {
      hideLiveText(subtitle);
      waiter.classList.remove("is-in");
      waiter.classList.add("is-leaving");
    }, 5400);
    later(() => {
      waiter.classList.add("is-offstage");
      cakeWorkbench.classList.remove("is-active");
      setBackground("bg1");
    }, 6750);
    later(() => {
      waiter.classList.remove("is-leaving", "has-cake");
      cakeWorkbench.classList.remove("is-handing-over", "is-locked");
    }, 7550);
    later(() => {
      state.phase = "finale";
      setLiveText(characterDialogue, "finalLine");
      setAction("go", goToNextScene);
    }, 8000);
  }

  function goToNextScene() {
    if (state.phase !== "finale") return;
    state.phase = "done";
    hideLiveText(characterDialogue);
    setAction(null, null);
    bridge?.playBeachChime?.();
    nextScene.classList.toggle("is-handoff", Boolean(bridge?.goToBeach));
    nextScene.classList.add("is-active");
    nextScene.setAttribute("aria-hidden", "false");
    if (bridge?.goToBeach) bridge.goToBeach();
  }

  function resumeFromBeach() {
    nextScene.classList.remove("is-active", "is-handoff");
    nextScene.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-returning");
    state.phase = "finale";
    setLiveText(characterDialogue, "finalLine");
    setAction("go", goToNextScene);
  }

  function stagePoint(event) {
    const rect = stage.getBoundingClientRect();
    const scale = rect.width / 1920;
    return { x: (event.clientX - rect.left) / scale, y: (event.clientY - rect.top) / scale };
  }

  function resetPiece(piece) {
    piece.style.left = `${piece.dataset.homeX}px`;
    piece.style.top = `${piece.dataset.homeY}px`;
    piece.classList.remove("is-placed", "is-head-snapped");
    state.placedPieces.delete(piece.dataset.piece);
  }

  function initializeCakePieces() {
    $$(".cake-piece").forEach((piece) => {
      resetPiece(piece);

      piece.addEventListener("pointerdown", (event) => {
        if (state.phase !== "cake") return;
        event.preventDefault();
        const point = stagePoint(event);
        state.drag = { piece, pointerId: event.pointerId, startX: point.x, startY: point.y };
        piece.setPointerCapture(event.pointerId);
        piece.classList.add("is-dragging");
      });
      piece.addEventListener("pointermove", (event) => {
        if (!state.drag || state.drag.piece !== piece || state.drag.pointerId !== event.pointerId) return;
        const point = stagePoint(event);
        piece.style.left = `${point.x}px`;
        piece.style.top = `${point.y}px`;
      });
      const release = (event) => {
        if (!state.drag || state.drag.piece !== piece || state.drag.pointerId !== event.pointerId) return;
        const point = stagePoint(event);
        const insideCake = Math.pow((point.x - 960) / 245, 2) + Math.pow((point.y - 734) / 118, 2) <= 1;
        const insideBearSnap = Math.hypot(point.x - 960, point.y - 605) <= 100;
        piece.classList.remove("is-dragging");
        if (insideBearSnap) {
          const previous = $(".cake-piece.is-head-snapped");
          if (previous && previous !== piece) resetPiece(previous);
          piece.style.left = "960px";
          piece.style.top = "605px";
          piece.classList.add("is-placed", "is-head-snapped");
          state.placedPieces.add(piece.dataset.piece);
        } else if (insideCake) {
          piece.style.left = `${Math.max(770, Math.min(1150, point.x))}px`;
          piece.style.top = `${Math.max(662, Math.min(806, point.y))}px`;
          piece.classList.add("is-placed");
          piece.classList.remove("is-head-snapped");
          state.placedPieces.add(piece.dataset.piece);
        } else {
          resetPiece(piece);
        }
        state.drag = null;
        mainAction.disabled = state.placedPieces.size < 3;
        piece.releasePointerCapture?.(event.pointerId);
      };
      piece.addEventListener("pointerup", release);
      piece.addEventListener("pointercancel", release);
    });
  }

  function resizeStage() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.setProperty("--stage-scale", String(scale));
  }

  function toggleSound() {
    if (bridge?.toggleSound) {
      bridge.toggleSound();
      return;
    }
    state.soundOn = !state.soundOn;
    try { window.localStorage.setItem(STORAGE.sound, String(state.soundOn)); } catch (_) { /* ignore */ }
    updateSoundButton();
  }

  function runPiping() {
    if (state.phase !== "cake" || pipingBag.classList.contains("is-piping") || state.pipingDone) return;
    mainAction.disabled = true;
    pipingBag.classList.add("is-piping");
    creamBorder.classList.add("is-revealing");
    later(() => {
      state.pipingDone = true;
      state.placedPieces.add("cream-border");
      pipingBag.classList.remove("is-piping");
      pipingBag.classList.add("is-complete");
      creamBorder.classList.remove("is-revealing");
      creamBorder.classList.add("is-visible");
      mainAction.disabled = state.placedPieces.size < 3;
    }, 4200);
  }

  function goBack() {
    document.body.classList.add("is-returning");
    later(() => {
      if (bridge?.returnToStreet) bridge.returnToStreet();
      else if (window.history.length > 1) window.history.back();
      else window.location.reload();
    }, 650);
  }

  mainAction.addEventListener("click", () => state.action?.());
  tableMenu.addEventListener("click", openMenu);
  servedFood.addEventListener("click", consumeFood);
  servedFood.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      consumeFood();
    }
  });
  $$(".dish-choice").forEach((button) => button.addEventListener("click", () => selectDish(button.dataset.dish)));
  pipingBag.addEventListener("click", runPiping);
  cardTeaser.addEventListener("click", openCard);
  saveCardButton.addEventListener("click", saveCard);
  soundButton.addEventListener("click", toggleSound);
  backButton.addEventListener("click", goBack);
  window.addEventListener("resize", resizeStage);

  window.orbitRestaurantScene = {
    setLanguage(next) {
      if (!copy[next]) return;
      state.language = next;
      applyLanguage();
    },
    setSound(enabled) {
      state.soundOn = Boolean(enabled);
      updateSoundButton();
    },
    resumeFromBeach,
  };

  initializeCakePieces();
  applyLanguage();
  resizeStage();
  syncExport();
  later(finishTransition, 2800);
})();
