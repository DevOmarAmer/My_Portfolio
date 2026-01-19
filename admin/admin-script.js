// Admin Panel JavaScript

// State management
let projects = [];
let editingIndex = -1;
let resumeData = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    loadResumeData();
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
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27250%27%3E%3Crect fill=%27%23ddd%27 width=%27400%27 height=%27250%27/%3E%3Ctext fill=%27%23999%27 font-family=%27sans-serif%27 font-size=%2720%27 dy=%2710.5%27 font-weight=%27bold%27 x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27%3E${project.title}%3C/text%3E%3C/svg%3E'">
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

// ============================================
// RESUME MANAGEMENT FUNCTIONS
// ============================================

// Load resume data
async function loadResumeData() {
    try {
        const response = await fetch('../data/resume-data.json');
        resumeData = await response.json();
        renderResumeData();
    } catch (error) {
        console.error('Error loading resume data:', error);
        showToast('Error loading resume data', 'error');
        // Initialize with empty data
        resumeData = {
            education: [],
            certificates: [],
            courses: [],
            skills: [],
            profile: ''
        };
    }
}

// Render resume data
function renderResumeData() {
    if (!resumeData) return;
    
    // Render education
    renderEducationList();
    
    // Render certificates
    renderCertificatesList();
    
    // Render courses
    renderCoursesList();
    
    // Render skills
    document.getElementById('skillsText').value = resumeData.skills ? resumeData.skills.join('\n') : '';
    
    // Render profile
    document.getElementById('profileText').value = resumeData.profile || '';
}

