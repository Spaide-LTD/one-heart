// WhatsApp Chat Dashboard

(async () => {
  const isAuthenticated = await requireAuth();
  if (!isAuthenticated) return;
  console.log("User is authenticated:", getCurrentUser()?.email);
})();

const MESSAGES_TABLE = "Messages";
const CONVERSATIONS_TABLE = "conversations";
const WHATSAPP_WEBHOOK_URL = "https://primary-production-ddbcd.up.railway.app/webhook/Spaide-WhatsApp";

const chatList = document.getElementById("chatList");
const chatBody = document.getElementById("chatBody");
const chatContactName = document.getElementById("chatContactName");
const chatAvatar = document.getElementById("chatAvatar");
const chatStatus = document.getElementById("chatStatus");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const searchInput = document.getElementById("searchInput");
const agentTypeDisplay = document.getElementById("agentTypeDisplay");
const responseTime = document.getElementById("responseTime");
const agentToggle = document.getElementById("agentToggle");
const aiAssistBtn = document.getElementById("aiAssistBtn");
const humanTransferBtn = document.getElementById("humanTransferBtn");

let currentPhone = null;
let currentClient = null;
let currentOwner = "AI_ACTIVE";
let allContacts = [];
let currentMessages = [];

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

function getInitials(nameOrPhone) {
  return String(nameOrPhone || "?")
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getMessageText(msg) {
  return msg.message_text || msg.message || msg.text || msg.body || "";
}

function getSenderMeta(senderType) {
  if (senderType === "client") {
    return { label: "Client", className: "client", direction: "incoming" };
  }

  if (senderType === "ai") {
    return { label: "AI Assistant", className: "ai", direction: "outgoing" };
  }

  if (senderType === "system") {
    return { label: "System", className: "ai", direction: "outgoing" };
  }

  return { label: "Human Agent", className: "human", direction: "outgoing" };
}

function getOwnerMeta(owner) {
  if (owner === "WAITING_HUMAN") {
    return {
      label: "Needs Human",
      statusText: "AI requested human help",
      tagClass: "waiting",
      badge: "!"
    };
  }

  if (owner === "HUMAN_ACTIVE") {
    return {
      label: "Human Agent",
      statusText: "Human is handling this chat",
      tagClass: "human",
      badge: "H"
    };
  }

  return {
    label: "AI Assistant",
    statusText: "AI is handling this chat",
    tagClass: "ai",
    badge: "AI"
  };
}

function canHumanReply() {
  return currentOwner === "WAITING_HUMAN" || currentOwner === "HUMAN_ACTIVE";
}

async function getConversation(phoneNumber) {
  if (!window.supabaseClient || !phoneNumber) return null;

  const { data, error } = await window.supabaseClient
    .from(CONVERSATIONS_TABLE)
    .select("*")
    .eq("phone_number", phoneNumber)
    .maybeSingle();

  if (error) {
    console.error("Get conversation failed:", error);
    return null;
  }

  return data;
}

async function upsertConversation(phoneNumber, clientName, owner = "AI_ACTIVE") {
  if (!window.supabaseClient || !phoneNumber) return null;

  const now = new Date().toISOString();

  const { data, error } = await window.supabaseClient
    .from(CONVERSATIONS_TABLE)
    .upsert({
      phone_number: phoneNumber,
      client_name: clientName || phoneNumber,
      chat_owner: owner,
      status: "active",
      updated_at: now,
      last_message_at: now
    }, {
      onConflict: "phone_number"
    })
    .select()
    .single();

  if (error) {
    console.error("Upsert conversation failed:", error.message, error.details, error.hint, error);
    return null;
  }

  return data;
}

async function updateConversationOwner(phoneNumber, owner) {
  if (!window.supabaseClient || !phoneNumber) return;

  const { error } = await window.supabaseClient
    .from(CONVERSATIONS_TABLE)
    .update({
      chat_owner: owner,
      updated_at: new Date().toISOString()
    })
    .eq("phone_number", phoneNumber);

  if (error) {
    console.error("Update conversation owner failed:", error);
  }
}

async function updateConversationMeta(phoneNumber, clientName) {
  if (!window.supabaseClient || !phoneNumber) return;

  const now = new Date().toISOString();

  const { error } = await window.supabaseClient
    .from(CONVERSATIONS_TABLE)
    .upsert({
      phone_number: phoneNumber,
      client_name: clientName || phoneNumber,
      status: "active",
      updated_at: now,
      last_message_at: now
    }, {
      onConflict: "phone_number"
    });

  if (error) {
    console.error("Update conversation meta failed:", error.message, error.details, error.hint, error);
  }
}

function updateOwnershipUI() {
  const state = getOwnerMeta(currentOwner);

  if (agentTypeDisplay) {
    agentTypeDisplay.innerHTML = `Currently chatting with: <strong>${state.label}</strong>`;
  }

  if (chatStatus) {
    chatStatus.innerHTML = `
      <span class="online-dot"></span>
      <span>${state.statusText}</span>
    `;
  }

  if (responseTime) {
    responseTime.textContent =
      currentOwner === "AI_ACTIVE"
        ? "AI replying"
        : currentOwner === "WAITING_HUMAN"
          ? "Human help needed"
          : "Human replying now";
  }

  document.querySelectorAll(".toggle-option").forEach(btn => {
    const isAI = btn.dataset.agent === "ai";
    const isHuman = btn.dataset.agent === "human";

    btn.classList.toggle(
      "active",
      (currentOwner === "AI_ACTIVE" && isAI) ||
      (currentOwner !== "AI_ACTIVE" && isHuman)
    );

    btn.disabled = true;
    btn.style.cursor = "not-allowed";
  });

  if (aiAssistBtn) {
    aiAssistBtn.classList.toggle("active", currentOwner === "AI_ACTIVE");
    aiAssistBtn.disabled = true;
    aiAssistBtn.title = "AI switching is automatic";
  }

 if (humanTransferBtn) {
    if (currentOwner === "HUMAN_ACTIVE") {
        humanTransferBtn.style.display = "flex";
        humanTransferBtn.disabled = false;
    } else {
        humanTransferBtn.style.display = "none";
    }
}

  const enabled = Boolean(currentPhone) && canHumanReply();

  if (messageInput) {
    messageInput.disabled = !enabled;
    messageInput.placeholder = enabled
      ? currentOwner === "WAITING_HUMAN"
        ? "Type to accept handoff and reply..."
        : "Type a message..."
      : "AI is currently handling this chat...";
  }

  if (sendBtn) {
    sendBtn.disabled = !enabled;
  }
}

async function insertMessage(senderType, text) {
  if (!window.supabaseClient || !currentPhone || !currentClient) return false;

  const payload = {
    phone_number: currentPhone,
    client_name: currentClient,
    message_text: text,
    status: "read",
    sender_type: senderType,
    created_at: new Date().toISOString()
  };

  const { error } = await window.supabaseClient
    .from(MESSAGES_TABLE)
    .insert(payload);

  if (error) {
    console.error("Insert message failed:", error);
    return false;
  }

  return true;
}

async function notifyWhatsApp(text, senderType = "admin") {
  try {
    await fetch(WHATSAPP_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        phone_number: currentPhone,
        client_name: currentClient,
        message_text: text,
        sender_type: senderType
      })
    });
  } catch (err) {
    console.warn("WhatsApp webhook failed:", err);
  }
}

