
const eventsData = [
  {
    id: 1,
    title: "Royal Wedding at Al Faisaliah",
    category: "wedding",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-kissing-at-sunset-4326-large.mp4",
    date: "March 2024",
    location: "Riyadh, Saudi Arabia",
    guests: "350 Guests",
    description: "An enchanting royal wedding that blended traditional Saudi elegance with modern luxury. The Al Faisaliah ballroom was transformed into a garden of white roses and golden accents, creating a fairytale atmosphere for 350 distinguished guests. The evening featured a live orchestra, custom lighting design, and a seven-course gourmet dinner.",
    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"
    ]
  },
  {
    id: 2,
    title: "Tech Summit 2024",
    category: "conference",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop",
    video: null,
    date: "February 2024",
    location: "King Abdullah Financial District",
    guests: "800 Attendees",
    description: "A groundbreaking tech summit bringing together innovators from across the Middle East. The event featured keynote speeches from industry leaders, interactive workshops, and a startup pitch competition. Our team managed everything from registration to live streaming, ensuring a seamless experience for all 800 attendees.",
    gallery: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop"
    ]
  },
  {
    id: 3,
    title: "Neon Nights Birthday Bash",
    category: "birthday",
    image: "https://images.unsplash.com/photo-1530103862676-de3c9a59aa38?w=600&h=400&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-people-dancing-at-a-party-1327-large.mp4",
    date: "January 2024",
    location: "Private Villa, Jeddah",
    guests: "120 Guests",
    description: "A vibrant 30th birthday celebration with a neon theme that lit up the night. The private villa was transformed with UV lighting, neon installations, and a custom-built LED dance floor. Guests enjoyed craft cocktails, a live DJ, and surprise performances throughout the evening.",
    gallery: [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop"
    ]
  },
  {
    id: 4,
    title: "Luxury Brand Launch",
    category: "launch",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
    video: null,
    date: "December 2023",
    location: "Ritz-Carlton, Riyadh",
    guests: "200 VIPs",
    description: "An exclusive product launch for a luxury fragrance brand that captivated Riyadh's elite. The Ritz-Carlton was transformed into an aromatic garden with living walls, custom scent diffusers, and interactive product displays. The event generated significant media coverage and social media buzz.",
    gallery: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop"
    ]
  },
  {
    id: 5,
    title: "Annual Corporate Gala",
    category: "corporate",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-people-toasting-at-a-party-4324-large.mp4",
    date: "November 2023",
    location: "Four Seasons Hotel",
    guests: "500 Attendees",
    description: "A black-tie corporate gala celebrating a major company's 20th anniversary. The evening included award presentations, live entertainment, a gourmet dinner, and a spectacular fireworks display. Our team coordinated over 50 vendors to deliver a flawless evening.",
    gallery: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop"
    ]
  },
  {
    id: 6,
    title: "Desert Oasis Wedding",
    category: "wedding",
    image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&h=400&fit=crop",
    video: null,
    date: "October 2023",
    location: "Al Ula, Saudi Arabia",
    guests: "200 Guests",
    description: "A breathtaking destination wedding set against the stunning rock formations of Al Ula. The ceremony took place at sunset with the ancient landscape as a backdrop. Guests enjoyed traditional Saudi hospitality combined with world-class service and entertainment under the stars.",
    gallery: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"
    ]
  },
  {
    id: 7,
    title: "Fintech Conference",
    category: "conference",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop",
    video: null,
    date: "September 2023",
    location: "Riyadh Convention Center",
    guests: "1200 Attendees",
    description: "The region's largest fintech conference, featuring 50+ speakers, 30 exhibition booths, and multiple networking sessions. Our team managed the complex logistics of a multi-track event with parallel sessions, ensuring smooth transitions and maximum attendee engagement.",
    gallery: [
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop"
    ]
  },
  {
    id: 8,
    title: "Princess Theme Birthday",
    category: "birthday",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=400&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-girl-blowing-candles-on-a-birthday-cake-4279-large.mp4",
    date: "August 2023",
    location: "Private Estate, Khobar",
    guests: "80 Guests",
    description: "A magical 5th birthday party with a princess theme that delighted children and adults alike. The estate was transformed into a fairy tale castle with custom decorations, character performers, a petting zoo, and a dessert bar that looked like it came from a storybook.",
    gallery: [
      "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop"
    ]
  },
  {
    id: 9,
    title: "Automotive Launch Event",
    category: "launch",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop",
    video: null,
    date: "July 2023",
    location: "Diriyah Arena, Riyadh",
    guests: "1500 Guests",
    description: "A spectacular automotive launch that combined cutting-edge technology with theatrical presentation. The reveal featured drone light shows, holographic displays, and a test drive experience on a custom-built track. The event set new standards for product launches in the region.",
    gallery: [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop"
    ]
  }
];

function renderEvents(filter = 'all') {
  const grid = document.getElementById('eventsGrid');
  const filtered = filter === 'all' ? eventsData : eventsData.filter(e => e.category === filter);
  
  grid.innerHTML = filtered.map(event => `
    <div class="event-card reveal" data-category="${event.category}" onclick="openModal(${event.id})">
      <div class="event-media">
        ${event.video ? `
          <video muted loop playsinline poster="${event.image}">
            <source src="${event.video}" type="video/mp4">
          </video>
          <div class="event-play"><i class="fas fa-play"></i></div>
        ` : `<img src="${event.image}" alt="${event.title}">`}
        <div class="event-media-overlay"></div>
        <span class="event-badge">${event.category}</span>
      </div>
      <div class="event-info">
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <div class="event-meta">
          <span><i class="fas fa-calendar"></i> ${event.date}</span>
          <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
          <span><i class="fas fa-users"></i> ${event.guests}</span>
        </div>
      </div>
    </div>
  `).join('');
  
  // Re-init reveals
  const reveals = document.querySelectorAll('.event-card.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
  
  // Video hover play
  document.querySelectorAll('.event-card video').forEach(video => {
    const card = video.closest('.event-card');
    card.addEventListener('mouseenter', () => video.play());
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
}

function openModal(eventId) {
  const event = eventsData.find(e => e.id === eventId);
  if (!event) return;
  
  const modal = document.getElementById('eventModal');
  const body = document.getElementById('modalBody');
  
  body.innerHTML = `
    <div class="modal-hero">
      ${event.video ? `
        <video autoplay muted loop playsinline>
          <source src="${event.video}" type="video/mp4">
        </video>
      ` : `<img src="${event.image}" alt="${event.title}">`}
      <div class="modal-hero-overlay"></div>
      <div class="modal-hero-content">
        <span class="modal-badge">${event.category}</span>
        <h2>${event.title}</h2>
      </div>
    </div>
    <div class="modal-details">
      <div class="event-meta" style="margin-bottom:20px;">
        <span><i class="fas fa-calendar"></i> ${event.date}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
        <span><i class="fas fa-users"></i> ${event.guests}</span>
      </div>
      <p>${event.description}</p>
      <div class="modal-gallery">
        ${event.gallery.map(img => `<img src="${img}" alt="${event.title}">`).join('')}
      </div>
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
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function() {
  renderEvents();
  
  // Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEvents(btn.getAttribute('data-filter'));
    });
  });
  
  // Modal close
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});
