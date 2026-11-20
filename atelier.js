(() => {
  const pastry = [
    {
      name: 'Butter croissant', image: 'pastry-croissant', alt: 'A golden butter croissant on a stoneware plate',
      price: '₹155', unit: 'counter trial · per piece', intro: 'A crisp outer shell opens into a honeycomb of butter and dough. Serve the first tray with a glass of chaya while the edges still crackle.',
      notes: [['In the dough', 'Fold a pliable butter sheet into chilled dough, roll evenly and rest between turns. Cut triangles from one measured sheet.'], ['At the pass', 'Cut a sample from each trial tray. Look for a lifted centre and distinct layers. Record the saleable yield after samples and rejects.']]
    },
    {
      name: 'Pain au chocolat', image: 'pastry-chocolate', alt: 'A laminated pain au chocolat with chocolate visible at one end',
      price: '₹190', unit: 'counter trial · per piece', intro: 'Two batons of chocolate run through the same laminated dough as the plain croissant. A short rectangle gives each bite both crust and chocolate.',
      notes: [['On the bench', 'Weigh a rectangular blank and both batons, then set the rolled seam underneath. Keep one tray map for plain and one for chocolate.'], ['At the pass', 'Slice a sample through the centre. Check baton placement and the bake around the chocolate, then cool on a rack before packing.']]
    },
    {
      name: 'Mini éclair', image: 'pastry-eclair', alt: 'A single chocolate-glazed éclair with a light crumb garnish',
      price: '₹95', unit: 'counter trial · per piece', intro: 'A small choux shell carries a smooth filling. Compare cardamom and chocolate in paid tastings before committing to a second flavour.',
      notes: [['In the kitchen', 'Cook the paste, add weighed egg gradually and pipe to a guide. Bake and dry the shells before filling on the clean bench.'], ['At handover', 'Weigh the first five filled pieces. Match the box to its filling batch and allergen label. Keep filled stock in monitored chilled holding and transport.']]
    },
    {
      name: 'Butter sablé', image: 'pastry-sable', alt: 'Two round golden butter sablés from the proposed four-piece pack',
      price: '₹160', unit: 'proposed MRP · four-piece pack', intro: 'A short, buttery biscuit gives the bakery a separate retail line. The four-piece sleeve is a proposed quick-commerce trial.',
      notes: [['Into the sleeve', 'Cut to a consistent thickness, cool fully and check pack count, net weight and seals. Allow enough clearance to protect the biscuit edges.'], ['Before listing', 'Test the finished pack for moisture, breakage and shelf life. Confirm retailer terms and a positive settled margin before committing stock.']]
    }
  ];

  const entry = (title, copy) => `<div class="at-entry"><h4>${title}</h4><p>${copy}</p></div>`;
  const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
  const sourceList = links => `<div class="at-source-list">${links.join('')}</div>`;
  const chapters = [
    ['From Accra to Kerala', [
      entry('The breakfast basket', 'Pâte à Choux in Accra grouped six mini pastries in one basket, two each of plain, chocolate and cereal. A published Labone review describes a chocolate croissant with a latte and a branded supermarket shelf. For Kerala, those observations suggest two separate trials: a pastry-and-tea counter and a sealed retail pack.'),
      entry('What buyers already see', 'Observed Kochi-area butter croissant listings ranged from ₹95 to ₹130. Our ₹155 counter test sits ₹25 above the highest of those three listings. Weigh the competing portions and compare two equally timed sessions by paid sales, repeat buyers and waste.'),
      entry('The Ghana reference', 'The venue lists @pateachouxghana. The published menu and the dated Labone visit support the product comparison. Individual Instagram product posts could not be independently verified.'),
      sourceList([link('https://www.instagram.com/pateachouxghana/','Ghana Instagram profile'),link('https://static1.squarespace.com/static/61b00292c38cba0d746bd883/t/66f40fc356e08b45890be9d8/1727270947885/Pate%2Ba%2BChoux%2B%281%29.pdf','Accra menu archive'),link('https://www.accramommy.com/ganyobinaa/pte-choux/4/8/2024','Labone field review'),link('https://www.swiggy.com/city/kochi/pandhal-cafe-and-deli-edapally-rest818926','Pandhal, Edapally'),link('https://www.swiggy.com/city/kochi/the-dough-house-edapally-rest1446338','The Dough House'),link('https://www.swiggy.com/city/kochi/theobroma-kakkanad-abhilash-cottage-rest1479766','Theobroma, Kakkanad')])
    ].join('')],
    ['The bake-day schedule', [
      entry('Day before service', 'The baker mixes and chills the base dough, prepares the roll-in butter and records ingredient lots. The owner confirms orders, tray space and the number of boxes.'),
      entry('Morning production', 'Sheet, cut and proof the laminated pastries, then bake by tray position. Mix and pipe choux separately. Check the shell cavity, fill on the clean bench and transfer filled pieces to the chiller.'),
      entry('Capacity rehearsal', 'At the mature model mix, one ordinary day calls for 73 laminated pastries, 7 mini éclairs and 45 drinks. A 40-person booking adds up to 40 mini laminated pieces and 40 mini choux, with their own tray loads. Time the sheeter, proofer, oven, filling bench and pack-out at that mix.'),
      sourceList([link('https://www.unox.com/en_in/ovens/bakerlux-classic-xena-04eu-ealp/','Four-tray oven specification'),link('https://www.cacao-barry.com/en/inspiration/recipes/Classic-Chocolate-Croissants','Lamination technique')])
    ].join('')],
    ['Batch and quality standards', [
      entry('Train against one signed batch', 'File the recipe version, grams, dough condition, tray map and a cut-section photo. Ask a second baker to reproduce three trial batches. Count every reject and quality sample before calculating cost per saleable piece.'),
      entry('Release the right product', 'The baker signs off yield, product weight, batch identity, packing and chilled holding. The owner matches quantity and allergen information to the order. Use a mock recall to trace an order back to the ingredient lots.'),
      entry('Validate the date', 'Use final packaging and multiple batches in the shelf-life study. Check chilled controls for the éclair and moisture uptake, seal quality and transport damage for the sablé. The retail date follows the measured result.'),
      sourceList([link('https://fssai.gov.in/food-law/regulations/amendments/labelling-display','FSSAI label regulations'),link('https://www.fsai.ie/publications/guidance-note-18-validation-of-product-shelf-life','Shelf-life validation guide')])
    ].join('')],
    ['Delivery and garden bookings', [
      entry('Swiggy and Zomato', 'Pilot two delivery baskets at ₹380 and ₹440 before customer tax. Log rider waiting time, breakage, rejected orders, promotion costs and actual settlement for each platform. Channel availability depends on approval at the site pin.'),
      entry('Blinkit retail test', 'The four-piece biscuit sleeve needs its own barcode, shelf-life evidence, landed invoice and returns agreement. The base case carries zero Blinkit units.'),
      entry('Tea in the garden', 'The operating model tests 40 people at ₹650 each. Confirm rain cover, toilets, safe circulation and an agreed minimum booking. Name one person for arrivals, one for service and one for reset alongside the kitchen crew. Price relief and event labour into the booking.'),
      sourceList([link('https://partner.swiggy.com/food','Swiggy merchant portal'),link('https://www.zomato.com/partner-with-us','Zomato partnerships'),link('https://seller.blinkit.com/','Blinkit seller portal')])
    ].join('')]
  ];

  let sequence = 0;
  class PastryAtelier extends HTMLElement {
    connectedCallback() {
      if (this.dataset.atBuilt) return;
      this.dataset.atBuilt = 'true';
      const id = 'pastry-at-' + (++sequence);
      this.innerHTML = `<section class="at-wrap" aria-labelledby="${id}-title">
        <header class="at-heading"><h2 id="${id}-title">The pastry <i>atelier.</i></h2><p>Four pieces from the proposed Kerala counter and retail range. Choose a pastry to see how it earns its place.</p></header>
        <div class="at-tabs" role="tablist" aria-label="Explore the pastries">${pastry.map((p,i) => `<button type="button" role="tab" aria-selected="${i===0}" tabindex="${i===0?0:-1}" aria-controls="${id}-feature" id="${id}-tab-${i}">${p.name}</button>`).join('')}</div>
        <div id="${id}-feature" class="at-feature" role="tabpanel" tabindex="0"></div>
        <div class="at-study"><h3>Inside the bakehouse</h3><div class="at-chapters">${chapters.map(([title,content])=>`<details><summary>${title}<span aria-hidden="true"></span></summary><div class="at-chapter">${content}</div></details>`).join('')}</div></div>
      </section>`;
      const tabs = Array.from(this.querySelectorAll('[role="tab"]'));
      const feature = this.querySelector('[role="tabpanel"]');
      function show(i) {
        const p = pastry[i];
        tabs.forEach((tab, n) => { tab.setAttribute('aria-selected', String(n === i)); tab.tabIndex = n === i ? 0 : -1; });
        feature.setAttribute('aria-labelledby',tabs[i].id);
        feature.innerHTML = `<figure><img src="/assets/${p.image}.webp" alt="${p.alt}" loading="lazy" decoding="async"></figure><div class="at-product"><div class="at-price"><strong>${p.price}</strong><span>${p.unit}</span></div><h3>${p.name}</h3><p class="at-intro">${p.intro}</p><dl>${p.notes.map(([term,def])=>`<div><dt>${term}</dt><dd>${def}</dd></div>`).join('')}</dl></div>`;
      }
      tabs.forEach((button, i) => {
        button.addEventListener('click', () => show(i));
        button.addEventListener('keydown', event => {
          const positions = {ArrowLeft: (i+3)%4, ArrowRight: (i+1)%4, Home: 0, End: 3};
          if (!(event.key in positions)) return;
          event.preventDefault();
          const target = positions[event.key]; show(target); tabs[target].focus();
        });
      });
      show(0);
    }
  }
  if (!customElements.get('pastry-atelier')) customElements.define('pastry-atelier', PastryAtelier);
})();
