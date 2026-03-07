// PAGE LOADER AND INVITATION OVERLAY
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2200);
});

/* ─── INVITATION OVERLAY LOGIC (Curtain Opening) ────────── */
const overlay = document.getElementById('invitation-overlay');
const openBtn = document.getElementById('open-invitation-btn');
const curtainLeft = document.getElementById('curtain-left');
const curtainRight = document.getElementById('curtain-right');
const invitationContent = document.getElementById('invitation-content');

if (openBtn) {
    openBtn.addEventListener('click', () => {
        // 1. Open the curtains
        if (curtainLeft) curtainLeft.style.transform = 'translateX(-100%)';
        if (curtainRight) curtainRight.style.transform = 'translateX(100%)';

        // 2. After curtains open, show content briefly then fade
        if (invitationContent) {
            invitationContent.style.transition = 'transform 1s ease, opacity 0.8s ease';
            invitationContent.style.transform = 'scale(1.05)';
        }

        // 3. Fade out invitation content
        setTimeout(() => {
            if (invitationContent) {
                invitationContent.style.opacity = '0';
                invitationContent.style.transform = 'scale(1.1)';
            }
        }, 2800);

        // 4. Fade out the entire overlay
        setTimeout(() => {
            overlay.classList.add('hide-overlay');
        }, 3500);
    });
}

/* ─── INVITATION PARTICLES CANVAS ────────── */
(function initInviteParticles() {
    const canvas = document.getElementById('invite-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isMobileDevice = window.innerWidth <= 768;
    const COUNT = isMobileDevice ? 30 : 60;
    let particles = [];
    let running = true;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Spark {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.8;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = -(Math.random() * 0.4 + 0.1);
            this.opacity = Math.random() * 0.7 + 0.3;
            this.pulse = Math.random() * Math.PI * 2;
            const palette = [
                [240, 213, 133], [201, 168, 76], [212, 148, 58],
                [255, 240, 210], [232, 121, 26]
            ];
            this.color = palette[Math.floor(Math.random() * palette.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += 0.03;
            this.opacity = 0.3 + Math.sin(this.pulse) * 0.3;
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
                this.y = canvas.height + Math.random() * 20;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${this.opacity})`;
            ctx.shadowColor = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},0.5)`;
            ctx.shadowBlur = this.size * 5;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Spark());

    function animate() {
        if (!running) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();

    // Stop particles when overlay is hidden
    const obs = new MutationObserver(() => {
        if (overlay && overlay.classList.contains('hide-overlay')) {
            running = false;
            obs.disconnect();
        }
    });
    if (overlay) obs.observe(overlay, { attributes: true, attributeFilter: ['class'] });
})();

/* ─── COUNTDOWN TIMER (to April 3, 2026 7:30AM IST) ─── */
function updateCountdown() {
    const target = new Date('2026-04-03T07:46:00+05:30');
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

    // Animate countdown number changes
    animateCountdownNum('cd-days', String(days).padStart(2, '0'));
    animateCountdownNum('cd-hours', String(hours).padStart(2, '0'));
    animateCountdownNum('cd-mins', String(mins).padStart(2, '0'));
    animateCountdownNum('cd-secs', String(secs).padStart(2, '0'));
}

function animateCountdownNum(id, newVal) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.textContent === newVal) return;
    el.style.transform = 'scale(1.15)';
    el.style.opacity = '0.7';
    el.textContent = newVal;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            el.style.transform = 'scale(1)';
            el.style.opacity = '1';
        });
    });
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ─── SMOOTH PARALLAX HERO BG (RAF + Lerp, desktop only) ─── */
const heroBg = document.getElementById('hero-bg');
let currentY = 0;
let targetY = 0;
let rafId = null;
const isMobile = () => window.innerWidth <= 768;

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
    if (isMobile()) {
        if (heroBg) heroBg.style.transform = 'none';
        return;
    }
    targetY = window.scrollY * 0.28;
    if (!rafId) {
        rafId = requestAnimationFrame(animateParallax);
    }
}, { passive: true });

/* ─── FLOATING PETALS (wedding-themed) ─── */
const PETALS = ['🌸', '🌺', '🪷', '💐', '✿', '🌼', '🪻'];
const petalContainer = document.getElementById('petals-container');

function createPetal() {
    const el = document.createElement('span');
    el.classList.add('petal');
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    const left = Math.random() * 100;
    const duration = 7 + Math.random() * 9;
    const delay = Math.random() * 6;
    const size = 0.8 + Math.random() * 0.9;
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

const petalInterval = isMobile() ? 1400 : 800;
if (petalInterval > 0) {
    setInterval(createPetal, petalInterval);
    for (let i = 0; i < (isMobile() ? 4 : 7); i++) createPetal();
}

/* ─── GOLDEN SPARKLE CANVAS (Hero section) ─── */
(function initSparkleCanvas() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;';
    hero.insertBefore(canvas, hero.querySelector('.relative'));

    const ctx = canvas.getContext('2d');
    let particles = [];
    const MAX_PARTICLES = isMobile() ? 25 : 50;

    function resize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = -(Math.random() * 0.3 + 0.05);
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.fadeDir = Math.random() > 0.5 ? 1 : -1;
            this.life = 0;
            this.maxLife = Math.random() * 400 + 200;
            // Gold, amber, or warm white
            const colors = [
                [240, 213, 133],  // gold-light
                [201, 168, 76],   // gold
                [212, 148, 58],   // amber
                [255, 240, 210],  // warm white
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;
            this.opacity += this.fadeDir * 0.003;
            if (this.opacity > 0.8) this.fadeDir = -1;
            if (this.opacity < 0.1) this.fadeDir = 1;
            if (this.life > this.maxLife || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
                this.y = canvas.height + 10;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${this.opacity})`;
            ctx.shadowColor = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},0.4)`;
            ctx.shadowBlur = this.size * 4;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < MAX_PARTICLES; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ─── INTERSECTION OBSERVER (Scroll Reveal with stagger) ── */
const revealEls = document.querySelectorAll(
    '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .event-card, .story-item, .family-card, .reveal-stagger'
);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // For direct animation elements, set opacity
            if (!entry.target.classList.contains('reveal-stagger')) {
                entry.target.style.opacity = '1';
            }
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
    if (!el.closest('#hero')) {
        if (!el.classList.contains('reveal-stagger')) {
            el.style.opacity = '0';
        }
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
