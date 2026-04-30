
const testimonialsData = [
  {
    name: "Maxwell Kimani",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUVnibd6ZPU485a6-rUAVHIK6qR3dDeeIN4USQh2lvVaMoPkIE=w54-h54-p-rp-mo-br100",
    text: "I was simply impressed by their organization and delivery of services. They went above and beyond for our team and the event was a success. Thank you for the good job!",
    rating: 5
  },
  {
    name: "Sajjad Harunany",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWBazPnoEdF-O1acHe6Zd3GyAeeU-4rI34pUZQSCbCtSoju8yv6=w54-h54-p-rp-mo-ba3-br100",
    text: "I loved working with One heart. They cater for all your needs from planning to execution and everything was done flawlessly. The attention to detail and professionalism was outstanding.",
    rating: 5
  },
  {
    name: "Ayman Brek",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocJS0cjut-uSRZfeovrhPvuKZtyZEmeD4oTHEXac-fZCnLKW2Q=w54-h54-p-rp-mo-br100",
    text: "I had a great experience working with this team. Their attention to detail and level of professionalism really stood out throughout the entire event. Everything was well-organized and executed smoothly highly recommended.",
    rating: 5
  },
  {
    name: "عــبدالله بـن سلمان",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjW8DhE5WoOu_cQCijxeisuPkEsXkqxnRx8d9vX92Z42KwpGu7Pd=w54-h54-p-rp-mo-br100",
    text: "They use creativity to create effective communication 😍",
    rating: 5
  },
  {
    name: "SALIM SALEH",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocKh7Jk5DUeYDIHQ8Dt-77WWED90i-kxNFO_eryW1TZJcsJRJA=w54-h54-p-rp-mo-br100",
    text: "Exceptional service from start to finish. The team is highly skilled, flexible, and committed to delivering outstanding results. They turned the vision into reality and created an unforgettable experience.",
    rating: 5
  },
  {
    name: "Rachel Adams",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocKC-OdqugdsgAEKzkDyKr_XII2IqL6MRFLEbfe1smMmoT-pCg=w54-h54-p-rp-mo-br100",
    text: "Comfortable service, high quality, and creative 👍🏻",
    rating: 5
  },
  
  
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

