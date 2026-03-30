const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const greenNumbers = [0];
const betButtons = document.querySelectorAll(".bet-btn");
const balanceEl = document.getElementById("balance");
const resultEl = document.getElementById("result");
const messageEl = document.getElementById("message");
const spinBtn = document.getElementById("spinBtn");
const betAmountInput = document.getElementById("betAmount");

const canvasSize = canvas.width;
const center = canvasSize / 2;
const wheelRadius = center - 22;
let angle = 0;
let spinning = false;
let selectedBet = null;
let balance = 1000;

function drawWheel() {
  const arc = (2 * Math.PI) / numbers.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numbers.length; i += 1) {
    const start = angle + i * arc;
    const end = start + arc;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, wheelRadius, start, end);
    const value = numbers[i];
    if (greenNumbers.includes(value)) ctx.fillStyle = "#22c55e";
    else if (redNumbers.includes(value)) ctx.fillStyle = "#ef4444";
    else ctx.fillStyle = "#151823";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.stroke();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 18px Poppins";
    ctx.textAlign = "center";
    const textRadius = wheelRadius - 42;
    ctx.fillText(value, textRadius, 8);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(center, center, wheelRadius - 32, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(center, center, 40, 0, 2 * Math.PI);
  ctx.fillStyle = "#0b1220";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(center, center, 14, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
}

let ballAngle = 0;
let ballRadius = wheelRadius - 18;
let ballSpeed = 0;
let ballSpinning = false;

function drawBall() {
  ctx.save();
  ctx.translate(center, center);
  const x = ballRadius * Math.cos(ballAngle);
  const y = ballRadius * Math.sin(ballAngle);
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "#f8fafc";
  ctx.shadowColor = "#f8fafc";
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.restore();
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function getResultAngle(index) {
  const arc = (2 * Math.PI) / numbers.length;
  return -index * arc - arc / 2 + Math.PI / 2;
}

function animateSpin(resultIndex) {
  const duration = 4200;
  const startAngle = angle;
  const targetAngle = getResultAngle(resultIndex) + (Math.PI * 4 * 3);
  const startTime = performance.now();
  ballSpeed = 0.35;
  ballRadius = wheelRadius - 18;
  ballAngle = 0;
  ballSpinning = true;

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(t);
    angle = startAngle + (targetAngle - startAngle) * eased;

    drawWheel();
    if (ballSpinning) {
      ballAngle += ballSpeed;
      ballRadius = Math.max(130, ballRadius - 0.26);
      ballSpeed *= 0.995;
      drawBall();
    }

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      ballSpinning = false;
      spinning = false;
      const resultNumber = numbers[resultIndex];
      resultEl.textContent = resultNumber;
      updateBalance(resultNumber);
    }
  }

  requestAnimationFrame(frame);
}

function updateBalance(resultNumber) {
  const betAmount = Number(betAmountInput.value || 0);
  if (selectedBet && betAmount > 0) {
    let win = false;
    if (selectedBet === "green" && resultNumber === 0) win = true;
    if (selectedBet === "red" && redNumbers.includes(resultNumber)) win = true;
    if (selectedBet === "black" && !redNumbers.includes(resultNumber) && resultNumber !== 0) win = true;
    if (win) {
      const multiplier = selectedBet === "green" ? 14 : 2;
      const payout = betAmount * multiplier;
      balance += payout;
      messageEl.textContent = `Win! +$${payout.toLocaleString()}`;
    } else {
      balance -= betAmount;
      messageEl.textContent = `Lost $${betAmount.toLocaleString()}. Try again.`;
    }
    balanceEl.textContent = balance.toLocaleString();
  }
}

betButtons.forEach(button => {
  button.addEventListener("click", () => {
    betButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    selectedBet = button.dataset.color;
    messageEl.textContent = `Bet selected: ${selectedBet.toUpperCase()}`;
  });
});

spinBtn.addEventListener("click", () => {
  const betAmount = Number(betAmountInput.value || 0);
  if (spinning) return;
  if (!selectedBet) {
    messageEl.textContent = "Choose a color before spinning.";
    return;
  }
  if (!betAmount || betAmount <= 0) {
    messageEl.textContent = "Enter a bet amount.";
    return;
  }
  if (betAmount > balance) {
    messageEl.textContent = "Insufficient balance.";
    return;
  }

  spinning = true;
  messageEl.textContent = "Spinning...";
  const resultIndex = Math.floor(Math.random() * numbers.length);
  animateSpin(resultIndex);
});

function init() {
  drawWheel();
}

init();