// -------------------------
// GLOBAL NOTIFICATIONS SYSTEM (SUPABASE v2)
// -------------------------

function initNotifications() {
  const supabase = window.supabaseClient;

  if (!supabase || !supabase.channel) {
    console.warn("⚠️ Supabase v2 not ready");
    return;
  }

  console.log("🔔 Notifications system active (v2)");

  const channel = supabase.channel("global-notifications");

  // -------------------------
  // WHATSAPP MESSAGES
  // -------------------------
  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "Messages"
    },
    (payload) => {
      const msg = payload.new;

      if (msg.sender_type === "client") {
        if (window.location.pathname.includes("whatsapp")) return;

        notifyInfo(msg.message_text || "New message");
        incrementNotificationBadge();
      }
    }
  );

  // -------------------------
  // CONTACT MESSAGES
  // -------------------------
  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "contact_messages"
    },
    (payload) => {
      const msg = payload.new;

      notifySuccess(`New response from ${msg.org_name || "user"}`);
      incrementNotificationBadge();
    }
  );

  channel.subscribe((status) => {
    console.log("📡 Realtime status:", status);
  });
}
channel.on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "contact_messages"
  },
  () => {
    updateStatusMetrics(); // auto refresh counts
  }
);

// -------------------------
// INIT SAFELY
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  const check = setInterval(() => {
    if (window.supabaseClient?.channel) {
      clearInterval(check);
      initNotifications();
    }
  }, 100);
});

// -------------------------
// BADGE
// -------------------------
function incrementNotificationBadge() {
  const badge = document.querySelector(".notification-badge");
  if (!badge) return;

  const current = parseInt(badge.textContent || "0");
  badge.textContent = current + 1;
}

function resetNotificationBadge() {
  const badge = document.querySelector(".notification-badge");
  if (badge) badge.textContent = 0;
}