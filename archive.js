const archiveBase = new URL('./assets/archive/', import.meta.url);

const siteRecords = [
  ['gateway', 'The entrance', 'The mesh gate frames the garden entrance between the cottage wall and the bamboo.', 'Owner photograph'],
  ['cottage', 'The white cottage', 'The cottage faces a mature shade tree. Two steps rise to the doorway beneath the corrugated awning.', 'Owner photograph'],
  ['stilt-hut', 'The bamboo hut', 'An exterior stair reaches the raised hut among the bamboo culms.', 'Owner photograph'],
  ['shed-lane', 'The garden lane', 'A leaf-covered route passes the low shed on the left and the stair to the raised hut on the right.', 'Owner photograph'],
  ['courtyard', 'The tree courtyard', 'A low stone ring surrounds the tree in the open ground between buildings.', 'Owner photograph'],
  ['massing', 'The compound model', 'An oblique model view shows the relationship between the main roof volumes, the smaller outbuilding and the open yard.', 'Owner-supplied massing study'],
  ['elevation', 'The side elevation', 'The elevation records roof heights, openings and the exterior stair. Dimensions are unverified.', 'Owner-supplied model elevation']
];

const cssUrl = new URL('./archive.css', import.meta.url).href;
if (![...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === cssUrl)) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = cssUrl;
  document.head.append(css);
}

class SiteArchive extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    this.innerHTML = `
      <section class="sa-panel" aria-label="Original site photographs and architectural studies">
        <div class="sa-caption"><h3>Site archive</h3><span>5 photographs &nbsp;·&nbsp; 2 drawings</span></div>
        <div class="sa-strip">
          ${siteRecords.map(([slug, title, , kind], index) => `<button type="button" data-sa-frame="${index}" aria-label="View ${title.toLowerCase()}. ${kind}."><span class="sa-thumbnail${index > 4 ? ' sa-model' : ''}"><img loading="lazy" decoding="async" src="${new URL(slug+'-thumb.webp',archiveBase).href}" alt=""></span><span class="sa-label">${title}</span></button>`).join('')}
        </div>
      </section>
      <dialog class="sa-dialog" aria-label="Site archive viewer">
        <div class="sa-toolbar"><span>Site archive</span><button type="button" class="sa-close" aria-label="Close site archive">Close ×</button></div>
        <figure><div class="sa-lightbox"><img alt=""></div><figcaption aria-live="polite" aria-atomic="true"><small></small><h3></h3><p></p></figcaption></figure>
        <div class="sa-controls"><button type="button" class="sa-prev" aria-label="Previous image">← Previous</button><span class="sa-count"></span><button type="button" class="sa-next" aria-label="Next image">Next →</button></div>
      </dialog>`;
    this.viewer = this.querySelector('.sa-dialog');
    this.fullImage = this.viewer.querySelector('.sa-lightbox img');
    this.querySelectorAll('[data-sa-frame]').forEach(button => button.addEventListener('click', () => {
      this.opener = button;
      this.select(Number(button.dataset.saFrame));
      this.viewer.showModal();
      this.viewer.querySelector('.sa-close').focus();
    }));
    this.viewer.querySelector('.sa-close').addEventListener('click', () => this.viewer.close());
    this.viewer.querySelector('.sa-prev').addEventListener('click', () => this.select(this.index - 1));
    this.viewer.querySelector('.sa-next').addEventListener('click', () => this.select(this.index + 1));
    this.viewer.addEventListener('close', () => this.opener?.focus({preventScroll: true}));
    this.viewer.addEventListener('click', e => {if (e.target === this.viewer) {
      const bounds=this.viewer.getBoundingClientRect();
      if(e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) this.viewer.close();
    }});
    this.viewer.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        this.select(this.index + (e.key === 'ArrowLeft' ? -1 : 1));
      }
    });
  }
  select(index) {
    this.index = (index + siteRecords.length) % siteRecords.length;
    const [slug,title,description,kind] = siteRecords[this.index];
    this.fullImage.src = new URL(slug+'.webp',archiveBase).href;
    this.fullImage.alt = title;
    this.viewer.querySelector('small').textContent = kind;
    this.viewer.querySelector('h3').textContent = title;
    this.viewer.querySelector('p').textContent = description;
    this.viewer.querySelector('.sa-count').textContent = `${this.index + 1} / ${siteRecords.length}`;
  }
}
if (!customElements.get('site-archive')) customElements.define('site-archive', SiteArchive);
