document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery-container');
    const photoItems = document.querySelectorAll('.photo-item');

    setTimeout(() => {
        galleryContainer.style.opacity = '1';
    }, 300);

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    photoItems.forEach(item => {
        item.style.animationPlayState = 'paused';
        observer.observe(item);
    });

    photoItems.forEach(item => {
        const img = item.querySelector('img');

        img.addEventListener('load', function() {
            item.classList.add('loaded');
        });

        item.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) / 50;
                const moveY = (y - centerY) / 50;
                
                img.style.transform = `translate(${moveX}px, ${moveY}px)`;
                img.style.transition = 'transform 0.1s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            img.style.transform = 'translate(0, 0)';
            img.style.transition = 'transform 0.5s ease';
        });
    });
    
    function createGridLines() {
        const grid = document.querySelector('.gallery-grid');
        if (!grid) return;
        
        const style = document.createElement('style');
        style.textContent = `
            .gallery-grid {
                position: relative;
            }
            
            .gallery-grid::before {
                content: '';
                position: absolute;
                top: -1px;
                left: -1px;
                right: -1px;
                bottom: -1px;
                border: 1px solid #222;
                pointer-events: none;
                z-index: 1;
            }
            
            @media (max-width: 768px) {
                .gallery-grid::before {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createGridLines();
    
    function updatePhotoCounter() {
        const visiblePhotos = Array.from(photoItems).filter(item => {
            const rect = item.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom <= window.innerHeight;
        }).length;
        
    }
    
    window.addEventListener('scroll', updatePhotoCounter);
    window.addEventListener('resize', updatePhotoCounter);
    
    updatePhotoCounter();
    
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                galleryContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

document.querySelector('.scroll-top').addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector('#top');
    target.scrollIntoView({ behavior: 'smooth' });
});
