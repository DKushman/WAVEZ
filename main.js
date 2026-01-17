// GSAP nur verwenden wenn geladen
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
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
                        invalidateOnRefresh: true
                    }
                }
            );
        }
    }
    
    // Animationen anwenden
    createScrollAnimation(".bts-images-track", ".section.bts");
    createScrollAnimation(".sneakpeak-container", ".section.sneakpeak");
    
    // Zahlen aufdecken beim Scrollen
    gsap.utils.toArray('.zahlen-number, .metric, .reveal').forEach(el => {
        gsap.fromTo(el, {y: '100%'}, {y: '0%', duration: 0.8, ease: 'power2.out', scrollTrigger: {trigger: el, start: 'top 80%'}});
    });
}

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

// Testimonials Scroll Progress + Drag-to-Scroll
const quoteContainer = document.querySelector('.blockquote-container');
const progressBar = document.querySelector('.scroll-progress-bar');

if (quoteContainer) {
    // Scroll Progress Bar Update
    if (progressBar) {
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

    // Drag-to-Scroll für Desktop
    let isDown = false;
    let startX;
    let scrollLeft;

    quoteContainer.addEventListener('mousedown', (e) => {
        // Nur wenn nicht auf einem klickbaren Element (z.B. Link, Button)
        if (e.target.closest('a, button')) return;
        
        isDown = true;
        quoteContainer.classList.add('dragging');
        startX = e.pageX - quoteContainer.offsetLeft;
        scrollLeft = quoteContainer.scrollLeft;
        e.preventDefault();
    });

    quoteContainer.addEventListener('mouseleave', () => {
        isDown = false;
        quoteContainer.classList.remove('dragging');
    });

    quoteContainer.addEventListener('mouseup', () => {
        isDown = false;
        quoteContainer.classList.remove('dragging');
    });

    quoteContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - quoteContainer.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-Geschwindigkeit anpassbar
        quoteContainer.scrollLeft = scrollLeft - walk;
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

// Submenu Toggle für Leistungen (Event Delegation - performant)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-submenu-toggle')) {
        e.preventDefault();
        const parent = e.target.closest('.nav-item-has-submenu');
        if (parent) {
            parent.classList.toggle('active');
        }
    }
});

// Close overlay when clicking on overlay itself (but not on nav-list)
if (navOverlay && burgerButton) {
    navOverlay.addEventListener('click', function(e) {
        // Nur schließen wenn Klick direkt auf Overlay (nicht auf nav-list)
        if (e.target === navOverlay) {
            navOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            burgerButton.classList.remove('active');
        }
    });
}

// FRAGEBOGEN CODE (wird immer ausgeführt, auch ohne GSAP)
const steps = document.querySelectorAll('.step');
const progress = document.querySelectorAll('.progress-step');
let current = 1;

if (steps.length > 0) {
    // Option selection
    document.querySelectorAll('.options').forEach(container => {
        const isMulti = container.classList.contains('multi');
        container.querySelectorAll('.option').forEach(btn => {
            btn.onclick = () => {
                if (!isMulti) container.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                btn.classList.toggle('selected');
                updateNav();
            };
        });
    });

    // Navigation
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.onclick = () => {
            if (current === 4) {
                // Validate step 4
                const name = document.getElementById('name');
                const email = document.getElementById('email');
                const phone = document.getElementById('phone');
                
                if (name && email && phone) {
                    if (!name.value.trim() || !email.value.trim() || !phone.value.trim()) return;
                } else if (name && email) {
                    if (!name.value.trim() || !email.value.trim()) return;
                }
            }
            goTo(current + 1);
        };
    });

    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.onclick = () => goTo(current - 1);
    });

    function goTo(n) {
        steps.forEach(s => s.classList.remove('active'));
        const nextStep = document.querySelector(`[data-step="${n}"]`);
        if (nextStep) {
            nextStep.classList.add('active');
        }
        progress.forEach((p, i) => {
            p.classList.remove('active', 'done');
            if (i < n - 1) p.classList.add('done');
            if (i === n - 1 && n <= 4) p.classList.add('active');
        });
        current = n;
        updateNav();
    }

    function updateNav() {
        const step = document.querySelector('.step.active');
        if (!step) return;
        const nextBtn = step.querySelector('.btn-next');
        if (!nextBtn) return;
        
        const stepNum = parseInt(step.dataset.step);
        let valid = false;

        if (stepNum <= 3) {
            valid = step.querySelector('.option.selected');
        } else if (stepNum === 4) {
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            
            if (name && email && phone) {
                valid = name.value.trim() && email.value.trim() && phone.value.trim();
            } else if (name && email) {
                valid = name.value.trim() && email.value.trim();
            }
        }
        nextBtn.disabled = !valid;
    }

    // Input validation for step 4
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    if (nameInput) nameInput.oninput = updateNav;
    if (emailInput) emailInput.oninput = updateNav;
    if (phoneInput) phoneInput.oninput = updateNav;
}
