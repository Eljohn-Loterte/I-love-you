let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
        
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    })

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if(e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

// 🎆 FIREWORKS SYSTEM
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let particles = [];

function createFirework(x, y, heart=false) {
  for (let i = 0; i < 40; i++) {
    let angle = Math.random() * Math.PI * 2;
    let speed = Math.random() * 4 + 2;

    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 100,
      heart: heart
    });
  }
}

function createSparkle(x, y) {
  particles.push({
    x: x,
    y: y,
    vx: (Math.random()-0.5)*2,
    vy: (Math.random()-0.5)*2,
    life: 40,
    heart: false
  });
}

function drawHeart(x,y,size){
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.bezierCurveTo(x,y-size,x-size,y-size,x-size,y);
  ctx.bezierCurveTo(x-size,y+size,x,y+size*1.4,x,y+size*2);
  ctx.bezierCurveTo(x,y+size*1.4,x+size,y+size,x+size,y);
  ctx.bezierCurveTo(x+size,y-size,x,y-size,x,y);
  ctx.fill();
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  particles.forEach((p,i)=>{
    p.x+=p.vx;
    p.y+=p.vy;
    p.life--;

    ctx.globalAlpha = p.life/100;

    if(p.heart){
      ctx.fillStyle = "#8B0000";
      drawHeart(p.x,p.y,3);
    } else {
      ctx.fillStyle="white";
      ctx.fillRect(p.x,p.y,2,2);
    }

    if(p.life<=0){
      particles.splice(i,1);
    }
  });

  requestAnimationFrame(animate);
}
animate();


// 💖 BIG FIREWORKS ON LOAD
for(let i=0;i<6;i++){
  setTimeout(()=>{
    createFirework(
      Math.random()*canvas.width,
      Math.random()*canvas.height/2,
      true
    );
  },i*400);
}


// ✨ SPARKLES WHILE DRAGGING PAPERS
document.querySelectorAll(".paper").forEach(paper=>{
  paper.addEventListener("mousemove",(e)=>{
    if(e.buttons===1){
      createSparkle(e.clientX,e.clientY);
    }
  });
});


// 🎇 RANDOM REALISTIC FIREWORKS LOOP
setInterval(()=>{
  createFirework(
    Math.random()*canvas.width,
    Math.random()*canvas.height/2,
    Math.random()>0.5
  );
},2000);
