/* ============================================================
   Screens — Part B (operations, billing, BI, settings)
   ============================================================ */

/* ============================================================
   作業計画
   ============================================================ */
function scr_plan(t){
  if(t===1) return note('契約の頻度マスタに基づき、翌月の定期作業を一括生成します。生成後に配車計画へ連携されます。','eco','leaf')+
    toolbar(sel(['対象月：2026年6月'])+sel(['対象顧客：すべて'])+`<span class="spacer"></span><button class="btn primary">${ic('bolt')}定期作業を一括生成</button>`)+
    tbl([{t:'顧客'},{t:'対象店舗',num:true},{t:'作業'},{t:'頻度'},{t:'生成予定件数',num:true},{t:'状態'}],[
      ['みなとフードHD','312','グリストラップ清掃','月次','312',tag('t-blue','生成待ち')],
      ['関西モール管理','118','排水管高圧洗浄','季次','118',tag('t-blue','生成待ち')],
      ['グルメテーブル中部FC','167','グリストラップ清掃','月次','167',tag('t-green','生成済')],
    ]);
  if(t===2) return toolbar(`<span class="spacer"></span>`+btnNew('臨時作業を追加'))+
    tbl([{t:'受付日'},{t:'店舗'},{t:'作業'},{t:'希望日'},{t:'区分'},{t:'状態'}],[
      ['5/30','栄町店','緊急 排水詰まり対応','6/1',tag('t-red','緊急'),tag('t-amber','配車調整中')],
      ['5/29','三宮店','グリストラップ追加洗浄','6/3',tag('t-blue','スポット'),tag('t-green','確定')],
    ],{click:true});
  // tab 0: schedule
  return toolbar(`<button class="btn sm">${ic('plus')}作業追加</button><b style="align-self:center;margin-left:6px;font-size:15px">2026年 6月</b><span class="spacer"></span><button class="btn">${ic('refresh')}定期作業を生成</button>`)+
  segmented(['月','リスト','日'],[
    calendarHTML(),
    tbl([{t:'日付'},{t:'店舗'},{t:'作業'},{t:'班'},{t:'時間帯'},{t:'状態'}],[
      ['6/2（月）','栄町店','グリストラップ清掃','班A','09:00',tag('t-blue','予定')],
      ['6/2（月）','梅田北口店','排水管高圧洗浄','班A','11:00',tag('t-blue','予定')],
      ['6/5（木）','難波店','雑排水槽清掃','班B','14:00',tag('t-blue','予定')],
      ['6/12（木）','難波店','高圧洗浄（夜間）','夜間班','22:00',tag('t-amber','夜間')],
    ],{click:true}),
    `<div class="panel"><div class="ph">${ic('clock','pic')}6月2日（月）の作業</div><div class="pb"><ul class="timeline">
      <li><div class="tt">09:00 — 11:00</div><div class="tx">栄町店 — グリストラップ清掃（班A）</div></li>
      <li class="eco"><div class="tt">11:00 — 13:00</div><div class="tx">梅田北口店 — 排水管高圧洗浄（班A）</div></li>
      <li><div class="tt">14:30 — 16:00</div><div class="tx">本町店 — 雑排水槽清掃（班A）</div></li>
    </ul></div></div>`,
  ]);
}
function calendarHTML(){
  const days=[['月'],['火'],['水'],['木'],['金'],['土','sat'],['日','sun']];
  let h='<div class="panel"><div class="pb"><div class="calendar">';
  h+=days.map(d=>`<div class="cal-h ${d[1]||''}">${d[0]}</div>`).join('');
  const ev={
    2:[['栄町店 GT清掃'],['梅田北口 排水管','eco']],
    3:[['三宮店 GT清掃','amber']],
    5:[['難波店 雑排水槽','eco'],['本町店 GT清掃']],
    9:[['栄町店 排水管','eco']],
    10:[['梅田 GT清掃'],['天王寺 産廃','amber']],
    12:[['夜間 難波 高圧洗浄','eco']],
    16:[['三宮店 GT清掃']],
    17:[['西宮 雑排水槽','eco'],['夙川 GT']],
    19:[['梅田北口 産廃','amber']],
    23:[['栄町店 GT清掃']],
    24:[['本町店 排水管','eco']],
  };
  const today=2;
  for(let i=1;i<=30;i++){
    const list=ev[i]||[];
    const shown=list.slice(0,2).map(e=>`<div class="cal-ev ${e[1]||''}">${e[0]}</div>`).join('');
    const more=list.length>2?`<div class="cal-more">+${list.length-2}件</div>`:'';
    h+=`<div class="cal-d ${i===today?'today':''}"><div class="dn">${i}</div>${shown}${more}</div>`;
  }
  h+='</div></div></div>';
  return h;
}

/* ============================================================
   作業実行・報告
   ============================================================ */
