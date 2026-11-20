/* Fixed-point spherical views. All sources are local equirectangular concept images. */
(() => {
  const PI=Math.PI, RAD=PI/180, clamp=(v,a,b)=>Math.max(a,Math.min(v,b));
  const scenes={
    courtyard:{startYaw:0,title:'Garden courtyard',image:'/assets/cinema/pano-courtyard.webp',still:'/assets/cinema/garden-daybreak.webp',description:'A fixed viewpoint inside the proposed garden café, beneath mature foliage and between the existing buildings.'},
    bakehouse:{startYaw:.36,title:'Inside the bakehouse',image:'/assets/cinema/pano-bakehouse.webp',still:'/assets/cinema/verandah-prep.webp',description:'A fixed viewpoint inside the proposed working pastry kitchen, with the preparation benches and baking equipment around you.'}
  };
  const arrows={left:'M15 5 8 12l7 7',right:'m9 5 7 7-7 7',up:'m5 15 7-7 7 7',down:'m5 9 7 7 7-7',reset:'M4.5 10a7.5 7.5 0 1 1 1.5 7m-2-12v5h5',plus:'M12 5v14M5 12h14',minus:'M5 12h14',close:'M6 6l12 12M18 6 6 18'};
  const icon=k=>`<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20"><path d="${arrows[k]}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const button=(key,name)=>`<button type="button" data-pp-action="${key}" aria-label="${name}" title="${name}">${icon(key)}</button>`;
  function webRenderer(canvas) {
    const gl=canvas.getContext('webgl',{antialias:false,alpha:false,depth:false,powerPreference:'low-power'});
    if(!gl)throw Error('no webgl');
    const program=gl.createProgram(),shaders=[];
    function shader(type,src){
      const part=gl.createShader(type);gl.shaderSource(part,src);gl.compileShader(part);
      if(!gl.getShaderParameter(part,gl.COMPILE_STATUS))throw Error('shader compilation');
      gl.attachShader(program,part);shaders.push(part);
    }
    shader(gl.VERTEX_SHADER,'attribute vec2 pt;varying vec2 view;void main(){view=pt;gl_Position=vec4(pt,0.,1.);}');
    shader(gl.FRAGMENT_SHADER,`precision ${gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT).precision?'highp':'mediump'} float;
      varying vec2 view;uniform sampler2D pano;uniform vec2 ratio;uniform vec4 dir;
      void main(){
        vec3 ray=normalize(vec3(view*ratio,1.0));
        float y=ray.y*dir.w+ray.z*dir.z; float z=ray.z*dir.w-ray.y*dir.z;
        float x=ray.x*dir.y+z*dir.x;z=z*dir.y-ray.x*dir.x;
        vec2 uv=vec2(fract(0.5+atan(x,z)/6.28318530718),0.5-asin(clamp(y,-1.,1.))/3.14159265359);
        gl_FragColor=texture2D(pano,uv);
      }`);
    gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('shader link');
    gl.useProgram(program);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const pt=gl.getAttribLocation(program,'pt');gl.enableVertexAttribArray(pt);gl.vertexAttribPointer(pt,2,gl.FLOAT,false,0,0);
    const ratio=gl.getUniformLocation(program,'ratio'),dir=gl.getUniformLocation(program,'dir'),texture=gl.createTexture();
    gl.uniform1i(gl.getUniformLocation(program,'pano'),0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);
    for(const k of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR);
    for(const k of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE);
    return {
      image(img){
        const max=gl.getParameter(gl.MAX_TEXTURE_SIZE);
        if(img.naturalWidth>max||img.naturalHeight>max){
          const gain=Math.min(max/img.naturalWidth,max/img.naturalHeight),tmp=document.createElement('canvas');
          tmp.width=Math.round(img.naturalWidth*gain);tmp.height=Math.round(img.naturalHeight*gain);
          tmp.getContext('2d').drawImage(img,0,0,tmp.width,tmp.height);img=tmp;
        }
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
      },
      draw(yaw,pitch,fov,width,height){
        const dpr=Math.min(devicePixelRatio||1,1.7,2200/Math.max(width,height));
        const w=Math.max(1,Math.round(width*dpr)),h=Math.max(1,Math.round(height*dpr));
        if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
        const t=Math.tan(fov*RAD/2);gl.uniform2f(ratio,t*width/height,t);
        gl.uniform4f(dir,Math.sin(yaw),Math.cos(yaw),Math.sin(pitch),Math.cos(pitch));gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      },
      close(){gl.deleteTexture(texture);gl.deleteBuffer(buf);gl.deleteProgram(program);for(const s of shaders)gl.deleteShader(s);gl.getExtension('WEBGL_lose_context')?.loseContext();}
    };
  }
  function cpuRenderer(canvas) {
    const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw Error('no canvas');
    let data,iw,ih,im;
    return {
      image(img){
        const temp=document.createElement('canvas'),gain=Math.min(1,2200/img.naturalWidth);
        iw=temp.width=Math.max(1,Math.round(img.naturalWidth*gain));ih=temp.height=Math.max(1,Math.round(img.naturalHeight*gain));
        const sample=temp.getContext('2d',{willReadFrequently:true});sample.drawImage(img,0,0,iw,ih);
        data=sample.getImageData(0,0,iw,ih).data;
      },
      draw(yaw,pitch,fov,width,height){
        if(!data)return;
        const gain=Math.min(1,520/Math.max(width,height)),w=Math.max(1,Math.round(width*gain)),h=Math.max(1,Math.round(height*gain));
        if(canvas.width!==w||canvas.height!==h||!im){canvas.width=w;canvas.height=h;im=ctx.createImageData(w,h);}
        const sy=Math.sin(yaw),cy=Math.cos(yaw),sp=Math.sin(pitch),cp=Math.cos(pitch),f=Math.tan(fov*RAD/2),dest=im.data;
        for(let j=0;j<h;j++){
          const ry=(1-2*(j+.5)/h)*f,vy=ry*cp+sp,vz=cp-ry*sp;
          for(let i=0;i<w;i++){
            const rx=(2*(i+.5)/w-1)*f*width/height;
            const u=(((.5+Math.atan2(rx*cy+vz*sy,vz*cy-rx*sy)/(2*PI))%1)+1)%1;
            const v=.5-Math.asin(clamp(vy/Math.sqrt(1+rx*rx+ry*ry),-1,1))/PI;
            const source=(clamp(Math.floor(v*ih),0,ih-1)*iw+Math.min(iw-1,Math.floor(u*iw)))*4,idx=(j*w+i)*4;
            dest[idx]=data[source];dest[idx+1]=data[source+1];dest[idx+2]=data[source+2];dest[idx+3]=255;
          }
        }ctx.putImageData(im,0,0);
      },close(){data=null;im=null;}
    };
  }
  let active=null;
  class Viewer {
    constructor(name,opener){
      this.opener=opener||document.activeElement;this.loaded=false;this.seq=0;this.frame=0;this.closed=false;
      this.host=document.createElement('dialog');this.host.className='pp-dialog';this.host.setAttribute('aria-labelledby','pp-title');
      this.host.innerHTML=`<div class="pp-root"><canvas class="pp-canvas" tabindex="0" aria-label="Spherical image. Drag to look around. Arrow keys turn or tilt, plus and minus zoom, Home resets."></canvas>
        <img class="pp-still" hidden alt=""><div class="pp-shade"></div>
        <header class="pp-head"><div><p>Photographic concept <span aria-hidden="true">/</span> <b>360°</b></p><h2 id="pp-title"></h2></div>
        <button type="button" data-pp-action="close" class="pp-close" aria-label="Close panorama">${icon('close')}</button></header>
        <div class="pp-load" role="status" aria-live="polite"><span></span><button type="button" data-pp-action="retry" hidden>Retry panorama</button></div>
        <div class="pp-footer"><div class="pp-bar"><div class="pp-picker" role="group" aria-label="Select panoramic scene"><button type="button" data-pp-scene="courtyard">Courtyard</button><button type="button" data-pp-scene="bakehouse">Bakehouse</button></div>
        <div class="pp-rot" role="group" aria-label="Panoramic controls">${button('left','Turn left')}${button('right','Turn right')}${button('up','Look up')}${button('down','Look down')}${button('minus','Zoom out')}${button('plus','Zoom in')}${button('reset','Reset viewpoint')}</div></div>
        <div class="pp-caption"><p class="pp-description"></p><span class="pp-hint">Drag to look around</span></div></div></div>`;
      document.body.append(this.host);
      this.view=this.host.querySelector('.pp-root');this.canvas=this.host.querySelector('canvas');this.still=this.host.querySelector('.pp-still');
      try{this.renderer=webRenderer(this.canvas);}catch(e){
        const copy=this.canvas.cloneNode();this.canvas.replaceWith(copy);this.canvas=copy;
        try{this.renderer=cpuRenderer(copy);}catch(e){this.renderer=null;}
      }
      this.lifetime=new AbortController();const opts={signal:this.lifetime.signal};
      this.previousScroll=document.body.style.overflow;document.body.style.overflow='hidden';
      if(typeof this.host.showModal==='function'){this.host.showModal();}else{this.host.setAttribute('open','');this.host.setAttribute('role','dialog');this.host.setAttribute('aria-modal','true');}
      this.host.addEventListener('cancel',e=>{e.preventDefault();e.stopPropagation();this.close();},opts);
      this.host.addEventListener('close',()=>this.close(),opts);
      this.host.addEventListener('click',e=>{
        const sc=e.target.closest('[data-pp-scene]')?.dataset.ppScene;
        if(sc){if(this.scene!==sc)this.load(sc);return;}
        const cmd=e.target.closest('[data-pp-action]')?.dataset.ppAction;if(cmd)this.act(cmd);
      },opts);
      this.host.addEventListener('keydown',e=>{
        if(e.key==='Tab'&&typeof this.host.showModal!=='function'){
          const list=[...this.host.querySelectorAll('canvas, button')].filter(el=>!el.hidden&&!el.disabled&&!el.closest('[hidden]'));
          if(e.shiftKey&&document.activeElement===list[0]){e.preventDefault();list.at(-1)?.focus();}
          if(!e.shiftKey&&document.activeElement===list.at(-1)){e.preventDefault();list[0]?.focus();}
        }
        if(e.key==='Escape'){e.preventDefault();e.stopPropagation();this.close();return;}
        const command={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down','+':'plus','=':'plus','-':'minus',Home:'reset'}[e.key];
        if(command){e.preventDefault();e.stopPropagation();this.act(command);}
      },opts);
      let drag=null;
      this.canvas.addEventListener('pointerdown',e=>{
        if(e.button!==0||!this.loaded)return;
        this.canvas.focus({preventScroll:true});this.canvas.setPointerCapture(e.pointerId);
        this.canvas.classList.add('pp-grabbing');drag={x:e.clientX,y:e.clientY,id:e.pointerId};
      },opts);
      this.canvas.addEventListener('pointermove',e=>{
        if(!drag||drag.id!==e.pointerId)return;
        const rate=this.fov*RAD/Math.max(250,this.view.clientHeight);
        this.yaw-=(e.clientX-drag.x)*rate;this.pitch+=(e.clientY-drag.y)*rate;
        drag.x=e.clientX;drag.y=e.clientY;this.schedule();
      },opts);
      const release=()=>{drag=null;this.canvas.classList.remove('pp-grabbing');};
      for(const event of ['pointerup','pointercancel','lostpointercapture'])this.canvas.addEventListener(event,release,opts);
      this.canvas.addEventListener('wheel',e=>{if(this.loaded){e.preventDefault();this.fov+=e.deltaY*.037;this.schedule();}},{...opts,passive:false});
      this.resize=new ResizeObserver(()=>this.schedule());this.resize.observe(this.view);
      this.load(name);
      this.host.querySelector('.pp-close').focus({preventScroll:true});
    }
    act(cmd){
      if(cmd==='close'){this.close();return;}
      if(cmd==='retry'){this.load(this.scene);return;}
      if(!this.loaded)return;
      if(cmd==='left')this.yaw-=PI/9;else if(cmd==='right')this.yaw+=PI/9;
      else if(cmd==='up')this.pitch+=PI/12;else if(cmd==='down')this.pitch-=PI/12;
      else if(cmd==='plus')this.fov-=9;else if(cmd==='minus')this.fov+=9;
      else if(cmd==='reset'){this.yaw=scenes[this.scene].startYaw;this.pitch=0;this.fov=75;}this.schedule();
    }
    message(text,retry=false){
      const region=this.host.querySelector('.pp-load');region.hidden=!text;region.querySelector('span').textContent=text;region.querySelector('button').hidden=!retry;
    }
    load(name){
      const sc=scenes[name]||scenes.courtyard;this.scene=name in scenes?name:'courtyard';const seq=++this.seq;
      this.yaw=sc.startYaw;this.pitch=0;this.fov=75;this.loaded=false;this.canvas.hidden=true;this.still.hidden=true;
      this.host.querySelector('h2').textContent=sc.title;
      this.host.querySelector('.pp-description').textContent=sc.description;
      this.host.querySelector('.pp-head b').textContent='360°';this.host.querySelector('.pp-hint').hidden=false;
      this.host.querySelectorAll('[data-pp-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ppScene===this.scene)));
      this.host.querySelectorAll('.pp-rot button').forEach(b=>b.disabled=true);
      this.message('Loading the panoramic scene…');
      const image=new Image();image.decoding='async';
      const fallback=()=>{
        if(seq!==this.seq||this.closed)return;
        this.still.src=sc.still;this.still.alt=sc.title+' — design concept still';this.still.hidden=false;this.canvas.hidden=true;
        this.host.querySelector('.pp-head b').textContent='Still image';this.host.querySelector('.pp-hint').hidden=true;
        this.message('The panorama is unavailable. Showing a concept still.',true);
      };
      image.onerror=fallback;
      image.onload=()=>{
        if(seq!==this.seq||this.closed)return;
        try{if(!this.renderer)throw Error('renderer');this.renderer.image(image);}catch(e){fallback();return;}
        this.loaded=true;this.canvas.hidden=false;this.still.hidden=true;
        this.host.querySelectorAll('.pp-rot button').forEach(b=>b.disabled=false);
        this.canvas.setAttribute('aria-label',sc.description+' Drag to look around or use the arrow keys. Plus and minus zoom. Home resets.');
        this.message('');this.schedule();
      };image.src=sc.image;
    }
    schedule(){
      if(!this.loaded||this.closed||this.frame)return;
      this.pitch=clamp(this.pitch,-PI*.485,PI*.485);this.yaw=((this.yaw+PI)%(2*PI)+2*PI)%(2*PI)-PI;this.fov=clamp(this.fov,40,95);
      this.frame=requestAnimationFrame(()=>{
        this.frame=0;if(this.closed||!this.loaded)return;
        this.pitch=clamp(this.pitch,-PI*.485,PI*.485);this.fov=clamp(this.fov,40,95);
        const {clientWidth:w,clientHeight:h}=this.view;if(w&&h)this.renderer.draw(this.yaw,this.pitch,this.fov,w,h);
      });
    }
    close(){
      if(this.closed)return;this.closed=true;this.seq++;cancelAnimationFrame(this.frame);this.lifetime.abort();this.resize.disconnect();this.renderer?.close();
      if(this.host.open&&typeof this.host.close==='function')this.host.close();this.host.remove();document.body.style.overflow=this.previousScroll;
      if(this.opener?.isConnected)this.opener.focus({preventScroll:true});active=null;
    }
  }
  window.openPastryPanorama=(sceneName='courtyard',openerElement=document.activeElement)=>{
    const key=Object.hasOwn(scenes,sceneName)?sceneName:'courtyard';
    if(active){if(active.scene!==key)active.load(key);return;}
    active=new Viewer(key,openerElement);
  };
})();
