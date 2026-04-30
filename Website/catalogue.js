let allPastEvents = [];
let allFeaturedEvents = [];
let currentFilter = 'all';
let activeTab = 'featured'; // 'featured' or 'past'
let supabaseClient = null;


// Initialize Supabase client
async function initSupabase() {
    try {
        // Try to get existing Supabase client from window
        if (window.supabaseClient) {
            supabaseClient = window.supabaseClient;
            console.log("Using existing Supabase client");
        } else if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log("Created new Supabase client");
        } else {
            console.error("Supabase library not loaded.");
            showEmptyState("Supabase not configured. Please contact support.");
            return;
        }
        
        await loadAllEvents();
    } catch (error) {
        console.error("Failed to initialize Supabase:", error);
        showEmptyState("Failed to connect to database. Please try again later.");
    }
}

// Load both past and featured events
async function loadAllEvents() {
    if (!supabaseClient) {
        console.error("Supabase not initialized");
        return;
    }

    try {
        // Load Past Events (is_past = true)
        const { data: pastEvents, error: pastError } = await supabaseClient
            .from('events')
            .select('*')
            .eq('is_past', true)
            .order('start_date', { ascending: false });

        if (pastError) {
            console.error("Error loading past events:", pastError);
        } else {
            allPastEvents = pastEvents || [];
            // Fetch gallery and videos for past events
            for (let event of allPastEvents) {
                await fetchEventMedia(event);
            }
        }

        // Load Featured Events (is_featured = true AND is_past = false)
        const { data: featuredEvents, error: featuredError } = await supabaseClient
            .from('events')
            .select('*')
            .eq('is_featured', true)
            .eq('is_past', false)
            .order('start_date', { ascending: true });

        if (featuredError) {
            console.error("Error loading featured events:", featuredError);
        } else {
            allFeaturedEvents = featuredEvents || [];
        }

        console.log(`Loaded ${allPastEvents.length} past events and ${allFeaturedEvents.length} featured events`);
        
        // Render the active tab
        renderCurrentTab();
        
    } catch (error) {
        console.error("Error loading events:", error);
        showEmptyState("Error loading events. Please refresh and try again.");
    }
}

// Fetch gallery images and videos for an event
async function fetchEventMedia(event) {
    // Fetch gallery images
    const { data: photos } = await supabaseClient
        .from('event_photos')
        .select('*')
        .eq('event_id', event.id)
        .order('uploaded_at', { ascending: true });
    
    event.gallery = photos?.map(p => p.image_url) || [];
    
    // Fetch videos
    const { data: videos } = await supabaseClient
        .from('event_videos')
        .select('*')
        .eq('event_id', event.id)
        .order('position', { ascending: true });
    
    event.videos = videos || [];
    event.video = event.videos.length > 0 ? event.videos[0].video_url : null;
}

// Render the current active tab
function renderCurrentTab() {
    if (activeTab === 'featured') {
        renderFeaturedEvents();
    } else {
        renderPastEvents();
    }
}

