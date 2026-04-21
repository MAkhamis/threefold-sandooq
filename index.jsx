import React, { useState, useEffect } from 'react';

// -----------------------------------------------------------------------------
// Translations
// -----------------------------------------------------------------------------

const TXN_TYPES = {
  g_paid_w: {
    tone: 'box-guardian',
    label:  { en: 'Guardian paid Worker for services',            ar: 'مسؤول العمارة دفع للحارس مقابل خدمات' },
    short:  { en: 'Guardian paid Worker (services)',              ar: 'دفع المسؤول للحارس (خدمات)' },
    effect: { en: 'Box will owe Guardian',                        ar: 'سيُدين الصندوق لمسؤول العمارة' },
  },
  g_paid_bill: {
    tone: 'box-guardian',
    label:  { en: 'Guardian paid a building expense / bill',      ar: 'مسؤول العمارة دفع فاتورة أو مصروف للعمارة' },
    short:  { en: 'Guardian paid a bill',                         ar: 'المسؤول دفع فاتورة' },
    effect: { en: 'Box will owe Guardian',                        ar: 'سيُدين الصندوق لمسؤول العمارة' },
  },
  w_collected: {
    tone: 'box-worker',
    label:  { en: 'Worker collected money from residents',        ar: 'الحارس جمع أموالاً من السكان' },
    short:  { en: 'Worker collected from residents',              ar: 'الحارس جمع من السكان' },
    effect: { en: 'Worker is holding Box money',                  ar: 'الحارس يحتفظ بأموال الصندوق' },
  },
  w_paid_box: {
    tone: 'box-worker',
    label:  { en: 'Worker paid a building expense',               ar: 'الحارس دفع مصروفاً للعمارة' },
    short:  { en: 'Worker paid a building expense',               ar: 'الحارس دفع مصروفاً للعمارة' },
    effect: { en: 'Box will owe Worker',                          ar: 'سيُدين الصندوق للحارس' },
  },
  w_paid_g: {
    tone: 'guardian-worker',
    label:  { en: 'Worker paid something personal for Guardian',  ar: 'الحارس دفع شيئاً شخصياً لمسؤول العمارة' },
    short:  { en: 'Worker paid (Guardian personal)',              ar: 'الحارس دفع (شخصي للمسؤول)' },
    effect: { en: 'Guardian will owe Worker (personal)',          ar: 'سيُدين المسؤول للحارس (شخصياً)' },
  },
  g_owes_box: {
    tone: 'box-guardian',
    label:  { en: 'Guardian owes Box (monthly subscription, etc.)', ar: 'المسؤول مدين للصندوق (اشتراك شهري، إلخ)' },
    short:  { en: 'Guardian owes Box (subscription)',             ar: 'المسؤول مدين للصندوق (اشتراك)' },
    effect: { en: 'Guardian will owe Box — no cash moves, just recorded',
              ar: 'سيُدين المسؤول للصندوق — دون حركة نقد، مجرد تسجيل' },
  },
};

