/**
 * Animations Module
 * Handles all animation-related functionality
 */

const Animations = {
    /**
     * Initialize typing animation
     */
    initTypingAnimation() {
        const typedTextSpan = DOM.$('.typed-text');
        const cursorSpan = DOM.$('.cursor');

        if (!typedTextSpan || !cursorSpan) return;

        let textArrayIndex = 0;
        let charIndex = 0;

        const type = () => {
            if (charIndex < Config.typing.texts[textArrayIndex].length) {
                if (!DOM.hasClass(cursorSpan, 'typing')) {
                    DOM.addClass(cursorSpan, 'typing');
                }
                typedTextSpan.textContent += Config.typing.texts[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, Config.typing.typingDelay);
            } else {
                DOM.removeClass(cursorSpan, 'typing');
                setTimeout(erase, Config.typing.newTextDelay);
            }
        };

        const erase = () => {
            if (charIndex > 0) {
                if (!DOM.hasClass(cursorSpan, 'typing')) {
                    DOM.addClass(cursorSpan, 'typing');
                }
                typedTextSpan.textContent = Config.typing.texts[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, Config.typing.erasingDelay);
            } else {
                DOM.removeClass(cursorSpan, 'typing');
                textArrayIndex++;
                if (textArrayIndex >= Config.typing.texts.length) {
                    textArrayIndex = 0;
                }
                setTimeout(type, Config.typing.typingDelay + 1100);
            }
        };

        if (Config.typing.texts.length) {
            setTimeout(type, Config.typing.newTextDelay + 250);
        }
    },

    /**
     * Initialize scroll animations
     */
    initScrollAnimations() {
        const animateElements = DOM.$$('.animate-on-scroll');

        // Initial check
        this.checkAnimationElements(animateElements);

        // Check on scroll with throttle
        window.addEventListener('scroll', Utils.throttle(() => {
            this.checkAnimationElements(animateElements);
        }, 100));
    },

    /**
     * Check and trigger animations for elements
     */
    checkAnimationElements(elements) {
        const triggerBottom = window.innerHeight * Config.animations.scrollTrigger;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom && !DOM.hasClass(element, 'animated')) {
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
     * Animate counter (for statistics)
     */
    animateCounter(element, start, end, duration = 2000) {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < end) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end;
            }
        };

        updateCounter();
    },

    /**
     * Fade in element
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';

        let opacity = 0;
        const increment = 16 / duration;

        const fade = () => {
            opacity += increment;
            if (opacity < 1) {
                element.style.opacity = opacity;
                requestAnimationFrame(fade);
            } else {
                element.style.opacity = 1;
            }
        };

        fade();
    },

    /**
     * Fade out element
     */
    fadeOut(element, duration = 300) {
        let opacity = 1;
        const increment = 16 / duration;

        const fade = () => {
            opacity -= increment;
            if (opacity > 0) {
                element.style.opacity = opacity;
                requestAnimationFrame(fade);
            } else {
                element.style.opacity = 0;
                element.style.display = 'none';
            }
        };

        fade();
    },

    /**
     * Slide down element
     */
    slideDown(element, duration = 300) {
        element.style.maxHeight = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';

        const height = element.scrollHeight;
        const increment = height / (duration / 16);
        let currentHeight = 0;

        const slide = () => {
            currentHeight += increment;
            if (currentHeight < height) {
                element.style.maxHeight = currentHeight + 'px';
                requestAnimationFrame(slide);
            } else {
                element.style.maxHeight = 'none';
                element.style.overflow = 'visible';
            }
        };

        slide();
    },

    /**
     * Slide up element
     */
    slideUp(element, duration = 300) {
        const height = element.scrollHeight;
        element.style.maxHeight = height + 'px';
        element.style.overflow = 'hidden';

        const increment = height / (duration / 16);
        let currentHeight = height;

        const slide = () => {
            currentHeight -= increment;
            if (currentHeight > 0) {
                element.style.maxHeight = currentHeight + 'px';
                requestAnimationFrame(slide);
            } else {
                element.style.maxHeight = '0';
                element.style.display = 'none';
            }
        };

        slide();
    }
};
