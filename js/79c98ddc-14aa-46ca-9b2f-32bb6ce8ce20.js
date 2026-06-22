/* ============================================================
   App controller — routing, nav, search, notifications, charts
   ============================================================ */

const state = { mod:'dashboard', tab:0, charts:[], preview:null };

/* ---- Role preview ---- */
const NAV_PERM = {cust:'顧客・店舗',contract:'契約管理',sales:'営業活動',plan:'作業計画',ops:'作業実行・報告',fleet:'配車・車両',doc:'作業報告書',invoice:'請求管理',revenue:'売上管理',bi:'BI分析',master:'作業マスタ',integ:'外部連携',auth:'権限管理',common:'共通・ログ'};
const ROLE_LANDING = {admin:'dashboard',mgr:'dashboard',sales:'dashboard',fin:'invoice',field:'ops'};
function roleLevel(key,navId){
  if(navId==='dashboard') return 'F';
  const idx = PERM_MODS.indexOf(NAV_PERM[navId]);
  return idx<0 ? 'F' : PERM[key][idx];
}
const LVL_LABEL = {F:'フル',E:'編集可',R:'参照のみ',N:'非表示'};
function enterPreview(key){
  if(!state.preview) state.prevMod = {mod:state.mod, tab:state.tab};
  state.preview = key;
  const role = ROLES.find(r=>r.key===key);
  document.getElementById('previewBar').classList.add('on');
  document.querySelector('.app').classList.add('preview-on');
  document.getElementById('pvRoleName').textContent = role.name;
  const cnt = NAV.filter(n=>n.type==='item' && roleLevel(key,n.id)!=='N').length;
  document.getElementById('pvMeta').textContent = `アクセス可能：${cnt}メニュー`;
  renderSidebar();
  route(ROLE_LANDING[key]||'dashboard',0);
  document.querySelector('.main').scrollTop=0;
}
function exitPreview(){
  state.preview = null;
  document.getElementById('previewBar').classList.remove('on');
  document.querySelector('.app').classList.remove('preview-on');
  renderSidebar();
  const p = state.prevMod || {mod:'dashboard',tab:0};
  route(p.mod, p.tab);
}

/* ---- Sidebar ---- */
function renderSidebar(){
  const side = document.getElementById('side');
  const pv = state.preview;
  // group nav into categories with items as children
  const groups=[]; let cur={label:null,items:[]};
  NAV.forEach(n=>{
    if(n.type==='cat'){ if(cur.items.length||cur.label) groups.push(cur); cur={label:n.label,items:[]}; }
    else if(n.type==='item'){ cur.items.push(n); }
  });
  groups.push(cur);
  let h='';
  groups.forEach(g=>{
    const items = g.items.filter(n=> !(pv && roleLevel(pv,n.id)==='N'));
    if(!items.length) return;                 // hide empty category in preview
    if(g.label) h+=`<div class="nav-cat"><div class="cl">${g.label}</div></div>`;
    items.forEach(n=>{
      const lvl = pv ? roleLevel(pv,n.id) : 'F';
      const ro = pv && lvl==='R';
      h+=`<div class="nav-item ${ro?'ro':''}" data-id="${n.id}" onclick="route('${n.id}')">
        ${ic(n.icon,'ni-ic')}<span>${n.name}</span>${
          ro ? `<span class="ro-badge">参照</span>` : (n.badge?`<span class="ni-badge">${n.badge}</span>`:'')
        }</div>`;
    });
  });
  side.innerHTML = h + `<div class="side-foot"><span class="dot"></span>${pv?'プレビューモード':'システム稼働中 · v2.4'}</div>`;
}

/* ---- Page head ---- */
function renderHead(){
  const [t,lead] = TITLES[state.mod];
  const catFor = id=>{ // find category label for breadcrumb
    let cur='メイン';
    for(const n of NAV){ if(n.type==='cat') cur=n.label; if(n.type==='item'&&n.id===id) return cur; }
    return cur;
  };
  const tabs = TABS[state.mod]||[];
  document.getElementById('crumb').innerHTML =
    `<span>${catFor(state.mod)}</span><span class="sep">›</span><b>${t}</b>`;
  document.getElementById('ptitle').innerHTML =
    `<h1>${t}</h1><span class="lead">${lead}</span>`;
  const tabsEl = document.getElementById('ptabs');
  if(tabs.length){
    tabsEl.style.display='flex';
    tabsEl.innerHTML = tabs.map((tb,i)=>`<div class="ptab ${i===state.tab?'active':''}" onclick="setTab(${i})">${tb}</div>`).join('');
  } else { tabsEl.style.display='none'; tabsEl.innerHTML=''; }
}

/* ---- Render page ---- */
function renderPage(){
  // destroy charts
  state.charts.forEach(c=>{try{c.destroy()}catch(e){}});
  state.charts=[];
  const fn = SCREENS[state.mod];
  let html = fn ? fn(state.tab) : `<div class="empty">${ic('info')}<div class="et">準備中</div></div>`;
  // read-only banner in preview mode
  if(state.preview){
    const lvl = roleLevel(state.preview, state.mod);
    const rn = ROLES.find(r=>r.key===state.preview).name;
    if(lvl==='R') html = `<div class="note warn">${ic('info')}<div>この画面は <b>${rn}</b> では<b>参照のみ</b>です。編集・登録はできません。</div></div>` + html;
  }
  document.getElementById('page').innerHTML = html;
  // disable action buttons on read-only preview screens
  if(state.preview && roleLevel(state.preview,state.mod)==='R'){
    document.querySelectorAll('#page .btn.primary, #page .btn.eco').forEach(b=>{
      b.style.opacity='.45'; b.style.pointerEvents='none';
    });
  }
  bindSegmented();
  setTimeout(()=>initCharts(),30);
  document.querySelector('.main').scrollTop=0;
}

/* ---- Routing ---- */
function route(id, tab=0){
  if(!SCREENS[id]) return;
  // preview guard: block hidden modules for the role
  if(state.preview && roleLevel(state.preview,id)==='N'){ toast('この権限ではアクセスできません'); return; }
  state.mod=id; state.tab=tab;
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.id===id));
  renderHead(); renderPage();
  if(!state.preview){ try{ localStorage.setItem('dk_route', JSON.stringify({mod:id,tab})); }catch(e){} }
  closeCmd(); closeDropdowns();
}
function setTab(i){
  state.tab=i;
  document.querySelectorAll('#ptabs .ptab').forEach((el,idx)=>el.classList.toggle('active',idx===i));
  renderPage();
  try{ localStorage.setItem('dk_route', JSON.stringify({mod:state.mod,tab:i})); }catch(e){}
}

/* ---- In-page segmented controls (toggle + panel switch) ---- */
function bindSegmented(){
  document.querySelectorAll('.segmented').forEach(g=>{
    if(!g.dataset.sg) return; // 手動onclick（例: 取引履歴 #txnKind）は上書きせず尊重する
    g.querySelectorAll('.seg').forEach((s,i)=>{
      s.onclick=()=>{
        g.querySelectorAll('.seg').forEach(x=>x.classList.remove('active'));
        s.classList.add('active');
        const sg=g.dataset.sg;
        if(sg){
          const panels=document.querySelector(`.seg-panels[data-sg="${sg}"]`);
          if(panels){
            panels.querySelectorAll(':scope > .seg-panel').forEach(p=>{ p.style.display = (p.dataset.i==String(i))?'':'none'; });
            // (re)draw charts that may live inside the now-visible panel
            setTimeout(()=>initCharts(),20);
          }
        }
      };
    });
  });
}

/* ---- Drawer (detail / form / document) ---- */
function showDrawer(){ document.getElementById('drawerMask').classList.add('open'); document.getElementById('drawer').classList.add('open'); }
/* 行クリックの汎用ドロワー：セル内のリンク/ボタン/入力/select をクリックした場合は、その要素自身のハンドラに任せて汎用ドロワーは開かない（二重発火・上書き防止） */
function rowDrawer(e,row){
  if(e&&e.target&&e.target.closest('.lnk,.btn,select,input,a,button')) return;
  openDrawer(row);
}
function rowTitle(row){ if(!row) return ''; const c=[...row.querySelectorAll('td')].map(td=>td.innerText.trim()); return c[1]||c[0]||''; }

