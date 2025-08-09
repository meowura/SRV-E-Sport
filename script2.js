/* =========================================================
   SRV E-SPORT – script2.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------ ตัวแปร element หลัก ------------------ */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navbarRight = document.getElementById('navbar-right');
  const brand = document.getElementById('brand');
  const themeWrap = document.getElementById('theme-switch');
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeMenu = document.getElementById('theme-menu');
  const carouselRoot = document.getElementById('past-carousel');

  /* ------------------ คำนวณความสูง navbar ------------------ */
  const getNavH = () => (navbar ? navbar.offsetHeight : 0);

  /* ------------------ เปลี่ยนพื้นหลัง navbar เมื่อเลื่อน ------------------ */
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 6) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------ เลื่อนสมูท + ชดเชย navbar ------------------ */
  function offsetScrollTo(targetEl, behavior = 'smooth') {
    if (!targetEl) return;
    const y = targetEl.getBoundingClientRect().top + window.scrollY - (getNavH() + 8);
    window.scrollTo({ top: y, behavior });
  }

  document.querySelectorAll('#navbar a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      offsetScrollTo(target, 'smooth');

      // ปิดเมนูบนมือถือหลังคลิก
      navbar.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');

      history.pushState(null, '', `#${id}`);
    });
  });

  // ถ้าเปิดมาพร้อม hash ให้เลื่อนด้วย offset ทันที
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) offsetScrollTo(target, 'instant');
  }

  /* ------------------ คลิกโลโก้ = กลับบนสุด ------------------ */
  if (brand) {
    brand.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState(null, '', '#top');
    });
  }

  /* ------------------ Mobile navbar toggle (สามขีด) ------------------ */
  if (navToggle && navbar && navbarRight) {
    navToggle.addEventListener('click', e => {
      e.stopPropagation();
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      navbar.classList.toggle('open'); // CSS จะโชว์ #navbar-right เมื่อ .open ถูกใส่
    });

    // คลิกนอก navbar ให้ปิดเมนู
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navbar.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // เปลี่ยนขนาดจอจากเล็ก → ใหญ่ ให้ปิดเมนูและรีเซ็ตสถานะ
    const mm = window.matchMedia('(min-width: 769px)');
    mm.addEventListener('change', () => {
      navbar.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* ------------------ Carousel (คลิก/ลูกศร/ปัด) ------------------ */
  if (carouselRoot) {
    const viewport = carouselRoot.querySelector('.carousel-viewport');
    const track = carouselRoot.querySelector('.carousel-track');
    const slides = Array.from(carouselRoot.querySelectorAll('.carousel-slide'));
    const leftBtn = carouselRoot.querySelector('.carousel-btn.left');
    const rightBtn = carouselRoot.querySelector('.carousel-btn.right');
    const counter = carouselRoot.querySelector('.carousel-counter');

    let i = 0;
    const n = slides.length;

    const update = () => {
      track.style.transform = `translateX(-${i * 100}%)`;
      if (counter) counter.textContent = `รูป ${i + 1}/${n}`;
    };
    const move = dir => { i = (i + dir + n) % n; update(); };

    if (leftBtn) leftBtn.addEventListener('click', e => { e.stopPropagation(); move(-1); });
    if (rightBtn) rightBtn.addEventListener('click', e => { e.stopPropagation(); move(1); });

    if (viewport) {
      viewport.addEventListener('click', e => {
        const r = viewport.getBoundingClientRect();
        (e.clientX - r.left) < r.width / 2 ? move(-1) : move(1);
      });

      // touch swipe
      let startX = 0;
      viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      viewport.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (diff > 50) move(-1);
        if (diff < -50) move(1);
      }, { passive: true });
    }

    // keyboard
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    });

    update();
  }

  /* ------------------ Theme switcher ------------------ */
  function applyTheme(mode) {
    if (mode === 'default') document.body.removeAttribute('data-theme');
    else document.body.setAttribute('data-theme', mode);
    localStorage.setItem('theme-mode', mode);
  }

  // โหลดธีมล่าสุด
  applyTheme(localStorage.getItem('theme-mode') || 'default');

  if (themeBtn && themeWrap && themeMenu) {
    themeBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = themeWrap.classList.toggle('open');
      themeBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    themeMenu.addEventListener('click', e => {
      const item = e.target.closest('.theme-item');
      if (!item) return;
      applyTheme(item.dataset.theme);
      themeWrap.classList.remove('open');
      themeBtn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('click', () => {
      themeWrap.classList.remove('open');
      themeBtn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        themeWrap.classList.remove('open');
        themeBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
