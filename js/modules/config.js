/**
 * Configuration Module
 * Central configuration for the application
 */

const Config = {
    // API Configuration
    api: {
        projectsUrl: 'data/projects.json',
        timeout: 5000
    },

    // EmailJS Configuration
    emailJS: {
        publicKey: '4pZettS9TXYU-e8J1',
        serviceId: 'service_rgookqa',
        templateId: 'template_xxg5yl9'
    },

    // Animation Configuration
    animations: {
        scrollTrigger: 0.8, // 80% of viewport
        defaultDelay: 0.2,
        defaultDuration: 0.6
    },

    // Typing Animation Configuration
    typing: {
        texts: ['Omar Amer', 'a Software Engineer', 'a Flutter Developer', 'a UI/UX Designer'],
        typingDelay: 100,
        erasingDelay: 50,
        newTextDelay: 2000
    },

    // UI Configuration
    ui: {
        headerScrollThreshold: 50,
        preloaderDuration: 500,
        toastDuration: 3500
    },

    // Categories Configuration
    categories: {
        mobile: 'Flutter App',
        web: 'Web App',
        ui: 'UI/UX Design'
    },

    // Social Links
    social: {
        facebook: 'https://www.facebook.com/profile.php?id=100045625816135',
        linkedin: 'https://www.linkedin.com/in/omar-amer-fathy',
        github: 'https://www.github.com/DevOmarAmer',
        instagram: 'https://www.instagram.com/your-username'
    },

    // Contact Information
    contact: {
        email: 'omahar1907@gmail.com',
        phone: '+201151056694',
        location: 'Cairo, Egypt'
    }
};

// Make configuration immutable
Object.freeze(Config);
