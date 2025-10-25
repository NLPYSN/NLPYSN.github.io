/**
 * YSN - Young Scholar Network
 * Simplified JavaScript
 */

(function() {
    'use strict';

    // ==========================================
    // Mobile Navigation Toggle
    // ==========================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Create overlay element
    let navOverlay = document.querySelector('.nav__overlay');
    if (!navOverlay && navMenu) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav__overlay';
        document.body.appendChild(navOverlay);
    }

    if (navToggle && navMenu) {
        // Toggle menu function
        function toggleMenu() {
            const isActive = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            if (navOverlay) navOverlay.classList.toggle('active');
            document.body.style.overflow = !isActive ? 'hidden' : '';
        }

        // Close menu function
        function closeMenu() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            if (navOverlay) navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Toggle on hamburger click
        navToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }

        // Close menu when clicking outside (keeping for extra safety)
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // ==========================================
    // Smooth Scrolling for Anchor Links
    // ==========================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // Contact Form Handling
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Basic validation
            const requiredFields = ['name', 'email', 'status'];
            let isValid = true;
            let errorMessage = '';

            requiredFields.forEach(field => {
                if (!data[field]) {
                    isValid = false;
                    errorMessage = 'Please fill in all required fields.';
                }
            });

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (data.email && !emailRegex.test(data.email)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }

            if (!isValid) {
                showFormMessage(errorMessage, 'error');
                return;
            }

            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            setTimeout(() => {
                showFormMessage('Thank you for your interest! We will get back to you soon.', 'success');
                contactForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;

                // TODO: Replace with actual form submission API call
                console.log('Form submitted:', data);
            }, 1500);
        });
    }

    function showFormMessage(message, type) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = `form__message form__message--${type}`;
        formMessage.classList.remove('hidden');

        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        }
    }

    // ==========================================
    // Active Page Link Highlight
    // ==========================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav__link');

    // Remove all active classes first to prevent conflicts
    allNavLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current page link
    allNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage ||
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === '/' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ==========================================
    // External Links - Open in New Tab
    // ==========================================
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

})();
