// Particle Generator
function createParticles() {
    const container = document.getElementById('particles');
    for(let i=0; i<20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.width = p.style.height = (Math.random() * 20 + 5) + 'px';
        p.style.animationDuration = (Math.random() * 10 + 10) + 's';
        p.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(p);
    }
}

// Dark Mode Logic
const toggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');
if(currentTheme) document.documentElement.setAttribute('data-theme', currentTheme);

toggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if(theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        toggle.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        toggle.textContent = '☀️';
    }
});

// Load Publications from JSON
async function loadPublications() {
    try {
        const res = await fetch('publications.json');
        const data = await res.json();
        const list = document.getElementById('publications-list');
        let html = '';
        
        data.forEach(pub => {
            const badge = pub.quartile === 'Q1' ? '<span class="badge badge-q1">Q1 Journal</span>' : 
                          pub.quartile ? `<span class="badge badge-cite">${pub.quartile}</span>` : '';
            
            html += `
                <div class="pub-card">
                    <div class="pub-title">${pub.title}</div>
                    <div class="pub-meta">
                        ${badge}
                        <span class="badge badge-cite">${pub.citations} Citations</span>
                        <br>${pub.authors.join(', ')} (${pub.year})
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;
    } catch(e) { console.log('Loading local data...'); }
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    loadPublications();
});
