let highestZ = 1;

document.querySelectorAll(".paper").forEach((paper) => {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  function startDrag(x, y) {
    isDragging = true;
    highestZ++;
    paper.style.zIndex = highestZ;

    const rect = paper.getBoundingClientRect();
    offsetX = x - rect.left;
    offsetY = y - rect.top;
  }

  function dragMove(x, y) {
    if (!isDragging) return;

    paper.style.left = x - offsetX + "px";
    paper.style.top = y - offsetY + "px";
  }

  function endDrag() {
    isDragging = false;
  }

  // 🖱️ MOUSE EVENTS
  paper.addEventListener("mousedown", (e) => {
    startDrag(e.clientX, e.clientY);
  });

  document.addEventListener("mousemove", (e) => {
    dragMove(e.clientX, e.clientY);
  });

  document.addEventListener("mouseup", endDrag);

  // 📱 TOUCH EVENTS
  paper.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  });

  document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    dragMove(touch.clientX, touch.clientY);
  });

  document.addEventListener("touchend", endDrag);
});

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
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

function createFirework(x, y, heart = false) {
  for (let i = 0; i < 40; i++) {
    let angle = Math.random() * Math.PI * 2;
    let speed = Math.random() * 4 + 2;

    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 100,
      heart: heart,
    });
  }
}

function createSparkle(x, y) {
  particles.push({
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    life: 40,
    heart: false,
  });
}

function drawHeart(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x, y - size, x - size, y - size, x - size, y);
  ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.4, x, y + size * 2);
  ctx.bezierCurveTo(x, y + size * 1.4, x + size, y + size, x + size, y);
  ctx.bezierCurveTo(x + size, y - size, x, y - size, x, y);
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    ctx.globalAlpha = p.life / 100;

    if (p.heart) {
      ctx.fillStyle = "#8B0000";
      drawHeart(p.x, p.y, 3);
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect(p.x, p.y, 2, 2);
    }

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  });

  requestAnimationFrame(animate);
}
animate();

// 💖 BIG FIREWORKS ON LOAD
for (let i = 0; i < 6; i++) {
  setTimeout(() => {
    createFirework(
      Math.random() * canvas.width,
      (Math.random() * canvas.height) / 2,
      true,
    );
  }, i * 400);
}

// ✨ SPARKLES WHILE DRAGGING PAPERS
document.querySelectorAll(".paper").forEach((paper) => {
  paper.addEventListener("mousemove", (e) => {
    if (e.buttons === 1) {
      createSparkle(e.clientX, e.clientY);
    }
  });
});

// 🎇 RANDOM REALISTIC FIREWORKS LOOP
setInterval(() => {
  createFirework(
    Math.random() * canvas.width,
    (Math.random() * canvas.height) / 2,
    Math.random() > 0.5,
  );
}, 2000);
