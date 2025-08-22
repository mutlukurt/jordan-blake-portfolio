/**
 * Jordan Blake Portfolio - Main JavaScript Entry Point
 * Handles initialization and coordination of all modules
 */

import { CursorManager } from './modules/cursor.js';
import { NavigationManager } from './modules/navigation.js';
import { AnimationManager } from './modules/animations.js';
import { FormManager } from './modules/forms.js';
import { PerformanceManager } from './modules/performance.js';
import { ThemeManager } from './modules/theme.js';

class PortfolioApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        } catch (error) {
            console.error('Failed to initialize portfolio app:', error);
        }
    }

    setup() {
        // Initialize loading screen
        this.initLoadingScreen();
        
        // Initialize all modules
        this.initializeModules();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Mark as initialized
        this.isInitialized = true;
        
        // Console welcome message
        this.showWelcomeMessage();
    }

    initLoadingScreen() {
        const loading = document.getElementById('loading');
        if (loading) {
            // Simulate loading time for better UX
            setTimeout(() => {
                loading.classList.add('hide');
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }, 1500);
        }
    }

    initializeModules() {
        // Initialize cursor manager
        this.modules.cursor = new CursorManager();
        
        // Initialize navigation manager
        this.modules.navigation = new NavigationManager();
        
        // Initialize animation manager
        this.modules.animations = new AnimationManager();
        
        // Initialize form manager
        this.modules.forms = new FormManager();
        
        // Initialize performance manager
        this.modules.performance = new PerformanceManager();
        
        // Initialize theme manager
        this.modules.theme = new ThemeManager();
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.modules.animations.handleResize();
        }, 250));

        // Handle scroll events
        window.addEventListener('scroll', this.debounce(() => {
            this.modules.performance.updateProgressBar();
            this.modules.animations.handleScroll();
            this.modules.navigation.updateActiveSection();
        }, 16));

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.modules.performance.pauseAnimations();
            } else {
                this.modules.performance.resumeAnimations();
            }
        });

        // Handle beforeunload
        window.addEventListener('beforeunload', () => {
            this.modules.performance.cleanup();
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showWelcomeMessage() {
        console.log('%c🎨 Welcome to Jordan Blake\'s Portfolio!', 'color: #00D4FF; font-size: 16px; font-weight: bold;');
        console.log('%cBuilt with pure HTML5, CSS3 & Vanilla JavaScript', 'color: #00FF88;');
        console.log('%cNo frameworks • Cutting-edge animations • Mobile-first design', 'color: #999;');
        console.log('%cEaster eggs: Konami code ↑↑↓↓←→←→BA or Ctrl+D', 'color: #666;');
    }

    // Public API methods
    getModule(name) {
        return this.modules[name];
    }

    destroy() {
        // Clean up all modules
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        this.isInitialized = false;
        this.modules = {};
    }
}

// Initialize the app when the script loads
const app = new PortfolioApp();

// Export for potential external use
export default app;

// Make available globally for debugging
if (typeof window !== 'undefined') {
    window.PortfolioApp = app;
}
