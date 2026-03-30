let balance = 1000;

const redNumbers = [
  1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
];

function spin() {
  const betAmount = parseInt(document.getElementById("betAmount").value);
  const betType = document.getElementById("betType").value;

  if (!betAmount || betAmount <= 0) {
    return alert("Enter a valid bet amount");
  }

  if (betAmount > balance) {
    return alert("Not enough balance");
  }

  const number = Math.floor(Math.random() * 37);
  document.getElementById("result").textContent = number;

  let win = false;

  if (betType === "red" && redNumbers.includes(number)) win = true;
  if (betType === "black" && number !== 0 && !redNumbers.includes(number)) win = true;
  if (betType === "even" && number !== 0 && number % 2 === 0) win = true;
  if (betType === "odd" && number % 2 === 1) win = true;

  if (win) {
    balance += betAmount;
    document.getElementById("message").textContent = "You WON!";
  } else {
    balance -= betAmount;
    document.getElementById("message").textContent = "You LOST!";
  }

  document.getElementById("balance").textContent = balance;
}