async function humanResign() {
  if (!currentPhone || currentOwner !== "HUMAN_ACTIVE") return;

  const goodbye =
    "Thanks for chatting with us. I’ll hand you back to our assistant now in case you need anything else.";

  await insertMessage("system", goodbye);
  await notifyWhatsApp(goodbye, "system");

  currentOwner = "AI_ACTIVE";
  await updateConversationOwner(currentPhone, "AI_ACTIVE");

  await loadMessages(currentPhone);
  await loadContacts();
  updateOwnershipUI();
}

async function loadContacts() {
  if (!window.supabaseClient) return;

  const { data: messages, error: messagesError } = await window.supabaseClient
    .from(MESSAGES_TABLE)
    .select("phone_number, client_name, message_text, created_at, status, sender_type")
    .not("phone_number", "is", null)
    .order("created_at", { ascending: false });

  if (messagesError) {
    console.error("Load contacts messages failed:", messagesError);
    return;
  }

  const { data: conversations, error: convError } = await window.supabaseClient
    .from(CONVERSATIONS_TABLE)
    .select("phone_number, client_name, chat_owner");

  if (convError) {
    console.error("Load conversations failed:", convError);
    return;
  }

  const conversationMap = {};
  (conversations || []).forEach(c => {
    conversationMap[c.phone_number] = c;
  });

  const grouped = {};

  (messages || []).forEach(msg => {
    if (!msg.phone_number) return;

    if (!grouped[msg.phone_number]) {
      const conv = conversationMap[msg.phone_number];

      grouped[msg.phone_number] = {
        ...msg,
        client_name: conv?.client_name || msg.client_name || msg.phone_number,
        chat_owner: conv?.chat_owner || "AI_ACTIVE",
        unread_count: 0
      };
    }

    if (msg.status === "unread" && msg.sender_type === "client") {
      grouped[msg.phone_number].unread_count += 1;
    }
  });

  allContacts = Object.values(grouped);
  renderContacts(allContacts);
}

