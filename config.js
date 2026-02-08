// ============================================
// 💝 CUSTOMIZE YOUR VALENTINE'S WEBSITE HERE 💝
// ============================================

const CONFIG = {
    // Your Valentine's name that will appear in the title
    valentineName: "Bubu",

    // The title that appears in the browser tab
    pageTitle: "Bubu ❤️ Ro Ro",

    // Floating emojis that appear in the background
    floatingEmojis: {
        hearts: ['❤️', '💖', '💝', '💗', '💓'],
        bears: ['🧸', '🐻']
    },

    // Questions and answers
    questions: {
        first: {
            text: "Bubu, do you like Ro Ro? 🥺❤️",
            yesBtn: "Yes 😌",
            noBtn: "No 🙈",
            secretAnswer: "I don't just like you, I love you! ❤️"
        },
        second: {
            text: "How much do you love Ro Ro? 💞",
            startText: "This much!",
            nextBtn: "Next ❤️"
        },
        third: {
            text: "Will you be my Valentine on February 14th, 2026? 🌹",
            yesBtn: "Yes!! 💘",
            noBtn: "No 😜"
        }
    },

    // Love meter messages
    loveMessages: {
        extreme: "WOOOOW you love Ro Ro that much?? 🥰🚀💝",
        high: "To infinity and beyond! 🚀💝",
        normal: "And beyond! 🥰"
    },

    // Messages after they say Yes
    celebration: {
        title: "Yayyy!! Ro Ro is the luckiest person alive 💘🎉",
        message: "Now come here — hug first, then Valentine’s plan 😘🤗",
        emojis: "🎁💖🤗💝💋❤️💕"
    },

    // Color scheme
    colors: {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    },

    // Animation settings
    animations: {
        floatDuration: "15s",
        floatDistance: "50px",
        bounceSpeed: "0.5s",
        heartExplosionSize: 1.5
    },

    // Background Music
    music: {
        enabled: true,
        autoplay: false,   // safer for browsers
        musicUrl: "https://res.cloudinary.com/dncywqfpb/video/upload/v1738399057/music_qrhjvy.mp3",
        startText: "🎵 Play Music",
        stopText: "🔇 Stop Music",
        volume: 0.5
    }
};

// Don't modify anything below this line
window.VALENTINE_CONFIG = CONFIG;
