/* ============================================================
   ダイキョウクリーン アプリ（操作版） — interactive controller
   ============================================================ */
const VP = document.getElementById('vp');
let persona = 'sales';
let stack = ['s_home'];
const rec = { store:'', type:'' };
const report = { after:false, sludge:null, name:MDATA.reportDefault.name, work:MDATA.reportDefault.work, op:'OP-77120' };

function setState(id,st){ const el=document.getElementById(id); if(el) el.dataset.state=st; }
function svg(key){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(MICON[key]||'')+'</svg>'; }

/* ---- bottom tab bars (data-driven from MDATA) ---- */
function tic(n){ return svg(n); }
function renderTabs(){
  document.querySelectorAll('.mtab[data-tabs]').forEach(bar=>{
    const set=bar.dataset.tabs, active=bar.dataset.active;
    bar.innerHTML = MDATA.tabs[set].map(t=>{
      const on = t.id===active;
      const style = on ? ` style="color:${MDATA.tabColor[set]}"` : '';
      return `<div class="t${on?' on':' tap'}"${on?style:''} onclick="${t.act}">${tic(t.ic)}${t.l}</div>`;
    }).join('');
  });
}

/* ---- render list screens from MDATA ---- */
function chev(){ return '<svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>'; }
function esc(s){ return String(s).replace(/'/g,"\\'"); }
function renderLists(){
  // 営業：今日の訪問
  const hv=document.getElementById('homeVisits');
  if(hv) hv.innerHTML = MDATA.todayVisits.map(v=>
    `<div class="mvisit tap"${v.hot?' style="outline:2px solid var(--brand);outline-offset:1px"':''} onclick="openKarte('${esc(v.name)}','${esc(v.sub)}')">
      <div class="mv-time"><div class="h">${v.time}</div><div class="m">${v.kind}</div></div>
      <div class="mv-body"><div class="n">${v.name}</div><div class="a">${v.sub}</div></div>${chev()}</div>`).join('');
  // 営業：予定（週間）
  const sl=document.getElementById('schedList');
  if(sl) sl.innerHTML = MDATA.schedule.map(g=>
    `<div class="mlabel" style="margin-top:6px">${g.day}</div>`+
    g.items.map(v=>`<div class="mvisit tap" onclick="openKarte('${esc(v.name)}','${esc(v.sub)}')">
      <div class="mv-time"><div class="h">${v.time}</div><div class="m">${v.kind}</div></div>
      <div class="mv-body"><div class="n">${v.name}</div><div class="a">${v.sub}</div></div>${chev()}</div>`).join('')).join('');
  // 営業：顧客一覧
  renderCust(custState.q);
  // 営業：記録 STEP1 店舗
  const stl=document.getElementById('storeList');
  if(stl) stl.innerHTML = MDATA.recStores.map(s=>
    `<button class="optbtn tap" onclick="pickStore('${esc(s.name)}')"><span class="oic">${svg('store')}</span>
      <span class="od">${s.name}<div class="osub">${s.sub}</div></span><span class="chev" style="color:var(--faint)">›</span></button>`).join('');
  // 営業：記録 STEP2 種別
  const tl=document.getElementById('typeList');
  if(tl) tl.innerHTML = MDATA.recTypes.map(t=>
    `<button class="optbtn tap" onclick="pickType('${esc(t.label)}')"><span class="oic"${t.danger?' style="background:var(--red-soft);color:var(--red)"':''}>${svg(t.ic)}</span>
      <span class="od">${t.label}</span><span class="chev" style="color:var(--faint)">›</span></button>`).join('');
  // 現場：本日の作業
  const jl=document.getElementById('jobList');
  if(jl) jl.innerHTML = MDATA.jobs.map(j=>
    `<div class="mvisit tap"${j.hot?' style="outline:2px solid var(--eco);outline-offset:1px"':''} onclick="openReport('${esc(j.name)}','${esc(j.work)}')">
      <div class="mv-time"><div class="h"${j.hot?' style="color:var(--eco)"':''}>${j.time}</div><div class="m">${j.kind}</div></div>
      <div class="mv-body"><div class="n">${j.name}</div><div class="a">${j.work}</div></div>
      <span class="mtag ${j.tagCls}">${j.tag}</span></div>`).join('');
  // 現場：報告一覧
  const rl=document.getElementById('reportList');
  if(rl) rl.innerHTML = MDATA.reports.map(r=>
    `<div class="mvisit tap" onclick="openRepDetail('${esc(r.name)}','${esc(r.work)}','${r.sludge}')">
      <div class="mv-time"><div class="h" style="color:var(--eco)">${r.time}</div><div class="m">送信</div></div>
      <div class="mv-body"><div class="n">${r.name}</div><div class="a">${r.work} · 写真${r.photos}枚</div></div>
      <span class="mtag mt-green">確定</span></div>`).join('');
}
function tab(id){ root(id); }

/* ---- navigation stack ---- */
function go(id){
  const cur = stack[stack.length-1];
  if(cur===id) return;
  setState(cur,'behind');
  setState(id,'active');
  stack.push(id);
}
function back(){
  if(stack.length<=1) return;
  const cur = stack.pop();
  const prev = stack[stack.length-1];
  setState(cur,'hidden');
  setState(prev,'active');
}
function root(id){
  // hide everything, then show root
  document.querySelectorAll('.screen').forEach(s=>setState(s.id,'hidden'));
  setState(id,'active');
  stack=[id];
}

/* ---- persona switch ---- */
function setPersona(p){
  persona=p;
  document.getElementById('ppSales').classList.toggle('on',p==='sales');
  document.getElementById('ppField').classList.toggle('on',p==='field');
  document.getElementById('devClock').textContent = p==='sales' ? '9:41' : '22:48';
  if(p==='sales'){ root('s_home'); }
  else { resetReport(); renderNetStatus(); root('f_home'); }
  closeSheet(); closeGen();
}

/* ============ 営業フロー ============ */
function txnMini(h){
  return `<div class="txn-item"><span class="mtag ${h.cls}" style="flex:none">${h.kind}</span>
    <div class="txn-b"><div class="txn-t">${h.title}</div><div class="txn-m">${h.date}${h.amt?' · <b>'+h.amt+'</b>':''}</div></div></div>`;
}
function openKarte(name,sub){
  document.getElementById('karteName').textContent = name;
  document.getElementById('karteSub').textContent = sub;
  rec.store = name;
  const kt=document.getElementById('karteTxn');
  if(kt) kt.innerHTML = MDATA.txnHistory.slice(0,3).map(txnMini).join('');
  go('s_karte');
}

/* ---- 顧客一覧（検索） ---- */
var custState={q:''};
function renderCust(q){
  const cl=document.getElementById('custList');
  if(!cl) return;
  const kw=(q||'').toLowerCase();
  const list=MDATA.customers.filter(c=>((c.name||'')+(c.meta||'')).toLowerCase().includes(kw));
  cl.innerHTML = list.length ? list.map(c=>
    `<div class="mvisit tap" onclick="openKarte('${esc(c.name)}','顧客カルテ')">
      <div class="mv-body"><div class="n">${c.name}</div><div class="a">${c.meta}</div></div>
      ${c.tag?`<span class="mtag ${c.tagCls}">${c.tag}</span>`:''}${chev()}</div>`).join('')
    : '<div class="mempty">該当する顧客がありません</div>';
}
function filterCust(v){ custState.q=v; renderCust(v); }

/* ---- 取引履歴（全件・検索・その場提示） ---- */
let histState={q:'',kind:'すべて'};
function renderHist(){
  const q=histState.q.trim().toLowerCase(), k=histState.kind;
  const list=MDATA.txnHistory.filter(h=>(k==='すべて'||h.kind===k)&&(!q||(h.title+h.kind).toLowerCase().includes(q)));
  const el=document.getElementById('histList');
  el.innerHTML = list.length ? list.map(txnMini).join('')
    : '<div class="mempty">該当する履歴がありません</div>';
}
function openHistory(){
  histState={q:'',kind:'すべて'};
  document.getElementById('histName').textContent = rec.store || '取引履歴';
  const s=document.getElementById('histSearch'); if(s) s.value='';
  document.querySelectorAll('#histKinds .segm').forEach((x,i)=>x.classList.toggle('on',i===0));
  renderHist();
  go('s_history');
}
function filterHist(v){ histState.q=v; renderHist(); }
function histKind(k,el){ histState.kind=k; el.parentNode.querySelectorAll('.segm').forEach(s=>s.classList.remove('on')); el.classList.add('on'); renderHist(); }

/* ---- AI日報 作成フロー ---- */
let aiMemo='';
var aiRange='today';
var aiReport={status:'draft'};
const AI_RANGE={
  today:{ src:'aiActivities',      lbl:'本日',
    summary:'本日は大阪エリアを中心に4件訪問。新規見積案件を1件獲得し、契約更新も最終段階に。',
    detail:'<b>14:00 みなとフード栄町店（商談）</b><br>新店舗GT清掃の見積依頼を受領。6/5提出予定。<br><b>15:30 関西モール梅田（定期）</b><br>排水管洗浄の契約更新、条件合意に近い。<br><b>17:00 中央総合病院（電話）</b><br>夜間作業の日程を調整。' },
  week:{ src:'aiActivitiesWeek',   lbl:'今週',
    summary:'今週 訪問18件・受注3件・契約更新4件。新規見積は計5件を獲得し、梅田の更新は合意間近。',
    detail:'商談 7件 ／ 定期 6件 ／ 電話 3件 ／ 対応 2件。<br>新規見積 5件・受注 3件・契約更新 4件を締結。<br>クレーム対応 1件は追加洗浄の提案で解消。' },
  month:{ src:'aiActivitiesMonth', lbl:'今月',
    summary:'今月 訪問102件・受注7件・契約更新8件。新規開拓18社、年間契約の役員提示まで進捗。',
    detail:'商談 41件 ／ 定期 38件 ／ 電話 15件 ／ 対応 8件。<br>新規見積 19件・受注 7件・契約更新 8件。<br>クレーム対応 3件を完了し継続維持。' },
};
function renderAiActs(){
  const cfg=AI_RANGE[aiRange]||AI_RANGE.today;
  const acts=MDATA[cfg.src]||[];
  const al=document.getElementById('actList');
  if(al) al.innerHTML = acts.map(a=>
    `<div class="act-item"><div class="act-time">${a.time}<span>${a.kind}</span></div>
      <div class="act-b"><div class="act-n">${a.name}</div><div class="act-m">${a.memo}</div></div></div>`).join('');
  const cnt=document.getElementById('actCnt'); if(cnt) cnt.textContent = acts.length;
  const lbl=document.getElementById('actRangeLbl'); if(lbl) lbl.textContent = cfg.lbl;
}
function setAiRange(r,el){
  aiRange=r;
  if(el){ el.parentNode.querySelectorAll('.segm').forEach(s=>s.classList.remove('on')); el.classList.add('on'); }
  renderAiActs();
}
function openAiPrep(){
  aiMemo='';
  aiRange='today'; aiReport.status='draft';
  document.querySelectorAll('#aiRanges .segm').forEach((x,i)=>x.classList.toggle('on',i===0));
  renderAiActs();
  const m=document.getElementById('aiMemo'); m.className='ph'; m.textContent='タップして追記';
  go('s_aiprep');
}
function openAiMemo(){
  openGen('<div class="sh-t">ひとことメモ</div>'+
    '<div style="font-size:11.5px;color:var(--muted);font-weight:600;margin-bottom:8px">よく使う文（タップで追加）</div>'+
    '<div class="picks" style="margin-bottom:14px">'+['手応えあり','次回は上長同行','価格交渉が論点','競合の動きに注意'].map(p=>`<div class="pick tap" style="flex:1 1 44%;font-size:12.5px;padding:11px 8px" onclick="setAiMemo('${p}')">${p}</div>`).join('')+'</div>'+
    '<button class="bigbtn tap" onclick="setAiMemo(\'特になし\')">入力を確定</button>');
}
function setAiMemo(v){ aiMemo=v; const m=document.getElementById('aiMemo'); m.className='val'; m.textContent=v; closeGen(); toast('メモを追記しました'); }
function genAiReport(){
  aiReport.status='draft';
  const cfg=AI_RANGE[aiRange]||AI_RANGE.today;
  toast('AIが日報を生成しました');
  const memo = aiMemo && aiMemo!=='特になし' ? `${aiMemo}。栄町店のトラブル履歴を提示でき、頻度見直しの提案がスムーズだった。` : '栄町店のトラブル履歴を提示でき、頻度見直しの提案がスムーズだった。';
  document.getElementById('aiReportBody').innerHTML = `
    <div class="ai-doc">
      <div class="arp-row"><div class="arp-l">サマリ</div><div class="arp-v" onclick="editArp(this)">${cfg.summary}</div></div>
      <div class="arp-row"><div class="arp-l">訪問詳細</div><div class="arp-v" onclick="editArp(this)">${cfg.detail}</div></div>
      <div class="arp-row"><div class="arp-l">次回</div><div class="arp-v" onclick="editArp(this)">6/5 みなと見積提出 ／ 6/10 中央病院G 役員提示</div></div>
      <div class="arp-row"><div class="arp-l">所感</div><div class="arp-v" onclick="editArp(this)">${memo}</div></div>
    </div>`;
  renderAiReportStatus();
  go('s_aireport');
}
/* ---- AI日報 ステータス機械: draft / submitted / approved / returned ---- */
const AI_STATUS={
  draft:    { lbl:'下書き', cls:'aps-draft' },
  submitted:{ lbl:'提出済', cls:'aps-submitted' },
  approved: { lbl:'承認済', cls:'aps-approved' },
  returned: { lbl:'差し戻し', cls:'aps-returned' },
};
function applyStatusBadge(el){
  if(!el) return;
  const s=AI_STATUS[aiReport.status]||AI_STATUS.draft;
  el.className='arp-status '+s.cls;
  el.textContent=s.lbl;
}
function arpEditable(){ return aiReport.status==='draft'||aiReport.status==='returned'; }
/* s_aireport の状態表示と各値の編集可否（ロック表示）を更新 */
function renderAiReportStatus(){
  applyStatusBadge(document.getElementById('aiRepStatus'));
  const editable=arpEditable();
  document.querySelectorAll('#aiReportBody .arp-v').forEach(v=>{
    v.classList.toggle('locked',!editable);
  });
}
function editArp(el){
  if(aiReport.status==='approved'){ toast('承認済みのため編集できません','warn'); return; }
  if(aiReport.status==='submitted'){ toast('提出済みです（編集不可）','warn'); return; }
  // draft / returned のみ編集可
  var v=prompt('編集',el.textContent);
  if(v!=null) el.textContent=v;
}
function sendAiReport(){
  if(aiReport.status!=='draft'&&aiReport.status!=='returned'){ go('s_aidone'); return; }
  const re=aiReport.status==='returned';
  // 初回提出（下書き → 提出）のみ、現在のプレビュー内容から日報一覧に1件追加する。
  // 差し戻しの再提出は既存の一覧項目を編集する流れのため、ここでは追加しない。
  if(!re){
    var vs=[...document.querySelectorAll('#aiReportBody .arp-v')].map(e=>e.innerHTML);
    var entry={ date:'2026/05/29（金）', range:(AI_RANGE[aiRange]||{}).lbl||'本日', status:'submitted',
      summary:vs[0], detail:vs[1], next:vs[2], impression:vs[3] };
    MDATA.dailyReports = MDATA.dailyReports || [];
    var top=MDATA.dailyReports[0];
    // 同一セッションで繰り返し提出しても二重に積み上がらないよう、
    // 先頭が「本日（提出済）」ならそれを置き換える。
    if(top && top.date===entry.date && top.status==='submitted'){ MDATA.dailyReports[0]=entry; }
    else { MDATA.dailyReports.unshift(entry); }
  }
  aiReport.status='submitted';
  renderAiReportStatus();
  renderAiDone();
  toast(re?'修正版を再提出しました':'日報を提出しました');
  go('s_aidone');
}
/* s_aidone の見た目を現在の状態に同期（バッジ/文言/上長ボタン/フッター） */
function renderAiDone(){
  applyStatusBadge(document.getElementById('aiDoneBadge'));
  const t=document.getElementById('aiDoneT');
  const msg=document.getElementById('aiDoneMsg');
  const sup=document.getElementById('aiSupBox');
  const foot=document.getElementById('aiDoneFoot');
  const st=aiReport.status;
  if(t) t.textContent = st==='approved' ? 'AI日報 承認されました'
                      : st==='returned' ? 'AI日報 差し戻し'
                      : 'AI日報 提出完了';
  if(msg) msg.innerHTML = st==='approved' ? '上長が内容を承認しました。<br>以降は編集できません（確定）。'
                       : st==='returned' ? '上長から差し戻されました。<br>修正して再提出してください。'
                       : '上長の管理画面（営業活動 ›<br>AI日報）に届きました';
  // 上長デモ操作は「提出済」のときだけ表示
  if(sup) sup.style.display = st==='submitted' ? 'block' : 'none';
  // フッター：差し戻し時は「報告を修正する」、それ以外はホームへ
  if(foot) foot.innerHTML = st==='returned'
    ? '<button class="bigbtn tap" onclick="reopenAiReport()"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>報告を修正する</button>'
    : '<button class="bigbtn tap" onclick="root(\'s_home\')">ホームへ戻る</button>';
}
/* 上長（管理画面）デモ操作 */
function supApprove(){ aiReport.status='approved'; renderAiReportStatus(); renderAiDone(); toast('上長が日報を承認しました'); }
function supReturn(){ aiReport.status='returned'; renderAiReportStatus(); renderAiDone(); toast('上長が日報を差し戻しました','warn'); }
/* 差し戻し → プレビューに戻って再編集 */
function reopenAiReport(){ back(); renderAiReportStatus(); toast('差し戻し：内容を修正して再提出してください'); }

/* ---- AI日報：提出済み日報の閲覧（一覧 / 詳細） ---- */
var aiRepFilter='すべて';
var aiRepView=0;
function statusBadgeHtml(st){ const s=AI_STATUS[st]||AI_STATUS.draft; return `<span class="arp-status ${s.cls}">${s.lbl}</span>`; }
function renderAiReports(){
  const all=MDATA.dailyReports||[];
  const items=all.map((r,i)=>({r,i})).filter(o=> aiRepFilter==='すべて' || (AI_STATUS[o.r.status]||{}).lbl===aiRepFilter);
  const el=document.getElementById('aiRepList'); if(!el) return;
  el.innerHTML = items.length ? items.map(o=>
    `<div class="rep-card tap" onclick="openAiRepView(${o.i})">
       <div class="rep-top"><span class="rep-date">${o.r.date}</span>${statusBadgeHtml(o.r.status)}</div>
       <div class="rep-sum">${o.r.summary}</div>
       <div class="rep-meta"><span class="rep-rng">${o.r.range}</span>${o.r.status==='returned'?'<span class="rep-flag">要修正</span>':''}<svg class="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 6l6 6-6 6"></path></svg></div>
     </div>`).join('')
    : '<div class="mempty">該当する日報がありません</div>';
}
function openAiReports(){ aiRepFilter='すべて'; document.querySelectorAll('#aiRepFilters .segm').forEach((x,i)=>x.classList.toggle('on',i===0)); renderAiReports(); go('s_aireports'); }
function filterAiReports(f,el){ aiRepFilter=f; if(el){ el.parentNode.querySelectorAll('.segm').forEach(s=>s.classList.remove('on')); el.classList.add('on'); } renderAiReports(); }
function openAiRepView(i){
  const r=(MDATA.dailyReports||[])[i]; if(!r) return; aiRepView=i;
  const dt=document.getElementById('arvDate'); if(dt) dt.textContent=r.date+' · 梶原 健司';
  const b=document.getElementById('arvStatus'); const s=AI_STATUS[r.status]||AI_STATUS.draft;
  if(b){ b.className='arp-status '+s.cls; b.textContent=s.lbl; }
  const body=document.getElementById('arvBody');
  if(body) body.innerHTML = `
    <div class="ai-doc">
      <div class="arp-row"><div class="arp-l">サマリ</div><div class="arp-v locked">${r.summary}</div></div>
      <div class="arp-row"><div class="arp-l">訪問詳細</div><div class="arp-v locked">${r.detail}</div></div>
      <div class="arp-row"><div class="arp-l">次回</div><div class="arp-v locked">${r.next}</div></div>
      <div class="arp-row"><div class="arp-l">所感</div><div class="arp-v locked">${r.impression}</div></div>
    </div>`
    + (r.returnNote?`<div class="mnote amber" style="margin-top:12px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z"></path><path d="M12 9v4M12 17h.01"></path></svg><div><b>上長から差し戻し</b><br>${r.returnNote}</div></div>`:'');
  const foot=document.getElementById('arvFoot');
  if(foot) foot.innerHTML = r.status==='returned'
    ? `<button class="bigbtn tap" onclick="editAiReportFromList(${i})"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>報告を修正して再提出</button>`
    : `<button class="bigbtn tap" style="background:#fff;color:var(--brand-700);border:1.6px solid var(--brand)" onclick="toast('日報PDFを出力しました')"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg>PDFを出力</button>`;
  go('s_airepview');
}
function editAiReportFromList(i){
  const r=(MDATA.dailyReports||[])[i]; if(!r) return;
  aiReport.status='returned';
  document.getElementById('aiReportBody').innerHTML = `
    <div class="ai-doc">
      <div class="arp-row"><div class="arp-l">サマリ</div><div class="arp-v" onclick="editArp(this)">${r.summary}</div></div>
      <div class="arp-row"><div class="arp-l">訪問詳細</div><div class="arp-v" onclick="editArp(this)">${r.detail}</div></div>
      <div class="arp-row"><div class="arp-l">次回</div><div class="arp-v" onclick="editArp(this)">${r.next}</div></div>
      <div class="arp-row"><div class="arp-l">所感</div><div class="arp-v" onclick="editArp(this)">${r.impression}</div></div>
    </div>`;
  renderAiReportStatus();
  go('s_aireport');
  toast('差し戻し分を修正できます');
}

function startRecord(){
  rec.store=''; rec.type='';
  go('s_rec1');
}
function pickStore(name){
  rec.store=name;
  document.getElementById('rec2Store').textContent = name;
  go('s_rec2');
}
function pickType(t){
  rec.type=t;
  document.getElementById('rec3Store').textContent = rec.store;
  document.getElementById('rec3Type').textContent = t;
  go('s_rec3');
}
function saveRecord(){
  root('s_home');
  toast('活動を記録しました（'+rec.type+'）');
}

/* ============ オフライン作業報告キュー（PWA） ============ */
const RQ_KEY='dk_report_queue';
let dkOfflineDemo=false;                 // 「オフライン体験」デモトグル
function isOffline(){ return dkOfflineDemo || !navigator.onLine; }
function getReportQueue(){
  try{ return JSON.parse(localStorage.getItem(RQ_KEY)||'[]'); }catch(e){ return []; }
}
function setReportQueue(q){
  try{ localStorage.setItem(RQ_KEY, JSON.stringify(q)); }catch(e){}
}
/* ヘッダーの接続状態ピル・未送信バッジ・トグル表示を同期 */
function renderNetStatus(){
  const off=isOffline();
  const pill=document.getElementById('netPill');
  if(pill){ pill.classList.toggle('off',off); pill.textContent=off?'オフライン':'オンライン'; }
  const sw=document.getElementById('offSw'); if(sw) sw.classList.toggle('on',dkOfflineDemo);
  const q=getReportQueue();
  const badge=document.getElementById('queueBadge');
  const cnt=document.getElementById('queueCnt');
  if(cnt) cnt.textContent=q.length;
  if(badge) badge.classList.toggle('on',q.length>0);
}
/* キューに作業報告を積む */
function queueReport(){
  const q=getReportQueue();
  q.push({ name:report.name, work:report.work, op:report.op, sludge:report.sludge,
           at:new Date().toISOString() });
  setReportQueue(q);
  renderNetStatus();
}
/* オンライン復帰時：キューを自動同期 */
function flushReportQueue(){
  if(isOffline()){ toast('オフライン中です。オンライン復帰で自動送信します','warn'); return; }
  const q=getReportQueue();
  if(!q.length){ renderNetStatus(); return; }
  const n=q.length;
  setReportQueue([]);
  renderNetStatus();
  toast('オンライン復帰：作業報告 '+n+'件 を自動同期しました');
}
/* デモトグル：ON=圏外擬似 / OFF=復帰してキュー送信 */
function toggleOfflineDemo(){
  dkOfflineDemo=!dkOfflineDemo;
  renderNetStatus();
  if(dkOfflineDemo){ toast('オフライン体験 ON：圏外を擬似再現します'); }
  else { toast('オフライン体験 OFF：オンラインに復帰しました'); flushReportQueue(); }
}
/* 実機の online/offline イベント */
window.addEventListener('online', function(){ renderNetStatus(); flushReportQueue(); });
window.addEventListener('offline', function(){ renderNetStatus(); toast('オフラインになりました。作業報告は端末に保存されます','warn'); });

/* ============ 現場フロー ============ */
function resetReport(){
  report.after=false; report.sludge=null;
  const cap=document.getElementById('capAfter');
  if(cap){
    cap.classList.remove('filled'); cap.classList.add('req-empty');
    cap.innerHTML = '<span class="req-x">＊</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>作業後<br>を撮影';
  }
  document.getElementById('aiRow').style.display='none';
  const sb=document.getElementById('sludgeBox');
  sb.classList.remove('ok'); sb.classList.add('err');
  document.getElementById('sludgeVal').className='ph'; document.getElementById('sludgeVal').textContent='タップして入力';
  document.getElementById('sludgeMsg').style.display='flex';
  const memo=document.getElementById('memoVal');
  if(memo){ memo.className='ph'; memo.textContent='タップして入力'; }
  updateSubmit();
}
function openReport(name,work){
  resetReport();
  report.name=name||MDATA.reportDefault.name; report.work=work||MDATA.reportDefault.work;
  report.op = 'OP-' + (77120 + Math.floor(Math.random()*30));
  document.getElementById('repName').textContent = report.name+' — 完了報告';
  document.getElementById('repSub').textContent = report.work+' · '+report.op;
  go('f_report');
}
function capture(el){
  if(report.after) return;
  report.after=true;
  el.classList.remove('req-empty'); el.classList.add('filled');
  el.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg><span class="cls">作業後</span>';
  document.getElementById('aiRow').style.display='flex';
  toast('AIが「作業後」に自動分類しました');
  updateSubmit();
}
function openSheet(){ document.getElementById('sheetMask').classList.add('on'); }
function closeSheet(){ document.getElementById('sheetMask').classList.remove('on'); }
function setSludge(v){
  report.sludge=v;
  const sb=document.getElementById('sludgeBox');
  sb.classList.remove('err'); sb.classList.add('ok');
  const val=document.getElementById('sludgeVal');
  val.className='val'; val.textContent=v+' m³';
  document.getElementById('sludgeMsg').style.display='none';
  closeSheet();
  updateSubmit();
}
function missingCount(){
  let n=0; if(!report.after)n++; if(!report.sludge)n++; return n;
}
function updateSubmit(){
  const n=missingCount();
  const btn=document.getElementById('submitBtn');
  const lbl=document.getElementById('submitLabel');
  if(n===0){
    btn.className='bigbtn eco tap';
    lbl.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>完了報告を送信';
  } else {
    btn.className='bigbtn disabled';
    lbl.textContent='必須 '+n+'項目 が未入力';
  }
}
function trySubmit(){
  const n=missingCount();
  if(n>0){
    toast('必須項目が未入力です','warn');
    if(!report.after){ shake(document.getElementById('capAfter')); }
    if(!report.sludge){ shake(document.getElementById('finSludge')); }
    // scroll to first missing
    const target = !report.after ? document.getElementById('capAfter') : document.getElementById('finSludge');
    target.closest('.sc').scrollTo({top: target.offsetTop-60, behavior:'smooth'});
    return;
  }
  // success
  document.getElementById('doneSub').textContent = report.name+' · '+report.op;
  document.getElementById('doneSludge').textContent = report.sludge;
  document.getElementById('jwnet').textContent = genJwnet();
  if(isOffline()){
    // オフライン：端末に保存し、復帰時に自動送信
    queueReport();
    toast('オフライン保存：オンライン復帰時に自動送信します','warn');
  } else {
    toast('完了報告を送信しました');
  }
  go('f_done');
}
function nextJob(){ root('f_home'); toast('次の作業を選んでください'); }
function genJwnet(){
  const r=()=>String(Math.floor(1000+Math.random()*9000));
  return MDATA.jwnetPrefix+'-'+r()+'-'+r()+'-'+r();
}

/* ---- report detail (履歴 → 詳細) ---- */
function openRepDetail(name,work,sludge){
  document.getElementById('rdName').textContent = name;
  document.getElementById('rdSub').textContent = work+' · 確定';
  document.getElementById('rdSludge').textContent = sludge==='—' ? '対象外' : sludge+' m³';
  document.getElementById('rdJwnet').textContent = sludge==='—' ? '— （産廃なし）' : genJwnet();
  go('f_repdetail');
}

/* ---- generic sheet: 次回アクション（日付） ---- */
function openGen(html){ document.getElementById('genSheet').innerHTML=html; document.getElementById('genMask').classList.add('on'); }
function closeGen(){ document.getElementById('genMask').classList.remove('on'); }
function openDateSheet(){
  const opts=MDATA.dateOptions;
  openGen('<div class="sh-t">次回アクションを選択</div>'+
    opts.map(o=>`<button class="optbtn tap" style="margin-bottom:9px" onclick="setDate('${o}')"><span class="od">${o}</span><span class="chev" style="color:var(--faint)">›</span></button>`).join(''));
}
function setDate(v){ const b=document.getElementById('rec3Date'); b.querySelector('.val').textContent=v; closeGen(); toast('次回アクションを設定'); }

/* ---- generic sheet: 備考・異常報告 ---- */
function openMemoSheet(){
  const phrases=MDATA.memoPhrases;
  openGen('<div class="sh-t">備考・異常報告</div>'+
    '<div style="font-size:11.5px;color:var(--muted);font-weight:600;margin-bottom:8px">よく使う文（タップで追加）</div>'+
    '<div class="picks" style="margin-bottom:14px">'+phrases.map(p=>`<div class="pick tap" style="flex:1 1 44%;font-size:12.5px;padding:11px 8px" onclick="setMemo('${p}')">${p}</div>`).join('')+'</div>'+
    '<button class="bigbtn tap" onclick="setMemo(\'異常なし\')">入力を確定</button>');
}
function setMemo(v){
  const el=document.getElementById('memoVal');
  el.className='val'; el.textContent=v;
  closeGen(); toast('備考を入力しました');
}

/* ---- shake helper ---- */
function shake(el){ el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

/* ---- in-device toast ---- */
let toastT;
function toast(msg,kind){
  const t=document.getElementById('dtoast');
  document.getElementById('dtoastMsg').textContent=msg;
  t.classList.toggle('warn',kind==='warn');
  t.classList.add('on');
  clearTimeout(toastT);
  toastT=setTimeout(()=>t.classList.remove('on'),2200);
}

renderLists();
renderTabs();
updateSubmit();
renderNetStatus();
