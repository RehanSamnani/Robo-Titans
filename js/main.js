/* ============================================================
   ROBO TITANS #123 — Core Page Interactivity & Controllers
   ============================================================ */

// ---------- Mobile Navigation Menu ----------
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
}

// ---------- Background Camera Director Controller ----------
function setCameraView(mode, btnEl) {
    if (typeof window.setBgCameraMode === 'function') {
        window.setBgCameraMode(mode);
    }
    if (typeof window.playTechSound === 'function') {
        window.playTechSound();
    }
    // Update active button state
    document.querySelectorAll('.cam-btn').forEach(btn => btn.classList.remove('active'));
    if (btnEl) {
        btnEl.classList.add('active');
    }
}

// ---------- Countdown Timer ----------
(function initCountdown() {
    const target = new Date();
    target.setDate(target.getDate() + 25);
    target.setHours(target.getHours() + 14, target.getMinutes() + 38, target.getSeconds() + 42);

    function tick() {
        const diff = Math.max(0, target - new Date());
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(val).padStart(2, '0');
        };
        set('days', d);
        set('hours', h);
        set('minutes', m);
        set('seconds', s);
    }
    tick();
    setInterval(tick, 1000);
})();

// ---------- Animated Stat Counters ----------
(function initCounters() {
    const els = document.querySelectorAll('.counter');
    const animate = (el) => {
        const target = parseInt(el.dataset.target, 10) || 0;
        const duration = 1400;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString();
            }
        }
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.35 });

    els.forEach((el) => observer.observe(el));
})();

// ---------- Roster Filter ----------
function filterRoster(role, btnEl) {
    document.querySelectorAll('.roster-card').forEach((card) => {
        card.classList.toggle('hidden-card', role !== 'all' && card.dataset.role !== role);
    });
    document.querySelectorAll('#rosterFilters .roster-btn').forEach((btn) => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    if (typeof window.playTechSound === 'function') window.playTechSound();
}

// ---------- Match Matrix Filter ----------
function filterMatches(category, btnEl) {
    document.querySelectorAll('.match-row').forEach((row) => {
        row.classList.toggle('hidden-row', category !== 'all' && row.dataset.category !== category);
    });
    document.querySelectorAll('#matchFilters .m-filter-btn').forEach((btn) => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    if (typeof window.playTechSound === 'function') window.playTechSound();
}

// ---------- Weapon Throttle Simulator ----------
(function initThrottleSimulator() {
    const slider = document.getElementById('throttleSlider');
    if (!slider) return;

    slider.addEventListener('input', () => {
        const rpm = parseInt(slider.value, 10);
        const pct = Math.round((rpm / 13500) * 100);
        const percentEl = document.getElementById('throttlePercent');
        const rpmEl = document.getElementById('rpmVal');
        const joulesEl = document.getElementById('joulesVal');

        if (percentEl) percentEl.textContent = `${pct}% (${rpm.toLocaleString()} RPM)`;
        if (rpmEl) rpmEl.textContent = rpm.toLocaleString();
        if (joulesEl) joulesEl.textContent = (58.4 * (rpm / 13500)).toFixed(1) + ' kJ';

        const blade = document.getElementById('weaponBlade');
        if (blade) {
            if (rpm > 0) {
                const duration = Math.max(0.1, 1.2 - (pct / 100) * 1.05);
                blade.style.animation = `spinBlade ${duration}s linear infinite`;
            } else {
                blade.style.animation = 'none';
            }
        }
    });
})();

// Keyframe injection for blade spin
const styleTag = document.createElement('style');
styleTag.textContent = `@keyframes spinBlade { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);

// ---------- Tactical Arena Presets ----------
const TACTICS = {
    rush: {
        pos: { top: '52%', left: '48%' },
        text: '"Aggressive rush: Driver Rayan Dobani executes immediate arena-center seizure within 2.8 seconds, denying opposing wedge angle leverage and dictating line-of-engagement."'
    },
    grind: {
        pos: { top: '78%', left: '18%' },
        text: '"Corner pin & grind: Rayan steers TITAN-X123 into arena sidewalls, trapping opponent armor while the vertical steel drum delivers sustained impact abrasion."'
    },
    counter: {
        pos: { top: '32%', left: '68%' },
        text: '"Counter-spin intercept: Hold boundary perimeter, bait opponent initial charge, then execute rapid gyro pivot to strike exposed drivetrain side-pods."'
    },
    evade: {
        pos: { top: '22%', left: '26%' },
        text: '"Tactical disengage: Utilize 281 SPD spring agility to circle around hazards, reset weapon rotational kinetic energy to 13,500 RPM, and re-engage."'
    }
};

function setTacticalPreset(key, btnEl) {
    const preset = TACTICS[key];
    if (!preset) return;
    const bot = document.getElementById('botVector');
    if (bot) {
        bot.style.top = preset.pos.top;
        bot.style.left = preset.pos.left;
    }
    const desc = document.getElementById('tacticalDesc');
    if (desc) desc.textContent = preset.text;

    document.querySelectorAll('.tactics-btn').forEach(b => b.classList.remove('border-cyber-cyan', 'text-cyber-cyan', 'bg-cyber-cyan/20'));
    if (btnEl) btnEl.classList.add('border-cyber-cyan', 'text-cyber-cyan', 'bg-cyber-cyan/20');

    if (typeof window.playTechSound === 'function') window.playTechSound();
}

// ---------- Fan Zone Cheer Action ----------
function cheerNow() {
    const el = document.getElementById('cheerCount');
    if (!el) return;
    const current = parseInt(el.textContent.replace(/,/g, ''), 10) || 0;
    el.textContent = (current + 1).toLocaleString();

    // Trigger celebration chime
    if (typeof window.playCheerChime === 'function') window.playCheerChime();

    // Button pulse feedback
    const btn = event ? event.currentTarget : null;
    if (btn) {
        btn.classList.add('scale-105', 'shadow-cyber-gold/50');
        setTimeout(() => btn.classList.remove('scale-105', 'shadow-cyber-gold/50'), 300);
    }
}

// ---------- Navbar backdrop on scroll ----------
(function initNavbarScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('shadow-2xl', window.scrollY > 20);
        nav.classList.toggle('border-cyber-cyan/30', window.scrollY > 20);
    });
})();
