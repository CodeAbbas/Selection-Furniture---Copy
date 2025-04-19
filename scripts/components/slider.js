document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('.new-slide');
    const dots = document.querySelectorAll('.new-dots li');
    const nextBtn = document.querySelector('.new-next');
    const prevBtn = document.querySelector('.new-prev');
    let currentIndex = 0;

    function showSlide(index) {
        const totalSlides = slides.length;
        if (index >= totalSlides) {
            currentIndex = 0; // Loop back to the first slide
        } else if (index < 0) {
            currentIndex = totalSlides - 1; // Loop to the last slide
        }

        // Move the slides container
        document.querySelector(".new-photos").style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update active dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    nextBtn.addEventListener("click", () => {
        currentIndex++;
        showSlide(currentIndex);
    });

    prevBtn.addEventListener("click", () => {
        currentIndex--;
        showSlide(currentIndex);
    });

    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index; // Set currentIndex to the index of the clicked dot
            showSlide(currentIndex);
        });
    });

    // Auto slide every 4 seconds
    setInterval(() => {
        currentIndex++;
        showSlide(currentIndex);
    }, 4000);
});