const ALPHABET="ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
const VOWELS=new Set(["A","E","I","O","U"]);
const state={name:"SALVADOR",mode:"ceremonial",intensity:92};

const messages=[
"Tu esencia organiza el caos interno y transforma cada experiencia en una estructura más clara.",
"La runa concentra tu recorrido en una sola forma: origen, tránsito y cierre permanecen unidos.",
"Tu identidad encuentra fuerza cuando integra lo orgánico con lo estructural.",
"El centro permanece estable mientras la forma exterior aprende a cambiar.",
"Tu nombre construye una dirección propia; no necesita imitar símbolos ajenos.",
"La repetición no es estancamiento: es una frecuencia que pide ser comprendida."
];
const mantras=[
"CREO ORDEN, HABITO EQUILIBRIO Y CONSTRUYO MI REALIDAD CONSCIENTE.",
"MI CENTRO CONSERVA LA DIRECCIÓN DE MI CAMINO.",
"LO QUE SE REPITE EN MÍ SE TRANSFORMA EN CONOCIMIENTO.",
"MI FORMA CAMBIA SIN PERDER SU ORIGEN.",
"LA CLARIDAD INTERIOR ORGANIZA MI EXPANSIÓN."
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
  const seed=hash(`${normalized}|${sequence}|${rhythm}|RUNA-V12`);
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
function buildRune(a){
  const bg=document.getElementById("backgroundGeometry"),micro=document.getElementById("microLayer"),secondary=document.getElementById("secondaryLayer"),
    glow=document.getElementById("primaryGlow"),primary=document.getElementById("primaryLayer"),core=document.getElementById("coreLayer");
  [bg,micro,secondary,glow,primary,core].forEach(clear);

  const structural=a.consonants>=a.vowels,repeated=a.repetitions.length,phase=(a.values[0]-1)*Math.PI*2/27,exit=(a.values.at(-1)-1)*Math.PI*2/27;
  const loops=1+(a.vowels%3),crossbars=1+(a.root%3),half=110+a.vowelRatio*55;
  const mode={ceremonial:{primary:1,secondary:1,micro:1,color:"url(#goldGradient)"},technical:{primary:.86,secondary:.75,micro:1.2,color:"#d8e7ef"},minimal:{primary:1,secondary:.18,micro:0,color:"url(#goldGradient)"},jovian:{primary:1.1,secondary:1.2,micro:1.3,color:"url(#goldGradient)"}}[state.mode];

  for(let r=1;r<=5;r++) addCircle(bg,0,0,70+r*55,{width:.7,opacity:.18});
  for(let i=0;i<a.axes;i++){const ang=i*Math.PI*2/a.axes;addPath(bg,[[Math.cos(ang)*70,Math.sin(ang)*70],[Math.cos(ang)*345,Math.sin(ang)*345]],{width:.55,opacity:.14})}

  const spine=[];for(let i=0;i<=120;i++){const t=i/120,y=-380+t*760,x=Math.sin(t*Math.PI*(2+a.root%3)+phase)*(7+a.entropy*13)+Math.sin(t*Math.PI*2+exit)*5;spine.push([x,y])}
  const primaryPaths=[spine];

  for(let i=0;i<loops;i++){
    const sc=1-i*.14,rx=half*sc,ry=115*sc;
    primaryPaths.push(arc(0,-170-i*12,rx,ry,-Math.PI/2,Math.PI*1.5,phase*.08,100));
    primaryPaths.push(arc(0,170+i*12,rx,ry,Math.PI/2,Math.PI*2.5,-exit*.08,100));
  }
  for(let i=0;i<crossbars;i++){const y=(i-(crossbars-1)/2)*62,w=125+(a.values[i%a.values.length]||1)*2.1,tilt=structural?0:(i%2?12:-12);primaryPaths.push([[-w,y-tilt],[w,y+tilt]])}

  primaryPaths.forEach(pts=>{
    addPath(glow,pts,{width:(7*mode.primary)*(state.intensity/92),opacity:.75,stroke:mode.color});
    addPath(primary,pts,{width:(3.2*mode.primary)*(state.intensity/92),opacity:.98,stroke:mode.color});
  });

  const top=(a.values[0]||1)%6,bottom=(a.values.at(-1)||1)%6;
  if(top===1)addCircle(secondary,0,-360,45,{width:2,opacity:.5*mode.secondary});
  else addPath(secondary,[[0,-415],[45+top*4,-360],[0,-305],[-45-top*4,-360],[0,-415]],{width:2,opacity:.5*mode.secondary});
  if(bottom===1)addCircle(secondary,0,360,40,{width:2,opacity:.46*mode.secondary});
  else addPath(secondary,[[0,415],[40+bottom*3,360],[0,305],[-40-bottom*3,360],[0,415]],{width:2,opacity:.46*mode.secondary});

  for(let i=0;i<repeated;i++){const o=18+i*14;addPath(secondary,[[-o,-260],[-o*1.5,0],[-o,260]],{width:1.1,opacity:.22*mode.secondary});addPath(secondary,[[o,-260],[o*1.5,0],[o,260]],{width:1.1,opacity:.22*mode.secondary})}

  if(mode.micro>0){const slots=Math.min(12,a.letters.length);for(let i=0;i<slots;i++){const v=a.values[i],y=-280+i*(560/Math.max(1,slots-1)),side=i%2===0?-1:1,reach=35+(v%7)*8,ang=(v-1)*Math.PI*2/27,x1=side*reach,y1=y+Math.sin(ang)*22;
      addPath(micro,[[side*4,y],[x1,y1]],{width:.8*mode.micro,opacity:.22*mode.micro,stroke:VOWELS.has(a.letters[i])?"#00e5ff":"url(#goldGradient)"});
      if(VOWELS.has(a.letters[i]))addPath(micro,arc(x1,y1,18,12,0,Math.PI*1.6,ang*.2,24),{width:.7*mode.micro,opacity:.18*mode.micro,stroke:"#00e5ff"});
      else addPath(micro,[[x1,y1],[x1-side*13,y1+18]],{width:.7*mode.micro,opacity:.18*mode.micro});
  }}

  addCircle(core,0,0,50,{fill:"url(#coreGradient)",stroke:"none",opacity:.95});
  addCircle(core,0,0,8,{fill:"#ffffff",stroke:"none",opacity:1});
  addCircle(core,0,0,20,{stroke:"#d9fbff",width:1.2,opacity:.65});
}
function update(save=true){
  const a=analyze(state.name);
  document.getElementById("displayName").textContent=a.normalized;
  document.getElementById("signatureCode").textContent=a.code;
  document.getElementById("signatureSeed").textContent=`Semilla: ${a.seed.toString(16).toUpperCase().padStart(8,"0")}`;
  document.getElementById("runeId").textContent=`${a.initial}${a.final}-${a.root}${a.axes}`;
  document.getElementById("sequenceText").textContent=a.sequence;
  document.getElementById("rhythmText").textContent=`Ritmo: ${a.rhythm}`;
  const essence=[a.consonants>=a.vowels?"Estructura":"Flujo",a.axes>=7?"Expansión":"Concentración",a.repetitions.length?"Resonancia":"Continuidad",a.root>=6?"Manifestación":"Interiorización"];
  document.getElementById("essenceText").textContent=essence.join(" · ");
  document.getElementById("meaningText").textContent=`La runa de ${a.normalized} concentra ${a.letters.length} letras en un único glifo vertical. ${a.initial} abre el trazo, ${a.final} determina el cierre y la frecuencia ${a.root} organiza sus cruces y bucles.`;
  document.getElementById("messageText").textContent=messages[(a.seed+a.sum)%messages.length];
  document.getElementById("mantraText").textContent=`“${mantras[(a.seed+a.letters.length)%mantras.length]}”`;
  document.getElementById("metrics").innerHTML=[["Letras",a.letters.length],["Suma",a.sum],["Frecuencia",a.root],["Vocales",a.vowels],["Consonantes",a.consonants],["Únicas",a.unique.length],["Ejes",a.axes],["Repeticiones",a.repetitions.length]].map(([k,v])=>`<div class="metric"><small>${k}</small><strong>${v}</strong></div>`).join("");
  buildRune(a);
  if(save)saveHistory(a);
}
function saveHistory(a){
  const h=JSON.parse(localStorage.getItem("runas-v12")||"[]");
  const next=[{name:a.normalized,code:a.code},...h.filter(x=>x.name!==a.normalized)].slice(0,10);
  localStorage.setItem("runas-v12",JSON.stringify(next));renderHistory();
}
function renderHistory(){
  const h=JSON.parse(localStorage.getItem("runas-v12")||"[]");
  document.getElementById("history").innerHTML=h.map(x=>`<div class="history-item" data-name="${x.name}"><strong>${x.name}</strong><small>${x.code}</small></div>`).join("");
  document.querySelectorAll(".history-item").forEach(el=>el.addEventListener("click",()=>{state.name=el.dataset.name;document.getElementById("nameInput").value=state.name;update(false)}));
}
document.getElementById("generateBtn").addEventListener("click",()=>{state.name=document.getElementById("nameInput").value;update()});
document.getElementById("nameInput").addEventListener("keydown",e=>{if(e.key==="Enter"){state.name=e.target.value;update()}});
document.getElementById("modeGroup").addEventListener("click",e=>{const b=e.target.closest("button[data-mode]");if(!b)return;document.querySelectorAll("#modeGroup button").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.mode=b.dataset.mode;update(false)});
document.getElementById("intensityRange").addEventListener("input",e=>{state.intensity=Number(e.target.value);document.getElementById("intensityValue").textContent=`${state.intensity}%`;update(false)});
document.getElementById("clearHistory").addEventListener("click",()=>{localStorage.removeItem("runas-v12");renderHistory()});
document.getElementById("copyCode").addEventListener("click",async()=>{const code=document.getElementById("signatureCode").textContent;try{await navigator.clipboard.writeText(code);document.getElementById("copyCode").textContent="Copiado";setTimeout(()=>document.getElementById("copyCode").textContent="Copiar código",1200)}catch{}});
document.getElementById("downloadSvg").addEventListener("click",()=>{const svg=document.getElementById("runeSvg").cloneNode(true),data=new XMLSerializer().serializeToString(svg),blob=new Blob([data],{type:"image/svg+xml"}),a=document.createElement("a");a.download=`${normalizeName(state.name)}-runa.svg`;a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)});
document.getElementById("downloadPng").addEventListener("click",()=>{const svg=document.getElementById("runeSvg"),data=new XMLSerializer().serializeToString(svg),img=new Image(),blob=new Blob([data],{type:"image/svg+xml"}),url=URL.createObjectURL(blob);img.onload=()=>{const c=document.createElement("canvas");c.width=2048;c.height=2662;const ctx=c.getContext("2d");ctx.fillStyle="#030712";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);const a=document.createElement("a");a.download=`${normalizeName(state.name)}-runa-2K.png`;a.href=c.toDataURL("image/png");a.click()};img.src=url});
state.name=document.getElementById("nameInput").value;update(false);renderHistory();
