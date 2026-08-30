// --- FLUID NEURAL NETWORK ANIMATION ---
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let neurons = [];
const neuronCount = 50; // Slightly fewer for cleaner look
const connectionDistance = 180; // Longer connections for fluidity

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Neuron {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Slower, more organic movement
        this.vx = (Math.random() - 0.5) * 0.3; 
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 1.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        const style = getComputedStyle(document.documentElement);
        const color = style.getPropertyValue('--neuron-color').trim();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function initNeurons() {
    neurons = [];
    for (let i = 0; i < neuronCount; i++) {
        neurons.push(new Neuron());
    }
}

function animateNeurons() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const style = getComputedStyle(document.documentElement);
    const synapseColor = style.getPropertyValue('--synapse-color').trim();

    neurons.forEach(neuron => {
        neuron.update();
        neuron.draw();

        neurons.forEach(other => {
            const dx = neuron.x - other.x;
            const dy = neuron.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                const opacity = 1 - (dist / connectionDistance);
                ctx.beginPath();
                ctx.moveTo(neuron.x, neuron.y);
                ctx.lineTo(other.x, other.y);
                // Fluid line drawing
                ctx.strokeStyle = synapseColor.replace(')', `, ${opacity * 0.5})`).replace('rgba', 'rgba');
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animateNeurons);
}

// --- DARK MODE LOGIC ---
const toggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    toggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

toggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// --- PUBLICATIONS LOADER ---
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
                <div class="pub-card fade-in">
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
        
        // Re-trigger animations for new elements
        const newFaders = list.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        newFaders.forEach(f => observer.observe(f));

    } catch(e) { 
        document.getElementById('publications-list').innerHTML = '<p style="color:var(--text-muted)">Publications loading...</p>';
    }
}

// --- INITIALIZATION ---
window.addEventListener('resize', resizeCanvas);
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    initNeurons();
    animateNeurons();
    loadPublications();

    // Scroll Observer for Fade-ins
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);
    faders.forEach(fader => { appearOnScroll.observe(fader); });
});
