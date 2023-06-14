const navbar = document.querySelector('.navbar');
const nav_text = document.querySelector('.navLinks')
const nav_text2 = document.querySelector('.navLinks2')
const nav_text3 = document.querySelector('.navLinks3')
const menu_icon = document.querySelector('#menuIcon')

window.onscroll = () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-active');
        nav_text.classList.add('nav_link');
        nav_text2.classList.add('nav_link');
        nav_text3.classList.add('nav_link');
        menu_icon.src = "pictures/menu.png"
    } else {
        navbar.classList.remove('nav-active');
        nav_text.classList.remove('nav_link');
        nav_text2.classList.remove('nav_link');
        nav_text3.classList.remove('nav_link');
        menu_icon.src = "pictures/menu-4-512.png"

    }
};