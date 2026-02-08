const config = window.VALENTINE_CONFIG || {};
document.title = config.pageTitle || "Valentine 💝";

/* ---------------- THEME COLORS ---------------- */
(function applyTheme(){
  if(!config.colors) return;
  const r = document.documentElement;
  r.style.setProperty("--bg1", config.colors.backgroundStart);
  r.style.setProperty("--bg2", config.colors.backgroundEnd);
  r.style.setProperty("--btn", config.colors.buttonBackground);
  r.style.setProperty("--btnHover", config.colors.buttonHover);
  r.style.setProperty("--text", config.colors.textColor);
})();

/* ---------------- UTIL ---------------- */
function showOnly(id){
  document.querySelectorAll(".question-section").forEach(s => s.classList.add("hidden"));
  const t = document.getElementById("timeline");
  if (t) t.classList.add("hidden");
  const el = document.getElementById(id);
  if(el) el.classList.remove("hidden");
}

function typeText(el, text, speed=32){
  if(!el) return;
  el.textContent = "";
  let i = 0;
  const timer = setInterval(()=>{
    el.textContent += text[i] || "";
    i++;
    if(i >= text.length) clearInterval(timer);
  }, speed);
}

function flashWarning(warnEl, text){
  if(!warnEl) return;
  warnEl.textContent = text;
  warnEl.classList.remove("hidden");
  setTimeout(()=> warnEl.classList.add("hidden"), 1900);
}

/* ---------------- YOUTUBE MUSIC ---------------- */
let ytPlayer = null;
let ytReady = false;
let ytWantsPlay = false;

window.onYouTubeIframeAPIReady = function(){
  ytPlayer = new YT.Player("ytMusic", {
    videoId: "QGLHe7K0CQQ",
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: "QGLHe7K0CQQ",
      modestbranding: 1,
      rel: 0
    },
    events: {
      onReady: () => {
        ytReady = true;
        try { ytPlayer.setVolume(70); } catch(e) {}
        if (ytWantsPlay) {
          ytWantsPlay = false;
          playYtMusic();
        }
      }
    }
  });
};

function playYtMusic(){
  if(!ytReady || !ytPlayer) { ytWantsPlay = true; return; }
  try{
    ytPlayer.unMute();
    ytPlayer.setVolume(70);
    ytPlayer.playVideo();
  }catch(e){
    console.log("YT play failed:", e);
  }
}

function stopYtMusic(){
  if(!ytReady || !ytPlayer) return;
  try{ ytPlayer.pauseVideo(); }catch(e){}
}

function isYtPlaying(){
  try{
    return ytPlayer && ytReady && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === 1;
  }catch(e){ return false; }
}

/* ---------------- FLOATING EMOJIS ---------------- */
function createFloating(){
  const container = document.querySelector(".floating-elements");
  if(!container) return;

  const hearts = config.floatingEmojis?.hearts || ["❤️"];
  const bears = config.floatingEmojis?.bears || ["🧸"];

  const setPos = (el) => {
    el.style.left = Math.random()*100 + "vw";
    el.style.animationDelay = Math.random()*5 + "s";
    el.style.animationDuration = (10 + Math.random()*20) + "s";
  };

  hearts.forEach(h=>{
    const d = document.createElement("div");
    d.className = "heart";
    d.innerHTML = h;
    setPos(d);
    container.appendChild(d);
  });

  bears.forEach(b=>{
    const d = document.createElement("div");
    d.className = "bear";
    d.innerHTML = b;
    setPos(d);
    container.appendChild(d);
  });
}

/* ---------------- CURSOR TRAIL ---------------- */
function setupCursorTrail(){
  document.addEventListener("mousemove", (e)=>{
    const h = document.createElement("div");
    h.className = "cursor-heart";
    h.textContent = ["💗","💖","💘"][Math.floor(Math.random()*3)];
    h.style.left = e.clientX + "px";
    h.style.top  = e.clientY + "px";
    document.body.appendChild(h);
    setTimeout(()=> h.remove(), 800);
  });
}

