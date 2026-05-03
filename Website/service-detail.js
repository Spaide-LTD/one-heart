const serviceData = {
  wedding: {
    title: "Wedding Planning",
    subtitle: "From the proposal to the last dance, we craft weddings that tell your unique love story",
    icon: "fa-heart",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&h=800&fit=crop",
    description: `
      <p>Your wedding day is one of the most significant moments of your life, and at One Heart, we treat it with the reverence it deserves. Our comprehensive wedding planning service covers every aspect of your special day.</p>
      <p>We begin with a deep consultation to understand your vision, style, and budget. From there, our team of expert planners, designers, and coordinators work tirelessly to bring your dream wedding to life.</p>
      <h3>Our Wedding Services Include:</h3>
      <ul>
        <li>Venue selection and booking</li>
        <li>Custom theme and decor design</li>
        <li>Catering and menu planning</li>
        <li>Photography and videography coordination</li>
        <li>Entertainment and music curation</li>
        <li>Guest management and RSVP handling</li>
        <li>Floral arrangements and centerpieces</li>
        <li>Lighting and ambiance design</li>
        <li>Day-of coordination and management</li>
      </ul>
      <p>Whether you envision an intimate garden ceremony or a grand ballroom celebration, we have the expertise and connections to make it happen flawlessly.</p>
    `,
    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop"
    ],
    includes: [
      "Full event planning & coordination",
      "Vendor management",
      "Custom decor & design",
      "Timeline creation",
      "Rehearsal coordination",
      "Day-of management"
    ],
    
    related: ["corporate", "private", "birthday"]
  },
  corporate: {
    title: "Corporate Events",
    subtitle: "Professional events that strengthen your brand and inspire your team",
    icon: "fa-briefcase",
    heroImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=800&fit=crop",
    description: `
      <p>Elevate your corporate presence with events that reflect your company's values and ambitions. From high-stakes board meetings to celebratory galas, we deliver professionalism with creative flair.</p>
      <p>Our corporate event specialists understand the nuances of business entertainment. We create environments that foster connection, celebrate achievement, and reinforce your brand identity.</p>
      <h3>Corporate Event Solutions:</h3>
      <ul>
        <li>Annual general meetings and conferences</li>
        <li>Product launches and brand activations</li>
        <li>Team building retreats and workshops</li>
        <li>Award ceremonies and gala dinners</li>
        <li>Client appreciation events</li>
        <li>Trade show booth design and management</li>
        <li>Executive retreats and offsites</li>
        <li>Holiday parties and celebrations</li>
      </ul>
      <p>We handle AV requirements, stage design, speaker coordination, and all logistical elements to ensure your corporate event runs like clockwork.</p>
    `,
    gallery: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&h=300&fit=crop"
    ],
    includes: [
      "Event strategy & planning",
      "Venue sourcing",
      "AV & tech setup",
      "Branding integration",
      "Catering management",
      "Post-event reporting"
    ],
    price: "SAR 20,000",
    related: ["conference", "launch", "private"]
  },
  birthday: {
    title: "Birthday Parties",
    subtitle: "Celebrate another trip around the sun with style, fun, and unforgettable memories",
    icon: "fa-birthday-cake",
    heroImage: "https://images.unsplash.com/photo-1530103862676-de3c9a59aa38?w=1400&h=800&fit=crop",
    description: `
      <p>Every birthday is a milestone worth celebrating, and at One Heart, we make sure each one is extraordinary. From whimsical children's parties to sophisticated adult celebrations, we bring the perfect energy to your special day.</p>
      <p>Our creative team designs immersive themed experiences that transport your guests into a world of wonder. We handle everything from invitations to party favors, so you can focus on making memories.</p>
      <h3>Birthday Party Packages:</h3>
      <ul>
        <li>Themed party design and execution</li>
        <li>Custom cake and dessert tables</li>
        <li>Entertainment and activity coordination</li>
        <li>Photo booth and memory stations</li>
        <li>Balloon installations and decor</li>
        <li>Catering for all ages and dietary needs</li>
        <li>Party favor design and preparation</li>
        <li>Live entertainment and DJs</li>
      </ul>
      <p>Whether it's a first birthday, sweet sixteen, or a fabulous fifty, we create celebrations that match the significance of the milestone.</p>
    `,
    gallery: [
      "https://images.unsplash.com/photo-1530103862676-de3c9a59aa38?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop"
    ],
    includes: [
      "Theme development",
      "Decor & styling",
      "Entertainment booking",
      "Catering coordination",
      "Photography",
      "Party favors"
    ],
    price: "SAR 8,000",
    related: ["private", "wedding", "corporate"]
  },
  conference: {
    title: "Conferences",
    subtitle: "Seamless conference management from concept to closing remarks",
    icon: "fa-users",
    heroImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&h=800&fit=crop",
    description: `
      <p>Conferences are powerful platforms for knowledge sharing, networking, and brand building. Our conference management team ensures every session, break, and networking moment is perfectly orchestrated.</p>
      <p>We combine logistical expertise with creative programming to deliver conferences that engage attendees and achieve your organizational objectives.</p>
      <h3>Conference Management Services:</h3>
      <ul>
        <li>Venue selection and room configuration</li>
        <li>Speaker coordination and travel management</li>
        <li>Registration and badge systems</li>
        <li>AV production and live streaming</li>
        <li>Breakout session management</li>
        <li>Catering and refreshment planning</li>
        <li>Exhibition and sponsor management</li>
        <li>Networking event coordination</li>
        <li>Post-conference reporting and analytics</li>
      </ul>
      <p>From intimate workshops to multi-day international conferences, we scale our services to match your needs and exceed expectations.</p>
    `,
    gallery: [
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&h=300&fit=crop"
    ],
    includes: [
      "Full program management",
      "Speaker coordination",
      "Registration systems",
      "AV & live streaming",
      "Catering",
      "On-site support"
    ],
    price: "SAR 30,000",
    related: ["corporate", "launch", "private"]
  },
  launch: {
    title: "Product Launches",
    subtitle: "Make your debut unforgettable with launch events that captivate and convert",
    icon: "fa-rocket",
    heroImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1400&h=800&fit=crop",
    description: `
      <p>A product launch is your moment to shine in the spotlight. We create launch events that generate buzz, engage media, and leave lasting impressions on your target audience.</p>
      <p>Our launch specialists understand the art of storytelling. We design experiences that showcase your product's unique value while creating memorable moments for attendees.</p>
      <h3>Launch Event Services:</h3>
      <ul>
        <li>Launch strategy and concept development</li>
        <li>Venue selection with brand alignment</li>
        <li>Stage design and product display</li>
        <li>Media and press coordination</li>
        <li>Influencer and VIP guest management</li>
        <li>Live demonstration planning</li>
        <li>Social media integration</li>
        <li>Post-launch follow-up events</li>
      </ul>
      <p>From tech startups to luxury brands, we tailor every element of your launch to maximize impact and drive results.</p>
    `,
    gallery: [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop"
    ],
    includes: [
      "Launch strategy",
      "Venue & staging",
      "Media coordination",
      "Demo planning",
      "Guest management",
      "Post-event PR"
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