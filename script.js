// --- NEURAL NETWORK ANIMATION ---
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let neurons = [];
const neuronCount = 60; // Number of nodes
const connectionDistance = 150; // Max distance to draw a synapse

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Neuron {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5; // Slow drift speed
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
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

        // Draw connections (synapses)
        neurons.forEach(other => {
            const dx = neuron.x - other.x;
            const dy = neuron.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                const opacity = 1 - (dist / connectionDistance);
                ctx.beginPath();
                ctx.moveTo(neuron.x, neuron.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = synapseColor.replace(')', `, ${opacity})`).replace('rgba', 'rgba');
                ctx.lineWidth = 0.5;
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
});
