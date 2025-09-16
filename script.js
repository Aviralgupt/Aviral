// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Download Resume Function
function downloadResume() {
    // Create a modal with options
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(10px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(59, 130, 246, 0.3);
        max-width: 500px;
        width: 90%;
    `;
    
    modalContent.innerHTML = `
        <h3 style="color: #3b82f6; font-size: 24px; margin-bottom: 20px; font-weight: 600;">
            📄 Resume Options
        </h3>
        <p style="color: #e2e8f0; margin-bottom: 30px; line-height: 1.6;">
            Choose how you'd like to access my resume:
        </p>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <button onclick="viewResumeOnline()" style="
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 14px;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                🌐 View Online
            </button>
            <button onclick="printResume()" style="
                background: linear-gradient(135deg, #10b981, #047857);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 14px;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                🖨️ Print/Save as PDF
            </button>
            <button onclick="contactForResume()" style="
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 14px;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                📧 Request Latest
            </button>
        </div>
        <button onclick="closeResumeModal()" style="
            background: transparent;
            color: #94a3b8;
            border: 1px solid #475569;
            padding: 8px 20px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s ease;
        " onmouseover="this.style.color='#e2e8f0'; this.style.borderColor='#64748b'" onmouseout="this.style.color='#94a3b8'; this.style.borderColor='#475569'">
            Close
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Add functions to global scope
    window.viewResumeOnline = function() {
        window.open('resume.html', '_blank');
        document.body.removeChild(modal);
    };
    
    window.printResume = function() {
        const printWindow = window.open('resume.html?print=true', '_blank');
        printWindow.addEventListener('load', function() {
            setTimeout(() => {
                printWindow.print();
            }, 1000);
        });
        document.body.removeChild(modal);
    };
    
    window.contactForResume = function() {
        window.open('mailto:aviralgupta@usf.edu?subject=Resume Request&body=Hi Aviral,%0D%0A%0D%0AI would like to request your latest resume.%0D%0A%0D%0AThank you!', '_blank');
        document.body.removeChild(modal);
    };
    
    window.closeResumeModal = function() {
        document.body.removeChild(modal);
    };
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Project filtering functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Animated counter for hero stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Trigger counter animation when hero section is visible
const heroSection = document.querySelector('.hero');
const statNumbers = document.querySelectorAll('.stat-number');

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (heroSection) {
    heroObserver.observe(heroSection);
}

// Floating elements parallax effect
const floatingElements = document.querySelectorAll('.floating-element');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    floatingElements.forEach(element => {
        const speed = element.getAttribute('data-speed');
        const yPos = -(scrolled * speed * 0.1);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// World map interaction
const mapPoints = document.querySelectorAll('.map-point');
mapPoints.forEach(point => {
    point.addEventListener('mouseenter', () => {
        const location = point.getAttribute('data-location');
        showLocationTooltip(point, location);
    });
    
    point.addEventListener('mouseleave', () => {
        hideLocationTooltip();
    });
});

function showLocationTooltip(element, location) {
    const tooltip = document.createElement('div');
    tooltip.className = 'location-tooltip';
    tooltip.textContent = location;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.9rem;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        transform: translateY(-40px);
    `;
    
    element.appendChild(tooltip);
}

function hideLocationTooltip() {
    const tooltip = document.querySelector('.location-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Model UN chamber interaction
const delegateSeats = document.querySelectorAll('.seat');
delegateSeats.forEach(seat => {
    seat.addEventListener('click', () => {
        const country = seat.getAttribute('data-country');
        showDelegateInfo(country);
    });
});

function showDelegateInfo(country) {
    const info = document.createElement('div');
    info.className = 'delegate-info';
    info.innerHTML = `
        <div class="delegate-info-content">
            <h4>${country} Delegate</h4>
            <p>Representing ${country} in the United Nations General Assembly</p>
            <button class="close-info">&times;</button>
        </div>
    `;
    
    info.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        text-align: center;
    `;
    
    document.body.appendChild(info);
    
    // Close button functionality
    const closeBtn = info.querySelector('.close-info');
    closeBtn.addEventListener('click', () => {
        info.remove();
    });
    
    // Close on outside click
    info.addEventListener('click', (e) => {
        if (e.target === info) {
            info.remove();
        }
    });
}

// Adventure cards interaction
const adventureCards = document.querySelectorAll('.adventure-card');
adventureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Interest cards interaction
const interestCards = document.querySelectorAll('.interest-card');
interestCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.interest-icon');
        icon.style.transform = 'scale(1.2) rotate(10deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.interest-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Contact form handling with enhanced validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Enhanced validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (name.length < 2) {
            showNotification('Name must be at least 2 characters long', 'error');
            return;
        }
        
        if (subject.length < 5) {
            showNotification('Subject must be at least 5 characters long', 'error');
            return;
        }
        
        if (message.length < 10) {
            showNotification('Message must be at least 10 characters long', 'error');
            return;
        }
        
        // Simulate form submission (replace with actual form handling)
        showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
        this.reset();
        
        // Add success animation
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        submitBtn.style.background = 'var(--secondary-color)';
        
        setTimeout(() => {
            submitBtn.innerHTML = 'Send Message';
            submitBtn.style.background = '';
        }, 3000);
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 6000);
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation for project cards
function animateProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
}

// Initialize animations when page loads
window.addEventListener('load', () => {
    animateProjectCards();
});

// Add hover effects for skill tags
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(2deg)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Add interactive features for portfolio cards
document.querySelectorAll('.portfolio-card').forEach(card => {
    // Add click to expand functionality for mobile
    if (window.innerWidth <= 768) {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    }
    
    // Add hover effects for portfolio tags
    const tags = card.querySelectorAll('.portfolio-tag');
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Smooth reveal animation for stats
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + '+';
        }, 50);
    });
}

