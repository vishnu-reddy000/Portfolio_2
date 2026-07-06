// Client-side interactions and REST API integrations for Portfolio

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    loadProfile();
    loadExperiences();
    loadProjects();
    loadSkills();
    initContactForm();
    initWebSocket();
    initScrollSpy();
});

// Mobile Navigation Toggle
function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu on click of nav link and highlight it (scrolling smoothly without URL hash)
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.getElementById(targetId.substring(1));
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }

                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
                
                // Immediately active class on click
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }
}

// ScrollSpy: Update active nav link on scroll without changing browser URL hash
function initScrollSpy() {
    const sections = ['about', 'experience', 'projects', 'skills', 'process', 'contact']
        .map(id => document.getElementById(id))
        .filter(el => el !== null);
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // offset to detect section change early

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            // Update active class on nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        } else {
            // If scrolled to top (above 'about' section)
            if (window.scrollY < 150) {
                navLinks.forEach(link => link.classList.remove('active'));
            }
        }
    });

    // Handle initial load hash and clean the URL bar if any hash exists
    const initialHash = window.location.hash;
    if (initialHash) {
        const link = Array.from(navLinks).find(l => l.getAttribute('href') === initialHash);
        if (link) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Smoothly scroll to initial target
            const targetSection = document.getElementById(initialHash.substring(1));
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
        // Clean hash from URL bar
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }
}

// Fallback Resume Data in case backend APIs are unreachable or empty
const FALLBACK_PROJECTS = [
    {
        id: 1,
        title: "Multi-Tenant SaaS CRM Platform",
        description: "Developed a scalable CRM platform supporting multiple tenants with role-based access control and tenant-specific configurations. Implemented RESTful APIs for frontend-backend communication, optimized database queries for performance, and contributed to CI/CD deployment workflows using Jenkins.",
        technologies: "Java, Spring Boot, REST APIs, MySQL, HTML, CSS, JavaScript",
        githubLink: "https://github.com",
        liveLink: "",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Smart Office Management System",
        description: "Built a full-stack enterprise office management application featuring employee attendance tracking, leave management, task assignment, and department-wise reporting. Deployed on Apache Tomcat with a responsive UI and persistent MySQL storage.",
        technologies: "Java, Spring Boot, Servlets, JDBC, MySQL, HTML5, CSS3, JavaScript",
        githubLink: "https://github.com",
        liveLink: "",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Design of 175kW Grid-Connected Photovoltaic System",
        description: "Final year B.Tech project developing an accurate simulation model for a 175kW solar PV system, including performance analysis, grid integration, and energy output optimization.",
        technologies: "MATLAB/Simulink, Solar PV Simulation, Grid Integration",
        githubLink: "",
        liveLink: "",
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80"
    }
];

const FALLBACK_SKILLS = [
    { name: "Core Java", category: "Languages", proficiency: "Expert", displayOrder: 1 },
    { name: "Spring Boot", category: "Backend", proficiency: "Expert", displayOrder: 2 },
    { name: "Spring Data JPA / Hibernate", category: "Backend", proficiency: "Expert", displayOrder: 3 },
    { name: "REST APIs & JWT", category: "Backend", proficiency: "Expert", displayOrder: 4 },
    { name: "JavaScript", category: "Languages", proficiency: "Advanced", displayOrder: 5 },
    { name: "HTML5 & CSS3", category: "Frontend", proficiency: "Expert", displayOrder: 6 },
    { name: "MySQL / PostgreSQL", category: "Database", proficiency: "Expert", displayOrder: 7 },
    { name: "Oracle SQL", category: "Database", proficiency: "Advanced", displayOrder: 8 },
    { name: "Git & GitHub", category: "Tools", proficiency: "Expert", displayOrder: 9 },
    { name: "Maven", category: "Tools", proficiency: "Expert", displayOrder: 10 },
    { name: "Jenkins & CI/CD", category: "Tools", proficiency: "Advanced", displayOrder: 11 },
    { name: "Figma UI/UX Design", category: "UI/UX", proficiency: "Advanced", displayOrder: 12 }
];

// Load Projects from REST API
async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('API fetch failed');
        let projects = await response.json();
        
        if (!projects || projects.length === 0) {
            projects = FALLBACK_PROJECTS;
        }
        renderProjects(projects);
    } catch (error) {
        console.warn('API error fetching projects, falling back to static resume data.', error);
        renderProjects(FALLBACK_PROJECTS);
    }
}

