const navbar = document.querySelector('.navbar');
const nav_text = document.querySelector('.navLinks')
const nav_text2 = document.querySelector('.navLinks2')
const nav_text3 = document.querySelector('.navLinks3')
window.onscroll = () => {
    if (window.scrollY > 100) {
        navbar.classList.add('nav-active');
        nav_text.classList.add('nav_link');
        nav_text2.classList.add('nav_link');
        nav_text3.classList.add('nav_link');
    } else {
        navbar.classList.remove('nav-active');
        nav_text.classList.remove('nav_link');
        nav_text2.classList.remove('nav_link');
        nav_text3.classList.remove('nav_link');

    }
};