/* PROMOCIÓN CEC · interacciones */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Universo de estrellas (parpadeo de intensidad variable) ---------- */
  function buildStars() {
    var field = document.getElementById("starfield");
    if (!field) return;
    if (reduce) {
      /* universo estático y tenue, sin movimiento */
      var fragR = document.createDocumentFragment();
      var nr = window.innerWidth < 640 ? 60 : 120;
      for (var k = 0; k < nr; k++) {
        var d0 = document.createElement("span");
        d0.className = "star-dot";
        var sz0 = (Math.random() < 0.85 ? 1 : 2) + Math.random();
        d0.style.width = d0.style.height = sz0.toFixed(1) + "px";
        d0.style.left = (Math.random() * 100).toFixed(2) + "%";
        d0.style.top = (Math.random() * 100).toFixed(2) + "%";
        d0.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
        fragR.appendChild(d0);
      }
      field.appendChild(fragR);
      return;
    }

    var frag = document.createDocumentFragment();
    var palette = ["#ffffff", "#fdf3da", "#f7e7bd", "#e8c074", "#cfe0ff"];

    /* Capa de polvo estelar: muchos puntos finos, cada uno con su intensidad */
    var nDots = window.innerWidth < 640 ? 70 : 150;
    for (var i = 0; i < nDots; i++) {
      var s = document.createElement("span");
      s.className = "star-dot";
      var size = Math.random() < 0.8 ? (0.8 + Math.random() * 1.4) : (2 + Math.random() * 1.8);
      s.style.width = s.style.height = size.toFixed(1) + "px";
      s.style.left = (Math.random() * 100).toFixed(2) + "%";
      s.style.top = (Math.random() * 100).toFixed(2) + "%";
      s.style.color = palette[(Math.random() * palette.length) | 0];
      /* cada estrella parpadea entre su propio mínimo y máximo => intensidad distinta */
      var tmin = (Math.random() * 0.28).toFixed(2);
      var tmax = (0.55 + Math.random() * 0.45).toFixed(2);
      s.style.setProperty("--tmin", tmin);
      s.style.setProperty("--tmax", tmax);
      var twk = (1.6 + Math.random() * 5).toFixed(2);
      s.style.animationDuration = twk + "s";
      s.style.animationDelay = (-Math.random() * twk).toFixed(2) + "s";
      if (size > 2.4) { s.classList.add("bright"); s.dataset.depth = (0.4 + Math.random() * 0.6).toFixed(2); }
      else { s.dataset.depth = (0.1 + Math.random() * 0.5).toFixed(2); }
      frag.appendChild(s);
    }

    /* Unas pocas estrellas ✦ destacadas, con destello dorado */
    var nGlyph = window.innerWidth < 640 ? 6 : 12;
    var glyphs = ["✦", "✧"];
    for (var g = 0; g < nGlyph; g++) {
      var gl = document.createElement("span");
      gl.className = "star-glyph";
      gl.textContent = glyphs[(Math.random() * glyphs.length) | 0];
      gl.style.fontSize = (7 + Math.random() * 11).toFixed(1) + "px";
      gl.style.left = (Math.random() * 100).toFixed(2) + "%";
      gl.style.top = (Math.random() * 100).toFixed(2) + "%";
      gl.style.setProperty("--tmin", (0.05 + Math.random() * 0.15).toFixed(2));
      gl.style.setProperty("--tmax", (0.55 + Math.random() * 0.4).toFixed(2));
      var gtw = (2.4 + Math.random() * 4).toFixed(2);
      gl.style.animationDuration = gtw + "s";
      gl.style.animationDelay = (-Math.random() * gtw).toFixed(2) + "s";
      gl.dataset.depth = (0.3 + Math.random() * 0.7).toFixed(2);
      frag.appendChild(gl);
    }

    field.appendChild(frag);
  }

  /* ---------- Parallax suave ---------- */
  function parallax() {
    if (reduce) return;
    var stars = document.querySelectorAll(".star-dot, .star-glyph");
    var layers = document.querySelectorAll("[data-parallax]");
    var ticking = false;
    function update() {
      var y = window.scrollY || window.pageYOffset;
      for (var i = 0; i < layers.length; i++) {
        var spd = parseFloat(layers[i].getAttribute("data-parallax")) || 0.1;
        layers[i].style.transform = "translate3d(0," + (y * spd) + "px,0)";
      }
      for (var j = 0; j < stars.length; j++) {
        var d = parseFloat(stars[j].dataset.depth) || 0.4;
        stars[j].style.marginTop = (-(y * d * 0.18)) + "px";
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Reveal en scroll (check manual, robusto) ---------- */
  function reveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (reduce) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = els.length - 1; i >= 0; i--) {
        var el = els[i];
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          el.classList.add("in");
          els.splice(i, 1);
        }
      }
      if (!els.length) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    }
    var ticking = false;
    function onScroll() {
      if (!ticking) { window.requestAnimationFrame(function () { check(); ticking = false; }); ticking = true; }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
    /* fail-safe: garantiza que el contenido aparezca pase lo que pase */
    setTimeout(check, 400);
    setTimeout(function () { els.forEach(function (e) { e.classList.add("in"); }); }, 2600);
  }

  /* ---------- Cometas con estela ---------- */
  function comets() {
    var field = document.getElementById("starfield");
    if (!field || reduce) return;
    function spawn() {
      var c = document.createElement("div");
      c.className = "comet";
      c.style.top = (Math.random() * 48) + "%";
      c.style.setProperty("--dur", (1.1 + Math.random() * 0.9).toFixed(2) + "s");
      field.appendChild(c);
      setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 2400);
      schedule();
    }
    function schedule() {
      setTimeout(spawn, 6000 + Math.random() * 11000);
    }
    setTimeout(spawn, 2600);
  }

  /* ---------- Música ambiente ---------- */
  function music() {
    var audio = document.getElementById("bg-music");
    var btn = document.getElementById("music-toggle");
    if (!audio || !btn) return;
    audio.volume = 0.0;
    var KEY = "cec_music_on";
    var wanted = false;
    try { wanted = localStorage.getItem(KEY) === "1"; } catch (e) {}

    function fade(to, done) {
      var step = to > audio.volume ? 0.04 : -0.04;
      clearInterval(audio.__fade);
      audio.__fade = setInterval(function () {
        var v = audio.volume + step;
        if ((step > 0 && v >= to) || (step < 0 && v <= to)) { v = to; clearInterval(audio.__fade); if (done) done(); }
        audio.volume = Math.min(1, Math.max(0, v));
      }, 40);
    }
    function play() {
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
      fade(0.55);
      btn.classList.add("playing");
      btn.setAttribute("aria-pressed", "true");
      btn.querySelector(".mt-label").textContent = "Música";
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
    }
    function stop() {
      fade(0, function () { audio.pause(); });
      btn.classList.remove("playing");
      btn.setAttribute("aria-pressed", "false");
      btn.querySelector(".mt-label").textContent = "Música";
      try { localStorage.setItem(KEY, "0"); } catch (e) {}
    }
    btn.addEventListener("click", function () {
      if (btn.classList.contains("playing")) stop(); else play();
    });
    /* Si el usuario ya la activó antes, intentamos retomar al primer gesto (autoplay bloqueado) */
    if (wanted) {
      var resume = function () {
        play();
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
      };
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    }
  }

  function init() { buildStars(); parallax(); reveals(); comets(); music(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
