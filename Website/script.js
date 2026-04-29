const particlesRoot = document.querySelector(".background-particles");

if (particlesRoot) {
  function createParticle() {
    const particle = document.createElement("span");
    particle.className = "particle";
<<<<<<< HEAD

=======
>>>>>>> 44e3ce0 (dashboard)
    const size = Math.random() * 2.8 + 1;
    const startX = Math.random() * 100;
    const duration = Math.random() * 22 + 18;
    const delay = Math.random() * -25;
<<<<<<< HEAD

=======
>>>>>>> 44e3ce0 (dashboard)
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}%`;
    particle.style.bottom = "-10vh";
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = String(Math.random() * 0.8 + 0.1);
<<<<<<< HEAD

    particlesRoot.appendChild(particle);
  }

  for (let i = 0; i < 85; i += 1) {
    createParticle();
  }
=======
    particlesRoot.appendChild(particle);
  }

  for (let i = 0; i < 85; i += 1) createParticle();
>>>>>>> 44e3ce0 (dashboard)
}

const steps = Array.from(document.querySelectorAll(".timeline-step"));
const rail = document.querySelector(".timeline-rail");
const dot = document.getElementById("timelineDot");
const stepCurrent = document.getElementById("stepCurrent");
<<<<<<< HEAD

=======
>>>>>>> 44e3ce0 (dashboard)
let activeIndex = 0;
let scrollRaf = 0;

function positionDot() {
<<<<<<< HEAD
  if (!rail || !dot || !steps.length) {
    return;
  }
  const activeStep = steps[activeIndex];
  if (!activeStep) {
    return;
  }
  const railRect = rail.getBoundingClientRect();
  const stepRect = activeStep.getBoundingClientRect();
  const centerY = stepRect.top - railRect.top + stepRect.height / 2;
  dot.style.top = `${centerY}px`;
=======
  if (!rail || !dot || !steps.length) return;
  const activeStep = steps[activeIndex];
  if (!activeStep) return;
  const railRect = rail.getBoundingClientRect();
  const stepRect = activeStep.getBoundingClientRect();
  dot.style.top = `${stepRect.top - railRect.top + stepRect.height / 2}px`;
>>>>>>> 44e3ce0 (dashboard)
}

function getActiveIndexFromScroll() {
  const viewportCenter = window.innerHeight * 0.45;
  let bestIndex = 0;
  let bestDist = Infinity;
<<<<<<< HEAD

=======
>>>>>>> 44e3ce0 (dashboard)
  steps.forEach((step, i) => {
    const rect = step.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const dist = Math.abs(centerY - viewportCenter);
    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = i;
    }
  });
<<<<<<< HEAD

=======
>>>>>>> 44e3ce0 (dashboard)
  return bestIndex;
}

function updateTimeline(index) {
<<<<<<< HEAD
  if (index < 0 || index >= steps.length) {
    return;
  }

  const changed = index !== activeIndex;
  activeIndex = index;

=======
  if (index < 0 || index >= steps.length) return;
  const changed = index !== activeIndex;
  activeIndex = index;
>>>>>>> 44e3ce0 (dashboard)
  const activeStep = steps[activeIndex];
  if (stepCurrent && activeStep) {
    stepCurrent.textContent = activeStep.dataset.step;
    if (changed) {
      stepCurrent.classList.remove("is-tick");
<<<<<<< HEAD
      window.requestAnimationFrame(() => {
        stepCurrent.classList.add("is-tick");
      });
    }
  }

=======
      requestAnimationFrame(() => stepCurrent.classList.add("is-tick"));
    }
  }
>>>>>>> 44e3ce0 (dashboard)
  steps.forEach((step, i) => {
    step.classList.toggle("is-active", i === activeIndex);
    step.classList.toggle("is-passed", i < activeIndex);
  });
<<<<<<< HEAD

  positionDot();

  if (changed && dot) {
    dot.classList.remove("is-pulse");
    window.requestAnimationFrame(() => {
      dot.classList.add("is-pulse");
    });
=======
  positionDot();
  if (changed && dot) {
    dot.classList.remove("is-pulse");
    requestAnimationFrame(() => dot.classList.add("is-pulse"));
>>>>>>> 44e3ce0 (dashboard)
  }
}

function syncTimelineFromScroll() {
  const next = getActiveIndexFromScroll();
<<<<<<< HEAD
  if (next !== activeIndex) {
    updateTimeline(next);
  } else {
    positionDot();
  }
}

function scheduleSync() {
  if (scrollRaf) {
    cancelAnimationFrame(scrollRaf);
  }
=======
  if (next !== activeIndex) updateTimeline(next);
  else positionDot();
}

function scheduleSync() {
  if (scrollRaf) cancelAnimationFrame(scrollRaf);
>>>>>>> 44e3ce0 (dashboard)
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0;
    syncTimelineFromScroll();
  });
}

if (steps.length && rail && dot) {
  updateTimeline(0);
<<<<<<< HEAD

  window.addEventListener("scroll", scheduleSync, { passive: true });
  window.addEventListener("resize", () => {
    syncTimelineFromScroll();
  });

  window.requestAnimationFrame(() => {
    syncTimelineFromScroll();
  });
}


// ========== TESTIMONIALS MARQUEE ==========
const marqueeContainer = document.getElementById('marqueeContainer');
const marqueeTrack = document.getElementById('marqueeTrack');

if (marqueeContainer && marqueeTrack) {
  let position = 0;
  const speed = 0.6; // Adjust speed (lower = slower)
  let isPaused = false;
  let animationId;

  // Clone cards for seamless infinite loop
  const originalCards = Array.from(marqueeTrack.children);
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    marqueeTrack.appendChild(clone);
  });

  // Main animation loop
  function animateMarquee() {
    if (!isPaused) {
      position -= speed;
      
      // Get half width (original set length)
      const halfWidth = marqueeTrack.scrollWidth / 2;
      
      // Seamless reset when scrolled past original set
      if (Math.abs(position) >= halfWidth) {
        position = 0;
      }
      
      marqueeTrack.style.transform = `translateX(${position}px)`;
    }
    animationId = requestAnimationFrame(animateMarquee);
  }

  // Pause on hover, resume on leave
  marqueeContainer.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  marqueeContainer.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  // Touch support for mobile
  let touchStartX = 0;
  let touchScrollPos = 0;

  marqueeContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchScrollPos = position;
    isPaused = true;
  });

  marqueeContainer.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].clientX;
    const diff = touchX - touchStartX;
    position = touchScrollPos + diff;
    marqueeTrack.style.transform = `translateX(${position}px)`;
  });

  marqueeContainer.addEventListener('touchend', () => {
    isPaused = false;
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    position = position % (marqueeTrack.scrollWidth / 2);
    marqueeTrack.style.transform = `translateX(${position}px)`;
  });

  // Start animation
  animateMarquee();
}


// Contact Form Functionality
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('eventForm');
  const dateInput = document.getElementById('expectedDate');
  const calendarBtn = document.querySelector('.calendar-icon-btn');
  
  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-button');
    const originalHTML = submitBtn.innerHTML;
    
    // Loading state
    submitBtn.innerHTML = `Sending...`;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success state
      submitBtn.innerHTML = `Sent! ✓`;
      submitBtn.style.background = '#10b981';
      form.reset();
      
      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = '';
      }, 3000);
      
    } catch (error) {
      submitBtn.innerHTML = `Error - Try Again`;
      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }, 3000);
    }
  });
  
  // Calendar button click
  if (calendarBtn && dateInput) {
    calendarBtn.addEventListener('click', () => {
      // Toggle to date type to show native picker
      const currentType = dateInput.type;
      dateInput.type = 'date';
      dateInput.focus();
      if (dateInput.showPicker) dateInput.showPicker();
      
      // Revert to text after interaction
      dateInput.addEventListener('change', function revert() {
        dateInput.type = 'text';
        dateInput.removeEventListener('change', revert);
      }, { once: true });
      
      dateInput.addEventListener('blur', function revert() {
        dateInput.type = 'text';
        dateInput.removeEventListener('blur', revert);
      }, { once: true });
    });
  }
});


// ========== SERVICES SCROLL REVEAL ==========
document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
});


// ========== CATALOGUE ==========
document.addEventListener('DOMContentLoaded', () => {
  const catalogueData = [
    { id: 1, title: 'Quantum Core Processor', category: 'hardware', price: '$1,299', desc: 'Next-gen neural processing unit optimized for AI workloads.', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop' },
    { id: 2, title: 'AetherOS Platform', category: 'software', price: '$499/yr', desc: 'Decentralized operating environment with seamless cross-device sync.', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop' },
    { id: 3, title: 'Orbital Sync Module', category: 'hardware', price: '$899', desc: 'High-latency tolerant communication array for remote deployment.', img: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=500&auto=format&fit=crop' },
    { id: 4, title: 'Neural Analytics Suite', category: 'software', price: '$299/mo', desc: 'Real-time predictive modeling and data visualization engine.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop' },
    { id: 5, title: 'Stellar Cloud Hosting', category: 'services', price: 'Custom', desc: 'Enterprise-grade distributed infrastructure with 99.999% uptime.', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop' },
    { id: 6, title: 'Vanguard Security Protocol', category: 'services', price: '$750/yr', desc: 'Zero-trust architecture with AI-driven threat neutralization.', img: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=500&auto=format&fit=crop' }
  ];

  const grid = document.getElementById('catalogue-grid');
  const searchInput = document.getElementById('search-input');
  const chips = document.querySelectorAll('.chip');
  let activeCategory = 'all';

  function renderCards(data) {
    grid.innerHTML = '';
    if (data.length === 0) {
      grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:3rem;">No modules found matching your criteria.</p>`;
      return;
    }

    data.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.animationDelay = `${index * 0.08}s`;
      card.innerHTML = `
        <div class="card-image">
          <img src="${item.img}" alt="${item.title}">
          <span class="card-tag">${item.category}</span>
        </div>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
        <div class="card-footer">
          <span class="card-price">${item.price}</span>
          <button class="card-btn" data-id="${item.id}">Initialize</button>
        </div>
      `;
      grid.appendChild(card);
    });

    document.querySelectorAll('.card-btn').forEach(btn => {
      btn.addEventListener('click', e => showToast(`Module #${e.target.dataset.id} initialized.`));
    });
  }

  function filterData() {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = catalogueData.filter(item => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
    renderCards(filtered);
  }

  searchInput.addEventListener('input', filterData);
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category;
      filterData();
    });
  });

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed', bottom: '2rem', right: '2rem',
      background: 'rgba(12, 12, 18, 0.92)', backdropFilter: 'blur(12px)',
      border: '1px solid var(--accent-glow)', color: '#e0d5f5',
      padding: '1rem 1.5rem', borderRadius: '12px',
      fontFamily: 'var(--font-main)', fontSize: '0.9rem',
      boxShadow: '0 6px 24px rgba(106, 48, 147, 0.45)',
      transform: 'translateY(20px)', opacity: '0',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      zIndex: '1000'
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }

  renderCards(catalogueData);
});

