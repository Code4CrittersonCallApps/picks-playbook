const {picks,meta}=PB;const $=s=>document.querySelector(s);
const f=v=>v==null?'—':v>=1000?v.toLocaleString('en-US',{maximumFractionDigits:0}):v>=10?v.toFixed(2):v>=1?v.toFixed(3):v.toFixed(4);
const pct=(a,b)=>((a/b-1)*100).toFixed(1)+'%';
const where=p=>[p.uphold?'Uphold':null,p.schwab?'Schwab '+p.schwab:null].filter(Boolean).join(' · ');
function status(p){if(p.etype==='trigger')return p.triggered?(p.Rlive<1.5?'Already through trigger — R now '+p.Rlive+', don\'t chase; wait for retest':'Triggered'):'Waiting — needs daily close above '+f(p.entry)+' ('+pct(p.entry,p.px)+' away)';
 return p.triggered?'At the boarding level (EMA21) — live':'Extended '+pct(p.px,p.entry)+' above boarding level — wait for pullback to EMA21'}
function home(){document.title='Picks Playbook';
 let h=`<header><h1>Picks Playbook</h1><p class=sub>9 picks ranked · prices as of ${picks[0].asof} · BTC $${f(meta.btc)}</p></header>
 <div class=card warn><b>Tonight's risk:</b> CPI Wed Oct 14, 8:30 AM ET. BTC ${f(meta.btc)} sits between $80k support and the $87.4k reclaim. Under $80k → no new alt longs. Over $87.4k → alts get the green light.</div>${ochome()}<a class=topbtn href="#check">🚂 Pre-Trade Checklist · Is it a train? / Board it</a><div class=dbtn><a href="#draft">🏈 Draft Board / Watch List</a><a href="#catalysts">📅 Catalysts</a></div><div class=dbtn style="margin-top:8px"><a href="#scan">🔎 Uphold full scan (all assets)</a><a href="#gold">🥇 Gold &amp; Hedges</a></div><ol class=rank>`;
 picks.forEach((p,i)=>{h+=`<li><a href="#${p.sym}"><span class=n>${i+1}</span><div><b>${p.sym}</b> <span class="tag ${p.ctier}">${p.kind==='train'?'Train':p.ctier+' chart'}</span>${p.ftier?`<span class="tag box">${p.score}/5 boxes</span>`:''}<br><small>${where(p)} · R ${p.R0} · ${status(p)}</small></div></a></li>`});
 h+=`</ol><div class=card><b>QQQ (also a train):</b> $${f(meta.qqq.px)}, board ${f(meta.qqq.board)}, stop ${f(meta.qqq.stop)}, target ${f(meta.qqq.tgt)}, R ${meta.qqq.R}. Fine as the "boring" Schwab train; less room to run than the rest.</div>
 <div class=card><b>How the rank works:</b> chart tier (S=3, A/Train=2) + box score (out of 2) + reward/risk (max 2) + 1 if on both Ez Buys and Trains + 0.5 if all 4 train checks pass today. Analog matches are historical look-alikes, not predictions.</div><p class=foot>Built ${meta.built}. Not financial advice.</p>`;
 $('#app').innerHTML=h;scrollTo(0,0)}
