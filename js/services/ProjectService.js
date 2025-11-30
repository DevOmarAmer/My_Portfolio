/**
 * Project Service
 * Handles all project-related data operations
 */

class ProjectService {
    constructor() {
        this.projects = [];
        this.cache = null;
        this.cacheTime = null;
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Load projects from JSON file
     */
    async loadProjects(forceRefresh = false) {
        // Return cached data if available and not expired
        if (!forceRefresh && this.cache && this.cacheTime && 
            (Date.now() - this.cacheTime) < this.cacheDuration) {
            return this.cache;
        }

        try {
            console.log('Fetching projects from:', Config.api.projectsUrl);
            
            const response = await fetch(Config.api.projectsUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.projects = data.projects || [];
            
            // Update cache
            this.cache = this.projects;
            this.cacheTime = Date.now();
            
            console.log('Projects loaded successfully:', this.projects.length);
            return this.projects;
            
        } catch (error) {
            console.error('Error loading projects:', error);
            
            // Try to load fallback projects
            return this.loadFallbackProjects();
        }
    }

    /**
     * Load fallback projects (for offline/development)
     */
    loadFallbackProjects() {
        console.warn('Loading fallback projects...');
        
        // Return empty array if no fallback available
        if (!this.fallbackProjects) {
            return [];
        }
        
        this.projects = this.fallbackProjects;
        return this.projects;
    }

    /**
     * Get all projects
     */
    getAllProjects() {
        return this.projects;
    }

    /**
     * Get project by ID
     */
    getProjectById(id) {
        return this.projects.find(project => project.id === id);
    }

    /**
     * Get projects by category
     */
    getProjectsByCategory(category) {
        if (category === 'all') {
            return this.projects;
        }
        return this.projects.filter(project => 
            project.categories && project.categories.includes(category)
        );
    }

    /**
     * Get featured projects
     */
    getFeaturedProjects() {
        return this.projects.filter(project => project.featured);
    }

    /**
     * Search projects
     */
    searchProjects(query) {
        const lowerQuery = query.toLowerCase();
        return this.projects.filter(project => 
            project.title.toLowerCase().includes(lowerQuery) ||
            project.description.toLowerCase().includes(lowerQuery) ||
            (project.technologies && project.technologies.some(tech => 
                tech.toLowerCase().includes(lowerQuery)
            ))
        );
    }

    /**
     * Filter projects
     */
    filterProjects(filters) {
        let filtered = this.projects;

        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(project => 
                project.categories && project.categories.includes(filters.category)
            );
        }

        if (filters.featured !== undefined) {
            filtered = filtered.filter(project => project.featured === filters.featured);
        }

        if (filters.technology) {
            filtered = filtered.filter(project => 
                project.technologies && project.technologies.includes(filters.technology)
            );
        }

        return filtered;
    }

    /**
     * Get project statistics
     */
    getStatistics() {
        return {
            total: this.projects.length,
            featured: this.projects.filter(p => p.featured).length,
            byCategory: {
                mobile: this.projects.filter(p => p.category === 'mobile').length,
                web: this.projects.filter(p => p.category === 'web').length,
                ui: this.projects.filter(p => p.category === 'ui').length
            },
            technologies: this.getAllTechnologies()
        };
    }

    /**
     * Get all unique technologies
     */
    getAllTechnologies() {
        const techSet = new Set();
        this.projects.forEach(project => {
            if (project.technologies) {
                project.technologies.forEach(tech => techSet.add(tech));
            }
        });
        return Array.from(techSet);
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache = null;
        this.cacheTime = null;
    }
}

// Create singleton instance
const projectService = new ProjectService();