function scr_ops(t){
  if(t===1) return `<div class="grid3">
    <div class="panel"><div class="ph">${ic('edit','pic')}完了報告入力 — OP-77120 栄町店</div><div class="pb">
      <div class="flow"><span class="step done"><span class="sn">${ic('check')}</span>予定</span><span class="ar"></span><span class="step done"><span class="sn">${ic('check')}</span>開始</span><span class="ar"></span><span class="step cur"><span class="sn">3</span>完了報告</span><span class="ar"></span><span class="step"><span class="sn">4</span>確定</span></div>
      <div class="form">
        <div class="fld"><label>開始時刻</label><input value="22:05"></div><div class="fld"><label>終了時刻</label><input value="23:48"></div>
        <div class="fld"><label>結果</label><select><option>完了</option><option>一部未完</option><option>中止</option></select></div>
        <div class="fld"><label>作業者数</label><input value="2"></div>
        <div class="fld full"><label>汚泥回収量（産廃）</label><input value="0.8 m³"></div>
        <div class="fld full"><label>備考・異常報告</label><textarea>グリストラップ槽内に油脂の堆積が想定より多い。次回は洗浄頻度を月2回へ見直し推奨。</textarea></div>
      </div>
      <div class="form-foot"><button class="btn primary" onclick="toast('報告を確定しました')">報告を確定</button><button class="btn">${ic('camera')}写真添付</button></div>
    </div></div>
    <div class="panel"><div class="ph">${ic('warn','pic')}異常報告</div><div class="pb">${note('異常報告は担当営業・管理者へ自動通知されます。','warn','warn')}<ul class="timeline">
      <li class="amber"><div class="tt">5/28 栄町店</div><div class="tx">油脂過多（要追加洗浄）</div></li>
      <li><div class="tt">5/26 梅田北口店</div><div class="tx">配管に異常なし</div></li>
    </ul></div></div>
  </div>`;
  if(t===2) return toolbar(`<button class="btn primary">${ic('camera')}写真アップロード</button><span class="spacer"></span>`+sel(['店舗：栄町店','梅田北口店','三宮店']))+
    `<div class="panel"><div class="ph">${ic('camera','pic')}栄町店 / グリストラップ清掃 OP-77120 — 12枚</div><div class="pb"><div class="photo-grid">${
      [['作業前 全景','作業前'],['作業前 槽内','作業前'],['汚泥回収','作業中'],['高圧洗浄','作業中'],['作業後 槽内','作業後'],['作業後 全景','作業後']].map(p=>`<div class="photo">${ic('camera')}<span class="badge-t">${p[1]}</span><div class="cap">${p[0]}</div></div>`).join('')
    }</div></div></div>`;
  if(t===3) return kpi([
    {l:'今月 取消',v:'23',u:'件',d:'4',dir:'down',icon:'check',accent:'eco'},
    {l:'取消率',v:'1.2',u:'%',icon:'bi'},{l:'最多理由',v:'店舗都合',icon:'store'},{l:'再調整済',v:'18',icon:'refresh'},
  ])+
  tbl([{t:'作業ID'},{t:'店舗'},{t:'作業'},{t:'予定日'},{t:'取消理由'},{t:'区分'},''],[
    ['<span class="code">OP-77119</span>','三宮店','GT清掃','6/2','店舗イベントのため',tag('t-amber','店舗都合'),A('再調整')],
    ['<span class="code">OP-77088</span>','岐阜店','排水管洗浄','5/30','悪天候',tag('t-gray','天候'),A('済')],
    ['<span class="code">OP-77051</span>','梅田北口店','雑排水槽','5/28','人員不足',tag('t-red','自社都合'),A('再調整')],
  ],{click:true});
  // tab 0: 作業実行
  return kpi([
    {l:'本日 予定',v:'34',u:'件',icon:'ops'},{l:'作業中',v:'7',icon:'clock',accent:'eco'},
    {l:'完了',v:'18',icon:'check'},{l:'夜間予定',v:'8',icon:'clock',accent:'amber'},
  ])+
  toolbar(sel(['班：すべて','班A','班B','班C','夜間班'])+sel(['状態：すべて','予定','作業中','完了','中止'])+`<span class="spacer"></span>`+btnFilter)+
  tbl([{t:'作業ID'},{t:'店舗'},{t:'作業'},{t:'予定'},{t:'担当'},{t:'状態'},''],[
    ['<span class="code">OP-77120</span>','栄町店','グリストラップ清掃','22:00',tag('t-gray nodot','夜間班'),tag('t-green','作業中'),A('完了報告')],
    ['<span class="code">OP-77121</span>','梅田北口店','排水管高圧洗浄','11:00',tag('t-gray nodot','班A'),tag('t-blue','予定'),A('開始')],
    ['<span class="code">OP-77122</span>','本町店','雑排水槽清掃','14:30',tag('t-gray nodot','班A'),tag('t-blue','予定'),A('開始')],
    ['<span class="code">OP-77119</span>','三宮店','グリストラップ清掃','08:00',tag('t-gray nodot','班C'),tag('t-amber','中止'),A('確認')],
  ],{click:true});
}

/* ============================================================
   配車・車両
   ============================================================ */
function scr_fleet(t){
  if(t===1) return kpi([
    {l:'保有車両',v:'38',icon:'truck'},{l:'稼働中',v:'29',icon:'check',accent:'eco'},
    {l:'整備中',v:'3',icon:'settings',accent:'amber'},{l:'車検30日内',v:'5',d:'要対応',dir:'down',icon:'warn',accent:'amber'},
  ])+
  toolbar(searchBox('車両番号で検索…')+sel(['区分：すべて','高圧洗浄車','バキューム車','産廃収集車'])+`<span class="spacer"></span>`+btnNew('車両登録'))+
  tbl([{t:'車両番号'},{t:'車種'},{t:'区分'},{t:'状態'},{t:'次回車検'},{t:'担当拠点'}],[
    ['<span class="code">なにわ 800 あ 12-34</span>','高圧洗浄車','作業車',tag('t-green','稼働中'),'2026/08/12','本社（西宮）'],
    ['<span class="code">神戸 500 さ 56-78</span>','バキューム車','作業車',tag('t-amber','整備中'),'2026/06/20','本社（西宮）'],
    ['<span class="code">横浜 800 か 90-12</span>','産廃収集車','収集車',tag('t-green','稼働中'),'2026/07/03','京浜事業所'],
  ],{click:true});
  if(t===2) return tbl([{t:'氏名'},{t:'所属'},{t:'保有資格'},{t:'資格期限'},{t:'本日の配車'},{t:'状態'}],[
    ['山田 太郎','本社（西宮）','中型・産廃収集運搬','2028/05','班A（栄町ほか）',tag('t-green','稼働中')],
    ['田中 次郎','本社（西宮）','大型・危険物',tag('t-amber','2026/07 更新'),'班B',tag('t-green','稼働中')],
    ['佐々木 三郎','京浜事業所','大型','2029/01','—',tag('t-gray','休暇')],
  ],{click:true});
  if(t===3) return `<div class="grid3">
    <div class="panel"><div class="ph">${ic('pin','pic')}班A 本日のルート</div><div class="pb"><ul class="timeline">
      <li><div class="tt">09:00</div><div class="tx">栄町店 — グリストラップ清掃</div></li>
      <li><div class="tt">11:00</div><div class="tx">梅田北口店 — 排水管高圧洗浄</div></li>
      <li><div class="tt">14:30</div><div class="tx">本町店 — 雑排水槽清掃</div></li>
      <li class="amber"><div class="tt">16:30</div><div class="tx">産廃処理場 — 汚泥搬入</div></li>
    </ul></div></div>
    <div class="panel"><div class="ph">${ic('truck','pic')}車両行程照会</div><div class="pb">${tbl([{t:'車両'},{t:'走行',num:true},{t:'訪問',num:true},{t:'稼働率',num:true}],[
      ['12-34','82km','5件','91%'],['56-78','104km','4件','88%'],
    ])}<div class="note eco" style="margin:14px 0 0">${ic('leaf')}<div>エコドライブ実践により今月のCO₂排出を前月比 6% 削減。</div></div></div></div>
  </div>`;
  // tab 0: 配車計画
  return note('作業計画から最適ルートを自動生成します。手動でのドラッグ調整にも対応（プロトタイプでは表形式で表示）。')+
  toolbar(`<span class="spacer"></span><button class="btn primary">${ic('bolt')}最適ルート生成</button>`)+
  segmented(['自動配車','手動配車'],[
    tbl([{t:'班'},{t:'車両'},{t:'運転手'},{t:'件数',num:true},{t:'訪問店舗'},{t:'所要',num:true},{t:'状態'}],[
      ['班A','高圧洗浄車 1号','山田','5','栄町→梅田北口→本町→難波→産廃処理場','6.5h',tag('t-green','確定')],
      ['班B','バキューム車 3号','田中','4','三宮→西宮→夙川→芦屋','7.0h',tag('t-amber','調整中')],
      ['夜間班','産廃収集車 1号','佐々木','8','難波→道頓堀エリア 8店舗','5.5h',tag('t-blue','夜間予定')],
    ],{click:true}),
    note('未割当の作業を各班へ手動で割り当てます（行をクリックして担当班を変更）。')+
    tbl([{t:'作業ID'},{t:'店舗'},{t:'作業'},{t:'希望時間帯'},{t:'割当班'},''],[
      ['<span class="code">OP-77131</span>','心斎橋店','グリストラップ清掃','午前',tag('t-gray','未割当'),A('班を割当')],
      ['<span class="code">OP-77132</span>','なんば店','排水管高圧洗浄','午後',tag('t-teal','班A'),A('変更')],
      ['<span class="code">OP-77133</span>','天王寺店','雑排水槽清掃','夜間',tag('t-teal','夜間班'),A('変更')],
    ],{click:true}),
  ]);
}

