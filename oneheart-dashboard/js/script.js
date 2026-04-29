const { data: { session } } = await window.supabaseClient.auth.getSession();

if (!session) {
  window.location.href = "/login.html";
}
document.addEventListener('DOMContentLoaded', async () => {
  const supabase = window.supabaseClient;

  // -------------------------
  // HELPERS
  // -------------------------
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getTimeAgo(dateStr) {
    if (!dateStr) return 'just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  function calculateTrend(current, previous) {
    if (!previous || previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  }

  function getDateRange(daysAgoStart, daysAgoEnd = 0) {
    const end = new Date();
    end.setDate(end.getDate() - daysAgoEnd);

    const start = new Date();
    start.setDate(start.getDate() - daysAgoStart);

    return {
      start: start.toISOString(),
      end: end.toISOString()
    };
  }

  function updateKpiCard(card, value, trend, period) {
    if (!card) return;

    const valueEl = card.querySelector('.kpi-value');
    const trendEl = card.querySelector('.kpi-trend');

    if (valueEl) valueEl.textContent = value || 0;

    if (trendEl) {
      const isUp = trend >= 0;
      const arrow = isUp ? "↑" : "↓";
      const percent = Math.abs(Math.round(trend));

      trendEl.className = `kpi-trend ${isUp ? "up" : "down"}`;
      trendEl.innerHTML = `${arrow} ${percent}% from last ${period}`;
    }
  }

  // -------------------------
  // KPI + REAL TRENDS
  // -------------------------
  async function loadKpiCounts() {
    if (!supabase) return;

    try {
      const cards = document.querySelectorAll('.kpi-card');

      // EVENTS (monthly)
      const currentMonth = getDateRange(30);
      const prevMonth = getDateRange(60, 30);

      const { count: totalEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      const { count: eventsNow } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentMonth.start);

      const { count: eventsBefore } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', prevMonth.start)
        .lt('created_at', prevMonth.end);

      updateKpiCard(cards[0], totalEvents, calculateTrend(eventsNow, eventsBefore), "month");


      // CONTACTS (weekly)
      const currentWeek = getDateRange(7);
      const prevWeek = getDateRange(14, 7);

      const { count: totalContacts } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });

      const { count: contactsNow } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentWeek.start);

      const { count: contactsBefore } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', prevWeek.start)
        .lt('created_at', prevWeek.end);

      updateKpiCard(cards[1], totalContacts, calculateTrend(contactsNow, contactsBefore), "week");


      // FEATURED EVENTS (monthly)
      const { count: featuredTotal } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true);

      const { count: featuredNow } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true)
        .gte('created_at', currentMonth.start);

      const { count: featuredBefore } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true)
        .gte('created_at', prevMonth.start)
        .lt('created_at', prevMonth.end);

      updateKpiCard(cards[2], featuredTotal, calculateTrend(featuredNow, featuredBefore), "month");


      // MESSAGES (daily)
      const todayRange = getDateRange(1);
      const yesterdayRange = getDateRange(2, 1);

      const { count: totalMessages } = await supabase
        .from('Messages')
        .select('*', { count: 'exact', head: true });

      const { count: messagesToday } = await supabase
        .from('Messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayRange.start);

      const { count: messagesYesterday } = await supabase
        .from('Messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterdayRange.start)
        .lt('created_at', yesterdayRange.end);

      updateKpiCard(cards[3], totalMessages, calculateTrend(messagesToday, messagesYesterday), "day");

    } catch (err) {
      // KPI trend error — suppressed in production
    }
  }

  async function updateStatusMetrics() {
  if (!window.supabaseClient) return;

  const supabase = window.supabaseClient;

  try {
    // UNREAD
    const { count: unreadCount } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "unread");

    // PENDING
    const { count: pendingCount } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Update UI
    const metrics = document.querySelectorAll(".metric-val");

    if (metrics[0]) metrics[0].textContent = unreadCount ?? 0;
    if (metrics[1]) metrics[1].textContent = pendingCount ?? 0;

  } catch (err) {
    console.warn("⚠️ Status metrics error:", err);
  }
}

  // -------------------------
  // UPCOMING EVENTS
  // -------------------------
  async function loadUpcomingEvents() {
    if (!supabase) return;

    try {
      const { data: events } = await supabase
        .from('events')
        .select('id, title, start_date, is_featured')
        .eq('is_past', false)
        .order('start_date', { ascending: true })
        .limit(3);

      const tbody = document.querySelector('.data-table tbody');
      if (!tbody || !events) return;

      tbody.innerHTML = events.map(event => `
        <tr>
          <td><strong>${escapeHtml(event.title)}</strong></td>
          <td>${new Date(event.start_date).toLocaleString()}</td>
          <td>
            <span class="badge ${event.is_featured ? 'success' : 'warning'}">
              ${event.is_featured ? 'CONFIRMED' : 'PENDING'}
            </span>
          </td>
          <td><i class="fa-solid fa-ellipsis-vertical"></i></td>
        </tr>
      `).join('');

    } catch (err) {
      // Events load error suppressed
    }
  }

  // -------------------------
  // ACTIVITY FEED
  // -------------------------
  async function loadActivityFeed() {
    if (!supabase) return;

    try {
      const { data: events } = await supabase
        .from('events')
        .select('title, created_at, is_featured')
        .order('created_at', { ascending: false })
        .limit(5);

      const feed = document.querySelector('.activity-feed');
      if (!feed) return;

      feed.innerHTML = (events || []).map(evt => `
  <li class="feed-item">
    
    <div class="feed-icon">
      <i class="fa-regular fa-calendar"></i>
    </div>

    <div class="feed-content">
      <h4>
        ${evt.is_featured ? 'Featured event created' : 'Event updated'}
      </h4>
      <p>${escapeHtml(evt.title)}</p>
    </div>

    <span class="feed-time">
      ${getTimeAgo(evt.created_at)}
    </span>

  </li>
`).join('');

    } catch (err) {
      // Activity feed load error suppressed
    }
  }

  // -------------------------
  // RECENT INQUIRIES
  // -------------------------
  async function loadRecentInquiries() {
    if (!supabase) return;

    try {
      const { data } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!data?.length) return;

      const msg = data[0];
      const card = document.querySelector('.inquiry-card');
      if (!card) return;

     card.innerHTML = `
  <div class="inquiry-user">
    <div class="avatar-circle">
      ${(msg.org_name || msg.email || '?')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)}
    </div>

    <div>
      <div class="name">
        ${escapeHtml(msg.org_name || msg.email)}
      </div>

      <div class="msg">
        ${escapeHtml(
          msg.message?.substring(0, 60) +
          (msg.message?.length > 60 ? '...' : '')
        )}
      </div>
    </div>
  </div>

  <div class="inquiry-meta">
    <span class="time">${getTimeAgo(msg.created_at)}</span>
    ${
      msg.status === 'unread'
        ? '<span class="badge primary">NEW</span>'
        : ''
    }
  </div>
`;
    } catch (err) {
      // Inquiry load error suppressed
    }
  }

  // -------------------------
  // CLOCK
  // -------------------------
  const dateEl = document.getElementById('current-date');
  const timeEl = document.getElementById('current-time');

  if (dateEl && timeEl) {
    setInterval(() => {
      const now = new Date();
      dateEl.textContent = now.toDateString();
      timeEl.textContent = now.toLocaleTimeString();
    }, 1000);
  }

  // -------------------------
  // LOAD EVERYTHING
  // -------------------------
 await Promise.all([
  loadKpiCounts(),
  loadUpcomingEvents(),
  loadRecentInquiries(),
  loadActivityFeed(),
  updateStatusMetrics() 
]);

  // Dashboard initialized

  document.body.style.display = "block";
});
// -------------------------
// QUICK ACTIONS
// -------------------------

