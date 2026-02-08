// Initialize configuration
const config = window.VALENTINE_CONFIG;

// ---------------------------
// MP3 Music (local file)
// Requires in index.html (before </body>):
// <audio id="bgMusic" loop preload="auto">
//   <source src="assets/music.mp3" type="audio/mpeg">
// </audio>
// ---------------------------
let musicIsPlaying = false;

function playMusic() {
    const a = document.getElementById("bgMusic");
    if (!a) return;

    // keep it pleasant
    a.volume = 0.6;

    const p = a.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            // Browser blocked autoplay; user can tap again
        });
    }
    musicIsPlaying = true;
}

function stopMusic() {
    const a = document.getElementById("bgMusic");
    if (!a) return;

    a.pause();
    musicIsPlaying = false;
}

// Validate configuration
function validateConfig() {
    const warnings = [];

    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "My Love";
    }

    // Validate colors (optional safety)
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    if (config.colors) {
        Object.entries(config.colors).forEach(([key, value]) => {
            if (!isValidHex(value)) {
                warnings.push(`Invalid color for ${key}! Using default.`);
                config.colors[key] = getDefaultColor(key);
            }
        });
    }

    // Validate animation values
    if (config.animations && parseFloat(config.animations.floatDuration) < 5) {
        warnings.push("Float duration too short! Setting to 5s minimum.");
        config.animations.floatDuration = "5s";
    }

    if (config.animations && (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3)) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 1.5;
    }

    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:");
        warnings.forEach(w => console.warn("- " + w));
    }
}

// Default color values
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    };
    return defaults[key];
}

// Set page title
document.title = config.pageTitle || "Valentine 💝";

// Apply theme colors from config (works if your CSS uses CSS vars)
function applyTheme() {
    if (!config.colors) return;
    const r = document.documentElement;
    r.style.setProperty("--bg1", config.colors.backgroundStart);
    r.style.setProperty("--bg2", config.colors.backgroundEnd);
    r.style.setProperty("--btn", config.colors.buttonBackground);
    r.style.setProperty("--btnHover", config.colors.buttonHover);
    r.style.setProperty("--text", config.colors.textColor);
}

// ---------------------------
// Floating emojis
// ---------------------------
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;

    // hearts
    config.floatingEmojis.hearts.forEach(heart => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });

    // bears
    config.floatingEmojis.bears.forEach(bear => {
        const div = document.createElement('div');
        div.className = 'bear';
        div.innerHTML = bear;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

function setRandomPosition(element) {
    element.style.left = Math.random() * 100 + 'vw';
    element.style.animationDelay = Math.random() * 5 + 's';
    element.style.animationDuration = 10 + Math.random() * 20 + 's';
}

// ---------------------------
// Navigation
// ---------------------------
function showNextQuestion(questionNumber) {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const next = document.getElementById(`question${questionNumber}`);
    if (next) next.classList.remove('hidden');
}

// ---------------------------
// No button prank MAX
// ---------------------------
function prankNoButton(noBtn, yesBtn) {
    if (!noBtn || !yesBtn) return;

    let attempts = 0;
    noBtn.style.position = 'fixed';

    const moveNo = () => {
        attempts++;

        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

        noBtn.style.left = `${Math.max(10, x)}px`;
        noBtn.style.top = `${Math.max(10, y)}px`;
        noBtn.style.transform = `rotate(${(Math.random() * 18 - 9).toFixed(0)}deg)`;

        const phrases = [
            "No 🙈",
            "No? sure? 😼",
            "Try again 😭",
            "Not happening 😌",
            "Nice try 😈",
            "Hehe nope 🫣",
            "Okay fine… 😵",
        ];
        noBtn.textContent = phrases[Math.min(attempts - 1, phrases.length - 1)];

        if (attempts >= 7) {
            noBtn.textContent = "Yes!! 💘";
            noBtn.style.transform = "rotate(0deg)";
            noBtn.addEventListener("click", () => yesBtn.click(), { once: true });
        }
    };

    noBtn.addEventListener('mouseenter', moveNo);
    noBtn.addEventListener('click', (e) => { e.preventDefault(); moveNo(); });
    noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); }, { passive: false });

    setTimeout(moveNo, 250);
}

