function toggleMenu() {
  const nav = document.getElementById("mainNav");
  nav.classList.toggle("active");
}

document.querySelectorAll("#mainNav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("mainNav").classList.remove("active");
  });
});

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.12 });

reveals.forEach((element) => observer.observe(element));

const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.style.background = "rgba(5,8,22,.97)";
    header.style.boxShadow = "0 14px 45px rgba(0,0,0,.45)";
  } else {
    header.style.background = "rgba(5,8,22,.88)";
    header.style.boxShadow = "none";
  }
});
