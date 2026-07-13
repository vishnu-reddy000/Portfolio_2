// Admin Console Logic for Vishnu Vardhan Reddy Portfolio

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initTheme();
    initTabNavigation();
    initForms();
    initPasswordToggle();
    initHeaderNavigation();
});

// Authentication System
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutLink = document.getElementById('logout-link');

    if (isLoggedIn) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'flex';
        if (logoutLink) logoutLink.style.display = 'inline-flex';
        loadDashboardData();
    } else {
        loginSection.style.display = 'flex';
        dashboardSection.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
    }

    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (username === 'vishnumatamala10@gmail.com' && password === 'vishnu@2003') {
                sessionStorage.setItem('isLoggedIn', 'true');
                showToast('Login Successful!', 'success');
                checkAuth();
            } else {
                showToast('Invalid credentials! Please try again.', 'error');
            }
        });
    }

    // Logout Click
    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        showToast('Logged Out Successfully.', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (logoutLink) logoutLink.addEventListener('click', handleLogout);
}

// Header Mobile Navigation Toggle
function initHeaderNavigation() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            const icon = toggle.querySelector('i');
            if (menu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu on click of nav link
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }
}

// Password Visibility Toggle
function initPasswordToggle() {
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = togglePassword.querySelector('i');
            if (icon) {
                if (type === 'password') {
                    icon.className = 'fa-solid fa-eye-slash';
                } else {
                    icon.className = 'fa-solid fa-eye';
                }
            }
        });
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.className = 'glass show';
        
        if (type === 'error') {
            toast.style.background = '#dc3545';
        } else {
            toast.style.background = '#1a3038';
        }
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Tab Navigation
function initTabNavigation() {
    const sidebarButtons = document.querySelectorAll('.sidebar-btn');
    const formSections = document.querySelectorAll('.admin-form-section');

    const activateTab = (targetId) => {
        sidebarButtons.forEach(btn => {
            if (btn.getAttribute('data-target') === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        formSections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        localStorage.setItem('adminActiveTab', targetId);
    };

    sidebarButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            activateTab(targetId);
        });
    });

    // Restore tab from localStorage if it exists and is valid
    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab) {
        const tabExists = Array.from(sidebarButtons).some(btn => btn.getAttribute('data-target') === savedTab);
        if (tabExists) {
            activateTab(savedTab);
        }
    }
}

// Fetch dashboard items on successful login
function loadDashboardData() {
    loadProfile();
    loadExperiences();
    loadProjects();
    loadSkills();
    loadResume();
}

// ----------------------------------------------------
// PROFILE & AVATAR & SOCIALS HANDLERS
// ----------------------------------------------------
let currentProfile = {};

async function loadProfile() {
    try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Failed to fetch profile details');
        currentProfile = await response.json();
        
        // Fill profile inputs
        document.getElementById('profile-name').value = currentProfile.name || '';
        document.getElementById('profile-title').value = currentProfile.title || '';
        document.getElementById('profile-subtitle').value = currentProfile.subtitle || '';
        document.getElementById('profile-bio').value = currentProfile.bio || '';
        document.getElementById('profile-exp').value = currentProfile.experienceYears || '';
        document.getElementById('profile-projects').value = currentProfile.projectsCount || '';
        document.getElementById('profile-academic').value = currentProfile.academicStanding || '';

        // Fill photo preview and display (preview first URL if multiple exist)
        if (currentProfile.avatarUrl) {
            const urls = currentProfile.avatarUrl.split(/[,;]+/).map(u => u.trim()).filter(u => u.length > 0);
            if (urls.length > 0) {
                document.getElementById('avatar-preview').src = urls[0];
            }
            document.getElementById('avatar-url-display').value = currentProfile.avatarUrl;
        }

        // Fill socials inputs
        document.getElementById('social-github').value = currentProfile.githubUrl || '';
        document.getElementById('social-linkedin').value = currentProfile.linkedinUrl || '';
        document.getElementById('social-naukri').value = currentProfile.naukriUrl || '';
        document.getElementById('social-email').value = currentProfile.email || '';
        document.getElementById('social-phone').value = currentProfile.phone || '';
        document.getElementById('social-location').value = currentProfile.location || '';

    } catch (error) {
        console.error('Error fetching profile:', error);
        showToast('Could not fetch profile details from DB.', 'error');
    }
}

