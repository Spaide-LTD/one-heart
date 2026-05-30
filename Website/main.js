
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
function initChatbot() {
  const chatbotBtn = document.querySelector(".chatbot-btn");
  const chatbotWindow = document.querySelector(".chatbot-window");
  const chatbotClose = document.querySelector(".chatbot-close");
  const chatbotInput = document.querySelector(".chatbot-input input");
  const chatbotSend = document.querySelector(".chatbot-input button");
  const messagesContainer = document.querySelector(".chatbot-messages");

  if (!chatbotBtn || !chatbotWindow || !chatbotInput || !chatbotSend || !messagesContainer) return;

  const inquiry = {
    eventType: "",
    eventDate: "",
    budget: "",
    location: "",
    services: "",
    message: ""
  };

  let inquiryMode = false;
  let inquiryStep = 0;

  const steps = [
    {
      key: "eventType",
      question: "What type of event are you planning? For example: wedding, birthday, corporate event, conference, or private celebration."
    },
    {
      key: "eventDate",
      question: "Nice. What date are you planning the event for?"
    },
    {
      key: "location",
      question: "Where will the event be held?"
    },
    {
      key: "budget",
      question: "Do you have a budget range in mind?"
    },
    {
      key: "services",
      question: "What services do you need? For example: planning, decor, catering, photography, venue setup, entertainment, or full event management."
    },
    {
      key: "message",
      question: "Perfect. Add any extra details you'd like the team to know."
    }
  ];

  chatbotBtn.addEventListener("click", () => {
    chatbotWindow.classList.toggle("active");
  });

  if (chatbotClose) {
    chatbotClose.addEventListener("click", () => {
      chatbotWindow.classList.remove("active");
    });
  }

  function addMessage(text, isUser = false) {
    const msg = document.createElement("div");
    msg.className = `message ${isUser ? "user" : "bot"}`;
    msg.textContent = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function addOptions(options = []) {
    const wrapper = document.createElement("div");
    wrapper.className = "chatbot-options";

    options.forEach(option => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chatbot-option";
      btn.textContent = option.label;

      btn.addEventListener("click", () => {
        addMessage(option.label, true);
        option.action();
        wrapper.remove();
      });

      wrapper.appendChild(btn);
    });

    messagesContainer.appendChild(wrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function botReply(text, delay = 500) {
    setTimeout(() => addMessage(text, false), delay);
  }

  function startInquiry() {
    inquiryMode = true;
    inquiryStep = 0;

    botReply("Great — I’ll collect a few details and then send you to the contact form so the team can follow up properly.");
    setTimeout(() => {
      addMessage(steps[inquiryStep].question);
    }, 1000);
  }

  function completeInquiry() {
    inquiryMode = false;

    const compiledMessage =
`Website chatbot inquiry:

Event Type: ${inquiry.eventType || "Not provided"}
Event Date: ${inquiry.eventDate || "Not provided"}
Location: ${inquiry.location || "Not provided"}
Budget: ${inquiry.budget || "Not provided"}
Services Needed: ${inquiry.services || "Not provided"}

Extra Details:
${inquiry.message || "Not provided"}`;

    botReply("Perfect. I’ll take you to the contact form and prefill your inquiry so the team can respond properly.");

    setTimeout(() => {
      prefillContactForm(compiledMessage);
      scrollToContact();
      chatbotWindow.classList.remove("active");
    }, 1200);
  }

  function handleInquiryAnswer(text) {
    const currentStep = steps[inquiryStep];
    inquiry[currentStep.key] = text;

    inquiryStep++;

    if (inquiryStep >= steps.length) {
      completeInquiry();
      return;
    }

    botReply(steps[inquiryStep].question);
  }

  function prefillContactForm(message) {
    const messageFields = [
      document.querySelector("#message"),
      document.querySelector("textarea[name='message']"),
      document.querySelector("textarea")
    ];

    const messageField = messageFields.find(Boolean);

    if (messageField) {
      messageField.value = message;
      messageField.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function scrollToContact() {
    const contactSection =
      document.querySelector("#contact") ||
      document.querySelector(".contact-section") ||
      document.querySelector("form");

    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  function showMainOptions() {
    addOptions([
      {
        label: "Book an Event",
        action: startInquiry
      },
      {
        label: "View Services",
        action: () => {
          addMessage("We offer event planning, corporate events, birthday parties, conferences, product launches, weddings, private celebrations, and full event management.");
          setTimeout(showMainOptions, 700);
        }
      },
      {
        label: "Get a Quote",
        action: startInquiry
      },
      {
        label: "Contact the Team",
        action: () => {
          addMessage("Sure — I’ll take you to the contact form.");
          setTimeout(() => {
            scrollToContact();
            chatbotWindow.classList.remove("active");
          }, 700);
        }
      }
    ]);
  }

  function getBotResponse(input) {
    const lower = input.toLowerCase();

    if (
      lower.includes("book") ||
      lower.includes("quote") ||
      lower.includes("price") ||
      lower.includes("cost") ||
      lower.includes("budget") ||
      lower.includes("contact") ||
      lower.includes("human") ||
      lower.includes("team")
    ) {
      startInquiry();
      return null;
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Hello! Welcome to One Heart Events. I can help with services, quotes, bookings, or connect you to the team.";
    }

    if (lower.includes("service") || lower.includes("offer")) {
      return "We offer weddings, corporate events, birthdays, conferences, product launches, private celebrations, decor, planning, and full event management.";
    }

    if (lower.includes("location") || lower.includes("where")) {
      return "We’re based in Riyadh, Saudi Arabia, and serve events across the Kingdom and beyond.";
    }

    if (lower.includes("wedding")) {
      return "Yes, we handle wedding planning, decor, coordination, and full event management. Would you like me to help you send an inquiry?";
    }

    if (lower.includes("birthday")) {
      return "Yes, we plan birthday celebrations of different sizes. I can help you prepare an inquiry for the team.";
    }

    if (lower.includes("corporate") || lower.includes("conference")) {
      return "Yes, we support corporate events, conferences, launches, and formal gatherings. I can help you send the details to the team.";
    }

    return "I can help with event services, bookings, quotes, and general questions. For custom requests, I can guide you to the contact form.";
  }

  function sendMessage() {
    const text = chatbotInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    chatbotInput.value = "";

    if (inquiryMode) {
      handleInquiryAnswer(text);
      return;
    }

    const response = getBotResponse(text);

    if (response) {
      botReply(response);
      setTimeout(showMainOptions, 900);
    }
  }

  chatbotSend.addEventListener("click", sendMessage);

  chatbotInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  setTimeout(() => {
    addMessage("👋 Hi there! I’m your One Heart assistant. I can help you find services, request a quote, or send an inquiry to the team.");
    showMainOptions();
  }, 700);
}
}
