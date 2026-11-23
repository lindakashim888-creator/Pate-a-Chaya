(() => {
  const select = (s) => document.querySelector(s);
  const all = (s) => Array.from(document.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compact = window.matchMedia("(max-width: 730px)");
  const menu = select("#mobile-menu");
  const links = select("#nav-links");
  function toggleMenu(open) {
    menu.setAttribute("aria-expanded", String(open));
    links.classList.toggle("open", open);
  }
  menu.addEventListener("click", () => toggleMenu(menu.getAttribute("aria-expanded") !== "true"));
  links.addEventListener("click", () => toggleMenu(false));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") { toggleMenu(false); menu.focus(); }
  });
  document.addEventListener("click", e => { if (!e.target.closest(".navbar")) toggleMenu(false); });
  compact.addEventListener("change", () => { toggleMenu(false); queueScene(); });
  const story = select(".story-layout");
  const stories = all(".story-copy article");
  const photos = all(".story-picture img");
  const sceneNav = all(".story-steps button");
  let activeScene = 0;
  let pending = false;
  function showScene(n) {
    activeScene = n;
    photos.forEach((img, i) => { img.classList.toggle("active", i === n); img.setAttribute("aria-hidden", String(i !== n)); });
    stories.forEach((el, i) => el.classList.toggle("is-current", i === n));
    sceneNav.forEach((btn, i) => btn.setAttribute("aria-pressed", String(i === n)));
    select("#story-count").textContent = "0" + (n + 1) + " / 03";
  }
  function fromScroll() {
    pending = false;
    if (!story) return;
    const r = story.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const focus = Math.min(innerHeight * .44, 350);
    let closest = 0;
    stories.forEach((s, i) => { if (s.getBoundingClientRect().top <= focus) closest = i; });
    if (closest !== activeScene) showScene(closest);
  }
  function queueScene() { if (!pending) { pending = true; requestAnimationFrame(fromScroll); } }
  sceneNav.forEach((b, i) => b.addEventListener("click", () => {
    showScene(i);
    {
      const dest = window.scrollY + stories[i].getBoundingClientRect().top - Math.min(innerHeight * .44, 350) + 8;
      window.scrollTo({top:dest, behavior:reduced.matches ? "instant" : "smooth"});
    }
  }));
  window.addEventListener("scroll", queueScene, {passive:true});
  window.addEventListener("resize", queueScene, {passive:true});
  stories.forEach((article,i) => {
    const image = document.createElement("img");
    image.className = "mobile-frame"; image.loading = "lazy"; image.decoding = "async";
    image.src = photos[i].src; image.alt = photos[i].alt; article.prepend(image);
  });
  showScene(0); queueScene();
  const nav = all(".navlinks a");
  const chapterTargets = nav.map(a => [a, select(a.hash)]).sort((a,b) => a[1].offsetTop - b[1].offsetTop);
  let navFrame = false;
  function markNav() {
    navFrame = false;
    let current = null;
    for (const [a, target] of chapterTargets) {
      const r = target.getBoundingClientRect();
      if (r.top <= innerHeight * .38 && r.bottom > innerHeight * .32) current = a;
    }
    nav.forEach(a => { if (a === current) a.setAttribute("aria-current","true"); else a.removeAttribute("aria-current"); });
  }
  window.addEventListener("scroll", () => { if (!navFrame) { navFrame = true; requestAnimationFrame(markNav); } }, {passive:true});
  const dialog = select("#media-dialog");
  const dialogContent = select("#dialog-content");
  const portraits = [["founder/dalvy", "Dalvy Joseph with his bass", "Dalvy Joseph with his bass"], ["founder/rehearsal", "Rehearsal at the cottage", "Rehearsal at the cottage"], ["founder/riders", "The riders arrive", "The riders arrive"], ["founder/studio", "Between takes in the tea room", "Between takes in the tea room"], ["founder/drummers", "Chaya after rehearsal", "Chaya after rehearsal"], ["founder/duet", "The courtyard duet", "The courtyard duet"], ["founder/setlist", "Choosing the next song", "Choosing the next song"], ["founder/bamboo", "Dancing under the bamboo", "Dancing under the bamboo"],["founder/boots","A guitarist wearing leather boots beside a pedal","Keeping time"]];
  let portraitIndex = 0;
  let opener;
  function openViewer(title, button) {
    opener = button; select("#dialog-title").textContent = title;
    if (!dialog.open) dialog.showModal();
    select(".dialog-close").focus();
  }
  function renderPortrait() {
    const image = dialogContent.querySelector("img");
    image.src = "/assets/" + portraits[portraitIndex][0] + ".webp";
    image.alt = portraits[portraitIndex][1];
    dialogContent.querySelector(".portrait-caption").textContent = (portraitIndex+1) + " / " + portraits.length + " · " + portraits[portraitIndex][2];
  }
  document.querySelectorAll("[data-archive-founder]").forEach(button => button.addEventListener("click", (e) => {
    portraitIndex = Number(button.dataset.archiveFounder);
    dialogContent.innerHTML = '<div class="portrait-view"><img alt=""></div><div class="portrait-nav"><button type="button" aria-label="Previous portrait" data-portrait="-1">←</button><span class="portrait-caption" aria-live="polite"></span><button type="button" aria-label="Next portrait" data-portrait="1">→</button></div>';
    renderPortrait(); openViewer("Studio Illusions · The courtyard", e.currentTarget);
  }));
  function nextPortrait(step) { portraitIndex = (portraitIndex + step + portraits.length) % portraits.length; renderPortrait(); }
  dialogContent.addEventListener("click", e => { const b = e.target.closest("[data-portrait]"); if (b) nextPortrait(Number(b.dataset.portrait)); });
  dialog.addEventListener("keydown", e => { if (dialogContent.querySelector(".portrait-nav") && ["ArrowLeft","ArrowRight"].includes(e.key)) { e.preventDefault(); nextPortrait(e.key === "ArrowLeft" ? -1 : 1); } });
  select("[data-film]").addEventListener("click", e => {
    dialogContent.innerHTML = '<video controls playsinline preload="metadata" poster="/assets/investor-film.webp" aria-label="Silent garden concept film"><source src="/assets/investor-film.mp4" type="video/mp4"><track kind="captions" srclang="en" label="Scene descriptions" src="/assets/investor-film.vtt"></video><p>Silent film. An original site photograph opens the sequence. The following frames illustrate the proposed pastries, packaging and gatherings. English scene captions are available.</p>';
    openViewer("A pastry garden · The film", e.currentTarget);
    const attempt = dialogContent.querySelector("video").play(); if (attempt?.catch) attempt.catch(() => {});
  });
  select(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", e => {
    if (e.target !== dialog) return;
    const b = dialog.getBoundingClientRect();
    if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    dialogContent.querySelector("video")?.pause(); dialogContent.replaceChildren(); opener?.focus({preventScroll:true});
  });
})();
