/* ============================================================
   Menicon Life Support Hub — Interactive Logic & Animations
   ============================================================ */

// ==================== DATA ====================
const PRODUCTS = [
  {
    id: 'CH4300',
    name: '茶生和沏组合茶叶礼盒',
    category: 'promo',
    categoryLabel: '推广赠品',
    tagClass: 'tag--promo',
    sku: 'CH4300',
    stock: 'available',
    stockLabel: '充足',
    units: '50 套',
    desc: '精选茶叶组合礼盒，适合客户馈赠与活动推广使用。包含多种优质茶品，包装精美大方。',
    catalogDesc: '适用于客户拜访、展会推广及节日馈赠等场景。每套包含4种不同风味的精选茶叶。',
    emoji: '🍵'
  },
  {
    id: 'MR2100',
    name: '多功能双面护理镜',
    category: 'access',
    categoryLabel: '配件',
    tagClass: 'tag--access',
    sku: 'MR2100',
    stock: 'available',
    stockLabel: '充足',
    units: '200 个',
    desc: '高品质双面折叠镜，一面普通镜面，一面放大镜面，方便隐形眼镜佩戴与护理。',
    catalogDesc: '专为隐形眼镜用户设计的便携护理镜，折叠设计便于携带，是门店赠品的理想选择。',
    emoji: '🪞'
  },
  {
    id: 'PL1500',
    name: '钴蓝光笔灯',
    category: 'market',
    categoryLabel: '营销物料',
    tagClass: 'tag--market',
    sku: 'PL1500',
    stock: 'low',
    stockLabel: '库存紧张',
    units: '30 支',
    desc: '专业钴蓝光检测笔灯，用于角膜荧光素染色检查，是验配师的得力工具。',
    catalogDesc: '医学级钴蓝光源，配合荧光素钠使用，可有效检查角膜健康状况。',
    emoji: '🔦'
  },
  {
    id: 'BG3200',
    name: '镜片护理收纳包',
    category: 'promo',
    categoryLabel: '推广赠品',
    tagClass: 'tag--promo',
    sku: 'BG3200',
    stock: 'available',
    stockLabel: '充足',
    units: '150 个',
    desc: '时尚便携收纳包，内含隐形眼镜盒、镊子与吸棒，外出携带必备。',
    catalogDesc: '完整的隐形眼镜护理套装收纳包，印有Menicon品牌标识，适合作为推广赠品分发。',
    emoji: '👜'
  },
  {
    id: 'PS0800',
    name: '品牌宣传海报套装',
    category: 'market',
    categoryLabel: '营销物料',
    tagClass: 'tag--market',
    sku: 'PS0800',
    stock: 'available',
    stockLabel: '充足',
    units: '500 套',
    desc: '高品质品牌宣传海报，涵盖产品线介绍、品牌形象与促销活动等多种主题。',
    catalogDesc: '适用于门店装饰与活动现场布置，多种尺寸可选，画面清晰色彩还原度高。',
    emoji: '🖼️'
  },
  {
    id: 'CL5500',
    name: '护理液试用装',
    category: 'promo',
    categoryLabel: '推广赠品',
    tagClass: 'tag--promo',
    sku: 'CL5500',
    stock: 'out',
    stockLabel: '已售罄',
    units: '0 瓶',
    desc: 'Menicon 专业护理液60ml旅行装，温和清洁配方，适合所有类型的隐形眼镜。',
    catalogDesc: '小规格试用装，适合作为新客户体验装或随盒赠品使用。暂时缺货，补货中。',
    emoji: '💧'
  },
  {
    id: 'NB4400',
    name: '品牌定制笔记本',
    category: 'other',
    categoryLabel: '其他',
    tagClass: 'tag--other',
    sku: 'NB4400',
    stock: 'available',
    stockLabel: '充足',
    units: '300 本',
    desc: 'A5尺寸精装笔记本，封面烫金Menicon标识，内页采用护眼米黄纸张。',
    catalogDesc: '高品质商务笔记本，适合会议、培训及客户活动场景使用。',
    emoji: '📓'
  },
  {
    id: 'UB6600',
    name: '折叠遮阳伞',
    category: 'other',
    categoryLabel: '其他',
    tagClass: 'tag--other',
    sku: 'UB6600',
    stock: 'low',
    stockLabel: '库存紧张',
    units: '45 把',
    desc: '轻量三折自动开合伞，UPF50+ 防晒等级，印有品牌标识。',
    catalogDesc: '实用型户外赠品，兼具防晒与防雨功能，适合夏季促销活动赠送使用。',
    emoji: '☂️'
  }
];

