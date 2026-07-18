const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const nav = document.querySelector(".site-nav");
const progress = document.querySelector(".scroll-progress span");

document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
});

function updateNewYorkTime() {
    const time = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(new Date());

    document.querySelectorAll("[data-ny-time]").forEach((node) => {
        node.textContent = time;
    });
}

function updateScrollUI() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    nav?.classList.toggle("scrolled", window.scrollY > 24);

    if (progress) {
        progress.style.transform = `scaleY(${ratio})`;
    }
}

updateNewYorkTime();
updateScrollUI();
setInterval(updateNewYorkTime, 30_000);
window.addEventListener("scroll", updateScrollUI, { passive: true });

const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: "-35% 0px -58% 0px", threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
    const formStatus = contactForm.querySelector("[data-form-status]");

    contactForm.addEventListener("input", (event) => {
        if (event.target.matches("input, textarea") && event.target.checkValidity()) {
            event.target.removeAttribute("aria-invalid");
        }
    });

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        contactForm.classList.add("was-validated");

        const invalidFields = [...contactForm.querySelectorAll(":invalid")];

        if (invalidFields.length) {
            invalidFields.forEach((field) => field.setAttribute("aria-invalid", "true"));
            formStatus.textContent = "Please complete the required fields before continuing.";
            formStatus.classList.add("error");
            invalidFields[0].focus();
            return;
        }

        const data = new FormData(contactForm);
        const name = String(data.get("name") || "").trim();
        const email = String(data.get("email") || "").trim();
        const company = String(data.get("company") || "").trim();
        const message = String(data.get("message") || "").trim();
        const subject = `Portfolio introduction from ${name}${company ? ` - ${company}` : ""}`;
        const bodyLines = [
            `Hi Karina,`,
            "",
            message,
            "",
            `Name: ${name}`,
            `Email: ${email}`
        ];

        if (company) {
            bodyLines.push(`Company: ${company}`);
        }

        const body = bodyLines.join("\n");

        formStatus.textContent = "Opening your email app with the message ready.";
        formStatus.classList.remove("error");
        window.location.href = `mailto:karinablanchette1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

if (finePointer && !reducedMotion) {
    const glow = document.querySelector(".cursor-glow");

    if (glow) {
        const moveWithGsap = Boolean(window.gsap);
        const moveX = moveWithGsap ? gsap.quickTo(glow, "x", { duration: 0.65, ease: "power3.out" }) : null;
        const moveY = moveWithGsap ? gsap.quickTo(glow, "y", { duration: 0.65, ease: "power3.out" }) : null;

        if (moveWithGsap) {
            gsap.set(glow, { xPercent: -50, yPercent: -50 });
        }

        window.addEventListener("pointermove", (event) => {
            glow.style.opacity = "1";

            if (moveWithGsap) {
                moveX(event.clientX);
                moveY(event.clientY);
            } else {
                glow.style.transform = `translate(${event.clientX - glow.offsetWidth / 2}px, ${event.clientY - glow.offsetHeight / 2}px)`;
            }
        }, { passive: true });
    }
}

if (window.gsap && window.ScrollTrigger && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

    intro
        .from(".site-nav", { y: -24, opacity: 0, duration: 0.8 })
        .from(".hero-meta, .eyebrow", { y: 16, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.45")
        .from(".hero-line > span", { yPercent: 112, duration: 1.1, stagger: 0.09 }, "-=0.55")
        .from(".hero-intro, .hero-stats", { y: 22, opacity: 0, duration: 0.85, stagger: 0.12 }, "-=0.65")
        .from("[data-portrait]", { clipPath: "inset(0 0 100% 0)", duration: 1.25 }, "-=1.1")
        .from(".signal-card", { y: 24, opacity: 0, duration: 0.7 }, "-=0.35");

    gsap.to(".portrait-frame img", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    document.querySelectorAll("[data-reveal]").forEach((element) => {
        if (element.closest(".hero")) return;

        gsap.from(element, {
            y: 34,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true
            }
        });
    });

    gsap.utils.toArray(".experience-item").forEach((item) => {
        gsap.fromTo(item,
            { borderColor: "rgba(226, 239, 218, 0.08)" },
            {
                borderColor: "rgba(184, 232, 117, 0.3)",
                ease: "none",
                scrollTrigger: {
                    trigger: item,
                    start: "top 68%",
                    end: "bottom 45%",
                    scrub: true
                }
            }
        );
    });

    if (finePointer) {
        document.querySelectorAll(".magnetic").forEach((element) => {
            element.addEventListener("pointermove", (event) => {
                const bounds = element.getBoundingClientRect();
                const x = event.clientX - bounds.left - bounds.width / 2;
                const y = event.clientY - bounds.top - bounds.height / 2;
                gsap.to(element, { x: x * 0.12, y: y * 0.12, duration: 0.35, ease: "power2.out" });
            });

            element.addEventListener("pointerleave", () => {
                gsap.to(element, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1, 0.35)" });
            });
        });
    }
}