// Upload file to Cloudinary via REST API
async function uploadToCloudinary(fileInput, previewImgId, displayUrlInputId, statusBadgeId) {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const badge = document.getElementById(statusBadgeId);
        if (badge) {
            badge.style.display = 'inline-block';
            badge.style.background = 'rgba(255,193,7,0.1)';
            badge.style.borderColor = 'rgba(255,193,7,0.3)';
            badge.style.color = '#ffc107';
            badge.textContent = 'Uploading...';
        }

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        
        // Update URL input and image preview (prepend if multiple avatar URLs are supported)
        const displayInput = document.getElementById(displayUrlInputId);
        const currentVal = displayInput.value.trim();
        if (displayUrlInputId === 'avatar-url-display' && currentVal) {
            displayInput.value = data.url + ", " + currentVal;
        } else {
            displayInput.value = data.url;
        }
        document.getElementById(previewImgId).src = data.url;

        if (badge) {
            badge.style.background = 'rgba(34,197,94,0.1)';
            badge.style.borderColor = 'rgba(34,197,94,0.3)';
            badge.style.color = '#22c55e';
            badge.textContent = '✓ Uploaded to Cloudinary';
        }
        showToast('Image uploaded successfully to Cloudinary!', 'success');
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Image upload failed.', 'error');
        const badge = document.getElementById(statusBadgeId);
        if (badge) badge.style.display = 'none';
    }
}

// Initialize forms and upload listeners
function initForms() {
    // Avatar upload
    const avatarInput = document.getElementById('avatar-file-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', () => {
            uploadToCloudinary(avatarInput, 'avatar-preview', 'avatar-url-display', 'upload-status-badge');
        });
    }

    // Update avatar preview dynamically when user types/pastes multiple URLs
    const avatarUrlDisplay = document.getElementById('avatar-url-display');
    if (avatarUrlDisplay) {
        avatarUrlDisplay.addEventListener('input', () => {
            const val = avatarUrlDisplay.value.trim();
            const urls = val.split(/[,;]+/).map(u => u.trim()).filter(u => u.length > 0);
            if (urls.length > 0) {
                document.getElementById('avatar-preview').src = urls[0];
            } else {
                document.getElementById('avatar-preview').src = '';
            }
        });
    }

    // Save Avatar URL button
    const savePhotoBtn = document.getElementById('save-photo-btn');
    if (savePhotoBtn) {
        savePhotoBtn.addEventListener('click', async () => {
            const avatarUrl = document.getElementById('avatar-url-display').value;
            currentProfile.avatarUrl = avatarUrl;
            await saveProfile(currentProfile, 'Profile photo updated!');
        });
    }

    // Profile Details Form Submit
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedDetails = {
                ...currentProfile,
                name: document.getElementById('profile-name').value,
                title: document.getElementById('profile-title').value,
                subtitle: document.getElementById('profile-subtitle').value,
                bio: document.getElementById('profile-bio').value,
                experienceYears: document.getElementById('profile-exp').value,
                projectsCount: document.getElementById('profile-projects').value,
                academicStanding: document.getElementById('profile-academic').value
            };

            await saveProfile(updatedDetails, 'Profile details updated!');
        });
    }

    // Socials Form Submit
    const socialsForm = document.getElementById('socials-form');
    if (socialsForm) {
        socialsForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedDetails = {
                ...currentProfile,
                githubUrl: document.getElementById('social-github').value,
                linkedinUrl: document.getElementById('social-linkedin').value,
                naukriUrl: document.getElementById('social-naukri').value,
                email: document.getElementById('social-email').value,
                phone: document.getElementById('social-phone').value,
                location: document.getElementById('social-location').value
            };

            await saveProfile(updatedDetails, 'Social contact details updated!');
        });
    }

    // Experience Form Submit
    const expForm = document.getElementById('experience-form');
    if (expForm) {
        expForm.addEventListener('submit', handleExperienceSubmit);
    }
    const expCancel = document.getElementById('exp-cancel-btn');
    if (expCancel) {
        expCancel.addEventListener('click', resetExperienceForm);
    }

    // Education Form Submit
    const eduForm = document.getElementById('education-form');
    if (eduForm) {
        eduForm.addEventListener('submit', handleEducationSubmit);
    }
    const eduCancel = document.getElementById('edu-cancel-btn');
    if (eduCancel) {
        eduCancel.addEventListener('click', resetEducationForm);
    }

    // Project Form Submit
    const projForm = document.getElementById('project-form');
    if (projForm) {
        projForm.addEventListener('submit', handleProjectSubmit);
    }
    const projCancel = document.getElementById('proj-cancel-btn');
    if (projCancel) {
        projCancel.addEventListener('click', resetProjectForm);
    }
    const projImageUrl = document.getElementById('proj-image-url');
    if (projImageUrl) {
        projImageUrl.addEventListener('input', () => {
            const val = projImageUrl.value.trim();
            const preview = document.getElementById('proj-image-preview');
            const previewContainer = document.getElementById('proj-image-preview-container');
            if (val) {
                preview.src = val;
                if (previewContainer) previewContainer.style.display = 'flex';
            } else {
                preview.src = '';
                if (previewContainer) previewContainer.style.display = 'none';
            }
        });
    }

    // Skill Form Submit
    const skillForm = document.getElementById('skill-form');
    if (skillForm) {
        skillForm.addEventListener('submit', handleSkillSubmit);
    }
    const skillCancel = document.getElementById('skill-cancel-btn');
    if (skillCancel) {
        skillCancel.addEventListener('click', resetSkillForm);
    }

    // Resume Upload
    initResumeUpload();
}

