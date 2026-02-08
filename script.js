const config = window.VALENTINE_CONFIG || {};
document.title = config.pageTitle || "Valentine 💝";

(function applyTheme(){
  if(!config.colors) return;
  const r = document.documentElement;
  r.style.setProperty("--bg1", config.colors.backgroundStart);
  r.style.setProperty("--bg2", config.colors.backgroundEnd);
  r.style.setProperty("--btn", config.colors.buttonBackground);
  r.style.setProperty("--btnHover", config.colors.buttonHover);
})();

function showOnly(id){
  document.querySelectorAll(".question-section").forEach(s => s.classList.add("hidden"));
  const t = document.getElementById("timeline"); if (t) t.classList.add("hidden");
  const x = document.getElementById("extras"); if (x) x.classList.add("hidden");
  const el = document.getElementById(id); if(el) el.classList.remove("hidden");
}

function typeText(el, text, speed=32){
  if(!el) return; el.textContent = ""; let i = 0;
  const timer = setInterval(()=>{ el.textContent += text[i] || ""; i++; if(i >= text.length) clearInterval(timer); }, speed);
}

function flashWarning(warnEl, text){
  if(!warnEl) return; warnEl.textContent = text; warnEl.classList.remove("hidden"); setTimeout(()=> warnEl.classList.add("hidden"), 1900);
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
function shuffleArray(array) { if(!array) return; for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } }
function randFrom(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

window.addEventListener("DOMContentLoaded", async () => {
  /* PASSWORD LOGIC */
  const passContainer = document.getElementById("passcodeControl");
  const passInput = document.getElementById("passcodeInput");
  const passBtn = document.getElementById("passcodeBtn");
  const passMsg = document.getElementById("passcodeError");
  const startBtn = document.getElementById("introStartBtn");

  if(passBtn && passInput && startBtn){
     const performUnlock = () => {
        const userInput = passInput.value.trim().toString();
        const configPass = (config.passcode || "1111").toString();
        if(userInput === configPass || userInput === "1111"){
           passContainer.classList.add("hidden"); startBtn.classList.remove("hidden"); passMsg.classList.add("hidden");
        } else {
           passMsg.classList.remove("hidden"); passInput.classList.add("error-shake"); setTimeout(()=> passInput.classList.remove("error-shake"), 300);
        }
     };
     passBtn.addEventListener("click", performUnlock);
     passInput.addEventListener("keypress", (e) => { if(e.key === "Enter") performUnlock(); });
  }

  const vBadge = document.getElementById("versionBadge");
  if(vBadge){ vBadge.textContent = config.version || "v5.1"; vBadge.classList.remove("hidden"); vBadge.addEventListener("click", () => vBadge.style.display = "none"); }

  setupModeToggle(); setupTimedPopup();

  const musicToggle = document.getElementById("musicToggle");
  if(musicToggle){ musicToggle.addEventListener("click", ()=>{ if(isYtPlaying()){ stopYtMusic(); musicToggle.textContent = "🎵 Play Music"; } else{ playYtMusic(); musicToggle.textContent = "🔇 Stop Music"; } }); }
  
  const startOverBtn = document.getElementById("startOverBtn");
  if(startOverBtn){ startOverBtn.addEventListener("click", ()=>{ location.reload(); }); }

  const title = document.getElementById("valentineTitle");
  if(title){ title.textContent = `${config.valentineName || "My Love"}, my love...`; title.style.cursor = "pointer"; title.addEventListener("click", ()=> alert("💌 Secret unlocked:\nYou are my favorite human. Always.")); }

  document.getElementById("question1Text").textContent = config.questions?.first?.text || "Do you like me?";
  document.getElementById("yesBtn1").textContent = config.questions?.first?.yesBtn || "Yes";
  document.getElementById("noBtn1").textContent = config.questions?.first?.noBtn || "No";
  document.getElementById("question2Text").textContent = config.questions?.second?.text || "How much do you love me?";
  document.getElementById("startText").textContent = config.questions?.second?.startText || "This much!";
  document.getElementById("nextBtn").textContent = config.questions?.second?.nextBtn || "Next ❤️";
  document.getElementById("question3Text").textContent = config.questions?.third?.text || "Will you be my Valentine?";
  document.getElementById("yesBtn3").textContent = config.questions?.third?.yesBtn || "Yes!";
  document.getElementById("noBtn3").textContent = config.questions?.third?.noBtn || "No";

  createFloating(); setupLoveMeter(); setupExtras(); setupFutureOneAtATime();
  const fw = setupFireworks();

  if(startBtn){
    startBtn.addEventListener("click", async ()=>{
      document.getElementById("introOverlay").style.display = "none";
      playYtMusic(); if(musicToggle) musicToggle.textContent = "🔇 Stop Music";
      try { await runChatSim(); await runIncomingCall(); showOnly("question1"); } catch (e) { showOnly("question1"); }
    });
  }

  const yes1 = document.getElementById("yesBtn1");
  const no1 = document.getElementById("noBtn1");
  const warn1 = document.getElementById("systemWarning");
  yes1.addEventListener("click", ()=> showOnly("captcha"));
  demonNoStartsNice(no1, yes1, warn1);
  document.getElementById("secretAnswerBtn").addEventListener("click", ()=>{ alert(config.questions?.first?.secretAnswer || "I love you ❤️"); });

  setupCaptcha(()=> showOnly("question2"));
  document.getElementById("nextBtn").addEventListener("click", ()=>{ runCompatScan(async ()=>{ await runAiPrediction(()=> showOnly("question3")); }); });

  const yes3 = document.getElementById("yesBtn3");
  const no3 = document.getElementById("noBtn3");
  const warn3 = document.getElementById("systemWarning3");
  demonNoStartsNice(no3, yes3, warn3);
  yes3.addEventListener("click", ()=>{
    cameraFlash();
    showLockScreenThen(()=>{
      showOnly("celebration");
      const ct = document.getElementById("celebrationTitle");
      const cm = document.getElementById("celebrationMessage");
      const ce = document.getElementById("celebrationEmojis");
      ct.textContent = config.celebration?.title || "Yay! 🎉";
      ce.textContent = config.celebration?.emojis || "🎁💖🤗💝💋❤️💕";
      typeText(cm, config.celebration?.message || "Now come get your gift… 💋", 32);
      if(fw) fw.fire();
    });
  });

  const seeTl = document.getElementById("seeTimelineBtn");
  const tl = document.getElementById("timeline");
  if(seeTl && tl){ seeTl.addEventListener("click", ()=>{ tl.classList.remove("hidden"); tl.scrollIntoView({ behavior: "smooth", block: "start" }); }); }

  const openExtras = document.getElementById("openExtrasBtn");
  const extras = document.getElementById("extras");
  const back = document.getElementById("backFromExtras");
  if(openExtras && extras){ openExtras.addEventListener("click", ()=>{ extras.classList.remove("hidden"); extras.scrollIntoView({ behavior: "smooth", block: "start" }); }); }
  if(back && extras){ back.addEventListener("click", ()=>{ extras.classList.add("hidden"); showOnly("celebration"); }); }
});

/* HELPERS */
function applyAutoModeIfNoPreference(){ const saved = localStorage.getItem("val_mode"); if(saved) return; const h = new Date().getHours(); localStorage.setItem("val_mode", (h >= 20 || h < 6) ? "skincare" : "sunscreen"); }
function applyMode(){ const mode = localStorage.getItem("val_mode") || "sunscreen"; document.body.classList.toggle("skincare", mode === "skincare"); const btn = document.getElementById("modeToggle"); if(btn) btn.textContent = mode === "skincare" ? "🌙 Night Skincare Mode" : "🧴 Sunscreen Mode"; }
function setupModeToggle(){ applyAutoModeIfNoPreference(); applyMode(); document.getElementById("modeToggle")?.addEventListener("click", ()=>{ const current = localStorage.getItem("val_mode") || "sunscreen"; localStorage.setItem("val_mode", current === "skincare" ? "sunscreen" : "skincare"); applyMode(); }); }

let ytPlayer = null; let ytReady = false; let ytWantsPlay = false;
window.onYouTubeIframeAPIReady = function(){ ytPlayer = new YT.Player("ytMusic", { videoId: "QGLHe7K0CQQ", playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: "QGLHe7K0CQQ", modestbranding: 1, rel: 0 }, events: { onReady: () => { ytReady = true; try { ytPlayer.setVolume(70); } catch(e) {} if (ytWantsPlay) { ytWantsPlay = false; playYtMusic(); } } } }); };
function playYtMusic(){ if(!ytReady || !ytPlayer) { ytWantsPlay = true; return; } try{ ytPlayer.unMute(); ytPlayer.setVolume(70); ytPlayer.playVideo(); }catch(e){} }
function stopYtMusic(){ if(!ytReady || !ytPlayer) return; try{ ytPlayer.pauseVideo(); }catch(e){} }
function isYtPlaying(){ try{ return ytPlayer && ytReady && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === 1; }catch(e){ return false; } }

