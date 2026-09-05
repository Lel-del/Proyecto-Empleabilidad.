const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = mainNav ? mainNav.querySelectorAll("a") : [];
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const typewriterTarget = document.getElementById("typewriter");
const particleCanvas = document.getElementById("particlesCanvas");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Typewriter Hero */
const typewriterPhrases = [
  "Desarrollador Full Stack",
  "Problem Solver",
  "Lean-ready Talent"
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function runTypewriter() {
  if (!typewriterTarget) return;

  const current = typewriterPhrases[phraseIndex];
  const displayed = deleting
    ? current.slice(0, charIndex--)
    : current.slice(0, charIndex++);

  typewriterTarget.textContent = displayed;

  let speed = deleting ? 45 : 85;

  if (!deleting && displayed.length === current.length) {
    speed = 1200;
    deleting = true;
  } else if (deleting && displayed.length === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
    speed = 300;
    charIndex = 0;
  }

  setTimeout(runTypewriter, speed);
}
runTypewriter();

/* Scroll reveal */
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* Tilt 3D */
const tiltItems = document.querySelectorAll(".tilt-card, .project-flip");
tiltItems.forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 6;
    item.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
});

/* Microinteracciones botón */
const magneticItems = document.querySelectorAll(".magnetic");
magneticItems.forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    item.style.transform = `translate(${dx * 0.08}px, ${dy * 0.12}px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translate(0, 0)";
  });
});

/* Video hover play */
const projectCards = document.querySelectorAll(".project-flip");
projectCards.forEach((card) => {
  const video = card.querySelector("video");
  if (!video) return;

  card.addEventListener("mouseenter", () => {
    video.play().catch(() => {});
  });

  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});

/* Partículas interactivas */
if (particleCanvas) {
  const ctx = particleCanvas.getContext("2d");
  let width = 0;
  let height = 0;
  let mouse = { x: -1000, y: -1000 };
  const particles = [];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    particleCanvas.width = width;
    particleCanvas.height = height;
  }

  function createParticles() {
    particles.length = 0;
    const count = Math.min(95, Math.floor((width * height) / 18000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() * 1.9 + 0.7
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const dxm = p.x - mouse.x;
      const dym = p.y - mouse.y;
      const mouseDist = Math.sqrt(dxm * dxm + dym * dym);

      if (mouseDist < 120) {
        p.x += dxm * 0.01;
        p.y += dym * 0.01;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(84, 190, 255, 0.68)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(37, 216, 135, ${0.22 - dist / 650})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resizeCanvas();
  createParticles();
  drawParticles();
}

/* Formulario */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !email || !mensaje) {
      formStatus.textContent = "Por favor completa todos los campos.";
      formStatus.style.color = "#ffb4b4";
      return;
    }

    if (!isValidEmail(email)) {
      formStatus.textContent = "Ingresa un correo válido.";
      formStatus.style.color = "#ffb4b4";
      return;
    }

    const subject = encodeURIComponent(`Nuevo mensaje de ${nombre}`);
    const body = encodeURIComponent(`Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`);
    const mailtoUrl = `mailto:tu-correo@ejemplo.com?subject=${subject}&body=${body}`;

    formStatus.textContent = "Formulario válido. Abriendo cliente de correo...";
    formStatus.style.color = "#a9b8d9";

    window.location.href = mailtoUrl;
    contactForm.reset();
  });
}