function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = ''; // Clear loading

    projects.forEach(project => {
        const techList = project.technologies 
            ? project.technologies.split(',').map(tech => `<span class="tag">${tech.trim()}</span>`).join('')
            : '';

        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-img-wrapper">
                <img src="${project.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}" alt="${project.title}" onerror="this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'">
                <div class="project-tech-tags">${techList}</div>
            </div>
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-links">
                    ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="btn btn-outline"><i class="fa-brands fa-github"></i> Code</a>` : ''}
                    ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" class="btn btn-dark"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ''}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Load Skills from REST API
async function loadSkills() {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;

    try {
        const response = await fetch('/api/skills');
        if (!response.ok) throw new Error('API fetch failed');
        let skills = await response.json();

        if (!skills || skills.length === 0) {
            skills = FALLBACK_SKILLS;
        }
        renderSkills(skills);
    } catch (error) {
        console.warn('API error fetching skills, falling back to static resume data.', error);
        renderSkills(FALLBACK_SKILLS);
    }
}

function renderSkills(skills) {
    const grid = document.getElementById('skillsGrid');
    grid.innerHTML = ''; // Clear loading

    // Group skills by category
    const categories = {};
    skills.forEach(skill => {
        if (!categories[skill.category]) {
            categories[skill.category] = [];
        }
        categories[skill.category].push(skill);
    });

    // Icons for each category
    const categoryIcons = {
        'Languages': 'fa-solid fa-terminal',
        'Backend': 'fa-solid fa-gears',
        'Frontend': 'fa-solid fa-code',
        'Database': 'fa-solid fa-database',
        'Tools': 'fa-solid fa-toolbox',
        'DevOps': 'fa-solid fa-cloud-arrow-up',
        'UI/UX': 'fa-solid fa-pen-nib'
    };

    // Render grouped categories
    for (const [categoryName, categorySkills] of Object.entries(categories)) {
        const card = document.createElement('div');
        card.className = 'skills-card';
        
        const iconClass = categoryIcons[categoryName] || 'fa-solid fa-circle-check';
        
        let skillsListHtml = '';
        categorySkills.forEach(skill => {
            let percentage = 70;
            if (skill.proficiency === 'Expert') percentage = 95;
            else if (skill.proficiency === 'Advanced') percentage = 85;
            else if (skill.proficiency === 'Intermediate') percentage = 70;

            skillsListHtml += `
                <div class="skill-item">
                    <div class="skill-name-row">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-level">${skill.proficiency}</span>
                    </div>
                    <div class="skill-progress-bg">
                        <div class="skill-progress-bar" style="width: 0%;" data-width="${percentage}%"></div>
                    </div>
                </div>
            `;
        });

        card.innerHTML = `
            <h3 class="skills-card-title"><i class="${iconClass}"></i> ${categoryName}</h3>
            <div class="skills-list">
                ${skillsListHtml}
            </div>
        `;
        grid.appendChild(card);
    }

    // Trigger skills bar animations
    setTimeout(() => {
        document.querySelectorAll('.skill-progress-bar').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
        });
    }, 100);
}

// Contact Form submission
function initContactForm() {
    const form = document.getElementById('contactForm');
    const alertBox = document.getElementById('formAlert');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Disable button and loading state
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('span');
            const originalText = btnText ? btnText.textContent : 'Send Message';
            if (btnText) btnText.textContent = 'Sending...';

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                // 1. Submit to Web3Forms (primary notification provider)
                const web3Response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: 'fddb70b8-f73f-46d6-8da9-db2c070000ba',
                        name: name,
                        email: email,
                        message: message,
                        subject: `New Portfolio Inquiry from ${name}`
                    })
                });

                const web3Data = await web3Response.json();

                if (web3Response.ok && web3Data.success) {
                    // 2. Concurrently save to local portfolio database for backup
                    fetch('/api/inquiries', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name, email, message }),
                    }).catch(err => console.warn('Backup local DB save failed:', err));

                    // 3. Trigger EmailJS auto-reply email to the inquirer
                    if (typeof emailjs !== 'undefined') {
                        emailjs.send("service_hzsge9l", "template_9op6ogq", {
                            from_name: "M. Vishnu Vardhan Reddy",
                            to_name: name,
                            to_email: email,
                            email: email,
                            message: message
                        }).then(
                            (res) => console.log('EmailJS auto-reply sent successfully!', res.status, res.text),
                            (err) => console.error('EmailJS auto-reply failed:', err)
                        );
                    }

                    alertBox.className = 'form-alert success';
                    alertBox.textContent = 'Thank you! Your message was sent successfully.';
                    alertBox.style.display = 'block';
                    form.reset();
                } else {
                    throw new Error(web3Data.message || 'Web3Forms submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                alertBox.className = 'form-alert error';
                alertBox.textContent = `Submission failed: ${error.message}`;
                alertBox.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = originalText;
                setTimeout(() => {
                    alertBox.style.display = 'none';
                }, 5000);
            }
        });
    }
}

// Parse custom experience description format (Company | Location/Grade. Bullet details...)
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

// Load Profile Details from REST API
async function loadProfile() {
    try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Profile API fetch failed');
        const profile = await response.json();
        renderProfile(profile);
    } catch (error) {
        console.warn('API error fetching profile, using static markup fallback.', error);
    }
}

function renderProfile(profile) {
    if (!profile) return;
    
    // Bind Name in Logo & Copyright
    if (profile.name) {
        const logoText = document.getElementById('logoText');
        if (logoText) {
            const nameParts = profile.name.trim().split(/\s+/);
            if (nameParts.length > 1) {
                let firstPart = nameParts[0].toUpperCase();
                let restPart = nameParts.slice(1).join(' ');
                
                // If the first segment is an initial (e.g. "M."), combine it with the next name segment
                if (nameParts[0].length <= 2 || nameParts[0].endsWith('.')) {
                    firstPart = (nameParts[0] + " " + nameParts[1]).toUpperCase();
                    restPart = nameParts.slice(2).join(' ');
                }
                
                logoText.innerHTML = `${firstPart}<span> ${restPart}</span>`;
            } else {
                logoText.innerHTML = `${profile.name.toUpperCase()}<span></span>`;
            }
        }
        
    }

    // Bind Hero Title & Subtitle
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle && profile.title) {
        const currentCleanText = heroTitle.textContent.replace(/\s+/g, ' ').trim();
        const incomingCleanText = profile.title.replace('<br>', '').replace(/\s+/g, ' ').trim();

        if (currentCleanText !== incomingCleanText) {
            let parts = [];
            if (profile.title.includes('<br>')) {
                parts = profile.title.split('<br>');
            } else if (profile.title.includes(' & ')) {
                parts = profile.title.split(' & ');
                if (parts.length >= 2) {
                    parts[1] = '& ' + parts[1];
                }
            } else {
                parts = [profile.title];
            }

            let formattedTitle = '';
            if (parts.length >= 2) {
                formattedTitle = `<span class="title-line title-line-1">${parts[0].trim()}</span><span class="title-line title-line-2">${parts[1].trim()}</span>`;
            } else {
                formattedTitle = `<span class="title-line title-line-1">${profile.title}</span>`;
            }

            heroTitle.innerHTML = formattedTitle;
        }
    }
    
    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle && profile.subtitle && heroSubtitle.textContent.trim() !== profile.subtitle.trim()) {
        heroSubtitle.textContent = profile.subtitle;
    }
    
    // Bind Profile Avatar (fetches all images from Cloudinary portfolio folder for random rotation)
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        fetch('/api/upload/images')
            .then(res => {
                if (!res.ok) throw new Error('Cloudinary fetch failed');
                return res.json();
            })
            .then(images => {
                if (images && images.length > 0) {
                    const randomIndex = Math.floor(Math.random() * images.length);
                    const selectedImage = images[randomIndex];
                    if (profileAvatar.src !== selectedImage) {
                        profileAvatar.src = selectedImage;
                    }
                    profileAvatar.style.display = 'block';
                } else {
                    loadFallbackAvatar(profile);
                }
            })
            .catch(err => {
                console.warn('Could not list images from Cloudinary, using database URLs:', err);
                loadFallbackAvatar(profile);
            });
    }
    
    // Bind Career Objective
    const objectiveText = document.getElementById('objectiveText');
    if (objectiveText && profile.bio && objectiveText.textContent.trim() !== profile.bio.trim()) {
        objectiveText.textContent = profile.bio;
    }
    
    // Bind Highlights / Stats
    const statExp = document.getElementById('statExp');
    if (statExp && profile.experienceYears && statExp.textContent.trim() !== profile.experienceYears.trim()) {
        statExp.textContent = profile.experienceYears;
    }

    const statProjects = document.getElementById('statProjects');
    if (statProjects && profile.projectsCount && statProjects.textContent.trim() !== profile.projectsCount.trim()) {
        statProjects.textContent = profile.projectsCount;
    }

    const statAcademic = document.getElementById('statAcademic');
    if (statAcademic && profile.academicStanding && statAcademic.textContent.trim() !== profile.academicStanding.trim()) {
        statAcademic.textContent = profile.academicStanding;
    }

    // Bind Contact Info
    const contactEmail = document.getElementById('contactEmail');
    if (contactEmail && profile.email) {
        contactEmail.href = `mailto:${profile.email}`;
        contactEmail.textContent = profile.email;
    }
    
    const contactPhone = document.getElementById('contactPhone');
    if (contactPhone && profile.phone) {
        contactPhone.href = `tel:${profile.phone.replace(/\s+/g, '')}`;
        contactPhone.textContent = profile.phone;
    }
    
    const contactLocation = document.getElementById('contactLocation');
    if (contactLocation && profile.location) contactLocation.textContent = profile.location;
    
    // Bind Social Links
    const githubLink = document.getElementById('githubLink');
    if (githubLink && profile.githubUrl) githubLink.href = profile.githubUrl;
    
    const linkedinLink = document.getElementById('linkedinLink');
    if (linkedinLink && profile.linkedinUrl) linkedinLink.href = profile.linkedinUrl;

    const naukriLink = document.getElementById('naukriLink');
    if (naukriLink && profile.naukriUrl) {
        naukriLink.href = (profile.naukriUrl === 'https://naukri.com') 
            ? 'https://www.naukri.com/mnjuser/profile' 
            : profile.naukriUrl;
    }

    const footerGithubLink = document.getElementById('footerGithubLink');
    if (footerGithubLink && profile.githubUrl) footerGithubLink.href = profile.githubUrl;

    const footerLinkedinLink = document.getElementById('footerLinkedinLink');
    if (footerLinkedinLink && profile.linkedinUrl) footerLinkedinLink.href = profile.linkedinUrl;

    const footerNaukriLink = document.getElementById('footerNaukriLink');
    if (footerNaukriLink && profile.naukriUrl) {
        footerNaukriLink.href = (profile.naukriUrl === 'https://naukri.com') 
            ? 'https://www.naukri.com/mnjuser/profile' 
            : profile.naukriUrl;
    }
}

// Load Experiences & Education from REST API
async function loadExperiences() {
    const expTimeline = document.getElementById('experienceTimeline');
    const eduList = document.getElementById('educationList');
    if (!expTimeline && !eduList) return;

    try {
        const response = await fetch('/api/experiences');
        if (!response.ok) throw new Error('Experiences API fetch failed');
        const experiences = await response.json();

        // Sort by displayOrder
        experiences.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

        if (expTimeline) expTimeline.innerHTML = '';
        if (eduList) eduList.innerHTML = '';

        experiences.forEach(exp => {
            const parsed = parseExperienceDescription(exp.description);
            
            // Differentiate work vs education based on role name keywords
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

            if (isEducation) {
                if (eduList) {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="edu-dot"></div>
                        <span class="edu-year">${exp.duration}</span>
                        <h4 class="edu-title">${exp.role}</h4>
                        <p class="edu-inst">${parsed.company}</p>
                        ${parsed.locationOrGrade ? `<span class="edu-grade">${parsed.locationOrGrade}</span>` : ''}
                    `;
                    eduList.appendChild(li);
                }
            } else {
                if (expTimeline) {
                    const item = document.createElement('div');
                    item.className = 'experience-item';
                    
                    const bulletHtml = parsed.details.length > 0
                        ? parsed.details.map(bullet => `<li>${bullet}</li>`).join('')
                        : `<li>${parsed.locationOrGrade}</li>`;

                    item.innerHTML = `
                        <div class="exp-meta">
                            <span class="exp-duration">${exp.duration}</span>
                            <h3 class="exp-company">${parsed.company}</h3>
                            <span class="exp-location"><i class="fa-solid fa-location-dot"></i> ${parsed.locationOrGrade}</span>
                        </div>
                        <div class="exp-details">
                            <h4 class="exp-role">${exp.role}</h4>
                            <ul class="exp-bullets">
                                ${bulletHtml}
                            </ul>
                        </div>
                    `;
                    expTimeline.appendChild(item);
                }
            }
        });
    } catch (error) {
        console.warn('API error fetching experiences, using static fallback/existing markup.', error);
    }
}

