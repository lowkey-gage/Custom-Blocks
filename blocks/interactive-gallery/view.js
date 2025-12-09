document.addEventListener('DOMContentLoaded', function() {
    const galleries = document.querySelectorAll('.interactive-gallery');
    
    galleries.forEach(gallery => {
        let currentIndex = 0;
        let autoplayInterval = null;
        let isPaused = false;
        
        const slides = gallery.querySelectorAll('.gallery-slide');
        const prevButton = gallery.querySelector('.nav-button.prev');
        const nextButton = gallery.querySelector('.nav-button.next');
        const indicators = gallery.querySelectorAll('.indicator-dot');
        
        const autoplay = gallery.dataset.autoplay === 'true';
        const autoplaySpeed = parseInt(gallery.dataset.autoplaySpeed) || 3000;
        
        const updateVisibility = () => {
            slides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev', 'next');
                
                if (index === currentIndex) {
                    slide.classList.add('active');
                } else if (index === currentIndex - 1) {
                    slide.classList.add('prev');
                } else if (index === currentIndex + 1) {
                    slide.classList.add('next');
                }
            });
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
            
            // Buttons are always enabled for carousel (loops)
            prevButton.disabled = false;
            nextButton.disabled = false;
        };
        
        const navigate = (direction) => {
            currentIndex = currentIndex + direction;
            
            // Loop around
            if (currentIndex < 0) {
                currentIndex = slides.length - 1;
            } else if (currentIndex >= slides.length) {
                currentIndex = 0;
            }
            
            updateVisibility();
        };
        
        const goToSlide = (index) => {
            currentIndex = index;
            updateVisibility();
            resetAutoplay();
        };
        
        const startAutoplay = () => {
            if (autoplay && !isPaused) {
                autoplayInterval = setInterval(() => {
                    navigate(1);
                }, autoplaySpeed);
            }
        };
        
        const stopAutoplay = () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        };
        
        const resetAutoplay = () => {
            stopAutoplay();
            startAutoplay();
        };
        
        // Navigation buttons
        prevButton.addEventListener('click', () => {
            navigate(-1);
            resetAutoplay();
        });
        
        nextButton.addEventListener('click', () => {
            navigate(1);
            resetAutoplay();
        });
        
        // Indicator dots
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Pause on hover
        gallery.addEventListener('mouseenter', () => {
            isPaused = true;
            stopAutoplay();
        });
        
        gallery.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoplay();
        });
        
        // Keyboard navigation
        gallery.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                navigate(-1);
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                navigate(1);
                resetAutoplay();
            }
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        gallery.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                navigate(1);
                resetAutoplay();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                navigate(-1);
                resetAutoplay();
            }
        };
        
        // Initialize
        updateVisibility();
        startAutoplay();
    });
});