// ---------------------------
// Love meter
// ---------------------------
function setupLoveMeter() {
    const loveMeter = document.getElementById('loveMeter');
    const loveValue = document.getElementById('loveValue');
    const extraLove = document.getElementById('extraLove');

    if (!loveMeter || !loveValue || !extraLove) return;

    const setInitialPosition = () => {
        loveMeter.value = 100;
        loveValue.textContent = 100;
        loveMeter.style.width = '100%';
        extraLove.classList.add('hidden');
        extraLove.classList.remove('super-love');
    };

    setInitialPosition();

    loveMeter.addEventListener('input', () => {
        const value = parseInt(loveMeter.value, 10);
        loveValue.textContent = value;

        if (value > 100) {
            extraLove.classList.remove('hidden');

            if (value >= 5000) {
                extraLove.classList.add('super-love');
                extraLove.textContent = config.loveMessages.extreme;
            } else if (value > 1000) {
                extraLove.classList.remove('super-love');
                extraLove.textContent = config.loveMessages.high;
            } else {
                extraLove.classList.remove('super-love');
                extraLove.textContent = config.loveMessages.normal;
            }
        } else {
            extraLove.classList.add('hidden');
            extraLove.classList.remove('super-love');
            loveMeter.style.width = '100%';
        }
    });
}

// ---------------------------
// Celebration
// ---------------------------
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    if (!celebration) return;
    celebration.classList.remove('hidden');

    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;

    // heart burst
    const floating = document.querySelector('.floating-elements');
    if (!floating) return;

    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        const randomHeart = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.innerHTML = randomHeart;
        heart.className = 'heart';
        floating.appendChild(heart);
        setRandomPosition(heart);
    }
}

// ---------------------------
// Hidden surprise: type "bubu"
// ---------------------------
function setupHiddenSurprise() {
    const secret = "bubu";
    let buffer = "";

    document.addEventListener("keydown", (e) => {
        buffer += (e.key || "").toLowerCase();
        buffer = buffer.slice(-10);

        if (buffer.includes(secret)) {
            buffer = "";
            alert("💌 Surprise for Bubu: Ro Ro loves you more than 10,000% 💖");
        }
    });
}

// ---------------------------
// Intro overlay + music toggle
// ---------------------------
function setupIntroAndMusicToggle() {
    const overlay = document.getElementById("introOverlay");
    const startBtn = document.getElementById("introStartBtn");
    const musicToggle = document.getElementById("musicToggle");

    // Start button: hide intro + start music (user gesture = allowed)
    if (overlay && startBtn) {
        startBtn.addEventListener("click", () => {
            overlay.style.display = "none";
            playMusic();
            if (musicToggle) musicToggle.textContent = "🔇 Stop Music";
        });
    }

    // Top-right toggle
    if (musicToggle) {
        musicToggle.addEventListener("click", () => {
            if (!musicIsPlaying) {
                playMusic();
                musicToggle.textContent = "🔇 Stop Music";
            } else {
                stopMusic();
                musicToggle.textContent = "🎵 Play Music";
            }
        });
    }
}

// ---------------------------
// Wire buttons (your page IDs)
// ---------------------------
function setupButtons() {
    const yesBtn1 = document.getElementById('yesBtn1');
    const noBtn1 = document.getElementById('noBtn1');
    const secretAnswerBtn = document.getElementById('secretAnswerBtn');

    const nextBtn = document.getElementById('nextBtn');

    const yesBtn3 = document.getElementById('yesBtn3');
    const noBtn3 = document.getElementById('noBtn3');

    // Q1
    if (yesBtn1) yesBtn1.addEventListener('click', () => showNextQuestion(2));
    if (noBtn1 && yesBtn1) prankNoButton(noBtn1, yesBtn1);

    if (secretAnswerBtn) {
        secretAnswerBtn.addEventListener('click', () => {
            alert(config.questions.first.secretAnswer);
        });
    }

    // Q2 -> Q3
    if (nextBtn) nextBtn.addEventListener('click', () => showNextQuestion(3));

    // Q3
    if (yesBtn3) yesBtn3.addEventListener('click', celebrate);
    if (noBtn3 && yesBtn3) prankNoButton(noBtn3, yesBtn3);
}

// Set texts from config
function setTextsFromConfig() {
    const titleEl = document.getElementById('valentineTitle');
    if (titleEl) titleEl.textContent = `${config.valentineName}, my love...`;

    // Q1
    document.getElementById('question1Text').textContent = config.questions.first.text;
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;

    // Q2
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;

    // Q3
    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    // Secret button label
    const secretBtn = document.getElementById('secretAnswerBtn');
    if (secretBtn) secretBtn.textContent = "Secret 💌";
}

// ---------------------------
// DOM Ready init
// ---------------------------
window.addEventListener('DOMContentLoaded', () => {
    validateConfig();
    applyTheme();
    setTextsFromConfig();
    createFloatingElements();
    setupLoveMeter();
    setupButtons();
    setupHiddenSurprise();
    setupIntroAndMusicToggle();
});
