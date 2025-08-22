/**
 * Custom Cursor Manager
 * Handles the interactive custom cursor with smooth animations and hover effects
 */

export class CursorManager {
    constructor() {
        this.cursor = null;
        this.isActive = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.isTouchDevice = false;
        
        this.init();
    }

    init() {
        this.cursor = document.getElementById('cursor');
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (this.isTouchDevice) {
            this.disableCursor();
            return;
        }
        
        this.setupEventListeners();
        this.startAnimationLoop();
    }

    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            if (!this.isActive) {
                this.showCursor();
            }
        });

        // Mouse enter/leave document
        document.addEventListener('mouseenter', () => {
            this.showCursor();
        });

        document.addEventListener('mouseleave', () => {
            this.hideCursor();
        });

        // Hover effects for interactive elements
        this.setupHoverEffects();
    }

    setupHoverEffects() {
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card, .form-input, .form-textarea');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addHoverEffect();
            });
            
            element.addEventListener('mouseleave', () => {
                this.removeHoverEffect();
            });
        });
    }

    startAnimationLoop() {
        const animate = () => {
            if (this.isActive) {
                // Smooth cursor following with lerp
                this.cursorX = this.lerp(this.cursorX, this.mouseX, 0.15);
                this.cursorY = this.lerp(this.cursorY, this.mouseY, 0.15);
                
                this.updateCursorPosition();
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    updateCursorPosition() {
        if (this.cursor) {
            this.cursor.style.transform = `translate(${this.cursorX - 10}px, ${this.cursorY - 10}px)`;
        }
    }

    showCursor() {
        if (this.cursor) {
            this.cursor.classList.add('active');
            this.isActive = true;
        }
    }

    hideCursor() {
        if (this.cursor) {
            this.cursor.classList.remove('active');
            this.isActive = false;
        }
    }

    addHoverEffect() {
        if (this.cursor) {
            this.cursor.classList.add('hover');
        }
    }

    removeHoverEffect() {
        if (this.cursor) {
            this.cursor.classList.remove('hover');
        }
    }

    disableCursor() {
        if (this.cursor) {
            this.cursor.style.display = 'none';
        }
    }

    enableCursor() {
        if (this.cursor && !this.isTouchDevice) {
            this.cursor.style.display = 'block';
        }
    }

    // Utility function for smooth interpolation
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Public methods for external control
    setCursorStyle(style) {
        if (this.cursor) {
            Object.assign(this.cursor.style, style);
        }
    }

    addCustomHoverElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => this.addHoverEffect());
            element.addEventListener('mouseleave', () => this.removeHoverEffect());
        });
    }

    destroy() {
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseenter', this.handleMouseEnter);
        document.removeEventListener('mouseleave', this.handleMouseLeave);
        
        // Hide cursor
        this.hideCursor();
        
        // Reset state
        this.isActive = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
    }
}
