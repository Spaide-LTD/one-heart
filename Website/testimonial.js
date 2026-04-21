document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('marqueeContainer');
    const track = document.getElementById('marqueeTrack');
    
    let position = 0;
    const speed = 0.8; // Adjust for faster/slower scroll
    let isPaused = false;
    let animationId;

    // Clone cards for seamless infinite loop
    const originalCards = Array.from(track.children);
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    // Main animation loop
    function animate() {
        if (!isPaused) {
            position -= speed;
            
            // Get half width (original set length)
            const halfWidth = track.scrollWidth / 2;
            
            // Seamless reset when scrolled past original set
            if (Math.abs(position) >= halfWidth) {
                position = 0;
            }
            
            track.style.transform = `translateX(${position}px)`;
        }
        animationId = requestAnimationFrame(animate);
    }

    // Pause on hover, resume on leave
    container.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    container.addEventListener('mouseleave', () => {
        isPaused = false;
    });

    // Touch support for mobile
    let touchStartX = 0;
    let touchScrollPos = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchScrollPos = position;
        isPaused = true;
    });

    container.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].clientX;
        const diff = touchX - touchStartX;
        position = touchScrollPos + diff;
        track.style.transform = `translateX(${position}px)`;
    });

    container.addEventListener('touchend', () => {
        isPaused = false;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        // Reset position to prevent layout jumps
        position = position % (track.scrollWidth / 2);
        track.style.transform = `translateX(${position}px)`;
    });

    // Start animation
    animate();
});