// Initialize configuration
const config = window.VALENTINE_CONFIG;

// ------------------------------------
// YouTube Music (Lyrics video)
// ------------------------------------
// "Osho Jain - Dekha Hi Nahi | (Lyrics)"
// https://www.youtube.com/watch?v=4NpMu__lFPQ
const YT_VIDEO_ID = "4NpMu__lFPQ";

function playYouTubeMusic() {
    const iframe = document.getElementById("ytPlayer");
    if (!iframe) return;
    // loop requires playlist=id
    iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(YT_VIDEO_ID)}?autoplay=1&loop=1&playlist=${encodeURIComponent(YT_VIDEO_ID)}&controls=0`;
}

function stopYouTubeMusic() {
    const iframe = document.getElementById("ytPlayer");
    if (!iframe) return;
    iframe.src = "";
}

// Validate configuration
function validateConfig() {
    const warnings = [];

    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "My Love";
    }

    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) {
            warnings.push(`Invalid color for ${key}! Using default.`);
            config.colors[key] = getDefaultColor(key);
        }
    });

    if (parseFloat(config.animations.floatDuration) < 5) {
        warnings.push("Float duration too short! Setting to 5s minimum.");
        config.animations.floatDuration = "5s";
    }

    if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 1.5;
    }

    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:");
        warnings.forEach(warning => console.warn("- " + warning));
    }
}

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
document.title = config.pageTitle;

// ------------------------------------
// Floating emojis
// ------------------------------------
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;

    config.floatingEmojis.hearts.forEach(heart => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });

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

// ------------------------------------
// Navigation between questions
// ------------------------------------
function showNextQuestion(questionNumber) {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const next = document.getElementById(`question${questionNumber}`);
    if (next) next.classList.remove('hidden');
}

// ------------------------------------
// NO button prank (MAX)
// - runs away on hover/tap/click
// - changes text
// - after 7 attempts, turns into YES and triggers yes click
// ------------------------------------
function prankNoButton(noBtn, yesBtn) {
    if (!noBtn || !yesBtn) return;

    let attempts = 0;

    // Ensure it can move
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

    // first jump
    setTimeout(moveNo, 250);
}

// ------------------------------------
// Love meter
// ------------------------------------
const loveMeter = document.getElementById('loveMeter');
const loveValue = document.getElementById('loveValue');
const extraLove = document.getElementById('extraLove');

function setInitialPosition() {
    if (!loveMeter || !loveValue) return;
    loveMeter.value = 100;
    loveValue.textContent = 100;
    loveMeter.style.width = '100%';
}

if (loveMeter) {
    loveMeter.addEventListener('input', () => {
        const value = parseInt(loveMeter.value, 10);
        loveValue.textContent = value;

        if (value > 100) {
            extraLove.classList.remove('hidden');
            const overflowPercentage = (value - 100) / 9900;
            const extraWidth = overflowPercentage * window.innerWidth * 0.8;
            loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
            loveMeter.style.transition = 'width 0.3s';

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

// ------------------------------------
// Celebration
// ------------------------------------
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    if (!celebration) return;
    celebration.classList.remove('hidden');

    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;

    createHeartExplosion();
}

function createHeartExplosion() {
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

// ------------------------------------
// Hidden surprise message: type "bubu"
// ------------------------------------
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

// ------------------------------------
// Intro overlay + Music toggle button
// ------------------------------------
function setupIntroAndMusicToggle() {
    const overlay = document.getElementById("introOverlay");
    const startBtn = document.getElementById("introStartBtn");

    // Start button: hide intro + start music (user gesture = allowed)
    if (overlay && startBtn) {
        startBtn.addEventListener("click", () => {
            overlay.style.display = "none";
            playYouTubeMusic();
        });
    }

    // If your page already has music toggle button, reuse it
    const musicToggle = document.getElementById("musicToggle");
    if (musicToggle) {
        let isPlaying = false;
        musicToggle.textContent = "🎵 Play Music";

        musicToggle.addEventListener("click", () => {
            if (!isPlaying) {
                playYouTubeMusic();
                musicToggle.textContent = "🔇 Stop Music";
                isPlaying = true;
            } else {
                stopYouTubeMusic();
                musicToggle.textContent = "🎵 Play Music";
                isPlaying = false;
            }
        });
    }
}

// ------------------------------------
// Button wiring for your page IDs
// ------------------------------------
function setupButtons() {
    const yesBtn1 = document.getElementById('yesBtn1');
    const noBtn1 = document.getElementById('noBtn1');
    const secretAnswerBtn = document.getElementById('secretAnswerBtn');

    const nextBtn = document.getElementById('nextBtn');

    const yesBtn3 = document.getElementById('yesBtn3');
    const noBtn3 = document.getElementById('noBtn3');

    // Q1
    if (yesBtn1) yesBtn1.addEventListener('click', () => showNextQuestion(2));
    if (noBtn1) noBtn1.addEventListener('click', (e) => {
        e.preventDefault();
        // small prank even on Q1
        prankNoButton(noBtn1, yesBtn1);
    });

    if (secretAnswerBtn) secretAnswerBtn.addEventListener('click', () => {
        alert(config.questions.first.secretAnswer);
    });

    // Q2 -> Q3
    if (nextBtn) nextBtn.addEventListener('click', () => showNextQuestion(3));

    // Q3
    if (yesBtn3) yesBtn3.addEventListener('click', celebrate);

    // MAX prank on final NO
    if (noBtn3 && yesBtn3) {
        prankNoButton(noBtn3, yesBtn3);
    }
}

// ------------------------------------
// DOM Ready init
// ------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    validateConfig();

    // Set texts from config
    const titleEl = document.getElementById('valentineTitle');
    if (titleEl) titleEl.textContent = `${config.valentineName}, my love...`;

    // Q1 texts
    document.getElementById('question1Text').textContent = config.questions.first.text;
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;
    document.getElementById('secretAnswerBtn').textContent = config.questions.first.secretAnswer;

    // Q2 texts
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;

    // Q3 texts
    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    createFloatingElements();
    setupButtons();
    setupHiddenSurprise();
    setupIntroAndMusicToggle();
    setInitialPosition();
});

window.addEventListener('load', setInitialPosition);
