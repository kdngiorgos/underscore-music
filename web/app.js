const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");
const intensityEl = document.getElementById("intensity");
const clockEl = document.getElementById("clock");
const startButton = document.getElementById("start");
const bossButton = document.getElementById("boss");

const INTENSITIES = ["exploration", "alert", "combat", "boss"];
const LABELS = ["Exploration", "Alert", "Combat", "Boss"];
const COLORS = {
  exploration: "#c7f36b",
  alert: "#e3b84b",
  combat: "#c84a31",
  boss: "#d46ab3",
};
const BAR_SECONDS = 2.4;

const state = {
  started: false,
  audioContext: null,
  buffers: {},
  gains: {},
  sources: [],
  startedAt: 0,
  target: 0,
  scheduledTarget: 0,
  transitionAt: null,
  lastTransitionAt: -1,
  boss: false,
  keys: new Set(),
  health: 1,
  hitCooldown: 0,
  player: { x: 512, y: 320, size: 16 },
  enemies: [
    { x: 170, y: 130, dx: 0.16, dy: 0.08, phase: 0.2, boss: false },
    { x: 860, y: 460, dx: -0.12, dy: 0.1, phase: 1.7, boss: false },
    { x: 790, y: 130, dx: -0.08, dy: 0.12, phase: 2.6, boss: false },
  ],
  time: 0,
};

async function boot() {
  const metadata = await fetch("stems/metadata.json").then((response) => response.json());
  state.metadata = metadata;
  state.audioContext = new AudioContext();
  const names = metadata.layers;
  await Promise.all(
    names.map(async (name) => {
      const response = await fetch(`stems/${name}.wav`);
      const bytes = await response.arrayBuffer();
      state.buffers[name] = await state.audioContext.decodeAudioData(bytes);
      const gain = state.audioContext.createGain();
      gain.gain.value = name === "exploration" ? 1 : 0;
      gain.connect(state.audioContext.destination);
      state.gains[name] = gain;
    }),
  );
  startButton.disabled = false;
  startButton.textContent = "Start the score";
  setStatus("Score ready");
}

startButton.addEventListener("click", async () => {
  if (!state.audioContext) return;
  if (state.started) {
    await state.audioContext.resume();
    return;
  }
  await state.audioContext.resume();
  const startAt = state.audioContext.currentTime + 0.12;
  state.startedAt = startAt;
  state.started = true;
  for (const name of INTENSITIES) {
    const source = state.audioContext.createBufferSource();
    source.buffer = state.buffers[name];
    source.loop = true;
    source.connect(state.gains[name]);
    source.start(startAt);
    state.sources.push(source);
  }
  state.target = targetIntensity();
  state.scheduledTarget = state.target;
  for (const name of INTENSITIES) {
    state.gains[name].gain.setValueAtTime(name === INTENSITIES[state.target] ? 1 : 0, startAt);
  }
  startButton.textContent = "Audio running";
  startButton.classList.remove("solid");
  startButton.classList.add("ghost");
  setStatus("Conducting");
});

bossButton.addEventListener("click", () => {
  state.boss = !state.boss;
  bossButton.setAttribute("aria-pressed", String(state.boss));
  bossButton.textContent = state.boss ? "Boss active" : "Summon boss";
  if (state.boss) {
    state.enemies.push({
      x: 900,
      y: 300,
      dx: -0.09,
      dy: 0.05,
      phase: 3.2,
      boss: true,
    });
  } else {
    state.enemies = state.enemies.filter((enemy) => !enemy.boss);
  }
});

const keys = new Set();
window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyS", "KeyD", "KeyW"].includes(event.code)) {
    event.preventDefault();
    keys.add(event.code);
  }
});
window.addEventListener("keyup", (event) => keys.delete(event.code));
window.addEventListener("blur", () => keys.clear());

function setStatus(value) {
  statusEl.textContent = value;
}

function targetIntensity() {
  if (state.boss) return 3;
  const near = enemiesNear().length;
  if (near >= 2 || (near >= 1 && state.health < 0.55)) return 2;
  if (near >= 1 || state.hitCooldown > 0) return 1;
  return 0;
}