// ========== SERVICES SECTION ==========

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  const featuredCard = document.querySelector('.service-card.featured');
  const allCards = document.querySelectorAll('.service-card');

  // Handle card hover effects
  allCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (featuredCard && card !== featuredCard) {
        // Temporarily remove featured effect from card 03 when hovering others
        featuredCard.style.transform = 'scale(1)';
        featuredCard.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.2)';
      }
    });

    card.addEventListener('mouseleave', () => {
      if (featuredCard) {
        // Restore featured effect
        featuredCard.style.transform = 'scale(1.05)';
        featuredCard.style.boxShadow = '0 0 40px rgba(168, 85, 247, 0.3), inset 0 0 40px rgba(168, 85, 247, 0.1)';
      }
    });
  });

  // Scroll animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards and features
  const cards = document.querySelectorAll('.service-card');
  const features = document.querySelectorAll('.wcu-item');

  [...cards, ...features].forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 0.1}s`;
    observer.observe(el);
  });
});


// CATALOGUE SECTION FUNCTIONALITY
document.addEventListener('DOMContentLoaded', () => {
  const pills = document.querySelectorAll('.pill');
  const track = document.getElementById('cardsTrack');
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  const cards = document.querySelectorAll('.project-card');

  // Filter Functionality
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.dataset.filter;

      cards.forEach(card => {
        const matches = filterValue === 'all' || card.dataset.category === filterValue;
        
        if (matches) {
          card.style.display = 'flex';
          card.style.animation = 'none';
          void card.offsetWidth; // Trigger reflow
          card.style.animation = 'fadeIn 0.45s cubic-bezier(0.25, 0.8, 0.25, 1) forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Carousel Navigation
  const scrollStep = 320;

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -scrollStep, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: scrollStep, behavior: 'smooth' });
  });

  // Arrow Visibility Logic
  const updateArrows = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const isStart = track.scrollLeft <= 5;
    const isEnd = track.scrollLeft >= maxScroll - 5;

    prevBtn.style.opacity = isStart ? '0.3' : '1';
    prevBtn.style.pointerEvents = isStart ? 'none' : 'auto';
    nextBtn.style.opacity = isEnd ? '0.3' : '1';
    nextBtn.style.pointerEvents = isEnd ? 'none' : 'auto';
  };

  track.addEventListener('scroll', updateArrows);
  window.addEventListener('resize', updateArrows);
  updateArrows();

  // Inject keyframes for fade animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
});
=======
  window.addEventListener("scroll", scheduleSync, { passive: true });
  window.addEventListener("resize", syncTimelineFromScroll);
  requestAnimationFrame(syncTimelineFromScroll);
}

const marqueeContainer = document.getElementById("marqueeContainer");
const marqueeTrack = document.getElementById("marqueeTrack");
if (marqueeContainer && marqueeTrack) {
  let position = 0;
  const speed = 0.6;
  let isPaused = false;
  const originalCards = Array.from(marqueeTrack.children);
  originalCards.forEach((card) => marqueeTrack.appendChild(card.cloneNode(true)));

  function animateMarquee() {
    if (!isPaused) {
      position -= speed;
      const halfWidth = marqueeTrack.scrollWidth / 2;
      if (Math.abs(position) >= halfWidth) position = 0;
      marqueeTrack.style.transform = `translateX(${position}px)`;
    }
    requestAnimationFrame(animateMarquee);
  }
  marqueeContainer.addEventListener("mouseenter", () => (isPaused = true));
  marqueeContainer.addEventListener("mouseleave", () => (isPaused = false));
  marqueeContainer.addEventListener("touchstart", () => (isPaused = true));
  marqueeContainer.addEventListener("touchend", () => (isPaused = false));
  window.addEventListener("resize", () => {
    position = position % (marqueeTrack.scrollWidth / 2);
    marqueeTrack.style.transform = `translateX(${position}px)`;
  });
  animateMarquee();
}

const DASHBOARD_KEY = "oh_website_config";
const CONTACT_KEY = "oh_contact_responses";

function readDashboardConfig() {
  try {
    const raw = localStorage.getItem(DASHBOARD_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function applyMaintenanceMode(config) {
  const maintenance = config.maintenance;
  if (!maintenance || !maintenance.enabled) return;
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "9999";
  overlay.style.display = "grid";
  overlay.style.placeItems = "center";
  overlay.style.padding = "2rem";
  overlay.style.background = "rgba(3,4,8,0.94)";
  overlay.innerHTML = `<div style="max-width:640px;text-align:center;border:1px solid rgba(255,255,255,.2);padding:2rem;border-radius:16px;background:#090b12;color:#fff"><h1 style="margin:0 0 .75rem">Website Maintenance</h1><p style="margin:0;color:#c7cedf">${maintenance.message || "We will be back shortly."}</p></div>`;
  document.body.appendChild(overlay);
}

function applyHolidayTheme(config) {
  const theme = config.theme;
  if (!theme) return;
  document.documentElement.style.setProperty("--accent", theme.accent || "#22c55e");
  document.documentElement.style.setProperty("--bg", theme.bg || "#0a0a0a");
  document.documentElement.style.setProperty("--text", theme.text || "#ffffff");
}

function injectFeaturedEvents(config) {
  const featured = Array.isArray(config.featuredEvents) ? config.featuredEvents : [];
  if (!featured.length || document.getElementById("featured-events")) return;
  const section = document.createElement("section");
  section.className = "content-section";
  section.id = "featured-events";
  section.innerHTML = `<h2>Featured Past Events</h2><div style="display:grid;gap:14px;margin-top:18px">${featured
    .map(
      (event) => `<article style="text-align:left;border:1px solid var(--border);border-radius:14px;padding:16px;background:rgba(18,18,18,.65)"><h3 style="margin:0">${event.title}</h3><p style="margin:8px 0 0;color:var(--muted)">${event.date || ""} - ${event.description || ""}</p></article>`
    )
    .join("")}</div>`;
  const testimonials = document.getElementById("testimonials");
  if (testimonials?.parentNode) testimonials.parentNode.insertBefore(section, testimonials);
}

function wireContactCapture() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    payload.createdAt = new Date().toLocaleString();
    let all;
    try {
      const raw = localStorage.getItem(CONTACT_KEY);
      all = raw ? JSON.parse(raw) : [];
    } catch {
      all = [];
    }
    all.unshift(payload);
    localStorage.setItem(CONTACT_KEY, JSON.stringify(all));
    const btn = form.querySelector(".submit-btn");
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = "Inquiry Sent";
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      form.reset();
    }, 1400);
  });
}

const config = readDashboardConfig();
applyHolidayTheme(config);
applyMaintenanceMode(config);
injectFeaturedEvents(config);
wireContactCapture();
>>>>>>> 44e3ce0 (dashboard)