/* ---------------- FAKE CHAT SIM ---------------- */
async function runChatSim(){
  const chat = document.getElementById("chatSim");
  const linesBox = document.getElementById("chatLines");
  const cont = document.getElementById("chatContinue");
  if(!chat || !linesBox || !cont) return;

  chat.classList.remove("hidden");
  linesBox.innerHTML = "";
  cont.classList.add("hidden");

  const lines = [
    "Ro Ro: hey 👀",
    "Bubu: hmm 😌",
    "Ro Ro: important question coming",
    "Bubu: dramatic",
    "Ro Ro: always 😄",
    "Ro Ro: ok ready? 💗"
  ];

  for(const l of lines){
    const d = document.createElement("div");
    d.className = "chat-line";
    d.textContent = l;
    linesBox.appendChild(d);
    await new Promise(r => setTimeout(r, 650));
  }

  cont.classList.remove("hidden");

  return new Promise(resolve => {
    cont.addEventListener("click", () => {
      chat.classList.add("hidden");
      resolve(true);
    }, { once: true });
  });
}

/* ---------------- LOVE METER + SMART REACTIONS ---------------- */
function setupLoveMeter(){
  const loveMeter = document.getElementById("loveMeter");
  const loveValue = document.getElementById("loveValue");
  const extraLove = document.getElementById("extraLove");
  const smart = document.getElementById("smartReaction");
  if(!loveMeter || !loveValue || !extraLove) return;

  loveMeter.value = 100;
  loveValue.textContent = "100";
  if (smart) smart.textContent = "🙂 suspicious";

  function setSmart(v){
    if(!smart) return;
    if(v < 120) smart.textContent = "🙂 hmm okay";
    else if(v < 300) smart.textContent = "😌 good human";
    else if(v < 1200) smart.textContent = "🥰 obsessed";
    else if(v < 5000) smart.textContent = "🚀 dangerous love";
    else smart.textContent = "💘 GOD MODE";
  }

  loveMeter.addEventListener("input", ()=>{
    const v = parseInt(loveMeter.value, 10);
    loveValue.textContent = String(v);
    setSmart(v);

    if(v > 100){
      extraLove.classList.remove("hidden");
      if(v >= 5000){
        extraLove.textContent = config.loveMessages?.extreme || "WOOOOW 🥰🚀💝";
        extraLove.classList.add("super-love");
      }else if(v > 1000){
        extraLove.textContent = config.loveMessages?.high || "To infinity and beyond! 🚀💝";
        extraLove.classList.remove("super-love");
      }else{
        extraLove.textContent = config.loveMessages?.normal || "And beyond! 🥰";
        extraLove.classList.remove("super-love");
      }
    }else{
      extraLove.classList.add("hidden");
      extraLove.classList.remove("super-love");
    }
  });
}

/* ---------------- COMPAT SCAN ---------------- */
function runCompatScan(next){
  const fill = document.getElementById("scanFill");
  const txt = document.getElementById("scanText");
  if(!fill || !txt) { next(); return; }

  showOnly("compat");

  let p = 0;
  txt.textContent = "Analyzing love patterns…";
  fill.style.width = "0%";

  const t = setInterval(()=>{
    p += 4;
    fill.style.width = p + "%";
    if(p >= 100){
      clearInterval(t);
      txt.textContent = "Compatibility: 1000% 💞 (Certified)";
      setTimeout(next, 900);
    }
  }, 80);
}

