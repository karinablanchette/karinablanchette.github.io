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
                const active = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("active", active);
                if (active) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
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
            formStatus.textContent = `Please check ${invalidFields[0].labels[0].textContent.trim().replace(' *', '')}: ${invalidFields[0].validationMessage}`;
            invalidFields.forEach((field) => field.setAttribute("aria-describedby", "form-status"));
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

// Keep content visible at first paint; subtle motion must never gate reading.