/* ============================================================
   作業報告書
   ============================================================ */
function scr_doc(t){
  if(t===1) return `<div class="panel"><div class="ph">${ic('file','pic')}RP-202605-0890 栄町店 グリストラップ清掃 — 添付</div><div class="pb"><div class="photo-grid">${
    [['作業前','写真'],['作業中','写真'],['作業後','写真'],['チェックリスト','PDF'],['マニフェスト','PDF'],['完了確認書','PDF']].map(p=>`<div class="photo">${ic(p[1]==='PDF'?'file':'camera')}<span class="badge-t">${p[1]}</span><div class="cap">${p[0]}</div></div>`).join('')
  }</div></div></div>`;
  if(t===2) return toolbar(sel(['顧客：すべて','みなとフードHD','関西モール管理'])+`<input class="search" type="date" style="max-width:160px">`+`<span class="spacer"></span>`+btnCsv)+
    tbl([{t:'報告書番号'},{t:'顧客'},{t:'店舗'},{t:'作業日'},{t:'作業'},''],[
      ['<span class="code">RP-202605-0890</span>','みなとフードHD','栄町店','2026/05/28','グリストラップ清掃',A('表示')],
      ['<span class="code">RP-202605-0885</span>','関西モール管理','梅田モール','2026/05/27','排水管高圧洗浄',A('表示')],
    ],{click:true});
  // tab 0
  return toolbar(`<button class="btn primary">${ic('file')}報告書生成</button><button class="btn">${ic('download')}PDF一括出力</button><span class="spacer"></span>`+searchBox())+
  tbl([{t:'報告書番号'},{t:'店舗'},{t:'作業'},{t:'作業日'},{t:'写真',num:true},{t:'状態'},''],[
    ['<span class="code">RP-202605-0890</span>','栄町店','グリストラップ清掃','2026/05/28','12枚',tag('t-green','確定'),A('PDF')],
    ['<span class="code">RP-202605-0889</span>','梅田北口店','排水管高圧洗浄','2026/05/26','8枚',tag('t-green','確定'),A('PDF')],
    ['<span class="code">RP-202605-0888</span>','三宮店','雑排水槽清掃','2026/05/24','6枚',tag('t-amber','下書き'),A('編集')],
  ],{click:true});
}

/* ============================================================
   請求管理
   ============================================================ */
function scr_invoice(t){
  if(t===1) return toolbar(searchBox('請求書番号・請求先で検索…')+`<span class="spacer"></span><button class="btn">再発行</button>`+btnCsv)+
    tbl([{t:'請求書番号'},{t:'請求先'},{t:'請求月'},{t:'金額',num:true},{t:'発行日'},{t:'状態'},''],[
      ['<span class="code">INV-202605-0011</span>','みなとフード本部経理','2026/05','¥2,728,000','2026/06/01',tag('t-green','発行済'),`${A('PDF')} ${A('修正')}`],
      ['<span class="code">INV-202605-0012</span>','関西モール 管理本部','2026/05','¥1,298,000','2026/06/01',tag('t-amber','下書き'),A('編集')],
      ['<span class="code">INV-202604-0009</span>','グルメテーブル中部FC','2026/04','¥1,078,000','2026/05/01',tag('t-green','発行済'),A('PDF')],
    ],{click:true});
  if(t===2) return note('顧客ごとに請求書テンプレート・明細粒度（店舗別／作業別）を設定できます。')+
    tbl([{t:'顧客'},{t:'テンプレート'},{t:'明細粒度'},{t:'ロゴ'},{t:'状態'}],[
      ['みなとフードHD','標準A（合算）','店舗別小計','あり',tag('t-green','適用中')],
      ['関西モール管理','カスタムB','作業別明細','あり',tag('t-green','適用中')],
      ['グルメテーブル中部FC','標準A','合計のみ','なし',tag('t-green','適用中')],
    ]);
  if(t===3) return kpi([
    {l:'今月 電子発行',v:'742',d:'',dir:'up',icon:'mail',accent:'eco'},{l:'メール送信済',v:'698',icon:'mail'},
    {l:'未開封',v:'44',icon:'clock',accent:'amber'},{l:'紙発行',v:'164',icon:'file'},
  ])+
  toolbar(`<button class="btn primary">${ic('mail')}一括メール送信</button><button class="btn">${ic('download')}PDF一括出力</button>`)+
  tbl([{t:'請求書番号'},{t:'請求先'},{t:'送信先'},{t:'送信状態'},{t:'開封'}],[
    ['<span class="code">INV-202605-0011</span>','みなとフード本部経理','keiri@minatofood.jp',tag('t-green','送信済'),'✓ 開封'],
    ['<span class="code">INV-202605-0012</span>','関西モール 管理本部','ap@kansai-mall.jp',tag('t-amber','予約'),'—'],
  ]);
  if(t===4) return `<div class="grid2">
    <div class="panel"><div class="ph">${ic('download','pic')}CSV出力</div><div class="pb"><div class="form">
      <div class="fld"><label>出力対象</label><select><option>請求明細</option><option>請求ヘッダ</option><option>売上連携用</option></select></div>
      <div class="fld"><label>対象期間</label><input value="2026/05"></div>
    </div><div class="form-foot"><button class="btn primary" onclick="toast('CSVを出力しました')">${ic('download')}CSV出力</button></div><div class="hint">${ic('info')}<span>弥生販売・kintone連携フォーマットに対応。</span></div></div></div>
    <div class="panel"><div class="ph">${ic('upload','pic')}CSV取込</div><div class="pb">${note('入金消込・外部見積データの取込に対応。取込前にプレビュー検証されます。')}<button class="btn">${ic('upload')}ファイルを選択</button></div></div>
  </div>`;
  // tab 0: 請求データ生成
  return `<div class="flow"><span class="step done"><span class="sn">${ic('check')}</span>作業完了データ</span><span class="ar"></span><span class="step cur"><span class="sn">2</span>請求変換</span><span class="ar"></span><span class="step"><span class="sn">3</span>請求書生成</span><span class="ar"></span><span class="step"><span class="sn">4</span>電子請求</span></div>`+
  toolbar(sel(['締日：5月末','20日','15日'])+`<button class="btn primary">${ic('bolt')}一括生成</button><button class="btn">個別生成</button><button class="btn">${ic('plus')}手動登録</button>`)+
  tbl([{t:'請求先'},{t:'対象作業',num:true},{t:'金額(税抜)',num:true},{t:'消費税',num:true},{t:'合計',num:true},{t:'状態'},''],[
    ['みなとフード本部経理','512','¥2,480,000','¥248,000','<b>¥2,728,000</b>',tag('t-blue','生成待ち'),A('確認')],
    ['関西モール 管理本部','280','¥1,180,000','¥118,000','<b>¥1,298,000</b>',tag('t-blue','生成待ち'),A('確認')],
    ['グルメテーブル中部FC','301','¥980,000','¥98,000','<b>¥1,078,000</b>',tag('t-green','生成済'),A('表示')],
  ],{click:true});
}

