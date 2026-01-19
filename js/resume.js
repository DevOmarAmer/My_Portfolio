/**
 * Resume Page - Dynamic Content Loader
 * Loads and renders resume data from JSON file
 */

// Load resume data on page load
document.addEventListener('DOMContentLoaded', loadResumeData);

async function loadResumeData() {
    try {
        // Add cache-busting parameter to ensure fresh data
        const cacheBuster = new Date().getTime();
        const response = await fetch(`data/resume-data.json?v=${cacheBuster}`);
        if (!response.ok) {
            throw new Error('Failed to load resume data');
        }
        const data = await response.json();
        
        renderProfile(data.profile);
        renderSkills(data.skills);
        renderEducation(data.education);
        renderCertificates(data.certificates);
        renderCourses(data.courses);
        renderProjects(data.projects);
        renderLanguages(data.languages);
        
    } catch (error) {
        console.error('Error loading resume data:', error);
        showError();
    }
}

function renderProfile(profile) {
    const profileText = document.getElementById('profileText');
    if (profileText) {
        profileText.textContent = profile;
    }
}

function renderSkills(skills) {
    const skillsList = document.getElementById('skillsList');
    if (!skillsList || !skills || skills.length === 0) return;
    
    skillsList.innerHTML = '';
    skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        skillsList.appendChild(li);
    });
}

function renderEducation(education) {
    const educationList = document.getElementById('educationList');
    if (!educationList || !education || education.length === 0) return;
    
    educationList.innerHTML = '';
    
    education.forEach(edu => {
        const eduDiv = document.createElement('div');
        eduDiv.className = 'education-item';
        
        let html = `<p><strong>${edu.institution}</strong></p>`;
        html += `<p><strong>${edu.degree}  ${edu.period}</strong></p>`;
        
        if (edu.graduationDate || edu.gpa) {
            const details = [];
            if (edu.graduationDate) details.push(`Graduated: ${edu.graduationDate}`);
            if (edu.gpa) details.push(`GPA: ${edu.gpa}`);
            html += `<p>${details.join(' | ')}</p>`;
        }
        
        if (edu.graduationProject) {
            html += `<h3>Graduation Project <strong>(${edu.graduationProject.grade})</strong></h3>`;
            html += `<p>${edu.graduationProject.description}</p>`;
        }
        
        eduDiv.innerHTML = html;
        educationList.appendChild(eduDiv);
    });
}

function renderCertificates(certificates) {
    const certificatesSection = document.getElementById('certificatesSection');
    const certificatesList = document.getElementById('certificatesList');
    
    if (!certificatesList || !certificates || certificates.length === 0) {
        if (certificatesSection) {
            certificatesSection.style.display = 'none';
        }
        return;
    }
    
    // Show section if there are certificates
    if (certificatesSection) {
        certificatesSection.style.display = 'block';
    }
    
    certificatesList.innerHTML = '';
    
    certificates.forEach(cert => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.gap = '1rem';
        li.style.alignItems = 'flex-start';
        
        let certHtml = '';
        
        // Add image if available
        if (cert.image && cert.image.trim() !== '') {
            certHtml += `<div style=\"flex-shrink: 0;\"><img src=\"${cert.image}\" alt=\"${cert.name}\" onerror=\"this.style.display='none'\" style=\"width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #e0e0e0;\"></div>`;
        }
        
        certHtml += `<div style="flex: 1;">`;
        certHtml += `<strong>${cert.name}</strong>`;
        
        if (cert.issuer) {
            certHtml += ` - ${cert.issuer}`;
        }
        
        if (cert.date) {
            certHtml += ` (${cert.date})`;
        }
        
        if (cert.description) {
            certHtml += `<br><span style="font-size: 0.95em;">${cert.description}</span>`;
        }
        
        if (cert.credentialUrl && cert.credentialUrl.trim() !== '') {
            certHtml += `<br><a href="${cert.credentialUrl}" target="_blank" style="font-size: 0.9em;"><i class="fas fa-external-link-alt"></i> View Credential</a>`;
        }
        
        certHtml += `</div>`;
        
        li.innerHTML = certHtml;
        certificatesList.appendChild(li);
    });
}

function renderCourses(courses) {
    const coursesSection = document.getElementById('coursesSection');
    const coursesList = document.getElementById('coursesList');
    
    if (!coursesList || !courses || courses.length === 0) {
        if (coursesSection) {
            coursesSection.style.display = 'none';
        }
        return;
    }
    
    // Show section if there are courses
    if (coursesSection) {
        coursesSection.style.display = 'block';
    }
    
    coursesList.innerHTML = '';
    
    courses.forEach(course => {
        const li = document.createElement('li');
        
        let courseHtml = `<strong>${course.name}</strong>`;
        
        if (course.platform) {
            courseHtml += ` - ${course.platform}`;
        }
        
        if (course.date) {
            courseHtml += ` (${course.date})`;
        }
        
        if (course.description) {
            courseHtml += `<br><span style="font-size: 0.95em;">${course.description}</span>`;
        }
        
        if (course.skills && course.skills.length > 0) {
            courseHtml += `<br><span style="font-size: 0.9em; color: #666;"><i class="fas fa-tags"></i> ${course.skills.join(', ')}</span>`;
        }
        
        li.innerHTML = courseHtml;
        coursesList.appendChild(li);
    });
}

function renderProjects(projects) {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList || !projects || projects.length === 0) return;
    
    projectsList.innerHTML = '';
    
    projects.forEach(project => {
        const li = document.createElement('li');
        
        let projectHtml = '';
        if (project.link) {
            projectHtml = `<strong><a href="${project.link}" target="_blank">${project.name}:</a></strong>`;
        } else {
            projectHtml = `<strong>${project.name}:</strong>`;
        }
        
        projectHtml += ` ${project.description}`;
        
        li.innerHTML = projectHtml;
        projectsList.appendChild(li);
    });
}

function renderLanguages(languages) {
    const languagesList = document.getElementById('languagesList');
    if (!languagesList || !languages || languages.length === 0) return;
    
    languagesList.innerHTML = '';
    
    languages.forEach(language => {
        const li = document.createElement('li');
        li.textContent = language;
        languagesList.appendChild(li);
    });
}

function showError() {
    const container = document.querySelector('.container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'padding: 20px; background-color: #f8d7da; color: #721c24; border-radius: 5px; margin: 20px 0;';
        errorDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to load resume data. Please try again later.';
        container.insertBefore(errorDiv, container.firstChild);
    }
}
