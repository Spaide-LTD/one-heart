const { data: { session } } = await window.supabaseClient.auth.getSession();

if (!session) {
  window.location.href = "/login.html";
}
document.addEventListener("DOMContentLoaded", () => {

  const supabase = window.supabaseClient;

  /* ===============================
     DOM REFERENCES
  =============================== */
  const imageUploadArea = document.getElementById('imageUploadArea');
  const eventImageInput = document.getElementById('eventImageInput');
  const previewImg = document.getElementById('previewImg');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const imagePreview = document.getElementById('imagePreview');
  const removeImageBtn = document.getElementById('removeImageBtn');
  const modal = document.getElementById("eventModal");

  /* ===============================
     IMAGE UPLOAD HANDLERS
  =============================== */
  if (imageUploadArea && eventImageInput) {
    imageUploadArea.addEventListener('click', () => eventImageInput.click());
  }

  if (eventImageInput) {
    eventImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) {
        notifyError((window.t?.('error.image_too_large')) || 'Image must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        previewImg.src = ev.target.result;
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
        if (imagePreview) imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  }

  if (removeImageBtn) {
    removeImageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (eventImageInput) eventImageInput.value = '';
      if (previewImg) previewImg.src = '';
      if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
      if (imagePreview) imagePreview.style.display = 'none';
    });
  }

  /* ===============================
     LOAD EVENTS
  =============================== */
  async function loadEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      // Load events error suppressed
      notifyError("Failed to load events");
      return;
    }
    renderEvents(data || []);
  }

  /* ===============================
     RENDER TABLE (with Edit + Delete)
  =============================== */
  function renderEvents(events) {
    const table = document.getElementById("eventsTable");
    const emptyState = document.getElementById("emptyState");
    if (!table) return;

    if (!events.length) {
      table.innerHTML = "";
      if (emptyState) emptyState.style.display = "flex";
      return;
    }
    if (emptyState) emptyState.style.display = "none";

    table.innerHTML = events.map(e => `
      <tr class="${e.is_past ? "past-row" : ""}">
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            ${e.image_url 
              ? `<img src="${e.image_url}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;">`
              : `<div style="width:40px;height:40px;border-radius:8px;background:#1a1a1a;display:flex;align-items:center;justify-content:center;color:#666;"><i class="fa-solid fa-image"></i></div>`
            }
            <div>
              <strong>${escapeHtml(e.title)}</strong><br>
              <span style="font-size:12px;color:#888;">${escapeHtml(e.description || "")}</span>
            </div>
          </div>
        </td>
        <td>${formatDate(e.start_date)}</td>
        <td>${escapeHtml(e.client_name || "-")}</td>
        <td>
          ${e.is_past 
            ? `<span class="badge neutral">Past</span>` 
            : `<span class="badge success">Upcoming</span>`}
        </td>
        <td>
          <button class="visibility-toggle ${e.is_public ? "public" : "internal"}"
            onclick="togglePublic('${e.id}', ${e.is_public})">
            ${e.is_public ? '🌐 Public' : '🔒 Internal'}
          </button>
        </td>
        <td>
          <span class="badge ${e.is_featured ? "primary" : "neutral"}">
            ${e.is_featured ? '⭐ Featured' : '—'}
          </span>
        </td>
        <td>
          <button class="action-icon-btn" onclick="editEvent('${e.id}')" title="Edit">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="action-icon-btn" onclick="togglePast('${e.id}', ${e.is_past})" title="${e.is_past ? 'Mark Upcoming' : 'Mark Past'}">
            <i class="fa-solid ${e.is_past ? 'fa-rotate-left' : 'fa-box-archive'}"></i>
          </button>
          <button class="action-icon-btn danger" onclick="deleteEvent('${e.id}', '${escapeHtml(e.title)}')" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }

  /* ===============================
     SAVE EVENT (Create / Update)
  =============================== */
  async function saveEvent() {
    const id = document.getElementById("editEventId")?.value;
    const title = document.getElementById("eventTitle")?.value?.trim();
    const date = document.getElementById("eventDateTime")?.value;
    const client = document.getElementById("eventClient")?.value?.trim();
    const desc = document.getElementById("eventDesc")?.value?.trim();
    const isPublic = document.querySelector('input[name="visibility"]:checked')?.value === "public";
    const isFeatured = document.getElementById("eventFeatured")?.checked;

    // Validate required fields for CREATE only
    if (!id && (!title || !date)) {
      notifyError("Title and Date are required");
      return;
    }

    // Handle image URL
    let imageUrl = null;
    if (imagePreview?.style.display === 'block' && previewImg?.src && previewImg.src.startsWith('data:')) {
      // New upload: keep the data URL (or upload to storage in production)
      imageUrl = previewImg.src;
    } else if (id) {
      // Editing: fetch existing image_url to preserve it
      const { data: existing } = await supabase.from("events").select("image_url").eq("id", id).single();
      imageUrl = existing?.image_url || null;
    }

    const payload = {
      title,
      start_date: date,
      client_name: client || null,
      description: desc || null,
      is_public: isPublic,
      is_featured: isFeatured,
      image_url: imageUrl
    };

    try {
      if (id) {
        // UPDATE
        const { error } = await supabase.from("events").update(payload).eq("id", id);
        if (error) throw error;
        notifySuccess("Event updated");
      } else {
        // INSERT
        payload.is_past = false;
        const { error } = await supabase.from("events").insert([payload]);
        if (error) throw error;
        notifySuccess("Event created");
      }
      closeModal();
      loadEvents();
    } catch (err) {
      notifyError(err.message || "Failed to save event");
    }
  }

  /* ===============================
     EDIT EVENT (Fixed)
  =============================== */
  window.editEvent = async function(id) {
    try {
      const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
      if (error || !data) throw error;

      // Populate form fields
      document.getElementById("editEventId").value = data.id;
      document.getElementById("eventTitle").value = data.title || "";
      document.getElementById("eventDateTime").value = data.start_date || "";
      document.getElementById("eventClient").value = data.client_name || "";
      document.getElementById("eventDesc").value = data.description || "";
      document.getElementById("eventFeatured").checked = !!data.is_featured;

      // Set visibility radio
      if (data.is_public) {
        document.getElementById("visibilityPublic")?.click();
      } else {
        document.getElementById("visibilityInternal")?.click();
      }

      // Restore image preview
      if (data.image_url) {
        if (previewImg) previewImg.src = data.image_url;
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
        if (imagePreview) imagePreview.style.display = 'block';
      } else {
        resetImageUpload();
      }

      // Open modal
      if (modal) modal.classList.add("active");
    } catch (err) {
      notifyError("Failed to load event");
    }
  };

  /* ===============================
     DELETE EVENT (New)
  =============================== */
  window.deleteEvent = async function(id, title) {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;

    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      notifySuccess("Event deleted");
      loadEvents();
    } catch (err) {
      notifyError("Failed to delete event");
    }
  };

  /* ===============================
     TOGGLES
  =============================== */
  window.togglePublic = async function(id, current) {
    try {
      const { error } = await supabase.from("events").update({ is_public: !current }).eq("id", id);
      if (error) throw error;
      loadEvents();
    } catch (err) {
      notifyError("Failed to update visibility");
    }
  };

  window.togglePast = async function(id, current) {
    try {
      const { error } = await supabase.from("events").update({ is_past: !current }).eq("id", id);
      if (error) throw error;
      loadEvents();
    } catch (err) {
      notifyError("Failed to update status");
    }
  };

  /* ===============================
     MODAL CONTROLS
  =============================== */
  window.openModal = function() {
    // Reset form for CREATE
    document.getElementById("editEventId").value = "";
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventDateTime").value = "";
    document.getElementById("eventClient").value = "";
    document.getElementById("eventDesc").value = "";
    document.getElementById("eventFeatured").checked = false;
    document.getElementById("visibilityInternal")?.click();
    resetImageUpload();
    
    if (modal) modal.classList.add("active");
  };

  window.closeModal = function() {
    if (modal) modal.classList.remove("active");
  };

  function resetImageUpload() {
    if (eventImageInput) eventImageInput.value = '';
    if (previewImg) previewImg.src = '';
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
    if (imagePreview) imagePreview.style.display = 'none';
  }

  // Bind modal buttons
  const addBtn = document.getElementById("addEventBtn");
  const closeBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelModal");
  const submitBtn = document.getElementById("submitEvent");
  
  if (addBtn) addBtn.onclick = openModal;
  if (closeBtn) closeBtn.onclick = closeModal;
  if (cancelBtn) cancelBtn.onclick = closeModal;
  if (submitBtn) submitBtn.onclick = saveEvent;

  // Close modal on outside click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  /* ===============================
     HELPERS
  =============================== */
  function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /* ===============================
     INIT
  =============================== */
  if (window.supabaseReady) {
    window.supabaseReady.then(loadEvents);
  } else {
    loadEvents();
  }

  // Event Manager initialized
});