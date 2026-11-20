(() => {
  'use strict';

  const TAU = 2 * Math.PI;
  const clamp = (x, min, max) => Math.min(max, Math.max(min, x));
  const normalise = v => {
    const len = Math.hypot(...v) || 1;
    return v.map(k => k / len);
  };
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot = (a,b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const light = normalise([-.55,1,.52]);
  const home = {yaw:.64, pitch:.82};
  let instanceCount = 0;

  function bakeModel() {
    let seed = 1986;
    function random() {
      seed = (1664525 * seed + 1013904223) >>> 0;
      return seed / 4294967296;
    }
    const faces = [];
    function face(vertices, colour, group, gloss=0, tone=1) {
      const [a,b,c] = vertices;
      const normal = normalise(cross(b.map((v,i)=>v-a[i]),c.map((v,i)=>v-a[i])));
      const centre = [0,1,2].map(i=>vertices.reduce((v,p)=>v+p[i],0)/vertices.length);
      const base = colour.map(v => v * tone);
      const front = group===0 && vertices.every(p => p[2]>1.455);
      faces.push({vertices, normal, centre, base, group, gloss, front});
    }
    function plane(a,b,c,d,colour,group,nx=1,ny=1) {
      const pos=(u,v)=>a.map((n,i)=>n+u*(b[i]-n)+v*(d[i]-n));
      for(let i=0;i<nx;i++) for(let j=0;j<ny;j++)
        face([pos(i/nx,j/ny),pos((i+1)/nx,j/ny),pos((i+1)/nx,(j+1)/ny),pos(i/nx,(j+1)/ny)],colour,group);
    }
    function block(x,y,z,w,h,d,colour,group) {
      const a=x-w/2,b=x+w/2,l=z-d/2,r=z+d/2,top=y+h;
      const nx=Math.max(1,Math.ceil(w/.48)),nz=Math.max(1,Math.ceil(d/.48));
      plane([a,top,r],[b,top,r],[b,top,l],[a,top,l],colour,group,nx,nz);
      plane([a,y,l],[b,y,l],[b,y,r],[a,y,r],colour,group,nx,nz);
      plane([a,y,r],[b,y,r],[b,top,r],[a,top,r],colour,group,nx,1);
      plane([b,y,l],[a,y,l],[a,top,l],[b,top,l],colour,group,nx,1);
      plane([a,y,l],[a,y,r],[a,top,r],[a,top,l],colour,group,nz,1);
      plane([b,y,r],[b,y,l],[b,top,l],[b,top,r],colour,group,nz,1);
    }
    const kraft=[191,146,92],cut=[211,170,117],red=[183,40,42],paper=[244,231,205];
    const tray=0,sleeve=1;
    block(0,.045,0,3.18,.065,3.02,kraft,tray);
    block(-1.55,.103,0,.075,.442,3,kraft,tray);
    block(1.55,.103,0,.075,.442,3,kraft,tray);
    block(0,.103,-1.46,3.04,.442,.074,kraft,tray);
    // The front wall has a die-cut finger notch. Expose the pale cut edge.
    for(let i=0;i<32;i++){
      const x=-1.59+i*(3.18/32),xx=x+3.18/32;
      const height=x=>.545-(Math.abs(x)<.23?.18*Math.sqrt(Math.max(0,1-(x/.23)**2)):0);
      const y=height(x),yy=height(xx),z=1.53,zz=1.463;
      face([[x,.103,z],[xx,.103,z],[xx,yy,z],[x,y,z]],kraft,tray);
      face([[xx,.103,zz],[x,.103,zz],[x,y,zz],[xx,yy,zz]],kraft,tray);
      face([[x,y,z],[xx,yy,z],[xx,yy,zz],[x,y,zz]],cut,tray);
    }
    block(0,.027,0,3.322,.045,3.09,red,sleeve);
    block(-1.638,.065,0,.047,.57,3.09,red,sleeve);
    block(1.638,.065,0,.047,.57,3.09,red,sleeve);
    block(0,.632,0,3.322,.044,3.09,red,sleeve);

    function sprinkle(x,y,z,r,colour,group) {
      const ang=random()*TAU, ends=[];
      const sides=4;
      for(let i=0;i<sides;i++){
        const a=ang+i*TAU/sides;
        ends.push([x+Math.cos(a)*r*(.7+.5*random()),y+.1*r*random(),z+Math.sin(a)*r*(.85+.3*random())]);
      }
      const peak=[x+r*(random()-.5)*.55,y+r*(.4+.45*random()),z+r*.15];
      for(let i=0;i<sides;i++)face([peak,ends[(i+1)%sides],ends[i]],colour,group,0,.92+.12*random());
    }
    function pastry(mid,index) {
      const chocolate=index%2===0;
      const n=30,slices=32;
      const shellAt=(i,j,icing=false) => {
        const t=i/slices, z=-1.24+2.48*t;
        const ratio=clamp(Math.min(t,1-t)*2.48/.31,0,1);
        const dome=Math.max(.024,Math.sqrt(Math.max(0,1-(1-ratio)**2)));
        const angle=icing ? -.98+(j/n)*1.96 : j/n*TAU;
        const irregular=(.029*Math.cos(11*angle+2*t)+.02*Math.cos(17*angle-5*t)+.016*Math.sin(38*t+3*angle)+.016*Math.cos(t*13+index));
        const ripple=icing ? .008*Math.cos(9*t+5*angle) : irregular;
        const radius=(1+ripple)*dome;
        if(icing){
          const edge=1-Math.pow(Math.abs(j/n*2-1),7)*.035;
          return [mid+.233*radius*Math.sin(angle),.339+.195*dome*edge*Math.cos(angle)+.014, z+.006*Math.sin(t*18+index)];
        }
        return [mid+.266*radius*Math.sin(angle),.339+.192*radius*Math.cos(angle),z];
      };
      for (let i=0;i<slices;i++) for(let j=0;j<n;j++){
        const angle=(j+.5)/n*TAU;
        if(Math.cos(angle)<-.76)continue;
        const d=.95+.045*Math.cos(11*angle+2*i/slices)+.04*random()+.045*Math.cos(i*.85+index);
        face([shellAt(i,j),shellAt(i+1,j),shellAt(i+1,j+1),shellAt(i,j+1)],[212,137,64],tray,.055,d);
      }
      const glaze = chocolate ? [89,43,33] : [196,183,116];
      const steps=12;
      for(let i=0;i<slices;i++) for(let j=0;j<steps;j++){
        const p=k=>k*n/steps;
        face([shellAt(i,p(j),true),shellAt(i+1,p(j),true),shellAt(i+1,p(j+1),true),shellAt(i,p(j+1),true)],glaze,tray,chocolate?.54:.32,.985+.025*random());
      }
      for(let k=0;k<43;k++){
        const x=(random()-.5)*.23,z=(random()-.5)*2.1;
        const y=.339+.204*Math.sqrt(Math.max(.01,1-(x/.238)**2));
        const tint=chocolate ? [[116,69,53],[71,40,30],[156,100,73],[100,58,44]][k%4] : [[113,120,56],[163,147,68],[185,166,92],[127,101,51]][k%4];
        sprinkle(mid+x,y,z,.016+random()*.026,tint,tray);
      }
    }
    for(let k=0;k<4;k++){
      const mid=(k-1.5)*.755;
      block(mid,.114,0,.69,.012,2.75,paper,tray);
      for(const side of [-1,1])for(let j=0;j<44;j++){
        const z=-1.36+j*(2.72/44),zz=z+2.72/44;
        const rim=(n)=>mid+side*(.343+.021*(n%2));
        const quad=[[mid+side*.25,.13,z],[mid+side*.25,.13,zz],[rim(j+1),.389,zz],[rim(j),.389,z]];
        face(side===1?quad:quad.reverse(),[240,226,198],tray,0,j%2?1:.96);
        face(quad.slice().reverse(),[237,222,190],tray,0,j%2?1:.96);
      }
      pastry(mid,k);
    }
    return faces;
  }

  class PastryObject extends HTMLElement {
    connectedCallback() {
      if (this.controller) return;
      const key='po-'+(++instanceCount);
      this.innerHTML=`<section class="po-wrap" aria-labelledby="${key}-title"><div class="po-heading"><div><p class="po-kicker">Interactive packaging study</p><h2 id="${key}-title">the éclair <em>drawer.</em></h2></div><p>Slide the kraft tray out of its red sleeve. Turn the box to see how four pleated paper channels keep the glazes apart.</p></div><div class="po-stage"><canvas tabindex="0" role="img" aria-label="Rotatable three-dimensional éclair gift box" aria-describedby="${key}-help"></canvas><img class="po-fallback" src="/assets/pack-eclair-drawer.webp" alt="Four éclairs in a kraft drawer and a red sleeve" hidden><span class="po-object-caption" aria-hidden="true">Four-piece gift box</span><div class="po-controls" role="group" aria-label="Box controls"><button type="button" data-box-action="lid" class="po-lid">Close box</button><button type="button" data-box-action="left" aria-label="Rotate left" title="Rotate left">↶</button><button type="button" data-box-action="right" aria-label="Rotate right" title="Rotate right">↷</button><button type="button" data-box-action="reset">Reset view</button></div></div><p id="${key}-help" class="po-help">Drag to rotate. Use the arrow keys to change the viewing angle. Press Enter to open or close the box.</p><p class="po-status" aria-live="polite"></p></section>`;
      const canvas=this.querySelector('canvas'), ctx=canvas.getContext('2d',{alpha:true});
      this.controller=new AbortController();
      const signal=this.controller.signal;
      if(!ctx){canvas.hidden=true;this.querySelector('.po-fallback').hidden=false;this.querySelector('.po-controls').hidden=true;this.querySelector('.po-help').textContent='Four mini éclairs in individual paper channels and a sliding kraft tray.';return;}
      const faces=bakeModel();
      const reduced=matchMedia('(prefers-reduced-motion: reduce)');
      let yaw=home.yaw,pitch=home.pitch,openness=1,goal=1,frame=0,width=0,height=0,dpr=1,last=0;
      const stage=this.querySelector('.po-stage');
      function render(){
        if(!width || !height)return;
        ctx.setTransform(dpr,0,0,dpr,0,0);
        ctx.clearRect(0,0,width,height);
        const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
        const view=[sy*cp,sp,cy*cp];
        const right=[cy,0,-sy],up=[-sy*sp,cp,-cy*sp];
        const scale=Math.min(width/(5.3+openness*.85),height/(4.8+openness*2.35));
        const project=(p,shift)=>[
          width/2+scale*(dot(p,right)-shift*sy),
          height*.495-scale*(dot(p,up)-shift*cy*sp)
        ];
        const trayShift=1.44*openness, sleeveShift=-1.44*openness;
        const move=[trayShift,sleeveShift];
        // Soft contact shadows follow the two moving pieces on the studio surface.
        for(const shift of move){
          const [x,y]=project([.025,0,.075],shift);
          ctx.save();
          ctx.transform(scale*cy,scale*sy*sp,-scale*sy,scale*cy*sp,x,y);
          for(let ring=9;ring>=0;ring--){
            ctx.fillStyle= 'rgba(60,38,27,'+(ring<3?.034:.016)+')';
            ctx.beginPath();ctx.roundRect(-1.68-ring*.042,-1.52-ring*.05,3.36+ring*.084,3.05+ring*.1,.13+ring*.04);ctx.fill();
          }
          ctx.restore();
        }
        const planeZ=1.544+sleeveShift-trayShift;
        const half=normalise(light.map((k,i)=>k+view[i]));
        const sorted=[];
        for(const f of faces){
          if(dot(f.normal,view)<-.002)continue;
          const shift=move[f.group];
          let verts=f.vertices;
          if(f.group===0 && !f.front){
            // Clip the contents to the front opening of the opaque red sleeve.
            if(verts.every(p=>p[2]<planeZ))continue;
            if(verts.some(p=>p[2]<planeZ)){
              const visible=[];
              for(let i=0;i<verts.length;i++){
                const a=verts[i], b=verts[(i+1)%verts.length];
                if(a[2]>=planeZ)visible.push(a);
                if((a[2]>=planeZ)!==(b[2]>=planeZ)){
                  const t=(planeZ-a[2])/(b[2]-a[2]);
                  visible.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1]),planeZ]);
                }
              }
              verts=visible;
            }
          }
          sorted.push([dot(f.centre,view)+shift*view[2],f,shift,verts]);
        }
        sorted.sort((a,b)=>a[0]-b[0]);
        ctx.lineWidth=.59;ctx.lineJoin='round';
        for(const [,f,shift,verts] of sorted){
          const diffuse=Math.max(0,dot(f.normal,light));
          const shine=Math.pow(Math.max(0,dot(f.normal,half)),f.gloss>.25?23:11)*f.gloss;
          const k=.75+.29*diffuse;
          const rgb=f.base.map((c,i)=>Math.round(clamp(c*k+shine*[126,106,83][i],0,255)));
          ctx.fillStyle=ctx.strokeStyle='rgb('+rgb.join(',')+')';
          ctx.beginPath();
          verts.forEach((p,i)=>{const [x,y]=project(p,shift);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
          ctx.closePath();ctx.fill();ctx.stroke();
        }
        // Vector ink sits on the moving sleeve rather than on the screen.
        const inkOrigin=project([-1.39,.68,1.05],sleeveShift);
        const inkX=project([-.39,.68,1.05],sleeveShift);
        const inkZ=project([-1.39,.68,2.05],sleeveShift);
        ctx.save();
        ctx.transform((inkX[0]-inkOrigin[0])/100,(inkX[1]-inkOrigin[1])/100,(inkZ[0]-inkOrigin[0])/100,(inkZ[1]-inkOrigin[1])/100,...inkOrigin);
        ctx.fillStyle='#f5ddb7';ctx.font='bold 14px Arial, sans-serif';ctx.fillText('pâte à chaya.',0,0);
        ctx.font='6px Arial, sans-serif';ctx.fillText('É C L A I R S   /   0 4',0,10);
        ctx.restore();
      }
      const draw=t=>{
        frame=0;
        if(Math.abs(openness-goal)>.0008){
          const dt=last?Math.min(80,t-last):16;
          openness+=(goal-openness)*(1-Math.exp(-dt/116));
          if(Math.abs(goal-openness)<.004)openness=goal;
        }
        last=t;render();
        if(openness!==goal)frame=requestAnimationFrame(draw);
      };
      const schedule=()=>{if(!frame){last=0;frame=requestAnimationFrame(draw);}};
      const homeView=()=>{yaw=home.yaw;pitch=home.pitch;schedule();};
      const orbit=(dx,dy)=>{yaw+=dx;pitch=clamp(pitch+dy,.22,1.36);schedule();};
      const toggle=()=>{
        goal=goal>.5?0:1;
        if(reduced.matches)openness=goal;
        this.querySelector('.po-lid').textContent=goal?'Close box':'Open box';
        this.querySelector('.po-status').textContent=goal?'Box open. Four éclairs are visible.':'Box closed. The red sleeve covers the tray.';
        schedule();
      };
      this.querySelector('.po-controls').addEventListener('click',e=>{
        const button=e.target.closest('button');if(!button)return;
        switch(button.dataset.boxAction){case 'lid':toggle();break;case 'left':orbit(-.38,0);break;case 'right':orbit(.38,0);break;case 'reset':homeView();break;}
      },{signal});
      canvas.addEventListener('keydown',e=>{
        const step=.19;
        switch(e.key){
          case 'ArrowLeft':orbit(-step,0);break;case 'ArrowRight':orbit(step,0);break;
          case 'ArrowUp':orbit(0,.12);break;case 'ArrowDown':orbit(0,-.12);break;
          case 'Home':homeView();break;case 'Enter':case ' ':toggle();break;default:return;
        }
        e.preventDefault();
      },{signal});
      let drag=null;
      canvas.addEventListener('pointerdown',e=>{
        if(!e.isPrimary||e.button!==0)return;
        drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.classList.add('po-grabbing');
      },{signal});
      canvas.addEventListener('pointermove',e=>{
        if(drag?.id!==e.pointerId)return;
        orbit((drag.x-e.clientX)*.012,(e.clientY-drag.y)*.009);
        drag.x=e.clientX;drag.y=e.clientY;
      },{signal});
      const stop=()=>{drag=null;canvas.classList.remove('po-grabbing');};
      canvas.addEventListener('lostpointercapture',stop,{signal});
      const resize=()=>{
        const b=canvas.getBoundingClientRect();width=Math.round(b.width);height=Math.round(b.height);
        dpr=Math.min(window.devicePixelRatio||1,1.75);
        canvas.width=Math.max(1,Math.round(width*dpr));canvas.height=Math.max(1,Math.round(height*dpr));schedule();
      };
      const observer=new ResizeObserver(resize); observer.observe(stage);resize();
      signal.addEventListener('abort',()=>{observer.disconnect();if(frame)cancelAnimationFrame(frame);},{once:true});
    }
    disconnectedCallback(){this.controller?.abort();this.controller=null;}
  }
  if(!customElements.get('pastry-object'))customElements.define('pastry-object',PastryObject);
})();
