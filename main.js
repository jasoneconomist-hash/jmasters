// JMasters Global — main.js v3

/* ---- NAV SCROLL ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- MOBILE NAV ---- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a,button').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

/* ---- LOGIN MODAL ---- */
const modal = document.getElementById('loginModal');
function openModal() { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal() { modal.classList.remove('active'); document.body.style.overflow = ''; }
document.getElementById('openLogin')?.addEventListener('click', openModal);
document.getElementById('modalClose')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.querySelectorAll('[onclick="openModal()"]').forEach(el => el.addEventListener('click', openModal));
document.querySelectorAll('[onclick="closeModal()"]').forEach(el => el.addEventListener('click', closeModal));

// Modal tabs
document.querySelectorAll('.mtab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.mtab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.modal-form').forEach(f => f.classList.add('hidden'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + 'Form')?.classList.remove('hidden');
  });
});

/* ---- COUNTDOWN TIMER ---- */
function updateCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  let stored = localStorage.getItem('jm_end');
  if (!stored || Date.now() > parseInt(stored)) {
    stored = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('jm_end', stored);
  }
  const diff = Math.max(0, parseInt(stored) - Date.now());
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ---- ANIMATED COUNTERS ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.hero-stats,.why-stats-grid').forEach(el => counterObserver.observe(el));

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.svc-card,.level-card,.step-card,.tcard,.wf,.ws,.tool-pill').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 8) * 0.06 + 's';
  revealObserver.observe(el);
});

/* ---- PARTICLES ---- */
(function() {
  const pContainer = document.getElementById('particles');
  if (!pContainer) return;
  const colors = [
    'rgba(232,160,32,0.6)',   // gold
    'rgba(59,130,246,0.5)',   // blue
    'rgba(6,182,212,0.5)',    // cyan
    'rgba(255,255,255,0.3)',  // white
    'rgba(139,92,246,0.4)',   // purple
  ];
  for (let i = 0; i < 32; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random() * 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = [
      'left:' + (Math.random() * 100) + '%',
      'animation-duration:' + (7 + Math.random() * 14) + 's',
      'animation-delay:' + (Math.random() * 14) + 's',
      'width:' + size + 'px',
      'height:' + size + 'px',
      'background:' + color,
      'border-radius:50%',
      'box-shadow:0 0 ' + (size*2) + 'px ' + color,
    ].join(';');
    pContainer.appendChild(p);
  }
})();

/* ---- TESTIMONIAL CAROUSEL ---- */
(function() {
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('tcDots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.tcard'));
  let current = 0;
  let auto;

  function vc() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 960) return 2;
    return 3;
  }

  function pages() { return Math.ceil(cards.length / vc()); }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages(); i++) {
      const d = document.createElement('div');
      d.className = 'tc-dot' + (i === current ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(p) {
    const totalPages = pages();
    current = ((p % totalPages) + totalPages) % totalPages;
    const v = vc();
    // calculate card width including gap
    const gap = 20;
    const cardW = cards[0] ? cards[0].offsetWidth + gap : 340;
    track.style.transform = 'translateX(-' + (current * v * cardW) + 'px)';
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.tc-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }
    clearTimeout(auto);
    auto = setTimeout(() => goTo(current + 1), 5000);
  }

  document.getElementById('tcNext')?.addEventListener('click', () => goTo(current + 1));
  document.getElementById('tcPrev')?.addEventListener('click', () => goTo(current - 1));

  // Touch swipe
  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = sx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) goTo(dx > 0 ? current + 1 : current - 1);
  });

  // Pause on hover
  track.addEventListener('mouseenter', () => clearTimeout(auto));
  track.addEventListener('mouseleave', () => { auto = setTimeout(() => goTo(current + 1), 5000); });

  buildDots();
  auto = setTimeout(() => goTo(1), 4000);
  window.addEventListener('resize', () => { buildDots(); goTo(0); });
})();

/* ---- ACTIVE NAV ON SCROLL ---- */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const pos = window.scrollY + 100;
  sections.forEach(s => {
    const link = document.querySelector(`.nav-links a[href*="#${s.id}"]`);
    if (link) link.classList.toggle('active', pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight);
  });
});

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
