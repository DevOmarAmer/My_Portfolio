// Admin Panel JavaScript

// State management
let projects = [];
let editingIndex = -1;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    setupEventListeners();
    setupFormPreview();
});

// Load projects from JSON
async function loadProjects() {
    try {
        const response = await fetch('../data/projects.json');
        const data = await response.json();
        projects = data.projects || [];
        renderProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
        showToast('Error loading projects', 'error');
        projects = [];
        renderProjects();
    }
}

// Render projects list
function renderProjects() {
    const projectsList = document.getElementById('projectsList');
    
    if (projects.length === 0) {
        projectsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No Projects Yet</h3>
                <p>Start by adding your first project!</p>
                <button class="btn btn-primary" onclick="showAddProjectForm()">
                    <i class="fas fa-plus"></i> Add Project
                </button>
            </div>
        `;
        return;
    }

    projectsList.innerHTML = projects.map((project, index) => `
        <div class="project-item">
            <div class="project-item-image">
                <img src="../${project.image}" alt="${project.title}" 
                     onerror="this.src='https://via.placeholder.com/400x250?text=${encodeURIComponent(project.title)}'">
                ${project.featured ? '<span class="project-featured-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
            </div>
            <div class="project-item-content">
                <span class="project-item-category">${project.category}</span>
                <h3 class="project-item-title">${project.title}</h3>
                <p class="project-item-description">${project.description}</p>
                <div class="project-item-tech">
                    ${project.technologies ? project.technologies.map(tech => 
                        `<span class="tech-badge">${tech}</span>`
                    ).join('') : ''}
                </div>
                <div class="project-item-actions">
                    <button class="btn btn-primary btn-sm" onclick="editProject(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProject(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    ${project.githubLink ? `
                        <a href="${project.githubLink}" target="_blank" class="btn btn-secondary btn-sm">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            switchSection(section);
        });
    });

    // Form submission
    document.getElementById('projectForm').addEventListener('submit', handleFormSubmit);
}

