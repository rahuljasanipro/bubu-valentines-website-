// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Elements
const introOverlay = document.getElementById("introOverlay");
const introStartBtn = document.getElementById("introStartBtn");

const modeToggle = document.getElementById("modeToggle");
const musicToggle = document.getElementById("musicToggle");
const startOverBtn = document.getElementById("startOverBtn");

const bgMusic = document.getElementById("bgMusic");

const cameraFlash = document.getElementById("cameraFlash");

// Sections
const aiSection = document.getElementById("aiSection");
const captchaSection = document.getElementById("captchaSection");
const visualSection = document.getElementById("visualSection");
const question1 = document.getElementById("question1");
const question2 = document.getElementById("question2");
const futureSection = document.getElementById("futureSection");
const question3 = document.getElementById("question3");
const celebrationSection = document.getElementById("celebration");

// Buttons
const aiContinueBtn = document.getElementById("aiContinueBtn");
const deeplyInLove = document.getElementById("deeplyInLove");
const captchaContinueBtn = document.getElementById("captchaContinueBtn");

const viewVisualBtn = document.getElementById("viewVisualBtn");
const visualContinueBtn = document.getElementById("visualContinueBtn");

const visualModal = document.getElementById("visualModal");
const closeVisualModal = document.getElementById("closeVisualModal");
const visualOkBtn = document.getElementById("visualOkBtn");

const yesBtn1 = document.getElementById("yesBtn1");
const noBtn1 = document.getElementById("noBtn1");
const secretAnswerBtn = document.getElementById("secretAnswerBtn");

const nextBtn = document.getElementById("nextBtn");

const yesBtn3 = document.getElementById("yesBtn3");
const noBtn3 = document.getElementById("noBtn3");

// Texts
document.title = config.pageTitle;
document.getElementById("valentineTitle").textContent = `${config.valentineName}, my love...`;

document.getElementById("question1Text").textContent = config.questions.first.text;
yesBtn1.textContent = config.questions.first.yesBtn;
noBtn1.textContent = config.questions.first.noBtn;
secretAnswerBtn.textContent = config.questions.first.secretAnswer;

document.getElementById("question2Text").textContent = config.questions.second.text;
document.getElementById("startText").textContent = config.questions.second.startText;
nextBtn.textContent = config.questions.second.nextBtn;

document.getElementById("question3Text").textContent = config.questions.third.text;
yesBtn3.textContent = config.questions.third.yesBtn;
noBtn3.textContent = config.questions.third.noBtn;

// Helpers
function hideAllMainSections() {
  [aiSection, captchaSection, visualSection, question1, question2, futureSection, question3, celebrationSection]
    .forEach(s => s.classList.add("hidden"));
}