function openDrawer(rowEl){
  const cells = [...rowEl.querySelectorAll('td')].map(td=>td.innerText.trim());
  const headers = [...rowEl.closest('table').querySelectorAll('thead th')].map(th=>th.innerText.trim());
  const title = cells[1]||cells[0]||'詳細';
  const code = cells[0]||'';
  let kv='';
  headers.forEach((hd,i)=>{ if(i>1 && cells[i] && hd && cells[i]!=='') kv+=`<dt>${hd}</dt><dd>${cells[i]}</dd>`; });
  document.getElementById('drawerTitle').textContent = title;
  document.getElementById('drawerSub').textContent = code;
  document.getElementById('drawerBody').innerHTML = `
    <dl class="kv">${kv||`<dt>コード</dt><dd>${code}</dd>`}</dl>
    <div class="divline"></div>
    <div style="font-weight:700;font-size:13px;margin-bottom:10px">最近のアクティビティ</div>
    <ul class="timeline">
      <li><div class="tt">2026/05/28</div><div class="tx">作業完了報告を受領</div></li>
      <li class="eco"><div class="tt">2026/05/20</div><div class="tx">情報を更新</div></li>
      <li><div class="tt">2026/04/01</div><div class="tx">レコードを登録</div></li>
    </ul>`;
  document.getElementById('drawerFoot').innerHTML =
    `<button class="btn primary" onclick="openForm('${esc(title)} の編集','edit')">編集する</button>
     <button class="btn" onclick="closeDrawer()">閉じる</button>`;
  showDrawer();
}
function openDetail(title,sub){
  document.getElementById('drawerTitle').textContent = title;
  document.getElementById('drawerSub').textContent = sub||'';
  document.getElementById('drawerBody').innerHTML = `
    <dl class="kv"><dt>状態</dt><dd><span class="tag t-green">有効</span></dd><dt>担当</dt><dd>梶原 健司</dd><dt>更新日</dt><dd>2026/05/28</dd></dl>
    <div class="divline"></div>
    <div style="font-weight:700;font-size:13px;margin-bottom:10px">最近のアクティビティ</div>
    <ul class="timeline"><li><div class="tt">2026/05/28</div><div class="tx">内容を確認</div></li><li class="eco"><div class="tt">2026/04/01</div><div class="tx">レコードを登録</div></li></ul>`;
  document.getElementById('drawerFoot').innerHTML =
    `<button class="btn primary" onclick="openForm('${esc(title)} の編集','edit')">編集する</button><button class="btn" onclick="closeDrawer()">閉じる</button>`;
  showDrawer();
}
function openForm(title,mode){
  document.getElementById('drawerTitle').textContent = title;
  document.getElementById('drawerSub').textContent = mode==='edit'?'編集モード':'新規作成';
  const billing = /請求|手動登録|売上/.test(title);
  const body = billing ? `
    <div style="display:grid;gap:15px">
      <div class="fld"><label>請求先<span class="req">*</span></label><select><option>みなとフード本部経理</option><option>関西モール 管理本部</option><option>グルメテーブル中部FC</option></select></div>
      <div class="fld"><label>対象作業</label><select><option>グリストラップ清掃</option><option>排水管高圧洗浄</option><option>雑排水槽清掃</option><option>産業廃棄物 収集運搬</option></select></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
        <div class="fld"><label>計上日</label><input type="date" value="2026-05-31"></div>
        <div class="fld"><label>金額（税抜）<span class="req">*</span></label><input placeholder="¥"></div>
      </div>
      <div class="fld"><label>区分</label><select><option>手動</option><option>自動</option></select></div>
      <div class="fld"><label>備考</label><textarea placeholder="手動計上の理由、根拠資料など"></textarea></div>
    </div>` : `
    <div style="display:grid;gap:15px">
      <div class="fld"><label>名称<span class="req">*</span></label><input value="${mode==='edit'?'みなとフード 栄町店':''}" placeholder="入力してください"></div>
      <div class="fld"><label>区分</label><select><option>グリストラップ清掃</option><option>排水管高圧洗浄</option><option>雑排水槽清掃</option><option>産業廃棄物 収集運搬</option></select></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
        <div class="fld"><label>頻度</label><select><option>月次</option><option>季次</option><option>半年</option><option>年次</option></select></div>
        <div class="fld"><label>単価</label><input value="${mode==='edit'?'¥24,000':''}" placeholder="¥"></div>
      </div>
      <div class="fld"><label>担当</label><select><option>梶原</option><option>佐藤</option><option>鈴木</option><option>高橋</option></select></div>
      <div class="fld"><label>備考</label><textarea placeholder="夜間作業の可否、入館手続きなど"></textarea></div>
    </div>`;
  document.getElementById('drawerBody').innerHTML = body;
  document.getElementById('drawerFoot').innerHTML =
    `<button class="btn primary" onclick="toast('${mode==='edit'?'変更を保存しました':'登録しました'}');closeDrawer()">${mode==='edit'?'保存する':'登録する'}</button>
     <button class="btn ghost" onclick="closeDrawer()">キャンセル</button>`;
  showDrawer();
}
function openDoc(title){
  document.getElementById('drawerTitle').textContent = title;
  document.getElementById('drawerSub').textContent = 'ドキュメントプレビュー';
  document.getElementById('drawerBody').innerHTML = `
    <div style="background:#fff;border:1px solid var(--line);border-radius:8px;box-shadow:var(--sh-1);padding:26px 24px;font-size:12px;line-height:1.7">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid var(--brand);padding-bottom:12px;margin-bottom:16px">
        <div><div style="font-weight:700;font-size:15px">${title}</div><div class="subtle" style="font-size:11px">株式会社ダイキョウクリーン</div></div>
        <div style="text-align:right" class="subtle" style="font-size:11px">発行日 2026/06/01<br>登録番号 T1234567890123</div>
      </div>
      <table style="font-size:11.5px"><thead><tr><th>作業</th><th class="num">数量</th><th class="num">単価</th><th class="num">金額</th></tr></thead>
      <tbody>
        <tr><td>グリストラップ清掃</td><td class="num">1</td><td class="num">¥24,000</td><td class="num">¥24,000</td></tr>
        <tr><td>排水管高圧洗浄</td><td class="num">1</td><td class="num">¥58,000</td><td class="num">¥58,000</td></tr>
        <tr><td>雑排水槽清掃</td><td class="num">1</td><td class="num">¥96,000</td><td class="num">¥96,000</td></tr>
      </tbody></table>
      <div style="display:flex;justify-content:flex-end;margin-top:14px"><div style="width:180px">
        <div style="display:flex;justify-content:space-between"><span class="subtle">小計</span><b>¥178,000</b></div>
        <div style="display:flex;justify-content:space-between"><span class="subtle">消費税</span><b>¥17,800</b></div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid var(--line);margin-top:6px;padding-top:6px;font-size:14px"><span>合計</span><b style="color:var(--brand)">¥195,800</b></div>
      </div></div>
    </div>`;
  document.getElementById('drawerFoot').innerHTML =
    `<button class="btn primary" onclick="toast('PDFをダウンロードしました')">${ic('download')}ダウンロード</button>
     <button class="btn" onclick="toast('印刷ダイアログを開きます')">印刷</button>
     <button class="btn ghost" onclick="closeDrawer()">閉じる</button>`;
  showDrawer();
}
function openCalDay(el){
  const dn = el.querySelector('.dn') ? el.querySelector('.dn').textContent : '';
  const evs = [...el.querySelectorAll('.cal-ev')].map(e=>e.textContent.trim());
  document.getElementById('drawerTitle').textContent = `2026年6月${dn}日 の作業`;
  document.getElementById('drawerSub').textContent = `${evs.length}件の予定`;
  document.getElementById('drawerBody').innerHTML = evs.length
    ? `<ul class="timeline">${evs.map((e,i)=>`<li class="${i%2?'eco':''}"><div class="tt">${9+i*2}:00 — ${11+i*2}:00</div><div class="tx">${e}</div></li>`).join('')}</ul>`
    : `<div class="empty">${ic('calendar')}<div class="et">この日に予定はありません</div></div>`;
  document.getElementById('drawerFoot').innerHTML =
    `<button class="btn primary" onclick="openForm('作業を追加','new')">${ic('plus')}作業を追加</button><button class="btn" onclick="closeDrawer()">閉じる</button>`;
  showDrawer();
}
function esc(s){ return String(s).replace(/'/g,"\\'").replace(/"/g,'&quot;'); }
function closeDrawer(){
  document.getElementById('drawerMask').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
}

