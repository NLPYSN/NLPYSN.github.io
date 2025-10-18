/**
 * YSN - Young Scholar Network
 * Main JavaScript File
 */

(function() {
    'use strict';

    // ==========================================
    // Mobile Navigation Toggle
    // ==========================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================
    // Sticky Header on Scroll
    // ==========================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }

        lastScroll = currentScroll;
    });

    // ==========================================
    // Smooth Scrolling for Anchor Links
    // ==========================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip empty href or just "#"
            if (!href || href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // Resource Category Filter (Resources Page)
    // ==========================================
    const resourceButtons = document.querySelectorAll('.resource-nav__btn');
    const resourceCards = document.querySelectorAll('.resource-card');

    if (resourceButtons.length > 0) {
        resourceButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');

                // Update active button
                resourceButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter cards
                resourceCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ==========================================
    // Contact Form Handling (Contact Page)
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

            // Simulate form submission (replace with actual API call)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate API call with timeout
            setTimeout(() => {
                // Success message
                showFormMessage(
                    'Thank you for your interest! We will get back to you soon.',
                    'success'
                );

                // Reset form
                contactForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;

                // Log data (for development - remove in production)
                console.log('Form submitted with data:', data);

                // TODO: Replace with actual form submission
                // Example:
                // fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // })
                // .then(response => response.json())
                // .then(result => {
                //     showFormMessage('Thank you! We will get back to you soon.', 'success');
                //     contactForm.reset();
                // })
                // .catch(error => {
                //     showFormMessage('An error occurred. Please try again.', 'error');
                // })
                // .finally(() => {
                //     submitButton.textContent = originalButtonText;
                //     submitButton.disabled = false;
                // });

            }, 1500);
        });
    }

    function showFormMessage(message, type) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = `form__message form__message--${type}`;
        formMessage.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    // ==========================================
    // Fade-in Animation on Scroll
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const fadeInElements = document.querySelectorAll(
        '.mission__card, .highlight, .vision__card, .goal, .event-card, .member-card, .resource-card'
    );

    if ('IntersectionObserver' in window && fadeInElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeInElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ==========================================
    // Active Page Link Highlight
    // ==========================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks2 = document.querySelectorAll('.nav__link');

    navLinks2.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
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

    // ==========================================
    // Back to Top Button (Optional - Uncomment to Enable)
    // ==========================================
    /*
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--color-primary);
        color: var(--color-secondary);
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    `;

    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    */

    // ==========================================
    // Console Message
    // ==========================================
    console.log('%c👋 Welcome to YSN!', 'font-size: 20px; color: #F5C93F; font-weight: bold;');
    console.log('%cYoung Scholar Network - NLP@U Utrecht University', 'font-size: 14px; color: #1a1a1a;');
    console.log('%cInterested in contributing? Visit: https://github.com/NLP-YSN', 'font-size: 12px; color: #666;');

})();
