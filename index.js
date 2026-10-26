// ==========================================================================
// Interactive Portfolio Engine — Jesus Martinez
// ==========================================================================

let isProgrammaticScroll = false;
let scrollAnimationId = null;

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initTypewriter();
    initScrollReveal();
    initSkillsFilter();
    initTiltAndSpotlight();
    initProfileBubbles();
    initCommandPalette();
    initCopyEmail();
    initNeuralCanvas();
});

// --------------------------------------------------------------------------
// Silky Smooth Custom Scroll Helper (60/120fps requestAnimationFrame)
// --------------------------------------------------------------------------
function smoothScrollTo(targetY, duration = 650) {
    if (scrollAnimationId) {
        cancelAnimationFrame(scrollAnimationId);
        scrollAnimationId = null;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 4) {
        window.scrollTo(0, targetY);
        return;
    }

    const startTime = performance.now();
    isProgrammaticScroll = true;
    document.body.classList.add("is-scrolling");

    function cancelOnUserInput() {
        if (scrollAnimationId) {
            cancelAnimationFrame(scrollAnimationId);
            scrollAnimationId = null;
        }
        isProgrammaticScroll = false;
        document.body.classList.remove("is-scrolling");
        cleanupListeners();
    }

    function cleanupListeners() {
        window.removeEventListener("wheel", cancelOnUserInput);
        window.removeEventListener("touchstart", cancelOnUserInput);
    }

    window.addEventListener("wheel", cancelOnUserInput, { passive: true });
    window.addEventListener("touchstart", cancelOnUserInput, { passive: true });

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease-in-out / ease-out blend for natural deceleration
        const ease = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, Math.round(startY + distance * ease));

        if (progress < 1) {
            scrollAnimationId = requestAnimationFrame(step);
        } else {
            scrollAnimationId = null;
            isProgrammaticScroll = false;
            document.body.classList.remove("is-scrolling");
            cleanupListeners();
        }
    }

    scrollAnimationId = requestAnimationFrame(step);
}

function smoothScrollToElement(selector) {
    if (!selector || selector === "#" || selector === "#home") {
        smoothScrollTo(0, 680);
        return;
    }
    const targetEl = document.querySelector(selector);
    if (!targetEl) return;

    const navbarHeight = 76;
    const targetY = Math.max(
        0,
        targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight
    );
    smoothScrollTo(targetY, 650);
}

