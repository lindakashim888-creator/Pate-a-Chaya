/* Garden model. All dimensions are relative to the supplied compound views. */
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const ORBIT = -24;
const HEIGHT = 30;
const stops = [
  {label: 'Bakehouse', point: [6, 6.6, -8], angle: -26, copy: 'The taller gabled building becomes the production kitchen. A sheltered threshold connects it to the ground-level service route.'},
  {label: 'Pastry counter', point: [-5.5, 4.5, 5], angle: 140, copy: 'The lower pavilion faces the court. The proposed counter and collection point sit under its existing roofline, with shelves and service kept close to the kitchen route.'},
  {label: 'Garden tables', point: [5.3, 1.3, 3.3], angle: 18, copy: 'Six tables make 24 daily places. Booked gatherings can add 16 ground-level places once the measured layout, dry cover and guest access permit them.'},
  {label: 'Bamboo hut', point: [-12.2, 4.6, -6.5], angle: -62, copy: 'Bamboo wraps the small elevated hut near the approach. Visitors can see it from the ground. The model assigns all guest seating to the courtyard and pavilion.'},
  {label: 'Service annex', point: [14, 3.2, 4.3], angle: 68, copy: 'The small side structure sits against the boundary. Its proposed back-of-house role keeps deliveries, storage and returns off the main guest route.'}
];
const add = (a, b) => a.map((v, i) => v + b[i]);
const sub = (a, b) => a.map((v, i) => v - b[i]);
const mul = (v, n) => v.map(x => x * n);
const dot = (a, b) => a.reduce((total, x, i) => total + x * b[i], 0);
const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const norm = a => mul(a, 1 / (Math.hypot(...a) || 1));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const rgb = hex => hex.replace('#','').match(/../g).map(n => parseInt(n, 16) / 255);
const sun = norm([-6, 12, 5]);
const luminousMaterials=new Set(['efcb89','f4d597','f2cf90','f0af5e']);
const plasterMaterials=new Set(['faf3db','e2dcc0','d6d0b4','b0a98f','cbc3a9','797d67','a3a18a','c8c9a8','d1c9a6','8a8973']);
const boardMaterials=new Set(['927f5a','b99b6e','b99663','ad875a','c5a573','a27d52','ad8b67','b28e68']);
let grainTile;
function gardenGrain(){
  if(grainTile)return grainTile;
  const size=256,bytes=new Uint8Array(size*size),values=new Float32Array(bytes.length);
  let seed=5039;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    // Tileable weathering with drifting broad patches, aggregate and pinprick grit.
    seed=(Math.imul(1664525,seed)+1013904223)>>>0;
    const random=seed/4294967296,u=x*TAU/size,v=y*TAU/size;
    let grain=.27*Math.sin(u*3+Math.sin(v*3))+.17*Math.cos(v*5-1.3*Math.sin(u*2))
      +.105*Math.sin(u*9+v*7+Math.cos(v*3))+.08*Math.cos(u*17-v*9)
      +.48*(random-.5);
    if(random<.03)grain-=.50;
    if(random>.962)grain+=.39;
    const val=Math.round(clamp(127.5+grain*127.5,0,255));
    bytes[x+y*size]=val;values[x+y*size]=val/127.5-1;
  }
  return grainTile={bytes,values};
}
const entryGate={x:-18.91, south:-7.39, north:-2.06, leaf:2.61, angle:86*DEG};
function buildModel(parcel="garden") {
  const walking=parcel==='walk-event'||parcel==='walk-garden';
  const moving=[];
  const remember=(kind,start,properties)=>moving.push({kind,start,original:new Float32Array(coords.slice(start)),...properties});
  const coords = [], colors = [], surfaces=[];
  let seed = 64187;
  const rand = () => ((seed = Math.imul(1664525, seed) + 1013904223 >>> 0) / 4294967296);
  const choose = list => list[Math.floor(rand()*list.length)];
  function tri(a,b,c,material,light=true) {
    const base = typeof material === 'string' ? rgb(material) : material;
    const normal = norm(cross(sub(b,a), sub(c,a)));
    const baseShade=walking?.73:.79;
    const shade=light?baseShade+(1-baseShade)*Math.max(-.35,dot(normal,sun)):1;
    const color = mul(base,shade);
    if((walking||parcel==='kitchen')&&luminousMaterials.has(material))color[0]+=2;
    coords.push(...a,...b,...c);colors.push(...color,...color,...color);
    if(walking){
      const horizontal=Math.abs(normal[1])>.85;
      const ground=horizontal&&Math.max(a[1],b[1],c[1])<.14;
      const plaster=plasterMaterials.has(material),timber=boardMaterials.has(material);
      let strength=ground?.225:plaster?.13:timber?.145:0;
      const horizontalScale=ground?.17:timber?.16:.31,verticalScale=timber?2.75:.42;
      for(const q of [a,b,c]){
        const u=horizontal||Math.abs(normal[2])>Math.abs(normal[0])?q[0]:q[2];
        const v=horizontal?q[2]:q[1];
        surfaces.push(u*horizontalScale,v*(ground?.17:verticalScale),strength);
      }
    }
  }
  function poly(points,color,light=true) {
    for(let j=1;j<points.length-1;j++)tri(points[0],points[j],points[j+1],color,light);
  }
  function quad(a,b,c,d,col,light=true){poly([a,b,c,d],col,light);}
  function box(x,y,z,w,h,d,c) {
    const X=x+w,Y=y+h,Z=z+d;
    const a=[x,y,z], b=[X,y,z], e=[x,Y,z], f=[X,Y,z], g=[X,Y,Z], h1=[x,Y,Z], c1=[X,y,Z], d1=[x,y,Z];
    quad(e,h1,g,f,c);quad(a,e,f,b,c);quad(b,f,g,c1,c);quad(c1,g,h1,d1,c);quad(d1,h1,e,a,c);
  }
  function beam(a,b,r,col,sides=5,r2=r) {
    const axis=norm(sub(b,a));
    const side=norm(cross(axis, Math.abs(axis[1])>.95?[1,0,0]:[0,1,0]));
    const other=norm(cross(axis,side)), head=[], tail=[];
    for(let i=0;i<sides;i++){
      const t=i*TAU/sides,off=add(mul(side,Math.cos(t)),mul(other,Math.sin(t)));
      head.push(add(a,mul(off,r)));tail.push(add(b,mul(off,r2)));
    }
    for(let i=0;i<sides;i++){ const n=(i+1)%sides;quad(head[i],head[n],tail[n],tail[i],col); }
    poly(tail,col);
  }
  function flat(x,z,rx,rz,mat,level=.03,n=16,rough=0){
    const ring=[];for(let j=0;j<n;j++){const a=-j*TAU/n, f=1+(rand()-.5)*rough;ring.push([x+rx*f*Math.cos(a),level,z+rz*f*Math.sin(a)]);}
    poly(ring,mat,false);
  }
  function gable(x,z,w,d,eave,rise,wall,roof){
    box(x,.025,z,w,.31,d,'8a8973');
    box(x,.335,z,w,eave-.335,d,wall);
    const mid=z+d/2;
    for(const X of [x,x+w]) { const u=[X,eave,z],v=[X,eave,mid+d/2],t=[X,eave+rise,mid]; tri(...(X===x?[u,v,t]:[u,t,v]),wall); }
    const E=.45,L=x-E,H=x+w+E,b=z-E,f=z+d+E, top=eave+rise+.13, low=eave-rise*E/(d/2)+.12;
    const ra=[L,top,mid],rb=[H,top,mid],fa=[L,low,f],fb=[H,low,f],ba=[L,low,b],bb=[H,low,b];
    quad(ra,fa,fb,rb,roof);quad(ba,ra,rb,bb,roof);
    [ [fa,fb],[ba,bb],[ra,rb],[ra,fa],[ra,ba],[rb,fb],[rb,bb] ].forEach(([u,v])=>beam(u,v,.065,'5d655a',4));
    for(let i=L+.16;i<H-.09;i+=.32) {
      const c=i%1<.65?'899082':'788275';
      beam([i,top+.015,mid],[i,low+.015,f],.02,c,3);beam([i,top+.015,mid],[i,low+.015,b],.02,c,3);
    }
  }
  function pane(x,y,z,w,h){
    box(x,y,z,w,h,.055,'575947');box(x+.075,y+.075,z+.055,w-.15,h-.15,.045,'537c73');
    box(x+w*.495,y+.05,z+.097,.045,h-.10,.035,'d5c7a4');
    box(x+.06,y+h*.49,z+.097,w-.12,.045,.035,'d5c7a4');
  }
  function door(x,y,z,w,h){
    box(x,y,z,w,h,.075,'867454');box(x+.08,y+.05,z+.08,w-.16,h-.1,.025,'aa8c60');
    box(x+.12,y+h*.47,z+.11,w-.24,h*.46,.035,'405c51');
  }
  function awning(x,z,w,depth,hi,lo,mat){
    const front=z+depth;
    quad([x,hi,z],[x,lo,front],[x+w,lo,front],[x+w,hi,z],mat);
    beam([x,lo,front],[x+w,lo,front],.065,'646f5a',4);
    for(let xx=x+.12;xx<x+w;xx+=.32)beam([xx,hi+.015,z],[xx,lo+.015,front],.018,'89927e',3);
    for(let xx=x+.35;xx<x+w;xx+=3.4){
      beam([xx,hi-.15,z],[xx,lo-.12,front],.055,'73715c',4);
      beam([xx,hi-1.0,z],[xx,lo-.15,front-.25],.045,'73715c',4);
    }
  }
  function buildKitchenInterior() {
    const steel = 'b4c3bf', steelEdge = 'd6ddd6', darkMetal = '586965';
    const cream = 'eee9d2', tile = 'd9e1d3', grout = 'bcc8ba', glass = '364a45';
    const timber = 'b4966c', sage = '678578', brass = 'caa46c';

    // The high louvre, green partition and dark rear doorway recall the historical site interior.
    // This relative geometry is an illustration of the programme, not an as-built plan.
    box(-6,-.095,-4.2,12,.095,8.4,'b8b6a1');
    for(let row=0;row<9;row++){
      for(let col=0;col<13;col++){
        const x=-6+col*.94,z=-4.2+row*.94;
        const tones=['c8c5ac','c2c0a9','cbcab0','c4c1a9'];
        box(x,.001,z,Math.min(.932,6-x),.012,Math.min(.932,4.2-z),tones[(col+3*row)%tones.length]);
      }
    }
    box(-6,0,-4.2,12,3.5,.09,cream);
    box(5.9,0,-4.12,.10,3.5,8.32,cream);
    box(-6,0,-4.12,.10,2.13,8.32,cream);
    box(-6,2.13,-4.12,.1,1.37,1.12,cream);
    box(-6,2.13,2.90,.1,1.37,1.30,cream);
    box(-6,3.05,-3,.1,.45,5.90,cream);
    box(-6,0,4.1,4.95,3.5,.1,cream);
    box(1.05,0,4.1,4.95,3.5,.1,cream);
    box(-1.05,2.40,4.1,2.1,1.1,.1,cream);
    quad([-6,3.5,-4.2],[6,3.5,-4.2],[6,3.5,4.2],[-6,3.5,4.2],'e2dfcc',false);

    // Discrete reflection and shadow shapes preserve the aisle and read on flat-shaded renderers.
    for(const z of [-2.35,-.7,.95]){
      const pts=[[-5.88,.019,z+.24],[-5.88,.019,z-.46],[-1.90,.019,z+.25],[-1.55,.019,z+1.05]];
      poly(pts,'d5d0af',false);
      for(let j=0;j<3;j++){
        const a=z-.25+j*.19;
        quad([-5.88,.021,a],[-5.88,.021,a+.035],[-1.75,.021,a+.73],[-1.92,.021,a+.67],'b9b79a',false);
      }
    }

    // A simple diffused bamboo view behind the louvred wall, then the metal blades.
    quad([-6.01,2.13,-3],[-6.01,3.05,-3],[-6.01,3.05,2.90],[-6.01,2.13,2.90],'c8d4ac',false);
    for(let i=0;i<19;i++){
      const z=-3+i*.32;
      beam([-5.995,2.13,z],[-5.995,3.04,z+.16],.012, i%3?'859567':'9da96f',4);
    }
    for(const z of [-3,-1.53,-.06,1.41,2.86])box(-5.916,2.11,z,.075,.97,.055,'697f70');
    for(let h=2.19;h<3.04;h+=.146)box(-5.88,h,-2.98,.112,.037,5.87,'a3b1a0');
    box(-5.94,2.075,-3.06,.23,.065,6.0,'a6ad96');

    // Washable dados: real joint lines on the back, a continuous wet-side splashback on the right.
    for(const side of [[-5.9,4.82],[1.03,4.85]]) {
      box(side[0],.08,-4.10,side[1],1.72,.06,tile);
      for(let x=side[0]+.37;x<side[0]+side[1];x+=.42)box(x,.08,-4.035,.01,1.72,.01,grout);
      for(let y=.46;y<1.8;y+=.4)box(side[0],y,-4.034,side[1],.01,.012,grout);
    }
    box(5.86,.08,-4.04,.03,1.62,8.08,tile);
    for(let z=-3.66;z<4.08;z+=.44)box(5.83,.09,z,.03,1.6,.009,grout);
    for(let y=.47;y<1.71;y+=.4)box(5.83,y,-4.04,.03,.009,8.06,grout);
    // Dark rear door, glazed upper light, horizontal handle.
    box(-.86,.02,-4.10,1.72,2.51,.12,'42504a');
    box(-.76,.06,-3.973,1.52,2.34,.035,'52635a');
    box(-.63,1.34,-3.93,1.26,.91,.04,'82998b');
    box(-.59,1.38,-3.881,.56,.82,.018,'a8b2a1');
    box(.48,1.03,-3.89,.19,.045,.09,steelEdge);
    box(-.89,.027,-4.00,1.78,.023,.25,'979c87');
    // Compact corrugated visual screen on right wall near entrance.
    box(5.78,.10,2.92,.06,2.60,1.17,'507769');
    for(let z=2.95;z<4.09;z+=.086)box(5.751,.12,z,.034,2.55,.030,'759382');

    function bench(x,z,w,d,height=.88){
      for(const xx of [x+.09,x+w-.14])for(const zz of [z+.08,z+d-.13]){
        box(xx,.08,zz,.052,height-.08,.052,darkMetal);
        box(xx-.014,.043,zz-.014,.08,.043,.08,'59685c');
      }
      box(x+.06,.28,z+.05,w-.12,.038,d-.10,'879990');
      box(x,height,z,w,.085,d,steel);
      box(x+.014,height+.085,z+.018,w-.028,.012,d-.036,steelEdge);
      return height+.098;
    }
    function shallowTray(x,y,z,w,d,colour='7c8880'){
      box(x,y,z,w,.023,d,colour);
      box(x,y+.02,z,w,.026,.018,steelEdge);box(x,y+.02,z+d-.018,w,.026,.018,steelEdge);
      box(x,y+.02,z,.018,.026,d,steelEdge);box(x+w-.018,y+.02,z,.018,.026,d,steelEdge);
    }
    // Tapered rolls read clearly as pastry even at the four-tray oven scale.
    function goldenRoll(x,y,z,s=1){
      const skin='c68e4d',crest='e5b570';
      const shape=[[-.13,-.04],[-.075,-.078],[0,-.087],[.082,-.078],[.13,-.04]];
      for(let i=0;i<shape.length-1;i++){
        const a=shape[i],b=shape[i+1],r=.030+.026*(1-Math.abs(i-1.5)/1.5);
        beam([x+a[0]*s,y+.039*s,z+a[1]*s],[x+b[0]*s,y+.044*s,z+b[1]*s],r*s,skin,7,(r+.009)*s);
      }
      for(let n=-1;n<=1;n++)beam([x+n*.044*s,y+.078*s,z-.1*s],[x+(n+.32)*.044*s,y+.081*s,z-.06*s],.009*s,crest,5);
    }

    // Four-tray oven and stand. The window is an open reveal with visible rack positions.
    bench(-3.85,-3.71,1.62,1.10,.48);
    box(-3.80,.59,-3.69,1.52,1.32,.83,steel);
    box(-3.78,.66,-2.84,1.48,1.17,.16,'424b43');
    box(-3.74,.70,-2.67,1.10,1.08,.045,'313b32');
    for(let i=0;i<4;i++){
      const yy=.79+i*.235;
      box(-3.69,yy,-2.60,.99,.022,.095,'d4c09a');
      box(-3.69,yy+.023,-2.52,.99,.011,.018,'f0af5e');
      for(let j=0;j<3;j++)goldenRoll(-3.53+j*.30,yy+.04,-2.51,.78);
    }
    box(-3.80,.63,-2.49,.065,1.20,.038,darkMetal);
    box(-2.68,.63,-2.49,.058,1.20,.038,darkMetal);
    box(-3.77,1.82,-2.50,1.15,.040,.04,steelEdge);
    box(-3.77,.65,-2.50,1.15,.040,.04,steelEdge);
    // A partial dark glass highlight leaves the contents and four shelves visible.
    quad([-3.74,.72,-2.477],[-3.70,.72,-2.477],[-3.46,1.78,-2.477],[-3.515,1.78,-2.477],'879285',false);
    box(-2.60,.65,-2.665,.258,1.17,.074,steel);
    box(-2.561,1.51,-2.581,.19,.18,.024,'2a4139');box(-2.541,1.575,-2.548,.131,.026,.013,'c6b578');
    for(const y of [1.28,1.04])beam([-2.466,y,-2.57],[-2.466,y,-2.49],.080,'404d43',12);
    beam([-3.74,1.768,-2.40],[-2.67,1.768,-2.40],.027,darkMetal,8);
    // Sloped exhaust hood and a short duct back to the service wall.
    box(-3.99,2.37,-3.82,1.97,.10,1.40,'7a8b80');
    quad([-3.99,2.47,-2.42],[-2.02,2.47,-2.42],[-2.28,2.73,-3.39],[-3.73,2.73,-3.39],'adbaad');
    box(-3.15,2.71,-3.73,.37,.60,.36,steel);
    box(-3.81,2.354,-2.65,1.58,.015,.14,'f2cf90');

    // Dedicated rolling bench to the left with blue-grey reversible belt, guarded roller and dough.
    bench(-5.60,-1.53,3.22,.97);
    box(-5.42,1.00,-1.37,2.86,.11,.63,'7e9290');
    for(const x of [-5.42,-2.60])beam([x,1.13,-1.34],[x,1.13,-.78],.052,'758783',9);
    box(-5.39,1.12,-1.37,2.79,.032,.61,'b0c3b9');
    box(-4.22,1.13,-1.40,.54,.36,.71,'a8b9b2');
    beam([-3.94,1.46,-1.43],[-3.94,1.46,-.65],.105,steelEdge,12);
    for(let xx=-4.23;xx<-3.62;xx+=.12)beam([xx,1.17,-.74],[xx,1.40,-.72],.011,darkMetal,5);
    box(-3.55,1.158,-1.28,.68,.038,.40,'ddc69a');
    for(let k=0;k<3;k++)box(-3.05+k*.06,1.196,-1.27,.009,.007,.37,'bea478');
    beam([-4.20,1.32,-.68],[-4.32,1.64,-.62],.027,'475e55',7);
    box(-4.36,1.56,-.65,.11,.07,.11,'4c6458');

    // Proofing and chilled storage form one compact rear bank.
    box(1.43,.12,-3.83,1.25,2.21,.87,steel);
    box(1.49,.22,-2.94,1.12,1.93,.035,'41594f');
    for(let i=0;i<12;i++)box(1.58,.34+i*.133,-2.896,.91,.019,.025,i%2?'b9b6a1':'a1b2a2');
    for(const xx of [1.51,2.56])box(xx,.24,-2.887,.054,1.87,.035,steelEdge);
    box(2.48,.86,-2.84,.039,.62,.055,'e8e9da');
    box(1.64,2.17,-2.90,.74,.061,.035,'667970');
    box(3.24,.10,-3.88,1.51,2.30,.98,'9aada6');
    box(3.31,.22,-2.89,1.36,1.78,.045,'c5cbc0');
    box(4.28,.80,-2.79,.047,.70,.080,'64786d');
    box(3.32,2.02,-2.88,1.35,.27,.048,'586d60');
    for(let i=0;i<8;i++)box(3.43+i*.122,2.06,-2.82,.045,.17,.018,'aeb8a9');

    // A visible, independent hand basin and a separate utensil sink on the right wet side.
    bench(3.20,-1.46,2.51,.89,.85);
    box(3.29,.947,-1.31,.88,.025,.62,darkMetal);box(3.35,.977,-1.25,.75,.012,.50,'839995');
    box(4.38,.949,-1.30,1.06,.018,.62,'b7c7c0');
    for(let k=0;k<9;k++)box(4.43+k*.105,.973,-1.25,.016,.014,.53,'8b9f96');
    beam([3.83,.96,-1.43],[3.83,1.34,-1.43],.034,steelEdge,8);
    beam([3.83,1.34,-1.43],[3.83,1.34,-1.08],.034,steelEdge,8);
    beam([3.83,1.34,-1.08],[3.83,1.25,-1.08],.029,steelEdge,8);
    box(5.16,.82,-.24,.61,.13,.58,steel);box(5.22,.962,-.18,.48,.02,.44,'829995');
    beam([5.40,.95,-.22],[5.40,1.22,-.22],.022,steelEdge,7);beam([5.40,1.22,-.22],[5.40,1.22,.01],.022,steelEdge,7);
    box(5.74,1.25,-.05,.085,.23,.15,'c8d2be');

    // Front-right finishing bench, chocolate éclairs, a piping bag, and clean takeaway cartons.
    bench(2.11,.95,3.20,1.06);
    shallowTray(2.26,.986,1.10,1.08,.72);
    for(let row=0;row<2;row++)for(let col=0;col<3;col++){
      const x=2.37+.31*col,z=1.29+.30*row;
      beam([x,1.063,z],[x+.17,1.063,z],.055,'b17b44',9);
      beam([x+.012,1.092,z],[x+.164,1.092,z],.035,'614435',9);
    }
    beam([3.67,1.030,1.55],[3.96,1.058,1.36],.022,'dce0c7',9,.085);
    beam([3.616,1.01,1.58],[3.67,1.03,1.55],.007,steelEdge,6,.025);
    for(let i=0;i<3;i++)box(4.40,1.005+i*.112,1.21,.53,.10,.39,'b5986d');
    box(4.41,1.329,1.22,.51,.012,.365,'c9af87');
    box(4.48,1.343,1.22,.069,.009,.36,'a24a38');
    // Under-shelf containers. A removable cocoa tin and a scale sit on the left bench.
    box(2.43,.32,1.15,.53,.25,.39,'d7d9c5');
    box(2.42,.573,1.14,.55,.022,.41,sage);
    bench(-5.44,1.27,2.58,.90);
    box(-4.98,.989,1.52,.50,.048,.37,'42554d');box(-4.95,1.044,1.54,.44,.020,.30,'b0bdb2');
    beam([-3.75,1.0,1.68],[-3.75,1.36,1.68],.145,'9c7455',13);
    beam([-3.75,1.36,1.68],[-3.75,1.385,1.68],.153,brass,13);
    // Ceiling task lights. Front edges remain outside the camera eye line.
    for(const z of [-2.4,.15,2.65]){
      for(const x of [-3.65,3.65]){
        beam([x,3.48,z],[x,3.30,z],.018,'778477',5);
        beam([x,3.295,z],[x,3.19,z],.12,'708278',12,.24);
        flat(x,z,.199,.199,'f3dca4',3.186,14);
      }
    }
    // A continuous rear shelf gives clean storage a recognisable position.
    box(-5.69,1.99,-3.86,1.44,.055,.38,'af936c');
    for(let k=0;k<4;k++){
      const x=-5.46+k*.30;
      beam([x,2.048,-3.67],[x,2.30,-3.67],.082,k%2?'d3bd8b':'d3d2bc',9);
      beam([x,2.30,-3.67],[x,2.327,-3.67],.087,'7d8b72',9);
    }
  }

  if(parcel==='kitchen'){
    buildKitchenInterior();
    return {positions:new Float32Array(coords),colors:new Float32Array(colors)};
  }
  const wood='927f5a',stone='a09e87', redwood='a27d52';
  if(parcel==='parking'){
    // The two independent illustrations use a 21:40 land-area ratio. The rectangular
    // edges simplify the area budget; their shape and location have no survey basis.
    const halfX=15,halfZ=9.31,carPaint=['b2604e','6c8983','bdad8d','879174'];
    box(-halfX,-.74,-halfZ,30,.68,18.62,'b3976f');
    box(-halfX,-.06,-halfZ,30,.105,18.62,'b8bb9b');
    box(-15.08,-.76,-9.39,30.16,.11,18.78,'a78f71');
    box(-13.0,.05,-7.2,21.5,.025,13.51,'c3b79b');
    box(-13.1,.077,-1.51,26.6,.023,3.24,'a89f8c');
    box(8.46,.078,-1.52,5.0,.023,10.80,'aea48d');
    box(-14.7,.076,6.65,22.08,.047,1.13,'d7c9a1');
    box(6.7,.076,6.65,.72,.047,2.6,'d7c9a1');
    for(let x=7.6;x<13.2;x+=.58)box(x,.115,5.75,.27,.011,.93,'d9cba9');
    for(let z=-8.8;z<=4.82;z+=1.75)box(13.82,.08,z,.57,.035,1.48,'a2ada0');
    for(let k=0;k<560;k++){
      const x=-14.7+rand()*29.2,z=-9+rand()*18;
      if(z>6.5||x>8.6)continue;
      flat(x,z,.033+rand()*.055,.025,choose(['a99e86','d0c2a3','b6a88b']),.104,4,.14);
    }
    for(let k=0;k<21;k++){const x=-14.5+k*1.38;flat(x,-8.19,.92+rand()*.37,.49,choose(['97a082','a8ac89','8f9d7c']),.09,10,.15);}
    for(const [x,z] of [[8.55,8.7],[13.05,8.7]]){beam([x,.06,z],[x,1.65,z],.11,'8a7659',7);box(x-.27,1.42,z-.04,.54,.21,.08,'bc4f39');}
    for(const x of [-13.6,6.0])for(const z of [-1.9,2.15]){
      box(x,.08,z,.11,.80,.11,'846e4b');box(x-.24,.67,z-.08,.55,.23,.09,'c36c4c');
    }
    function car(x,z,paint){
      flat(x+.16,z-.07,1.04,1.87,'9a9784',.112,14);
      box(x-.73,.34,z-1.49,1.46,.50,2.98,paint);
      box(x-.62,.80,z-.75,1.24,.45,1.47,'70837b');box(x-.57,1.21,z-.56,1.14,.08,1.08,paint);
      for(const X of [x-.76,x+.76])for(const Z of [z-.91,z+.91])beam([X-.075,.33,Z],[X+.075,.33,Z],.25,'494c45',10);
      box(x-.61,.45,z+1.49,.28,.12,.052,'e5d5a9');box(x+.33,.45,z+1.49,.28,.12,.052,'e5d5a9');
    }
    [[-8.5,-4.75],[-5.5,-4.76],[1.95,4.0]].forEach(([x,z],i)=>car(x,z,carPaint[i]));
    for(let j=0;j<8;j++){
      let x=-13+j*3.52,z=-7.77+(rand()-.5)*.6,hh=1.2+rand()*.8;
      beam([x,.06,z],[x,hh,z],.08,'7e775c',5,.04);
      for(let k=0;k<5;k++){
        const a=k*TAU/5,top=[x+Math.cos(a)*.5,hh+.23+rand()*.4,z+Math.sin(a)*.5];
        const pts=[];for(let m=0;m<7;m++)pts.push([top[0]+Math.cos(m*TAU/7)*.7,top[1],top[2]+Math.sin(m*TAU/7)*.53]);
        const shade=choose(['688760','91a071','698769','80996b']);for(let m=0;m<7;m++)tri(pts[m],add(top,[0,.6,0]),pts[(m+1)%7],shade);
      }
    }
    return {positions:new Float32Array(coords),colors:new Float32Array(colors)};
  }
  // A raised, cut-earth plinth, a narrow lane outside the mesh gate, and the block wall.
  box(-19,-.86,-14,38,.77,28,'b3976f');box(-19,-.09,-14,38,.10,28,'c3c1a4');
  box(-19.12,-.88,-14.12,38.24,.13,28.24,'a38c68');
  box(-19.09,-.065,-14.08,38.18,.055,28.16,'d6c9a9');
  box(-20.35,-.42,-14.04,1.34,.39,28.08,'b7ae94');
  [[-19,-14,38,.19],[18.8,-14,.20,28],[-19,13.8,38,.20],[-19,-14,.20,6.5],[-19,-1.9,.20,15.72]].forEach(([x,z,w,d])=>{
    box(x,.01,z,w,1.05,d,'b0a98f');box(x-.035,1.06,z-.04,w+.07,.08,d+.08,'cbc3a9');
  });
  const gateX=entryGate.x;
  for(const z of [entryGate.south,entryGate.north]){
    box(gateX-.14,.012,z-.13,.28,1.44,.26,'797d67');
    box(gateX-.165,1.45,z-.155,.33,.08,.31,'a3a18a');
    for(const h of [.34,1.08])beam([gateX,h,z],[gateX,h+.15,z],.077,'5c5d4e',7);
  }
  function addGateLeaves(){
    for(const [hinge,side] of [[entryGate.south,1],[entryGate.north,-1]]){
      const start=coords.length,end=hinge+side*entryGate.leaf;
      for(const h of [.15,1.29])beam([gateX,h,hinge],[gateX,h,end],.043,'333f39',4);
      for(const z of [hinge,end])beam([gateX,.15,z],[gateX,1.29,z],.043,'364039',4);
      for(let j=1;j<13;j++){
        const z=hinge+side*j*entryGate.leaf/13;
        beam([gateX,.17,z],[gateX,1.265,z],.0105,'586058',4);
      }
      for(let j=1;j<6;j++){
        const h=.15+j*1.14/6;
        beam([gateX-.006,h,hinge],[gateX-.006,h,end],.0105,'545e53',4);
      }
      beam([gateX,.20,hinge+side*.09],[gateX,1.24,end-side*.08],.017,'51594e',4);
      if(side===1)box(gateX-.075,.77,end-.18,.12,.095,.27,'766b50');
      if(walking)remember('gate',start,{hinge,side});
    }
  }
  if(!walking)addGateLeaves();
  flat(-1.6,.8,12.8,8.0,'cdbf9a',.017,24,.12);
  flat(-12,-7.45,5.82,3.68,'a5b18c',.021,21,.12);
  flat(-12.25,9.7,3.6,2.8,'abb696',.022,19,.17);
  flat(14.3,-10,3.5,2.9,'a2ae8c',.022,16,.12);
  flat(9,11.5,5.6,1.71,'a7ad8f',.026,18,.12);
  flat(3,4.0,9.0,5.6,'d5c6a5',.022,24,.12);
  // Weathered paths retain an earth perimeter with understated irregular pavers.
  const paths=[[[-18.7,-4.7],[-7.8,-2.1]], [[-8,-2.1],[8,-1.8]], [[1.6,-1.8],[1.8,8.6]], [[8,-1.9],[13,2.6]]];
  for(const [[x,z],[X,Z]] of paths){
    const count=Math.ceil(Math.hypot(X-x,Z-z)/.91);
    for(let j=0;j<count;j++){
      const t=(j+.5)/count;
      flat(x+(X-x)*t,z+(Z-z)*t,.51,.53,choose(['c4b99a','d3c9a9','c8bda0']),.043,7,.31);
    }
  }
  for(let j=0;j<520;j++){let x=-18.72+rand()*37.4,z=-13.8+rand()*27.5,r=.035+rand()*.08;flat(x,z,r,r*.38,choose(['a7a584','beb18b','c8bc96','adab87']),.024,4,.18);}
  // White gabled bakehouse, glazed pavilion and the smaller companion annex.
  // Directional cast shadows below the eaves and onto the approach.
  poly([[-1.9,.032,-11.8],[1.5,.032,-13.2],[15.05,.032,-13.15],[15.0,.032,-5.48],[12.35,.032,-3.98],[-1.7,.032,-4.48]],'949b83',false);
  poly([[-10.4,.034,3.4],[-8.3,.034,2.4],[1.88,.034,2.6],[1.9,.034,8.6],[-.5,.034,10.1],[-10.3,.034,9.7]],'a0a38a',false);
  poly([[12,.035,1.15],[14,.035,.18],[18.2,.035,.2],[18.3,.035,6.1],[16.4,.035,7.1],[12,.035,7.05]],'9da28a',false);
  gable(-1.7,-11.7,14.1,6.8,4.1,2.25,'faf3db','778577');
  awning(-1.88,-4.88,14.54,1.65,3.52,3.04,'a7ae98');
  door(3.1,.42,-4.87,1.48,2.36);pane(7.8,1.26,-4.88,1.76,1.52);
  pane(.0,1.55,-4.88,1.33,1.17);box(2.83,.02,-4.82,2.05,.20,.92,'ad8b67');box(2.97,.20,-4.85,1.80,.18,.60,'b28e68');
  for(let x of [1.0,9.7]) {box(x,1.4,-11.80,1.25,.83,.10,'758276');}
  gable(-10.4,3.7,10.4,5.6,2.63,1.69,'e2dcc0','65786a');
  // The model's projected clerestory box cuts into one pitched plane.
  box(-9.35,2.25,4.22,6.9,1.7,2.0,'bab99f');box(-9.45,2.51,4.08,7.08,1.18,.11,'4c6c62');
  for(let i=0;i<=6;i++)box(-9.39+i*1.155,2.48,4.02,.055,1.26,.06,'525e54');
  box(-9.50,3.92,4.04,7.18,.13,2.24,'78816e');
  awning(-10.6,9.25,10.8,1.4,2.65,2.38,'8d9680');
  for(const x of [-9.4,-6.8])pane(x,.91,9.3,1.43,1.19);
  for(const x of [-4.1,-2.5])door(x,.32,9.31,1.2,2.02);
  box(-9.6,.75,3.40,5.9,.18,.44,redwood);box(-9.58,.94,3.59,5.86,1.08,.08,'61756b');
  // Outdoor stair and handrails at one end of the lower pavilion.
  for(let i=0;i<10;i++)box(.12,.025,4.25+i*.38,1.07,.245*(i+1),.40,'b5b29b');
  for(let side of [.13,1.17]){
    beam([side,.91,4.20],[side,3.23,7.92],.049,'646d61',4);
    for(let j=0;j<=5;j++)beam([side,.22+j*.43,4.35+j*.68],[side,1.01+j*.43,4.35+j*.68],.03,'646d61',4);
  }
  box(.04,2.44,7.96,1.23,.14,.87,'b8b79f');
  box(12.0,.04,1.2,4.4,2.86,5.8,'d6d0b4');
  const a=[11.7,3.02,.94],b=[16.7,3.65,.94],c=[16.7,3.65,7.31],d=[11.7,3.02,7.31];
  quad(a,d,c,b,'8a9381');beam(a,d,.065,'747b68',4);beam(b,c,.065,'747b68',4);
  for(let z=1.02;z<7.32;z+=.35)beam([11.7,3.04,z],[16.7,3.67,z],.02,'949b88',3);
  door(13.75,.08,7.0,1.0,1.96);
  // Bamboo hut: columns, a lower landing, open balcony, small corrugated roof and stair.
  box(-13.8,.02,-8.35,3.4,.24,3.14,'a7a48a');
  for(const x of [-13.42,-10.77])for(const z of [-8.14,-5.6])beam([x,.15,z],[x,3.0,z],.085,'958552',6);
  box(-13.62,2.29,-8.30,3.10,.17,2.96,wood);
  box(-13.53,2.43,-8.24,2.96,1.55,2.03,'c8c9a8');
  box(-13.56,2.42,-5.52,3.0,.64,.11,'d1c9a6');
  for(const x of [-13.45,-12.0,-10.67])beam([x,2.8,-5.48],[x,4.07,-5.48],.055,wood,4);
  quad([-13.9,4.28,-8.65],[-13.9,4.05,-5.1],[-10.2,4.05,-5.1],[-10.2,4.28,-8.65],'89967c');
  for(let j=0;j<8;j++){box(-14.81,.05+j*.28,-5.35-j*.28,.83,.11,.35,wood);}
  beam([-14.74,.12,-5.30],[-14.74,2.2,-7.42],.08,'726b50',4);
  beam([-14.03,.12,-5.30],[-14.03,2.2,-7.42],.08,'726b50',4);
  // Six four-place tables. Each table and freestanding chair is a real mesh.
  for(const x of [3.35,6.12,8.89])for(const z of [2.05,5.02]){
    flat(x+.27,z-.25,1.18,.76,'b5ae90',.04,13);
    box(x-.59,.84,z-.42,1.18,.085,.84,'b99b6e');
    for(const sx of [-.5,.5])for(const sz of [-.32,.32])box(x+sx-.035,.05,z+sz-.035,.07,.80,.07,'706d52');
    for(const sx of [-.34,.34])for(const sz of [-.75,.75]){
      const cx=x+sx,cz=z+sz,col=choose(['6e8069','869273','a19872']);
      box(cx-.19,.45,cz-.16,.38,.07,.32,col);box(cx-.19,.5,cz+(sz>0?.11:-.16),.38,.36,.055,col);
      for(const xx of [-.15,.15])for(const zz of [-.12,.12])box(cx+xx,.05,cz+zz,.045,.42,.045,col);
    }
    flat(x+.04,z,.10,.09,'e0dac7',.935,8);
  }
  // Clipped courtyard hedges, compact planting beds, perimeter tree crowns and bamboo.
  const tone=['648d68','72926b','8aa570','50765d','7e996c','a0ad76','628360'];
  function crown(cx,cy,cz,w,h,d,color,segments=8,levels=3){
    const off=rand()*TAU,rings=[];
    for(let j=1;j<=levels;j++){
      const t=j*Math.PI/(levels+1),rr=Math.sin(t),rh=Math.cos(t);const ring=[];
      for(let i=0;i<segments;i++){
        let a=off+i*TAU/segments+(j%2?0:.24),q=1+(rand()-.5)*.23;
        ring.push([cx+w*rr*q*Math.cos(a),cy+h*(rh+(rand()-.5)*.1),cz+d*rr*q*Math.sin(a)]);
      }rings.push(ring);
    }
    for(let i=0;i<segments;i++){
      let n=(i+1)%segments;tri([cx,cy+h,cz],rings[0][n],rings[0][i],color);
      for(let j=1;j<rings.length;j++)quad(rings[j-1][i],rings[j-1][n],rings[j][n],rings[j][i],color);
      tri([cx,cy-h,cz],rings.at(-1)[i],rings.at(-1)[n],color);
    }
  }
  function tree(x,z,h,spread){
    flat(x+1,z-.55,spread*1.04,spread*.85,'a8a889',.031,15,.12);
    const trunk=[x+.15,h*.57,z-.09];
    beam([x,.02,z],trunk,.18,'867b5c',7,.115);
    for(let k=0;k<6;k++){
      const angle=k*TAU/6+rand()*.45;const r=spread*(k===0?.15:.49+.16*rand());
      const branch=[x+r*Math.cos(angle),h*(k===0?.99:.74+rand()*.18),z+r*Math.sin(angle)];
      beam([x,h*.34,z],branch,.115,'867b5c',5,.044);
      crown(...branch,spread*(.48+.13*rand()),h*.137,spread*.55,choose(tone));
    }
  }
  [[16.3,-10.3,6.9,2.5],[-16.5,10.5,5.3,2.7],[7.7,11.6,4.7,2.1],[-16.4,-11.9,4.7,2.0],[-3.8,-12.4,4.5,1.9]].forEach(a=>tree(...a));
  function leaf(a,dir,len,w,material){
    const d=norm(dir),end=add(a,mul(d,len)),mid=add(a,mul(d,len*.52)),perp=norm(cross(d,[0,1,0]));
    const left=add(mid,mul(perp,w)),right=add(mid,mul(perp,-w));const ridge=add(mid,[0,.07,0]);
    tri(a,ridge,left,material,false);tri(a,right,ridge,material,false);tri(ridge,end,left,material,false);tri(ridge,right,end,material,false);
  }
  function bamboo(x,z,ht,count){
    flat(x+.25,z-.27,1.48,1.19,'9eaa83',.037,15,.15);
    for(let j=0;j<count;j++){
      const base=[x+(rand()-.5)*1.45,.04,z+(rand()-.5)*1.22],angle=TAU*j/count+rand()*.6,length=ht*(.65+rand()*.42);
      const lean=.9+rand()*1.5;
      const point=t=>[base[0]+Math.cos(angle)*lean*t*t,base[1]+length*t,base[2]+Math.sin(angle)*lean*t*t];
      const stem=choose(['968a49','89925a','a69d56','9d9151']);
      for(let k=0;k<4;k++)beam(point(k/4),point((k+1)/4),.046*(1-k*.12),stem,4,.041*(1-k*.12));
      for(let k=0;k<4;k++){
        const t=.52+k*.135;const st=point(t),rangle=angle+(k%2?-.8:.8);
        let tip=add(st,[Math.cos(rangle)*(.62+rand()*.43),.3+rand()*.29,Math.sin(rangle)*(.62+rand()*.43)]);
        beam(st,tip,.016,'838b54',3);
        for(let m=0;m<6;m++){
          const at=add(st,mul(sub(tip,st),m/7+.13)),la=rangle+(m%2?1:-1)*(.53+rand()*.54);
          leaf(at,[Math.cos(la),-.1-rand()*.45,Math.sin(la)],.57+rand()*.45,.095+rand()*.046,choose(['486e43','6e8a51','60864a','98a65e','76924f']));
        }
      }
    }
  }
  bamboo(-14.3,-8.65,7.2,13);bamboo(-10.1,-8.56,6.9,9);bamboo(-16.1,-3.85,5.4,6);
  function palm(x,z,h){
    const apex=[x+.62,h,z+.25];beam([x,.05,z],apex,.12,'9a8d6d',7,.09);
    for(let k=0;k<9;k++){const a=TAU*k/9+.16, ex=Math.cos(a),ez=Math.sin(a), len=2.75+rand()*.6;
      let prev=apex;
      for(let j=1;j<8;j++){
        const t=j/7,cen=add(apex,[ex*t*len,Math.sin(Math.PI*t)*.62-t*t*.96,ez*t*len]);
        beam(prev,cen,.045,'657d4d',3);
        for(const side of [-1,1])leaf(cen,[ex*.25+ez*side,-.32,ez*.25-ex*side],(1-t*.8)*1.08,.13,'60804b');
        prev=cen;
      }
    }
  }
  palm(11.8,-12.8,8.7);palm(-4.9,-12.8,7.8);
  for(let j=0;j<27;j++){
    const x=j<14?-16.8+j*2.37:-17+rand()*34,z=j<14?12.85+(rand()-.5)*.55:-12.8+rand()*.65;
    crown(x,.48+rand()*.20,z,.72+rand()*.36,.54+rand()*.27,.56+rand()*.29,choose(tone),6,2);
  }
  for(const [x,z] of [[-10.6,2.4],[-2.1,2.8],[-1.9,-3.3],[10.2,-3.1]]){
    beam([x,.05,z],[x,.50,z],.25,'b38762',8,.34);
    for(let k=0;k<10;k++){const a=k*TAU/10;leaf([x,.45,z],[Math.cos(a),.88+rand(),Math.sin(a)],.73+rand()*.36,.13,choose(tone));}
  }
function addWalkGarden(eventSetup) {
  // A second planting line sets the skyline beyond the compound wall.
  const grove = ['536f53','688360','78916b','607e5f','899a70','78956c'];
  const backdrop = (x,z,h,s) => {
    beam([x,-.12,z],[x+.13,h*.68,z-.12],.22,'766e54',6,.11);
    for(let i=0;i<4;i++) {
      const angle = i*Math.PI*.5+rand()*.5;
      const bx = x+s*.48*Math.cos(angle), bz = z+s*.48*Math.sin(angle);
      beam([x,h*.38,z],[bx,h*.78,bz],.095,'7b7559',5,.038);
      crown(bx,h*(.81+i*.055),bz,s*.76,h*.19,s*.70,choose(grove),7,2);
    }
  };
  for(const z of [-18,17.9])for(let x=-22;x<=23;x+=4.8)backdrop(x+rand(),z+rand(),4.6+rand()*4,2.9+rand());
  for(const x of [-24,24])for(let z=-12;z<16;z+=5.6)backdrop(x+rand(),z,4.9+rand()*2.8,3.2);
  // Small foreground details are useful at human eye level.
  for (const [x,z] of [[-16,-10],[-17.1,4.7],[-13,9.9],[13.1,-2.1],[16.9,-5],[-11.7,1.2]]) {
    for(let i=0;i<9;i++){
      const bx=x+(rand()-.5)*1.25,bz=z+(rand()-.5)*.83,a=rand()*Math.PI*2;
      leaf([bx,.09,bz],[Math.cos(a),.6+rand(),Math.sin(a)],.65+rand()*.68,.14+rand()*.1,choose(grove));
    }
  }
  for (const [x,z] of [[-16,-3.5],[-10.7,-1.55],[2.95,-.95],[3.15,7.7],[10.7,5]]) {
    box(x-.055,.06,z-.055,.11,.63,.11,'546853');
    box(x-.095,.65,z-.095,.19,.14,.19,'efcb89');
    box(x-.12,.80,z-.12,.24,.045,.24,'67735a');
  }
  // North-facing window: horizontal ledge, four framed display bays, warm light and baking.
  box(-9.4,.79,3.14,5.56,.13,.48,'ad875a');
  box(-9.31,.93,3.19,5.37,.032,.31,'e2cd9f');
  for (let i=0;i<4;i++){
    const x=-9.2+i*1.32;
    box(x,.979,3.23,.99,.025,.25,'ddd6b8');
    for(let j=0;j<3;j++) {
      const cx=x+.16+j*.31;
      if(i%2===0){
        beam([cx-.074,1.025,3.38],[cx+.074,1.034,3.38],.05,'b87936',6,.042);
        beam([cx-.07,1.023,3.38],[cx-.11,1.015,3.32],.042,'cf934a',5,.022);
        beam([cx+.07,1.023,3.38],[cx+.115,1.015,3.32],.042,'cf934a',5,.022);
      } else {
        box(cx-.09,1.006,3.29,.18,.068,.103,'c18b4a');
        box(cx-.085,1.074,3.294,.17,.016,.091,'714838');
      }
    }
  }
  for(const x of [-9.36,-7.98,-6.62,-5.25,-3.94])beam([x,.94,3.18],[x,1.44,3.245],.018,'9b8c68',4);
  beam([-9.38,1.44,3.245],[-3.93,1.44,3.245],.019,'e2d8ad',4);
  for(const x of [-8.7,-6.6,-4.55]) {
    beam([x,2.48,3.49],[x,2,3.49],.014,'716b55',4);
    beam([x,2.02,3.49],[x,1.94,3.49],.045,'947c54',8,.115);
    beam([x,1.938,3.49],[x,1.925,3.49],.089,'f4d597',8);
  }
  if(!eventSetup)return;
  const table = (x,z) => {
    flat(x+.22,z-.14,.96,.71,'a9aa8c',.04,10);
    box(x-.54,.78,z-.39,1.08,.075,.78,'b99663');
    for(const sx of [-.42,.42])for(const sz of [-.28,.28])box(x+sx,.04,z+sz,.05,.75,.05,'776e52');
    for(const sx of [-.285,.285])for(const sz of [-.69,.69]){
      const cx=x+sx,cz=z+sz,sg=sz>0?1:-1;
      box(cx-.17,.43,cz-.16,.34,.055,.32,'879879');
      box(cx-.17,.47,cz+sg*.13-.02,.34,.30,.04,'879879');
      for(const xx of [-.13,.13])for(const zz of [-.11,.11])box(cx+xx,.045,cz+zz,.036,.39,.036,'727e64');
    }
    flat(x+.05,z,.085,.075,'d7c7a4',.858,7);
  };
  [[3.45,8.62],[6.02,8.62],[9.45,8.62],[3.80,11.35]].forEach(([x,z])=>table(x,z));
  for(const [x1,x2,z1,z2] of [[2.38,6.95,7.59,9.66],[8.48,10.44,7.60,9.66],[2.76,4.83,10.30,12.40]]) {
    const mid=(z1+z2)/2;
    for(const x of [x1,x2])for(const z of [z1,z2])beam([x,.07,z],[x,2.48,z],.034,'877b5c',6);
    quad([x1,2.48,z1],[x1,2.88,mid],[x2,2.88,mid],[x2,2.48,z1],'f0e4c3');
    quad([x1,2.88,mid],[x1,2.48,z2],[x2,2.48,z2],[x2,2.88,mid],'e6d6b3');
    for(const z of [z1,z2])beam([x1,2.45,z],[x2,2.45,z],.035,'9c8964',5);
  }
}

  if(walking){
    addWalkGarden(parcel==='walk-event');
    // Gravel apron at the mesh threshold and fine texture across the clay court.
    box(-24.10,.016,-7.50,5.38,.032,5.65,'b9ac8c');
    for(let i=0;i<720;i++){
      const x=-23.95+rand()*42.3,z=-13.5+rand()*26.45;
      if(x< -18.73&&(z< -7.4||z> -1.98))continue;
      const h=x< -18.7?.055:.049;
      const r=.017+rand()*.056,local=x< -18.7?['a29781','c6b798','d4c8a7']:['bb9d74','ae9c7b','cdb88e','c1a57b'];
      tri([x-r,h,z],[x+r*.80,h,z+r*.19],[x+r*.32,h,z+r*.65],choose(local),false);
    }
    // Sun islands and angular bamboo-leaf shadows collect under the clumps.
    for(const [sx,sz,r] of [[-14.6,-5.0,3.8],[-10.8,-6.4,3.2],[-15.0,8.8,2.4],[14.2,-9.2,2.8]]){
      for(let k=0;k<19;k++){
        const a=rand()*TAU,rad=Math.sqrt(rand())*r;
        const x=sx+Math.cos(a)*rad,z=sz+Math.sin(a)*rad;
        flat(x,z,.15+rand()*.42,.10+rand()*.30,choose(['abac89','a5a786','b6b493','b7ae8a']),.050+k*.0001,7,.35);
        for(let n=0;n<8;n++){
          const xx=x+(rand()-.5)*1.30,zz=z+(rand()-.5)*.93,l=.10+rand()*.17;
          tri([xx-l,.055,zz-.08],[xx+.025,.055,zz+.03],[xx+l,.055,zz+.11],choose(['939b77','9fa480','aaae88','a7a384']),false);
        }
      }
    }
    // Plank joins, repaired timber and polished brass distinguish the serving sill.
    for(let i=0;i<19;i++){
      const x=-9.21+i*.28,offset=rand()*.06;
      box(x,.932,3.16,.013,.003,.30,'836444');
      box(x+.04,.932,3.19+offset,.145,.003,.01,'c5a573');
    }
    for(const [x,z] of [[3.35,2.05],[6.12,5.02],[8.89,2.05]]){
      for(let i=0;i<5;i++)box(x-.56,.927,z-.33+i*.15,1.12,.004,.009,'a8885c');
      for(const k of [-1,1]){
        const xx=x+k*.31;
        flat(xx,z+.08,.095,.087,'e4ddbf',.934,11);
        beam([xx,.941,z+.08],[xx,.998,z+.08],.050,'c9b88b',9,.047);
      }
    }
    // Exterior leaves are a tiny independent dynamic range. Each cluster bends
    // about its stalk on wind beats without moving any architectural geometry.
    addGateLeaves();
    for(const [x,y,z,a] of [[-17,3.10,-4.9,.5],[-14.9,2.85,-3.95,-.7],[-10.5,3.22,-6,-1.8],[-6.4,3.54,2.61,1.3],[7.5,3.76,9.88,-1.1]]){
      const start=coords.length,dx=Math.cos(a),dz=Math.sin(a);
      beam([x,y,z],[x+dx*1.12,y-.21,z+dz*1.12],.013,'6e7951',4,.006);
      for(let i=0;i<12;i++){
        const t=(i+1)/13,d=a+(i%2?-1:1)*(.55+rand()*.48);
        leaf([x+dx*t*1.1,y-.21*t,z+dz*t*1.1],[Math.cos(d),-.65-rand()*.27,Math.sin(d)],.27+rand()*.25,.036+rand()*.02,choose(['58723f','778d50','9da763','526c45']));
      }
      remember('foliage',start,{x,y,z,phase:a});
    }
    quad([-76,-.88,-76],[-76,-.88,76],[76,-.88,76],[76,-.88,-76],'9eaa83',false);
  }
  return {positions:new Float32Array(coords),colors:new Float32Array(colors),surfaces:walking?new Float32Array(surfaces):null,moving};
}
// Orthographic software rasterizer for visitors whose browsers disable WebGL.
// The same triangle depth and shaded vertex colors are used in both renderers.
function paintSoftware(model, width, height, right, up, depth, scale, cx, cy, pixels, zbuffer) {
  pixels.fill(0); zbuffer.fill(-Infinity);
  const coords=model.positions, colors=model.colors;
  const screenX=(i)=>cx+(coords[i]*right[0]+coords[i+1]*right[1]+coords[i+2]*right[2])*scale;
  const screenY=(i)=>cy-(coords[i]*up[0]+coords[i+1]*up[1]+coords[i+2]*up[2])*scale;
  const distance=(i)=>coords[i]*depth[0]+coords[i+1]*depth[1]+coords[i+2]*depth[2];
  for(let i=0;i<coords.length;i+=9){
    const x0=screenX(i), x1=screenX(i+3), x2=screenX(i+6);
    const y0=screenY(i), y1=screenY(i+3), y2=screenY(i+6);
    const left=Math.max(0,Math.floor(Math.min(x0,x1,x2))),rightEdge=Math.min(width-1,Math.ceil(Math.max(x0,x1,x2)));
    const top=Math.max(0,Math.floor(Math.min(y0,y1,y2))),bottom=Math.min(height-1,Math.ceil(Math.max(y0,y1,y2)));
    const dx1=x1-x0,dy1=y1-y0,dx2=x2-x0,dy2=y2-y0,det=dx1*dy2-dy1*dx2;
    if(Math.abs(det)<.008||left>rightEdge||top>bottom)continue;
    const inv=1/det,z0=distance(i),dz1=distance(i+3)-z0,dz2=distance(i+6)-z0;
    const r=Math.round(colors[i]*255),g=Math.round(colors[i+1]*255),b=Math.round(colors[i+2]*255);
    const du=dy2*inv,dv=-dy1*inv;
    for(let y=top;y<=bottom;y++){
      const yy=y+.5-y0,xx=left+.5-x0;
      let u=(xx*dy2-yy*dx2)*inv,v=(yy*dx1-xx*dy1)*inv,index=y*width+left;
      for(let x=left;x<=rightEdge;x++,index++,u+=du,v+=dv){
        if(u<0||v<0||u+v>1)continue;
        const z=z0+u*dz1+v*dz2;
        if(z<zbuffer[index])continue;
        zbuffer[index]=z;const n=index*4;pixels[n]=r;pixels[n+1]=g;pixels[n+2]=b;pixels[n+3]=255;
      }
    }
  }
}
let sharedModel,sharedParking;
const parkingStops=[
  {label:'Entry and turning',point:[10.9,1.0,7.5],angle:-27,copy:'Use the surveyed gate width and road edge to draw a turning path for the actual vehicles. Keep reversing and passenger drop-off away from the pedestrian strip.'},
  {label:'Parking surface',point:[-5,.9,-3.5],angle:21,copy:'Test turning and rows against the dry usable footprint. The cars are scale cues. A bay count needs a dimensioned layout, the proposed vehicle mix and the panchayat review.'},
  {label:'Walking route',point:[-3,.55,7.22],angle:-14,copy:'Reserve a firm, drained pedestrian strip. Survey the complete route to the bakehouse gate, including any public-road crossing, distance, lighting and level changes.'},
  {label:'Rain drainage',point:[10.3,1.23,-7.52],angle:65,copy:'Hold a planted area for runoff, then establish levels and a lawful outlet. Test the wet surface before using it for visitors or deliveries.'}
];
const parcelNotes={
  garden:{title:'40-cent compound',text:'The owner reports 17,424 ft² inside. Roofs and landmarks follow the supplied views. Proposed uses and boundary shape need a measured survey.'},
  parking:{title:'21-cent outside parking',text:'The owner reports 9,147.6 ft² outside. This separate sketch illustrates arrival and parking. Its shape, gate, orientation and connection to the compound are unverified.'}
};
function markerButtons(items){return items.map((s,i)=>`<button class="gt-pin" type="button" aria-label="Explore ${s.label}" aria-pressed="false" data-stop="${i}">${i+1}</button>`).join('');}
function locationButtons(items){return items.map((s,i)=>`<button type="button" data-stop="${i}" aria-pressed="false"><span>${i+1}</span>${s.label}</button>`).join('');}

