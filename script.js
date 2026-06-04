/* ── Distância Generosa · Animation Engine ──────────────────────── */

const WA_NUMBER  = '351910000000'; // ← substitua pelo número real
const WA_MESSAGE = encodeURIComponent('Olá! Gostaria de saber mais sobre a Distância Generosa.');

// ── Scroll hint → próxima secção ───────────────────────────────
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
  scrollHint.addEventListener('click', () => {
    const next = document.querySelector('.hero + *') || document.querySelector('.stats-band');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  });
}

// ── WhatsApp links ──────────────────────────────────────────────
document.querySelectorAll('[data-wa]').forEach(el => {
  el.href   = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;
  el.target = '_blank';
  el.rel    = 'noopener noreferrer';
});

// ── Floating Pill Nav — waabi.ai style (mobile) ─────────────────
(function initFloatNav() {
  const main = [
    { href: 'index.html',  label: 'Home',       name: 'Home' },
    { href: 'sobre.html',  label: 'Quem Somos', name: 'Quem Somos' },
  ];
  const services = [
    { href: 'empresa-tvde.html', label: 'Sua Empresa TVDE', name: 'Empresa TVDE' },
    { href: 'motorista.html',    label: 'Seja Motorista',   name: 'Motoristas' },
    { href: 'frotas.html',       label: 'Gestão de Frotas', name: 'Frotas' },
  ];
  const end = [
    { href: 'contactos.html', label: 'Contactos', name: 'Contactos' },
  ];
  const all = [...main, ...services, ...end];

  const pg   = location.pathname.split('/').pop() || 'index.html';
  const curr = all.find(p => p.href === pg) || all[0];

  const float = document.createElement('div');
  float.className = 'nav-float';
  float.innerHTML = `
    <div class="nav-float-header">
      <a href="index.html" class="nav-float-logo">
        <img src="assets/DG-Logo-hor.png" alt="Distância Generosa"/>
      </a>
      <span class="nav-float-current">${curr.name}</span>
      <button class="nav-float-btn" id="nfBtn" aria-label="Menu">
        <span class="nf-icon"><span></span><span></span></span>
      </button>
    </div>
    <div class="nav-float-drawer" id="nfDrawer">
      <div class="nav-float-inner">
        <p class="nav-float-label">Menu</p>
        <ul class="nav-float-items">
          ${main.map(p => `
            <li class="nav-float-item${p.href === pg ? ' active' : ''}">
              <a href="${p.href}">${p.label}</a>
            </li>`).join('')}
        </ul>
        <p class="nav-float-label" style="margin-top:16px">Serviços</p>
        <ul class="nav-float-items">
          ${services.map(p => `
            <li class="nav-float-item${p.href === pg ? ' active' : ''}">
              <a href="${p.href}">${p.label}</a>
            </li>`).join('')}
        </ul>
        <ul class="nav-float-items" style="margin-top:8px">
          ${end.map(p => `
            <li class="nav-float-item${p.href === pg ? ' active' : ''}">
              <a href="${p.href}">${p.label}</a>
            </li>`).join('')}
        </ul>
      </div>
    </div>`;

  document.body.appendChild(float);

  document.getElementById('nfBtn').addEventListener('click', () => {
    float.classList.toggle('open');
  });
  document.getElementById('nfDrawer').querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => float.classList.remove('open'));
  });
})();

// ── Active nav link ─────────────────────────────────────────────
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// ── Dropdown Serviços ───────────────────────────────────────────
(function initDropdown() {
  const dropdown = document.querySelector('.nav-dropdown');
  if (!dropdown) return;
  const trigger = dropdown.querySelector('.nav-dropdown-trigger');

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => dropdown.classList.remove('open'));
  dropdown.querySelector('.nav-mega').addEventListener('click', e => e.stopPropagation());

  const servicePages = ['empresa-tvde.html', 'motorista.html', 'frotas.html'];
  if (servicePages.includes(page)) trigger.classList.add('active');
})();

