// =========================
// AOS (safe init)
// =========================
if (window.AOS) {
  AOS.init({ once: true });
}

// =========================
// Custom Cursor (safe + glow)
// =========================
window.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  // If cursor elements don't exist on this page, do nothing
  if (!cursor || !follower) return;

  // Move cursor
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    follower.animate(
      { left: e.clientX + 'px', top: e.clientY + 'px' },
      { duration: 250, fill: "forwards" }
    );
  });

  // Generic hover targets (slight expand)
  const hoverTargets = document.querySelectorAll('a, .btn, button, summary');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Majalis glow targets (strong glow)
  const glowTargets = document.querySelectorAll('.majlis-card, .majlis-card summary, .majlis-list a');
  glowTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-glow'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-glow'));
  });
});

// =========================
// Navbar Scroll Effect
// =========================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// =========================
// Lattice Background Animation (Canvas)
// =========================
const canvas = document.getElementById('lattice-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let particlesArray = [];

function setCanvasSize() {
  if (!canvas || !ctx) return;

  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

class Particle {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.directionX = (Math.random() * 0.4) - 0.2;
    this.directionY = (Math.random() * 0.4) - 0.2;
    this.size = Math.random() * 2 + 1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = '#c6a87c';
    ctx.fill();
  }
  update() {
    if (this.x > window.innerWidth || this.x < 0) this.directionX = -this.directionX;
    if (this.y > window.innerHeight || this.y < 0) this.directionY = -this.directionY;

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function initParticles() {
  if (!canvas || !ctx) return;

  particlesArray = [];
  const numberOfParticles = (window.innerWidth * window.innerHeight) / 15000;

  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function connect() {
  if (!canvas || !ctx) return;

  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a + 1; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const dist2 = dx * dx + dy * dy;

      const r = 180;
      if (dist2 < r * r) {
        const opacity = 1 - dist2 / (r * r);
        ctx.strokeStyle = `rgba(198, 168, 124, ${opacity * 0.07})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  if (!canvas || !ctx) return;

  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

window.addEventListener('resize', () => {
  setCanvasSize();
  initParticles();
});

setCanvasSize();
initParticles();
animate();

// =========================
// Navbar dropdown: tap to open/close (mobile)
window.addEventListener('DOMContentLoaded', () => {
  const dd = document.querySelector('.nav-dropdown');
  if (!dd) return;

  const trigger = dd.querySelector('a');
  const menu = dd.querySelector('.dropdown-menu');

  if (!trigger || !menu) return;

  trigger.addEventListener('click', (e) => {
    // On mobile: prevent immediate navigation so it can open
    if (window.matchMedia('(hover: none)').matches) {
      e.preventDefault();
      dd.classList.toggle('open');
    }
  });

  document.addEventListener('click', (e) => {
    if (!dd.contains(e.target)) dd.classList.remove('open');
  });
});

const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });
}

