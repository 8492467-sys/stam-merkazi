// ============================================================
// אתר הסת"ם המרכזי — קונפיגורציית קטגוריות משותפת
// משמש: דף הבית (כרטיסים), categories-all.html (סינון), form.html (שדות), listing.html (תצוגת פרטים)
// כדי להוסיף/לשנות שדה בקטגוריה — מספיק לערוך כאן, אין צורך בשינוי DB (השדות נשמרים ב-listings.details כ-jsonb)
// ============================================================

const ALL_CATS = [
  'mezuzot','tefillin','sifrei-torah','megillot','taggers','hagahot',
  'pitum-ketoret','judaica-art','shkafim','klaf-stores','kulmusim',
  'sofer-rooms','drushim','cases','courses'
];

const CAT_HE = {
  'mezuzot':       'מזוזות',
  'tefillin':      'תפילין',
  'sifrei-torah':  'ספרי תורה',
  'megillot':      'מגילות',
  'taggers':       'מתייגים',
  'hagahot':       'הגהות (גברא ומחשב)',
  'pitum-ketoret': 'פיטומי קטורת',
  'judaica-art':   'יודאיקה ואומנות',
  'shkafim':       'שקפים וקיפולים',
  'klaf-stores':   'חנויות קלף',
  'kulmusim':      'קולמוסים',
  'sofer-rooms':   'חדרי סופרים',
  'drushim':       'דרושים',
  'cases':         'תיקים ונרתיקים',
  'courses':       'קורסים',
  'forum':         'פורום'
};

const CAT_DESC = {
  'mezuzot':       'מזוזות כתובות, בדוקות ומהודרות',
  'tefillin':      'תפילין רש"י, ר"ת ומהודרים',
  'sifrei-torah':  'ספרי תורה למכירה, קנייה ובדיקה',
  'megillot':      'מגילת אסתר ושאר המגילות',
  'taggers':       'תיוג תפילין, מזוזות וספרי תורה',
  'hagahot':       'הגהת גברא ומחשב לכתבי סת"ם',
  'pitum-ketoret': 'פיטומי קטורת לבית ולבית הכנסת',
  'judaica-art':   'יודאיקה ואומנות יהודית',
  'shkafim':       'שקפי הגהה וקיפולי מזוזה',
  'klaf-stores':   'קלף לתפילין, מזוזות וספרי תורה',
  'kulmusim':      'קולמוסים וכלי כתיבה לסת"ם',
  'sofer-rooms':   'חדרי עבודה והשכרה לסופרי סת"ם',
  'drushim':       'דרושים — מוצרים ועבודה בתחום',
  'cases':         'תיקים ונרתיקים לתפילין, מזוזות וספרי תורה',
  'courses':       'קורסי סופרות, הגהה ותיוג',
  'forum':         'שאלות ותשובות בעולם הסת"ם'
};

const CAT_ICON = {
  'mezuzot':       '🚪',
  'tefillin':      '📿',
  'sifrei-torah':  '📜',
  'megillot':      '📃',
  'taggers':       '✍️',
  'hagahot':       '🔍',
  'pitum-ketoret': '🌿',
  'judaica-art':   '🎨',
  'shkafim':       '🗂️',
  'klaf-stores':   '📦',
  'kulmusim':      '🪶',
  'sofer-rooms':   '🏢',
  'drushim':       '📢',
  'cases':         '👜',
  'courses':       '🎓',
  'forum':         '💬'
};

// צבע מבחין לכל קטגוריה (על רקע קרם/שחור הנושא הכללי)
const CAT_COLOR = {
  'mezuzot':       { color:'#8a5a2b', bg:'#f7ecdf', shadow:'rgba(138,90,43,.18)' },
  'tefillin':      { color:'#1f3a5f', bg:'#e6ecf4', shadow:'rgba(31,58,95,.18)' },
  'sifrei-torah':  { color:'#6b3fa0', bg:'#efe6f7', shadow:'rgba(107,63,160,.18)' },
  'megillot':      { color:'#8e2434', bg:'#fbe7ea', shadow:'rgba(142,36,52,.18)' },
  'taggers':       { color:'#0f7d6f', bg:'#e2f5f2', shadow:'rgba(15,125,111,.18)' },
  'hagahot':       { color:'#3c5a99', bg:'#e8edf7', shadow:'rgba(60,90,153,.18)' },
  'pitum-ketoret': { color:'#6f7d2c', bg:'#eef3df', shadow:'rgba(111,125,44,.18)' },
  'judaica-art':   { color:'#a3326b', bg:'#fbe7f0', shadow:'rgba(163,50,107,.18)' },
  'shkafim':       { color:'#b5651d', bg:'#faece0', shadow:'rgba(181,101,29,.18)' },
  'klaf-stores':   { color:'#9c7a3c', bg:'#f6efe0', shadow:'rgba(156,122,60,.18)' },
  'kulmusim':      { color:'#2f6b4f', bg:'#e3f1ea', shadow:'rgba(47,107,79,.18)' },
  'sofer-rooms':   { color:'#5b4636', bg:'#efe9e3', shadow:'rgba(91,70,54,.18)' },
  'drushim':       { color:'#b3382c', bg:'#fbe6e3', shadow:'rgba(179,56,44,.18)' },
  'cases':         { color:'#4a3f8f', bg:'#e9e7f7', shadow:'rgba(74,63,143,.18)' },
  'courses':       { color:'#1d7a8c', bg:'#e1f3f6', shadow:'rgba(29,122,140,.18)' },
  'forum':         { color:'#a8841c', bg:'#faf1d8', shadow:'rgba(168,132,28,.18)' }
};

