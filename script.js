// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Service details page video placeholder
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            alert('Video player would open here in a production environment.');
        });
    }
    // Get all links that have hash (#) in them
    const links = document.querySelectorAll('a[href^="#"]');
    
    // Add click event listener to each link
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default anchor behavior
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for fixed header if needed
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to service cards on scroll
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Simple function to check if element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    // Function to add animation class when element is in viewport
    const animateOnScroll = () => {
        serviceCards.forEach(card => {
            if (isInViewport(card)) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation check on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Add a welcome message in console
    console.log('Welcome to Solaris - Where Innovation Meets Excellence!');
});

    document.getElementById('contactForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const form = this;
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('formMessage');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            messageDiv.style.display = 'none';
            
            try {
                const response = await fetch('/solaris/connect.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    messageDiv.className = 'form-message success';
                    messageDiv.textContent = result.message;
                    form.reset();
                } else {
                    messageDiv.className = 'form-message error';
                    messageDiv.textContent = result.error || 'An error occurred. Please try again.';
                }
                
                messageDiv.style.display = 'block';
                
            } catch (error) {
                console.error('Error:', error);
                messageDiv.className = 'form-message error';
                messageDiv.textContent = 'Network error. Please check your connection and try again.';
                messageDiv.style.display = 'block';
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });

        // Add smooth animations on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.contact-form, .social-links').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });

        // Hide header on scroll down, show on scroll up
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.header');

        window.addEventListener('scroll', () => {
            if (!header) return;
            if (window.scrollY > lastScrollY && window.scrollY > 80) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        });

       
// filepath: c:\xampp\htdocs\newwebsite\index.html
// Matrix effect for hero background
const canvas = document.getElementById('matrix-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    function resizeMatrixCanvas() {
        canvas.width = document.querySelector('.hero').offsetWidth;
        canvas.height = document.querySelector('.hero').offsetHeight;
    }
    resizeMatrixCanvas();
    let w = canvas.width;
    let h = canvas.height;
    let cols = Math.floor(w / 20);
    let ypos = Array(cols).fill(0);

    function matrix() {
        ctx.fillStyle = "#0002";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#7c3aed";
        ctx.font = "18px monospace";
        ypos.forEach((y, ind) => {
            const text = String.fromCharCode(0x30A0 + Math.random() * 96);
            ctx.fillText(text, ind * 20, y);
            if (y > h + Math.random() * 10000) ypos[ind] = 0;
            else ypos[ind] = y + 20;
        });
    }
    setInterval(matrix, 60);
    window.addEventListener('resize', () => {
        resizeMatrixCanvas();
        w = canvas.width;
        h = canvas.height;
        cols = Math.floor(w / 20);
        ypos = Array(cols).fill(0);
    });
}

// filepath: c:\xampp\htdocs\newwebsite\index.html
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const circle = document.createElement('span');
        circle.className = 'ripple';
        this.appendChild(circle);
        const d = Math.max(this.clientWidth, this.clientHeight);
        circle.style.width = circle.style.height = d + 'px';
        circle.style.left = e.clientX - this.getBoundingClientRect().left - d/2 + 'px';
        circle.style.top = e.clientY - this.getBoundingClientRect().top - d/2 + 'px';
        setTimeout(() => circle.remove(), 600);
    });
});

const menuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Hide menu and menu button after clicking a nav link (on mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        if (window.innerWidth <= 900) {
            menuBtn.style.display = 'none';
            setTimeout(() => {
                menuBtn.style.display = '';
            }, 800);
        }
    });
});

