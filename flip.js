/* 🙃 Flip: mirror every Lightweight-Charts price axis (invertScale), swap candle colors and marker sides. */
(function(){
const LW=window.LightweightCharts;if(!LW||window.__flipDone)return;window.__flipDone=1;
window.FLIP=localStorage.getItem('flip_on')==='1';const charts=new Set();
const st=document.createElement('style');st.textContent='.flipbadge{position:absolute;top:4px;left:4px;z-index:5;display:flex;gap:4px;pointer-events:auto}.flipbadge button{font:600 12px system-ui;padding:6px 9px;border-radius:8px;border:1px solid #30363d;background:#21262dcc;color:#e6edf3}.flipbadge .fl{background:#9e6a03;border-color:#f2cc60;color:#fff}.flipbadge b{font:800 11px system-ui;background:#da3633;color:#fff;padding:6px 8px;border-radius:8px;letter-spacing:.5px}';document.head.appendChild(st);
const sw={aboveBar:'belowBar',belowBar:'aboveBar',arrowUp:'arrowDown',arrowDown:'arrowUp'};
function apply(ch){const F=window.FLIP;
 ['right','left'].forEach(id=>{try{ch.priceScale(id).applyOptions({invertScale:F})}catch(e){}});
 ch.__s.forEach(s=>{const id=s.options().priceScaleId;if(id&&id!=='right'&&id!=='left'){try{ch.priceScale(id).applyOptions({invertScale:F})}catch(e){}}
  if(s.__orig){const o=s.__orig;s.applyOptions(F?{upColor:o.downColor,downColor:o.upColor,wickUpColor:o.wickDownColor,wickDownColor:o.wickUpColor,borderUpColor:o.borderDownColor,borderDownColor:o.borderUpColor}:o)}
  if(s.__m){s.__setM(F?s.__m.map(m=>({...m,position:sw[m.position]||m.position,shape:sw[m.shape]||m.shape})):s.__m)}});
 badge(ch)}
function badge(ch){const el=ch.__el;if(!el)return;if(getComputedStyle(el).position==='static')el.style.position='relative';let b=el.querySelector(':scope>.flipbadge');
 if(!b){b=document.createElement('div');b.className='flipbadge';el.appendChild(b)}
 b.innerHTML=`<button class="${window.FLIP?'fl':''}" type="button">🙃 Flip</button>${window.FLIP?'<b>FLIPPED</b>':''}`;
 b.querySelector('button').onclick=e=>{e.stopPropagation();setFlip(!window.FLIP)}}
window.setFlip=function(v){window.FLIP=!!v;localStorage.setItem('flip_on',v?'1':'0');charts.forEach(apply);window.onFlip&&window.onFlip(window.FLIP)};
const orig=LW.createChart;
const NL=Object.assign({},LW);window.LightweightCharts=NL;
NL.createChart=function(el,opt){const ch=orig.call(LW,el,opt);ch.__el=typeof el==='string'?document.getElementById(el):el;ch.__s=[];charts.add(ch);
 ['addCandlestickSeries','addLineSeries','addHistogramSeries','addAreaSeries','addBarSeries','addBaselineSeries'].forEach(k=>{const f=ch[k];if(!f)return;ch[k]=function(o){const s=f.apply(ch,arguments);ch.__s.push(s);
  if(k==='addCandlestickSeries'){const so=s.options();s.__orig={upColor:so.upColor,downColor:so.downColor,wickUpColor:so.wickUpColor,wickDownColor:so.wickDownColor,borderUpColor:so.borderUpColor,borderDownColor:so.borderDownColor}}
  const sm=s.setMarkers.bind(s);s.__setM=sm;s.setMarkers=m=>{s.__m=m;sm(window.FLIP?m.map(x=>({...x,position:sw[x.position]||x.position,shape:sw[x.shape]||x.shape})):m)};
  const so2=s.setData.bind(s);s.setData=d=>{if(s.__orig&&window.FLIP)d=d.map(b=>b.color?{...b}:b);return so2(d)};
  setTimeout(()=>apply(ch),0);return s}});
 const pa=ch.priceScale.bind(ch);ch.priceScale=id=>{const p=pa(id);const ao=p.applyOptions.bind(p);p.applyOptions=o=>ao({...o,invertScale:window.FLIP});return p};
 const rm=ch.remove.bind(ch);ch.remove=()=>{charts.delete(ch);const b=ch.__el&&ch.__el.querySelector(':scope>.flipbadge');b&&b.remove();rm()};
 setTimeout(()=>apply(ch),0);return ch};
})();