/* ============================================================
   売上管理
   ============================================================ */
function scr_revenue(t){
  if(t===1) return segmented(['月度集計','年度集計'],[
    `<div class="grid2">
      ${panel(`${ic('revenue','pic')}月度売上推移（当年度）`,`<canvas id="rv1" height="170"></canvas>`)}
      ${panel(`${ic('bi','pic')}月度サマリ`,tbl([{t:'月'},{t:'売上',num:true},{t:'前年比',num:true},{t:'件数',num:true}],[
        ['4月','¥38.2M','+5.1%','2,810'],['5月','¥38.6M','+5.4%','2,950'],
      ]))}
    </div>`,
    `<div class="grid2">
      ${panel(`${ic('sales','pic')}年度売上推移`,`<canvas id="rvy1" height="170"></canvas>`)}
      ${panel(`${ic('bi','pic')}年度サマリ`,tbl([{t:'年度'},{t:'売上',num:true},{t:'前年比',num:true},{t:'件数',num:true}],[
        ['2024年度','¥402M','+3.6%','34,200'],['2025年度','¥412M','+2.5%','35,100'],['2026年度（進行）','¥77M','+5.2%','5,760'],
      ]))}
    </div>`,
  ]);
  if(t===2) return `<div class="grid2">
    ${panel(`${ic('customer','pic')}顧客別売上 TOP5`,`<canvas id="rv2" height="180"></canvas>`)}
    ${panel(`${ic('store','pic')}店舗別売上 TOP5`,tbl([{t:'店舗'},{t:'売上',num:true},{t:'件数',num:true}],[
      ['みなと 栄町店','¥2.1M','48'],['みなと 梅田北口','¥1.8M','42'],['関西モール 梅田','¥1.2M','38'],
    ]))}
  </div>`;
  if(t===3) return `<div class="grid2">
    ${panel(`${ic('drop','pic')}作業別売上構成`,`<canvas id="rv3" height="200"></canvas>`)}
    ${panel(`${ic('ops','pic')}作業別 件数・平均単価`,tbl([{t:'作業'},{t:'売上',num:true},{t:'件数',num:true},{t:'平均単価',num:true}],[
      ['グリストラップ清掃','¥182M','7,012','¥25,980'],['排水管高圧洗浄','¥96M','1,820','¥52,750'],['雑排水槽清掃','¥61M','640','¥95,300'],
    ]))}
  </div>`;
  // tab 0: 売上登録
  return toolbar(`<button class="btn primary">${ic('plus')}売上登録</button><button class="btn">作業から自動生成</button><span class="spacer"></span>`+searchBox())+
  tbl([{t:'売上番号'},{t:'計上日'},{t:'顧客'},{t:'作業／契約'},{t:'金額',num:true},{t:'区分'},{t:'状態'}],[
    ['<span class="code">R-202605-1120</span>','2026/05/31','みなとフードHD','定期清掃','¥2,480,000',tag('t-blue','自動'),tag('t-green','確定')],
    ['<span class="code">R-202605-1121</span>','2026/05/31','関西モール管理','排水管メンテ','¥1,180,000',tag('t-blue','自動'),tag('t-green','確定')],
    ['<span class="code">R-202605-1099</span>','2026/05/28','中央総合病院G','スポット清掃','¥185,000',tag('t-amber','手動'),tag('t-amber','修正')],
  ],{click:true});
}

/* ============================================================
   BI分析
   ============================================================ */
function scr_bi(t){
  if(t===1) return `<div class="grid2">
    ${panel(`${ic('revenue','pic')}年度推移`,`<canvas id="bi1" height="170"></canvas>`)}
    ${panel(`${ic('sales','pic')}成長率分析`,`<canvas id="bi2" height="170"></canvas>`)}
  </div>`;
  if(t===2) return `<div class="grid2">
    ${panel(`${ic('customer','pic')}顧客ランキング`,`<canvas id="bi3" height="180"></canvas>`)}
    ${panel(`${ic('bi','pic')}顧客の成長／流失`,tbl([{t:'区分'},{t:'顧客数',num:true},{t:'売上影響',num:true}],[
      [tag('t-green','成長顧客'),'142','+¥8.2M'],[tag('t-amber','横ばい'),'180','—'],[tag('t-red','流失リスク'),'38','-¥2.1M'],
    ]))}
  </div>`;
  if(t===3) return `<div class="grid2">
    ${panel(`${ic('store','pic')}店舗別営収 TOP`,`<canvas id="bi4" height="180"></canvas>`)}
    ${panel(`${ic('pin','pic')}エリア別営収`,`<canvas id="bi5" height="180"></canvas>`)}
  </div>`;
  if(t===4) return `<div class="grid2">
    ${panel(`${ic('drop','pic')}作業別 営収・件数`,`<canvas id="bi6" height="180"></canvas>`)}
    ${panel(`${ic('bi','pic')}作業別 粗利率`,tbl([{t:'作業'},{t:'売上',num:true},{t:'原価率',num:true},{t:'粗利率',num:true}],[
      ['グリストラップ清掃','¥182M','58%','42%'],['排水管高圧洗浄','¥96M','52%','48%'],['雑排水槽清掃','¥61M','61%','39%'],
    ]))}
  </div>`;
  if(t===5) return `<div class="grid2">
    ${panel(`${ic('link','pic')}管理会社別 営収`,`<canvas id="bi7" height="180"></canvas>`)}
    ${panel(`${ic('refresh','pic')}店舗移管分析`,tbl([{t:'管理会社'},{t:'管理店舗',num:true},{t:'今期 移入',num:true},{t:'移出',num:true}],[
      ['関西施設サービス','1,240','+12','-4'],['東日本ビル管理','980','+8','-2'],['京浜メンテナンス','620','+15','-1'],
    ]))}
  </div>`;
  // tab 0: 経営
  return kpi([
    {l:'当月売上',v:'¥38.6M',d:'5.4% 前年比',dir:'up',icon:'revenue'},
    {l:'当年度累計',v:'¥412M',d:'4.8%',dir:'up',icon:'sales'},
    {l:'作業完了率',v:'98.6',u:'%',d:'0.5pt',dir:'up',icon:'check',accent:'eco'},
    {l:'取消率',v:'1.2',u:'%',d:'0.3pt',dir:'down',icon:'bi'},
    {l:'再資源化率',v:'94',u:'%',d:'目標達成',dir:'up',icon:'leaf',accent:'eco'},
  ])+
  `<div class="grid3">
    ${panel(`${ic('sales','pic')}月度売上推移`,`<canvas id="bm1" height="150"></canvas>`,'当年度 vs 前年度')}
    ${panel(`${ic('drop','pic')}作業タイプ別構成`,`<canvas id="bm2" height="150"></canvas>`)}
  </div>
  <div class="grid2">
    ${panel(`${ic('customer','pic')}顧客別売上 TOP5`,`<canvas id="bm3" height="170"></canvas>`)}
    ${panel(`${ic('pin','pic')}エリア別売上`,`<canvas id="bm4" height="170"></canvas>`)}
  </div>`;
}

