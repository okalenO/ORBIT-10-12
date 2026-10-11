(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const bridge = window.parent !== window ? window.parent.orbitFinale : null;
  const settings = bridge?.getSettings?.() || {};
  const stage = $("#stage");
  const beachScene = $("#beachScene");
  const bedroomScene = $("#bedroomScene");
  const seatedCharacter = $("#seatedCharacter");
  const standingCharacter = $("#standingCharacter");
  const characterButton = $("#beachCharacterButton");
  const speech = $("#speech");
  const playerSpeech = $("#playerSpeech");
  const continueButton = $("#continueButton");
  const bedroomContinueButton = $("#bedroomContinueButton");
  const bedroomSpeech = $("#bedroomSpeech");
  const hud = $("#hud");
  const hudTime = $("#hudTime");
  const soundButton = $("#soundButton");
  const oceanAudio = $("#oceanAudio");
  const singingAudio = $("#singingAudio");
  const homeTransitionAudio = $("#homeTransitionAudio");
  const homeAudio = $("#homeAudio");
  const musicBoxAudio = $("#musicBoxAudio");
  const finaleAudio = $("#finaleAudio");
  const thinkingVideo = $("#thinkingVideo");
  const cgOneVideo = $("#cgOneVideo");

  const languageAliases = { zh: "zh", cn: "zh", "zh-cn": "zh", ko: "ko", kr: "ko", en: "en" };
  const outfitAliases = { cuteez: "cuteez", plaid: "plaid", check: "plaid", grid: "plaid", striped: "striped", henley: "striped", 格子: "plaid", 亨利: "striped" };
  const copy = {
    zh: {
      place: "卧室", audio: "点击画面开启声音", continue: "继续", talk: "对话", go: "走吧",
      noticed1: "你好像很喜欢到处点点诶？", noticed2: "今天点了好多东西吧。",
      player: "因为钟浩看起来像是在想事情。", romantic: "因为现在很浪漫嘛~~",
      monologue: [
        "我想，今年真的尝试了很多第一次，好像也发生了很多比想象中更好的事情。",
        "去了巴黎，也第一次一个人拍了画报……活动期间还取得了很好的成绩，所以我也会想：‘啊，原来我又成长了一点。’",
        "但每当遇到这样的时刻，最后最先想到的好像还是 ATINY。",
        "虽然真的是经常说的话……但我不能没有 ATINY，不是吗？",
        "希望 ATINY 能像我感受到幸福一样幸福。即使遇到辛苦的时刻，也希望我们能够成为彼此的一点力量。",
        "我会继续唱歌的。",
        "我想长长久久地，成为一直在 ATINY 面前唱歌的人。",
        "所以以后我们也……一起幸福吧~！"
      ],
      goHome: "有点晚了，我们一起吃个晚饭，差不多该回去了吧？",
      prepared: "这些蛋糕之类的……都是你准备的吗？",
      bedroomLines: [
        "今天明明是我的生日……结果你做了很多事呢？",
        "早上叫我起床，帮我选了衣服，陪我慢慢走了一路。",
        "午餐也替我想了，蛋糕也是你准备的，还帮我拍了照片。",
        "我们真的一起留下了很多回忆。"
      ],
      fiveMinutes: "今天也只剩五分钟了呢。", noClock: "等一下……现在好像不用再看时间了。",
      replyThanks: "我也同样谢谢你", takePhoto: "现在换我来给你拍一张照吧。",
      thankYou: "谢谢你一直在我身边", epilogueHint: "点击空白处进入尾声", letter: "制作者来信正文将在最终版本补充。"
    },
    ko: {
      place: "침실", audio: "화면을 눌러 소리를 켜 주세요", continue: "계속", talk: "대화", go: "가자",
      noticed1: "여기저기 눌러보는 거 되게 좋아하나 봐?", noticed2: "오늘 진짜 이것저것 많이 눌러봤지.",
      player: "종호가 뭔가 생각하고 있는 것 같아서?", romantic: "지금 좀 낭만적이잖아~~",
      monologue: [
        "올해는 처음 해본 것도 진짜 많았고, 생각보다 좋은 일도 많이 있었던 것 같아.",
        "파리도 가보고, 혼자 화보도 찍어보고…… 활동하면서 좋은 결과도 많이 받아서, 나도 ‘아, 내가 또 조금은 성장했구나’ 하는 생각이 들었어.",
        "근데 그런 순간마다 결국 제일 먼저 생각나는 건 에이티니였던 것 같아.",
        "진짜 항상 하는 말이긴 한데…… 나는 에이티니 없으면 안 되잖아.",
        "내가 행복한 만큼 에이티니도 행복했으면 좋겠고, 힘든 순간이 오더라도 서로한테 조금이라도 힘이 될 수 있었으면 좋겠어.",
        "나는 계속 노래할게.",
        "오래오래, 에이티니 앞에서 계속 노래하는 사람이 되고 싶어.",
        "그러니까 우리 앞으로도…… 같이 행복하자~!"
      ],
      goHome: "조금 늦었네. 같이 저녁 먹고, 이제 슬슬 돌아갈까?",
      prepared: "이 케이크 같은 것도…… 네가 다 준비한 거야?",
      bedroomLines: [
        "오늘은 분명 내 생일인데…… 네가 더 바빴던 것 같아.",
        "아침에 깨워주고, 옷도 골라주고, 같이 천천히 걸어줬잖아.",
        "점심도 같이 골라주고, 케이크도 준비해 주고, 사진도 찍어줬고.",
        "우리 오늘 진짜 많은 추억을 남겼네."
      ],
      fiveMinutes: "오늘도 이제 5분밖에 안 남았네.", noClock: "잠깐만…… 이제 시간은 안 봐도 될 것 같아.",
      replyThanks: "나도 똑같이 고마워", takePhoto: "이번에는 내가 사진 한 장 찍어줄게.",
      thankYou: "계속 내 곁에 있어줘서 고마워", epilogueHint: "빈 곳을 눌러 에필로그로", letter: "제작자의 편지는 최종 버전에서 추가됩니다."
    },
    en: {
      place: "BEDROOM", audio: "TAP TO ENABLE SOUND", continue: "CONTINUE", talk: "TALK", go: "LET'S GO",
      noticed1: "You really like tapping on little things, don't you?", noticed2: "You found so many things to tap today.",
      player: "Because you looked like you had something on your mind?", romantic: "Because this feels kind of romantic right now~~",
      monologue: [
        "I think I tried so many things for the first time this year, and more good things happened than I expected.",
        "I went to Paris and did my first solo pictorial… We also had such good results during promotions that I thought, ‘Oh, I really have grown a little more.’",
        "But in moments like those, ATINY were still the first people who came to mind.",
        "I know I say this all the time… but I really can't do this without ATINY.",
        "I hope ATINY can be as happy as I am. Even when things get hard, I hope we can give each other a little strength.",
        "I'll keep singing.",
        "For a long, long time, I want to be someone who keeps singing in front of ATINY.",
        "So from now on too… let's be happy together~!"
      ],
      goHome: "It's getting late. Let's have dinner together, then maybe head home?",
      prepared: "All of this—the cake and everything… did you prepare it?",
      bedroomLines: [
        "It was supposed to be my birthday… but you ended up doing so much.",
        "You woke me up, picked my clothes, and walked slowly with me all day.",
        "You helped choose lunch, prepared the cake, and even took my photo.",
        "We really made so many memories together."
      ],
      fiveMinutes: "There are only five minutes left today.", noClock: "Wait… I don't think we need to watch the time anymore.",
      replyThanks: "I'm just as thankful to you", takePhoto: "Now it's my turn to take a photo of you.",
      thankYou: "Thank you for always staying by my side", epilogueHint: "TAP ANYWHERE TO ENTER THE EPILOGUE", letter: "The creator's letter will be added in the final version."
    }
  };

  function read(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function parseJson(value) { try { return JSON.parse(value); } catch (_) { return null; } }
  function firstStored(keys) { for (const key of keys) { const value = read(key); if (value !== null && value !== "") return value; } return null; }
  function resolveLanguage() {
    const query = new URLSearchParams(location.search).get("lang");
    const raw = settings.language || query || firstStored(["orbit:language", "orbit:lang", "language"]) || "zh";
    return languageAliases[String(raw).toLowerCase()] || "zh";
  }
  function resolveOutfit() {
    const raw = settings.outfit || new URLSearchParams(location.search).get("outfit") || firstStored(["orbit:selectedOutfit", "orbit:outfit", "selectedOutfit"]) || "plaid";
    const normalized = String(raw).toLowerCase();
    if (outfitAliases[normalized]) return outfitAliases[normalized];
    if (normalized.includes("cuteez")) return "cuteez";
    if (normalized.includes("striped") || normalized.includes("henley")) return "striped";
    return "plaid";
  }

  const state = {
    language: resolveLanguage(), outfit: resolveOutfit(), phase: "opening", interactionClickCount: 0,
    attentionTriggered: false, idleTimer: 0, dialogueToken: 0, soundOn: typeof settings.sound === "boolean" ? settings.sound : true, audioUnlocked: false,
    audioContext: null, homeTransitionTimer: 0, birdTimer: 0, bedroomHintTimer: 0, noteTimer: 0,
    singingStarted: false, singingFinished: false, bedroomCharacterClicked: false, responseTimer: 0,
    finaleAudioStarted: false, finaleAudioFinished: false,
    data: { drinkId: null, cakeConfig: null, card: null, photo: null }
  };
  const t = (key) => copy[state.language][key] ?? copy.zh[key] ?? key;

  function resizeStage() {
    const viewportWidth = window.visualViewport?.width || document.documentElement.clientWidth || innerWidth;
    const viewportHeight = window.visualViewport?.height || document.documentElement.clientHeight || innerHeight;
    const scale = Math.min(viewportWidth / 1920, viewportHeight / 1080);
    stage.style.setProperty("--stage-scale", String(scale));
  }
  function setTime(value) { hudTime.textContent = value; }
  function setScene(scene) {
    $$(".scene").forEach((item) => item.classList.toggle("is-active", item === scene));
  }
  function showText(node, text, duration = 0) {
    node.textContent = text;
    node.classList.add("is-visible");
    if (duration) setTimeout(() => node.classList.remove("is-visible"), duration);
  }
  function hideText(node) { node.classList.remove("is-visible"); }

  function createAudioContext() {
    if (!state.audioContext) state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    return state.audioContext;
  }
  async function tryPlay(audio, volume) {
    audio.volume = state.soundOn ? volume : 0;
    try { await audio.play(); return true; } catch (_) { return false; }
  }
  function fadeAudio(audio, target, duration, pauseAfter = false) {
    const start = audio.volume;
    const started = performance.now();
    return new Promise((resolve) => {
      const tick = (now) => {
        const p = Math.max(0, Math.min(1, (now - started) / duration));
        audio.volume = Math.max(0, Math.min(1, start + (target - start) * p));
        if (p < 1) requestAnimationFrame(tick);
        else { if (pauseAfter && target === 0) audio.pause(); resolve(); }
      };
      requestAnimationFrame(tick);
    });
  }
  async function unlockAudio() {
    if (!state.soundOn) return;
    state.audioUnlocked = true;
    const context = createAudioContext();
    await context.resume().catch(() => {});
    const beachPhase = state.phase.startsWith("beach") || state.phase === "opening";
    const oceanOk = beachPhase && oceanAudio.paused ? await tryPlay(oceanAudio, .42) : true;
    let singingOk = true;
    if (state.phase === "beach-listening" && !state.singingFinished && !state.singingStarted) singingOk = await beginSingingPlayback();
    if (oceanOk && singingOk) state.audioUnlocked = true;
  }

  async function beginSingingPlayback() {
    if (state.singingFinished || state.singingStarted) return true;
    singingAudio.loop = false; singingAudio.currentTime = 0;
    setSeatedPose(2);
    singingAudio.volume = .015;
    const played = await tryPlay(singingAudio,.015);
    if (!played) return false;
    state.singingStarted = true;
    startSingingNotes();
    fadeAudio(oceanAudio, state.soundOn ? .16 : 0, 1200);
    fadeAudio(singingAudio, state.soundOn ? .68 : 0, 1800);
    singingAudio.addEventListener("ended", finishSingingPhase, { once:true });
    return true;
  }

  function setBeachInteraction(enabled) {
    $$(".hotspot").forEach((node) => { node.disabled = !enabled; });
    characterButton.disabled = !enabled;
    beachScene.classList.toggle("is-explorable", enabled);
  }

  function finishSingingPhase() {
    if (state.singingFinished) return;
    state.singingFinished = true; state.phase = "beach-explore";
    singingAudio.pause();
    stopSingingNotes();
    if (state.soundOn) fadeAudio(oceanAudio, .42, 1200);
    setBeachInteraction(true); resetIdleTimer();
  }
  function spawnSingingNote() {
    const layer = $("#singingNotes");
    if (!layer || state.phase !== "beach-listening") return;
    const note = document.createElement("span");
    const symbols = ["♪", "♫", "♬", "♩"];
    note.className = "singing-note";
    note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    note.style.setProperty("--note-x", `${12 + Math.random() * 76}%`);
    note.style.setProperty("--note-drift", `${-75 + Math.random() * 150}px`);
    note.style.setProperty("--note-size", `${32 + Math.random() * 22}px`);
    note.style.setProperty("--note-duration", `${2.7 + Math.random() * 1.2}s`);
    layer.appendChild(note);
    note.addEventListener("animationend", () => note.remove(), { once:true });
  }
  function startSingingNotes() {
    stopSingingNotes(true);
    spawnSingingNote();
    window.setTimeout(spawnSingingNote, 230);
    state.noteTimer = window.setInterval(spawnSingingNote, 520);
  }
  function stopSingingNotes(clear = false) {
    window.clearInterval(state.noteTimer);
    state.noteTimer = 0;
    if (clear) $("#singingNotes")?.replaceChildren();
  }
  function playHomeFallback() {
    if (!state.soundOn) return;
    const ctx = createAudioContext();
    const now = ctx.currentTime;
    [0,.58,1.14,2.4,2.62,3.9].forEach((offset,index) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = index > 3 ? "triangle" : "sine";
      osc.frequency.value = index > 3 ? 520 - index * 24 : 105 + index * 11;
      gain.gain.setValueAtTime(.001, now + offset);
      gain.gain.linearRampToValueAtTime(index > 3 ? .08 : .045, now + offset + .02);
      gain.gain.exponentialRampToValueAtTime(.001, now + offset + .35);
      osc.connect(gain).connect(ctx.destination); osc.start(now + offset); osc.stop(now + offset + .4);
    });
  }
  function playMusicBoxFallback() {
    if (!state.soundOn) return;
    const ctx = createAudioContext();
    const notes = [392,392,440,392,523.25,493.88,392,392,440,392,587.33,523.25,392,392,783.99,659.25,523.25,493.88,440,698.46,698.46,659.25,523.25,587.33,523.25];
    const lengths = [.34,.18,.52,.52,.52,1.0,.34,.18,.52,.52,.52,1.0,.34,.18,.52,.52,.52,.52,1.0,.34,.18,.52,.52,.52,1.1];
    let cursor = ctx.currentTime + .05;
    notes.forEach((frequency, index) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.value = frequency;
      gain.gain.setValueAtTime(.001,cursor); gain.gain.exponentialRampToValueAtTime(.13,cursor+.02); gain.gain.exponentialRampToValueAtTime(.001,cursor+lengths[index]);
      osc.connect(gain).connect(ctx.destination); osc.start(cursor); osc.stop(cursor+lengths[index]+.05); cursor += lengths[index];
    });
  }
  function toggleSound() {
    state.soundOn = !state.soundOn;
    soundButton.classList.toggle("is-muted", !state.soundOn);
    soundButton.setAttribute("aria-pressed", String(state.soundOn));
    [oceanAudio,singingAudio,homeTransitionAudio,homeAudio,musicBoxAudio,finaleAudio,thinkingVideo].forEach((audio) => { audio.muted = !state.soundOn; });
    $("#finaleVideo").muted = true;
    if (state.soundOn) unlockAudio();
    bridge?.toggleSound?.();
  }

  function loadPersistentData() {
    state.data.drinkId = settings.drinkId || firstStored(["orbit:drinkChoice", "orbit:drinkId", "orbit:selectedDrink", "selectedDrink"]);
    state.data.cakeConfig = settings.cakeConfig || parseJson(firstStored(["orbit:restaurantCakeDesign", "orbit:cakeConfig", "orbit:restaurantCake", "cakeConfig"])) || {};
    state.data.card = settings.card || parseJson(firstStored(["orbit:restaurantCard", "orbit:card", "orbit:greetingCard"])) || {};
    state.data.photo = settings.photo || parseJson(firstStored(["orbit:beachPhoto", "orbit:photoData"])) || {};
  }
  function applyOutfit() {
    const assetOutfit = state.outfit === "plaid" ? "striped" : state.outfit === "striped" ? "plaid" : state.outfit;
    seatedCharacter.src = `./assets/beach2-${assetOutfit}-1.png`;
    standingCharacter.src = `./assets/standing-${assetOutfit}-cropped.png`;
    $("#bedroomCharacterImage").src = `./assets/standing-${assetOutfit}-cropped.png`;
  }

  function setSeatedPose(pose) {
    const assetOutfit = state.outfit === "plaid" ? "striped" : state.outfit === "striped" ? "plaid" : state.outfit;
    const next = `./assets/beach2-${assetOutfit}-${pose}.png`;
    if (seatedCharacter.getAttribute("src") === next) return;
    seatedCharacter.src = next;
    characterButton.classList.remove("is-switching");
    void characterButton.offsetWidth;
    characterButton.classList.add("is-switching");
    setTimeout(() => characterButton.classList.remove("is-switching"), 850);
  }

  function resetIdleTimer() {
    clearTimeout(state.idleTimer);
    if (state.phase !== "beach-explore" || state.attentionTriggered) return;
    state.idleTimer = setTimeout(() => triggerAttention("idle"), 8000);
  }
  function registerInvalidClick() {
    if (state.phase !== "beach-explore" || state.attentionTriggered) return;
    state.interactionClickCount += 1;
    resetIdleTimer();
    if (state.interactionClickCount >= 4) triggerAttention("clicks");
  }
  function wobble(node) {
    node.classList.remove("is-wobbling"); void node.offsetWidth; node.classList.add("is-wobbling");
    setTimeout(() => node.classList.remove("is-wobbling"), 600);
  }
  function squishCharacter() {
    characterButton.classList.remove("is-squishing"); void characterButton.offsetWidth; characterButton.classList.add("is-squishing");
    setTimeout(() => characterButton.classList.remove("is-squishing"), 650);
  }
  function squishNode(node) {
    node.classList.remove("is-squishing"); void node.offsetWidth; node.classList.add("is-squishing");
    setTimeout(() => node.classList.remove("is-squishing"), 720);
  }

  function waitForAdvance(node, text, minMs = 650, _autoMs = 0, button = continueButton, label = t("continue")) {
    const token = ++state.dialogueToken;
    showText(node, text);
    button.textContent = label;
    button.classList.add("is-active");
    return new Promise((resolve) => {
      let ready = false; let done = false;
      const finish = () => {
        if (done || !ready || token !== state.dialogueToken) return;
        done = true; button.onclick = null; button.classList.remove("is-active");
        hideText(node); setTimeout(resolve, 620);
      };
      button.onclick = finish;
      setTimeout(() => { ready = true; }, minMs);
    });
  }

  function waitForAction(button, label) {
    button.textContent = label;
    button.classList.add("is-active");
    return new Promise((resolve) => {
      button.onclick = () => {
        button.onclick = null;
        button.classList.remove("is-active");
        setTimeout(resolve, 220);
      };
    });
  }

  async function waitForTimedText(node, text, visibleMs = 2600, gapMs = 320) {
    showText(node, text);
    await wait(visibleMs);
    hideText(node);
    await wait(Math.max(gapMs, 620));
  }

  async function triggerAttention() {
    if (state.attentionTriggered) return;
    state.attentionTriggered = true; state.phase = "beach-dialogue"; clearTimeout(state.idleTimer);
    setBeachInteraction(false);
    setSeatedPose(1);
    await waitForTimedText(speech, t("noticed1"), 2450, 240);
    await waitForTimedText(speech, t("noticed2"), 2450, 360);
    await waitForAction(continueButton, t("talk"));
    setSeatedPose(2);
    await waitForTimedText(playerSpeech, t("player"), 2800, 320);
    setSeatedPose(1);
    await waitForTimedText(speech, t("romantic"), 2800, 420);
    for (const line of t("monologue")) await waitForAdvance(speech, line, 800);
    await playThinkingVideo();
    state.phase = "beach-standing";
    standingCharacter.classList.add("is-clickable");
    $("#beachPatHint").classList.add("is-visible");
  }

  function playThinkingVideo() {
    return new Promise((resolve) => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        characterButton.classList.add("is-hidden");
        standingCharacter.classList.add("is-visible");
        setTimeout(() => standingCharacter.classList.add("is-settled"), 850);
        thinkingVideo.classList.remove("is-active");
        thinkingVideo.onended = null;
        thinkingVideo.onerror = null;
        setTimeout(resolve, 1250);
      };
      thinkingVideo.currentTime = 0;
      thinkingVideo.volume = state.soundOn ? .82 : 0;
      thinkingVideo.classList.add("is-active");
      thinkingVideo.onended = finish;
      thinkingVideo.onerror = () => setTimeout(finish, 2300);
      thinkingVideo.play().catch(() => setTimeout(finish, 2300));
      setTimeout(finish, 7000);
    });
  }

  async function startGoHomeDialogue() {
    if (state.phase !== "beach-standing") return;
    state.phase = "beach-go-home";
    standingCharacter.classList.remove("is-clickable");
    $("#beachPatHint").classList.remove("is-visible");
    await waitForAdvance(speech, t("goHome"), 650, 0, continueButton, t("go"));
    beginHomeTransition();
  }

  function scheduleBird() {
    clearTimeout(state.birdTimer);
    const delay = 9000 + Math.random() * 9000;
    state.birdTimer = setTimeout(() => {
      if (state.phase.startsWith("beach")) {
        const bird = document.createElement("i"); bird.className = "flying-bird";
        bird.style.setProperty("--bird-y", `${120 + Math.random()*260}px`);
        bird.style.setProperty("--bird-duration", `${9 + Math.random()*5}s`);
        $("#birdLayer").appendChild(bird); setTimeout(() => bird.remove(), 15000);
      }
      scheduleBird();
    }, delay);
  }

  async function beginHomeTransition() {
    state.phase = "home-transition"; clearTimeout(state.birdTimer); hud.classList.add("is-hidden");
    const transition = $("#homeTransition"); transition.classList.add("is-active");
    fadeAudio(oceanAudio, 0, 1000, true); singingAudio.pause();
    homeTransitionAudio.currentTime = 0; homeTransitionAudio.volume = 0;
    if (await tryPlay(homeTransitionAudio, 0)) fadeAudio(homeTransitionAudio, state.soundOn ? .16 : 0, 1000);
    await wait(2000);
    if (state.phase !== "home-transition") return;
    state.homeTransitionTimer = setTimeout(enterBedroom, 5000);
  }
  async function startNightBedroomBgm() {
    if (!state.phase.startsWith("bedroom") && !state.phase.startsWith("ending")) return;
    homeAudio.loop = true; homeAudio.currentTime = 0; homeAudio.volume = 0;
    const played = await tryPlay(homeAudio, 0);
    if (played) fadeAudio(homeAudio, state.soundOn ? .14 : 0, 1800);
    else playHomeFallback();
  }
  function enterBedroom() {
    if (state.phase.startsWith("bedroom") || state.phase.startsWith("ending")) return;
    clearTimeout(state.homeTransitionTimer); oceanAudio.pause(); oceanAudio.currentTime = 0;
    state.phase = "bedroom-entering"; setScene(bedroomScene); renderKeepsakes(); setTime("23:40"); hud.classList.remove("is-hidden");
    const transition = $("#homeTransition"); transition.classList.add("is-leaving");
    fadeAudio(homeTransitionAudio, 0, 1250, true);
    setTimeout(() => {
      transition.classList.remove("is-active","is-leaving");
      startNightBedroomBgm();
    }, 1250);
    const character = $("#bedroomCharacter"); character.classList.add("is-arriving");
    setTimeout(() => {
      character.classList.remove("is-arriving"); character.classList.add("is-idle");
      state.phase = "bedroom-explore";
      state.bedroomCharacterClicked = false;
      clearTimeout(state.bedroomHintTimer);
      state.bedroomHintTimer = setTimeout(() => {
        if (state.phase === "bedroom-explore" && !state.bedroomCharacterClicked) $("#bedroomPatHint").classList.add("is-visible");
      }, 5000);
    }, 2100);
  }

  function activateCg(index) {
    const one = $(".cg-one");
    const two = $(".cg-two");
    one.classList.toggle("is-active", index === 1);
    two.classList.toggle("is-active", index === 2);
    if (index === 1) {
      cgOneVideo.currentTime = 0;
      cgOneVideo.play().catch(() => {});
    } else {
      cgOneVideo.pause();
    }
  }

  function renderKeepsakes() {
    const card = state.data.card || {}; $("#cardPreview").textContent = card.message || card.text || "HAPPY BIRTHDAY";
    const photo = state.data.photo || {}; const photoSrc = photo.photo || photo.dataUrl || photo.image;
    if (photoSrc) {
      $("#photoPreview").src = photoSrc;
      $("#photoPreview").style.opacity = 1;
      $("#memoryPhoto").src = photoSrc;
      $("#photoFramePreview").src = `../beach/assets/polaroid-frame-0${Number(photo.frame) || 1}.png`;
    } else {
      $("#photoPreview").removeAttribute("src");
      $("#photoFramePreview").removeAttribute("src");
      $("#photoPreview").style.opacity = .16;
      $("#memoryPhoto").src = "./assets/beach2-background.png";
    }
    const drinkMap = { americano:"drink-americano.png", american:"drink-americano.png", coffee:"drink-americano.png", chamomile:"drink-tea.png", tea:"drink-tea.png", strawberry:"drink-strawberry.png", milkshake:"drink-strawberry.png" };
    const drinkKey = String(state.data.drinkId || "").toLowerCase();
    const drinkAsset = Object.entries(drinkMap).find(([key]) => drinkKey.includes(key));
    if (drinkAsset) {
      const drinkType = drinkAsset[1].replace("drink-", "").replace(".png", "");
      $("#drinkPreview").src = `./assets/${drinkAsset[1]}`;
      $("#drinkKeepsake").dataset.drink = drinkType;
    } else {
      $("#drinkPreview").removeAttribute("src");
    }
    const cake = state.data.cakeConfig || {};
    $("#cakeCream").classList.toggle("is-visible", Boolean(cake.pipingDone));
    const decorations = $("#cakeDecorations");
    decorations.replaceChildren();
    const decorationAssets = {
      cherry: "restaurant-cherry.png", strawberry: "restaurant-strawberry.png",
      star: "restaurant-star.png", chocolate: "restaurant-choco.png",
      cookie: "restaurant-cookie.png", candle: "restaurant-candle.png",
    };
    (cake.pieces || []).forEach(piece => {
      const asset = decorationAssets[piece.id];
      if (!asset) return;
      const image = document.createElement("img");
      image.className = "cake-decoration";
      image.src = `../restaurant/assets/${asset}`;
      image.alt = "";
      image.draggable = false;
      image.style.left = `${((Number(piece.x) - 655) / 610) * 100}%`;
      image.style.top = `${((Number(piece.y) - 429) / 610) * 100}%`;
      const size = (piece.zone === "bearHead" ? 108 : 94) / 610 * 100;
      image.style.width = `${size}%`;
      image.style.height = `${size}%`;
      decorations.append(image);
    });
  }

  function personalizeBedroomLine(line, index) {
    if (index !== 1) return line;
    const outfitNames = { zh:{cuteez:"CUTEEZ",plaid:"格子衬衫",striped:"亨利衫"}, ko:{cuteez:"CUTEEZ",plaid:"체크 셔츠",striped:"헨리넥 셔츠"}, en:{cuteez:"CUTEEZ outfit",plaid:"plaid shirt",striped:"Henley shirt"} };
    const name = outfitNames[state.language][state.outfit];
    if (state.language === "zh") return `早上叫我起床，还帮我选了${name}，陪我慢慢走了一路。`;
    if (state.language === "ko") return `아침에 깨워주고, ${name}도 골라주고, 같이 천천히 걸어줬잖아.`;
    return `You woke me up, picked the ${name}, and walked slowly with me all day.`;
  }
  async function startBedroomDialogue() {
    if (state.phase !== "bedroom-explore") return;
    state.phase = "bedroom-dialogue";
    state.bedroomCharacterClicked = true;
    clearTimeout(state.bedroomHintTimer);
    $("#bedroomPatHint").classList.remove("is-visible");
    $("#bedroomKeepsakes").style.pointerEvents = "none";
    await waitForTimedText(bedroomSpeech, t("prepared"), 2700, 300);
    await waitForTimedText(bedroomSpeech, personalizeBedroomLine(t("bedroomLines")[0], 0), 3000, 420);
    await wait(900);
    const cg = $("#cgLayer"); cg.classList.add("is-visible"); activateCg(1);
    bedroomSpeech.classList.add("is-cg-mode");
    await wait(1500);
    for (let index=1; index<t("bedroomLines").length; index+=1) {
      await waitForAdvance(bedroomSpeech, personalizeBedroomLine(t("bedroomLines")[index], index), 700, 0, bedroomContinueButton);
    }
    setTime("23:55");
    await waitForAdvance(bedroomSpeech, t("fiveMinutes"), 700, 0, bedroomContinueButton);
    await waitForAdvance(bedroomSpeech, t("noClock"), 700, 0, bedroomContinueButton);
    beginClockEnding();
  }

  async function beginClockEnding() {
    state.phase = "ending-clock";
    fadeAudio(homeAudio, 0, 1800, true);
    activateCg(2);
    await wait(1350);
    hudTime.classList.add("is-flickering");
    await wait(2350);
    hudTime.classList.add("is-extinguished");
    await wait(1150);
    activateCg(1);
    const ambientTarget = .06;
    if (!oceanAudio.paused) fadeAudio(oceanAudio, ambientTarget, 2100);
    await wait(600);
    let musicBoxPlayed = false;
    if (state.soundOn) {
      musicBoxAudio.volume = 0; musicBoxAudio.loop = false;
      musicBoxPlayed = await tryPlay(musicBoxAudio, 0);
      if (musicBoxPlayed) fadeAudio(musicBoxAudio, .7, 2500);
      else playMusicBoxFallback();
    }
    if (musicBoxPlayed) {
      await new Promise((resolve) => {
        const safety = setTimeout(resolve, 23000);
        musicBoxAudio.addEventListener("ended", () => { clearTimeout(safety); resolve(); }, { once:true });
      });
    } else {
      await wait(12200);
    }
    await waitForAction(bedroomContinueButton, t("replyThanks"));
    await waitForTimedText(bedroomSpeech, t("takePhoto"), 3200, 450);
    await playFinaleVideo();
  }
  function playFinaleVideo() {
    return new Promise((resolve) => {
      const video = $("#finaleVideo"); const fallback = $("#videoFallback"); let shown = false;
      const blackScreenCue = 11.9;
      const reveal = () => {
        if (shown) return;
        shown = true;
        showBirthdayMoment();
        resolve();
      };
      const fallbackMode = () => {
        video.classList.remove("is-active"); fallback.classList.add("is-active");
        setTimeout(reveal, blackScreenCue * 1000);
      };
      video.currentTime = 0; video.muted = true; video.classList.add("is-active");
      state.finaleAudioStarted = false; state.finaleAudioFinished = false;
      finaleAudio.currentTime = 0; finaleAudio.volume = state.soundOn ? .82 : 0;
      finaleAudio.play().then(() => { state.finaleAudioStarted = true; }).catch(() => {
        state.finaleAudioFinished = true;
        bridge?.onFinaleAudioEnded?.();
      });
      video.ontimeupdate = () => { if (video.currentTime >= blackScreenCue) reveal(); };
      video.onerror = fallbackMode;
      video.play().catch(fallbackMode);
      setTimeout(reveal, 12400);
    });
  }
  function showBirthdayMoment() {
    state.phase = "ending-response";
    setTime("00:00 / OCT 13");
    hudTime.classList.remove("is-extinguished","is-flickering");
    hud.classList.add("is-time-only");
    const moment = $("#birthdayMoment");
    moment.classList.add("is-active");
    clearTimeout(state.responseTimer);
    state.responseTimer = setTimeout(() => moment.classList.add("is-response-ready"), 2100);
  }
  async function finishMainStory() {
    if (state.phase !== "ending-response") return;
    state.phase = "ending-message";
    const video = $("#finaleVideo"); video.pause(); video.classList.remove("is-active");
    $("#videoFallback").classList.remove("is-active");
    clearTimeout(state.responseTimer);
    $("#birthdayMoment").classList.remove("is-active", "is-response-ready");
    activateCg(1); $("#cgLayer").classList.add("is-visible");
    await wait(1450); $("#finalBlack").classList.add("is-active");
    window.dispatchEvent(new CustomEvent("orbit:main-story-complete", { detail: { completedAt:"00:00 / OCT 13" } }));
    try { localStorage.setItem("orbit:mainStoryComplete", "true"); } catch (_) {}
  }

  async function enterEpilogue() {
    if (state.phase !== "ending-message") return;
    state.phase = "epilogue";
    if (bridge?.enterEpilogue) {
      bridge.enterEpilogue();
      return;
    }
    hud.classList.add("is-hidden");
    $("#epilogue").classList.add("is-active");
  }

  async function saveMemoryCard() {
    const canvas = $("#memoryCanvas"); const context = canvas.getContext("2d");
    context.fillStyle = "#fffaf0"; context.fillRect(0,0,canvas.width,canvas.height);
    context.fillStyle = "#6f8650"; context.font = "700 54px Georgia"; context.fillText("ORBIT 10:12",80,110);
    const source = $("#memoryPhoto");
    const sourceUrl = source.currentSrc || source.src || "";
    if (sourceUrl.startsWith("data:")) {
      try { await source.decode(); context.drawImage(source,80,170,1040,1100); }
      catch (_) { context.fillStyle="#d7d0c3"; context.fillRect(80,170,1040,1100); }
    } else {
      const gradient = context.createLinearGradient(80,170,1120,1270);
      gradient.addColorStop(0,"#d8a272"); gradient.addColorStop(.5,"#778193"); gradient.addColorStop(1,"#293b54");
      context.fillStyle=gradient; context.fillRect(80,170,1040,1100);
    }
    context.fillStyle="#29231f"; context.textAlign="center"; context.font="700 42px Arial"; context.fillText("See you again next year.",600,1390);
    const link=document.createElement("a"); link.download=`ORBIT-10-12-memory-${Date.now()}.png`; link.href=canvas.toDataURL("image/png"); link.click();
  }

  function bindEvents() {
    $$(".hotspot").forEach((node) => node.addEventListener("click", (event) => {
      unlockAudio();
      wobble(event.currentTarget);
      registerInvalidClick();
    }));
    characterButton.addEventListener("click", () => { unlockAudio(); squishCharacter(); resetIdleTimer(); });
    standingCharacter.addEventListener("click", () => { unlockAudio(); squishNode(standingCharacter); startGoHomeDialogue(); });
    $$(".keepsake").forEach((node) => node.addEventListener("click", (event) => {
      if (state.phase !== "bedroom-explore") return;
      wobble(event.currentTarget);
    }));
    $("#bedroomCharacter").addEventListener("click", () => { unlockAudio(); squishNode($("#bedroomCharacter")); startBedroomDialogue(); });
    stage.addEventListener("pointerdown", () => { unlockAudio(); if (state.phase === "beach-explore") resetIdleTimer(); }, { passive:true });
    soundButton.addEventListener("click", toggleSound);
    $("#backButton").addEventListener("click", () => bridge?.returnToBeach?.());
    $("#skipTransition").addEventListener("click", enterBedroom);
    $("#happinessButton").addEventListener("click", finishMainStory);
    $("#finalBlack").addEventListener("click", enterEpilogue);
    finaleAudio.addEventListener("ended", () => {
      state.finaleAudioFinished = true;
      bridge?.onFinaleAudioEnded?.();
    });
    $("#memoryEntry").addEventListener("click", () => $("#memoryPanel").classList.add("is-active"));
    $("#letterEntry").addEventListener("click", () => $("#letterPanel").classList.add("is-active"));
    $$(".panel-back").forEach((button) => button.addEventListener("click", () => button.closest(".epilogue-panel").classList.remove("is-active")));
    $("#saveMemory").addEventListener("click", saveMemoryCard);
    addEventListener("resize", resizeStage);
    window.visualViewport?.addEventListener("resize", resizeStage);
  }

  function applyLanguage() {
    $("#transitionPlace").textContent = t("place"); $("#thankYouLine").textContent = t("thankYou"); $("#epilogueHint").textContent = t("epilogueHint"); $("#letterPlaceholder").textContent = t("letter");
    document.documentElement.lang = state.language === "zh" ? "zh-CN" : state.language;
  }
  async function init() {
    resizeStage(); loadPersistentData(); applyOutfit(); applyLanguage(); bindEvents(); renderKeepsakes();
    oceanAudio.loop = true; singingAudio.loop = false; oceanAudio.volume=.42; singingAudio.volume=.24;
    setBeachInteraction(false);
    const autoOcean = await tryPlay(oceanAudio,.42);
    if (autoOcean) state.audioUnlocked=true;
    setScene(beachScene); state.phase="beach-waiting"; scheduleBird();
    await wait(500); $("#openingBlack").classList.add("is-gone");
    await wait(1500); $("#openingBlack").style.display="none";
    await wait(2000);
    state.phase="beach-listening";
    beginSingingPlayback();
  }
  window.orbitFinaleScene = {
    setLanguage(language) {
      state.language = languageAliases[String(language).toLowerCase()] || "zh";
      applyLanguage();
    },
    setSound(enabled) {
      state.soundOn = Boolean(enabled);
      soundButton.classList.toggle("is-muted", !state.soundOn);
      soundButton.setAttribute("aria-pressed", String(state.soundOn));
      [oceanAudio,singingAudio,homeTransitionAudio,homeAudio,musicBoxAudio,finaleAudio,thinkingVideo].forEach(audio => { audio.muted = !state.soundOn; });
      if (state.soundOn) unlockAudio();
    },
    fadeForEpilogue() {
      [oceanAudio, singingAudio, homeTransitionAudio, homeAudio, musicBoxAudio].forEach(audio => fadeAudio(audio, 0, 900, true));
      stopSingingNotes(true);
      thinkingVideo.pause();
    },
    isFinaleAudioFinished() {
      return state.finaleAudioFinished || (!state.finaleAudioStarted && finaleAudio.paused);
    },
    shutdown() {
      clearTimeout(state.idleTimer);
      clearTimeout(state.birdTimer);
      clearTimeout(state.homeTransitionTimer);
      clearTimeout(state.bedroomHintTimer);
      clearTimeout(state.responseTimer);
      stopSingingNotes(true);
      [oceanAudio, singingAudio, homeTransitionAudio, homeAudio, musicBoxAudio, finaleAudio].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      thinkingVideo.pause();
      $("#finaleVideo").pause();
    },
  };
  init();
})();