// Trigger stats animation when about section is visible
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    aboutObserver.observe(aboutSection);
}

// Add cursor trail effect (optional)
let mouseX = 0;
let mouseY = 0;
let cursorTrail = [];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create cursor trail effect (reduced frequency for performance)
    if (Math.random() > 0.95) {
        createCursorTrail();
    }
});

function createCursorTrail() {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--gradient-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${mouseX}px;
        top: ${mouseY}px;
        animation: fadeOut 1s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    
    // Add fade out animation
    if (!document.querySelector('#cursor-trail-styles')) {
        const style = document.createElement('style');
        style.id = 'cursor-trail-styles';
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove trail element after animation
    setTimeout(() => {
        if (trail.parentNode) {
            trail.remove();
        }
    }, 1000);
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations and effects
}, 16)); // 60fps

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Arrow keys for navigation
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        const currentSection = getCurrentSection();
        const nextSection = currentSection.nextElementSibling;
        if (nextSection && nextSection.tagName === 'SECTION') {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        const currentSection = getCurrentSection();
        const prevSection = currentSection.previousElementSibling;
        if (prevSection && prevSection.tagName === 'SECTION') {
            prevSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    let currentSection = sections[0];
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
        }
    });
    
    return currentSection;
}

// Add accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.hero');
    if (mainContent) {
        mainContent.id = 'main';
        mainContent.setAttribute('role', 'main');
    }
});

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dark Theme Portfolio with Tailwind CSS loaded successfully! 🌟');
    
    // Initialize portfolio animations
    initializePortfolioAnimations();
    
    // Initialize falling stars animation
    initializeFallingStars();
    
    // Initialize project filtering
    initializeProjectFiltering();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Add some fun Easter eggs
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            document.body.style.animation = 'rainbow 2s infinite';
            if (!document.querySelector('#rainbow-styles')) {
                const style = document.createElement('style');
                style.id = 'rainbow-styles';
                style.textContent = `
                    @keyframes rainbow {
                        0% { filter: hue-rotate(0deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
            
            showNotification('🎉 Konami Code activated! You found the secret!', 'success');
        }
    });
    

    
    // Add floating action button for quick navigation
    const fab = document.createElement('div');
    fab.innerHTML = '<i class="fas fa-arrow-up"></i>';
    fab.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: var(--gradient-secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
        transition: var(--transition);
        opacity: 0;
        transform: scale(0);
    `;
    
    fab.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Show/hide FAB based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            fab.style.opacity = '1';
            fab.style.transform = 'scale(1)';
        } else {
            fab.style.opacity = '0';
            fab.style.transform = 'scale(0)';
        }
    });
    
    document.body.appendChild(fab);
    
    // Add loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <h2>Loading Adventure Portfolio...</h2>
            <p>Preparing for an amazing journey</p>
        </div>
    `;
    
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--gradient-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        text-align: center;
    `;
    
    // Add loading spinner styles
    if (!document.querySelector('#loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            .loading-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 2rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-content h2 {
                font-size: 2rem;
                margin-bottom: 1rem;
                font-family: 'Playfair Display', serif;
            }
            
            .loading-content p {
                font-size: 1.1rem;
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loadingScreen);
    
    // Remove loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1500);
    });
});

