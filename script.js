document.documentElement.classList.add("js");

/* ---------- Pengaturan: ganti sesuai datamu ---------- */
const EMAIL_TUJUAN = "email@contoh.com";
const roles = [
  "Saya seorang pelajar teknologi",
  "Saya belajar Web Development",
  "Saya pengguna Git dan GitHub",
];

/* Tahun footer */
document.getElementById("year").textContent = new Date().getFullYear();

/* Mode gelap/terang */
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute("data-theme", theme);
  try { localStorage.setItem("theme", theme); } catch (e) {}
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}

if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  setTheme("dark");
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  setTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

/* Menu HP */
const menu = document.getElementById("menu");
const menuToggle = document.getElementById("menu-toggle");

function setMenu(open) {
  menu.classList.toggle("open", open);
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
}

menuToggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

/* Efek ketik */
const typingEl = document.getElementById("typing");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typingEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      return setTimeout(type, 1600);
    }
    return setTimeout(type, 70);
  }

  charIndex--;
  typingEl.textContent = current.slice(0, charIndex);
  if (charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    return setTimeout(type, 400);
  }
  setTimeout(type, 35);
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typingEl.textContent = roles[0];
} else {
  type();
}

/* Animasi scroll dan bar skill */
function fillBar(el) {
  el.querySelectorAll(".bar-fill").forEach((bar) => {
    bar.style.width = bar.dataset.level + "%";
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        fillBar(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* Menu aktif sesuai bagian yang dilihat */
  const navLinks = document.querySelectorAll(".menu a");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));
} else {
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.add("visible");
    fillBar(el);
  });
}

/* Form kontak (mailto, tanpa server) */
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const pesan = document.getElementById("pesan").value.trim();

  const subject = encodeURIComponent("Pesan dari " + nama);
  const body = encodeURIComponent(pesan + "\n\nNama: " + nama + "\nEmail: " + email);

  window.location.href = "mailto:" + EMAIL_TUJUAN + "?subject=" + subject + "&body=" + body;
});