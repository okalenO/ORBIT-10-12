(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const stage = $("#stage");
  const bridge = window.parent !== window ? window.parent.orbitEpilogue : null;
  const settings = bridge?.getSettings?.() || {};
  const languageAliases = { zh: "zh", cn: "zh", "zh-cn": "zh", ko: "ko", kr: "ko", en: "en" };
  const language = languageAliases[String(settings.language || "zh").toLowerCase()] || "zh";
  const copy = {
    zh: {
      memorySubtitle: "纪念卡", letterSubtitle: "制作者来信", returnMenu: "回到主界面",
      menuNote: "主线已经结束。这里的内容不会改变任何游戏变量。", back: "返回", savePng: "保存 PNG",
      defaultQuote: "生日快乐，愿你一直幸福。", defaultOutfit: "格子衬衫", defaultDrink: "冰美式", defaultLunch: "猪蹄", defaultCake: "亲手装饰的小熊蛋糕",
      timeline1012: "拉开窗帘，叫醒钟浩\n为他选了 {outfit}", timeline1130: "一起走过长街\n带上了 {drink}", timeline1230: "一起吃午餐\n选择了 {lunch}",
      timeline1500: "在海边按下快门\n留下今天的拍立得", timeline2355: "陪钟浩到生日的最后一秒\n一起说下“행복하자!”",
      letterSalutation: "致每一位看到这里的ATINY：", letter01: "非常感谢你能够玩到这里！",
      letter02: "这是一个非常粗糙的小游戏吧 ㅎㅎ因为思考着“怎么才能让不管在哪里的 ATINY 都能一起度过钟浩的生日呢”，只会普通地画画的我，学着做出了 ORBIT 10:12。",
      letter03: "就像这个名字一样，这是一个围绕着这一天、围绕着钟浩展开的小故事。和钟浩共度时光，听着钟浩唱歌，共同积累美好的回忆,这是身为喜爱着钟浩的粉丝最大的愿望。就算是在制作过程中调试了一万次的我，在做到最后一幕的时候也被感动了呢 ૮₍ ˊᯅˋ₎ა",
      letter04: "游戏里藏了很多小彩蛋。如果觉得全部找出来有些困难，也可以在 X 找到我发布的攻略～原本还有更多想要呈现的东西，但是因为一个人的精力实在有限 >< 希望未来能够做出更加成熟的作品。",
      letter05: "同时也非常感谢 Codex 的帮助，让作为 coding 初学者的我，能够把心中所想一点点具象化。感谢我的朋友 nana7_7 和 大喷菇，在 Street 场景中为我提供了可爱的简笔画。",
      letter06: "最后，也感谢钟浩，让来自不同地方的我们感受到了同样一份幸福。也祝 ATEEZ 11月13日回归顺利！", letterEnding: "那么，사랑해! 행복하자!",
      letterContact: "如果有游戏相关的问题或 Bug 报错，可以联系 X：", creditCodex: "本项目的程序实现由制作者在 OpenAI Codex 辅助下完成。",
      creditBeach: "海边场景的背景照片分别设于济州岛 / 泽西岛。", creditStreet: "Street 场景交互设计参考：", aiCredit: "粉丝自制生日应援项目 · 编程由 OpenAI Codex 协助",
      standaloneNotice: "独立灰盒：整合进完整游戏时，此按钮将连接主菜单。",
      outfitCuteez: "CUTEeZ 表演服", outfitPlaid: "格子衬衫", outfitHenley: "亨利衫", drinkAmericano: "冰美式", drinkChamomile: "洋甘菊茶", drinkStrawberry: "草莓奶昔", drinkOctopus: "章鱼脚",
      lunchGukbap: "韩式汤饭", lunchCutlet: "炸猪排套餐", lunchJokbal: "猪蹄"
    },
    ko: {
      memorySubtitle: "기념 카드", letterSubtitle: "제작자의 편지", returnMenu: "메인 메뉴로 돌아가기",
      menuNote: "메인 스토리는 끝났습니다. 이곳의 내용은 게임 진행에 영향을 주지 않습니다.", back: "뒤로", savePng: "PNG로 저장",
      defaultQuote: "생일 축하해. 언제나 행복하길 바랄게.", defaultOutfit: "체크 셔츠", defaultDrink: "아메리카노", defaultLunch: "족발", defaultCake: "직접 꾸민 곰돌이 케이크",
      timeline1012: "커튼을 열어 종호를 깨우고\n{outfit}을 골라 줬다", timeline1130: "함께 거리를 걷고\n{drink}를 손에 들었다", timeline1230: "함께 점심을 먹고\n점심으로 {lunch}을 골랐다",
      timeline1500: "바닷가에서 셔터를 눌러\n오늘의 폴라로이드를 남겼다", timeline2355: "종호의 생일 마지막 순간까지 함께하며\n같이 “행복하자!”라고 말했다",
      letterSalutation: "여기까지 와 주신 모든 에이티니에게,", letter01: "여기까지 플레이해 주셔서 정말 감사합니다!",
      letter02: "아직 많이 서툰 작은 게임이죠 ㅎㅎ ‘어디에 있든 모든 ATINY가 종호의 생일을 함께 보낼 수 있는 방법은 없을까?’ 고민하다가, 그림밖에 그릴 줄 모르던 제가 하나씩 배워 가며 ORBIT 10:12를 만들었습니다.",
      letter03: "이름처럼, 이 게임은 이 하루를, 그리고 종호를 중심으로 펼쳐지는 작은 이야기입니다. 종호와 함께 시간을 보내고, 종호의 노래를 들으며, 함께 좋은 추억을 쌓는 것. 종호를 좋아하는 팬으로서 제가 가장 바라는 일이에요. 제작하면서 만 번은 테스트한 저도 마지막 장면까지 만들고 나니 감동해 버렸답니다 ૮₍ ˊᯅˋ₎ა",
      letter04: "게임 곳곳에 작은 이스터 에그를 많이 숨겨 두었어요. 전부 찾기 어렵다면 X에 올려 둔 공략을 봐 주세요~ 원래는 더 보여 드리고 싶은 것도 많았지만, 혼자서 감당하기에는 역시 한계가 있더라고요 >< 앞으로는 더 완성도 높은 작품을 만들 수 있으면 좋겠습니다.",
      letter05: "또 코딩 초보자인 제가 머릿속으로만 그리던 것들을 하나씩 실제로 구현할 수 있게 도와준 Codex에도 정말 감사드립니다. Street 장면에 귀여운 손그림을 그려 준 제 친구 nana7_7과 가스버섯에게도 고마워요.",
      letter06: "마지막으로, 서로 다른 곳에 있는 우리 모두가 같은 행복을 느낄 수 있게 해 준 종호에게도 고맙습니다. 그리고 ATEEZ의 11월 13일 컴백도 잘 되길 바랍니다!", letterEnding: "그럼, 사랑해! 행복하자!",
      letterContact: "게임 관련 문의나 버그 제보는 X로 연락해 주세요: ", creditCodex: "이 프로젝트의 코딩은 제작자가 OpenAI Codex의 도움을 받아 완성했습니다.",
      creditBeach: "해변 장면 배경 사진의 촬영지는 각각 제주도와 저지섬입니다.", creditStreet: "Street 장면의 인터랙션 디자인 참고: ", aiCredit: "팬메이드 생일 서포트 프로젝트 · OpenAI Codex의 도움을 받아 코딩",
      standaloneNotice: "독립형 그레이박스입니다. 전체 게임에 통합하면 이 버튼이 메인 메뉴로 연결됩니다.",
      outfitCuteez: "CUTEeZ 무대 의상", outfitPlaid: "체크 셔츠", outfitHenley: "헨리 셔츠", drinkAmericano: "아메리카노", drinkChamomile: "캐모마일 티", drinkStrawberry: "딸기 셰이크", drinkOctopus: "문어 다리",
      lunchGukbap: "국밥", lunchCutlet: "돈가스 정식", lunchJokbal: "족발"
    },
    en: {
      memorySubtitle: "KEEPSAKE CARD", letterSubtitle: "CREATOR’S LETTER", returnMenu: "RETURN TO MAIN MENU",
      menuNote: "The main story is complete. Nothing here changes your game progress.", back: "BACK", savePng: "SAVE PNG",
      defaultQuote: "Happy birthday. I hope you’re always happy.", defaultOutfit: "plaid shirt", defaultDrink: "Americano", defaultLunch: "jokbal", defaultCake: "the bear cake we decorated ourselves",
      timeline1012: "Opened the curtains and woke Jongho\nPicked out {outfit} for him", timeline1130: "Walked down the street together\nBrought {drink} along", timeline1230: "Had lunch together\nChose {lunch}",
      timeline1500: "Pressed the shutter at the beach\nCaptured the day in a Polaroid", timeline2355: "Stayed with Jongho until the very last second of his birthday\nSaid “행복하자!” together",
      letterSalutation: "To every ATINY reading this,", letter01: "Thank you so much for playing all the way to the end!",
      letter02: "It’s a rough little game, isn’t it? >< I kept wondering, ‘How can ATINY, wherever they are, all spend Jongho’s birthday together?’All I could do was draw simple stuff, but I somehow managed to make this, ORBIT 10:12.",
      letter03: "Just like its name, this is a small story that unfolds around this day and around Jongho. Spending time with Jongho, listening to him sing, and making beautiful memories together is the greatest wish I have as a fan who loves Jongho. Even after testing it ten thousand times during development, I still found myself moved when I reached the final scene ૮₍ ˊᯅˋ₎ა",
      letter04: "There are lots of little Easter eggs hidden throughout the game. If finding them all feels a little difficult, you can find the guide I posted on X~ There was so much more I wanted to include, but there’s only so much one person can do >< I hope I can create something more polished in the future.",
      letter05: "I’m also incredibly grateful to Codex for helping a coding beginner like me turn the ideas in my head into something real, one step at a time. Thank you to my friends nana7_7 and FumeShroom for the adorable drawings they created for the Street scene.",
      letter06: "Finally, thank you to Jongho for letting all of us, wherever we are, share the same happiness. I’m also wishing ATEEZ all the best for their comeback on November 13!", letterEnding: "So,사랑해! 행복하자!",
      letterContact: "If you have any questions about the game or need to report a bug, please contact me on X: ", creditCodex: "The creator completed the coding for this project with assistance from OpenAI Codex.",
      creditBeach: "The beach scene background photos were taken on Jeju and Jersey.", creditStreet: "Interaction design reference for the Street scene: ", aiCredit: "Fan-made birthday project · Coding assisted by OpenAI Codex",
      standaloneNotice: "Standalone graybox: once integrated into the full game, this button will return to the main menu.",
      outfitCuteez: "CUTEeZ performance outfit", outfitPlaid: "plaid shirt", outfitHenley: "Henley shirt", drinkAmericano: "Americano", drinkChamomile: "chamomile tea", drinkStrawberry: "strawberry shake", drinkOctopus: "octopus tentacle",
      lunchGukbap: "Korean soup and rice", lunchCutlet: "pork cutlet set", lunchJokbal: "jokbal"
    }
  };
  const t = (key) => copy[language]?.[key] ?? copy.zh[key] ?? key;
  const format = (template, values) => String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

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

  function normalizeChoice(raw, map, fallbackKey) {
    const source = textFrom(raw, ["id", "value", "name", "type", "style"]) || String(raw || "");
    const normalized = source.toLowerCase();
    for (const [key, labelKey] of Object.entries(map)) if (normalized.includes(key)) return t(labelKey);
    return source || t(fallbackKey);
  }

  function loadMemoryData() {
    const raw = Object.fromEntries(Object.entries(storageKeys).map(([name, keys]) => [name, settings[name] ?? parseValue(firstStored(keys))]));
    const hasSavedData = Object.values(raw).some((value) => value !== null);
    const outfit = normalizeChoice(raw.outfit, {
      cuteez: "outfitCuteez", plaid: "outfitPlaid", check: "outfitPlaid", 格子: "outfitPlaid", striped: "outfitHenley", henley: "outfitHenley", 亨利: "outfitHenley"
    }, "defaultOutfit");
    const drink = normalizeChoice(raw.drink, {
      americano: "drinkAmericano", american: "drinkAmericano", coffee: "drinkAmericano", 美式: "drinkAmericano", chamomile: "drinkChamomile", tea: "drinkChamomile", 洋甘菊: "drinkChamomile", strawberry: "drinkStrawberry", milkshake: "drinkStrawberry", 草莓: "drinkStrawberry", octopus: "drinkOctopus", 章鱼: "drinkOctopus"
    }, "defaultDrink");
    const lunch = normalizeChoice(raw.lunch, {
      gukbap: "lunchGukbap", soup: "lunchGukbap", 汤饭: "lunchGukbap", cutlet: "lunchCutlet", tonkatsu: "lunchCutlet", porkcutlet: "lunchCutlet", 猪排: "lunchCutlet", jokbal: "lunchJokbal", 猪蹄: "lunchJokbal"
    }, "defaultLunch");
    const cake = textFrom(raw.cake, ["name", "label", "styleName", "style", "title"]) || t("defaultCake");
    const cardMessage = textFrom(raw.card, ["message", "text", "wish", "content"]) || t("defaultQuote");
    const cardSignature = textFrom(raw.card, ["signature", "from", "author", "name"]) || "ATINY";
    const photoSrc = textFrom(raw.photo, ["photo", "dataUrl", "image", "preview", "src"]);
    const rawFrame = raw.photo && typeof raw.photo === "object" ? raw.photo.frame : null;
    const frame = textFrom(raw.photo, ["frameLabel", "frame", "frameId"]) || (rawFrame ? `FRAME 0${rawFrame}` : "FRAME 01");
    return { hasSavedData, outfit, drink, lunch, cake, cardMessage, cardSignature, photoSrc, frame };
  }

  const memory = loadMemoryData();

  function setMultilineText(element, text) {
    element.replaceChildren();
    String(text).split("\n").forEach((line, index) => {
      if (index) element.append(document.createElement("br"));
      element.append(document.createTextNode(line));
    });
  }

  function applyLanguage() {
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
    $("#memorySubtitle").textContent = t("memorySubtitle");
    $("#letterSubtitle").textContent = t("letterSubtitle");
    $("#returnMenuLabel").textContent = t("returnMenu");
    $("#menuNote").textContent = t("menuNote");
    document.querySelectorAll(".panel-back span").forEach((element) => { element.textContent = t("back"); });
    $("#saveMemory").textContent = t("savePng");
    $("#letterSalutation").textContent = t("letterSalutation");
    for (let index = 1; index <= 6; index += 1) $("#letter0" + index).textContent = t("letter0" + index);
    $("#letterEnding").textContent = t("letterEnding");
    $("#letterContact").textContent = t("letterContact");
    $("#creditCodex").textContent = t("creditCodex");
    $("#creditBeach").textContent = t("creditBeach");
    $("#creditStreet").textContent = t("creditStreet");
    $("#aiCredit").textContent = t("aiCredit");
    const rotate = $(".rotate-note");
    rotate.innerHTML = language === "ko" ? "가로 화면으로 보면 더 좋아요<br><small>휴대폰을 가로로 돌려 주세요</small>" : language === "en" ? "Best viewed in landscape<br><small>Rotate your phone</small>" : "横屏观看效果更完整<br><small>请旋转手机</small>";
  }

  function renderMemory() {
    $("#outfitValue").textContent = memory.outfit;
    $("#drinkValue").textContent = memory.drink;
    $("#lunchValue").textContent = memory.lunch;
    $("#cakeValue").textContent = memory.cake;
    setMultilineText($("#timeline1012"), format(t("timeline1012"), { outfit: memory.outfit }));
    setMultilineText($("#timeline1130"), format(t("timeline1130"), { drink: memory.drink }));
    setMultilineText($("#timeline1230"), format(t("timeline1230"), { lunch: memory.lunch }));
    setMultilineText($("#timeline1500"), t("timeline1500"));
    setMultilineText($("#timeline2355"), t("timeline2355"));
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
      showNotice(t("standaloneNotice"));
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
      ["10:12", format(t("timeline1012"), { outfit: memory.outfit }).replace(/\n/g, "，")],
      ["11:30", format(t("timeline1130"), { drink: memory.drink }).replace(/\n/g, "，")],
      ["12:30", format(t("timeline1230"), { lunch: memory.lunch }).replace(/\n/g, "，")],
      ["15:00", t("timeline1500").replace(/\n/g, "，")],
      ["23:55", t("timeline2355").replace(/\n/g, "，")]
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
  applyLanguage();
  renderMemory();
  bindEvents();
})();
