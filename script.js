/**
 * Yelakala Dhilip - Developer Portfolio 2026
 * Interactive Canvas 3D Constellation, Tilt, Scroll-Spy, and EmailJS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================================================
       1. HERO 3D CONSTELLATION & CIRCUIT CANVAS
       ========================================================================== */
    const heroCanvas = document.getElementById('hero-canvas');
    const heroSection = document.getElementById('home');

    if (heroCanvas && heroSection && !prefersReducedMotion) {
        const ctx = heroCanvas.getContext('2d');
        let animationFrameId;
        let isHeroVisible = true;
        let width = 0;
        let height = 0;
        let centerX = 0;
        let centerY = 0;

        // Mouse Parallax coordinates
        let mouseX = 0;
        let mouseY = 0;
        let targetRotX = 0;
        let targetRotY = 0;
        let curRotX = 0;
        let curRotY = 0;

        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = heroSection.clientWidth;
            height = heroSection.clientHeight;
            heroCanvas.width = width * dpr;
            heroCanvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            centerX = width / 2;
            centerY = height / 2;
            initNodes();
        }

        // 3D Nodes
        const isMobile = window.innerWidth < 768;
        const nodeCount = isMobile ? 22 : 45;
        let nodes = [];

        // 3D Rotating Geometric Polyhedron (Cube / Octahedron Wireframe)
        const polyNodes = [
            { x: -70, y: -70, z: -70 },
            { x: 70, y: -70, z: -70 },
            { x: 70, y: 70, z: -70 },
            { x: -70, y: 70, z: -70 },
            { x: -70, y: -70, z: 70 },
            { x: 70, y: -70, z: 70 },
            { x: 70, y: 70, z: 70 },
            { x: -70, y: 70, z: 70 },
        ];
        const polyEdges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];
        let polyAngleX = 0;
        let polyAngleY = 0;

        function initNodes() {
            nodes = [];
            for (let i = 0; i < nodeCount; i++) {
                nodes.push({
                    x: (Math.random() - 0.5) * width * 1.2,
                    y: (Math.random() - 0.5) * height * 1.2,
                    z: (Math.random() - 0.5) * 400,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    vz: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.8 + 1.2,
                    color: Math.random() > 0.4 ? '#00e5ff' : '#6366f1'
                });
            }
        }

        // Mouse Parallax tracking
        window.addEventListener('mousemove', (e) => {
            if (!isHeroVisible) return;
            const normX = (e.clientX / window.innerWidth) - 0.5;
            const normY = (e.clientY / window.innerHeight) - 0.5;
            targetRotX = normY * 0.25;
            targetRotY = normX * 0.25;
        }, { passive: true });

        // Projection math
        const fov = 400;

        function render() {
            if (!isHeroVisible) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            // Smooth parallax interpolation
            curRotX += (targetRotX - curRotX) * 0.05;
            curRotY += (targetRotY - curRotY) * 0.05;

            // Render 3D Background Rotating Geometric Wireframe (Hardware/Digital node symbol)
            polyAngleX += 0.003;
            polyAngleY += 0.005;
            const polyCenterX = width > 992 ? width * 0.75 : width * 0.5;
            const polyCenterY = height * 0.45;

            // Project polyhedron vertices
            const projectedPoly = polyNodes.map(pt => {
                // Rotate around X
                const y1 = pt.y * Math.cos(polyAngleX + curRotX) - pt.z * Math.sin(polyAngleX + curRotX);
                const z1 = pt.y * Math.sin(polyAngleX + curRotX) + pt.z * Math.cos(polyAngleX + curRotX);
                // Rotate around Y
                const x2 = pt.x * Math.cos(polyAngleY + curRotY) + z1 * Math.sin(polyAngleY + curRotY);
                const z2 = -pt.x * Math.sin(polyAngleY + curRotY) + z1 * Math.cos(polyAngleY + curRotY);

                const scale = fov / (fov + z2 + 200);
                return {
                    px: polyCenterX + x2 * scale,
                    py: polyCenterY + y1 * scale,
                    scale: scale,
                    z: z2
                };
            });

            // Draw polyhedron edges with subtle glow
            ctx.lineWidth = 1;
            polyEdges.forEach(([start, end]) => {
                const p1 = projectedPoly[start];
                const p2 = projectedPoly[end];
                ctx.beginPath();
                ctx.moveTo(p1.px, p1.py);
                ctx.lineTo(p2.px, p2.py);
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
                ctx.stroke();
            });

            // Update & Project floating nodes
            const projectedNodes = [];
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];

                // Update position
                node.x += node.vx;
                node.y += node.vy;
                node.z += node.vz;

                // Bounds checking
                const boundX = width * 0.65;
                const boundY = height * 0.65;
                if (node.x < -boundX || node.x > boundX) node.vx *= -1;
                if (node.y < -boundY || node.y > boundY) node.vy *= -1;
                if (node.z < -200 || node.z > 200) node.vz *= -1;

                // Parallax rotation
                const xRot = node.x * Math.cos(curRotY) + node.z * Math.sin(curRotY);
                const zRot = -node.x * Math.sin(curRotY) + node.z * Math.cos(curRotY);
                const yRot = node.y * Math.cos(curRotX) - zRot * Math.sin(curRotX);
                const finalZ = node.y * Math.sin(curRotX) + zRot * Math.cos(curRotX);

                const scale = fov / (fov + finalZ + 250);
                const px = centerX + xRot * scale;
                const py = centerY + yRot * scale;

                projectedNodes.push({
                    px, py, scale,
                    radius: node.radius * scale,
                    color: node.color,
                    finalZ
                });
            }

            // Draw connecting circuit lines between nodes
            const maxDistance = isMobile ? 90 : 130;
            ctx.lineWidth = 0.8;
            for (let i = 0; i < projectedNodes.length; i++) {
                for (let j = i + 1; j < projectedNodes.length; j++) {
                    const n1 = projectedNodes[i];
                    const n2 = projectedNodes[j];
                    const dx = n1.px - n2.px;
                    const dy = n1.py - n2.py;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(n1.px, n1.py);
                        ctx.lineTo(n2.px, n2.py);
                        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            for (let i = 0; i < projectedNodes.length; i++) {
                const n = projectedNodes[i];
                if (n.px < -20 || n.px > width + 20 || n.py < -20 || n.py > height + 20) continue;

                ctx.beginPath();
                ctx.arc(n.px, n.py, Math.max(1, n.radius), 0, Math.PI * 2);
                ctx.fillStyle = n.color;
                ctx.shadowBlur = 6;
                ctx.shadowColor = n.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            animationFrameId = requestAnimationFrame(render);
        }

        // Resize handler with debounce
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeCanvas, 150);
        });

        // IntersectionObserver to pause rendering when hero is not in viewport (100% battery efficiency)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isHeroVisible = entry.isIntersecting;
            });
        }, { threshold: 0.05 });

        observer.observe(heroSection);

        // Initial launch
        resizeCanvas();
        render();
    }

    /* ==========================================================================
       2. SCROLL PROGRESS BAR & HEADER SCROLL STATE
       ========================================================================== */
    const progressBar = document.getElementById('scroll-progress');
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Update progress
        if (progressBar && docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
        }

        // Scrolled class for header
        if (header) {
            if (scrollTop > 35) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }, { passive: true });

    /* ==========================================================================
       3. NAVIGATION & ACTIVE SECTION INDICATOR (SCROLL-SPY)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // If at the very bottom, highlight contact
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            navLinks.forEach(link => link.classList.remove('active'));
            const contactLink = document.querySelector('.nav-link[href="#contact"]');
            if (contactLink) contactLink.classList.add('active');
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    /* ==========================================================================
       4. MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (isOpen) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    /* ==========================================================================
       5. 3D TILT EFFECT ON PROJECT CARDS (DESKTOP)
       ========================================================================== */
    const tiltCards = document.querySelectorAll('[data-tilt]');
    const canHover = window.matchMedia('(hover: hover)').matches;

    if (canHover && !prefersReducedMotion) {
        tiltCards.forEach(card => {
            const maxTilt = 7; // subtle and professional

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const normX = (x / rect.width) - 0.5;
                const normY = (y / rect.height) - 0.5;

                const rotateX = -normY * maxTilt;
                const rotateY = normX * maxTilt;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }

    /* ==========================================================================
       6. ROLE TYPING EFFECT
       ========================================================================== */
    const roleElement = document.getElementById('role-text');
    const roleString = "ECE Student | Full Stack Developer";

    if (roleElement && !prefersReducedMotion) {
        roleElement.textContent = "";
        let charIndex = 0;

        function typeCharacter() {
            if (charIndex < roleString.length) {
                roleElement.textContent += roleString.charAt(charIndex);
                charIndex++;
                setTimeout(typeCharacter, 60);
            }
        }

        setTimeout(typeCharacter, 400);
    }

    /* ==========================================================================
       7. SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealItems = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        revealItems.forEach(item => {
            item.style.opacity = "0";
            item.style.transform = "translateY(24px)";
            item.style.transition = "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)";
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        // Reduced motion or unsupported: show all elements directly
        revealItems.forEach(item => {
            item.style.opacity = "1";
            item.style.transform = "none";
        });
    }

    /* ==========================================================================
       8. CONTACT FORM SUBMISSION VIA EMAILJS
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nameInput = document.getElementById('from_name');
            const emailInput = document.getElementById('from_email');
            const messageInput = document.getElementById('message');

            // Basic validation
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showFeedback("Please fill in all fields before submitting.", "error");
                return;
            }

            const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            const originalText = btnText ? btnText.textContent : "Send Message";

            if (submitBtn && btnText) {
                btnText.textContent = "Sending...";
                submitBtn.disabled = true;
            }

            // EmailJS sendForm
            emailjs.sendForm(
                "service_807",
                "template_216xi8b",
                this
            )
            .then(() => {
                showFeedback("✅ Thank you! Your message has been sent successfully. I'll get back to you soon.", "success");
                contactForm.reset();
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
                showFeedback("❌ Failed to send message. Please try again or email directly at dhilipdinesh100@gmail.com", "error");
            })
            .finally(() => {
                if (submitBtn && btnText) {
                    btnText.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        });
    }

    function showFeedback(message, type) {
        if (!formFeedback) return;
        formFeedback.textContent = message;
        formFeedback.className = `form-feedback ${type}`;
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (type === 'success') {
            setTimeout(() => {
                formFeedback.className = 'form-feedback';
                formFeedback.textContent = '';
            }, 7000);
        }
    }
});