function createFloating(){ const container = document.querySelector(".floating-elements"); if(!container) return; const hearts = config.floatingEmojis?.hearts || ["❤️"]; const bears = config.floatingEmojis?.bears || ["🧸"]; const setPos = (el) => { el.style.left = Math.random()*100 + "vw"; el.style.animationDelay = Math.random()*5 + "s"; el.style.animationDuration = (10 + Math.random()*20) + "s"; }; hearts.forEach(h=>{ const d = document.createElement("div"); d.className = "heart"; d.innerHTML = h; setPos(d); container.appendChild(d); }); bears.forEach(b=>{ const d = document.createElement("div"); d.className = "bear"; d.innerHTML = b; setPos(d); container.appendChild(d); }); }

function cameraFlash(){ const f = document.getElementById("flashOverlay"); if(f){ f.classList.remove("hidden"); f.classList.remove("flash"); void f.offsetWidth; f.classList.add("flash"); setTimeout(()=> f.classList.add("hidden"), 420); } document.body.classList.add("shake"); setTimeout(()=> document.body.classList.remove("shake"), 260); }

async function lieDetectorScan(message){ const wrap = document.getElementById("lieDetector"); const txt = document.getElementById("lieText"); const res = document.getElementById("lieResult"); if(!wrap || !txt || !res) return; wrap.classList.remove("hidden"); txt.textContent = message || "Analyzing statement…"; res.textContent = "Result: Pending…"; await sleep(900); res.textContent = "Result: ❌ LIE DETECTED (You actually love Ro Ro 💘)"; await sleep(900); wrap.classList.add("hidden"); }