// Falling stars animation
function initializeFallingStars() {
    const starsContainer = document.querySelector('.fixed.inset-0');
    if (!starsContainer) return;
    
    // Create additional stars dynamically
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'absolute w-1 h-1 bg-white rounded-full animate-fall';
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 20 + 's';
        star.style.animationDuration = (Math.random() * 10 + 5) + 's';
        starsContainer.appendChild(star);
    }
    
    // Add twinkling effect
    setInterval(() => {
        const stars = document.querySelectorAll('.animate-fall');
        stars.forEach(star => {
            if (Math.random() > 0.8) {
                star.style.opacity = '0.3';
                setTimeout(() => {
                    star.style.opacity = '1';
                }, 500);
            }
        });
    }, 2000);
}

// Project filtering functionality
function initializeProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('[data-category]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-primary-500', 'text-white');
                btn.classList.add('bg-dark-700', 'text-gray-300');
            });
            button.classList.add('active', 'bg-primary-500', 'text-white');
            button.classList.remove('bg-dark-700', 'text-gray-300');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Portfolio animations and interactions
function initializePortfolioAnimations() {
    // Animate metrics when portfolio cards come into view
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const portfolioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animatePortfolioMetrics(entry.target);
                portfolioObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    portfolioCards.forEach(card => portfolioObserver.observe(card));
}

function animatePortfolioMetrics(card) {
    const metrics = card.querySelectorAll('.metric-value');
    metrics.forEach(metric => {
        const originalText = metric.textContent;
        const numericValue = parseFloat(originalText);
        
        if (!isNaN(numericValue)) {
            animateMetricCounter(metric, numericValue, originalText);
        }
    });
}

function animateMetricCounter(element, target, originalText) {
    let start = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = originalText;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, stepTime);
}

// Add intersection observer for all sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
        }
    });
}, { threshold: 0.1 });

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Add smooth reveal animations for elements
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, { threshold: 0.1 });

// Observe elements that should reveal
document.querySelectorAll('.adventure-card, .project-card, .interest-card, .topic-card, .timeline-item').forEach(el => {
    revealObserver.observe(el);
});

// Add CSS for reveal animations
if (!document.querySelector('#reveal-styles')) {
    const style = document.createElement('style');
    style.id = 'reveal-styles';
    style.textContent = `
        .adventure-card, .project-card, .interest-card, .topic-card, .timeline-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .adventure-card.reveal, .project-card.reveal, .interest-card.reveal, .topic-card.reveal, .timeline-item.reveal {
            opacity: 1;
            transform: translateY(0);
        }
        
        .section-visible {
            animation: sectionReveal 0.8s ease forwards;
        }
        
        @keyframes sectionReveal {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Dark theme enhancements */
        .timeline-item:hover .marker-dot {
            box-shadow: 0 0 20px var(--primary-color);
            transform: scale(1.2);
        }
        
        .portfolio-card:hover .company-logo {
            transform: scale(1.1) rotate(5deg);
        }
        
        .interest-card:hover .interest-icon {
            box-shadow: 0 0 30px var(--primary-color);
        }
    `;
    document.head.appendChild(style);
}

