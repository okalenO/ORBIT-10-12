(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const stage = $("#stage");
  const bridge = window.parent !== window ? window.parent.orbitEpilogue : null;
  const settings = bridge?.getSettings?.() || {};

  const storageKeys = {
    outfit: ["orbit:selectedOutfit", "orbit:outfit", "selectedOutfit"],
    drink: ["orbit:drinkChoice", "orbit:drinkId", "orbit:selectedDrink", "selectedDrink"],
    lunch: ["orbit:lunchId", "orbit:selectedLunch", "selectedLunch"],
    cake: ["orbit:restaurantCakeDesign", "orbit:cakeConfig", "orbit:restaurantCake", "cakeConfig"],
    card: ["orbit:card", "orbit:greetingCard", "orbit:restaurantCard"],
    photo: ["orbit:beachPhoto", "orbit:photoData"]
  };

  function resizeStage() {
    const width = window.visualViewport?.width || document.documentElement.clientWidth || innerWidth;
    const height = window.visualViewport?.height || document.documentElement.clientHeight || innerHeight;
    stage.style.setProperty("--stage-scale", String(Math.min(width / 1920, height / 1080)));
  }

  function read(key) {
    try { return localStorage.getItem(key); }
    catch (_) { return null; }
  }

  function firstStored(keys) {
    for (const key of keys) {
      const value = read(key);
      if (value !== null && value !== "") return value;
    }
    return null;
  }

  function parseValue(raw) {
    if (raw === null) return null;
    try { return JSON.parse(raw); }
    catch (_) { return raw; }
  }

  function textFrom(value, keys) {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return "";
    for (const key of keys) if (typeof value[key] === "string" && value[key]) return value[key];
    return "";
  }

  function normalizeChoice(raw, map, fallback) {
    const source = textFrom(raw, ["id", "value", "name", "type", "style"]) || String(raw || "");
    const normalized = source.toLowerCase();
    for (const [key, label] of Object.entries(map)) if (normalized.includes(key)) return label;
    return source || fallback;
  }

  function loadMemoryData() {
    const raw = Object.fromEntries(Object.entries(storageKeys).map(([name, keys]) => [name, settings[name] ?? parseValue(firstStored(keys))]));
    const hasSavedData = Object.values(raw).some((value) => value !== null);
    const outfit = normalizeChoice(raw.outfit, {
      cuteez: "CUTEeZ 表演服", plaid: "格子衬衫", check: "格子衬衫", striped: "亨利衫", henley: "亨利衫"
    }, "格子衬衫");
    const drink = normalizeChoice(raw.drink, {
      americano: "冰美式", american: "冰美式", coffee: "冰美式", chamomile: "洋甘菊茶", tea: "洋甘菊茶", strawberry: "草莓奶昔", milkshake: "草莓奶昔", octopus: "章鱼脚"
    }, "冰美式");
    const lunch = normalizeChoice(raw.lunch, {
      gukbap: "韩式汤饭", soup: "韩式汤饭", cutlet: "炸猪排套餐", tonkatsu: "炸猪排套餐", porkcutlet: "炸猪排套餐", jokbal: "猪蹄"
    }, "猪蹄");
    const cake = textFrom(raw.cake, ["name", "label", "styleName", "style", "title"]) || "亲手装饰的小熊蛋糕";
    const cardMessage = textFrom(raw.card, ["message", "text", "wish", "content"]) || "生日快乐，愿你一直幸福。";
    const cardSignature = textFrom(raw.card, ["signature", "from", "author", "name"]) || "ATINY";
    const photoSrc = textFrom(raw.photo, ["photo", "dataUrl", "image", "preview", "src"]);
    const rawFrame = raw.photo && typeof raw.photo === "object" ? raw.photo.frame : null;
    const frame = textFrom(raw.photo, ["frameLabel", "frame", "frameId"]) || (rawFrame ? `FRAME 0${rawFrame}` : "FRAME 01");
    return { hasSavedData, outfit, drink, lunch, cake, cardMessage, cardSignature, photoSrc, frame };
  }

  const memory = loadMemoryData();

  function renderMemory() {
    $("#outfitValue").textContent = memory.outfit;
    $("#drinkValue").textContent = memory.drink;
    $("#lunchValue").textContent = memory.lunch;
    $("#cakeValue").textContent = memory.cake;
    $("#timelineOutfit").textContent = memory.outfit;
    $("#timelineDrink").textContent = memory.drink;
    $("#timelineLunch").textContent = memory.lunch;
    $("#cardQuote").textContent = `“${memory.cardMessage}”`;
    $("#cardSignature").textContent = memory.cardSignature;
    $("#photoFrameLabel").textContent = String(memory.frame).toUpperCase();
    if (memory.photoSrc) {
      $("#memoryPhoto").src = memory.photoSrc;
      $("#photoFallback").classList.add("is-hidden");
    }
    if (memory.hasSavedData) $("#demoBadge").classList.add("is-hidden");
  }

  function openPanel(panel) {
    $(".view.is-active")?.classList.remove("is-active");
    panel.classList.add("is-active");
  }

  let noticeTimer = 0;
  function showNotice(message) {
    const notice = $("#grayboxNotice");
    notice.textContent = message;
    notice.classList.add("is-visible");
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => notice.classList.remove("is-visible"), 2800);
  }

  function returnToMainMenu() {
    if (bridge?.returnToMainMenu) {
      stage.classList.add("is-leaving");
      setTimeout(() => bridge.returnToMainMenu(), 460);
      return;
    }
    const event = new CustomEvent("orbit:return-to-main", { cancelable: true });
    if (!window.dispatchEvent(event)) return;

    const queryTarget = new URLSearchParams(location.search).get("main");
    const configuredTarget = queryTarget || read("orbit:mainMenuUrl");
    if (!configuredTarget) {
      showNotice("独立灰盒：整合进完整游戏时，此按钮将连接主菜单。");
      return;
    }

    stage.classList.add("is-leaving");
    setTimeout(() => { location.href = configuredTarget; }, 460);
  }

  function closePanel(panelId) {
    $("#" + panelId)?.classList.remove("is-active");
    $("#epilogueMenu").classList.add("is-active");
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines = 99) {
    const characters = [...String(text)];
    const lines = [];
    let line = "";
    for (const character of characters) {
      const test = line + character;
      if (context.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = character;
        if (lines.length >= maxLines) break;
      } else line = test;
    }
    if (line && lines.length < maxLines) lines.push(line);
    lines.forEach((value, index) => context.fillText(value, x, y + index * lineHeight));
    return y + lines.length * lineHeight;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function drawCover(context, image, x, y, width, height) {
    const scale = Math.max(width / image.width, height / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  }

  async function saveMemoryCard() {
    await document.fonts?.ready;
    const canvas = $("#memoryCanvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fffaf0";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(70,60,49,.12)";
    context.lineWidth = 2;
    for (let y = 0; y < canvas.height; y += 42) { context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke(); }

    context.fillStyle = "#6f8650";
    context.font = "900 24px Georgia";
    context.fillText("A SMALL RECORD OF TODAY", 100, 105);
    context.fillStyle = "#29231f";
    context.font = "900 70px Georgia";
    context.fillText("OUR DAY IN ORBIT", 100, 180);
    context.textAlign = "right";
    context.font = "900 48px Georgia";
    context.fillText("10 / 12", 1500, 130);
    context.textAlign = "left";

    context.save();
    context.fillStyle = "#ffffff";
    context.shadowColor = "rgba(40,30,24,.18)";
    context.shadowBlur = 18;
    context.shadowOffsetX = 12;
    context.shadowOffsetY = 14;
    context.fillRect(100, 245, 650, 585);
    context.restore();
    context.save();
    context.beginPath();
    context.rect(128, 273, 594, 480);
    context.clip();
    if (memory.photoSrc) {
      try { drawCover(context, await loadImage(memory.photoSrc), 128, 273, 594, 480); }
      catch (_) { context.fillStyle = "#7d7980"; context.fillRect(128, 273, 594, 480); }
    } else {
      const gradient = context.createLinearGradient(128, 273, 722, 753);
      gradient.addColorStop(0, "#d28d5d"); gradient.addColorStop(.55, "#777684"); gradient.addColorStop(1, "#31475a");
      context.fillStyle = gradient; context.fillRect(128, 273, 594, 480);
      context.fillStyle = "#fff8e7"; context.textAlign = "center"; context.font = "900 86px Georgia"; context.fillText("14:30", 425, 500);
      context.font = "900 22px Georgia"; context.fillText("AT THE BEACH", 425, 545); context.textAlign = "left";
    }
    context.restore();
    context.fillStyle = "#6b5a4c"; context.font = "italic 21px Georgia"; context.textAlign = "center";
    context.fillText(`the moment we kept · ${memory.frame}`, 425, 800); context.textAlign = "left";

    context.fillStyle = "#6f8650"; context.font = "900 26px Georgia"; context.fillText("TODAY'S ORBIT", 835, 275);
    const events = [
      ["10:12", `拉开窗帘，叫醒钟浩，为他选了${memory.outfit}`],
      ["11:30", `一起走过长街，带上了${memory.drink}`],
      ["12:30", `一起吃午餐，选择了${memory.lunch}`],
      ["15:00", "在海边按下快门，留下今天的拍立得"],
      ["23:55", "陪钟浩到生日的最后一秒，一起说下“행복하자!”"]
    ];
    let eventY = 345;
    for (const [time, description] of events) {
      context.fillStyle = "#765847"; context.font = "900 24px Georgia"; context.fillText(time, 835, eventY);
      context.fillStyle = "#29231f"; context.font = "700 25px OrbitCuteCN, sans-serif";
      eventY = wrapText(context, description, 965, eventY, 500, 34, 2) + 44;
    }

    context.fillStyle = "#29231f"; context.font = "700 30px OrbitCuteCN, sans-serif";
    const quoteBottom = wrapText(context, `“${memory.cardMessage}”`, 105, 930, 1290, 46, 4);
    context.textAlign = "right"; context.fillStyle = "#765847"; context.font = "700 23px OrbitCuteCN, sans-serif";
    context.fillText(`— ${memory.cardSignature}`, 1490, quoteBottom + 15); context.textAlign = "left";

    const tags = [["OUTFIT",memory.outfit],["DRINK",memory.drink],["LUNCH",memory.lunch],["CAKE",memory.cake]];
    let tagY = 1220;
    tags.forEach(([label,value], index) => {
      const x = 100 + (index % 2) * 735;
      const y = tagY + Math.floor(index / 2) * 180;
      context.fillStyle = "rgba(169,201,60,.22)"; context.fillRect(x, y, 665, 135);
      context.strokeStyle = "#29231f"; context.lineWidth = 3; context.strokeRect(x, y, 665, 135);
      context.fillStyle = "#6f8650"; context.font = "900 18px Georgia"; context.fillText(label, x + 26, y + 36);
      context.fillStyle = "#29231f"; context.font = "700 29px OrbitCuteCN, sans-serif"; context.fillText(String(value), x + 26, y + 88);
    });

    context.fillStyle = "#29231f"; context.textAlign = "center"; context.font = "900 23px Georgia";
    context.fillText("THANK YOU FOR SPENDING TODAY WITH JONGHO.", 800, 1820);
    context.fillStyle = "#6f8650"; context.font = "900 20px Georgia"; context.fillText("ORBIT 10:12 · See you again next year.", 800, 1880);

    context.save();
    context.fillStyle = "#a9c93c";
    context.textAlign = "center";
    [[72,245,34],[785,220,23],[1515,720,32],[690,1775,27],[1325,1735,20]].forEach(([x,y,size]) => {
      context.font = `900 ${size}px Georgia`;
      context.fillText("✦", x, y);
    });
    context.restore();

    const link = document.createElement("a");
    link.download = `ORBIT-10-12-memory-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function bindEvents() {
    $("#memoryEntry").addEventListener("click", () => openPanel($("#memoryPanel")));
    $("#letterEntry").addEventListener("click", () => openPanel($("#letterPanel")));
    $("#mainMenuEntry").addEventListener("click", returnToMainMenu);
    document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => closePanel(button.dataset.close)));
    $("#saveMemory").addEventListener("click", saveMemoryCard);
    addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const activePanel = $(".panel.is-active");
      if (activePanel) closePanel(activePanel.id);
    });
    addEventListener("resize", resizeStage);
    window.visualViewport?.addEventListener("resize", resizeStage);
  }

  resizeStage();
  document.documentElement.lang = settings.language === "ko" ? "ko" : settings.language === "en" ? "en" : "zh-CN";
  renderMemory();
  bindEvents();
})();
