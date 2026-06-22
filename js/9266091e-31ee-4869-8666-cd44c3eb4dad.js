/* ============================================================
   ダイキョウクリーン アプリ（操作版） — モックデータ
   ここを編集すれば各画面の内容が変わります（開発用・独立データ）
   ============================================================ */
const MDATA = {

  /* ---- 営業：今日の訪問（ホーム） ---- */
  todayVisits: [
    { time:'14:00', kind:'商談', name:'みなとフード 栄町店', sub:'新規ヒアリング' },
    { time:'15:30', kind:'定期', name:'関西モール 梅田',     sub:'排水管洗浄 契約更新', hot:true },
    { time:'17:00', kind:'電話', name:'中央総合病院',         sub:'夜間作業 日程調整' },
  ],

  /* ---- 営業：予定（週間） ---- */
  schedule: [
    { day:'5/31（金）· 今日', items:[
      { time:'14:00', kind:'商談', name:'みなとフード 栄町店', sub:'新規ヒアリング' },
      { time:'15:30', kind:'定期', name:'関西モール 梅田',     sub:'排水管洗浄 契約更新' },
    ]},
    { day:'6/2（月）', items:[
      { time:'10:00', kind:'商談', name:'グルメテーブル 三宮店', sub:'見積フォロー' },
      { time:'14:00', kind:'提案', name:'中央総合病院',         sub:'年間契約 役員提示' },
    ]},
  ],

  /* ---- 営業：顧客一覧 ---- */
  customers: [
    { name:'みなとフードHD',        meta:'飲食チェーン · 312店舗', tag:'優良',   tagCls:'mt-green' },
    { name:'関西モール管理',         meta:'商業施設 · 118店舗',     tag:'大口',   tagCls:'mt-teal' },
    { name:'グルメテーブル中部FC',   meta:'飲食チェーン · 167店舗', tag:'',      tagCls:'' },
    { name:'中央総合病院グループ',   meta:'病院・福祉 · 9施設',     tag:'更新中', tagCls:'mt-amber' },
  ],

  /* ---- 営業：取引履歴（カルテ／全履歴・その場提示用） ---- */
  txnHistory: [
    { kind:'商談', cls:'mt-blue',  date:'2026/05/29', title:'新店舗のグリストラップ清掃 見積依頼を受領', amt:'' },
    { kind:'請求', cls:'mt-green', date:'2026/05/31', title:'5月分 請求書を発行（本部経理・合算）', amt:'¥2,728,000' },
    { kind:'対応', cls:'mt-amber', date:'2026/05/28', title:'栄町店 油脂過多の異常報告 → 追加洗浄を提案', amt:'' },
    { kind:'請求', cls:'mt-green', date:'2026/04/30', title:'4月分 請求書を発行', amt:'¥2,610,000' },
    { kind:'契約', cls:'mt-teal',  date:'2026/03/28', title:'定期清掃 包括契約 v3 を更新', amt:'¥2,480,000/月' },
    { kind:'対応', cls:'mt-gray',  date:'2026/02/14', title:'夜間入館の鍵手配ミスで30分遅延（謝罪済）', amt:'' },
    { kind:'商談', cls:'mt-blue',  date:'2025/11/02', title:'管理会社を関西施設SVへ移管', amt:'' },
  ],

  /* ---- AI日報：本日の活動（入力済み） ---- */
  aiActivities: [
    { time:'14:00', kind:'商談', name:'みなとフード 栄町店', memo:'新店舗GT清掃の見積依頼。6/5提出。' },
    { time:'15:30', kind:'定期', name:'関西モール 梅田',     memo:'排水管洗浄の契約更新、合意間近。' },
    { time:'17:00', kind:'電話', name:'中央総合病院',         memo:'夜間作業の日程調整。' },
  ],

  /* ---- AI日報：今週の活動（集計） ---- */
  aiActivitiesWeek: [
    { time:'月', kind:'商談', name:'みなとフードHD ほか3社', memo:'新規見積2件を獲得。GT清掃・排水管が中心。' },
    { time:'火', kind:'定期', name:'関西モール 梅田 ほか',   memo:'契約更新フォロー5件。梅田は条件合意間近。' },
    { time:'水', kind:'電話', name:'中央総合病院グループ',     memo:'夜間作業の日程調整3件。役員提示を6/10に設定。' },
    { time:'木', kind:'対応', name:'グルメテーブル三宮店',     memo:'油脂過多の異常報告に追加洗浄を提案。' },
    { time:'金', kind:'商談', name:'みなとフード 栄町店 ほか', memo:'見積フォロー。受注1件・継続協議2件。' },
  ],

  /* ---- AI日報：今月の活動（集計） ---- */
  aiActivitiesMonth: [
    { time:'第1週', kind:'商談', name:'新規・既存 合計18社', memo:'訪問32件。新規見積7件、受注2件。' },
    { time:'第2週', kind:'定期', name:'関西モール・病院G ほか', memo:'訪問28件。契約更新4件を締結。' },
    { time:'第3週', kind:'対応', name:'みなとフードHD 各店',   memo:'訪問24件。クレーム対応3件を完了、継続維持。' },
    { time:'第4週', kind:'商談', name:'中央総合病院グループ',   memo:'訪問18件。年間契約の役員提示・最終調整。' },
  ],

  /* ---- AI日報：提出した日報（閲覧一覧） ---- */
  dailyReports: [
    { date:'2026/05/28（木）', range:'本日', status:'approved',
      summary:'神戸・西宮エリアを巡回。定期3件と契約更新1件を締結、見積1件を提出。',
      detail:'10:00 関西モール三宮（定期）／作業品質の確認と追加メニュー提案。<br>13:30 西宮ガーデンズ（商談）／年間契約の見積を提出。<br>16:00 みなとフード神戸（定期）／契約更新を締結。',
      next:'6/3 西宮ガーデンズ 見積フォロー',
      impression:'三宮の品質評価が高く、追加メニューの横展開に手応え。' },
    { date:'2026/05/27（水）', range:'本日', status:'returned',
      summary:'京都エリア4件訪問。新規開拓2社にアプローチ、既存2件をフォロー。',
      detail:'京都四条・烏丸エリアを中心に訪問。新規2社へGT清掃を提案。',
      next:'未記入',
      impression:'手応えあり。',
      returnNote:'訪問件数の内訳（商談／定期／電話）と「次回アクション」を具体化のうえ再提出してください。' },
    { date:'2026/05/26（火）', range:'本日', status:'approved',
      summary:'大阪市内5件。クレーム対応1件を追加洗浄の提案で解消、契約更新2件を締結。',
      detail:'グリストラップ油脂過多の異常報告に対し、追加洗浄＋頻度見直しを提案し合意。',
      next:'6/2 栄町店 追加洗浄を実施',
      impression:'トラブル履歴の提示が信頼につながった。' },
    { date:'2026/05/23（金）', range:'今週', status:'approved',
      summary:'今週 訪問18件・受注3件・契約更新4件。新規見積は計5件を獲得。',
      detail:'商談7件／定期6件／電話3件／対応2件。梅田の更新は合意間近。',
      next:'6/5 みなと見積提出 ／ 6/10 中央病院G 役員提示',
      impression:'週次でも実績を可視化でき、上長共有がスムーズ。' },
  ],

  /* ---- 営業：記録 STEP1 店舗候補 ---- */
  recStores: [
    { name:'みなとフード 栄町店', sub:'大阪市中央区 · 月次' },
    { name:'関西モール 梅田',     sub:'大阪市北区 · 季次' },
    { name:'中央総合病院',        sub:'大阪市天王寺区 · 月2回' },
  ],

  /* ---- 営業：記録 STEP2 種別候補 ---- */
  recTypes: [
    { label:'商談',       ic:'msg' },
    { label:'定期訪問',   ic:'cal' },
    { label:'電話・連絡', ic:'phone' },
    { label:'クレーム対応', ic:'warn', danger:true },
  ],

  /* ---- 現場：本日の作業 ---- */
  jobs: [
    { time:'22:00', kind:'作業中', name:'栄町店',   work:'グリストラップ清掃', tag:'進行中', tagCls:'mt-green', hot:true },
    { time:'23:30', kind:'予定',   name:'難波店',   work:'排水管高圧洗浄',     tag:'未着手', tagCls:'mt-gray' },
    { time:'01:00', kind:'予定',   name:'道頓堀店', work:'産廃 収集運搬',       tag:'産廃',   tagCls:'mt-amber' },
  ],

  /* ---- 現場：完了報告（送信済み一覧） ---- */
  reports: [
    { time:'22:48', name:'栄町店',     work:'グリストラップ清掃', photos:3, sludge:'0.8' },
    { time:'21:10', name:'梅田北口店', work:'排水管高圧洗浄',     photos:3, sludge:'—' },
    { time:'19:30', name:'本町店',     work:'雑排水槽清掃',       photos:4, sludge:'1.2' },
  ],

  /* ---- シート選択肢 ---- */
  dateOptions: ['6/2 見積提出','6/5 見積提出','6/10 役員提示','来週 フォロー訪問','再来週 契約確認'],
  memoPhrases: ['異常なし','油脂の堆積が多い','配管に詰まり傾向','次回 頻度見直しを推奨','入館に時間を要した'],

  /* ---- 完了報告の初期値・採番 ---- */
  reportDefault: { name:'栄町店', work:'グリストラップ清掃' },
  jwnetPrefix: '000',

  /* ---- ボトムタブ構成 ---- */
  tabColor: { sales:'var(--brand)', field:'var(--eco)' },
  tabs: {
    sales:[
      { id:'home',  ic:'home', l:'ホーム', act:"tab('s_home')" },
      { id:'sched', ic:'cal',  l:'予定',   act:"tab('s_sched')" },
      { id:'record',ic:'plus', l:'記録',   act:"startRecord()" },
      { id:'cust',  ic:'user', l:'顧客',   act:"tab('s_cust')" },
    ],
    field:[
      { id:'work',   ic:'check',l:'作業', act:"tab('f_home')" },
      { id:'camera', ic:'cam',  l:'撮影', act:"openReport()" },
      { id:'route',  ic:'truck',l:'配車', act:"tab('f_route')" },
      { id:'reports',ic:'doc',  l:'報告', act:"tab('f_reports')" },
    ],
  },
};

/* ---- アイコン（SVG パス） ---- */
const MICON = {
  home:'<path d="M3 12l9-9 9 9M5 10v10h14V10"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M5.5 21a7 7 0 0 1 13 0"/>',
  check:'<path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  cam:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  truck:'<path d="M1 4h13v12H1zM14 8h4l3 3v5h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  store:'<path d="M3 9l1.5-5h15L21 9M4 9v11h16V9"/>',
  msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  warn:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  chev:'<path d="M9 6l6 6-6 6"/>',
};
