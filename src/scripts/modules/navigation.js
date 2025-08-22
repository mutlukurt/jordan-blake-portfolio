/**
 * Navigation Manager
 * Handles smooth scrolling navigation and active section tracking
 */

export class NavigationManager {
    constructor() {
        this.navLinks = [];
        this.sections = [];
        this.currentSection = 'home';
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = ['home', 'about', 'skills', 'projects', 'contact'];
        
        this.setupNavigation();
        this.updateActiveSection();
    }

    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            this.isScrolling = true;
            
            // Update active navigation
            this.setActiveNavLink(sectionId);
            
            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update current section
            this.currentSection = sectionId;
            
            // Reset scrolling flag after animation
            setTimeout(() => {
                this.isScrolling = false;
            }, 1000);
        }
    }

    updateActiveSection() {
        if (this.isScrolling) return;
        
        const scrollPos = window.scrollY + 100;
        
        this.sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                
                if (scrollPos >= top && scrollPos < top + height) {
                    if (this.currentSection !== sectionId) {
                        this.currentSection = sectionId;
                        this.setActiveNavLink(sectionId);
                    }
                }
            }
        });
    }

    setActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });
    }

    // Public methods
    getCurrentSection() {
        return this.currentSection;
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        this.setActiveNavLink('home');
        this.currentSection = 'home';
    }

    // Utility method to check if element is in viewport
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Method to add custom navigation behavior
    addCustomNavigation(selector, targetSection) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection(targetSection);
            });
        });
    }

    destroy() {
        // Remove event listeners
        this.navLinks.forEach(link => {
            link.removeEventListener('click', this.handleNavClick);
        });
        
        // Reset state
        this.navLinks = [];
        this.sections = [];
        this.currentSection = 'home';
        this.isScrolling = false;
    }
}
