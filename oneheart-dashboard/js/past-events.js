let allPastEvents = [];
let currentEventId = null;
let currentEventData = null;
let activeUploadType = 'image';

try {
    supabaseClient = window.supabaseClient || supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch(e) { console.error("Supabase error:", e); }

(async () => {
    if (supabaseClient) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session && window.location.pathname !== '/login.html') {
            window.location.href = "../index.html";
        }
    }
    loadPastEvents();
})();

async function loadPastEvents() {
    if (!supabaseClient) return;
    const { data, error } = await supabaseClient
        .from("events")
        .select("*")
        .eq("is_past", true)
        .order("start_date", { ascending: false });
    if (error) { console.error(error); return; }
    allPastEvents = data || [];
    populateMonthFilter();
    applyFilters();
}

function populateMonthFilter() {
    const months = new Set();
    allPastEvents.forEach(e => {
        if (e.start_date) {
            const d = new Date(e.start_date);
            months.add(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
        }
    });
    const sorted = Array.from(months).sort().reverse();
    const monthSelect = document.getElementById('monthFilter');
    if (monthSelect) {
        monthSelect.innerHTML = '<option value="all">All Months</option>';
        sorted.forEach(m => {
            const [year, month] = m.split('-');
            const date = new Date(year, month-1);
            const monthName = date.toLocaleString('default', { month: 'long' });
            monthSelect.innerHTML += `<option value="${m}">${monthName} ${year}</option>`;
        });
    }
}

function applyFilters() {
    const tagFilter = document.getElementById('tagFilter')?.value || 'all';
    const monthFilter = document.getElementById('monthFilter')?.value || 'all';
    let filtered = [...allPastEvents];
    
    if (tagFilter !== 'all') {
        filtered = filtered.filter(e => {
            if (!e.tags) return false;
            if (Array.isArray(e.tags)) {
                return e.tags.includes(tagFilter);
            }
            return e.tags === tagFilter;
        });
    }
    
    if (monthFilter !== 'all') {
        filtered = filtered.filter(e => {
            if (!e.start_date) return false;
            const d = new Date(e.start_date);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` === monthFilter;
        });
    }
    renderPastEvents(filtered);
    updateStats(filtered);
}

function getTagValue(tags) {
    if (!tags) return 'corporate';
    if (Array.isArray(tags) && tags.length > 0) return tags[0];
    if (typeof tags === 'string') return tags;
    return 'corporate';
}

// Helper function to get visibility status (handles null/undefined)
function getVisibilityStatus(isPublic) {
    // If is_public is true, return public, otherwise internal
    return isPublic === true;
}

function renderPastEvents(events) {
    const container = document.getElementById('pastEventsGrid');
    const emptyState = document.getElementById('emptyState');
    if (!events.length) {
        if (container) container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }
    if (emptyState) emptyState.style.display = 'none';
    if (!container) return;
    
    container.innerHTML = events.map(e => {
        const date = e.start_date ? new Date(e.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date TBD';
        const tagValue = getTagValue(e.tags);
        const tagClass = `tag-${tagValue}`;
        const tagName = tagValue.toUpperCase();
        const guestCount = e.guest_count ? e.guest_count.toLocaleString() : '0';
        // FIX: Explicitly check for true value
        const isPublic = e.is_public === true;
        const visibilityIcon = isPublic ? 'fa-globe' : 'fa-lock';
        const visibilityText = isPublic ? 'Public' : 'Internal';
        const visibilityClass = isPublic ? 'visibility-public' : 'visibility-internal';
        
        return `
            <div class="past-event-card" onclick="openEventDetails('${e.id}')">
                ${e.hero_url ? `<img src="${e.hero_url}" class="past-event-image" onerror="this.src=''">` : 
                    `<div class="past-event-image-placeholder"><i class="fa-solid fa-calendar-alt"></i></div>`}
                <div class="past-event-content">
                    <div class="past-event-title">${escapeHtml(e.title)}</div>
                    <div class="past-event-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${date}</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(e.location) || 'N/A'}</span>
                        <span><i class="fa-solid fa-users"></i> ${guestCount}</span>
                        <span class="visibility-badge ${visibilityClass}" onclick="event.stopPropagation(); toggleVisibilityFromCard('${e.id}', ${isPublic})">
                            <i class="fa-solid ${visibilityIcon}"></i> ${visibilityText}
                        </span>
                    </div>
                    <span class="event-tag ${tagClass}">${tagName}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle visibility from card
async function toggleVisibilityFromCard(eventId, currentPublic) {
    const newVisibility = !currentPublic;
    const { error } = await supabaseClient
        .from('events')
        .update({ is_public: newVisibility })
        .eq('id', eventId);
    
    if (error) {
        showNotification('Failed to update visibility: ' + error.message, 'error');
    } else {
        showNotification(`Event is now ${newVisibility ? 'public' : 'internal'}`, 'success');
        loadPastEvents(); // Reload to update the card
    }
}

function updateStats(events) {
    const totalGuestCount = events.reduce((sum, e) => sum + (e.guest_count || 0), 0);
    // FIX: Count only events where is_public === true
    const publicCount = events.filter(e => e.is_public === true).length;
    const statsDiv = document.getElementById('statsContainer');
    if (statsDiv) {
        statsDiv.innerHTML = `
            <div class="stat-badge"><strong>${events.length}</strong> Events</div>
            <div class="stat-badge"><strong>${totalGuestCount.toLocaleString()}</strong> Total Guests</div>
            <div class="stat-badge"><strong>${publicCount}</strong> Public Events</div>
        `;
    }
}

async function openEventDetails(id) {
    currentEventId = id;
    currentEventData = allPastEvents.find(e => e.id === id);
    if (!currentEventData) return;
    
    const modalCover = document.getElementById('modalCover');
    if (modalCover) modalCover.src = currentEventData.hero_url || '';
    updateDisplayValues();
    openModal('eventModal');
    loadGallery(id);
    loadVideos(id);
}

function updateDisplayValues() {
    const tagNames = { corporate: 'Corporate', ceremonies: 'Ceremonies', festivals: 'Festivals', conferences: 'Conferences', launches: 'Launches' };
    const tagValue = getTagValue(currentEventData.tags);
    
    const displayTitle = document.getElementById('displayTitle');
    if (displayTitle) displayTitle.textContent = currentEventData.title || '—';
    
    const displayDate = document.getElementById('displayDate');
    if (displayDate) {
        displayDate.textContent = currentEventData.start_date ? new Date(currentEventData.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
    }
    
    const displayLocation = document.getElementById('displayLocation');
    if (displayLocation) displayLocation.textContent = currentEventData.location || '—';
    
    const displayGuests = document.getElementById('displayGuests');
    if (displayGuests) displayGuests.textContent = currentEventData.guest_count ? currentEventData.guest_count.toLocaleString() : '0';
    
    const displayTag = document.getElementById('displayTag');
    if (displayTag) {
        displayTag.innerHTML = `<span class="event-tag tag-${tagValue}">${tagNames[tagValue] || 'Corporate'}</span>`;
    }
    
    const displayClient = document.getElementById('displayClient');
    if (displayClient) displayClient.textContent = currentEventData.client_name || '—';
    
    const displayDesc = document.getElementById('displayDesc');
    if (displayDesc) displayDesc.textContent = currentEventData.description || '—';
    
    // FIX: Update visibility display in modal
    const visibilityDisplay = document.getElementById('displayVisibility');
    if (visibilityDisplay) {
        const isPublic = currentEventData.is_public === true;
        visibilityDisplay.innerHTML = `<span class="visibility-badge ${isPublic ? 'visibility-public' : 'visibility-internal'}">
            <i class="fa-solid ${isPublic ? 'fa-globe' : 'fa-lock'}"></i> ${isPublic ? 'Public' : 'Internal'}
        </span>`;
    }
    
    const editTitle = document.getElementById('editTitle');
    if (editTitle) editTitle.value = currentEventData.title || '';
    
    const editDate = document.getElementById('editDate');
    if (editDate) editDate.value = currentEventData.start_date ? currentEventData.start_date.slice(0,10) : '';
    
    const editLocation = document.getElementById('editLocation');
    if (editLocation) editLocation.value = currentEventData.location || '';
    
    const editGuests = document.getElementById('editGuests');
    if (editGuests) editGuests.value = currentEventData.guest_count || 0;
    
    const editTag = document.getElementById('editTag');
    if (editTag) editTag.value = tagValue;
    
    const editClient = document.getElementById('editClient');
    if (editClient) editClient.value = currentEventData.client_name || '';
    
    const editDesc = document.getElementById('editDesc');
    if (editDesc) editDesc.value = currentEventData.description || '';
    
    // FIX: Set checkbox based on actual boolean value
    const editVisibility = document.getElementById('editVisibility');
    if (editVisibility) {
        editVisibility.checked = currentEventData.is_public === true;
    }
}

function setUploadType(type) {
    activeUploadType = type;
    const imageUploadArea = document.getElementById('imageUploadArea');
    const videoUploadArea = document.getElementById('videoUploadArea');
    const galleryGrid = document.getElementById('galleryGrid');
    const videoGrid = document.getElementById('videoGrid');
    const imageTab = document.getElementById('imageTab');
    const videoTab = document.getElementById('videoTab');
    
    if (type === 'image') {
        if (imageUploadArea) imageUploadArea.style.display = 'block';
        if (videoUploadArea) videoUploadArea.style.display = 'none';
        if (galleryGrid) galleryGrid.style.display = 'grid';
        if (videoGrid) videoGrid.style.display = 'none';
        if (imageTab) imageTab.classList.add('active');
        if (videoTab) videoTab.classList.remove('active');
    } else {
        if (imageUploadArea) imageUploadArea.style.display = 'none';
        if (videoUploadArea) videoUploadArea.style.display = 'block';
        if (galleryGrid) galleryGrid.style.display = 'none';
        if (videoGrid) videoGrid.style.display = 'grid';
        if (imageTab) imageTab.classList.remove('active');
        if (videoTab) videoTab.classList.add('active');
    }
}

function editField() {
    const displayFields = ['displayTitle', 'displayDate', 'displayLocation', 'displayGuests', 'displayTag', 'displayClient', 'displayDesc', 'displayVisibility'];
    const editFields = ['editTitle', 'editDate', 'editLocation', 'editGuests', 'editTag', 'editClient', 'editDesc', 'editVisibility'];
    
    displayFields.forEach(field => {
        const el = document.getElementById(field);
        if (el) el.style.display = 'none';
    });
    editFields.forEach(field => {
        const el = document.getElementById(field);
        if (el) el.style.display = 'block';
    });
    
    const footer = document.querySelector('#eventModal .modal-footer');
    const existingSave = document.getElementById('inlineSaveBtn');
    if (!existingSave && footer) {
        const saveDiv = document.createElement('div');
        saveDiv.id = 'inlineSaveBtn';
        saveDiv.style.display = 'flex';
        saveDiv.style.gap = '10px';
        saveDiv.style.marginRight = 'auto';
        saveDiv.innerHTML = `
            <button class="btn-primary" onclick="saveAllEdits()" style="padding: 8px 16px;"><i class="fa-solid fa-check"></i> Save All Changes</button>
            <button class="btn-secondary" onclick="cancelAllEdits()" style="padding: 8px 16px;"><i class="fa-solid fa-xmark"></i> Cancel</button>
        `;
        footer.insertBefore(saveDiv, footer.firstChild);
    }
    const editModeBadge = document.getElementById('editModeBadge');
    if (editModeBadge) editModeBadge.style.display = 'inline-block';
}

async function saveAllEdits() {
    const tagValue = document.getElementById('editTag')?.value || 'corporate';
    // FIX: Get the actual checkbox value
    const isPublic = document.getElementById('editVisibility')?.checked === true;
    
    const updates = {
        title: document.getElementById('editTitle')?.value || '',
        start_date: document.getElementById('editDate')?.value || null,
        location: document.getElementById('editLocation')?.value || null,
        guest_count: parseInt(document.getElementById('editGuests')?.value) || 0,
        tags: [tagValue],
        client_name: document.getElementById('editClient')?.value || null,
        description: document.getElementById('editDesc')?.value || null,
        is_public: isPublic
    };
    
    const { error } = await supabaseClient
        .from('events')
        .update(updates)
        .eq('id', currentEventId);
    
    if (error) {
        showNotification('Failed to save: ' + error.message, 'error');
        return;
    }
    
    Object.assign(currentEventData, {...updates, tags: tagValue});
    const idx = allPastEvents.findIndex(e => e.id === currentEventId);
    if (idx !== -1) allPastEvents[idx] = {...currentEventData, tags: tagValue};
    
    updateDisplayValues();
    cancelAllEdits();
    applyFilters();
    showNotification('Event updated successfully', 'success');
}

function cancelAllEdits() {
    const displayFields = ['displayTitle', 'displayDate', 'displayLocation', 'displayGuests', 'displayTag', 'displayClient', 'displayDesc', 'displayVisibility'];
    const editFields = ['editTitle', 'editDate', 'editLocation', 'editGuests', 'editTag', 'editClient', 'editDesc', 'editVisibility'];
    
    displayFields.forEach(field => {
        const el = document.getElementById(field);
        if (el) el.style.display = 'block';
    });
    editFields.forEach(field => {
        const el = document.getElementById(field);
        if (el) el.style.display = 'none';
    });
    
    const saveBtn = document.getElementById('inlineSaveBtn');
    if (saveBtn) saveBtn.remove();
    
    const editModeBadge = document.getElementById('editModeBadge');
    if (editModeBadge) editModeBadge.style.display = 'none';
}

function editCoverImage() {
    document.getElementById('coverInput')?.click();
}

async function uploadNewCover() {
    const file = document.getElementById('coverInput')?.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image', 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
        const { error } = await supabaseClient
            .from('events')
            .update({ hero_url: reader.result })
            .eq('id', currentEventId);
        if (error) {
            showNotification('Failed to update cover', 'error');
        } else {
            currentEventData.hero_url = reader.result;
            const modalCover = document.getElementById('modalCover');
            if (modalCover) modalCover.src = reader.result;
            applyFilters();
            showNotification('Cover image updated', 'success');
        }
    };
    reader.readAsDataURL(file);
}

async function loadGallery(eventId) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:20px;">Loading images...</p>';
    const { data: photos, error } = await supabaseClient
        .from('event_photos')
        .select('*')
        .eq('event_id', eventId)
        .order('uploaded_at', { ascending: false });
    
    if (error || !photos?.length) {
        galleryGrid.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:20px;">No images yet. Click to upload.</p>';
    } else {
        galleryGrid.innerHTML = photos.map(p => `
            <div class="gallery-item">
                <img src="${p.image_url}" alt="Gallery image">
                <button class="gallery-delete" onclick="event.stopPropagation(); deletePhoto('${p.id}')">×</button>
            </div>
        `).join('');
    }
}

async function deletePhoto(photoId) {
    if (!confirm('Delete this image?')) return;
    await supabaseClient.from('event_photos').delete().eq('id', photoId);
    loadGallery(currentEventId);
}

async function loadVideos(eventId) {
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid) return;
    
    videoGrid.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:20px;">Loading videos...</p>';
    const { data: videos, error } = await supabaseClient
        .from('event_videos')
        .select('*')
        .eq('event_id', eventId)
        .order('position', { ascending: true });
    
    if (error || !videos?.length) {
        videoGrid.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:20px;">No videos yet. Click to upload.</p>';
    } else {
        videoGrid.innerHTML = videos.map(v => `
            <div class="gallery-item video-item">
                <video src="${v.video_url}" style="width:100%; height:100%; object-fit:cover;"></video>
                <div class="video-play-overlay" onclick="event.stopPropagation(); playVideo('${v.video_url}')">
                    <i class="fa-solid fa-play"></i>
                </div>
                <button class="gallery-delete" onclick="event.stopPropagation(); deleteVideo('${v.id}')">×</button>
            </div>
        `).join('');
    }
}

function playVideo(videoUrl) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); z-index: 10000;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
    `;
    modal.onclick = () => modal.remove();
    modal.innerHTML = `
        <video controls autoplay style="max-width: 90%; max-height: 90%; border-radius: 8px;">
            <source src="${videoUrl}" type="video/mp4">
        </video>
    `;
    document.body.appendChild(modal);
}

async function deleteVideo(videoId) {
    if (!confirm('Delete this video?')) return;
    const { error } = await supabaseClient
        .from('event_videos')
        .delete()
        .eq('id', videoId);
    
    if (error) {
        showNotification('Failed to delete video: ' + error.message, 'error');
    } else {
        showNotification('Video deleted successfully', 'success');
        loadVideos(currentEventId);
    }
}

// Image Upload
const imageUploadArea = document.getElementById('imageUploadArea');
const galleryInput = document.getElementById('galleryInput');

if (imageUploadArea) {
    imageUploadArea.addEventListener('click', () => galleryInput?.click());
}

if (galleryInput) {
    galleryInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length || !currentEventId) return;
        
        if (imageUploadArea) {
            imageUploadArea.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><p>Uploading images...</p>';
        }
        
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise((resolve) => {
                reader.onload = async () => {
                    await supabaseClient.from('event_photos').insert({
                        event_id: currentEventId,
                        image_url: reader.result,
                        uploaded_at: new Date().toISOString()
                    });
                    resolve();
                };
            });
        }
        
        if (imageUploadArea) {
            imageUploadArea.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i><p>Click to upload images</p>';
        }
        loadGallery(currentEventId);
        if (galleryInput) galleryInput.value = '';
    });
}

// Video Upload
const videoUploadArea = document.getElementById('videoUploadArea');
const videoInput = document.getElementById('videoInput');

if (videoUploadArea) {
    videoUploadArea.addEventListener('click', () => videoInput?.click());
}

if (videoInput) {
    videoInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length || !currentEventId) return;
        
        if (videoUploadArea) {
            videoUploadArea.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><p>Uploading videos...</p>';
        }
        
        for (const file of files) {
            if (!file.type.startsWith('video/')) continue;
            
            const { data: existingVideos } = await supabaseClient
                .from('event_videos')
                .select('position')
                .eq('event_id', currentEventId)
                .order('position', { ascending: false })
                .limit(1);
            
            const nextPosition = (existingVideos && existingVideos[0]?.position !== undefined) 
                ? existingVideos[0].position + 1 
                : 0;
            
            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise((resolve) => {
                reader.onload = async () => {
                    await supabaseClient.from('event_videos').insert({
                        event_id: currentEventId,
                        video_url: reader.result,
                        position: nextPosition,
                        uploaded_at: new Date().toISOString()
                    });
                    resolve();
                };
            });
        }
        
        if (videoUploadArea) {
            videoUploadArea.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i><p>Click to upload videos</p>';
        }
        loadVideos(currentEventId);
        if (videoInput) videoInput.value = '';
    });
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
    cancelAllEdits();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(msg, type) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981'};color:white;padding:12px 20px;border-radius:8px;z-index:9999;font-size:13px;`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function handleLogout() {
    window.location.href = "../index.html";
}

const tagFilter = document.getElementById('tagFilter');
const monthFilter = document.getElementById('monthFilter');

if (tagFilter) tagFilter.addEventListener('change', applyFilters);
if (monthFilter) monthFilter.addEventListener('change', applyFilters);