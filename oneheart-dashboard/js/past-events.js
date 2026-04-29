const { data: { session } } = await window.supabaseClient.auth.getSession();

if (!session) {
  window.location.href = "/login.html";
}
document.addEventListener('DOMContentLoaded', () => {
    const supabase = window.supabaseClient;
    if (!supabase) {
        // Supabase client missing — abort
        return;
    }

    // DOM Elements
    const modal = document.getElementById('eventModal');
    const closeModalBtn = document.getElementById('closeModal');
    const uploadArea = document.getElementById('uploadArea');
    const galleryInput = document.getElementById('galleryInput');
    const galleryGrid = document.getElementById('galleryGrid');

    let currentEventId = null;

    // Load Events
    async function loadEvents() {
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .order('start_date', { ascending: false });

        if (error) {
            // Error loading events — abort
            return;
        }

        renderFeatured(events.filter(e => e.is_featured && !e.is_past));
        renderPast(events.filter(e => e.is_past));
    }

    // Render Featured Events
    function renderFeatured(events) {
        const container = document.getElementById('featuredEvents');
        if (!events.length) {
            container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:40px;">No featured events</p>';
            return;
        }

        container.innerHTML = events.map(event => `
            <div class="event-card">
                <div class="image">
                    <img src="${event.image_url || ''}" alt="${event.title}">
                </div>
                <div class="content">
                    <h3>${event.title}</h3>
                    <p>${formatDate(event.start_date)}</p>
                    <small>${event.client_name || ''}</small>
                </div>
                <div class="card-actions">
                    <button class="card-btn view" onclick="window.openModal('${event.id}')">${window.t('btn.viewDetails')}</button>
                    <button class="card-btn upload" onclick="window.uploadCover('${event.id}')">${window.t('btn.uploadCover')}</button>
                </div>
            </div>
        `).join('');
    }

    // Render Past Events
    function renderPast(events) {
        const container = document.getElementById('pastEvents');
        if (!events.length) {
            container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:40px;">No past events</p>';
            return;
        }

        container.innerHTML = events.map(event => `
            <div class="event-card">
                <div class="image">
                    <img src="${event.image_url || ''}" alt="${event.title}">
                </div>
                <div class="content">
                    <h3>${event.title}</h3>
                    <small>${formatDate(event.start_date)}</small>
                </div>
                <div class="card-actions">
                    <button class="card-btn view" onclick="window.openModal('${event.id}')">${window.t('btn.viewDetailsGallery')}</button>
                    <button class="card-btn upload" onclick="window.uploadCover('${event.id}')">${window.t('btn.uploadCover')}</button>
                    <button class="card-btn delete" onclick="window.deleteCover('${event.id}')" ${!event.image_url ? 'disabled' : ''}>${window.t('btn.removeCover')}</button>
                </div>
            </div>
        `).join('');
    }

    // Format Date
    function formatDate(dateStr) {
        if (!dateStr) return 'Date not set';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Open Modal
    window.openModal = async (id) => {
        currentEventId = id;
        const { data: event, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            alert('Failed to load event: ' + error.message);
            return;
        }

        document.getElementById('modalTitle').textContent = event.title;
        document.getElementById('modalEventTitle').textContent = event.title;
        document.getElementById('modalEventDate').textContent = formatDate(event.start_date);
        document.getElementById('modalEventClient').textContent = event.client_name || 'N/A';
        document.getElementById('modalEventStatus').textContent = event.is_past ? 'Completed' : 'Upcoming';

        const coverImg = document.getElementById('modalCover');
        coverImg.src = event.image_url || '';

        // Only show gallery for past events
        if (event.is_past) {
            document.querySelector('.modal-right').style.display = 'block';
            loadGallery(id);
        } else {
            document.querySelector('.modal-right').style.display = 'none';
        }

        modal.classList.add('active');
    };

    // Close Modal
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        galleryGrid.innerHTML = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            galleryGrid.innerHTML = '';
        }
    });

    // Load Gallery
    async function loadGallery(eventId) {
        galleryGrid.innerHTML = '<p style="color:var(--text-muted);">Loading...</p>';
        
        const { data: photos, error } = await supabase
            .from('event_photos')
            .select('*')
            .eq('event_id', eventId)
            .order('uploaded_at', { ascending: false });

        if (error) {
            galleryGrid.innerHTML = '<p style="color:#ef4444;">Failed to load gallery.</p>';
            return;
        }

        if (!photos || photos.length === 0) {
            galleryGrid.innerHTML = '<p style="color:var(--text-muted);">No photos uploaded yet</p>';
            return;
        }

        galleryGrid.innerHTML = photos.map(photo => `
            <div class="gallery-item">
                <img src="${photo.image_url}" alt="Gallery photo">
                <button class="gallery-delete" onclick="window.deletePhoto('${photo.id}')">×</button>
            </div>
        `).join('');
    }

    // Upload Gallery Photos
    uploadArea.addEventListener('click', () => galleryInput.click());

    galleryInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

            uploadArea.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><p>' + (window.t ? window.t('status.uploading') : 'Uploading...') + '</p>';
        uploadArea.style.pointerEvents = 'none';

        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} is too large (max 5MB)`);
                continue;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = async () => {
                const { error } = await supabase
                    .from('event_photos')
                    .insert({
                        event_id: currentEventId,
                        image_url: reader.result,
                        uploaded_at: new Date().toISOString()
                    });

                if (error) {
                    alert(`Failed to upload ${file.name}: ${error.message}`);
                }
            };

            reader.onerror = () => {
                alert(`Failed to read ${file.name}`);
            };
        }

        // Reload gallery after uploads
        setTimeout(() => {
            loadGallery(currentEventId);
            uploadArea.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i><p>' + (window.t ? window.t('click_to_upload') : 'Click to upload photos') + '</p>';
            uploadArea.style.pointerEvents = 'auto';
            galleryInput.value = '';
        }, 1500);
    });

    // Delete Photo
    window.deletePhoto = async (photoId) => {
        if (!confirm(window.t ? window.t('confirm.delete_photo') : 'Delete this photo?')) return;
        
            const { error } = await supabase
            .from('event_photos')
            .delete()
            .eq('id', photoId);

        if (error) {
                alert((window.t ? window.t('failed_delete_photo') : 'Failed to delete photo') + ': ' + error.message);
        } else {
            loadGallery(currentEventId);
        }
    };

    // Upload Cover
    window.uploadCover = async (eventId) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
                alert('Please select an image under 5MB');
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = async () => {
                const { error } = await supabase
                    .from('events')
                    .update({ image_url: reader.result })
                    .eq('id', eventId);

                if (error) {
                    alert('Failed to upload cover: ' + error.message);
                } else {
                    loadEvents();
                }
            };
        };
        
        input.click();
    };

    // Delete Cover
    window.deleteCover = async (eventId) => {
        if (!confirm('Remove cover image?')) return;
        
        const { error } = await supabase
            .from('events')
            .update({ image_url: null })
            .eq('id', eventId);

        if (error) {
            alert('Failed to remove cover: ' + error.message);
        } else {
            loadEvents();
        }
    };

    // Initialize
    loadEvents();
});