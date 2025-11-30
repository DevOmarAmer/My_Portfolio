// Project Details Dynamic Loader

document.addEventListener('DOMContentLoaded', function() {
    loadProjectDetails();
});

async function loadProjectDetails() {
    // Get project ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        showError('No project ID specified');
        return;
    }

    try {
        // Load projects data from main projects.json file
        const response = await fetch('data/projects.json');
        const data = await response.json();
        
        // Find the specific project
        const project = data.projects.find(p => p.id === projectId);
        
        if (!project) {
            showError('Project not found');
            return;
        }

        // Render project details
        renderProjectDetails(project);
    } catch (error) {
        console.error('Error loading project details:', error);
        showError('Failed to load project details');
    }
}

function renderProjectDetails(project) {
    // Update page title
    document.getElementById('pageTitle').textContent = `${project.title} - Omar Amer Portfolio`;
    document.getElementById('navTitle').textContent = project.title;
    document.getElementById('projectTitle').textContent = project.title;

    // Update cover image
    const coverImg = document.getElementById('projectCover');
    coverImg.src = project.coverImage || project.image;
    coverImg.alt = project.title;

    // Update overview
    document.getElementById('projectOverview').textContent = project.overview || project.description;

    // Update features
    const featuresList = document.getElementById('projectFeatures');
    if (project.features && project.features.length > 0) {
        featuresList.innerHTML = project.features.map(feature => `<li>${feature}</li>`).join('');
    } else {
        featuresList.innerHTML = '<li>Feature list coming soon...</li>';
    }

    // Update technologies
    const techList = document.getElementById('projectTechnologies');
    if (project.technologiesUsed && project.technologiesUsed.length > 0) {
        techList.innerHTML = project.technologiesUsed.map(tech => `<li>${tech}</li>`).join('');
    } else if (project.technologies && project.technologies.length > 0) {
        techList.innerHTML = project.technologies.map(tech => `<li>${tech}</li>`).join('');
    } else {
        techList.innerHTML = '<li>Technology stack coming soon...</li>';
    }

    // Update gallery
    if (project.gallery && project.gallery.length > 0) {
        const gallerySection = document.getElementById('gallerySection');
        const gallery = document.getElementById('projectGallery');
        gallery.innerHTML = project.gallery.map(img => 
            `<img src="${img}" alt="${project.title} Screenshot">`
        ).join('');
        gallerySection.style.display = 'block';
    }

    // Update video
    if (project.videoUrl) {
        const videoSection = document.getElementById('videoSection');
        const videoLink = document.getElementById('videoLink');
        const videoThumbnail = document.getElementById('videoThumbnail');
        
        videoLink.href = project.videoUrl;
        videoThumbnail.src = project.videoThumbnail || project.image;
        videoSection.style.display = 'block';
    }

    // Update GitHub link
    const githubSection = document.getElementById('githubSection');
    const githubLink = document.getElementById('githubLink');
    if (project.githubLink) {
        githubLink.href = project.githubLink;
        githubLink.textContent = `${project.title} GitHub Repository`;
        githubSection.style.display = 'block';
    } else {
        githubSection.style.display = 'none';
    }

    // Update conclusion
    const conclusionText = project.conclusion || 
        `The ${project.title} project demonstrates strong expertise in mobile application development, focusing on user experience, functionality, and modern development practices. It showcases the ability to build responsive and engaging applications using cutting-edge technologies.`;
    document.getElementById('projectConclusion').textContent = conclusionText;

    // Hide loading, show content
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('projectDetails').style.display = 'block';
}

function showError(message) {
    console.error(message);
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
}
