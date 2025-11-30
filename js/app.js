/**
 * Main Application Module
 * Orchestrates all other modules and initializes the app
 */

class App {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) {
            console.warn('App already initialized');
            return;
        }

        console.log('Initializing Portfolio App...');

        try {
            // Initialize EmailJS
            this.initEmailJS();

            // Load projects
            await this.loadProjects();

            // Setup UI components
            this.setupUI();

            // Setup animations
            this.setupAnimations();

            // Setup form handling
            this.setupForms();

            // Handle preloader
            UI.handlePreloader();

            this.initialized = true;
            console.log('Portfolio App initialized successfully');

        } catch (error) {
            console.error('Error initializing app:', error);
            UI.showToast('An error occurred while loading the application', 'error');
        }
    }

    /**
     * Initialize EmailJS
     */
    initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(Config.emailJS.publicKey);
            console.log('EmailJS initialized');
        } else {
            console.warn('EmailJS not loaded');
        }
    }

    /**
     * Load projects
     */
    async loadProjects() {
        const projectsGrid = DOM.$('.projects-grid');
        if (!projectsGrid) {
            console.warn('Projects grid not found, skipping project load');
            return;
        }

        try {
            UI.showLoading(projectsGrid, 'Loading projects...');

            const projects = await projectService.loadProjects();
            
            if (projects && projects.length > 0) {
                UI.renderProjects(projects, projectsGrid);
            } else {
                UI.showEmpty(projectsGrid, 'No projects available');
            }

        } catch (error) {
            console.error('Error loading projects:', error);
            UI.showError(projectsGrid, 'Failed to load projects');
        }
    }

    /**
     * Setup UI components
     */
    setupUI() {
        // Setup project filters
        UI.setupProjectFilters();

        // Setup mobile navigation
        UI.setupMobileNav();

        // Setup smooth scrolling
        UI.setupSmoothScroll();

        // Setup header scroll effect
        UI.setupHeaderScroll();

        console.log('UI components initialized');
    }

    /**
     * Setup animations
     */
    setupAnimations() {
        // Initialize typing animation
        Animations.initTypingAnimation();

        // Initialize scroll animations
        Animations.initScrollAnimations();

        console.log('Animations initialized');
    }

    /**
     * Setup form handling
     */
    setupForms() {
        const contactForm = DOM.id('contactForm');
        if (!contactForm) {
            console.warn('Contact form not found');
            return;
        }

        // Setup form validation
        formService.setupFormValidation(contactForm);

        // Handle form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formStatus = DOM.$('.form-status', contactForm);
            const submitBtn = DOM.$('button[type="submit"]', contactForm);

            // Reset status
            if (formStatus) {
                DOM.setText(formStatus, '');
                formStatus.className = 'form-status';
                DOM.hide(formStatus);
            }

            // Validate form
            if (!formService.validateForm(contactForm)) {
                return;
            }

            // Show loading
            DOM.addClass(submitBtn, 'loading');
            if (formStatus) {
                DOM.setText(formStatus, 'Sending message...');
                DOM.show(formStatus);
            }

            // Get form data
            const formData = DOM.getFormData(contactForm);

            // Send email
            const result = await formService.sendEmail(formData);

            // Handle result
            if (result.success) {
                if (formStatus) {
                    DOM.setText(formStatus, 'Your message has been sent successfully! I will get back to you soon.');
                    formStatus.className = 'form-status success';
                }
                contactForm.reset();
                UI.showToast('Message sent successfully!', 'success');
            } else {
                if (formStatus) {
                    DOM.setText(formStatus, 'Failed to send message. Please try again later.');
                    formStatus.className = 'form-status error';
                }
                UI.showToast('Failed to send message', 'error');
            }

            DOM.removeClass(submitBtn, 'loading');
        });

        console.log('Form handling initialized');
    }

    /**
     * Refresh projects
     */
    async refreshProjects() {
        const projectsGrid = DOM.$('.projects-grid');
        if (!projectsGrid) return;

        projectService.clearCache();
        await this.loadProjects();
        UI.showToast('Projects refreshed', 'success');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();

    // Make app instance globally available for debugging
    window.portfolioApp = app;
});