/* ============================================================
   作業マスタ
   ============================================================ */
function scr_master(t){
  if(t===1) return toolbar(searchBox()+`<span class="spacer"></span>`+btnNew('作業項目登録'))+
    tbl([{t:'作業コード'},{t:'作業項目'},{t:'タイプ'},{t:'標準工数',num:true},{t:'標準単価',num:true},{t:'状態'},''],[
      ['<span class="code">WT01-GT-007</span>','グリストラップ清掃','清掃','2.0h','¥24,000',tag('t-green','有効'),A('編集')],
      ['<span class="code">WT01-DR-002</span>','排水管高圧洗浄','清掃','3.0h','¥58,000',tag('t-green','有効'),A('編集')],
      ['<span class="code">WT02-TK-004</span>','雑排水槽清掃','清掃','4.0h','¥96,000',tag('t-green','有効'),A('編集')],
      ['<span class="code">WT03-WS-001</span>','産業廃棄物 収集運搬','産廃','1.5h','¥18,000',tag('t-green','有効'),A('編集')],
    ],{click:true});
  if(t===2) return segmented(['標準価格','顧客別','セット','期間'],[
    /* 標準価格 */
    tbl([{t:'作業'},{t:'標準単価',num:true},{t:'適用'},{t:'更新日'},''],[
      ['グリストラップ清掃','¥24,000','全顧客共通','2026/04/01',A('編集')],
      ['排水管高圧洗浄','¥58,000','全顧客共通','2026/04/01',A('編集')],
      ['雑排水槽清掃','¥96,000','全顧客共通','2026/04/01',A('編集')],
      ['産業廃棄物 収集運搬','¥18,000','全顧客共通','2026/04/01',A('編集')],
    ]),
    /* 顧客別 */
    toolbar(`<span style="font-weight:700;font-size:13px;align-self:center">顧客別 単価設定</span>`+sel(['みなとフードHD','関西モール管理','グルメテーブル中部FC','中央総合病院グループ'])+`<span class="spacer"></span>`+btnNew('顧客別単価を追加'))+
    note('顧客別価格は標準価格を上書きします。上の顧客を切り替えると、その顧客に設定された単価が表示されます。')+
    tbl([{t:'作業'},{t:'標準単価',num:true},{t:'顧客別単価',num:true},{t:'適用期間'},''],[
      ['グリストラップ清掃','¥24,000','<b>¥22,000</b>','通年',A('編集')],
      ['排水管高圧洗浄','¥58,000','<b>¥54,000</b>','通年',A('編集')],
      ['雑排水槽清掃','¥96,000','¥96,000','通年',A('編集')],
    ]),
    /* セット */
    note('複数作業をまとめたセット価格。単品合計より割安に設定できます。')+
    tbl([{t:'セット名'},{t:'含む作業'},{t:'単品合計',num:true},{t:'セット価格',num:true},''],[
      ['厨房まるごとパック','GT清掃＋排水管洗浄','¥82,000','<b>¥74,000</b>',A('編集')],
      ['年次総点検パック','排水管＋雑排水槽＋点検','¥168,000','<b>¥150,000</b>',A('編集')],
    ]),
    /* 期間 */
    note('期間価格（キャンペーン等）が設定されている場合は、標準・顧客別より優先されます。','warn','warn')+
    tbl([{t:'作業'},{t:'通常単価',num:true},{t:'期間単価',num:true},{t:'適用期間'},{t:'状態'}],[
      ['雑排水槽清掃','¥96,000','<b>¥88,000</b>','2026/07〜09（夏季）',tag('t-amber','予約')],
      ['グリストラップ清掃','¥24,000','<b>¥21,000</b>','2026/06 限定',tag('t-green','適用中')],
    ]),
  ]);
  if(t===3) return `<div class="cards">${[['月次','毎月実施','1,820'],['季次','3ヶ月毎','640'],['半年','6ヶ月毎','410'],['年次','年1回','220'],['カスタム','任意周期','95']].map(f=>`<div class="kpi"><div class="lbl">${f[0]}</div><div style="font-weight:600;margin:6px 0 8px;font-size:13px">${f[1]}</div><div class="val tnum" style="font-size:22px;color:var(--brand)">${f[2]}<small>件</small></div></div>`).join('')}</div>`+
    panel(`${ic('calendar','pic')}カスタム周期の設定例`,tbl([{t:'顧客'},{t:'作業'},{t:'周期'},{t:'次回予定'}],[
      ['中央総合病院G','排水管点検','隔週（2週毎）','2026/06/12'],['みなとフードHD','グリストラップ点検','45日毎','2026/06/20'],
    ]));
  // tab 0: 作業分類
  return `<div class="grid2">
    ${panel(`${ic('master','pic')}作業タイプ／グループ`,tbl([{t:'コード'},{t:'作業タイプ'},{t:'グループ'},{t:'項目数',num:true}],[
      ['WT01','清掃','定期メンテ','24'],['WT02','槽内清掃','定期メンテ','12'],['WT03','産廃収集運搬','スポット','9'],['WT04','緊急対応','スポット','12'],
    ]))}
    ${panel(`${ic('info','pic')}作業コード体系`,note('作業コードは「タイプ-グループ-連番」で自動構成されます（例：WT01-GT-007）。')+tbl([{t:'作業コード'},{t:'作業名'},{t:'タイプ'}],[
      ['WT01-GT-007','グリストラップ清掃','清掃'],['WT01-DR-002','排水管高圧洗浄','清掃'],['WT03-WS-001','産業廃棄物収集運搬','産廃'],
    ]))}
  </div>`;
}