// Eye-level rendering uses a perspective projection and clips geometry to the near plane.
// The software renderer performs the same perspective depth test when WebGL is disabled.
const WALK_NEAR=.12,WALK_FAR=115;
const walkStops=[
 {name:'Through the gate',scene:'garden',at:[-23.10,1.57,-4.92],look:[-.4,1.54,-2.50],image:'archive/gateway.webp',imageLabel:'Owner photograph · entrance',copy:'Open the two mesh leaves and step between the bamboo and the low pavilion. The two roofs frame the first view into the court.'},
 {name:'Pastry counter',scene:'garden',at:[-6.5,1.66,.18],look:[-6.6,1.3,3.72],image:'cinema/verandah-prep.webp',imageLabel:'Concept photograph · service',copy:'Step up to the pavilion counter. The proposed service edge faces the courtyard and keeps guests outside the production route.'},
 {name:'Bakehouse verandah',scene:'garden',at:[4.12,1.66,-1.07],look:[3.82,1.75,-4.77],image:'archive/cottage.webp',imageLabel:'Owner photograph · bakehouse',copy:'The white cottage becomes the proposed production kitchen. Approach the door or choose Enter kitchen to look inside.'},
 {name:'Inside the kitchen',scene:'kitchen',at:[.22,1.64,3.03],look:[-.8,1.28,-3.6],image:'scene-oven.webp',imageLabel:'Concept photograph · baking',copy:'Walk the centre aisle between dough preparation, baking and finishing. This interior illustrates a possible equipment layout inside the cottage.'},
 {name:'Garden gathering',scene:'garden',at:[10.94,1.66,9.80],look:[3.45,1.02,3.07],image:'cinema/long-table.webp',imageLabel:'Concept photograph · gathering',copy:'Six everyday tables make 24 places. Switch to the 40-guest arrangement to see four extra tables and hired shelter. Capacity and dry cover need verification.'},
 {name:'The bamboo hut',scene:'garden',at:[-8.35,1.66,-3.3],look:[-12.4,2.76,-6.8],image:'archive/stilt-hut.webp',imageLabel:'Owner photograph · bamboo hut',copy:'Look up through the original bamboo cluster. The elevated hut stays a landmark and all guest seating remains on the ground.'},
 {name:'Outside parking',scene:'parking',at:[10.65,1.65,7.65],look:[-4.9,1.0,-3.6],copy:'This is the separate 21-cent outside parcel. Its shape, road crossing and connection to the compound require a survey.'}
];
function getWalkCamera(cam){
  const sy=Math.sin(cam.yaw),cy=Math.cos(cam.yaw),sp=Math.sin(cam.pitch),cp=Math.cos(cam.pitch);
  return {right:[cy,0,sy],up:[-sy*sp,cp,cy*sp],forward:[sy*cp,sp,-cy*cp]};
}
function walkLook(at,point){
  const d=sub(point,at);
  return {x:at[0],y:at[1],z:at[2],yaw:Math.atan2(d[0],-d[2]),pitch:Math.atan2(d[1],Math.hypot(d[0],d[2]))};
}
const walkCache=new Map();
function walkGeometry(scene,event){
  const key=scene==='garden'?(event?'walk-event':'walk-garden'):scene;
  if(!walkCache.has(key))walkCache.set(key,key==='parking'?(sharedParking||(sharedParking=buildModel('parking'))):buildModel(key));
  return walkCache.get(key);
}
function walkSoftware(model,width,height,cam,axes,focal,evening,pixels,depthBuffer){
  pixels.fill(0);depthBuffer.fill(0);
  const v=model.positions,col=model.colors,rv=axes.right,uv=axes.up,fv=axes.forward;
  const halfX=width/2,halfY=height/2,near=WALK_NEAR,mapping=model.surfaces,grain=mapping?gardenGrain().values:null;
  function raster(ax,ay,az,bx,by,bz,cx,cy,cz,r,g,b,map){
    const za=1/az,zb=1/bz,zc=1/cz;
    const x0=halfX+focal*ax*za,x1=halfX+focal*bx*zb,x2=halfX+focal*cx*zc;
    const y0=halfY-focal*ay*za,y1=halfY-focal*by*zb,y2=halfY-focal*cy*zc;
    const left=Math.max(0,Math.floor(Math.min(x0,x1,x2))),end=Math.min(width-1,Math.ceil(Math.max(x0,x1,x2)));
    const top=Math.max(0,Math.floor(Math.min(y0,y1,y2))),bottom=Math.min(height-1,Math.ceil(Math.max(y0,y1,y2)));
    if(left>end||top>bottom)return;
    const dx1=x1-x0,dy1=y1-y0,dx2=x2-x0,dy2=y2-y0,det=dx1*dy2-dy1*dx2;
    if(Math.abs(det)<.009)return;
    const inv=1/det,du=dy2*inv,dv=-dy1*inv,dz1=zb-za,dz2=zc-za;
    let ua,ub,uc,va,vb,vc;
    if(map){
      ua=map[0]*za;ub=map[2]*zb-ua;uc=map[4]*zc-ua;
      va=map[1]*za;vb=map[3]*zb-va;vc=map[5]*zc-va;
    }
    for(let y=top;y<=bottom;y++){
      const yy=y+.5-y0,xx=left+.5-x0;
      let u=(xx*dy2-yy*dx2)*inv,vv=(yy*dx1-xx*dy1)*inv,index=y*width+left;
      for(let x=left;x<=end;x++,u+=du,vv+=dv,index++){
        if(u<0||vv<0||u+vv>1)continue;
        const z=za+u*dz1+vv*dz2;if(z<depthBuffer[index])continue;
        depthBuffer[index]=z;const p=index*4;let factor=1;
        if(map){
          const tx=Math.floor((ua+u*ub+vv*uc)*256/z)&255,ty=Math.floor((va+u*vb+vv*vc)*256/z)&255;
          factor+=map[6]*grain[ty*256+tx];
        }
        pixels[p]=r*factor;pixels[p+1]=g*factor;pixels[p+2]=b*factor;pixels[p+3]=255;
      }
    }
  }
  for(let i=0;i<v.length;i+=9){
    const px=v[i]-cam.x,py=v[i+1]-cam.y,pz=v[i+2]-cam.z;
    const qx=v[i+3]-cam.x,qy=v[i+4]-cam.y,qz=v[i+5]-cam.z;
    const rx=v[i+6]-cam.x,ry=v[i+7]-cam.y,rz=v[i+8]-cam.z;
    const az=px*fv[0]+py*fv[1]+pz*fv[2],bz=qx*fv[0]+qy*fv[1]+qz*fv[2],cz=rx*fv[0]+ry*fv[1]+rz*fv[2];
    if(Math.max(az,bz,cz)<near||Math.min(az,bz,cz)>WALK_FAR)continue;
    const ax=px*rv[0]+pz*rv[2],bx=qx*rv[0]+qz*rv[2],cx=rx*rv[0]+rz*rv[2];
    const ay=px*uv[0]+py*uv[1]+pz*uv[2],by=qx*uv[0]+qy*uv[1]+qz*uv[2],cy=rx*uv[0]+ry*uv[1]+rz*uv[2];
    const dist=Math.max(0,(az+bz+cz)/3),fog=clamp((dist-13)/80,0,.63);
    const lamp=col[i]>1.5?1:0,baseR=col[i]-lamp*2,baseG=col[i+1],baseB=col[i+2];
    const warm=evening?clamp((v[i]*-.017+v[i+2]*.011+.34),0,.60):0;
    const r=255*((baseR*(evening?.79+warm*.26:1.065)+lamp*(evening?.37:.025))*(1-fog)+(evening?.56:.87)*fog),
          g=255*((baseG*(evening?.72+warm*.065:1.035)+lamp*(evening?.22:.022))*(1-fog)+(evening?.51:.90)*fog),
          b=255*((baseB*(evening?.84-warm*.18:1.015)+lamp*(evening?.035:.015))*(1-fog)+(evening?.60:.83)*fog);
    const texture=mapping&&mapping[i+2]?[mapping[i],mapping[i+1],mapping[i+3],mapping[i+4],mapping[i+6],mapping[i+7],mapping[i+2]]:null;
    if(Math.min(az,bz,cz)>=near){raster(ax,ay,az,bx,by,bz,cx,cy,cz,r,g,b,texture);continue;}
    const original=[[ax,ay,az,texture?.[0]||0,texture?.[1]||0],[bx,by,bz,texture?.[2]||0,texture?.[3]||0],[cx,cy,cz,texture?.[4]||0,texture?.[5]||0]],clipped=[];
    let last=original[2];
    for(const next of original){
      if((last[2]>=near)!==(next[2]>=near)){
        const t=(near-last[2])/(next[2]-last[2]);clipped.push(last.map((value,j)=>j===2?near:value+(next[j]-value)*t));
      }
      if(next[2]>=near)clipped.push(next);last=next;
    }
    for(let k=1;k+1<clipped.length;k++){
      const a=clipped[0],b1=clipped[k],c=clipped[k+1];
      raster(a[0],a[1],a[2],b1[0],b1[1],b1[2],c[0],c[1],c[2],r,g,b,texture?[a[3],a[4],b1[3],b1[4],c[3],c[4],texture[6]]:null);
    }
  }
}
class WalkSurface {
  constructor(canvas){
    this.canvas=canvas;
    try{
      this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,depth:true,premultipliedAlpha:true});
      if(this.gl){this.prepareGPU();return;}
    }catch{}
    this.useSoftware();
  }
  useSoftware(){
    if(this.gl){const c=document.createElement('canvas');c.className=this.canvas.className;c.setAttribute('aria-hidden','true');this.canvas.replaceWith(c);this.canvas=c;}
    this.gl=null;this.ctx=this.canvas.getContext('2d',{alpha:true});
  }
  prepareGPU(){
    const gl=this.gl;
    const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Walk projection could not start');return s;};
    const vert=shader(gl.VERTEX_SHADER,`attribute vec3 point;attribute vec3 pigment;attribute vec3 surfaceUV;varying mediump vec3 detail;uniform vec3 eye,axisR,axisU,axisF;uniform vec2 lens;
      uniform mediump float dusk;varying lowp vec3 paint;varying mediump float fog;
      void main(){detail=surfaceUV;vec3 p=point-eye;float z=dot(p,axisF);float n=.12;float f=115.;
        gl_Position=vec4(dot(p,axisR)*lens.x,dot(p,axisU)*lens.y,z*(f+n)/(f-n)-2.*f*n/(f-n),z);
        float lamp=step(1.5,pigment.r),warm=clamp(-point.x*.017+point.z*.011+.34,0.,.60);
        vec3 surface=pigment-vec3(lamp*2.,0.,0.);
        paint=surface*mix(vec3(1.065,1.035,1.015),vec3(.79+warm*.26,.72+warm*.065,.84-warm*.18),dusk)
          +lamp*mix(vec3(.025,.022,.015),vec3(.37,.22,.035),dusk);fog=clamp((z-13.)/80.,0.,.63);}`);
    const frag=shader(gl.FRAGMENT_SHADER,`precision mediump float;varying lowp vec3 paint;varying mediump float fog;uniform mediump float dusk;varying mediump vec3 detail;uniform sampler2D grainMap;
      void main(){vec3 haze=mix(vec3(.87,.90,.83),vec3(.56,.51,.60),dusk);
      float grain=1.+detail.z*(texture2D(grainMap,detail.xy).r*2.-1.);
      gl_FragColor=vec4(mix(paint,haze,fog)*grain,1.);}`);
    const program=gl.createProgram();gl.attachShader(program,vert);gl.attachShader(program,frag);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Walk program could not start');gl.useProgram(program);
    gl.deleteShader(vert);gl.deleteShader(frag);this.program=program;this.buffers=[];
    for(const attribute of ['point','pigment']){const buf=gl.createBuffer(),i=gl.getAttribLocation(program,attribute);gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.enableVertexAttribArray(i);gl.vertexAttribPointer(i,3,gl.FLOAT,false,0,0);this.buffers.push(buf);}
    this.uvAttribute=gl.getAttribLocation(program,'surfaceUV');this.uvBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,this.uvBuffer);gl.vertexAttribPointer(this.uvAttribute,3,gl.FLOAT,false,0,0);
    this.texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.texture);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,256,256,0,gl.LUMINANCE,gl.UNSIGNED_BYTE,gardenGrain().bytes);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);gl.uniform1i(gl.getUniformLocation(program,'grainMap'),0);
    this.uniforms={};for(const name of ['eye','axisR','axisU','axisF','lens','dusk'])this.uniforms[name]=gl.getUniformLocation(program,name);
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(0,0,0,0);
  }
  setMesh(mesh){
    if(this.mesh===mesh)return;this.mesh=mesh;this.gatePosition=undefined;this.windPosition=undefined;
    if(this.gl){
      const gl=this.gl;
      for(const [i,data] of [mesh.positions,mesh.colors].entries()){
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffers[i]);gl.bufferData(gl.ARRAY_BUFFER,data,i===0&&mesh.moving?.length?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);
      }
      if(mesh.surfaces){
        gl.enableVertexAttribArray(this.uvAttribute);gl.bindBuffer(gl.ARRAY_BUFFER,this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,mesh.surfaces,gl.STATIC_DRAW);
      }else{gl.disableVertexAttribArray(this.uvAttribute);gl.vertexAttrib3f(this.uvAttribute,0,0,0);}
    }
  }
  setMotion(opening,wind){
    const mesh=this.mesh;
    if(!mesh?.moving?.length)return;
    const gateChanged=this.gatePosition!==opening,windChanged=this.windPosition!==wind;
    if(!gateChanged&&!windChanged)return;
    this.gatePosition=opening;this.windPosition=wind;
    const gpu=this.gl;
    if(gpu)gpu.bindBuffer(gpu.ARRAY_BUFFER,this.buffers[0]);
    for(const part of mesh.moving){
      const gate=part.kind==='gate';
      if(gate&&!gateChanged||!gate&&!windChanged)continue;
      const base=part.original,range=mesh.positions.subarray(part.start,part.start+base.length);
      if(gate){
        const angle=part.side*entryGate.angle*opening,c=Math.cos(angle),s=Math.sin(angle);
        for(let j=0;j<base.length;j+=3){
          const x=base[j]-entryGate.x,z=base[j+2]-part.hinge;
          range[j]=entryGate.x+x*c+z*s;range[j+2]=part.hinge-x*s+z*c;
        }
      }else{
        const a=wind*Math.cos(part.phase)*.13,b=wind*Math.sin(part.phase+.6)*.09;
        for(let j=0;j<base.length;j+=3){
          const flex=Math.min(1.5,Math.hypot(base[j]-part.x,base[j+2]-part.z));
          range[j]=base[j]+a*flex;range[j+1]=base[j+1]+b*flex;
          range[j+2]=base[j+2]-a*.37*flex;
        }
      }
      if(gpu)gpu.bufferSubData(gpu.ARRAY_BUFFER,part.start*4,range);
    }
  }
  draw(cam,evening,frame){
    const box=frame.getBoundingClientRect();if(box.width<2||box.height<2)return;
    const ratio=this.gl?Math.min(window.devicePixelRatio||1,1.65):Math.min(1,780/box.width,640/box.height);
    const w=Math.max(2,Math.round(box.width*ratio)),h=Math.max(2,Math.round(box.height*ratio));
    if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
    const axes=getWalkCamera(cam),vertical=w/h<.85?78:61,focal=h*.5/Math.tan(vertical*DEG*.5);
    frame.style.setProperty('--walk-horizon',clamp(50+100*focal*Math.tan(cam.pitch)/h,8,93)+'%');
    const gl=this.gl;
    if(gl){
      const u=this.uniforms;gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);
      gl.uniform3f(u.eye,cam.x,cam.y,cam.z);gl.uniform3fv(u.axisR,axes.right);gl.uniform3fv(u.axisU,axes.up);gl.uniform3fv(u.axisF,axes.forward);
      gl.uniform2f(u.lens,2*focal/w,2*focal/h);gl.uniform1f(u.dusk,evening?1:0);gl.drawArrays(gl.TRIANGLES,0,this.mesh.positions.length/3);return;
    }
    if(!this.ctx)return;
    if(!this.image||this.image.width!==w||this.image.height!==h){this.image=this.ctx.createImageData(w,h);this.depth=new Float32Array(w*h);}
    walkSoftware(this.mesh,w,h,cam,axes,focal,evening,this.image.data,this.depth);this.ctx.putImageData(this.image,0,0);
  }
  close(){if(this.gl){this.buffers?.forEach(b=>this.gl.deleteBuffer(b));this.gl.deleteBuffer(this.uvBuffer);this.gl.deleteTexture(this.texture);this.gl.deleteProgram(this.program);this.gl.getExtension('WEBGL_lose_context')?.loseContext();}}
}
const scenicPaths={
 '0:1':[[-18.91,-4.74],[-16.65,-4.22],[-14.8,-3.88],[-10,-1.6],[-6.9,-.2]],
 '1:2':[[-4.4,-1.33],[.8,-1.55],[3.02,-1.15]],
 '4:5':[[10.94,7.16],[10.82,-.08],[.65,-.4],[-6.9,-1.12]],
};
function walkAllowed(scene,x,z,event,opening=1){
  if(scene==='kitchen')return x> -1.19 && x<1.19 && z> -3.25 && z<3.38;
  if(scene==='parking'){
    if(x< -14.4||x>14.4||z< -8.45||z>8.69)return false;
    return ![[-8.5,-4.75],[-5.5,-4.76],[1.95,4]].some(([a,b])=>Math.abs(x-a)<.98 && Math.abs(z-b)<1.67);
  }
  if(x< -23.80||x>18.25||z< -13.25||z>13.15)return false;
  if(x< -18.45&&(z<entryGate.south+.20||z>entryGate.north-.20))return false;
  if(x<entryGate.x+entryGate.leaf+.19){
    for(const [hinge,sign] of [[entryGate.south,1],[entryGate.north,-1]]){
      const angle=entryGate.angle*opening,dx=Math.sin(angle),dz=sign*Math.cos(angle);
      const d=clamp((x-entryGate.x)*dx+(z-hinge)*dz,0,entryGate.leaf);
      if(Math.hypot(x-entryGate.x-dx*d,z-hinge-dz*d)<.17)return false;
    }
  }
  const occupied=[[-2.0,12.68,-12,-4.75],[-10.72,.2,3.41,9.65],[.05,1.34,4.08,9.02],[11.8,16.67,.98,7.30],[-14.12,-10.13,-8.61,-5.19]];
  if(occupied.some(([l,r,b,t])=>x>l&&x<r&&z>b&&z<t))return false;
  const tables=[[3.35,2.05],[3.35,5.02],[6.12,2.05],[6.12,5.02],[8.89,2.05],[8.89,5.02]];
  if(event)tables.push([3.45,8.62],[6.02,8.62],[9.45,8.62],[3.80,11.35]);
  return !tables.some(([a,b])=>Math.abs(x-a)<.72&&Math.abs(z-b)<.92);
}
const walkActions={ArrowUp:'forward',KeyW:'forward',ArrowDown:'back',KeyS:'back',KeyA:'strafeL',KeyD:'strafeR',ArrowLeft:'turnL',ArrowRight:'turnR'};
const moveGlyph={forward:'↑',back:'↓',turnL:'↶',turnR:'↷',strafeL:'←',strafeR:'→'};
const moveName={forward:'Walk forward',back:'Walk backward',turnL:'Turn left',turnR:'Turn right',strafeL:'Step left',strafeR:'Step right'};
const movementPad=keys=>keys.map(k=>`<button type="button" data-step="${k}" aria-label="${moveName[k]}" title="${moveName[k]}">${moveGlyph[k]}</button>`).join('');
class GardenWalk {
  constructor(tour,origin,initial=0,options={}){
    this.tour=tour;this.origin=origin;this.keys=new Set();this.holds=new Map();this.lookDrag=null;this.filter=options.dusk?'dusk':'day';this.event=Boolean(options.event);
    this.gateOpen=options.gateOpen??(initial!==0);this.gateAmount=this.gateOpen?1:0;this.wind=0;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.life=new AbortController();this.dialog=document.createElement('dialog');this.dialog.className='gw-dialog';this.dialog.setAttribute('aria-label','The garden, an interactive 3D walkthrough');
    this.dialog.innerHTML=`<div class="gw-world"><header class="gw-head"><div><span class="gw-brand">Pâte à Chaya</span><span class="gw-divider"></span><span>3D walkthrough</span></div><button class="gw-exit" type="button" data-command="exit" aria-label="Exit walkthrough">Exit <span aria-hidden="true">×</span></button></header>
      <div class="gw-stage" tabindex="0" role="group" aria-label="First-person scene. W and S move forward and back. A and D step sideways. Arrow keys move or turn. Drag to look. Escape exits."><canvas class="gw-canvas" aria-hidden="true"></canvas>
      <div class="gw-mode-bar"><div class="gw-light-controls" role="group" aria-label="Lighting"><button type="button" data-light="day" aria-pressed="true">Day</button><button type="button" data-light="dusk" aria-pressed="false">Dusk</button></div><div class="gw-seats-controls" role="group" aria-label="Garden setup"><button type="button" data-seats="24" aria-pressed="true">24 seats</button><button type="button" data-seats="40" aria-pressed="false">40 seats</button></div></div>
      <div class="gw-stage-note">Illustrative 3D reconstruction</div>
      <div class="gw-walkpad" role="group" aria-label="Move and turn"><span class="gw-pad-words">Move &amp; turn</span><div>${movementPad(['turnL','forward','turnR','strafeL','back','strafeR'])}</div></div>
      <div class="gw-gate" hidden><button type="button" data-command="gate" aria-pressed="false">Open gate</button><button type="button" data-command="gate-replay" hidden>Replay opening</button></div>
      <button type="button" class="gw-door" data-command="door" hidden>Enter kitchen <span aria-hidden="true">↗</span></button>
      <div class="gw-reference" hidden><button type="button" data-command="close-photo" aria-label="Close reference image">×</button><img loading="lazy" alt=""><p></p></div></div>
      <section class="gw-story"><div class="gw-location"><span class="gw-kicker"></span><h3></h3><p class="gw-copy" aria-live="polite" aria-atomic="true"></p></div><div class="gw-navigate"><label>Jump to a stop <select aria-label="Jump to a guided stop">${walkStops.map((s,i)=>`<option value="${i}">${i+1}. ${s.name}</option>`).join('')}</select></label><div class="gw-nav-buttons"><button type="button" data-command="prev" title="Previous stop" aria-label="Previous stop">←</button><button type="button" data-command="next">Next stop →</button><button type="button" data-command="photo">Photo</button><button type="button" data-command="sphere">Immersive 360°</button><button type="button" data-command="orbit">Orbit view</button></div><nav class="gw-studios" aria-label="Continue to a project studio"><a href="#kitchen-3d" data-studio="kitchen-3d">Costed kitchen ↗</a><a href="#box-3d" data-studio="box-3d">Packaging studio ↗</a></nav></div></section>
      <div class="gw-help"><span><kbd>W A S D</kbd> move · arrows turn · drag to look</span><span>Use on-screen controls with touch.</span></div></div>`;
    document.body.append(this.dialog);this.stage=this.dialog.querySelector('.gw-stage');this.canvas=this.dialog.querySelector('canvas');
    this.renderer=new WalkSurface(this.canvas);this.bind();
    this.resize=new ResizeObserver(()=>this.renderSoon());this.resize.observe(this.stage);
    this.previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    if(typeof this.dialog.showModal==='function')this.dialog.showModal();else this.dialog.setAttribute('open','');
    this.dialog.classList.toggle('gw-dusk',this.filter==='dusk');
    this.dialog.querySelectorAll('[data-light]').forEach(b=>b.setAttribute('aria-pressed',String(this.filter===b.dataset.light)));
    this.dialog.querySelectorAll('[data-seats]').forEach(b=>b.setAttribute('aria-pressed',String((this.event?'40':'24')===b.dataset.seats)));
    this.goto(initial,false);this.stage.focus({preventScroll:true});this.renderSoon();this.scheduleBreeze();
  }
  on(el,event,cb,extra={}){
    el.addEventListener(event,e=>{
      const eventDialog=e.target?.closest?.('dialog');
      const focusDialog=document.activeElement?.closest?.('dialog');
      if((eventDialog&&eventDialog!==this.dialog)||(focusDialog&&focusDialog!==this.dialog)){
        if(event==='cancel'&&e.target===this.dialog)e.preventDefault();
        return;
      }
      cb(e);
    },{...extra,signal:this.life.signal});
  }
  bind(){
    this.on(this.dialog,'click',e=>{
      const step=e.target.closest('[data-step]');
      if(step){if(e.detail===0 || !this.lastPress || performance.now()-this.lastPress>700){this.path=null;this.moveAction(step.dataset.step,.15);this.renderSoon();}return;}
      const light=e.target.closest('[data-light]');if(light){
        this.filter=light.dataset.light;this.dialog.classList.toggle('gw-dusk',this.filter==='dusk');
        this.dialog.querySelectorAll('[data-light]').forEach(b=>b.setAttribute('aria-pressed',String(this.filter===b.dataset.light)));this.renderSoon();return;
      }
      const seats=e.target.closest('[data-seats]');if(seats){
        this.event=seats.dataset.seats==='40';this.dialog.querySelectorAll('[data-seats]').forEach(b=>b.setAttribute('aria-pressed',String(String(this.event?40:24)===b.dataset.seats)));
        if(this.scene==='garden'){this.renderer.setMesh(walkGeometry('garden',this.event));if(!walkAllowed(this.scene,this.cam.x,this.cam.z,this.event)){this.cam=walkLook(walkStops[4].at,walkStops[4].look);}}
        this.renderSoon();return;
      }
      const studio=e.target.closest('[data-studio]');
      if(studio){
        const destination=document.getElementById(studio.dataset.studio);
        if(destination){
          e.preventDefault();this.close(false,false);
          if(location.hash!==studio.hash)history.pushState(null,'',studio.hash);
          if(!destination.hasAttribute('tabindex'))destination.setAttribute('tabindex','-1');
          destination.scrollIntoView({block:'start',behavior:'instant'});
          destination.focus({preventScroll:true});
        }
        return;
      }
      const cmd=e.target.closest('[data-command]')?.dataset.command;if(!cmd)return;
      if(cmd==='exit')this.close();
      else if(cmd==='orbit')this.close(true);
      else if(cmd==='prev'||cmd==='next')this.goto((this.stop+(cmd==='prev'?-1:1)+walkStops.length)%walkStops.length,true);
      else if(cmd==='door')this.goto(this.scene==='kitchen'?2:3,false);
      else if(cmd==='gate')this.swingGate(!this.gateOpen);
      else if(cmd==='gate-replay')this.swingGate(true,true);
      else if(cmd==='photo')this.showPhoto(true);
      else if(cmd==='sphere'){
        this.clearMovement();this.path=null;this.windUntil=0;this.wind=0;
        if(typeof window.openPastryPanorama==='function'){
          window.openPastryPanorama(this.scene==='kitchen'?'bakehouse':'courtyard',e.target.closest('[data-command]'));
        }
      }
      else if(cmd==='close-photo')this.showPhoto(false);
    });
    this.on(this.dialog.querySelector('select'),'change',e=>this.goto(+e.target.value,false));
    this.on(this.dialog,'cancel',e=>{e.preventDefault();this.close();});
    this.on(this.dialog,'keydown',e=>{
      if(e.code==='Escape'){e.preventDefault();this.close();return;}
      if(e.target.matches('select,option,input'))return;
      const action=walkActions[e.code];if(!action)return;
      e.preventDefault();this.path=null;this.keys.add(e.code);this.invalidateUntilStill();
    });
    this.on(this.dialog,'keyup',e=>{if(walkActions[e.code]){this.keys.delete(e.code);e.preventDefault();}});
    this.on(window,'blur',()=>this.clearMovement());
    this.on(document,'visibilitychange',()=>{if(document.hidden)this.clearMovement();});
    this.on(this.stage,'pointerdown',e=>{
      const pad=e.target.closest('button[data-step]');
      if(e.button!==0)return;
      if(pad){
        e.preventDefault();this.path=null;this.lastPress=performance.now();this.holds.set(e.pointerId,pad.dataset.step);pad.setPointerCapture(e.pointerId);
        this.moveAction(pad.dataset.step,.07);this.invalidateUntilStill();return;
      }
      if(e.target.closest('button,.gw-reference,.gw-mode-bar'))return;
      this.path=null;this.stage.focus({preventScroll:true});this.lookDrag={id:e.pointerId,x:e.clientX,y:e.clientY};this.stage.setPointerCapture(e.pointerId);this.stage.classList.add('gw-grab');
    });
    this.on(this.stage,'pointermove',e=>{
      if(this.lookDrag?.id!==e.pointerId)return;const drag=this.lookDrag;
      this.cam.yaw+=(e.clientX-drag.x)*.006;this.cam.pitch=clamp(this.cam.pitch-(e.clientY-drag.y)*.0045,-.88,.92);
      drag.x=e.clientX;drag.y=e.clientY;this.renderSoon();
    });
    const release=e=>{
      if(this.holds.has(e.pointerId)){this.holds.delete(e.pointerId);this.lastPress=performance.now();}
      if(this.lookDrag?.id===e.pointerId){this.lookDrag=null;this.stage.classList.remove('gw-grab');}
    };
    for(const ev of ['pointerup','pointercancel','lostpointercapture'])this.on(this.stage,ev,release);
    this.on(this.renderer.canvas,'webglcontextlost',e=>{e.preventDefault();this.renderer.useSoftware();this.renderSoon();});
  }
  clearMovement(){this.keys.clear();this.holds.clear();this.lookDrag=null;this.stage.classList.remove('gw-grab');}
  showPhoto(show){
    const card=this.dialog.querySelector('.gw-reference'),s=walkStops[this.stop];
    if(show&&s.image){
      card.querySelector('img').src='/assets/'+s.image;card.querySelector('img').alt=s.imageLabel+' at '+s.name;
      card.querySelector('p').textContent=s.imageLabel;card.hidden=false;card.querySelector('button').focus({preventScroll:true});
    }else{card.hidden=true;if(show===false&&document.activeElement===card.querySelector('button'))this.dialog.querySelector('[data-command="photo"]').focus({preventScroll:true});}
  }
  goto(index,travel){
    const target=walkStops[index];if(!target)return;
    const previous=this.stop,oldScene=this.scene,oldCam=this.cam;
    if(previous===0&&index===1&&travel&&!this.gateOpen)this.swingGate(true);
    this.stop=index;this.scene=target.scene;this.clearMovement();this.path=null;this.showPhoto(false);
    this.renderer.setMesh(walkGeometry(this.scene,this.event));
    const end=walkLook(target.at,target.look);this.cam=end;
    if(this.scene!=='garden'){this.windUntil=0;this.wind=0;}
    const reverseKey=index+':'+previous;
    const waypoints=scenicPaths[previous+':'+index]||scenicPaths[reverseKey]?.slice().reverse();
    if(travel&&oldCam&&oldScene===this.scene&&waypoints&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      // A guided route starts from the previous stop only. A free-walk jump goes directly to the landmark.
      const prev=walkStops[previous];
      if(Math.hypot(oldCam.x-prev.at[0],oldCam.z-prev.at[2])<2.3){
        const route=[[oldCam.x,oldCam.z],...waypoints,[end.x,end.z]],lengths=[];
        for(let i=1;i<route.length;i++)lengths.push(Math.hypot(route[i][0]-route[i-1][0],route[i][1]-route[i-1][1]));
        this.path={route,lengths,total:lengths.reduce((a,b)=>a+b,0),start:performance.now(),from:{...oldCam},end};
        this.cam={...oldCam};this.invalidateUntilStill();
      }
    }
    this.dialog.querySelector('select').value=String(index);
    this.dialog.querySelector('.gw-kicker').textContent='Stop '+(index+1)+' / '+walkStops.length+(this.scene==='parking'?'  ·  Separate outside parcel':'  ·  Inside the compound');
    this.dialog.querySelector('.gw-story h3').textContent=target.name;this.dialog.querySelector('.gw-copy').textContent=target.copy;
    this.dialog.querySelector('[data-command="photo"]').hidden=!target.image;
    this.dialog.querySelector('.gw-seats-controls').hidden=this.scene!=='garden';
    this.dialog.classList.toggle('gw-kitchen',this.scene==='kitchen');
    this.renderSoon();
  }
  swingGate(open,replay=false){
    this.gateOpen=open;
    const now=performance.now();
    if(this.reduced.matches){this.gateAmount=open?1:0;this.gateSwing=null;this.renderSoon();}
    else{
      this.gateSwing={start:now,from:this.gateAmount,to:open?1:0,replay,duration:replay?2050:1020};
      this.invalidateUntilStill();
    }
  }
  scheduleBreeze(){
    // A brief irregular gust only costs frames during its two-second pass.
    if(this.closed||typeof window.setTimeout!=='function')return;
    this.breezeTimer=window.setTimeout(()=>{
      if(this.closed)return;
      const activeDialog=document.activeElement?.closest?.('dialog');
      if(this.scene==='garden'&&!this.reduced.matches&&!document.hidden&&(!activeDialog||activeDialog===this.dialog)){
        this.windUntil=performance.now()+2350;this.invalidateUntilStill();
      }
      this.scheduleBreeze();
    },6800+Math.random()*5600);
  }
  moveAction(action,dt){
    if(action==='turnL'||action==='turnR'){this.cam.yaw+=(action==='turnR'?1:-1)*1.46*dt;return;}
    const angle=this.cam.yaw+(action==='strafeR'?Math.PI/2:action==='strafeL'?-Math.PI/2:action==='back'?Math.PI:0);
    const step=dt*(this.scene==='kitchen'?2.35:3.45),dx=Math.sin(angle)*step,dz=-Math.cos(angle)*step;
    if(walkAllowed(this.scene,this.cam.x+dx,this.cam.z,this.event,this.gateAmount))this.cam.x+=dx;
    if(walkAllowed(this.scene,this.cam.x,this.cam.z+dz,this.event,this.gateAmount))this.cam.z+=dz;
  }
  tick(now){
    this.ticking=0;if(this.closed)return;
    const dt=Math.min(.065,Math.max(.001,(now-(this.lastTick||now-16))/1000));this.lastTick=now;
    const activeDialog=document.activeElement?.closest?.('dialog');
    if(document.hidden||(activeDialog&&activeDialog!==this.dialog)){this.wind=0;this.windUntil=0;this.gateSwing=null;this.gateAmount=this.gateOpen?1:0;this.clearMovement();this.lastTick=0;return;}
    if(this.gateSwing){
      const swing=this.gateSwing,t=clamp((now-swing.start)/swing.duration,0,1);
      const ease=k=>k*k*(3-2*k);
      this.gateAmount=swing.replay?(t<.43?swing.from*(1-ease(t/.43)):ease((t-.43)/.57)):swing.from+(swing.to-swing.from)*ease(t);
      if(t===1){this.gateSwing=null;this.gateAmount=swing.to;}
    }
    if(this.windUntil){
      const t=1-clamp((this.windUntil-now)/2350,0,1);
      this.wind=Math.sin(t*Math.PI*2.6)*Math.sin(t*Math.PI);
      if(t>=1||this.reduced.matches){this.wind=0;this.windUntil=0;}
    }
    if(this.path){
      const q=this.path,t=clamp((now-q.start)/Math.min(4400,1800+q.total*80),0,1),u=t*t*(3-2*t);
      let distance=u*q.total,edge=0;
      while(edge<q.lengths.length-1&&distance>q.lengths[edge]){distance-=q.lengths[edge];edge++;}
      const p=q.route[edge],next=q.route[edge+1],v=distance/(q.lengths[edge]||1);
      this.cam.x=p[0]+(next[0]-p[0])*v;this.cam.z=p[1]+(next[1]-p[1])*v;
      const angle=((q.end.yaw-q.from.yaw+Math.PI*3)%TAU)-Math.PI;
      this.cam.yaw=q.from.yaw+u*angle;this.cam.pitch=q.from.pitch+u*(q.end.pitch-q.from.pitch);
      if(t===1){this.cam=q.end;this.path=null;}
    }
    const active=new Set([...this.keys].map(code=>walkActions[code]).concat([...this.holds.values()]));
    for(const a of active)this.moveAction(a,dt);
    const moving=this.path||this.holds.size||this.keys.size||this.gateSwing;
    if(moving||!this.windUntil||now-(this.lastWindDraw||0)>85){this.draw();this.lastWindDraw=now;}
    if(moving||this.windUntil)this.ticking=requestAnimationFrame(n=>this.tick(n));else this.lastTick=0;
  }
  invalidateUntilStill(){if(!this.ticking)this.ticking=requestAnimationFrame(n=>this.tick(n));}
  renderSoon(){if(this.frame||this.closed)return;this.frame=requestAnimationFrame(()=>{this.frame=0;if(!this.closed)this.draw();});}
  draw(){
    if(!this.cam)return;
    this.renderer.setMotion(this.gateAmount,this.wind);
    this.renderer.draw(this.cam,this.filter==='dusk',this.stage);
    const gate=this.dialog.querySelector('.gw-gate'),toggle=gate.querySelector('[data-command="gate"]'),replay=gate.querySelector('[data-command="gate-replay"]');
    gate.hidden=this.scene!=='garden'||Math.hypot(this.cam.x-entryGate.x,this.cam.z-(entryGate.south+entryGate.north)/2)>7;
    toggle.setAttribute('aria-pressed',String(this.gateOpen));
    toggle.textContent=this.gateOpen?'Close gate':'Open gate';
    replay.hidden=!this.gateOpen||this.reduced.matches;
    const door=this.dialog.querySelector('[data-command="door"]'),inside=this.scene==='kitchen';
    door.textContent=inside?'Return to verandah ↗':'Enter kitchen ↗';
    door.hidden=!(inside||(this.scene==='garden'&&Math.hypot(this.cam.x-3.82,this.cam.z+4.90)<4.6));
  }
  close(orbit=false,restore=true){
    if(this.closed)return;this.closed=true;this.life.abort();this.resize.disconnect();cancelAnimationFrame(this.frame);cancelAnimationFrame(this.ticking);
    if(this.breezeTimer)window.clearTimeout(this.breezeTimer);
    this.renderer.close();if(this.dialog.open&&typeof this.dialog.close==='function')this.dialog.close();this.dialog.remove();document.body.style.overflow=this.previousOverflow;
    this.tour.walk=null;
    if(orbit){
      this.tour.setParcel(this.scene==='parking'?'parking':'garden');this.tour.stage.scrollIntoView({block:'center',behavior:'instant'});this.tour.stage.focus({preventScroll:true});
    }else if(restore&&this.origin?.isConnected)this.origin.focus({preventScroll:true});
  }
}
const icons={
 left:'<path d="m13.5 6-5.5 6 5.5 6"/>',
 right:'<path d="m10.5 6 5.5 6-5.5 6"/>',
 in:'<path d="M5 12h14M12 5v14"/>',out:'<path d="M5 12h14"/>',
 home:'<path d="M5 9a7.5 7.5 0 1 1-.2 5.5M5 4v5h5"/>',
 rotate:'<path d="M4 13c0-2.5 3.6-4.6 8-4.6s8 2.1 8 4.6-3.6 4.5-8 4.5"/><path d="m14 15-2.6 2.7L14 20"/><path d="M12 4v6"/>',
 hand:'<path d="m8 13 .1-6a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v5-2a1.5 1.5 0 0 1 3 0v5.5a5.8 5.8 0 0 1-5.8 5.8h-1c-1.7 0-3.4-1-4.5-2.3l-4.5-5.6c-1.2-1.5 1-3.4 2.2-2.1z"/>'
};
const svg = name => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">'+icons[name]+'</svg>';
class GardenTour extends HTMLElement {
  connectedCallback(){
    if(this.abort)return;
    this.parcel="garden";this.stops=stops;this.abort=new AbortController();this.angle=ORBIT;this.tilt=HEIGHT;this.zoom=1;this.active=-1;this.dragged=false;this.points=new Map();
    this.innerHTML = `<div class="gt-view" role="group" aria-label="Interactive model of the bakehouse garden">
      <div class="gt-mode-choice"><button class="gt-walk-trigger" type="button" data-walk-launch>Enter 3D walkthrough <span aria-hidden="true">↗</span></button></div>
      <div class="gt-parcels" role="group" aria-label="Choose the parcel to explore"><button type="button" data-parcel="garden" aria-pressed="true">Inside <b>40 cents</b></button><button type="button" data-parcel="parking" aria-pressed="false">Outside parking <b>21 cents</b></button></div>
      <div class="gt-stage" tabindex="0" role="group" aria-label="Garden model. Drag to orbit, or use the arrow keys. Plus and minus zoom. Home resets the view.">
        <canvas class="gt-model" aria-hidden="true"></canvas>
        <div class="gt-pins">${markerButtons(this.stops)}</div>
        <div class="gt-top"><span class="gt-mode">${svg('rotate')} 360° orbit</span><span class="gt-orient" aria-hidden="true"></span></div>
        <div class="gt-hint">${svg('hand')} Drag to rotate</div>
      </div>
      <div class="gt-bar"><span class="gt-caption">Illustrative site model <span>·</span> Geometry is approximate.</span>
        <div class="gt-buttons">
          ${[['left','Rotate left'],['right','Rotate right'],['out','Zoom out'],['in','Zoom in'],['home','Reset view']].map(([key,desc])=>`<button type="button" data-action="${key}" title="${desc}" aria-label="${desc}">${svg(key)}</button>`).join('')}
        </div>
      </div>
      <div class="gt-list" role="group" aria-label="Explore locations in this parcel">${locationButtons(this.stops)}</div>
      <div class="gt-detail" aria-live="polite" aria-atomic="true"><b>${parcelNotes.garden.title}</b><p>${parcelNotes.garden.text}</p></div>
    </div>`;
    this.stage=this.querySelector('.gt-stage');this.canvas=this.querySelector('canvas');this.pins=[...this.querySelectorAll('.gt-pin')];this.orient=this.querySelector('.gt-orient');
    this.model=sharedModel || (sharedModel=buildModel());this.initGraphics();this.bind();
    this.resize=new ResizeObserver(()=>this.requestFrame());this.resize.observe(this.stage);this.requestFrame();
  }
  enterWalkthrough(trigger,stop=0,options={}){
    if(this.walk)return this.walk;
    const origin=trigger&&typeof trigger.focus==='function'?trigger:document.activeElement;
    const index=Number.isInteger(stop)&&stop>=0&&stop<walkStops.length?stop:0;
    this.walk=new GardenWalk(this,origin,index,options||{});return this.walk;
  }
  disconnectedCallback(){
    if(this.walk)this.walk.close();
    if(this.abort)this.abort.abort();this.abort=null;this.resize?.disconnect();cancelAnimationFrame(this.frame);cancelAnimationFrame(this.motion);
    if(this.gl && this.gpu){this.gl.deleteBuffer(this.gpu.position);this.gl.deleteBuffer(this.gpu.color);this.gl.deleteProgram(this.gpu.program);}
    this.gl=null;this.gpu=null;this.frame=0;this.soft=null;
  }
  initGraphics(){
    try{
      this.gl=this.canvas.getContext('webgl',{alpha:true,antialias:true,depth:true,premultipliedAlpha:true,failIfMajorPerformanceCaveat:false});
      if(this.gl){
        const gl=this.gl;
        const shader=(type,source)=>{
          const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);
          if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh;
        };
        const v=shader(gl.VERTEX_SHADER,`attribute vec3 position;attribute vec3 color;
          uniform vec3 axisX;uniform vec3 axisY;uniform vec3 axisZ;uniform vec2 scale;uniform vec2 shift;varying lowp vec3 paint;
          void main(){gl_Position=vec4(dot(position,axisX)*scale.x+shift.x,dot(position,axisY)*scale.y+shift.y,-dot(position,axisZ)/55.,1.);paint=color;}`);
        const f=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying lowp vec3 paint;void main(){gl_FragColor=vec4(paint,1.);}');
        const program=gl.createProgram();gl.attachShader(program,v);gl.attachShader(program,f);gl.linkProgram(program);
        if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
        gl.useProgram(program);gl.deleteShader(v);gl.deleteShader(f);
        const attribute=(key,data)=>{
          const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
          let pos=gl.getAttribLocation(program,key);gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0);return buf;
        };
        this.gpu={program,position:attribute('position',this.model.positions),color:attribute('color',this.model.colors)};
        for(const n of ['axisX','axisY','axisZ','scale','shift'])this.gpu[n]=gl.getUniformLocation(program,n);
        gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(0,0,0,0);
        this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.softwareCanvas();this.requestFrame();},{once:true,signal:this.abort.signal});return;
      }
    }catch{}this.softwareCanvas();
  }
  softwareCanvas(){
    this.gl=null;const old=this.canvas;this.canvas=document.createElement('canvas');this.canvas.className='gt-model';this.canvas.setAttribute('aria-hidden','true');old.replaceWith(this.canvas);
    this.soft=this.canvas.getContext('2d',{alpha:true});
  }
  listen(el,type,call,options={}){el.addEventListener(type,call,{...options,signal:this.abort.signal});}
  bind(){
    this.listen(this,'click',e=>{
      const launch=e.target.closest('[data-walk-launch]');if(launch){this.enterWalkthrough(launch,this.parcel==='parking'?6:0);return;}
      const parcel=e.target.closest('button[data-parcel]');if(parcel){this.setParcel(parcel.dataset.parcel);return;}
      const stop=e.target.closest('button[data-stop]');if(stop){this.select(+stop.dataset.stop);return;}
      const btn=e.target.closest('button[data-action]');if(btn)this.action(btn.dataset.action);
    });
    this.listen(this.stage,'keydown',e=>{
      if(e.target!==this.stage)return;
      const key={ArrowLeft:'left',ArrowRight:'right','+':'in','=':'in','-':'out','_':'out',Home:'home'}[e.key];
      if(key){e.preventDefault();this.action(key);}
      else if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();this.stopMotion();this.tilt=clamp(this.tilt+(e.key==='ArrowUp'?5:-5),16,61);this.requestFrame();}
    });
    this.listen(this.stage,'pointerdown',e=>{
      if(e.target.closest('button')||e.button!==0)return;
      this.stopMotion();this.points.set(e.pointerId,{x:e.clientX,y:e.clientY});this.stage.setPointerCapture(e.pointerId);
      this.stage.classList.add('gt-grabbing');this.dragged=true;
      if(this.points.size===2){this.pinchStart=this.pinchDistance();this.zoomStart=this.zoom;}
    });
    this.listen(this.stage,'pointermove',e=>{
      const p=this.points.get(e.pointerId);if(!p)return;
      const dx=e.clientX-p.x,dy=e.clientY-p.y;this.points.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(this.points.size===2){this.zoom=clamp(this.zoomStart*this.pinchDistance()/Math.max(1,this.pinchStart),.73,1.75);}
      else if(this.points.size===1){this.angle-=dx*.34;this.tilt=clamp(this.tilt+dy*.19,16,61);}
      this.requestFrame();
    });
    const release=e=>{this.points.delete(e.pointerId);if(!this.points.size)this.stage.classList.remove('gt-grabbing');};
    this.listen(this.stage,'pointerup',release);this.listen(this.stage,'pointercancel',release);this.listen(this.stage,'lostpointercapture',release);
    this.listen(this.stage,'wheel',e=>{
      if(!e.ctrlKey && !e.metaKey)return;e.preventDefault();this.stopMotion();this.zoom=clamp(this.zoom*Math.exp(-e.deltaY*.009),.73,1.75);this.requestFrame();
    },{passive:false});
    this.listen(this.stage,'dblclick',e=>{if(!e.target.closest('button'))this.action('home');});
  }
  setParcel(parcel){
    if(!parcelNotes[parcel]||parcel===this.parcel)return;
    this.stopMotion();this.points.clear();this.stage.classList.remove('gt-grabbing');this.parcel=parcel;this.stops=parcel==='parking'?parkingStops:stops;
    this.model=parcel==='parking'?(sharedParking||(sharedParking=buildModel('parking'))):sharedModel;
    if(this.gl){
      // Each attribute retains its buffer binding as mesh data is replaced.
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.gpu.position);this.gl.bufferData(this.gl.ARRAY_BUFFER,this.model.positions,this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.gpu.color);this.gl.bufferData(this.gl.ARRAY_BUFFER,this.model.colors,this.gl.STATIC_DRAW);
    }
    this.querySelector('.gt-pins').innerHTML=markerButtons(this.stops);this.querySelector('.gt-list').innerHTML=locationButtons(this.stops);
    this.pins=[...this.querySelectorAll('.gt-pin')];
    this.querySelectorAll('[data-parcel]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.parcel===parcel)));
    this.stage.setAttribute('aria-label',(parcel==='parking'?'Separate proposed parking parcel.':'Bakehouse compound.')+' Drag or use arrow keys to orbit. Plus and minus zoom. Home resets the view.');
    this.angle=ORBIT;this.tilt=parcel==='parking'?37:HEIGHT;this.zoom=1;this.dragged=false;
    this.mark(-1);this.requestFrame();
    this.dispatchEvent(new CustomEvent('bakehouse-parcel',{bubbles:true,detail:{parcel}}));
  }
  pinchDistance(){const [a,b]=[...this.points.values()];return Math.hypot(a.x-b.x,a.y-b.y);}
  stopMotion(){cancelAnimationFrame(this.motion);this.motion=0;}
  action(action){
    this.stopMotion();this.dragged=true;
    if(action==='in'||action==='out'){this.zoom=clamp(this.zoom*(action==='in'?1.15:1/1.15),.73,1.75);this.requestFrame();}
    else if(action==='home'){this.mark(-1);this.moveTo(ORBIT,this.parcel==='parking'?37:HEIGHT,1);}
    else this.moveTo(this.angle+(action==='right'?24:-24),this.tilt,this.zoom);
  }
  select(n){this.mark(n);this.dragged=true;this.moveTo(this.stops[n].angle,this.parcel==='parking'?40:HEIGHT+4,1.02);}
  mark(n){
    this.active=n;
    const s=this.stops[n];const detail=this.querySelector('.gt-detail');
    detail.querySelector('b').textContent=s?s.label:parcelNotes[this.parcel].title;
    detail.querySelector('p').textContent=s?s.copy:parcelNotes[this.parcel].text;
    this.querySelectorAll('button[data-stop]').forEach(el=>{
      const selected=+el.dataset.stop===n;el.classList.toggle('gt-active',selected);el.setAttribute('aria-pressed',String(selected));
    });
  }
  moveTo(dest,tilt,zoom){
    this.stopMotion();const start=this.angle,st=this.tilt,sz=this.zoom;
    const delta=((dest-start)%360+540)%360-180;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){this.angle=start+delta;this.tilt=tilt;this.zoom=zoom;this.requestFrame();return;}
    const begin=performance.now(),ms=Math.abs(delta)>40?580:260;
    const step=now=>{ const t=clamp((now-begin)/ms,0,1),smooth=t*t*(3-2*t);
      this.angle=start+delta*smooth;this.tilt=st+(tilt-st)*smooth;this.zoom=sz+(zoom-sz)*smooth;this.requestFrame();
      if(t<1)this.motion=requestAnimationFrame(step);else this.motion=0;
    };this.motion=requestAnimationFrame(step);
  }
  requestFrame(){if(this.frame)return;this.frame=requestAnimationFrame(()=>{this.frame=0;if(this.isConnected)this.draw();});}
  draw(){
    const w=this.stage.clientWidth,h=this.stage.clientHeight;if(!w||!h)return;
    const dpr=Math.min(this.gl?2:1.25,window.devicePixelRatio||1),W=Math.round(w*dpr),H=Math.round(h*dpr);
    if(this.canvas.width!==W||this.canvas.height!==H){this.canvas.width=W;this.canvas.height=H;}
    const angle=this.angle*DEG,tilt=this.tilt*DEG,sa=Math.sin(angle),ca=Math.cos(angle),se=Math.sin(tilt),ce=Math.cos(tilt);
    const right=[ca,0,-sa],up=[-sa*se,ce,-ca*se],depth=[sa*ce,se,ca*ce];
    const extents=this.parcel==='parking'?
      [[-15.1,-.76,-9.4],[-15.1,-.76,9.4],[15.1,-.76,-9.4],[15.1,-.76,9.4],[-13.5,3,-8],[12.0,3,-8.0],[13.2,1.72,8.9]]:
      [[-20.35,-.88,-14.15],[-20.35,-.88,14.15],[19.2,-.88,-14.15],[19.2,-.88,14.15],
      [-19,1.2,-14],[-19,1.2,14],[19,1.2,-14],[19,1.2,14],
      [11.9,9.2,-13.1],[-4.5,8.4,-12.9],[16.2,7.7,-10.1],[-16.7,6.3,10.8],[-14,8.2,-9.2],[-10.7,8.2,-9.1],[5.3,6.5,-7.9],[8,5.5,12.0]];
    const tx=extents.map(q=>dot(q,right)), ty=extents.map(q=>dot(q,up));
    const minX=Math.min(...tx),maxX=Math.max(...tx),minY=Math.min(...ty),maxY=Math.max(...ty);
    const sideGap=w<520?13:Math.max(40,w*.07),topGap=w<520?39:45,bottomGap=w<520?26:28;
    const scale=Math.min((w-2*sideGap)/(maxX-minX),(h-topGap-bottomGap)/(maxY-minY))*this.zoom;
    const cx=w*.5-(minX+maxX)*.5*scale,cy=(topGap+h-bottomGap)*.5+(minY+maxY)*.5*scale;
    const point=v=>[cx+dot(v,right)*scale,cy-dot(v,up)*scale];
    if(this.gl){
      const gl=this.gl,gpu=this.gpu;gl.viewport(0,0,W,H);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(gpu.program);
      gl.uniform3fv(gpu.axisX,right);gl.uniform3fv(gpu.axisY,up);gl.uniform3fv(gpu.axisZ,depth);
      gl.uniform2f(gpu.scale,2*scale/w,2*scale/h);gl.uniform2f(gpu.shift,2*cx/w-1,1-2*cy/h);
      gl.drawArrays(gl.TRIANGLES,0,this.model.positions.length/3);
    }else if(this.soft){
      const ctx=this.soft;
      if(!this.bitmap||this.bitmap.width!==W||this.bitmap.height!==H){
        this.bitmap=ctx.createImageData(W,H);this.zbuffer=new Float32Array(W*H);
      }
      paintSoftware(this.model,W,H,right,up,depth,scale*dpr,cx*dpr,cy*dpr,this.bitmap.data,this.zbuffer);
      ctx.putImageData(this.bitmap,0,0);
    }
    const display=((Math.round(this.angle)%360)+360)%360;
    this.orient.textContent=String(display).padStart(3,'0')+'°';
    this.classList.toggle('gt-used',this.dragged);
    this.querySelector('[data-action="in"]').disabled=this.zoom>=1.749;
    this.querySelector('[data-action="out"]').disabled=this.zoom<=.731;
    this.pins.forEach((button,i)=>{
      const [x,y]=point(this.stops[i].point);
      button.style.left=(x/w*100)+'%';button.style.top=(y/h*100)+'%';
      button.style.visibility=x<11||x>w-11||y<13||y>h-12?'hidden':'visible';
    });
  }
}
if(!customElements.get('garden-tour'))customElements.define('garden-tour',GardenTour);

if(typeof window!=='undefined'){window.enterGardenWalk=(trigger,stop=0,options={})=>document.querySelector('garden-tour')?.enterWalkthrough(trigger,stop,options);}
