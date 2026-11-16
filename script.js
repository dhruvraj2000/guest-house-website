// ===== CONFIG — edit these =====
const WHATSAPP_NUMBER = "10000000000"; // country code + number, digits only
const GUESTHOUSE_NAME = "Your Guest House";
const U = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const ROOMS = [
  { name: "The Garden Suite", price: 120, guests: 3, bed: "King bed", size: "35 m²",
    desc: "A light-filled suite opening onto our private garden, with a lounge corner and rain shower.",
    tags: ["Garden view", "AC", "Wi-Fi", "Attached bath"], img: "photo-1631049307264-da0ec9d70304" },
  { name: "The Heritage Room", price: 95, guests: 2, bed: "Queen bed", size: "28 m²",
    desc: "Warm timber, handcrafted details and a calm palette for a restful night.",
    tags: ["Balcony", "AC", "Wi-Fi", "Attached bath"], img: "photo-1618773928121-c32242e63f39" },
  { name: "The Skyline Deluxe", price: 110, guests: 2, bed: "King bed", size: "30 m²",
    desc: "Top-floor room with floor-to-ceiling windows and sweeping city views.",
    tags: ["City view", "AC", "Smart TV", "Work desk"], img: "photo-1590490360182-c33d57733427" },
  { name: "The Family Retreat", price: 150, guests: 4, bed: "King + 2 single", size: "42 m²",
    desc: "Spacious and comfortable, ideal for families or small groups travelling together.",
    tags: ["Sleeps 4", "AC", "Wi-Fi", "Sitting area"], img: "photo-1595576508898-0ad5c879a061" },
  { name: "The Cosy Nook", price: 70, guests: 2, bed: "Double bed", size: "20 m²",
    desc: "A smart, snug room that's perfect for solo travellers and short stays.",
    tags: ["AC", "Wi-Fi", "Attached bath", "Smart TV"], img: "photo-1566665797739-1674de7a421a" },
];

const GALLERY = [
  "photo-1566073771259-6a8506099945","photo-1582719478250-c89cae4dc85b","photo-1631049307264-da0ec9d70304",
  "photo-1540518614846-7eded433c457","photo-1618773928121-c32242e63f39","photo-1571896349842-33c89424de2d",
  "photo-1590490360182-c33d57733427","photo-1551882547-ff40c63fe5fa","photo-1595576508898-0ad5c879a061",
];

const $ = (s, el = document) => el.querySelector(s);

// ===== Rooms =====
const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
$("#roomGrid").innerHTML = ROOMS.map((r, i) => `
  <article class="room reveal">
    <div class="room-img" data-src="${U(r.img, 1600)}">
      <img src="${U(r.img)}" alt="${r.name}" loading="lazy">
      <div class="room-price"><b>$${r.price}</b> / night</div>
    </div>
    <div class="room-body">
      <h3>${r.name}</h3>
      <div class="room-meta">${r.bed} · ${r.guests} guests · ${r.size}</div>
      <p>${r.desc}</p>
      <div class="tags">${r.tags.map(t => `<span>${t}</span>`).join("")}</div>
      <a class="btn" href="#book" data-room="${r.name}">Book this room</a>
    </div>
  </article>`).join("");

$("#roomSelect").innerHTML += ROOMS.map(r => `<option>${r.name}</option>`).join("");
document.querySelectorAll("[data-room]").forEach(a =>
  a.addEventListener("click", () => ($("#roomSelect").value = a.dataset.room)));

// ===== Gallery =====
$("#galleryGrid").innerHTML = GALLERY.map((id, i) =>
  `<figure class="reveal" data-src="${U(id, 1600)}"><img src="${U(id, 700)}" alt="Gallery photo ${i + 1}" loading="lazy"></figure>`).join("");

// ===== Lightbox =====
const lb = $("#lightbox"), lbImg = $("img", lb);
let items = [], idx = 0;
const show = (i) => { idx = (i + items.length) % items.length; lbImg.src = items[idx]; };
const openLb = (i) => { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); };
const closeLb = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
document.querySelectorAll("#galleryGrid figure").forEach((f, i, all) => {
  f.addEventListener("click", () => { items = [...all].map(x => x.dataset.src); openLb(i); });
});
document.querySelectorAll(".room-img").forEach(el =>
  el.addEventListener("click", () => { items = [el.dataset.src]; openLb(0); }));
$(".lb-close").onclick = closeLb;
$(".lb-prev").onclick = () => show(idx - 1);
$(".lb-next").onclick = () => show(idx + 1);
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") show(idx - 1);
  if (e.key === "ArrowRight") show(idx + 1);
});

