const { createCanvas } = require('canvas');
const fs = require('fs');

// Canvas size — adjust if needed for wallpaper
const W = 1080;
const H = 2400;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Load calendar JSON
const calendar = JSON.parse(fs.readFileSync('submissionCalendar.json'));

const now = new Date();
const Y = now.getUTCFullYear();
const M = now.getUTCMonth();
const TODAY = now.getUTCDate();
const daysInMonth = new Date(Y, M + 1, 0).getDate();

// Colors
const BG_COLOR = "#141414";
const C_SOLVED = "#c5baba";
const C_FUTURE = "#323030";
const C_MISSED = "#FF0000";

// Fill background
ctx.fillStyle = BG_COLOR;
ctx.fillRect(0, 0, W, H);

// Layout settings
const COLS = 9;
const DIAMETER = 65;
const GAP = 10;
const BLOCK_X = 175;
const BLOCK_Y = 1200;

// Draw heatmap circles
for (let d = 1; d <= daysInMonth; d++) {
  const idx = d - 1;
  const row = Math.floor(idx / COLS);
  const col = idx % COLS;

  const cx = BLOCK_X + col * (DIAMETER + GAP) + DIAMETER / 2;
  const cy = BLOCK_Y + row * (DIAMETER + GAP) + DIAMETER / 2;

  const epoch = Math.floor(Date.UTC(Y, M, d) / 1000);
  let color = C_FUTURE;

  if (d <= TODAY) {
    color = calendar[epoch] ? C_SOLVED : (d === TODAY ? C_FUTURE : C_MISSED);
  }

  ctx.beginPath();
  ctx.arc(cx, cy, DIAMETER / 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// Save PNG
const out = fs.createWriteStream('leetcode_heatmap.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('PNG generated'));
