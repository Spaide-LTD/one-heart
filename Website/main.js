// ============================================
// ONE HEART EVENTS - MAIN JAVASCRIPT
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // ===== PARTICLES =====
  createParticles();

  // ===== NAVBAR SCROLL =====
  const navbar = document.querySelector(".navbar");

  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // ===== MOBILE MENU =====
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("active"));
  }

  // ===== THEME SWITCHER =====
  const themeToggle = document.querySelector(".theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // ===== CHATBOT =====
  initChatbot();

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetSelector = this.getAttribute("href");
      if (!targetSelector || targetSelector === "#") return;

      const target = document.querySelector(targetSelector);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
});

// ===== CREATE PARTICLES =====
function createParticles() {
  const container = document.querySelector(".particles-container");
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    const size = Math.random() * 80 + 20;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particle.style.animationDuration = `${Math.random() * 20 + 15}s`;

    container.appendChild(particle);
  }
}

// ===== CHATBOT =====
function initChatbot() {
  const chatbotBtn = document.querySelector(".chatbot-btn");
  const chatbotWindow = document.querySelector(".chatbot-window");
  const chatbotClose = document.querySelector(".chatbot-close");
  const messagesContainer = document.querySelector(".chatbot-messages");
  const chatbotInputArea = document.querySelector(".chatbot-input");

  if (!chatbotBtn || !chatbotWindow || !messagesContainer) return;

  if (chatbotInputArea) {
    chatbotInputArea.style.display = "none";
  }

  const inquiry = {
    eventType: "",
    eventDate: "",
    location: "",
    budget: "",
    services: "",
    message: ""
  };

  const inquiryFlow = [
    {
      key: "eventType",
      question: "What type of event are you planning?",
      options: ["Wedding", "Birthday", "Corporate Event", "Conference", "Product Launch", "Private Celebration", "Other"]
    },
    {
      key: "eventDate",
      question: "When is the event?",
      options: ["This month", "Next month", "In 2-3 months", "Later this year", "Not sure yet"]
    },
    {
      key: "location",
      question: "Where will the event be held?",
      options: ["Riyadh", "Jeddah", "Dammam", "Elsewhere in Saudi Arabia", "Not sure yet"]
    },
    {
      key: "budget",
      question: "What budget range are you considering?",
      options: ["Small budget", "Medium budget", "Premium event", "Not sure yet"]
    },
    {
      key: "services",
      question: "What do you need help with?",
      options: ["Full Event Planning", "Decor", "Venue Setup", "Corporate Setup", "Entertainment", "Photography", "Everything"]
    }
  ];

  chatbotBtn.addEventListener("click", () => {
    chatbotWindow.classList.toggle("active");

    if (!messagesContainer.dataset.started) {
      messagesContainer.dataset.started = "true";
      showWelcome();
    }
  });

  if (chatbotClose) {
    chatbotClose.addEventListener("click", () => {
      chatbotWindow.classList.remove("active");
    });
  }

  function clearMessages() {
    messagesContainer.innerHTML = "";
  }

  function addMessage(text, isUser = false) {
    const msg = document.createElement("div");
    msg.className = `message ${isUser ? "user" : "bot"}`;
    msg.textContent = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function addOptions(options) {
    const wrapper = document.createElement("div");
    wrapper.className = "chatbot-options";

    options.forEach(option => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chatbot-option";
      btn.textContent = option.label;

      btn.addEventListener("click", () => {
        addMessage(option.label, true);
        wrapper.remove();
        option.action();
      });

      wrapper.appendChild(btn);
    });

    messagesContainer.appendChild(wrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showWelcome() {
    clearMessages();

    addMessage("👋 Welcome to One Heart Events. What would you like help with?");

    addOptions([
      { label: "Book an Event", action: () => startInquiry() },
      { label: "Get a Quote", action: () => startInquiry() },
      { label: "View FAQs", action: () => showFAQMenu() },
      { label: "Contact the Team", action: () => goToContact() }
    ]);
  }

  function startInquiry(stepIndex = 0) {
    const step = inquiryFlow[stepIndex];

    if (!step) {
      finishInquiry();
      return;
    }

    addMessage(step.question);

    const options = step.options.map(value => ({
      label: value,
      action: () => {
        inquiry[step.key] = value;
        startInquiry(stepIndex + 1);
      }
    }));

    options.push({
      label: "Start Over",
      action: () => {
        resetInquiry();
        showWelcome();
      }
    });

    addOptions(options);
  }

  function showFAQMenu() {
    addMessage("Choose a question:");

    addOptions([
      {
        label: "What services do you offer?",
        action: () => showFAQAnswer(
          "We offer event planning, corporate events, birthdays, conferences, product launches, weddings, private celebrations, decor, and full event management."
        )
      },
      {
        label: "Where are you located?",
        action: () => showFAQAnswer(
          "We are based in Riyadh, Saudi Arabia, and serve events across the Kingdom and beyond."
        )
      },
      {
        label: "How do I get a quote?",
        action: () => startInquiry()
      },
      {
        label: "Do you handle weddings?",
        action: () => showFAQAnswer(
          "Yes, we handle wedding planning, decor, coordination, and full event management."
        )
      },
      {
        label: "Do you handle corporate events?",
        action: () => showFAQAnswer(
          "Yes, we support corporate events, conferences, product launches, and formal gatherings."
        )
      },
      {
        label: "Back",
        action: showWelcome
      }
    ]);
  }

  function showFAQAnswer(answer) {
    addMessage(answer);

    addOptions([
      { label: "Ask another FAQ", action: showFAQMenu },
      { label: "Get a Quote", action: () => startInquiry() },
      { label: "Contact the Team", action: () => goToContact() },
      { label: "Start Over", action: showWelcome }
    ]);
  }

  function finishInquiry() {
    const summary = `Website guided inquiry:

Event Type: ${inquiry.eventType || "Not provided"}
Event Date: ${inquiry.eventDate || "Not provided"}
Location: ${inquiry.location || "Not provided"}
Budget: ${inquiry.budget || "Not provided"}
Services Needed: ${inquiry.services || "Not provided"}

Extra Details:
Guided inquiry submitted from website chatbot.`;

    addMessage("Great. I’ve prepared your inquiry for the team.");

    addOptions([
      {
        label: "Continue to Contact Form",
        action: () => {
          prefillContactForm(summary);
          scrollToContact();
          chatbotWindow.classList.remove("active");
          resetInquiry();
        }
      },
      {
        label: "Start Over",
        action: () => {
          resetInquiry();
          showWelcome();
        }
      }
    ]);
  }

  function goToContact() {
    addMessage("Sure — I’ll take you to the contact form.");

    setTimeout(() => {
      scrollToContact();
      chatbotWindow.classList.remove("active");
    }, 500);
  }

  function resetInquiry() {
    Object.keys(inquiry).forEach(key => {
      inquiry[key] = "";
    });
  }

  function prefillContactForm(message) {
    const messageField =
      document.querySelector("#message") ||
      document.querySelector("textarea[name='message']") ||
      document.querySelector("textarea");

    if (messageField) {
      messageField.value = message;
      messageField.dispatchEvent(new Event("input", { bubbles: true }));
      messageField.dispatchEvent(new Event("change", { bubbles: true }));
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
          addMessage(
            "We offer event planning, corporate events, birthday parties, conferences, product launches, weddings, private celebrations, and full event management."
          );

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

    if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("hey")
    ) {
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
    if (e.key === "Enter") {
      sendMessage();
    }
  });
}
