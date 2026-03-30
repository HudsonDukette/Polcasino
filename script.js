let balance = 1000;
let spinning = false;
let selectedBet = null;

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
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for (let i = 0; i < numbers.length; i++) {
    const start = angle + i * arc;
    const end = start + arc;

    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, start, end);

    if (numbers[i] === 0) ctx.fillStyle = "green";
    else if (redNumbers.includes(numbers[i])) ctx.fillStyle = "red";
    else ctx.fillStyle = "black";

    ctx.fill();

    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(start + arc/2);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText(numbers[i], canvas.width/2 - 50, 5);
    ctx.restore();
  }
}

drawWheel();

// Bet selection
document.querySelectorAll(".bet-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedBet = btn.dataset.color;
    document.querySelectorAll(".bet-btn").forEach(b => b.style.boxShadow = "0 0 10px #22c55e, 0 0 25px #22c55e");
    btn.style.boxShadow = "0 0 20px #facc15, 0 0 40px #facc15";
  });
});

function spin() {
  if (spinning) return;
  const betAmount = parseInt(document.getElementById("betAmount").value);
  if (!betAmount || betAmount <= 0) return alert("Enter valid bet");
  if (betAmount > balance) return alert("Not enough balance");
  if (!selectedBet) return alert("Select a bet!");

  spinning = true;
  document.getElementById("spinBtn").disabled = true;

  const resultIndex = Math.floor(Math.random() * numbers.length);
  const segmentAngle = 360 / numbers.length;

  const targetDeg = (360 * 6) - (resultIndex * segmentAngle) - (segmentAngle/2);
  const startAngle = angle * 180 / Math.PI;
  const duration = 3000;
  const start = performance.now();

  function animate(time) {
    const progress = Math.min((time-start)/duration,1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const currentDeg = startAngle + (targetDeg - startAngle) * ease;
    angle = currentDeg * Math.PI / 180;

    drawWheel();

    if(progress<1) requestAnimationFrame(animate);
    else finishSpin(resultIndex, betAmount);
  }

  requestAnimationFrame(animate);
}

function finishSpin(index, betAmount){
  const number = numbers[index];
  document.getElementById("result").textContent = number;

  let win = false;
  if(selectedBet === "red" && redNumbers.includes(number)) win = true;
  if(selectedBet === "black" && number!==0 && !redNumbers.includes(number)) win = true;
  if(selectedBet === "even" && number!==0 && number%2===0) win = true;
  if(selectedBet === "odd" && number%2===1) win = true;
  if(selectedBet === "green" && number===0) win = true;

  const message = document.getElementById("message");
  if(win){
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