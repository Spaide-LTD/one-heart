const serviceData = {
  wedding: {
    title: "Electronic Invitations",
    subtitle: "Beautiful digital invitations that make every first impression memorable",
    icon: "fa-envelope",
    heroImage: "images/invites.png",
    description: `
      <p>Make your event stand out from the very beginning with professionally electronic invitations that combine elegance, convenience, and modern communication.</p>
      <p>Our team creates customized digital invitations that reflect your event theme while simplifying guest communication and RSVP tracking.</p>
      <h3>Electronic Invitation Services:</h3>
      <ul>
      <li>Digital RSVP management</li>
      <li>WhatsApp delivery</li>
      <li>Guest list management</li>
      <li>Event information integration</li>
      <li>Reminder notifications</li>
      <li>Mobile-friendly invitation formats</li>
    </ul>
      <p>We ensure every invitation is beautifully presented and delivered efficiently, creating excitement before your event even begins.</p>
    `,
    includes: [
    "RSVP tracking",
    "Guest management",
    "WhatsApp delivery",
    "Reminder notifications"
    ],
    
    related: ["corporate", "private", "birthday"]
  },
  corporate: {
    title: "Crowd Organization & Management",
    subtitle: "Professional crowd coordination for safe and seamless events",
  icon: "fa-users",
  heroImage: "images/crowd.png",
  description: `
    <p>Ensure your event runs smoothly with expert crowd organization and management services designed to maximize guest comfort, safety, and efficiency.</p>
    <p>Our experienced coordinators manage guest flow, entrances, exits, and event operations to create a well-organized experience for all attendees.</p>
    <h3>Crowd Management Services:</h3>
    <ul>
      <li>Guest flow coordination</li>
      <li>Entrance and exit management</li>
      <li>Queue management</li>
      <li>VIP guest assistance</li>
      <li>Event supervision</li>
      <li>Security coordination support</li>
      <li>Capacity monitoring</li>
      <li>Emergency response planning</li>
    </ul>
    <p>We help maintain order and professionalism throughout your event, allowing guests to enjoy a smooth and comfortable experience.</p>
  `,
  includes: [
    "Guest coordination",
    "Queue management",
    "VIP assistance",
    "Safety supervision",
    "Event monitoring",
    "Operational support"
  ],
    price: "SAR 20,000",
    related: ["conference", "launch", "private"]
  },
  birthday: {
    title: "Event Preparation & Setup",
     subtitle: "Complete event setup solutions that bring your vision to life",
  icon: "fa-tools",
  heroImage: "images/setup.png",
  description: `
    <p>Transform any venue into the perfect event space with our comprehensive event preparation and setup services.</p>
    <p>From initial planning to final setup, our team handles every detail to ensure your event is ready for a flawless experience.</p>
    <h3>Event Preparation Services:</h3>
    <ul>
      <li>Venue preparation and arrangement</li>
      <li>Stage and seating setup</li>
      <li>Decor installation</li>
      <li>Lighting and sound coordination</li>
      <li>Equipment setup</li>
      <li>Vendor coordination</li>
      <li>Timeline preparation</li>
      <li>On-site setup supervision</li>
    </ul>
    <p>We ensure every component is professionally arranged and ready before your guests arrive.</p>
  `,
  includes: [
    "Venue setup",
    "Decor installation",
    "Stage preparation",
    "Equipment setup",
    "Vendor coordination",
    "On-site supervision"
  ],
    price: "SAR 8,000",
    related: ["private", "wedding", "corporate"]
  },
  conference: {
   title: "Games Rental",
  subtitle: "Fun and interactive entertainment for unforgettable events",
  icon: "fa-gamepad",
  heroImage: "images/rental.png",
  description: `
    <p>Add excitement and entertainment to your event with our wide range of games and interactive attractions suitable for guests of all ages.</p>
    <p>Whether you're planning a birthday party, family gathering, corporate event, or festival, our games create memorable experiences and keep guests engaged.</p>
    <h3>Games Rental Services:</h3>
    <ul>
      <li>Children's party games</li>
      <li>Carnival and funfair games</li>
      <li>Team-building activities</li>
      <li>Outdoor event games</li>
      <li>Family-friendly attractions</li>
      <li>Game setup and operation</li>
      <li>Event entertainment support</li>
    </ul>
    <p>We provide high-quality equipment, professional setup, and engaging entertainment solutions tailored to your event.</p>
  `,
  includes: [
    "Game rental equipment",
    "Delivery & setup",
    "Interactive activities",
    "Operator assistance",
    "Family entertainment",
  ],
    price: "SAR 30,000",
    related: ["corporate", "launch", "private"]
  },
  launch: {
    title: "Photo & Video Coverage",
  subtitle: "Capture every special moment with professional photography and videography",
  icon: "fa-camera",
  heroImage: "images/video coverage.png",
  description: `
    <p>Preserve the memories of your event with high-quality photo and video coverage provided by experienced professionals.</p>
    <p>Our team captures every important detail, emotion, and highlight, ensuring your special moments can be relived and shared for years to come.</p>
    <h3>Photo & Video Coverage Services:</h3>
    <ul>
      <li>Professional event photography</li>
      <li>Cinematic videography</li>
      <li>Drone aerial coverage</li>
      <li>Live event recording</li>
      <li>Highlight reels and recap videos</li>
      <li>Photo editing and retouching</li>
      <li>Video editing and production</li>
      <li>Social media content creation</li>
    </ul>
    <p>From intimate gatherings to large-scale celebrations, we ensure every meaningful moment is captured with creativity and professionalism.</p>
  `,
  includes: [
    "Professional photography",
    "Event videography",
    "Drone coverage",
    "Photo editing",
    "Video production",
    "Digital delivery"
  ],
    price: "SAR 35,000",
    related: ["corporate", "conference", "private"]
  },
  private: {
    title: "Private Celebrations",
    subtitle: "Intimate moments deserve extraordinary settings and impeccable service",
    icon: "fa-glass-cheers",
    heroImage: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1400&h=800&fit=crop",
    description: `
      <p>Some of life's most precious moments happen in the company of those closest to us. Our private celebration service transforms intimate gatherings into extraordinary experiences.</p>
      <p>We specialize in creating atmospheres of warmth, elegance, and joy for celebrations that matter most to you and your loved ones.</p>
      <h3>Private Celebration Experiences:</h3>
      <ul>
        <li>Anniversary celebrations and vow renewals</li>
        <li>Family reunions and milestone gatherings</li>
        <li>Graduation parties and achievements</li>
        <li>Holiday celebrations and seasonal events</li>
        <li>Engagement parties and proposals</li>
        <li>Housewarming and dinner parties</li>
        <li>Private chef experiences</li>
        <li>Luxury picnic and outdoor events</li>
      </ul>
      <p>Every detail is curated to reflect your personal style and create an atmosphere where memories are made naturally.</p>
    `,
    gallery: [
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400&h=300&fit=crop"
    ],
    includes: [
      "Personalized planning",
      "Intimate venue curation",
      "Custom menu design",
      "Decor & ambiance",
      "Entertainment",
      "Photography"
    ],
    price: "SAR 12,000",
    related: ["wedding", "birthday", "corporate"]
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get('id') || 'wedding';
  const service = serviceData[serviceId];
  
  if (!service) {
    window.location.href = 'services.html';
    return;
  }
  
  document.getElementById('serviceHeroImg').src = service.heroImage;
  document.getElementById('serviceHeroImg').alt = service.title;
  document.getElementById('serviceHeroIcon').innerHTML = `<i class="fas ${service.icon}"></i>`;
  document.getElementById('serviceTitle').textContent = service.title;
  document.getElementById('serviceSubtitle').textContent = service.subtitle;
  document.getElementById('serviceDescription').innerHTML = service.description;
  
  const includesList = document.getElementById('serviceIncludes');
  includesList.innerHTML = service.includes.map(item => 
    `<li><i class="fas fa-check-circle"></i> ${item}</li>`
  ).join('');
  
    
  const relatedGrid = document.getElementById('relatedServices');
  relatedGrid.innerHTML = service.related.map(id => {
    const related = serviceData[id];
    return `
      <a href="service-detail.html?id=${id}" class="related-card reveal">
        <img src="${related.heroImage}" alt="${related.title}">
        <div class="related-card-info">
          <h4>${related.title}</h4>
          <p>${related.subtitle.substring(0, 60)}...</p>
        </div>
      </a>
    `;
  }).join('');
  
  const newReveals = document.querySelectorAll('.related-card.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });
  newReveals.forEach(el => revealObserver.observe(el));
});