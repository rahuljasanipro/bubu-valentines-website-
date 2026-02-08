// ============================================
// 💝 CUSTOMIZE YOUR VALENTINE'S WEBSITE HERE 💝
// ============================================

const CONFIG = {
  valentineName: "Bubu",
  pageTitle: "Bubu ❤️ Ro Ro",

  floatingEmojis: {
    hearts: ["❤️", "💖", "💝", "💗", "💓"],
    bears: ["🧸", "🐻"],
  },

  questions: {
    first: {
      text: "Bubu, do you like Ro Ro? 🥺❤️",
      yesBtn: "Yes 😌",
      noBtn: "No 🙈",
      secretAnswer: "I don't just like you, I love you! ❤️",
    },
    second: {
      text: "How much do you love Ro Ro? 💞",
      startText: "This much!",
      nextBtn: "Next ❤️",
    },
    third: {
      text: "Will you be my Valentine on February 14th, 2026? 🌹",
      yesBtn: "Yes!! 💘",
      noBtn: "No 😜",
    },
  },

  loveMessages: {
    extreme: "WOOOOW you love Ro Ro that much?? 🥰🚀💝",
    high: "To infinity and beyond! 🚀💝",
    normal: "And beyond! 🥰",
  },

  celebration: {
    title: "Yayyy!! Ro Ro is the luckiest person alive 💘🎉",
    message: "Now come here — hug first, then Valentine’s plan 😘🤗",
    emojis: "🎁💖🤗💝💋❤️💕",
  },

  colors: {
    backgroundStart: "#ffafbd",
    backgroundEnd: "#ffc3a0",
    buttonBackground: "#ff6b6b",
    buttonHover: "#ff8787",
    textColor: "#ff4757",
  },

  animations: {
    floatDuration: "15s",
    floatDistance: "50px",
    bounceSpeed: "0.5s",
    heartExplosionSize: 1.5,
  },

  // kept for compatibility, but we play via YouTube in script.js
  music: {
    enabled: true,
    autoplay: false,
    musicUrl: "",
    startText: "🎵 Play Music",
    stopText: "🔇 Stop Music",
    volume: 0.5,
  },
};

window.VALENTINE_CONFIG = CONFIG;
