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

// Check for saved user preference or system preference
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
// --- END DARK MODE LOGIC ---

// Intersection Observer for fade-in animations
document.addEventListener('DOMContentLoaded', () => {
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

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

// Dynamic Publications Loader
async function loadPublications() {
    const container = document.getElementById('publications-list');
    
    if (!container) {
        console.warn('Publications container not found in HTML.');
        return;
    }
    
    try {
        const response = await fetch('publications.json');
        
        if (!response.ok) {
            throw new Error(`File not found (Status: ${response.status})`);
        }

        const papers = await response.json();
        
        if (!papers || papers.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 3rem;">No publications found.</p>';
            return;
        }

        // Sort by year and citations
        papers.sort((a, b) => {
            if ((b.year || 0) !== (a.year || 0)) {
                return (b.year || 0) - (a.year || 0);
            }
            return (b.citations || 0) - (a.citations || 0);
        });

        let html = '';
        
        papers.forEach((paper, index) => {
            // Bold your name
            const authorsStr = paper.authors.map(a => {
                const name = a.name || a;
                return name.toLowerCase().includes('ahmed') ? `<strong style="color: var(--text-primary);">${name}</strong>` : name;
            }).join(', ');
            
            // Determine badge class based on quartile/index
            let badgeClass = 'badge-scopus';
            const q = (paper.quartile || '').toUpperCase();
            if (q === 'Q1') badgeClass = 'badge-q1';
            else if (q === 'Q2') badgeClass = 'badge-q1'; 
            else if (q === 'Q3') badgeClass = 'badge-q3';
            else if (q.includes('SCOPUS')) badgeClass = 'badge-scopus';
            
            const quartileBadge = paper.quartile ? `<span class="badge ${badgeClass}">${paper.quartile}</span>` : '';
            const citationBadge = `<span class="badge badge-citation">${paper.citations || 0} Citations</span>`;
            
            const doiLink = paper.doi ? `<a href="https://doi.org/${paper.doi}" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600; margin-left: 0.5rem;">DOI ↗</a>` : '';
            
            html += `
                <div class="publication-card fade-in" style="animation-delay: ${index * 100}ms">
                    <div class="publication-title">${paper.title}</div>
                    <div class="publication-meta">
                        <div class="badges">
                            ${quartileBadge}
                            ${citationBadge}
                        </div>
                        ${doiLink}
                    </div>
                    <div class="publication-authors">${authorsStr} (${paper.year || 'N/A'})</div>
                    <div class="publication-venue">${paper.venue || 'Unknown Venue'}</div>
                </div>
            `;
        });

        container.innerHTML = html;
        
        // Re-trigger animations for newly injected publication cards
        const newFaders = container.querySelectorAll('.fade-in');
        const appearOptions = { threshold: 0.1 };
        const appearOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, appearOptions);
        newFaders.forEach(fader => appearOnScroll.observe(fader));
        
    } catch (error) {
        console.error('Error loading publications:', error);
        container.innerHTML = `<p style="text-align: center; color: #ef4444; padding: 3rem;">⚠️ Could not load publications. Please ensure 'publications.json' exists in the repository root.</p>`;
    }
}
