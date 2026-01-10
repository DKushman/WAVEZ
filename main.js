gsap.registerPlugin(ScrollTrigger);

const track = document.querySelector(".bts-images-track");
const btsSection = document.querySelector(".section.bts");

gsap.fromTo(track, 
    { x: 0, opacity: 1 },
    {
        x: () => -(track.scrollWidth + window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: btsSection,
            start: "top top",
            end: () => "+=" + track.scrollWidth,
            scrub: 0.5,
            pin: true,
            pinSpacing: true
        }
    }
);
