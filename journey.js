(() => {
  'use strict';
  if (window.openGardenJourney) return;

  const CHAPTERS = [
    {name:'The gate', caption:'The mesh gate swings open beneath the bamboo.', film:'/assets/journey/gate.mp4', audio:true, image:'/assets/journey/gate-still.webp', backup:'/assets/cinema/garden-daybreak.webp', stop:0, options:{gateOpen:true}},
    {name:'The bake', caption:'The baker pulls a tray of golden éclair shells from the oven.', film:'/assets/journey/bake.mp4', audio:true, image:'/assets/journey/bake-still.webp', backup:'/assets/scene-oven.webp', stop:3, options:{gateOpen:true}},
    {name:'The table', caption:'At dusk, the first cup passes across the table.', film:'/assets/journey/table.mp4', audio:true, image:'/assets/journey/table-still.webp', backup:'/assets/cinema/celebration-dusk.webp', stop:4, options:{gateOpen:true,dusk:true,event:true}}
  ];
  const LENGTH = 6000;
  const icon = name => {
    const paths={muted:'<path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 6m0-6-5 6"/>',audible:'<path d="M3 9h4l5-4v14l-5-4H3zM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',back:'<path d="m14.5 5-7 7 7 7M8 12h13"/>',next:'<path d="m9 5 7 7-7 7"/>',previous:'<path d="m15 5-7 7 7 7"/>',play:'<path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5v14m8-14v14" stroke-width="3.5"/>',explore:'<path d="M5 18 18 5M6 5h12v12"/>',replay:'<path d="M4 11a8 8 0 1 1 1.8 6.1M4 4v7h7"/>'};
    return '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+paths[name]+'</svg>';
  };
  const parseIndex = n => Number.isInteger(Number(n)) && Number(n)>=0 && Number(n)<3 ? Number(n):0;
  const two = n => String(n).padStart(2,'0');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active=null;

  class Journey {
    constructor(opener,index,gesture,ownHistory){
      this.opener=opener instanceof HTMLElement ? opener : document.activeElement;
      this.abort=new AbortController();this.frame=0;this.token=0;this.playing=false;this.ended=false;this.historyEntry=false;this.sound=false;this.loadTimer=0;
      this.dialog=document.createElement('dialog');
      this.dialog.className='pj-dialog';this.dialog.setAttribute('aria-labelledby','pj-series-title');
      this.dialog.innerHTML=`<div class="pj-world"><div class="pj-media" aria-hidden="true"><img class="pj-photo" alt=""><div class="pj-film-layer"></div></div><div class="pj-shade" aria-hidden="true"></div>
        <header class="pj-header"><button type="button" data-j="close" class="pj-back">${icon('back')}<span>Back</span></button><div class="pj-series"><span class="pj-brand">Pâte à Chaya</span><h2 id="pj-series-title">Before the first cup.</h2></div><div class="pj-tools"><span class="pj-runtime">Concept film <b>18 s</b></span><button type="button" class="pj-sound" data-j="sound" aria-label="Sound" aria-pressed="false" hidden></button></div></header>
        <div class="pj-space" aria-hidden="true"></div>
        <div class="pj-bottom"><div class="pj-wait" hidden><span role="status">Film buffering</span><button data-j="still" type="button">Use photo sequence</button></div><div class="pj-story"><div class="pj-text"><p class="pj-chapter"></p><h3 class="pj-title"></h3><p class="pj-line"></p></div><button class="pj-enter" type="button" data-j="explore"><span>Explore this space</span>${icon('explore')}</button></div>
        <div class="pj-console"><div class="pj-transport" aria-label="Playback controls"><button type="button" data-j="previous" aria-label="Previous chapter" title="Previous chapter">${icon('previous')}</button><button type="button" data-j="play" class="pj-play"></button><button type="button" data-j="next" aria-label="Next chapter" title="Next chapter">${icon('next')}</button></div><nav class="pj-reel" aria-label="Choose a chapter">${CHAPTERS.map((s,i)=>`<button data-j="select" data-i="${i}" type="button" aria-label="${two(i+1)}. ${s.name}"><span class="pj-track"><span></span></span><img src="${s.image}" width="62" height="39" alt=""><span class="pj-reel-name"><small>${two(i+1)}</small>${s.name}</span></button>`).join('')}</nav><div class="pj-counter" aria-hidden="true"></div></div></div>
        <p class="pj-reader" aria-live="polite" aria-atomic="true"></p></div>`;
      this.el = selector=>this.dialog.querySelector(selector);
      this.photo=this.el('.pj-photo');this.layer=this.el('.pj-film-layer');this.media=this.el('.pj-media');this.playControl=this.el('[data-j="play"]');
      this.selections=Array.from(this.dialog.querySelectorAll('.pj-reel button'));this.bars=this.selections.map(b=>b.querySelector('.pj-track span'));
      this.selections.forEach((b,i)=>{const im=b.querySelector('img');im.addEventListener('error',()=>{im.src=CHAPTERS[i].backup;},{once:true});});
      this.previousOverflow=document.body.style.overflow;
      document.body.append(this.dialog); document.body.style.overflow='hidden';
      try {this.dialog.showModal();} catch {this.dialog.setAttribute('open','');}
      if(ownHistory && !location.hash.toLowerCase().includes('journey')){
        try {history.pushState({...history.state,pateJourney:true},'',location.href);this.historyEntry=true;} catch {}
      }
      this.bind();this.select(index,gesture && !reduce.matches);this.el('[data-j="close"]').focus({preventScroll:true});
    }
    listen(target,type,fn,opts={}){target.addEventListener(type,fn,{...opts,signal:this.abort.signal});}
    bind(){
      this.listen(this.dialog,'click',e=>{
        const b=e.target.closest('[data-j]');if(!b || b.disabled)return;
        switch(b.dataset.j){
          case 'close':this.close();break;
          case 'explore':this.explore();break;
          case 'previous':this.step(-1);break;
          case 'next':this.step(1);break;
          case 'play':this.toggle();break;
          case 'sound':this.toggleSound();break;
          case 'still':this.toStills();break;
          case 'select':this.select(parseIndex(b.dataset.i),this.playing || this.ended && !reduce.matches);break;
        }
      });
      this.listen(this.dialog,'cancel',e=>{e.preventDefault();this.close();});
      this.listen(this.dialog,'keydown',e=>{
        if(e.altKey||e.ctrlKey||e.metaKey)return;
        if(e.key==='Escape'){e.preventDefault();this.close();return;}
        if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();this.step(e.key==='ArrowLeft'?-1:1);}
        if(e.key===' ' && !e.target.closest('button,a')){e.preventDefault();this.toggle();}
        if(e.key==='Home'){e.preventDefault();this.select(0,this.playing);}
        if(e.key==='End'){e.preventDefault();this.select(2,this.playing);}
      });
      let start=null;
      const area=this.el('.pj-space');
      this.listen(area,'pointerdown',e=>{if(e.isPrimary && e.button===0){start=[e.clientX,e.clientY];area.setPointerCapture(e.pointerId);}});
      this.listen(area,'pointerup',e=>{if(!start)return;const dx=e.clientX-start[0],dy=e.clientY-start[1];start=null;if(Math.abs(dx)>55 && Math.abs(dx)>1.5*Math.abs(dy))this.step(dx>0?-1:1);});
      this.listen(area,'pointercancel',()=>{start=null;});
      this.listen(document,'visibilitychange',()=>{if(document.hidden && this.playing)this.setPlay(false);});
      this.listen(window,'popstate',()=>this.close(true,false));
      this.listen(reduce,'change',()=>{if(reduce.matches){this.setPlay(false);this.media.style.setProperty('--pj-t','0');}});
    }
    disposeVideo(){
      clearTimeout(this.loadTimer);this.clipLife?.abort();
      const v=this.video;
      if(v){v.pause();v.removeAttribute('src');v.load();v.remove();}
      this.video=null;this.dialog.classList.remove('pj-video-ready');
    }
    select(index,play){
      this.token++;const token=this.token;
      cancelAnimationFrame(this.frame);this.frame=0;this.playing=false;this.ended=false;this.elapsed=0;this.last=0;
      clearTimeout(this.loadTimer);this.clipLife?.abort();
      this.video?.pause();this.clipLife=new AbortController();
      this.dialog.classList.remove('pj-video-ready');this.el('.pj-wait').hidden=true;
      this.mode='waiting';this.index=parseIndex(index);
      const chapter=CHAPTERS[this.index];this.dialog.dataset.scene=this.index;this.dialog.classList.remove('pj-finished');
      this.media.style.backgroundImage='url("'+chapter.backup+'")';
      this.photo.onerror=()=>{this.photo.onerror=null;this.photo.src=chapter.backup;};this.photo.src=chapter.image;
      this.el('.pj-chapter').textContent='Chapter '+two(this.index+1)+' / 03';
      this.el('.pj-title').textContent=chapter.name+'.';this.el('.pj-line').textContent=chapter.caption;
      this.el('.pj-reader').textContent='Chapter '+(this.index+1)+' of 3. '+chapter.name+'. '+chapter.caption;
      this.el('.pj-enter span').textContent='Explore this space';
      this.selections.forEach((b,i)=> {if(i===this.index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
      this.el('[data-j="previous"]').disabled=this.index===0;this.el('[data-j="next"]').disabled=this.index===2;
      const v=this.video || document.createElement('video');
      v.muted=!this.sound;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');v.preload='auto';v.disablePictureInPicture=true;this.video=v;
      const valid=()=>token===this.token && this.video===v;
      const listen=(type,fn)=>v.addEventListener(type,()=>{if(valid() && this.mode!=='stills')fn();},{signal:this.clipLife.signal});
      listen('playing',()=>{
        if(!this.playing)return;
        this.mode='film';this.dialog.classList.add('pj-video-ready');this.hideWait();this.updateSound();
      });
      listen('waiting',()=>{if(this.playing)this.holdForFilm();});
      listen('stalled',()=>{if(this.playing && v.readyState<3)this.holdForFilm();});
      listen('error',()=>this.toStills());
      listen('ended',()=>{if(this.playing){this.elapsed=LENGTH;this.draw();this.finishChapter();}});
      if(!v.isConnected)this.layer.replaceChildren(v);
      v.poster=chapter.image;v.src=chapter.film;v.load();
      this.draw();this.setPlay(play);
    }
    hideWait(){clearTimeout(this.loadTimer);this.loadTimer=0;this.el('.pj-wait').hidden=true;}
    holdForFilm(){
      this.mode='waiting';
      // Keep the last decoded frame visible. Offer stills only after a noticeable wait.
      if(this.loadTimer || !this.el('.pj-wait').hidden)return;
      this.loadTimer=setTimeout(()=>{
        this.loadTimer=0;
        if(this.playing && this.mode==='waiting')this.el('.pj-wait').hidden=false;
      },4200);
    }
    toStills(){
      this.mode='stills';this.hideWait();this.clipLife?.abort();this.video?.pause();
      this.dialog.classList.remove('pj-video-ready');this.last=0;this.updateSound();
      this.el('.pj-reader').textContent=CHAPTERS[this.index].name+'. Photographic sequence. '+CHAPTERS[this.index].caption;
    }
    toggleSound(){
      if(this.mode==='stills' || !CHAPTERS[this.index].audio)return;
      this.sound=!this.sound;this.video.muted=!this.sound;this.updateSound();
    }
    updateSound(){
      const button=this.el('.pj-sound');
      button.hidden=this.mode==='stills' || !CHAPTERS[this.index].audio;
      button.setAttribute('aria-pressed',String(this.sound));button.title=this.sound?'Mute film sound':'Enable film sound';
      button.innerHTML=icon(this.sound?'audible':'muted')+'<span>Sound '+(this.sound?'on':'off')+'</span>';
    }
    step(n){const i=Math.min(2,Math.max(0,this.index+n));if(i!==this.index)this.select(i,this.playing);}
    syncVideo(){
      const v=this.video,token=this.token;if(!v || this.mode==='stills')return;
      if(v.error){this.toStills();return;}
      this.holdForFilm();
      // Keep the same media element across chapters for mobile audio permission.
      const play=()=>{const attempt=v.play();return attempt?.catch(error=>{
        if(token!==this.token || !this.playing || error.name==='AbortError')return;
        if(error.name==='NotAllowedError'){
          if(this.sound){this.sound=false;v.muted=true;this.updateSound();return play();}
          this.setPlay(false);
        }else this.toStills();
      });};play();
    }
    setPlay(value){
      this.playing=Boolean(value);this.last=0;
      cancelAnimationFrame(this.frame);this.frame=0;
      if(this.playing){if(this.mode!=='stills')this.syncVideo();if(this.playing)this.frame=requestAnimationFrame(t=>this.tick(t));}
      else{this.video?.pause();this.hideWait();}
      this.updatePlay();this.updateSound();
    }
    updatePlay(){
      const name=this.ended?'Replay film':this.playing?'Pause film':'Play film';
      this.playControl.innerHTML=icon(this.ended?'replay':this.playing?'pause':'play');this.playControl.setAttribute('aria-label',name);this.playControl.title=name;
    }
    toggle(){if(this.ended)this.select(0,true);else this.setPlay(!this.playing);}
    tick(time){
      if(!this.playing)return;
      if(this.mode==='stills'){
        if(this.last)this.elapsed=Math.min(LENGTH,this.elapsed+Math.max(0,time-this.last));
        this.last=time;
      }else if(this.video && Number.isFinite(this.video.duration) && this.video.duration>0){
        // The media clock stops naturally during an initial load or mid-film stall.
        this.elapsed=Math.min(LENGTH,LENGTH*this.video.currentTime/this.video.duration);
      }
      this.draw();
      if(this.mode==='stills' && this.elapsed>=LENGTH){this.finishChapter();return;}
      this.frame=requestAnimationFrame(t=>this.tick(t));
    }
    finishChapter(){
      if(this.index<2)this.select(this.index+1,true);
      else{this.setPlay(false);this.ended=true;this.updatePlay();this.dialog.classList.add('pj-finished');this.el('.pj-chapter').textContent='End of film / 03';this.el('.pj-enter span').textContent='Explore the garden';this.el('.pj-reader').textContent='Film complete. Replay the film or explore the garden.';}
    }
    draw(){
      const t=Math.min(1,this.elapsed/LENGTH);
      this.media.style.setProperty('--pj-t',String(reduce.matches?0:t));
      this.bars.forEach((bar,i)=>bar.style.transform='scaleX('+(i<this.index?1:i===this.index?t:0)+')');
      const sec=two(Math.floor((this.index*LENGTH+this.elapsed)/1000));
      const count=this.el('.pj-counter');const text='00:'+sec+' / 00:18';if(count.textContent!==text)count.textContent=text;
    }
    explore(){
      const {stop,options}=CHAPTERS[this.index], opener=this.opener;
      this.close(false);
      const enter=()=>{if(typeof window.enterGardenWalk==='function')window.enterGardenWalk(opener,stop,options);else{const tour=document.querySelector('garden-tour');if(tour?.enterWalkthrough)tour.enterWalkthrough(opener,stop,options);else document.getElementById('tour')?.scrollIntoView();}};
      if(typeof window.enterGardenWalk==='function' || customElements.get('garden-tour'))enter();
      else Promise.race([customElements.whenDefined('garden-tour'),new Promise(resolve=>setTimeout(resolve,1200))]).then(enter);
    }
    close(restore=true,unwind=true){
      if(!this.dialog.isConnected)return;
      active=null;this.token++;this.abort.abort();this.playing=false;cancelAnimationFrame(this.frame);this.disposeVideo();
      this.dialog.close?.();this.dialog.remove();document.body.style.overflow=this.previousOverflow;
      if(unwind && this.historyEntry && history.state?.pateJourney)history.back();
      if(restore && this.opener?.isConnected)this.opener.focus({preventScroll:true});
    }
  }
  function open(opener,index,gesture,ownHistory){
    if(active)return active;
    active=new Journey(opener,parseIndex(index),gesture,ownHistory);return active;
  }
  window.openGardenJourney=(opener,index=0)=>open(opener,index,Boolean(navigator.userActivation?.isActive),false);
  document.addEventListener('click',e=>{const trigger=e.target.closest?.('[data-journey]');if(!trigger)return;e.preventDefault();open(trigger,parseIndex(trigger.dataset.journey),true,true);});
})();
