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
    
    const projectsPerPage = 3;
    const allProjectCards = document.querySelectorAll('.project-card');
    let visibleCount = projectsPerPage;

    const loadMoreBtn = document.getElementById('load-more-btn');

    function updateProjectVisibility() {
        allProjectCards.forEach((card, index) => {
            if (index < visibleCount) {
                if (card.classList.contains('hidden-by-load')) {
                    card.classList.remove('hidden-by-load');
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = 'projectReveal 0.5s ease forwards';
                    card.style.animationDelay = `${(index % projectsPerPage) * 0.1}s`;
                }
            } else {
                card.classList.add('hidden-by-load');                card.style.animation = 'none';
            }
        });

        if (loadMoreBtn) {
            const allVisible = visibleCount >= allProjectCards.length;
            const btnLabel = loadMoreBtn.querySelector('span');
            const btnIcon = document.getElementById('load-more-icon');

            if (allVisible) {
                btnLabel.textContent = 'See Less';
                if (btnIcon) btnIcon.textContent = '▲';
            } else {
                btnLabel.textContent = 'See More';
                if (btnIcon) btnIcon.textContent = '▼';
            }
        }
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const allVisible = visibleCount >= allProjectCards.length;

            if (allVisible) {
                visibleCount = projectsPerPage;
                const projectSection = document.getElementById('projects');
                if (projectSection) projectSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                visibleCount += projectsPerPage;
            }

            updateProjectVisibility();
            if (typeof AOS !== 'undefined') AOS.refresh();
        });
    }

    updateProjectVisibility();

    const toggleSidebar = () => {
        sidebarNav.classList.toggle('active');
        menuBgContainer.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    };

    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (closeBtn) closeBtn.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    navLinks.forEach(item => {        item.addEventListener('click', (e) => {
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

    const textElement = document.getElementById('job-title');
    const textsToAnimate = ["High School Student.", "Tech Enthusiast.", "Front-end Developer."];
    let textIndex = 0;   
    let charIndex = 0;   
    let isDeleting = false;
    
    const type = () => {
        if (!textElement) return; 
        const currentText = textsToAnimate[textIndex]; 

        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
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
            charIndex++;            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 1500);
            } else {
                setTimeout(type, 100);
            }
        }
    };
    type();

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
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

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

    if (window.innerWidth > 768) {
        const magneticBtns = document.querySelectorAll('.magnetic');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
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

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
                        const mailtoLink = `mailto:tianppubg09@gmail.com?subject=Portfolio Contact from ${name}&body=${encodeURIComponent(message)}%0A%0AFrom: ${name}%0AEmail: ${email}`;
            window.location.href = mailtoLink;
            
            contactForm.reset();
            
            const submitBtn = contactForm.querySelector('.submit-btn span');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Message Sent!';
            setTimeout(() => {
                submitBtn.textContent = originalText;
            }, 3000);
        });
    }

    const revealElements = document.querySelectorAll('.section-title, .section-subtitle');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        revealObserver.observe(el);
    });
});

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