/* ---------------- NO BUTTON: START NORMAL -> BOUNCE -> RUN AWAY ---------------- */
function demonNoStartsNice(noBtn, yesBtn, warnEl){
  if(!noBtn || !yesBtn) return;

  let attempts = 0;
  let runaway = false;

  // Start normal with bounce on hover (but stays in layout)
  noBtn.classList.add("no-bounce");

  const moveAway = () => {
    // activate runaway positioning
    runaway = true;
    noBtn.classList.remove("no-bounce");

    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

    noBtn.style.position = "fixed";
    noBtn.style.left = Math.max(12, x) + "px";
    noBtn.style.top  = Math.max(12, y) + "px";
    noBtn.style.transform = `rotate(${Math.random()*360}deg) scale(${0.8 + Math.random()*0.5})`;
  };

  const onTry = (e) => {
    e.preventDefault();
    attempts++;

    if(attempts <= 2){
      // still stays in place
      flashWarning(warnEl, "⚠️ SYSTEM: ‘No’ not accepted 😌 Try again.");
      noBtn.classList.add("no-bounce");
      return;
    }

    flashWarning(warnEl, "⚠️ SYSTEM SCAN: Wrong choice detected 😈");

    const msgs = ["Nice try 😜","Not happening 😈","Illegal click 🚫","Think again 😏","HAHA nope 😂","Ok stop 😭","Fine… YES 💘"];
    noBtn.textContent = msgs[Math.min(attempts-3, msgs.length-1)];
    moveAway();

    if(attempts >= 9){
      noBtn.textContent = "Yes!! 💘";
      noBtn.style.transform = "none";
      noBtn.addEventListener("click", ()=> yesBtn.click(), { once:true });
    }
  };

  noBtn.addEventListener("mouseenter", ()=>{
    if(!runaway) noBtn.classList.add("no-bounce");
  });

  noBtn.addEventListener("click", onTry);
  noBtn.addEventListener("touchstart", onTry, { passive:false });
}

/* ---------------- FIREWORKS ---------------- */
function setupFireworks(){
  const canvas = document.getElementById("fireworksCanvas");
  if(!canvas) return null;
  const ctx = canvas.getContext("2d");
  const DPR = Math.max(1, window.devicePixelRatio || 1);

  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(DPR,0,0,DPR,0,0);
  };
  window.addEventListener("resize", resize);
  resize();

  let particles = [];
  let anim = null;

  const burst = (x,y) => {
    const count = 90;
    for(let i=0;i<count;i++){
      const a = Math.random()*Math.PI*2;
      const s = 2 + Math.random()*6;
      particles.push({ x,y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life:60+Math.random()*30, size:1+Math.random()*2.4 });
    }
  };

  const tick = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles = particles.filter(p=> p.life>0);
    for(const p of particles){
      p.vy += 0.08;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;

      const alpha = Math.max(0, p.life/90);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if(particles.length>0) anim = requestAnimationFrame(tick);
    else { anim=null; ctx.clearRect(0,0,canvas.width,canvas.height); }
  };

  return {
    fire(){
      for(let i=0;i<7;i++){
        burst(Math.random()*window.innerWidth, Math.random()*window.innerHeight*0.6);
      }
      if(!anim) tick();
    }
  };
}

/* ---------------- LOCK SCREEN ---------------- */
function showLockScreenThen(next){
  const ls = document.getElementById("lockScreen");
  if(!ls){ next(); return; }
  ls.classList.remove("hidden");
  setTimeout(()=>{
    ls.classList.add("hidden");
    next();
  }, 1500);
}

/* ---------------- DARK MODE ---------------- */
function setupDarkMode(){
  const btn = document.getElementById("darkModeToggle");
  if(!btn) return;

  const saved = localStorage.getItem("val_dark") === "1";
  if(saved) document.body.classList.add("dark");
  btn.textContent = document.body.classList.contains("dark") ? "☀️ Light" : "🌙 Dark";

  btn.addEventListener("click", ()=>{
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("val_dark", isDark ? "1" : "0");
    btn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  });
}

/* ---------------- TIMED SURPRISE POPUP ---------------- */
function setupTimedPopup(){
  setTimeout(()=>{
    const overlay = document.getElementById("introOverlay");
    if(overlay && !overlay.classList.contains("hidden") && overlay.style.display !== "none") return;
    window.alert("Still here? That means you like me 😌💗");
  }, 20000);
}

