document.addEventListener("DOMContentLoaded", function () {
    new Splide("#js-splide", {
      perPage: 3,
      perMove: 1,
      arrows: false,
      focus: "center",
      padding: 0,
      height: "590px",
      cover: true,
      type: "loop",
      gap: "1em",
      breakpoints: {
        800: {
          perPage: 2,
          gap: "0.5em",
          focus: 0
        },
        600: {
          perPage: 1
        }
      }
    }).mount();
  });
  let sliderImages = document.querySelectorAll(".slide"),
  arrowLeft = document.querySelector("#arrow-left"),
  arrowRight = document.querySelector("#arrow-right"),
  current = 0;

// Clear all images
function reset() {
  for (let i = 0; i < sliderImages.length; i++) {
    sliderImages[i].style.display = "none";
  }
}

// Init slider
function startSlide() {
  reset();
  sliderImages[0].style.display = "block";
}

// Show prev
function slideLeft() {
  reset();
  sliderImages[current - 1].style.display = "block";
  current--;
}

// Show next
function slideRight() {
  reset();
  sliderImages[current + 1].style.display = "block";
  current++;
}

// Left arrow click
arrowLeft.addEventListener("click", function() {
  if (current === 0) {
    current = sliderImages.length;
  }
  slideLeft();
});

// Right arrow click
arrowRight.addEventListener("click", function() {
  if (current === sliderImages.length - 1) {
    current = -1;
  }
  slideRight();
});

startSlide();


document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    
    const innerGlow = card.querySelector('.inner-glow');
    innerGlow.style.background = `radial-gradient(
      circle at ${x}px ${y}px,
      rgba(103, 132, 255, 0.2) 0%,
      transparent 70%
    )`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    
    const innerGlow = card.querySelector('.inner-glow');
    innerGlow.style.background = `radial-gradient(
      circle at 50% 50%,
      rgba(103, 132, 255, 0.15) 0%,
      transparent 70%
    )`;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelector('.slides');
  const sliderNav = document.querySelector('.slider-nav');
  const leftArrow = document.querySelector('.slider-arrow.left');
  const rightArrow = document.querySelector('.slider-arrow.right');
  const totalSlides = document.querySelectorAll('.slide').length;
  let currentSlide = 0;

  for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      sliderNav.appendChild(dot);
  }

  const dots = document.querySelectorAll('.slider-dot');

  function showSlide(index) {
      slides.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
      });
  }

  function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
  }

  function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
  }

  dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
          currentSlide = index;
          showSlide(currentSlide);
      });
  });

  leftArrow.addEventListener('click', prevSlide);
  rightArrow.addEventListener('click', nextSlide);

  let startX, moveX;
  let isDragging = false;

  slides.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
      isDragging = true;
  });

  slides.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      moveX = e.touches[0].pageX;
      const diff = moveX - startX;
      slides.style.transform = `translateX(calc(-${currentSlide * 100}% + ${diff}px))`;
  });

  slides.addEventListener('touchend', (e) => {
      isDragging = false;
      const diff = moveX - startX;
      if (Math.abs(diff) > 100) {
          if (diff > 0) prevSlide();
          else nextSlide();
      } else {
          showSlide(currentSlide);
      }
  });

  slides.addEventListener('mousedown', (e) => {
      startX = e.pageX;
      isDragging = true;
  });

  slides.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveX = e.pageX;
      const diff = moveX - startX;
      slides.style.transform = `translateX(calc(-${currentSlide * 100}% + ${diff}px))`;
  });

  slides.addEventListener('mouseup', () => {
      isDragging = false;
      const diff = moveX - startX;
      if (Math.abs(diff) > 100) {
          if (diff > 0) prevSlide();
          else nextSlide();
      } else {
          showSlide(currentSlide);
      }
  });

  slides.addEventListener('mouseleave', () => {
      if (isDragging) {
          isDragging = false;
          showSlide(currentSlide);
      }
  });

  let autoSlideInterval = setInterval(nextSlide, 6000);

  slides.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
  });

  slides.addEventListener('mouseleave', () => {
      autoSlideInterval = setInterval(nextSlide, 6000);
  });

  const options = document.querySelectorAll('.option');
  options.forEach(option => {
      option.addEventListener('mouseenter', () => {
          option.style.transform = 'translateY(-10px) scale(1.05)';
      });
      option.addEventListener('mouseleave', () => {
          option.style.transform = 'translateY(0) scale(1)';
      });
  });
});