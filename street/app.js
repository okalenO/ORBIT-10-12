(() => {
  "use strict";

  const {realProp, magazineHit, drinkMarkup} = window.orbitStreetArt;
  const bridge = window.parent !== window ? window.parent.orbitStreet : null;
  const settings = bridge?.getSettings() || {language: "zh", sound: true};
  let language = settings.language;
  const STAGE_W = 1920;
  const STAGE_H = 1080;
  const TRACK_W = 14800;
  const PLAYER_X = 656;
  const ROAD_BOTTOM = 1350;
  const CHARACTER_SCALE = 0.44;
  const COPIES = [0, TRACK_W, TRACK_W * 2];
  const OCEAN_START = 8750;
  const OCEAN_END = 11100;
  const OCTOPUS_X = 10830;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const stage = $("#stage");
  const sceneCamera = $("#sceneCamera");
  const world = $("#streetWorld");
  const roadSvg = $("#roadSvg");
  const roadCopies = $("#roadCopies");
  const skyWorldLayer = $("#skyWorldLayer");
  const oceanLayer = $("#oceanLayer");
  const propsLayer = $("#propsLayer");
  const foregroundLayer = $("#foregroundWorld");
  const characterRig = $("#characterRig");
  const characterImage = $("#characterImage");
  const drinkRig = $("#drinkRig");
  const drinkCup = $("#drinkCup");
  const tentacleRig = $("#tentacleRig");
  const pirateHatRig = $("#pirateHatRig");
  const pirateShipRig = $("#pirateShipRig");
  const dialogueSign = $("#dialogueSign");
  const dialogueText = $("#dialogueText");
  const flyingBird = $("#flyingBird");
  const coffeeOverlay = $("#coffeeOverlay");
  const restaurantOverlay = $("#restaurantOverlay");
  const confirmDrink = $("#confirmDrink");
  const menuBear = $("#menuBear");
  const menuWalker = $("#menuWalker");
  const menuBearText = $("#menuBearText");
  const transition = $("#transition");
  const transitionVideo = $("#transitionVideo");
  const pageTurnAudio = new Audio("./assets/audio/page-turn.mp3");
  const chimeAudio = new Audio("./assets/audio/wind-chime.mp3");
  pageTurnAudio.preload = "auto";
  chimeAudio.preload = "auto";

  roadSvg.setAttribute("viewBox", `0 0 ${TRACK_W * 3} 1350`);
  roadSvg.style.width = `${TRACK_W * 3}px`;
  world.style.width = `${TRACK_W * 3}px`;
  foregroundLayer.style.width = `${TRACK_W * 3}px`;

  const outfitConfig = {
    plaid: { src: "./assets/character-plaid.png", bbox: { x: 56, y: 314, w: 576, h: 711 } },
    cuteez: { src: "./assets/character-cuteez.png", bbox: { x: 53, y: 306, w: 579, h: 719 } },
    striped: { src: "./assets/character-striped.png", bbox: { x: 53, y: 306, w: 579, h: 719 } },
  };

  const drinkConfig = {
    americano: { bear: "./assets/menu-bear1.png", line: "果然你最懂我", label: "AMERICANO" },
    chamomile: { bear: "./assets/menu-bear2.png", line: "喝这个嗓子会很舒服~~", label: "TEA" },
    strawberry: { bear: "./assets/menu-bear3.png", line: "好甜！！;;;", label: "SHAKE" },
  };

  const sceneItems = [
    { id: "cat", x: 1050, type: "cat", trigger: "near", dialogue: "小猫好可爱~~", resetDistance: 1000 },
    { id: "tree", x: 2050, type: "tree", asset: "./assets/street-tree-v4-01.png", trigger: "near", dialogue: "已经是秋天了", resetDistance: 470 },
    { id: "coffee", x: 3450, type: "coffee", trigger: "click", nearDialogue: "要不要进去买一杯咖啡呢？" },
    { id: "kq", x: 4650, type: "building", trigger: "click", dialogue: "今天就先不去公司了吧  ^^" },
    { id: "gift", x: 5850, type: "gift", trigger: "hover", dialogue: "这个有点像我诶", resetDistance: 450 },
    { id: "magazine", x: 7100, type: "magazine", trigger: "click", dialogue: "很新奇的造型吧~？我也有些不习惯呢，以后会展示更多不同的面貌的！" },
    { id: "billboard", x: 8250, type: "billboard", trigger: "near", dialogue: "是我们的广告牌，8m1t！", resetDistance: 500 },
    { id: "bird", x: 12050, type: "bird", trigger: "near", resetDistance: 1000 },
    { id: "restaurant", x: 13500, type: "restaurant", trigger: "click", nearDialogue: "我们到了~" },
  ];

  const sceneDecor = [
    { x: 260, asset: "street-grass-v4-01.png", width: 150, flip: true, layer: "front" },
    { x: 520, asset: "street-house-display.png", width: 300, layer: "back" },
    { x: 760, asset: "street-grass-v4-03.png", width: 75, layer: "front" },
    { x: 1510, asset: "street-aniteez-01.png", width: 145, layer: "back", kind: "aniteez" },
    { x: 1680, asset: "street-grass-v4-05.png", width: 205, layer: "front" },
    { x: 2500, asset: "street-bench-display.png", width: 255, layer: "back" },
    { x: 2860, asset: "street-grass-v4-02.png", width: 82, flip: true, layer: "front" },
    { x: 3060, asset: "street-aniteez-02.png", width: 118, layer: "back", kind: "aniteez" },
    { x: 3920, asset: "street-grass-v4-01.png", width: 145, layer: "front" },
    { x: 4180, asset: "street-tree-v4-02.png", width: 330, flip: true, layer: "back" },
    { x: 5050, asset: "street-grass-v4-03.png", width: 70, layer: "front" },
    { x: 5380, asset: "street-aniteez-03.png", width: 145, flip: true, layer: "back", kind: "aniteez" },
    { x: 6270, asset: "street-grass-v4-04.png", width: 210, flip: true, layer: "front" },
    { x: 6500, asset: "street-house-display.png", width: 265, flip: true, layer: "back" },
    { x: 6800, asset: "street-grass-v4-02.png", width: 78, layer: "front" },
    { x: 7700, asset: "street-aniteez-04.png", width: 150, layer: "back", kind: "aniteez" },
    { x: 8010, asset: "street-grass-v4-05.png", width: 190, flip: true, layer: "front" },
    { x: 11480, asset: "street-grass-v4-01.png", width: 145, layer: "front" },
    { x: 11620, asset: "street-tree-v4-02.png", width: 315, layer: "back" },
    { x: 12450, asset: "street-grass-v4-03.png", width: 72, flip: true, layer: "front" },
    { x: 12800, asset: "street-grass-v4-04.png", width: 225, flip: true, layer: "front" },
    { x: 13200, asset: "street-grass-v4-02.png", width: 76, layer: "front" },
    { x: 1830, asset: "supplement/street-aniteez5.png", width: 135, layer: "back", kind: "aniteez" },
    { x: 4300, asset: "supplement/street-aniteez6.png", width: 125, layer: "back", kind: "aniteez" },
    { x: 7350, asset: "supplement/street-aniteez7.png", width: 135, layer: "back", kind: "aniteez" },
    { x: 12600, asset: "supplement/street-aniteez8.png", width: 135, layer: "back", kind: "aniteez" },
    { x: 14220, asset: "street-bench-display.png", width: 230, flip: true, layer: "back" },
    { x: 14510, asset: "street-grass-v4-05.png", width: 195, layer: "front" },
  ];

  const busElements = [];

  const state = {
    position: 260,
    targetPosition: 260,
    velocity: 0,
    lap: 0,
    outfit: readStoredOutfit(),
    selectedDrink: null,
    coffeeUsedThisLap: false,
    selectedDrinkDraft: null,
    octopusDefeated: false,
    octopusAttackPlaying: false,
    oceanRewardGiven: false,
    wasInOcean: false,
    hasTentacle: false,
    overlayOpen: false,
    transitionActive: true,
    soundOn: settings.sound,
    pointerDown: false,
    pointerDragged: false,
    lastPointerX: 0,
    dialogueTimer: null,
    birdFlightTimer: null,
    magazineDialogueShown: false,
    lastInteractionX: NaN,
    lastInteractionTime: 0,
    lastTime: performance.now(),
    look: { x: 0, y: 0, targetX: 0, targetY: 0 },
    activation: new Map(sceneItems.map((item) => [item.id, { armed: true, nearAnnounced: false }])),
  };
  const propCache = new Map();
  const itemHalfWidths = new Map();
  let aniteezElements = [];
  let worldVisuals = [];

  function propsFor(id) {
    if (!propCache.has(id)) propCache.set(id, Array.from($$(`.prop[data-id="${id}"]`)));
    return propCache.get(id);
  }

  function cacheSceneElements() {
    sceneItems.forEach(item => {
      const props = propsFor(item.id);
      itemHalfWidths.set(item.id, Math.max(...props.map(prop => prop.offsetWidth / 2)));
    });
    aniteezElements = Array.from($$(".is-aniteez"));
    worldVisuals = Array.from($$(".prop,.scene-decor,.world-cloud,.world-balloon")).map(element => ({
      element,
      x: Number.parseFloat(element.style.left) || 0,
    }));
    updateVisibleWorld(mod(state.position, TRACK_W));
  }

  function updateVisibleWorld(localX) {
    const worldCenter = localX + TRACK_W;
    const minX = worldCenter - PLAYER_X - 900;
    const maxX = worldCenter + (STAGE_W - PLAYER_X) + 900;
    worldVisuals.forEach(entry => {
      entry.element.style.visibility = entry.x >= minX && entry.x <= maxX ? "visible" : "hidden";
    });
  }

  function tr(text) {
    const row = window.orbitStreetCopy[text];
    return row ? (language === "en" ? row[0] : language === "ko" ? row[1] : row[2] || text) : text;
  }
  function syncCopy() {
    document.documentElement.lang = language;
    $$("[data-copy]").forEach(el => { el.textContent = tr(el.dataset.copy); });
    $$("[aria-label],[alt]").forEach(el => {
      for (const attr of ["aria-label", "alt"]) {
        const value = el.getAttribute(attr); if (!value) continue;
        const key = attr === "alt" ? "altCopy" : "labelCopy";
        el.dataset[key] ||= value;
        el.setAttribute(attr, tr(el.dataset[key]));
      }
    });
  }
  function mod(value, divisor) { return ((value % divisor) + divisor) % divisor; }
  function smoothstep(value) { const x = Math.min(1, Math.max(0, value)); return x * x * (3 - 2 * x); }

  function routeY(x) {
    const t = mod(x, TRACK_W) / TRACK_W;
    let y = 777 + Math.sin(t * Math.PI * 2) * 7;
    if (t >= 0.30 && t < 0.41) y -= 145 * smoothstep((t - 0.30) / 0.11);
    else if (t >= 0.41 && t < 0.47) y -= 145;
    else if (t >= 0.47 && t < 0.58) y -= 145 * (1 - smoothstep((t - 0.47) / 0.11));
    return y;
  }

  function routeAngle(x) {
    const sample = 12;
    return Math.atan((routeY(x + sample) - routeY(x - sample)) / (sample * 2)) * 180 / Math.PI;
  }

  function makeLinePath(offsetX) {
    const points = [];
    for (let x = 0; x < TRACK_W; x += 36) points.push(`${x + offsetX},${routeY(x).toFixed(2)}`);
    points.push(`${TRACK_W + offsetX},${routeY(TRACK_W).toFixed(2)}`);
    return `M ${points.join(" L ")}`;
  }

  function makeFillPath(offsetX) {
    return `${makeLinePath(offsetX)} L ${TRACK_W + offsetX},${ROAD_BOTTOM} L ${offsetX},${ROAD_BOTTOM} Z`;
  }

  function buildRoad() {
    const points = [];
    const total = TRACK_W * COPIES.length;
    for (let x = 0; x < total; x += 36) points.push(`${x},${routeY(x).toFixed(2)}`);
    points.push(`${total},${routeY(total).toFixed(2)}`);
    const linePath = `M ${points.join(" L ")}`;
    const fillPath = `${linePath} L ${total},${ROAD_BOTTOM} L 0,${ROAD_BOTTOM} Z`;
    roadCopies.innerHTML = `
      <path class="road-fill" d="${fillPath}"></path>
      <path class="road-wash" d="${fillPath}"></path>
      <path class="road-edge" d="${linePath}"></path>
      <path class="road-stitch" d="${linePath}" transform="translate(0 18)"></path>`;
  }

  function bouncePart(props, selector) {
    props.forEach(prop => {
      const part = prop.querySelector(selector);
      if (!part) return;
      part.classList.remove("part-shake"); void part.offsetWidth;
      part.classList.add("part-shake");
    });
  }
  function colorFor(id) {
    return ({ cat: "#eaa7ad", tree: "#c77a3d", coffee: "#c9b9e7", kq: "#718dce", gift: "#e69ca5", magazine: "#e8e5d9", billboard: "#4c5eb2", bird: "#b9d73a", restaurant: "#ddbc73" })[id] || "#718dce";
  }

  function makeOcean(copyOffset) {
    const ocean = document.createElement("div");
    ocean.className = "ocean-zone";
    ocean.style.left = `${OCEAN_START + copyOffset}px`;
    ocean.style.top = "0px";
    ocean.style.setProperty("--ocean-top", `${routeY(OCEAN_START) - 2}px`);
    ocean.innerHTML = `
      <div class="ocean-paper"></div>
      <div class="octopus" data-octopus="true" role="button" aria-label="点击赶走章鱼" tabindex="0">
        <img class="octopus-art" src="./assets/street-octopus-display.png" alt="章鱼" draggable="false">
      </div>
      <div class="strike-rig"><img class="strike-mark" src="./assets/street-boom-display.png" alt=""></div>`;
    return ocean;
  }

  function makeWaveCover(copyOffset) {
    const cover = document.createElement("div");
    cover.className = "wave-row";
    cover.style.left = `${OCEAN_START + copyOffset - 35}px`;
    cover.style.top = `${routeY(OCEAN_START) - 44}px`;
    cover.innerHTML = `
      <img class="wave-piece wave-piece--left" src="./assets/street-wave-display.png" alt="">
      <img class="wave-piece wave-piece--right" src="./assets/street-wave-display.png" alt="">`;
    return cover;
  }

  function buildProps() {
    const fragment = document.createDocumentFragment();
    const foregroundFragment = document.createDocumentFragment();
    const oceanFragment = document.createDocumentFragment();
    const skyFragment = document.createDocumentFragment();
    COPIES.forEach((copyOffset) => {
      sceneItems.forEach((item) => {
        const prop = document.createElement("div");
        prop.className = `prop prop--${item.type}`;
        prop.dataset.id = item.id;
        prop.dataset.clickable = String(item.trigger === "click");
        prop.style.left = `${item.x + copyOffset}px`;
        prop.style.top = `${routeY(item.x) + 9}px`;
        prop.style.setProperty("--prop-color", colorFor(item.id));
        if (item.id === "bird") {
          prop.innerHTML = `<div class="station-bird">
            <img class="station-art" src="./assets/street-station-display.png" alt="站牌" draggable="false">
            <img class="bird-art bird-standing" src="./assets/street-bird-standing.png" alt="小鸟" draggable="false">
          </div>`;
        } else {
          prop.innerHTML = item.asset
            ? `<img class="prop-visual prop-image" src="${item.asset}" alt="" draggable="false">`
            : `<div class="prop-visual"></div>`;
        }
        const art = realProp(item.id);
        if (art) { prop.innerHTML = art; prop.classList.add("has-real-art"); }
        fragment.appendChild(prop);
      });

      const bike = document.createElement("img");
      bike.className = "street-bike";
      bike.src = "./assets/street-bike.png";
      bike.alt = "";
      bike.draggable = false;
      bike.style.left = `${2770 + copyOffset}px`;
      bike.style.top = `${routeY(2770) + 6}px`;
      fragment.appendChild(bike);

      sceneDecor.forEach((item) => {
        const decor = document.createElement("img");
        const grass = item.asset.includes("grass");
        decor.className = `scene-decor is-${item.layer}${item.flip ? " is-flipped" : ""}${grass ? " is-grass" : ""}${item.kind === "aniteez" ? " is-aniteez" : ""}`;
        decor.src = `./assets/${item.asset}`;
        if (item.kind === "aniteez") decor.dataset.worldX = item.x;
        decor.alt = "";
        decor.draggable = false;
        decor.style.left = `${item.x + copyOffset}px`;
        decor.style.top = `${routeY(item.x) + 7}px`;
        decor.style.width = `${item.width}px`;
        (item.layer === "front" ? foregroundFragment : fragment).appendChild(decor);
      });

      const cloudData = [
        { x: 1250, y: 175, src: "street-cloud-01.png", width: 285, flip: false, delay: -2 },
        { x: 5200, y: 105, src: "street-cloud-02.png", width: 355, flip: true, delay: -7 },
        { x: 10100, y: 245, src: "street-cloud-01.png", width: 225, flip: true, delay: -4, small: true },
        { x: 13700, y: 135, src: "street-cloud-02.png", width: 315, flip: false, delay: -10 },
      ];
      cloudData.forEach((item) => {
        const cloud = document.createElement("img");
        cloud.className = `world-cloud${item.flip ? " is-flipped" : ""}${item.small ? " is-small" : ""}`;
        cloud.src = `./assets/${item.src}`;
        cloud.alt = "";
        cloud.draggable = false;
        cloud.style.left = `${item.x + copyOffset}px`;
        cloud.style.top = `${item.y}px`;
        cloud.style.width = `${item.width}px`;
        cloud.style.animationDelay = `${item.delay}s`;
        skyFragment.appendChild(cloud);
      });

      const balloon = document.createElement("i");
      balloon.className = "world-balloon";
      balloon.style.left = `${6850 + copyOffset}px`;
      balloon.style.top = "345px";
      skyFragment.appendChild(balloon);

      const bus = document.createElement("img");
      bus.className = "street-bus";
      bus.src = "./assets/street-bus.png";
      bus.alt = "";
      bus.draggable = false;
      bus.dataset.copyOffset = String(copyOffset);
      busElements.push(bus);
      skyFragment.appendChild(bus);

      oceanFragment.appendChild(makeOcean(copyOffset));
      foregroundFragment.appendChild(makeWaveCover(copyOffset));
    });
    skyWorldLayer.appendChild(skyFragment);
    oceanLayer.appendChild(oceanFragment);
    propsLayer.appendChild(fragment);
    foregroundLayer.appendChild(foregroundFragment);

    propsLayer.addEventListener("click", (event) => {
      if (state.pointerDragged || state.overlayOpen || state.transitionActive) return;
      const octopus = event.target.closest("[data-octopus]");
      if (octopus) { defeatOctopus(); return; }
      const prop = event.target.closest(".prop[data-clickable=\"true\"]");
      if (prop?.dataset.id === "magazine" && !magazineHit(event)) return;
      if (!prop) return;
      const item = sceneItems.find((candidate) => candidate.id === prop.dataset.id);
      if (!item || Math.abs(circularDelta(item.x, mod(state.position, TRACK_W))) > 570) return;
      handleItemClick(item);
    });

    propsLayer.addEventListener("pointerover", (event) => {
      const prop = event.target.closest('.prop[data-id="gift"],.prop[data-id="restaurant"]');
      if (!prop || prop.contains(event.relatedTarget) || state.overlayOpen || state.transitionActive) return;
      const item = sceneItems.find(candidate => candidate.id === prop.dataset.id);
      if (!item) return;
      if (item.id === "gift") {
        bouncePart(propsFor("gift"), ".teddy-part");
        showDialogue(item.dialogue, 2800);
      } else {
        bouncePart(propsFor("restaurant"), ".chime-part");
        playChime();
      }
    });

    propsLayer.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-octopus]")) defeatOctopus();
    });

    oceanLayer.addEventListener("click", (event) => {
      if (state.pointerDragged || state.overlayOpen || state.transitionActive) return;
      if (event.target.closest("[data-octopus]")) defeatOctopus();
    });
    oceanLayer.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-octopus]")) defeatOctopus();
    });
  }

  function circularDelta(itemX, currentX) {
    let delta = itemX - currentX;
    if (delta > TRACK_W / 2) delta -= TRACK_W;
    if (delta < -TRACK_W / 2) delta += TRACK_W;
    return delta;
  }

  function updateScale() {
    stage.style.setProperty("--stage-scale", String(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H)));
  }

  function readStoredOutfit() {
    if (settings.outfit) return ({cuteez: "cuteez", plaid: "striped", henley: "plaid"})[settings.outfit] || "cuteez";
    const keys = ["orbit:selectedOutfit", "orbit-outfit", "selectedOutfit", "selected_outfit"];
    for (const key of keys) {
      let stored = null;
      try { stored = localStorage.getItem(key); } catch (_error) { return "plaid"; }
      if (!stored) continue;
      const normalized = stored.toLowerCase();
      if (normalized.includes("cute")) return "cuteez";
      if (normalized.includes("plaid") || normalized.includes("check") || normalized.includes("格子")) return "plaid";
      if (normalized.includes("stripe") || normalized.includes("henley") || normalized.includes("亨利")) return "striped";
    }
    return "plaid";
  }

  function setOutfit(outfit) {
    const config = outfitConfig[outfit] || outfitConfig.plaid;
    state.outfit = outfitConfig[outfit] ? outfit : "plaid";
    characterImage.src = config.src;
    characterImage.style.left = `${-(config.bbox.x + config.bbox.w / 2) * CHARACTER_SCALE}px`;
    characterImage.style.top = `${-(config.bbox.y + config.bbox.h) * CHARACTER_SCALE}px`;
    menuWalker.src = config.src;

    $$('[data-outfit]').forEach((button) => button.classList.toggle("is-selected", button.dataset.outfit === state.outfit));
  }

  function resetLap(nextLap = 0) {
    state.lap = nextLap;
    state.coffeeUsedThisLap = false;
    state.selectedDrink = null;
    bridge?.setDrink(null);
    state.selectedDrinkDraft = null;
    state.octopusDefeated = false;
    state.octopusAttackPlaying = false;
    state.oceanRewardGiven = false;
    state.wasInOcean = false;
    state.hasTentacle = false;
    drinkRig.classList.add("is-hidden");
    drinkRig.classList.remove("is-tossing");
    tentacleRig.classList.add("is-hidden");
    tentacleRig.classList.remove("is-popping");
    drinkCup.removeAttribute("data-drink");
    state.activation.forEach((entry) => { entry.armed = true; entry.nearAnnounced = false; entry.doorArmed = true; });
    $$(".prop").forEach((prop) => prop.classList.remove("is-activated", "is-flipped", "is-near", "cat-switched", "clerk-visible", "sign-lit", "doors-open", "bird-departed"));
    flyingBird.classList.remove("is-flying");
    $$(".octopus").forEach((octopus) => octopus.classList.remove("is-defeated"));
    $$(".strike-rig").forEach((rig) => rig.classList.remove("is-swinging"));
  }

  function showDialogue(text, duration = 3000) {
    if (!text) return;
    clearTimeout(state.dialogueTimer);
    dialogueSign.classList.remove("is-visible");
    void dialogueSign.offsetWidth;
    dialogueText.dataset.copy = text;
    dialogueText.textContent = tr(text);
    dialogueSign.classList.add("is-visible");
    state.dialogueTimer = window.setTimeout(() => dialogueSign.classList.remove("is-visible"), duration);
  }

  function markActivated(id, active = true) {
    propsFor(id).forEach((prop) => prop.classList.toggle("is-activated", active));
    if (active) window.setTimeout(() => propsFor(id).forEach((prop) => { if (id !== "bird") prop.classList.remove("is-activated"); }), id === "billboard" ? 2800 : 1500);
  }

  function launchBird() {
    const source = propsFor("bird").find((prop) => {
      if (prop.style.visibility === "hidden") return false;
      const rect = prop.querySelector(".bird-standing")?.getBoundingClientRect();
      return rect && rect.right > 0 && rect.left < window.innerWidth;
    });
    const bird = source?.querySelector(".bird-standing");
    if (!bird) return;

    const stageRect = stage.getBoundingClientRect();
    const birdRect = bird.getBoundingClientRect();
    const scale = stageRect.width / STAGE_W || 1;
    flyingBird.style.left = `${(birdRect.left + birdRect.width / 2 - stageRect.left) / scale}px`;
    flyingBird.style.top = `${(birdRect.top - stageRect.top) / scale}px`;
    propsFor("bird").forEach((prop) => prop.classList.add("bird-departed"));
    flyingBird.classList.remove("is-flying");
    void flyingBird.offsetWidth;
    flyingBird.classList.add("is-flying");
    window.clearTimeout(state.birdFlightTimer);
    state.birdFlightTimer = window.setTimeout(() => flyingBird.classList.remove("is-flying"), 1850);
  }

  function activateNearItem(item) {
    if (item.id === "bird") launchBird();
    else markActivated(item.id, true);
    if (item.dialogue) showDialogue(item.dialogue, item.id === "billboard" ? 3500 : 2800);
    if (item.id === "tree") createLeaves(item.x);
    playPaperSound(item.id === "restaurant" ? 620 : 350);
  }

  function createLeaves(treeX) {
    COPIES.forEach((copyOffset) => {
      for (let i = 0; i < 3; i += 1) {
        const leaf = document.createElement("span");
        leaf.className = "leaf";
        leaf.style.left = `${treeX + copyOffset - 70 + i * 65}px`;
        leaf.style.top = `${routeY(treeX) - 310 + i * 22}px`;
        leaf.style.setProperty("--leaf-x", `${50 + i * 55}px`);
        leaf.style.setProperty("--leaf-y", `${250 + i * 30}px`);
        leaf.style.setProperty("--leaf-r", `${120 + i * 95}deg`);
        propsLayer.appendChild(leaf);
        window.setTimeout(() => leaf.remove(), 7200);
      }
    });
  }

  function handleItemClick(item) {
    if (item.id !== "magazine") playPaperSound(440);
    markActivated(item.id, true);
    if (item.id === "coffee") {
      if (state.coffeeUsedThisLap) { showDialogue("已经有一杯啦。", 2600); return; }
      openCoffee(); return;
    }
    if (item.id === "magazine") {
      $$(".prop--magazine").forEach((prop) => prop.classList.toggle("is-flipped"));
      playPageTurn();
      if (!state.magazineDialogueShown) {
        state.magazineDialogueShown = true;
        showDialogue(item.dialogue, 5200);
      }
      return;
    }
    if (item.id === "restaurant") { openRestaurant(); return; }
    showDialogue(item.dialogue, 3200);
  }

  function openCoffee() {
    state.overlayOpen = true;
    state.selectedDrinkDraft = null;
    confirmDrink.disabled = true;
    menuBear.classList.remove("is-visible");
    menuBear.removeAttribute("src");
    menuBearText.classList.remove("is-visible");
    menuWalker.classList.remove("is-hidden");
    menuBearText.textContent = "";
    $$(".menu-drink").forEach((image) => image.classList.remove("is-selected"));
    coffeeOverlay.classList.add("is-open");
    coffeeOverlay.setAttribute("aria-hidden", "false");
    playPaperSound(680);
  }

  function closeCoffee(withDrink = false) {
    if (withDrink && !state.selectedDrinkDraft) return;
    if (withDrink) {
      state.selectedDrink = state.selectedDrinkDraft;
      state.coffeeUsedThisLap = true;
      drinkCup.dataset.drink = state.selectedDrink;
      drinkCup.innerHTML = drinkMarkup(state.selectedDrink);
      drinkRig.classList.remove("is-hidden");
      bridge?.setDrink(state.selectedDrink);
      try { localStorage.setItem("orbit:drinkId", state.selectedDrink); } catch (_error) {}
    }
    coffeeOverlay.classList.remove("is-open");
    coffeeOverlay.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      state.overlayOpen = false;
      if (withDrink) showDialogue("잘 마실게요~", 2600);
    }, 440);
  }

  function selectDrink(id) {
    const config = drinkConfig[id];
    if (!config) return;
    state.selectedDrinkDraft = id;
    confirmDrink.disabled = false;
    $$(".menu-drink").forEach((image) => image.classList.toggle("is-selected", image.classList.contains(`menu-drink--${id === "chamomile" ? "tea" : id}`)));
    menuBear.src = config.bear;
    menuBearText.dataset.copy = config.line;
    menuBearText.textContent = tr(config.line);
    menuWalker.classList.add("is-hidden");
    menuBear.classList.remove("is-visible");
    menuBearText.classList.remove("is-visible");
    void menuBear.offsetWidth;
    void menuBearText.offsetWidth;
    menuBear.classList.add("is-visible");
    menuBearText.classList.add("is-visible");
    playPaperSound(id === "strawberry" ? 690 : 520);
  }

  function openRestaurant() {
    state.overlayOpen = true;
    restaurantOverlay.classList.add("is-open");
    restaurantOverlay.setAttribute("aria-hidden", "false");
  }

  function closeRestaurant() {
    restaurantOverlay.classList.remove("is-open");
    restaurantOverlay.setAttribute("aria-hidden", "true");
    window.setTimeout(() => { state.overlayOpen = false; }, 380);
  }

  function enterRestaurant() {
    restaurantOverlay.classList.remove("is-open");
    restaurantOverlay.setAttribute("aria-hidden", "true");
    state.overlayOpen = false;
    if (bridge?.enterRestaurant) bridge.enterRestaurant();
    else closeRestaurant();
  }

  function defeatOctopus() {
    const localX = mod(state.position, TRACK_W);
    if (state.octopusDefeated || state.octopusAttackPlaying || Math.abs(circularDelta(OCTOPUS_X, localX)) > 650) return;
    state.octopusAttackPlaying = true;
    $$(".strike-rig").forEach((rig) => { rig.classList.remove("is-swinging"); void rig.offsetWidth; rig.classList.add("is-swinging"); });
    window.setTimeout(() => {
      state.octopusDefeated = true;
      state.octopusAttackPlaying = false;
      $$(".octopus").forEach((octopus) => octopus.classList.add("is-defeated"));
      playPaperSound(170);
      showDialogue("길을 비켜 줘~  让一下路吧~", 2600);
    }, 1750);
    window.setTimeout(() => { state.targetPosition += 160; }, 2350);
  }

  function oceanLiftAt(localX) {
    const ramp = 190;
    const lift = 74;
    if (localX <= OCEAN_START - ramp || localX >= OCEAN_END + ramp) return 0;
    if (localX < OCEAN_START + ramp) {
      return -lift * smoothstep((localX - (OCEAN_START - ramp)) / (ramp * 2));
    }
    if (localX > OCEAN_END - ramp) {
      return -lift * (1 - smoothstep((localX - (OCEAN_END - ramp)) / (ramp * 2)));
    }
    return -lift;
  }

  function revealTentacleReward() {
    state.hasTentacle = true;
    tentacleRig.classList.remove("is-hidden");
    tentacleRig.classList.remove("is-popping");
    void tentacleRig.offsetWidth;
    tentacleRig.classList.add("is-popping");
    playPaperSound(510);
  }

  function grantOceanReward() {
    if (state.oceanRewardGiven || !state.octopusDefeated) return;
    state.oceanRewardGiven = true;
    if (!drinkRig.classList.contains("is-hidden") && state.selectedDrink) {
      drinkRig.classList.add("is-tossing");
      window.setTimeout(() => {
        drinkRig.classList.add("is-hidden");
        drinkRig.classList.remove("is-tossing");
        state.selectedDrink = null;
        bridge?.setDrink(null);
        drinkCup.removeAttribute("data-drink");
        try { localStorage.removeItem("orbit:drinkId"); } catch (_error) {}
        revealTentacleReward();
      }, 2180);
    } else {
      revealTentacleReward();
    }
  }

  function clampAtOctopus(nextTarget) {
    if (state.octopusDefeated || nextTarget <= state.targetPosition) return nextTarget;
    const barrier = state.lap * TRACK_W + OCTOPUS_X - 185;
    if (state.position < barrier && nextTarget > barrier) {
      showDialogue("前面好像被挡住了……点一下看看？", 3000);
      return barrier;
    }
    return nextTarget;
  }

  function updateNearInteractions(localX) {
    sceneItems.forEach(item => {
      const delta = circularDelta(item.x, localX), distance = Math.abs(delta);
      const entry = state.activation.get(item.id);
      const props = propsFor(item.id);
      const half = itemHalfWidths.get(item.id) || 250;
      const visible = PLAYER_X + delta + half > 0 && PLAYER_X + delta - half < STAGE_W;
      props.forEach(prop => {
        prop.classList.toggle("is-near", distance < 500);
        prop.style.pointerEvents = ((item.trigger === "click" && distance < 570) || item.trigger === "hover" || item.id === "restaurant") ? "auto" : "none";
      });
      if (!visible) {
        entry.armed = true; entry.nearAnnounced = false;
        props.forEach(prop => prop.classList.remove("cat-switched", "clerk-visible", "sign-lit"));
        if (item.id === "bird") props.forEach(prop => prop.classList.remove("bird-departed"));
      }
      if (item.trigger === "near" && distance < 150 && entry.armed) {
        entry.armed = false; activateNearItem(item);
        if (item.id === "cat") props.forEach(prop => prop.classList.add("cat-switched"));
      }
      if (["coffee", "magazine", "restaurant"].includes(item.id) && distance < 225 && !entry.nearAnnounced) {
        entry.nearAnnounced = true;
        if (item.nearDialogue) showDialogue(item.nearDialogue, 3000);
        if (item.id === "coffee") props.forEach(prop => prop.classList.add("clerk-visible"));
        if (item.id === "magazine") bouncePart(props, ".magazine-button");
        if (item.id === "restaurant") {
          props.forEach(prop => prop.classList.add("sign-lit"));
        }
      }
      if (item.id === "kq") {
        if (distance > 430) entry.doorArmed = true;
        if (distance < 200 && entry.doorArmed !== false && !entry.doorBusy) {
          entry.doorArmed = false; entry.doorBusy = true;
          props.forEach(prop => prop.classList.add("doors-open"));
          window.setTimeout(() => {
            props.forEach(prop => prop.classList.remove("doors-open"));
            window.setTimeout(() => { entry.doorBusy = false; }, 650);
          }, 1650);
        }
      }
    });
    aniteezElements.forEach(decor => {
      const delta = circularDelta(Number(decor.dataset.worldX), localX);
      const visible = PLAYER_X + delta + 90 > 0 && PLAYER_X + delta - 90 < STAGE_W;
      if (!visible) decor.dataset.armed = "true";
      if (Math.abs(delta) < 170 && decor.dataset.armed !== "false") {
        decor.dataset.armed = "false";
        decor.classList.remove("aniteez-bounce"); void decor.offsetWidth;
        decor.classList.add("aniteez-bounce");
      }
    });
  }

  function updatePirateScene(localX, y, now) {
    const inOcean = localX > OCEAN_START + 120 && localX < OCEAN_END + 60;
    pirateHatRig.classList.toggle("is-retracted", !inOcean);
    pirateShipRig.classList.toggle("is-retracted", !inOcean);
    pirateHatRig.style.top = `${(y - 270 + Math.sin(now / 520) * 3).toFixed(1)}px`;
    pirateShipRig.style.top = `${y.toFixed(1)}px`;
  }

  function updateBus(now) {
    const start = -650;
    const end = 8420;
    const cycle = mod(now / 30000, 1);
    const travelProgress = Math.min(cycle / .8, 1);
    const easedProgress = smoothstep(travelProgress);
    const x = start + (end - start) * easedProgress;
    const y = routeY(x) + 5;
    const angle = Math.max(-5, Math.min(5, routeAngle(x) * .35));
    const billboardCoverStart = 8080;
    const billboardCoverEnd = 8330;
    const coverOpacity = 1 - smoothstep((x - billboardCoverStart) / (billboardCoverEnd - billboardCoverStart));
    const opacity = cycle < .8 ? .88 * coverOpacity : 0;
    busElements.forEach((bus) => {
      const offset = Number(bus.dataset.copyOffset || 0);
      bus.style.left = `${x + offset}px`;
      bus.style.top = `${y}px`;
      bus.style.opacity = opacity.toFixed(3);
      bus.style.transform = `translate(-50%,-100%) rotate(${angle.toFixed(2)}deg) scaleX(-1)`;
    });
  }

  function render(now) {
    const dt = Math.min(32, now - state.lastTime);
    state.lastTime = now;
    if (!state.overlayOpen && !state.transitionActive) {
      const easing = 1 - Math.pow(0.0008, dt / 1000);
      const previous = state.position;
      state.position += (state.targetPosition - state.position) * easing;
      state.velocity += ((state.position - previous) - state.velocity) * .18;
    }
    stage.classList.toggle("is-moving", Math.abs(state.targetPosition - state.position) > 0.35);
    const nextLap = Math.floor(state.position / TRACK_W);
    if (nextLap !== state.lap) resetLap(nextLap);
    const localX = mod(state.position, TRACK_W);
    const baseY = routeY(localX);
    const oceanLift = oceanLiftAt(localX);
    const y = baseY + oceanLift;
    const inOcean = localX > OCEAN_START && localX < OCEAN_END;
    if (state.wasInOcean && !inOcean && localX >= OCEAN_END && !state.oceanRewardGiven && state.velocity >= 0) grantOceanReward();
    state.wasInOcean = inOcean;
    const slopeAngle = Math.max(-6, Math.min(6, routeAngle(localX) * .47));
    const motionLean = Math.max(-2.5, Math.min(2.5, state.velocity * .07));
    world.style.transform = `translate3d(${(PLAYER_X - (localX + TRACK_W)).toFixed(2)}px,0,0)`;
    foregroundLayer.style.transform = world.style.transform;
    characterRig.style.top = `${y.toFixed(2)}px`;
    characterRig.style.transform = `rotate(${(slopeAngle + motionLean).toFixed(2)}deg)`;
    drinkRig.style.top = `${(y - 82).toFixed(2)}px`;
    if (!drinkRig.classList.contains("is-hidden")) drinkRig.style.transform = `rotate(${(slopeAngle * .55 + Math.sin(now / 430) * 1.2).toFixed(2)}deg)`;
    tentacleRig.style.top = `${(y - 72).toFixed(2)}px`;
    if (!tentacleRig.classList.contains("is-hidden")) tentacleRig.style.transform = `rotate(${(slopeAngle * .55 + Math.sin(now / 460) * 1.05).toFixed(2)}deg)`;
    updatePirateScene(localX, y, now);
    updateBus(now);

    const lookDeltaX = state.look.targetX - state.look.x;
    const lookDeltaY = state.look.targetY - state.look.y;
    if (Math.abs(lookDeltaX) > .01 || Math.abs(lookDeltaY) > .01) {
      state.look.x += lookDeltaX * .065;
      state.look.y += lookDeltaY * .065;
      sceneCamera.style.setProperty("--look-x", `${state.look.x.toFixed(2)}px`);
      sceneCamera.style.setProperty("--look-y", `${state.look.y.toFixed(2)}px`);
    }
    if (!state.overlayOpen && !state.transitionActive &&
        (Math.abs(localX - state.lastInteractionX) > 2 || now - state.lastInteractionTime > 90)) {
      state.lastInteractionX = localX;
      state.lastInteractionTime = now;
      updateVisibleWorld(localX);
      updateNearInteractions(localX);
    }
    requestAnimationFrame(render);
  }

  function applyWheel(event) {
    if (state.overlayOpen || state.transitionActive) return;
    event.preventDefault();
    const dominant = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    state.targetPosition = clampAtOctopus(state.targetPosition + dominant * 2.15);
  }

  function pointerDown(event) {
    if (state.overlayOpen || state.transitionActive || event.target.closest("button,.prop[data-clickable=\"true\"],[data-octopus]")) return;
    state.pointerDown = true; state.pointerDragged = false; state.lastPointerX = event.clientX;
    stage.setPointerCapture?.(event.pointerId);
  }

  function pointerMove(event) {
    const rect = stage.getBoundingClientRect();
    state.look.targetX = ((event.clientX - rect.left) / rect.width - .5) * -86;
    state.look.targetY = (.5 - (event.clientY - rect.top) / rect.height) * 118;
    if (!state.pointerDown || state.overlayOpen || state.transitionActive) return;
    const delta = event.clientX - state.lastPointerX;
    if (Math.abs(delta) > 2) state.pointerDragged = true;
    state.lastPointerX = event.clientX;
    state.targetPosition = clampAtOctopus(state.targetPosition - delta * 4.15);
  }

  function pointerUp(event) {
    state.pointerDown = false;
    stage.releasePointerCapture?.(event.pointerId);
    // Keep the drag guard alive through the browser's following click event.
    window.setTimeout(() => { state.pointerDragged = false; }, 90);
  }

  let audioContext = null;
  function playPaperSound(frequency = 360) {
    if (!state.soundOn) return;
    try {
      audioContext ||= new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(120, frequency * .55), audioContext.currentTime + .09);
      gain.gain.setValueAtTime(.025, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .12);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(); oscillator.stop(audioContext.currentTime + .13);
    } catch (_error) {}
  }

  function playPageTurn() {
    if (!state.soundOn) return;
    pageTurnAudio.currentTime = 0;
    pageTurnAudio.play().catch(() => {});
  }
  function playChime() {
    if (!state.soundOn) return;
    chimeAudio.currentTime = 0;
    chimeAudio.play().catch(() => {});
  }
  function endTransition() {
    if (!state.transitionActive || transition.classList.contains("is-leaving")) return;
    transition.classList.add("is-leaving");
    window.setTimeout(() => {
      state.transitionActive = false;
      transition.classList.remove("is-active", "is-leaving");
      transition.setAttribute("aria-hidden", "true");
      transitionVideo.pause();
    }, 1160);
  }

  function bindEvents() {
    window.addEventListener("resize", updateScale);
    stage.addEventListener("wheel", applyWheel, { passive: false });
    stage.addEventListener("pointerdown", pointerDown);
    stage.addEventListener("pointermove", pointerMove);
    stage.addEventListener("pointerup", pointerUp);
    stage.addEventListener("pointercancel", pointerUp);
    stage.addEventListener("pointerleave", () => { state.look.targetX = 0; state.look.targetY = 0; });

    $$('[data-outfit]').forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); setOutfit(button.dataset.outfit); playPaperSound(460); }));
    $$(".drink-hotspot").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); selectDrink(button.dataset.drink); }));
    confirmDrink.addEventListener("click", (event) => { event.stopPropagation(); closeCoffee(true); });
    coffeeOverlay.addEventListener("click", (event) => { if (event.target === coffeeOverlay) closeCoffee(false); });
    $("#enterRestaurant").addEventListener("click", enterRestaurant);
    $("#backButton").addEventListener("click", () => bridge?.returnToBedroom());
    $("#soundButton").addEventListener("click", (event) => {
      if (bridge) window.parent.orbitMenu.toggleBgm();
      else state.soundOn = !state.soundOn;
      event.currentTarget.classList.toggle("is-off", !state.soundOn);
      if (state.soundOn) playPaperSound(420);
    });
    transitionVideo.addEventListener("ended", endTransition);
    transitionVideo.addEventListener("error", () => window.setTimeout(endTransition, 1600));
    $("#skipTransition").addEventListener("click", endTransition);
    window.setTimeout(endTransition, 9400);
  }

  window.orbitStreetScene = {
    setLanguage(next) { language = next; syncCopy(); },
    setSound(enabled) { state.soundOn = enabled; $("#soundButton").classList.toggle("is-off", !enabled); },
    snapshot: () => ({ outfit: state.outfit, selectedDrink: state.selectedDrink, lap: state.lap }),
  };
  buildRoad();
  buildProps();
  cacheSceneElements();
  setOutfit(state.outfit);
  updateScale();
  bindEvents();
  syncCopy();
  window.orbitStreetScene.setSound(state.soundOn);
  requestAnimationFrame(render);
})();