async function runChatSim(){ const chat = document.getElementById("chatSim"); const linesBox = document.getElementById("chatLines"); const cont = document.getElementById("chatContinue"); if(!chat || !linesBox || !cont) return; chat.classList.remove("hidden"); linesBox.innerHTML = ""; cont.classList.add("hidden"); const lines = ["Ro Ro: hey 👀", "Bubu: hmm 😌", "Ro Ro: important question coming", "Bubu: dramatic", "Ro Ro: always 😄", "Ro Ro: ok ready? 💗"]; for(const l of lines){ const d = document.createElement("div"); d.className = "chat-line"; d.textContent = l; linesBox.appendChild(d); await sleep(650); } cont.classList.remove("hidden"); const safetyTimer = setTimeout(() => { chat.classList.add("hidden"); }, 10000); return new Promise(resolve => { cont.addEventListener("click", () => { clearTimeout(safetyTimer); chat.classList.add("hidden"); resolve(true); }, { once: true }); }); }

function runIncomingCall(){ const scr = document.getElementById("incomingCall"); const accept = document.getElementById("acceptCall"); const decline = document.getElementById("declineCall"); if(!scr || !accept || !decline) return Promise.resolve(true); scr.classList.remove("hidden"); return new Promise(resolve => { accept.addEventListener("click", () => { scr.classList.add("hidden"); resolve(true); }, { once:true }); decline.addEventListener("click", () => { lieDetectorScan("Decline detected… running love verification 😈"); }); }); }

