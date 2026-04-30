(async () => {
  const { data: { session } } = await window.supabaseClient.auth.getSession();

  if (!session) {
    window.location.replace("/login.html");
    return;
  }

})();
// DOM Elements
const tableBody = document.getElementById('messagesBody');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('viewModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModal');

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Safe translation helper (renamed to avoid conflict with window.t)
function translate(key, fallback) {
  if (typeof window.t === 'function') {
    return window.t(key) || fallback || key;
  }
  return fallback || key;
}

// Fetch and render messages
async function loadMessages() {
  if (!window.supabaseClient) {
    // Supabase client missing — abort
    return;
  }
  
  const { data: messages, error } = await window.supabaseClient
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    // Load error — abort
    return;
  }
  
  renderMessages(messages || []);
}

// Render table rows
function renderMessages(messages) {
  if (messages.length === 0) {
    tableBody.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  
  tableBody.innerHTML = messages.map(msg => `
    <tr>
      <td>${escapeHtml(msg.org_name)}</td>
      <td>${escapeHtml(msg.email)}</td>
      <td>${formatDate(msg.created_at)}</td>
      <td>
        <span class="badge ${msg.status === 'unread' ? 'warning' : 'success'}" 
              style="cursor: pointer;" 
              onclick="toggleStatus('${msg.id}', '${msg.status}')"
              data-i18n="status.${msg.status}">
          ${translate(`status.${msg.status}`, msg.status.toUpperCase())}
        </span>
      </td>
      <td>
        <i class="fa-solid fa-eye" 
           style="cursor: pointer; color: var(--primary);" 
           onclick="openModal('${msg.id}')"
           data-i18n="action.view"
           title="${translate('action.view', 'View message')}"></i>
      </td>
    </tr>
  `).join('');
}

// Toggle status
async function toggleStatus(id, currentStatus) {
  if (!window.supabaseClient) return;

  const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
  
  const { error } = await window.supabaseClient
    .from('contact_messages')
    .update({ status: newStatus })
    .eq('id', id);
  
  if (error) {
    // Update error — abort
    return;
  }
  
  // Update UI immediately
  const span = document.querySelector(`.badge[onclick*="${id}"]`);
  if (span) {
    span.textContent = translate(`status.${newStatus}`, newStatus.toUpperCase());
    span.className = `badge ${newStatus === 'unread' ? 'warning' : 'success'}`;
    span.setAttribute('onclick', `toggleStatus('${id}', '${newStatus}')`);
    span.setAttribute('data-i18n', `status.${newStatus}`);
  }
}

// Open modal with message details
async function openModal(id) {
  if (!window.supabaseClient) return;
  
  const { data: msg, error } = await window.supabaseClient
    .from('contact_messages')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !msg) {
    // Load error — abort
    return;
  }
  
  // Build modal content with data-i18n attributes
  modalContent.innerHTML = `
    <p><strong data-i18n="modal.orgName">${translate('modal.orgName', 'Org Name:')}</strong> ${escapeHtml(msg.org_name)}</p>
    <p><strong data-i18n="modal.email">${translate('modal.email', 'Email:')}</strong> ${escapeHtml(msg.email)}</p>
    <p><strong data-i18n="modal.phone">${translate('modal.phone', 'Phone:')}</strong> ${escapeHtml(msg.phone || '—')}</p>
    <p><strong data-i18n="modal.budget">${translate('modal.budget', 'Budget:')}</strong> ${escapeHtml(msg.budget || '—')}</p>
    <p><strong data-i18n="modal.eventDate">${translate('modal.eventDate', 'Event Date:')}</strong> ${msg.event_date ? formatDate(msg.event_date) : '—'}</p>
    <p style="margin-top: 16px;"><strong data-i18n="modal.message">${translate('modal.message', 'Message:')}</strong></p>
    <p style="background: var(--bg-tertiary); padding: 12px; border-radius: var(--radius-md); white-space: pre-wrap;">
      ${escapeHtml(msg.message)}
    </p>
  `;
  
  modal.style.display = 'flex';
  
  // Mark as read when viewed
  if (msg.status === 'unread') {
    toggleStatus(id, 'unread');
  }
}

// Close modal
function closeModal() {
  modal.style.display = 'none';
}

// Event listeners
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Make functions global for inline onclick
window.toggleStatus = toggleStatus;
window.openModal = openModal;

// Initialize
document.addEventListener('DOMContentLoaded', loadMessages);