// Initialize theme toggle controls
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
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
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (!icon) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    if (currentTheme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        themeToggle.style.color = '#ffc107'; // Sun yellow
    } else {
        icon.className = 'fa-solid fa-moon';
        themeToggle.style.color = 'var(--text-dark)';
    }
}

// Fallback profile avatar loader
function loadFallbackAvatar(profile) {
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar && profile.avatarUrl) {
        const urls = profile.avatarUrl.split(/[,;]+/).map(u => u.trim()).filter(u => u.length > 0);
        if (urls.length > 0) {
            const randomIndex = Math.floor(Math.random() * urls.length);
            const selectedUrl = urls[randomIndex];
            if (profileAvatar.src !== selectedUrl) {
                profileAvatar.src = selectedUrl;
            }
            profileAvatar.style.display = 'block';
        }
    }
}

// Native WebSocket integration for dynamic real-time portfolio updates
function initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/portfolio`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log('WebSocket connection for real-time updates established.');
    };

    socket.onmessage = (event) => {
        const message = event.data;
        console.log('WebSocket update received:', message);
        if (message === 'profile_update') {
            loadProfile();
        } else if (message === 'experience_update') {
            loadExperiences();
        } else if (message === 'projects_update') {
            loadProjects();
        } else if (message === 'skills_update') {
            loadSkills();
        }
    };

    socket.onclose = () => {
        console.warn('WebSocket connection closed. Retrying in 5 seconds...');
        setTimeout(initWebSocket, 5000);
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket.close();
    };
}
