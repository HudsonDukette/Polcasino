const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

let angle = 0;
let spinning = false;

function drawWheel() {
  const arc = 2*Math.PI/numbers.length;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<numbers.length;i++){
    const start = angle + i*arc;
    const end = start + arc;
    ctx.beginPath();
    ctx.moveTo(250,250);
    ctx.arc(250,250,240,start,end);
    if(numbers[i]===0) ctx.fillStyle="green";
    else if(redNumbers.includes(numbers[i])) ctx.fillStyle="red";
    else ctx.fillStyle="black";
    ctx.fill();
    ctx.lineWidth=2;
    ctx.strokeStyle="#22c55e";
    ctx.stroke();

    // Number
    ctx.save();
    ctx.translate(250,250);
    ctx.rotate(start+arc/2);
    ctx.fillStyle="white";
    ctx.font="bold 18px Poppins";
    ctx.textAlign="center";
    ctx.fillText(numbers[i], 180, 5);
    ctx.restore();
  }
}

// Physics ball
let ballAngle=0;
let ballRadius=220;
let ballSpeed=0;
let ballSpinning=false;

function drawBall() {
  ctx.save();
  ctx.translate(250,250);
  const x = ballRadius * Math.cos(ballAngle);
  const y = ballRadius * Math.sin(ballAngle);
  ctx.beginPath();
  ctx.arc(x,y,10,0,2*Math.PI);
  ctx.fillStyle="white";
  ctx.shadowColor="white";
  ctx.shadowBlur=15;
  ctx.fill();
  ctx.restore();
}

function animateSpin(resultIndex) {
  const duration=4000;
  const startAngle=angle*180/Math.PI;
  const targetDeg=(360*6)-(resultIndex*(360/numbers.length))-(360/(numbers.length*2));
  const start=performance.now();
  ballSpeed=0.35;
  ballRadius=220;
  ballAngle=0;
  ballSpinning=true;

  function animate(time){
    const progress=Math.min((time-start)/duration,1);
    const ease=1-Math.pow(1-progress,3);
    const currentDeg=startAngle+(targetDeg-startAngle)*ease;
    angle=currentDeg*Math.PI/180;

    drawWheel();
    if(ballSpinning){
      ballAngle+=ballSpeed;
      ballRadius-=0.25;
      ballSpeed*=0.995;
      if(ballRadius<150) ballRadius=150;
      drawBall();
    }

    if(progress<1) requestAnimationFrame(animate);
    else {
      const number=numbers[resultIndex];
      document.getElementById("result").textContent=number;
      ballSpinning=false;
      spinning=false;
    }
  }
  requestAnimationFrame(animate);
}

document.getElementById("spinBtn").addEventListener("click", () => {
  if(spinning) return;
  spinning=true;
  const resultIndex=Math.floor(Math.random()*numbers.length);
  animateSpin(resultIndex);
});