// Switch sections
function switchSection(sectionName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`).classList.add('active');
}

// Show add project form
function showAddProjectForm() {
    editingIndex = -1;
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Add New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('editIndex').value = '';
    switchSection('add-project');
    updatePreview();
}

// Edit project
function editProject(index) {
    editingIndex = index;
    const project = projects[index];
    
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Project';
    document.getElementById('editIndex').value = index;
    document.getElementById('projectId').value = project.id || '';
    document.getElementById('title').value = project.title;
    document.getElementById('category').value = project.category;
    document.getElementById('image').value = project.image;
    document.getElementById('coverImage').value = project.coverImage || '';
    document.getElementById('description').value = project.description;
    document.getElementById('overview').value = project.overview || '';
    document.getElementById('features').value = project.features ? project.features.join('\n') : '';
    document.getElementById('technologies').value = project.technologies ? project.technologies.join(', ') : '';
    document.getElementById('technologiesUsed').value = project.technologiesUsed ? project.technologiesUsed.join('\n') : '';
    document.getElementById('gallery').value = project.gallery ? project.gallery.join('\n') : '';
    document.getElementById('videoUrl').value = project.videoUrl || '';
    document.getElementById('videoThumbnail').value = project.videoThumbnail || '';
    document.getElementById('githubLink').value = project.githubLink || '';
    document.getElementById('conclusion').value = project.conclusion || '';
    document.getElementById('featured').checked = project.featured || false;

    // Set category checkboxes
    document.querySelectorAll('input[name="categories"]').forEach(checkbox => {
        checkbox.checked = project.categories && project.categories.includes(checkbox.value);
    });

    switchSection('add-project');
    updatePreview();
}

// Delete project
function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects.splice(index, 1);
        saveProjects();
        renderProjects();
        showToast('Project deleted successfully!');
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const categories = Array.from(document.querySelectorAll('input[name="categories"]:checked'))
        .map(cb => cb.value);
    
    const technologies = document.getElementById('technologies').value
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech);

    const features = document.getElementById('features').value
        .split('\n')
        .map(f => f.trim())
        .filter(f => f);

    const technologiesUsed = document.getElementById('technologiesUsed').value
        .split('\n')
        .map(t => t.trim())
        .filter(t => t);

    const gallery = document.getElementById('gallery').value
        .split('\n')
        .map(g => g.trim())
        .filter(g => g);

    const projectId = document.getElementById('projectId').value || generateId(document.getElementById('title').value);
    
    const projectData = {
        id: projectId,
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        categories: categories.length > 0 ? categories : [document.getElementById('category').value],
        image: document.getElementById('image').value,
        coverImage: document.getElementById('coverImage').value || document.getElementById('image').value,
        description: document.getElementById('description').value,
        overview: document.getElementById('overview').value || document.getElementById('description').value,
        features: features,
        technologies: technologies,
        technologiesUsed: technologiesUsed.length > 0 ? technologiesUsed : technologies.map(t => `${t} for development`),
        gallery: gallery,
        videoUrl: document.getElementById('videoUrl').value,
        videoThumbnail: document.getElementById('videoThumbnail').value || document.getElementById('image').value,
        detailsPage: `project-details.html?id=${projectId}`,
        githubLink: document.getElementById('githubLink').value,
        conclusion: document.getElementById('conclusion').value || `The ${document.getElementById('title').value} project demonstrates strong expertise in mobile application development, focusing on user experience, functionality, and modern development practices.`,
        featured: document.getElementById('featured').checked
    };

    if (editingIndex >= 0) {
        projects[editingIndex] = projectData;
        showToast('Project updated successfully!');
    } else {
        projects.push(projectData);
        showToast('Project added successfully!');
    }

    saveProjects();
    renderProjects();
    switchSection('projects');
    document.getElementById('projectForm').reset();
    editingIndex = -1;
}

// Cancel form
function cancelProjectForm() {
    switchSection('projects');
    document.getElementById('projectForm').reset();
    editingIndex = -1;
}

// Generate ID from title
function generateId(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Setup form preview
function setupFormPreview() {
    const formInputs = [
        'title', 'category', 'image', 'coverImage', 'description', 'overview', 
        'features', 'technologies', 'technologiesUsed', 'gallery', 
        'videoUrl', 'videoThumbnail', 'conclusion'
    ];

    formInputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('input', updatePreview);
        }
    });

    document.querySelectorAll('input[name="categories"]').forEach(checkbox => {
        checkbox.addEventListener('change', updatePreview);
    });
}

// Update preview
function updatePreview() {
    const title = document.getElementById('title').value || 'Project Title';
    const category = document.getElementById('category').value || 'mobile';
    const image = document.getElementById('image').value;
    const description = document.getElementById('description').value || 'Project description will appear here...';
    const features = document.getElementById('features').value
        .split('\n')
        .map(f => f.trim())
        .filter(f => f);
    const technologies = document.getElementById('technologies').value
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech);
    const gallery = document.getElementById('gallery').value
        .split('\n')
        .map(g => g.trim())
        .filter(g => g);
    const videoUrl = document.getElementById('videoUrl').value;

    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewCategory').textContent = getCategoryLabel(category);
    
    // Enhanced description to show features count, gallery count, video status
    let extendedDesc = description;
    if (features.length > 0) {
        extendedDesc += ` • ${features.length} feature${features.length > 1 ? 's' : ''}`;
    }
    if (gallery.length > 0) {
        extendedDesc += ` • ${gallery.length} image${gallery.length > 1 ? 's' : ''}`;
    }
    if (videoUrl) {
        extendedDesc += ` • Video included`;
    }
    document.getElementById('previewDescription').textContent = extendedDesc;
    
    if (image) {
        document.getElementById('previewImage').src = '../' + image;
    }

    const techContainer = document.getElementById('previewTechnologies');
    if (technologies.length > 0) {
        techContainer.innerHTML = technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
    } else {
        techContainer.innerHTML = '';
    }
}

// Get category label
function getCategoryLabel(category) {
    const labels = {
        'mobile': 'Flutter App',
        'web': 'Web App',
        'ui': 'UI/UX Design'
    };
    return labels[category] || 'Flutter App';
}

// Save projects to JSON
function saveProjects() {
    const dataStr = JSON.stringify({ projects: projects }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'projects.json';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Projects saved! Please replace the file in data/projects.json', 'warning');
    
    // Also show instructions
    setTimeout(() => {
        alert('Important: Please copy the downloaded projects.json file to your portfolio\'s data/ folder to see the changes on your website.');
    }, 500);
}

// Export data
function exportData() {
    saveProjects();
}

// Import data
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.projects && Array.isArray(data.projects)) {
                projects = data.projects;
                renderProjects();
                showToast('Projects imported successfully!');
            } else {
                showToast('Invalid JSON format', 'error');
            }
        } catch (error) {
            showToast('Error parsing JSON file', 'error');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to delete ALL projects? This cannot be undone!')) {
        if (confirm('Really delete everything? Last chance!')) {
            projects = [];
            renderProjects();
            showToast('All projects cleared!');
        }
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.className = 'toast ' + type;
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}
