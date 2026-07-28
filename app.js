const ALPHABET="ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
const VOWELS=new Set(["A","E","I","O","U"]);
const ARCHS=["Hexa-Órbita","Corona Estelar","Portal Poligonal","Nexo Radial","Cristal Ascendente","Espiral de Linaje","Matriz Orbital","Doble Umbral","Malla Solar","Catedral de Nodos"];
const state={name:"SALVADOR",mode:"ceremonial",complexity:68,exampleOffset:0};

const TRAITS=["Visión","Lealtad","Protección","Sabiduría","Creación","Justicia","Intuición","Propósito","Equilibrio","Liderazgo","Claridad","Transformación","Disciplina","Conexión"];
const messages=[
"Tu firma organiza la expansión alrededor de un centro estable.",
"Tu identidad visual combina dirección, memoria y protección.",
"Tu patrón revela una mente estructurada con capacidad de adaptación.",
"El núcleo conserva la esencia mientras las órbitas registran experiencias.",
"Tu firma avanza mediante conexiones múltiples sin perder coherencia.",
"El sello exterior traduce tu manera de manifestarte ante el entorno."
];

function normalizeName(value){
  return (value||"AEON").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase()
    .replace(/Ü/g,"U").replace(/[^A-ZÑ\s'-]/g,"").replace(/\s+/g," ").trim()||"AEON";
}
function valueOf(c){const i=ALPHABET.indexOf(c);return i>=0?i+1:0}
function hash(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function root(n){while(n>9)n=String(n).split("").reduce((a,b)=>a+Number(b),0);return n}
function analyze(raw){
  const normalized=normalizeName(raw),letters=[...normalized].filter(c=>ALPHABET.includes(c)),values=letters.map(valueOf),sum=values.reduce((a,b)=>a+b,0);
  const counts={};letters.forEach(c=>counts[c]=(counts[c]||0)+1);
  const unique=[...new Set(letters)],vowels=letters.filter(c=>VOWELS.has(c)).length,frequency=root(sum),seed=hash(`${normalized}|${values.join(".")}|FIRMA-V15`);
  const sequence=values.map(v=>String(v).padStart(2,"0")).join(".");
  return{normalized,letters,values,sum,counts,unique,vowels,consonants:letters.length-vowels,frequency,seed,sequence,
    repeats:Object.values(counts).filter(n=>n>1).length,axes:5+(unique.length%5),rings:2+(frequency%4),sides:5+(sum%5),arch:seed%ARCHS.length}
}
function ns(tag,attrs={}){const el=document.createElementNS("http://www.w3.org/2000/svg",tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el}
function clear(el){while(el.firstChild)el.removeChild(el.firstChild)}
function pathD(points){return points.map((p,i)=>`${i?"L":"M"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ")}
function polygon(sides,r,rot=0){const p=[];for(let i=0;i<=sides;i++){const a=rot+(i%sides)*Math.PI*2/sides;p.push([Math.cos(a)*r,Math.sin(a)*r])}return p}
function circlePoints(r,n=120,rot=0,sx=1,sy=1){const p=[];for(let i=0;i<=n;i++){const a=rot+i*Math.PI*2/n;p.push([Math.cos(a)*r*sx,Math.sin(a)*r*sy])}return p}
function spiralPoints(r0,r1,turns,phase=0,n=180){const p=[];for(let i=0;i<=n;i++){const t=i/n,a=phase+t*Math.PI*2*turns,r=r0+(r1-r0)*t;p.push([Math.cos(a)*r,Math.sin(a)*r])}return p}
function addPath(g,pts,o={}){const el=ns("path",{d:pathD(pts),fill:"none",stroke:o.stroke||"url(#goldGradient)","stroke-width":o.width||2,opacity:o.opacity??1,"stroke-linecap":"round","stroke-linejoin":"round"});g.appendChild(el);return el}
function addCircle(g,x,y,r,o={}){const el=ns("circle",{cx:x,cy:y,r,fill:o.fill||"none",stroke:o.stroke||"url(#goldGradient)","stroke-width":o.width||2,opacity:o.opacity??1});g.appendChild(el);return el}
function modeConfig(){return{
  ceremonial:{main:"url(#goldGradient)",secondary:"url(#goldGradient)",micro:1},
  technical:{main:"#d7e5ec",secondary:"#7aa0b2",micro:1.2},
  minimal:{main:"url(#goldGradient)",secondary:"url(#goldGradient)",micro:.15},
  jovian:{main:"url(#goldGradient)",secondary:"#00d9ff",micro:1.35}
}[state.mode]}

function buildModel(a,level=1){
  const phase=(a.values[0]-1)*Math.PI*2/27,exit=(a.values.at(-1)-1)*Math.PI*2/27;
  const model={primary:[],secondary:[],orbits:[],nodes:[],core:44+level*3};
  const R=245, arch=a.arch;

  if(arch===0){
    model.primary.push(polygon(a.sides,R,phase*.1),polygon(a.sides,R*.72,-phase*.08),polygon(3,R*.82,-Math.PI/2),polygon(3,R*.82,Math.PI/2));
  }else if(arch===1){
    model.primary.push(polygon(6,R,phase*.08),polygon(6,R*.78,phase*.08+Math.PI/6));
    for(let i=0;i<a.axes;i++){const ang=i*Math.PI*2/a.axes;model.primary.push([[0,0],[Math.cos(ang)*R,Math.sin(ang)*R]])}
  }else if(arch===2){
    for(let k=0;k<3;k++)model.primary.push(polygon(a.sides,R-k*52,phase*.08+k*.18));
    model.primary.push(polygon(4,R*.75,Math.PI/4+exit*.05));
  }else if(arch===3){
    model.primary.push(polygon(a.sides,R,phase*.06));
    for(let i=0;i<a.axes;i++){const ang=i*Math.PI*2/a.axes;model.primary.push([[Math.cos(ang)*70,Math.sin(ang)*70],[Math.cos(ang)*R,Math.sin(ang)*R]])}
    model.secondary.push(circlePoints(R*.68,130,phase*.1,1,.56));
  }else if(arch===4){
    model.primary.push(polygon(4,R,Math.PI/4+phase*.04),polygon(3,R*.8,-Math.PI/2),polygon(3,R*.8,Math.PI/2));
    model.secondary.push(polygon(8,R*.64,exit*.05));
  }else if(arch===5){
    model.primary.push(spiralPoints(25,R,2.2+a.frequency*.12,phase,190),spiralPoints(25,R,2.2+a.frequency*.12,phase+Math.PI,190));
    model.secondary.push(polygon(a.sides,R*.7,exit*.06));
  }else if(arch===6){
    for(let k=0;k<a.rings+2;k++)model.orbits.push(circlePoints(80+k*38,120,phase*.03+k*.08,1,.72+(k%2)*.18));
    model.primary.push(polygon(a.sides,R,phase*.08),polygon(a.sides,R*.55,-phase*.08));
  }else if(arch===7){
    model.primary.push(polygon(3,R*.86,-Math.PI/2),polygon(3,R*.86,Math.PI/2),polygon(4,R*.72,Math.PI/4));
    model.secondary.push(circlePoints(R*.82,120,phase*.04,1,.72));
  }else if(arch===8){
    model.primary.push(polygon(8,R,phase*.06));
    for(let i=0;i<16;i++){const ang=i*Math.PI*2/16;model.primary.push([[Math.cos(ang)*80,Math.sin(ang)*80],[Math.cos(ang)*R,Math.sin(ang)*R]])}
  }else{
    model.primary.push(polygon(a.sides,R,phase*.05),polygon(a.sides,R*.72,phase*.05+Math.PI/a.sides),polygon(a.sides,R*.44,-phase*.05));
    for(let i=0;i<a.axes;i++){const ang=i*Math.PI*2/a.axes;model.secondary.push([[Math.cos(ang)*R*.44,Math.sin(ang)*R*.44],[Math.cos(ang)*R,Math.sin(ang)*R]])}
  }

  for(let r=0;r<a.rings;r++)model.orbits.push(circlePoints(90+r*48,130,phase*.04+r*.12,1,.82+(r%2)*.12));
  const nodeCount=Math.min(18,a.letters.length+a.unique.length);
  for(let i=0;i<nodeCount;i++){const v=a.values[i%a.values.length],ang=(v-1)*Math.PI*2/27+i*.21,rad=105+(i%4)*42;model.nodes.push([Math.cos(ang)*rad,Math.sin(ang)*rad,2.4+(v%4)])}
  return model
}

function drawSignature(svg,a,level=1){
  const ids=["gridLayer","orbitLayer","secondaryLayer","primaryGlow","primaryLayer","nodeLayer","coreLayer"];
  const local={};ids.forEach(id=>{local[id]=svg.querySelector(`#${id}`);if(local[id])clear(local[id])});
  if(!local.primaryLayer)return;
  const model=buildModel(a,level),cfg=modeConfig(),opacity=.15+state.complexity/180;

  for(let i=0;i<a.axes;i++){const ang=i*Math.PI*2/a.axes;addPath(local.gridLayer,[[Math.cos(ang)*55,Math.sin(ang)*55],[Math.cos(ang)*350,Math.sin(ang)*350]],{width:.45,opacity:.08})}
  for(let k=1;k<=4;k++)addCircle(local.gridLayer,0,0,70+k*55,{width:.45,opacity:.06});

  model.orbits.forEach(p=>addPath(local.orbitLayer,p,{width:.75,opacity:opacity*.62,stroke:cfg.secondary}));
  model.secondary.forEach(p=>addPath(local.secondaryLayer,p,{width:1.2,opacity:opacity*.8,stroke:cfg.secondary}));
  model.primary.forEach(p=>{
    addPath(local.primaryGlow,p,{width:7.5,opacity:.64,stroke:cfg.main});
    addPath(local.primaryLayer,p,{width:2.35,opacity:.96,stroke:cfg.main});
  });

  if(cfg.micro>.2){
    const count=Math.min(22,Math.floor(a.letters.length*(.7+state.complexity/70)));
    for(let i=0;i<count;i++){const v=a.values[i%a.values.length],ang=(v-1)*Math.PI*2/27+i*.31,rad1=55+(i%4)*34,rad2=rad1+42+(v%6)*9;
      addPath(local.secondaryLayer,[[Math.cos(ang)*rad1,Math.sin(ang)*rad1],[Math.cos(ang+.12)*rad2,Math.sin(ang+.12)*rad2]],{width:.65,opacity:.14*cfg.micro,stroke:VOWELS.has(a.letters[i%a.letters.length])?"#00d9ff":cfg.secondary});
    }
  }

  model.nodes.forEach(([x,y,r],i)=>addCircle(local.nodeLayer,x,y,r,{fill:i%4===0?"#dffcff":"#f6c65b",stroke:"none",opacity:.78}));
  addCircle(local.coreLayer,0,0,model.core+26,{fill:"url(#coreGradient)",stroke:"none",opacity:.95});
  addCircle(local.coreLayer,0,0,model.core*.48,{fill:"#031a2c",stroke:"#00d9ff",width:1.1,opacity:.95});
  addCircle(local.coreLayer,0,0,model.core*.18,{fill:"#ffffff",stroke:"none",opacity:.96});
}

function traitsFor(a){const out=[];for(let i=0;i<5;i++)out.push(TRAITS[(a.seed+i*7+a.values[i%a.values.length])%TRAITS.length]);return [...new Set(out)].slice(0,5)}
function readingFor(a){
  const traits=traitsFor(a),arch=ARCHS[a.arch];
  return[
    ["Centro con orbe azul",`Conciencia profunda y visión clara. Tu núcleo conserva la identidad de ${a.normalized}.`,"●"],
    [`Arquitectura ${arch}`,`Tu forma exterior expresa ${traits[0].toLowerCase()}, ${traits[1].toLowerCase()} y equilibrio.`,"⬡"],
    ["Triángulo ascendente",`Impulsa crecimiento, propósito y capacidad de dejar huella.`,"△"],
    ["Triángulo descendente",`Representa intuición, comprensión y aprendizaje interior.`,"▽"],
    [`${a.axes} líneas principales`,`Tus decisiones se organizan en múltiples direcciones coherentes.`,"✹"],
    [`${a.rings} órbitas activas`,`Experiencias, vínculos y ciclos integrados en una sola firma.`,"⊙"]
  ]
}
function update(save=true){
  const a=analyze(state.name),traits=traitsFor(a);
  document.getElementById("displayName").textContent=a.normalized;
  document.getElementById("signatureCode").textContent=`LG-${String(a.letters.length).padStart(2,"0")}-${String(a.sum).padStart(3,"0")}-${a.frequency}-${a.vowels}-${a.unique.length}`;
  document.getElementById("signatureSeed").textContent=`Semilla: ${a.seed.toString(16).toUpperCase().padStart(8,"0")}`;
  document.getElementById("signatureSubtitle").textContent=traits.join(" · ");
  document.getElementById("architectureName").textContent=ARCHS[a.arch];
  document.getElementById("architectureDescription").textContent=`Arquitectura ${ARCHS[a.arch]} construida con ${a.axes} ejes, ${a.rings} órbitas y ${a.sides} lados rectores.`;
  document.getElementById("strengthsText").textContent=`Fortalezas clave: ${traits.join(" · ")}`;
  document.getElementById("challengeText").textContent=`Desafío: ${messages[(a.seed+a.sum)%messages.length]}`;
  document.getElementById("componentReading").innerHTML=readingFor(a).map(([t,d,s])=>`<div class="component-item"><div class="component-symbol">${s}</div><div><strong>${t}</strong><small>${d}</small></div></div>`).join("");
  drawSignature(document.getElementById("signatureSvg"),a,1);
  buildPendant(a);buildOptical(a);
  if(save)saveHistory(a)
}
function cloneSignatureSvg(a,size=360){
  const source=document.getElementById("signatureSvg"),clone=source.cloneNode(true);
  clone.removeAttribute("id");clone.setAttribute("viewBox","-420 -420 840 840");clone.style.width="100%";clone.style.height="100%";
  return clone
}
function buildPendant(a){
  const target=document.getElementById("pendantSvg");clear(target);
  const clone=cloneSignatureSvg(a);while(clone.firstChild)target.appendChild(clone.firstChild)
}
function miniSvgFor(name){
  const a=analyze(name),svg=ns("svg",{viewBox:"-420 -420 840 840"});
  svg.innerHTML=document.getElementById("signatureSvg").innerHTML;
  drawSignature(svg,a,.65);
  return svg
}
function buildExamples(){
  const names=["AQORIS","LUMINA","VORIAN","ZYTHRA","KALDOR","NERIUS","AETHRA","SOLARIS","OMNIA","KAEL"];
  const start=state.exampleOffset%5,selected=names.slice(start,start+6);
  const grid=document.getElementById("examplesGrid");grid.innerHTML="";
  selected.forEach(name=>{const a=analyze(name),card=document.createElement("div");card.className="example-card";card.appendChild(miniSvgFor(name));card.insertAdjacentHTML("beforeend",`<strong>${name}</strong><small>${traitsFor(a).slice(0,3).join(" · ")}</small>`);grid.appendChild(card)})
}
function buildOptical(a){
  const container=document.getElementById("opticalSequence");container.innerHTML="";
  const labels=["Firma completa","Núcleo y órbitas","Ejes estructurales","Código nominal"];
  labels.forEach((label,i)=>{const step=document.createElement("div");step.className="optical-step";const svg=miniSvgFor(a.normalized);if(i===1){svg.querySelector("#primaryLayer")?.setAttribute("opacity",".12");svg.querySelector("#primaryGlow")?.setAttribute("opacity",".05")}if(i===2){svg.querySelector("#orbitLayer")?.setAttribute("opacity",".08");svg.querySelector("#coreLayer")?.setAttribute("opacity",".15")}if(i===3){svg.innerHTML=`<rect x="-300" y="-220" width="600" height="440" rx="25" fill="#08111e" stroke="#b47a32"/><text x="0" y="-30" text-anchor="middle" fill="#f6c65b" font-size="58" font-family="Georgia">${a.normalized}</text><text x="0" y="55" text-anchor="middle" fill="#7f8ba0" font-size="28" font-family="monospace">${a.sequence}</text>`}step.appendChild(svg);step.insertAdjacentHTML("beforeend",`<small>${label}</small>`);container.appendChild(step);if(i<labels.length-1){const arrow=document.createElement("div");arrow.className="optical-arrow";arrow.textContent="→";container.appendChild(arrow)}})
}
function saveHistory(a){
  const h=JSON.parse(localStorage.getItem("firmas-v15")||"[]"),code=`LG-${String(a.letters.length).padStart(2,"0")}-${String(a.sum).padStart(3,"0")}-${a.frequency}-${a.vowels}-${a.unique.length}`;
  localStorage.setItem("firmas-v15",JSON.stringify([{name:a.normalized,code},...h.filter(x=>x.name!==a.normalized)].slice(0,12)));renderHistory()
}
function renderHistory(){
  const h=JSON.parse(localStorage.getItem("firmas-v15")||"[]"),grid=document.getElementById("history");grid.innerHTML=h.map(x=>`<div class="history-item" data-name="${x.name}"><strong>${x.name}</strong><small>${x.code}</small></div>`).join("");
  grid.querySelectorAll(".history-item").forEach(el=>el.addEventListener("click",()=>{state.name=el.dataset.name;document.getElementById("nameInput").value=state.name;update(false)}))
}
function serializeSvg(){const svg=document.getElementById("signatureSvg").cloneNode(true);svg.setAttribute("xmlns","http://www.w3.org/2000/svg");return new XMLSerializer().serializeToString(svg)}
document.getElementById("generateBtn").addEventListener("click",()=>{state.name=document.getElementById("nameInput").value;update()});
document.getElementById("nameInput").addEventListener("keydown",e=>{if(e.key==="Enter"){state.name=e.target.value;update()}});
document.getElementById("modeGroup").addEventListener("click",e=>{const b=e.target.closest("button[data-mode]");if(!b)return;document.querySelectorAll("#modeGroup button").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.mode=b.dataset.mode;update(false)});
document.getElementById("complexityRange").addEventListener("input",e=>{state.complexity=Number(e.target.value);document.getElementById("complexityValue").textContent=`${state.complexity}%`;update(false)});
document.getElementById("refreshExamples").addEventListener("click",()=>{state.exampleOffset=(state.exampleOffset+1)%5;buildExamples()});
document.getElementById("clearHistory").addEventListener("click",()=>{localStorage.removeItem("firmas-v15");renderHistory()});
document.getElementById("copyCode").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(document.getElementById("signatureCode").textContent);document.getElementById("copyCode").textContent="Copiado";setTimeout(()=>document.getElementById("copyCode").textContent="Copiar código",1200)}catch{}});
document.getElementById("downloadSvg").addEventListener("click",()=>{const blob=new Blob([serializeSvg()],{type:"image/svg+xml"}),a=document.createElement("a");a.download=`${normalizeName(state.name)}-firma-geometrica.svg`;a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)});
document.getElementById("downloadPng").addEventListener("click",()=>{const img=new Image(),url=URL.createObjectURL(new Blob([serializeSvg()],{type:"image/svg+xml"}));img.onload=()=>{const c=document.createElement("canvas");c.width=4096;c.height=4096;const ctx=c.getContext("2d");ctx.fillStyle="#030712";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);const a=document.createElement("a");a.download=`${normalizeName(state.name)}-firma-4K.png`;a.href=c.toDataURL("image/png");a.click()};img.src=url});
document.getElementById("downloadJson").addEventListener("click",()=>{const aData=analyze(state.name),blob=new Blob([JSON.stringify({...aData,architecture:ARCHS[aData.arch],mode:state.mode,complexity:state.complexity},null,2)],{type:"application/json"}),a=document.createElement("a");a.download=`${aData.normalized}-firma.json`;a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)});
let deferredPrompt=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").classList.remove("hidden")});
document.getElementById("installBtn").addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById("installBtn").classList.add("hidden")});
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
state.name=document.getElementById("nameInput").value;update(false);buildExamples();renderHistory();
