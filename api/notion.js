<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>kimju.zip</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Playfair+Display:wght@700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<script>
/* ============================================================
   ★ 설정 블록 — 여기만 수정하면 됩니다 ★
   ============================================================ */
const CONFIG = {
  // NEIS 급식
  NEIS_API_KEY:     'c96838e8f2e645c58c1b40020c89e7b1',
  NEIS_REGION:      'J10',
  NEIS_SCHOOL_CODE: '7530881',

  // D-Day
  DDAYS: [
    { label: '여름방학', date: '2026-07-21' },
    { label: '겨울방학', date: '2027-01-06' },
  ],

  // Google Sheets 전광판
  SHEETS_API_KEY: 'YOUR_GOOGLE_API_KEY',
  SHEET_ID:       'YOUR_SHEET_ID',
  SHEET_RANGE:    'A1',
  SHEET_POLL_SEC: 20,

  // 노션 연동 (토큰은 Vercel 환경변수에서 관리 — 여기엔 없음 ✅)
  NOTION_SCHED_DB:  '30cb45c1f60081bd9f92e5882cf33b81',
  NOTION_MEMO_PAGE: '328b45c1f60080f982e4cfaee95901cc',

  // 시간표
  TIMETABLE: [
    ['',        '수학',  '',      '',       ''    ],
    ['제과제빵', '',      '수학',  '수학',   ''    ],
    ['제과제빵', '수학',  '',      '컴퓨터', '수학'],
    ['제과제빵', '수학',  '수학',  '수학',   ''    ],
    ['제과제빵', '',      '',      '수학',   '수학'],
    ['',        '창체',  '',      '',       '수학'],
    ['—',       '',      '—',     '창체',   '—'  ],
  ],

  // 교시 시간
  PERIODS: [
    { label:'1교시', start:'09:00', end:'09:50' },
    { label:'2교시', start:'10:00', end:'10:50' },
    { label:'3교시', start:'11:00', end:'11:50' },
    { label:'4교시', start:'12:00', end:'12:50' },
    { label:'점심',  start:'12:50', end:'13:50', isLunch:true },
    { label:'5교시', start:'13:50', end:'14:40' },
    { label:'6교시', start:'14:50', end:'15:40' },
    { label:'7교시', start:'15:50', end:'16:40' },
  ],
};
/* ============================================================ */
</script>

<style>
:root {
  --bg:      #f7f3f0;
  --surface: #ffffff;
  --rose:    #c8526a;
  --rose-lt: #f2dde2;
  --rose-md: #e8a0b0;
  --ink:     #1c1414;
  --ink-2:   #4a3a3d;
  --ink-3:   #8a7578;
  --line:    #ecdfe2;
  --r:       14px;
  --r-sm:    8px;
  --shadow:  0 2px 12px rgba(100,40,50,0.08);
  --shadow-lg:0 6px 32px rgba(100,40,50,0.14);
}
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Noto Sans KR',sans-serif; background:var(--bg); height:100vh; overflow:hidden; color:var(--ink); }