/* ---------------- MAIN INIT ---------------- */
window.addEventListener("DOMContentLoaded", async () => {
  setupDarkMode();
  setupCursorTrail();
  setupTimedPopup();

  // Set texts from config
  const title = document.getElementById("valentineTitle");
  if(title) title.textContent = `${config.valentineName || "My Love"}, my love...`;

  document.getElementById("question1Text").textContent = config.questions?.first?.text || "Do you like me?";
  document.getElementById("yesBtn1").textContent = config.questions?.first?.yesBtn || "Yes";
  document.getElementById("noBtn1").textContent = config.questions?.first?.noBtn || "No";
  document.getElementById("secretAnswerBtn").textContent = "Secret 💌";

  document.getElementById("question2Text").textContent = config.questions?.second?.text || "How much do you love me?";
  document.getElementById("startText").textContent = config.questions?.second?.startText || "This much!";
  document.getElementById("nextBtn").textContent = config.questions?.second?.nextBtn || "Next ❤️";

  document.getElementById("question3Text").textContent = config.questions?.third?.text || "Will you be my Valentine?";
  document.getElementById("yesBtn3").textContent = config.questions?.third?.yesBtn || "Yes!";
  document.getElementById("noBtn3").textContent = config.questions?.third?.noBtn || "No";

  // Floating emojis
  createFloating();

  // Fake chat (runs after Start)
  const startBtn = document.getElementById("introStartBtn");
  const overlay = document.getElementById("introOverlay");

  // Music toggle
  const musicToggle = document.getElementById("musicToggle");
  if(musicToggle){
    musicToggle.addEventListener("click", ()=>{
      if(isYtPlaying()){
        stopYtMusic();
        musicToggle.textContent = "🎵 Play Music";
      }else{
        playYtMusic();
        musicToggle.textContent = "🔇 Stop Music";
      }
    });
  }

  // Easter egg: title click
  if(title){
    title.style.cursor = "pointer";
    title.addEventListener("click", ()=> window.alert("💌 Secret unlocked:\nYou are my favorite human. Always."));
  }

  // Love meter
  setupLoveMeter();

  // Fireworks
  const fw = setupFireworks();

  // Start flow
  if(startBtn){
    startBtn.addEventListener("click", async ()=>{
      // hide overlay
      overlay.style.display = "none";

      // play music (user gesture)
      playYtMusic();
      if(musicToggle) musicToggle.textContent = "🔇 Stop Music";

      // chat sim
      await runChatSim();

      // show question1
      showOnly("question1");
    });
  }

  // Q1
  const yes1 = document.getElementById("yesBtn1");
  const no1 = document.getElementById("noBtn1");
  const warn1 = document.getElementById("systemWarning");

  yes1.addEventListener("click", ()=> showOnly("question2"));
  demonNoStartsNice(no1, yes1, warn1);

  document.getElementById("secretAnswerBtn").addEventListener("click", ()=>{
    window.alert(config.questions?.first?.secretAnswer || "I love you ❤️");
  });

  // Q2 next -> compat scan -> Q3
  document.getElementById("nextBtn").addEventListener("click", ()=>{
    runCompatScan(()=> showOnly("question3"));
  });

  // Q3
  const yes3 = document.getElementById("yesBtn3");
  const no3 = document.getElementById("noBtn3");
  const warn3 = document.getElementById("systemWarning3");

  demonNoStartsNice(no3, yes3, warn3);

  yes3.addEventListener("click", ()=>{
    // lock screen then celebration
    showLockScreenThen(()=>{
      showOnly("celebration");

      const ct = document.getElementById("celebrationTitle");
      const cm = document.getElementById("celebrationMessage");
      const ce = document.getElementById("celebrationEmojis");

      ct.textContent = config.celebration?.title || "Yay! 🎉";
      ce.textContent = config.celebration?.emojis || "🎁💖🤗💝💋❤️💕";

      // typed love letter
      typeText(cm, config.celebration?.message || "Now come get your gift… 💋", 32);

      // fireworks
      if(fw) fw.fire();
    });
  });

  // Timeline button
  const seeTl = document.getElementById("seeTimelineBtn");
  const tl = document.getElementById("timeline");
  if(seeTl && tl){
    seeTl.addEventListener("click", ()=>{
      tl.classList.remove("hidden");
      tl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
});
