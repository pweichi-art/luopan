'use strict';
// 日照模擬 + 窗戶朝向分析。太陽位置用 NOAA 簡化天文公式（台北日出日落與氣象署差 2 分鐘內）。
// 方位一律用「正北」計算；畫到羅盤上時，磁北模式要再轉 -DECL。

// ---------- 太陽位置 ----------
function sunPos(date, lat, lon) {
  const n = date.getTime() / 86400000 + 2440587.5 - 2451545.0;
  const L = norm(280.460 + 0.9856474 * n);
  const g = rad(norm(357.528 + 0.9856003 * n));
  const lam = rad(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
  const eps = rad(23.439 - 0.0000004 * n);
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam));
  const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
  const gmst = norm(280.46061837 + 360.98564736629 * n);
  const H = rad(gmst + lon) - ra;
  const la = rad(lat);
  const alt = Math.asin(Math.sin(la) * Math.sin(dec) + Math.cos(la) * Math.cos(dec) * Math.cos(H));
  const az = Math.atan2(-Math.sin(H), Math.tan(dec) * Math.cos(la) - Math.sin(la) * Math.cos(H));
  return { az: norm(az * 180 / Math.PI), alt: alt * 180 / Math.PI };
}
// 某天（本地日期）第 m 分鐘的時刻
const atMin = (day, m) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, m);
const hm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
function riseSet(day, loc) {
  let rise = null, set = null, prev = sunPos(atMin(day, 0), loc.lat, loc.lon).alt;
  for (let m = 1; m <= 1440; m++) {
    const a = sunPos(atMin(day, m), loc.lat, loc.lon).alt;
    if (prev < -0.833 && a >= -0.833) rise = m;
    if (prev >= -0.833 && a < -0.833) set = m;
    prev = a;
  }
  return { rise, set };
}
const DIR16 = ['北','北偏東','東北','東偏北','東','東偏南','東南','南偏東','南','南偏西','西南','西偏南','西','西偏北','西北','北偏西'];
const dir16 = a => DIR16[Math.round(norm(a) / 22.5) % 16];

// ---------- 位置 ----------
const CITIES = [
  ['基隆',25.13,121.74],['台北',25.03,121.56],['新北',25.01,121.46],['桃園',24.99,121.30],['新竹',24.80,120.97],
  ['苗栗',24.56,120.82],['台中',24.15,120.67],['彰化',24.08,120.54],['南投',23.91,120.68],['雲林',23.71,120.54],
  ['嘉義',23.48,120.45],['台南',22.99,120.21],['高雄',22.63,120.30],['屏東',22.67,120.49],['宜蘭',24.76,121.75],
  ['花蓮',23.99,121.60],['台東',22.76,121.14],['澎湖',23.57,119.58],['金門',24.43,118.32],['馬祖',26.16,119.95],
];
const LOC_KEY = 'luopan.loc';
function loadLoc() { try { return JSON.parse(localStorage.getItem(LOC_KEY)); } catch (e) { return null; } }
function saveLoc(l) { try { localStorage.setItem(LOC_KEY, JSON.stringify(l)); } catch (e) {} }
let LOC = loadLoc() || { name: '台北（預設）', lat: 25.03, lon: 121.56, auto: false };
function locate(done) {
  if (!navigator.geolocation) { done && done(false); return; }
  navigator.geolocation.getCurrentPosition(p => {
    LOC = { name: '目前位置', lat: +p.coords.latitude.toFixed(3), lon: +p.coords.longitude.toFixed(3), auto: true };
    saveLoc(LOC); done && done(true);
  }, () => done && done(false), { timeout: 10000, maximumAge: 86400000 });
}

