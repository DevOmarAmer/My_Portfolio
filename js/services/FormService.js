/**
 * Form Service
 * Handles form validation and submission
 */

class FormService {
    constructor() {
        this.validators = {
            text: this.validateText,
            email: this.validateEmail,
            select: this.validateSelect,
            textarea: this.validateTextarea,
            checkbox: this.validateCheckbox
        };
    }

    /**
     * Validate text input
     */
    validateText(input) {
        const value = input.value.trim();
        const minLength = input.dataset.minLength || 2;

        if (!input.required && !value) {
            return { valid: true };
        }

        if (value === '') {
            return { valid: false, message: 'This field is required' };
        }

        if (input.name === 'name' && value.length < minLength) {
            return { valid: false, message: `Name must be at least ${minLength} characters` };
        }

        return { valid: true };
    }

    /**
     * Validate email input
     */
    validateEmail(input) {
        const value = input.value.trim();

        if (!input.required && !value) {
            return { valid: true };
        }

        if (value === '') {
            return { valid: false, message: 'Email is required' };
        }

        if (!Utils.isValidEmail(value)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }

        return { valid: true };
    }

    /**
     * Validate select input
     */
    validateSelect(input) {
        const value = input.value;

        if (!input.required && !value) {
            return { valid: true };
        }

        if (value === '') {
            return { valid: false, message: 'Please select an option' };
        }

        return { valid: true };
    }

    /**
     * Validate textarea
     */
    validateTextarea(input) {
        const value = input.value.trim();
        const minLength = input.dataset.minLength || 10;

        if (!input.required && !value) {
            return { valid: true };
        }

        if (value === '') {
            return { valid: false, message: 'This field is required' };
        }

        if (value.length < minLength) {
            return { valid: false, message: `Message must be at least ${minLength} characters` };
        }

        return { valid: true };
    }

    /**
     * Validate checkbox
     */
    validateCheckbox(input) {
        if (!input.required) {
            return { valid: true };
        }

        if (!input.checked) {
            return { valid: false, message: 'You must agree to continue' };
        }

        return { valid: true };
    }

    /**
     * Validate single input
     */
    validateInput(input) {
        const type = input.type === 'select-one' ? 'select' : input.type;
        const validator = this.validators[type];

        if (!validator) {
            return { valid: true };
        }

        return validator.call(this, input);
    }

    /**
     * Show error message
     */
    showError(input, message) {
        const feedbackEl = input.parentElement.querySelector('.form-feedback');
        if (feedbackEl) {
            feedbackEl.textContent = message;
            feedbackEl.classList.add('error');
        }
        input.classList.add('invalid');
    }

    /**
     * Clear error message
     */
    clearError(input) {
        const feedbackEl = input.parentElement.querySelector('.form-feedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.classList.remove('error');
        }
        input.classList.remove('invalid');
    }

    /**
     * Validate entire form
     */
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            const result = this.validateInput(input);
            if (!result.valid) {
                this.showError(input, result.message);
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Setup form validation
     */
    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input:not([type="checkbox"]), textarea, select');

        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                const result = this.validateInput(input);
                if (!result.valid) {
                    this.showError(input, result.message);
                }
            });

            // Clear error on focus
            input.addEventListener('focus', () => {
                this.clearError(input);
            });
        });
    }

    /**
     * Send email using EmailJS
     */
    async sendEmail(formData) {
        const htmlContent = `
            <h2 style="color:#4CAF50;">New Inquiry</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Inquiry Type:</strong> ${formData.inquiry_type}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong><br>${formData.message}</p>
        `;

        const templateParams = {
            name: formData.name,
            email: formData.email,
            inquiry_type: formData.inquiry_type,
            subject: formData.subject,
            message: formData.message,
            message_html: htmlContent
        };

        try {
            const response = await emailjs.send(
                Config.emailJS.serviceId,
                Config.emailJS.templateId,
                templateParams
            );
            return { success: true, response };
        } catch (error) {
            return { success: false, error };
        }
    }
}

// Create singleton instance
const formService = new FormService();
