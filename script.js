/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // ---- 1. Loader ----
    const loader = document.getElementById('loader');
    const loadProgress = document.querySelector('.loader-progress');
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 10;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 500); // Wait bit more at 100%
        }
        loadProgress.style.width = width + '%';
    }, 150);

    // Fallback if interval takes too long
    setTimeout(() => {
        clearInterval(interval);
        loadProgress.style.width = '100%';
        setTimeout(() => {
            if (!loader.classList.contains('fade-out')) {
                loader.classList.add('fade-out');
            }
        }, 300);
    }, 3000);

    // ---- 2. Custom Cursor Glow ----
    const cursorGlow = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        if(window.innerWidth > 768) {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        }
    });

    // ---- 3. Dark/Light Mode Toggle ----
    const themeBtn = document.getElementById('theme-toggle');
    const icon = themeBtn.querySelector('i');
    
    // Check local storage or system pref
    let isLight = localStorage.getItem('theme') === 'light';
    if(isLight) {
        document.documentElement.classList.add('light-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
    }

    themeBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        if(isLight) {
            icon.classList.replace('fa-sun', 'fa-moon');
        } else {
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    });

    // ---- 4. Header Scroll State & Nav Links ----
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('bg-to-top');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Header bg
        if(window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top
        if(window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active Nav highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- 5. Mobile Menu ----
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    mobileBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('nav-open');
        const iconBtn = mobileBtn.querySelector('i');
        if(navLinksContainer.classList.contains('nav-open')) {
            iconBtn.classList.replace('fa-bars', 'fa-times');
        } else {
            iconBtn.classList.replace('fa-times', 'fa-bars');
        }
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('nav-open');
            mobileBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });

    // ---- 6. Typewriter Effect ----
    const typewriterText = document.querySelector('.typewriter-text');
    if(typewriterText) {
        const words = ["Web Applications.", "3D Experiences.", "Interactive UI.", "Digital Solutions."];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;
        let erasingDelay = 50;
        let newWordDelay = 2000;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriterText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? erasingDelay : typingDelay;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = newWordDelay;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        // Start slightly after load
        setTimeout(type, 1500);
    }

    // ---- 7. Particles Background Setup (Vanilla Canvas) ----
    const canvas = document.getElementById('hero-particles');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];

        function resizeCanvas() {
            const section = document.getElementById('home');
            canvas.width = section.clientWidth;
            canvas.height = section.clientHeight;
        }
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                // Uses accent color - fallback to cyan if not fetched yet
                let accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
                this.color = accentColor || '#00f3ff';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if(this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if(this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
            }
        }

        function initParticles() {
            particlesArray = [];
            const numParticles = window.innerWidth < 768 ? 40 : 100;
            for (let i = 0; i < numParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        initParticles();
        animateParticles();
    }

    // ---- 8. Scroll Reveals & Animations (Intersection Observer) ----
    const revealElements = document.querySelectorAll('.reveal-text');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Specific anim triggers
                // Stats numbers
                if(entry.target.classList.contains('about-text')) {
                    const stats = document.querySelectorAll('.stat-number');
                    stats.forEach(stat => {
                        const target = +stat.getAttribute('data-target');
                        const increment = target / 40; // 40 steps
                        let current = 0;
                        const updateStat = () => {
                            if(current < target) {
                                current += increment;
                                stat.innerText = Math.ceil(current);
                                setTimeout(updateStat, 40);
                            } else {
                                stat.innerText = target + '+';
                            }
                        }
                        updateStat();
                    });
                }

                // Skills bars
                if(entry.target.classList.contains('skills-block')) {
                    const bars = entry.target.querySelectorAll('.skill-bar-progress');
                    bars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 200);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- 9. 3D Tilt Effect on Hover (Vanilla JS) ----
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            if(window.innerWidth <= 768) return; // disable complex tilt on mobile

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within element
            const y = e.clientY - rect.top;  // y position within element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // Max rotation 15deg
            const rotateY = ((x - centerX) / centerX) * 15;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
        
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'none'; // remove transition for smooth move
        });
    });

    // ---- Form Submission (Prevent Default) ----
    const contactForm = document.querySelector('.contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn span');
            const icon = contactForm.querySelector('.submit-btn i');
            
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            icon.className = 'fas fa-spinner fa-spin';

            setTimeout(() => {
                btn.innerText = 'Sent Successfully!';
                icon.className = 'fas fa-check';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    icon.className = 'fas fa-paper-plane';
                }, 3000);
            }, 1500);
        });
    }

    // Update Year in Footer
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
});