// Render education list
function renderEducationList() {
    const list = document.getElementById('educationList');
    if (!list) return;
    
    if (!resumeData.education || resumeData.education.length === 0) {
        list.innerHTML = '<p class="empty-message">No education entries yet</p>';
        return;
    }
    
    list.innerHTML = resumeData.education.map((edu, index) => `
        <div class="resume-item">
            <div class="resume-item-content">
                <h4>${edu.degree}</h4>
                <p><strong>${edu.institution}</strong></p>
                <p>${edu.period} ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</p>
                ${edu.graduationProject ? `<p><em>Project: ${edu.graduationProject.title} (${edu.graduationProject.grade})</em></p>` : ''}
            </div>
            <div class="resume-item-actions">
                <button class="btn btn-sm btn-primary" onclick="editEducation(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteEducation(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Add education
function addEducation() {
    const institution = prompt('Institution name:');
    if (!institution) return;
    
    const degree = prompt('Degree:');
    if (!degree) return;
    
    const period = prompt('Period (e.g., 2020 - 2024):');
    if (!period) return;
    
    const gpa = prompt('GPA (optional):');
    const graduationDate = prompt('Graduation date (optional):');
    
    const hasProject = confirm('Add graduation project?');
    let graduationProject = null;
    
    if (hasProject) {
        const projectTitle = prompt('Project title:');
        const projectGrade = prompt('Project grade:');
        const projectDesc = prompt('Project description:');
        
        if (projectTitle) {
            graduationProject = {
                title: projectTitle,
                grade: projectGrade || 'Excellent',
                description: projectDesc || ''
            };
        }
    }
    
    const newEdu = {
        id: Date.now(),
        institution,
        degree,
        period,
        gpa: gpa || '',
        graduationDate: graduationDate || '',
        graduationProject
    };
    
    if (!resumeData.education) resumeData.education = [];
    resumeData.education.push(newEdu);
    renderEducationList();
    showToast('Education added!');
}

// Edit education
function editEducation(index) {
    const edu = resumeData.education[index];
    
    const institution = prompt('Institution name:', edu.institution);
    if (!institution) return;
    
    const degree = prompt('Degree:', edu.degree);
    if (!degree) return;
    
    const period = prompt('Period:', edu.period);
    if (!period) return;
    
    const gpa = prompt('GPA:', edu.gpa);
    const graduationDate = prompt('Graduation date:', edu.graduationDate);
    
    resumeData.education[index] = {
        ...edu,
        institution,
        degree,
        period,
        gpa: gpa || '',
        graduationDate: graduationDate || ''
    };
    
    renderEducationList();
    showToast('Education updated!');
}

// Delete education
function deleteEducation(index) {
    if (confirm('Delete this education entry?')) {
        resumeData.education.splice(index, 1);
        renderEducationList();
        showToast('Education deleted!');
    }
}

// Render certificates list
function renderCertificatesList() {
    const list = document.getElementById('certificatesList');
    if (!list) return;
    
    if (!resumeData.certificates || resumeData.certificates.length === 0) {
        list.innerHTML = '<p class="empty-message">No certificates yet</p>';
        return;
    }
    
    list.innerHTML = resumeData.certificates.map((cert, index) => `
        <div class="resume-item">
            ${cert.image ? `<div class="resume-item-image"><img src="../${cert.image}" alt="${cert.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;"></div>` : ''}
            <div class="resume-item-content">
                <h4>${cert.name}</h4>
                <p><strong>${cert.issuer}</strong> ${cert.date ? `(${cert.date})` : ''}</p>
                ${cert.description ? `<p>${cert.description}</p>` : ''}
                ${cert.image ? `<p><small><i class="fas fa-image"></i> ${cert.image}</small></p>` : ''}
                ${cert.credentialUrl ? `<p><a href="${cert.credentialUrl}" target="_blank"><i class="fas fa-link"></i> View</a></p>` : ''}
            </div>
            <div class="resume-item-actions">
                <button class="btn btn-sm btn-primary" onclick="editCertificate(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCertificate(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Add certificate
function addCertificate() {
    const name = prompt('Certificate name:');
    if (!name) return;
    
    const issuer = prompt('Issuer/Organization:');
    if (!issuer) return;
    
    const date = prompt('Date (e.g., 2023 or Jan 2023):');
    const description = prompt('Description (optional):');
    const image = prompt('Image path (optional, e.g., image/certificates/cert.jpg):');
    const credentialUrl = prompt('Credential URL (optional):');
    
    const newCert = {
        id: Date.now(),
        name,
        issuer,
        date: date || '',
        description: description || '',
        image: image || '',
        credentialUrl: credentialUrl || ''
    };
    
    if (!resumeData.certificates) resumeData.certificates = [];
    resumeData.certificates.push(newCert);
    renderCertificatesList();
    showToast('Certificate added!');
}

// Edit certificate
function editCertificate(index) {
    const cert = resumeData.certificates[index];
    
    const name = prompt('Certificate name:', cert.name);
    if (!name) return;
    
    const issuer = prompt('Issuer/Organization:', cert.issuer);
    if (!issuer) return;
    
    const date = prompt('Date:', cert.date);
    const description = prompt('Description:', cert.description);
    const image = prompt('Image path:', cert.image);
    const credentialUrl = prompt('Credential URL:', cert.credentialUrl);
    
    resumeData.certificates[index] = {
        ...cert,
        name,
        issuer,
        date: date || '',
        description: description || '',
        image: image || '',
        credentialUrl: credentialUrl || ''
    };
    
    renderCertificatesList();
    showToast('Certificate updated!');
}

// Delete certificate
function deleteCertificate(index) {
    if (confirm('Delete this certificate?')) {
        resumeData.certificates.splice(index, 1);
        renderCertificatesList();
        showToast('Certificate deleted!');
    }
}

// Render courses list
function renderCoursesList() {
    const list = document.getElementById('coursesList');
    if (!list) return;
    
    if (!resumeData.courses || resumeData.courses.length === 0) {
        list.innerHTML = '<p class="empty-message">No courses yet</p>';
        return;
    }
    
    list.innerHTML = resumeData.courses.map((course, index) => `
        <div class="resume-item">
            <div class="resume-item-content">
                <h4>${course.name}</h4>
                <p><strong>${course.platform}</strong> ${course.date ? `(${course.date})` : ''}</p>
                ${course.description ? `<p>${course.description}</p>` : ''}
                ${course.skills ? `<p><small>${course.skills.join(', ')}</small></p>` : ''}
            </div>
            <div class="resume-item-actions">
                <button class="btn btn-sm btn-primary" onclick="editCourse(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCourse(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Add course
function addCourse() {
    const name = prompt('Course name:');
    if (!name) return;
    
    const platform = prompt('Platform (e.g., Udemy, Coursera):');
    if (!platform) return;
    
    const date = prompt('Date (e.g., 2023):');
    const description = prompt('Description (optional):');
    const skillsInput = prompt('Skills learned (comma-separated, optional):');
    
    const skills = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(s => s) : [];
    
    const newCourse = {
        id: Date.now(),
        name,
        platform,
        date: date || '',
        description: description || '',
        skills
    };
    
    if (!resumeData.courses) resumeData.courses = [];
    resumeData.courses.push(newCourse);
    renderCoursesList();
    showToast('Course added!');
}

// Edit course
function editCourse(index) {
    const course = resumeData.courses[index];
    
    const name = prompt('Course name:', course.name);
    if (!name) return;
    
    const platform = prompt('Platform:', course.platform);
    if (!platform) return;
    
    const date = prompt('Date:', course.date);
    const description = prompt('Description:', course.description);
    const skillsInput = prompt('Skills (comma-separated):', course.skills ? course.skills.join(', ') : '');
    
    const skills = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(s => s) : [];
    
    resumeData.courses[index] = {
        ...course,
        name,
        platform,
        date: date || '',
        description: description || '',
        skills
    };
    
    renderCoursesList();
    showToast('Course updated!');
}

// Delete course
function deleteCourse(index) {
    if (confirm('Delete this course?')) {
        resumeData.courses.splice(index, 1);
        renderCoursesList();
        showToast('Course deleted!');
    }
}

// View resume JSON
function viewResumeJSON() {
    // Update data before viewing
    const skillsText = document.getElementById('skillsText').value;
    const tempData = {
        ...resumeData,
        skills: skillsText.split('\n').map(s => s.trim()).filter(s => s),
        profile: document.getElementById('profileText').value
    };
    
    const jsonWindow = window.open('', 'Resume JSON', 'width=800,height=600');
    jsonWindow.document.write('<html><head><title>Resume Data JSON</title>');
    jsonWindow.document.write('<style>body{font-family:monospace;padding:20px;background:#1e1e1e;color:#d4d4d4;}pre{white-space:pre-wrap;word-wrap:break-word;}</style>');
    jsonWindow.document.write('</head><body>');
    jsonWindow.document.write('<h2 style="color:#4fc3f7;">Current Resume Data</h2>');
    jsonWindow.document.write('<pre>' + JSON.stringify(tempData, null, 2) + '</pre>');
    jsonWindow.document.write('</body></html>');
    jsonWindow.document.close();
}

// Save resume data
function saveResumeData() {
    // Update skills from textarea
    const skillsText = document.getElementById('skillsText').value;
    resumeData.skills = skillsText.split('\n').map(s => s.trim()).filter(s => s);
    
    // Update profile
    resumeData.profile = document.getElementById('profileText').value;
    
    // Ensure all required fields exist
    if (!resumeData.personalInfo) {
        resumeData.personalInfo = {
            name: "Omar Amer",
            title: "Flutter Developer",
            location: "Cairo, Egypt",
            phone: "+201151056694",
            email: "omahar1907@gmail.com",
            linkedin: "https://www.linkedin.com/in/omar-amer-fathy",
            github: "https://www.github.com/DevOmarAmer",
            photo: "image/omar.jpg"
        };
    }
    
    // Create download
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'resume-data.json';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Resume data saved! Please replace the file in data/resume-data.json', 'warning');
    
    setTimeout(() => {
        alert('Important:\n1. Copy the downloaded resume-data.json file\n2. Replace data/resume-data.json with it\n3. Refresh your resume page with Ctrl+F5');
    }, 500);
}
