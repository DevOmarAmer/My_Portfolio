/**
 * DOM Manipulation Module
 * Handles DOM queries and manipulations
 */

const DOM = {
    /**
     * Query selector helper
     */
    $(selector, parent = document) {
        return parent.querySelector(selector);
    },

    /**
     * Query all selector helper
     */
    $$(selector, parent = document) {
        return parent.querySelectorAll(selector);
    },

    /**
     * Get element by ID
     */
    id(id) {
        return document.getElementById(id);
    },

    /**
     * Create element
     */
    create(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });

        if (content) {
            element.innerHTML = content;
        }

        return element;
    },

    /**
     * Add event listener with delegation
     */
    on(selector, event, handler, parent = document) {
        parent.addEventListener(event, (e) => {
            const target = e.target.closest(selector);
            if (target) {
                handler.call(target, e);
            }
        });
    },

    /**
     * Add class to element
     */
    addClass(element, className) {
        if (element) {
            element.classList.add(className);
        }
    },

    /**
     * Remove class from element
     */
    removeClass(element, className) {
        if (element) {
            element.classList.remove(className);
        }
    },

    /**
     * Toggle class on element
     */
    toggleClass(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    },

    /**
     * Check if element has class
     */
    hasClass(element, className) {
        return element ? element.classList.contains(className) : false;
    },

    /**
     * Show element
     */
    show(element) {
        if (element) {
            element.style.display = 'block';
        }
    },

    /**
     * Hide element
     */
    hide(element) {
        if (element) {
            element.style.display = 'none';
        }
    },

    /**
     * Toggle element visibility
     */
    toggle(element) {
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    },

    /**
     * Set HTML content
     */
    setHTML(element, html) {
        if (element) {
            element.innerHTML = html;
        }
    },

    /**
     * Set text content
     */
    setText(element, text) {
        if (element) {
            element.textContent = text;
        }
    },

    /**
     * Get form data as object
     */
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    },

    /**
     * Append child element
     */
    append(parent, child) {
        if (parent && child) {
            parent.appendChild(child);
        }
    },

    /**
     * Remove element from DOM
     */
    remove(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },

    /**
     * Clear element's children
     */
    empty(element) {
        if (element) {
            element.innerHTML = '';
        }
    }
};
