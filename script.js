// Update Footer Year
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// --- DARK MODE TOGGLE LOGIC ---
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggle.textContent = '☀️';
    }
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    }
});

// --- PARTICLE GENERATOR ---
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 15; // Number of floating bubbles
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 10px and 60px
        const size = Math.random() * 50 + 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay and duration
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        
        container.appendChild(particle);
    }
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    // Intersection Observer for fade-in animations
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Load publications
    loadPublications();
});

// Dynamic Publications Loader (Same as before)
async function loadPublications() {
    const container = document.getElementById('publications-list');
    if (!container) return;
    
    try {
        const response = await fetch('publications.json');
        if (!response.ok) throw new Error(`File not found (Status: ${response.status})`);
        const papers = await response.json();
        
        if (!papers || papers.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 3rem;">No publications found.</p>';
            return;
        }

        papers.sort((a, b) => {
            if ((b.year || 0) !== (a.year || 0)) return (b.year || 0) - (a.year || 0);
            return (b.citations || 0) - (a.citations || 0);
        });

        let html = '';
        papers.forEach((paper, index) => {
            const authorsStr = paper.authors.map(a => {
                const name = a.name || a;
                return name.toLowerCase().includes('ahmed') ? `<strong style="color: var(--text-primary);">${name}</strong>` : name;
            }).join(', ');
            
            let badgeClass = 'badge-scopus';
            const q = (paper.quartile || '').toUpperCase();
            if (q === 'Q1') badgeClass = 'badge-q1';
            else if (q === 'Q3') badgeClass = 'badge-q3';
            
            const quartileBadge = paper.quartile ? `<span class="badge ${badgeClass}">${paper.quartile}</span>` : '';
            const citationBadge = `<span class="badge badge-citation">${paper.citations || 0} Citations</span>`;
            const doiLink = paper.doi ? `<a href="https://doi.org/${paper.doi}" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600; margin-left: 0.5rem;">DOI ↗</a>` : '';
            
            html += `
                <div class="publication-card fade-in" style="animation-delay: ${index * 100}ms">
                    <div class="publication-title">${paper.title}</div>
                    <div class="publication-meta">
                        <div class="badges">${quartileBadge} ${citationBadge}</div>
                        ${doiLink}
                    </div>
                    <div class="publication-authors">${authorsStr} (${paper.year || 'N/A'})</div>
                    <div class="publication-venue">${paper.venue || 'Unknown Venue'}</div>
                </div>
            `;
        });

        container.innerHTML = html;
        const newFaders = container.querySelectorAll('.fade-in');
        const appearOptions = { threshold: 0.1 };
        const appearOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, appearOptions);
        newFaders.forEach(fader => appearOnScroll.observe(fader));
        
    } catch (error) {
        console.error('Error loading publications:', error);
        container.innerHTML = `<p style="text-align: center; color: #ef4444; padding: 3rem;">⚠️ Could not load publications.</p>`;
    }
}
