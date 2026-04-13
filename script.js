document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    function toggleMenu() {
        mobileMenuOverlay.classList.toggle('active');
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : 'auto';
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 3. Smooth Scroll to anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position considering the fixed navbar
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Scroll Reveal Animations (fade-up)
    const revealElements = document.querySelectorAll('.fade-up');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Generic Carousel Factory
    function initCarousel(trackId, nextId, prevId, dotsId, itemsPerPage = { desktop: 1, tablet: 1, mobile: 1 }) {
        const track = document.getElementById(trackId);
        if (!track) return;
        
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById(nextId);
        const prevBtn = document.getElementById(prevId);
        const dotsContainer = document.getElementById(dotsId);
        
        let currentSlideIndex = 0;
        let perPage = itemsPerPage.desktop;

        function updatePerPage() {
            if (window.innerWidth <= 768) perPage = itemsPerPage.mobile;
            else if (window.innerWidth <= 992) perPage = itemsPerPage.tablet;
            else perPage = itemsPerPage.desktop;
        }

        function calculateTotalPages() {
            return Math.ceil(slides.length / perPage);
        }

        function buildDots() {
            const totalPages = calculateTotalPages();
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToPage(i));
                dotsContainer.appendChild(dot);
            }
        }

        function goToPage(index) {
            const totalPages = calculateTotalPages();
            if (index < 0) index = totalPages - 1;
            else if (index >= totalPages) index = 0;
            
            const movePercent = index * 100;
            track.style.transform = `translateX(-${movePercent}%)`;
            currentSlideIndex = index;
            
            const dots = Array.from(dotsContainer.children);
            dots.forEach(d => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }

        if (nextBtn) nextBtn.addEventListener('click', () => goToPage(currentSlideIndex + 1));
        if (prevBtn) prevBtn.addEventListener('click', () => goToPage(currentSlideIndex - 1));

        window.addEventListener('resize', () => {
            updatePerPage();
            buildDots();
            goToPage(0);
        });

        updatePerPage();
        buildDots();
    }

    // Initialize Gallery Carousel
    initCarousel('gallery-track', 'next-gallery', 'prev-gallery', 'gallery-dots', {
        desktop: 1, tablet: 1, mobile: 1
    });

    // Initialize Insurance Carousel (Manual)
    initCarousel('insurance-track', 'next-insurance', 'prev-insurance', 'insurance-dots', {
        desktop: 4, tablet: 3, mobile: 2
    });

    // 6. Accordion Exclusive Logic (Unified for Specialties and FAQ)
    document.querySelectorAll('details').forEach((targetDetail) => {
        targetDetail.addEventListener('click', (e) => {
            // Only trigger if we are opening it
            if (!targetDetail.open) {
                const group = targetDetail.closest('.accordion-group') || targetDetail.closest('.faq-list');
                const others = group ? group.querySelectorAll('details') : document.querySelectorAll('details');
                
                others.forEach((detail) => {
                    if (detail !== targetDetail && detail.open) {
                        detail.removeAttribute('open');
                    }
                });
            }
        });
    });
});

