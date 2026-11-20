(() => {
  'use strict';

  const categories = {
    Kitchen: {
      introduction: 'Six machines from the expanded bakery. Each allowance covers one unit. Freight and commissioning sit on a separate line in the opening budget.',
      section: 'Expanded study', report: 'expanded', items: [
        { image: 'oven', title: 'Four-tray convection oven', price: '₹2,94,000', basis: '1 oven · opening purchase', alt: 'A stainless glass-door oven with four trays of golden pastry.', detail: 'The UNOX allowance starts at ₹2,48,920 before tax. Trial four full 600 × 400 mm trays and check tall loaf clearance.', page: 20 },
        { image: 'sheeter', title: 'Reversible dough sheeter', price: '₹1,99,000', basis: '1 machine · opening purchase', alt: 'A countertop dough sheeter with long work surfaces on either side of the rollers.', detail: 'The RDS-520T has a 500 mm working width. The budget adds tax headroom to the ₹1,68,000 listing. Measure both wings fully open.', page: 21 },
        { image: 'proofer', title: 'Sixteen-tray proofer', price: '₹60,000', basis: '1 cabinet · opening purchase', alt: 'A narrow glazed proofing cabinet in a tiled bakery.', detail: 'The Coldshell EPO16 lists at ₹50,399 before tax. Test temperature and humidity on the upper and lower shelves with the project trays.', page: 22 },
        { image: 'chiller', title: 'Upright pastry chiller', price: '₹77,000', basis: '1 chiller · opening purchase', alt: 'A tall stainless chiller beside a shaded garden doorway.', detail: 'The Trufrost STF 600 TNM lists at ₹65,048 before tax. Check tray depth and recovery after door openings. The freezer has its own budget.', page: 22 },
        { image: 'spiral', title: 'Spiral dough mixer', price: '₹69,000', basis: '1 mixer · opening purchase', alt: 'A spiral mixer turning dough in a stainless bowl.', detail: 'The 20 L HS-20 works the bread and laminated dough. Test your smallest batch first. The allowance includes headroom on a ₹58,000 listing.', page: 23 },
        { image: 'planetary', title: 'Ten-litre planetary mixer', price: '₹41,300', basis: '1 mixer · opening purchase', alt: 'A benchtop planetary mixer with a guarded stainless bowl.', detail: 'A ₹35,000 mixer plus 18% seller-listed tax covers the choux and cream station. Ask the dealer to demonstrate the flat beater and whisk.', page: 23 }
      ]
    },
    Garden: {
      introduction: 'Purchase furniture for 24 everyday seats. A 40-person booking adds 16 hired seats. The event figures cover one booking and assume dry space already exists for the daily 24.',
      section: 'Expanded study', report: 'expanded', items: [
        { image: 'chair', title: 'Everyday garden chairs', price: '₹22,800', basis: '24 chairs × ₹950 · purchase', alt: 'A green washable garden chair on a shaded garden floor.', detail: 'The budget allows one stackable, washable chair for each seat. Test stability on the courtyard surface and check replacement stock.', page: 26 },
        { image: 'garden-tables', title: 'Four-place tables', price: '₹21,540', basis: '6 tables × ₹3,590 · purchase', alt: 'Several small garden tables under the bamboo beside the cottage.', detail: 'Six tables seat four people each. Chairs and tables together cost ₹44,340 before confirming delivery and the furniture finish.', page: 26 },
        { image: 'extra-seats', title: 'Extra event furniture', price: '₹1,360', basis: '16 chairs + 4 tables · per event', alt: 'Staff delivering stacked garden chairs and folding tables.', detail: 'Hire 16 chairs at ₹35 and four tables at ₹200. These two lines sit inside the ₹10,460 event budget, which also covers shelter, delivery and two stewards.', page: 28 },
        { image: 'canopy', title: 'Rain cover for 16', price: '₹6,000', basis: '3 modules × ₹2,000 · per event', alt: 'A hired canopy sheltering tables in the garden.', detail: 'Three nominal 100 ft² modules cover the extra seats. Add the separate setup line only once. If all 40 need cover, the full event budget rises to ₹21,960.', page: 28 }
      ]
    },
    Reuse: {
      introduction: 'The pickup pilot recovers one sound desk and one sign. Those two pieces plus ₹700 shared transport make the ₹6,000 handover allowance. A cane chair is an optional seating trial.',
      section: 'Pickup study', report: 'pickup', items: [
        { image: 'desk', title: 'The handover desk', price: '₹4,200', basis: '1 recovered frame · conversion', alt: 'A timber desk refitted with a stainless top for handing over sealed pastry boxes.', detail: 'If the owner supplies the frame free, allow ₹1,100 for sanding and repairs, ₹1,800 for the removable steel top, and two ₹650 lines for finish, fixings, feet and brackets.', page: 12 },
        { image: 'gate-sign', title: 'The collection sign', price: '₹1,100', basis: '1 existing panel · refacing', alt: 'A timber-framed collection board beside the entry gate.', detail: 'Refacing uses ₹700 and lettering uses ₹400. Pair the sign with a gate photograph in each customer’s collection instructions.', page: 12 },
        { image: 'cane', title: 'A sheltered cane chair', price: '₹650', basis: '1 chair · optional repair trial', alt: 'A refurbished cane armchair in a sheltered room.', detail: 'Check weave and joints before refinishing. A sound repaired chair saves ₹330 against the pickup study’s ₹980 new chair. Seating belongs to the optional café trial.', page: 11 }
      ]
    }
  };

  const renderItems = (category) => category.items.map(item => `
    <article class="buy-card">
      <figure><img src="/assets/catalogue/${item.image}.webp" alt="${item.alt}" loading="lazy" decoding="async" width="600" height="440"></figure>
      <h3>${item.title}</h3>
      <p class="buy-price">${item.price}</p>
      <p class="buy-basis">${item.basis}</p>
      <p class="buy-detail">${item.detail}</p>
      <a class="buy-source" href="/study/${category.report}-study.pdf#page=${item.page}" target="_blank" rel="noopener">${category.section} · p. ${item.page}<span aria-hidden="true"> ↗</span></a>
    </article>`).join('');

  let instances = 0;
  class CostCatalogue extends HTMLElement {
    connectedCallback() {
      if (this.childElementCount) return;
      const id = 'buy-' + (++instances);
      const names = Object.keys(categories);
      this.innerHTML = `<section class="buy-wrap" aria-labelledby="${id}-heading">
        <div class="buy-heading"><h2 id="${id}-heading">The buying <em>list.</em></h2>
        <p>Explore the equipment and furniture behind the plan. The images illustrate each item. Prices are November 2026 planning allowances in Indian rupees.</p></div>
        <div class="buy-tabs" role="tablist" aria-label="Catalogue categories">${names.map((name,i) => `<button type="button" role="tab" id="${id}-tab-${i}" aria-controls="${id}-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${name}</button>`).join('')}</div>
        ${names.map((name,i) => `<div class="buy-panel" role="tabpanel" tabindex="0" id="${id}-panel-${i}" aria-labelledby="${id}-tab-${i}" ${i===0?'':'hidden'}><p class="buy-context">${categories[name].introduction}</p><div class="buy-cards">${renderItems(categories[name])}</div></div>`).join('')}
      </section>`;
      const buttons = Array.from(this.querySelectorAll('[role="tab"]'));
      const panels = Array.from(this.querySelectorAll('[role="tabpanel"]'));
      function select(index, moveFocus=false) {
        buttons.forEach((button,i) => {
          button.setAttribute('aria-selected', i===index?'true':'false');
          button.tabIndex = i===index ? 0 : -1;
          panels[i].hidden = i !== index;
        });
        if (moveFocus) buttons[index].focus();
      }
      buttons.forEach((button,i) => {
        button.addEventListener('click', () => select(i));
        button.addEventListener('keydown', event => {
          const destinations = {ArrowRight:(i+1)%buttons.length, ArrowLeft:(i+buttons.length-1)%buttons.length, Home:0, End:buttons.length-1};
          if (!(event.key in destinations)) return;
          event.preventDefault();
          select(destinations[event.key],true);
        });
      });
    }
  }

  if (!customElements.get('cost-catalogue')) customElements.define('cost-catalogue', CostCatalogue);
})();
