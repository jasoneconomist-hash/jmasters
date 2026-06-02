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
const pContainer = document.getElementById('particles');
if (pContainer) {
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;animation-duration:${8+Math.random()*12}s;animation-delay:${Math.random()*12}s;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;opacity:${0.2+Math.random()*0.5}`;
    pContainer.appendChild(p);
  }
}

/* ---- TESTIMONIAL CAROUSEL ---- */
const track = document.getElementById('testiTrack');
const dotsContainer = document.getElementById('tcDots');
if (track) {
  const cards = track.querySelectorAll('.tcard');
  const visibleCount = () => window.innerWidth < 640 ? 1 : window.innerWidth < 900 ? 2 : 3;
  let current = 0;
  let autoTimer;

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const pages = Math.ceil(cards.length / visibleCount());
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('div');
      d.className = 'tc-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(d);
    }
  }

  function goTo(page) {
    const vc = visibleCount();
    const pages = Math.ceil(cards.length / vc);
    current = Math.max(0, Math.min(page, pages - 1));
    const cardW = cards[0].offsetWidth + 20;
    track.style.transform = `translateX(-${current * vc * cardW}px)`;
    dotsContainer?.querySelectorAll('.tc-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => goTo((current + 1) % pages), 5000);
  }

  document.getElementById('tcNext')?.addEventListener('click', () => goTo(current + 1));
  document.getElementById('tcPrev')?.addEventListener('click', () => goTo(current - 1));

  buildDots();
  autoTimer = setTimeout(() => goTo(1), 5000);
  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });
}

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