// ------------------------------------------------------------
// שדות ייעודיים לקטגוריה — משמשים גם לטופס הפרסום וגם לסינון
// type: 'select' (גם לסינון וגם לטופס) | 'text' (טופס בלבד)
// ------------------------------------------------------------
const CATEGORY_FIELDS = {
  'mezuzot': [
    { key:'ktav',  label:'סוג כתב',     type:'select', options:['אשכנזי','ספרדי','עדות מזרח (בלאדי)','אר"י','בית יוסף','אחר'] },
    { key:'size',  label:'גודל',        type:'select', options:['10 ס"מ','12 ס"מ','15 ס"מ','20 ס"מ','מידות שונות'] },
    { key:'klaf',  label:'סוג קלף',     type:'select', options:['קלף עגל','קלף גוויל','קלף רגיל'] },
    { key:'hidur', label:'רמת הידור',   type:'select', options:['רגיל','מהודר','מהודר מאוד','בד"ץ / בדיקה מיוחדת'] },
    { key:'price', label:'מחיר',        type:'text', placeholder:'לדוגמה: 350 ₪' }
  ],
  'tefillin': [
    { key:'sug',       label:'סוג',          type:'select', options:['רש"י','ר"ת','רש"י ור"ת (פשוטים)','שניהם (זוג מהודר)'] },
    { key:'hidur',     label:'רמת הידור',    type:'select', options:['פשוטים','מהודרים','מהודרים מאוד','בית יוסף'] },
    { key:'batim',     label:'סוג בתים',     type:'select', options:['גוהצין','פשוטין','דוקין סבע','גסות'] },
    { key:'condition', label:'מצב',          type:'select', options:['חדש','יד שנייה'] },
    { key:'price',     label:'מחיר',         type:'text', placeholder:'לדוגמה: 1200 ₪' }
  ],
  'sifrei-torah': [
    { key:'ktav',      label:'סוג כתב',       type:'select', options:['בית יוסף','וועליש','אר"י (חב"ד)','ספרדי','תימני','אחר'] },
    { key:'condition', label:'מצב',           type:'select', options:['חדש','משומש - שמור היטב','משומש - דורש בדיקה'] },
    { key:'computer_check', label:'בדיקת מחשב', type:'select', options:['בוצעה','לא בוצעה'] },
    { key:'size',      label:'גובה (ס"מ)',    type:'text', placeholder:'לדוגמה: 60' },
    { key:'price',     label:'מחיר',          type:'text', placeholder:'לדוגמה: 35000 ₪' }
  ],
  'megillot': [
    { key:'megillah_type', label:'סוג מגילה', type:'select', options:['אסתר','רות','איכה','קהלת','שיר השירים'] },
    { key:'ktav',          label:'סוג כתב',   type:'select', options:['אשכנזי','ספרדי','עדות מזרח','אחר'] },
    { key:'size',          label:'גודל',      type:'text', placeholder:'לדוגמה: 30 ס"מ' },
    { key:'price',         label:'מחיר',      type:'text' }
  ],
  'taggers': [
    { key:'work_type',   label:'סוג עבודה',     type:'select', options:['תפילין','מזוזות','ספרי תורה','מגילות','הכל'] },
    { key:'experience',  label:'ותק / ניסיון',   type:'select', options:['עד שנה','1-3 שנים','3-10 שנים','מעל 10 שנים'] },
    { key:'area',        label:'אזור עבודה',     type:'text', placeholder:'לדוגמה: ירושלים והסביבה' },
    { key:'price',       label:'מחיר ליחידה',    type:'text' }
  ],
  'hagahot': [
    { key:'check_type', label:'סוג הגהה',   type:'select', options:['גברא (ידנית)','מחשב','גברא ומחשב'] },
    { key:'doc_type',   label:'סוג מסמך',   type:'select', options:['ספר תורה','תפילין','מזוזות','מגילות','הכל'] },
    { key:'availability', label:'זמינות',   type:'select', options:['מיידי','עד שבוע','לפי תיאום'] },
    { key:'price',      label:'מחיר',       type:'text' }
  ],
  'pitum-ketoret': [
    { key:'format', label:'סוג',   type:'select', options:['כתוב יד','מודפס','מצויר / מאוייר','ממוסגר'] },
    { key:'size',   label:'גודל',  type:'text', placeholder:'לדוגמה: A4' },
    { key:'price',  label:'מחיר',  type:'text' }
  ],
  'judaica-art': [
    { key:'item_type', label:'סוג מוצר', type:'select', options:['חנוכיות','כלי קידוש','מזוזות מעוצבות','ניירות קצף / תמונות','שיוויתי','אחר'] },
    { key:'material',  label:'חומר',     type:'select', options:['כסף','עץ','נייר / ניירות קצף','זכוכית','אחר'] },
    { key:'price',     label:'מחיר',     type:'text' }
  ],
  'shkafim': [
    { key:'item_type', label:'סוג',  type:'select', options:['קיפולי מזוזה','שקפי הגהה','תבניות תיוג','אחר'] },
    { key:'size',      label:'גודל', type:'text' },
    { key:'price',     label:'מחיר', type:'text' }
  ],
  'klaf-stores': [
    { key:'klaf_for',    label:'סוג קלף',    type:'select', options:['לתפילין','למזוזות','לספר תורה','למגילות','כללי'] },
    { key:'processing',  label:'סוג עיבוד',  type:'select', options:['עגל','בהמה (גדול)','אחר'] },
    { key:'price',       label:'מחיר ליחידה', type:'text' }
  ],
  'kulmusim': [
    { key:'reed_type',   label:'סוג קנה',   type:'select', options:['קולמוס קנה','קולמוס פלסטיק','נוצה'] },
    { key:'suited_for',  label:'התאמה',     type:'select', options:['כתיבה (סת"ם)','הגהה','שניהם'] },
    { key:'price',       label:'מחיר',      type:'text' }
  ],
  'sofer-rooms': [
    { key:'location',  label:'מיקום',          type:'text', placeholder:'עיר / שכונה' },
    { key:'room_size', label:'גודל החדר',      type:'text', placeholder:'לדוגמה: 12 מ"ר' },
    { key:'equipment', label:'ציוד כלול',      type:'select', options:['שולחן כתיבה בלבד','שולחן + תאורה','מאובזר במלואו'] },
    { key:'price',     label:'מחיר השכרה',     type:'text', placeholder:'לדוגמה: 800 ₪ לחודש' }
  ],
  'drushim': [
    { key:'request_type', label:'סוג בקשה', type:'select', options:['מוצר מבוקש','דרוש לעבודה','דרוש שירות'] },
    { key:'field',        label:'תחום',     type:'select', options: ALL_CATS.filter(c => c !== 'drushim').map(c => CAT_HE[c]) },
    { key:'area',         label:'אזור',     type:'text', placeholder:'לדוגמה: ירושלים והסביבה' }
  ],
  'cases': [
    { key:'item_type', label:'סוג',   type:'select', options:['תיק תפילין','נרתיק מזוזה','נרתיק / תיק לספר תורה','נרתיק מגילה','אחר'] },
    { key:'material',  label:'חומר',  type:'select', options:['עור','קטיפה','עץ','כסף','אחר'] },
    { key:'price',     label:'מחיר',  type:'text' }
  ],
  'courses': [
    { key:'course_type', label:'סוג קורס',  type:'select', options:['סופרות סת"ם','הגהה','תיוג','זיהוי תקלות','הלכות סת"ם','אחר'] },
    { key:'format',      label:'מסגרת',     type:'select', options:['פרונטלי','מקוון','פרונטלי ומקוון'] },
    { key:'audience',    label:'קהל יעד',   type:'select', options:['גברים','נשים','הכל'] },
    { key:'duration',    label:'משך הקורס', type:'text', placeholder:'לדוגמה: 3 חודשים' },
    { key:'location',    label:'מיקום',     type:'text' }
  ]
};