/* ---- Global action handler: makes every button / link do something ---- */
function doAction(el){
  const go = el.dataset.go;
  if(go){ const [m,t]=go.split(':'); route(m, +t||0); return; }
  const label = (el.innerText||'').replace(/\s+/g,'');
  const row = el.closest('tr.row');
  if(/詳細|表示|確認|照会|変更履歴|履歴/.test(label)){ row?openDrawer(row):openDetail(label); return; }
  if(/編集|修正|更新手続/.test(label)){ openForm((row?rowTitle(row):'レコード')+' の編集','edit'); return; }
  if(/契約化/.test(label)){ route('contract',0); return; }
  if(/再調整/.test(label)){ openForm('作業の再調整','edit'); return; }
  if(/^開始$|完了報告/.test(label)){ route('ops',1); return; }
  if(/新規|登録|追加|作成/.test(label)){ openForm(label.replace(/＋?/,''),'new'); return; }
  if(/PDF/.test(label)){ openDoc(row?rowTitle(row):'ドキュメント'); return; }
  if(/^DL$|ダウンロード|CSV|出力/.test(label)){ toast('ダウンロードを開始しました'); return; }
  if(/送信|メール/.test(label)){ toast('送信しました'); return; }
  if(/生成|同期|取込|一括|今すぐ|最適ルート|ルート生成/.test(label)){ toast('処理を実行しました'); return; }
  if(/絞り込み|^検索$/.test(label)){ toast('絞り込みを適用しました'); return; }
  if(/再発行/.test(label)){ openDoc('請求書 再発行プレビュー'); return; }
  if(/ファイル|選択|アップロード/.test(label)){ toast('ファイルを選択してください'); return; }
  if(/タグ/.test(label)){ toast('タグを追加しました'); return; }
  if(!label){ openForm('新規作成','new'); return; }
  toast(label+' を実行しました');
}

/* ============================================================
   顧客登録：Google Maps 住所自動取得 + 複数店舗
   ============================================================ */