function renderContacts(contacts) {
  if (!contacts || !contacts.length) {
    chatList.innerHTML = `
      <div style="padding:20px;color:var(--text-muted);">
        No chats yet
      </div>
    `;
    return;
  }

  chatList.innerHTML = contacts.map(c => {
    const displayName = c.client_name || c.phone_number;
    const initials = getInitials(displayName);
    const isActive = c.phone_number === currentPhone ? "active" : "";
    const owner = c.chat_owner || "AI_ACTIVE";
    const state = getOwnerMeta(owner);

    const unreadBadge = c.unread_count > 0
      ? `<span class="unread-badge">${c.unread_count}</span>`
      : "";

    return `
      <div class="contact-item ${isActive}" onclick="selectContact('${escapeHtml(c.phone_number)}', '${escapeHtml(displayName)}')">
        <div class="contact-avatar">
          ${initials}
          <span class="agent-badge ${state.tagClass}">
            ${state.badge}
          </span>
        </div>

        <div class="contact-info">
          <div class="contact-top">
            <div class="contact-name">${escapeHtml(displayName)}</div>
            <div class="contact-time">${formatTime(c.created_at)}</div>
          </div>

          <div class="contact-preview">
            ${escapeHtml(getMessageText(c))}
          </div>

          <div class="contact-meta">
            <span class="agent-tag ${state.tagClass}">
              ${state.label}
            </span>
            ${unreadBadge}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

async function selectContact(phone, clientName) {
  currentPhone = phone;
  currentClient = clientName || phone;

  chatContactName.textContent = currentClient;
  chatAvatar.textContent = getInitials(currentClient);

  let conversation = await getConversation(phone);

  if (!conversation) {
    conversation = await upsertConversation(phone, currentClient, "AI_ACTIVE");
  }

  currentOwner = conversation?.chat_owner || "AI_ACTIVE";

  await loadMessages(phone);
  await markUnreadAsRead(phone);
  await loadContacts();

  updateOwnershipUI();
}

async function loadMessages(phoneNumber) {
  if (!window.supabaseClient || !phoneNumber) return;

  const { data, error } = await window.supabaseClient
    .from(MESSAGES_TABLE)
    .select("*")
    .eq("phone_number", phoneNumber)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Load messages failed:", error);
    return;
  }

  currentMessages = data || [];

  const conversation = await getConversation(phoneNumber);
  currentOwner = conversation?.chat_owner || currentOwner || "AI_ACTIVE";

  renderMessages(currentMessages);
  updateOwnershipUI();
}

async function markUnreadAsRead(phoneNumber) {
  if (!window.supabaseClient || !phoneNumber) return;

  const unread = currentMessages.filter(
    m => m.sender_type === "client" && m.status === "unread"
  );

  if (!unread.length) return;

  const { error } = await window.supabaseClient
    .from(MESSAGES_TABLE)
    .update({ status: "read" })
    .eq("phone_number", phoneNumber)
    .eq("sender_type", "client")
    .eq("status", "unread");

  if (error) {
    console.error("Mark read failed:", error);
  }
}

function renderMessages(messages) {
  if (!messages || !messages.length) {
    chatBody.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-comment-dots"></i>
        <p>No messages yet</p>
      </div>
    `;
    return;
  }

  let html = "";
  let lastDate = null;

  messages.forEach(msg => {
    const msgDate = new Date(msg.created_at).toDateString();

    if (msgDate !== lastDate) {
      html += `
        <div class="date-separator">
          <span>${formatDateLabel(msg.created_at)}</span>
        </div>
      `;
      lastDate = msgDate;
    }

    const meta = getSenderMeta(msg.sender_type);
    const text = escapeHtml(getMessageText(msg));

    html += `
      <div class="message-row ${meta.direction}">
        <div class="message-wrapper">
          <div class="message-sender">
            <span class="sender-badge ${meta.className}">
              ${meta.label}
            </span>
          </div>

          <div class="message-bubble">
            ${text}
          </div>

          <div class="message-time">
            ${formatTime(msg.created_at)}
          </div>
        </div>
      </div>
    `;
  });

  chatBody.innerHTML = html;
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function sendMessage() {
  const text = messageInput.value.trim();

  if (!text || !currentPhone || !currentClient) return;
  if (!window.supabaseClient) return;

  const conversation = await getConversation(currentPhone);
  currentOwner = conversation?.chat_owner || currentOwner || "AI_ACTIVE";

  if (!canHumanReply()) {
    alert("AI is currently handling this chat. Human can only reply after AI requests help.");
    updateOwnershipUI();
    return;
  }

  sendBtn.disabled = true;

  if (currentOwner === "WAITING_HUMAN") {
    currentOwner = "HUMAN_ACTIVE";
    await updateConversationOwner(currentPhone, "HUMAN_ACTIVE");
  }

  const inserted = await insertMessage("admin", text);

  if (!inserted) {
    sendBtn.disabled = false;
    return;
  }

  await notifyWhatsApp(text, "admin");

  messageInput.value = "";
  sendBtn.disabled = false;

  await updateConversationMeta(currentPhone, currentClient);
  await loadMessages(currentPhone);
  await loadContacts();
}

function filterContacts() {
  const query = searchInput?.value?.toLowerCase().trim() || "";

  if (!query) {
    renderContacts(allContacts);
    return;
  }

  const filtered = allContacts.filter(c => {
    const name = String(c.client_name || "").toLowerCase();
    const phone = String(c.phone_number || "").toLowerCase();
    const message = String(c.message_text || "").toLowerCase();

    return name.includes(query) || phone.includes(query) || message.includes(query);
  });

  renderContacts(filtered);
}

function insertTemplate(type) {
  if (!canHumanReply()) {
    alert("Templates can only be used after AI requests human help.");
    return;
  }

  const templates = {
    greeting: "Hi, thank you for reaching out. How can we help you today?",
    hours: "Our business hours are Monday to Saturday, 8:00 AM to 6:00 PM.",
    location: "We are based in Kenya. Please share your event location so we can assist you better.",
    support: "I understand. Let me check this for you and get back to you shortly."
  };

  messageInput.value = templates[type] || "";
  messageInput.focus();
}

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

if (searchInput) {
  searchInput.addEventListener("input", filterContacts);
}

if (agentToggle) {
  agentToggle.addEventListener("click", e => {
    const btn = e.target.closest(".toggle-option");
    if (!btn) return;

    if (btn.dataset.agent === "human" && currentOwner === "AI_ACTIVE") {
      alert("Human cannot take over until AI requests help.");
      return;
    }

    if (btn.dataset.agent === "ai") {
      humanResign();
    }
  });
}

if (aiAssistBtn) {
  aiAssistBtn.addEventListener("click", humanResign);
}

if (humanTransferBtn) {
  humanTransferBtn.addEventListener("click", humanResign);
}

document.querySelectorAll(".quick-action-chip").forEach(btn => {
  btn.addEventListener("click", () => {
    insertTemplate(btn.dataset.template);
  });
});

window.selectContact = selectContact;
window.humanResign = humanResign;

document.addEventListener("DOMContentLoaded", async () => {
  await loadContacts();
  updateOwnershipUI();

  setInterval(async () => {
    await loadContacts();

    if (currentPhone) {
      await loadMessages(currentPhone);
    }
  }, 8000);
});