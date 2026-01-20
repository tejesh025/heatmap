const { createCanvas } = require("canvas");
const fs = require("fs");

/* ===== 1. SCREEN & COORDINATES ===== */
const W = 1080;
const H = 2400;

// Footer
const FOOTER_X = 427;
const FOOTER_Y = 1560;

// Grid block
const BLOCK_X = 175;
const BLOCK_Y = 1200;
const BLOCK_W = 729.45;

/* ===== 2. GRID SETTINGS ===== */
const COLS = 9;
const DIAMETER = 65;
const RADIUS = DIAMETER / 2;
const GAP = (BLOCK_W - (COLS * DIAMETER)) / (COLS - 1);

/* ===== 3. COLORS ===== */
const BG_COLOR = "#0f0f0f";      // darker background
const C_SOLVED = "#ffffff";     // solved = white
const C_FUTURE = "#2a2a2a";
const C_MISSED = "#ff0000";
const C_FOCUS_TEXT = "#9a3030";
const C_OTHER_TEXT = "#6a6060";

/* ===== 4. DATE SETUP ===== */
const now = new Date();
const Y = now.getUTCFullYear();
const M = now.getUTCMonth();
const TODAY = now.getUTCDate();
const daysInMonth = new Date(Date.UTC(Y, M + 1, 0)).getUTCDate();

/* ===== 5. LOAD DATA ===== */
const calendar = JSON.parse(
  fs.readFileSync("submissionCalendar.json", "utf8")
);

/* ===== 6. CANVAS SETUP ===== */
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

/* ===== 7. BACKGROUND ===== */
ctx.fillStyle = BG_COLOR;
ctx.fillRect(0, 0, W, H);

/* ===== 8. GRID ===== */
let solvedCount = 0;

ctx.shadowColor = "rgba(0,0,0,0.5)";
ctx.shadowBlur = 4;
ctx.shadowOffsetY = 4;

for (let d = 1; d <= daysInMonth; d++) {
  const idx = d - 1;
  const row = Math.floor(idx / COLS);
  const col = idx % COLS;

  const cx = BLOCK_X + col * (DIAMETER + GAP) + RADIUS;
  const cy = BLOCK_Y + row * (DIAMETER + GAP) + RADIUS;

  const epoch = Math.floor(Date.UTC(Y, M, d) / 1000);

  let color = C_FUTURE;

  if (d <= TODAY) {
    if (calendar[epoch]) {
      color = C_SOLVED;
      solvedCount++;
    } else {
      color = d === TODAY ? C_FUTURE : C_MISSED;
    }
  }

  ctx.beginPath();
  ctx.arc(cx, cy, RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

/* ===== 9. FOOTER ===== */
ctx.shadowColor = "transparent";
ctx.font = "36px sans-serif";

const percentage =
  TODAY > 0 ? ((solvedCount / TODAY) * 100).toFixed(1) : "0.0";

ctx.fillStyle = C_FOCUS_TEXT;
ctx.fillText("FOCUS ", FOOTER_X, FOOTER_Y);

const focusWidth = ctx.measureText("FOCUS ").width;
ctx.fillStyle = C_OTHER_TEXT;
ctx.fillText(`${percentage}%`, FOOTER_X + focusWidth, FOOTER_Y);

/* ===== 10. SAVE PNG ===== */
fs.writeFileSync(
  "leetcode_heatmap.png",
  canvas.toBuffer("image/png")
);