async function saveProfile(profileDetails, successMessage) {
    try {
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileDetails)
        });

        if (!response.ok) throw new Error('Save profile API failed');
        currentProfile = await response.json();
        showToast(successMessage, 'success');
        loadProfile(); // refresh inputs
    } catch (error) {
        console.error('Error saving profile:', error);
        showToast('Failed to save profile configurations to database.', 'error');
    }
}

// ----------------------------------------------------
// EXPERIENCE & EDUCATION TIMELINE HANDLERS
// ----------------------------------------------------
let experiencesList = [];

function parseExperienceDescription(description) {
    let company = "";
    let locationOrGrade = "";
    let details = [];

    if (description && description.includes('|')) {
        const parts = description.split('|');
        company = parts[0].trim();
        const rest = parts[1].trim();
        const firstPeriod = rest.indexOf('.');
        if (firstPeriod !== -1) {
            locationOrGrade = rest.substring(0, firstPeriod).trim();
            const bulletText = rest.substring(firstPeriod + 1).trim();
            details = bulletText.split('.')
                .map(s => s.trim())
                .filter(s => s.length > 0);
        } else {
            locationOrGrade = rest;
        }
    } else {
        company = description || "";
    }

    return { company, locationOrGrade, details };
}

async function loadExperiences() {
    const workContainer = document.getElementById('experience-list-container');
    const eduContainer = document.getElementById('education-list-container');
    if (!workContainer && !eduContainer) return;

    try {
        const response = await fetch('/api/experiences');
        if (!response.ok) throw new Error('Failed to fetch experiences');
        experiencesList = await response.json();

        // Sort by displayOrder
        experiencesList.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

        if (workContainer) workContainer.innerHTML = '';
        if (eduContainer) eduContainer.innerHTML = '';

        let workCount = 0;
        let eduCount = 0;

        experiencesList.forEach(exp => {
            const roleLower = exp.role.toLowerCase();
            const isEducation = roleLower.includes('b.tech') || 
                                roleLower.includes('intermediate') || 
                                roleLower.includes('class x') || 
                                roleLower.includes('school') || 
                                roleLower.includes('college') || 
                                roleLower.includes('education') || 
                                roleLower.includes('university') ||
                                roleLower.includes('academic') ||
                                roleLower.includes('ssc') ||
                                roleLower.includes('mpc');

            const card = document.createElement('div');
            card.className = 'experience-card-admin';

            if (isEducation) {
                if (eduContainer) {
                    eduCount++;
                    card.innerHTML = `
                        <div class="card-info-admin">
                            <h5 style="color:var(--text-primary); font-weight:600;">${exp.role}</h5>
                            <span>${exp.duration}</span>
                        </div>
                        <div class="card-actions-admin">
                            <button class="admin-btn-icon" onclick="editEducation(${exp.id})" title="Edit"><i class="fa-solid fa-pencil"></i></button>
                            <button class="admin-btn-icon delete" onclick="deleteExperience(${exp.id})" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    `;
                    eduContainer.appendChild(card);
                }
            } else {
                if (workContainer) {
                    workCount++;
                    card.innerHTML = `
                        <div class="card-info-admin">
                            <h5 style="color:var(--text-primary); font-weight:600;">${exp.role}</h5>
                            <span>${exp.duration}</span>
                        </div>
                        <div class="card-actions-admin">
                            <button class="admin-btn-icon" onclick="editExperience(${exp.id})" title="Edit"><i class="fa-solid fa-pencil"></i></button>
                            <button class="admin-btn-icon delete" onclick="deleteExperience(${exp.id})" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    `;
                    workContainer.appendChild(card);
                }
            }
        });

        if (workContainer && workCount === 0) {
            workContainer.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">No professional experience items in database.</p>';
        }
        if (eduContainer && eduCount === 0) {
            eduContainer.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">No education timeline items in database.</p>';
        }
    } catch (error) {
        console.error('Error loading experiences:', error);
    }
}