/* ============================================================
   外部連携
   ============================================================ */
function scr_integ(t){
  const sets=[
    {n:'kintone連携',dir:'双方向',freq:'毎時バッチ（:00）',diff:[
      ['顧客 C-100244 関西モール管理','店舗数 118','店舗数 117','05/31 14:00','未解消'],
      ['店舗 S-204388 三宮店','作業頻度：月次','作業頻度：月2回','05/31 14:00','確認中'],
    ],rows:[['顧客マスタ同期','API','毎時 :00','05/31 14:00','正常'],['店舗マスタ同期','API','毎時 :00','05/31 14:00','正常'],['作業マスタ同期','手動','—','05/30 18:22','正常']]},
    {n:'弥生販売連携',dir:'一方向',freq:'日次バッチ（02:00）',diff:[
      ['請求 INV-202605-0012','¥1,298,000','¥1,289,000','05/31 02:00','未解消'],
      ['売上 2026/05 関西モール','¥1,298,000','（連携先に未登録）','05/31 02:00','未解消'],
      ['売上 2026/05 グルメテーブル','¥1,078,000','¥1,078,000','05/31 02:00','解消済'],
    ],rows:[['請求データ同期','CSV','日次 02:00','05/31 02:00','正常'],['売上データ同期','CSV','日次 02:00','05/31 02:00','<span class="tag t-amber nodot">警告 3件</span>']]},
    {n:'配車システム連携',dir:'双方向',freq:'API（15分毎）',diff:[
      ['作業 OP-77120 栄町店','予定 09:00','予定 09:30','05/31 14:15','確認中'],
    ],rows:[['顧客同期','API','毎時','05/31 14:00','正常'],['作業同期','API','15分毎','05/31 14:15','正常']]},
    {n:'報告書システム連携',dir:'一方向',freq:'API（リアルタイム）',diff:[],rows:[['作業結果同期','API','リアルタイム','05/31 14:18','正常'],['写真同期','API','リアルタイム','05/31 14:18','正常']]},
    {n:'Google Maps 連携',maps:true,dir:'一方向',freq:'随時（住所登録時）',diff:[],rows:[['住所ジオコーディング','API','住所登録時','05/31 11:42','正常'],['配車ルート最適化','API','配車計画時','05/31 09:05','正常']]},
  ];
  const s=sets[t]||sets[0];
  let mapsKpis;
  if(s.maps){
    // ライブカウンタ（localStorage 永続化）から算出
    const gs=(typeof geoStats==='function')?geoStats():{calls:{},hits:{}};
    const today=(typeof geoTodayCalls==='function')?geoTodayCalls(gs):0;
    const monthCalls=(typeof geoMonthCalls==='function')?geoMonthCalls(gs):0;
    const hits=(typeof geoTotalHits==='function')?geoTotalHits(gs):0;
    const totCalls=(typeof geoTotalCalls==='function')?geoTotalCalls(gs):0;
    const cap=(typeof GEO_CAP!=='undefined')?GEO_CAP:10000;
    const rate=(hits+totCalls)>0 ? Math.round(hits/(hits+totCalls)*100) : 0;
    const near = monthCalls >= cap*0.8;
    mapsKpis=[
      {l:'本日 API呼出',v:String(today),u:'件',icon:'pin'},
      {l:'キャッシュヒット率',v:String(rate),u:'%',d:'呼出を抑制',dir:'up',icon:'refresh',accent:'eco'},
      {l:'月間上限',v:cap.toLocaleString('ja-JP'),u:'件',d:'当月 '+monthCalls.toLocaleString('ja-JP')+'件',dir:'flat',icon:'link',accent:near?'amber':undefined},
      {l:'エラー',v:'0',icon:'check',accent:'eco'},
    ];
  }
  const kpis = s.maps ? mapsKpis : [
    {l:'連携ジョブ',v:String(s.rows.length),icon:'link'},{l:'本日 同期',v:'48',icon:'refresh'},
    {l:'エラー',v:'0',icon:'check',accent:'eco'},{l:'最終同期',v:'14:18',icon:'clock'},
  ];
  // 連携方向（一方向→／双方向⇄）・同期頻度の表示
  const dirTag = s.dir==='双方向' ? tag('t-teal','双方向 ⇄') : tag('t-blue','一方向 →');
  const metaStrip = `<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:0 0 14px;font-size:12.5px">
    <span class="subtle" style="font-weight:600">連携方向</span>${dirTag}
    <span class="subtle" style="font-weight:600;margin-left:8px">同期頻度</span>${tag('t-gray',s.freq)}
    <span style="margin-left:auto"></span>${ic('clock')}<span class="subtle">${s.dir==='双方向'?'自社⇄連携先 を相互反映':'自社→連携先 へ一方向反映'}・定義頻度で自動同期</span>
  </div>`;
  // 差異一覧（対象／自社値／連携先値／検出日時／状態）＋ 確認/解消アクション
  const diff=s.diff||[];
  const open=diff.filter(d=>d[4]!=='解消済').length;
  const diffBadge = open?`<span class="tag t-amber nodot">差異 ${open}件</span> <span class="tag t-red nodot">${ic('bell')}管理者へ通知済</span>`
                        :`<span class="tag t-green nodot">差異なし</span>`;
  const stTag=st=> st==='解消済'?tag('t-green','解消済'):(st==='確認中'?tag('t-amber','確認中'):tag('t-red','未解消'));
  const diffSection = panel(`${ic('warn','pic')}差異一覧 <span class="sub">自社データと連携先データの不一致</span>`,
    metaStrip+
    (diff.length?
      tbl([{t:'対象'},{t:'自社値'},{t:'連携先値'},{t:'検出日時'},{t:'状態'},{t:'操作'}],
        diff.map(d=>[`<b>${d[0]}</b>`,d[1],d[2],`<span class="subtle">${d[3]}</span>`,stTag(d[4]),
          d[4]==='解消済'?'<span class="subtle">—</span>':`<span class="lnk" data-diff="確認" onclick="integDiff(this,'確認')">確認</span> <span class="lnk" data-diff="解消" onclick="integDiff(this,'解消')">解消</span>`
        ]))
      :note('現在、検出されている差異はありません。','eco','check'))+
    (open?note('差異検出時は<b>管理者へ自動通知</b>（メール＋システム）。各行の「確認／解消」で手動対応できます。','warn','warn'):''));
  return kpi(kpis)+
    (s.maps?note('同一住所はキャッシュを再利用しAPI呼出を抑制。月間API上限の範囲内で運用します。','warn','warn'):'')+
  toolbar(`<button class="btn primary">${ic('refresh')}今すぐ同期</button><button class="btn">${ic('settings')}連携設定</button><span class="spacer"></span>${diffBadge}`)+
  tbl([{t:'同期項目'},{t:'方式'},{t:'スケジュール'},{t:'最終実行'},{t:'状態'}],s.rows.map(r=>{
    r=r.slice();r[4]=r[4]==='正常'?tag('t-green','正常'):r[4];return r;
  }))+
  diffSection;
}
// 差異の手動対応（確認／解消）→ toast
function integDiff(el,act){
  const tr=el.closest('tr'); const target=tr?(tr.querySelector('b')?tr.querySelector('b').textContent:'対象'):'対象';
  if(act==='解消'){
    if(tr){ const cells=tr.children; if(cells.length>=6){ cells[4].innerHTML=`<span class="tag t-green">解消済</span>`; cells[5].innerHTML='<span class="subtle">—</span>'; } }
    toast('差異を解消としてマークしました（'+target+'）');
  }else{
    toast('差異を確認済にしました（'+target+'）');
  }
}

