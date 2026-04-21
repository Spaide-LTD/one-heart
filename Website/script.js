const particlesRoot = document.querySelector(".background-particles");

if (particlesRoot) {
  function createParticle() {
    const particle = document.createElement("span");
    particle.className = "particle";

    const size = Math.random() * 2.8 + 1;
    const startX = Math.random() * 100;
    const duration = Math.random() * 22 + 18;
    const delay = Math.random() * -25;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}%`;
    particle.style.bottom = "-10vh";
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = String(Math.random() * 0.8 + 0.1);

    particlesRoot.appendChild(particle);
  }

  for (let i = 0; i < 85; i += 1) {
    createParticle();
  }
}

const steps = Array.from(document.querySelectorAll(".timeline-step"));
const rail = document.querySelector(".timeline-rail");
const dot = document.getElementById("timelineDot");
const stepCurrent = document.getElementById("stepCurrent");

let activeIndex = 0;
let scrollRaf = 0;

function positionDot() {
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
}

function getActiveIndexFromScroll() {
  const viewportCenter = window.innerHeight * 0.45;
  let bestIndex = 0;
  let bestDist = Infinity;

  steps.forEach((step, i) => {
    const rect = step.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const dist = Math.abs(centerY - viewportCenter);
    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = i;
    }
  });

  return bestIndex;
}

function updateTimeline(index) {
  if (index < 0 || index >= steps.length) {
    return;
  }

  const changed = index !== activeIndex;
  activeIndex = index;

  const activeStep = steps[activeIndex];
  if (stepCurrent && activeStep) {
    stepCurrent.textContent = activeStep.dataset.step;
    if (changed) {
      stepCurrent.classList.remove("is-tick");
      window.requestAnimationFrame(() => {
        stepCurrent.classList.add("is-tick");
      });
    }
  }

  steps.forEach((step, i) => {
    step.classList.toggle("is-active", i === activeIndex);
    step.classList.toggle("is-passed", i < activeIndex);
  });

  positionDot();

  if (changed && dot) {
    dot.classList.remove("is-pulse");
    window.requestAnimationFrame(() => {
      dot.classList.add("is-pulse");
    });
  }
}

function syncTimelineFromScroll() {
  const next = getActiveIndexFromScroll();
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
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0;
    syncTimelineFromScroll();
  });
}

if (steps.length && rail && dot) {
  updateTimeline(0);

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

// ========== CONTACT FORM HANDLING ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('.submit-btn');
    const originalHTML = btn.innerHTML;
    
    // Loading state
    btn.innerHTML = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    
    // Simulate submission
    setTimeout(() => {
      btn.innerHTML = '✓ Inquiry Sent!';
      btn.style.background = 'var(--accent)';
      btn.style.color = '#000';
      
      // Reset form
      this.reset();
      
      // Reset button after delay
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.background = '';
        btn.style.color = '';
      }, 3000);
    }, 1500);
  });

  // Subtle focus lift effect
  const inputs = contactForm.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'translateY(-2px)';
    });
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = 'translateY(0)';
    });
  });
}