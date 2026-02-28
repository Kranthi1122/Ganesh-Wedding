// PAGE LOADER
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2200);
});

/* ─── COUNTDOWN TIMER (to April 3, 2026 7:30AM IST) ─── */
function updateCountdown() {
    const target = new Date('2026-04-03T07:30:00+05:30');
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
        document.getElementById('cd-days').textContent = '00';
        document.getElementById('cd-hours').textContent = '00';
        document.getElementById('cd-mins').textContent = '00';
        document.getElementById('cd-secs').textContent = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ─── SMOOTH PARALLAX HERO BG (RAF + Lerp) ─── */
const heroBg = document.getElementById('hero-bg');
let currentY = 0;
let targetY = 0;
let rafId = null;

function lerp(a, b, t) { return a + (b - a) * t; }

function animateParallax() {
    currentY = lerp(currentY, targetY, 0.08);
    if (heroBg) {
        heroBg.style.transform = `translateY(${currentY}px)`;
    }
    if (Math.abs(currentY - targetY) > 0.1) {
        rafId = requestAnimationFrame(animateParallax);
    } else {
        rafId = null;
    }
}

window.addEventListener('scroll', () => {
    targetY = window.scrollY * 0.35;
    if (!rafId) {
        rafId = requestAnimationFrame(animateParallax);
    }
}, { passive: true });

/* ─── FLOATING PETALS ─────────────────── */
const PETALS = ['🌸', '🌺', '🌼', '🌻', '🍀', '✿'];
const petalContainer = document.getElementById('petals-container');

function createPetal() {
    const el = document.createElement('span');
    el.classList.add('petal');
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    const left = Math.random() * 100;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 6;
    const size = 0.8 + Math.random() * 0.8;
    el.style.cssText = `
    left: ${left}vw;
    font-size: ${size}rem;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: 0.7;
  `;
    petalContainer.appendChild(el);
    setTimeout(() => el.remove(), (duration + delay) * 1000);
}

// Create petals continuously
setInterval(createPetal, 700);
// Burst on load
for (let i = 0; i < 12; i++) createPetal();

/* ─── INTERSECTION OBSERVER (Scroll Reveal) ── */
const revealEls = document.querySelectorAll(
    '.fade-in-up, .fade-in-left, .fade-in-right, .event-card, .story-item, .family-card'
);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => {
    // Don't observe hero items – they animate on load
    if (!el.closest('#hero')) {
        el.style.opacity = '0';
        observer.observe(el);
    }
});

/* ─── SMOOTH SECTION LINKS ────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const id = anchor.getAttribute('href');
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ─── NAV ACTIVE STATE ─────────────────── */
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 80;
    let current = '';
    sections.forEach(sec => {
        if (sec.offsetTop <= scrollPos) current = '#' + sec.id;
    });
    navLinks.forEach(a => {
        a.classList.toggle('text-gold', a.getAttribute('href') === current);
        a.classList.toggle('text-gold-light', a.getAttribute('href') !== current);
    });
}, { passive: true });
