// Update Footer Year dynamically
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll Fade-In Animation & Initialize Loaders
document.addEventListener('DOMContentLoaded', () => {
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
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

    // --- DYNAMIC PUBLICATIONS LOADER ---
    loadPublications();
});

// Fetches and renders publications from the JSON file
async function loadPublications() {
    try {
        const response = await fetch('publications.json');
        const papers = await response.json();
        const container = document.getElementById('publications-list');
        const totalCitationsEl = document.getElementById('total-citations');
        
        if (!papers || papers.length === 0) {
            container.innerHTML = '<p>No publications found.</p>';
            return;
        }

        // Sort by year descending (newest first)
        papers.sort((a, b) => (b.year || 0) - (a.year || 0));

        let totalCitations = 0;
        let html = '';
        
        papers.forEach(paper => {
            totalCitations += paper.citations || 0;
            
            // Bold your name in the author list
            const authorsStr = paper.authors.map(a => {
                const name = a.name || a;
                return name.includes('Ahmed') ? `<strong>${name}</strong>` : name;
            }).join(', ');
            
            // Add DOI link if available
            const doiLink = paper.doi ? `<a href="https://doi.org/${paper.doi}" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600;">DOI ↗</a>` : '';
            
            html += `
                <div class="publication">
                    <div class="pub-title">${paper.title} <span class="badge">${paper.citations || 0} Citations</span></div>
                    <div class="pub-authors">${authorsStr} (${paper.year || 'N/A'}). ${doiLink}</div>
                    <div class="pub-venue">${paper.venue || 'Unknown Venue'}</div>
                </div>
            `;
        });

        container.innerHTML = html;
        totalCitationsEl.textContent = totalCitations;
    } catch (error) {
        console.error('Error loading publications:', error);
        document.getElementById('publications-list').innerHTML = '<p>Could not load publications. Please check if publications.json exists.</p>';
    }
}