// ===== Nav =====
const nav = $("#nav"), menu = $("#menu"), burger = $("#burger");
const onScroll = () => nav.classList.toggle("solid", scrollY > 60);
onScroll(); addEventListener("scroll", onScroll, { passive: true });
burger.onclick = () => {
  const o = menu.classList.toggle("open");
  burger.classList.toggle("open", o);
  burger.setAttribute("aria-expanded", o);
  document.body.style.overflow = o ? "hidden" : "";
};
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  menu.classList.remove("open"); burger.classList.remove("open");
  burger.setAttribute("aria-expanded", false); document.body.style.overflow = "";
}));

// ===== Loader =====
document.body.classList.add("loading");
const loader = $("#loader"), bar = $("#loaderBar");
let pct = 0;
const tick = setInterval(() => { pct = Math.min(pct + Math.random() * 12, 90); bar.style.width = pct + "%"; }, 150);
let finished = false;
const finish = () => {
  if (finished) return; finished = true;
  clearInterval(tick); bar.style.width = "100%";
  setTimeout(() => {
    loader.classList.add("done");
    document.body.classList.remove("loading");
    document.body.classList.add("ready");
  }, 450);
};
const minWait = new Promise(r => setTimeout(r, 1200));
const loaded = new Promise(r => addEventListener("load", r, { once: true }));
Promise.all([minWait, loaded]).then(finish);
setTimeout(finish, 6000); // safety net if images are slow

// On phones, hide the floating WhatsApp button while the hero booking bar is on screen
const waFloat = $("#waBtn");
const syncWa = () => waFloat.classList.toggle("hide", innerWidth <= 820 && scrollY < innerHeight * 0.7);
syncWa(); addEventListener("scroll", syncWa, { passive: true }); addEventListener("resize", syncWa);

// Back to top
const toTop = $("#toTop");
toTop.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
addEventListener("scroll", () => toTop.classList.toggle("show", scrollY > 700), { passive: true });

// ===== Hero: split-text, slideshow, parallax, progress =====
const title = $("#heroTitle");
let wi = 0;
const wrapWords = (node) => [...node.childNodes].forEach(n => {
  if (n.nodeType === 3) {
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(t => {
      if (!t.trim()) { frag.append(t); return; }
      const w = document.createElement("span"); w.className = "w";
      const s = document.createElement("span"); s.textContent = t;
      s.style.animationDelay = (0.3 + wi++ * 0.12) + "s";
      w.append(s); frag.append(w);
    });
    n.replaceWith(frag);
  } else if (n.nodeType === 1) wrapWords(n);
});
wrapWords(title);

const slides = [...document.querySelectorAll(".slide")], dots = [...document.querySelectorAll("#heroDots span")];
let cur = 0;
setInterval(() => {
  slides[cur].classList.remove("active"); dots[cur].classList.remove("on");
  cur = (cur + 1) % slides.length;
  slides[cur].classList.add("active"); dots[cur].classList.add("on");
}, 6000);

const heroSlides = $("#heroSlides"), heroContent = $("#heroContent"), heroEl = $("#home"), prog = $("#progress");
let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY, h = heroEl.offsetHeight;
    if (y < h) {
      heroSlides.style.transform = `translateY(${y * 0.3}px)`;
      heroContent.style.transform = `translateY(${y * 0.15}px)`;
      heroContent.style.opacity = Math.max(0, 1 - y / (h * 0.7));
    }
    prog.style.width = (y / (document.documentElement.scrollHeight - innerHeight) * 100) + "%";
    ticking = false;
  });
}, { passive: true });

// Hero bar -> fills booking form and scrolls to it
const heroBar = $("#heroBar");
heroBar.in.min = heroBar.out.min = new Date().toISOString().split("T")[0];
heroBar.in.addEventListener("change", () => { heroBar.out.min = heroBar.in.value; });
heroBar.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = $("#bookForm");
  f.in.value = heroBar.in.value; f.out.value = heroBar.out.value; f.guests.value = heroBar.guests.value;
  $("#book").scrollIntoView({ behavior: "smooth" });
});

// ===== Reveal on scroll =====
const io = new IntersectionObserver((entries) => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ===== Booking form -> WhatsApp =====
const form = $("#bookForm");
const today = new Date().toISOString().split("T")[0];
form.in.min = today; form.out.min = today;
form.in.addEventListener("change", () => { form.out.min = form.in.value || today; });
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  if (d.get("out") <= d.get("in")) { alert("Check-out must be after check-in."); return; }
  const msg = `Hello ${GUESTHOUSE_NAME}! I'd like to enquire about a stay.\n\n` +
    `Name: ${d.get("name")}\nCheck-in: ${d.get("in")}\nCheck-out: ${d.get("out")}\n` +
    `Guests: ${d.get("guests")}\nRoom: ${d.get("room")}` +
    (d.get("msg") ? `\nNote: ${d.get("msg")}` : "");
  window.open(waLink(msg), "_blank", "noopener");
});

// ===== Floating WhatsApp button =====
$("#waBtn").href = waLink(`Hello ${GUESTHOUSE_NAME}! I'd like to know more about availability.`);

$("#yr").textContent = new Date().getFullYear();