// --------------------------------------------------------------------------
// 1. Navigation, Mobile Drawer, Active Section Observer & Scroll-To-Top
// --------------------------------------------------------------------------
function initNavigation() {
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const scrollTopBtn = document.getElementById("scroll-top-btn");
    const internalAnchors = document.querySelectorAll('a[href^="#"]');

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            const isActive = hamburger.classList.toggle("active");
            navMenu.classList.toggle("active", isActive);
            hamburger.setAttribute("aria-expanded", String(isActive));
        });
    }

    // Intercept all in-page anchor links for consistent smooth scrolling
    internalAnchors.forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const href = anchor.getAttribute("href");
            if (!href || !href.startsWith("#")) return;

            e.preventDefault();

            if (hamburger && navMenu) {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            }

            // Immediately highlight clicked nav link if applicable
            if (anchor.classList.contains("nav-link")) {
                navLinks.forEach((l) => l.classList.toggle("active", l === anchor));
            } else if (href === "#home" || anchor.id === "scroll-top-btn") {
                navLinks.forEach((l) =>
                    l.classList.toggle("active", l.getAttribute("href") === "#home")
                );
            }

            smoothScrollToElement(href);
        });
    });

    // Throttled scroll listener for navbar & back-to-top button visibility
    let scrollTicking = false;
    window.addEventListener(
        "scroll",
        () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (navbar) {
                        navbar.classList.toggle("scrolled", scrollY > 30);
                    }
                    if (scrollTopBtn) {
                        scrollTopBtn.classList.toggle("visible", scrollY > 420);
                    }
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        },
        { passive: true }
    );

    // Highlight active nav link based on visible section (paused during programmatic scroll)
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            if (isProgrammaticScroll) return;
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${id}`
                        );
                    });
                }
            });
        },
        { threshold: 0.35 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
}

// --------------------------------------------------------------------------
// 2. Hero Dynamic Role Typewriter
// --------------------------------------------------------------------------
function initTypewriter() {
    const el = document.getElementById("typewriter-text");
    if (!el) return;

    const roles = [
        "Digital Experience & AI Solutions Specialist",
        "B.S. in Software Engineering Graduate",
        "Full-Stack Application Developer",
        "AI & Digital Experience Innovator"
    ];

    let roleIndex = 0;
    let charIndex = roles[0].length;
    let isDeleting = true;

    function tick() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            charIndex--;
            el.textContent = currentRole.substring(0, charIndex);
        } else {
            charIndex++;
            el.textContent = currentRole.substring(0, charIndex);
        }

        let delay = isDeleting ? 32 : 65;

        if (!isDeleting && charIndex === currentRole.length) {
            delay = 2400;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(tick, delay);
    }

    setTimeout(tick, 2200);
}

// --------------------------------------------------------------------------
// 3. Scroll-Triggered Reveal Animations
// --------------------------------------------------------------------------
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
}

// --------------------------------------------------------------------------
// 4. Interactive Technical Skills Filter
// --------------------------------------------------------------------------
function initSkillsFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const skillCards = document.querySelectorAll(".skill-card");

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filter = btn.getAttribute("data-filter");

            filterButtons.forEach((b) => {
                const active = b === btn;
                b.classList.toggle("active", active);
                b.setAttribute("aria-selected", String(active));
            });

            skillCards.forEach((card) => {
                const categories = (card.getAttribute("data-category") || "").split(" ");
                const matches = filter === "all" || categories.includes(filter);
                card.classList.toggle("hidden", !matches);
            });
        });
    });
}

// --------------------------------------------------------------------------
// 5. 3D Perspective Card Tilt & GPU Cursor Glow Spotlight
// --------------------------------------------------------------------------
function initTiltAndSpotlight() {
    const cursorGlow = document.getElementById("cursor-glow");
    const tiltCards = document.querySelectorAll(".tilt-card");
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (!isFinePointer) {
        if (cursorGlow) cursorGlow.style.display = "none";
        return;
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let glowRafPending = false;

    window.addEventListener(
        "mousemove",
        (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!glowRafPending && cursorGlow) {
                glowRafPending = true;
                requestAnimationFrame(() => {
                    cursorGlow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
                    glowRafPending = false;
                });
            }
        },
        { passive: true }
    );

    tiltCards.forEach((card) => {
        const maxTilt = parseFloat(card.getAttribute("data-tilt-max")) || 4;
        let cardRafPending = false;
        let lastEvent = null;

        card.addEventListener("mouseenter", () => {
            card.classList.remove("is-resetting");
        });

        card.addEventListener(
            "mousemove",
            (e) => {
                if (isProgrammaticScroll) return;
                lastEvent = e;
                if (!cardRafPending) {
                    cardRafPending = true;
                    requestAnimationFrame(() => {
                        if (!lastEvent) {
                            cardRafPending = false;
                            return;
                        }
                        const rect = card.getBoundingClientRect();
                        const x = lastEvent.clientX - rect.left;
                        const y = lastEvent.clientY - rect.top;

                        card.style.setProperty("--mouse-x", `${x}px`);
                        card.style.setProperty("--mouse-y", `${y}px`);

                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = ((y - centerY) / centerY) * -maxTilt;
                        const rotateY = ((x - centerX) / centerX) * maxTilt;

                        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(
                            2
                        )}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -2px, 0)`;
                        cardRafPending = false;
                    });
                }
            },
            { passive: true }
        );

        card.addEventListener("mouseleave", () => {
            lastEvent = null;
            card.classList.add("is-resetting");
            card.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
        });
    });
}

// --------------------------------------------------------------------------
// 5b. Interactive Hero Profile Bubbles — 2-Second Speed Boost on Click
// --------------------------------------------------------------------------
function initProfileBubbles() {
    const bubbles = document.querySelectorAll(".floating-chip");
    if (!bubbles.length) return;

    bubbles.forEach((bubble) => {
        let boostTimeoutId = null;

        bubble.addEventListener("click", () => {
            bubble.classList.add("boosted");

            // Smoothly accelerate the active float animation from its current position
            if (typeof bubble.getAnimations === "function") {
                bubble.getAnimations().forEach((anim) => {
                    if (typeof anim.updatePlaybackRate === "function") {
                        anim.updatePlaybackRate(4.5);
                    } else {
                        anim.playbackRate = 4.5;
                    }
                });
            }

            if (boostTimeoutId) {
                clearTimeout(boostTimeoutId);
            }

            boostTimeoutId = setTimeout(() => {
                bubble.classList.remove("boosted");
                if (typeof bubble.getAnimations === "function") {
                    bubble.getAnimations().forEach((anim) => {
                        if (typeof anim.updatePlaybackRate === "function") {
                            anim.updatePlaybackRate(1);
                        } else {
                            anim.playbackRate = 1;
                        }
                    });
                }
                boostTimeoutId = null;
            }, 2000);
        });
    });
}

