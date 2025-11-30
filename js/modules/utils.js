/**
 * Utility Functions Module
 * Reusable helper functions
 */

const Utils = {
    /**
     * Validate email address
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Generate slug/id from text
     */
    generateId(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    },

    /**
     * Truncate text to specified length
     */
    truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    },

    /**
     * Format date
     */
    formatDate(date, format = 'long') {
        const d = new Date(date);
        const options = format === 'long' 
            ? { year: 'numeric', month: 'long', day: 'numeric' }
            : { year: 'numeric', month: 'short', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    },

    /**
     * Debounce function
     */
    debounce(func, delay = 300) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Throttle function
     */
    throttle(func, limit = 100) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Get URL parameters
     */
    getUrlParams() {
        return new URLSearchParams(window.location.search);
    },

    /**
     * Get specific URL parameter
     */
    getUrlParam(name) {
        return this.getUrlParams().get(name);
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight * (1 - threshold);
    },

    /**
     * Scroll to element smoothly
     */
    scrollToElement(element, offset = 70) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Parse array from string (comma-separated or newline-separated)
     */
    parseArray(str, separator = ',') {
        if (!str) return [];
        return str.split(separator)
            .map(item => item.trim())
            .filter(item => item);
    },

    /**
     * Create element from HTML string
     */
    createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    },

    /**
     * Format number with commas
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Get category label
     */
    getCategoryLabel(category) {
        return Config.categories[category] || 'Flutter App';
    },

    /**
     * Safe JSON parse
     */
    safeJsonParse(str, fallback = null) {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.error('JSON parse error:', e);
            return fallback;
        }
    }
};