function lesson(p){document.title=p.sym+' · Picks Playbook';const i=picks.indexOf(p);
 const prev=picks[i-1],next=picks[i+1];
 const crit=Object.entries(p.crit).map(([k,v])=>`<li class=${v?'ok':'no'}>${v?'✓':'✗'} ${k}</li>`).join('');
 const nOk=Object.values(p.crit).filter(Boolean).length;
 const fibpos=p.px>=p.fib['0.382']?'above the .382 — shallow pullback, strong':p.px>=p.fib['0.618']?'between .382 and the golden pocket':p.px>=p.fib['0.786']?'in the deep zone (.618–.786)':'below .786 — the swing is broken';
 const krown=p.wrsi>70?`Weekly RSI ${p.wrsi} — hot. Momentum is real but late; he'd wait for a weekly pullback/higher low rather than chase.`:p.wrsi>50?`Weekly RSI ${p.wrsi} — above 50 and constructive. Odds favor up while it holds above 50.`:`Weekly RSI ${p.wrsi} — under 50, momentum not confirmed yet. He'd want the weekly to turn first.`;
 const bcb=`Swing ${f(p.fibL)} → ${f(p.fibH)}. Price ${f(p.px)} is ${fibpos}. His buy zones are .702 (${f(p.fib702)}) and .786 (${f(p.fib786)}) — macro (BTC, S&P, CPI) first, then these levels.`;
 const fous=nOk===4?`All 4 train checks pass — the train is moving. Get on at the EMA21 (${f(p.e21.at(-1))}), not on a green candle.`:`Only ${nOk}/4 train checks — not a moving train yet. He'd pass until it is.`;
 let an='';if(p.an){const a=p.an;an=`<h3>Look-alike: ${a.sym} ${a.start} → ${a.end} (${a.sim}% match)</h3><div class=chartbox><canvas id=anc></canvas></div><p class=small>Gold = ${p.sym} last 100 days. Grey = ${a.sym} then, scaled to today's price; the part right of the line is what happened next: +30d ${a.f30}%, +60d ${a.f60}%, best ${a.mx}%, worst ${a.mn}%. Other matches: ${a.others.map(o=>`${o[0]} ${o[1]} (${o[2]}%, 60d ${o[3]}%)`).join('; ')}. <b>Historical, not a prediction.</b></p>`}
 const boxes=p.boxes?`<div class=boxes>${p.boxes.map(([k,v])=>`<div class="bx ${v==='✓'?'ok':v==='½'?'half':'no'}"><b>${v==='·'?'✗':v}</b>${k}</div>`).join('')}</div><p class=small><b>${p.score}/5 → ${p.ftier}-tier.</b> ${p.ev}</p><p class=small>Sources: ${p.src}</p>`:`<p class=small>Your 5 boxes are a coin scorecard; ${p.sym} ${p.kind==='coin'||p.sym==='FIL'?'was not in the scored top-20 list (unscored, not a pass).':'is a stock, so it isn\'t scored. Treat it as a leveraged BTC/AI proxy.'}</p>`;
 const r=p.entry-p.stop;
 let h=`<nav><a href="#">← All picks</a><span>${i+1}/${picks.length}</span></nav>
 <section class="card verdict"><h1>${p.sym} <span class=px>$${f(p.px)}</span></h1><p><b class=long>LONG</b> · <span class="tag ${p.ctier}">${p.kind==='train'?'Train Jumper':p.ctier+'-tier Ez Buy'}</span>${p.ftier?` <span class="tag box">${p.score}/5 boxes</span>`:''} · ${where(p)}</p><p class=st>${status(p)}</p></section>
 <section><h2>1 · The chart (daily)</h2><div class=tog id=tog></div><div class=chartbox><canvas id=c></canvas></div><p class=small>Drag on the chart to read candles. Structure labels (HH/HL/LH/LL) are the textbook read from 5-bar pivots; no clean Wyckoff/Elliott count is claimed. Data through ${p.asof}.</p></section>
 <section><h2>2 · The setup, as a lesson</h2><p>${p.kind==='train'?`<b>Pattern: a train already moving.</b> Price is making new highs with the 21 EMA above the 55 and rising. The trick is to board on the pullback to the 21 EMA, not at the top of a candle.`:`<b>Pattern: a breakout trigger.</b> Its last 100 days look ${p.sim}% like past setups that broke up. The trigger is a daily close above ${f(p.entry)}; until then it's just a pattern.`}</p>
 <ul class=crit>${crit}</ul>${an}${p.alsoTrain?`<p class=small>Also on Trains leaving now: board ${f(p.alsoTrain.board)}, stop ${f(p.alsoTrain.stop)}, target ${f(p.alsoTrain.tgt)} (R ${p.alsoTrain.R}).</p>`:''}
 <div class=reads><div><b>Krown-style</b>${krown}</div><div><b>BCB-style</b>${bcb}</div><div><b>Fous-style</b>${fous}</div></div><p class=small>These are rule-based reads in each style, not quotes.</p></section>
 ${ocsec(p.sym)}<section><h2>3 · Ticket boxes</h2>${boxes}</section>
 <section><h2>4 · The plan</h2><table class=plan>
 <tr><td>Entry</td><td>${p.etype==='trigger'?'Daily close above':'Pull back to EMA21 ≈'} <b>${f(p.entry)}</b></td></tr>
 <tr><td>Stop</td><td><b class=red>${f(p.stop)}</b> (${pct(p.stop,p.entry)})</td></tr>
 <tr><td>TP1 · sell ⅓</td><td>${f(p.tp[0])} (+1R) → move stop to breakeven</td></tr>
 <tr><td>TP2 · sell ⅓</td><td><b class=grn>${f(p.tgt)}</b> (planned target)</td></tr>
 <tr><td>Runner ⅓</td><td>Sell on first daily close under EMA21</td></tr>
 <tr><td>R multiple</td><td>${p.R0} from plan · ${p.Rlive??'—'} from today's price</td></tr>
 <tr><td>Invalid if</td><td>Daily close under ${f(p.stop)}${p.etype==='trigger'?', or no trigger close within ~2 weeks':', or EMA21 crosses under EMA55'}; also BTC daily close under $80k</td></tr></table>
 <p class=small>Train Jumper backtest (12 assets, ${meta.ts.n} trades): ${meta.ts.win}% win rate, avg +${meta.ts.avg}R — small losses, a few big wins. Sell into strength; no HODL.</p></section>
 <section class="card warn"><h2>5 · Risk</h2><p><b>CPI Wed Oct 14, 8:30 AM ET.</b> BTC has swung −9% to +11% around hot/cool CPI prints. Don't enter before the print; let the first daily close after it decide.</p><p><b>BTC $${f(meta.btc)}:</b> hold $80k or the alt longs are off. Reclaim $87.4k and the risk-on case firms up. ${p.kind!=='coin'&&p.sym!=='NVDA'?'This name moves with BTC, often 2–3× harder.':p.sym==='NVDA'?'NVDA tracks the Nasdaq/AI trade more than BTC; CPI hits it through rates.':'Alts move harder than BTC both ways.'}</p></section>
 <nav class=pn>${prev?`<a href="#${prev.sym}">← ${prev.sym}</a>`:'<span></span>'}${next?`<a href="#${next.sym}">${next.sym} →</a>`:'<a href="#">Index</a>'}</nav>`;
 $('#app').innerHTML=h;scrollTo(0,0);mkChart(p);if(p.an)mkAn(p)}
const LAY={EMAs:1,'200D':1,Fibs:1,'S/R':1,Trend:1,Plan:1,Labels:1};
function sizeCv(cv){const w=cv.parentElement.clientWidth,h=Math.round(Math.min(Math.max(w*0.8,260),460)),d=devicePixelRatio||1;
 if(cv._w===w&&cv._h===h)return null;cv._w=w;cv._h=h;cv.width=w*d;cv.height=h*d;cv.style.height=h+'px';const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);return x}
function mkChart(p){const cv=$('#c');let hover=null;
 $('#tog').innerHTML=Object.keys(LAY).map(k=>`<button class="${LAY[k]?'on':''}" data-k="${k}">${k}</button>`).join('');
 $('#tog').onclick=e=>{const k=e.target.dataset.k;if(!k)return;LAY[k]^=1;e.target.classList.toggle('on');cv._w=0;draw()};
 const B=p.bars,n=B.length;
 function draw(){sizeCv(cv);const x=cv.getContext('2d'),W=cv._w,H=cv._h,R=54,T=8,Bm=18;
  let lo=Math.min(...B.map(b=>b[3]),p.stop),hi=Math.max(...B.map(b=>b[2]),p.tgt);const pad=(hi-lo)*.04;lo-=pad;hi+=pad;
  const X=i=>(i+.5)*(W-R)/n,Y=v=>T+(hi-v)/(hi-lo)*(H-T-Bm),cw=Math.max(1,(W-R)/n*.7);
  x.clearRect(0,0,W,H);x.font='10px system-ui';const used=[Y(p.px)];
  const hl=(v,col,txt,dash)=>{if(v<lo||v>hi)return;x.strokeStyle=col;x.setLineDash(dash||[]);x.beginPath();x.moveTo(0,Y(v));x.lineTo(W-R,Y(v));x.stroke();x.setLineDash([]);const yy=Y(v);if(used.some(u=>Math.abs(u-yy)<11))return;used.push(yy);x.fillStyle=col;x.fillText(txt,W-R+3,yy+3)};
  if(LAY.Plan){used.push(Y(p.entry),Y(p.stop),Y(p.tgt))}
  if(LAY.Fibs){const a=Y(p.fib['0.618']),b=Y(p.fib['0.65']);x.fillStyle='rgba(255,200,0,.14)';x.fillRect(0,a,W-R,b-a);
   for(const k of['0.382','0.5','0.618','0.702','0.786'])hl(p.fib[k],k==='0.702'||k==='0.786'?'#c9a2ff':'#776',(k==='0.618'?'GP ':'')+'.'+k.slice(2)+' '+f(p.fib[k]),[2,3])}
  if(LAY['S/R']){p.res.forEach(v=>hl(v,'#e66','R '+f(v),[6,3]));p.sup.forEach(v=>hl(v,'#5c9','S '+f(v),[6,3]))}
  x.setLineDash([]);
  B.forEach((b,i)=>{const up=b[4]>=b[1];x.strokeStyle=x.fillStyle=up?'#3ecf8e':'#f0616d';x.beginPath();x.moveTo(X(i),Y(b[2]));x.lineTo(X(i),Y(b[3]));x.stroke();const y1=Y(Math.max(b[1],b[4])),y2=Y(Math.min(b[1],b[4]));x.fillRect(X(i)-cw/2,y1,cw,Math.max(1,y2-y1))});
  const line=(arr,col)=>{x.strokeStyle=col;x.lineWidth=1.5;x.beginPath();let s=0;arr.forEach((v,i)=>{if(v==null)return;s?x.lineTo(X(i),Y(v)):x.moveTo(X(i),Y(v));s=1});x.stroke();x.lineWidth=1};
  if(LAY.EMAs){line(p.e21,'#4da3ff');line(p.e55,'#ff9f43')}if(LAY['200D'])line(p.m200,'#ddd');
  if(LAY.Trend&&p.tl){x.strokeStyle='#5c9';x.lineWidth=1.5;x.beginPath();x.moveTo(X(p.tl[0]),Y(p.tl[1]));x.lineTo(X(p.tl[2]),Y(p.tl[3]));x.stroke();x.lineWidth=1}
  if(LAY.Labels){x.textAlign='center';p.lab.forEach(([i,v,t,h])=>{x.fillStyle=t[0]==='H'&&t[1]==='H'||t==='HL'?'#8fe3b8':'#f59aa2';x.fillText(t,X(i),h?Y(v)-4:Y(v)+11)});x.textAlign='left'}
  if(LAY.Plan){used.length=0;used.push(Y(p.px));hl(p.entry,'#4da3ff','ENTRY '+f(p.entry));hl(p.stop,'#f0616d','STOP '+f(p.stop));hl(p.tgt,'#3ecf8e','TGT '+f(p.tgt))}
  x.fillStyle='#ffd166';x.fillText('▶'+f(p.px),W-R+2,Y(p.px)+3);
  x.fillStyle='#889';[0,Math.floor(n/2),n-1].forEach(i=>{const d=new Date(B[i][0]*1e3).toISOString().slice(5,10);x.fillText(d,Math.min(X(i),W-R-30),H-4)});
  if(hover!=null){const b=B[hover];x.strokeStyle='#fff6';x.beginPath();x.moveTo(X(hover),0);x.lineTo(X(hover),H-Bm);x.stroke();x.fillStyle='#000c';x.fillRect(4,4,190,30);x.fillStyle='#fff';x.fillText(new Date(b[0]*1e3).toISOString().slice(0,10)+'  C '+f(b[4]),8,16);x.fillText('O '+f(b[1])+' H '+f(b[2])+' L '+f(b[3]),8,29)}}
 const pick=e=>{const r=cv.getBoundingClientRect();hover=Math.max(0,Math.min(n-1,Math.floor((e.clientX-r.left)/((cv._w-54)/n))));draw()};
 cv.onpointerdown=cv.onpointermove=e=>{if(e.pointerType==='mouse'&&!e.buttons&&e.type==='pointermove'){pick(e);return}pick(e)};cv.onpointerleave=()=>{hover=null;draw()};
 cv._draw=draw;draw();obs(cv)}
function mkAn(p){const cv=$('#anc'),a=p.an;
 function draw(){sizeCv(cv);const x=cv.getContext('2d'),W=cv._w,H=cv._h;const all=a.now.concat(a.then);const lo=Math.min(...all)*.97,hi=Math.max(...all)*1.03,n=a.then.length;
  const X=i=>i*(W-10)/(n-1)+5,Y=v=>6+(hi-v)/(hi-lo)*(H-20);x.clearRect(0,0,W,H);
  x.strokeStyle='#666';x.setLineDash([3,3]);x.beginPath();x.moveTo(X(a.pre-1),0);x.lineTo(X(a.pre-1),H);x.stroke();x.setLineDash([]);
  const ln=(arr,c,w)=>{x.strokeStyle=c;x.lineWidth=w;x.beginPath();arr.forEach((v,i)=>i?x.lineTo(X(i),Y(v)):x.moveTo(X(i),Y(v)));x.stroke()};
  ln(a.then,'#9aa',1.5);ln(a.now.slice(-a.pre),'#ffd166',2);x.lineWidth=1;x.fillStyle='#889';x.font='10px system-ui';x.fillText('now',X(a.pre-1)-24,H-4);x.fillText('then → next 60d',X(a.pre-1)+4,H-4)}
 cv._draw=draw;draw();obs(cv)}
const RO=new ResizeObserver(es=>requestAnimationFrame(()=>es.forEach(e=>{const c=e.target.querySelector('canvas');if(c&&c._draw&&c.parentElement.clientWidth!==c._w){c._w=0;c._draw()}})));
function obs(cv){RO.observe(cv.parentElement)}
function ocsec(sym){const o=(window.OC||{}).assets&&OC.assets[sym];if(!o)return'';const c={confirms:'#2ea043',neutral:'#d29922',contradicts:'#f85149'}[o.v];
return `<section><h2>On-chain &amp; smart money</h2><p><b style="color:${c}">${o.tag}</b> <small>· ${OC.asof}</small></p><p class=small>${o.sum}</p><ul class=small style="padding-left:18px">${o.ev.map(([k,t,u,d])=>`<li style="margin-bottom:6px"><b>${k}:</b> ${t} <a href="${u}" target=_blank rel=noopener>source</a> <small>(${d})</small></li>`).join('')}</ul></section>`}
function ocpage(sym){document.title=sym+' on-chain';$('#app').innerHTML=`<nav><a href="#">← All picks</a><span>Watch list</span></nav><section class="card verdict"><h1>${sym}</h1><p>Schwab/Uphold watch-list coin, on-chain check only (no chart lesson yet).</p></section>`+ocsec(sym);scrollTo(0,0)}
function ochome(){return `<div class=card><b>On-chain check (${OC.asof}):</b> ${Object.entries(OC.assets).map(([k,o])=>`<a href="#${picks.find(p=>p.sym===k)?k:'oc-'+k}">${k}</a> ${o.v==='confirms'?'✅':o.v==='neutral'?'🟡':'🔴'}`).join(' · ')}</div>`}
function route(){RO.disconnect();const s=location.hash.slice(1);if(s==='scan')return scanpage();if(s==='gold')return goldpage();if(s==='draft')return draft();if(s==='check')return check();if(s==='catalysts')return cats();if(s.startsWith('oc-'))return ocpage(s.slice(3));const p=picks.find(q=>q.sym===s);p?lesson(p):home()}
function draft(){document.title='Draft Board · Picks Playbook';const{watch,cat}=WB;const g=(v)=>v==null?'—':f(v);
 const L=(t,u)=>u?`<a href="${u}" target=_blank rel=noopener>${t}</a>`:t;
 let h=`<nav><a href="#">← Picks</a><a href="#catalysts">Catalysts →</a></nav><h1>Draft Board</h1><p class=sub>Players to watch: strong fundamentals, not set up yet. Ranked like ADP: box score + trend (EMA stack, 200D, weekly) − distance to trigger. Prices ${watch[0].asof}.</p>`;
 let rd=0;watch.forEach(w=>{if(w.round!==rd){rd=w.round;h+=`<h2>Round ${rd}${rd===1?' · closest to a buy':rd===2?' · needs work':' · deep sleepers'}</h2>`}
  const above=w.zone[0]>w.px;
  h+=`<div class=card><div class=wh><span class=n>${w.adp}</span><div><b>${w.sym}</b> $${g(w.px)} ${w.box!=null?`<span class="tag box">${w.box}/5</span>`:'<span class=tag>unscored</span>'} <span class="tag ${w.trend==='Uptrend'?'Train':''}">${w.trend}</span>${w.pull?' <span class="tag S">pullback wait</span>':''}</div></div>
  <p class=small style="margin:6px 0"><b>What should it cost:</b> ${above?`price is already under its up-leg .618–.786 zone (${g(w.zone[0])}–${g(w.zone[1])}); no fib support until the 365d swing levels below`:`buy zone <b class=grn>${g(w.zone[0])} – ${g(w.zone[1])}</b>`}${w.sym==='BTC'?' (STH cost basis $74.3k → $80k)':w.pull?' (EMA55 → EMA21)':' (.786 → .618 of the up-leg)'}</p>
  <p class=small style="margin:6px 0"><b>Promotes to a buy:</b> ${w.tt}${w.pull?'':` — ${w.dist>0?'+':''}${w.dist}% away`}</p>
  <details><summary>Stats & models</summary><table class=plan>
  <tr><td>Fib zones</td><td>Up-leg ${g(w.uL)}→${g(w.uH)}: .618 ${g(w.uz['0.618'])} · .702 ${g(w.uz['0.702'])} · .786 ${g(w.uz['0.786'])}<br>${w.short?'Full history':'365d'} swing ${g(w.L)}→${g(w.H)}: .618 ${g(w.fz['0.618'])} · .702 ${g(w.fz['0.702'])} · .786 ${g(w.fz['0.786'])}</td></tr>
  <tr><td>200D / breakout</td><td>200D ${g(w.m200)} (${w.m200?(w.px>w.m200?'above':'below'):'n/a'}) · prior range high ${g(w.brk)}${w.brk&&w.px>w.brk?' — retest = support':''}</td></tr>
  <tr><td>Trend</td><td>Daily: EMA21 ${g(w.e21)} ${w.stack?'>':'<'} EMA55 ${g(w.e55)} · RSI ${w.drsi}<br>Weekly: ${w.wk_ok?'above':'below'} 21W EMA ${g(w.w21)}</td></tr>
  <tr><td>Expected range</td><td>Vol ${w.sig}%/yr → 30d 1σ ${g(w.rng['30'][0])}–${g(w.rng['30'][1])}; 90d ${g(w.rng['90'][0])}–${g(w.rng['90'][1])} (≈68% odds, not a forecast)</td></tr>
  <tr><td>Corr to BTC</td><td>${w.sym==='BTC'?'—':w.cor+' (90d daily)'}${w.sym==='CC'?' — CoinGecko daily closes, short history':''}</td></tr>
  <tr><td>Analogs</td><td>${w.an?`${w.an.n} past look-alikes: avg +30d ${w.an.f30}%, +60d ${w.an.f60}%, ${w.an.up}/${w.an.n} up after 60d. Historical, not a prediction.`:'No analog set in Chart Caller.'}</td></tr>
  <tr><td>Models</td><td>${w.model?w.model.map(m=>L(m[0],m[1])+` (${m[2]})`).join('<br>'):'No credible published target found; skipped rather than guessed.'}</td></tr>
  <tr><td>ETF flows</td><td>${w.flow?L(w.flow[0],w.flow[1]):'No US spot ETF flow data'}</td></tr>
  <tr><td>Unlocks</td><td>${w.unlock?L(w.unlock[0],w.unlock[1]):'No unlock checked/none listed'}</td></tr>
  <tr><td>Boxes</td><td>${w.ev||'—'}${w.src?'<br><span class=small>Src: '+w.src+'</span>':''}</td></tr></table></details></div>`});
 h+=`<p class=foot>Zones/ranges computed from Yahoo Finance daily candles (CC, GRAM: CoinGecko daily closes). Analogs are historical. Not financial advice.</p>`;
 $('#app').innerHTML=h;scrollTo(0,0)}
function cats(){document.title='Catalysts · Picks Playbook';const{cat}=WB;
 let h=`<nav><a href="#draft">← Draft Board</a><a href="#">Picks</a></nav><h1>Things that change everything</h1><p class=sub>Trade-deadline calendar. Times ET. Each line: what a bull or bear outcome does to the watch list.</p>`;
 cat.forEach(c=>{h+=`<div class=card><div class=cd><b>${c[0]}</b> <span class=small>${c[1]}</span></div><b>${c[2]}</b><p class=small style="margin:6px 0"><span class=grn>▲ ${c[4]}</span><br><span class=red>▼ ${c[5]}</span></p><a class=small href="${c[3]}" target=_blank rel=noopener>source</a></div>`});
 $('#app').innerHTML=h+'<p class=foot>Sources checked Oct 13, 2026.</p>';scrollTo(0,0)}
const CK_KEY='pb-check-v2';
const TRAIN=[['hh','Higher highs & higher lows'],['ema','Daily EMA21 > EMA55 and EMA21 rising'],['brk','Fresh breakout (new 60-bar high)'],['vol','Volume expanding on the breakout'],['rs','Relative strength vs BTC rising'],['lag','Leader already pumped (pump-timing lag favors this one)']];
const BOARD=[['pb','Pullback to daily EMA21 — 1st or 2nd touch'],['cool','Not extended: RSI < 75 and < 10% above EMA21']];
const SEC=[['Season / macro (BCB)',[['season','BTC above its 50-week MA (MUST)'],['fibs','Macro fibs OK (not losing .702/.786)'],['event48','No CPI/FOMC within 48h'],['ladder','Money-flow ladder stage reached (BTC → ETH → large caps → this)'],['dxy','Dollar & yields falling/flat'],['regime','Regime = bull (not bear, not euphoria)']]],
['Odds (Krown)',[['wmom','Weekly momentum up (Stoch RSI / RSI > 50)'],['gx','EMA golden cross in place'],['analog','Historical analogs mostly up (≥60%)']]],
['Ticket boxes (need 3+ of 5)',[['bUSA','USA-based / US-friendly'],['bISO','ISO 20022 / VC / institution "knighted"'],['bSEC','RWA / gaming / AI'],['bOC','On-chain proof (not a shell)'],['bNET','Network effect (real partners)']]],
['On-chain / smart money',[['etf','ETF flows not bleeding'],['whale','Whales accumulating'],['fund','Funding flat/negative (squeeze fuel)'],['unl','No big unlock in next 2 weeks']]]];
const EVTS=[new Date('2026-10-14T12:30:00Z'),new Date('2026-10-15T12:30:00Z'),new Date('2026-10-28T18:00:00Z'),new Date('2026-11-06T13:30:00Z'),new Date('2026-11-10T13:30:00Z')];
const evWithin=hrs=>EVTS.find(t=>t-new Date()<hrs*36e5&&t-new Date()>-2*36e5);
function ckLoad(){try{return JSON.parse(localStorage.getItem(CK_KEY))||{a:{},plan:{}}}catch(e){return{a:{},plan:{}}}}
function ckSave(s){try{localStorage.setItem(CK_KEY,JSON.stringify(s))}catch(e){}}
function prefill(sym,old){const s={a:{},sym,plan:{risk:old.plan&&old.plan.risk}};const A=s.a;const p=picks.find(x=>x.sym===sym),w=WB.watch.find(x=>x.sym===sym);
 A.season=WB.btc>WB.btc50w?1:0;A.event48=evWithin(48)?0:1;
 const src=p||w;if(!src)return s;const px=src.px,e21=p?p.e21.at(-1):w.e21,e55=p?p.e55.at(-1):w.e55,rsi=src.drsi;
 A.gx=e21>e55?1:0;A.cool=rsi<75&&px<e21*1.1?1:0;A.pb=Math.abs(px/e21-1)<0.03?1:0;
 if(p){const c=Object.values(p.crit);A.brk=c[0]?1:0;A.ema=c[1]&&c[3]?1:0;const hl=p.lab.slice(-4);A.hh=hl.filter(l=>l[2]==='HH'||l[2]==='HL').length>=3?1:0;
  if(p.wrsi!=null)A.wmom=p.wrsi>50?1:0;if(p.an)A.analog=p.an.f60>0?1:0;
  if(p.boxes)['bUSA','bISO','bSEC','bOC','bNET'].forEach((k,i)=>{const v=p.boxes[i][1];A[k]=v==='✓'?1:v==='½'?2:0});
  s.plan.entry=+p.entry.toPrecision(5);s.plan.stop=+p.stop.toPrecision(5);s.plan.tgt=+p.tgt.toPrecision(5)}
 if(w){A.ema=w.stack&&e21>0?A.ema??(w.stack?1:0):0;if(w.an)A.analog=w.an.up/w.an.n>=.6?1:0;if(w.flow)A.etf=/−|outflow/.test(w.flow[0])?0:1;
  if(!p){s.plan.entry=+(w.pull?w.e21:w.trig).toPrecision(5);s.plan.stop=+(w.pull?w.e55:w.zone[1]).toPrecision(5)}}
 return s}
function check(){document.title='Pre-Trade Checklist';let s=ckLoad();s.a=s.a||{};s.plan=s.plan||{};
 const syms=[...new Set(picks.map(p=>p.sym).concat(WB.watch.map(w=>w.sym)))];
 const ic=v=>v===1?'✓':v===0?'✗':v===2?'½':'?',cl=v=>v===1?'ok':v===0?'no':v===2?'half':'';
 const row=([k,l])=>`<button class="ck ${cl(s.a[k])}" data-k="${k}"><span class=ci>${ic(s.a[k])}</span><span>${l}</span></button>`;
 const P=s.plan;
 let h=`<nav><a href="#">← Picks</a><a href="#check" id=ckreset>Reset</a></nav><h1>Pre-Trade Checklist</h1>
 <p class=sub>Tap: ? → ✓ → ✗. Saved on this phone. Prefill fills what the data knows; confirm the rest yourself.</p>
 <div class=card><label class=small>Prefill from asset</label><select id=cksym><option value="">— pick —</option>${syms.map(x=>`<option ${x===s.sym?'selected':''}>${x}</option>`).join('')}</select></div>
 <div id=ckv></div>
 <section class="card star"><h2>🚂 Is it a train?</h2><div id=trs></div>${TRAIN.map(row).join('')}</section>
 <section class="card star"><h2>🎟️ Board the train</h2>${BOARD.map(row).join('')}<div id=auto></div>
 <div class=grid>${[['entry','Entry (EMA21 / trigger)'],['stop','Stop (below EMA21 / swing low)'],['tgt','Target'],['risk','Risk $ per trade']].map(([k,l])=>`<label>${l}<input inputmode=decimal data-p="${k}" value="${P[k]??''}"></label>`).join('')}</div><div id=calc></div></section>
 <h2 class=sech>Secondary filters</h2>${SEC.map(([t,it])=>`<details class=card><summary>${t} <span class=small id="sum-${t.split(' ')[0]}"></span></summary>${it.map(row).join('')}</details>`).join('')}`;
 $('#app').innerHTML=h;scrollTo(0,0);
 const upd=()=>{const A=s.a,P=s.plan,e=+P.entry,st=+P.stop,t=+P.tgt,r=+P.risk;const R=e&&st&&t&&e>st?(t-e)/(e-st):null;const ev=evWithin(24);
  const tn=TRAIN.filter(i=>A[i[0]]===1).length;const core=['hh','ema','brk'].every(k=>A[k]===1);
  $('#trs').innerHTML=`<p class="small ${core?'grn':'red'}">${tn}/6 · core (HH/HL, EMA stack, breakout) ${core?'pass — it is a train':'not all pass'}</p>`;
  const boxes=['bUSA','bISO','bSEC','bOC','bNET'].reduce((n,k)=>n+(A[k]===1?1:A[k]===2?.5:0),0);
  const auto=[['Stop defined below entry',!!(e&&st&&st<e)],['Room ≥ 2R'+(R?` (R = ${R.toFixed(2)})`:''),R!=null&&R>=2],['No CPI/FOMC/jobs in 24h'+(ev?` — next ${ev.toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})} ET`:''),!ev]];
  $('#auto').innerHTML=auto.map(m=>`<div class="ck auto ${m[1]?'ok':'no'}"><span class=ci>${m[1]?'✓':'✗'}</span><span>${m[0]} <small>(auto)</small></span></div>`).join('');
  const board=A.pb===1&&A.cool===1;
  const must=[['Season: BTC > 50W MA ($'+f(WB.btc50w)+')',A.season===1],['It is a train (core 3) or trigger hit',core],['Boarding: EMA21 pullback, not extended',board],...auto];
  const fails=must.filter(m=>!m[1]);const v=fails.length===0&&boxes>=3?'GO':(A.season===0||(R!=null&&R<1)||A.ema===0)?'NO':'WAIT';
  const size=e&&st&&r&&e>st?r/(e-st):null;
  $('#calc').innerHTML=`<table class=plan><tr><td>Position size</td><td>${size?`<b>${size.toLocaleString('en-US',{maximumFractionDigits:size<10?3:0})} units ≈ $${(size*e).toLocaleString('en-US',{maximumFractionDigits:0})}</b><br><small>risk $ ÷ (entry − stop)</small>`:'enter entry, stop, risk $'}</td></tr>
  <tr><td>Sell ⅓</td><td>${e&&st&&e>st?f(2*e-st)+' (+1R) → move stop to breakeven':'—'}</td></tr><tr><td>Sell ⅓</td><td>${t?f(t)+' (target)':'—'}</td></tr><tr><td>Last ⅓</td><td>Trail: sell on daily close below EMA21</td></tr></table>`;
  $('#ckv').innerHTML=`<div class="card v${v}"><div class=vbig>${v}${s.sym?' · '+s.sym:''}</div><p class="small" style="text-align:center">Boxes ${boxes}/5${boxes<3?' (need 3+ for GO)':''}</p><ul class=crit>${must.map(m=>`<li class=${m[1]?'ok':'no'}>${m[1]?'✓':'✗'} ${m[0]}</li>`).join('')}</ul></div>`;
  SEC.forEach(([t,it])=>{const el=document.getElementById('sum-'+t.split(' ')[0]);if(el)el.textContent=it.filter(i=>A[i[0]]===1).length+'/'+it.length+' ✓'})};
 $('#app').onclick=e=>{const b=e.target.closest('button.ck');if(b){const k=b.dataset.k,v=s.a[k];if(v==null)s.a[k]=1;else if(v===1)s.a[k]=0;else delete s.a[k];ckSave(s);b.className='ck '+cl(s.a[k]);b.querySelector('.ci').textContent=ic(s.a[k]);upd()}
  if(e.target.id==='ckreset'){e.preventDefault();localStorage.removeItem(CK_KEY);check()}};
 $('#app').oninput=e=>{const k=e.target.dataset.p;if(k){s.plan[k]=e.target.value;ckSave(s);upd()}};
 $('#cksym').onchange=e=>{if(e.target.value){s=prefill(e.target.value,s);ckSave(s);check()}};
 upd()}

addEventListener('hashchange',route);route();