// --------------------------------------------------------------------------
// 6. Command Palette (Ctrl+K / Cmd+K)
// --------------------------------------------------------------------------
function initCommandPalette() {
    const backdrop = document.getElementById("cmd-backdrop");
    const triggerBtn = document.getElementById("cmd-trigger");
    const closeBtn = document.getElementById("cmd-close-btn");
    const input = document.getElementById("cmd-input");
    const listItems = Array.from(document.querySelectorAll(".cmd-item"));

    if (!backdrop || !input) return;

    let activeIndex = 0;

    function getVisibleItems() {
        return listItems.filter((item) => !item.classList.contains("hidden"));
    }

    function updateActiveHighlight() {
        const visible = getVisibleItems();
        listItems.forEach((item) => item.classList.remove("active"));
        if (visible.length > 0) {
            activeIndex = ((activeIndex % visible.length) + visible.length) % visible.length;
            visible[activeIndex].classList.add("active");
            visible[activeIndex].scrollIntoView({ block: "nearest" });
        }
    }

    function openPalette() {
        backdrop.classList.add("open");
        backdrop.setAttribute("aria-hidden", "false");
        input.value = "";
        listItems.forEach((item) => item.classList.remove("hidden"));
        activeIndex = 0;
        updateActiveHighlight();
        setTimeout(() => input.focus(), 50);
    }

    function closePalette() {
        backdrop.classList.remove("open");
        backdrop.setAttribute("aria-hidden", "true");
    }

    function executeItem(item) {
        if (!item) return;
        const action = item.getAttribute("data-action");
        closePalette();

        if (action === "scroll") {
            const targetSelector = item.getAttribute("data-target");
            smoothScrollToElement(targetSelector);
        } else if (action === "link") {
            const url = item.getAttribute("data-url");
            if (url) {
                window.open(url, "_blank", "noopener,noreferrer");
            }
        } else if (action === "copy-email") {
            const email = item.getAttribute("data-email");
            if (email) {
                copyToClipboard(email);
            }
        }
    }

    if (triggerBtn) triggerBtn.addEventListener("click", openPalette);
    if (closeBtn) closeBtn.addEventListener("click", closePalette);

    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closePalette();
    });

    window.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (backdrop.classList.contains("open")) {
                closePalette();
            } else {
                openPalette();
            }
            return;
        }

        if (!backdrop.classList.contains("open")) return;

        if (e.key === "Escape") {
            e.preventDefault();
            closePalette();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            activeIndex++;
            updateActiveHighlight();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            activeIndex--;
            updateActiveHighlight();
        } else if (e.key === "Enter") {
            e.preventDefault();
            const visible = getVisibleItems();
            if (visible[activeIndex]) {
                executeItem(visible[activeIndex]);
            }
        }
    });

    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        listItems.forEach((item) => {
            const text = item.textContent.toLowerCase();
            item.classList.toggle("hidden", !text.includes(query));
        });
        activeIndex = 0;
        updateActiveHighlight();
    });

    listItems.forEach((item) => {
        item.addEventListener("click", () => executeItem(item));
    });
}

// --------------------------------------------------------------------------
// 7. Copy Email & Toast Notification
// --------------------------------------------------------------------------
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied ${text} to clipboard!`);
        });
    } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast(`Copied ${text} to clipboard!`);
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-message");
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function initCopyEmail() {
    const copyBtn = document.getElementById("copy-email-btn");
    const copyText = document.getElementById("copy-text");
    if (!copyBtn) return;

    copyBtn.addEventListener("click", () => {
        const email = copyBtn.getAttribute("data-email");
        if (!email) return;

        copyToClipboard(email);
        if (copyText) {
            const original = copyText.textContent;
            copyText.textContent = "Email Copied!";
            setTimeout(() => {
                copyText.textContent = original;
            }, 2500);
        }
    });
}

// --------------------------------------------------------------------------
// 8. Interactive Neural Particle Background Canvas (Batched Rendering)
// --------------------------------------------------------------------------
function initNeuralCanvas() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener(
        "mousemove",
        (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        },
        { passive: true }
    );

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    let resizeTimer = null;
    window.addEventListener(
        "resize",
        () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
                createParticles();
            }, 120);
        },
        { passive: true }
    );

    let particles = [];

    function createParticles() {
        const count = Math.min(Math.floor((width * height) / 22000), 55);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 1.6 + 0.8
            });
        }
    }

    createParticles();

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Batch all particle circles into a single path
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (!prefersReducedMotion) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
            }

            ctx.moveTo(p.x + p.size, p.y);
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fillStyle = "rgba(56, 189, 248, 0.42)";
        ctx.fill();

        // Batch particle-to-particle lines
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < 15625) {
                    // 125px^2
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                }
            }
        }
        ctx.strokeStyle = "rgba(99, 102, 241, 0.11)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Connect nearby particles to cursor
        if (mouse.x !== null && mouse.y !== null) {
            ctx.beginPath();
            const rSq = mouse.radius * mouse.radius;
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                if (dx * dx + dy * dy < rSq) {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                }
            }
            ctx.strokeStyle = "rgba(0, 242, 254, 0.22)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        if (!prefersReducedMotion) {
            requestAnimationFrame(draw);
        }
    }

    draw();
}