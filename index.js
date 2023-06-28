const navbar = document.querySelector('.navbar');
const nav_text = document.querySelector('.navLinks')
const nav_text2 = document.querySelector('.navLinks2')
const nav_text3 = document.querySelector('.navLinks3')
const menu_icon = document.querySelector('#menuIcon')
const menu_background = document.querySelector('.nav1')


window.onscroll = () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-active');
        nav_text.classList.add('nav_link');
        nav_text2.classList.add('nav_link');
        nav_text3.classList.add('nav_link');
        menu_icon.src = "pictures/menu.png"
        menu_background.classList.add('.nav_menu_color')
    } else {
        navbar.classList.remove('nav-active');
        nav_text.classList.remove('nav_link');
        nav_text2.classList.remove('nav_link');
        nav_text3.classList.remove('nav_link');
        menu_icon.src = "pictures/menu-4-512.png"
        menu_background.classList.remove('.nav_menu_color')


    }
};

function isMobileView() {
        if (window.scrollY > 50) {
            return true
        }
    }
  
  // Change the background color of the element based on the viewport width
  function changeBackgroundColor() {
    var element = document.querySelector(".nav1");
  
    if (isMobileView()) {
      element.style.backgroundColor = "#535353"; // Change to your desired color
    } else {
      element.style.backgroundColor = "rgb(43, 18, 151)"; // Change to your desired color
    }
  }
  
  // Call the function initially and whenever the viewport changes
  changeBackgroundColor();
  window.addEventListener("scroll", changeBackgroundColor);