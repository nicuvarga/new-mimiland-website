// Navigation enhancements
document.addEventListener('DOMContentLoaded', function () {
    // Highlight current page in nav
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Keyboard navigation for nav
    let navIndex = 0;
    document.addEventListener('keydown', (e) => {
        if (document.activeElement.closest('nav')) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                navIndex = (navIndex + 1) % navLinks.length;
                navLinks[navIndex].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navIndex = (navIndex - 1 + navLinks.length) % navLinks.length;
                navLinks[navIndex].focus();
            }
        }
    });

    // Update navIndex on focus
    navLinks.forEach((link, index) => {
        link.addEventListener('focus', () => {
            navIndex = index;
        });
    });

    // Hide Ice Rink link if not winter
    const iceRinkLink = document.querySelector('nav a[href="ice-rink.html"]');
    if (iceRinkLink && season !== 'winter') {
        iceRinkLink.parentElement.style.display = 'none';
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Fade-in animations for main content sections
    const mainSections = document.querySelectorAll('main > *');
    mainSections.forEach((section, index) => {
        section.classList.add('fade-in');
        section.style.animationDelay = `${index * 0.1}s`;
    });

    // Bounce effects on buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => button.classList.add('bounce'));
        button.addEventListener('mouseleave', () => button.classList.remove('bounce'));
        button.addEventListener('click', () => {
            button.classList.add('bounce');
            setTimeout(() => button.classList.remove('bounce'), 300);
        });
    });

    // Gallery functionality
    if (window.location.pathname.includes('gallery.html')) {
        const galleryGrid = document.getElementById('gallery-grid');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        // Default placeholder images with categories and captions
        const defaultImages = [
            { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjEyNSIgeT0iMTAwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkdhbGxlcnkgSW1hZ2UgMTwvdGV4dD48L3N2Zz4=', category: 'rides', caption: 'Exciting ride experience' },
            { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NiIvPjx0ZXh0IHg9IjEyNSIgeT0iMTAwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkdhbGxlcnkgSW1hZ2UgMjwvdGV4dD48L3N2Zz4=', category: 'events', caption: 'Fun event at New Mimiland' },
            { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NiIvPjx0ZXh0IHg9IjEyNSIgeT0iMTAwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkdhbGxlcnkgSW1hZ2UgMzwvdGV4dD48L3N2Zz4=', category: 'ice-rink', caption: 'Ice skating fun' },
            { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NiIvPjx0ZXh0IHg9IjEyNSIgeT0iMTAwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkdhbGxlcnkgSW1hZ2UgNDwvdGV4dD48L3N2Zz4=', category: 'rides', caption: 'Thrilling roller coaster' },
            { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NiIvPjx0ZXh0IHg9IjEyNSIgeT0iMTAwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkdhbGxlcnkgSW1hZ2UgNTwvdGV4dD48L3N2Zz4=', category: 'events', caption: 'Family gathering' },
            { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NiIvPjx0ZXh0IHg9IjEyNSIgeT0iMTAwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkdhbGxlcnkgSW1hZ2UgNjwvdGV4dD48L3N2Zz4=', category: 'ice-rink', caption: 'Winter skating' }
        ];

        // Load images from localStorage or use defaults
        let images = JSON.parse(localStorage.getItem('gallery_images')) || defaultImages;

        // Populate gallery
        function populateGallery(filteredImages = images) {
            galleryGrid.innerHTML = '';
            filteredImages.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'gallery-item';
                itemDiv.dataset.index = index;
                itemDiv.dataset.category = item.category;

                const img = document.createElement('img');
                img.src = item.src;
                img.loading = 'lazy'; // Lazy loading
                img.alt = item.caption;

                const caption = document.createElement('div');
                caption.className = 'gallery-caption';
                caption.textContent = item.caption;

                itemDiv.appendChild(img);
                itemDiv.appendChild(caption);
                galleryGrid.appendChild(itemDiv);
            });
        }

        populateGallery();

        // Filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                const filtered = filter === 'all' ? images : images.filter(img => img.category === filter);
                populateGallery(filtered);
            });
        });

        let currentIndex = 0;

        // Open lightbox
        galleryGrid.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                currentIndex = parseInt(item.dataset.index);
                lightboxImg.src = images[currentIndex].src;
                lightbox.style.display = 'flex';
            }
        });

        // Close lightbox
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        // Close on click outside
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });

        // Navigation
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentIndex];
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            lightboxImg.src = images[currentIndex];
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    prevBtn.click();
                } else if (e.key === 'ArrowRight') {
                    nextBtn.click();
                } else if (e.key === 'Escape') {
                    closeBtn.click();
                }
            }
        });
    }
});

// Seasonal theme loading
function getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth();
    if (month >= 0 && month <= 2) return 'winter';
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    return 'autumn';
}

const urlParams = new URLSearchParams(window.location.search);
const urlSeason = urlParams.get('season');
const season = urlSeason || localStorage.getItem('current_season') || getCurrentSeason();
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = `css/themes/${season}.css`;
document.head.appendChild(link);

// Particle effects
function isMobile() {
    return window.innerWidth < 768;
}

function getParticleClass(season) {
    const classes = {
        winter: 'snowflake',
        autumn: 'leaf',
        summer: 'sparkle',
        spring: 'blossom'
    };
    return classes[season];
}

function createParticles(season) {
    if (isMobile()) return;
    const count = Math.floor(Math.random() * 10) + 20; // 20-30 particles
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle ' + getParticleClass(season);
        const size = Math.random() * 10 + 5; // 5-15px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = '-10px';
        particle.style.opacity = Math.random() * 0.5 + 0.5; // 0.5-1
        particle.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
        particle.style.setProperty('--rotation', Math.random() * 360 + 'deg');
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's'; // 5-15s
        particle.style.animationDelay = Math.random() * 10 + 's';
        document.body.appendChild(particle);
    }
}

createParticles(season);