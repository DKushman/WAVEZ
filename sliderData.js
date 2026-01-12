export const sliderData = (
    {
        title: "Project 1",
        img: "https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    },
    {
        title: "Project 2",
        img: "https://images.unsplash.com/photo-1610194352361-4c81a6a8967e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80"
    },
    {
        title: "Project 3",
        img: "https://images.unsplash.com/photo-1618202133208-2907bebba9e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    },
    {
        title: "Project 4",
        img: "https://images.unsplash.com/photo-1495805442109-bf1cf975750b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    },
    {
        title: "Project 5",
        img: "https://images.unsplash.com/photo-1548021682-1720ed403a5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    },
    {
        title: "Project 6",
        img: "https://images.unsplash.com/photo-1496753480864-3e588e0269b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2134&q=80"
    },
    {
        title: "Project 7",
        img: "https://images.unsplash.com/photo-1613346945084-35cccc812dd5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1759&q=80"
    },
    {
        title: "Project 8",
        img: "https://images.unsplash.com/photo-1516681100942-77d8e7f9dd97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    }
)


const config = {
    SCROLL_SPEED: 1.75,
    LERP_FACTOR: 0.05,
    MAX_VELOCITY: 150,
};
const totalSlideCount = sliderData.length;

const state = {
    currentX: 0,
    targetX: 0,
    slideWidth: 390,
    slides: [],
    isDragging: false,
    startX: 0,
    lastX: 0,
    lastMouseX: 0,
    lastScrollTime: DataTransfer.now(),
    isMoving: false,
    velocity: 0,
    lastCurrentX: 0,
    dragDistance: 0,
    hasActuallyDragged: false,
    isMobile: false,
};

function checkMobile () {
    state.isMobile = window.innerWidth < 1000;
}

function createSlideElement(index) {
    const slide = document.createElement('div');
    slide.className = 'slide';

    if (state.isMobile) {
        slide.style.width = '175px';
        slide.style.height = '250px';
    }


    const imageContainer = document.createElement('div');
    imageContainer.className = 'slide-image';

    const img = document.createElement('img');
    const dataIndex = index % totalSlideCount;
    img.src = sliderData[dataIndex].img;
    img.alt = sliderData[dataIndex].title;

    const overlay = document.createElement('div');
    overlay.className = 'slide-overlay';

    const title = document.createElement('p');
    title.className = 'project-title';
    title.textContent = sliderData[dataIndex].title;

    const arrow = document.createElement('div');
    arrow.className = 'project-arrow';
    arrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L20 12M20 12L12 20M20 12H4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    slide.addEventListener("click", (e) => {
        e.preventDefault();
        if (state.dragDistance > 10 && !state.hasActuallyDragged) {
            window.location.href = sliderData[dataIndex].url;
        }
    });

    overlay.appendChild(title);
    overlay.appendChild(arrow);
    imageContainer.appendChild(img);
    slide.appendChild(imageContainer);
    slide.appendChild(overlay);
    return slide;
}

function initializeSlides() {
    const track = document.querySelector('.slide-track');
    track.innerHTML = '';
    state.slides = [];

    checkMobile();
    state.slideWidth = state.isMobile ? 215 : 390;

    const copies = 6;
    const totalSlides = totalSlideCount * copies;

    for (let i = 0; i < totalSlides; i++) {
        const slide = createSlideElement(i);
        track.appendChild(slide);
        state.slides.push(slide);
    }

    const startOffset = -(totalSlideCount * state.slideWidth * 2);
    state.currentX = startOffset;
    state.targetX = startOffset;
}

function updateSlidesPositions () {
    const track = document.querySelector(".slide-track");
    const sequenceWidth = state.slideWidth * totalSlideCount;


    if (state.currentX > -sequenceWidth * 1) {
        state.currentX -= sequenceWidth;
        state.targetX -= sequenceWidth;
    } else if (state.currentX < -sequenceWidth * 4) {
        state.currentX += sequenceWidth;
        state.targetX += sequenceWidth;
    }

    track.style.transform = `translateX(${state.currentX}px, 0, 0)`;
}

function updateParallax () {
    const viewportCenter = window.innerWidth / 2;

    state.slides.forEach((slide) => {
        const img = slide.querySelector("img");
        if (!img) return;

        const slideRect = slide.getBoundingClientRect();

        if (slideRect.right < -500 || slideRect.left > window.innerWidth + 500) {
        return;
    }

    const slideCenter = slideRect.left + slideRect.width / 2;
    const distanceFromCenter = slideCenter - viewportCenter;
    const parallaxOffset = distanceFromCenter * -0.25;

    img.style.transform = `translateX(${parallaxOffset}px) scale (2.25)`;
});
}

function updateMovingState () {
    state.velocity = Math.abs(state.currentX - state.lastCurrentX);
    state.lastCurrentX = state.currentX;

    const isSlowEnough = state.velocity < 0.1;
    const hasBeenStillLongEnough = Date.now() - state.lastScrollTime > 200;
    state.isMoving =
    state.hasActuallyDragged || !isSlowEnough && hasBeenStillLongEnough;

    document.documentElement.style.setProperty (
        "--slider-moving",
        state.isMoving ? "1" : "0"
    );
}

function animate() {
    state.currentC += (state.targetX - state.currentX) * config.LERP_FACTOR;

    updateMovingState();
    updateSlidesPositions();
    updateParallax();

    requestAnimationFrame(animate);
}

function handleWheel (e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
}

e.preventDefault();
state.lastScrollTime = Date.now();

const scrollDelta = e.deltaY * config.SCROLL_SPEED;
state.targetX -= Math.max(
    Math.min(scrollDelta, config.MAX_VELOCITY.VELOCITY),
    -config.MAX_VELOCITY
);
}

function handleTouchstart(e) {
    state.isDragging = true;
    state.startX = e.touches[0].clientX;
    state.lastX = state.targetX;
    state.dragDistance = 0;
    state.hasActuallyDragged = false;
    state.lastScrollTime = Date.now();
}

function handleTouchmove(e) {
    if (!state.isDragging) return;

    const deltaX = (e.touches[0].clientX - state.startX) * 1.5;
    state.targetX = state.lastX + deltaX
    state.dragDistance += Math.abs(deltaX)
    
    if(state.dragDistance > 5) {
        state.hasActuallyDragged = true;
    }


    state.lastScrollTime = Date.now();
}

function handleTouchEnd() {
    state.isDragging = false;
    setTimeout(() => {
        state.hasActuallyDragged = false;
    }, 100);

}
function handleMouseDown(e) {
    e.preventDefault();
    state.isDragging = true;
    state.startX = e.clientX;
    state.lastMouseX = e.clientX;
    state.lastX = state.targetX;
    state.dragDistance = 0;
    state.hasActuallyDragged = false;
    state.lastScrollTime = Date.now();
}

function handleMouseMove(e) {
    if (!state.isDragging) return;
    e.preventDefault();
    const deltaX = (e.clientX - state.lastMouseX) * 2;
    state.targetX += deltaX;
    state.lastMouseX = e.clientX;
    state.dragDistance += Math.abs(deltaX);

    if(state.dragDistance > 5) {
        state.hasActuallyDragged = true;
    }

    state.lastScrollTime = Date.now();
}

function handleMouseUp() {
    state.isDragging = false;
    setTimeout(() => {
        state.hasActuallyDragged = false;
    }, 100);
}

function handleResize() {
    initializeSlides();
}

function initializeEventListeners() {
    const slider = document.querySelector(".slider");
    slider.addEventListener("wheel", handleWheel, { passive: false });
    slider.addEventListener("touchstart", handleTouchstart);
    slider.addEventListener("touchmove", handleTouchmove);
    slider.addEventListener("touchend", handleTouchEnd);
    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseUp);
    slider.addEventListener("dragstart" , (e) => e.preventDefault());

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);
}

function initializeSlider() {
    initializeSlides();
    initializeEventListeners();
    animate();
}

document.addEventListener("DOMContentLoaded", initializeSlider);