async function handleExperienceSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('exp-id').value;
    const role = document.getElementById('exp-role').value.trim();
    const duration = document.getElementById('exp-duration').value.trim();
    
    const company = document.getElementById('exp-company').value.trim();
    const location = document.getElementById('exp-location').value.trim();
    const bullets = document.getElementById('exp-bullets').value.trim()
        .split('\n')
        .map(s => s.trim().replace(/\.+$/, ''))
        .filter(s => s.length > 0)
        .join('. ') + '.';

    const description = `${company} | ${location}. ${bullets}`;
    const payload = { role, duration, description, displayOrder: 1 };

    try {
        let response;
        if (id) {
            response = await fetch(`/api/experiences/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch('/api/experiences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) throw new Error('Save experience API failed');
        showToast(id ? 'Experience updated successfully!' : 'Experience added successfully!', 'success');
        resetExperienceForm();
        loadExperiences();
    } catch (error) {
        console.error(error);
        showToast('Error saving experience item.', 'error');
    }
}

window.editExperience = function(id) {
    const exp = experiencesList.find(e => e.id === id);
    if (!exp) return;

    document.getElementById('exp-id').value = exp.id;
    document.getElementById('exp-role').value = exp.role;
    document.getElementById('exp-duration').value = exp.duration;

    const parsed = parseExperienceDescription(exp.description);
    document.getElementById('exp-company').value = parsed.company;
    document.getElementById('exp-location').value = parsed.locationOrGrade;
    document.getElementById('exp-bullets').value = parsed.details.join('\n');

    document.getElementById('experience-form-title').textContent = 'Edit Professional Experience';
    document.getElementById('exp-submit-btn').querySelector('span').textContent = 'Update Item';
    document.getElementById('exp-cancel-btn').style.display = 'inline-flex';
};

window.deleteExperience = async function(id) {
    if (!confirm('Are you sure you want to delete this timeline item?')) return;

    try {
        const response = await fetch(`/api/experiences/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Delete experience failed');
        showToast('Timeline item deleted.', 'success');
        loadExperiences();
    } catch (error) {
        console.error(error);
        showToast('Error deleting experience.', 'error');
    }
};

function resetExperienceForm() {
    document.getElementById('exp-id').value = '';
    document.getElementById('experience-form').reset();
    document.getElementById('experience-form-title').textContent = 'Add New Experience';
    document.getElementById('exp-submit-btn').querySelector('span').textContent = 'Add Item';
    document.getElementById('exp-cancel-btn').style.display = 'none';
}

async function handleEducationSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('edu-id').value;
    const role = document.getElementById('edu-role').value.trim();
    const duration = document.getElementById('edu-duration').value.trim();
    
    const school = document.getElementById('edu-school').value.trim();
    const grade = document.getElementById('edu-grade').value.trim();

    const description = `${school} | ${grade}`;
    const payload = { role, duration, description, displayOrder: 1 };

    try {
        let response;
        if (id) {
            response = await fetch(`/api/experiences/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch('/api/experiences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) throw new Error('Save education API failed');
        showToast(id ? 'Education updated successfully!' : 'Education added successfully!', 'success');
        resetEducationForm();
        loadExperiences();
    } catch (error) {
        console.error(error);
        showToast('Error saving education item.', 'error');
    }
}

window.editEducation = function(id) {
    const exp = experiencesList.find(e => e.id === id);
    if (!exp) return;

    document.getElementById('edu-id').value = exp.id;
    document.getElementById('edu-role').value = exp.role;
    document.getElementById('edu-duration').value = exp.duration;

    const parsed = parseExperienceDescription(exp.description);
    document.getElementById('edu-school').value = parsed.company;
    document.getElementById('edu-grade').value = parsed.locationOrGrade;

    document.getElementById('education-form-title').textContent = 'Edit Education';
    document.getElementById('edu-submit-btn').querySelector('span').textContent = 'Update Item';
    document.getElementById('edu-cancel-btn').style.display = 'inline-flex';

    // Activate the education tab in the UI
    const sidebarButtons = document.querySelectorAll('.sidebar-btn');
    const formSections = document.querySelectorAll('.admin-form-section');
    sidebarButtons.forEach(btn => {
        if (btn.getAttribute('data-target') === 'education-section') btn.classList.add('active');
        else btn.classList.remove('active');
    });
    formSections.forEach(sec => {
        if (sec.id === 'education-section') sec.classList.add('active');
        else sec.classList.remove('active');
    });
};

function resetEducationForm() {
    document.getElementById('edu-id').value = '';
    document.getElementById('education-form').reset();
    document.getElementById('education-form-title').textContent = 'Add New Education';
    document.getElementById('edu-submit-btn').querySelector('span').textContent = 'Add Item';
    document.getElementById('edu-cancel-btn').style.display = 'none';
}

// ----------------------------------------------------
// PROJECTS PORTFOLIO HANDLERS
// ----------------------------------------------------
let projectsList = [];

async function loadProjects() {
    const container = document.getElementById('projects-list-container');
    if (!container) return;

    try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        projectsList = await response.json();

        container.innerHTML = '';
        if (projectsList.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">No projects in database.</p>';
            return;
        }

        projectsList.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card-admin';
            card.innerHTML = `
                <div class="card-info-admin">
                    <img class="project-thumbnail-admin" src="${proj.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}" alt="Preview">
                    <div class="card-info-text-admin">
                        <h5>${proj.title}</h5>
                        <span>${proj.technologies || ''}</span>
                    </div>
                </div>
                <div class="card-actions-admin">
                    <button class="admin-btn-icon" onclick="editProject(${proj.id})" title="Edit"><i class="fa-solid fa-pencil"></i></button>
                    <button class="admin-btn-icon delete" onclick="deleteProject(${proj.id})" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

async function handleProjectSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('proj-id').value;
    const title = document.getElementById('proj-title').value;
    const technologies = document.getElementById('proj-tech-stack').value;
    const githubLink = document.getElementById('proj-github-link').value;
    const liveLink = document.getElementById('proj-live-link').value;
    const imageUrl = document.getElementById('proj-image-url').value;
    const description = document.getElementById('proj-description').value;

    const payload = { title, technologies, githubLink, liveLink, imageUrl, description, displayOrder: 1 };

    try {
        let response;
        if (id) {
            // Update
            response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) throw new Error('Save project failed');
        showToast(id ? 'Project updated successfully!' : 'Project added successfully!', 'success');
        resetProjectForm();
        loadProjects();
    } catch (error) {
        console.error(error);
        showToast('Error saving project details.', 'error');
    }
}

window.editProject = function(id) {
    const proj = projectsList.find(p => p.id === id);
    if (!proj) return;

    document.getElementById('proj-id').value = proj.id;
    document.getElementById('proj-title').value = proj.title;
    document.getElementById('proj-tech-stack').value = proj.technologies;
    document.getElementById('proj-github-link').value = proj.githubLink || '';
    document.getElementById('proj-live-link').value = proj.liveLink || '';
    document.getElementById('proj-image-url').value = proj.imageUrl || '';
    document.getElementById('proj-description').value = proj.description;
    
    const preview = document.getElementById('proj-image-preview');
    const previewContainer = document.getElementById('proj-image-preview-container');
    if (proj.imageUrl) {
        preview.src = proj.imageUrl;
        if (previewContainer) previewContainer.style.display = 'flex';
    } else {
        preview.src = '';
        if (previewContainer) previewContainer.style.display = 'none';
    }

    document.getElementById('project-form-title').textContent = 'Edit Project';
    document.getElementById('proj-submit-btn').querySelector('span').textContent = 'Update Project';
    document.getElementById('proj-cancel-btn').style.display = 'inline-flex';
};

window.deleteProject = async function(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
        const response = await fetch(`/api/projects/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Delete project failed');
        showToast('Project deleted successfully.', 'success');
        loadProjects();
    } catch (error) {
        console.error(error);
        showToast('Error deleting project.', 'error');
    }
};

function resetProjectForm() {
    document.getElementById('proj-id').value = '';
    document.getElementById('project-form').reset();
    document.getElementById('proj-image-preview').src = '';
    const previewContainer = document.getElementById('proj-image-preview-container');
    if (previewContainer) previewContainer.style.display = 'none';
    document.getElementById('project-form-title').textContent = 'Add New Project';
    document.getElementById('proj-submit-btn').querySelector('span').textContent = 'Add Project';
    document.getElementById('proj-cancel-btn').style.display = 'none';
}

// ----------------------------------------------------
// SKILLSET INVENTORY HANDLERS
// ----------------------------------------------------
let skillsList = [];

async function loadSkills() {
    const container = document.getElementById('skills-list-container');
    if (!container) return;

    try {
        const response = await fetch('/api/skills');
        if (!response.ok) throw new Error('Failed to fetch skills');
        skillsList = await response.json();

        container.innerHTML = '';
        if (skillsList.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">No skills in database.</p>';
            return;
        }

        skillsList.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card-admin';
            card.innerHTML = `
                <div class="card-info-admin">
                    <div class="card-info-text-admin">
                        <h5>${skill.name}</h5>
                        <span>${skill.category} &bull; ${skill.proficiency}</span>
                    </div>
                </div>
                <div class="card-actions-admin">
                    <button class="admin-btn-icon" onclick="editSkill(${skill.id})" title="Edit"><i class="fa-solid fa-pencil"></i></button>
                    <button class="admin-btn-icon delete" onclick="deleteSkill(${skill.id})" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

async function handleSkillSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('skill-id').value;
    const name = document.getElementById('skill-name').value;
    const category = document.getElementById('skill-category').value;
    const proficiency = document.getElementById('skill-proficiency').value;

    const payload = { name, category, proficiency, displayOrder: 1 };

    try {
        let response;
        if (id) {
            response = await fetch(`/api/skills/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch('/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) throw new Error('Save skill failed');
        showToast(id ? 'Skill updated successfully!' : 'Skill added successfully!', 'success');
        resetSkillForm();
        loadSkills();
    } catch (error) {
        console.error(error);
        showToast('Error saving skill details.', 'error');
    }
}

window.editSkill = function(id) {
    const skill = skillsList.find(s => s.id === id);
    if (!skill) return;

    document.getElementById('skill-id').value = skill.id;
    document.getElementById('skill-name').value = skill.name;
    document.getElementById('skill-category').value = skill.category;
    document.getElementById('skill-proficiency').value = skill.proficiency;

    document.getElementById('skill-form-title').textContent = 'Edit Skill';
    document.getElementById('skill-submit-btn').querySelector('span').textContent = 'Update Skill';
    document.getElementById('skill-cancel-btn').style.display = 'inline-flex';
};

window.deleteSkill = async function(id) {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
        const response = await fetch(`/api/skills/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Delete skill failed');
        showToast('Skill deleted successfully.', 'success');
        loadSkills();
    } catch (error) {
        console.error(error);
        showToast('Error deleting skill.', 'error');
    }
};

function resetSkillForm() {
    document.getElementById('skill-id').value = '';
    document.getElementById('skill-form').reset();
    document.getElementById('skill-form-title').textContent = 'Add New Skill';
    document.getElementById('skill-submit-btn').querySelector('span').textContent = 'Add Skill';
    document.getElementById('skill-cancel-btn').style.display = 'none';
}

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (!icon) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    if (currentTheme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        themeToggle.style.color = '#ffc107'; // Sun yellow
    } else {
        icon.className = 'fa-solid fa-moon';
        themeToggle.style.color = 'var(--text-secondary)';
    }
}

// ----------------------------------------------------
// RESUME / CV UPLOAD HANDLERS
// ----------------------------------------------------

// File type → icon mapping
const RESUME_ICONS = {
    'pdf':  { icon: 'fa-file-pdf',  color: '#e74c3c' },
    'doc':  { icon: 'fa-file-word', color: '#2b579a' },
    'docx': { icon: 'fa-file-word', color: '#2b579a' },
    'csv':  { icon: 'fa-file-csv',  color: '#27ae60' },
    'txt':  { icon: 'fa-file-lines',color: '#7f8c8d' },
};

function getFileExt(filename) {
    return (filename || '').split('.').pop().toLowerCase();
}

function updateResumeStatusCard(url, fileName) {
    const card = document.getElementById('resume-status-card');
    if (!card) return;

    if (url) {
        const ext = getFileExt(fileName);
        const iconInfo = RESUME_ICONS[ext] || { icon: 'fa-file', color: 'var(--primary)' };

        document.getElementById('resume-file-icon').className = `fa-solid ${iconInfo.icon}`;
        document.getElementById('resume-file-icon').style.color = iconInfo.color;
        document.getElementById('resume-file-name').textContent = fileName || 'resume.' + ext;
        // Preview always uses the server-side proxy so it works across origins
        document.getElementById('resume-preview-link').href = '/api/resume/download';
        card.style.display = 'flex';
    } else {
        card.style.display = 'none';
    }
}

async function loadResume() {
    try {
        const res = await fetch('/api/resume');
        if (!res.ok) throw new Error('Resume fetch failed');
        const data = await res.json();
        updateResumeStatusCard(data.url, data.fileName);
    } catch (e) {
        console.warn('Could not load resume metadata:', e);
    }
}

function initResumeUpload() {
    const dropZone    = document.getElementById('resume-drop-zone');
    const fileInput   = document.getElementById('resume-file-input');
    const uploadBtn   = document.getElementById('resume-upload-btn');
    const btnLabel    = document.getElementById('resume-upload-btn-label');
    const progressWrap= document.getElementById('resume-progress-wrapper');
    const progressBar = document.getElementById('resume-progress-bar');
    const progressPct = document.getElementById('resume-progress-pct');
    const progressLbl = document.getElementById('resume-progress-label');
    const dropTitle   = document.getElementById('resume-drop-title');
    const removeBtn   = document.getElementById('resume-remove-btn');

    if (!dropZone || !fileInput) return;

    let selectedFile = null;

    // Drag-over visual feedback
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary)';
        dropZone.style.background  = 'var(--bg-tertiary)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--border-glass)';
        dropZone.style.background  = 'var(--bg-secondary)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-glass)';
        dropZone.style.background  = 'var(--bg-secondary)';
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            onFileSelected(e.dataTransfer.files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            onFileSelected(fileInput.files[0]);
        }
    });

    function onFileSelected(file) {
        selectedFile = file;
        const ext = getFileExt(file.name);
        const allowed = ['pdf','doc','docx','csv','txt'];

        if (!allowed.includes(ext)) {
            showToast('Unsupported file type. Use PDF, DOCX, DOC, CSV or TXT.', 'error');
            selectedFile = null;
            return;
        }

        const iconInfo = RESUME_ICONS[ext] || { icon: 'fa-file', color: 'var(--primary)' };
        dropZone.style.borderColor = 'var(--primary)';
        if (dropTitle) {
            dropTitle.innerHTML = `<i class="fa-solid ${iconInfo.icon}" style="color:${iconInfo.color};margin-right:8px;"></i>${file.name}`;
        }
        uploadBtn.disabled = false;
        btnLabel.textContent = `Upload "${file.name}"`;
    }

    // Upload button
    uploadBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        uploadBtn.disabled = true;
        btnLabel.textContent = 'Uploading…';
        if (progressWrap) progressWrap.style.display = 'block';

        // Animate progress bar (simulated — XHR would give real progress)
        let pct = 0;
        const timer = setInterval(() => {
            pct = Math.min(pct + Math.random() * 18, 90);
            progressBar.style.width = pct + '%';
            progressPct.textContent = Math.round(pct) + '%';
        }, 200);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const res = await fetch('/api/resume/upload', {
                method: 'POST',
                body: formData
            });

            clearInterval(timer);

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Upload failed');
            }

            progressBar.style.width = '100%';
            progressPct.textContent = '100%';
            if (progressLbl) progressLbl.textContent = 'Upload complete!';

            const data = await res.json();
            updateResumeStatusCard(data.url, data.fileName);
            showToast('Resume uploaded successfully! Visitors can now download it.', 'success');

            // Reset UI
            setTimeout(() => {
                if (progressWrap) progressWrap.style.display = 'none';
                progressBar.style.width = '0%';
                progressPct.textContent = '0%';
                if (progressLbl) progressLbl.textContent = 'Uploading...';
                dropZone.style.borderColor = 'var(--border-glass)';
                if (dropTitle) dropTitle.textContent = 'Drag & drop your resume here';
                btnLabel.textContent = 'Select a file to upload';
                uploadBtn.disabled = true;
                selectedFile = null;
                fileInput.value = '';
            }, 1500);

        } catch (err) {
            clearInterval(timer);
            progressBar.style.width = '0%';
            if (progressWrap) progressWrap.style.display = 'none';
            uploadBtn.disabled = false;
            btnLabel.textContent = `Upload "${selectedFile.name}"`;
            showToast('Upload failed: ' + err.message, 'error');
        }
    });

    // Remove resume
    if (removeBtn) {
        removeBtn.addEventListener('click', async () => {
            if (!confirm('Remove the current resume? Visitors will no longer see the download button.')) return;
            try {
                const res = await fetch('/api/resume', { method: 'DELETE' });
                if (!res.ok) throw new Error('Remove failed');
                updateResumeStatusCard(null, null);
                showToast('Resume removed from portfolio.', 'success');
            } catch (err) {
                showToast('Error removing resume: ' + err.message, 'error');
            }
        });
    }
}
