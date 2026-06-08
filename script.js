

// =========================================
// CUSTOM CURSOR
// =========================================
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    const animateOutline = () => {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateOutline);
    };
    animateOutline();

    // Hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .connect-item, .info-box');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
}


// =========================================
// SCROLL TO TOP BUTTON
// =========================================
const scrollTopBtn = document.getElementById('scroll-top-btn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}, { passive: true });

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =========================================
// BASIC SETUP
// =========================================
document.getElementById('current-year').textContent = new Date().getFullYear();
document.getElementById('current-year-nav').textContent = new Date().getFullYear(); 

AOS.init({
    duration: 800,
    once: true,
    offset: 80,
});

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarNav = document.getElementById('sidebar-nav');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const menuBgContainer = document.getElementById('menu-bg-container'); 
    const closeBtn = document.getElementById('close-btn');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // =========================================
    // SIDEBAR NAVIGATION
    // =========================================
    const toggleSidebar = () => {
        sidebarNav.classList.toggle('active');
        menuBgContainer.classList.toggle('active');         sidebarOverlay.classList.toggle('active');
    };

    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (closeBtn) closeBtn.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    navLinks.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            setTimeout(() => {
                if (sidebarNav.classList.contains('active')) toggleSidebar();
            }, 300);
        });
    });

    // Active link observer
    const sections = document.querySelectorAll('section, header');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                const correspondingLink = document.querySelector(`.nav-links a[href="#${targetId}"]`);
                if (correspondingLink) correspondingLink.classList.add('active');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => navObserver.observe(section));

    // =========================================
    // TYPEWRITER EFFECT
    // =========================================
    const textElement = document.getElementById('job-title');
    const textsToAnimate = ["High School Student.", "Tech Enthusiast.", "Front-end Developer."];
    let textIndex = 0;   
    let charIndex = 0;   
    let isDeleting = false;
    
    const type = () => {
        if (!textElement) return; 
        const currentText = textsToAnimate[textIndex]; 

        if (isDeleting) {            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % textsToAnimate.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, 60);
            }
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 1500);
            } else {
                setTimeout(type, 100);
            }
        }
    };
    type();

    // =========================================
    // TIMELINE ANIMATION
    // =========================================
    const timeline = document.getElementById('timeline-animated');
    const timelineFill = document.getElementById('timeline-fill');
    const timelineDots = document.querySelectorAll('.timeline-dot-container');

    if (timeline && timelineFill) {
        const updateTimelineProgress = () => {
            const timelineRect = timeline.getBoundingClientRect();
            const timelineTop = timelineRect.top;
            const timelineHeight = timelineRect.height;
            const windowHeight = window.innerHeight;
            const triggerPoint = windowHeight * 0.7;
            
            let scrollProgress = 0;
            if (timelineTop < triggerPoint) {
                const scrolledPast = triggerPoint - timelineTop;
                scrollProgress = Math.min(scrolledPast / timelineHeight, 1);
            }
            
            timelineFill.style.height = (scrollProgress * 100) + '%';
            
            timelineDots.forEach((dot) => {
                const dotRect = dot.getBoundingClientRect();
                const dotCenterY = dotRect.top + (dotRect.height / 2);
                if (dotCenterY <= triggerPoint + 20) {
                    if (!dot.classList.contains('icon-active')) dot.classList.add('icon-active');                } else {
                    dot.classList.remove('icon-active');
                }
            });
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateTimelineProgress();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        updateTimelineProgress();
    }

    // =========================================
    // STATS COUNTER ANIMATION
    // =========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-target'));
                animateCounter(target, finalValue);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);            }
        }, stepTime);
    }

    // =========================================
    // SKILL PROGRESS BARS ANIMATION
    // =========================================
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // =========================================
    // PROJECT FILTERS
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // =========================================
    // MAGNETIC BUTTON EFFECT
    // =========================================
    if (window.innerWidth > 768) {
        const magneticBtns = document.querySelectorAll('.magnetic');
        magneticBtns.forEach(btn => {            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // =========================================
    // CONTACT FORM
    // =========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Open email client with pre-filled data
            const mailtoLink = `mailto:tianppubg09@gmail.com?subject=Portfolio Contact from ${name}&body=${encodeURIComponent(message)}%0A%0AFrom: ${name}%0AEmail: ${email}`;
            window.location.href = mailtoLink;
            
            contactForm.reset();
            
            // Show success feedback
            const submitBtn = contactForm.querySelector('.submit-btn span');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Message Sent!';
            setTimeout(() => {
                submitBtn.textContent = originalText;
            }, 3000);
        });
    }

    // =========================================
    // SMOOTH REVEAL ON SCROLL
    // =========================================
    const revealElements = document.querySelectorAll('.section-title, .section-subtitle');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        revealObserver.observe(el);
    });
});

// Add fadeInUp animation for project filter
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);