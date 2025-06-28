/**
 * Solaris Website Enhanced JavaScript
 * Modern, optimized, and well-structured code
 */

class SolarisWebsite {
    constructor() {
        this.isInitialized = false;
        this.scrollThrottle = null;
        this.resizeThrottle = null;
        this.matrixAnimation = null;
        this.observers = new Map();
        
        // Configuration
        this.config = {
            scrollOffset: window.innerWidth < 768 ? 90 : 70,
            animationDuration: 600,
            matrixFrameRate: 60,
            throttleDelay: 16, // ~60fps
            intersectionThreshold: 0.1,
            intersectionRootMargin: '0px 0px -50px 0px'
        };

        this.init();
    }

    /**
     * Initialize the website functionality
     */
    init() {
        if (this.isInitialized) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
        
        this.isInitialized = true;
        console.log('🚀 Solaris Website Initialized - Where Innovation Meets Excellence!');
    }

    /**
     * Set up all event listeners and initialize components
     */
    setupEventListeners() {
        try {
            this.initializeNavigation();
            this.initializeSmoothScrolling();
            this.initializeAnimations();
            this.initializeMatrixBackground();
            this.initializeContactForm();
            this.initializeButtonRippleEffects();
            this.initializeScrollEffects();
            this.initializeVideoPlaceholder();
            this.initializeAccessibility();
        } catch (error) {
            console.error('Error initializing Solaris website:', error);
        }
    }

    /**
     * Initialize navigation functionality
     */
    initializeNavigation() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');
        
