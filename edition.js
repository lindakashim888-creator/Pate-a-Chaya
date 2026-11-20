(() => {
  const scenes = [
    ["sharing-table","The éclair handover","A mixed four-piece box gives each guest a flavour to try. Keep the drawer level, identify the fillings and hand it over cold.","gather"],
    ["celebration-dusk","A birthday at dusk","Book the garden by headcount. Move stackable chairs under hired cover and give the host one collection point for dessert.","gather"],
    ["family-pastries","Sunday family tea","Set small groups around moveable tables. Serve a mixed pastry plate and chaya, with a separate takeaway box for the journey home.","gather"],
    ["music-salon","An acoustic evening","Bring a small acoustic set to the studio garden. Keep tables at ground level and the service path clear. Confirm event terms before taking bookings.","gather"],
    ["long-table","The office tea table","Offer a timed group service for a team visit. Confirm headcount, tea quantities and the vegetarian and egg-containing portions in advance.","gather"],
    ["monsoon-canopy","When the rain arrives","Test shelter footprint, runoff and access on site. The lower wet-weather capacity determines the confirmed guest count.","ops"],
    ["arrival-lane","Arrival and drop-off","Use the separate exterior parcel to plan parking and handovers. Confirm boundaries, levels and the actual walking route before setting a vehicle count.","ops"],
    ["verandah-prep","The last twenty minutes","Stage covered trays, tongs, labelled boxes and tea at the verandah before guests arrive. Cold-filled pastries stay in controlled holding.","ops"],
    ["garden-reset","Reset for morning","Fold hired furniture, account for cups, remove waste and inspect the path. Record extra labour and damage against that booking.","ops"]
  ];
  const rail=document.querySelector('#scene-rail');
  const status=document.querySelector('#gallery-status');
  const filters=[...document.querySelectorAll('[data-gallery-filter]')];
  const paging=[...document.querySelectorAll('[data-rail]')];
  let current=scenes, selected=0, returnTo=null;
  const dialog=document.createElement('dialog');
  dialog.className='occasion-dialog';
  dialog.setAttribute('aria-label','Gathering concept');
  dialog.innerHTML='<div class="occasion-top"><span>Gathering concept</span><button type="button" class="occasion-close" aria-label="Close gathering image">Close</button></div><img alt=""><div class="occasion-detail"><div><h3></h3><p></p></div><div class="rail-paging"><button type="button" data-photo="-1" aria-label="Previous gathering image">‹</button><button type="button" data-photo="1" aria-label="Next gathering image">›</button></div></div>';
  document.body.append(dialog);
  function setPage() {
    paging[0].disabled=rail.scrollLeft<3;
    paging[1].disabled=rail.scrollWidth-rail.clientWidth-rail.scrollLeft<4;
  }
  function render(kind) {
    current=scenes.filter(s=>kind==='all'||s[3]===kind);
    rail.replaceChildren(...current.map(([id,title,desc],i)=>{
      const b=document.createElement('button'); b.type='button'; b.className='scene-card'; b.dataset.picture=String(i);
      b.setAttribute('aria-label','Open '+title);
      const img=new Image();img.src='/assets/cinema/'+id+'.webp';img.alt=title;img.loading='lazy';img.decoding='async';
      const cap=document.createElement('span');cap.className='scene-label';cap.textContent=title;
      const icon=document.createElement('span');icon.className='scene-plus';icon.setAttribute('aria-hidden','true');icon.textContent='+';
      cap.append(icon);b.append(img,cap);return b;
    }));
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.galleryFilter===kind)));
    rail.scrollLeft=0;status.textContent=current.length+' concept frames';requestAnimationFrame(setPage);
  }
  function showPicture(i) {
    selected=(i+current.length)%current.length;
    const [id,title,desc]=current[selected];dialog.querySelector('img').src='/assets/cinema/'+id+'.webp';dialog.querySelector('img').alt=title;
    dialog.querySelector('h3').textContent=title;dialog.querySelector('p').textContent=desc;
  }
  filters.forEach(b=>b.addEventListener('click',()=>render(b.dataset.galleryFilter)));
  paging.forEach(b=>b.addEventListener('click',()=>rail.scrollBy({left:Number(b.dataset.rail)*Math.max(220,rail.clientWidth*.72),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})));
  rail.addEventListener('scroll',setPage,{passive:true});
  rail.addEventListener('click',e=>{const card=e.target.closest('[data-picture]');if(!card)return;returnTo=card;showPicture(Number(card.dataset.picture));dialog.showModal();dialog.querySelector('.occasion-close').focus();});
  dialog.querySelector('.occasion-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>returnTo?.focus({preventScroll:true}));
  dialog.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>showPicture(selected+Number(b.dataset.photo))));
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showPicture(selected+(e.key==='ArrowRight'?1:-1));}});
  window.addEventListener('resize',setPage,{passive:true});render('all');
  document.querySelector('[data-enter-walk]').addEventListener('click',async e=>{
    const trigger=e.currentTarget;
    await customElements.whenDefined('garden-tour');const tour=document.querySelector('garden-tour');
    if(typeof tour.enterWalkthrough==='function')tour.enterWalkthrough(trigger);
    else if(typeof window.enterGardenWalk==='function')window.enterGardenWalk(trigger);
    else document.querySelector('#tour').scrollIntoView();
  });
})();

document.querySelectorAll('[data-panorama]').forEach(button => {button.addEventListener('click', () => window.openPastryPanorama?.(button.dataset.panorama, button));});
function openLinkedPanorama() {
  const scene = { '#360-courtyard': 'courtyard', '#360-bakehouse': 'bakehouse' }[location.hash];
  if (!scene || typeof window.openPastryPanorama !== 'function') return;
  const trigger = document.querySelector('[data-panorama="' + scene + '"]');
  window.openPastryPanorama(scene, trigger);
}
window.addEventListener('hashchange', openLinkedPanorama);
if (document.readyState === 'complete') openLinkedPanorama();
else window.addEventListener('load', openLinkedPanorama, { once: true });
