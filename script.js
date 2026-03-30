let balance = 1000;
let spinning = false;

const redNumbers = [
  1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
];

function spin() {
  if (spinning) return;

  const betAmount = parseInt(document.getElementById("betAmount").value);
  const betType = document.getElementById("betType").value;
  const spinBtn = document.getElementById("spinBtn");
  const wheel = document.getElementById("wheel");

  if (!betAmount || betAmount <= 0) {
    return alert("Enter a valid bet amount");
  }

  if (betAmount > balance) {
    return alert("Not enough balance");
  }

  spinning = true;
  spinBtn.disabled = true;

  // random spin amount
  const rotation = Math.floor(Math.random() * 3600) + 2000;
  wheel.style.transform = `rotate(${rotation}deg)`;

  // delay result until animation finishes
  setTimeout(() => {
    const number = Math.floor(Math.random() * 37);
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
    spinBtn.disabled = false;

  }, 3000); // matches animation time
}