// ADD EVENT → go to events page
document.getElementById("addEventBtn")?.addEventListener("click", () => {
  window.location.href = "event-manager.html"; // adjust path if needed
});


// VIEW RESPONSES → go to contact messages
document.getElementById("viewResponsesBtn")?.addEventListener("click", () => {
  window.location.href = "contact-responses.html"; // or inbox page
});


document.getElementById("changeLanguageBtn")?.addEventListener("click", () => {
  const current = localStorage.getItem("lang") || "en";
  const next = current === "en" ? "ar" : "en";

  // Save preference
  localStorage.setItem("lang", next);

  // Reload page to apply language
  location.reload();
});

// Logout helper
window.logout = async function() {
  const supabase = window.supabaseClient;

  // preserve language preference
  const lang = localStorage.getItem('lang');

  try {
    if (supabase && supabase.auth && typeof supabase.auth.signOut === 'function') {
      await supabase.auth.signOut();
    }
  } catch (err) {
    // ignore sign out errors
  }

  // Clear storages but keep language
  try {
    localStorage.clear();
    if (lang) localStorage.setItem('lang', lang);
  } catch (e) {}

  try { sessionStorage.clear(); } catch (e) {}

  // Redirect to login page to force re-authentication
  window.location.href = '../auth/login.html';
};