/* ============================================================
   権限管理
   ============================================================ */
function scr_auth(t){
  if(t===1) return scr_auth_roles();
  // tab 0
  return toolbar(searchBox()+`<span class="spacer"></span>`+btnNew('ユーザー追加'))+
  tbl([{t:'ユーザーID'},{t:'氏名'},{t:'部門'},{t:'役割'},{t:'ロール'},{t:'状態'}],[
    ['u-kajiwara','梶原','営業部','営業担当',tag('t-blue','営業'),tag('t-green','有効')],
    ['u-suzuki','鈴木','営業部','課長',tag('t-purple','マネージャ'),tag('t-green','有効')],
    ['u-yamada','山田','現場部','作業班長',tag('t-teal','現場'),tag('t-green','有効')],
    ['u-sato','佐藤','管理部','事務',tag('t-green','事務'),tag('t-green','有効')],
    ['u-admin','管理者','管理部','システム',tag('t-red','管理者'),tag('t-green','有効')],
  ],{click:true});
}

/* ============================================================
   共通・ログ
   ============================================================ */
/* ---- 全域検索（顧客・請求 ライブ絞り込み） ---- */
const SEARCH_CUST = [
  {code:'C-100245', name:'みなとフードホールディングス', kind:'飲食チェーン', stores:'312店舗', by:'佐藤'},
  {code:'C-100244', name:'関西モール管理', kind:'商業施設', stores:'118店舗', by:'鈴木'},
  {code:'C-100240', name:'グルメテーブル中部FC', kind:'飲食チェーン', stores:'167店舗', by:'梶原'},
  {code:'C-100236', name:'中央総合病院グループ', kind:'病院・福祉', stores:'9施設', by:'高橋'},
  {code:'C-100231', name:'大学生協連合 関西', kind:'学校', stores:'24拠点', by:'佐藤'},
];
const SEARCH_INV = [
  {code:'INV-202605-0011', to:'みなとフード本部経理', month:'2026/05', amt:'¥2,728,000', st:'発行済'},
  {code:'INV-202605-0012', to:'関西モール 管理本部', month:'2026/05', amt:'¥1,298,000', st:'下書き'},
  {code:'INV-202604-0009', to:'グルメテーブル中部FC', month:'2026/04', amt:'¥1,078,000', st:'発行済'},
  {code:'INV-202605-0021', to:'中央総合病院グループ', month:'2026/05', amt:'¥185,000', st:'発行済'},
];
function scr_global_search(){
  return panel(`${ic('search','pic')}全域検索`,`
    <div style="position:relative"><input id="gsInput" class="search" style="width:100%;padding:12px 14px 12px 40px;font-size:15px" placeholder="顧客名・コード・請求書番号・宛先でキーワード検索…" oninput="runGlobalSearch(this.value)" autofocus><span style="position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--faint)">${ic('search')}</span></div>
    <div class="chips" style="margin-top:12px"><span class="subtle" style="font-size:11.5px;font-weight:600">よく検索：</span>
      <span class="chip add" onclick="quickSearch('みなと')">みなと</span><span class="chip add" onclick="quickSearch('関西モール')">関西モール</span><span class="chip add" onclick="quickSearch('INV-2026')">INV-2026</span><span class="chip add" onclick="quickSearch('病院')">病院</span></div>`)+
  `<div id="gsResults">`+globalSearchResults('')+`</div>`;
}
function globalSearchResults(q){
  q=(q||'').trim().toLowerCase();
  const mc = SEARCH_CUST.filter(c=> !q || (c.name+c.code+c.kind+c.by).toLowerCase().includes(q));
  const mi = SEARCH_INV.filter(v=> !q || (v.to+v.code+v.month).toLowerCase().includes(q));
  if(q && !mc.length && !mi.length)
    return `<div class="empty">${ic('search')}<div class="et">「${q}」に一致する結果がありません</div><div>顧客名・コード・請求書番号でお試しください</div></div>`;
  let h='';
  if(mc.length) h += panel(`${ic('customer','pic')}顧客 <span class="sub">${mc.length}件</span>`,
    tbl([{t:'顧客コード'},{t:'顧客名'},{t:'分類'},{t:'規模'},{t:'担当'}],
      mc.map(c=>[`<span class="code">${c.code}</span>`,`<b>${hl(c.name,q)}</b>`,tag('t-teal',c.kind),c.stores,c.by]),{click:true}));
  if(mi.length) h += panel(`${ic('invoice','pic')}請求書 <span class="sub">${mi.length}件</span>`,
    tbl([{t:'請求書番号'},{t:'宛先'},{t:'請求月'},{t:'金額',num:true},{t:'状態'}],
      mi.map(v=>[`<span class="code">${hl(v.code,q)}</span>`,hl(v.to,q),v.month,`<span class="num">${v.amt}</span>`,tag(v.st==='発行済'?'t-green':'t-amber',v.st)]),{click:true}));
  return h;
}
function hl(text,q){ if(!q) return text; const i=text.toLowerCase().indexOf(q); if(i<0) return text; return text.slice(0,i)+`<mark>${text.slice(i,i+q.length)}</mark>`+text.slice(i+q.length); }

