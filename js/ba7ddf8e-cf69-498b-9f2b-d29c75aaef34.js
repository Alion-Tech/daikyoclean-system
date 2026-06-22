/* ============================================================
   ダイキョウクリーン 業務管理システム — Data & Icons
   ============================================================ */

/* ---- Line icons (stroke, 24x24) ---- */
const ICON = {
  dashboard:'<path d="M3 13h8V3H3zM13 21h8V3h-8zM3 21h8v-6H3z"/>',
  customer:'<path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
  contract:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
  sales:'<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>',
  ops:'<path d="M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z"/><path d="M9 13l2 2 4-4"/>',
  truck:'<path d="M1 4h13v12H1zM14 8h4l3 3v5h-7"/><circle cx="6" cy="18.5" r="2"/><circle cx="17" cy="18.5" r="2"/>',
  report:'<path d="M9 2h6a2 2 0 0 1 2 2v0h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M8 12h8M8 16h6"/>',
  invoice:'<path d="M5 2h14v20l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  revenue:'<path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  bi:'<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="7"/><rect x="12" y="7" width="3" height="11"/><rect x="17" y="13" width="3" height="5"/>',
  master:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
  bolt:'<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  warn:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  leaf:'<path d="M11 20A7 7 0 0 1 4 13c0-6 7-11 16-11 0 9-5 16-11 16z"/><path d="M4 21c2-6 6-9 11-11"/>',
  store:'<path d="M3 9l1.5-5h15L21 9M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M4 9h16"/><path d="M9 21v-6h6v6"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  refresh:'<path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
  pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  drop:'<path d="M12 2.7s7 7.3 7 12.3a7 7 0 0 1-14 0c0-5 7-12.3 7-12.3z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M5.5 21a7 7 0 0 1 13 0"/>',
  filter:'<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
  edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>',
};
function ic(name,cls){return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${cls?`class="${cls}"`:''}>${ICON[name]||''}</svg>`;}

/* ---- Navigation: 5 categories + dashboard ---- */
const NAV = [
  {type:'item', id:'dashboard', icon:'dashboard', name:'ダッシュボード'},
  {type:'cat', label:'営業・顧客'},
  {type:'item', id:'cust', icon:'customer', name:'顧客・店舗', badge:'3.7k'},
  {type:'item', id:'contract', icon:'contract', name:'契約管理'},
  {type:'item', id:'sales', icon:'sales', name:'営業活動'},
  {type:'cat', label:'現場オペレーション'},
  {type:'item', id:'plan', icon:'calendar', name:'作業計画'},
  {type:'item', id:'ops', icon:'ops', name:'作業実行・報告', badge:'12'},
  {type:'item', id:'fleet', icon:'truck', name:'配車・車両'},
  {type:'item', id:'doc', icon:'report', name:'作業報告書'},
  {type:'cat', label:'請求・売上'},
  {type:'item', id:'invoice', icon:'invoice', name:'請求管理'},
  {type:'item', id:'revenue', icon:'revenue', name:'売上管理'},
  {type:'cat', label:'分析'},
  {type:'item', id:'bi', icon:'bi', name:'BI分析'},
  {type:'cat', label:'設定・管理'},
  {type:'item', id:'master', icon:'master', name:'作業マスタ'},
  {type:'item', id:'integ', icon:'link', name:'外部連携'},
  {type:'item', id:'auth', icon:'shield', name:'権限管理'},
  {type:'item', id:'common', icon:'settings', name:'共通・ログ'},
];

/* Tabs per module — first tab is default */
const TABS = {
  cust:['顧客一覧','顧客新規登録','分類・タグ','請求先','管理会社','店舗一覧','関連・履歴','取引履歴'],
  contract:['契約一覧','契約文書','契約期限'],
  sales:['訪問・商談','見積管理','営業タスク','顧客分析','AI日報'],
  plan:['スケジュール','定期作業生成','臨時作業'],
  ops:['作業実行','完了報告','写真管理','取消管理'],
  fleet:['配車計画','車両管理','運転手','行程照会'],
  doc:['報告書一覧','添付管理','報告書照会'],
  invoice:['請求データ生成','請求書','カスタム書式','電子請求','CSV連携'],
  revenue:['売上登録','集計','顧客分析','作業分析'],
  bi:['経営','売上分析','顧客分析','店舗分析','作業分析','管理会社分析'],
  master:['作業分類','作業項目','価格管理','頻度管理'],
  integ:['kintone','弥生販売','配車システム','報告書システム','Google Maps'],
  auth:['ユーザー管理','権限制御'],
  common:['通知設定','検索','操作ログ','ファイル管理'],
};

const TITLES = {
  dashboard:['経営ダッシュボード','本日の現場稼働・売上・契約を一元把握'],
  cust:['顧客・店舗管理','飲食チェーン・商業施設の顧客と店舗を統合管理'],
  contract:['契約管理','清掃委託契約・定期メンテ契約の一元管理'],
  sales:['営業活動','訪問・見積・商談の進捗を可視化'],
  plan:['作業計画','グリストラップ清掃・排水管洗浄の定期/臨時スケジュール'],
  ops:['作業実行・報告','現場作業の進行・完了報告・写真を記録'],
  fleet:['配車・車両管理','高圧洗浄車・バキューム車の配車と稼働'],
  doc:['作業報告書','写真付き報告書の生成・添付・照会'],
  invoice:['請求管理','作業実績からの請求生成・電子請求'],
  revenue:['売上管理','売上計上・集計・分析'],
  bi:['BI分析','経営・売上・顧客・店舗・作業の多軸分析'],
  master:['作業マスタ','作業分類・項目・価格・頻度のマスタ管理'],
  integ:['外部連携','kintone・弥生販売・配車/報告書システム連携'],
  auth:['権限管理','ユーザー・ロール・権限制御'],
  common:['共通・ログ','通知・検索・操作ログ・ファイル管理'],
};

/* ---- Notifications ---- */
const NOTIFS = [
  {ic:'red',  icon:'warn',  go:'ops:1',      tx:'<b>異常報告</b>：栄町店 グリストラップ槽に油脂過多。要追加洗浄。', tm:'14:18'},
  {ic:'amber',icon:'link',  go:'integ:1',    tx:'弥生販売連携で<b>警告 3件</b>（売上データ）', tm:'今日 02:00'},
  {ic:'teal', icon:'contract', go:'contract:2', tx:'<b>みなとフードHD</b> 清掃委託契約 満了30日前', tm:'昨日'},
  {ic:'eco',  icon:'leaf',  go:'bi:0',       tx:'今月の<b>再資源化率 94%</b> を達成しました', tm:'昨日'},
  {ic:'teal', icon:'truck', go:'fleet:0',    tx:'配車計画「班B」が<b>調整中</b>のまま未確定です', tm:'2日前'},
];

/* ---- 権限モデル（権限管理 → 権限制御 / ユーザーメニューの権限プレビュー） ---- */
// ロール体系：管理者 / マネージャ / 営業 / 事務（＋現場）。key は既存の索引互換のため不変、表示名のみ整合。
const ROLES = [
  {key:'admin', name:'管理者', users:3,  color:'t-red',  desc:'全モジュールへのフルアクセス。権限管理・連携設定を含む。'},
  {key:'mgr',   name:'マネージャ', users:6, color:'t-purple', desc:'担当部門の承認・進捗管理。請求/売上は参照、契約・営業・作業を編集。'},
  {key:'sales', name:'営業', users:8,  color:'t-blue',  desc:'顧客・契約・営業活動を中心に編集可能。請求/売上は参照のみ。<b>自担当顧客のみ</b>閲覧（行レベル）。'},
  {key:'fin',   name:'事務', users:5,  color:'t-green', desc:'請求・売上・入金消込をフル管理。現場系は参照のみ。'},
  {key:'field', name:'現場', users:21, color:'t-teal',  desc:'作業計画・実行・報告・配車を編集。請求/売上には触れない。'},
];
// 末尾に「入金・消込」を追加（NAVと対応しないサブ資源。既存indexは不変）
const PERM_MODS = ['顧客・店舗','契約管理','営業活動','作業計画','作業実行・報告','配車・車両','作業報告書','請求管理','売上管理','BI分析','作業マスタ','外部連携','権限管理','共通・ログ','入金・消込'];
// F=フル A=承認 E=参照・編集 R=参照 N=なし
const PERM = {
  admin:['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
  mgr:  ['E','F','F','A','A','E','E','R','R','R','E','R','N','R','R'],
  sales:['E','E','F','R','R','R','R','R','R','R','R','N','N','R','R'],
  fin:  ['R','R','N','N','R','N','R','F','F','R','E','R','N','R','F'],
  field:['R','N','N','E','F','E','F','N','N','R','R','N','N','R','N'],
};
const PERM_OPT = {F:'フル',A:'承認',E:'参照・編集',R:'参照',N:'なし'};
// 機微リソースの細粒度権限（閲覧／編集／承認）。ロール×リソースで保持。
const PERM_FINE = {
  '請求管理':  {sales:['R','N','N'], mgr:['R','N','N'], field:['N','N','N'], fin:['F','F','A'], admin:['F','F','A']},
  '売上管理':  {sales:['R','N','N'], mgr:['R','N','N'], field:['N','N','N'], fin:['F','F','A'], admin:['F','F','A']},
  '顧客・店舗':{sales:['F','E','N'], mgr:['E','E','N'], field:['R','N','N'], fin:['R','N','N'], admin:['F','F','A']},
};
