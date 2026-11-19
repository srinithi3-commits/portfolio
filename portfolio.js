/* =========================================================
   portfolio.js  |  Srinithi V Portfolio
   Features:
   1. Smooth scrolling for nav links
   2. Active nav link highlight while scrolling
   3. Scroll progress bar
   4. Typing effect for the hero subtitle
   5. Fade-in reveal animation for sections and cards
   6. Animated skill bars
   7. Floating background blobs (mouse parallax)
   8. Nav shadow on scroll
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    injectStyles();
    smoothScroll();
    activeNavLink();
    scrollProgress();
    typingEffect();
    revealOnScroll();
    animateSkillBars();
    blobParallax();
    navShadow();
});

/* ---------- Helper styles injected from JS ---------- */
function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
        html { scroll-behavior: smooth; }

        nav ul li a.active {
            color: #ff7eb3;
            border-bottom: 2px solid #ff7eb3;
            padding-bottom: 4px;
        }

        nav.scrolled { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25); }

        #scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            width: 0;
            background: linear-gradient(90deg, #ff7eb3, #7a5cff);
            z-index: 9999;
            transition: width 0.1s linear;
        }

        .reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .cursor {
            display: inline-block;
            margin-left: 2px;
            animation: blink 0.8s infinite;
        }
        @keyframes blink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

/* ---------- 1. Smooth scrolling ---------- */
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;
            e.preventDefault();
            const navHeight = document.querySelector("nav")?.offsetHeight || 0;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top, behavior: "smooth" });
        });
    });
}

/* ---------- 2. Active nav link ---------- */
function activeNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll("nav ul li a");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove("active"));
                const active = document.querySelector(`nav ul li a[href="#${entry.target.id}"]`);
                if (active) active.classList.add("active");
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(s => observer.observe(s));
}

/* ---------- 3. Scroll progress bar ---------- */
function scrollProgress() {
    const bar = document.createElement("div");
    bar.id = "scroll-progress";
    document.body.appendChild(bar);

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + "%";
    });
}

/* ---------- 4. Typing effect (hero subtitle) ---------- */
function typingEffect() {
    const el = document.querySelector(".hero .right h2");
    if (!el) return;

    const words = [
        "Student of Information Technology",
        "Aspiring Full Stack Developer",
        "Web Developer",
        "Data Analytics Enthusiast"
    ];

    el.textContent = "";
    const text = document.createElement("span");
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "|";
    el.append(text, cursor);

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
        const current = words[wordIndex];
        text.textContent = current.substring(0, charIndex);

        let delay = deleting ? 40 : 80;

        if (!deleting && charIndex === current.length) {
            delay = 1800;
            deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 400;
        }

        charIndex += deleting ? -1 : 1;
        setTimeout(type, delay);
    }
    type();
}

/* ---------- 5. Reveal on scroll ---------- */
function revealOnScroll() {
    const items = document.querySelectorAll(
        "section:not(.hero) > h2, .glass, .skill, .box, .project, .card, .certificate-group"
    );

    items.forEach((item, i) => {
        item.classList.add("reveal");
        item.style.transitionDelay = (i % 4) * 0.08 + "s";
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(item => observer.observe(item));
}

/* ---------- 6. Animated skill bars ---------- */
function animateSkillBars() {
    const bars = document.querySelectorAll(".bar span");

    bars.forEach(bar => {
        bar.dataset.width = bar.style.width;   // remember target width
        bar.style.width = "0";
        bar.style.transition = "width 1.5s ease";
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.dataset.width;
                obs.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
}

/* ---------- 7. Blob parallax ---------- */
function blobParallax() {
    const blobs = document.querySelectorAll(".blob");
    if (!blobs.length) return;

    document.addEventListener("mousemove", e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        blobs.forEach((blob, i) => {
            const speed = (i + 1) * 25;
            blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

/* ---------- 8. Nav shadow on scroll ---------- */
function navShadow() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 50);
    });
}
