const ALPHABET="ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
const VOWELS=new Set(["A","E","I","O","U"]);
const state={name:"SALVADOR",mode:"ceremonial",symmetry:"bilateral",intensity:94,density:58};

const messages=[
"Tu esencia organiza el caos interno y transforma cada experiencia en una estructura más clara.",
"La runa concentra tu recorrido en una sola forma: origen, tránsito y cierre permanecen unidos.",
"Tu identidad encuentra fuerza cuando integra lo orgánico con lo estructural.",
"El centro permanece estable mientras la forma exterior aprende a cambiar.",
"Tu nombre construye una dirección propia; no necesita imitar símbolos ajenos.",
"La repetición no es estancamiento: es una frecuencia que pide ser comprendida.",
"Tu patrón revela una presencia que crece sin perder su origen.",
"Cada cambio de dirección conserva la memoria del trazo anterior."
];
const mantras=[
"CREO ORDEN, HABITO EQUILIBRIO Y CONSTRUYO MI REALIDAD CONSCIENTE.",
"MI CENTRO CONSERVA LA DIRECCIÓN DE MI CAMINO.",
"LO QUE SE REPITE EN MÍ SE TRANSFORMA EN CONOCIMIENTO.",
"MI FORMA CAMBIA SIN PERDER SU ORIGEN.",
"LA CLARIDAD INTERIOR ORGANIZA MI EXPANSIÓN.",
"MI NOMBRE ENCUENTRA SU FORMA Y MI FORMA ENCUENTRA SU LUZ."
];

