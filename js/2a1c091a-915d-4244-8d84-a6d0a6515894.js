/* ============================================================
   Screens — helpers + render functions (Part A)
   ============================================================ */

/* ---- Render helpers ---- */
function kpi(items){
  return `<div class="cards">${items.map(k=>`
    <div class="kpi ${k.accent?('accent-'+k.accent):''}">
      <div class="kt"><div class="kic">${ic(k.icon||'bi')}</div><div class="lbl">${k.l}</div></div>
      <div class="val tnum">${k.v}${k.u?`<small>${k.u}</small>`:''}</div>
      ${k.d?`<div class="delta ${k.dir||'flat'}">${arrow(k.dir)}${k.d}</div>`:''}
    </div>`).join('')}</div>`;
}
function arrow(dir){
  if(dir==='up')return `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3"><path d="M7 14l5-5 5 5"/></svg>`;
  if(dir==='down')return `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3"><path d="M7 10l5 5 5-5"/></svg>`;
  return '';
}
function tbl(cols,rows,opt={}){
  const click = opt.click ? ' clickable' : '';
  const onrow = opt.click ? ` onclick="openDrawer(this)"` : '';
  return `<div class="tbl-wrap"><div class="scroll"><table><thead><tr>${cols.map(c=>`<th${c.num?' class="num"':''}>${c.t||c}</th>`).join('')}</tr></thead>
   <tbody>${rows.map(r=>`<tr class="row${click}"${onrow}>${r.map((c,i)=>`<td${cols[i]&&cols[i].num?' class="num"':''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}
function toolbar(html){return `<div class="toolbar">${html}</div>`;}
const btnNew = (t,go)=>`<button class="btn primary"${go?` data-go="${go}"`:''}>${ic('plus')}${t}</button>`;
const btnCsv = `<button class="btn">${ic('download')}CSV出力</button>`;
const btnFilter = `<button class="btn">${ic('filter')}絞り込み</button>`;
const searchBox = (ph='キーワード検索…')=>`<div style="position:relative;flex:1;max-width:300px"><input class="search grow" style="width:100%;padding-left:34px" placeholder="${ph}"><span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--faint)">${ic('search')}</span></div>`;
function sel(opts){return `<select class="search">${opts.map(o=>`<option>${o}</option>`).join('')}</select>`;}
let _sg=0;
function segmented(opts,panels){
  const id='sg'+(_sg++);
  return `<div class="segmented" data-sg="${id}">${opts.map((o,i)=>`<span class="seg ${i===0?'active':''}" data-i="${i}">${o}</span>`).join('')}</div>`+
    `<div class="seg-panels" data-sg="${id}">${panels.map((p,i)=>`<div class="seg-panel" data-i="${i}"${i===0?'':' style="display:none"'}>${p}</div>`).join('')}</div>`;
}
function note(txt,kind='',icon='info'){return `<div class="note ${kind}">${ic(icon)}<div>${txt}</div></div>`;}
function panel(title,body,sub){return `<div class="panel"><div class="ph">${title}${sub?`<span class="sub">${sub}</span>`:''}</div><div class="pb">${body}</div></div>`;}
function tag(cls,txt){return `<span class="tag ${cls}">${txt}</span>`;}
const A = (txt)=>`<span class="lnk">${txt}</span>`;

/* ============================================================
   DASHBOARD
   ============================================================ */
function scr_dashboard(){
  return `
  <a href="ops.html" class="mobile-cta">
    <div class="mc-ic">${ic('ops')}</div>
    <div class="mc-tx"><b>スマホアプリを操作する（プロトタイプ）</b><span>営業3タップ入力・現場の写真報告を実際にタップして体験</span></div>
    <div class="mc-go">操作版を開く ${ic('link')}</div>
  </a>
  ${note('本日 5/31（金）夜間作業 8件を含む <b>34件</b> が予定されています。高圧洗浄車 2台が整備中のため配車にご注意ください。','warn','warn')}
  ${kpi([
    {l:'当月売上',v:'¥38.6M',u:'',d:'5.4% 前年同月比',dir:'up',icon:'revenue'},
    {l:'当年度累計',v:'¥412M',d:'4.8% 前年比',dir:'up',icon:'sales'},
    {l:'作業完了率',v:'98.6',u:'%',d:'0.5pt',dir:'up',icon:'check',accent:'eco'},
    {l:'再資源化率',v:'94',u:'%',d:'目標92%達成',dir:'up',icon:'leaf',accent:'eco'},
    {l:'満了60日内 契約',v:'18',d:'要対応',dir:'down',icon:'contract',accent:'amber'},
  ])}
  <div class="grid3">
    ${panel(`${ic('sales','pic')}月度売上推移`,`<canvas id="d1" height="150"></canvas>`,'当年度 vs 前年度')}
    ${panel(`${ic('drop','pic')}作業タイプ別構成`,`<canvas id="d2" height="150"></canvas>`)}
  </div>
  <div class="grid3">
    <div class="panel"><div class="ph">${ic('truck','pic')}本日の配車状況<span class="sub link" onclick="route('fleet')">配車計画へ</span></div><div class="pb flush">
      ${tbl([{t:'班'},{t:'車両'},{t:'担当エリア'},{t:'件数',num:true},{t:'進捗'},{t:'状態'}],[
        ['班A','高圧洗浄車 1号','大阪市内（栄町ほか）','6','<div class="bar" style="width:90px"><i style="width:66%"></i></div>',tag('t-green','稼働中')],
        ['班B','バキューム車 3号','神戸・西宮','5','<div class="bar" style="width:90px"><i style="width:40%"></i></div>',tag('t-green','稼働中')],
        ['班C','高圧洗浄車 2号','京都市内','4','<div class="bar amber" style="width:90px"><i style="width:0%"></i></div>',tag('t-amber','整備待ち')],
        ['夜間班','産廃収集車 1号','大阪南部','8','<div class="bar" style="width:90px"><i style="width:0%"></i></div>',tag('t-blue','夜間予定')],
      ])}
    </div></div>
    <div class="panel"><div class="ph">${ic('warn','pic')}対応が必要な項目</div><div class="pb"><ul class="timeline">
      <li class="amber"><div class="tt">契約 · 残30日</div><div class="tx">みなとフードHD 清掃委託契約の更新交渉</div></li>
      <li class="amber"><div class="tt">異常報告 · 栄町店</div><div class="tx">グリストラップ油脂過多 — 追加洗浄の提案</div></li>
      <li><div class="tt">見積 · 期限本日</div><div class="tx">関西モール管理 排水管洗浄 見積提出</div></li>
      <li class="eco"><div class="tt">連携 · 警告</div><div class="tx">弥生販売 売上データ 3件の差異確認</div></li>
    </ul></div></div>
  </div>
  <div class="grid2">
    ${panel(`${ic('customer','pic')}顧客別売上 TOP5`,`<canvas id="d3" height="170"></canvas>`)}
    ${panel(`${ic('pin','pic')}エリア別売上`,`<canvas id="d4" height="170"></canvas>`)}
  </div>`;
}

/* ============================================================
   顧客・店舗
   ============================================================ */
function scr_cust(t){
  if(t===1) return scr_cust_new();
  if(t===2) return `<div class="grid2">
    ${panel(`${ic('customer','pic')}顧客分類`, tbl([{t:'分類コード'},{t:'分類名'},{t:'顧客数',num:true},''],[
      ['CL01','飲食チェーン','142',A('編集')],['CL02','商業施設・モール','88',A('編集')],
      ['CL03','病院・福祉施設','61',A('編集')],['CL04','学校・公共施設','45',A('編集')],['CL05','ホテル・宿泊','30',A('編集')],
    ]))}
    ${panel(`${ic('customer','pic')}タグ`, `<div class="chips">${['優良顧客','月次請求','電子請求','夜間作業','産廃契約','大口','要フォロー','新規'].map(x=>`<span class="chip">${ic('check')}${x}</span>`).join('')}<span class="chip add">${ic('plus')}タグ追加</span></div>`)}
  </div>`;
  if(t===3) return scr_cust_billto();
  if(t===4) return scr_cust_mgmt();
  if(t===5) return scr_cust_store();
  if(t===6) return scr_cust_relation();
  if(t===7) return scr_cust_history();
  // tab 0: 顧客一覧
  return kpi([
    {l:'登録顧客数',v:'366',d:'8 今月',dir:'up',icon:'customer'},
    {l:'稼働中 店舗',v:'3,742',icon:'store'},
    {l:'請求先数',v:'412',icon:'invoice'},
    {l:'要フォロー',v:'21',d:'解約検討含む',dir:'down',icon:'warn',accent:'amber'},
  ])+
  toolbar(searchBox('顧客名・コードで検索…')+sel(['区分：すべて','飲食チェーン','商業施設','病院・福祉','学校'])+`<span class="spacer"></span>`+btnCsv+btnNew('顧客新規登録','cust:1'))+
  tbl([{t:'顧客コード'},{t:'顧客名'},{t:'分類'},{t:'担当営業'},{t:'店舗数',num:true},{t:'契約'},{t:'状態'}],[
    ['<span class="code">C-100245</span>','<b>みなとフードホールディングス</b>',tag('t-teal','飲食チェーン'),'佐藤','312',tag('t-green','3件'),tag('t-green','稼働中')],
    ['<span class="code">C-100244</span>','<b>関西モール管理</b>',tag('t-teal','商業施設'),'鈴木','118',tag('t-green','2件'),tag('t-green','稼働中')],
    ['<span class="code">C-100240</span>','<b>グルメテーブル中部FC</b>',tag('t-teal','飲食チェーン'),'梶原','167',tag('t-green','1件'),tag('t-green','稼働中')],
    ['<span class="code">C-100236</span>','<b>中央総合病院グループ</b>',tag('t-teal','病院・福祉'),'高橋','9',tag('t-amber','更新中'),tag('t-amber','確認中')],
    ['<span class="code">C-100231</span>','<b>大学生協連合 関西</b>',tag('t-teal','学校'),'佐藤','24',tag('t-green','1件'),tag('t-green','稼働中')],
    ['<span class="code">C-100201</span>','<b>旧・西物産</b>',tag('t-gray','商業施設'),'—','0','—',tag('t-gray','停止')],
  ],{click:true});
}
function scr_cust_new(){
  return note('顧客を登録すると、1社に対して<b>複数店舗をまとめて登録</b>できます。住所は郵便番号から<b>Google Maps で自動取得</b>、店舗が多い場合は <b>CSV一括インポート</b>（店舗一覧タブ）もご利用ください。','eco','pin')+
  `<div class="grid-1-2" style="align-items:start">
    ${panel('基本情報', `<div class="form">
      <div class="fld"><label>顧客コード<span class="req">*</span></label><input value="C-100247（自動採番）" readonly></div>
      <div class="fld"><label>顧客名<span class="req">*</span></label><input placeholder="例：株式会社○○フードサービス"></div>
      <div class="fld"><label>顧客カナ</label><input placeholder="カブシキガイシャ…"></div>
      <div class="fld"><label>区分</label>${sel2(['法人','個人'])}</div>
      <div class="fld"><label>顧客分類</label>${sel2(['飲食チェーン','商業施設・モール','病院・福祉施設','学校・公共施設','ホテル・宿泊'])}</div>
      <div class="fld"><label>担当営業</label>${sel2(['梶原','佐藤','鈴木','高橋'])}</div>
      <div class="fld"><label>郵便番号<span class="req">*</span></label>
        <div style="display:flex;gap:8px"><input id="custZip" placeholder="530-0001" style="flex:1" oninput="zipReady(this.value)"><button class="btn" onclick="mapsLookup()">${ic('pin')}住所取得</button></div>
      </div>
      <div class="fld"><label>電話番号</label><input placeholder="06-0000-0000"></div>
      <div class="fld full"><label>本社住所 <span class="subtle" style="font-weight:500">（Google Maps 自動入力）</span></label><input id="custAddr" placeholder="郵便番号から自動取得されます"></div>
      <div class="fld"><label>緯度・経度 <span class="subtle" style="font-weight:500">（自動）</span></label><input id="custGeo" readonly placeholder="—"></div>
      <div class="fld"><label>メールアドレス</label><input placeholder="keiri@example.co.jp"></div>
      <div class="fld full"><label>タグ</label><div class="chips"><span class="chip">優良顧客</span><span class="chip">月次請求</span><span class="chip add">${ic('plus')}追加</span></div></div>
    </div>
    <div class="hint">${ic('info')}<span>＊は必須項目です。郵便番号を入れて「住所取得」を押すと住所・地図・緯度経度が自動補完されます。</span></div>`)}
    ${panel(`${ic('pin','pic')}地図プレビュー`, `<div id="mapPrev" class="map-prev">${ic('pin')}<span>郵便番号から地図を表示</span></div>
      <div style="font-size:11.5px;color:var(--muted);margin-top:10px;line-height:1.6">Google Maps Geocoding API で住所・緯度経度を取得し、配車ルートの最適化にも利用します。</div>
      ${note('同一住所はキャッシュを再利用しAPI呼出を抑制。月間API上限の範囲内で運用します。','warn','warn')}`)}
  </div>
  ${panel(`${ic('store','pic')}店舗をまとめて登録 <span class="sub">この顧客に紐づく店舗（${'<span id="storeCnt">2</span>'}件）</span>`, `
    <div id="newStores">
      ${newStoreRow('みなとフード 栄町店','大阪市中央区','月次')}
      ${newStoreRow('みなとフード 梅田北口店','大阪市北区','月2回')}
    </div>
    <div style="display:flex;gap:9px;margin-top:6px">
      <button class="btn" onclick="addStoreRow()">${ic('plus')}店舗を追加</button>
      <button class="btn" data-go="cust:5">${ic('upload')}CSVで一括登録</button>
    </div>`)}
  <div class="form-foot"><button class="btn primary" onclick="toast('顧客と店舗を登録しました')">顧客＋店舗を登録</button><button class="btn">下書き保存</button><button class="btn ghost">キャンセル</button></div>`;
}
function newStoreRow(name,area,freq){
  return `<div class="store-row">
    <span class="sr-ic">${ic('store')}</span>
    <input value="${name}" placeholder="店舗名">
    <input value="${area}" placeholder="エリア・住所" style="flex:1.2">
    <select>${['月次','月2回','季次','半年','年次'].map(f=>`<option${f===freq?' selected':''}>${f}</option>`).join('')}</select>
    <span class="sr-x" onclick="this.closest('.store-row').remove();recountStores()">${ic('plus')}</span>
  </div>`;
}
function sel2(opts){return `<select>${opts.map(o=>`<option>${o}</option>`).join('')}</select>`;}

function scr_cust_billto(){
  return note('請求書の<b>発行対象は各店舗</b>。一方で<b>入金は本社（親会社）単位</b>で管理します。宛先は <b>①各店舗宛 ②本社宛 ③指定代表店舗宛</b> の3パターンに対応します。','eco','invoice')+
  `<div class="flow"><span class="step done"><span class="sn">${ic('store')}</span>発行：店舗単位</span><span class="ar"></span><span class="step cur"><span class="sn">3</span>宛先：3パターン選択</span><span class="ar"></span><span class="step done"><span class="sn">${ic('revenue')}</span>入金：本社で集約</span></div>`+
  toolbar(searchBox('請求先・顧客で検索…')+`<span class="spacer"></span>`+btnNew('請求先登録'))+
  tbl([{t:'請求先コード'},{t:'請求先名'},{t:'紐付け店舗',num:true},{t:'宛先パターン'},{t:'入金管理'},{t:'締日'},{t:'電子請求'},{t:'宛先設定'},''],[
    ['<span class="code">B-5001</span>','<b>みなとフード 本部経理</b>','312',tag('t-blue','本社宛'),tag('t-teal','本社一括'),`<span class="lnk" onclick="openBillToForm('B-5001')">末日 ▾</span>`,tag('t-green','有効'),`<span class="lnk" onclick="openBillToForm('B-5001')">宛先設定</span>`,A('変更履歴')],
    ['<span class="code">B-5002</span>','<b>関西モール 管理本部</b>','118',tag('t-amber','各店舗宛'),tag('t-teal','本社一括'),`<span class="lnk" onclick="openBillToForm('B-5002')">20日 ▾</span>`,tag('t-green','有効'),`<span class="lnk" onclick="openBillToForm('B-5002')">宛先設定</span>`,A('変更履歴')],
    ['<span class="code">B-5010</span>','<b>グルメテーブル中部FC</b>','167',tag('t-green','代表店舗宛'),tag('t-teal','本社一括'),`<span class="lnk" onclick="openBillToForm('B-5010')">15日 ▾</span>`,tag('t-gray','紙'),`<span class="lnk" onclick="openBillToForm('B-5010')">宛先設定</span>`,A('変更履歴')],
    ['<span class="code">B-5021</span>','<b>中央総合病院グループ</b>','9',tag('t-blue','本社宛'),tag('t-teal','本社一括'),`<span class="lnk" onclick="openBillToForm('B-5021')">末日 ▾</span>`,tag('t-green','有効'),`<span class="lnk" onclick="openBillToForm('B-5021')">宛先設定</span>`,A('変更履歴')],
  ],{click:true})+
  `<div class="grid2">
    ${panel(`${ic('mail','pic')}宛先パターンの説明`,`<ul class="histo">
      <li><span class="tag t-amber nodot">各店舗宛</span><div>店舗ごとに請求書を発行・送付。店舗が経費処理するケース。</div></li>
      <li><span class="tag t-blue nodot">本社宛</span><div>全店舗分を本社（親会社）宛の1通に合算。本部経理が処理。</div></li>
      <li><span class="tag t-green nodot">代表店舗宛</span><div>指定した代表店舗宛にまとめて発行。エリア統括店などに集約。</div></li>
    </ul>`)}
    ${panel(`${ic('revenue','pic')}本社単位の入金管理`,
      tbl([{t:'本社（親会社）'},{t:'請求額',num:true},{t:'入金',num:true},{t:'入金日'},{t:'差額',num:true},{t:'状態'},{t:'消込'}],[
        ['みなとフードHD','¥2,728,000','¥2,728,000','06/15','<span class="num">¥0</span>',tag('t-green','消込済'),`<span class="lnk" onclick="openPaymentForm('みなとフードHD')">消込</span>`],
        ['関西モール管理','¥1,298,000','¥800,000','06/18','<span class="num" style="color:var(--red)">▲¥498,000</span>',tag('t-amber','一部入金'),`<span class="lnk" onclick="openPaymentForm('関西モール管理')">消込</span>`],
        ['中央総合病院グループ','¥185,000','¥0','—','<span class="num" style="color:var(--red)">▲¥185,000</span>',tag('t-amber','入金待ち'),`<span class="lnk" onclick="openPaymentForm('中央総合病院グループ')">入金登録</span> ${A('催促メール')}`],
        ['グルメテーブル中部FC','¥1,078,000','¥1,100,000','06/12','<span class="num" style="color:var(--red)">+¥22,000</span>',tag('t-red','過不足あり'),`<span class="lnk" onclick="openPaymentForm('グルメテーブル中部FC')">消込</span>`],
      ])+
      note('1件の入金を複数請求書に合算消込できます')+
      `<div class="tbl-wrap" style="margin:6px 0 0"><div class="scroll"><table><thead><tr><th>入金</th><th>充当先</th><th class="num">充当額</th><th>状態</th></tr></thead><tbody>
        <tr class="row"><td rowspan="2"><b>¥2,728,000</b><div class="subtle" style="font-size:11px">みなとフードHD 06/15</div></td><td>INV-202605-0011</td><td class="num">¥2,543,000</td><td>${tag('t-green','消込済')}</td></tr>
        <tr class="row"><td>INV-202605-0021</td><td class="num">¥185,000</td><td>${tag('t-green','消込済')}</td></tr>
      </tbody></table></div></div>`
    )}
  </div>`+
  panel(`${ic('clock','pic')}宛先・代表店舗の変更履歴 <span class="sub">適用開始月から反映／既発行は不追溯</span>`,
    tbl([{t:'適用日'},{t:'請求先'},{t:'変更内容'},{t:'変更者'}],[
      ['2026/05','<b>グルメテーブル中部FC</b> <span class="code">B-5010</span>','代表店舗：三宮店 → <b>梅田北口店</b>','梶原'],
      ['2026/04','<b>みなとフード 本部経理</b> <span class="code">B-5001</span>','宛先：各店舗宛 → <b>本社宛</b>','佐藤'],
      ['2026/01','<b>関西モール 管理本部</b> <span class="code">B-5002</span>','宛先：本社宛 → <b>各店舗宛</b>','鈴木'],
      ['2025/10','<b>グルメテーブル中部FC</b> <span class="code">B-5010</span>','宛先：本社宛 → <b>代表店舗宛</b>（代表：三宮店）','梶原'],
    ])+
    note('宛先・代表店舗・締日の変更は<b>適用開始月</b>以降の締め分から反映されます。<b>発行済みの請求書には遡及しません（不追溯）</b>。各行の「宛先設定」から変更でき、履歴は本表に追記されます。','warn','warn'));
}
function scr_cust_mgmt(){
  return toolbar(searchBox()+`<span class="spacer"></span>`+btnNew('管理会社登録'))+
  tbl([{t:'コード'},{t:'管理会社名'},{t:'管理区域'},{t:'管理店舗',num:true},{t:'有効期間'},''],[
    ['<span class="code">M-301</span>','<b>関西施設サービス</b>','近畿7府県','1,240','2024/04〜2027/03',A('履歴')],
    ['<span class="code">M-302</span>','<b>東日本ビル管理</b>','関東全域','980','2023/10〜2026/09',A('履歴')],
    ['<span class="code">M-303</span>','<b>京浜メンテナンス</b>','神奈川・東京','620','2025/01〜',A('履歴')],
  ],{click:true})+note('管理会社の切替（店舗移管）は履歴として追跡されます。有効期間で世代管理します。');
}
function scr_cust_store(){
  return kpi([
    {l:'全店舗',v:'3,742',icon:'store'},{l:'今月 新規',v:'14',d:'',dir:'up',icon:'plus',accent:'eco'},
    {l:'今月 閉店',v:'6',dir:'down',icon:'store',accent:'amber'},{l:'移管手続中',v:'21',icon:'refresh'},
  ])+
  toolbar(searchBox('店舗名・コードで検索…')+sel(['状態：すべて','営業中','閉店','開店準備中'])+sel(['エリア：すべて','関西','関東','中部'])+`<span class="spacer"></span><button class="btn" onclick="openCsvImport()">${ic('upload')}CSVインポート</button>`+btnCsv+btnNew('店舗登録'))+
  tbl([{t:'店舗コード'},{t:'店舗名'},{t:'顧客'},{t:'エリア'},{t:'作業頻度'},{t:'状態'}],[
    ['<span class="code">S-204411</span>','<b>みなとフード 栄町店</b>','みなとフードHD','大阪市中央区',tag('t-teal','月次'),tag('t-green','営業中')],
    ['<span class="code">S-204410</span>','<b>みなとフード 梅田北口店</b>','みなとフードHD','大阪市北区',tag('t-teal','月2回'),tag('t-green','営業中')],
    ['<span class="code">S-204388</span>','<b>グルメテーブル 三宮店</b>','グルメテーブル中部FC','神戸市中央区',tag('t-teal','月次'),tag('t-amber','開店準備中')],
    ['<span class="code">S-203901</span>','<b>関西モール 春日井</b>','関西モール管理','愛知県春日井市',tag('t-gray','—'),tag('t-red','閉店')],
  ],{click:true});
}

/* ---- 取引履歴（顧客ごと・全種別 + 検索） ---- */
const TXN_HISTORY = [
  {kind:'商談', cls:'t-blue',  date:'2026/05/29', cust:'みなとフードHD', title:'新店舗のグリストラップ清掃見積依頼を受領', by:'梶原', amt:'—'},
  {kind:'請求', cls:'t-green', date:'2026/05/31', cust:'みなとフードHD', title:'2026年5月分 請求書を発行（合算）', by:'佐藤', amt:'¥2,728,000'},
  {kind:'対応', cls:'t-amber', date:'2026/05/28', cust:'みなとフードHD', title:'栄町店 油脂過多の異常報告 → 追加洗浄を提案', by:'山田', amt:'—'},
  {kind:'契約', cls:'t-teal',  date:'2026/03/28', cust:'みなとフードHD', title:'定期清掃 包括契約 v3 を更新', by:'梶原', amt:'¥2,480,000/月'},
  {kind:'商談', cls:'t-blue',  date:'2026/05/27', cust:'関西モール管理', title:'排水管洗浄の年間契約を提案（役員提示へ）', by:'鈴木', amt:'—'},
  {kind:'請求', cls:'t-green', date:'2026/05/31', cust:'関西モール管理', title:'2026年5月分 請求書を発行（店舗別）', by:'佐藤', amt:'¥1,298,000'},
  {kind:'対応', cls:'t-gray',  date:'2026/05/25', cust:'中央総合病院グループ', title:'夜間作業の日程調整（電話）', by:'高橋', amt:'—'},
  {kind:'契約', cls:'t-teal',  date:'2025/01/05', cust:'関西モール管理', title:'排水管メンテ契約 v1 を締結', by:'鈴木', amt:'¥1,180,000/月'},
  {kind:'見積', cls:'t-blue',  date:'2026/05/30', cust:'みなとフードHD', title:'新店舗 グリストラップ清掃 見積 v1 を提出', by:'梶原', amt:'¥240,000'},
  {kind:'見積', cls:'t-blue',  date:'2026/06/03', cust:'関西モール管理', title:'梅田モール 排水管洗浄 見積 v2 を提出', by:'鈴木', amt:'¥620,000'},
  {kind:'クレーム', cls:'t-red', date:'2026/06/10', cust:'中央総合病院グループ', title:'夜間作業の騒音について苦情 → 作業時間帯を再調整', by:'高橋', amt:'—'},
  {kind:'クレーム', cls:'t-red', date:'2026/05/22', cust:'みなとフードHD', title:'梅田北口店 排水の戻り再発 → 緊急再洗浄で対応', by:'山田', amt:'¥86,000'},
  {kind:'入金', cls:'t-green', date:'2026/06/15', cust:'みなとフードHD', title:'2026年5月分 入金を確認（消込済）', by:'佐藤', amt:'¥2,728,000'},
  {kind:'入金', cls:'t-green', date:'2026/04/28', cust:'グルメテーブル中部FC', title:'2026年4月分 入金を確認（消込済）', by:'佐藤', amt:'¥1,078,000'},
];
function scr_cust_history(){
  const rows = TXN_HISTORY.map(h=>[h.date, tag(h.cls,h.kind), `<b>${h.cust}</b>`, h.title, h.by, `<span class="num">${h.amt}</span>`]);
  return note('顧客ごとの<b>過去取引履歴</b>を一元保存。商談・請求・契約・対応をまたいでキーワード検索でき、営業スマホアプリにも同じ履歴が表示されます。')+
  note('履歴の<b>保存年限は7年</b>（電子帳簿・契約関連に準拠）。旧システムの過去データは<b>CSV移行</b>で取り込めます（コード突合のうえ重複排除）。','eco','clock')+
  toolbar(
    `<div style="position:relative;flex:1;max-width:340px"><input id="txnSearch" class="search grow" style="width:100%;padding-left:34px" placeholder="顧客名・内容・担当でキーワード検索…" oninput="filterTxn(this.value)"><span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--faint)">${ic('search')}</span></div>`+
    `<div class="segmented" id="txnKind"><span class="seg active" onclick="txnKind('すべて',this)">すべて</span><span class="seg" onclick="txnKind('商談',this)">商談</span><span class="seg" onclick="txnKind('見積',this)">見積</span><span class="seg" onclick="txnKind('請求',this)">請求</span><span class="seg" onclick="txnKind('入金',this)">入金</span><span class="seg" onclick="txnKind('契約',this)">契約</span><span class="seg" onclick="txnKind('対応',this)">対応</span><span class="seg" onclick="txnKind('クレーム',this)">クレーム</span></div>`+
    `<span class="spacer"></span>`+
    sel(['期間：すべて','今月','先月','今年度']).replace('<select class="search">','<select class="search" onchange="txnFilter(\'period\',this.value)">')+
    sel(['金額：すべて','〜10万','10〜100万','100万〜']).replace('<select class="search">','<select class="search" onchange="txnFilter(\'amt\',this.value)">')+
    sel(['担当：すべて','梶原','佐藤','鈴木','高橋','山田']).replace('<select class="search">','<select class="search" onchange="txnFilter(\'by\',this.value)">')+
    `<button class="btn" onclick="toast('旧システムからのCSV移行を開始します（コード突合・重複排除のうえ取込）')">${ic('upload')}旧システム移行</button>`+
    btnCsv)+
  `<div id="txnWrap">`+tbl([{t:'日付'},{t:'種別'},{t:'顧客'},{t:'内容'},{t:'担当'},{t:'金額',num:true}],rows,{click:true})+`</div>`;
}
function scr_cust_relation(){
  return `<div class="grid3">
    <div class="panel"><div class="ph">${ic('store','pic')}みなとフード 栄町店 <span class="sub">S-204411</span></div><div class="pb">
      <div class="flow"><span class="step done"><span class="sn">${ic('check')}</span>顧客：みなとフードHD</span><span class="ar"></span><span class="step done"><span class="sn">2</span>管理：関西施設サービス</span><span class="ar"></span><span class="step cur"><span class="sn">3</span>請求先：みなとフード本部経理</span></div>
      <b style="font-size:13px">紐付け作業</b>
      ${tbl([{t:'作業'},{t:'頻度'},{t:'単価',num:true},{t:'状態'}],[
        ['グリストラップ清掃','月次','¥24,000',tag('t-green','有効')],
        ['排水管高圧洗浄','季次','¥58,000',tag('t-green','有効')],
        ['雑排水槽清掃','半年','¥96,000',tag('t-green','有効')],
      ])}
    </div></div>
    <div class="panel"><div class="ph">${ic('clock','pic')}変更履歴</div><div class="pb"><ul class="timeline">
      <li><div class="tt">2026/05/20</div><div class="tx">請求先を「みなとフード本部経理」へ変更</div></li>
      <li><div class="tt">2025/11/02</div><div class="tx">管理会社を「関西施設サービス」へ移管</div></li>
      <li class="eco"><div class="tt">2024/04/01</div><div class="tx">店舗登録・作業3件を紐付け</div></li>
    </ul></div></div>
  </div>`;
}

/* ============================================================
   契約管理
   ============================================================ */
function scr_contract(t){
  if(t===1) return toolbar(`<button class="btn primary">${ic('upload')}PDFアップロード</button><span class="spacer"></span>`+searchBox())+
    tbl([{t:'契約番号'},{t:'ファイル名'},{t:'版'},{t:'アップロード日'},{t:'サイズ'},''],[
      ['<span class="code">K-2024-0411</span>','清掃委託契約_v3.pdf',tag('t-teal','v3 最新'),'2026/03/28','2.4MB',`${A('表示')} ${A('DL')}`],
      ['<span class="code">K-2024-0411</span>','清掃委託契約_v2.pdf',tag('t-gray','v2'),'2025/03/30','2.3MB',A('表示')],
      ['<span class="code">K-2025-0102</span>','排水管メンテ契約_v1.pdf',tag('t-teal','v1'),'2025/01/05','1.9MB',A('表示')],
    ]);
  if(t===2) return note('満了60日前に自動アラート、30日前に更新通知メールを担当営業へ送信します。','warn','warn')+
    tbl([{t:'契約番号'},{t:'顧客'},{t:'満了日'},{t:'残日数',num:true},{t:'更新区分'},{t:'アラート'},''],[
      ['<span class="code">K-2023-0890</span>','みなとフードHD','2026/06/30','30日',tag('t-amber','要交渉'),'🔔 送信済',A('更新手続')],
      ['<span class="code">K-2023-0712</span>','中央総合病院G','2026/07/15','45日',tag('t-green','自動更新'),'予約済',A('確認')],
      ['<span class="code">K-2024-0033</span>','関西モール管理','2026/07/28','58日',tag('t-amber','要交渉'),'予約済',A('更新手続')],
    ]);
  // tab 0
  return kpi([
    {l:'有効契約',v:'842',icon:'contract'},{l:'今月更新',v:'36',d:'',dir:'up',icon:'refresh',accent:'eco'},
    {l:'60日以内 満了',v:'18',d:'要対応',dir:'down',icon:'warn',accent:'amber'},{l:'自動更新',v:'612',icon:'check'},
  ])+
  toolbar(searchBox('契約番号・顧客で検索…')+`<span class="spacer"></span>`+btnNew('契約登録'))+
  tbl([{t:'契約番号'},{t:'顧客'},{t:'契約名'},{t:'契約期間'},{t:'月額',num:true},{t:'状態'}],[
    ['<span class="code">K-2024-0411</span>','みなとフードHD','定期清掃 包括契約','2024/04〜2027/03','¥2,480,000',tag('t-green','有効')],
    ['<span class="code">K-2025-0102</span>','関西モール管理','排水管メンテ契約','2025/01〜2026/12','¥1,180,000',tag('t-green','有効')],
    ['<span class="code">K-2023-0890</span>','グルメテーブル中部FC','清掃委託契約','2023/07〜2026/06','¥980,000',tag('t-amber','満了間近')],
  ],{click:true});
}

/* ============================================================
   営業活動
   ============================================================ */
function scr_sales(t){
  if(t===4) return scr_sales_ai();
  if(t===1) return toolbar(searchBox()+`<span class="spacer"></span>`+btnNew('見積作成'))+
    tbl([{t:'見積番号'},{t:'顧客'},{t:'件名'},{t:'金額',num:true},{t:'版'},{t:'状態'}],[
      ['<span class="code">Q-2026-0312</span>','関西モール管理','梅田モール 排水管洗浄','¥620,000','v2',tag('t-amber','提出済')],
      ['<span class="code">Q-2026-0310</span>','新規・大和ストア','包括清掃見積','¥1,800,000','v1',tag('t-blue','作成中')],
      ['<span class="code">Q-2026-0298</span>','みなとフードHD','グリストラップ増設見積','¥240,000','v3',tag('t-green','受注')],
    ],{click:true});
  if(t===2) return `<div class="grid2">
    <div class="panel"><div class="ph">${ic('clock','pic')}本日のタスク</div><div class="pb"><ul class="timeline">
      <li class="amber"><div class="tt">10:00</div><div class="tx">関西モール 見積提出 <span class="tag t-amber nodot">期限本日</span></div></li>
      <li><div class="tt">14:00</div><div class="tx">みなとフードHD 訪問（新店舗ヒアリング）</div></li>
      <li><div class="tt">17:00</div><div class="tx">週報提出</div></li>
    </ul></div></div>
    <div class="panel"><div class="ph">${ic('bell','pic')}リマインダー</div><div class="pb"><ul class="timeline">
      <li><div class="tt">6/2</div><div class="tx">グルメテーブル 契約更新フォロー</div></li>
      <li><div class="tt">6/5</div><div class="tx">大和ストア 見積回答期限</div></li>
      <li><div class="tt">6/10</div><div class="tx">中央病院G 役員提示</div></li>
    </ul></div></div>
  </div>`;
  if(t===3) return kpi([
    {l:'前年度売上（みなと）',v:'¥24.8M',d:'6.2%',dir:'up',icon:'revenue'},
    {l:'作業件数',v:'512',u:'件',icon:'ops'},{l:'契約数',v:'3',icon:'contract'},{l:'取消率',v:'1.8',u:'%',d:'0.4pt',dir:'down',icon:'check',accent:'eco'},
  ])+`<div class="grid2">
    ${panel(`${ic('sales','pic')}月次売上推移（みなとフードHD）`,`<canvas id="sa1" height="160"></canvas>`)}
    ${panel(`${ic('ops','pic')}作業履歴（直近）`,tbl([{t:'日付'},{t:'店舗'},{t:'作業'},{t:'金額',num:true}],[
      ['5/28','栄町店','グリストラップ清掃','¥24,000'],['5/26','梅田北口店','排水管洗浄','¥58,000'],['5/20','栄町店','雑排水槽清掃','¥96,000'],
    ]))}
  </div>`;
  // tab 0: 訪問・商談
  return toolbar(sel(['種別：すべて','定期訪問','商談','電話','クレーム対応'])+`<span class="spacer"></span>`+btnNew('記録を追加'))+
  tbl([{t:'日付'},{t:'顧客'},{t:'担当'},{t:'種別'},{t:'内容'},{t:'次回アクション'}],[
    ['2026/05/29','みなとフードHD','梶原',tag('t-blue','定期訪問'),'新店舗のグリストラップ清掃見積依頼を受領','6/5 見積提出'],
    ['2026/05/27','関西モール管理','鈴木',tag('t-teal','商談'),'排水管洗浄の年間契約を提案','6/10 役員提示'],
    ['2026/05/25','中央総合病院G','高橋',tag('t-gray','電話'),'夜間作業の日程調整','対応済'],
  ],{click:true});
}

/* ---- AI日報（管理者閲覧） ---- */
const DAILY_REPORTS = [
  {date:'2026/05/29', staff:'梶原 健司', visits:4, deals:2, tag:'t-green', st:'提出済', sum:'みなとフードHDで新店舗ヒアリング。グリストラップ清掃の見積依頼を受領（6/5提出予定）。関西モール梅田は契約更新の感触良好。'},
  {date:'2026/05/29', staff:'鈴木 一郎', visits:3, deals:1, tag:'t-green', st:'提出済', sum:'関西モール管理に排水管洗浄の年間契約を提案。役員提示を6/10に設定。中央病院Gは夜間枠の調整中。'},
  {date:'2026/05/29', staff:'高橋 誠', visits:2, deals:0, tag:'t-amber', st:'下書き', sum:'中央総合病院グループと夜間作業の日程調整（電話）。クレーム対応1件は解決済み。'},
  {date:'2026/05/28', staff:'梶原 健司', visits:5, deals:3, tag:'t-green', st:'承認済', sum:'栄町店の油脂過多トラブルを受け、清掃頻度の見直し（月2回）を提案。追加洗浄の臨時受注を獲得。'},
];
function scr_sales_ai(){
  const rows = DAILY_REPORTS.map(r=>[
    r.date, `<b>${r.staff}</b>`, `<span class="num">${r.visits}</span>`, `<span class="num">${r.deals}</span>`,
    `<span class="ai-pill">${ic('bolt')}AI生成</span>`, tag(r.tag,r.st), A('日報を見る')
  ]);
  return note('営業がスマホアプリに入力した活動内容を <b>AIが標準フォーマットの日報に自動生成</b>。管理者はここで全営業の日報を閲覧・承認できます。','eco','bolt')+
  kpi([
    {l:'本日 提出',v:'8',u:'/12',d:'残4名',dir:'flat',icon:'file'},
    {l:'AI生成 日報',v:'342',u:'件',d:'今月',dir:'up',icon:'bolt',accent:'eco'},
    {l:'承認待ち',v:'5',icon:'clock',accent:'amber'},
    {l:'平均訪問',v:'3.4',u:'件/人',d:'0.3',dir:'up',icon:'pin'},
  ])+
  toolbar(searchBox('担当者・内容で検索…')+sel(['期間：今週','今日','今月'])+sel(['状態：すべて','下書き','提出済','承認済'])+`<span class="spacer"></span>`+btnCsv)+
  tbl([{t:'日付'},{t:'担当者'},{t:'訪問',num:true},{t:'商談',num:true},{t:'作成'},{t:'状態'},''],rows,{click:true})+
  panel(`${ic('bolt','pic')}AI日報プレビュー <span class="sub">2026/05/29 · 梶原 健司</span>`, `
    <div class="ai-report">
      <div class="ai-report-h"><span class="ai-pill">${ic('bolt')}AIが活動記録から自動生成</span><span class="subtle" style="font-size:11.5px">入力3タップ → 標準フォーマットで整形</span></div>
      <div class="arp-sec"><div class="arp-l">サマリ</div><div>本日は大阪エリアを中心に4件訪問。新規見積案件を1件獲得し、契約更新も1件が最終段階に。</div></div>
      <div class="arp-sec"><div class="arp-l">訪問詳細</div><div><b>14:00 みなとフード 栄町店（商談）</b><br>新店舗のグリストラップ清掃見積を依頼受領。6/5提出予定。<br><b>15:30 関西モール 梅田（定期）</b><br>排水管洗浄の契約更新、条件合意に近い。</div></div>
      <div class="arp-sec"><div class="arp-l">次回アクション</div><div>6/5 みなとフード見積提出 ／ 6/10 中央病院G 役員提示</div></div>
      <div class="arp-sec"><div class="arp-l">所感</div><div>栄町店のトラブル履歴を提示できたことで、頻度見直しの提案がスムーズだった。</div></div>
    </div>
    <div class="form-foot"><button class="btn primary" onclick="toast('日報を承認しました')">${ic('check')}承認する</button><button class="btn">${ic('download')}PDF出力</button><button class="btn ghost">差し戻し</button></div>`);
}
