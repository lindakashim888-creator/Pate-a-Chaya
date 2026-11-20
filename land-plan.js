// Area budgets use the owner-supplied parcel areas. No cadastral geometry is supplied.
const SQFT_PER_CENT=435.6;
const gardenCents=40;
const parkingCents=21;
const parkingArea=parkingCents*SQFT_PER_CENT;
const formatArea=n=>n.toLocaleString('en-IN',{maximumFractionDigits:1});
const zones=[
  {title:'Existing buildings & service',cents:9,timing:'Opening',note:'Allow for existing footprints, production, receiving and service aprons. Measure each structure before allocating equipment.',color:'#947b62'},
  {title:'Daily terrace & counter',cents:4,timing:'Opening',note:'Keep the counter close to production. Locate the verified dry seating, accessible tables and handwash on the public route.',color:'#d47665'},
  {title:'Event lawn',cents:7,timing:'After trials',note:'Keep a movable setup for booked gatherings. Measure grass levels, anchoring points and wet access before taking deposits.',color:'#abac79'},
  {title:'Bamboo & root protection',cents:12,timing:'Retain',note:'Mark root zones before trenching. Retain the elevated hut as a ground-level view and keep service equipment out of the grove.',color:'#748c74'},
  {title:'Access, drainage & paths',cents:8,timing:'Opening',note:'Reserve the gate, guest route, on-site parking obligations, receiving access, rainwater outfalls and the step-free WC route.',color:'#c1ba9b'}
];
const seating=[
  {short:'Daily 24',title:'Six tables for daily service',area:'450 ft²',summary:'Allow 18.75 gross ft² per guest as a test assumption. Verify this much usable ground-level cover after subtracting wet edges. The daily furniture budget is ₹44,340.',ops:'Guest flow: arrival → counter → table → WC / exit. Schedule suppliers before service and use a separate return point for used crockery.'},
  {short:'Booked 40',title:'Add four tables for a booking',area:'300 ft² extra',summary:'Ring-fence the 24 regular seats. Add 16 chairs and four tables under three hired 100 ft² shelters. The baseline fixed event allowance is ₹10,460 when all 24 core places are already dry.',ops:'Use a timed guest list and keep the rain route clear. Two casual stewards handle water, table resets and clearing while the counter controls the guest queue.'},
  {short:'Full rain',title:'Cover the whole gathering',area:'800 ft² hired',summary:'If no permanent seats are confirmed dry, 40 guests require 750 gross ft² by the stated test size. Eight 100 ft² modules give 800 ft² nominal. The fixed event allowance rises to ₹21,960.',ops:'Quote freight, crew, gutters, ballast, drainage and supplier weather limits. At ₹650 net per guest the full-hire model loses ₹4,360 at 40 guests. Reprice, limit the group or reschedule.'}
];
const parkingSources='https://buildingpermit.lsgkerala.gov.in/Content/Rules/KBR2025.pdf';
class LandPlan extends HTMLElement{
  connectedCallback(){
    if(this.controller)return;
    this.controller=new AbortController();
    this.parcel='garden';this.scenario=0;this.reserve=25;this.perCar=325;
    this.innerHTML=`<div class="lp-header"><div><p class="lp-kicker">Land &amp; access</p><h3>Two parcels.<br><em>61 cents.</em></h3></div><p>The owner identifies a 40-cent compound and a separate 21-cent parcel for parking. Together they cover <strong>26,571.6 ft²</strong>. One cent equals 435.6 ft².</p></div>
    <div class="lp-tabs" role="group" aria-label="Choose an area study"><button type="button" data-plan="garden" aria-pressed="true">The garden <span>17,424 ft²</span></button><button type="button" data-plan="parking" aria-pressed="false">Outside parking <span>9,147.6 ft²</span></button></div>
    <div class="lp-panel" data-panel="garden">
      <div class="lp-panel-heading"><h4>A working land budget</h4><p>These five proposed, non-overlapping allowances add to 40 cents. The survey will establish the actual boundaries and building footprints.</p></div>
      <div class="lp-area-bar" role="img" aria-label="Proposed 40-cent allocation. Existing buildings and service 22.5%, daily terrace 10%, event lawn 17.5%, bamboo and root protection 30%, access and drainage 20%.">${zones.map(z=>`<span style="width:${z.cents/gardenCents*100}%;background:${z.color}"></span>`).join('')}</div>
      <div class="lp-zone-list">${zones.map(z=>`<details><summary><span class="lp-zone" style="--zone:${z.color}">${z.title}</span><span class="lp-size">${z.cents} cents <small>${formatArea(z.cents*SQFT_PER_CENT)} ft²</small></span><span class="lp-toggle" aria-hidden="true">+</span></summary><div class="lp-zone-content"><b>${z.timing}</b><p>${z.note}</p></div></details>`).join('')}</div>
      <div class="lp-seating"><div><p class="lp-kicker">Service footprint</p><h4>From 24 to 40 guests</h4><div class="lp-toggles" role="group" aria-label="Seating and weather scenarios">${seating.map((s,i)=>`<button type="button" data-seat="${i}" aria-pressed="${i===0}">${s.short}</button>`).join('')}</div></div><div class="lp-seat-text" aria-live="polite"></div></div>
    </div>
    <div class="lp-panel" data-panel="parking" hidden>
      <div class="lp-panel-heading"><h4>How much parking fits?</h4><p>Withhold a share for pedestrians, drop-off, drainage, staff and two-wheelers. Then allow space for each car, including aisles and turning. Change either assumption to test the arithmetic.</p></div>
      <div class="lp-parking-calc"><div class="lp-fields"><label>Outside circulation and drainage reserve <select data-reserve aria-label="Outside circulation and drainage reserve"><option value="20">20% of the parcel</option><option value="25" selected>25% of the parcel</option><option value="35">35% of the parcel</option></select></label>
      <label>Gross parking area per car <select data-unit aria-label="Gross parking area per car"><option value="275">275 ft² with aisles and turning</option><option value="325" selected>325 ft² with aisles and turning</option><option value="375">375 ft² with aisles and turning</option></select></label></div>
      <div class="lp-result" aria-live="polite"><strong data-count></strong><span>car-equivalents in this area test</span><p data-equation></p></div></div>
      <div class="lp-routes">
      <div><h5>Arrival and servicing</h5><p>Check the road width, gate swing, sightline, internal turn and step-free drop-off. Trace the walking route to the compound in person. Mark deliveries and a two-wheeler zone after measuring demand.</p></div>
      <div><h5>Monsoon operation</h5><p>Inspect surface levels and the outlet after rain. Reserve a firm, drained pedestrian route, protect root zones and keep the turning area free of standing water. Recalculate usable area where access is restricted.</p></div>
      <div><h5>Planning permission</h5><p>Under Kerala Panchayat Building Rules, Rule 29, eligible non-residential uses can count up to 75% of required ordinary parking on another same-owner plot within 200 m by motorable route, subject to a registered agreement with the Secretary. Keep accessible parking on the building plot. Confirm mixed-use classification and off-site credit with the panchayat.</p><a href="${parkingSources}" target="_blank" rel="noopener">Read Rule 29, pp. 49–52 ↗</a></div>
      </div>
      <p class="lp-note">The capacity figure is a planning sensitivity. A measured layout must establish the number of marked bays. The two model views are independent sketches. Their relative location, route and legal access are unverified.</p>
    </div>`;
    this.updateSeat();this.updateParking();
    this.addEventListener('click',e=>{
      const tab=e.target.closest('button[data-plan]');if(tab){this.setParcel(tab.dataset.plan,true);return;}
      const s=e.target.closest('button[data-seat]');if(s){this.scenario=Number(s.dataset.seat);this.updateSeat();}
    },{signal:this.controller.signal});
    this.addEventListener('change',e=>{
      if(e.target.matches('[data-reserve]'))this.reserve=Number(e.target.value);
      else if(e.target.matches('[data-unit]'))this.perCar=Number(e.target.value);else return;
      this.updateParking();
    },{signal:this.controller.signal});
    document.addEventListener('bakehouse-parcel',e=>{
      if(e.target===this.tourElement())this.setParcel(e.detail.parcel,false);
    },{signal:this.controller.signal});
    const initial=this.tourElement()?.parcel;if(initial)this.setParcel(initial,false);
  }
  disconnectedCallback(){this.controller?.abort();this.controller=null;}
  tourElement(){return this.closest('section')?.querySelector('garden-tour')||document.querySelector('garden-tour');}
  setParcel(parcel,sync){
    if(!['garden','parking'].includes(parcel))return;
    this.parcel=parcel;
    for(const el of this.querySelectorAll('[data-plan]'))el.setAttribute('aria-pressed',String(el.dataset.plan===parcel));
    for(const el of this.querySelectorAll('[data-panel]'))el.hidden=el.dataset.panel!==parcel;
    if(sync)this.tourElement()?.setParcel?.(parcel);
  }
  updateSeat(){
    const s=seating[this.scenario];
    this.querySelector('.lp-seat-text').innerHTML=`<p class="lp-area">${s.area}</p><h5>${s.title}</h5><p>${s.summary}</p><p>${s.ops}</p>`;
    for(const el of this.querySelectorAll('[data-seat]'))el.setAttribute('aria-pressed',String(Number(el.dataset.seat)===this.scenario));
  }
  updateParking(){
    const usable=parkingArea*(1-this.reserve/100),count=Math.floor(usable/this.perCar);
    this.querySelector('[data-count]').textContent=count;
    this.querySelector('[data-equation]').textContent=`${formatArea(parkingArea)} ft² − ${formatArea(parkingArea-usable)} ft² reserved = ${formatArea(usable)} ft². Divide by ${this.perCar} and round down.`;
  }
}
if(!customElements.get('land-plan'))customElements.define('land-plan',LandPlan);
