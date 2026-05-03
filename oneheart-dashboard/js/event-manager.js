// At the top of every dashboard page (index.html, event-manager.html, etc.)
(async () => {
    // This will redirect to login if not authenticated
    const isAuthenticated = await requireAuth();
    if (!isAuthenticated) return;
    
    // Your page code here...
    console.log("User is authenticated:", getCurrentUser()?.email);
})();
let allEvents = [];
        let currentPage = 1;
        const itemsPerPage = 10;
        let currentActionId = null;
        let pendingActionType = null;
        let uploadedImageFile = null;
        let uploadedImageUrl = null;

        // Toast notification function
        function showToast(message, type = 'info') {
            const container = document.getElementById('toastContainer');
            if (!container) return;
            
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-info-circle'}"></i> ${message}`;
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        function showNotification(message, type) {
            showToast(message, type);
        }

        // Initialize Supabase
        let supabaseClient = null;
        try {
            supabaseClient = window.supabaseClient || supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log("Supabase initialized");
        } catch (e) {
            console.error("Failed to initialize Supabase:", e);
        }

        // ============================================
        // LOAD EVENTS
        // ============================================
        async function loadEvents() {
            if (!supabaseClient) {
                showNotification("Supabase not configured", "error");
                return;
            }
            
            const { data, error } = await supabaseClient
                .from("events")
                .select("*")
                .order("start_date", { ascending: false });

            if (error) {
                console.error("Error loading events:", error);
                showNotification("Failed to load events: " + error.message, "error");
                return;
            }

            allEvents = data || [];
            renderTable();
            renderPagination();
            toggleEmptyState();
        }

        function renderTable() {
            const tbody = document.getElementById("eventsTable");
            const start = (currentPage - 1) * itemsPerPage;
            const pageEvents = allEvents.slice(start, start + itemsPerPage);

            if (pageEvents.length === 0) { tbody.innerHTML = ""; return; }

            tbody.innerHTML = pageEvents.map(e => {
                const dateObj = new Date(e.start_date);
                const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                // Fix: Determine past status correctly - either explicitly marked past OR date is in the past
                const isPast = e.is_past || (new Date(e.start_date) < new Date());
                const isFeatured = e.is_featured;
                const thumbHtml = e.hero_url ? `<img src="${e.hero_url}" class="event-thumb-sm" onerror="this.style.display='none'">` : '<span class="event-thumb-sm" style="display:inline-block;background:var(--bg-tertiary);text-align:center;line-height:30px;"><i class="fa-solid fa-image"></i></span>';
                
                // Status badge with correct indicator
                const statusBadge = isPast ? 
                    '<span class="status-badge past"><i class="fa-regular fa-calendar-check"></i> Past</span>' : 
                    '<span class="status-badge upcoming"><i class="fa-regular fa-calendar"></i> Upcoming</span>';
                
                return `<tr class="${isPast ? 'past-row' : ''}">
                    <td><div style="display:flex;align-items:center;">${thumbHtml}<span style="font-weight:500;">${escapeHtml(e.title)}</span></div></td>
                    <td>${dateStr}</td>
                    <td>${escapeHtml(e.client_name) || '-'}</td>
                    <td>${statusBadge}</span></small></td>
                    <td><button class="featured-star ${isFeatured ? 'active' : ''}" onclick="prepareFeatureAction('${e.id}', ${isFeatured})"><i class="fa-${isFeatured ? 'solid' : 'regular'} fa-star"></i></button></span></small></td>
                    <td><div class="table-actions"><button class="action-icon-btn" onclick="openEdit('${e.id}')"><i class="fa-solid fa-pen"></i></button><div class="action-dropdown-wrap"><button class="action-menu-btn" onclick="toggleActionMenu(this)"><i class="fa-solid fa-ellipsis-vertical"></i></button><div class="action-dropdown"><button class="dropdown-item" onclick="preparePastAction('${e.id}')"><i class="fa-solid fa-clock-rotate-left"></i> Mark as Past</button><button class="dropdown-item" onclick="prepareFeatureAction('${e.id}', ${isFeatured})"><i class="fa-solid fa-star"></i> ${isFeatured ? 'Unfeature' : 'Feature'}</button><div class="dropdown-divider"></div><button class="dropdown-item danger" onclick="prepareDeleteAction('${e.id}')"><i class="fa-solid fa-trash"></i> Delete</button></div></div></div></td>
                </tr>`;
            }).join("");
        }

        function renderPagination() {
            const totalPages = Math.ceil(allEvents.length / itemsPerPage);
            const container = document.getElementById("pagination");
            if (totalPages <= 1) { container.innerHTML = allEvents.length ? `<span class="pagination-info">${allEvents.length} events</span>` : ""; return; }
            const start = (currentPage - 1) * itemsPerPage + 1;
            const end = Math.min(currentPage * itemsPerPage, allEvents.length);
            let pagesHtml = "";
            for (let i = 1; i <= totalPages; i++) pagesHtml += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
            container.innerHTML = `<span class="pagination-info">${start}-${end} of ${allEvents.length}</span><button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>${pagesHtml}<button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
        }

        function changePage(page) { const total = Math.ceil(allEvents.length / itemsPerPage); if (page < 1 || page > total) return; currentPage = page; renderTable(); renderPagination(); }
        function toggleEmptyState() { const has = allEvents.length > 0; const tableContainer = document.getElementById("tableContainer"); const emptyState = document.getElementById("emptyState"); if (tableContainer) tableContainer.style.display = has ? "" : "none"; if (emptyState) emptyState.style.display = has ? "none" : "flex"; }

        function openModal(id) { const modal = document.getElementById(id); if (modal) modal.classList.add("active"); }
        function closeModal(id) { const modal = document.getElementById(id); if (modal) modal.classList.remove("active"); }

        // ============================================
        // CONTEXTUAL CONFIRMATION MODALS
        // ============================================
        function preparePastAction(id) {
            currentActionId = id;
            pendingActionType = 'past';
            const event = allEvents.find(e => e.id === id);
            const eventTitle = event?.title || 'this event';
            
            const confirmIcon = document.getElementById("confirmIcon");
            const confirmTitle = document.getElementById("confirmTitle");
            const confirmMessage = document.getElementById("confirmMessage");
            const confirmActionBtn = document.getElementById("confirmActionBtn");
            
            if (confirmIcon) { confirmIcon.className = "confirm-icon past"; confirmIcon.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i>'; }
            if (confirmTitle) confirmTitle.textContent = "Mark as Past Event?";
            if (confirmMessage) confirmMessage.textContent = `"${escapeHtml(eventTitle)}" will be marked as a past event and will no longer appear in upcoming lists.`;
            if (confirmActionBtn) { confirmActionBtn.className = "btn-primary"; confirmActionBtn.innerHTML = '<i class="fa-solid fa-check"></i> Yes, Mark as Past'; }
            closeAllDropdowns();
            openModal("confirmModal");
        }

        function prepareFeatureAction(id, isCurrentlyFeatured) {
            currentActionId = id;
            const event = allEvents.find(e => e.id === id);
            const eventTitle = event?.title || 'this event';
            const confirmIcon = document.getElementById("confirmIcon");
            const confirmTitle = document.getElementById("confirmTitle");
            const confirmMessage = document.getElementById("confirmMessage");
            const confirmActionBtn = document.getElementById("confirmActionBtn");
            
            if (isCurrentlyFeatured) {
                pendingActionType = 'unfeature';
                if (confirmIcon) { confirmIcon.className = "confirm-icon unfeature"; confirmIcon.innerHTML = '<i class="fa-solid fa-star"></i>'; }
                if (confirmTitle) confirmTitle.textContent = "Unfeature This Event?";
                if (confirmMessage) confirmMessage.textContent = `"${escapeHtml(eventTitle)}" will no longer appear on the homepage.`;
                if (confirmActionBtn) { confirmActionBtn.className = "btn-primary"; confirmActionBtn.innerHTML = '<i class="fa-solid fa-check"></i> Yes, Unfeature'; }
            } else {
                pendingActionType = 'feature';
                if (confirmIcon) { confirmIcon.className = "confirm-icon feature"; confirmIcon.innerHTML = '<i class="fa-solid fa-star"></i>'; }
                if (confirmTitle) confirmTitle.textContent = "Feature This Event?";
                if (confirmMessage) confirmMessage.textContent = `"${escapeHtml(eventTitle)}" will be highlighted on the homepage.`;
                if (confirmActionBtn) { confirmActionBtn.className = "btn-primary"; confirmActionBtn.innerHTML = '<i class="fa-solid fa-check"></i> Yes, Feature It'; }
            }
            closeAllDropdowns();
            openModal("confirmModal");
        }

        function prepareDeleteAction(id) {
            currentActionId = id;
            pendingActionType = 'delete';
            const event = allEvents.find(e => e.id === id);
            const eventTitle = event?.title || 'this event';
            const confirmIcon = document.getElementById("confirmIcon");
            const confirmTitle = document.getElementById("confirmTitle");
            const confirmMessage = document.getElementById("confirmMessage");
            const confirmActionBtn = document.getElementById("confirmActionBtn");
            
            if (confirmIcon) { confirmIcon.className = "confirm-icon delete"; confirmIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; }
            if (confirmTitle) confirmTitle.textContent = "Delete This Event?";
            if (confirmMessage) confirmMessage.textContent = `"${escapeHtml(eventTitle)}" will be permanently deleted. This action cannot be undone.`;
            if (confirmActionBtn) { confirmActionBtn.className = "btn-danger"; confirmActionBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Delete Event'; }
            closeAllDropdowns();
            openModal("confirmModal");
        }

        async function executeConfirmedAction() {
            if (!currentActionId || !supabaseClient) return;
            
            switch(pendingActionType) {
                case 'past':
                    const { error: pastError } = await supabaseClient
                        .from("events")
                        .update({ is_past: true, is_featured: false })
                        .eq("id", currentActionId);
                    if (pastError) { showNotification("Failed to mark as past", "error"); }
                    else { showNotification("Event marked as past", "success"); }
                    break;
                    
                case 'feature':
                    const event = allEvents.find(e => e.id === currentActionId);
                    if (event?.is_past) { 
                        showNotification("Past events cannot be featured", "warning"); 
                        closeModal("confirmModal");
                        return;
                    }
                    const { error: featError } = await supabaseClient
                        .from("events")
                        .update({ is_featured: true })
                        .eq("id", currentActionId);
                    if (featError) { showNotification("Failed to feature event", "error"); }
                    else { showNotification("Event featured", "success"); }
                    break;
                    
                case 'unfeature':
                    const { error: unfeatError } = await supabaseClient
                        .from("events")
                        .update({ is_featured: false })
                        .eq("id", currentActionId);
                    if (unfeatError) { showNotification("Failed to unfeature event", "error"); }
                    else { showNotification("Event unfeatured", "success"); }
                    break;
                    
                case 'delete':
                    const { error: delError } = await supabaseClient
                        .from("events")
                        .delete()
                        .eq("id", currentActionId);
                    if (delError) { showNotification("Failed to delete event", "error"); }
                    else { showNotification("Event deleted", "success"); }
                    break;
            }
            
            closeModal("confirmModal");
            pendingActionType = null;
            currentActionId = null;
            loadEvents();
        }

        function openEventModal() {
            const modalTitle = document.getElementById("modalTitle");
            const saveBtnText = document.getElementById("saveBtnText");
            const eventForm = document.getElementById("eventForm");
            const editEventId = document.getElementById("editEventId");
            
            if (modalTitle) modalTitle.textContent = "Create New Event";
            if (saveBtnText) saveBtnText.textContent = "Create Event";
            if (eventForm) eventForm.reset();
            if (editEventId) editEventId.value = "";
            resetImageUpload();
            uploadedImageFile = null;
            uploadedImageUrl = null;
            openModal("eventModal");
        }

        async function openEdit(id) {
            if (!supabaseClient) return;
            const { data, error } = await supabaseClient.from("events").select("*").eq("id", id).single();
            if (error || !data) { showNotification("Failed to load event", "error"); return; }
            
            const modalTitle = document.getElementById("modalTitle");
            const saveBtnText = document.getElementById("saveBtnText");
            const editEventId = document.getElementById("editEventId");
            const eventTitle = document.getElementById("eventTitle");
            const eventClient = document.getElementById("eventClient");
            const eventDesc = document.getElementById("eventDesc");
            const eventStart = document.getElementById("eventStart");
            const eventEnd = document.getElementById("eventEnd");
            const eventIsPast = document.getElementById("eventIsPast");
            const eventFeatured = document.getElementById("eventFeatured");
            
            if (modalTitle) modalTitle.textContent = "Edit Event";
            if (saveBtnText) saveBtnText.textContent = "Save Changes";
            if (editEventId) editEventId.value = data.id;
            if (eventTitle) eventTitle.value = data.title || "";
            if (eventClient) eventClient.value = data.client_name || "";
            if (eventDesc) eventDesc.value = data.description || "";
            if (eventStart) eventStart.value = data.start_date ? data.start_date.slice(0, 16) : "";
            if (eventEnd) eventEnd.value = data.end_date ? data.end_date.slice(0, 16) : "";
            if (eventIsPast) eventIsPast.checked = !!data.is_past;
            if (eventFeatured) eventFeatured.checked = !!data.is_featured;
            
            if (data.hero_url) { 
                showImagePreview(data.hero_url); 
                uploadedImageUrl = data.hero_url;
            } else { 
                resetImageUpload(); 
            }
            openModal("eventModal");
        }

        async function saveEvent() {
            if (!supabaseClient) { showNotification("Supabase not configured", "error"); return; }
            const id = document.getElementById("editEventId")?.value;
            const title = document.getElementById("eventTitle")?.value.trim();
            const start = document.getElementById("eventStart")?.value;
            
            if (!title) { showNotification("Event title required", "warning"); return; }
            if (!start) { showNotification("Start date required", "warning"); return; }

            let imageUrl = uploadedImageUrl;
            
            if (uploadedImageFile) {
                const fileExt = uploadedImageFile.name.split(".").pop();
                const fileName = `event_${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
                const bucketName = "event-images";
                
                try {
                    const { error: uploadError } = await supabaseClient.storage
                        .from(bucketName)
                        .upload(fileName, uploadedImageFile);
                    
                    if (!uploadError) {
                        const { data: urlData } = supabaseClient.storage
                            .from(bucketName)
                            .getPublicUrl(fileName);
                        imageUrl = urlData.publicUrl;
                    } else {
                        console.error("Upload error:", uploadError);
                        showNotification("Failed to upload image: " + uploadError.message, "error");
                        return;
                    }
                } catch (err) {
                    console.error("Upload exception:", err);
                    showNotification("Failed to upload image", "error");
                    return;
                }
            }

            const payload = {
                title,
                client_name: document.getElementById("eventClient")?.value.trim() || null,
                description: document.getElementById("eventDesc")?.value.trim() || null,
                start_date: start,
                end_date: document.getElementById("eventEnd")?.value || null,
                is_past: document.getElementById("eventIsPast")?.checked || false,
                is_featured: document.getElementById("eventFeatured")?.checked || false,
                is_public: false,
                hero_url: imageUrl || null
            };

            let result;
            if (id) {
                result = await supabaseClient.from("events").update(payload).eq("id", id);
            } else {
                result = await supabaseClient.from("events").insert([payload]);
            }

            if (result.error) { 
                showNotification(result.error.message, "error"); 
                return; 
            }
            showNotification(id ? "Event updated" : "Event created", "success");
            closeModal("eventModal");
            loadEvents();
        }

        // ============================================
        // IMAGE UPLOAD HANDLING (No Video)
        // ============================================
        function previewImage(input) {
            if (input.files && input.files[0]) {
                uploadedImageFile = input.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    showImagePreview(e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        function showImagePreview(src) {
            const uploadPlaceholder = document.getElementById("uploadPlaceholder");
            const imagePreview = document.getElementById("imagePreview");
            const previewImg = document.getElementById("previewImg");
            
            if (uploadPlaceholder) uploadPlaceholder.style.display = "none";
            if (imagePreview) imagePreview.style.display = "block";
            if (previewImg) previewImg.src = src;
        }

        function resetImageUpload() {
            const uploadPlaceholder = document.getElementById("uploadPlaceholder");
            const imagePreview = document.getElementById("imagePreview");
            const previewImg = document.getElementById("previewImg");
            const eventImageInput = document.getElementById("eventImageInput");
            
            if (uploadPlaceholder) uploadPlaceholder.style.display = "block";
            if (imagePreview) imagePreview.style.display = "none";
            if (previewImg) previewImg.src = "";
            if (eventImageInput) eventImageInput.value = "";
            uploadedImageFile = null;
            uploadedImageUrl = null;
        }

        function removeImage(e) {
            if (e) e.stopPropagation();
            resetImageUpload();
        }

        function toggleActionMenu(btn) { 
            const dropdown = btn.nextElementSibling; 
            document.querySelectorAll(".action-dropdown.active").forEach(d => { 
                if (d !== dropdown) d.classList.remove("active"); 
            }); 
            if (dropdown) dropdown.classList.toggle("active"); 
        }

        function closeAllDropdowns() { 
            document.querySelectorAll(".action-dropdown.active").forEach(d => d.classList.remove("active")); 
        }

        document.addEventListener("click", (e) => { 
            if (!e.target.closest(".action-dropdown-wrap")) closeAllDropdowns(); 
        });

        function escapeHtml(text) { 
            if (!text) return ""; 
            const div = document.createElement("div"); 
            div.textContent = text; 
            return div.innerHTML; 
        }

        function handleLogout() { 
            window.location.href = "../index.html"; 
        }

        // Initialize
        document.addEventListener("DOMContentLoaded", () => { 
            loadEvents(); 
        });
 