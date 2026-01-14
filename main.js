gsap.registerPlugin(ScrollTrigger);

// Berlin Time
function updateBerlinTime() {
    const timeEl = document.getElementById('berlin-time');
    if (timeEl) {
        const now = new Date().toLocaleTimeString('de-DE', { 
            timeZone: 'Europe/Berlin', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        timeEl.textContent = now;
    }
}
updateBerlinTime();
setInterval(updateBerlinTime, 60000);

// Wiederverwendbare Scroll-Animation Funktion (optimized)
function createScrollAnimation(trackSelector, sectionSelector) {
    const track = document.querySelector(trackSelector);
    const section = document.querySelector(sectionSelector);
    
    if (track && section) {
        gsap.fromTo(track, 
            { x: 0, opacity: 1 },
            {
                x: () => -(track.scrollWidth + window.innerWidth),
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => "+=" + track.scrollWidth,
                    scrub: 0.5,
                    pin: section,
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true // Für responsive Layouts
                }
            }
        );
    }
}

// Animationen anwenden
createScrollAnimation(".bts-images-track", ".section.bts");
createScrollAnimation(".sneakpeak-container", ".section.sneakpeak");

// Testimonials Scroll Progress (optimized with requestAnimationFrame)
const quoteContainer = document.querySelector('.blockquote-container');
const progressBar = document.querySelector('.scroll-progress-bar');

if (quoteContainer && progressBar) {
    let ticking = false;
    quoteContainer.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const maxScroll = quoteContainer.scrollWidth - quoteContainer.clientWidth;
                const scrollPercent = maxScroll > 0 ? quoteContainer.scrollLeft / maxScroll : 0;
                progressBar.style.transform = `translateX(${scrollPercent * 233}%)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Lightbox für Projekt-Bilder (optimized - event delegation)
const projektImages = document.querySelectorAll('.bild-von.projekt');
if (projektImages.length > 0) {
    projektImages.forEach(img => {
        img.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox active';
            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt;
            lightbox.appendChild(fullImg);
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', () => {
                lightbox.remove();
            });
        });
    });
}

// Einfache Plus-Klick Funktion (optimized - no DOMContentLoaded needed)
const plusButtons = document.querySelectorAll('.plus');
if (plusButtons.length > 0) {
    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const slide = this.closest('.slide');
            this.classList.toggle('active');
            if (slide) {
                slide.classList.toggle('active');
            }
        });
    });
}

// Burger Menu Toggle (optimized - cached selectors)
const burgerButton = document.querySelector('.burger-button');
const navOverlay = document.querySelector('.nav-overlay');
const closeIcon = document.querySelector('.close-icon');

if (burgerButton && navOverlay) {
    burgerButton.addEventListener('click', function() {
        navOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        this.classList.toggle('active');
    });
}

// Close overlay when clicking on close icon
if (closeIcon && navOverlay && burgerButton) {
    closeIcon.addEventListener('click', function() {
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        burgerButton.classList.remove('active');
    });
}

