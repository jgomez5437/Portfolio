// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Close mobile menu when a link is clicked
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Active Navigation on Scroll (Intersection Observer)
// This highlights the nav link based on which section you are currently viewing
const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".nav-list li a");

const observerOptions = {
    threshold: 0.3 // Trigger when 30% of the section is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navLi.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href").substring(1) === entry.target.id) {
                    link.classList.add("active");
                }
            });
        }
    });
}, observerOptions);

sections.forEach((section) => {
    observer.observe(section);
});