/**
 * Form Manager
 * Handles contact form submission, validation, and user feedback
 */

export class FormManager {
    constructor() {
        this.contactForm = null;
        this.submitButton = null;
        this.formInputs = [];
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        this.contactForm = document.getElementById('contactForm');
        this.submitButton = document.getElementById('submitBtn');
        this.formInputs = document.querySelectorAll('.form-input, .form-textarea');
        
        if (this.contactForm) {
            this.setupFormHandling();
            this.setupInputAnimations();
        }
    }

    setupFormHandling() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    setupInputAnimations() {
        this.formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.animateInput(input, 'focus');
            });
            
            input.addEventListener('blur', () => {
                this.animateInput(input, 'blur');
                this.validateInput(input);
            });
            
            input.addEventListener('input', () => {
                this.clearInputError(input);
            });
        });
    }

    animateInput(input, action) {
        if (action === 'focus') {
            input.style.transform = 'scale(1.02)';
            input.style.borderColor = 'var(--color-accent-blue)';
        } else {
            input.style.transform = 'scale(1)';
            if (!input.value) {
                input.style.borderColor = 'transparent';
            }
        }
    }

    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const isRequired = input.hasAttribute('required');
        
        // Clear previous errors
        this.clearInputError(input);
        
        // Check required fields
        if (isRequired && !value) {
            this.showInputError(input, 'This field is required');
            return false;
        }
        
        // Validate email
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showInputError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        return true;
    }

    showInputError(input, message) {
        // Remove existing error
        this.clearInputError(input);
        
        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'input-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff6b6b;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: slideIn 0.3s ease;
        `;
        
        // Insert error after input
        input.parentNode.appendChild(errorElement);
        
        // Add error class to input
        input.classList.add('error');
        input.style.borderColor = '#ff6b6b';
    }

    clearInputError(input) {
        // Remove error class
        input.classList.remove('error');
        input.style.borderColor = '';
        
        // Remove error message
        const errorElement = input.parentNode.querySelector('.input-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    validateForm() {
        let isValid = true;
        
        this.formInputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    async handleFormSubmission() {
        if (this.isSubmitting) return;
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        this.isSubmitting = true;
        this.updateSubmitButton('Sending...', true);
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.submitForm();
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Failed to send message. Please try again.');
        } finally {
            this.isSubmitting = false;
            this.updateSubmitButton('Send Message', false);
        }
    }

    async submitForm() {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
        
        // Actual implementation would look like:
        /*
        const formData = new FormData(this.contactForm);
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return response.json();
        */
    }

    updateSubmitButton(text, disabled) {
        if (this.submitButton) {
            const buttonText = this.submitButton.querySelector('.button-text');
            if (buttonText) {
                buttonText.textContent = text;
            }
            
            this.submitButton.disabled = disabled;
            
            if (disabled) {
                this.submitButton.style.background = 'linear-gradient(90deg, #666, #999)';
            } else {
                this.submitButton.style.background = 'linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-green))';
            }
        }
    }

    showSuccessMessage() {
        this.updateSubmitButton('Message Sent!', true);
        this.submitButton.style.background = 'linear-gradient(90deg, #00FF88, #00D4FF)';
        
        // Reset button after delay
        setTimeout(() => {
            this.updateSubmitButton('Send Message', false);
        }, 2000);
    }

    showErrorMessage(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'form-notification error';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    resetForm() {
        this.contactForm.reset();
        
        // Clear any error states
        this.formInputs.forEach(input => {
            this.clearInputError(input);
            input.style.transform = 'scale(1)';
            input.style.borderColor = 'transparent';
        });
    }

    // Public methods for external control
    setFormEndpoint(url) {
        if (this.contactForm) {
            this.contactForm.action = url;
        }
    }

    addCustomValidation(fieldSelector, validator) {
        const field = document.querySelector(fieldSelector);
        if (field) {
            field.addEventListener('blur', () => {
                if (!validator(field.value)) {
                    this.showInputError(field, 'Invalid input');
                }
            });
        }
    }

    // Method to handle file uploads
    setupFileUpload(inputSelector, options = {}) {
        const fileInput = document.querySelector(inputSelector);
        if (!fileInput) return;
        
        const {
            maxSize = 5 * 1024 * 1024, // 5MB
            allowedTypes = ['image/*'],
            onSelect = null
        } = options;
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file size
                if (file.size > maxSize) {
                    this.showInputError(fileInput, `File size must be less than ${maxSize / 1024 / 1024}MB`);
                    return;
                }
                
                // Validate file type
                const isValidType = allowedTypes.some(type => {
                    if (type.endsWith('/*')) {
                        return file.type.startsWith(type.replace('/*', ''));
                    }
                    return file.type === type;
                });
                
                if (!isValidType) {
                    this.showInputError(fileInput, 'File type not allowed');
                    return;
                }
                
                // Call onSelect callback
                if (onSelect) {
                    onSelect(file);
                }
            }
        });
    }

    destroy() {
        if (this.contactForm) {
            this.contactForm.removeEventListener('submit', this.handleFormSubmission);
        }
        
        this.formInputs.forEach(input => {
            input.removeEventListener('focus', this.handleInputFocus);
            input.removeEventListener('blur', this.handleInputBlur);
            input.removeEventListener('input', this.handleInputChange);
        });
        
        // Reset state
        this.contactForm = null;
        this.submitButton = null;
        this.formInputs = [];
        this.isSubmitting = false;
    }
}
