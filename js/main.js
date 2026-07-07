document.addEventListener('DOMContentLoaded', function() {
    // ===== Header scroll effect =====
    const header = document.getElementById('header');
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    // ===== Mobile menu =====
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===== Smooth scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Scroll reveal animations =====
    const revealElements = document.querySelectorAll('.section-header, .about__card, .project-card, .team__card, .gallery__item, .contacts__card');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.7s ease-out ${index * 0.05}s, transform 0.7s ease-out ${index * 0.05}s`;
        revealObserver.observe(el);
    });

    // Revealed class handler
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ===== Active nav link on scroll =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ===== Parallax effect for hero =====
    const heroBg = document.querySelector('.hero__bg img');
    if (heroBg) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroBg.style.transform = `translateY(${rate}px)`;
        }, { passive: true });
    }

    // ===== Gallery lightbox (simple) =====
    const galleryItems = document.querySelectorAll('.gallery__item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (!img) return;
            
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.9);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: zoom-out;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.cssText = `
                max-width: 90vw;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 8px;
                transform: scale(0.95);
                transition: transform 0.3s ease;
            `;
            
            overlay.appendChild(lightboxImg);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
            
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            });
            
            overlay.addEventListener('click', function() {
                overlay.style.opacity = '0';
                lightboxImg.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    overlay.remove();
                    document.body.style.overflow = '';
                }, 300);
            });
        });
    });
    
    // ===== Modals =====
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', e => {
            e.preventDefault();
            const modalId = 'modal-' + trigger.dataset.modal;
            document.getElementById(modalId).classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    document.querySelectorAll('[data-modal-close]').forEach(el => {
        el.addEventListener('click', () => {
            el.closest('.modal').classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(m => {
                m.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    });

    // ===== Cookies Banner =====
    const cookiesBanner = document.getElementById('cookiesBanner');
    const cookiesAccept = document.getElementById('cookiesAccept');
    
    if (cookiesBanner && cookiesAccept) {
        setTimeout(() => {
            if (!localStorage.getItem('cookiesAccepted')) {
                cookiesBanner.classList.add('active');
            }
        }, 2000);
        
        cookiesAccept.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookiesBanner.classList.remove('active');
        });
    }
});
