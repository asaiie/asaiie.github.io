(function () {
  // ---------- Theme toggle ----------
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) applyTheme(saved);

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
      });
    }

    renderStarRatings();
  });

  // ---------- Star ratings ----------
  // Usage: <div class="star-rating" data-rating="3.5"></div>
  // Ratings: 0–5 in 0.5 increments. JS renders 5 SVG stars (full / half / empty).

  const STAR_PATH = 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z';
  const NS = 'http://www.w3.org/2000/svg';
  let halfStarId = 0;

  function createStarSVG(type) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'star');

    if (type === 'half') {
      // Left half filled, right half empty via linearGradient
      const id = 'hsg-' + (halfStarId++);
      const defs = document.createElementNS(NS, 'defs');
      const grad = document.createElementNS(NS, 'linearGradient');
      grad.setAttribute('id', id);
      grad.setAttribute('x1', '0%');
      grad.setAttribute('x2', '100%');
      grad.setAttribute('y1', '0%');
      grad.setAttribute('y2', '0%');
      const s1 = document.createElementNS(NS, 'stop');
      s1.setAttribute('offset', '50%');
      s1.setAttribute('stop-color', '#222');
      const s2 = document.createElementNS(NS, 'stop');
      s2.setAttribute('offset', '50%');
      s2.setAttribute('stop-color', '#222');
      s2.setAttribute('stop-opacity', '0');
      grad.appendChild(s1);
      grad.appendChild(s2);
      defs.appendChild(grad);
      svg.appendChild(defs);

      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', STAR_PATH);
      path.setAttribute('fill', 'url(#' + id + ')');
      path.setAttribute('stroke', '#222');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(path);
    } else {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', STAR_PATH);
      path.setAttribute('stroke', '#222');
      path.setAttribute('stroke-linejoin', 'round');
      if (type === 'full') {
        path.setAttribute('fill', '#222');
        path.setAttribute('stroke-width', '1');
      } else {
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', '1.5');
      }
      svg.appendChild(path);
    }

    return svg;
  }

  function renderStarRatings() {
    document.querySelectorAll('.star-rating').forEach(function (el) {
      const rating = Math.max(0, Math.min(5, parseFloat(el.dataset.rating) || 0));
      const rounded = Math.round(rating * 2) / 2;
      el.innerHTML = '';
      for (let i = 1; i <= 5; i++) {
        const type = rounded >= i ? 'full' : rounded >= i - 0.5 ? 'half' : 'empty';
        el.appendChild(createStarSVG(type));
      }
    });
  }
})();