function enemiesNear() {
  return state.enemies.filter((enemy) => distance(enemy, state.player) < (enemy.boss ? 170 : 125));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function update(dt) {
  state.time += dt;
  const speed = 235 * dt;
  if (keys.has("ArrowLeft") || keys.has("KeyA")) state.player.x -= speed;
  if (keys.has("ArrowRight") || keys.has("KeyD")) state.player.x += speed;
  if (keys.has("ArrowUp") || keys.has("KeyW")) state.player.y -= speed;
  if (keys.has("ArrowDown") || keys.has("KeyS")) state.player.y += speed;
  state.player.x = Math.max(28, Math.min(canvas.width - 28, state.player.x));
  state.player.y = Math.max(28, Math.min(canvas.height - 28, state.player.y));

  state.hitCooldown = Math.max(0, state.hitCooldown - dt);
  for (const enemy of state.enemies) {
    const target = state.player;
    const angle = Math.atan2(target.y - enemy.y, target.x - enemy.x);
    const chase = enemy.boss ? 20 : 10;
    enemy.x += Math.cos(angle) * chase * dt + Math.sin(state.time + enemy.phase) * 0.25;
    enemy.y += Math.sin(angle) * chase * dt + Math.cos(state.time * 0.7 + enemy.phase) * 0.25;
    enemy.x = Math.max(24, Math.min(canvas.width - 24, enemy.x));
    enemy.y = Math.max(24, Math.min(canvas.height - 24, enemy.y));
    if (distance(enemy, state.player) < 24) {
      state.health = Math.max(0.15, state.health - dt * 0.3);
      state.hitCooldown = 2.5;
    }
  }
  state.health = Math.min(1, state.health + dt * 0.015);
  state.target = targetIntensity();
  scheduleTransition();
}

function scheduleTransition() {
  if (!state.started || !state.audioContext) return;
  if (state.target === state.scheduledTarget) return;
  const now = state.audioContext.currentTime;
  if (now < state.lastTransitionAt + 0.05) return;
  const elapsed = now - state.startedAt;
  const nextBar = state.startedAt + (Math.floor(elapsed / BAR_SECONDS) + 1) * BAR_SECONDS;
  state.transitionAt = nextBar;
  state.lastTransitionAt = now;
  for (const name of INTENSITIES) {
    const gain = state.gains[name].gain;
    const current = gain.value;
    const next = name === INTENSITIES[state.target] ? 1 : 0;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(current, nextBar);
    gain.linearRampToValueAtTime(next, nextBar + 0.18);
  }
  state.scheduledTarget = state.target;
}

function updateHud() {
  const display = state.started ? state.scheduledTarget : state.target;
  intensityEl.textContent = LABELS[display];
  intensityEl.style.color = COLORS[INTENSITIES[display]];
  const bars = document.querySelectorAll(".layer");
  bars.forEach((bar, index) => {
    bar.classList.toggle("active", index === display);
    bar.querySelector(".layer-state").style.color =
      index === display ? COLORS[INTENSITIES[index]] : "";
  });
  if (state.started && state.transitionAt) {
    const left = Math.max(0, state.transitionAt - state.audioContext.currentTime);
    clockEl.textContent = `Next bar in ${left.toFixed(1)}s`;
  } else {
    clockEl.textContent = state.started ? "Listening on the bar line" : "Next bar in —";
  }
}

function draw() {
  const intensity = state.started ? state.scheduledTarget : state.target;
  const accent = COLORS[INTENSITIES[intensity]];
  ctx.fillStyle = "#17211d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(244,239,228,0.06)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(199,243,107,0.12)";
  ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, 72 + Math.sin(state.time * 2) * 5, 0, Math.PI * 2);
  ctx.stroke();

  for (const enemy of state.enemies) {
    const isBoss = enemy.boss;
    ctx.strokeStyle = isBoss ? "#d46ab3" : "#c84a31";
    ctx.fillStyle = isBoss ? "rgba(212,106,179,0.18)" : "rgba(200,74,49,0.14)";
    ctx.lineWidth = isBoss ? 3 : 2;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, isBoss ? 29 : 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, isBoss ? 13 : 6, 0, Math.PI * 2);
    ctx.fillStyle = isBoss ? "#d46ab3" : "#c84a31";
    ctx.fill();
  }

  ctx.save();
  ctx.translate(state.player.x, state.player.y);
  ctx.rotate(Math.sin(state.time * 3) * 0.06);
  ctx.fillStyle = "#f4efe4";
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#17211d";
  ctx.beginPath();
  ctx.arc(-5, -3, 3, 0, Math.PI * 2);
  ctx.arc(5, -3, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#17211d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 3, 7, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "rgba(244,239,228,0.4)";
  ctx.font = "600 11px 'Space Grotesk', sans-serif";
  ctx.fillText(`HEALTH ${Math.round(state.health * 100)}%`, 26, canvas.height - 36);

  ctx.fillStyle = accent;
  ctx.fillRect(canvas.width - 26 - 160, canvas.height - 42, 160, 3);
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  draw();
  updateHud();
  requestAnimationFrame(frame);
}

window.__underscore = state;
startButton.disabled = true;
boot().catch((error) => setStatus(`Could not load score: ${error.message}`));
requestAnimationFrame(frame);
