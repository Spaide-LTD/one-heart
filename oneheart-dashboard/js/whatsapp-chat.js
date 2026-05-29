// At the top of every dashboard page (index.html, event-manager.html, etc.)
(async () => {
    // This will redirect to login if not authenticated
    const isAuthenticated = await requireAuth();
    if (!isAuthenticated) return;
    // Your page code here...
    console.log("User is authenticated:", getCurrentUser()?.email);
})();

const TABLE = 'Messages';

// DOM Elements
const chatList = document.getElementById('chatList');
const chatBody = document.getElementById('chatBody');
const chatContactName = document.getElementById('chatContactName');
const chatAvatar = document.getElementById('chatAvatar');
const chatStatus = document.getElementById('chatStatus');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let currentPhone = null;
let currentClient = null;

// Format time
function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Safe translation
function translate(key, fallback) {
  if (typeof window.t === 'function') return window.t(key) || fallback || key;
  return fallback || key;
}

// Load unique conversations
async function loadContacts() {
  if (!window.supabaseClient) {
    // Supabase not initialized — abort loading contacts
    return;
  }

  const { data, error } = await window.supabaseClient
    .from(TABLE)
    .select('phone_number, client_name, message_text, created_at, status, sender_type')
    .order('created_at', { ascending: false });

  if (error) {
    // Load contacts failed — abort silently
    return;
  }

  // Group by phone, keep latest message
  const unique = {};
  (data || []).forEach(msg => {
    if (!unique[msg.phone_number]) unique[msg.phone_number] = msg;
  });

  renderContacts(Object.values(unique));
}

// Render sidebar contacts
function renderContacts(contacts) {
  if (!contacts || !contacts.length) {
    chatList.innerHTML = `<div style="padding:20px;color:var(--text-muted);">No chats yet</div>`;
    return;
  }

  chatList.innerHTML = contacts.map(c => {
    const initials = (c.client_name || c.phone_number || '?')
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const isActive = c.phone_number === currentPhone ? 'active' : '';

    const hasUnread =
      c.status === 'unread' && c.sender_type === 'client'
        ? `<span class="notification-badge" style="position:static;margin-left:auto;font-size:9px;min-width:16px;height:16px;padding:0 4px;">1</span>`
        : '';

    return `
      <div class="chat-item ${isActive}" onclick="selectContact('${c.phone_number}', '${escapeHtml(c.client_name)}')" style="cursor:pointer;">
        <div class="chat-avatar" style="background:var(--gradient-violet);width:40px;height:40px;font-size:12px;">${initials}</div>
        <div style="flex:1;min-width:0;">
          <strong style="display:block;font-size:13px;color:var(--text-primary);">${escapeHtml(c.client_name || c.phone_number)}</strong>
          <p style="font-size:11px;color:var(--text-muted);margin:2px 0 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${escapeHtml(c.message_text || '')}
          </p>
        </div>
        <span style="font-size:10px;color:var(--text-tertiary);white-space:nowrap;">${formatTime(c.created_at)}</span>
        ${hasUnread}
      </div>
    `;
  }).join('');
}

// Select contact
async function selectContact(phone, clientName) {
  currentPhone = phone;
  currentClient = clientName;

  chatContactName.textContent = clientName || phone;
  chatAvatar.textContent = (clientName || phone)
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  chatStatus.textContent = translate('chat.status.online', 'Online');

  messageInput.disabled = false;
  sendBtn.disabled = false;
  messageInput.focus();

  await loadContacts(); // refresh active state
  await loadMessages(phone);
}


// Load messages for contact

async function loadMessages(phoneNumber) {
  if (!window.supabaseClient || !phoneNumber) return;

  const { data, error } = await window.supabaseClient
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: true }); // ❗ remove filter

  if (error) {
    // Load messages failed — abort silently
    return;
  }

  // ✅ FIX: filter properly (handles null phone_number)
  const messages = (data || []).filter(msg => {
    if (!msg.phone_number) return true; // include broken client messages
    return msg.phone_number === phoneNumber;
  });

  // messages loaded

  renderMessages(messages);

  // ✅ FIX unread logic
  const unread = messages.filter(
    m => m.sender_type === 'client' && m.status === 'unread'
  );

  if (unread.length > 0) {
    await window.supabaseClient
      .from(TABLE)
      .update({ status: 'read' })
      .eq('phone_number', phoneNumber)
      .eq('sender_type', 'client')
      .eq('status', 'unread');

    loadContacts();
  }
}



// Render chat bubbles

function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function renderMessages(messages) {
  if (!messages || !messages.length) {
    chatBody.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:40px;">No messages yet</div>`;
    return;
  }

  let html = '';
  let lastDate = null;

  messages.forEach(msg => {
    const msgDate = new Date(msg.created_at).toDateString();

    // Insert date separator
    if (msgDate !== lastDate) {
      html += `
        <div style="text-align:center;margin:20px 0;">
          <span style="
            background:var(--bg-secondary);
            color:var(--text-secondary);
            font-size:11px;
            padding:6px 12px;
            border-radius:999px;
          ">
            ${formatDateLabel(msg.created_at)}
          </span>
        </div>
      `;
      lastDate = msgDate;
    }

    const isClient = msg.sender_type === 'client';

    const align = isClient ? 'received' : 'sent';

    const bg = isClient
      ? 'background:var(--bg-card);color:var(--text-primary);align-self:flex-start;border-bottom-left-radius:4px;border:1px solid var(--border-secondary);'
      : 'background:var(--primary-dark);color:white;align-self:flex-end;border-bottom-right-radius:4px;';

    html += `
      <div class="message ${align}" style="max-width:75%;margin:8px 0;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.5;${bg}">
        ${escapeHtml(
  msg.message_text ||
  msg.message ||
  msg.text ||
  msg.body ||
  ''
)}
        <div style="font-size:10px;opacity:0.7;margin-top:4px;text-align:right;">
          ${formatTime(msg.created_at)}
        </div>
      </div>
    `;
  });

  chatBody.innerHTML = html;
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Send message
async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !currentPhone || !currentClient) return;

  const { error } = await window.supabaseClient
    .from(TABLE)
    .insert({
      phone_number: currentPhone,
      client_name: currentClient,
      message_text: text,
      status: 'read',
      sender_type: 'admin',
      created_at: new Date().toISOString()
    });
    await fetch('https://primary-production-19a8d.up.railway.app/webhook/send-agent-message', {
  method: 'POST',
  body: JSON.stringify({
    phone_number: currentPhone,
    message_text: text
  })
});

  if (error) {
    // Send failed — abort
    return;
  }

  messageInput.value = '';
  await loadMessages(currentPhone);
  await loadContacts();
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

window.selectContact = selectContact;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // WhatsApp Chat initialized
  await loadContacts();
});