function scr_common(t){
  if(t===1) return scr_global_search();
  if(t===2) return segmented(['操作ログ','変更履歴','ログイン履歴'],[
    tbl([{t:'日時'},{t:'ユーザー'},{t:'操作'},{t:'対象'},{t:'IP'}],[
      ['2026/05/31 14:20','梶原',tag('t-blue','更新'),'顧客 C-100245','10.0.2.31'],
      ['2026/05/31 14:05','佐藤',tag('t-green','発行'),'請求書 INV-…0011','10.0.2.44'],
      ['2026/05/31 09:02','山田',tag('t-teal','登録'),'作業報告 OP-77120','mobile'],
    ]),
    tbl([{t:'日時'},{t:'対象'},{t:'項目'},{t:'変更前'},{t:'変更後'}],[
      ['2026/05/20','S-204411 栄町店','請求先','—','みなとフード本部経理'],
      ['2025/11/02','S-204411 栄町店','管理会社','旧管理','関西施設サービス'],
      ['2026/04/01','作業 GT清掃','標準単価','¥23,000','¥24,000'],
    ]),
    tbl([{t:'日時'},{t:'ユーザー'},{t:'端末'},{t:'IP'},{t:'結果'}],[
      ['2026/05/31 08:55','梶原','PC（Chrome）','10.0.2.31',tag('t-green','成功')],
      ['2026/05/31 08:40','山田','モバイル','mobile',tag('t-green','成功')],
      ['2026/05/30 22:10','不明','PC','203.0.113.5',tag('t-red','失敗')],
    ]),
  ]);
  if(t===3) return `<div class="cards">${[['PDF','請求書・契約・報告書','12,480'],['Excel','集計・出力','3,210'],['CSV','連携データ','8,902'],['画像','作業写真','48,310']].map(f=>`<div class="kpi"><div class="lbl">${f[0]}</div><div style="margin:6px 0 8px;font-size:12.5px;color:var(--ink-2)">${f[1]}</div><div class="val tnum" style="font-size:21px;color:var(--brand)">${f[2]}<small>件</small></div></div>`).join('')}</div>`+
    panel(`${ic('file','pic')}最近のファイル`,tbl([{t:'ファイル名'},{t:'種別'},{t:'関連'},{t:'更新日'}],[
      ['INV-202605-0011.pdf',tag('t-red','PDF'),'請求','6/01'],['売上集計_202605.xlsx',tag('t-green','Excel'),'売上','5/31'],['弥生連携_202605.csv',tag('t-blue','CSV'),'連携','5/31'],
    ]));
  // tab 0: 通知設定
  return `<div class="grid2">
    ${panel(`${ic('bell','pic')}通知設定`,tbl([{t:'通知種別'},{t:'チャネル'},{t:'対象'},{t:'状態'}],[
      ['契約満了通知','メール+システム','営業担当',tag('t-green','ON')],
      ['異常報告通知','メール','営業+管理者',tag('t-green','ON')],
      ['請求書発行通知','メール','顧客',tag('t-green','ON')],
      ['入金督促通知','メール+システム','経理+営業担当',tag('t-green','ON')],
      ['配車変更通知','システム','運転手',tag('t-green','ON')],
    ]))}
    ${panel(`${ic('clock','pic')}最近の通知`,`<ul class="timeline">
      <li class="amber"><div class="tt">14:18</div><div class="tx">異常報告：栄町店 油脂過多</div></li>
      <li><div class="tt">02:00</div><div class="tx">弥生連携で警告3件</div></li>
      <li><div class="tt">昨日</div><div class="tx">みなとフード契約 満了30日前</div></li>
    </ul>`)}
  </div>`;
}

/* ---- 権限制御：ロール別画面（データは data.js の ROLES/PERM/PERM_MODS/PERM_OPT） ---- */
function permSelect(cur){
  const order=['F','A','E','R','N'];
  return `<select class="search" style="min-width:120px" onchange="toast('権限を変更しました（未保存）')">${order.map(o=>`<option ${o===cur?'selected':''}>${PERM_OPT[o]}</option>`).join('')}</select>`;
}
// 機微リソースを 閲覧/編集/承認 のサブ行に展開（PERM_FINE 基準）
function permFineRows(mod,key){
  const f = PERM_FINE[mod] && PERM_FINE[mod][key];
  if(!f) return null;
  const labels=['閲覧','編集','承認'];
  return labels.map((lb,i)=>[
    `<span style="padding-left:18px;color:var(--ink-2)">${lb}</span>`,
    f[i]==='N'?`<span class="subtle">—</span>`:permSelect(f[i])
  ]);
}
function scr_auth_roles(){
  const cards = ROLES.map((r,i)=>`
    <div class="role-card" onclick="setRolePanel(${i})">
      <div class="kt"><div class="kic">${ic('shield')}</div><div class="lbl">${r.name}</div><span class="tag ${r.color} nodot" style="margin-left:auto">${r.users}名</span></div>
      <div class="subtle" style="font-size:12px;margin:8px 0 14px;line-height:1.5;min-height:50px">${r.desc}</div>
      <button class="btn" style="width:100%;justify-content:center" onclick="event.stopPropagation();setRolePanel(${i})">権限を編集</button>
    </div>`).join('');
  const panels = ROLES.map(r=>{
    const perms = PERM[r.key];
    const rows = [];
    PERM_MODS.forEach((m,i)=>{
      const fine = permFineRows(m, r.key);
      if(fine){
        // 機微リソース：親見出し行（操作なし）＋ 閲覧/編集/承認 のサブ行
        rows.push([`<b>${m}</b> <span class="subtle" style="font-size:11px">機微</span>`, `<span class="subtle" style="font-size:11px">操作別に設定 ↓</span>`]);
        fine.forEach(fr=>rows.push(fr));
      }else{
        const v=perms[i];
        rows.push([m, v==='N'?`<span class="subtle">—</span>`:permSelect(v)]);
      }
    });
    return `
      <div class="panel"><div class="ph">${ic('shield','pic')}${r.name} <span class="tag ${r.color} nodot" style="margin-left:4px">${r.users}名</span>
        <span class="sub">${r.desc}</span></div>
        <div class="pb flush">${tbl([{t:'モジュール'},{t:'権限レベル'}],rows)}</div>
      </div>
      <div class="form-foot" style="margin-top:4px"><button class="btn primary" onclick="toast('${r.name} の権限を保存しました')">変更を保存</button><button class="btn">既定値に戻す</button></div>`;
  });
  return note('ロール体系は <b>管理者 / マネージャ / 営業 / 事務</b>（＋現場）。各モジュールの権限レベル（参照／参照・編集／フル）をロールごとに設定します。実際の画面を確認するには、右上のユーザー名メニューから<b>「権限プレビュー」</b>をご利用ください。')+
    note('<b>営業</b> は<b>自担当顧客のみ</b>閲覧できます（行レベルの絞り込み）。担当外の顧客・請求は一覧にも表示されません。','warn','shield')+
    `<div class="role-cards">${cards}</div>`+
    `<div style="font-weight:700;font-size:14px;margin:24px 0 12px">権限レベルの編集</div>`+
    segmented(ROLES.map(r=>r.name), panels)+
    note('※画面表示の制御に加え、<b>API側でも認可チェックを実施</b>します（本実装）。本画面は権限設計のプレビューです。');
}

/* ---- Screen registry ---- */
const SCREENS = {
  dashboard:scr_dashboard, cust:scr_cust, contract:scr_contract, sales:scr_sales,
  plan:scr_plan, ops:scr_ops, fleet:scr_fleet, doc:scr_doc,
  invoice:scr_invoice, revenue:scr_revenue, bi:scr_bi,
  master:scr_master, integ:scr_integ, auth:scr_auth, common:scr_common,
};
