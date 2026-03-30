const rouletteContainer = document.getElementById("rouletteGame");

rouletteContainer.innerHTML = `
  <div class="wheel-wrapper">
    <canvas id="wheelCanvas" width="400" height="400"></canvas>
    <div class="arrow">▲</div>
  </div>
  <div class="controls-panel">
    <div class="balance">Balance: $<span id="balance">1000</span></div>
    <div class="bet-buttons">
      <button class="bet-btn red" data-color="red">Red</button>
      <button class="bet-btn black" data-color="black">Black</button>
      <button class="bet-btn green" data-color="green">Green</button>
      <button class="bet-btn even" data-color="even">Even</button>
      <button class="bet-btn odd" data-color="odd">Odd</button>
    </div>
    <input type="number" id="betAmount" placeholder="Bet Amount" class="pop-input">
    <button id="spinBtn">Spin</button>
    <div class="result">Result: <span id="result">-</span></div>
    <div class="message" id="message"></div>
  </div>
`;

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const numbers = [
  0,32,15,19,4,21,2,25,17,34,6,
  27,13,36,11,30,8,23,10,5,24,
  16,33,1,20,14,31,9,22,18,29,
  7,28,12,35,3,26
];

const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

let angle = 0;
let spinning = false;
let selectedBet = null;

// Roulette wheel draw function (same as previous, adjusted for canvas=400)
function drawWheel() {
  const arc = 2*Math.PI/numbers.length;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<numbers.length;i++){
    const start = angle + i*arc;
    const end = start + arc;
    ctx.beginPath();
    ctx.moveTo(200,200);
    ctx.arc(200,200,200,start,end);
    if(numbers[i]===0) ctx.fillStyle="green";
    else if(redNumbers.includes(numbers[i])) ctx.fillStyle="red";
    else ctx.fillStyle="black";
    ctx.fill();
    ctx.save();
    ctx.translate(200,200);
    ctx.rotate(start+arc/2);
    ctx.fillStyle="white";
    ctx.font="bold 16px Poppins";
    ctx.fillText(numbers[i], 150, 5);
    ctx.restore();
  }
}

// Physics Ball
let ballAngle = 0;
let ballRadius = 180;
let ballSpeed = 0;
let ballSpinning = false;

function drawBall() {
  ctx.save();
  ctx.translate(200,200);
  const x = ballRadius * Math.cos(ballAngle);
  const y = ballRadius * Math.sin(ballAngle);
  ctx.beginPath();
  ctx.arc(x,y,8,0,2*Math.PI);
  ctx.fillStyle="white";
  ctx.fill();
  ctx.restore();
}

// Animate spin with physics ball
function spin() {
  if(spinning) return;
  const betAmount=parseInt(document.getElementById("betAmount").value);
  if(!betAmount||betAmount<=0) return alert("Enter valid bet");
  if(betAmount>1000) return alert("Not enough balance"); // demo balance
  if(!selectedBet) return alert("Select a bet");
  spinning=true;
  const resultIndex=Math.floor(Math.random()*numbers.length);
  const segmentAngle=360/numbers.length;
  const targetDeg=(360*6)-(resultIndex*segmentAngle)-(segmentAngle/2);
  const startAngle=angle*180/Math.PI;
  const duration=4000;
  const start=performance.now();
  ballSpeed=0.3;
  ballAngle=0;
  ballRadius=180;
  ballSpinning=true;

  function animate(time){
    const progress=Math.min((time-start)/duration,1);
    const ease=1-Math.pow(1-progress,3);
    const currentDeg=startAngle+(targetDeg-startAngle)*ease;
    angle=currentDeg*Math.PI/180;

    ctx.clearRect(0,0,400,400);
    drawWheel();
    // Ball physics: spiral inward, slows down
    if(ballSpinning){
      ballAngle+=ballSpeed;
      ballRadius-=0.2;
      ballSpeed*=0.995;
      if(ballRadius<120) ballRadius=120;
      drawBall();
    }

    if(progress<1) requestAnimationFrame(animate);
    else finishSpin(resultIndex);
  }
  requestAnimationFrame(animate);
}

// Finish spin
function finishSpin(index){
  const number=numbers[index];
  document.getElementById("result").textContent=number;
  let win=false;
  if(selectedBet==="red"&&redNumbers.includes(number)) win=true;
  if(selectedBet==="black"&&number!==0&&!redNumbers.includes(number)) win=true;
  if(selectedBet==="even"&&number!==0&&number%2===0) win=true;
  if(selectedBet==="odd"&&number!==0&&number%2===1) win=true;
  if(selectedBet==="green"&&number===0) win=true;
  const message=document.getElementById("message");
  if(win) message.className="message win", message.textContent="YOU WON 💰";
  else message.className="message lose", message.textContent="YOU LOST 💀";
  spinning=false;
  ballSpinning=false;
}