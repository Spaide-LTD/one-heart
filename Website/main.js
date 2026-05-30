

// ============================================
// ONE HEART EVENTS - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== PARTICLES =====
  createParticles();
  
  // ===== NAVBAR SCROLL =====
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // ===== MOBILE MENU =====
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });
  
  reveals.forEach(el => revealObserver.observe(el));
  
  // ===== THEME SWITCHER =====
  const themeToggle = document.querySelector('.theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
  
  // ===== CHATBOT =====
  initChatbot();
  
  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// ===== CREATE PARTICLES =====
function createParticles() {
  const container = document.querySelector('.particles-container');
  if (!container) return;
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 80 + 20;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
    container.appendChild(particle);
  }
}

// ===== CHATBOT =====
function initChatbot() {
  const chatbotBtn = document.querySelector('.chatbot-btn');
  const chatbotWindow = document.querySelector('.chatbot-window');
  const chatbotClose = document.querySelector('.chatbot-close');
  const chatbotInput = document.querySelector('.chatbot-input input');
  const chatbotSend = document.querySelector('.chatbot-input button');
  const messagesContainer = document.querySelector('.chatbot-messages');
  
  if (!chatbotBtn) return;

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatBotMessage(text) {
    const safeText = escapeHtml(text);
    return safeText.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
      (email) => `<a href="mailto:${email}">${email}</a>`
    );
  }
  
  chatbotBtn.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
  });
  
  chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
  });
  
  function addMessage(text, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `message ${isUser ? 'user' : 'bot'}`;
    if (isUser) {
      msg.textContent = text;
    } else {
      msg.innerHTML = formatBotMessage(text);
    }
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function getBotResponse(input) {
    const lower = input.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi')) {
      return "Hello! Welcome to One Heart Events. How can I help you plan your perfect event today?";
    } else if (lower.includes('service') || lower.includes('offer')) {
      return "We offer Wedding Planning, Corporate Events, Birthday Parties, Conferences, Product Launches, and Private Celebrations. Which one interests you?";
    } else if (lower.includes('price') || lower.includes('cost')) {
      return "Our pricing varies based on the event type and scale. Please visit our Contact page or call us at +966 50 123 4567 for a custom quote!";
    } else if (lower.includes('contact') || lower.includes('book')) {
      return "You can reach us via WhatsApp, email at info@oneheartevents.com, or through our Contact page. We'd love to hear from you!";
    } else if (lower.includes('location') || lower.includes('where')) {
      return "We're based in Riyadh, Saudi Arabia, and we serve events across the Kingdom and beyond!";
    } else {
      return "Thank you for your message! Our team will get back to you shortly. Is there anything specific about event planning you'd like to know?";
    }
  }
  
  function sendMessage() {
    const text = chatbotInput.value.trim();
    if (!text) return;
    addMessage(text, true);
    chatbotInput.value = '';
    
    setTimeout(() => {
      addMessage(getBotResponse(text));
    }, 800);
  }
  
  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  // Initial message
  setTimeout(() => {
    addMessage("👋 Hi there! I'm your One Heart assistant. How can I help you today?");
  }, 1000);
}