/* 전광판 */
.ticker-bar { height:26px; background:var(--rose); display:flex; align-items:center; overflow:hidden; position:fixed; top:0; left:0; right:0; z-index:200; }
.ticker-inner { white-space:nowrap; animation:scroll-x 35s linear infinite; font-size:11.5px; font-weight:600; color:#fff; letter-spacing:0.06em; padding-left:100vw; }
@keyframes scroll-x { to { transform:translateX(-100%); } }

/* 그리드 */
.grid {
  display:grid;
  grid-template-columns: 268px 1fr 268px;
  grid-template-rows: 1fr 1fr;
  gap:8px; padding:8px;
  height:calc(100vh - 26px);
  margin-top:26px;
}

/* 패널 */
.panel { background:var(--surface); border-radius:var(--r); padding:14px 16px; box-shadow:var(--shadow); border:1px solid var(--line); overflow:hidden; display:flex; flex-direction:column; }
.lbl { font-size:9.5px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:var(--ink-3); margin-bottom:10px; display:flex; align-items:center; gap:7px; }
.lbl::after { content:''; flex:1; height:1px; background:var(--line); }

/* ══ A. 파일관리 (좌측 전체) ══ */
.col-left { grid-column:1; grid-row:1/3; }
.fzones { flex:1; display:flex; flex-direction:column; gap:7px; overflow:hidden; }
.fzone { border-radius:var(--r-sm); padding:8px 10px; flex:1; min-height:0; display:flex; flex-direction:column; }
.fzone-urgent  { background:#fff5f7; border:1.5px dashed var(--rose-md); }
.fzone-progress{ background:#fafafa; border:1px solid var(--line); }
.fzone-later   { background:#fafafa; border:1px solid var(--line); }
.fhead { font-size:12px; font-weight:700; color:var(--ink-2); margin-bottom:6px; display:flex; align-items:center; gap:5px; }
.fcnt { font-size:10px; font-weight:700; background:var(--rose); color:#fff; border-radius:20px; padding:1px 6px; }
.fcnt.g { background:var(--ink-3); }
.flist { flex:1; overflow-y:auto; min-height:0; }
.fitem { display:flex; align-items:center; gap:6px; padding:5px 7px; border-radius:6px; font-size:11.5px; color:var(--ink-2); background:rgba(255,255,255,0.7); border:1px solid transparent; margin-bottom:3px; cursor:pointer; transition:all 0.15s; }
.fitem:hover { background:var(--rose-lt); border-color:var(--rose-md); }
.fn { flex:1; font-weight:500; }
.fd { font-size:9.5px; color:var(--ink-3); white-space:nowrap; }
.fdel { background:none; border:none; color:var(--ink-3); cursor:pointer; font-size:11px; opacity:0; transition:opacity 0.15s; padding:0 2px; }
.fitem:hover .fdel { opacity:1; }
.fdel:hover { color:var(--rose); }
.fadd { width:100%; background:transparent; border:1px dashed var(--line); border-radius:6px; padding:3px; font-size:10.5px; color:var(--ink-3); cursor:pointer; margin-top:4px; font-family:'Noto Sans KR',sans-serif; transition:all 0.15s; }
.fadd:hover { background:var(--rose-lt); border-color:var(--rose-md); color:var(--rose); }

/* ══ B. 중앙 상단: 시계 + 시간표 + 급식 ══ */
.scheduler { grid-column:2; grid-row:1; }
.sched-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px; }
.clock-time { font-family:'JetBrains Mono',monospace; font-size:46px; font-weight:600; color:var(--ink); line-height:1; letter-spacing:-0.03em; }
.clock-time .blink { animation:blink 1s step-end infinite; }
@keyframes blink { 50%{opacity:0} }
.clock-date { font-size:12px; color:var(--ink-3); margin-top:4px; font-weight:500; }
.now-pill { flex-shrink:0; background:var(--rose); color:#fff; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; display:flex; align-items:center; gap:6px; box-shadow:0 3px 14px rgba(200,82,106,0.3); white-space:nowrap; margin-top:4px; }
.now-dot { width:7px; height:7px; background:#fff; border-radius:50%; animation:pulse 2s ease infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

/* 시간표 + 급식 나란히 */
.sched-body { flex:1; display:flex; gap:10px; overflow:hidden; min-height:0; }
.tt-wrap { flex:1; overflow:auto; }
.tt { width:100%; border-collapse:separate; border-spacing:3px; }
.tt th { font-size:10.5px; font-weight:700; color:var(--ink-3); text-align:center; padding:4px 3px; background:var(--bg); border-radius:5px; }
.tt th.today-h { background:var(--rose); color:#fff; }
.tt .plabel { font-size:10px; font-weight:600; color:var(--ink-3); text-align:center; padding:5px 3px; background:var(--bg); border-radius:5px; white-space:nowrap; }
.tt td { font-size:11.5px; font-weight:500; text-align:center; padding:5px 3px; border-radius:5px; color:var(--ink-2); background:#fafafa; }
.tt td:hover { background:var(--rose-lt); }
.tt .tcol { background:rgba(200,82,106,0.07) !important; }
.tt .active { background:var(--rose) !important; color:#fff !important; font-weight:700; box-shadow:0 2px 8px rgba(200,82,106,0.35); }
.tt .lunch td { background:rgba(200,82,106,0.05); color:var(--rose); font-size:10.5px; font-weight:600; text-align:center; }

/* 급식 (시간표 옆) */
.meal-side { flex:0 0 130px; display:flex; flex-direction:column; }
.meal-side .lbl { margin-bottom:7px; }
.meal-items { flex:1; overflow-y:auto; list-style:none; }
.meal-row { display:flex; align-items:center; gap:5px; padding:3.5px 0; border-bottom:1px solid var(--line); font-size:12px; color:var(--ink-2); }
.meal-row:last-child { border-bottom:none; }
.meal-row::before { content:'·'; color:var(--rose-md); font-weight:700; }
.meal-kcal { font-size:10px; font-family:'JetBrains Mono',monospace; color:var(--ink-3); margin-top:5px; text-align:right; }
.meal-empty { font-size:11px; color:var(--ink-3); font-style:italic; text-align:center; padding:10px 0; }

/* ══ C. 우측 상단: 날씨 + 퀵메뉴 ══ */
.right-top { grid-column:3; grid-row:1; display:flex; flex-direction:column; gap:8px; }
.wx-main { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.wx-temp { font-family:'JetBrains Mono',monospace; font-size:38px; font-weight:600; color:var(--ink); line-height:1; }
.wx-icon { font-size:34px; }
.wx-desc { font-size:12px; color:var(--ink-3); margin-top:2px; }
.wx-tags { display:grid; grid-template-columns:1fr 1fr; gap:4px; }
.wx-tag { background:var(--bg); border-radius:6px; padding:4px 7px; font-size:11.5px; color:var(--ink-3); display:flex; align-items:center; justify-content:space-between; }
.wx-tag strong { color:var(--ink); font-weight:600; }
.wx-tag.warn strong { color:var(--rose); }
.quick-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
.qbtn { aspect-ratio:1; background:var(--bg); border:1px solid var(--line); border-radius:10px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; font-size:20px; text-decoration:none; transition:all 0.15s; }
.qbtn:hover { background:var(--rose-lt); border-color:var(--rose-md); transform:translateY(-1px); box-shadow:var(--shadow); }
.qbtn-lbl { font-size:9px; color:var(--ink-3); font-family:'Noto Sans KR',sans-serif; font-weight:500; }
.q-edit { width:100%; background:transparent; border:1px dashed var(--line); border-radius:6px; padding:3px; font-size:10.5px; color:var(--ink-3); cursor:pointer; margin-top:5px; font-family:'Noto Sans KR',sans-serif; transition:all 0.15s; }
.q-edit:hover { background:var(--rose-lt); color:var(--rose); border-color:var(--rose-md); }

/* ══ D. 중앙 하단: 할일 + 메모(노션) + AI 채팅 ══ */
.center-bot { grid-column:2; grid-row:2; display:flex; gap:8px; }

/* 할일 */
.todo-panel { flex:1; }
.todo-row { display:flex; align-items:center; gap:7px; padding:5px 0; border-bottom:1px solid var(--line); font-size:12.5px; color:var(--ink-2); cursor:pointer; }
.todo-row:last-child { border-bottom:none; }
.todo-row input[type=checkbox] { accent-color:var(--rose); width:13px; height:13px; cursor:pointer; flex-shrink:0; }
.todo-row.done span { text-decoration:line-through; color:var(--ink-3); }
.todo-t { margin-left:auto; font-size:10px; color:var(--rose); font-family:'JetBrains Mono',monospace; font-weight:600; flex-shrink:0; white-space:nowrap; }
.todo-del-btn { background:none; border:none; color:var(--ink-3); cursor:pointer; font-size:11px; opacity:0; transition:opacity 0.15s; flex-shrink:0; }
.todo-row:hover .todo-del-btn { opacity:1; }
.todo-del-btn:hover { color:var(--rose); }
.todo-add { width:100%; background:transparent; border:1px dashed var(--line); border-radius:6px; padding:4px; font-size:11px; color:var(--ink-3); cursor:pointer; margin-top:6px; font-family:'Noto Sans KR',sans-serif; transition:all 0.15s; }
.todo-add:hover { background:var(--rose-lt); color:var(--rose); border-color:var(--rose-md); }

/* 메모 (노션 연동) */
.memo-panel { flex:1; }
.memo-sync-status { font-size:9.5px; color:var(--ink-3); margin-bottom:6px; display:flex; align-items:center; gap:4px; }
.sync-dot { width:6px; height:6px; border-radius:50%; background:var(--ink-3); flex-shrink:0; }
.sync-dot.ok { background:#3a8a6a; }
.sync-dot.saving { background:var(--rose); animation:pulse 1s ease infinite; }
.memo-ta { width:100%; flex:1; background:var(--bg); border:1px solid var(--line); border-radius:var(--r-sm); padding:9px 11px; font-family:'Noto Sans KR',sans-serif; font-size:12.5px; color:var(--ink-2); line-height:1.7; resize:none; outline:none; transition:border 0.15s; }
.memo-ta:focus { border-color:var(--rose-md); background:#fff; }
.memo-ta::placeholder { color:var(--ink-3); }
.memo-save-btn { width:100%; background:var(--rose); border:none; border-radius:6px; padding:5px; font-size:11px; color:#fff; font-weight:600; cursor:pointer; margin-top:5px; font-family:'Noto Sans KR',sans-serif; transition:opacity 0.15s; }
.memo-save-btn:hover { opacity:0.85; }

/* AI 채팅 — 3등분 */
.ai-panel { flex:1; display:flex; flex-direction:column; }
.chat-msgs { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:5px; padding-right:3px; margin-bottom:6px; }
.cmsg { display:flex; gap:6px; align-items:flex-start; }
.cmsg.user { flex-direction:row-reverse; }
.cbubble { max-width:88%; padding:5px 9px; border-radius:10px; font-size:11.5px; line-height:1.55; color:var(--ink-2); }
.cmsg.ai  .cbubble { background:var(--bg); border:1px solid var(--line); border-radius:3px 10px 10px 10px; }
.cmsg.user .cbubble { background:var(--rose); color:#fff; border-radius:10px 3px 10px 10px; }
.cavatar { width:20px; height:20px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:11px; margin-top:1px; }
.cmsg.ai .cavatar { background:var(--rose-lt); }
.cmsg.user .cavatar { background:var(--rose); }
.thinking span { width:4px; height:4px; background:var(--ink-3); border-radius:50%; display:inline-block; margin:0 2px; animation:th 1.2s ease infinite; }
.thinking span:nth-child(2){animation-delay:.2s}
.thinking span:nth-child(3){animation-delay:.4s}
@keyframes th{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-4px);opacity:1}}
.chat-row { display:flex; gap:5px; flex-shrink:0; }
.chat-in { flex:1; border:1px solid var(--line); border-radius:var(--r-sm); padding:6px 10px; font-size:11.5px; font-family:'Noto Sans KR',sans-serif; color:var(--ink); outline:none; transition:border 0.15s; background:var(--bg); }
.chat-in:focus { border-color:var(--rose-md); background:#fff; }
.chat-in::placeholder { color:var(--ink-3); }
.chat-send { background:var(--rose); border:none; border-radius:var(--r-sm); padding:6px 11px; cursor:pointer; color:#fff; font-size:12px; transition:opacity 0.15s; flex-shrink:0; }
.chat-send:hover { opacity:0.85; }
.chat-send:disabled { opacity:0.5; cursor:not-allowed; }

/* ══ E. 우측 하단: D-Day + 노션 일정 ══ */
.right-bot { grid-column:3; grid-row:2; display:flex; flex-direction:column; gap:8px; }

/* D-Day 컴팩트 */
.dday-row { display:flex; gap:7px; }
.dday-item { flex:1; text-align:center; padding:8px 5px; background:var(--bg); border-radius:var(--r-sm); border:1px solid var(--line); }
.dday-num { font-family:'Playfair Display',serif; font-size:24px; color:var(--rose); line-height:1; }
.dday-lbl { font-size:11px; font-weight:600; color:var(--ink-2); margin-top:2px; }
.dday-dt  { font-size:9.5px; color:var(--ink-3); }

/* 노션 일정 */
.notion-cal { flex:1; display:flex; flex-direction:column; }
.notion-status { font-size:9.5px; color:var(--ink-3); margin-bottom:8px; display:flex; align-items:center; gap:4px; }
.event-list { list-style:none; flex:1; overflow-y:auto; }
.event-row { display:flex; align-items:flex-start; gap:8px; padding:6px 0; border-bottom:1px solid var(--line); }
.event-row:last-child { border-bottom:none; }
.event-d { min-width:36px; text-align:center; background:var(--rose-lt); color:var(--rose); font-size:10px; font-weight:700; padding:2px 4px; border-radius:5px; flex-shrink:0; margin-top:1px; }
.event-info { flex:1; }
.event-n { font-size:12.5px; font-weight:500; color:var(--ink-2); }
.event-sub { font-size:10px; color:var(--ink-3); margin-top:1px; }
.event-t { font-size:9.5px; background:var(--bg); color:var(--ink-3); padding:2px 5px; border-radius:4px; font-weight:600; flex-shrink:0; }
.notion-refresh { width:100%; background:transparent; border:1px dashed var(--line); border-radius:6px; padding:3px; font-size:10.5px; color:var(--ink-3); cursor:pointer; margin-top:6px; font-family:'Noto Sans KR',sans-serif; transition:all 0.15s; }
.notion-refresh:hover { background:var(--rose-lt); color:var(--rose); border-color:var(--rose-md); }

/* 모달 */
.overlay { display:none; position:fixed; inset:0; background:rgba(28,20,20,0.4); backdrop-filter:blur(5px); z-index:500; align-items:center; justify-content:center; }
.overlay.on { display:flex; }
.modal { background:#fff; border-radius:var(--r); padding:22px 24px; width:350px; box-shadow:var(--shadow-lg); border:1px solid var(--line); }
.modal-ttl { font-size:14px; font-weight:700; color:var(--ink); margin-bottom:14px; }
.modal input[type=text] { width:100%; border:1px solid var(--line); border-radius:var(--r-sm); padding:8px 11px; font-size:12.5px; font-family:'Noto Sans KR',sans-serif; color:var(--ink); outline:none; margin-bottom:7px; box-sizing:border-box; transition:border 0.15s; }
.modal input:focus { border-color:var(--rose); }
.modal-btns { display:flex; gap:7px; justify-content:flex-end; margin-top:8px; }
.btn-c { background:var(--bg); border:none; border-radius:var(--r-sm); padding:7px 14px; font-size:12.5px; cursor:pointer; color:var(--ink-2); font-family:'Noto Sans KR',sans-serif; }
.btn-ok { background:var(--rose); border:none; border-radius:var(--r-sm); padding:7px 14px; font-size:12.5px; cursor:pointer; color:#fff; font-weight:600; font-family:'Noto Sans KR',sans-serif; }
.btn-c:hover { background:var(--line); }
.btn-ok:hover { opacity:0.88; }
.qrow { display:flex; align-items:center; gap:6px; margin-bottom:6px; }
.qrow input { flex:1; }
.qrow .ei { width:44px !important; text-align:center; flex:none; }
.qrow .dr { background:none; border:none; color:var(--ink-3); cursor:pointer; font-size:13px; }
.qrow .dr:hover { color:var(--rose); }
.add-qrow { width:100%; background:var(--bg); border:1px dashed var(--line); border-radius:6px; padding:4px; font-size:11.5px; color:var(--ink-3); cursor:pointer; margin-bottom:8px; font-family:'Noto Sans KR',sans-serif; }
.add-qrow:hover { background:var(--rose-lt); color:var(--rose); }

::-webkit-scrollbar { width:3px; }
::-webkit-scrollbar-thumb { background:var(--line); border-radius:3px; }
</style>
</head>
<body>

<!-- 전광판 -->
<div class="ticker-bar">
  <div class="ticker-inner" id="ticker">📢 kimju.zip 로딩 중...</div>
</div>

<div class="grid">

  <!-- A. 파일관리 -->
  <div class="panel col-left">
    <div class="lbl">📁 파일 관리</div>
    <div class="fzones">
      <div class="fzone fzone-urgent">
        <div class="fhead">🚨 긴급 <span class="fcnt" id="fc-urgent">0</span></div>
        <div class="flist" id="fl-urgent"></div>
        <button class="fadd" onclick="openFModal('urgent')">+ 항목 추가</button>
      </div>
      <div class="fzone fzone-progress">
        <div class="fhead">⚙️ 진행 중 <span class="fcnt" id="fc-progress">0</span></div>
        <div class="flist" id="fl-progress"></div>
        <button class="fadd" onclick="openFModal('progress')">+ 항목 추가</button>
      </div>
      <div class="fzone fzone-later">
        <div class="fhead">🗂️ 나중에 <span class="fcnt g" id="fc-later">0</span></div>
        <div class="flist" id="fl-later"></div>
        <button class="fadd" onclick="openFModal('later')">+ 항목 추가</button>
      </div>
    </div>
  </div>

  <!-- B. 중앙 상단: 시계 + 시간표 + 급식 -->
  <div class="panel scheduler">
    <div class="sched-top">
      <div>
        <div class="clock-time"><span id="hh">--</span><span class="blink">:</span><span id="mm">--</span></div>
        <div class="clock-date" id="clock-date">로딩 중...</div>
      </div>
      <div class="now-pill"><div class="now-dot"></div><span id="now-status">--</span></div>
    </div>
    <div class="sched-body">
      <div class="tt-wrap"><table class="tt" id="tt"></table></div>
      <div class="meal-side">
        <div class="lbl">🍱 급식</div>
        <ul class="meal-items" id="meal-list"><li class="meal-empty">로딩 중...</li></ul>
        <div class="meal-kcal" id="meal-kcal"></div>
      </div>
    </div>
  </div>

  <!-- C. 우측 상단: 날씨 + 퀵메뉴 -->
  <div class="right-top">
    <div class="panel">
      <div class="lbl">🌤️ 날씨</div>
      <div class="wx-main">
        <div><div class="wx-temp" id="wx-temp">--°</div><div class="wx-desc" id="wx-desc">경기 · 로딩 중</div></div>
        <div class="wx-icon" id="wx-icon">🌡️</div>
      </div>
      <div class="wx-tags">
        <div class="wx-tag">최고 <strong id="wx-max">--°</strong></div>
        <div class="wx-tag">최저 <strong id="wx-min">--°</strong></div>
        <div class="wx-tag warn">미세먼지 <strong id="wx-pm10">--</strong></div>
        <div class="wx-tag">초미세먼지 <strong id="wx-pm25">--</strong></div>
      </div>
    </div>
    <div class="panel" style="flex:1;">
      <div class="lbl">🔗 바로가기</div>
      <div class="quick-grid" id="quick-grid"></div>
      <button class="q-edit" onclick="openQModal()">✏️ 링크 편집</button>
    </div>
  </div>

  <!-- D. 중앙 하단: 할일 + 메모 + AI 채팅 -->
  <div class="center-bot">

    <!-- 할일 -->
    <div class="panel todo-panel">
      <div class="lbl">✅ 할 일</div>
      <div id="todo-wrap" style="flex:1;overflow-y:auto;"></div>
      <button class="todo-add" onclick="openTodoModal()">+ 할 일 추가</button>
    </div>

    <!-- 메모 (노션 저장) -->
    <div class="panel memo-panel">
      <div class="lbl">📝 메모</div>
      <div class="memo-sync-status">
        <div class="sync-dot" id="sync-dot"></div>
        <span id="sync-status">노션 연동 중...</span>
      </div>
      <textarea class="memo-ta" id="memo-ta" placeholder="메모를 입력하세요...&#10;저장 버튼을 누르면 노션에 저장돼요"></textarea>
      <button class="memo-save-btn" onclick="saveMemoToNotion()">노션에 저장 💾</button>
    </div>

    <!-- AI 채팅 -->
    <div class="panel ai-panel">
      <div class="lbl">🤖 AI 어시스턴트</div>
      <div class="chat-msgs" id="chat-msgs">
        <div class="cmsg ai">
          <div class="cavatar">🤖</div>
          <div class="cbubble">안녕하세요! 수업 아이디어, 문서 작성, 학생 지도 등 무엇이든 도와드릴게요 😊</div>
        </div>
      </div>
      <div class="chat-row">
        <input class="chat-in" id="chat-in" placeholder="메시지 입력... (Enter로 전송)" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat();}">
        <button class="chat-send" id="chat-send" onclick="sendChat()">➤</button>
      </div>
    </div>

  </div>

  <!-- E. 우측 하단: D-Day + 노션 일정 -->
  <div class="right-bot">

    <!-- D-Day -->
    <div class="panel" style="flex:0 0 auto;">
      <div class="lbl">📆 D-Day</div>
      <div class="dday-row" id="dday-row"></div>
    </div>

    <!-- 노션 일정 -->
    <div class="panel notion-cal">
      <div class="lbl">📅 노션 일정</div>
      <div class="notion-status">
        <div class="sync-dot" id="notion-dot"></div>
        <span id="notion-status">일정 불러오는 중...</span>
      </div>
      <ul class="event-list" id="notion-events"></ul>
      <button class="notion-refresh" onclick="fetchNotionSchedule()">↻ 새로고침</button>
    </div>

  </div>

</div>

<!-- 모달: 할일 추가 -->
<div class="overlay" id="m-todo">
  <div class="modal">
    <div class="modal-ttl">✅ 할 일 추가</div>
    <input type="text" id="ti-text" placeholder="할 일 내용" />
    <input type="text" id="ti-time" placeholder="시간/메모 (예: 17:00, 마감 내일)" />
    <div class="modal-btns">
      <button class="btn-c" onclick="closeM('m-todo')">취소</button>
      <button class="btn-ok" onclick="addTodo()">추가</button>
    </div>
  </div>
</div>

<!-- 모달: 파일 추가 -->
<div class="overlay" id="m-file">
  <div class="modal">
    <div class="modal-ttl">📁 파일 항목 추가</div>
    <input type="text" id="fi-icon" placeholder="아이콘 이모지 (예: 📝)" />
    <input type="text" id="fi-name" placeholder="파일명" />
    <input type="text" id="fi-date" placeholder="날짜 (예: 오늘, 03/25)" />
    <div class="modal-btns">
      <button class="btn-c" onclick="closeM('m-file')">취소</button>
      <button class="btn-ok" onclick="addFItem()">추가</button>
    </div>
  </div>
</div>

<!-- 모달: 퀵메뉴 편집 -->
<div class="overlay" id="m-quick">
  <div class="modal" style="width:400px;">
    <div class="modal-ttl">🔗 바로가기 편집</div>
    <div id="q-rows"></div>
    <button class="add-qrow" onclick="addQRow()">+ 버튼 추가</button>
    <div class="modal-btns">
      <button class="btn-c" onclick="closeM('m-quick')">취소</button>
      <button class="btn-ok" onclick="saveQMenu()">저장</button>
    </div>
  </div>
</div>

<script>
const $ = id => document.getElementById(id);
const toMin = (h,m) => h*60+m;
const parseT = s => { const [h,m]=s.split(':').map(Number); return toMin(h,m); };

/* ── 노션 API → Vercel 프록시 경유 ── */
const VERCEL_API = 'https://teacher-dashboard-topaz.vercel.app/api/notion';

async function notionFetch(endpoint, method='GET', body=null) {
  const res = await fetch(`${VERCEL_API}?endpoint=${encodeURIComponent(endpoint)}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

/* ── 노션 일정 불러오기 ── */
async function fetchNotionSchedule() {
  $('notion-dot').className = 'sync-dot saving';
  $('notion-status').textContent = '일정 불러오는 중...';
  const el = $('notion-events');

  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await notionFetch(
      `databases/${CONFIG.NOTION_SCHED_DB}/query`,
      'POST',
      {
        filter: { property:'날짜', date:{ on_or_after: today } },
        sorts: [{ property:'날짜', direction:'ascending' }],
        page_size: 7
      }
    );

    if (!data?.results?.length) {
      el.innerHTML = '<li class="event-row" style="color:var(--ink-3);font-style:italic;font-size:12px;">등록된 일정이 없어요</li>';
      $('notion-dot').className = 'sync-dot ok';
      $('notion-status').textContent = '노션 연동됨';
      return;
    }

    el.innerHTML = data.results.slice(0,6).map(page => {
      const titleProp = page.properties?.이름 || page.properties?.Name || page.properties?.제목;
      const title = titleProp?.title?.[0]?.plain_text || '(제목 없음)';
      const dateProp = page.properties?.날짜 || page.properties?.Date || page.properties?.일정;
      const dateStr = dateProp?.date?.start || '';
      const dateLabel = dateStr ? dateStr.slice(5).replace('-','/') : '--';
      const tagProp = page.properties?.태그 || page.properties?.유형 || page.properties?.카테고리;
      const tag = tagProp?.select?.name || tagProp?.multi_select?.[0]?.name || '';
      return `<li class="event-row">
        <span class="event-d">${dateLabel}</span>
        <span class="event-n">${title}</span>
        ${tag?`<span class="event-t">${tag}</span>`:''}
      </li>`;
    }).join('');

    $('notion-dot').className = 'sync-dot ok';
    $('notion-status').textContent = `노션 연동됨 · ${new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})} 기준`;

  } catch(e) {
    el.innerHTML = `<li class="event-row" style="color:var(--ink-3);font-size:12px;">⚠️ 노션 연동 실패 — Integration 연결 확인</li>`;
    $('notion-dot').className = 'sync-dot';
    $('notion-status').textContent = '연동 실패';
    console.error('Notion 일정 오류:', e);
  }
}
fetchNotionSchedule();
setInterval(fetchNotionSchedule, 5 * 60 * 1000);

/* ── 노션 메모 저장 ── */
async function saveMemoToNotion() {
  const text = $('memo-ta').value.trim();
  if (!text) return;

  $('sync-dot').className = 'sync-dot saving';
  $('sync-status').textContent = '노션에 저장 중...';

  try {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const timeStr = now.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});

    const data = await notionFetch(
      `blocks/${CONFIG.NOTION_MEMO_PAGE}/children`,
      'PATCH',
      {
        children: [{
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: [{ type:'text', text:{ content:`📝 ${dateStr} ${timeStr}\n${text}` } }],
            icon: { emoji: '📌' },
            color: 'pink_background'
          }
        }]
      }
    );

    if (data.object !== 'error') {
      $('sync-dot').className = 'sync-dot ok';
      $('sync-status').textContent = `저장됨 · ${timeStr}`;
      $('memo-ta').value = '';
    } else {
      throw new Error(data.message);
    }
  } catch(e) {
    $('sync-dot').className = 'sync-dot';
    $('sync-status').textContent = '저장 실패';
    console.error('Notion 메모 저장 오류:', e);
  }
}

/* ── 시계 ── */
function tick() {
  const now = new Date();
  $('hh').textContent = String(now.getHours()).padStart(2,'0');
  $('mm').textContent = String(now.getMinutes()).padStart(2,'0');
  const days=['일','월','화','수','목','금','토'];
  $('clock-date').textContent = `${now.getFullYear()}년 ${now.getMonth()+1}월 ${now.getDate()}일 (${days[now.getDay()]}요일)`;
  const cur = toMin(now.getHours(), now.getMinutes());
  let txt = '방과 후 🏫';
  for (const p of CONFIG.PERIODS) {
    if (cur>=parseT(p.start)&&cur<parseT(p.end)) {
      txt = p.isLunch?`점심시간 🍱 ${p.start}~${p.end}`:`${p.label} 📖 ${p.start}~${p.end}`;
      break;
    }
  }
  $('now-status').textContent = txt;
}
tick(); setInterval(tick, 1000);

/* ── 시간표 ── */
function buildTT() {
  const now = new Date();
  const dow = now.getDay();
  const todayCol = (dow>=1&&dow<=5)?dow-1:-1;
  const cur = toMin(now.getHours(), now.getMinutes());
  const days=['월','화','수','목','금'];
  let h = '<thead><tr><th style="width:46px">교시</th>';
  days.forEach((d,i)=>h+=`<th class="${i===todayCol?'today-h':''}">${i===todayCol?d+' ★':d}</th>`);
  h += '</tr></thead><tbody>';
  let si=0;
  for (const p of CONFIG.PERIODS) {
    if (p.isLunch) {
      h+=`<tr class="lunch"><td class="plabel" style="color:var(--rose)">🍱<br><small>${p.start}</small></td><td colspan="5">점심 (${p.start}~${p.end})</td></tr>`;
      continue;
    }
    const active=cur>=parseT(p.start)&&cur<parseT(p.end);
    h+=`<tr><td class="plabel">${p.label}<br><small style="color:var(--ink-3)">${p.start}</small></td>`;
    const subjs=CONFIG.TIMETABLE[si]||['','','','',''];
    subjs.forEach((s,ci)=>{
      const tc=ci===todayCol,ac=tc&&active;
      h+=`<td class="${ac?'active':tc?'tcol':''}">${s||'—'}</td>`;
    });
    h+='</tr>'; si++;
  }
  h+='</tbody>';
  $('tt').innerHTML=h;
}
buildTT(); setInterval(buildTT,60000);

/* ── D-Day ── */
function buildDDay() {
  const today=new Date(); today.setHours(0,0,0,0);
  $('dday-row').innerHTML=CONFIG.DDAYS.map(d=>{
    const t=new Date(d.date); t.setHours(0,0,0,0);
    const diff=Math.ceil((t-today)/86400000);
    const ds=diff>0?`D-${diff}`:diff===0?'D-Day!':`D+${Math.abs(diff)}`;
    return `<div class="dday-item"><div class="dday-num">${ds}</div><div class="dday-lbl">${d.label}</div><div class="dday-dt">${d.date.replace(/-/g,'.')}</div></div>`;
  }).join('');
}
buildDDay();

/* ── 급식 ── */
async function fetchMeal() {
  try {
    const now=new Date();
    const ymd=`${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    const base=`https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${CONFIG.NEIS_API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${CONFIG.NEIS_REGION}&SD_SCHUL_CODE=${CONFIG.NEIS_SCHOOL_CODE}&MLSV_YMD=${ymd}&MMEAL_SC_CODE=2`;
    const res=await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(base)}`);
    const raw=await res.json();
    const data=JSON.parse(raw.contents);
    const info=data?.mealServiceDietInfo?.[1]?.row?.[0];
    if(!info){$('meal-list').innerHTML='<li class="meal-empty">급식 정보 없음</li>';return;}
    const menus=info.DDISH_NM.split('<br/>').map(m=>m.replace(/\(\d+(\.\d+)*\)/g,'').replace(/\d+\./g,'').trim()).filter(Boolean);
    $('meal-list').innerHTML=menus.map(m=>`<li class="meal-row">${m}</li>`).join('');
    $('meal-kcal').textContent=`총 ${info.CAL_INFO}`;
  } catch { $('meal-list').innerHTML='<li class="meal-empty">급식 정보 없음</li>'; }
}
fetchMeal();

/* ── 날씨 ── */
async function fetchWx() {
  try {
    const d=(await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=37.27&longitude=127.0&current=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSeoul&forecast_days=1`)).json());
    const c=d.current,dy=d.daily,wc=c.weathercode;
    const icon=wc===0?'☀️':wc<=3?'⛅':wc<=48?'🌫️':wc<=67?'🌧️':wc<=77?'❄️':wc<=82?'🌦️':'⛈️';
    const desc=wc===0?'맑음':wc<=3?'구름 조금':wc<=48?'안개':wc<=67?'비':wc<=77?'눈':wc<=82?'소나기':'뇌우';
    $('wx-temp').textContent=`${Math.round(c.temperature_2m)}°`;
    $('wx-icon').textContent=icon;
    $('wx-desc').textContent=`경기 · ${desc}`;
    $('wx-max').textContent=`${Math.round(dy.temperature_2m_max[0])}°`;
    $('wx-min').textContent=`${Math.round(dy.temperature_2m_min[0])}°`;
    $('wx-pm10').textContent='정보없음';
    $('wx-pm25').textContent='정보없음';
  } catch { $('wx-desc').textContent='날씨 정보 없음'; }
}
fetchWx(); setInterval(fetchWx,30*60*1000);

/* ── 전광판 ── */
async function fetchTicker() {
  const{SHEETS_API_KEY:k,SHEET_ID:id,SHEET_RANGE:r}=CONFIG;
  if(k==='YOUR_GOOGLE_API_KEY'||id==='YOUR_SHEET_ID')return;
  try{const res=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${r}?key=${k}`);const d=await res.json();const t=d?.values?.[0]?.[0];if(t)$('ticker').textContent=`📢 ${t}`;}catch{}
}
fetchTicker(); setInterval(fetchTicker,CONFIG.SHEET_POLL_SEC*1000);

/* ── AI 채팅 ── */
let chatHistory=[];
function appendMsg(role,text){
  const wrap=$('chat-msgs'),isAI=role==='ai';
  const div=document.createElement('div');
  div.className=`cmsg ${role}`;
  div.innerHTML=`<div class="cavatar">${isAI?'🤖':'👤'}</div><div class="cbubble">${text.replace(/\n/g,'<br>')}</div>`;
  wrap.appendChild(div); wrap.scrollTop=wrap.scrollHeight; return div;
}
function showThinking(){
  const wrap=$('chat-msgs'),div=document.createElement('div');
  div.className='cmsg ai'; div.id='thinking';
  div.innerHTML=`<div class="cavatar">🤖</div><div class="cbubble"><div class="thinking"><span></span><span></span><span></span></div></div>`;
  wrap.appendChild(div); wrap.scrollTop=wrap.scrollHeight;
}
async function sendChat(){
  const input=$('chat-in'),send=$('chat-send'),text=input.value.trim();
  if(!text)return;
  input.value=''; input.disabled=true; send.disabled=true;
  appendMsg('user',text);
  chatHistory.push({role:'user',content:text});
  showThinking();
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        system:'당신은 교사를 돕는 AI 어시스턴트입니다. 수업 아이디어, 문서 작성, 학생 지도, 학사 업무 등 교사의 업무를 친절하고 실용적으로 도와주세요. 한국어로 간결하게 답변하세요.',
        messages:chatHistory
      })
    });
    const data=await res.json();
    const reply=data?.content?.[0]?.text||'죄송해요, 답변을 가져오지 못했어요.';
    chatHistory.push({role:'assistant',content:reply});
    const t=$('thinking'); if(t)t.remove();
    appendMsg('ai',reply);
  }catch{
    const t=$('thinking'); if(t)t.remove();
    appendMsg('ai','네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
  }
  input.disabled=false; send.disabled=false; input.focus();
}

/* ── 할일 ── */
let todos=JSON.parse(localStorage.getItem('kj_todos')||'null')||[
  {text:'평가계획서 작성',time:'마감 내일',done:false},
  {text:'조례 출석 확인',time:'완료',done:true},
  {text:'17시 하원 지도',time:'17:00',done:false},
];
const saveTodos=()=>localStorage.setItem('kj_todos',JSON.stringify(todos));
function renderTodos(){
  $('todo-wrap').innerHTML=todos.map((t,i)=>`
    <label class="todo-row${t.done?' done':''}">
      <input type="checkbox"${t.done?' checked':''} onchange="toggleTodo(${i})">
      <span>${t.text}</span>
      <span class="todo-t">${t.time}</span>
      <button class="todo-del-btn" onclick="delTodo(event,${i})">✕</button>
    </label>`).join('');
}
function toggleTodo(i){todos[i].done=!todos[i].done;saveTodos();renderTodos();}
function delTodo(e,i){e.preventDefault();e.stopPropagation();todos.splice(i,1);saveTodos();renderTodos();}
function openTodoModal(){$('ti-text').value='';$('ti-time').value='';$('m-todo').classList.add('on');$('ti-text').focus();}
function addTodo(){
  const t=$('ti-text').value.trim(),tm=$('ti-time').value.trim();
  if(!t)return;
  todos.push({text:t,time:tm,done:false});
  saveTodos();renderTodos();closeM('m-todo');
}
renderTodos();

/* ── 파일관리 ── */
let fzones=JSON.parse(localStorage.getItem('kj_files')||'null')||{
  urgent:[{icon:'📝',name:'평가계획서_초안.docx',date:'오늘'},{icon:'📊',name:'성적처리_마감.xlsx',date:'내일'}],
  progress:[{icon:'🖼️',name:'수업자료_3학년.pptx',date:'03/18'},{icon:'📋',name:'학급일지_3월.pdf',date:'03/17'}],
  later:[{icon:'📸',name:'현장학습_사진모음.zip',date:'03/12'}],
};
let curFZ='';
const saveFZ=()=>localStorage.setItem('kj_files',JSON.stringify(fzones));
function renderFZ(){
  ['urgent','progress','later'].forEach(z=>{
    $(`fl-${z}`).innerHTML=fzones[z].map((f,i)=>`
      <div class="fitem">
        <span style="font-size:14px">${f.icon}</span>
        <span class="fn">${f.name}</span>
        <span class="fd">${f.date}</span>
        <button class="fdel" onclick="delF('${z}',${i})">✕</button>
      </div>`).join('');
    $(`fc-${z}`).textContent=fzones[z].length;
  });
}
function delF(z,i){fzones[z].splice(i,1);saveFZ();renderFZ();}
function openFModal(z){curFZ=z;$('fi-icon').value='📄';$('fi-name').value='';$('fi-date').value='';$('m-file').classList.add('on');$('fi-name').focus();}
function addFItem(){
  const ic=$('fi-icon').value.trim()||'📄',nm=$('fi-name').value.trim(),dt=$('fi-date').value.trim()||'오늘';
  if(!nm)return;
  fzones[curFZ].push({icon:ic,name:nm,date:dt});
  saveFZ();renderFZ();closeM('m-file');
}
renderFZ();

/* ── 퀵메뉴 ── */
let qlinks=JSON.parse(localStorage.getItem('kj_quick')||'null')||[
  {emoji:'🏠',label:'홈',url:'#'},
  {emoji:'📅',label:'캘린더',url:'https://calendar.google.com'},
  {emoji:'💾',label:'드라이브',url:'https://drive.google.com'},
  {emoji:'📓',label:'노션',url:'https://notion.so'},
  {emoji:'🎓',label:'클래스룸',url:'https://classroom.google.com'},
  {emoji:'⚙️',label:'설정',url:'#'},
];
const saveQL=()=>localStorage.setItem('kj_quick',JSON.stringify(qlinks));
function renderQL(){
  $('quick-grid').innerHTML=qlinks.map(q=>`
    <a class="qbtn" href="${q.url}" title="${q.label}" target="${q.url==='#'?'_self':'_blank'}">
      <span>${q.emoji}</span><span class="qbtn-lbl">${q.label}</span>
    </a>`).join('');
}
function openQModal(){
  $('q-rows').innerHTML=qlinks.map((q,i)=>`
    <div class="qrow">
      <input type="text" class="ei" value="${q.emoji}" id="qe-${i}" style="width:44px;text-align:center;">
      <input type="text" value="${q.label}" id="ql-${i}">
      <input type="text" value="${q.url}" id="qu-${i}">
      <button class="dr" onclick="this.closest('.qrow').remove()">✕</button>
    </div>`).join('');
  $('m-quick').classList.add('on');
}
function addQRow(){
  const d=document.createElement('div');d.className='qrow';
  const i=Date.now();
  d.innerHTML=`<input type="text" class="ei" placeholder="🔗" id="qe-${i}" style="width:44px;text-align:center;"><input type="text" placeholder="이름" id="ql-${i}"><input type="text" placeholder="https://..." id="qu-${i}"><button class="dr" onclick="this.closest('.qrow').remove()">✕</button>`;
  $('q-rows').appendChild(d);
}
function saveQMenu(){
  qlinks=Array.from($('q-rows').children).map(row=>{
    const inputs=row.querySelectorAll('input');
    return{emoji:inputs[0]?.value.trim()||'🔗',label:inputs[1]?.value.trim()||'',url:inputs[2]?.value.trim()||'#'};
  }).filter(q=>q.label);
  saveQL();renderQL();closeM('m-quick');
}
renderQL();

/* ── 모달 공통 ── */
function closeM(id){$(id).classList.remove('on');}
document.querySelectorAll('.overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('on');}));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')document.querySelectorAll('.overlay.on').forEach(o=>o.classList.remove('on'));
  if(e.key==='Enter'&&!e.shiftKey){
    if($('m-todo').classList.contains('on'))addTodo();
    if($('m-file').classList.contains('on'))addFItem();
  }
});
</script>
</body>
</html>
