
const testimonialsData = [
  {
    name: "Princess Aisha Al-Saud",
    role: "Bride",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    text: "One Heart transformed our wedding into a fairytale. Every detail was perfection - from the floral arrangements to the lighting. Our guests are still talking about it months later!",
    event: "Royal Wedding",
    rating: 5
  },
  {
    name: "Mohammed Al-Rashid",
    role: "CEO, TechVentures",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    text: "The professionalism and creativity of the One Heart team is unmatched. Our product launch exceeded all expectations and generated incredible media buzz. Truly world-class service.",
    event: "Product Launch",
    rating: 5
  },
  {
    name: "Fatima Hassan",
    role: "Mother of the Bride",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    text: "Planning my daughter's wedding from abroad seemed impossible until we found One Heart. They handled everything with such care and attention. It was more beautiful than we ever imagined.",
    event: "Desert Wedding",
    rating: 5
  },
  {
    name: "Khalid Bin Fahd",
    role: "Marketing Director",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    text: "Our annual corporate gala has never looked better. The team at One Heart understood our brand vision and delivered an event that impressed every single attendee. Outstanding work!",
    event: "Corporate Gala",
    rating: 5
  },
  {
    name: "Noura Al-Otaibi",
    role: "Birthday Celebrant",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    text: "My 30th birthday was absolutely magical! The neon theme, the music, the food - everything was curated to perfection. One Heart knows how to throw a party!",
    event: "Birthday Party",
    rating: 5
  },
  {
    name: "Dr. Ahmed Al-Zahrani",
    role: "Conference Organizer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    text: "Managing a 1200-person conference is no small feat, but One Heart made it look effortless. The AV setup, registration flow, and networking sessions were flawlessly executed.",
    event: "Fintech Conference",
    rating: 5
  },
  {
    name: "Layla Mohammed",
    role: "Anniversary Celebrant",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    text: "For our 25th anniversary, One Heart created an intimate dinner that felt like a scene from a movie. The attention to detail, the ambiance, the service - pure perfection.",
    event: "Private Celebration",
    rating: 5
  },
  {
    name: "Sultan Al-Qahtani",
    role: "Event Sponsor",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    text: "As a sponsor, I've worked with many event companies. One Heart stands out for their creativity, reliability, and genuine passion for what they do. They're simply the best in the business.",
    event: "Tech Summit",
    rating: 5
  },
  {
    name: "Reem Al-Harbi",
    role: "Mother",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop",
    text: "My daughter's princess-themed 5th birthday was absolutely enchanting. The character performers, the decorations, the cake - every child (and parent!) was mesmerized. Thank you One Heart!",
    event: "Kids Birthday",
    rating: 5
  }
];

function createStars(rating) {
  return Array(5).fill(0).map((_, i) => 
    `<i class="fas fa-star${i < rating ? '' : '-o'}"></i>`
  ).join('');
}

function createTestimonialCard(t, isFeatured = false) {
  const cardClass = isFeatured ? 'featured-card' : 'testimonial-card';
  return `
    <div class="${cardClass}">
      <div class="testimonial-stars">${createStars(t.rating)}</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar">
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
          <span class="testimonial-event">${t.event}</span>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', function() {
  // Split testimonials into 3 rows for marquee
  const row1 = [...testimonialsData.slice(0, 3), ...testimonialsData.slice(0, 3)];
  const row2 = [...testimonialsData.slice(3, 6), ...testimonialsData.slice(3, 6)];
  const row3 = [...testimonialsData.slice(6, 9), ...testimonialsData.slice(6, 9)];
  
  document.getElementById('marquee1').innerHTML = row1.map(t => createTestimonialCard(t)).join('');
  document.getElementById('marquee2').innerHTML = row2.map(t => createTestimonialCard(t)).join('');
  document.getElementById('marquee3').innerHTML = row3.map(t => createTestimonialCard(t)).join('');
  
  // Featured testimonials (first 3)
  document.getElementById('featuredGrid').innerHTML = testimonialsData.slice(0, 3).map(t => 
    createTestimonialCard(t, true)
  ).join('');
  
  // Re-init reveals for featured
  const reveals = document.querySelectorAll('.featured-card.reveal, .featured-testimonials .reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
});

