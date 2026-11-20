(() => {
  const stage = document.querySelector('.threshold-stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  stage.addEventListener('pointermove', e => {
    if (reduced.matches || !finePointer.matches) return;
    const area = stage.getBoundingClientRect();
    stage.style.setProperty('--threshold-x', ((e.clientX - area.left) / area.width - .5) * 10 + 'px');
    stage.style.setProperty('--threshold-y', ((e.clientY - area.top) / area.height - .5) * 7 + 'px');
  });
  stage.addEventListener('pointerleave', () => {
    stage.style.removeProperty('--threshold-x');
    stage.style.removeProperty('--threshold-y');
  });
  function openLinkedJourney() {
    if (location.hash !== '#journey') return;
    const opener = document.querySelector('.threshold-play');
    if (typeof window.openGardenJourney === 'function') window.openGardenJourney(opener, 0);
  }
  window.addEventListener('hashchange', openLinkedJourney);
  if (document.readyState === 'complete') openLinkedJourney();
  else window.addEventListener('load', openLinkedJourney, { once: true });
})();