function showSection(sectionEl) {
  hideAllMainSections();
  sectionEl.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Floating emojis
function createFloatingElements() {
  const container = document.querySelector(".floating-elements");
  container.innerHTML = "";

  const all = [...config.floatingEmojis.hearts, ...config.floatingEmojis.bears];
  const count = 14;

  for (let i = 0; i < count; i++) {
    const div = document.createElement("div");
    const emoji = all[Math.floor(Math.random() * all.length)];
    div.className = config.floatingEmojis.bears.includes(emoji) ? "bear" : "heart";
    div.textContent = emoji;

    div.style.left = Math.random() * 100 + "vw";
    div.style.top = (60 + Math.random() * 60) + "vh";
    div.style.setProperty("--floatDur", (10 + Math.random() * 12) + "s");
    div.style.animationDelay = (Math.random() * 4) + "s";

    container.appendChild(div);
  }
}

// Music
let userAllowedAudio = false;

async function playMusic() {
  if (!config.music.enabled) return;
  try {
    bgMusic.volume = config.music.volume ?? 0.55;
    await bgMusic.play();
    musicToggle.textContent = config.music.stopText;
    userAllowedAudio = true;
  } catch (e) {
    // Browser blocked — needs user gesture. We keep button text as Play.
    musicToggle.textContent = config.music.startText;
  }
}

function stopMusic() {
  try { bgMusic.pause(); } catch(e) {}
  musicToggle.textContent = config.music.startText;
}

musicToggle.addEventListener("click", async () => {
  if (bgMusic.paused) await playMusic();
  else stopMusic();
});

// Modes
function setMode(isNight) {
  document.body.classList.toggle("night", isNight);
  modeToggle.textContent = isNight ? "🌙 Night Skincare Mode" : "🧴 Sunscreen Mode";
  localStorage.setItem("bubu_mode", isNight ? "night" : "sun");
}
modeToggle.addEventListener("click", () => {
  setMode(!document.body.classList.contains("night"));
});

const savedMode = localStorage.getItem("bubu_mode");
setMode(savedMode === "night");

// Start Over
function resetUI() {
  // Reset No button positions
  [noBtn1, noBtn3].forEach(btn => {
    btn.style.position = "";
    btn.style.left = "";
    btn.style.top = "";
    btn.style.transform = "";
  });

  // Reset love meter
  loveMeter.value = 100;
  loveValue.textContent = "100";
  loveMeter.style.width = "100%";
  extraLove.classList.add("hidden");
  extraLove.classList.remove("super-love");

  // Reset captcha
  deeplyInLove.checked = false;
  captchaContinueBtn.disabled = true;

  // Hide modal
  visualModal.classList.add("hidden");

  // Back to intro
  hideAllMainSections();
  introOverlay.classList.remove("hidden");
  stopMusic();
}
startOverBtn.addEventListener("click", resetUI);

// Intro start
introStartBtn.addEventListener("click", async () => {
  introOverlay.classList.add("hidden");
  createFloatingElements();
  showSection(aiSection);

  // Start music after first tap (allowed)
  await playMusic();
});

// AI -> captcha
aiContinueBtn.addEventListener("click", () => {
  showSection(captchaSection);
});

// Captcha
deeplyInLove.addEventListener("change", () => {
  captchaContinueBtn.disabled = !deeplyInLove.checked;
});
captchaContinueBtn.addEventListener("click", () => {
  showSection(visualSection);
});

// Visual modal
viewVisualBtn.addEventListener("click", () => visualModal.classList.remove("hidden"));
closeVisualModal.addEventListener("click", () => visualModal.classList.add("hidden"));
visualOkBtn.addEventListener("click", () => visualModal.classList.add("hidden"));

visualContinueBtn.addEventListener("click", () => {
  showSection(question1);
});

// Question 1
yesBtn1.addEventListener("click", () => showSection(question2));

secretAnswerBtn.addEventListener("click", () => {
  // Tiny cute popup without browser alert
  visualModal.classList.remove("hidden");
  visualModal.querySelector("h3").textContent = "Secret 💌";
  visualModal.querySelector(".modal-note").textContent =
    "Bubu… I don’t like you. I LOVE YOU. Always. 💗😚";
});

// No button prank: starts normal, then runs
function demonNoMode(btn) {
  // First time: bounce in place slightly, then start moving away on next interactions
  let level = 0;

  const bounce = () => {
    btn.style.transform = "scale(1.05)";
    setTimeout(() => (btn.style.transform = ""), 120);
  };

  const moveAway = () => {
    const pad = 18;
    const maxX = window.innerWidth - btn.offsetWidth - pad;
    const maxY = window.innerHeight - btn.offsetHeight - pad;

    const x = pad + Math.random() * Math.max(0, maxX);
    const y = pad + Math.random() * Math.max(0, maxY);

    btn.style.position = "fixed";
    btn.style.left = x + "px";
    btn.style.top = y + "px";
  };

  const handler = (e) => {
    e.preventDefault();
    level++;

    if (level <= 1) bounce();
    else moveAway();
  };

  // Desktop hover + mobile touch
  btn.addEventListener("mouseenter", handler);
  btn.addEventListener("touchstart", handler, { passive: false });
  btn.addEventListener("click", handler);
}

demonNoMode(noBtn1);
demonNoMode(noBtn3);

// Love meter infinity
const loveMeter = document.getElementById("loveMeter");
const loveValue = document.getElementById("loveValue");
const extraLove = document.getElementById("extraLove");

function setInitialLoveMeter() {
  loveMeter.value = 100;
  loveValue.textContent = "100";
  loveMeter.style.width = "100%";
}
setInitialLoveMeter();

loveMeter.addEventListener("input", () => {
  const value = parseInt(loveMeter.value, 10);
  loveValue.textContent = value;

  if (value > 100) {
    extraLove.classList.remove("hidden");

    // Infinity-style expansion
    const overflow = value - 100;
    const extraWidth = Math.min(overflow * 0.25, window.innerWidth * 2.2); // cap so it doesn’t break layout
    loveMeter.style.width = `calc(100% + ${extraWidth}px)`;

    if (value >= 50000) {
      extraLove.classList.add("super-love");
      extraLove.textContent = config.loveMessages.extreme;
    } else if (value > 5000) {
      extraLove.classList.remove("super-love");
      extraLove.textContent = config.loveMessages.high;
    } else {
      extraLove.classList.remove("super-love");
      extraLove.textContent = config.loveMessages.normal;
    }
  } else {
    extraLove.classList.add("hidden");
    extraLove.classList.remove("super-love");
    loveMeter.style.width = "100%";
  }
});

nextBtn.addEventListener("click", () => {
  // show future timeline generator
  renderFutureTimeline();
  showSection(futureSection);
});

// Future timeline: ONE random full timeline each time
const futureTimelineEl = document.getElementById("futureTimeline");
const futureContinueBtn = document.getElementById("futureContinueBtn");

const timelines = [
  [
    ["2026", "More trips ✈️ (Banaras sequel, Goa, and one surprise city 😌)"],
    ["2028", "Marry 💍 (no excuses, Ro Sirji has decided 😤💗)"],
    ["2030", "Big vacation 🌍 + cute home upgrade 🏡"],
    ["2034", "More success + more dates + more laughs 🥂"],
    ["2040", "We become the ‘power couple’ everyone talks about 😎💞"],
    ["2050", "Still teasing each other like day 1 😂"],
    ["2060", "Still holding hands. Still choosing you. Always. 🤍"]
  ],
  [
    ["2026", "More trips + more street food + more photos 📸"],
    ["2028", "Marry 💍 and make it official official 😌"],
    ["2032", "Dream vacation 🌴 + bucket list checked ✅"],
    ["2040", "Big goals achieved together 🚀"],
    ["2050", "Soft life + cute rituals + forever vibes 🧴🌙"],
    ["2060", "Old but still flirty 😚💗"]
  ],
  [
    ["2026", "More trips ✨ + matching outfits (forced) 😭"],
    ["2028", "Marry 💍 (Bubu approves, Ro Sirji signs)"],
    ["2031", "Vacation + new memories + more hugs 🤗"],
    ["2042", "Still laughing at our old fights 😂"],
    ["2055", "Still in love… louder than ever 💞"],
    ["2060", "Forever. End of discussion. 💗"]
  ]
];

function renderFutureTimeline() {
  const pick = timelines[Math.floor(Math.random() * timelines.length)];
  futureTimelineEl.innerHTML = pick.map(([year, text]) => {
    return `<div class="row"><span class="year">${year}</span><span>${text}</span></div>`;
  }).join("");
}

futureContinueBtn.addEventListener("click", () => {
  showSection(question3);
});

// Final YES + camera flash + celebration
function triggerCameraFlash() {
  cameraFlash.classList.remove("hidden");
  cameraFlash.classList.add("active");
  setTimeout(() => {
    cameraFlash.classList.remove("active");
    cameraFlash.classList.add("hidden");
  }, 650);
}

function celebrate() {
  document.getElementById("celebrationTitle").textContent = config.celebration.title;
  document.getElementById("celebrationMessage").textContent = config.celebration.message;
  document.getElementById("celebrationEmojis").textContent = config.celebration.emojis;

  // extra floating burst
  for (let i = 0; i < 24; i++) {
    const div = document.createElement("div");
    div.className = "heart";
    div.textContent = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
    div.style.left = Math.random() * 100 + "vw";
    div.style.top = (70 + Math.random() * 40) + "vh";
    div.style.setProperty("--floatDur", (8 + Math.random() * 10) + "s");
    document.querySelector(".floating-elements").appendChild(div);
  }

  showSection(celebrationSection);
}

yesBtn3.addEventListener("click", () => {
  triggerCameraFlash();
  setTimeout(celebrate, 220);
});

// If user opens page and audio gets blocked, keep button usable
window.addEventListener("click", async () => {
  if (!userAllowedAudio && config.music.enabled && bgMusic.paused && introOverlay.classList.contains("hidden")) {
    // second chance after any click
    await playMusic();
  }
}, { passive: true });

// init: show intro only
hideAllMainSections();
introOverlay.classList.remove("hidden");
createFloatingElements();
