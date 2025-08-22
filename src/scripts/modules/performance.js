/**
 * Performance Manager
 * Handles scroll progress, performance optimization, and monitoring
 */

export class PerformanceManager {
    constructor() {
        this.progressBar = null;
        this.isAnimationsPaused = false;
        this.performanceMetrics = {};
        this.observers = [];
        
        this.init();
    }

    init() {
        this.progressBar = document.getElementById('progress');
        this.setupPerformanceMonitoring();
        this.setupIntersectionObserver();
    }

    setupPerformanceMonitoring() {
        // Monitor performance metrics
        if ('performance' in window) {
            this.observePerformanceMetrics();
        }
        
        // Monitor memory usage
        if ('memory' in performance) {
            this.observeMemoryUsage();
        }
    }

    setupIntersectionObserver() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Optimize animations based on visibility
        this.setupAnimationOptimization();
    }

    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observe all images with data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
        
        this.observers.push(imageObserver);
    }

    setupAnimationOptimization() {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                if (entry.isIntersecting) {
                    element.style.willChange = 'transform, opacity';
                } else {
                    element.style.willChange = 'auto';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });

        // Observe elements that have animations
        const animatedElements = document.querySelectorAll('.fade-in, .floating-element');
        animatedElements.forEach(element => animationObserver.observe(element));
        
        this.observers.push(animationObserver);
    }

    updateProgressBar() {
        if (!this.progressBar) return;
        
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        this.progressBar.style.width = `${scrollPercent}%`;
    }

    pauseAnimations() {
        if (this.isAnimationsPaused) return;
        
        this.isAnimationsPaused = true;
        document.body.style.setProperty('--animation-play-state', 'paused');
        
        // Pause CSS animations
        const animatedElements = document.querySelectorAll('*');
        animatedElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.animationName !== 'none') {
                element.style.animationPlayState = 'paused';
            }
        });
    }

    resumeAnimations() {
        if (!this.isAnimationsPaused) return;
        
        this.isAnimationsPaused = false;
        document.body.style.setProperty('--animation-play-state', 'running');
        
        // Resume CSS animations
        const animatedElements = document.querySelectorAll('*');
        animatedElements.forEach(element => {
            if (element.style.animationPlayState === 'paused') {
                element.style.animationPlayState = 'running';
            }
        });
    }

    observePerformanceMetrics() {
        // Observe navigation timing
        if ('navigation' in performance) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.performanceMetrics.navigation = {
                    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    firstPaint: navigation.responseEnd - navigation.requestStart
                };
            }
        }

        // Observe paint timing
        if ('paint' in performance) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                this.performanceMetrics[entry.name] = entry.startTime;
            });
        }

        // Observe resource timing
        if ('resource' in performance) {
            const resourceEntries = performance.getEntriesByType('resource');
            this.performanceMetrics.resources = resourceEntries.map(entry => ({
                name: entry.name,
                duration: entry.duration,
                size: entry.transferSize
            }));
        }
    }

    observeMemoryUsage() {
        const memory = performance.memory;
        this.performanceMetrics.memory = {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
        };
    }

    getPerformanceReport() {
        return {
            ...this.performanceMetrics,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            scrollPosition: {
                x: window.scrollX,
                y: window.scrollY
            }
        };
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for images below the fold
            if (!this.isElementInViewport(img)) {
                img.loading = 'lazy';
            }
            
            // Add decoding="async" for better performance
            img.decoding = 'async';
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Debounce function for performance optimization
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

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Method to optimize DOM queries
    optimizeDOMQueries() {
        // Cache frequently accessed elements
        this.cachedElements = {
            nav: document.querySelector('.nav'),
            hero: document.querySelector('.hero'),
            sections: document.querySelectorAll('section'),
            buttons: document.querySelectorAll('button, .cta-button')
        };
    }

    // Method to monitor frame rate
    startFrameRateMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const countFrames = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.performanceMetrics.fps = fps;
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
    }

    // Method to optimize scroll performance
    optimizeScrollPerformance() {
        // Use passive event listeners for better scroll performance
        const scrollOptions = { passive: true };
        
        window.addEventListener('scroll', this.throttle(() => {
            this.updateProgressBar();
        }, 16), scrollOptions);
        
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250), scrollOptions);
    }

    handleResize() {
        // Recalculate performance optimizations on resize
        this.optimizeImages();
        this.optimizeDOMQueries();
    }

    // Method to preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            '/src/styles/main.css',
            '/src/scripts/main.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    cleanup() {
        // Disconnect all observers
        this.observers.forEach(observer => {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        });
        
        // Reset state
        this.observers = [];
        this.isAnimationsPaused = false;
        this.performanceMetrics = {};
    }

    destroy() {
        this.cleanup();
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        // Reset progress bar
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
        }
    }
}
