/**
 * Animation Manager
 * Handles scroll-triggered animations, parallax effects, and interactive animations
 */

export class AnimationManager {
    constructor() {
        this.fadeElements = [];
        this.skillCards = [];
        this.projectCards = [];
        this.floatingElements = [];
        this.observer = null;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.fadeElements = document.querySelectorAll('.fade-in');
        this.skillCards = document.querySelectorAll('.skill-card');
        this.projectCards = document.querySelectorAll('.project-card');
        this.floatingElements = document.querySelectorAll('.floating-element');
        
        this.setupIntersectionObserver();
        this.setupProjectCardInteractions();
        this.setupFloatingElements();
        this.initTypewriterEffect();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Special handling for skill cards
                    if (entry.target.classList.contains('skill-card')) {
                        this.animateSkillProgress(entry.target);
                    }
                }
            });
        }, observerOptions);

        this.fadeElements.forEach(element => {
            this.observer.observe(element);
        });
    }

    setupProjectCardInteractions() {
        this.projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateProjectCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateProjectCard(card, 'leave');
            });
        });
    }

    setupFloatingElements() {
        this.floatingElements.forEach((element, index) => {
            const speed = element.dataset.speed || 0.1;
            element.dataset.speed = speed;
        });
    }

    animateProjectCard(card, action) {
        if (action === 'enter') {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
        }
    }

    animateSkillProgress(skillCard) {
        const progressBar = skillCard.querySelector('.skill-progress');
        if (progressBar) {
            const width = progressBar.dataset.width;
            if (width) {
                // Animate progress bar
                setTimeout(() => {
                    progressBar.style.transform = `scaleX(${width / 100})`;
                }, 200);
            }
        }
    }

    initTypewriterEffect() {
        const texts = [
            'Creative Developer',
            'Digital Artist', 
            'UI/UX Designer',
            'Problem Solver'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const subtitle = document.querySelector('.hero-subtitle');
        
        if (!subtitle) return;
        
        const originalText = subtitle.textContent;
        
        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                subtitle.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                subtitle.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        // Start typewriter after initial animation
        setTimeout(type, 2000);
    }

    handleScroll() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Parallax effect for floating elements
        this.updateParallax();
        
        // Check for new elements to animate
        this.checkForNewAnimations();
        
        requestAnimationFrame(() => {
            this.isAnimating = false;
        });
    }

    updateParallax() {
        const scrolled = window.scrollY;
        
        this.floatingElements.forEach((element, index) => {
            const speed = parseFloat(element.dataset.speed) || 0.1;
            const translateY = scrolled * speed;
            const rotate = scrolled * 0.1;
            
            element.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
        });
    }

    checkForNewAnimations() {
        // Check if any new elements have come into view
        this.fadeElements.forEach(element => {
            if (!element.classList.contains('visible')) {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.8;
                
                if (isVisible) {
                    element.classList.add('visible');
                }
            }
        });
    }

    handleResize() {
        // Recalculate positions and sizes for responsive animations
        this.updateParallax();
        
        // Re-observe elements if needed
        if (this.observer) {
            this.fadeElements.forEach(element => {
                this.observer.observe(element);
            });
        }
    }

    // Public methods for external control
    animateElement(element, animation, duration = 1000) {
        if (!element) return;
        
        element.style.animation = `${animation} ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    addFadeInElement(element) {
        if (element && !element.classList.contains('fade-in')) {
            element.classList.add('fade-in');
            this.fadeElements.push(element);
            this.observer.observe(element);
        }
    }

    // Method to add custom scroll-triggered animations
    addScrollAnimation(element, options = {}) {
        const {
            threshold = 0.1,
            animation = 'fadeIn',
            duration = 1000,
            delay = 0
        } = options;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        this.animateElement(entry.target, animation, duration);
                    }, delay);
                }
            });
        }, { threshold });
        
        observer.observe(element);
        
        return observer;
    }

    destroy() {
        // Disconnect intersection observer
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Remove event listeners
        this.projectCards.forEach(card => {
            card.removeEventListener('mouseenter', this.handleProjectCardEnter);
            card.removeEventListener('mouseleave', this.handleProjectCardLeave);
        });
        
        // Reset state
        this.fadeElements = [];
        this.skillCards = [];
        this.projectCards = [];
        this.floatingElements = [];
        this.observer = null;
        this.isAnimating = false;
    }
}
