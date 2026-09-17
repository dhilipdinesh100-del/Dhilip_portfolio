// Mobile Navigation Toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// Smooth scrolling for navigation and anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else if (targetId && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }

        // Close mobile menu on link click
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = menuToggle?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    });
});

// Typing animation for Role
const text = "ECE Student | Full Stack Developer";
let i = 0;
const title = document.querySelector(".role");

if (title) {
    title.innerHTML = "";
    function typing() {
        if (i < text.length) {
            title.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, 80);
        }
    }
    window.addEventListener('DOMContentLoaded', typing);
}

// Scroll animation for elements
const revealElements = document.querySelectorAll(
    ".hero-text, .hero-image, .about-left, .about-right, .experience-card, .skill-card, .project-card, .edu-card, .sih-card, .cert-card, .contact-box, form"
);

function reveal() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(item => {
        const top = item.getBoundingClientRect().top;
        if (top < windowHeight - 80) {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
        }
    });
}

revealElements.forEach(item => {
    item.style.opacity = "0";
    item.style.transform = "translateY(35px)";
    item.style.transition = "opacity 0.8s ease, transform 0.8s ease";
});

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);
reveal();

// Contact Form submission via EmailJS
const form = document.getElementById("contact-form");

if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerText : "Send Message";

        if (submitBtn) {
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;
        }

        emailjs.sendForm(
            "service_807",
            "template_216xi8b",
            this
        )
        .then(() => {
            alert("✅ Message sent successfully!");
            form.reset();
        })
        .catch((error) => {
            alert("❌ Failed to send message. Please try again later.");
            console.error("EmailJS error:", error);
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    });
}