// ── Desktop mobile nav ──────────────────────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.nav-mobile');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  }));
}

// ── Split text → animated words ─────────────────────────────────
function splitWords(el) {
  const label = el.textContent.trim();
  el.setAttribute('aria-label', label);
  el.innerHTML = label.split(/\s+/).map((w, i) =>
    `<span class="word-wrap"><span class="word" style="transition-delay:${(0.08 + i * 0.08).toFixed(2)}s">${w}</span></span>`
  ).join(' ');
}
document.querySelectorAll('[data-split]').forEach(splitWords);

// ── IntersectionObserver — scroll-triggered animations ──────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      // legacy support
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll(
  '[data-split], .anim-fade-up, .anim-fade-in, .anim-stagger, .reveal, .scroll-hint'
).forEach(el => io.observe(el));

// ── Hero entrance — fires immediately on load ───────────────────
const isHome = page === 'index.html' || page === '';

function heroEntrance() {
  if (!isHome) return;

  // Make hero background parallax start from correct position
  const bg = document.querySelector('.hero-bg');
  if (bg) bg.style.transform = 'translateY(0)';

  // Staggered entrance sequence
  const seq = [
    ['.hero-eyebrow', 200],
    ['.hero-title',   450],
    ['.hero-sub',     800],
    ['.hero-ctas',    1050],
    ['.scroll-hint',  1600],
  ];
  seq.forEach(([sel, delay]) => {
    const el = document.querySelector(sel);
    if (el) setTimeout(() => el.classList.add('in-view'), delay);
  });

  // Fade in hero video once it can play
  const video = document.querySelector('.hero-video');
  if (video) {
    const onCanPlay = () => {
      video.classList.add('loaded');
      video.removeEventListener('canplaythrough', onCanPlay);
    };
    video.addEventListener('canplaythrough', onCanPlay);
    // If already ready
    if (video.readyState >= 3) video.classList.add('loaded');
  }
}

if (document.readyState === 'complete') {
  heroEntrance();
} else {
  window.addEventListener('load', heroEntrance);
}

// ── Scroll: parallax + hero fade + nav ─────────────────────────
let raf = false;

// Init nav state
const nav = document.querySelector('.nav');
function updateNav(y) {
  if (!nav) return;
  if (isHome && y < 50) {
    nav.classList.remove('nav-scrolled');
  } else {
    nav.classList.add('nav-scrolled');
  }
}
updateNav(window.scrollY);

window.addEventListener('scroll', () => {
  if (raf) return;
  raf = true;
  requestAnimationFrame(() => {
    const y  = window.scrollY;
    const vh = window.innerHeight;

    // Parallax hero bg
    if (isHome) {
      const bg = document.querySelector('.hero-bg');
      if (bg) bg.style.transform = `translateY(${(y * 0.38).toFixed(1)}px)`;

      // Hero content fades & lifts as user scrolls away
      const wrap = document.querySelector('.hero-content-wrap');
      if (wrap) {
        const ratio  = Math.max(0, 1 - y / (vh * 0.6));
        const lift   = y * 0.1;
        wrap.style.opacity   = ratio;
        wrap.style.transform = `translateY(${lift.toFixed(1)}px)`;
      }
    }

    updateNav(y);
    raf = false;
  });
}, { passive: true });

// ── Counter animations ──────────────────────────────────────────
function countUp(el) {
  const target   = parseFloat(el.dataset.count);
  const suffix   = el.dataset.suffix  || '';
  const prefix   = el.dataset.prefix  || '';
  const decimals = +(el.dataset.decimals || 0);
  const duration = 1800;
  let start = null;

  function step(ts) {
    if (!start) start = ts;
    const p     = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4); // ease-out quart
    el.textContent = prefix + (eased * target).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const cntIo = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { countUp(e.target); cntIo.unobserve(e.target); }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => cntIo.observe(el));

// ── Form feedback ───────────────────────────────────────────────
document.querySelectorAll('form[data-form]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Enviado!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; form.reset(); }, 3000);
  });
});
