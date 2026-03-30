let balance = 1000;
let spinning = false;

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const numbers = [
  0,32,15,19,4,21,2,25,17,34,6,
  27,13,36,11,30,8,23,10,5,24,
  16,33,1,20,14,31,9,22,18,29,
  7,28,12,35,3,26
];

const redNumbers = [
  1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
];

let angle = 0;

function drawWheel() {
  const arc = (2 * Math.PI) / numbers.length;

  for (let i = 0; i < numbers.length; i++) {
    const start = angle + i * arc;
    const end = start + arc;

    ctx.beginPath();
    ctx.moveTo(150,150);
    ctx.arc(150,150,150,start,end);
    
    if (numbers[i] === 0) {
      ctx.fillStyle = "green";
    } else if (redNumbers.includes(numbers[i])) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "black";
    }

    ctx.fill();

    ctx.save();
    ctx.translate(150,150);
    ctx.rotate(start + arc/2);
    ctx.fillStyle = "white";
    ctx.fillText(numbers[i], 100, 5);
    ctx.restore();
  }
}

drawWheel();

function spin() {
  if (spinning) return;

  const betAmount = parseInt(document.getElementById("betAmount").value);
  const betType = document.getElementById("betType").value;
  const spinBtn = document.getElementById("spinBtn");

  if (!betAmount || betAmount <= 0) return alert("Enter bet");
  if (betAmount > balance) return alert("Not enough balance");

  spinning = true;
  spinBtn.disabled = true;

  const resultIndex = Math.floor(Math.random() * numbers.length);
  const arc = 360 / numbers.length;

  const targetAngle = (360 * 5) + (resultIndex * arc);
  const duration = 3000;
  const start = performance.now();

  function animate(time) {
    const progress = Math.min((time - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    angle = (targetAngle * ease) * Math.PI / 180;

    ctx.clearRect(0,0,300,300);
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      finishSpin(resultIndex, betAmount, betType);
    }
  }

  requestAnimationFrame(animate);
}

function finishSpin(index, betAmount, betType) {
  const number = numbers[index];
  document.getElementById("result").textContent = number;

  let win = false;

  if (betType === "red" && redNumbers.includes(number)) win = true;
  if (betType === "black" && number !== 0 && !redNumbers.includes(number)) win = true;
  if (betType === "even" && number !== 0 && number % 2 === 0) win = true;
  if (betType === "odd" && number % 2 === 1) win = true;

  const message = document.getElementById("message");

  if (win) {
    balance += betAmount;
    message.textContent = "YOU WON 💰";
    message.className = "message win";
  } else {
    balance -= betAmount;
    message.textContent = "YOU LOST 💀";
    message.className = "message lose";
  }

  document.getElementById("balance").textContent = balance;

  spinning = false;
  document.getElementById("spinBtn").disabled = false;
}