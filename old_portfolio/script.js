// Hide preloader when everything is fully loaded (with a fixed 10s duration)
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
        }
    }, 10000);
});

// Theme Switching Logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});

// Content loading and initialization
document.addEventListener('DOMContentLoaded', () => {
    async function loadContent() {
        try {
            const response = await fetch('content.json');
            const data = await response.json();
            
            // 1. Update simple text elements
            document.querySelectorAll('[data-content-key]').forEach(el => {
                const key = el.getAttribute('data-content-key');
                const value = key.split('.').reduce((obj, k) => obj[k], data);
                
                if (value) {
                    if (el.tagName === 'A' && key.includes('text')) {
                        el.textContent = value;
                    } else if (el.classList.contains('hero-bg') || el.classList.contains('hero-img')) {
                        el.style.backgroundImage = `url('${value}')`;
                    } else {
                        el.textContent = value;
                    }
                }
            });

            // 2. Update Experience
            const expContainer = document.getElementById('experience-container');
            if (expContainer && data.experience) {
                expContainer.innerHTML = '';
                data.experience.forEach((exp, index) => {
                    const sideClass = index % 2 === 0 ? 'slide-in-left' : 'slide-in-right';
                    const expCard = `
                        <div class="experience-card ${sideClass}">
                            <h3>${exp.title}</h3>
                            <div class="company-header">
                                <div class="company-logo">
                                    <img src="${exp.logo}" alt="${exp.company} Logo" />
                                </div>
                                <h4>${exp.company} | ${exp.period}</h4>
                            </div>
                            <p>${exp.description.replace(/\n/g, '<br />')}</p>
                        </div>
                    `;
                    expContainer.insertAdjacentHTML('beforeend', expCard);
                });
            }

            // 3. Update Portfolio
            const portfolioTrack = document.getElementById('portfolio-track');
            if (portfolioTrack && data.portfolio) {
                portfolioTrack.innerHTML = '';
                data.portfolio.forEach(item => {
                    const portfolioCard = `
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="portfolio-card">
                            <div class="card-image" style="background-image: url('${item.image_url}'); background-size: cover; background-position: center;"></div>
                            <div class="card-content">
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                            </div>
                        </a>
                    `;
                    portfolioTrack.insertAdjacentHTML('beforeend', portfolioCard);
                });
            }

            // 4. Update Skills
            const skillsContainer = document.getElementById('skills-container');
            if (skillsContainer && data.skills) {
                skillsContainer.innerHTML = '';
                const categories = {
                    design: 'Design',
                    frontend: 'Front-End',
                    tools: 'Tools',
                    soft_skills: 'Soft Skills'
                };
                
                Object.entries(categories).forEach(([key, label]) => {
                    if (data.skills[key]) {
                        const skillCategory = `
                            <div class="skill-category">
                                <h3>${label}</h3>
                                <div class="skills-container">
                                    ${data.skills[key].map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        `;
                        skillsContainer.insertAdjacentHTML('beforeend', skillCategory);
                    }
                });
            }

            // Update email link href
            const emailLink = document.getElementById('contact-email-link');
            if (emailLink && data.contact.email) {
                emailLink.href = `mailto:${data.contact.email}`;
            }

            // Re-initialize animations after dynamic content is loaded
            if (typeof window.initAnimations === 'function') window.initAnimations();
            
            // Re-initialize carousel if track exists
            if (typeof window.initCarousel === 'function') window.initCarousel();

        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    // Call loadContent
    loadContent();

    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if(menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Change nav background on scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Floating Profile Image States
    const floatingProfile = document.getElementById('floating-profile');
    const sections = document.querySelectorAll('section');

    if (floatingProfile) {
        const sectionObserverOptions = {
            root: null,
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    floatingProfile.className = 'floating-image-container';
                    floatingProfile.classList.add(`state-${entry.target.id}`);
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Handle smooth scrolling
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
});

// Expose these functions globally for admin.js
window.initAnimations = function() {
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
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });
};

window.initCarousel = function() {
    const track = document.getElementById('portfolio-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (track && prevBtn && nextBtn) {
        // Clear existing clones if any (for re-init)
        const clones = track.querySelectorAll('.clone');
        clones.forEach(c => c.remove());

        const cards = Array.from(track.querySelectorAll('.portfolio-card'));
        if (cards.length === 0) return;

        // Clone first and last cards for infinite effect
        const firstClone = cards[0].cloneNode(true);
        const lastClone = cards[cards.length - 1].cloneNode(true);

        firstClone.classList.add('clone');
        lastClone.classList.add('clone');

        track.appendChild(firstClone);
        track.insertBefore(lastClone, cards[0]);

        let currentIndex = 1; // Start at the first real card
        let isTransitioning = false;
        let autoPlayInterval;
        
        const getScrollAmount = () => {
            const card = track.querySelector('.portfolio-card');
            const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
            return card.getBoundingClientRect().width + gap;
        };

        const updateCarousel = (animate = true) => {
            const scrollAmount = getScrollAmount();
            track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
            track.style.transform = `translateX(-${currentIndex * scrollAmount}px)`;
        };

        const handleTransitionEnd = () => {
            isTransitioning = false;
            const cardsCount = track.querySelectorAll('.portfolio-card').length;
            
            if (currentIndex === 0) {
                currentIndex = cardsCount - 2;
                updateCarousel(false);
            } else if (currentIndex === cardsCount - 1) {
                currentIndex = 1;
                updateCarousel(false);
            }
        };

        // Remove old listener if re-initializing
        track.removeEventListener('transitionend', track._transitionHandler);
        track._transitionHandler = handleTransitionEnd;
        track.addEventListener('transitionend', track._transitionHandler);

        const startAutoPlay = () => {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => {
                if (!isTransitioning) {
                    currentIndex++;
                    isTransitioning = true;
                    updateCarousel();
                }
            }, 3000);
        };

        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        window.removeEventListener('resize', window._carouselResizeHandler);
        window._carouselResizeHandler = () => updateCarousel(false);
        window.addEventListener('resize', window._carouselResizeHandler);

        prevBtn.onclick = () => {
            if (isTransitioning) return;
            currentIndex--;
            isTransitioning = true;
            updateCarousel();
            startAutoPlay();
        };

        nextBtn.onclick = () => {
            if (isTransitioning) return;
            currentIndex++;
            isTransitioning = true;
            updateCarousel();
            startAutoPlay();
        };

        const wrapper = track.parentElement;
        if (wrapper) {
            wrapper.onmouseenter = stopAutoPlay;
            wrapper.onmouseleave = startAutoPlay;
        }

        updateCarousel(false);
        startAutoPlay();
    }
};