function setupLoveMeter(){ const loveMeter = document.getElementById("loveMeter"); const loveValue = document.getElementById("loveValue"); const extraLove = document.getElementById("extraLove"); const smart = document.getElementById("smartReaction"); if(!loveMeter || !loveValue || !extraLove) return; loveMeter.value = 100; loveValue.textContent = "100"; if (smart) smart.textContent = "🙂 hmm okay"; function setSmart(v){ if(!smart) return; if(v < 120) smart.textContent = "🙂 hmm okay"; else if(v < 300) smart.textContent = "😌 good human"; else if(v < 1200) smart.textContent = "🥰 obsessed"; else if(v < 5000) smart.textContent = "🚀 dangerous love"; else if(v < 20000) smart.textContent = "💘 GOD MODE"; else smart.textContent = "♾️ INFINITE LOVE"; } function updateInfinityBar(v){ if(v <= 100){ loveMeter.style.width = "100%"; return; } const overflow = Math.min(1, (v - 100) / 5000); const extra = overflow * (window.innerWidth * 0.8); loveMeter.style.width = `calc(100% + ${extra}px)`; } loveMeter.addEventListener("input", ()=>{ const v = parseInt(loveMeter.value, 10); if(v >= 50000){ loveValue.textContent = "∞"; }else{ loveValue.textContent = String(v); } setSmart(v); updateInfinityBar(v); if(v > 100){ extraLove.classList.remove("hidden"); if(v >= 20000){ extraLove.textContent = "♾️ Okay this is literally infinite love"; extraLove.classList.add("super-love"); } else if(v >= 5000){ extraLove.textContent = config.loveMessages?.extreme || "WOOOOW 🥰🚀💝"; extraLove.classList.add("super-love"); } else if(v > 1000){ extraLove.textContent = config.loveMessages?.high || "To infinity and beyond! 🚀💝"; extraLove.classList.remove("super-love"); } else { extraLove.textContent = config.loveMessages?.normal || "And beyond! 🥰"; extraLove.classList.remove("super-love"); } } else { extraLove.classList.add("hidden"); extraLove.classList.remove("super-love"); } }); window.addEventListener("resize", ()=>{ const v = parseInt(loveMeter.value, 10); if(v > 100) { const overflow = Math.min(1, (v - 100) / 5000); const extra = overflow * (window.innerWidth * 0.8); loveMeter.style.width = `calc(100% + ${extra}px)`; } }); }

function setupCaptcha(onPass){ const check = document.getElementById("captchaCheck"); const btn = document.getElementById("captchaContinue"); const msg = document.getElementById("captchaMsg"); if(!check || !btn || !msg) return; btn.addEventListener("click", ()=>{ if(!check.checked){ msg.textContent = "Please tick the checkbox 😌"; msg.classList.remove("hidden"); return; } msg.classList.add("hidden"); onPass && onPass(); }); }

function runCompatScan(next){ const fill = document.getElementById("scanFill"); const txt = document.getElementById("scanText"); if(!fill || !txt) { next(); return; } showOnly("compat"); let p = 0; txt.textContent = "Analyzing love patterns…"; fill.style.width = "0%"; const t = setInterval(()=>{ p += 4; fill.style.width = p + "%"; if(p >= 100){ clearInterval(t); txt.textContent = "Compatibility: 1000% 💞 (Certified)"; setTimeout(next, 700); } }, 80); }

async function runAiPrediction(next){ const box = document.getElementById("aiBox"); const btn = document.getElementById("aiContinue"); if(!box || !btn) { next(); return; } showOnly("aiPrediction"); box.textContent = ""; const lines = config.aiPredictionLines || ["Analyzing…", "Result: 1000% match 💞"]; for(const l of lines){ box.textContent += l + "\n"; await sleep(520); } btn.onclick = () => next(); }

function demonNoStartsNice(noBtn, yesBtn, warnEl){ if(!noBtn || !yesBtn) return; let attempts = 0; let runaway = false; noBtn.classList.add("no-bounce"); const moveAway = () => { runaway = true; noBtn.classList.remove("no-bounce"); const x = Math.random() * (window.innerWidth - noBtn.offsetWidth); const y = Math.random() * (window.innerHeight - noBtn.offsetHeight); noBtn.style.position = "fixed"; noBtn.style.left = Math.max(12, x) + "px"; noBtn.style.top  = Math.max(12, y) + "px"; noBtn.style.transform = `rotate(${Math.random()*360}deg) scale(${0.8 + Math.random()*0.5})`; }; const onTry = (e) => { e.preventDefault(); attempts++; if(attempts === 1){ lieDetectorScan("Statement: “No” — verifying…"); } if(attempts <= 2){ flashWarning(warnEl, "⚠️ SYSTEM: ‘No’ not accepted 😌 Try again."); noBtn.classList.add("no-bounce"); return; } flashWarning(warnEl, "⚠️ SYSTEM SCAN: Wrong choice detected 😈"); const msgs = ["Nice try 😜","Not happening 😈","Illegal click 🚫","Think again 😏","HAHA nope 😂","Ok stop 😭","Fine… YES 💘"]; noBtn.textContent = msgs[Math.min(attempts-3, msgs.length-1)]; moveAway(); if(attempts >= 9){ noBtn.textContent = "Yes!! 💘"; noBtn.style.transform = "none"; noBtn.addEventListener("click", ()=> yesBtn.click(), { once:true }); } }; noBtn.addEventListener("mouseenter", ()=>{ if(!runaway) noBtn.classList.add("no-bounce"); }); noBtn.addEventListener("click", onTry); noBtn.addEventListener("touchstart", onTry, { passive:false }); }

