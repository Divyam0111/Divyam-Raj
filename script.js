document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if(menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu on link click
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Intersection Observer for scroll animations (fade-up and slide-in)
    const fadeElements = document.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Remove the class when scrolling back up
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Change nav background on scroll & Parallax effect for hero image
    const navbar = document.getElementById('navbar');
    const heroImage = document.querySelector('.hero-image-container');
    
    window.addEventListener('scroll', () => {
        // Nav transparency
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 1px 15px rgba(0,0,0,0.05)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.5)';
            navbar.style.boxShadow = 'none';
        }

        const scrollY = window.scrollY;
        // Keep a very slight vertical parallax just to make it breathe if we want
        // But the main movement is handled by IntersectionObserver below
    });

    // Intersection Observer for Floating Profile Image States
    const floatingProfile = document.getElementById('floating-profile');
    const sections = document.querySelectorAll('section');

    if (floatingProfile) {
        const sectionObserverOptions = {
            root: null,
            rootMargin: '-30% 0px -30% 0px', // Trigger when section is mostly in middle of viewport
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove all state classes
                    floatingProfile.className = 'floating-image-container';
                    // Add the new state class based on the section ID
                    floatingProfile.classList.add(`state-${entry.target.id}`);
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Handle smooth scrolling for anchor links to offset the fixed navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerOffset = 60;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // Portfolio Carousel Logic
    const track = document.getElementById('portfolio-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        let autoPlayInterval;
        
        const getMaxIndex = () => {
            const card = track.querySelector('.portfolio-card');
            if (!card) return 0;
            const cardWidth = card.getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
            const scrollAmount = cardWidth + gap;
            const visibleWidth = track.parentElement.getBoundingClientRect().width;
            const totalWidth = track.scrollWidth;
            return Math.max(0, Math.ceil((totalWidth - visibleWidth) / scrollAmount));
        };

        const updateCarousel = () => {
            const card = track.querySelector('.portfolio-card');
            if (!card) return;
            
            const cardWidth = card.getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
            const scrollAmount = cardWidth + gap;
            
            track.style.transform = `translateX(-${currentIndex * scrollAmount}px)`;
            
            const maxIndex = getMaxIndex();
            prevBtn.disabled = currentIndex <= 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        };

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                const maxIndex = getMaxIndex();
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // Loop back to start
                }
                updateCarousel();
            }, 2000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        window.addEventListener('resize', () => {
            currentIndex = 0;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
                stopAutoPlay();
                startAutoPlay(); // Reset timer on manual click
            }
        });

        nextBtn.addEventListener('click', () => {
            const maxIndex = getMaxIndex();
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
                stopAutoPlay();
                startAutoPlay(); // Reset timer on manual click
            }
        });

        // Pause on hover
        const carouselWrapper = document.querySelector('.portfolio-carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
            carouselWrapper.addEventListener('mouseleave', startAutoPlay);
        }

        setTimeout(() => {
            updateCarousel();
            startAutoPlay();
        }, 100);
    }
});
