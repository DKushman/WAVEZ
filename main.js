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

const track = document.querySelector(".bts-images-track");
const btsSection = document.querySelector(".section.bts");

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