const STR = {
  headerEyebrow:     { en: 'Building Fund · Settlement Book',       ar: 'صندوق العمارة · دفتر التسوية' },
  headerTitle1:      { en: 'The Box, the Guardian,',                ar: 'الصندوق، المسؤول،' },
  headerTitle2:      { en: '& the Worker.',                         ar: 'والحارس.' },
  headerDesc:        { en: "Set the opening balances, log each transaction as it happens, and when it's time to close the books — at most two transfers settle everything: one personal, one for the Box. Sometimes one. Sometimes, gracefully, none.",
                       ar: 'أدخل الأرصدة الافتتاحية، سجّل كل حركة عند وقوعها، وعند إغلاق الحسابات — تحويلان على الأكثر يُسوّيان كل شيء: أحدهما شخصي، والآخر يخصّ الصندوق. أحياناً تحويل واحد. وأحياناً، بلطف، لا شيء.' },

  openingBalances:   { en: 'Opening balances',                      ar: 'الأرصدة الافتتاحية' },
  periodStart:       { en: 'period start',                          ar: 'بداية الفترة' },
  openingHelp:       { en: 'What the Box held and what was in your wallet when this period began. Leave blank for zero.',
                       ar: 'ما كان في الصندوق وما كان في محفظتك عند بداية هذه الفترة. اتركها فارغة لتعني صفراً.' },
  box:               { en: 'Box',                                   ar: 'الصندوق' },
  guardianWallet:    { en: "Guardian's wallet",                     ar: 'محفظة المسؤول' },

  logTxn:            { en: 'Log a transaction',                     ar: 'تسجيل حركة' },
  stepPickType:      { en: '1 / pick type',                         ar: '١ / اختر النوع' },
  stepAmountNote:    { en: '2 / amount & note',                     ar: '٢ / المبلغ والملاحظة' },
  notePh:            { en: 'Note (optional) — what was it for?',    ar: 'ملاحظة (اختيارية) — لماذا؟' },
  addEntry:          { en: 'Add entry',                             ar: 'إضافة' },

  ledger:            { en: 'Ledger',                                ar: 'السجل' },
  clearAll:          { en: 'Clear all',                             ar: 'مسح الكل' },
  clearAllConfirm:   { en: 'Click again to clear all',              ar: 'انقر مرة أخرى للتأكيد' },

  runningBalances:   { en: 'Running balances',                      ar: 'الأرصدة الجارية' },
  boxGuardian:       { en: 'Box ↔ Guardian',                        ar: 'الصندوق ↔ المسؤول' },
  boxWorker:         { en: 'Box ↔ Worker',                          ar: 'الصندوق ↔ الحارس' },
  guardianWorker:    { en: 'Guardian ↔ Worker',                     ar: 'المسؤول ↔ الحارس' },
  boxOwesG:          { en: 'Box owes Guardian',                     ar: 'الصندوق يدين للمسؤول' },
  gOwesBox:          { en: 'Guardian owes Box',                     ar: 'المسؤول مدين للصندوق' },
  boxOwesW:          { en: 'Box owes Worker',                       ar: 'الصندوق يدين للحارس' },
  wHoldsBox:         { en: 'Worker holds Box money',                ar: 'الحارس يحتفظ بأموال الصندوق' },
  gOwesW:            { en: 'Guardian owes Worker',                  ar: 'المسؤول يدين للحارس' },
  wOwesG:            { en: 'Worker owes Guardian',                  ar: 'الحارس يدين للمسؤول' },
  balanced:          { en: 'Balanced',                              ar: 'متوازن' },

  closingBooks:      { en: 'Closing the books',                     ar: 'إغلاق الحسابات' },
  noTransfers:       { en: 'No transfers needed',                   ar: 'لا حاجة لأي تحويل' },
  oneTransfer:       { en: 'One transfer',                          ar: 'تحويل واحد' },
  twoTransfers:      { en: 'Two transfers',                         ar: 'تحويلان' },
  nothingToMove:     { en: 'Everything nets out. Nothing to move.', ar: 'كل شيء متوازن. لا شيء يتحرّك.' },

  endingBalances:    { en: 'Ending balances',                       ar: 'الأرصدة الختامية' },
  boxDeficitNote:    { en: 'The box is ending in deficit — expenses exceed what it holds.',
                       ar: 'الصندوق ينتهي بعجز — المصروفات تتجاوز الموجود.' },
  closePeriodDesc:   { en: 'After settling, roll the ending balances into a new period.',
                       ar: 'بعد التسوية، انقل الأرصدة الختامية إلى فترة جديدة.' },
  closePeriod:       { en: 'Close period',                          ar: 'إغلاق الفترة' },
  closePeriodConfirm:{ en: 'Confirm · roll over',                   ar: 'تأكيد · النقل' },

  emptyTitle:        { en: 'The ledger is empty.',                  ar: 'السجل فارغ.' },
  emptyHint:         { en: 'Log your first transaction above to begin.', ar: 'سجّل أول حركة في الأعلى للبدء.' },

  footer:            { en: 'Entries are saved in your browser · they persist between sessions',
                       ar: 'الحركات محفوظة في متصفّحك · تبقى بين الجلسات' },

  // Transfer actions (between parties)
  actGW:             { en: 'Guardian pays Worker',                  ar: 'المسؤول يدفع للحارس' },
  actWG:             { en: 'Worker pays Guardian',                  ar: 'الحارس يدفع للمسؤول' },
  actGBdeposit:      { en: 'Guardian deposits in the Box',          ar: 'المسؤول يودع في الصندوق' },
  actWBdeposit:      { en: 'Worker deposits in the Box',            ar: 'الحارس يودع في الصندوق' },
  actGBwithdraw:     { en: 'Guardian takes from the Box',           ar: 'المسؤول يأخذ من الصندوق' },
  actWBwithdraw:     { en: 'Worker takes from the Box',             ar: 'الحارس يأخذ من الصندوق' },

  // Box ledger export
  exportTitle:       { en: 'Box ledger export',                     ar: 'تصدير دفتر الصندوق' },
  exportDesc:        { en: 'Box-related rows only, ordered oldest first. Copy and paste into your Google Sheet. Personal Guardian ↔ Worker settlements are excluded.',
                       ar: 'الصفوف المتعلقة بالصندوق فقط، مرتَّبة من الأقدم إلى الأحدث. انسخها والصقها في جدول بيانات Google. التسويات الشخصية بين المسؤول والحارس مستثناة.' },
  exportCopy:        { en: 'Copy rows',                             ar: 'نسخ الصفوف' },
  exportCopied:      { en: 'Copied',                                ar: 'تم النسخ' },
  exportEmpty:       { en: 'Nothing box-related to export yet.',    ar: 'لا يوجد ما يُصدَّر بعد.' },
  colItem:           { en: 'Item',                                  ar: 'البند' },
  colValue:          { en: 'Value',                                 ar: 'القيمة' },
  colType:           { en: 'Type',                                  ar: 'النوع' },
  colComments:       { en: 'Comments',                              ar: 'ملاحظات' },

  // Fallback items (used when the note is empty)
  fbCollection:      { en: 'Subscription',                          ar: 'اشتراك' },
  fbGSubscription:   { en: 'Guardian subscription',                 ar: 'اشتراك المسؤول' },
  fbBill:            { en: 'Bill',                                  ar: 'فاتورة' },
  fbExpense:         { en: 'Expense',                               ar: 'مصروف' },
  fbServices:        { en: 'Worker services',                       ar: 'أجرة الحارس' },
};

