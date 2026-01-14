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

// GSAP Animation nur wenn Elemente existieren
const track = document.querySelector(".bts-images-track");
const btsSection = document.querySelector(".section.bts");

if (track && btsSection) {
    gsap.fromTo(track, 
        { x: 0, opacity: 1 },
        {
            x: () => -(track.scrollWidth + window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: btsSection,           // Section als Trigger
                start: "top top",              // Startet wenn Section oben am Viewport ist
                end: () => "+=" + track.scrollWidth,  // Endet nach scrollWidth Pixel Scroll
                scrub: 0.5,                   // Animation ist an Scroll gebunden (0.5 = leicht verzögert)
                pin: true,                    // Section wird "gepinnt" (bleibt während Scroll sichtbar)
                pinSpacing: true              // Fügt Platz hinzu, damit kein Sprung entsteht
            }
        }
    );
}

// Testimonials Scroll Progress
const quoteContainer = document.querySelector('.blockquote-container');
const progressBar = document.querySelector('.scroll-progress-bar');

if (quoteContainer && progressBar) {
    quoteContainer.addEventListener('scroll', () => {
        const maxScroll = quoteContainer.scrollWidth - quoteContainer.clientWidth;
        const scrollPercent = maxScroll > 0 ? quoteContainer.scrollLeft / maxScroll : 0;
        progressBar.style.transform = `translateX(${scrollPercent * 233}%)`;
    });
}

// Lightbox für Projekt-Bilder
document.querySelectorAll('.bild-von.projekt').forEach(img => {
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

// Einfache Plus-Klick Funktion
document.addEventListener('DOMContentLoaded', function() {
    var plusButtons = document.querySelectorAll('.plus');
    for (var i = 0; i < plusButtons.length; i++) {
        plusButtons[i].addEventListener('click', function() {
            var slide = this.closest('.slide');
            this.classList.toggle('active');
            if (slide) {
                slide.classList.toggle('active');
            }
        });
    }
});

// Burger Menu Toggle
document.querySelector('.burger-button').addEventListener('click', function() {
    document.querySelector('.nav-overlay').classList.toggle('active');
    document.body.classList.toggle('menu-open');
    this.classList.toggle('active');
});

// Close overlay when clicking on close icon
document.querySelector('.close-icon').addEventListener('click', function() {
    document.querySelector('.nav-overlay').classList.remove('active');
    document.body.classList.remove('menu-open');
    document.querySelector('.burger-button').classList.remove('active');
});