        if (!mobileMenuBtn || !mainNav) return;

        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isActive = mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active', isActive);
            mobileMenuBtn.setAttribute('aria-expanded', isActive.toString());
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mainNav.contains(e.target)) {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                mobileMenuBtn.focus();
            }
        });

        // Close menu when clicking on nav links
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    /**
     * Initialize smooth scrolling for anchor links
     */
    initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - this.config.scrollOffset;
                    
                    window.scrollTo({
                        top: Math.max(0, offsetTop),
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const mainNav = document.querySelector('.main-nav');
                    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                    if (mainNav?.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        mobileMenuBtn?.classList.remove('active');
                        mobileMenuBtn?.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }

                    // Update focus for accessibility
                    targetElement.focus({ preventScroll: true });
                }
            });
        });
    }

    /**
     * Initialize scroll-based animations using Intersection Observer
     */
    initializeAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .contact-form, .social-links');
        
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: this.config.intersectionThreshold,
            rootMargin: this.config.intersectionRootMargin
        });

        animatedElements.forEach(element => {
            this.prepareElementForAnimation(element);
            observer.observe(element);
        });

        this.observers.set('scrollAnimation', observer);
    }

    /**
     * Prepare element for animation
     */
    prepareElementForAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${Math.random() * 0.2}s, transform 0.6s ease ${Math.random() * 0.2}s`;
    }

    /**
     * Animate element into view
     */
    animateElement(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    /**
     * Initialize Matrix background animation
     */
    initializeMatrixBackground() {
        const canvas = document.getElementById('matrix-bg');
        if (!canvas) return;
    
        // Check if battery is low or device is mobile
        const isMobile = window.innerWidth < 768;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
        if (prefersReducedMotion) {
            // Use a static background instead
            canvas.style.background = 'var(--bg-primary)';
            return;
        }
    
        const ctx = canvas.getContext('2d');
        let animationId;
        let matrixData = {
            cols: 0,
            ypos: [],
            lastTime: 0
        };

        const resizeCanvas = () => {
            const hero = document.querySelector('.hero');
            if (!hero) return;
            
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
            matrixData.cols = Math.floor(canvas.width / (isMobile ? 30 : 20));
            matrixData.ypos = Array(matrixData.cols).fill(0);
        };

        const drawMatrix = (currentTime) => {
            if (currentTime - matrixData.lastTime < 1000 / this.config.matrixFrameRate) {
                animationId = requestAnimationFrame(drawMatrix);
                return;
            }

            matrixData.lastTime = currentTime;

            // Create fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw matrix characters
            ctx.fillStyle = '#7c3aed';
            ctx.font = '18px monospace';
            
            matrixData.ypos.forEach((y, index) => {
                const char = String.fromCharCode(0x30A0 + Math.random() * 96);
                const x = index * 20;
                
                ctx.fillText(char, x, y);
                
                if (y > canvas.height + Math.random() * 10000) {
                    matrixData.ypos[index] = 0;
                } else {
                    matrixData.ypos[index] = y + 20;
                }
            });

            animationId = requestAnimationFrame(drawMatrix);
        };

        // Initialize and start animation
        resizeCanvas();
        animationId = requestAnimationFrame(drawMatrix);

        // Handle resize with throttling
        const handleResize = this.throttle(() => {
            resizeCanvas();
        }, 250);

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        this.matrixAnimation = { animationId, handleResize };

        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animationId = requestAnimationFrame(drawMatrix);
            }
        });
    }

    /**
     * Initialize contact form with enhanced validation and submission
     */
    initializeContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const fields = {
            name: form.querySelector('#name'),
            email: form.querySelector('#email'),
            subject: form.querySelector('#subject'),
            message: form.querySelector('#message')
        };

        // Real-time validation
        Object.entries(fields).forEach(([fieldName, field]) => {
            if (!field) return;
            
            field.addEventListener('blur', () => this.validateField(fieldName, field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(form, fields);
        });
    }

    /**
     * Validate individual form field
     */
    validateField(fieldName, field) {
        const value = field.value.trim();
        let isValid = value.length > 0; // Example validation, replace with your logic
    
        // Email format validation
    if (fieldName === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailPattern.test(value);
    }
    
        // Add visual feedback
        if (isValid && value) {
            field.classList.add('valid');
            field.classList.remove('error');
            
            // Show valid icon
            const fieldContainer = field.parentElement;
            let validIcon = fieldContainer.querySelector('.valid-icon');
            if (!validIcon) {
                validIcon = document.createElement('span');
                validIcon.className = 'valid-icon';
                validIcon.innerHTML = '<i class="fas fa-check"></i>';
                fieldContainer.appendChild(validIcon);
            }
            validIcon.style.display = 'block';
        } else {
            field.classList.remove('valid');
            const validIcon = field.parentElement.querySelector('.valid-icon');
            if (validIcon) validIcon.style.display = 'none';
        }
    
        return isValid;
    }

    /**
     * Clear field error styling
     */
    clearFieldError(field) {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
    }

    /**
     * Handle form submission
     *//**
 * Handle form submission - FIXED VERSION
 */
async handleFormSubmission(form, fields) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('formMessage');
    const originalBtnText = submitBtn.innerHTML;

    // Validate all fields
    let isFormValid = true;
    Object.entries(fields).forEach(([fieldName, field]) => {
        if (field && !this.validateField(fieldName, field)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        this.showFormMessage('Please correct the errors above', 'error');
        return;
    }

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    messageDiv.style.display = 'none';

    try {
        const formData = new FormData(form);
        
     
        const response = await fetch('connect.php', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            this.showFormMessage(result.message || 'Message sent successfully!', 'success');
            form.reset();
            
            // Clear all field validations
            Object.values(fields).forEach(field => {
                if (field) {
                    this.clearFieldError(field);
                    field.classList.remove('valid');
                    const validIcon = field.parentElement.querySelector('.valid-icon');
                    if (validIcon) validIcon.style.display = 'none';
                }
            });
        } else {
            // Handle both single error message and multiple errors
            if (result.errors && Array.isArray(result.errors)) {
                this.showFormMessage(result.errors.join(', '), 'error');
            } else {
                this.showFormMessage(result.message || result.error || 'An error occurred. Please try again.', 'error');
            }
        }

    } catch (error) {
        console.error('Form submission error:', error);
        this.showFormMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

    /**
     * Show form message
     */
    showFormMessage(message, type) {
        const messageDiv = document.getElementById('formMessage');
        if (!messageDiv) return;

        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        messageDiv.setAttribute('role', 'alert');

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Initialize button ripple effects
     */
    initializeButtonRippleEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const existingRipple = btn.querySelector('.ripple');
                if (existingRipple) existingRipple.remove();

                const circle = document.createElement('span');
                circle.className = 'ripple';
                
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                circle.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                btn.appendChild(circle);
                
                setTimeout(() => circle.remove(), this.config.animationDuration);
            });
        });
    }

    /**
     * Initialize scroll-based effects (header hide/show)
     */
    initializeScrollEffects() {
        const header = document.querySelector('.header');
        const serviceHeader = document.querySelector('.service-header');
        
        if (!header && !serviceHeader) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            // Handle main header if it exists
            if (header) {
                if (currentScrollY > lastScrollY && currentScrollY > 80) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            }
            
            // Handle service header if it exists
            if (serviceHeader) {
                if (currentScrollY > lastScrollY && currentScrollY > 80) {
                    serviceHeader.style.transform = 'translateY(-100%)';
                } else {
                    serviceHeader.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /**
     * Initialize video placeholder functionality
     */
    initializeVideoPlaceholder() {
        const videoPlaceholder = document.querySelector('.video-placeholder');
        
        if (videoPlaceholder) {
            videoPlaceholder.addEventListener('click', () => {
                this.showNotification('Video player would open here in production environment.', 'info');
            });
        }
    }

    /**
     * Initialize accessibility enhancements
     */
    initializeAccessibility() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector('#main-content');
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Keyboard navigation for service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            const link = card.querySelector('.service-link');
            if (link) {
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        link.click();
                    }
                });
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
            }
        });
    }

    /**
     * Show notification (alternative to alert)
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    /**
     * Throttle function for performance optimization
     */
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    /**
     * Cleanup method for removing event listeners and observers
     */
    destroy() {
        // Cancel matrix animation
        if (this.matrixAnimation?.animationId) {
            cancelAnimationFrame(this.matrixAnimation.animationId);
        }

        // Remove resize listener
        if (this.matrixAnimation?.handleResize) {
            window.removeEventListener('resize', this.matrixAnimation.handleResize);
        }

        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        // Clear throttled functions
        if (this.scrollThrottle) clearTimeout(this.scrollThrottle);
        if (this.resizeThrottle) clearTimeout(this.resizeThrottle);

        this.isInitialized = false;
        console.log('🛑 Solaris Website destroyed and cleaned up');
    }
}

// Initialize the website when DOM is ready
const solarisWebsite = new SolarisWebsite();

// Expose instance globally for debugging (optional)
if (typeof window !== 'undefined') {
    window.solarisWebsite = solarisWebsite;
}

// Handle page unload for cleanup
window.addEventListener('beforeunload', () => {
    solarisWebsite.destroy();
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolarisWebsite;
}