function normalizeName(value){
  return (value||"AEON").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase()
    .replace(/Ü/g,"U").replace(/[^A-ZÑ\s'-]/g,"").replace(/\s+/g," ").trim()||"AEON";
}
function letterValue(ch){const i=ALPHABET.indexOf(ch);return i>=0?i+1:0}
function hash(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function digitalRoot(n){while(n>9)n=String(n).split("").reduce((a,b)=>a+Number(b),0);return n}
function analyze(raw){
  const normalized=normalizeName(raw),letters=[...normalized].filter(c=>ALPHABET.includes(c)),values=letters.map(letterValue);
  const sum=values.reduce((a,b)=>a+b,0),root=digitalRoot(sum),vowels=letters.filter(c=>VOWELS.has(c)).length,consonants=letters.length-vowels;
  const counts={};letters.forEach(c=>counts[c]=(counts[c]||0)+1);
  const unique=[...new Set(letters)],repetitions=Object.entries(counts).filter(([,n])=>n>1);
  const sequence=values.map(v=>String(v).padStart(2,"0")).join("."),rhythm=letters.map(c=>VOWELS.has(c)?"V":"C").join("");
  const code=`LG-${String(letters.length).padStart(2,"0")}-${String(sum).padStart(3,"0")}-${root}-${vowels}-${unique.length}`;
  const seed=hash(`${normalized}|${sequence}|${rhythm}|RUNA-V13`);
  return{normalized,letters,values,sum,root,vowels,consonants,counts,unique,repetitions,sequence,rhythm,code,seed,
    axes:4+(unique.length%5),rings:1+(root%4),outerSides:3+(sum%7),vowelRatio:letters.length?vowels/letters.length:0,
    entropy:letters.length?unique.length/letters.length:0,initial:letters[0]||"A",final:letters.at(-1)||"A"}
}
function ns(tag,attrs={}){const el=document.createElementNS("http://www.w3.org/2000/svg",tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el}
function clear(el){while(el.firstChild)el.removeChild(el.firstChild)}
function pathD(points){return points.map((p,i)=>`${i?"L":"M"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ")}
function arc(cx,cy,rx,ry,start,end,rot=0,n=80){
  const pts=[],c=Math.cos(rot),s=Math.sin(rot);
  for(let i=0;i<=n;i++){const t=start+(end-start)*i/n,x=Math.cos(t)*rx,y=Math.sin(t)*ry;pts.push([cx+x*c-y*s,cy+x*s+y*c])}
  return pts
}
function addPath(group,pts,opts={}){
  const p=ns("path",{d:pathD(pts),fill:"none",stroke:opts.stroke||"url(#goldGradient)","stroke-width":opts.width||2,
    "stroke-linecap":"round","stroke-linejoin":"round",opacity:opts.opacity??1});
  group.appendChild(p);return p
}
function addCircle(group,cx,cy,r,opts={}){
  const c=ns("circle",{cx,cy,r,fill:opts.fill||"none",stroke:opts.stroke||"url(#goldGradient)","stroke-width":opts.width||2,opacity:opts.opacity??1});
  group.appendChild(c);return c
}
function rotatedPoint(x,y,a){const c=Math.cos(a),s=Math.sin(a);return[x*c-y*s,x*s+y*c]}
function buildRune(a){
  const bg=document.getElementById("backgroundGeometry"),echo=document.getElementById("echoLayer"),micro=document.getElementById("microLayer"),secondary=document.getElementById("secondaryLayer"),
    glow=document.getElementById("primaryGlow"),primary=document.getElementById("primaryLayer"),nodes=document.getElementById("nodeLayer"),core=document.getElementById("coreLayer");
  [bg,echo,micro,secondary,glow,primary,nodes,core].forEach(clear);

  const structural=a.consonants>=a.vowels,repeated=a.repetitions.length,phase=(a.values[0]-1)*Math.PI*2/27,exit=(a.values.at(-1)-1)*Math.PI*2/27;
  const loops=1+(a.vowels%3),crossbars=1+(a.root%3),half=105+a.vowelRatio*58;
  const mode={ceremonial:{primary:1,secondary:1,micro:1,color:"url(#goldGradient)"},technical:{primary:.86,secondary:.72,micro:1.25,color:"#d8e7ef"},minimal:{primary:1,secondary:.14,micro:0,color:"url(#goldGradient)"},jovian:{primary:1.1,secondary:1.22,micro:1.35,color:"url(#goldGradient)"}}[state.mode];

  for(let r=1;r<=4+a.rings;r++) addCircle(bg,0,0,55+r*42,{width:.6,opacity:.09+state.density/1400});
  for(let i=0;i<a.axes;i++){
    const ang=i*Math.PI*2/a.axes;
    addPath(bg,[[Math.cos(ang)*65,Math.sin(ang)*65],[Math.cos(ang)*360,Math.sin(ang)*360]],{width:.5,opacity:.1+state.density/1700});
  }

  const spine=[];for(let i=0;i<=140;i++){const t=i/140,y=-390+t*780,x=Math.sin(t*Math.PI*(2+a.root%3)+phase)*(6+a.entropy*15)+Math.sin(t*Math.PI*2+exit)*5;spine.push([x,y])}
  const primaryPaths=[spine];

  for(let i=0;i<loops;i++){
    const sc=1-i*.14,rx=half*sc,ry=118*sc;
    primaryPaths.push(arc(0,-175-i*13,rx,ry,-Math.PI/2,Math.PI*1.5,phase*.08,120));
    primaryPaths.push(arc(0,175+i*13,rx,ry,Math.PI/2,Math.PI*2.5,-exit*.08,120));
  }
  for(let i=0;i<crossbars;i++){
    const y=(i-(crossbars-1)/2)*62,w=118+(a.values[i%a.values.length]||1)*2.35,tilt=structural?0:(i%2?12:-12);
    primaryPaths.push([[-w,y-tilt],[w,y+tilt]]);
  }

  if(state.symmetry==="radial"){
    const source=[...primaryPaths];
    for(let k=1;k<4;k++){const ang=k*Math.PI/2;source.forEach(pts=>primaryPaths.push(pts.map(([x,y])=>rotatedPoint(x,y,ang))))}
  }else if(state.symmetry==="hybrid"){
    const source=[...primaryPaths];const ang=Math.PI/2;
    source.slice(0,Math.min(4,source.length)).forEach(pts=>primaryPaths.push(pts.map(([x,y])=>rotatedPoint(x,y,ang))));
  }

  primaryPaths.forEach(pts=>{
    addPath(glow,pts,{width:(8*mode.primary)*(state.intensity/94),opacity:.74,stroke:mode.color});
    addPath(primary,pts,{width:(3.15*mode.primary)*(state.intensity/94),opacity:.98,stroke:mode.color});
  });

  const top=(a.values[0]||1)%6,bottom=(a.values.at(-1)||1)%6;
  if(top===1)addCircle(secondary,0,-365,44,{width:2,opacity:.52*mode.secondary});
  else addPath(secondary,[[0,-420],[44+top*4,-365],[0,-310],[-44-top*4,-365],[0,-420]],{width:2,opacity:.52*mode.secondary});
  if(bottom===1)addCircle(secondary,0,365,40,{width:2,opacity:.48*mode.secondary});
  else addPath(secondary,[[0,420],[40+bottom*3,365],[0,310],[-40-bottom*3,365],[0,420]],{width:2,opacity:.48*mode.secondary});

  for(let i=0;i<repeated;i++){
    const o=18+i*14;
    addPath(echo,[[-o,-270],[-o*1.5,0],[-o,270]],{width:1.05,opacity:.18*mode.secondary});
    addPath(echo,[[o,-270],[o*1.5,0],[o,270]],{width:1.05,opacity:.18*mode.secondary});
  }

  if(mode.micro>0){
    const slots=Math.min(14,a.letters.length);
    for(let i=0;i<slots;i++){
      const v=a.values[i],y=-295+i*(590/Math.max(1,slots-1)),side=i%2===0?-1:1,reach=34+(v%7)*8,ang=(v-1)*Math.PI*2/27,x1=side*reach,y1=y+Math.sin(ang)*22;
      addPath(micro,[[side*4,y],[x1,y1]],{width:.75*mode.micro,opacity:(.12+state.density/600)*mode.micro,stroke:VOWELS.has(a.letters[i])?"url(#cyanGradient)":"url(#goldGradient)"});
      if(VOWELS.has(a.letters[i]))addPath(micro,arc(x1,y1,18,12,0,Math.PI*1.6,ang*.2,28),{width:.65*mode.micro,opacity:(.1+state.density/700)*mode.micro,stroke:"url(#cyanGradient)"});
      else addPath(micro,[[x1,y1],[x1-side*13,y1+18]],{width:.65*mode.micro,opacity:(.1+state.density/700)*mode.micro});
    }
  }

  const nodeCount=Math.min(9,a.unique.length+a.repetitions.length);
  for(let i=0;i<nodeCount;i++){
    const ang=phase+i*Math.PI*2/nodeCount,rad=130+(i%3)*48;
    const x=Math.cos(ang)*rad,y=Math.sin(ang)*rad;
    addCircle(nodes,x,y,2.6,{fill:i%3===0?"#dffcff":"#ffe8a1",stroke:"none",opacity:.75});
  }

  addCircle(core,0,0,56,{fill:"url(#coreGradient)",stroke:"none",opacity:.96});
  addCircle(core,0,0,8,{fill:"#ffffff",stroke:"none",opacity:1});
  addCircle(core,0,0,21,{stroke:"#d9fbff",width:1.2,opacity:.62});
}
function update(save=true){
  const a=analyze(state.name);
  document.getElementById("displayName").textContent=a.normalized;
  document.getElementById("signatureCode").textContent=a.code;
  document.getElementById("signatureSeed").textContent=`Semilla: ${a.seed.toString(16).toUpperCase().padStart(8,"0")}`;
  document.getElementById("signatureMode").textContent=`${capitalize(state.mode)} · ${capitalize(state.symmetry)}`;
  document.getElementById("runeId").textContent=`${a.initial}${a.final}-${a.root}${a.axes}`;
  document.getElementById("sequenceText").textContent=a.sequence;
  document.getElementById("rhythmText").textContent=`Ritmo: ${a.rhythm}`;
  const essence=[a.consonants>=a.vowels?"Estructura":"Flujo",a.axes>=7?"Expansión":"Concentración",a.repetitions.length?"Resonancia":"Continuidad",a.root>=6?"Manifestación":"Interiorización"];
  document.getElementById("essenceText").textContent=essence.join(" · ");
  document.getElementById("meaningText").textContent=`La runa de ${a.normalized} concentra ${a.letters.length} letras en un único glifo. ${a.initial} abre el trazo, ${a.final} determina el cierre y la frecuencia ${a.root} organiza sus cruces, bucles y ritmo interno.`;
  document.getElementById("messageText").textContent=messages[(a.seed+a.sum)%messages.length];
  document.getElementById("mantraText").textContent=`“${mantras[(a.seed+a.letters.length)%mantras.length]}”`;
  document.getElementById("metrics").innerHTML=[["Letras",a.letters.length],["Suma",a.sum],["Frecuencia",a.root],["Vocales",a.vowels],["Consonantes",a.consonants],["Únicas",a.unique.length],["Ejes",a.axes],["Repeticiones",a.repetitions.length]].map(([k,v])=>`<div class="metric"><small>${k}</small><strong>${v}</strong></div>`).join("");
  buildRune(a);
  if(save)saveHistory(a);
}
function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function saveHistory(a){
  const h=JSON.parse(localStorage.getItem("runas-v13")||"[]");
  const next=[{name:a.normalized,code:a.code},...h.filter(x=>x.name!==a.normalized)].slice(0,10);
  localStorage.setItem("runas-v13",JSON.stringify(next));renderHistory();
}
function renderHistory(){
  const h=JSON.parse(localStorage.getItem("runas-v13")||"[]");
  document.getElementById("history").innerHTML=h.map(x=>`<div class="history-item" data-name="${x.name}"><strong>${x.name}</strong><small>${x.code}</small></div>`).join("");
  document.querySelectorAll(".history-item").forEach(el=>el.addEventListener("click",()=>{state.name=el.dataset.name;document.getElementById("nameInput").value=state.name;update(false)}));
}
function serializeSvg(){
  const svg=document.getElementById("runeSvg").cloneNode(true);
  svg.setAttribute("xmlns","http://www.w3.org/2000/svg");
  return new XMLSerializer().serializeToString(svg);
}
document.getElementById("generateBtn").addEventListener("click",()=>{state.name=document.getElementById("nameInput").value;update()});
document.getElementById("nameInput").addEventListener("keydown",e=>{if(e.key==="Enter"){state.name=e.target.value;update()}});
document.getElementById("modeGroup").addEventListener("click",e=>{const b=e.target.closest("button[data-mode]");if(!b)return;document.querySelectorAll("#modeGroup button").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.mode=b.dataset.mode;update(false)});
document.getElementById("symmetryGroup").addEventListener("click",e=>{const b=e.target.closest("button[data-symmetry]");if(!b)return;document.querySelectorAll("#symmetryGroup button").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.symmetry=b.dataset.symmetry;update(false)});
document.getElementById("intensityRange").addEventListener("input",e=>{state.intensity=Number(e.target.value);document.getElementById("intensityValue").textContent=`${state.intensity}%`;update(false)});
document.getElementById("densityRange").addEventListener("input",e=>{state.density=Number(e.target.value);document.getElementById("densityValue").textContent=`${state.density}%`;update(false)});
document.getElementById("clearHistory").addEventListener("click",()=>{localStorage.removeItem("runas-v13");renderHistory()});
document.getElementById("copyCode").addEventListener("click",async()=>{const code=document.getElementById("signatureCode").textContent;try{await navigator.clipboard.writeText(code);document.getElementById("copyCode").textContent="Copiado";setTimeout(()=>document.getElementById("copyCode").textContent="Copiar código",1200)}catch{}});
document.getElementById("downloadSvg").addEventListener("click",()=>{const blob=new Blob([serializeSvg()],{type:"image/svg+xml"}),a=document.createElement("a");a.download=`${normalizeName(state.name)}-runa-v13.svg`;a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)});
document.getElementById("downloadPng").addEventListener("click",()=>{const img=new Image(),blob=new Blob([serializeSvg()],{type:"image/svg+xml"}),url=URL.createObjectURL(blob);img.onload=()=>{const c=document.createElement("canvas");c.width=4096;c.height=5266;const ctx=c.getContext("2d");ctx.fillStyle="#030712";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);const a=document.createElement("a");a.download=`${normalizeName(state.name)}-runa-4K.png`;a.href=c.toDataURL("image/png");a.click()};img.src=url});
document.getElementById("downloadJson").addEventListener("click",()=>{const aData=analyze(state.name),blob=new Blob([JSON.stringify({...aData,mode:state.mode,symmetry:state.symmetry,intensity:state.intensity,density:state.density},null,2)],{type:"application/json"}),a=document.createElement("a");a.download=`${aData.normalized}-runa.json`;a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)});
let deferredPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").classList.remove("hidden")});
document.getElementById("installBtn").addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById("installBtn").classList.add("hidden")});
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
state.name=document.getElementById("nameInput").value;update(false);renderHistory();