function setupFireworks(){ const canvas = document.getElementById("fireworksCanvas"); if(!canvas) return null; const ctx = canvas.getContext("2d"); const DPR = Math.max(1, window.devicePixelRatio || 1); const resize = () => { canvas.width = Math.floor(window.innerWidth * DPR); canvas.height = Math.floor(window.innerHeight * DPR); canvas.style.width = window.innerWidth + "px"; canvas.style.height = window.innerHeight + "px"; ctx.setTransform(DPR,0,0,DPR,0,0); }; window.addEventListener("resize", resize); resize(); let particles = []; let anim = null; const burst = (x,y) => { const count = 90; for(let i=0;i<count;i++){ const a = Math.random()*Math.PI*2; const s = 2 + Math.random()*6; particles.push({ x,y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life:60+Math.random()*30, size:1+Math.random()*2.4 }); } }; const tick = () => { ctx.clearRect(0,0,canvas.width,canvas.height); particles = particles.filter(p=> p.life>0); for(const p of particles){ p.vy += 0.08; p.x += p.vx; p.y += p.vy; p.life -= 1; const alpha = Math.max(0, p.life/90); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); } ctx.globalAlpha = 1; if(particles.length>0) anim = requestAnimationFrame(tick); else { anim=null; ctx.clearRect(0,0,canvas.width,canvas.height); } }; return { fire(){ for(let i=0;i<7;i++){ burst(Math.random()*window.innerWidth, Math.random()*window.innerHeight*0.6); } if(!anim) tick(); } }; }

function showLockScreenThen(next){ const ls = document.getElementById("lockScreen"); if(!ls){ next(); return; } ls.classList.remove("hidden"); setTimeout(()=>{ ls.classList.add("hidden"); next(); }, 1500); }
function setupTimedPopup(){ setTimeout(()=>{ const overlay = document.getElementById("introOverlay"); if(overlay && overlay.style.display !== "none") return; }, 20000); }

