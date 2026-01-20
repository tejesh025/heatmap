import { createCanvas, registerFont } from "canvas";
import fs from "fs";

/* ===== REGISTER FONT ===== */
registerFont("./Inter-Regular.ttf", { family: "Inter" });

/* ===== 1. SCREEN & COORDINATES ===== */
const W = 1080, H = 2400;

const HEADER_X = 319;
const HEADER_Y = 1102;

const FOOTER_X = 427;
const FOOTER_Y = 1560;

const BLOCK_X = 175;
const BLOCK_Y = 1200;
const BLOCK_W = 729.45;

/* ===== 2. GRID SETTINGS ===== */
const COLS = 9;
const DIAMETER = 65;
const RADIUS = DIAMETER / 2;
const GAP = (BLOCK_W - (COLS * DIAMETER)) / (COLS - 1);

/* ===== 3. COLORS ===== */
const BG_COLOR = "#141414";
const C_SOLVED = "#c5baba";
const C_FUTURE = "#323030";
const C_MISSED = "#FF0000";
const C_FOCUS_TEXT = "#9a3030";
const C_OTHER_TEXT = "#6a6060";

/* ===== 4. DATE ===== */
const now = new Date();
const Y = now.getUTCFullYear();
const M = now.getUTCMonth();
const TODAY = now.getUTCDate();
const daysInMonth = new Date(Date.UTC(Y, M + 1, 0)).getUTCDate();

/* ===== LOAD DATA ===== */
const calendar = JSON.parse(
  fs.readFileSync("submissionCalendar.json", "utf8")
);

/* ===== CANVAS ===== */
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

/* ===== BACKGROUND ===== */
ctx.fillStyle = BG_COLOR;
ctx.fillRect(0, 0, W, H);

/* ===== HEADER ===== */
ctx.font = "40px Inter";
ctx.fillStyle = C_OTHER_TEXT;
ctx.textBaseline = "top";
ctx.fillText("Leet code - Heat Map", HEADER_X, HEADER_Y);

/* ===== GRID ===== */
let solvedCount = 0;

ctx.shadowColor = "rgba(0,0,0,0.4)";
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

/* ===== FOOTER ===== */
ctx.shadowColor = "transparent";
ctx.font = "36px Inter";

const percentage = ((solvedCount / TODAY) * 100).toFixed(1);

ctx.fillStyle = C_FOCUS_TEXT;
ctx.fillText("FOCUS ", FOOTER_X, FOOTER_Y);

const focusWidth = ctx.measureText("FOCUS ").width;
ctx.fillStyle = C_OTHER_TEXT;
ctx.fillText(`${percentage}%`, FOOTER_X + focusWidth, FOOTER_Y);

/* ===== SAVE ===== */
fs.writeFileSync(
  "leetcode_heatmap.png",
  canvas.toBuffer("image/png")
);
