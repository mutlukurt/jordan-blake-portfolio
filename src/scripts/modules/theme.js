/**
 * Theme Manager
 * Handles theme switching, easter eggs, and visual effects
 */

export class ThemeManager {
    constructor() {
        this.isDarkTheme = true;
        this.konamiCode = [];
        this.konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        this.easterEggs = new Map();
        
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupEasterEggs();
        this.loadThemePreference();
    }

    setupThemeToggle() {
        // Keyboard shortcut: Ctrl+D
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // Add theme toggle button to navigation (optional)
        this.addThemeToggleButton();
    }

    setupEasterEggs() {
        // Konami Code
        document.addEventListener('keydown', (e) => {
            this.konamiCode.push(e.keyCode);
            if (this.konamiCode.length > this.konamiSequence.length) {
                this.konamiCode.shift();
            }
            
            if (this.konamiCode.toString() === this.konamiSequence.toString()) {
                this.triggerKonamiEasterEgg();
            }
        });

        // Add more easter eggs
        this.addRainbowMode();
        this.addMatrixMode();
        this.addGlitchMode();
    }

    addThemeToggleButton() {
        const nav = document.querySelector('.nav');
        if (nav) {
            const themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '🌙';
            themeToggle.title = 'Toggle theme (Ctrl+D)';
            themeToggle.style.cssText = `
                background: none;
                border: none;
                color: var(--color-white);
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
                margin-left: 0.5rem;
            `;
            
            themeToggle.addEventListener('click', () => this.toggleTheme());
            nav.appendChild(themeToggle);
        }
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        this.applyTheme();
        this.saveThemePreference();
    }

    applyTheme() {
        const root = document.documentElement;
        
        if (this.isDarkTheme) {
            // Dark theme
            root.style.setProperty('--color-primary', '#0A0A0A');
            root.style.setProperty('--color-secondary', '#1A1A1A');
            root.style.setProperty('--color-tertiary', '#2A2A2A');
            root.style.setProperty('--color-white', '#FFFFFF');
            root.style.setProperty('--color-gray', '#666666');
            root.style.setProperty('--color-light-gray', '#999999');
        } else {
            // Light theme
            root.style.setProperty('--color-primary', '#FFFFFF');
            root.style.setProperty('--color-secondary', '#F5F5F5');
            root.style.setProperty('--color-tertiary', '#E0E0E0');
            root.style.setProperty('--color-white', '#0A0A0A');
            root.style.setProperty('--color-gray', '#666666');
            root.style.setProperty('--color-light-gray', '#333333');
        }
        
        // Update theme toggle button icon
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = this.isDarkTheme ? '🌙' : '☀️';
        }
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) {
            this.isDarkTheme = savedTheme === 'dark';
            this.applyTheme();
        }
    }

    saveThemePreference() {
        localStorage.setItem('portfolio-theme', this.isDarkTheme ? 'dark' : 'light');
    }

    triggerKonamiEasterEgg() {
        console.log('%c🎮 Konami Code activated!', 'color: #00FF88; font-size: 20px; font-weight: bold;');
        
        // Rainbow mode
        this.activateRainbowMode();
        
        // Reset after 10 seconds
        setTimeout(() => {
            this.deactivateRainbowMode();
        }, 10000);
    }

    addRainbowMode() {
        this.easterEggs.set('rainbow', {
            activate: () => this.activateRainbowMode(),
            deactivate: () => this.deactivateRainbowMode()
        });
    }

    activateRainbowMode() {
        document.body.style.animation = 'rainbow 2s infinite';
        
        // Add rainbow animation CSS if not exists
        if (!document.querySelector('#rainbow-animation')) {
            const style = document.createElement('style');
            style.id = 'rainbow-animation';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    deactivateRainbowMode() {
        document.body.style.animation = '';
    }

    addMatrixMode() {
        this.easterEggs.set('matrix', {
            activate: () => this.activateMatrixMode(),
            deactivate: () => this.deactivateMatrixMode()
        });
    }

    activateMatrixMode() {
        // Create matrix rain effect
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
            opacity: 0.3;
        `;
        
        document.body.appendChild(canvas);
        
        // Matrix rain animation
        this.startMatrixRain(canvas);
    }

    deactivateMatrixMode() {
        const canvas = document.getElementById('matrix-canvas');
        if (canvas) {
            canvas.remove();
        }
    }

    startMatrixRain(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        const interval = setInterval(draw, 35);
        
        // Store interval for cleanup
        canvas.dataset.interval = interval;
    }

    addGlitchMode() {
        this.easterEggs.set('glitch', {
            activate: () => this.activateGlitchMode(),
            deactivate: () => this.deactivateGlitchMode()
        });
    }

    activateGlitchMode() {
        // Add glitch effect to text elements
        const textElements = document.querySelectorAll('h1, h2, h3, p, .hero-title, .hero-subtitle');
        
        textElements.forEach(element => {
            element.style.animation = 'glitch 0.3s infinite';
        });
        
        // Add glitch animation CSS
        if (!document.querySelector('#glitch-animation')) {
            const style = document.createElement('style');
            style.id = 'glitch-animation';
            style.textContent = `
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    deactivateGlitchMode() {
        const textElements = document.querySelectorAll('h1, h2, h3, p, .hero-title, .hero-subtitle');
        textElements.forEach(element => {
            element.style.animation = '';
        });
    }

    // Public methods for external control
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.isDarkTheme = theme === 'dark';
            this.applyTheme();
            this.saveThemePreference();
        }
    }

    getCurrentTheme() {
        return this.isDarkTheme ? 'dark' : 'light';
    }

    activateEasterEgg(name) {
        const easterEgg = this.easterEggs.get(name);
        if (easterEgg && easterEgg.activate) {
            easterEgg.activate();
        }
    }

    deactivateEasterEgg(name) {
        const easterEgg = this.easterEggs.get(name);
        if (easterEgg && easterEgg.deactivate) {
            easterEgg.deactivate();
        }
    }

    // Method to add custom easter eggs
    addCustomEasterEgg(name, activateFn, deactivateFn) {
        this.easterEggs.set(name, {
            activate: activateFn,
            deactivate: deactivateFn
        });
    }

    // Method to trigger random easter egg
    triggerRandomEasterEgg() {
        const eggNames = Array.from(this.easterEggs.keys());
        const randomEgg = eggNames[Math.floor(Math.random() * eggNames.length)];
        
        if (randomEgg) {
            this.activateEasterEgg(randomEgg);
            
            // Deactivate after random time
            setTimeout(() => {
                this.deactivateEasterEgg(randomEgg);
            }, Math.random() * 5000 + 2000);
        }
    }

    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        
        // Deactivate all active easter eggs
        this.easterEggs.forEach((egg, name) => {
            if (egg.deactivate) {
                egg.deactivate();
            }
        });
        
        // Remove custom styles
        const customStyles = document.querySelectorAll('#rainbow-animation, #glitch-animation');
        customStyles.forEach(style => style.remove());
        
        // Reset theme
        this.isDarkTheme = true;
        this.applyTheme();
        
        // Clear easter eggs
        this.easterEggs.clear();
        this.konamiCode = [];
    }
}