// ==================== PARTICLE CANVAS ====================
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((w * h) / 12000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212, 168, 83, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw & update particles
    for (const p of particles) {
      // Mouse interaction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        p.vx -= dx * 0.00005;
        p.vy -= dy * 0.00005;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 168, 83, ${p.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  resize();
  createParticles();
  draw();
})();

// ==================== TYPEWRITER ====================
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const texts = [
    'Menicon Life Support Hub',
    '目立康生活支持平台',
    'Smart · Elegant · Efficient'
  ];

  let textIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let delay = 100;

  function tick() {
    const current = texts[textIdx];

    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 80 + Math.random() * 60;

      if (charIdx === current.length) {
        deleting = true;
        delay = 2000; // pause at full text
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 40;

      if (charIdx === 0) {
        deleting = false;
        textIdx = (textIdx + 1) % texts.length;
        delay = 500;
      }
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 800);
})();

// ==================== NAVBAR ====================
// Scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = scrollY;
});

// Active link tracking
const navLinks = document.querySelectorAll('.navbar__link');
const sections = document.querySelectorAll('section[id], .hero');

const observerOptions = {
  rootMargin: '-30% 0px -70% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, observerOptions);

sections.forEach(sec => sectionObserver.observe(sec));

// Mobile nav toggle
function toggleNav() {
  const links = document.getElementById('navLinks');
  const toggle = document.getElementById('navToggle');
  links.classList.toggle('open');
  toggle.classList.toggle('open');
}

// Close mobile nav on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('navToggle').classList.remove('open');
  });
});

// ==================== MODULE CARD GLOW ====================
document.querySelectorAll('.module-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', x + 'px');
    card.style.setProperty('--mouse-y', y + 'px');
  });
});

// ==================== SCROLL TO SECTION ====================
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ==================== LOGIN MODAL ====================
function openLogin() {
  document.getElementById('loginModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLogin() {
  document.getElementById('loginModal').classList.remove('open');
  document.body.style.overflow = '';
}

function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user && pass) {
    // Simulate login
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = '登录中...';
    btn.disabled = true;

    setTimeout(() => {
      alert(`欢迎, ${user}! 登录功能为演示模式。`);
      btn.textContent = '登 录';
      btn.disabled = false;
      closeLogin();
    }, 1200);
  }
}

// Close login on overlay click
document.getElementById('loginModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeLogin();
});

// ==================== PRODUCT CATALOG ====================
let currentFilter = 'all';
let currentSearch = '';

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  let filtered = PRODUCTS.filter(p => {
    const matchFilter = currentFilter === 'all' || p.category === currentFilter;
    const matchSearch = !currentSearch || p.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:4rem 1rem; color:var(--color-text-muted);">
        <div style="font-size:3rem; margin-bottom:1rem;">🔍</div>
        <p>没有找到匹配的产品</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card reveal" style="transition-delay:${i * 0.08}s;" onclick="openProductModal('${p.id}')">
      <div class="product-card__img">
        <span style="font-size:3.5rem;">${p.emoji}</span>
      </div>
      <div class="product-card__body">
        <span class="product-card__tag ${p.tagClass}">${p.categoryLabel}</span>
        <h3 class="product-card__title">${p.name}</h3>
        <div class="product-card__meta">
          <span class="product-card__stock">
            <span class="stock-dot stock-dot--${p.stock}"></span>
            ${p.stockLabel}
          </span>
          <span>${p.units}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Re-observe for scroll animation
  initRevealObserver();
}

function filterProducts(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

function searchProducts(query) {
  currentSearch = query;
  renderProducts();
}

// Initial render
renderProducts();

// ==================== PRODUCT DETAIL MODAL ====================
function openProductModal(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalSku').textContent = `SKU: ${product.sku}`;
  document.getElementById('modalDesc').textContent = product.desc;
  document.getElementById('modalCatalogDesc').textContent = product.catalogDesc;

  const tag = document.getElementById('modalTag');
  tag.textContent = product.categoryLabel;
  tag.className = `product-card__tag ${product.tagClass}`;

  const stock = document.getElementById('modalStock');
  stock.innerHTML = `<span class="stock-dot stock-dot--${product.stock}"></span> ${product.stockLabel}`;

  const img = document.getElementById('modalImg');
  img.innerHTML = `<span style="font-size:5rem;">${product.emoji}</span>`;

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('productModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeProductModal();
});

// ==================== SCROLL REVEAL ====================
function initRevealObserver() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  reveals.forEach(el => {
    if (!el.classList.contains('visible')) {
      revealObserver.observe(el);
    }
  });
}

initRevealObserver();

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLogin();
    closeProductModal();
  }
});

// ==================== RIPPLE EFFECT ON BUTTONS ====================
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// ==================== SMOOTH ANCHOR SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