// -----------------------------------------------------------------------------
// Storage keys (unchanged — preserves existing data)
// -----------------------------------------------------------------------------

const STORAGE_KEY  = 'building_fund_txns_v1';
const OPENINGS_KEY = 'building_fund_openings_v1';
const LANG_KEY     = 'building_fund_lang_v1';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function App() {
  const [txns, setTxns] = useState([]);
  const [openings, setOpenings] = useState({ box: '', guardian: '' });
  const [lang, setLang] = useState('en');
  const [type, setType] = useState('g_paid_w');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [confirmingNewPeriod, setConfirmingNewPeriod] = useState(false);
  const [copiedFlash, setCopiedFlash] = useState(false);

  const t = (key) => (STR[key]?.[lang] ?? STR[key]?.en ?? key);
  const isRTL = lang === 'ar';

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r?.value) {
          const parsed = JSON.parse(r.value);
          if (Array.isArray(parsed)) setTxns(parsed);
        }
      } catch (e) {}
      try {
        const r = await window.storage.get(OPENINGS_KEY);
        if (r?.value) {
          const parsed = JSON.parse(r.value);
          if (parsed && typeof parsed === 'object') {
            setOpenings({ box: parsed.box ?? '', guardian: parsed.guardian ?? '' });
          }
        }
      } catch (e) {}
      try {
        const r = await window.storage.get(LANG_KEY);
        if (r?.value === 'ar' || r?.value === 'en') setLang(r.value);
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  // Persist
  useEffect(() => {
    if (!loaded) return;
    window.storage.set(STORAGE_KEY, JSON.stringify(txns)).catch(() => {});
  }, [txns, loaded]);

  useEffect(() => {
    if (!loaded) return;
    window.storage.set(OPENINGS_KEY, JSON.stringify(openings)).catch(() => {});
  }, [openings, loaded]);

  useEffect(() => {
    if (!loaded) return;
    window.storage.set(LANG_KEY, lang).catch(() => {});
  }, [lang, loaded]);

  // Western numerals regardless of language; tabular formatting
  const fmt = (n) =>
    Math.abs(n).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const addTxn = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setTxns(prev => [...prev, {
      id: Date.now() + Math.random(),
      type,
      amount: amt,
      note: note.trim(),
      date: new Date().toISOString(),
    }]);
    setAmount('');
    setNote('');
  };

  const removeTxn = (id) => setTxns(prev => prev.filter(x => x.id !== id));

  const handleClear = () => {
    if (confirmingClear) {
      setTxns([]);
      setConfirmingClear(false);
    } else {
      setConfirmingClear(true);
      setTimeout(() => setConfirmingClear(false), 3000);
    }
  };

  // -----------------------------------------------------------------
  // Ledger math
  // GB: Box owes Guardian (positive); negative means Guardian owes Box
  // WB: Box owes Worker; negative means Worker is holding Box money
  // GW: Guardian owes Worker personally; negative means Worker owes Guardian
  // GOwesBox: cumulative subscription / accounting-only debt Guardian owes Box
  // -----------------------------------------------------------------
  let GB = 0, WB = 0, GW = 0, GOwesBox = 0;
  txns.forEach(x => {
    switch (x.type) {
      case 'g_paid_w':    GB += x.amount; break;
      case 'g_paid_bill': GB += x.amount; break;
      case 'w_collected': WB -= x.amount; break;
      case 'w_paid_box':  WB += x.amount; break;
      case 'w_paid_g':    GW += x.amount; break;
      case 'g_owes_box':  GB -= x.amount; GOwesBox += x.amount; break;
      default: break;
    }
  });

  const guardianNet = GB - GW;
  const workerNet   = WB + GW;
  const boxNet      = -GB - WB;

  const openBox      = parseFloat(openings.box) || 0;
  const openGuardian = parseFloat(openings.guardian) || 0;
  const endBox       = openBox + boxNet;
  // Guardian's wallet: bills he paid come back via settlement, wages he advanced too.
  // Only his own subscriptions and personal debts to Worker are net losses.
  const endGuardian  = openGuardian - GOwesBox - GW;

  const hasTxns = txns.length > 0;
  const sortedTxns = [...txns].reverse();

  const handleStartNewPeriod = () => {
    if (confirmingNewPeriod) {
      setOpenings({
        box: endBox === 0 ? '' : String(endBox),
        guardian: endGuardian === 0 ? '' : String(endGuardian),
      });
      setTxns([]);
      setConfirmingNewPeriod(false);
    } else {
      setConfirmingNewPeriod(true);
      setTimeout(() => setConfirmingNewPeriod(false), 3000);
    }
  };

  // Box ledger rows for Google Sheet export — chronological, box-related only.
  const exportRows = [...txns]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(x => buildSheetRow(x, t))
    .filter(Boolean);

  const exportTsv = exportRows
    .map(r => [r.item, formatSheetValue(r.value), r.typeLabel, r.comments].join('\t'))
    .join('\n');

  const copyExport = () => {
    if (!exportRows.length) return;

    // Legacy execCommand path first — it's more reliable than the modern
    // clipboard API inside sandboxed artifact iframes.
    let success = false;
    try {
      const ta = document.createElement('textarea');
      ta.value = exportTsv;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.left = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, exportTsv.length);
      success = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {
      success = false;
    }

    if (success) {
      setCopiedFlash(true);
      setTimeout(() => setCopiedFlash(false), 2000);
      return;
    }

    // Modern API as a secondary fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(exportTsv).then(
        () => {
          setCopiedFlash(true);
          setTimeout(() => setCopiedFlash(false), 2000);
        },
        () => {}
      );
    }
  };

  // Settlement: greedy min-cash-flow across 3 parties (Guardian, Worker, Box).
  // For 3 parties, this produces at most 2 transactions.
  const settlementTxns = computeSettlement({
    guardian: guardianNet,
    worker:   workerNet,
    box:      boxNet,
  });

  const transferCountLabel =
    settlementTxns.length === 0 ? t('noTransfers') :
    settlementTxns.length === 1 ? t('oneTransfer') :
    settlementTxns.length === 2 ? t('twoTransfers') :
    `${settlementTxns.length}`;

  const arrow = isRTL ? '←' : '→';

  return (
    <div
      lang={lang}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F2EADB] text-[#1C1915]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@400;500;600;700&display=swap');

        [lang="en"] { font-family: 'DM Sans', -apple-system, system-ui, sans-serif; }
        [lang="ar"] { font-family: 'Cairo', 'DM Sans', -apple-system, system-ui, sans-serif; }

        .font-display { font-family: 'Fraunces', Georgia, serif; }
        [lang="ar"] .font-display { font-family: 'Amiri', Georgia, serif; font-weight: 400; }

        .font-mono-num {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-variant-numeric: tabular-nums;
          direction: ltr;
          unicode-bidi: embed;
          display: inline-block;
        }

        .paper-bg {
          background-image:
            radial-gradient(ellipse at top left, rgba(122, 46, 40, 0.03), transparent 60%),
            radial-gradient(ellipse at bottom right, rgba(45, 95, 63, 0.03), transparent 60%);
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 paper-bg">

        {/* Language toggle — sits at the "end" side, which is top-right in LTR, top-left in RTL */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex gap-0.5 p-0.5 bg-[#FCF8EE] border border-[#DCD2BC] rounded-[6px]">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-[11px] rounded-[4px] font-mono-num uppercase tracking-wider transition-colors ${
                lang === 'en'
                  ? 'bg-[#1C1915] text-[#F2EADB]'
                  : 'text-[#7A6F5D] hover:text-[#1C1915]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ar')}
              className={`px-3 py-1 text-[14px] rounded-[4px] transition-colors ${
                lang === 'ar'
                  ? 'bg-[#1C1915] text-[#F2EADB]'
                  : 'text-[#7A6F5D] hover:text-[#1C1915]'
              }`}
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              ع
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#7A6F5D] mb-3 font-mono-num">
            {t('headerEyebrow')}
          </div>
          <h1 className="font-display text-[2.4rem] sm:text-5xl font-[500] leading-[1.15] tracking-[-0.02em]">
            {t('headerTitle1')}<br />
            <span className="italic font-[400]">{t('headerTitle2')}</span>
          </h1>
          <p className="text-[#5C5345] mt-5 max-w-xl text-[15px] leading-[1.75]">
            {t('headerDesc')}
          </p>
        </header>

        {/* Opening balances */}
        <section className="bg-[#FCF8EE] border border-[#DCD2BC] rounded-[10px] p-5 sm:p-6 mb-8 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          <div className="flex items-baseline justify-between mb-1 gap-3">
            <h2 className="font-display text-[1.35rem] font-[500]">{t('openingBalances')}</h2>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#7A6F5D] font-mono-num">
              {t('periodStart')}
            </span>
          </div>
          <p className="text-[12px] text-[#7A6F5D] italic font-display mb-4 leading-relaxed">
            {t('openingHelp')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-[#7A6F5D] font-mono-num block mb-1.5">
                {t('box')}
              </label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={openings.box}
                onChange={(e) => setOpenings({ ...openings, box: e.target.value })}
                className="w-full font-mono-num px-3 py-2.5 bg-white border border-[#DCD2BC] rounded-[6px] focus:outline-none focus:border-[#7A2E28] focus:ring-1 focus:ring-[#7A2E28]/20 text-[15px]"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-[#7A6F5D] font-mono-num block mb-1.5">
                {t('guardianWallet')}
              </label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={openings.guardian}
                onChange={(e) => setOpenings({ ...openings, guardian: e.target.value })}
                className="w-full font-mono-num px-3 py-2.5 bg-white border border-[#DCD2BC] rounded-[6px] focus:outline-none focus:border-[#7A2E28] focus:ring-1 focus:ring-[#7A2E28]/20 text-[15px]"
              />
            </div>
          </div>
        </section>

        {/* Add transaction */}
        <section className="bg-[#FCF8EE] border border-[#DCD2BC] rounded-[10px] p-5 sm:p-6 mb-8 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          <div className="flex items-baseline justify-between mb-4 gap-3">
            <h2 className="font-display text-[1.35rem] font-[500]">{t('logTxn')}</h2>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#7A6F5D] font-mono-num">
              {t('stepPickType')}
            </span>
          </div>

          <div className="space-y-2">
            {Object.entries(TXN_TYPES).map(([key, val]) => (
              <label
                key={key}
                className={`flex items-start gap-3 px-3.5 py-2.5 rounded-[6px] border cursor-pointer transition-all ${
                  type === key
                    ? 'border-[#7A2E28] bg-[#F9F0E5]'
                    : 'border-[#E6DCC3] hover:border-[#C8BC9E] hover:bg-[#FAF5EA]'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  checked={type === key}
                  onChange={() => setType(key)}
                  className="mt-[5px] accent-[#7A2E28] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] leading-snug font-medium">{val.label[lang]}</div>
                  <div className="text-[12px] text-[#7A6F5D] mt-1 italic font-display">
                    {arrow} {val.effect[lang]}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-5 mb-2 text-[11px] uppercase tracking-[0.18em] text-[#7A6F5D] font-mono-num">
            {t('stepAmountNote')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_auto] gap-2.5">
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTxn()}
              className="font-mono-num px-3 py-2.5 bg-white border border-[#DCD2BC] rounded-[6px] focus:outline-none focus:border-[#7A2E28] focus:ring-1 focus:ring-[#7A2E28]/20 text-[15px]"
            />
            <input
              type="text"
              placeholder={t('notePh')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTxn()}
              className="px-3 py-2.5 bg-white border border-[#DCD2BC] rounded-[6px] focus:outline-none focus:border-[#7A2E28] focus:ring-1 focus:ring-[#7A2E28]/20 text-[15px]"
            />
            <button
              onClick={addTxn}
              disabled={!amount || parseFloat(amount) <= 0}
              className="px-6 py-2.5 bg-[#1C1915] text-[#F2EADB] rounded-[6px] hover:bg-[#7A2E28] transition-colors text-[14px] font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('addEntry')}
            </button>
          </div>
        </section>

        {/* Ledger */}
        {hasTxns && (
          <section className="mb-8">
            <div className="flex items-baseline justify-between mb-3 gap-3">
              <h2 className="font-display text-[1.35rem] font-[500]">
                {t('ledger')}
                <span className="text-[#7A6F5D] text-[0.9rem] font-mono-num mx-2">· {txns.length}</span>
              </h2>
              <button
                onClick={handleClear}
                className={`text-[12px] underline underline-offset-[3px] decoration-dotted ${
                  confirmingClear ? 'text-[#7A2E28] font-medium' : 'text-[#7A6F5D] hover:text-[#7A2E28]'
                }`}
              >
                {confirmingClear ? t('clearAllConfirm') : t('clearAll')}
              </button>
            </div>
            <div className="bg-[#FCF8EE] border border-[#DCD2BC] rounded-[10px] overflow-hidden">
              {sortedTxns.map((x, i) => {
                const tt = TXN_TYPES[x.type];
                const toneColor =
                  tt.tone === 'box-guardian' ? 'bg-[#2D5F3F]' :
                  tt.tone === 'box-worker'   ? 'bg-[#B8872A]' :
                                                'bg-[#7A2E28]';
                return (
                  <div
                    key={x.id}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-[#F9F0E5] transition-colors ${
                      i !== sortedTxns.length - 1 ? 'border-b border-[#E6DCC3]' : ''
                    }`}
                  >
                    <div className={`w-1 h-8 rounded-full ${toneColor} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium truncate">{tt.short[lang]}</div>
                      {x.note && (
                        <div className="text-[12px] text-[#7A6F5D] truncate italic font-display">
                          {x.note}
                        </div>
                      )}
                    </div>
                    <div className="font-mono-num text-[15px] font-medium shrink-0">
                      {fmt(x.amount)}
                    </div>
                    <button
                      onClick={() => removeTxn(x.id)}
                      className="text-[#9A8F7D] hover:text-[#7A2E28] hover:bg-[#F5E8E0] w-7 h-7 rounded flex items-center justify-center text-lg leading-none shrink-0 transition-colors"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Running balances */}
        {hasTxns && (
          <section className="mb-8">
            <h2 className="font-display text-[1.35rem] font-[500] mb-3">{t('runningBalances')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <BalanceCard
                label={t('boxGuardian')}
                value={GB}
                positive={t('boxOwesG')}
                negative={t('gOwesBox')}
                balanced={t('balanced')}
                fmt={fmt}
              />
              <BalanceCard
                label={t('boxWorker')}
                value={WB}
                positive={t('boxOwesW')}
                negative={t('wHoldsBox')}
                balanced={t('balanced')}
                fmt={fmt}
              />
              <BalanceCard
                label={t('guardianWorker')}
                value={GW}
                positive={t('gOwesW')}
                negative={t('wOwesG')}
                balanced={t('balanced')}
                fmt={fmt}
              />
            </div>
          </section>
        )}

        {/* Closing the books */}
        {hasTxns && (
          <section className="mb-8">
            <h2 className="font-display text-[1.35rem] font-[500] mb-3">{t('closingBooks')}</h2>
            <div className="bg-[#1C1915] text-[#F2EADB] rounded-[12px] p-6 sm:p-8 shadow-[0_8px_24px_rgba(28,25,21,0.15)]">

              {/* Final transfers */}
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#B8AB94] mb-3 font-mono-num">
                {transferCountLabel}
              </div>
              {settlementTxns.length === 0 ? (
                <div className="font-display text-[1.5rem] sm:text-[1.9rem] font-[500] leading-[1.3] italic">
                  {t('nothingToMove')}
                </div>
              ) : (
                <div className="space-y-5">
                  {settlementTxns.map((x, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-4 flex-wrap">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="font-mono-num text-[11px] text-[#B8AB94] shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-[1.25rem] sm:text-[1.55rem] font-[500] leading-[1.25]">
                          {t(txnActionKey(x.from, x.to))}
                        </span>
                      </div>
                      <div className="font-mono-num text-[1.8rem] sm:text-[2.2rem] font-medium text-[#E8B547] leading-none">
                        {fmt(x.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Ending balances */}
              <div className="mt-7 pt-6 border-t border-[#3A342B]">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#B8AB94] mb-3 font-mono-num">
                  {t('endingBalances')}
                </div>
                <div className="space-y-3">
                  <WalletRow
                    label={t('box')}
                    start={openBox}
                    end={endBox}
                    delta={boxNet}
                    fmt={fmt}
                    arrow={arrow}
                  />
                  <WalletRow
                    label={t('guardianWallet')}
                    start={openGuardian}
                    end={endGuardian}
                    delta={endGuardian - openGuardian}
                    fmt={fmt}
                    arrow={arrow}
                  />
                </div>
                {endBox < -0.0001 && (
                  <div className="text-[12px] text-[#E88B7F] mt-3 italic font-display max-w-sm leading-relaxed">
                    {t('boxDeficitNote')}
                  </div>
                )}
              </div>

              {/* Close period */}
              <div className="mt-7 pt-6 border-t border-[#3A342B] flex items-center justify-between gap-3 flex-wrap">
                <div className="text-[12px] text-[#B8AB94] italic font-display flex-1 min-w-[180px] leading-relaxed">
                  {t('closePeriodDesc')}
                </div>
                <button
                  onClick={handleStartNewPeriod}
                  className={`text-[12px] font-mono-num uppercase tracking-[0.15em] px-3 py-2 rounded border transition-colors shrink-0 ${
                    confirmingNewPeriod
                      ? 'border-[#E8B547] text-[#E8B547]'
                      : 'border-[#3A342B] text-[#B8AB94] hover:border-[#B8AB94] hover:text-[#F2EADB]'
                  }`}
                >
                  {confirmingNewPeriod ? t('closePeriodConfirm') : `${t('closePeriod')} ${arrow}`}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Box ledger export */}
        {hasTxns && (
          <section className="mb-8">
            <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
              <h2 className="font-display text-[1.35rem] font-[500]">{t('exportTitle')}</h2>
              {exportRows.length > 0 && (
                <button
                  onClick={copyExport}
                  className={`text-[12px] font-mono-num uppercase tracking-[0.15em] px-3 py-2 rounded border transition-colors ${
                    copiedFlash
                      ? 'border-[#2D5F3F] text-[#2D5F3F] bg-[#EAF2EC]'
                      : 'border-[#DCD2BC] text-[#7A6F5D] hover:border-[#7A2E28] hover:text-[#7A2E28]'
                  }`}
                >
                  {copiedFlash ? `✓ ${t('exportCopied')}` : t('exportCopy')}
                </button>
              )}
            </div>
            <p className="text-[12px] text-[#7A6F5D] italic font-display mb-3 leading-relaxed max-w-2xl">
              {t('exportDesc')}
            </p>
            {exportRows.length > 0 ? (
              <div className="bg-[#FCF8EE] border border-[#DCD2BC] rounded-[10px] overflow-x-auto">
                <table
                  className="w-full font-mono-num text-[12px]"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                >
                  <thead>
                    <tr className="border-b border-[#DCD2BC] text-[10px] uppercase tracking-[0.12em] text-[#9A8F7D]">
                      <th className="px-3 py-2 text-left font-medium">{t('colItem')}</th>
                      <th className="px-3 py-2 text-right font-medium">{t('colValue')}</th>
                      <th className="px-3 py-2 text-left font-medium">{t('colType')}</th>
                      <th className="px-3 py-2 text-left font-medium">{t('colComments')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exportRows.map((r, i) => (
                      <tr
                        key={i}
                        className={i !== exportRows.length - 1 ? 'border-b border-[#E6DCC3]' : ''}
                      >
                        <td className="px-3 py-1.5">{r.item}</td>
                        <td
                          className={`px-3 py-1.5 text-right ${
                            r.value < 0 ? 'text-[#7A2E28]' : 'text-[#2D5F3F]'
                          }`}
                        >
                          {formatSheetValue(r.value)}
                        </td>
                        <td className="px-3 py-1.5 text-[#5C5345]">{r.typeLabel}</td>
                        <td className="px-3 py-1.5 text-[#7A6F5D]">{r.comments || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-[13px] text-[#7A6F5D] italic font-display py-4">
                {t('exportEmpty')}
              </div>
            )}
          </section>
        )}

        {/* Empty state */}
        {!hasTxns && loaded && (
          <div className="text-center py-16">
            <div className="font-display italic text-[1.15rem] text-[#7A6F5D]">
              {t('emptyTitle')}
            </div>
            <div className="text-[13px] text-[#9A8F7D] mt-1">
              {t('emptyHint')}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-[11px] text-[#9A8F7D] text-center mt-12 pt-6 border-t border-[#DCD2BC] tracking-wide">
          {t('footer')}
        </footer>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

function BalanceCard({ label, value, positive, negative, balanced, fmt }) {
  const isPositive = value > 0.0001;
  const isNegative = value < -0.0001;
  const description = isPositive ? positive : isNegative ? negative : balanced;
  const color = isPositive
    ? 'text-[#2D5F3F]'
    : isNegative
    ? 'text-[#7A2E28]'
    : 'text-[#7A6F5D]';

  return (
    <div className="bg-[#FCF8EE] border border-[#DCD2BC] rounded-[10px] p-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[#7A6F5D] font-mono-num">
        {label}
      </div>
      <div className={`font-mono-num text-[1.6rem] font-medium mt-2 leading-none ${color}`}>
        {isNegative ? '−' : ''}{fmt(value)}
      </div>
      <div className="text-[12px] text-[#5C5345] mt-2 italic font-display leading-snug">
        {description}
      </div>
    </div>
  );
}

function WalletRow({ label, start, end, delta, fmt, arrow }) {
  const deltaSign = delta > 0.0001 ? '+' : delta < -0.0001 ? '−' : '';
  const deltaColor = delta > 0.0001
    ? 'text-[#88C39A]'
    : delta < -0.0001
    ? 'text-[#E88B7F]'
    : 'text-[#B8AB94]';
  const endNegative = end < -0.0001;

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <div className="text-[13px] text-[#B8AB94] min-w-[9rem] shrink-0">{label}</div>
      <div className="font-mono-num text-[13px] text-[#B8AB94]">
        {start < 0 ? '−' : ''}{fmt(start)}
      </div>
      <div className="text-[#B8AB94] text-[13px]">{arrow}</div>
      <div className={`font-mono-num text-[1.1rem] font-medium ${endNegative ? 'text-[#E88B7F]' : 'text-[#F2EADB]'}`}>
        {endNegative ? '−' : ''}{fmt(end)}
      </div>
      {Math.abs(delta) > 0.0001 && (
        <div className={`font-mono-num text-[12px] ${deltaColor} italic`}>
          ({deltaSign}{fmt(delta)})
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Settlement helpers
// -----------------------------------------------------------------------------

// Greedy min-cash-flow: pair biggest debtor with biggest creditor, transfer
// min(|debt|, credit), repeat. For 3 parties this gives at most 2 transactions.
function computeSettlement(nets) {
  const parties = Object.entries(nets)
    .map(([key, net]) => ({ key, net }))
    .filter(p => Math.abs(p.net) > 0.0001);

  const txns = [];
  while (parties.length >= 2) {
    parties.sort((a, b) => a.net - b.net);
    const debtor = parties[0];
    const creditor = parties[parties.length - 1];
    const amount = Math.min(-debtor.net, creditor.net);
    txns.push({ from: debtor.key, to: creditor.key, amount });
    debtor.net += amount;
    creditor.net -= amount;
    for (let i = parties.length - 1; i >= 0; i--) {
      if (Math.abs(parties[i].net) < 0.0001) parties.splice(i, 1);
    }
  }
  return txns;
}

function txnActionKey(from, to) {
  const map = {
    'guardian→worker': 'actGW',
    'worker→guardian': 'actWG',
    'guardian→box':    'actGBdeposit',
    'worker→box':      'actWBdeposit',
    'box→guardian':    'actGBwithdraw',
    'box→worker':      'actWBwithdraw',
  };
  return map[`${from}→${to}`] || `${from}→${to}`;
}

// Translate a ledger entry into a sheet row. Returns null for entries that
// aren't box-related (personal Guardian ↔ Worker transactions). The Item
// column is a generic category label; the entry's note goes into Comments.
function buildSheetRow(x, t) {
  const note = (x.note || '').trim();
  switch (x.type) {
    case 'w_collected':
      return { item: t('fbCollection'),    value:  x.amount, typeLabel: 'Income',  comments: note };
    case 'g_owes_box':
      return { item: t('fbGSubscription'), value:  x.amount, typeLabel: 'Income',  comments: note };
    case 'g_paid_bill':
      return { item: t('fbBill'),          value: -x.amount, typeLabel: 'OutCome', comments: note };
    case 'w_paid_box':
      return { item: t('fbExpense'),       value: -x.amount, typeLabel: 'OutCome', comments: note };
    case 'g_paid_w':
      return { item: t('fbServices'),      value: -x.amount, typeLabel: 'OutCome', comments: note };
    default:
      return null; // w_paid_g — personal, not box-related
  }
}

// Format numeric values the way the existing sheet uses them: preserve
// significant precision up to 3 decimals, no trailing zeros, no forced
// decimals (matches entries like "40", "-5", "24.777", "155.98").
function formatSheetValue(n) {
  if (Math.abs(n) < 0.0005) return '0';
  const s = n.toFixed(3);
  return s.replace(/\.?0+$/, '');
}