// ---------- 窗戶分析 ----------
// 陽光有效照進垂直窗戶：太陽在窗戶正面那一側，且入射角 < 80°（cos(高度)·cos(方位差) > 0.17）
function windowSun(facing, day, loc) {
  let am = 0, pm = 0;
  for (let m = 0; m < 1440; m += 5) {
    const s = sunPos(atMin(day, m), loc.lat, loc.lon);
    if (s.alt <= 0) continue;
    if (Math.cos(rad(s.alt)) * Math.cos(rad(s.az - facing)) > 0.17) { if (m < 720) am += 5; else pm += 5; }
  }
  return { am: am / 60, pm: pm / 60, all: (am + pm) / 60 };
}
function seasonDays() {
  const y = new Date().getFullYear();
  return { summer: new Date(y, 5, 21), equinox: new Date(y, 2, 20), winter: new Date(y, 11, 22) };
}
const recTrue = r => r.north === '磁北' ? norm(r.deg + DECL) : r.deg;
const h1 = x => (Math.round(x * 2) / 2).toString();     // 取到 0.5 小時
function analyzeFacing(facing, loc = LOC) {
  const D = seasonDays();
  const s = windowSun(facing, D.summer, loc), e = windowSun(facing, D.equinox, loc), w = windowSun(facing, D.winter, loc);
  const tags = [], tips = [];
  const westPm = Math.max(s.pm, e.pm);
  // 下午直射且太陽來自西半邊才算西曬（避免朝南窗中午過後一點點也被算進去）
  const westish = Math.cos(rad(facing - 270)) > 0.35;
  if (westPm >= 2 && westish) {
    tags.push({ i: '🔥', t: `西曬：夏天下午直射約 ${h1(s.pm)} 小時`, c: 'bad' });
    tips.push('西曬：貼隔熱膜、裝外遮陽或雙層窗簾；臥室盡量不要放這一面，冷氣室外機避開這面牆。');
  }
  if (w.all >= 4 && s.all <= 2.5) {
    tags.push({ i: '☀️', t: `冬暖夏涼：冬天日照 ${h1(w.all)} 小時、夏天 ${h1(s.all)} 小時`, c: 'good' });
    tips.push('冬暖夏涼：很適合客廳、主臥，曬衣、太陽能板也首選這一面。');
  }
  if (e.am >= 2 && e.pm < 1) {
    tags.push({ i: '🌅', t: `晨光：陽光集中在上午`, c: 'good' });
    tips.push('晨光：適合臥室、廚房、餐廳；怕被曬醒就用遮光窗簾。');
  }
  if (w.all < 1) {
    tags.push({ i: '💧', t: `日照少易潮：冬天幾乎沒有直射陽光`, c: 'warn' });
    tips.push('日照少：注意除濕與防霉，衣櫃別貼這面外牆；光線柔和穩定，適合書房、工作室。');
  }
  if (Math.cos(rad(facing - 40)) > 0.766) {           // 朝 0°～80°（北到東偏北）
    tags.push({ i: '🌬️', t: `冬季迎東北季風`, c: 'warn' });
    tips.push('迎東北季風（北部、東部較明顯）：冬天冷風、雨水直吹，窗戶選氣密、水密等級高的。');
  }
  if (!tags.length) tags.push({ i: '🌤️', t: `日照適中`, c: '' });
  return { s, e, w, tags, tips };
}
function analysisHTML(name, facing) {
  const a = analyzeFacing(facing);
  const row = (n, x) => `<tr><td>${n}</td><td>${h1(x.am)}</td><td>${h1(x.pm)}</td><td><b>${h1(x.all)}</b></td></tr>`;
  return `
    <p style="margin-top:0"><b>${esc(name)}</b>：朝${dir16(facing)}（正北 ${facing.toFixed(0)}°）</p>
    <div class="tags" style="margin:0 0 10px">${a.tags.map(t => `<span class="pill ${t.c}">${t.i} ${t.t}</span>`).join('')}</div>
    <table class="suntbl"><tr><th></th><th>上午</th><th>下午</th><th>合計</th></tr>
      ${row('夏至', a.s)}${row('春秋分', a.e)}${row('冬至', a.w)}</table>
    <p class="muted">單位：小時，陽光直射進窗戶的時間。</p>
    ${a.tips.length ? `<ul class="tips">${a.tips.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
    <p class="muted">位置：${esc(LOC.name)}。只算太陽方向，對面建築、屋簷、陽台的遮擋算不到，實際日照會比較少。</p>`;
}
// 給紀錄頁用
window.recSunTags = r => analyzeFacing(recTrue(r)).tags;
window.recSunDetail = r => showInfo('日照分析', analysisHTML(r.name, recTrue(r)));

// ---------- 羅盤上的太陽軌跡 ----------
const sunLayer = el('g', { visibility: 'hidden' }, dial);
let sunOn = false, sunDay = new Date(), sunMin = 900, sunRS = null, sunPreset = 'today';
const altR = alt => 198 - Math.max(0, alt) / 90 * 152;        // 地平線在外圈、天頂在天池邊
function dialRot() { return useTrue ? 0 : -DECL; }              // 正北方位 → 羅盤角度

function drawSunPath() {
  sunLayer.innerHTML = '';
  sunLayer.setAttribute('transform', `rotate(${dialRot()})`);
  sunRS = riseSet(sunDay, LOC);
  if (sunRS.rise == null) return;
  const pts = [];
  for (let m = sunRS.rise; m <= sunRS.set; m += 5) {
    const s = sunPos(atMin(sunDay, m), LOC.lat, LOC.lon);
    pts.push(P(altR(s.alt), s.az));
  }
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  el('path', { d, fill: 'none', stroke: 'var(--dial)', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: .85 }, sunLayer);
  el('path', { d, fill: 'none', stroke: 'var(--gold)', 'stroke-width': 3, 'stroke-linecap': 'round' }, sunLayer);
  // 整點刻度
  for (let h = Math.ceil(sunRS.rise / 60); h * 60 <= sunRS.set; h++) {
    const s = sunPos(atMin(sunDay, h * 60), LOC.lat, LOC.lon);
    const [x, y] = P(altR(s.alt), s.az);
    el('circle', { cx: x, cy: y, r: 2.6, fill: 'var(--gold)' }, sunLayer);
    if (h % 3 === 0) el('text', { x, y: y - 8, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: 'var(--gold)', stroke: 'var(--dial)', 'stroke-width': 3, 'paint-order': 'stroke' }, sunLayer, h + '時');
  }
  // 日出、日落
  [['出', sunRS.rise], ['落', sunRS.set]].forEach(([t, m]) => {
    const s = sunPos(atMin(sunDay, m), LOC.lat, LOC.lon);
    const g = el('g', { transform: `rotate(${s.az}) translate(0,-219)` }, sunLayer);
    el('circle', { r: 10, fill: 'var(--warn)' }, g);
    el('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 11, 'font-weight': 700, fill: '#fff' }, g, t);
  });
  sunLayer._now = el('g', {}, sunLayer);
  drawSunNow();
}
function drawSunNow() {
  const g = sunLayer._now; if (!g) return;
  g.innerHTML = '';
  const s = sunPos(atMin(sunDay, sunMin), LOC.lat, LOC.lon);
  if (s.alt > 0) {
    const [x2, y2] = P(198, s.az), [x, y] = P(altR(s.alt), s.az);
    el('line', { x1: 0, y1: 0, x2, y2, stroke: 'var(--gold)', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }, g);
    for (let k = 0; k < 8; k++) {
      const [a1, b1] = [x + 12 * Math.sin(k * Math.PI / 4), y - 12 * Math.cos(k * Math.PI / 4)];
      const [a2, b2] = [x + 16 * Math.sin(k * Math.PI / 4), y - 16 * Math.cos(k * Math.PI / 4)];
      el('line', { x1: a1, y1: b1, x2: a2, y2: b2, stroke: 'var(--gold)', 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    }
    el('circle', { cx: x, cy: y, r: 9, fill: 'var(--gold)', stroke: 'var(--dial)', 'stroke-width': 2 }, g);
  }
  updateSunText(s);
}

// ---------- 控制面板 ----------
const panel = $('sunPanel');
function presetDay(p) {
  const y = new Date().getFullYear();
  return p === 'summer' ? new Date(y, 5, 21) : p === 'winter' ? new Date(y, 11, 22) : p === 'equinox' ? new Date(y, 2, 20) : new Date();
}
function buildPanel() {
  panel.innerHTML = `
    <div class="chips" id="sunDays" style="justify-content:flex-start">
      <button class="chip" data-p="today">今天</button><button class="chip" data-p="summer">夏至</button>
      <button class="chip" data-p="equinox">春秋分</button><button class="chip" data-p="winter">冬至</button>
    </div>
    <div id="sunRead" style="margin-top:12px;font-size:17px;font-weight:600"></div>
    <input type="range" id="sunRange" step="5" style="width:100%;margin-top:8px">
    <div class="muted" id="sunRS"></div>
    <div id="sunFace" style="margin-top:8px;font-size:14px"></div>
    <div class="muted" style="margin-top:8px">位置：<span id="sunLoc"></span>
      <button class="chip" id="sunGps" style="margin-left:4px">重新定位</button>
      <select id="sunCity" style="margin-top:6px"><option value="">選城市…</option>${CITIES.map((c, i) => `<option value="${i}">${c[0]}</option>`).join('')}</select>
    </div>
    <p class="muted">金色弧線是太陽一天的路徑：越外圈越低（接近地平線），越內圈越高。方位以正北計算。</p>`;
  panel.querySelectorAll('#sunDays .chip').forEach(c => c.onclick = () => setPreset(c.dataset.p));
  $('sunRange').oninput = e => { sunMin = +e.target.value; drawSunNow(); };
  $('sunGps').onclick = () => { $('sunLoc').textContent = '定位中…'; locate(ok => { if (!ok) alert('定位失敗，請改選城市'); refreshSun(); }); };
  $('sunCity').onchange = e => {
    const c = CITIES[+e.target.value]; if (!c) return;
    LOC = { name: c[0], lat: c[1], lon: c[2], auto: false }; saveLoc(LOC); e.target.value = ''; refreshSun();
  };
}
function setPreset(p) {
  sunPreset = p; sunDay = presetDay(p);
  panel.querySelectorAll('#sunDays .chip').forEach(c => c.classList.toggle('on', c.dataset.p === p));
  const rs = riseSet(sunDay, LOC);
  const now = new Date(), nm = now.getHours() * 60 + now.getMinutes();
  sunMin = p === 'today' && nm > rs.rise && nm < rs.set ? nm : 15 * 60;
  refreshSun();
}
function refreshSun() {
  drawSunPath();
  if (!sunRS || sunRS.rise == null) return;
  const r = $('sunRange');
  r.min = sunRS.rise; r.max = sunRS.set; r.value = sunMin = Math.min(Math.max(sunMin, sunRS.rise), sunRS.set);
  const a = sunPos(atMin(sunDay, sunRS.rise), LOC.lat, LOC.lon).az, b = sunPos(atMin(sunDay, sunRS.set), LOC.lat, LOC.lon).az;
  $('sunRS').textContent = `日出 ${hm(sunRS.rise)} ${dir16(a)} ${a.toFixed(0)}°・日落 ${hm(sunRS.set)} ${dir16(b)} ${b.toFixed(0)}°`;
  $('sunLoc').textContent = `${LOC.name}（${LOC.lat}, ${LOC.lon}）`;
  drawSunNow();
}
let lastSun = null;
function updateSunText(s) {
  lastSun = s;
  const label = sunPreset === 'today' ? '' : panel.querySelector(`#sunDays .chip[data-p="${sunPreset}"]`).textContent + ' ';
  $('sunRead').textContent = s.alt > 0
    ? `${label}${hm(sunMin)}｜太陽在${dir16(s.az)} ${s.az.toFixed(0)}°，高度 ${s.alt.toFixed(0)}°`
    : `${label}${hm(sunMin)}｜太陽在地平線下`;
  updateFacing();
}
// 你現在面對的方向，這個時間陽光會不會直射進來
function updateFacing() {
  if (!sunOn || !lastSun || !haveReading) return;
  const f = trueHeadingNow(), s = lastSun;
  const k = s.alt > 0 ? Math.cos(rad(s.alt)) * Math.cos(rad(s.az - f)) : 0;
  $('sunFace').innerHTML = s.alt <= 0 ? '' : k > 0.17
    ? `<span style="color:var(--warn)">☀️ 你面對的方向（${dir16(f)}）這時候<b>有陽光直射</b>進來</span>`
    : `<span style="color:var(--ink2)">你面對的方向（${dir16(f)}）這時候<b>照不到</b>直射陽光</span>`;
}
setInterval(updateFacing, 400);

function showSun(on) {
  sunOn = on;
  sunLayer.setAttribute('visibility', on ? 'visible' : 'hidden');
  panel.style.display = on ? '' : 'none';
  $('sunBtn').classList.toggle('on', on);
  if (on) {
    if (!panel.innerHTML) buildPanel();
    setPreset(sunPreset);
    if (!loadLoc()) { $('sunLoc').textContent = '定位中…'; locate(() => refreshSun()); }
  }
}
$('sunBtn').onclick = () => showSun(!sunOn);
$('northBtn').addEventListener('click', () => { if (sunOn) sunLayer.setAttribute('transform', `rotate(${dialRot()})`); });