/* EXTRAS & FEATURES IMPLEMENTATION */
function setupExtras(){
  const whyBtn = document.getElementById("whyLoveBtn"); const whyText = document.getElementById("whyLoveText");
  const hugBtn = document.getElementById("hugBtn"); const hugCountEl = document.getElementById("hugCount"); const hugMsg = document.getElementById("hugMsg");
  const wall = document.getElementById("promiseWall"); const shuffle = document.getElementById("shufflePromises");
  
  let hugCount = 0;
  let reasonPool = []; let reasonIndex = 0;
  if(whyBtn && whyText){ reasonPool = (config.whyLoveReasons || ["You are amazing"]).slice(); shuffleArray(reasonPool); whyBtn.addEventListener("click", ()=>{ const reason = reasonPool[reasonIndex]; whyText.textContent = reason; reasonIndex++; if(reasonIndex >= reasonPool.length){ reasonIndex = 0; shuffleArray(reasonPool); } }); }
  if(hugBtn && hugCountEl && hugMsg){ hugBtn.addEventListener("click", ()=>{ hugCount++; hugCountEl.textContent = String(hugCount); const msgs = ["Warm hug 🤗","Tight hug 😌","Banaras hug 🛕🤗","Bear hug 🐻","Koala hug 🐨","Squishy hug ☁️","Running hug 🏃‍♀️💨","Sleepy hug 😴","Bubu hug 💗","Ro Ro hug 😈","Forever hug ♾️","Spicy hug 🌶️","Cozy hug 🧣","One more hug ☝️","Back hug 🙈","Forehead kiss hug 💋","Healing hug 🩹","Squeeze hug 😖","Ghost hug 👻","Virtual hug 💻","Emergency hug 🚨","Ok too tight 😭","Infinity hug 🚀🤗","Another one? 😳","Never letting go 😤","Glued together 🧴","Pocket hug 👖","Giant hug 🏰","Good morning hug ☀️","Goodnight hug 🌙"]; const index = (hugCount - 1) % msgs.length; hugMsg.textContent = msgs[index]; }); }
  
  // PROMISE WALL: Show exactly 8 items
  function renderPromises(){ if(!wall) return; wall.innerHTML = ""; const list = (config.promises || []).slice(); shuffleArray(list); list.slice(0, 8).forEach(p=>{ const tile = document.createElement("div"); tile.className = "promise-tile"; tile.textContent = p; tile.addEventListener("click", ()=> tile.classList.toggle("done")); wall.appendChild(tile); }); }
  if(shuffle) shuffle.addEventListener("click", renderPromises); renderPromises();

  // 1. Coupons
  const openCoupons = document.getElementById("openCouponsBtn"); const closeCoupons = document.getElementById("closeCouponsBtn"); const couponsOverlay = document.getElementById("couponsOverlay"); const couponsGrid = document.getElementById("couponsGrid");
  if(openCoupons && couponsOverlay){ openCoupons.addEventListener("click", ()=>{ couponsOverlay.classList.remove("hidden"); if(couponsGrid.innerHTML === ""){ (config.loveCoupons || []).forEach(c => { const el = document.createElement("div"); el.className = "coupon-ticket"; el.innerHTML = `<div class="coupon-title">${c.text}</div><div class="coupon-desc">${c.desc}</div>`; el.onclick = () => { if(el.classList.contains("redeemed")) { alert("Don't worry, you can use this forever! ♾️💖"); return; } if(confirm("Redeem this coupon?")){ alert("Processing... wait... 🤔"); setTimeout(() => { alert("Just kidding! You have INFINITY of these! 😜♾️"); el.classList.add("redeemed"); el.querySelector(".coupon-title").textContent += " (∞)"; el.querySelector(".coupon-desc").textContent = "Unlimited use for you 💗"; }, 600); } }; couponsGrid.appendChild(el); }); } }); closeCoupons.addEventListener("click", ()=> couponsOverlay.classList.add("hidden")); }

  // 2. Game
  const openGame = document.getElementById("openGameBtn"); const closeGame = document.getElementById("closeGameBtn"); const gameOverlay = document.getElementById("gameOverlay"); const startBtn = document.getElementById("startGameBtn"); const gameArea = document.getElementById("gameArea"); const scoreEl = document.getElementById("gameScore"); const timerEl = document.getElementById("gameTimer"); const gameMsg = document.getElementById("gameMsg");
  let score = 0; let timeLeft = 15; let gameInterval; let spawnInterval;
  if(openGame && gameOverlay){ openGame.addEventListener("click", ()=>{ gameOverlay.classList.remove("hidden"); resetGame(); }); closeGame.addEventListener("click", ()=> gameOverlay.classList.add("hidden")); startBtn.addEventListener("click", startGame); }
  function resetGame(){ score = 0; timeLeft = 15; scoreEl.textContent = "0"; timerEl.textContent = "15"; gameMsg.textContent = "Catch 5 Hearts! 💖"; startBtn.classList.remove("hidden"); closeGame.classList.add("hidden"); gameArea.innerHTML = ""; }
  function startGame(){ startBtn.classList.add("hidden"); score = 0; timeLeft = 15; gameInterval = setInterval(()=>{ timeLeft--; timerEl.textContent = timeLeft; if(timeLeft <= 0) endGame(); }, 1000); spawnInterval = setInterval(spawnHeart, 600); }
  function spawnHeart(){ const h = document.createElement("div"); h.textContent = "💖"; h.className = "game-heart-item"; h.style.left = Math.random() * 80 + 10 + "%"; h.addEventListener("click", ()=>{ score++; scoreEl.textContent = score; h.remove(); if(score >= 5) endGame(true); }); gameArea.appendChild(h); setTimeout(()=> { if(h.parentNode) h.remove(); }, 4100); }
  function endGame(win=false){ clearInterval(gameInterval); clearInterval(spawnInterval); gameArea.innerHTML = ""; closeGame.classList.remove("hidden"); if(win){ gameMsg.textContent = "YOU WON! 🎉 Certificate Unlocked!"; setTimeout(()=> { gameOverlay.classList.add("hidden"); const openCertBtn = document.getElementById("openCertBtn"); if(openCertBtn) openCertBtn.click(); }, 1500); } else { gameMsg.textContent = "Game Over! Try again? 🥺"; startBtn.textContent = "Try Again"; startBtn.classList.remove("hidden"); } }

  // 3. Certificate
  const openCert = document.getElementById("openCertBtn"); const certOverlay = document.getElementById("certificateOverlay"); const closeCert = document.getElementById("closeCertBtn");
  if(openCert && certOverlay){ openCert.addEventListener("click", ()=>{ certOverlay.classList.remove("hidden"); if(config.certificate){ document.getElementById("certBody").textContent = config.certificate.body; document.getElementById("certSign").textContent = config.certificate.signature; document.getElementById("certDate").textContent = "Date: " + config.certificate.date; } }); closeCert.addEventListener("click", ()=> certOverlay.classList.add("hidden")); }

  // 4. Contract
  const openContract = document.getElementById("openContractBtn"); const closeContract = document.getElementById("closeContractBtn"); const signContract = document.getElementById("signContractBtn"); const contractOverlay = document.getElementById("contractOverlay"); const contractText = document.getElementById("contractText");
  if(openContract && contractOverlay){ openContract.addEventListener("click", ()=>{ contractOverlay.classList.remove("hidden"); if(contractText.innerHTML === ""){ contractText.innerHTML = (config.contractTerms || []).join("<br><br>"); } }); closeContract.addEventListener("click", ()=> contractOverlay.classList.add("hidden")); signContract.addEventListener("click", ()=>{ alert("Contract Signed! ✍️ No take-backs! 😈"); contractOverlay.classList.add("hidden"); }); }

  // 5. Bucket List
  const blDiv = document.getElementById("bucketList");
  if(blDiv && config.bucketList){ (config.bucketList || []).forEach((item, idx) => { const div = document.createElement("div"); div.style.margin = "5px 0"; const check = document.createElement("input"); check.type = "checkbox"; check.id = "bl_"+idx; const label = document.createElement("label"); label.htmlFor = "bl_"+idx; label.textContent = " " + item; check.addEventListener("change", ()=>{ if(check.checked) alert("Yay! Let's make this happen 🚀"); }); div.appendChild(check); div.appendChild(label); blDiv.appendChild(div); }); }

  // 6. Rel Stats
  const rsDiv = document.getElementById("relStatsBox");
  if(rsDiv && config.relStats){ rsDiv.innerHTML = `<b>Days Together:</b> ${config.relStats.days}<br><b>Fights Won:</b> ${config.relStats.fightsWon}<br><b>Pizzas:</b> ${config.relStats.pizzas}<br><b>Kisses:</b> ${config.relStats.kisses}`; }

  // 7. Fortune Cookie
  const crackBtn = document.getElementById("crackCookieBtn"); const fortMsg = document.getElementById("fortuneMsg");
  if(crackBtn){ crackBtn.addEventListener("click", ()=>{ const msg = randFrom(config.fortunes || ["You are loved!"]); fortMsg.textContent = "🥠 " + msg; }); }

  // 8. Sorry Gen
  const sorryBtn = document.getElementById("genSorryBtn"); const sorryMsg = document.getElementById("sorryMsg");
  if(sorryBtn){ sorryBtn.addEventListener("click", ()=>{ sorryMsg.textContent = "🥺 " + randFrom(config.sorryMessages || ["I'm sorry!"]); }); }

  // 9. Prank Button
  const prankBtn = document.getElementById("doNotPressBtn"); const prankOverlay = document.getElementById("prankOverlay"); const closePrank = document.getElementById("closePrankBtn");
  if(prankBtn){ prankBtn.addEventListener("click", ()=>{ prankOverlay.classList.remove("hidden"); }); closePrank.addEventListener("click", ()=>{ prankOverlay.classList.add("hidden"); }); }

  // 10. Bubu Mode
  const bubuBtn = document.getElementById("bubuModeBtn");
  if(bubuBtn){ bubuBtn.addEventListener("click", ()=>{ alert("Activating Bubu Mode... (Refresh page to stop)"); document.body.innerHTML = document.body.innerHTML.replace(/[a-zA-Z]+/g, "Bubu"); }); }
}

function setupFutureOneAtATime(){ const btn = document.getElementById("genFutureBtn"); const out = document.getElementById("futureOne"); if(!btn || !out) return; const seq = config.futureTimelineOrdered || []; let idx = 0; btn.addEventListener("click", ()=>{ if(seq.length === 0) return; out.textContent = seq[idx]; idx = Math.min(seq.length - 1, idx + 1); if(idx === seq.length - 1 && out.textContent === seq[seq.length - 1]){ btn.textContent = "Done 😌💘"; btn.disabled = true; btn.style.opacity = "0.75"; btn.style.cursor = "not-allowed"; } }); }