// ------------------------------------------------------------
// תוכן משפטי (מודאל בפוטר)
// ------------------------------------------------------------
const LEGAL_CONTENT = {
  privacy: {
    title: 'מדיניות פרטיות',
    body: `
      <p>אתר "הסת"ם המרכזי" אוסף מידע שאתם מוסרים מרצונכם בעת התחברות או פרסום מודעה, לרבות שם, מספר טלפון, כתובת אימייל, תוכן המודעה ותמונות שמועלות.</p>
      <p><strong>שימוש במידע:</strong> המידע משמש להצגת המודעה לציבור, ולאפשר יצירת קשר בין משתמשים (טלפון/וואטסאפ), ולניהול האזור האישי שלכם באתר.</p>
      <p><strong>צדדים שלישיים:</strong> אחסון הנתונים, ההתחברות (Google) ואחסון התמונות מתבצעים באמצעות שירות Supabase. קישורי וואטסאפ מעבירים אתכם לשירות חיצוני שמדיניות הפרטיות שלו חלה משם ואילך.</p>
      <p><strong>שמירה ומחיקה:</strong> ניתן לבקש בכל עת מחיקת חשבון, מודעה או תמונות שהועלו, על ידי פנייה לכתובת שבהמשך, או דרך מחיקה עצמית באזור האישי.</p>
      <p><strong>אבטחה:</strong> ננקטים אמצעים סבירים להגנה על המידע, אך לא ניתן להבטיח הגנה מוחלטת מפני גישה בלתי מורשית.</p>
      <p>מדיניות זו עשויה להתעדכן מעת לעת, ועדכונים יפורסמו בעמוד זה.</p>
      <p><strong>יצירת קשר בנושא פרטיות:</strong> <a href="mailto:info@setam-merkazi.co.il">info@setam-merkazi.co.il</a></p>
    `
  },
  terms: {
    title: 'תנאי שימוש',
    body: `
      <p>השימוש באתר "הסת"ם המרכזי" מהווה הסכמה לתנאים המפורטים להלן.</p>
      <p><strong>אחריות לתוכן:</strong> תוכן המודעות המתפרסמות באתר הוא באחריות המפרסם בלבד. האתר אינו בודק ואינו מאמת את דיוק הפרטים, הכשרות ההלכתית, ההכשרים, המחירים, הזמינות או חוקיות התכנים המפורסמים.</p>
      <p><strong>כשרות ובדיקות:</strong> כל הצהרה לגבי הכשרים, בדיקות מחשב, גושפנקאות או רמת הידור היא באחריות המפרסם בלבד. מומלץ לבדוק כל פריט סת"ם מול גורם מוסמך לפני רכישה.</p>
      <p><strong>כללי התנהגות:</strong> אסור לפרסם תוכן פוגעני, מטעה, מפר זכויות יוצרים או המנוגד לחוק. האתר רשאי להסיר מודעות, פוסטים או חשבונות לפי שיקול דעתו וללא הודעה מוקדמת.</p>
      <p><strong>עסקאות בין משתמשים:</strong> כל עסקה, מגע או הסכם בין משתמשים (קנייה, מכירה, השכרה, מתן שירות וכו') הוא באחריותם הבלעדית של הצדדים. האתר משמש כפלטפורמה להצגת מודעות בלבד ואינו צד לעסקה.</p>
      <p><strong>זמינות השירות:</strong> האתר ניתן לשימוש כפי שהוא ("AS IS"), ללא התחייבות לזמינות רציפה או נטולת תקלות.</p>
      <p><strong>דין וסמכות שיפוט:</strong> על השימוש באתר יחול הדין הישראלי, וסמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים בירושלים.</p>
      <p><strong>יצירת קשר:</strong> <a href="mailto:info@setam-merkazi.co.il">info@setam-merkazi.co.il</a></p>
    `
  },
  accessibility: {
    title: 'הצהרת נגישות',
    body: `
      <p>אתר "הסת"ם המרכזי" רואה חשיבות רבה במתן שירות שוויוני ונגיש לכלל הציבור, לרבות אנשים עם מוגבלויות, ופועל לשיפור הנגישות באופן מתמשך.</p>
      <p><strong>התאמות הנגישות שבוצעו באתר:</strong></p>
      <ul>
        <li>קישור "דלג לתוכן העיקרי" בראש כל עמוד</li>
        <li>תמיכה בניווט ובהפעלה באמצעות מקלדת</li>
        <li>תיוגי ARIA לרכיבי ניווט, כפתורים וטפסים</li>
        <li>ניגודיות צבעים נאותה בין טקסט לרקע</li>
        <li>תאימות לקוראי מסך</li>
        <li>תצוגה מותאמת למכשירים ניידים</li>
      </ul>
      <p>ייתכנו חלקים באתר שטרם הונגשו במלואם. אנו ממשיכים לעבוד על שיפור הנגישות באתר.</p>
      <p><strong>נתקלתם בבעיית נגישות?</strong> נשמח לדעת ולטפל בפנייה בהקדם האפשרי: <a href="mailto:info@setam-merkazi.co.il">info@setam-merkazi.co.il</a></p>
    `
  }
};