const ZIP_DB = {
  '530-0001':{addr:'大阪府大阪市北区梅田1丁目', geo:'34.7025, 135.4959'},
  '542-0076':{addr:'大阪府大阪市中央区難波3丁目', geo:'34.6660, 135.5010'},
  '650-0021':{addr:'兵庫県神戸市中央区三宮町1丁目', geo:'34.6913, 135.1955'},
  '600-8216':{addr:'京都府京都市下京区東塩小路町', geo:'34.9858, 135.7588'},
};
function zipReady(v){ /* placeholder for live validation */ }
// ジオコーディング結果キャッシュ（同一住所の API 呼出を抑制）
// DB永続化デモ：localStorage に保存し、初期化時に読み込む
var GEO_CACHE={};
const GEO_CAP = 10000;               // 月間API上限（プロト値）
const GEO_WARN_RATIO = 0.8;          // 80%到達で警告
try{ GEO_CACHE = JSON.parse(localStorage.getItem('dk_geo_cache'))||{}; }catch(e){ GEO_CACHE={}; }
function geoSaveCache(){ try{ localStorage.setItem('dk_geo_cache', JSON.stringify(GEO_CACHE)); }catch(e){} }
function geoToday(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function geoMonth(){ return geoToday().slice(0,7); }
// 呼出カウンタ（日付別の実呼出 calls / キャッシュヒット hits を保持）
function geoStats(){
  let s; try{ s=JSON.parse(localStorage.getItem('dk_geo_calls')); }catch(e){}
  if(!s||typeof s!=='object') s={calls:{},hits:{}};
  s.calls=s.calls||{}; s.hits=s.hits||{};
  return s;
}
function geoSaveStats(s){ try{ localStorage.setItem('dk_geo_calls', JSON.stringify(s)); }catch(e){} }
// 当月の実呼出件数を集計
function geoMonthCalls(s){ const mo=geoMonth(); let n=0; for(const d in s.calls){ if(d.indexOf(mo)===0) n+=s.calls[d]; } return n; }
// 当日の実呼出件数
function geoTodayCalls(s){ return s.calls[geoToday()]||0; }
// 累計ヒット数（全期間）
function geoTotalHits(s){ let n=0; for(const d in s.hits) n+=s.hits[d]; return n; }
function geoTotalCalls(s){ let n=0; for(const d in s.calls) n+=s.calls[d]; return n; }
function mapsLookup(){
  const zip=(document.getElementById('custZip').value||'').trim();
  let hit, cached=false;
  const s=geoStats(); const day=geoToday();
  if(GEO_CACHE[zip]){
    hit = GEO_CACHE[zip]; cached=true;
    s.hits[day]=(s.hits[day]||0)+1;          // キャッシュヒット（API呼出なし）
  }else{
    hit = ZIP_DB[zip] || {addr:'大阪府大阪市中央区栄町2-1-'+(Math.floor(Math.random()*40)+1), geo:(34.6+Math.random()*0.2).toFixed(4)+', '+(135.4+Math.random()*0.2).toFixed(4)};
    if(zip){ GEO_CACHE[zip]=hit; geoSaveCache(); }
    s.calls[day]=(s.calls[day]||0)+1;        // 実API呼出（キャッシュミス時のみ加算）
  }
  geoSaveStats(s);
  document.getElementById('custAddr').value = hit.addr;
  document.getElementById('custGeo').value = hit.geo;
  const m=document.getElementById('mapPrev');
  m.classList.add('loaded');
  m.innerHTML = `<div class="map-grid"></div><div class="map-pin">${ic('pin')}</div><div class="map-cap">${hit.addr}<br><span>${hit.geo}</span></div>`;
  toast(cached ? 'キャッシュから取得（API呼出なし）' : 'Google Maps から取得しました');
  // 月間上限の80%到達アラート
  const mc=geoMonthCalls(s);
  if(!cached && mc >= GEO_CAP*GEO_WARN_RATIO){
    toast('⚠ Google Maps API 呼出が月間上限の80%に到達（'+mc.toLocaleString('ja-JP')+'/'+GEO_CAP.toLocaleString('ja-JP')+'件）');
  }
}
function addStoreRow(){
  const wrap=document.getElementById('newStores');
  const div=document.createElement('div');
  div.innerHTML = newStoreRow('','','月次');
  wrap.appendChild(div.firstElementChild);
  recountStores();
}
function recountStores(){
  const n=document.querySelectorAll('#newStores .store-row').length;
  const el=document.getElementById('storeCnt'); if(el) el.textContent=n;
}

/* ============================================================
   店舗CSV 一括インポート（プレビュー・検証）
   ============================================================ */
const CSV_STEPS=['アップロード','プレビュー','検証','確定'];
var CSV_STEP=0;                                  // 現在ステップ（0始まり）
var CSV_LARGE=3284;                              // 大量取込シミュレーション件数
function csvStepper(cur){
  return `<div class="flow" style="margin:2px 0 16px">`+CSV_STEPS.map((s,i)=>
    `<span class="step ${i<cur?'done':(i===cur?'cur':'')}"><span class="sn">${i<cur?ic('check'):(i+1)}</span>${['①','②','③','④'][i]}${s}</span>`+
    (i<CSV_STEPS.length-1?'<span class="ar"></span>':'')).join('')+`</div>`;
}
function openCsvImport(){
  CSV_STEP=0;
  document.getElementById('drawerTitle').textContent='店舗CSV 一括インポート';
  document.getElementById('drawerSub').textContent='4ステップ（アップロード→プレビュー→検証→確定）';
  csvRender();
  showDrawer();
}
// ステップに応じて drawer 本体／フッタを描画
function csvRender(){
  const body=document.getElementById('drawerBody'), foot=document.getElementById('drawerFoot');
  let h=csvStepper(CSV_STEP);
  if(CSV_STEP===0){            // ① アップロード
    h+=`<div style="display:flex;gap:8px;margin-bottom:10px">
      <button class="btn" onclick="toast('テンプレートCSV（店舗マスタ.csv）をダウンロードしました')">${ic('download')}テンプレートDL</button>
      <select class="search" id="csvEnc" style="flex:1"><option>文字コード：自動判定</option><option>UTF-8</option><option>Shift-JIS</option></select>
    </div>
    <div class="csv-drop" onclick="csvLoad()">${ic('upload')}<div><b>CSVファイルをドロップ</b><br><span class="subtle" style="font-size:11.5px">または クリックして選択（店舗マスタ.csv）</span></div></div>
    <div class="hint" style="margin:12px 0">${ic('info')}<span>列：店舗コード / 店舗名 / 郵便番号 / 住所 / 顧客 / 作業頻度。<b>店舗コード</b>で既存と重複判定。住所は Google Maps で自動補完。</span></div>`;
    foot.innerHTML=`<button class="btn primary" style="opacity:.45;pointer-events:none">次へ：プレビュー</button><button class="btn" onclick="csvLoad()">サンプルを読込</button><button class="btn ghost" onclick="closeDrawer()">閉じる</button>`;
  }else if(CSV_STEP===1){      // ② プレビュー（生データ表示）
    h+=`<div class="hint" style="margin:0 0 10px">${ic('check')}<span><b>店舗マスタ.csv</b> を読み込みました（全 ${CSV_ROWS.length} 行 / 文字コード：UTF-8 自動判定）。内容を確認してください。</span></div>`+
      `<div class="tbl-wrap" style="margin:0"><div class="scroll"><table><thead><tr><th>店舗コード</th><th>店舗名</th><th>郵便番号</th><th>エリア</th></tr></thead><tbody>
      ${CSV_ROWS.map(r=>`<tr class="row"><td class="mono">${r.code||'—'}</td><td><b>${r.name}</b></td><td class="mono">${r.zip||'—'}</td><td class="subtle">${r.area||'—'}</td></tr>`).join('')}
      </tbody></table></div></div>`;
    foot.innerHTML=`<button class="btn primary" onclick="csvGoto(2)">次へ：検証</button><button class="btn" onclick="csvGoto(0)">戻る</button><button class="btn ghost" onclick="closeDrawer()">閉じる</button>`;
  }else if(CSV_STEP===2){      // ③ 検証（タグ＋重複の 更新/スキップ 選択）
    const imp=CSV_ROWS.filter(r=>r.status!=='error').length;
    const warn=CSV_ROWS.filter(r=>r.status==='warn').length;
    const err=CSV_ROWS.filter(r=>r.status==='error').length;
    const dup=CSV_ROWS.filter(r=>r.dup).length;
    const tagFor=r=> r.status==='ok' ? '<span class="tag t-green">OK</span>'
        : (r.issues||[]).map(m=>`<span class="tag ${r.status==='error'?'t-red':'t-amber'}">${m}</span>`).join(' ');
    // 重複行の一括操作
    const dupCtl = dup?`<div style="display:flex;align-items:center;gap:8px;margin:0 0 10px;flex-wrap:wrap">
      <span class="subtle" style="font-size:12px;font-weight:600">重複 ${dup}件の既定動作：</span>
      <select class="search" id="csvDupAll" onchange="csvDupAll(this.value)"><option value="update">更新（上書き）</option><option value="skip">スキップ</option></select></div>`:'';
    h+=`<div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
      <span class="tag t-green nodot">取込可 ${imp}件</span>${warn?`<span class="tag t-amber nodot">警告 ${warn}件</span>`:''}${err?`<span class="tag t-red nodot">エラー ${err}件</span>`:''}${dup?`<span class="tag t-blue nodot">重複 ${dup}件</span>`:''}
    </div>`+dupCtl+
    `<div class="tbl-wrap" style="margin:0"><div class="scroll"><table><thead><tr><th>店舗コード</th><th>店舗名</th><th>検証</th><th>重複時</th></tr></thead><tbody>
    ${CSV_ROWS.map((r,i)=>`<tr class="row"><td class="mono">${r.code||'—'}</td><td><b>${r.name}</b><div class="subtle" style="font-size:11px">${r.area||'—'}</div></td><td>${tagFor(r)}</td><td>${r.dup?`<select class="search" data-dup="${i}" onchange="csvDupRow(${i},this.value)" style="min-width:96px"><option value="update"${r.act!=='skip'?' selected':''}>更新</option><option value="skip"${r.act==='skip'?' selected':''}>スキップ</option></select>`:'<span class="subtle">—</span>'}</td></tr>`).join('')}
    </tbody></table></div></div>
    <div class="hint" style="margin:10px 0 0">${ic('info')}<span>エラー行はスキップ。重複行（店舗コード既存）は<b>更新／スキップ</b>を選択できます。エラー行のみ修正して再アップロード可能です。</span></div>`;
    foot.innerHTML=`<button class="btn primary" onclick="csvGoto(3)">次へ：確定（${imp}件）</button><button class="btn" onclick="csvGoto(1)">戻る</button><button class="btn ghost" onclick="closeDrawer()">閉じる</button>`;
  }else{                       // ④ 確定（バッチ進捗デモ）
    const skip=CSV_ROWS.filter(r=>r.dup&&r.act==='skip').length;
    const upd=CSV_ROWS.filter(r=>r.dup&&r.act!=='skip').length;
    const err=CSV_ROWS.filter(r=>r.status==='error').length;
    const total=CSV_LARGE;     // 大量件数を想定
    h+=`<div class="hint" style="margin:0 0 12px">${ic('info')}<span>サンプル ${CSV_ROWS.length} 行に加え、本番想定の <b>${total.toLocaleString('ja-JP')}件</b> をバッチ処理します（新規追加・重複更新${skip?'、スキップ'+skip+'件':''}）。</span></div>
      <div style="font-size:12.5px;font-weight:600;margin-bottom:6px" id="csvPgLbl">処理待ち…</div>
      <div class="bar" style="margin-bottom:14px"><i id="csvPgBar" style="width:0%"></i></div>
      <dl class="kv"><dt>新規追加</dt><dd id="csvKvNew">—</dd><dt>重複更新</dt><dd>${upd}件（＋一括）</dd><dt>スキップ</dt><dd>${skip}件</dd><dt>エラー</dt><dd>${err}件</dd></dl>`;
    foot.innerHTML=`<button class="btn primary" id="csvRunBtn" onclick="csvRunBatch(${total})">取込を実行</button><button class="btn" onclick="csvGoto(2)">戻る</button><button class="btn ghost" onclick="closeDrawer()">閉じる</button>`;
  }
  body.innerHTML=h;
}
function csvGoto(step){ CSV_STEP=step; csvRender(); }
const CSV_ROWS = [
  {name:'みなとフード 心斎橋店', code:'S-104021', zip:'542-0085', area:'大阪市中央区', status:'ok'},
  {name:'みなとフード 天王寺店', code:'S-104022', zip:'543-0055', area:'大阪市天王寺区', status:'ok'},
  {name:'みなとフード 京都四条店', code:'S-104023', zip:'600-8008', area:'京都市下京区', status:'ok'},
  {name:'みなとフード 三宮店', code:'S-104024', zip:'', area:'', status:'error', issues:['必須NG：郵便番号が未入力']},
  {name:'みなとフード 西宮店', code:'S-104018', zip:'662-0911', area:'西宮市', status:'warn', dup:true, act:'update', issues:['重複：店舗コード既存']},
  {name:'みなとフード 栄町店', code:'S-204411', zip:'541-0052', area:'大阪市中央区', status:'warn', dup:true, act:'update', issues:['重複：店舗コード既存']},
  {name:'南港フード 梅田店', code:'S-104025', zip:'530-0001', area:'大阪市北区', status:'warn', issues:['文字コード警告：Shift-JIS の可能性（要確認）']},
];
// 重複行の動作切替（一括／個別）
function csvDupAll(v){ CSV_ROWS.forEach(r=>{ if(r.dup) r.act=v; }); csvRender(); document.getElementById('csvDupAll').value=v; }
function csvDupRow(i,v){ if(CSV_ROWS[i]) CSV_ROWS[i].act=v; }
function csvLoad(){
  CSV_STEP=1; csvRender();
  toast('CSVを読み込みました（全 '+CSV_ROWS.length+' 行）');
}
// バッチ進捗デモ：数千件を段階的に処理するアニメーション
var _csvTimer=null;
function csvRunBatch(total){
  const btn=document.getElementById('csvRunBtn'); if(btn){ btn.style.opacity='.45'; btn.style.pointerEvents='none'; }
  const bar=document.getElementById('csvPgBar'), lbl=document.getElementById('csvPgLbl'), kvNew=document.getElementById('csvKvNew');
  const skip=CSV_ROWS.filter(r=>r.dup&&r.act==='skip').length;
  const err=CSV_ROWS.filter(r=>r.status==='error').length;
  let done=0; const tick=Math.max(1,Math.round(total/28));
  clearInterval(_csvTimer);
  _csvTimer=setInterval(()=>{
    done=Math.min(total, done+tick+Math.floor(Math.random()*tick));
    const pct=Math.round(done/total*100);
    if(bar) bar.style.width=pct+'%';
    if(lbl) lbl.textContent=total.toLocaleString('ja-JP')+'件中 '+done.toLocaleString('ja-JP')+'件 処理…（'+pct+'%）';
    if(kvNew) kvNew.textContent=Math.max(0,done-skip).toLocaleString('ja-JP')+'件';
    if(done>=total){
      clearInterval(_csvTimer);
      if(lbl) lbl.textContent='完了：'+total.toLocaleString('ja-JP')+'件を処理しました';
      setTimeout(()=>{ closeDrawer(); toast('店舗 '+total.toLocaleString('ja-JP')+'件を取込しました'+(skip?'（重複'+skip+'件はスキップ）':'')+(err?' / エラー'+err+'件除外':'')); }, 500);
    }
  }, 70);
}

/* ============================================================
   請求先：宛先設定（各店舗宛／本社宛／代表店舗宛）+ 締日
   ============================================================ */
const BILLTO_STORES = ['みなとフード 栄町店','みなとフード 梅田北口店','グルメテーブル 三宮店','関西モール 春日井'];
// 宛先設定の変更履歴（請求先コード別・モック）。適用開始月から有効、既発行は不追溯。
const BILLTO_HISTORY = {
  'B-5001':[
    {eff:'2026/04', chg:'宛先：各店舗宛 → <b>本社宛</b>', by:'佐藤'},
    {eff:'2025/04', chg:'締日：20日 → 末日', by:'梶原'},
  ],
  'B-5002':[
    {eff:'2026/01', chg:'宛先：本社宛 → <b>各店舗宛</b>', by:'鈴木'},
  ],
  'B-5010':[
    {eff:'2026/05', chg:'代表店舗：三宮店 → <b>梅田北口店</b>', by:'梶原'},
    {eff:'2025/10', chg:'宛先：本社宛 → <b>代表店舗宛</b>（代表：三宮店）', by:'梶原'},
  ],
  'B-5021':[
    {eff:'2025/07', chg:'宛先：各店舗宛 → <b>本社宛</b>', by:'高橋'},
  ],
};
function billtoHistoryHtml(code){
  const rows=(BILLTO_HISTORY[code]||[]).map(h=>[h.eff, h.chg, h.by]);
  if(!rows.length) return note('この請求先の変更履歴はまだありません。');
  return tbl([{t:'適用日'},{t:'変更内容'},{t:'変更者'}],rows);
}
/* 管理会社の詳細：所属店舗一覧を表示 */
const MGMT_DETAIL = {
  'M-301': { name:'関西施設サービス', area:'近畿7府県', period:'2024/04〜2027/03', count:1240, stores:[
    {code:'S-204411', name:'みなとフード 栄町店',     area:'大阪市中央区',   status:'営業中',   sc:'t-green'},
    {code:'S-204410', name:'みなとフード 梅田北口店', area:'大阪市北区',     status:'営業中',   sc:'t-green'},
    {code:'S-204388', name:'グルメテーブル 三宮店',   area:'神戸市中央区',   status:'開店準備中', sc:'t-amber'},
    {code:'S-204202', name:'関西モール 梅田',         area:'大阪市北区',     status:'営業中',   sc:'t-green'},
    {code:'S-204150', name:'中央総合病院 本院',       area:'大阪市天王寺区', status:'営業中',   sc:'t-green'},
    {code:'S-204051', name:'みなとフード 難波店',     area:'大阪市浪速区',   status:'営業中',   sc:'t-green'},
  ]},
  'M-302': { name:'東日本ビル管理', area:'関東全域', period:'2023/10〜2026/09', count:980, stores:[
    {code:'S-118803', name:'みなとフード 新宿南口店', area:'東京都新宿区',   status:'営業中',    sc:'t-green'},
    {code:'S-118770', name:'グルメテーブル 品川店',   area:'東京都港区',     status:'営業中',    sc:'t-green'},
    {code:'S-118702', name:'関東モール 大宮',         area:'さいたま市',     status:'営業中',    sc:'t-green'},
    {code:'S-118655', name:'みなとフード 千葉中央店', area:'千葉市中央区',   status:'移管手続中', sc:'t-amber'},
    {code:'S-118590', name:'中央総合病院 横浜分院',   area:'横浜市西区',     status:'営業中',    sc:'t-green'},
  ]},
  'M-303': { name:'京浜メンテナンス', area:'神奈川・東京', period:'2025/01〜', count:620, stores:[
    {code:'S-205512', name:'みなとフード 川崎駅前店',   area:'川崎市川崎区', status:'営業中', sc:'t-green'},
    {code:'S-205480', name:'グルメテーブル 横浜西口店', area:'横浜市西区',   status:'営業中', sc:'t-green'},
    {code:'S-205433', name:'関東モール 蒲田',           area:'東京都大田区', status:'営業中', sc:'t-green'},
    {code:'S-205390', name:'みなとフード 武蔵小杉店',   area:'川崎市中原区', status:'閉店',   sc:'t-red'},
  ]},
};
function openMgmtDetail(code){
  const m=MGMT_DETAIL[code]; if(!m) return;
  document.getElementById('drawerTitle').textContent=m.name;
  document.getElementById('drawerSub').textContent=code+' · '+m.area;
  document.getElementById('drawerBody').innerHTML = `
    <dl class="kv">
      <dt>管理区域</dt><dd>${m.area}</dd>
      <dt>管理店舗</dt><dd>${m.count.toLocaleString()} 店舗</dd>
      <dt>有効期間</dt><dd>${m.period}</dd>
    </dl>
    <div class="divline"></div>
    <div style="font-weight:700;font-size:13px;margin:2px 0 9px">${ic('store')} 所属店舗 <span class="subtle" style="font-weight:500;font-size:11.5px">${m.count.toLocaleString()}件中 ${m.stores.length}件を表示</span></div>
    <div class="tbl-wrap" style="margin:0"><div class="scroll"><table><thead><tr><th>店舗コード</th><th>店舗名</th><th>エリア</th><th>状態</th></tr></thead><tbody>
      ${m.stores.map(s=>`<tr class="row"><td class="mono">${s.code}</td><td><b>${s.name}</b></td><td>${s.area}</td><td><span class="tag ${s.sc}">${s.status}</span></td></tr>`).join('')}
    </tbody></table></div></div>
    <div style="text-align:center;margin-top:11px"><span class="lnk" onclick="closeDrawer();route('cust',5)">店舗一覧で全 ${m.count.toLocaleString()} 店舗を見る →</span></div>`;
  document.getElementById('drawerFoot').innerHTML=`<button class="btn" onclick="closeDrawer();route('cust',5)">店舗一覧へ</button><button class="btn ghost" onclick="closeDrawer()">閉じる</button>`;
  showDrawer();
}
function openBillToForm(code){
  document.getElementById('drawerTitle').textContent='請求宛先の設定';
  document.getElementById('drawerSub').textContent=code+' · 宛先パターン／締日';
  document.getElementById('drawerBody').innerHTML = `
    <div style="display:grid;gap:15px">
      <div class="fld"><label>宛先パターン<span class="req">*</span></label>${sel2(['各店舗宛','本社宛','代表店舗宛'])}</div>
      <div class="fld"><label>代表店舗 <span class="subtle" style="font-weight:500">（代表店舗宛の場合）</span></label>${sel2(BILLTO_STORES)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
        <div class="fld"><label>締日</label>${sel2(['末日','20日','15日','10日','25日'])}</div>
        <div class="fld"><label>適用開始月</label><input type="month" value="2026-07"></div>
      </div>
      ${note('変更は<b>適用開始月</b>以降の締め分から適用されます。<b>発行済みの請求書は変更されません（不追溯）</b>。必要な場合のみ再発行してください。','warn','warn')}
    </div>
    <div class="divline"></div>
    <div style="font-weight:700;font-size:13px;margin:2px 0 8px">${ic('clock')} 変更履歴 <span class="subtle" style="font-weight:500;font-size:11.5px">適用日／変更内容／変更者</span></div>
    ${billtoHistoryHtml(code)}`;
  document.getElementById('drawerFoot').innerHTML =
    `<button class="btn primary" onclick="toast('宛先設定を保存しました（${esc(code)}・適用開始月から反映／既発行は不追溯）');closeDrawer()">設定を保存</button>
     <button class="btn ghost" onclick="closeDrawer()">キャンセル</button>`;
  showDrawer();
}

/* ============================================================
   入金管理：消込・入金登録（残額算出）
   ============================================================ */
// 入金の請求額・充当は openAllocationForm / PAY_OPEN に集約（旧 PAYMENTS は廃止）
const yen = n => '¥'+Number(n).toLocaleString('ja-JP');
// 本社ごとの 1入金額 と 未消込（OPEN）請求書一覧。1入金→複数請求の充当（多対多）デモ用。
const PAY_OPEN = {
  'みなとフードHD':       {pay:2728000, invs:[{no:'INV-202605-0011',mon:'2026/05',amt:2543000},{no:'INV-202605-0021',mon:'2026/05',amt:185000}]},
  '関西モール管理':       {pay:800000,  invs:[{no:'INV-202605-0012',mon:'2026/05',amt:620000},{no:'INV-202604-0008',mon:'2026/04',amt:498000},{no:'INV-202603-0005',mon:'2026/03',amt:180000}]},
  '中央総合病院グループ': {pay:185000,  invs:[{no:'INV-202605-0021',mon:'2026/05',amt:185000},{no:'INV-202604-0017',mon:'2026/04',amt:96000}]},
  'グルメテーブル中部FC': {pay:1100000, invs:[{no:'INV-202604-0009',mon:'2026/04',amt:1078000}]},
};
var ALLOC_CTX=null;   // {name, pay, invs:[{no,mon,amt}]}
function openPaymentForm(name){ openAllocationForm(name); }
// 入金充当フォーム：1件の入金を複数請求書へ配分（充当合計／残額／差額をライブ表示）
// opt.register=true：未入金（入金待ち）行からの新規入金登録。入金額¥0・充当なしの空状態で開始。
function openAllocationForm(name,opt={}){
  const reg = !!opt.register;
  const o = PAY_OPEN[name] || {pay:0, invs:[]};
  const pay = reg ? 0 : o.pay;                 // 登録モードは入金額を空（¥0）から
  ALLOC_CTX = {name, pay, invs:o.invs, register:reg};
  document.getElementById('drawerTitle').textContent = reg ? '入金登録' : '入金充当（消込）';
  document.getElementById('drawerSub').textContent = name + (reg ? ' · 新規入金を登録' : ' · 1入金 → 複数請求へ配分');
  // 既定：消込は古い請求書から自動充当／登録モードは充当なし（空）で開始
  let remain=pay; const init=o.invs.map(v=>{ if(reg) return 0; const a=Math.min(remain, v.amt); remain-=a; return a; });
  const rowsHtml=o.invs.map((v,i)=>`
    <tr class="row">
      <td><input type="checkbox" id="alChk${i}" ${init[i]>0?'checked':''} onchange="allocRecalc()"></td>
      <td><b>${v.no}</b><div class="subtle" style="font-size:11px">${v.mon}</div></td>
      <td class="num">${yen(v.amt)}</td>
      <td class="num"><input id="alAmt${i}" class="search" style="width:120px;text-align:right" value="${init[i]}" oninput="allocRecalc()"></td>
    </tr>`).join('');
  const payCell = reg
    ? `<input id="alPay" class="search" style="width:140px;text-align:right" placeholder="¥0" value="" oninput="allocSetPay(this.value)">`
    : `<b>${yen(pay)}</b>`;
  document.getElementById('drawerBody').innerHTML = `
    ${reg?note('未入金（入金待ち）の請求です。実際の入金額を入力し、対象請求へ充当してください。','warn','warn'):''}
    <dl class="kv"><dt>入金額</dt><dd>${payCell}</dd><dt>入金日</dt><dd>2026/06/22</dd><dt>未消込 請求</dt><dd>${o.invs.length}件</dd></dl>
    <div class="divline"></div>
    <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
      <button class="btn" onclick="allocAuto()">${ic('refresh')}${reg?'入金額を古い順に充当':'古い順に自動充当'}</button>
      <button class="btn" onclick="allocClear()">クリア</button>
    </div>
    <div class="tbl-wrap" style="margin:0"><div class="scroll"><table><thead><tr><th></th><th>請求書（未消込）</th><th class="num">請求額</th><th class="num">充当額</th></tr></thead>
      <tbody>${rowsHtml}</tbody></table></div></div>
    <div class="hint" style="margin:10px 0">${ic('info')}<span>各請求書に配分する金額を入力。<b>充当合計</b>が入金額を超えないよう調整します。1入金を複数請求に分けて充当できます（多対多）。</span></div>
    <dl class="kv" style="grid-template-columns:120px 1fr">
      <dt>充当合計</dt><dd id="alSum" style="font-weight:700">—</dd>
      <dt>残額（未充当）</dt><dd id="alRemain">—</dd>
      <dt>差額（過不足）</dt><dd id="alDiff">—</dd>
    </dl>`;
  document.getElementById('drawerFoot').innerHTML =
    `<button class="btn primary" id="alSaveBtn" onclick="allocSave()">${reg?'入金を登録':'充当を確定'}</button>
     <button class="btn ghost" onclick="closeDrawer()">キャンセル</button>`;
  showDrawer();
  allocRecalc();
}
// 登録モード：入金額の手入力を ALLOC_CTX に反映し、充当合計／残額を再計算
function allocSetPay(v){
  if(!ALLOC_CTX) return;
  ALLOC_CTX.pay = parseInt(String(v).replace(/[¥,]/g,''),10)||0;
  allocRecalc();
}
function _alVal(i){ const el=document.getElementById('alAmt'+i); return el?(parseInt(String(el.value).replace(/[¥,]/g,''),10)||0):0; }
function allocRecalc(){
  if(!ALLOC_CTX) return;
  let sum=0, alloc=0;
  ALLOC_CTX.invs.forEach((v,i)=>{
    const chk=document.getElementById('alChk'+i);
    const amt=_alVal(i);
    sum+=amt; if(chk&&chk.checked) alloc++;
  });
  const pay=ALLOC_CTX.pay;
  const remain=pay-sum;          // 入金のうち未充当
  const sumEl=document.getElementById('alSum'), reEl=document.getElementById('alRemain'), dfEl=document.getElementById('alDiff'), btn=document.getElementById('alSaveBtn');
  if(sumEl) sumEl.textContent=yen(sum)+`（${alloc}件）`;
  if(reEl){ reEl.innerHTML = remain>0?`<span class="num">${yen(remain)}</span>`:(remain<0?`<span class="num" style="color:var(--red)">超過 ${yen(-remain)}</span>`:'<span class="num">¥0（全額充当）</span>'); }
  // 差額（過不足）：入金 − 充当。残債が残れば「残額」、過入金なら「+」
  if(dfEl){
    dfEl.innerHTML = remain===0?'<span class="num">¥0</span>'
      : (remain>0?`<span class="num" style="color:var(--red)">残額 ▲${yen(remain)}</span>`
                 :`<span class="num" style="color:var(--red)">過入金 +${yen(-remain)}</span>`);
  }
  if(btn){ const over=sum>pay; btn.style.opacity=over?'.45':'1'; btn.style.pointerEvents=over?'none':'auto'; }
}
function allocAuto(){
  if(!ALLOC_CTX) return; let remain=ALLOC_CTX.pay;
  ALLOC_CTX.invs.forEach((v,i)=>{ const a=Math.min(remain,v.amt); remain-=a;
    const el=document.getElementById('alAmt'+i); if(el) el.value=a;
    const chk=document.getElementById('alChk'+i); if(chk) chk.checked=a>0;
  });
  allocRecalc();
}
function allocClear(){
  if(!ALLOC_CTX) return;
  ALLOC_CTX.invs.forEach((v,i)=>{ const el=document.getElementById('alAmt'+i); if(el) el.value=0; const chk=document.getElementById('alChk'+i); if(chk) chk.checked=false; });
  allocRecalc();
}
function allocSave(){
  if(!ALLOC_CTX) return;
  let sum=0, cnt=0;
  ALLOC_CTX.invs.forEach((v,i)=>{ const a=_alVal(i); if(a>0){ sum+=a; cnt++; } });
  const remain=ALLOC_CTX.pay-sum;
  const diffTxt = remain===0?'差額なし（全額充当）':(remain>0?'残額 ▲'+yen(remain):'過入金 +'+yen(-remain));
  closeDrawer();
  toast('入金 '+yen(ALLOC_CTX.pay)+' を '+cnt+'件の請求に充当しました（'+diffTxt+'）');
}
/* 旧 payRest（単一入金の残額計算）は openAllocationForm（充当UI）に統合済みのため廃止 */

/* ============================================================
   取引履歴：種別フィルタ + キーワード検索
   ============================================================ */
let txnState={q:'',kind:'すべて',period:'すべて',amt:'すべて',by:'すべて'};
// 「期間：今月」のように接頭辞付きの値から実値だけを取り出す
function txnVal(v){ return String(v||'').split('：').pop(); }
// h.date（YYYY/MM/DD）を期間バンドで判定。基準日は本日（プロト）2026/06/22。
function txnInPeriod(date,band){
  if(band==='すべて') return true;
  const m=/(\d{4})\/(\d{2})\/(\d{2})/.exec(date); if(!m) return false;
  const y=+m[1], mo=+m[2];
  if(band==='今月')  return y===2026 && mo===6;
  if(band==='先月')  return y===2026 && mo===5;
  if(band==='今年度') return (y===2026 && mo>=4) || (y===2027 && mo<=3); // 4月〜翌3月
  return true;
}
// 金額文字列（¥2,728,000 / ¥2,480,000/月 / —）を数値化。取れなければ null。
function txnAmtNum(amt){
  const s=String(amt||'').replace(/[¥,]/g,'').replace(/\/月$/,'').trim();
  if(!s || s==='—') return null;
  const n=parseInt(s,10); return isNaN(n)?null:n;
}
function txnInAmt(amt,band){
  if(band==='すべて') return true;
  const n=txnAmtNum(amt); if(n===null) return false;
  if(band==='〜10万')   return n<100000;
  if(band==='10〜100万') return n>=100000 && n<1000000;
  if(band==='100万〜')   return n>=1000000;
  return true;
}
function applyTxn(){
  const q=txnState.q.trim().toLowerCase(), k=txnState.kind;
  const period=txnState.period, amtB=txnState.amt, by=txnState.by;
  const rows = TXN_HISTORY.filter(h=>
      (k==='すべて'||h.kind===k) &&
      (by==='すべて'||h.by===by) &&
      txnInPeriod(h.date,period) &&
      txnInAmt(h.amt,amtB) &&
      (!q || (h.cust+h.title+h.by+h.kind).toLowerCase().includes(q)))
    .map(h=>[h.date, tag(h.cls,h.kind), `<b>${h.cust}</b>`, h.title, h.by, `<span class="num">${h.amt}</span>`]);
  document.getElementById('txnWrap').innerHTML = rows.length
    ? tbl([{t:'日付'},{t:'種別'},{t:'顧客'},{t:'内容'},{t:'担当'},{t:'金額',num:true}],rows,{click:true})
    : `<div class="empty">${ic('search')}<div class="et">該当する取引履歴がありません</div></div>`;
}
function filterTxn(v){ txnState.q=v; applyTxn(); }
function txnFilter(field,val){ txnState[field]=txnVal(val); applyTxn(); }
function txnKind(k,el){ txnState.kind=k; el.parentNode.querySelectorAll('.seg').forEach(s=>s.classList.remove('active')); el.classList.add('active'); applyTxn(); }

/* ============================================================
   全域検索（顧客・請求 ライブ）
   ============================================================ */
function runGlobalSearch(v){ document.getElementById('gsResults').innerHTML = globalSearchResults(v); }
function quickSearch(v){ const i=document.getElementById('gsInput'); if(i){ i.value=v; runGlobalSearch(v); } }

/* ---- Command palette ---- */
function buildCmdIndex(){
  const idx=[];
  NAV.forEach(n=>{ if(n.type==='item'){
    idx.push({mod:n.id,tab:0,name:n.name,cat:'モジュール',icon:n.icon});
    (TABS[n.id]||[]).forEach((tb,i)=>{ if(i>0) idx.push({mod:n.id,tab:i,name:n.name+' › '+tb,cat:n.name,icon:n.icon}); });
  }});
  return idx;
}
let CMD_INDEX=[], cmdSel=0, cmdFiltered=[];
function openCmd(){
  document.getElementById('cmdMask').classList.add('open');
  const inp=document.getElementById('cmdInput'); inp.value=''; inp.focus();
  filterCmd('');
}
function closeCmd(){ document.getElementById('cmdMask').classList.remove('open'); }
function filterCmd(q){
  q=q.trim().toLowerCase();
  cmdFiltered = q ? CMD_INDEX.filter(x=>x.name.toLowerCase().includes(q)) : CMD_INDEX;
  cmdSel=0; renderCmd();
}
function renderCmd(){
  const list=document.getElementById('cmdList');
  if(!cmdFiltered.length){ list.innerHTML=`<div class="cmd-grp" style="padding:18px 12px;color:var(--faint)">該当なし</div>`; return; }
  let h='', lastCat=null;
  cmdFiltered.forEach((x,i)=>{
    if(x.cat!==lastCat){ h+=`<div class="cgrp">${x.cat}</div>`; lastCat=x.cat; }
    h+=`<div class="crow ${i===cmdSel?'sel':''}" data-i="${i}" onmouseenter="cmdSel=${i};hiCmd()" onclick="goCmd(${i})">
      ${ic(x.icon,'ci2')}<span>${x.name}</span><span class="cm">↵</span></div>`;
  });
  list.innerHTML=h;
}
function hiCmd(){ document.querySelectorAll('#cmdList .crow').forEach((el,i)=>el.classList.toggle('sel',i===cmdSel)); }
function goCmd(i){ const x=cmdFiltered[i]; if(x) route(x.mod,x.tab); }

/* ---- Role panel jump (権限制御) ---- */
function setRolePanel(i){
  const segs = document.querySelectorAll('#page .segmented .seg');
  if(segs[i]) segs[i].click();
}

/* ---- Notifications ---- */
function renderNotifs(){
  document.getElementById('notifList').innerHTML = NOTIFS.map(n=>`
    <div class="ntf" onclick="route('${n.go.split(':')[0]}',${+n.go.split(':')[1]||0})"><div class="nic ${n.ic}">${ic(n.icon)}</div>
    <div><div class="ntx">${n.tx}</div><div class="ntm">${n.tm}</div></div></div>`).join('');
}
function toggleNotif(e){
  e.stopPropagation();
  const dd=document.getElementById('notifDrop');
  const open=dd.classList.contains('open');
  closeDropdowns();
  if(!open) dd.classList.add('open');
}
function closeDropdowns(){ document.querySelectorAll('.dropdown').forEach(d=>d.classList.remove('open')); document.querySelector('.tb-user')?.classList.remove('open'); }

/* ---- User menu (role preview entry) ---- */
function renderUserRoles(){
  const dot = {sales:'#2b6fb3',field:'#0b7c8c',fin:'#2f9e6b',admin:'#d2483f'};
  let h = `<div class="um-role ${!state.preview?'active':''}" onclick="exitToSelf()">
      <span class="ur-dot" style="background:var(--ink-2)"></span>
      <div><div class="ur-n">通常表示（自分）</div><div class="ur-m">梶原 健司 · 管理者</div></div>
      <span class="ur-go">${state.preview?'戻る':''}</span></div>`;
  h += ROLES.map(r=>`
    <div class="um-role ${state.preview===r.key?'active':''}" onclick="previewFromMenu('${r.key}')">
      <span class="ur-dot" style="background:${dot[r.key]}"></span>
      <div><div class="ur-n">${r.name}</div><div class="ur-m">${r.users}名 · ${r.desc.split('。')[0]}</div></div>
      <span class="ur-go">表示</span></div>`).join('');
  document.getElementById('umRoles').innerHTML = h;
}
function toggleUserMenu(e){
  e.stopPropagation();
  const dd=document.getElementById('userMenu');
  const open=dd.classList.contains('open');
  closeDropdowns();
  if(!open){ renderUserRoles(); dd.classList.add('open'); document.querySelector('.tb-user').classList.add('open'); }
}
function previewFromMenu(key){ closeDropdowns(); enterPreview(key); }
function exitToSelf(){ closeDropdowns(); if(state.preview) exitPreview(); }

/* ---- Toast ---- */
function toast(msg){
  const wrap=document.getElementById('toastWrap');
  const t=document.createElement('div');
  t.className='toast';
  t.innerHTML=`<span class="ti"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>${msg}`;
  wrap.appendChild(t);
  setTimeout(()=>{ t.style.transition='.3s'; t.style.opacity='0'; t.style.transform='translateY(8px)'; setTimeout(()=>t.remove(),300); },2400);
}

/* ============================================================
   Charts
   ============================================================ */
const PAL = { brand:'#0b7c8c', brand2:'#5cb6c2', eco:'#2f9e6b', amber:'#c9821a', blue:'#2b6fb3', gray:'#cdd9dc' };
const months=['6月','7月','8月','9月','10月','11月','12月','1月','2月','3月','4月','5月'];

function baseOpts(extra={}){
  return Object.assign({
    responsive:true, maintainAspectRatio:false,
    plugins:{legend:{display:false,labels:{font:{family:'Noto Sans JP',size:11}}}},
    scales:{
      x:{grid:{display:false},ticks:{font:{family:'Noto Sans JP',size:10},color:'#6a818a'}},
      y:{grid:{color:'#eef3f4'},border:{display:false},ticks:{font:{family:'Noto Sans JP',size:10},color:'#6a818a'}}
    }
  }, extra);
}
function mk(id,cfg){ const c=document.getElementById(id); if(!c)return; const ex=Chart.getChart(c); if(ex)ex.destroy(); state.charts.push(new Chart(c,cfg)); }

function lineYoY(id){
  mk(id,{type:'line',data:{labels:months,datasets:[
    {label:'当年度',data:[34,35,37,34,36,38,42,31,33,37,38,38.6],borderColor:PAL.brand,backgroundColor:'rgba(11,124,140,.10)',fill:true,tension:.35,borderWidth:2.5,pointRadius:0,pointHoverRadius:4},
    {label:'前年度',data:[32,33,35,33,34,36,40,30,32,35,36,36.6],borderColor:PAL.gray,borderDash:[5,4],tension:.35,borderWidth:2,pointRadius:0,fill:false},
  ]},options:baseOpts({plugins:{legend:{display:true,position:'top',align:'end',labels:{boxWidth:10,boxHeight:10,usePointStyle:true,font:{family:'Noto Sans JP',size:11}}}},scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#6a818a'}},y:{grid:{color:'#eef3f4'},border:{display:false},ticks:{callback:v=>'¥'+v+'M',font:{size:10},color:'#6a818a'}}}})});
}
function doughnutWork(id){
  mk(id,{type:'doughnut',data:{labels:['グリストラップ清掃','排水管高圧洗浄','雑排水槽清掃','産廃・その他'],datasets:[{data:[52,24,15,9],backgroundColor:[PAL.brand,PAL.brand2,PAL.eco,PAL.amber],borderWidth:0}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'right',labels:{boxWidth:9,boxHeight:9,usePointStyle:true,font:{family:'Noto Sans JP',size:11},padding:10}}}}});
}
function barHCust(id){
  mk(id,{type:'bar',data:{labels:['みなとフード','関西モール','グルメテーブル','中央病院G','大学生協'],datasets:[{data:[3.5,1.8,1.1,0.5,0.4],backgroundColor:PAL.brand,borderRadius:5,barThickness:16}]},
    options:baseOpts({indexAxis:'y',scales:{x:{grid:{color:'#eef3f4'},border:{display:false},ticks:{callback:v=>'¥'+v+'M',font:{size:10},color:'#6a818a'}},y:{grid:{display:false},ticks:{font:{size:11},color:'#3a525b'}}}})});
}
function barArea(id){
  mk(id,{type:'bar',data:{labels:['大阪','兵庫','京都','関東','その他'],datasets:[{data:[18,9.5,6,12,3],backgroundColor:[PAL.brand,PAL.brand2,PAL.eco,PAL.blue,PAL.gray],borderRadius:5,barThickness:30}]},
    options:baseOpts({scales:{y:{grid:{color:'#eef3f4'},border:{display:false},ticks:{callback:v=>'¥'+v+'M',font:{size:10},color:'#6a818a'}}}})});
}
function barSimple(id,labels,data,color){
  mk(id,{type:'bar',data:{labels,datasets:[{data,backgroundColor:color||PAL.brand,borderRadius:5,barThickness:26}]},options:baseOpts()});
}

function initCharts(){
  const m=state.mod, t=state.tab;
  if(m==='dashboard'){ lineYoY('d1'); doughnutWork('d2'); barHCust('d3'); barArea('d4'); }
  if(m==='sales' && t===3) barSimple('sa1', months, [1.9,2.0,2.1,1.8,2.0,2.2,2.4,1.7,1.9,2.1,2.0,2.1], PAL.brand); // 顧客（みなとフードHD）スケール：月商≈¥2M、年商≈¥24.8M
  if(m==='revenue'){ if(t===1){ barSimple('rv1',months,[34,35,37,34,36,38,42,31,33,37,38,38.6]); barSimple('rvy1',['2022','2023','2024','2025','2026'],[362,388,402,412,77],PAL.eco); } if(t===2) barHCust('rv2'); if(t===3) doughnutWork('rv3'); }
  if(m==='bi'){
    if(t===0){ lineYoY('bm1'); doughnutWork('bm2'); barHCust('bm3'); barArea('bm4'); }
    if(t===1){ barSimple('bi1',['2022','2023','2024','2025','2026'],[362,388,402,412,77],PAL.eco); barSimple('bi2',['2023','2024','2025','2026'],[7.2,3.6,2.5,4.8],PAL.amber); }
    if(t===2) barHCust('bi3');
    if(t===3){ barHCust('bi4'); barArea('bi5'); }
    if(t===4) barSimple('bi6',['GT清掃','排水管','雑排水槽','産廃','緊急'],[182,96,61,42,21],PAL.brand);
    if(t===5) barHCust('bi7');
  }
}

/* ============================================================
   Init + global key handling
   ============================================================ */
function init(){
  renderSidebar();
  renderNotifs();
  CMD_INDEX = buildCmdIndex();

  // restore route
  let start={mod:'dashboard',tab:0};
  try{ const s=JSON.parse(localStorage.getItem('dk_route')); if(s&&SCREENS[s.mod]) start=s; }catch(e){}
  route(start.mod, start.tab||0);

  // search inputs open palette
  const top=document.getElementById('topSearch');
  top.addEventListener('focus',openCmd);
  top.addEventListener('click',openCmd);

  const cmdInput=document.getElementById('cmdInput');
  cmdInput.addEventListener('input',e=>filterCmd(e.target.value));

  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); openCmd(); return; }
    if(document.getElementById('cmdMask').classList.contains('open')){
      if(e.key==='Escape') closeCmd();
      else if(e.key==='ArrowDown'){ e.preventDefault(); cmdSel=Math.min(cmdSel+1,cmdFiltered.length-1); hiCmd(); ensureVis(); }
      else if(e.key==='ArrowUp'){ e.preventDefault(); cmdSel=Math.max(cmdSel-1,0); hiCmd(); ensureVis(); }
      else if(e.key==='Enter'){ e.preventDefault(); goCmd(cmdSel); }
    }
    if(e.key==='Escape') closeDrawer();
  });

  document.getElementById('cmdMask').addEventListener('click',e=>{ if(e.target.id==='cmdMask') closeCmd(); });
  document.addEventListener('click',closeDropdowns);
  document.getElementById('notifDrop').addEventListener('click',e=>e.stopPropagation());

  // Global action handler (capture phase) — every button/link/chip/calendar-day acts
  document.addEventListener('click',e=>{
    const cal = e.target.closest('.cal-d');
    if(cal && document.getElementById('page').contains(cal)){ e.stopPropagation(); openCalDay(cal); return; }
    const el = e.target.closest('.btn, .lnk, .chip.add, .ph .sub.link');
    if(!el) return;
    if(el.hasAttribute('onclick')) return;        // respect explicit handlers
    if(!document.getElementById('page').contains(el)) return; // only content area
    e.stopPropagation();                          // prevent row-drawer double fire
    doAction(el);
  }, true);
}
function ensureVis(){
  const el=document.querySelector('#cmdList .crow.sel');
  if(el) el.scrollIntoView({block:'nearest'});
}
if(document.readyState==='loading') window.addEventListener('DOMContentLoaded',init);
else init();