// Render Featured Events (no images - show special card)
function renderFeaturedEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    
    const filtered = currentFilter === 'all' 
        ? allFeaturedEvents 
        : allFeaturedEvents.filter(e => getCategoryDisplay(e.tags) === currentFilter);
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-catalogue" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-star" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px; display: block;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 8px;">No Featured Events</h3>
                <p style="color: var(--text-muted);">Check back soon for our featured events!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map(event => {
        const category = getCategoryDisplay(event.tags);
        const categoryIcon = {
            'ceremonies': 'fa-house',
            'corporate': 'fa-briefcase',
            'festivals': 'fa-burst',
            'conference': 'fa-users',
            'launch': 'fa-rocket'
        }[category] || 'fa-calendar';
        
        const formattedDate = formatEventDate(event.start_date);
        const location = event.location || 'Location TBD';
        const description = event.description || 'No description available.';
        
        return `
            <div class="event-card reveal featured-card" data-category="${category}" onclick="openEventModal('${event.id}', true)">
                <div class="event-media featured-media">
                    <div class="featured-placeholder">
                        <i class="fas fa-star"></i>
                        <span>Featured Event</span>
                    </div>
                    <div class="event-media-overlay"></div>
                    <span class="event-badge"><i class="fas ${categoryIcon}"></i> ${category}</span>
                </div>
                <div class="event-info">
                    <h3>${escapeHtml(event.title)}</h3>
                    <p>${escapeHtml(description.substring(0, 100))}${description.length > 100 ? '...' : ''}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-calendar"></i> ${escapeHtml(formattedDate)}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(location)}</span>
                        ${event.client_name ? `<span><i class="fas fa-building"></i> ${escapeHtml(event.client_name)}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    initRevealAnimations();
}

// Render Past Events (with images and videos)
function renderPastEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    
    const filtered = currentFilter === 'all' 
        ? allPastEvents 
        : allPastEvents.filter(e => getCategoryDisplay(e.tags) === currentFilter);
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-catalogue" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-calendar-times" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px; display: block;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 8px;">No Past Events Found</h3>
                <p style="color: var(--text-muted);">Check back soon for our event gallery!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map(event => {
        const category = getCategoryDisplay(event.tags);
        const categoryIcon = {
            'ceremonies': 'fa-house',
            'corporate': 'fa-briefcase',
            'festivals': 'fa-burst',
            'conference': 'fa-users',
            'launch': 'fa-rocket'
        }[category] || 'fa-calendar';
        
        const formattedDate = formatEventDate(event.start_date);
        const guestCount = formatGuestCount(event.guest_count);
        const location = event.location || 'Location TBD';
        const description = event.description || 'No description available.';
        const hasVideo = event.video !== null;
        const heroImage = event.hero_url || 'https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image';
        
        return `
            <div class="event-card reveal" data-category="${category}" onclick="openEventModal('${event.id}', false)">
                <div class="event-media">
                    ${hasVideo ? `
                        <video muted loop playsinline poster="${heroImage}">
                            <source src="${event.video}" type="video/mp4">
                        </video>
                        <div class="event-play"><i class="fas fa-play"></i></div>
                    ` : `
                        <img src="${heroImage}" alt="${escapeHtml(event.title)}">
                    `}
                    <div class="event-media-overlay"></div>
                    <span class="event-badge"><i class="fas ${categoryIcon}"></i> ${category}</span>
                </div>
                <div class="event-info">
                    <h3>${escapeHtml(event.title)}</h3>
                    <p>${escapeHtml(description.substring(0, 100))}${description.length > 100 ? '...' : ''}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-calendar"></i> ${escapeHtml(formattedDate)}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(location)}</span>
                        <span><i class="fas fa-users"></i> ${escapeHtml(guestCount)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    initRevealAnimations();
    
    // Video hover play for past events
    document.querySelectorAll('.event-card video').forEach(video => {
        const card = video.closest('.event-card');
        if (card) {
            card.addEventListener('mouseenter', () => video.play());
            card.addEventListener('mouseleave', () => { 
                video.pause(); 
                video.currentTime = 0; 
            });
        }
    });
}

// Get category display name
function getCategoryDisplay(tags) {
    if (!tags) return 'ceremonies';
    if (Array.isArray(tags) && tags.length > 0) {
        const category = tags[0].toLowerCase();
        const validCategories = ['ceremonies', 'corporate', 'festivals', 'conference', 'launch'];
        return validCategories.includes(category) ? category : 'ceremonies';
    }
    if (typeof tags === 'string') {
        const category = tags.toLowerCase();
        const validCategories = ['ceremonies', 'corporate', 'festivals', 'conference', 'launch'];
        return validCategories.includes(category) ? category : 'ceremonies';
    }
    return 'ceremonies';
}

// Format date nicely
function formatEventDate(dateStr) {
    if (!dateStr) return 'Date TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// Format guest count
function formatGuestCount(count) {
    if (!count) return '0 Guests';
    return count.toLocaleString() + ' Guests';
}

// Open event modal
async function openEventModal(eventId, isFeatured) {
    let event = allFeaturedEvents.find(e => e.id === eventId);
    if (!event) {
        event = allPastEvents.find(e => e.id === eventId);
    }
    if (!event) return;
    
    const modal = document.getElementById('eventModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body) return;
    
    const category = getCategoryDisplay(event.tags);
    const categoryIcon = {
        'ceremonies': 'fa-house',
        'corporate': 'fa-briefcase',
        'festivals': 'fa-burst',
        'conference': 'fa-users',
        'launch': 'fa-rocket'
    }[category] || 'fa-calendar';
    
    const formattedDate = formatEventDate(event.start_date);
    const guestCount = formatGuestCount(event.guest_count);
    const location = event.location || 'Location TBD';
    const description = event.description || 'No description available.';
    const hasVideo = event.video !== null;
    const gallery = event.gallery || [];
    const videos = event.videos || [];
    const heroImage = event.hero_url || 'https://placehold.co/800x400/1a1a2e/ffffff?text=No+Image';
    const isFeaturedEvent = event.is_featured === true;
    
    let galleryHtml = '';
    if (gallery.length > 0 && !isFeaturedEvent) {
        galleryHtml = `
            <div class="modal-gallery">
                ${gallery.map(img => `<img src="${img}" alt="${escapeHtml(event.title)}">`).join('')}
            </div>
        `;
    }
    
    let videosHtml = '';
    if (videos.length > 0 && !isFeaturedEvent) {
        videosHtml = `
            <div class="modal-videos">
                <h4 style="margin: 20px 0 10px; color: var(--text-primary);">Event Videos</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                    ${videos.map(v => `
                        <video controls style="width: 100%; border-radius: 8px;" poster="${heroImage}">
                            <source src="${v.video_url}" type="video/mp4">
                        </video>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    const featuredBadge = isFeaturedEvent ? '<span class="featured-event-badge"><i class="fas fa-star"></i> Featured Event</span>' : '';
    
    body.innerHTML = `
        <div class="modal-hero ${isFeaturedEvent ? 'featured-modal-hero' : ''}">
            ${hasVideo && !isFeaturedEvent ? `
                <video autoplay muted loop playsinline poster="${heroImage}">
                    <source src="${event.video}" type="video/mp4">
                </video>
            ` : !isFeaturedEvent ? `
                <img src="${heroImage}" alt="${escapeHtml(event.title)}">
            ` : `
                <div class="featured-modal-placeholder">
                    <i class="fas fa-star"></i>
                    <h2>${escapeHtml(event.title)}</h2>
                </div>
            `}
            <div class="modal-hero-overlay"></div>
            <div class="modal-hero-content">
                ${featuredBadge}
                <span class="modal-badge"><i class="fas ${categoryIcon}"></i> ${category}</span>
                <h2>${escapeHtml(event.title)}</h2>
            </div>
        </div>
        <div class="modal-details">
            <div class="event-meta" style="margin-bottom:20px;">
                <span><i class="fas fa-calendar"></i> ${escapeHtml(formattedDate)}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(location)}</span>
                ${!isFeaturedEvent ? `<span><i class="fas fa-users"></i> ${escapeHtml(guestCount)}</span>` : ''}
                ${event.client_name ? `<span><i class="fas fa-building"></i> ${escapeHtml(event.client_name)}</span>` : ''}
            </div>
            <p>${escapeHtml(description)}</p>
            ${galleryHtml}
            ${videosHtml}
            <div class="modal-cta">
                <a href="contact.html" class="btn-primary">
                    <span>Plan a Similar Event</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        const videos = modal.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }
}

function showEmptyState(message = 'No events found') {
    const grid = document.getElementById('eventsGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="empty-catalogue" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-calendar-times" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px; display: block;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 8px;">${escapeHtml(message)}</h3>
                <p style="color: var(--text-muted);">Check back soon for updates!</p>
            </div>
        `;
    }
}

function initRevealAnimations() {
    const reveals = document.querySelectorAll('.event-card.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderCurrentTab();
        });
    });
}

function initTabs() {
    let tabContainer = document.querySelector('.catalogue-tabs');
    if (!tabContainer) {
        const filterSection = document.querySelector('.filter-section');
        if (filterSection) {
            tabContainer = document.createElement('div');
            tabContainer.className = 'catalogue-tabs';
            tabContainer.innerHTML = `
                <button class="catalogue-tab active" data-tab="featured">
                    <i class="fas fa-star"></i> Featured Events
                </button>
                <button class="catalogue-tab" data-tab="past">
                    <i class="fas fa-clock-rotate-left"></i> Past Events
                </button>
            `;
            filterSection.parentNode.insertBefore(tabContainer, filterSection);
        }
    }
    
    const tabs = document.querySelectorAll('.catalogue-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.getAttribute('data-tab');
            renderCurrentTab();
        });
    });
}

function initModal() {
    const closeBtn = document.querySelector('.modal-close');
    const backdrop = document.querySelector('.modal-backdrop');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    if (backdrop) {
        backdrop.addEventListener('click', closeModal);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });
    }
}

function initThemeSwitcher() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    if (themeToggle) {
        // Remove any existing listeners to prevent duplicates
        const newToggle = themeToggle.cloneNode(true);
        themeToggle.parentNode.replaceChild(newToggle, themeToggle);
        
        newToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Re-render current tab to update styles
            renderCurrentTab();
        });
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    }
}

function initChatbot() {
    const chatBtn = document.querySelector('.chatbot-btn');
    const chatWindow = document.querySelector('.chatbot-window');
    const chatClose = document.querySelector('.chatbot-close');
    
    if (chatBtn && chatWindow) {
        // Remove existing listeners
        const newChatBtn = chatBtn.cloneNode(true);
        chatBtn.parentNode.replaceChild(newChatBtn, chatBtn);
        
        newChatBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
        });
    }
    
    if (chatClose && chatWindow) {
        const newChatClose = chatClose.cloneNode(true);
        chatClose.parentNode.replaceChild(newChatClose, chatClose);
        
        newChatClose.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });
    }
}

function initParticles() {
    const container = document.querySelector('.particles-container');
    if (container && container.children.length === 0) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = 3 + Math.random() * 4 + 's';
            container.appendChild(particle);
        }
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save active tab to localStorage
function saveActiveTab() {
    localStorage.setItem('catalogue_active_tab', activeTab);
}

function loadSavedTab() {
    const savedTab = localStorage.getItem('catalogue_active_tab');
    if (savedTab && (savedTab === 'featured' || savedTab === 'past')) {
        activeTab = savedTab;
    }
}

// Save filter to localStorage
function saveFilter() {
    localStorage.setItem('catalogue_current_filter', currentFilter);
}

function loadSavedFilter() {
    const savedFilter = localStorage.getItem('catalogue_current_filter');
    if (savedFilter) {
        currentFilter = savedFilter;
        // Update active filter button
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === savedFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadSavedTab();
    loadSavedFilter();
    initParticles();
    initFilters();
    initTabs();
    initModal();
    initMobileMenu();
    initThemeSwitcher();
    initChatbot();
    initSupabase();
    
    // Save tab and filter when changed
    window.addEventListener('beforeunload', () => {
        saveActiveTab();
        saveFilter();
    });
});

// Also save when tab/filter changes via event listeners
const originalRenderCurrentTab = renderCurrentTab;
renderCurrentTab = function() {
    saveActiveTab();
    originalRenderCurrentTab();
};

const originalApplyFilter = function() {
    saveFilter();
};