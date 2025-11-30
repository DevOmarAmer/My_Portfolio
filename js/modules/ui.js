/**
 * UI Module
 * Handles UI interactions and rendering
 */

const UI = {
    /**
     * Show toast notification
     */
    showToast(message, type = 'success', duration = Config.ui.toastDuration) {
        // Check if toast element exists
        let toast = DOM.id('toast');
        
        if (!toast) {
            // Create toast element if it doesn't exist
            toast = DOM.create('div', {
                id: 'toast',
                className: 'toast'
            }, `<span id="toastMessage"></span>`);
            document.body.appendChild(toast);
        }

        const toastMessage = DOM.id('toastMessage');
        DOM.setText(toastMessage, message);
        toast.className = `toast ${type}`;

        // Show toast
        setTimeout(() => {
            DOM.addClass(toast, 'show');
        }, 100);

        // Hide toast after duration
        setTimeout(() => {
            DOM.removeClass(toast, 'show');
        }, duration);
    },

    /**
     * Show loading state
     */
    showLoading(container, message = 'Loading...') {
        const loadingHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        DOM.setHTML(container, loadingHTML);
    },

    /**
     * Show error state
     */
    showError(container, message = 'An error occurred') {
        const errorHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
        DOM.setHTML(container, errorHTML);
    },

    /**
     * Show empty state
     */
    showEmpty(container, message = 'No items found', icon = 'folder-open') {
        const emptyHTML = `
            <div class="empty-state">
                <i class="fas fa-${icon}"></i>
                <p>${message}</p>
            </div>
        `;
        DOM.setHTML(container, emptyHTML);
    },

    /**
     * Render projects grid
     */
    renderProjects(projects, container) {
        if (!container) {
            console.error('Container not found for rendering projects');
            return;
        }

        if (!projects || projects.length === 0) {
            this.showEmpty(container, 'No projects found.');
            return;
        }

        const projectsHTML = projects.map(project => this.createProjectCard(project)).join('');
        DOM.setHTML(container, projectsHTML);

        // Initialize animations for new elements
        this.initializeAnimations(container);
    },

    /**
     * Create project card HTML
     */
    createProjectCard(project) {
        return `
            <div class="project-card animate-on-scroll" data-animation="fadeInUp" data-category="${project.categories.join(' ')}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                    <div class="project-overlay">
                        <div class="project-links">
                            ${project.detailsPage ? `<a href="project-details.html?id=${project.id}" class="project-link"><i class="fas fa-link"></i></a>` : ''}
                            ${project.githubLink ? `<a href="${project.githubLink}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-info">
                    <span class="project-category">${Utils.getCategoryLabel(project.category)}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                    <a href="project-details.html?id=${project.id}" class="btn btn-sm">View Details</a>
                </div>
            </div>
        `;
    },

    /**
     * Initialize animations for elements
     */
    initializeAnimations(container) {
        const animateElements = container.querySelectorAll('.animate-on-scroll');
        const triggerBottom = window.innerHeight * Config.animations.scrollTrigger;

        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                const animationType = element.dataset.animation || 'fadeIn';
                DOM.addClass(element, 'animated');
                DOM.addClass(element, animationType);

                if (element.dataset.delay) {
                    element.style.animationDelay = element.dataset.delay + 's';
                }

                if (element.dataset.duration) {
                    element.style.animationDuration = element.dataset.duration + 's';
                }
            }
        });
    },

    /**
     * Handle project filtering
     */
    setupProjectFilters() {
        const filterBtns = DOM.$$('.filter-btn');
        const projectsGrid = DOM.$('.projects-grid');

        if (!filterBtns.length || !projectsGrid) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', async function() {
                // Update active button
                filterBtns.forEach(b => DOM.removeClass(b, 'active'));
                DOM.addClass(this, 'active');

                // Get filter value
                const filterValue = this.getAttribute('data-filter');

                // Get filtered projects
                const projects = filterValue === 'all' 
                    ? projectService.getAllProjects()
                    : projectService.getProjectsByCategory(filterValue);

                // Re-render projects
                UI.renderProjects(projects, projectsGrid);
            });
        });
    },

    /**
     * Setup mobile navigation
     */
    setupMobileNav() {
        const mobileNavToggle = DOM.$('.mobile-nav-toggle');
        const mobileNav = DOM.$('.mobile-nav');
        const mobileNavOverlay = DOM.$('.mobile-nav-overlay');
        const mobileNavLinks = DOM.$$('.mobile-nav a');

        if (!mobileNavToggle || !mobileNav || !mobileNavOverlay) return;

        // Toggle menu
        mobileNavToggle.addEventListener('click', function() {
            DOM.toggleClass(mobileNav, 'active');
            DOM.toggleClass(mobileNavOverlay, 'active');

            const icon = this.querySelector('i');
            if (DOM.hasClass(mobileNav, 'active')) {
                DOM.removeClass(icon, 'fa-bars');
                DOM.addClass(icon, 'fa-times');
            } else {
                DOM.removeClass(icon, 'fa-times');
                DOM.addClass(icon, 'fa-bars');
            }
        });

        // Close menu on overlay click
        mobileNavOverlay.addEventListener('click', function() {
            DOM.removeClass(mobileNav, 'active');
            DOM.removeClass(mobileNavOverlay, 'active');
            const icon = mobileNavToggle.querySelector('i');
            DOM.removeClass(icon, 'fa-times');
            DOM.addClass(icon, 'fa-bars');
        });

        // Close menu on link click
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                DOM.removeClass(mobileNav, 'active');
                DOM.removeClass(mobileNavOverlay, 'active');
                const icon = mobileNavToggle.querySelector('i');
                DOM.removeClass(icon, 'fa-times');
                DOM.addClass(icon, 'fa-bars');
            });
        });
    },

    /**
     * Setup smooth scrolling
     */
    setupSmoothScroll() {
        const navLinks = DOM.$$('header nav a, .mobile-nav a');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();

                    const targetId = this.getAttribute('href');
                    const targetSection = DOM.$(targetId);

                    if (targetSection) {
                        Utils.scrollToElement(targetSection);
                    }
                }
            });
        });
    },

    /**
     * Setup header scroll effect
     */
    setupHeaderScroll() {
        const header = DOM.$('header');
        if (!header) return;

        window.addEventListener('scroll', Utils.throttle(function() {
            if (window.scrollY > Config.ui.headerScrollThreshold) {
                DOM.addClass(header, 'scrolled');
            } else {
                DOM.removeClass(header, 'scrolled');
            }
        }, 100));
    },

    /**
     * Handle preloader
     */
    handlePreloader() {
        const preloader = DOM.$('.preloader');
        if (!preloader) return;

        // Hide preloader immediately if window already loaded
        if (document.readyState === 'complete') {
            DOM.addClass(preloader, 'loaded');
            setTimeout(function() {
                DOM.hide(preloader);
            }, Config.ui.preloaderDuration);
        } else {
            // Otherwise wait for window load
            window.addEventListener('load', function() {
                DOM.addClass(preloader, 'loaded');
                setTimeout(function() {
                    DOM.hide(preloader);
                }, Config.ui.preloaderDuration);
            });
        }
    }
};
