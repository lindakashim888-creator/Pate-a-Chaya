/* An orbitable, orthographically projected study. Model coordinates are schematic metres. */
(() => {
  const minimal = [
    ['Mix & cook','10 L planetary mixer + induction hob',49800,'Combine détrempe or choux in measured batches. The induction point heats the panade before eggs are added in the mixer.','Shared table, about 1.3 × 0.7 m','pickup',33],
    ['Cold storage','172 L undercounter chiller',73160,'Rest wrapped dough and hold temperature-sensitive fillings in clearly separated, labelled containers. Record the load and check the actual chill recovery.','702 × 765 mm cabinet footprint','pickup',33],
    ['Roll & shape','Stainless bench + scales and probes',18500,'Weigh dough portions, roll by hand, trim and shape. Record dough temperature and saleable yield before the tray leaves this bench.','Bench zone, about 1.5 × 0.8 m','pickup',33],
    ['Bake','Prego 4-tray convection oven',70000,'Bake small runs in four 450 × 340 mm trays. Croissants and choux take separate oven slots so each can use its tested programme.','Oven stand, about 0.9 × 0.8 m','pickup',33],
    ['Wash','Utensil sink + separate handwash',22500,'Receive soiled tools at the utensil sink. Reserve the separate handwash basin for hands and return cleaned equipment to dry storage.','Two-fixture zone, about 1.7 × 0.7 m','pickup',33],
    ['Cool & dispatch','Rack, trays, smallwares + carriers',19500,'Transfer finished bakes to the mobile rack. Cool crisp pastry before packing. Fill chilled orders separately and load the insulated carrier at handoff.','Rack and pack zone, about 1.4 × 0.8 m','pickup',33]
  ];
  const flagship = [
    ['Mix & cook','20 L spiral + 10 L planetary + hob',118800,'Use the spiral for laminated dough and the planetary for choux, cream and smaller trials. Weigh ingredients at prep before loading either machine.','Mixer line, about 2.0 × 0.9 m','expanded',23],
    ['Cold storage','Upright chiller + upright freezer',184000,'Separate chilled and frozen inventories. Stage the next dough batch in the chiller and log batch, time and product temperature through transfer.','Two cabinets, about 1.6 × 0.9 m','expanded',22],
    ['Roll & shape','RDS520T tabletop dough sheeter',199000,'Pass chilled dough through gradually closer rollers, book-fold, rest and sheet to the tested final gauge. The nominal working width is 500 mm.','Extended table zone, about 2.2 × 0.9 m','expanded',21],
    ['Bake','UNOX XENA convection oven',294000,'Load four 600 × 400 mm trays per wave. Verify the tested load, browning and bake loss, then record saleable pieces by oven batch.','Oven stand, about 1.0 × 0.9 m','expanded',20],
    ['Wash','Utensil sink + separate handwash',22500,'Keep dirty returns at the sink end. Sanitised tools return to prep, while handwashing has its own basin and supply.','Two-fixture zone, about 1.7 × 0.7 m','expanded',24],
    ['Cool & pack','Mobile rack, tray set + carriers',35000,'The ₹30,000 rack, tins and tray allowance and ₹5,000 carriers serve this stage. Separate hot trays, ambient packing and chilled handoff.','Rack and pack zone, about 1.4 × 0.8 m','expanded',24],
    ['Proof','16-tray controlled proofer',60000,'Hold shaped laminated dough in the proofer ahead of each oven slot. Release a tray by proof and bake checks recorded in the trial log.','Cabinet zone, about 0.8 × 0.9 m','expanded',22]
  ];
  const inr = n => '₹' + n.toLocaleString('en-IN');
  const tint = (color,level) => {
    const n = parseInt(color.slice(1),16);
    return 'rgb('+[n>>16,(n>>8)&255,n&255].map(x=>Math.round(x*level)).join(',')+')';
  };
  const metal='#bdc9c4', bright='#e6ede7', charcoal='#34413d', black='#283632', clay='#b66d42', oak='#a0764d';
  function model(large){
    const faces=[], pins=[], shadows=[];
    let pass=0;let cluster=0;
    const face=(points,color,l=1) => faces.push({points,color:l===1?color:tint(color,l),pass,cluster});
    const box=(x,y,z,w,h,d,c) => {
      const X=x+w,Y=y+h,Z=z+d;
      face([[x,y,z],[x,Y,z],[X,Y,z],[X,y,z]],c,.76);
      face([[X,y,z],[X,Y,z],[X,Y,Z],[X,y,Z]],c,.78);
      face([[X,y,Z],[X,Y,Z],[x,Y,Z],[x,y,Z]],c,.92);
      face([[x,y,Z],[x,Y,Z],[x,Y,z],[x,y,z]],c,.86);
      face([[x,Y,z],[x,Y,Z],[X,Y,Z],[X,Y,z]],c);
    };
    const cylinder=(x,y,z,rx,rz,h,c,cap=c,n=18,topRatio=1) => {
      const lo=[], hi=[];
      for(let i=0;i<n;i++){
        const a=i*2*Math.PI/n,dx=Math.cos(a)*rx,dz=Math.sin(a)*rz;
        lo.push([x+dx,y,z+dz]);hi.push([x+dx*topRatio,y+h,z+dz*topRatio]);
      }
      for(let i=0;i<n;i++){const j=(i+1)%n;face([lo[i],hi[i],hi[j],lo[j]],c,.82+.12*Math.cos(i*2*Math.PI/n-1.9));}
      face(hi,cap);
    };
    const footprint=(x,z,w,d) => shadows.push([x-.08,z-.04,w+.20,d+.22]);
    const feet=(x,z,w,d,h=.15) => {
      for(const xx of [x+.075,x+w-.115])for(const zz of [z+.075,z+d-.115])box(xx,.014,zz,.055,h,.055,charcoal);
    };
    const table=(x,z,w,d,h=.89) => {
      footprint(x,z,w,d);feet(x,z,w,d,h-.045);
      box(x+.045,.29,z+.045,w-.09,.035,d-.09,'#a7b4ac');box(x,h-.052,z,w,.052,d,bright);
    };
    const tray=(x,y,z,w=.45,d=.29) => {
      box(x,y,z,w,.023,d,'#a2afa8');box(x+.014,y+.022,z+.014,w-.028,.008,d-.028,'#d2be9d');
      for(let a=0;a<3;a++)for(let b=0;b<2;b++){
        const sx=x+(a+.5)*w/3,sz=z+(b+.5)*d/2;
        cylinder(sx,y+.030,sz,w*.110,d*.134,.036,clay,'#dfa854',8,.75);
      }
    };
    const grille=(x,y,z,w,n=6) => {for(let i=0;i<n;i++)box(x,y+i*.046,z,w,.013,.012,'#51615c');};
    const pin=(i,x,y,z)=>{pins[i]=[x,y,z];};
    const mix=(x,z,big=false) => {
      const k=big?1.14:1, Y=big?.07:.89;
      box(x-.18*k,Y,z-.20*k,.36*k,.04*k,.40*k,'#6c7973');
      box(x-.105*k,Y+.05*k,z-.16*k,.21*k,.42*k,.15*k,'#8e9992');
      box(x-.14*k,Y+.385*k,z-.18*k,.28*k,.15*k,.39*k,black);
      cylinder(x,Y+.070*k,z+.072*k,.105*k,.10*k,.16*k,metal,black,14,1.31);
      cylinder(x,Y+.238*k,z+.072*k,.124*k,.118*k,.013*k,'#c4cec5','#d5b77e',14);
      box(x-.018*k,Y+.23*k,z+.07*k,.036*k,.17*k,.028*k,bright);
      box(x-.075*k,Y+.431*k,z+.213*k,.040*k,.033*k,.007*k,'#d75d3f');
    };
    const cabinet=(x,z,w,d,h,cold,glass) => {
      footprint(x,z,w,d);feet(x,z,w,d,.15);
      box(x,.13,z,w,h-.13,d,metal);
      box(x+.04,.20,z+d,w-.08,h-.31,.024,'#75837d');
      box(x+.057,.218,z+d+.022,w-.114,h-.36,.018,glass?'#45544d':'#c7d1ca');
      if(glass){for(let i=0;i<8;i++)box(x+.13,.38+i*(h/11),z+d+.043,w-.25,.020,.012,'#899a8f');}
      box(x+w-.115,.55,z+d+.055,.035,.42,.040,black);
      box(x+.085,h-.082,z+d+.024,.19,.045,.013,charcoal);
      box(x+.102,h-.071,z+d+.039,.055,.018,.008,cold?'#98c4ae':'#dba278');
      if(!glass)grille(x+.10,.25,z+d+.046,w-.23,4);
    };
    // The room is a cutaway with a tiled splashback, two open windows and a terrazzo floor.
    pass=-3;box(-4.36,-.20,-2.65,8.72,.20,5.32,'#a18c76');
    pass=-2;box(-4.34,-.03,-2.64,8.68,.03,5.28,'#dfd6c0');
    pass=-1;for(let x=-4;x<4.3;x+=.52)box(x,.001,-2.64,.009,.004,5.28,'#c8c0b0');
    for(let z=-2.59;z<2.6;z+=.52)box(-4.33,.001,z,8.66,.004,.009,'#c8c0b0');
    pass=1;box(-4.33,0,-2.63,8.65,2.08,.12,'#e1ddc8');
    box(-4.33,0,-2.52,.11,1.02,5.14,'#d2d0bc');
    box(-4.31,.04,-2.505,8.6,.14,.026,'#63806f');
    pass=1.1;for(let y=.22;y<2.07;y+=.37)box(-4.31,y,-2.503,8.58,.010,.009,'#c4c8b8');
    for(let x=-4.05;x<4.25;x+=.58)box(x,.205,-2.50,.008,1.87,.009,'#c6c9b9');
    pass=1.2;for(const x of [-2.98,-.40]){
      box(x,1.11,-2.47,1.72,.86,.05,'#52675a');
      box(x+.055,1.16,-2.407,1.61,.75,.010,'#a5c0ad');
      for(let j=0;j<9;j++){
        const xx=x+.07+j*.176;const yy=1.18+(j%3)*.055;
        face([[xx,yy,-2.39],[xx+.12,yy+.31+(j%2)*.14,-2.39],[xx+.072,yy+.065,-2.39]],'#769780');
      }
      box(x+.85,1.15,-2.38,.038,.76,.02,'#e1d8be');
      box(x-.04,1.096,-2.48,1.80,.049,.20,'#c3b895');
    }
    pass=3;
    // Zone one. Mixer and electric hob.
    cluster=1;table(-3.94,-1.99,large?1.25:1.55,.77);mix(-3.61,-1.63);
    if(large)mix(-2.45,-1.59,true);
    box(-3.17,.893,-1.76,.43,.05,.36,black);
    cylinder(-2.96,.945,-1.58,.117,.115,.15,metal,'#765739',16);
    box(-2.86,1.029,-1.60,.125,.027,.033,charcoal);pin(0,-3.20,1.49,-1.66);
    // Zone two. Undercounter cold storage or split upright bank.
    cluster=2;
    if(large){cabinet(.00,-2.24,.71,.68,1.75,true,false);cabinet(.79,-2.24,.71,.68,1.75,true,false);pin(1,.70,1.96,-1.87);}
    else{cabinet(.05,-2.24,1.23,.70,.85,true,false);box(.04,.852,-2.25,1.25,.045,.72,bright);pin(1,.68,1.12,-1.85);}
    // Zone three. Manual marble surface or reversible sheeting belts.
    cluster=3;
    if(large){
      table(-2.36,-.30,2.16,.74,.84);
      box(-2.32,.845,-.264,2.08,.09,.67,'#708178');
      box(-2.285,.945,-.22,2.02,.025,.58,'#d2be94');
      for(const xx of [-2.30,-.31])box(xx,.98,-.22,.035,.045,.58,metal);
      // Two side plates straddle the actual roller opening; the belt runs between them.
      box(-1.52,.97,-.27,.37,.35,.075,metal);
      box(-1.52,.97,.34,.37,.35,.075,metal);
      box(-1.505,1.26,-.20,.34,.07,.55,bright);
      for(const xx of [-1.62,-1.55,-1.47,-1.39])box(xx,1.08,-.18,.017,.022,.49,'#80958d');
      box(-1.64,1.055,-.21,.53,.031,.033,bright);box(-1.64,1.055,.30,.53,.031,.033,bright);
      box(-1.60,.98,-.19,.13,.075,.50,'#a7b8b0');
      for(const xx of [-2.15,-1.93,-.68,-.46])box(xx,.975,-.206,.009,.014,.54,'#bfac87');
      box(-1.20,1.15,.44,.07,.035,.095,'#5a665d');
      box(-1.50,1.19,.421,.33,.13,.035,'#566961');
      for(const xx of [-1.43,-1.33,-1.23])box(xx,1.233,.457,.031,.039,.012,'#d19f55');
      box(-1.88,.979,-.105,.36,.015,.34,'#e4c98c');pin(2,-1.34,1.61,.11);
    }else{
      table(-2.18,-.23,1.70,.78,.89);
      box(-1.98,.894,-.16,1.08,.020,.58,'#e6debd');box(-1.77,.915,-.055,.55,.018,.34,'#e9cd91');
      box(-1.94,.945,-.050,.46,.061,.071,oak);box(-2.01,.962,-.026,.59,.024,.023,'#895e3e');
      box(-.84,.895,.24,.28,.04,.20,'#7b8780');box(-.825,.936,.25,.19,.015,.15,bright);pin(2,-1.39,1.11,.17);
    }
    // Zone four. Convection oven, glazing, its own hood and a stand.
    cluster=4;const ox=large?2.24:2.19,oz=-2.17,ow=large?1.18:.98,od=.85,oy=.79;
    table(ox-.025,oz-.025,ow+.05,od+.05,oy);
    box(ox,oy,oz,ow,.86,od,metal);
    box(ox+.047,oy+.095,oz+od,ow*.73,.66,.035,charcoal);
    box(ox+.090,oy+.141,oz+od+.037,ow*.62,.539,.012,'#42524c');
    for(let i=0;i<4;i++)box(ox+.14,oy+.207+i*.100,oz+od+.053,ow*.52,.015,.008,'#8f9c90');
    box(ox+ow*.72,oy+.19,oz+od+.046,.033,.45,.038,charcoal);
    box(ox+ow*.827,oy+.54,oz+od+.016,ow*.119,.13,.021,black);
    box(ox+ow*.84,oy+.611,oz+od+.041,ow*.07,.022,.009,'#c77f4e');
    grille(ox+ow*.82,oy+.155,oz+od+.016,ow*.115,5);
    box(ox-.09,1.925,oz-.07,ow+.17,.14,od+.15,'#9aa8a2');
    grille(ox+.08,1.963,oz+od+.025,ow*.7,2);
    pin(3,ox+ow*.59,1.74,oz+od*.70);
    // Zone five. The wash pair has individual basins, spouts and a splash guard.
    cluster=5;table(-4.03,.46,.84,1.49,.82);
    for(const [z,depth] of [[.56,.60],[1.29,.47]]){
      box(-3.92,.82,z,.61,.035,depth,'#81998e');box(-3.87,.852,z+.043,.51,.014,depth-.087,'#667f76');
      box(-3.83,.874,z+.08,.431,.012,depth-.15,'#879b91');
      box(-3.97,.835,z+.085,.025,.24,.027,metal);box(-3.97,1.062,z+.084,.16,.024,.026,bright);
      box(-3.835,1.005,z+.085,.024,.077,.024,bright);
    }pin(4,-3.61,1.24,1.36);
    // Zone six. Welded tray trolley, warm pastries and insulated handoff carrier.
    cluster=6;const rx=2.78,rz=.48;
    footprint(rx,rz,.78,.72);
    for(const xx of [rx,rx+.66])for(const zz of [rz,rz+.60]){
      cylinder(xx+.035,.035,zz+.035,.050,.050,.085,charcoal,charcoal,9);
      box(xx,.10,zz,.045,1.29,.045,metal);
    }
    for(let i=0;i<6;i++){
      box(rx+.01,.23+i*.20,rz+.008,.69,.025,.64,'#9eaba3');
      if(i%2===0)tray(rx+.075,.263+i*.20,rz+.083,.52,.42);
    }
    box(2.16,.07,1.30,.74,.42,.48,'#687e6c');box(2.14,.50,1.285,.78,.046,.51,'#849480');
    box(2.42,.548,1.44,.20,.035,.06,black);
    pin(5,3.1,1.63,.75);
    if(large){cluster=7;cabinet(1.46,-.33,.68,.65,1.52,false,true);pin(6,1.75,1.72,.03);}
    return {faces,pins,shadows};
  }
  const bakeSteps=[
    {mark:0,name:'Load',text:'Pipe six test shells evenly onto one lined tray. Leave space for expansion and mark the batch.'},
    {mark:.55,name:'Bake',text:'The shells rise, colour and dry in the heated chamber. Check the tested bake programme for the actual oven and load.'},
    {mark:1,name:'Release',text:'Draw the tray out, transfer the shells to a rack and assess colour, dryness and yield before filling.'}
  ];
  const unit=v=>Math.max(0,Math.min(1,v));
  const ease=(a,b,t)=>{const u=unit((t-a)/(b-a));return u*u*(3-2*u);};
  const chouxSprites=new Map();
  function shellTexture(variant,baked){
    const id=variant*2+Number(baked);if(chouxSprites.has(id))return chouxSprites.get(id);
    const canvas=document.createElement('canvas');canvas.width=136;canvas.height=108;
    const ctx=canvas.getContext('2d'),img=ctx.createImageData(canvas.width,canvas.height),pix=img.data;
    const hash=(x,y,k=0)=>{
      let v=Math.imul(x+14561,374761393)^Math.imul(y-2581,668265263)^Math.imul(variant*31+k*117+39,1274126177);
      v=Math.imul(v^(v>>>13),1274126177);return ((v^(v>>>16))>>>0)/4294967296;
    };
    const noise=(x,y,k)=>{
      const ix=Math.floor(x),iy=Math.floor(y),a=x-ix,b=y-iy,tx=a*a*(3-2*a),ty=b*b*(3-2*b);
      return (hash(ix,iy,k)*(1-tx)+hash(ix+1,iy,k)*tx)*(1-ty)+(hash(ix,iy+1,k)*(1-tx)+hash(ix+1,iy+1,k)*tx)*ty;
    };
    const cells=[];for(let i=0;i<26;i++){
      const a=hash(i,5)*Math.PI*2,r=Math.sqrt(hash(i,9))*.98;
      cells.push([r*Math.cos(a),r*Math.sin(a),hash(i,12)]);
    }
    for(let j=0;j<canvas.height;j++)for(let i=0;i<canvas.width;i++){
      const x=(i+.5)/canvas.width*2-1,y=(j+.5)/canvas.height*2-1,ang=Math.atan2(y,x),rad=Math.hypot(x,y);
      const shape=.92+(baked?.024:.016)*Math.sin(9*ang+variant*.43)+.016*Math.sin(5*ang+variant*.72)+.012*Math.cos(14*ang+variant);
      const r=rad/shape;if(r>1.01)continue;
      const nx=x/shape,ny=y/shape,nz=Math.sqrt(Math.max(0,1-r*r)),index=(j*canvas.width+i)*4;
      const n=noise(x*8.1+1.27,y*8.9-.37,3),fine=noise(x*28,y*31,4),grain=hash(i,j,7);
      const light=Math.max(0,-.39*nx-.56*ny+.71*nz);
      let rr,gg,bb;
      if(baked){
        const vx=x+.048*Math.sin(y*12.7+1.2)+.033*(n-.5),vy=y+.051*Math.sin(x*11.4)+.048*(n-.5);
        let first=10,second=10,patch=0;
        for(const c of cells){const d=(vx-c[0])**2+(vy-c[1])**2;if(d<first){second=first;first=d;patch=c[2];}else if(d<second)second=d;}
        const line=(Math.sqrt(second)-Math.sqrt(first)),crack=1-ease(.006,.053,line),rim=ease(.012,.050,line)*(1-ease(.050,.115,line));
        const broad=noise(x*3.4+1,y*3.6,9),browning=16*(patch-.5)+26*(broad-.5);
        const pock=(fine>.70&&grain>.62?1:0),d = 23*(n-.5)+15*(fine-.5)+8*(grain-.5)-pock*15+browning;
        rr=133+112*light+d-42*crack+15*rim;gg=65+107*light+d*.90-42*crack+19*rim;bb=23+58*light+d*.63-20*crack+14*rim;
      }else{
        const sx=x+.035,sy=y+.19,sr=Math.hypot(sx,sy),sa=Math.atan2(sy,sx);
        const spiral=Math.cos(sr*28.1-sa+variant*.14),ridge=spiral*(.42+.58*unit(sr*3.2));
        const d=11*ridge+6*(n-.5)+4*(grain-.5);
        rr=176+71*light+d;gg=135+78*light+d;bb=83+71*light+d;
      }
      pix[index]=rr;pix[index+1]=gg;pix[index+2]=bb;pix[index+3]=Math.round(255*unit((1.01-r)*58));
    }
    ctx.putImageData(img,0,0);chouxSprites.set(id,canvas);return canvas;
  }
  function renderBake(ctx,w,h,progress,large){
    const close=ease(.17,.35,progress),open=ease(.69,.85,progress);
    const door=(1-close+open)*1.50,slide=1-ease(.025,.19,progress)+ease(.84,.99,progress);
    const rise=ease(.34,.65,progress),heat=ease(.26,.44,progress)*(1-.42*ease(.84,.99,progress));
    const proj=([x,y,z])=>{const d=7.8/(7.8-z*.56-x*.10-y*.075);return [(x*.97-z*.21)*d,(-y*.96+z*.38+x*.047)*d];};
    const bound=[[-1.69,-.05,-1.17],[-1.69,2.12,0],[1.76,2.22,-1.18],[1.76,.01,0],[-1.47,.27,2.23],[.80,.73,1.70]].map(proj);
    const xs=bound.map(p=>p[0]),ys=bound.map(p=>p[1]),lo=Math.min(...xs),hi=Math.max(...xs),up=Math.min(...ys),bt=Math.max(...ys);
    const margin=w<450?10:22,s=Math.min((w-margin*2)/(hi-lo),(h-margin*2)/(bt-up));
    const dx=(w-(hi+lo)*s)*.5,dy=(h-(bt+up)*s)*.5;
    const P=(x,y,z)=>{const q=proj([x,y,z]);return [dx+q[0]*s,dy+q[1]*s];};
    const grad=(p,q,stops)=>{const g=ctx.createLinearGradient(...p,...q);stops.forEach(([t,c])=>g.addColorStop(t,c));return g;};
    const path=pts=>{ctx.beginPath();ctx.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)ctx.lineTo(...pts[i]);ctx.closePath();};
    const shape=(pts,c,edge,line=1)=>{path(pts);ctx.fillStyle=c;ctx.fill();if(edge){ctx.strokeStyle=edge;ctx.lineWidth=line;ctx.stroke();}};
    const stroke=(pts,c,l=1)=>{ctx.beginPath();ctx.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)ctx.lineTo(...pts[i]);ctx.strokeStyle=c;ctx.lineWidth=l;ctx.stroke();};
    const Q=(pts,fill,edge,line)=>shape(pts.map(p=>P(...p)),fill,edge,line);
    const seg=(a,b,c,l=1)=>stroke([P(...a),P(...b)],c,l);
    const quad=(x1,y1,x2,y2,z,c,edge)=>Q([[x1,y1,z],[x2,y1,z],[x2,y2,z],[x1,y2,z]],c,edge);
    const circle=(x,y,z,rx,ry,fill,edge)=>{
      const center=P(x,y,z),end=P(x+rx,y+ry,z);
      ctx.beginPath();ctx.ellipse(...center,Math.abs(end[0]-center[0]),Math.abs(end[1]-center[1]),.05,0,Math.PI*2);
      if(fill){ctx.fillStyle=fill;ctx.fill();}if(edge){ctx.strokeStyle=edge;ctx.lineWidth=Math.max(.5,.007*s);ctx.stroke();}
    };
    const brushed=(x1,y1,x2,y2,z,count,opacity=.13)=>{
      for(let i=0;i<count;i++){
        const t=(i+.5)/count,span=.23+((i*29)%65)/100,start=((i*41)%83)/100*(1-span);
        seg([x1+(x2-x1)*start,y1+(y2-y1)*t,z],[x1+(x2-x1)*(start+span),y1+(y2-y1)*t,z],i%3?'rgba(255,255,248,'+opacity+')':'rgba(36,45,43,'+opacity+')',.47);
      }
    };
    const steel=grad(P(-1.6,2.1,0),P(1.6,.3,0),[[0,'#cbd3ce'],[.18,'#a0a9a6'],[.38,'#d2d7d1'],[.57,'#87918d'],[.79,'#e3e1d2'],[1,'#8e9791']]);
    const deck=ctx.createRadialGradient(w*.47,h*.42,2,w*.52,h*.54,Math.max(w,h)*.67);
    deck.addColorStop(0,'#616c5d');deck.addColorStop(.52,'#384238');deck.addColorStop(1,'#1d2721');ctx.fillStyle=deck;ctx.fillRect(0,0,w,h);
    // Existing stainless stand, oven chassis and folded edges.
    const floor=P(0,-.05,.15);ctx.save();ctx.translate(...floor);ctx.scale(1,.19);const ground=ctx.createRadialGradient(0,0,0,0,0,1.82*s);
    ground.addColorStop(0,'rgba(5,10,6,.65)');ground.addColorStop(1,'rgba(5,10,6,0)');ctx.fillStyle=ground;ctx.fillRect(-1.85*s,-1.85*s,3.7*s,3.7*s);ctx.restore();
    for(const x of [-1.43,1.46]){quad(x,-.06,x+.09,.21,-.01,'#707a72','#505950');}
    Q([[-1.58,.12,0],[-1.58,.12,-1.07],[1.67,.12,-1.07],[1.67,.12,0]],'#90998c');
    quad(-1.62,.05,1.69,.15,.02,'#9ba197','#747e73');
    Q([[1.59,.16,.0],[1.59,.16,-1.15],[1.59,2.12,-1.15],[1.59,2.12,.0]],grad(P(1.59,2.12,-1.15),P(1.59,.16,0),[[0,'#777e76'],[.6,'#626c66'],[1,'#89938c']]),'#535c55');
    for(let i=0;i<7;i++)seg([1.597,.32+i*.053,-.96],[1.597,.32+i*.053,-.39],'#4f5952',1);
    Q([[-1.58,2.12,.0],[-1.58,2.12,-1.15],[1.59,2.12,-1.15],[1.59,2.12,.0]],grad(P(0,2.12,-1.15),P(0,2.12,0),[[0,'#949d92'],[.7,'#b7beb4'],[1,'#d9dcd1']]),'#9ba297');
    quad(-1.58,.14,1.59,2.12,.0,steel,'#788177');
    brushed(-1.55,1.97,1.55,2.115,.012,19,.15);brushed(-1.54,.15,1.56,.30,.012,15,.12);
    // A true recessed chamber with a fan, side runners and two incandescent oven lights.
    const x1=-1.47,x2=.81,y1=.30,y2=1.97,front=.019,back=-.70;
    quad(x1-.026,y1-.024,x2+.026,y2+.024,.012,'#30362e');
    const inner=[[x1,y1,front],[x2,y1,front],[x2,y2,front],[x1,y2,front]].map(p=>P(...p));path(inner);ctx.save();ctx.clip();
    quad(x1,y1,x2,y2,back,grad(P(x1,y2,back),P(x2,y1,back),[[0,'#362f23'],[.6,heat>.25?'#59503b':'#48483a'],[1,'#34362d']]));
    Q([[x1,y1,front],[x1,y1,back],[x1,y2,back],[x1,y2,front]],'#555444');
    Q([[x2,y1,front],[x2,y1,back],[x2,y2,back],[x2,y2,front]],'#68634c');
    Q([[x1,y2,front],[x1,y2,back],[x2,y2,back],[x2,y2,front]],'#413f31');
    Q([[x1,y1,front],[x1,y1,back],[x2,y1,back],[x2,y1,front]],'#616050');
    circle(-.26,1.22,back+.018,.39,.39,'#2e332b','#676851');
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6+Math.PI*5.2*ease(.32,.72,progress);
      seg([-.26+.12*Math.cos(a),1.22+.12*Math.sin(a),back+.023],[-.26+.31*Math.cos(a+.4),1.22+.31*Math.sin(a+.4),back+.023],'#787461',Math.max(1,s*.021));
    }
    for(let r=.11;r<.39;r+=.063)circle(-.26,1.22,back+.027,r,r,null,'#88836b');
    for(let i=0;i<4;i++){
      const y=.55+i*.285;
      for(const x of [x1+.036,x2-.036]){seg([x,y,-.66],[x,y,.018],'#a39d82',Math.max(1,s*.015));}
    }
    for(const x of [x1+.17,x2-.17]){
      const q=P(x,1.85,-.26),g=ctx.createRadialGradient(...q,0,...q,s*.39);
      g.addColorStop(0,'rgba(255,207,109,'+(.30+heat*.50)+')');g.addColorStop(1,'rgba(255,178,65,0)');
      ctx.fillStyle=g;ctx.fillRect(q[0]-s*.40,q[1]-s*.40,s*.8,s*.8);circle(x,1.85,-.255,.068,.035,'#ffe6ad');
    }
    ctx.restore();
    // Controls on the fixed fascia remain visible with the door open.
    quad(.97,.34,1.47,1.96,.025,'#444c46','#82897d');quad(1.02,1.37,1.42,1.79,.037,'#202e29','#77847a');
    const led=grad(P(1.03,1.73,.05),P(1.41,1.40,.05),[[0,'#61756a'],[1,'#303d33']]);quad(1.065,1.48,1.375,1.70,.044,led);
    const sy=P(1.095,1.56,.052),fs=Math.max(5,s*.062);ctx.fillStyle='#e6cf9a';ctx.font='600 '+fs+'px monospace';ctx.fillText(progress>.84?'DONE':heat>.5?'BAKE':'READY',sy[0],sy[1]);
    for(const y of (large?[1.19,.92]:[1.17,.90])){circle(1.23,y,.05,.102,.101,'#282d28','#aeb4a7');circle(1.23,y,.053,.066,.065,'#7f8a80');seg([1.23,y,.064],[1.20,y+.048,.064],'#e5e9d9',Math.max(1,.010*s));}
    for(let i=0;i<5;i++)quad(1.072,.45+i*.046,1.37,.462+i*.046,.032,'#222d28');
    // Six individually lit piped shells, from pale spirals to deeply fissured baked crowns.
    const puff=(x,z,seed)=>{
      const c=P(x,.788,z),ex=P(x+.21,.788,z),wx=Math.abs(ex[0]-c[0])*(.74+rise*.33);
      const ry=wx*(.49+.19*rise),cy=c[1]-ry*.34;
      ctx.save();ctx.translate(c[0],cy);ctx.rotate(.015*Math.sin(seed));
      const sh=ctx.createRadialGradient(0,ry*.48,0,0,ry*.48,wx*1.17);sh.addColorStop(0,'rgba(62,29,14,.52)');sh.addColorStop(1,'rgba(62,29,14,0)');
      ctx.save();ctx.scale(1,.41);ctx.fillStyle=sh;ctx.fillRect(-wx*1.3,-wx*1.2,wx*2.6,wx*2.6);ctx.restore();
      const v=Math.abs(Math.round(seed))%11;
      const draw=sprite=>ctx.drawImage(sprite,-wx*1.09,-ry*1.13,wx*2.18,ry*2.20);
      if(rise<.999)draw(shellTexture(v,false));
      if(rise>.001){ctx.globalAlpha=rise;draw(shellTexture(v,true));}
      ctx.restore();
    };
    const drawTray=()=>{
      const dz=1.79*slide,z0=-.655+dz,z1=.005+dz,yt=.766,l=-1.345,r=.69;
      Q([[l,yt,z0],[r,yt,z0],[r,yt,z1],[l,yt,z1]],grad(P(l,yt,z0),P(r,yt,z1),[[0,'#a5a89a'],[.46,'#d6d9c8'],[1,'#b4baa9']]),'#767e70');
      Q([[l+.043,yt+.008,z0+.035],[r-.04,yt+.008,z0+.035],[r-.04,yt+.008,z1-.03],[l+.043,yt+.008,z1-.03]],'#d4bb91');
      for(const z of [z0+.15,z1-.16])for(let j=0;j<3;j++)puff(l+.35+j*.66,z,.77+j*3.3+(z-z0)*19);
      Q([[l,yt-.045,z1],[r,yt-.045,z1],[r,yt+.018,z1],[l,yt+.018,z1]],'#98a397','#647165');
      seg([l,yt+.024,z1],[r,yt+.024,z1],'#dbe1cd',Math.max(.55,.010*s));
    };
    const hinge=x1-.025,zhinge=.038,doorWidth=2.32;
    const doorPoint=(u,y,d=0)=>[hinge+u*Math.cos(door)-d*Math.sin(door),y,zhinge+u*Math.sin(door)+d*Math.cos(door)];
    const dquad=(u,y,U,Y,d,fill,edge)=>Q([doorPoint(u,y,d),doorPoint(U,y,d),doorPoint(U,Y,d),doorPoint(u,Y,d)],fill,edge);
    const drawDoor=()=>{
      const dw=doorWidth,yl=.28,yt=1.99,glass=grad(P(...doorPoint(.15,yt)),P(...doorPoint(dw-.17,yl)),[[0,'rgba(111,141,126,.33)'],[.35,'rgba(49,72,61,.22)'],[.68,'rgba(70,81,64,.20)'],[1,'rgba(37,49,41,.39)']]);
      dquad(.12,yl+.13,dw-.12,yt-.14,.012,glass,'rgba(203,205,184,.52)');
      Q([doorPoint(.19,yt-.15,.016),doorPoint(.28,yt-.15,.016),doorPoint(.93,yl+.15,.016),doorPoint(.81,yl+.15,.016)],'rgba(255,253,224,.12)');
      for(const [u,y,U,Y] of [[0,yl,dw,yl+.12],[0,yt-.14,dw,yt],[0,yl,.13,yt],[dw-.13,yl,dw,yt]])dquad(u,y,U,Y,.025,'#39443d','#202a25');
      for(const z of [.047,.082])dquad(dw-.149,.79,dw-.10,1.50,z,'#252e29','#809084');
      Q([doorPoint(dw-.15,.79,.047),doorPoint(dw-.15,.79,.16),doorPoint(dw-.15,1.5,.16),doorPoint(dw-.15,1.5,.047)],'#666f63');
      dquad(dw-.16,.77,dw-.086,1.52,.16,'#434e45','#9ca294');
    };
    if(slide>.58){drawDoor();drawTray();}else{drawTray();drawDoor();}
    if(heat>.2&&slide<.25){
      const q=P(-.34,1.00,-.12),g=ctx.createRadialGradient(...q,0,...q,.9*s);
      g.addColorStop(0,'rgba(252,153,42,'+heat*.065+')');g.addColorStop(1,'rgba(252,153,42,0)');
      ctx.fillStyle=g;ctx.fillRect(q[0]-s,q[1]-s,s*2,s*2);
    }
  }
  const camera = { room:[-.47,.48],front:[-.015,.31],plan:[-.015,1.25],station:[-.50,.41] };
  const centers = [[0,0],[-3.23,-1.66],[.73,-1.86],[-1.27,.09],[2.8,-1.75],[-3.60,1.19],[3.04,1.00],[1.8,0]];
  class KitchenStage extends HTMLElement {
    connectedCallback(){
      if(this.canvas)return;
      this.bakeOpen=false;this.bakeTime=0;this.bakeFrame=0;this.bakeMoving=false;this.large=false;this.active=3;this.angle=camera.room[0];this.pitch=camera.room[1];this.scene=model(false);
      this.innerHTML=`<section class="ks-shell" aria-label="Interactive three-dimensional bakehouse">
        <div class="ks-heading"><div><p class="ks-kicker">The working bakehouse</p><h2>Inside the kitchen<span>.</span></h2></div>
        <p>Lift the roof and follow a pastry from mixer to handoff. Choose a fit-out, then select a station to inspect the equipment and its cost.</p></div>
        <div class="ks-options"><div class="ks-toggle" role="group" aria-label="Kitchen investment model"><button data-fit="minimal">Minimal pickup</button><button data-fit="flagship">Garden flagship</button></div>
        <p class="ks-total"><small></small><strong></strong></p></div>
        <div class="ks-room"><div class="ks-visual"><div class="ks-scene" aria-label="Kitchen cutaway viewer"><canvas tabindex="0" aria-label="Rotatable kitchen model. Use left and right arrows to orbit, up and down to tilt, Home to reset. Station buttons follow."></canvas><div class="ks-pins"></div><button class="ks-bake-back" type="button" data-bake-action="back" hidden>← Kitchen view</button></div>
        <div class="ks-bake-bar" hidden><div class="ks-bake-line"><div class="ks-bake-phases" aria-label="Choose a pastry-making stage" role="group"><button type="button" data-bake-step="0">Load</button><button type="button" data-bake-step="1">Bake</button><button type="button" data-bake-step="2">Release</button></div><button type="button" class="ks-bake-play" data-bake-action="play">Play sequence</button></div><p class="ks-bake-caption" role="status" aria-live="polite"></p></div>
        <div class="ks-tools"><span class="ks-drag">Drag to orbit</span><div class="ks-cameras" role="group" aria-label="Camera position"><button data-camera="room">Cutaway</button><button data-camera="front">Front</button><button data-camera="plan">Plan</button><button data-camera="station">Inspect</button></div></div>
        </div><div class="ks-detail" aria-live="polite"></div></div>
        <div class="ks-index" role="group" aria-label="Equipment stations"></div>
        <p class="ks-note">Schematic positions and working zones. Confirm clearances, service connections, drains and measured room size before ordering.</p>
      </section>`;
      this.canvas=this.querySelector('canvas');this.ctx=this.canvas.getContext('2d');
      this.lifecycle=new AbortController();this.addEventListener('click',e=>{
        const b=e.target.closest('button');if(!b)return;
        if(b.dataset.bakeAction){
          if(b.dataset.bakeAction==='open')this.openBake();
          else if(b.dataset.bakeAction==='back')this.closeBake(true);
          else if(b.dataset.bakeAction==='play')this.toggleBake();
          return;
        }
        if(b.dataset.bakeStep!==undefined){this.chooseBake(Number(b.dataset.bakeStep));return;}
        if(b.dataset.fit){const large=b.dataset.fit==='flagship';if(large!==this.large){
          this.closeBake(false);this.large=large;this.scene=model(large);this.active=Math.min(this.active,this.scene.pins.length-1);this.refresh();
        }}else if(b.dataset.camera)this.setCamera(b.dataset.camera);
        else if(b.dataset.station!==undefined){this.closeBake(false);this.active=Number(b.dataset.station);this.describe();this.draw();}
      },{signal:this.lifecycle.signal});
      this.querySelector('.ks-bake-bar').addEventListener('keydown',e=>{
        if(this.bakeOpen&&e.key==='Escape'){e.preventDefault();this.closeBake(true);}
      });
      const surface=this.querySelector('.ks-scene');let drag=null;
      surface.addEventListener('pointerdown',e=>{
        if(this.bakeOpen||e.target.closest('button')||e.button!==0)return;
        drag={x:e.clientX,y:e.clientY,a:this.angle,p:this.pitch,id:e.pointerId};
        surface.setPointerCapture(e.pointerId);surface.classList.add('ks-grabbing');
      });
      surface.addEventListener('pointermove',e=>{
        if(!drag||e.pointerId!==drag.id)return;
        this.angle=drag.a+(e.clientX-drag.x)*.008;this.pitch=drag.p-(e.clientY-drag.y)*.006;this.constrain();this.flagCamera();this.draw();
      });
      const end=()=>{drag=null;surface.classList.remove('ks-grabbing');};
      surface.addEventListener('pointerup',end);surface.addEventListener('pointercancel',end);
      this.canvas.addEventListener('keydown',e=>{
        if(this.bakeOpen){
          const actions={ArrowLeft:-1,ArrowRight:1,Home:0,End:2};
          if(e.key==='Escape'){e.preventDefault();this.closeBake(true);return;}
          if(e.key===' '){e.preventDefault();this.toggleBake();return;}
          if(e.key in actions){e.preventDefault();this.chooseBake(e.key==='Home'?0:e.key==='End'?2:Math.max(0,Math.min(2,this.bakeStep+actions[e.key])));}
          return;
        }
        if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();
        if(e.key==='Home'){this.setCamera('room');return;}
        if(e.key==='ArrowLeft')this.angle-=.13;if(e.key==='ArrowRight')this.angle+=.13;
        if(e.key==='ArrowUp')this.pitch+=.1;if(e.key==='ArrowDown')this.pitch-=.1;
        this.constrain();this.flagCamera();this.draw();
      });
      this.resize=new ResizeObserver(()=>this.draw());this.resize.observe(surface);
      this.refresh();this.flagCamera('room');
    }
    disconnectedCallback(){this.lifecycle?.abort();this.stopBake();this.resize?.disconnect();this.canvas=null;this.innerHTML='';}
    constrain(){this.angle=Math.max(-1.22,Math.min(1.22,this.angle));this.pitch=Math.max(.24,Math.min(1.43,this.pitch));}
    setCamera(key){this.isolate=key==='station';[this.angle,this.pitch]=camera[key];this.flagCamera(key);this.draw();}
    flagCamera(key){if(!key&&this.isolate)key='station';this.querySelectorAll('[data-camera]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.camera===key)));}
    get stations(){return this.large?flagship:minimal;}
    refresh(){
      this.querySelectorAll('[data-fit]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.fit==='flagship')===this.large)));
      this.querySelector('.ks-total small').textContent=this.large?'Kitchen & services':'Equipment & dispatch';
      this.querySelector('.ks-total strong').textContent=inr(this.large?1170800:253460);
      this.querySelector('.ks-pins').innerHTML=this.stations.map((s,i)=>`<button class="ks-pin" data-station="${i}" aria-label="Station ${i+1}, ${s[0]}">${String(i+1).padStart(2,'0')}</button>`).join('');
      this.querySelector('.ks-index').innerHTML=this.stations.map((s,i)=>`<button data-station="${i}"><small>${String(i+1).padStart(2,'0')}</small> ${s[0]}</button>`).join('');
      this.describe();this.draw();
    }
    describe(){
      const [short,title,cost,note,zone,book,page]=this.stations[this.active], label=book==='pickup'?'Pickup':'Expanded';
      this.querySelector('.ks-detail').innerHTML=`<p class="ks-tag">Station ${String(this.active+1).padStart(2,'0')} / ${this.stations.length} <span>${short}</span></p><h3>${title}</h3><strong class="ks-price">${inr(cost)}</strong><p>${note}</p><div class="ks-foot"><small>Footprint</small><span>${zone}</span></div><a href="/study/${book}-study.pdf#page=${page}" target="_blank" rel="noopener">${label} study · p. ${page} ↗</a>`;
      if(this.active===3){
        const open=document.createElement('button');open.type='button';open.className='ks-bake-open';open.dataset.bakeAction='open';open.textContent='Bake a tray of choux ↗';
        this.querySelector('.ks-detail .ks-foot').before(open);
      }
      this.querySelectorAll('[data-station]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.station)===this.active)));
      const link=this.large?'investor-study.pdf#page=14':'pickup-study.pdf#page=33';
      this.querySelector('.ks-note').innerHTML='Schematic positions and working zones. Confirm clearance and services on site. '+(this.large?'The flagship total includes installation, services and shared tools beyond the station prices. ':'The six pickup station groups reconcile to the equipment and dispatch total. ')+`<a href="/study/${link}" target="_blank" rel="noopener">Budget basis ↗</a>`;
    }
    stopBake(){
      if(this.bakeFrame)cancelAnimationFrame(this.bakeFrame);this.bakeFrame=0;this.bakeMoving=false;
    }
    openBake(){
      this.stopBake();this.bakeOpen=true;this.bakeTime=0;this.bakeStep=-1;
      this.bakeOriginalLabel=this.canvas.getAttribute('aria-label');
      this.classList.add('ks-baking');this.querySelector('.ks-bake-bar').hidden=false;
      this.querySelector('.ks-bake-back').hidden=false;this.querySelector('.ks-tools').hidden=true;this.querySelector('.ks-pins').hidden=true;
      this.querySelector('.ks-bake-open').hidden=true;
      this.canvas.setAttribute('aria-label','Interactive choux oven sequence. Left and right select stages, Space plays or pauses, and Escape returns to the kitchen.');
      this.showBakeStep();this.draw();this.canvas.focus({preventScroll:true});
      const scene=this.querySelector('.ks-scene'),r=scene.getBoundingClientRect();
      if(r.bottom<96||r.top>window.innerHeight*.75)scene.scrollIntoView({block:'center',behavior:'instant'});
    }
    closeBake(restore){
      if(!this.bakeOpen)return;this.stopBake();this.bakeOpen=false;
      this.classList.remove('ks-baking');this.querySelector('.ks-bake-bar').hidden=true;
      this.querySelector('.ks-bake-back').hidden=true;this.querySelector('.ks-tools').hidden=false;this.querySelector('.ks-pins').hidden=false;
      this.canvas.setAttribute('aria-label',this.bakeOriginalLabel);
      const launch=this.querySelector('.ks-bake-open');if(launch){launch.hidden=false;if(restore)launch.focus({preventScroll:true});}
      this.draw();
    }
    showBakeStep(){
      const stage=this.bakeTime<.34?0:this.bakeTime<.76?1:2;
      if(stage!==this.bakeStep){
        this.bakeStep=stage;
        this.querySelectorAll('[data-bake-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.bakeStep)===stage)));
        this.querySelector('.ks-bake-caption').textContent=bakeSteps[stage].text+(stage===0?' Trial tray size is '+(this.large?'600 × 400 mm.':'450 × 340 mm.'):'');
      }
      const play=this.querySelector('.ks-bake-play');
      play.hidden=matchMedia('(prefers-reduced-motion: reduce)').matches;
      play.textContent=this.bakeMoving?'Pause':this.bakeTime>=.999?'Replay sequence':'Play sequence';
    }
    moveBake(to,ms){
      this.stopBake();const start=this.bakeTime;
      if(matchMedia('(prefers-reduced-motion: reduce)').matches||!ms||Math.abs(start-to)<.001){this.bakeTime=to;this.showBakeStep();this.draw();return;}
      const now=performance.now();this.bakeMoving=true;this.showBakeStep();
      const tick=t=>{
        if(!this.bakeOpen)return;
        const elapsed=unit((t-now)/ms);this.bakeTime=start+(to-start)*elapsed;
        if(elapsed>=1){this.bakeFrame=0;this.bakeMoving=false;this.bakeTime=to;}
        this.showBakeStep();this.draw();if(elapsed<1)this.bakeFrame=requestAnimationFrame(tick);
      };this.bakeFrame=requestAnimationFrame(tick);
    }
    chooseBake(index){
      if(!this.bakeOpen)return;
      const mark=bakeSteps[index].mark;this.moveBake(mark,Math.min(1750,Math.abs(this.bakeTime-mark)*2850));
    }
    toggleBake(){
      if(!this.bakeOpen)return;
      if(this.bakeMoving){this.stopBake();this.showBakeStep();return;}
      if(matchMedia('(prefers-reduced-motion: reduce)').matches){this.chooseBake((this.bakeStep+1)%3);return;}
      if(this.bakeTime>=.999)this.bakeTime=0;
      this.moveBake(1,(1-this.bakeTime)*7900);
    }
    draw(){
      const c=this.canvas,ctx=this.ctx;if(!c)return;
      const w=c.clientWidth,h=c.clientHeight;if(!w||!h)return;
      const dpr=Math.min(window.devicePixelRatio||1,2);
      if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);}
      if(this.bakeOpen&&ctx){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);renderBake(ctx,w,h,this.bakeTime,this.large);return;}
      const ca=Math.cos(this.angle),sa=Math.sin(this.angle),si=Math.sin(this.pitch),co=Math.cos(this.pitch);
      const raw=([x,y,z])=>{const sl=x*sa+z*ca;return [x*ca-z*sa,sl*si-y*co,sl*co+y*si];};
      const stationFaces=this.scene.faces.filter(f=>f.cluster===this.active+1&&f.pass===3);
      let corners=[];for(const x of [-4.38,4.38])for(const z of [-2.65,2.65])corners.push(raw([x,-.20,z]));
      for(const x of [-4.33,4.33])corners.push(raw([x,2.1,-2.62]));
      corners.push(raw([-4.33,1.03,2.62]));
      let stationBounds;
      if(this.isolate){
        const pts=stationFaces.flatMap(f=>f.points);const xs=pts.map(p=>p[0]),zs=pts.map(p=>p[2]);stationBounds=[Math.min(...xs)-.18,Math.min(...zs)-.18,Math.max(...xs)+.18,Math.max(...zs)+.18];
        const [x,z,X,Z]=stationBounds;corners=pts.map(raw).concat([[x,0,z],[x,0,Z],[X,0,Z],[X,0,z]].map(raw));
      }
      const xmin=Math.min(...corners.map(p=>p[0])),xmax=Math.max(...corners.map(p=>p[0])),ymin=Math.min(...corners.map(p=>p[1])),ymax=Math.max(...corners.map(p=>p[1]));
      const pad=w<460?17:29, factor=Math.min((w-2*pad)/(xmax-xmin),(h-pad*2-10)/(ymax-ymin));
      const ox=(w-(xmax+xmin)*factor)/2,oy=(h-(ymax+ymin)*factor)/2+1;
      const project=p=>{const [x,y,z]=raw(p);return [ox+factor*x,oy+factor*y,z];};
      const pins=this.querySelectorAll('.ks-pin');
      this.scene.pins.forEach((p,i)=>{const [x,y]=project(p);pins[i].hidden=!!this.isolate;pins[i].style.left=x+'px';pins[i].style.top=y+'px';});
      if(!ctx)return;
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      const poly=(pts,col,edgeless=false)=>{
        ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let j=1;j<pts.length;j++)ctx.lineTo(pts[j][0],pts[j][1]);ctx.closePath();
        ctx.fillStyle=col;ctx.fill();if(!edgeless){ctx.strokeStyle=col;ctx.lineWidth=.32;ctx.stroke();}
      };
      const contour=[[-4.36,-.23,-2.66],[4.36,-.23,-2.66],[4.36,-.23,2.66],[-4.36,-.23,2.66]].map(project);
      ctx.save();ctx.shadowBlur=16;ctx.shadowOffsetY=8;ctx.shadowColor='rgba(66,47,28,.30)';poly(contour,'#c1b29c',true);ctx.restore();
      if(this.isolate){
        ctx.clearRect(0,0,w,h);const [x,z,X,Z]=stationBounds;
        const base=[[x,-.01,z],[X,-.01,z],[X,-.01,Z],[x,-.01,Z]].map(project);
        ctx.save();ctx.shadowBlur=15;ctx.shadowOffsetY=5;ctx.shadowColor='rgba(67,51,37,.19)';poly(base,'#d9d3bb',true);ctx.restore();
      }
      const objects=(this.isolate?stationFaces:this.scene.faces).map(f=>{
        const pts=f.points.map(project),depth=pts.reduce((s,p)=>s+p[2],0)/pts.length;
        return {...f,pts,depth};
      });
      const order=(a,b)=>a.pass-b.pass||((a.pass===3 && a.cluster!==b.cluster)?(centers[a.cluster][0]-centers[b.cluster][0])*sa+(centers[a.cluster][1]-centers[b.cluster][1])*ca:a.depth-b.depth);
      objects.sort(order);
      let shadow=false;for(const f of objects){
        if(!this.isolate&&!shadow&&f.pass===3){
          for(const [x,z,wid,d] of this.scene.shadows){
            const ps=[[x,.012,z],[x+wid,.012,z],[x+wid,.012,z+d],[x,.012,z+d]].map(project);
            poly(ps,'rgba(91,83,65,.13)',true);
          }shadow=true;
        }
        poly(f.pts,f.color);
      }
    }
  }
  if(!customElements.get('kitchen-stage'))customElements.define('kitchen-stage',KitchenStage);
})();
