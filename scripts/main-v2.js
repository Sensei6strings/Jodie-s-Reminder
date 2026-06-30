// =====================================================
// 🌟 OUR STORY ENGINE (MAIN CONTROLLER)
// =====================================================

// =============================
// 🎯 CONFIG
// =============================
const TARGET_DATE = new Date("2026-07-03T08:30:00+02:00");

const playlist = [
  "music/song1.mp3",
  "music/song2.mp3",
  "music/song3.mp3"
];

const quotes = [
  "Quote 1",
  "Quote 2",
  "Quote 3"
];

// =============================
// 🧠 STATE
// =============================
let started = false;
let mode = "countdown";
let quoteIndex = 0;

// =============================
// 🚀 INIT (INTRO SCREEN)
// =============================
document.getElementById("intro").addEventListener("click", () => {
  document.getElementById("intro").style.display = "none";
  document.getElementById("app").style.display = "block";

  startMusic();
  startQuotes();
  startMemories();
  startParticles();
  startFireworks();
  startAnalogClock();


  // ✅ IMPORTANT: INITIAL RENDER (FIX FOR EMPTY UI)
  updateClock();
  updateTimer();

  started = true;
});

// =============================
// 🚀 ANALOGUE CLOCK
// =============================

function startAnalogClock() {
  const canvas = document.getElementById("clockCanvas");
  const ctx = canvas.getContext("2d");

  const radius = canvas.height / 2;
  ctx.translate(radius, radius);

  function drawClock() {
    ctx.clearRect(-radius, -radius, canvas.width, canvas.height);

    const now = new Date();
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius, hour, minute, second);
  }

  function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.95, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.stroke();
  }

  function drawNumbers(ctx, radius) {
    ctx.font = radius * 0.15 + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let num = 1; num <= 12; num++) {
      const ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.8);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.8);
      ctx.rotate(-ang);
    }
  }

  function drawTime(ctx, radius, hour, minute, second) {
    // hour hand
    drawHand(ctx, (hour + minute / 60) * 30 * Math.PI / 180, radius * 0.5, 6);

    // minute hand
    drawHand(ctx, (minute + second / 60) * 6 * Math.PI / 180, radius * 0.7, 4);

    // second hand
    drawHand(ctx, second * 6 * Math.PI / 180, radius * 0.9, 2, "red");
  }

  function drawHand(ctx, pos, length, width, color = "white") {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  setInterval(drawClock, 1000);
  drawClock();
}

// =====================================================
// 🧭 TIME ENGINE
// =====================================================

function getTimeState() {
  return new Date() >= TARGET_DATE ? "after" : "before";
}

function updateClock() {
  const el = document.getElementById("clock");
  if (!el) return;

  const now = new Date();

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  el.innerText = `${h}:${m}:${s}`;
}

// =====================================================
// ⏳ TIMER ENGINE
// =====================================================

function updateTimer() {

console.log(TARGET_DATE);
console.log(new Date());
  
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const labelEl = document.getElementById("modeLabel");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl || !labelEl) return;

  const now = new Date();
  let diff;

  // SWITCH MODE AUTOMATICALLY
  if (now >= TARGET_DATE) {
    if (mode !== "after") {
      mode = "after";
      labelEl.innerText =
        "You have now been dating the luckiest guy in the world for...";
    }

    diff = now - TARGET_DATE;

  } else {
    if (mode !== "countdown") {
      mode = "countdown";
      labelEl.innerText =
        "Counting down to us ❤️";
    }

    diff = TARGET_DATE - now;
  }

  // TIME CALCULATION
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const displayHours = hours % 24;
  const displayMinutes = minutes % 60;
  const displaySeconds = seconds % 60;

  // UI UPDATE
  daysEl.innerText = days + " DAYS";
  hoursEl.innerText = displayHours + " HOURS";
  minutesEl.innerText = displayMinutes + " MINUTES";
  secondsEl.innerText = displaySeconds + " SECONDS";

  // MILSTONES (after only)
  if (mode === "after") {
    checkMilestones(days);
  }
}

// =====================================================
// 🎵 MUSIC ENGINE
// =====================================================

function startMusic() {
  const audio = document.getElementById("musicPlayer");
  if (!audio) return;

  function playRandom() {
    const pick = playlist[Math.floor(Math.random() * playlist.length)];
    audio.src = pick;
    audio.play().catch(() => {});
  }

  audio.addEventListener("ended", playRandom);
  playRandom();
}

function startQuotes() {
  const left = document.getElementById("poemLeft");
  const right = document.getElementById("poemRight");

  if (!left || !right) return;

  let index = 0;

  function showPoem() {
    const poem = quotes[index];

    const target = index % 2 === 0 ? left : right;
    const other = index % 2 === 0 ? right : left;

    // hide both first
    left.classList.remove("poem-show");
    right.classList.remove("poem-show");

    setTimeout(() => {
      target.innerText = poem;
      target.classList.add("poem-show");
    }, 400);

    index = (index + 1) % quotes.length;
  }

  showPoem();
  setInterval(showPoem, 16000);
}

// =====================================================
// 🔁 MASTER LOOP
// =====================================================

setInterval(() => {
  if (!started) return;

  updateClock();
  updateTimer();

}, 1000);

