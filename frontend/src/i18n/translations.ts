export type Lang =
  | "en" | "pt" | "fa"
  | "de" | "fr" | "ja" | "nl" | "sv" | "no" | "da" | "it" | "es" | "tr" | "ar";

export const LANGS: { code: Lang; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English",    flag: "🇬🇧", dir: "ltr" },
  { code: "pt", label: "Português",  flag: "🇧🇷", dir: "ltr" },
  { code: "fa", label: "فارسی",      flag: "🇮🇷", dir: "rtl" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪", dir: "ltr" },
  { code: "fr", label: "Français",   flag: "🇫🇷", dir: "ltr" },
  { code: "ja", label: "日本語",      flag: "🇯🇵", dir: "ltr" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱", dir: "ltr" },
  { code: "sv", label: "Svenska",    flag: "🇸🇪", dir: "ltr" },
  { code: "no", label: "Norsk",      flag: "🇳🇴", dir: "ltr" },
  { code: "da", label: "Dansk",      flag: "🇩🇰", dir: "ltr" },
  { code: "it", label: "Italiano",   flag: "🇮🇹", dir: "ltr" },
  { code: "es", label: "Español",    flag: "🇪🇸", dir: "ltr" },
  { code: "tr", label: "Türkçe",     flag: "🇹🇷", dir: "ltr" },
  { code: "ar", label: "العربية",    flag: "🇸🇦", dir: "rtl" },
];

export interface Translations {
  dir: "ltr" | "rtl";
  header: {
    admin: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subtitle: string;
    supported: { icon: string; label: string }[];
  };
  howTo: {
    heading: string;
    subheading: string;
    steps: { step: string; label: string; desc: string }[];
  };
  features: {
    heading: string;
    items: { icon: string; title: string; desc: string; delay: string }[];
  };
  footer: {
    madeWith: string;
  };
  download: {
    placeholder: string;
    button: string;
    fetchPreview: string;
    fetchingPreview: string;
    downloadNow: string;
    tryAnother: string;
    tip: string;
    errorInvalidUrl: string;
    errorTypeMismatch: string;
    errorServer: string;
    errorConnection: string;
    errorRateLimit: (limit: number) => string;
    typeLabels: { reel: string; post: string; carousel: string; story: string; all: string };
  };
  steps: {
    step1: string;
    step2: string;
    step3: string;
  };
  progress: {
    steps: { label: string; icon: string; desc: string }[];
    analyzing: string;
    downloading: string;
    processing: string;
    ready: string;
    preparing: string;
  };
  preview: {
    readyToDownload: string;
    downloadVideo: string;
    downloadImage: string;
    downloadZip: (n: number) => string;
    downloadIndividual: string;
    slideLabel: (i: number) => string;
    image: string;
    video: string;
    copyLink: string;
    copied: string;
    anotherLink: string;
    zipInfo: (n: number) => string;
    types: Record<string, { label: string; icon: string; color: string }>;
  };
}

// ─── English ──────────────────────────────────────────────────────────────────
const en: Translations = {
  dir: "ltr",
  header: { admin: "Admin Panel" },
  hero: {
    badge: "Free · No sign-up · Instant",
    titleLine1: "Download",
    titleHighlight: "Reels & Posts",
    titleLine2: "from Instagram",
    subtitle: "Pick your content type, paste the link, and download in seconds — for free.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "Post" },
      { icon: "🖼️", label: "Image" },
      { icon: "🎞️", label: "Carousel" },
    ],
  },
  howTo: {
    heading: "3 Simple Steps",
    subheading: "No installation needed. Works directly in your browser.",
    steps: [
      { step: "1", label: "Copy the link", desc: "Copy the link of the reel or post from Instagram." },
      { step: "2", label: "Paste it", desc: "Paste the link in the box above and hit Download." },
      { step: "3", label: "Download!", desc: "Wait a few seconds — your file will be ready." },
    ],
  },
  features: {
    heading: "Why JazzGhost?",
    items: [
      { icon: "fast",    title: "Ultra Fast",      desc: "Direct download at the highest available quality, no speed limits.", delay: "anim-delay-100" },
      { icon: "formats", title: "All Formats",     desc: "Reels, posts, images, carousels — we support them all.",            delay: "anim-delay-200" },
      { icon: "private", title: "Private",         desc: "Files are never stored permanently. Deleted after download.",       delay: "anim-delay-300" },
      { icon: "free",    title: "Completely Free", desc: "No sign-up or payment needed for daily downloads.",                 delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Made with ❤️ by Jonah Sabri" },
  download: {
    placeholder: "Paste an Instagram reel or post link here...",
    button: "Download",
    fetchPreview: "Get Preview",
    fetchingPreview: "Fetching preview…",
    downloadNow: "Download Now",
    tryAnother: "← Try another link",
    tip: "Supports Reel · Post · Image · Carousel",
    errorInvalidUrl: "Link must be from Instagram (instagram.com).",
    errorTypeMismatch: "This link doesn't look like a {type}. Please select the correct type.",
    errorServer: "Error sending request.",
    errorConnection: "Connection error with server.",
    errorRateLimit: (limit) => `You have reached your daily limit of ${limit} downloads. Please try again tomorrow.`,
    typeLabels: { reel: "Reel", post: "Post", carousel: "Carousel", story: "Story", all: "Any" },
  },
  steps: {
    step1: "Analyzing link",
    step2: "Downloading media",
    step3: "Preparing file",
  },
  progress: {
    steps: [
      { label: "Receive link",   icon: "🔗", desc: "Analyzing link" },
      { label: "Process file",   icon: "⚙️", desc: "Downloading content" },
      { label: "Ready",          icon: "✅", desc: "Delivering file" },
    ],
    analyzing:  "Analyzing link...",
    downloading: "Downloading file...",
    processing:  "Processing...",
    ready:       "🎉 Ready to download!",
    preparing:   "Preparing...",
  },
  preview: {
    readyToDownload: "Ready to download",
    downloadVideo:   "Download Video",
    downloadImage:   "Download Image",
    downloadZip:     (n) => `Download ZIP (${n} files)`,
    downloadIndividual: "Individual",
    slideLabel:      (i) => `Slide ${i + 1}`,
    image: "Image",
    video: "Video",
    copyLink: "Copy link",
    copied:   "Copied!",
    anotherLink: "← Download another link",
    zipInfo:  (n) => `All ${n} files are bundled into a ZIP.`,
    types: {
      reel:     { label: "Reel",     icon: "🎬", color: "#a855f7" },
      post:     { label: "Post",     icon: "📸", color: "#06b6d4" },
      image:    { label: "Image",    icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "Carousel", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "Story",    icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",     icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "Video",    icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── Brazilian Portuguese ─────────────────────────────────────────────────────
const pt: Translations = {
  dir: "ltr",
  header: { admin: "Painel Admin" },
  hero: {
    badge: "Grátis · Sem cadastro · Instantâneo",
    titleLine1: "Baixe",
    titleHighlight: "Reels e Posts",
    titleLine2: "do Instagram",
    subtitle: "Escolha o tipo de conteúdo, cole o link e baixe em segundos — de graça.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "Post" },
      { icon: "🖼️", label: "Imagem" },
      { icon: "🎞️", label: "Carrossel" },
    ],
  },
  howTo: {
    heading: "3 Passos Simples",
    subheading: "Sem instalação. Funciona direto no navegador.",
    steps: [
      { step: "1", label: "Copie o link",  desc: "Copie o link do reel ou post do Instagram." },
      { step: "2", label: "Cole aqui",     desc: "Cole o link na caixa acima e clique em Baixar." },
      { step: "3", label: "Baixar!",       desc: "Aguarde alguns segundos — seu arquivo estará pronto." },
    ],
  },
  features: {
    heading: "Por que JazzGhost?",
    items: [
      { icon: "fast",    title: "Ultra Rápido",        desc: "Download direto na maior qualidade, sem limite de velocidade.", delay: "anim-delay-100" },
      { icon: "formats", title: "Todos os Formatos",   desc: "Reels, posts, imagens, carrosséis — tudo suportado.",         delay: "anim-delay-200" },
      { icon: "private", title: "Privacidade",         desc: "Arquivos não ficam armazenados. Excluídos após o download.",  delay: "anim-delay-300" },
      { icon: "free",    title: "Completamente Grátis",desc: "Sem cadastro ou pagamento para downloads diários.",           delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Feito com ❤️ por Jonah Sabri" },
  download: {
    placeholder: "Cole aqui o link do reel ou post do Instagram...",
    button: "Baixar",
    fetchPreview: "Ver Preview",
    fetchingPreview: "Carregando preview…",
    downloadNow: "Baixar Agora",
    tryAnother: "← Tentar outro link",
    tip: "Suporta Reel · Post · Imagem · Carrossel",
    errorInvalidUrl: "O link deve ser do Instagram (instagram.com).",
    errorTypeMismatch: "Este link não parece ser um {type}. Selecione o tipo correto.",
    errorServer: "Erro ao enviar a requisição.",
    errorConnection: "Erro de conexão com o servidor.",
    errorRateLimit: (limit) => `Você atingiu seu limite diário de ${limit} downloads. Tente novamente amanhã.`,
    typeLabels: { reel: "Reel", post: "Post", carousel: "Carrossel", story: "Story", all: "Qualquer" },
  },
  steps: {
    step1: "Analisando link",
    step2: "Baixando mídia",
    step3: "Preparando arquivo",
  },
  progress: {
    steps: [
      { label: "Receber link",     icon: "🔗", desc: "Analisando link" },
      { label: "Processar arquivo", icon: "⚙️", desc: "Baixando conteúdo" },
      { label: "Pronto",           icon: "✅", desc: "Entregando arquivo" },
    ],
    analyzing:   "Analisando link...",
    downloading: "Baixando arquivo...",
    processing:  "Processando...",
    ready:       "🎉 Pronto para baixar!",
    preparing:   "Preparando...",
  },
  preview: {
    readyToDownload: "Pronto para baixar",
    downloadVideo:   "Baixar Vídeo",
    downloadImage:   "Baixar Imagem",
    downloadZip:     (n) => `Baixar ZIP (${n} arquivos)`,
    downloadIndividual: "Individual",
    slideLabel:      (i) => `Slide ${i + 1}`,
    image: "Imagem",
    video: "Vídeo",
    copyLink: "Copiar link",
    copied:   "Copiado!",
    anotherLink: "← Baixar outro link",
    zipInfo:  (n) => `Todos os ${n} arquivos estão em um ZIP.`,
    types: {
      reel:     { label: "Reel",      icon: "🎬", color: "#a855f7" },
      post:     { label: "Post",      icon: "📸", color: "#06b6d4" },
      image:    { label: "Imagem",    icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "Carrossel", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "Story",     icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",      icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "Vídeo",     icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── Persian / Farsi ──────────────────────────────────────────────────────────
const fa: Translations = {
  dir: "rtl",
  header: { admin: "پنل مدیریت" },
  hero: {
    badge: "رایگان · بدون ثبت‌نام · فوری",
    titleLine1: "دانلود",
    titleHighlight: "ریلز و پست",
    titleLine2: "اینستاگرام",
    subtitle: "نوع محتوا را انتخاب کن، لینک را بذار و در چند ثانیه دانلود کن — رایگان.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "پست" },
      { icon: "🖼️", label: "تصویر" },
      { icon: "🎞️", label: "کاروسل" },
    ],
  },
  howTo: {
    heading: "در ۳ قدم ساده",
    subheading: "هیچ نصبی لازم نیست. مستقیم از مرورگر.",
    steps: [
      { step: "۱", label: "کپی لینک", desc: "لینک پست یا ریلز مورد نظر را از اینستاگرام کپی کن." },
      { step: "۲", label: "Paste کن", desc: "لینک را در کادر بالا جای‌گذاری کن و روی «دانلود» بزن." },
      { step: "۳", label: "دانلود!",  desc: "چند ثانیه صبر کن، فایل آماده دانلود می‌شود." },
    ],
  },
  features: {
    heading: "چرا JazzGhost؟",
    items: [
      { icon: "fast",    title: "فوق‌سریع",      desc: "دانلود مستقیم با بالاترین کیفیت موجود، بدون محدودیت سرعت.", delay: "anim-delay-100" },
      { icon: "formats", title: "همه فرمت‌ها",   desc: "Reel، پست، تصویر، کاروسل — همه رو پشتیبانی می‌کنیم.",      delay: "anim-delay-200" },
      { icon: "private", title: "حریم خصوصی",    desc: "فایل‌ها روی سرور ذخیره نمی‌مانند. بعد از دانلود پاک می‌شوند.", delay: "anim-delay-300" },
      { icon: "free",    title: "کاملاً رایگان", desc: "بدون نیاز به ثبت‌نام یا پرداخت برای دانلودهای روزانه.",   delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "ساخته‌شده با ❤️ توسط Jonah Sabri" },
  download: {
    placeholder: "لینک ریلز یا پست اینستاگرام را اینجا paste کن...",
    button: "دانلود",
    fetchPreview: "پیش‌نمایش",
    fetchingPreview: "در حال دریافت پیش‌نمایش…",
    downloadNow: "دانلود کن",
    tryAnother: "← لینک دیگری",
    tip: "پشتیبانی از Reel · پست · تصویر · کاروسل",
    errorInvalidUrl: "لینک باید از اینستاگرام (instagram.com) باشد.",
    errorTypeMismatch: "این لینک شبیه {type} نیست. نوع صحیح را انتخاب کنید.",
    errorServer: "خطا در ارسال درخواست.",
    errorConnection: "خطا در ارتباط با سرور.",
    errorRateLimit: (limit) => `سهمیه روزانه شما (${limit} دانلود) تمام شده است. فردا دوباره تلاش کنید.`,
    typeLabels: { reel: "ریلز", post: "پست", carousel: "کاروسل", story: "استوری", all: "همه" },
  },
  steps: {
    step1: "تحلیل لینک",
    step2: "دانلود محتوا",
    step3: "آماده‌سازی فایل",
  },
  progress: {
    steps: [
      { label: "دریافت لینک",   icon: "🔗", desc: "تحلیل لینک" },
      { label: "پردازش فایل",   icon: "⚙️", desc: "دانلود محتوا" },
      { label: "آماده دانلود",  icon: "✅", desc: "تحویل فایل" },
    ],
    analyzing:   "در حال تحلیل لینک...",
    downloading: "در حال دانلود فایل...",
    processing:  "در حال پردازش...",
    ready:       "🎉 دانلود آماده شد!",
    preparing:   "در حال آماده‌سازی...",
  },
  preview: {
    readyToDownload: "آماده دانلود",
    downloadVideo:   "دانلود ویدیو",
    downloadImage:   "دانلود تصویر",
    downloadZip:     (n) => `دانلود ZIP (${n} فایل)`,
    downloadIndividual: "جداگانه",
    slideLabel:      (i) => `اسلاید ${i + 1}`,
    image: "تصویر",
    video: "ویدیو",
    copyLink: "کپی لینک",
    copied:   "کپی شد!",
    anotherLink: "← دانلود لینک دیگری",
    zipInfo:  (n) => `همه ${n} فایل در یک ZIP دانلود می‌شوند.`,
    types: {
      reel:     { label: "Reel",     icon: "🎬", color: "#a855f7" },
      post:     { label: "پست",     icon: "📸", color: "#06b6d4" },
      image:    { label: "تصویر",   icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "کاروسل", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "استوری", icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",    icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "ویدیو",   icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── German ───────────────────────────────────────────────────────────────────
const de: Translations = {
  dir: "ltr",
  header: { admin: "Adminbereich" },
  hero: {
    badge: "Kostenlos · Keine Anmeldung · Sofort",
    titleLine1: "Lade",
    titleHighlight: "Reels & Posts",
    titleLine2: "von Instagram herunter",
    subtitle: "Wähle den Inhaltstyp, füge den Link ein und lade in Sekunden herunter — kostenlos.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "Post" },
      { icon: "🖼️", label: "Bild" },
      { icon: "🎞️", label: "Karussell" },
    ],
  },
  howTo: {
    heading: "3 einfache Schritte",
    subheading: "Keine Installation erforderlich. Funktioniert direkt im Browser.",
    steps: [
      { step: "1", label: "Link kopieren", desc: "Kopiere den Link des Reels oder Posts von Instagram." },
      { step: "2", label: "Einfügen",      desc: "Füge den Link in das Feld oben ein und klicke auf Herunterladen." },
      { step: "3", label: "Herunterladen!", desc: "Warte ein paar Sekunden — deine Datei ist bereit." },
    ],
  },
  features: {
    heading: "Warum JazzGhost?",
    items: [
      { icon: "fast",    title: "Ultraschnell",     desc: "Direkter Download in höchster Qualität, ohne Geschwindigkeitslimits.", delay: "anim-delay-100" },
      { icon: "formats", title: "Alle Formate",     desc: "Reels, Posts, Bilder, Karussells — alles unterstützt.",               delay: "anim-delay-200" },
      { icon: "private", title: "Privat",           desc: "Dateien werden nie dauerhaft gespeichert. Nach dem Download gelöscht.", delay: "anim-delay-300" },
      { icon: "free",    title: "Völlig kostenlos", desc: "Keine Anmeldung oder Zahlung für tägliche Downloads erforderlich.",   delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Mit ❤️ gemacht von Jonah Sabri" },
  download: {
    placeholder: "Instagram-Reel- oder Post-Link hier einfügen...",
    button: "Herunterladen",
    fetchPreview: "Vorschau anzeigen",
    fetchingPreview: "Vorschau wird geladen…",
    downloadNow: "Jetzt herunterladen",
    tryAnother: "← Anderen Link versuchen",
    tip: "Unterstützt Reel · Post · Bild · Karussell",
    errorInvalidUrl: "Der Link muss von Instagram (instagram.com) sein.",
    errorTypeMismatch: "Dieser Link sieht nicht wie ein {type} aus. Bitte wähle den richtigen Typ.",
    errorServer: "Fehler beim Senden der Anfrage.",
    errorConnection: "Verbindungsfehler mit dem Server.",
    errorRateLimit: (limit) => `Du hast dein tägliches Limit von ${limit} Downloads erreicht. Versuche es morgen erneut.`,
    typeLabels: { reel: "Reel", post: "Post", carousel: "Karussell", story: "Story", all: "Beliebig" },
  },
  steps: {
    step1: "Link analysieren",
    step2: "Medien herunterladen",
    step3: "Datei vorbereiten",
  },
  progress: {
    steps: [
      { label: "Link empfangen", icon: "🔗", desc: "Link analysieren" },
      { label: "Datei verarbeiten", icon: "⚙️", desc: "Inhalt herunterladen" },
      { label: "Bereit",          icon: "✅", desc: "Datei bereitstellen" },
    ],
    analyzing:   "Link wird analysiert...",
    downloading: "Datei wird heruntergeladen...",
    processing:  "Verarbeitung läuft...",
    ready:       "🎉 Bereit zum Herunterladen!",
    preparing:   "Vorbereitung...",
  },
  preview: {
    readyToDownload: "Bereit zum Herunterladen",
    downloadVideo:   "Video herunterladen",
    downloadImage:   "Bild herunterladen",
    downloadZip:     (n) => `ZIP herunterladen (${n} Dateien)`,
    downloadIndividual: "Einzeln",
    slideLabel:      (i) => `Folie ${i + 1}`,
    image: "Bild",
    video: "Video",
    copyLink: "Link kopieren",
    copied:   "Kopiert!",
    anotherLink: "← Anderen Link herunterladen",
    zipInfo:  (n) => `Alle ${n} Dateien sind in einer ZIP-Datei gebündelt.`,
    types: {
      reel:     { label: "Reel",      icon: "🎬", color: "#a855f7" },
      post:     { label: "Post",      icon: "📸", color: "#06b6d4" },
      image:    { label: "Bild",      icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "Karussell", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "Story",     icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",      icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "Video",     icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── French ───────────────────────────────────────────────────────────────────
const fr: Translations = {
  dir: "ltr",
  header: { admin: "Panneau Admin" },
  hero: {
    badge: "Gratuit · Sans inscription · Instantané",
    titleLine1: "Téléchargez",
    titleHighlight: "Reels & Posts",
    titleLine2: "depuis Instagram",
    subtitle: "Choisissez le type de contenu, collez le lien et téléchargez en quelques secondes — gratuitement.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "Post" },
      { icon: "🖼️", label: "Image" },
      { icon: "🎞️", label: "Carrousel" },
    ],
  },
  howTo: {
    heading: "3 étapes simples",
    subheading: "Aucune installation requise. Fonctionne directement dans votre navigateur.",
    steps: [
      { step: "1", label: "Copiez le lien", desc: "Copiez le lien du reel ou du post depuis Instagram." },
      { step: "2", label: "Collez-le",      desc: "Collez le lien dans la zone ci-dessus et cliquez sur Télécharger." },
      { step: "3", label: "Téléchargez !",  desc: "Attendez quelques secondes — votre fichier sera prêt." },
    ],
  },
  features: {
    heading: "Pourquoi JazzGhost ?",
    items: [
      { icon: "fast",    title: "Ultra rapide",       desc: "Téléchargement direct à la qualité maximale, sans limites de vitesse.", delay: "anim-delay-100" },
      { icon: "formats", title: "Tous les formats",   desc: "Reels, posts, images, carrousels — tout est pris en charge.",          delay: "anim-delay-200" },
      { icon: "private", title: "Privé",              desc: "Les fichiers ne sont jamais stockés définitivement. Supprimés après le téléchargement.", delay: "anim-delay-300" },
      { icon: "free",    title: "Entièrement gratuit",desc: "Aucune inscription ni paiement requis pour les téléchargements quotidiens.", delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Fait avec ❤️ par Jonah Sabri" },
  download: {
    placeholder: "Collez ici un lien de reel ou de post Instagram...",
    button: "Télécharger",
    fetchPreview: "Aperçu",
    fetchingPreview: "Chargement de l'aperçu…",
    downloadNow: "Télécharger maintenant",
    tryAnother: "← Essayer un autre lien",
    tip: "Supporte Reel · Post · Image · Carrousel",
    errorInvalidUrl: "Le lien doit provenir d'Instagram (instagram.com).",
    errorTypeMismatch: "Ce lien ne ressemble pas à un {type}. Veuillez sélectionner le bon type.",
    errorServer: "Erreur lors de l'envoi de la requête.",
    errorConnection: "Erreur de connexion avec le serveur.",
    errorRateLimit: (limit) => `Vous avez atteint votre limite quotidienne de ${limit} téléchargements. Réessayez demain.`,
    typeLabels: { reel: "Reel", post: "Post", carousel: "Carrousel", story: "Story", all: "N'importe lequel" },
  },
  steps: {
    step1: "Analyse du lien",
    step2: "Téléchargement du média",
    step3: "Préparation du fichier",
  },
  progress: {
    steps: [
      { label: "Recevoir le lien",   icon: "🔗", desc: "Analyse du lien" },
      { label: "Traiter le fichier", icon: "⚙️", desc: "Téléchargement du contenu" },
      { label: "Prêt",               icon: "✅", desc: "Livraison du fichier" },
    ],
    analyzing:   "Analyse du lien...",
    downloading: "Téléchargement du fichier...",
    processing:  "Traitement en cours...",
    ready:       "🎉 Prêt à télécharger !",
    preparing:   "Préparation...",
  },
  preview: {
    readyToDownload: "Prêt à télécharger",
    downloadVideo:   "Télécharger la vidéo",
    downloadImage:   "Télécharger l'image",
    downloadZip:     (n) => `Télécharger ZIP (${n} fichiers)`,
    downloadIndividual: "Individuel",
    slideLabel:      (i) => `Diapositive ${i + 1}`,
    image: "Image",
    video: "Vidéo",
    copyLink: "Copier le lien",
    copied:   "Copié !",
    anotherLink: "← Télécharger un autre lien",
    zipInfo:  (n) => `Tous les ${n} fichiers sont regroupés dans un ZIP.`,
    types: {
      reel:     { label: "Reel",      icon: "🎬", color: "#a855f7" },
      post:     { label: "Post",      icon: "📸", color: "#06b6d4" },
      image:    { label: "Image",     icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "Carrousel", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "Story",     icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",      icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "Vidéo",     icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── Japanese ─────────────────────────────────────────────────────────────────
const ja: Translations = {
  dir: "ltr",
  header: { admin: "管理パネル" },
  hero: {
    badge: "無料 · 登録不要 · 即時",
    titleLine1: "ダウンロード",
    titleHighlight: "リール & 投稿",
    titleLine2: "Instagramから",
    subtitle: "コンテンツタイプを選択し、リンクを貼り付けて数秒でダウンロード — 無料で。",
    supported: [
      { icon: "🎬", label: "リール" },
      { icon: "📸", label: "投稿" },
      { icon: "🖼️", label: "画像" },
      { icon: "🎞️", label: "カルーセル" },
    ],
  },
  howTo: {
    heading: "3つの簡単なステップ",
    subheading: "インストール不要。ブラウザで直接動作します。",
    steps: [
      { step: "1", label: "リンクをコピー", desc: "Instagramからリールまたはポストのリンクをコピーします。" },
      { step: "2", label: "貼り付け",       desc: "上のボックスにリンクを貼り付けてダウンロードをクリック。" },
      { step: "3", label: "ダウンロード！", desc: "数秒待つとファイルが準備できます。" },
    ],
  },
  features: {
    heading: "なぜJazzGhost？",
    items: [
      { icon: "fast",    title: "超高速",       desc: "最高画質で速度制限なしの直接ダウンロード。",     delay: "anim-delay-100" },
      { icon: "formats", title: "全フォーマット", desc: "リール、投稿、画像、カルーセル — すべて対応。", delay: "anim-delay-200" },
      { icon: "private", title: "プライベート",  desc: "ファイルは永久に保存されません。ダウンロード後に削除。", delay: "anim-delay-300" },
      { icon: "free",    title: "完全無料",      desc: "毎日のダウンロードに登録や支払いは不要。",      delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Jonah Sabriが❤️を込めて制作" },
  download: {
    placeholder: "Instagramのリールまたはポストのリンクをここにペースト...",
    button: "ダウンロード",
    fetchPreview: "プレビューを取得",
    fetchingPreview: "プレビューを取得中…",
    downloadNow: "今すぐダウンロード",
    tryAnother: "← 別のリンクを試す",
    tip: "リール · 投稿 · 画像 · カルーセル対応",
    errorInvalidUrl: "リンクはInstagram (instagram.com) のものである必要があります。",
    errorTypeMismatch: "このリンクは{type}のように見えません。正しいタイプを選択してください。",
    errorServer: "リクエストの送信中にエラーが発生しました。",
    errorConnection: "サーバーとの接続エラーが発生しました。",
    errorRateLimit: (limit) => `1日のダウンロード上限（${limit}件）に達しました。明日また試してください。`,
    typeLabels: { reel: "リール", post: "投稿", carousel: "カルーセル", story: "ストーリー", all: "すべて" },
  },
  steps: {
    step1: "リンクを分析中",
    step2: "メディアをダウンロード中",
    step3: "ファイルを準備中",
  },
  progress: {
    steps: [
      { label: "リンクを受信",     icon: "🔗", desc: "リンクを分析中" },
      { label: "ファイルを処理",   icon: "⚙️", desc: "コンテンツをダウンロード中" },
      { label: "準備完了",         icon: "✅", desc: "ファイルを配信中" },
    ],
    analyzing:   "リンクを分析中...",
    downloading: "ファイルをダウンロード中...",
    processing:  "処理中...",
    ready:       "🎉 ダウンロード準備完了！",
    preparing:   "準備中...",
  },
  preview: {
    readyToDownload: "ダウンロード準備完了",
    downloadVideo:   "動画をダウンロード",
    downloadImage:   "画像をダウンロード",
    downloadZip:     (n) => `ZIPをダウンロード（${n}ファイル）`,
    downloadIndividual: "個別",
    slideLabel:      (i) => `スライド ${i + 1}`,
    image: "画像",
    video: "動画",
    copyLink: "リンクをコピー",
    copied:   "コピーしました！",
    anotherLink: "← 別のリンクをダウンロード",
    zipInfo:  (n) => `${n}個のファイルすべてがZIPにまとめられています。`,
    types: {
      reel:     { label: "リール",    icon: "🎬", color: "#a855f7" },
      post:     { label: "投稿",      icon: "📸", color: "#06b6d4" },
      image:    { label: "画像",      icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "カルーセル", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "ストーリー", icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",      icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "動画",      icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── Dutch ────────────────────────────────────────────────────────────────────
const nl: Translations = {
  dir: "ltr",
  header: { admin: "Beheerpaneel" },
  hero: {
    badge: "Gratis · Geen aanmelding · Direct",
    titleLine1: "Download",
    titleHighlight: "Reels & Posts",
    titleLine2: "van Instagram",
    subtitle: "Kies het inhoudstype, plak de link en download in seconden — gratis.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "Post" },
      { icon: "🖼️", label: "Afbeelding" },
      { icon: "🎞️", label: "Carrousel" },
    ],
  },
  howTo: {
    heading: "3 eenvoudige stappen",
    subheading: "Geen installatie nodig. Werkt direct in uw browser.",
    steps: [
      { step: "1", label: "Kopieer de link", desc: "Kopieer de link van de reel of post van Instagram." },
      { step: "2", label: "Plak hem",        desc: "Plak de link in het vak hierboven en klik op Downloaden." },
      { step: "3", label: "Downloaden!",     desc: "Wacht een paar seconden — uw bestand is klaar." },
    ],
  },
  features: {
    heading: "Waarom JazzGhost?",
    items: [
      { icon: "fast",    title: "Ultranel",         desc: "Directe download in de hoogst beschikbare kwaliteit, zonder snelheidsbeperkingen.", delay: "anim-delay-100" },
      { icon: "formats", title: "Alle formaten",    desc: "Reels, posts, afbeeldingen, carrousels — we ondersteunen ze allemaal.",            delay: "anim-delay-200" },
      { icon: "private", title: "Privé",            desc: "Bestanden worden nooit permanent opgeslagen. Verwijderd na het downloaden.",       delay: "anim-delay-300" },
      { icon: "free",    title: "Volledig gratis",  desc: "Geen aanmelding of betaling nodig voor dagelijkse downloads.",                     delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Gemaakt met ❤️ door Jonah Sabri" },
  download: {
    placeholder: "Plak hier een Instagram reel- of postlink...",
    button: "Downloaden",
    fetchPreview: "Voorbeeld bekijken",
    fetchingPreview: "Voorbeeld laden…",
    downloadNow: "Nu downloaden",
    tryAnother: "← Andere link proberen",
    tip: "Ondersteunt Reel · Post · Afbeelding · Carrousel",
    errorInvalidUrl: "De link moet van Instagram (instagram.com) zijn.",
    errorTypeMismatch: "Deze link ziet er niet uit als een {type}. Selecteer het juiste type.",
    errorServer: "Fout bij het verzenden van het verzoek.",
    errorConnection: "Verbindingsfout met de server.",
    errorRateLimit: (limit) => `U heeft uw dagelijkse limiet van ${limit} downloads bereikt. Probeer het morgen opnieuw.`,
    typeLabels: { reel: "Reel", post: "Post", carousel: "Carrousel", story: "Story", all: "Willekeurig" },
  },
  steps: {
    step1: "Link analyseren",
    step2: "Media downloaden",
    step3: "Bestand voorbereiden",
  },
  progress: {
    steps: [
      { label: "Link ontvangen",    icon: "🔗", desc: "Link analyseren" },
      { label: "Bestand verwerken", icon: "⚙️", desc: "Inhoud downloaden" },
      { label: "Klaar",             icon: "✅", desc: "Bestand leveren" },
    ],
    analyzing:   "Link analyseren...",
    downloading: "Bestand downloaden...",
    processing:  "Verwerken...",
    ready:       "🎉 Klaar om te downloaden!",
    preparing:   "Voorbereiden...",
  },
  preview: {
    readyToDownload: "Klaar om te downloaden",
    downloadVideo:   "Video downloaden",
    downloadImage:   "Afbeelding downloaden",
    downloadZip:     (n) => `ZIP downloaden (${n} bestanden)`,
    downloadIndividual: "Individueel",
    slideLabel:      (i) => `Dia ${i + 1}`,
    image: "Afbeelding",
    video: "Video",
    copyLink: "Link kopiëren",
    copied:   "Gekopieerd!",
    anotherLink: "← Andere link downloaden",
    zipInfo:  (n) => `Alle ${n} bestanden zijn gebundeld in een ZIP.`,
    types: {
      reel:     { label: "Reel",      icon: "🎬", color: "#a855f7" },
      post:     { label: "Post",      icon: "📸", color: "#06b6d4" },
      image:    { label: "Afbeelding", icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "Carrousel", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "Story",     icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",      icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "Video",     icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── Swedish ──────────────────────────────────────────────────────────────────
const sv: Translations = {
  dir: "ltr",
  header: { admin: "Adminpanel" },
  hero: {
    badge: "Gratis · Ingen registrering · Omedelbart",
    titleLine1: "Ladda ner",
    titleHighlight: "Reels & Inlägg",
    titleLine2: "från Instagram",
    subtitle: "Välj innehållstyp, klistra in länken och ladda ner på sekunder — gratis.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "Inlägg" },
      { icon: "🖼️", label: "Bild" },
      { icon: "🎞️", label: "Karusell" },
    ],
  },
  howTo: {
    heading: "3 enkla steg",
    subheading: "Ingen installation behövs. Fungerar direkt i din webbläsare.",
    steps: [
      { step: "1", label: "Kopiera länken", desc: "Kopiera länken till reelen eller inlägget från Instagram." },
      { step: "2", label: "Klistra in",     desc: "Klistra in länken i rutan ovan och klicka på Ladda ner." },
      { step: "3", label: "Ladda ner!",     desc: "Vänta några sekunder — din fil är redo." },
    ],
  },
  features: {
    heading: "Varför JazzGhost?",
    items: [
      { icon: "fast",    title: "Ultrasnabb",     desc: "Direkt nedladdning i högsta tillgängliga kvalitet, inga hastighetsbegränsningar.", delay: "anim-delay-100" },
      { icon: "formats", title: "Alla format",    desc: "Reels, inlägg, bilder, karuseller — vi stöder allt.",                            delay: "anim-delay-200" },
      { icon: "private", title: "Privat",         desc: "Filer lagras aldrig permanent. Raderas efter nedladdning.",                      delay: "anim-delay-300" },
      { icon: "free",    title: "Helt gratis",    desc: "Ingen registrering eller betalning krävs för dagliga nedladdningar.",            delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Gjord med ❤️ av Jonah Sabri" },
  download: {
    placeholder: "Klistra in en Instagram-reel- eller inlägglänk här...",
    button: "Ladda ner",
    fetchPreview: "Hämta förhandsgranskning",
    fetchingPreview: "Hämtar förhandsgranskning…",
    downloadNow: "Ladda ner nu",
    tryAnother: "← Prova en annan länk",
    tip: "Stöder Reel · Inlägg · Bild · Karusell",
    errorInvalidUrl: "Länken måste vara från Instagram (instagram.com).",
    errorTypeMismatch: "Denna länk ser inte ut som en {type}. Välj rätt typ.",
    errorServer: "Fel vid sändning av begäran.",
    errorConnection: "Anslutningsfel med servern.",
    errorRateLimit: (limit) => `Du har nått din dagliga gräns på ${limit} nedladdningar. Försök igen imorgon.`,
    typeLabels: { reel: "Reel", post: "Inlägg", carousel: "Karusell", story: "Story", all: "Alla" },
  },
  steps: {
    step1: "Analyserar länk",
    step2: "Laddar ner media",
    step3: "Förbereder fil",
  },
  progress: {
    steps: [
      { label: "Ta emot länk",    icon: "🔗", desc: "Analyserar länk" },
      { label: "Bearbeta fil",    icon: "⚙️", desc: "Laddar ner innehåll" },
      { label: "Klar",            icon: "✅", desc: "Levererar fil" },
    ],
    analyzing:   "Analyserar länk...",
    downloading: "Laddar ner fil...",
    processing:  "Bearbetar...",
    ready:       "🎉 Redo att ladda ner!",
    preparing:   "Förbereder...",
  },
  preview: {
    readyToDownload: "Redo att ladda ner",
    downloadVideo:   "Ladda ner video",
    downloadImage:   "Ladda ner bild",
    downloadZip:     (n) => `Ladda ner ZIP (${n} filer)`,
    downloadIndividual: "Individuell",
    slideLabel:      (i) => `Bild ${i + 1}`,
    image: "Bild",
    video: "Video",
    copyLink: "Kopiera länk",
    copied:   "Kopierat!",
    anotherLink: "← Ladda ner en annan länk",
    zipInfo:  (n) => `Alla ${n} filer är samlade i en ZIP.`,
    types: {
      reel:     { label: "Reel",     icon: "🎬", color: "#a855f7" },
      post:     { label: "Inlägg",   icon: "📸", color: "#06b6d4" },
      image:    { label: "Bild",     icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "Karusell", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "Story",    icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",     icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "Video",    icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── Norwegian ────────────────────────────────────────────────────────────────
const no: Translations = {
  dir: "ltr",
  header: { admin: "Adminpanel" },
  hero: {
    badge: "Gratis · Ingen registrering · Umiddelbart",
    titleLine1: "Last ned",
    titleHighlight: "Reels & Innlegg",
    titleLine2: "fra Instagram",
    subtitle: "Velg innholdstype, lim inn lenken og last ned på sekunder — gratis.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "Innlegg" },
      { icon: "🖼️", label: "Bilde" },
      { icon: "🎞️", label: "Karusell" },
    ],
  },
  howTo: {
    heading: "3 enkle trinn",
    subheading: "Ingen installasjon nødvendig. Fungerer direkte i nettleseren.",
    steps: [
      { step: "1", label: "Kopier lenken", desc: "Kopier lenken til reelen eller innlegget fra Instagram." },
      { step: "2", label: "Lim inn",       desc: "Lim inn lenken i boksen ovenfor og klikk på Last ned." },
      { step: "3", label: "Last ned!",     desc: "Vent noen sekunder — filen din er klar." },
    ],
  },
  features: {
    heading: "Hvorfor JazzGhost?",
    items: [
      { icon: "fast",    title: "Ultrarask",      desc: "Direkte nedlasting i høyeste tilgjengelige kvalitet, ingen hastighetsbegrensninger.", delay: "anim-delay-100" },
      { icon: "formats", title: "Alle formater",  desc: "Reels, innlegg, bilder, karuseller — vi støtter dem alle.",                          delay: "anim-delay-200" },
      { icon: "private", title: "Privat",         desc: "Filer lagres aldri permanent. Slettes etter nedlasting.",                            delay: "anim-delay-300" },
      { icon: "free",    title: "Helt gratis",    desc: "Ingen registrering eller betaling nødvendig for daglige nedlastinger.",              delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Laget med ❤️ av Jonah Sabri" },
  download: {
    placeholder: "Lim inn en Instagram-reel- eller innlegglenke her...",
    button: "Last ned",
    fetchPreview: "Hent forhåndsvisning",
    fetchingPreview: "Henter forhåndsvisning…",
    downloadNow: "Last ned nå",
    tryAnother: "← Prøv en annen lenke",
    tip: "Støtter Reel · Innlegg · Bilde · Karusell",
    errorInvalidUrl: "Lenken må være fra Instagram (instagram.com).",
    errorTypeMismatch: "Denne lenken ser ikke ut som en {type}. Velg riktig type.",
    errorServer: "Feil ved sending av forespørsel.",
    errorConnection: "Tilkoblingsfeil med serveren.",
    errorRateLimit: (limit) => `Du har nådd din daglige grense på ${limit} nedlastinger. Prøv igjen i morgen.`,
    typeLabels: { reel: "Reel", post: "Innlegg", carousel: "Karusell", story: "Story", all: "Alle" },
  },
  steps: {
    step1: "Analyserer lenke",
    step2: "Laster ned media",
    step3: "Forbereder fil",
  },
  progress: {
    steps: [
      { label: "Motta lenke",    icon: "🔗", desc: "Analyserer lenke" },
      { label: "Behandle fil",   icon: "⚙️", desc: "Laster ned innhold" },
      { label: "Klar",           icon: "✅", desc: "Leverer fil" },
    ],
    analyzing:   "Analyserer lenke...",
    downloading: "Laster ned fil...",
    processing:  "Behandler...",
    ready:       "🎉 Klar til nedlasting!",
    preparing:   "Forbereder...",
  },
  preview: {
    readyToDownload: "Klar til nedlasting",
    downloadVideo:   "Last ned video",
    downloadImage:   "Last ned bilde",
    downloadZip:     (n) => `Last ned ZIP (${n} filer)`,
    downloadIndividual: "Individuell",
    slideLabel:      (i) => `Lysbilde ${i + 1}`,
    image: "Bilde",
    video: "Video",
    copyLink: "Kopier lenke",
    copied:   "Kopiert!",
    anotherLink: "← Last ned en annen lenke",
    zipInfo:  (n) => `Alle ${n} filer er samlet i en ZIP.`,
    types: {
      reel:     { label: "Reel",     icon: "🎬", color: "#a855f7" },
      post:     { label: "Innlegg",  icon: "📸", color: "#06b6d4" },
      image:    { label: "Bilde",    icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "Karusell", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "Story",    icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",     icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "Video",    icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── Danish ───────────────────────────────────────────────────────────────────
const da: Translations = {
  dir: "ltr",
  header: { admin: "Adminpanel" },
  hero: {
    badge: "Gratis · Ingen tilmelding · Øjeblikkeligt",
    titleLine1: "Download",
    titleHighlight: "Reels & Opslag",
    titleLine2: "fra Instagram",
    subtitle: "Vælg indholdstype, indsæt linket og download på sekunder — gratis.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "Opslag" },
      { icon: "🖼️", label: "Billede" },
      { icon: "🎞️", label: "Karrusel" },
    ],
  },
  howTo: {
    heading: "3 enkle trin",
    subheading: "Ingen installation nødvendig. Fungerer direkte i din browser.",
    steps: [
      { step: "1", label: "Kopiér linket", desc: "Kopiér linket til reelen eller opslaget fra Instagram." },
      { step: "2", label: "Indsæt det",    desc: "Indsæt linket i boksen ovenfor og klik på Download." },
      { step: "3", label: "Download!",     desc: "Vent et par sekunder — din fil er klar." },
    ],
  },
  features: {
    heading: "Hvorfor JazzGhost?",
    items: [
      { icon: "fast",    title: "Ultraraskt",    desc: "Direkte download i højest tilgængelige kvalitet, ingen hastighedsbegrænsninger.", delay: "anim-delay-100" },
      { icon: "formats", title: "Alle formater", desc: "Reels, opslag, billeder, karruseller — vi understøtter dem alle.",               delay: "anim-delay-200" },
      { icon: "private", title: "Privat",        desc: "Filer gemmes aldrig permanent. Slettes efter download.",                        delay: "anim-delay-300" },
      { icon: "free",    title: "Helt gratis",   desc: "Ingen tilmelding eller betaling nødvendig for daglige downloads.",              delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Lavet med ❤️ af Jonah Sabri" },
  download: {
    placeholder: "Indsæt et Instagram-reel- eller opslagslink her...",
    button: "Download",
    fetchPreview: "Hent forhåndsvisning",
    fetchingPreview: "Henter forhåndsvisning…",
    downloadNow: "Download nu",
    tryAnother: "← Prøv et andet link",
    tip: "Understøtter Reel · Opslag · Billede · Karrusel",
    errorInvalidUrl: "Linket skal være fra Instagram (instagram.com).",
    errorTypeMismatch: "Dette link ligner ikke en {type}. Vælg den rigtige type.",
    errorServer: "Fejl ved afsendelse af anmodning.",
    errorConnection: "Forbindelsesfejl med serveren.",
    errorRateLimit: (limit) => `Du har nået din daglige grænse på ${limit} downloads. Prøv igen i morgen.`,
    typeLabels: { reel: "Reel", post: "Opslag", carousel: "Karrusel", story: "Story", all: "Alle" },
  },
  steps: {
    step1: "Analyserer link",
    step2: "Downloader medie",
    step3: "Forbereder fil",
  },
  progress: {
    steps: [
      { label: "Modtag link",    icon: "🔗", desc: "Analyserer link" },
      { label: "Behandl fil",    icon: "⚙️", desc: "Downloader indhold" },
      { label: "Klar",           icon: "✅", desc: "Leverer fil" },
    ],
    analyzing:   "Analyserer link...",
    downloading: "Downloader fil...",
    processing:  "Behandler...",
    ready:       "🎉 Klar til download!",
    preparing:   "Forbereder...",
  },
  preview: {
    readyToDownload: "Klar til download",
    downloadVideo:   "Download video",
    downloadImage:   "Download billede",
    downloadZip:     (n) => `Download ZIP (${n} filer)`,
    downloadIndividual: "Individuel",
    slideLabel:      (i) => `Slide ${i + 1}`,
    image: "Billede",
    video: "Video",
    copyLink: "Kopiér link",
    copied:   "Kopieret!",
    anotherLink: "← Download et andet link",
    zipInfo:  (n) => `Alle ${n} filer er samlet i en ZIP.`,
    types: {
      reel:     { label: "Reel",     icon: "🎬", color: "#a855f7" },
      post:     { label: "Opslag",   icon: "📸", color: "#06b6d4" },
      image:    { label: "Billede",  icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "Karrusel", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "Story",    icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",     icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "Video",    icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── Italian ──────────────────────────────────────────────────────────────────
const it: Translations = {
  dir: "ltr",
  header: { admin: "Pannello Admin" },
  hero: {
    badge: "Gratuito · Senza registrazione · Istantaneo",
    titleLine1: "Scarica",
    titleHighlight: "Reel e Post",
    titleLine2: "da Instagram",
    subtitle: "Scegli il tipo di contenuto, incolla il link e scarica in secondi — gratuitamente.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "Post" },
      { icon: "🖼️", label: "Immagine" },
      { icon: "🎞️", label: "Carosello" },
    ],
  },
  howTo: {
    heading: "3 semplici passi",
    subheading: "Nessuna installazione richiesta. Funziona direttamente nel browser.",
    steps: [
      { step: "1", label: "Copia il link", desc: "Copia il link del reel o del post da Instagram." },
      { step: "2", label: "Incollalo",     desc: "Incolla il link nella casella sopra e clicca su Scarica." },
      { step: "3", label: "Scarica!",      desc: "Aspetta qualche secondo — il tuo file sarà pronto." },
    ],
  },
  features: {
    heading: "Perché JazzGhost?",
    items: [
      { icon: "fast",    title: "Ultrarapido",        desc: "Download diretto alla massima qualità disponibile, senza limiti di velocità.", delay: "anim-delay-100" },
      { icon: "formats", title: "Tutti i formati",    desc: "Reel, post, immagini, caroselli — li supportiamo tutti.",                    delay: "anim-delay-200" },
      { icon: "private", title: "Privato",            desc: "I file non vengono mai archiviati permanentemente. Eliminati dopo il download.", delay: "anim-delay-300" },
      { icon: "free",    title: "Completamente gratis",desc: "Nessuna registrazione o pagamento necessario per i download giornalieri.",   delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Fatto con ❤️ da Jonah Sabri" },
  download: {
    placeholder: "Incolla qui un link di reel o post di Instagram...",
    button: "Scarica",
    fetchPreview: "Ottieni anteprima",
    fetchingPreview: "Caricamento anteprima…",
    downloadNow: "Scarica ora",
    tryAnother: "← Prova un altro link",
    tip: "Supporta Reel · Post · Immagine · Carosello",
    errorInvalidUrl: "Il link deve provenire da Instagram (instagram.com).",
    errorTypeMismatch: "Questo link non sembra essere un {type}. Seleziona il tipo corretto.",
    errorServer: "Errore nell'invio della richiesta.",
    errorConnection: "Errore di connessione con il server.",
    errorRateLimit: (limit) => `Hai raggiunto il tuo limite giornaliero di ${limit} download. Riprova domani.`,
    typeLabels: { reel: "Reel", post: "Post", carousel: "Carosello", story: "Storia", all: "Qualsiasi" },
  },
  steps: {
    step1: "Analisi del link",
    step2: "Download del media",
    step3: "Preparazione del file",
  },
  progress: {
    steps: [
      { label: "Ricevi link",      icon: "🔗", desc: "Analisi del link" },
      { label: "Elabora file",     icon: "⚙️", desc: "Download del contenuto" },
      { label: "Pronto",           icon: "✅", desc: "Consegna del file" },
    ],
    analyzing:   "Analisi del link...",
    downloading: "Download del file...",
    processing:  "Elaborazione...",
    ready:       "🎉 Pronto per il download!",
    preparing:   "Preparazione...",
  },
  preview: {
    readyToDownload: "Pronto per il download",
    downloadVideo:   "Scarica video",
    downloadImage:   "Scarica immagine",
    downloadZip:     (n) => `Scarica ZIP (${n} file)`,
    downloadIndividual: "Individuale",
    slideLabel:      (i) => `Diapositiva ${i + 1}`,
    image: "Immagine",
    video: "Video",
    copyLink: "Copia link",
    copied:   "Copiato!",
    anotherLink: "← Scarica un altro link",
    zipInfo:  (n) => `Tutti i ${n} file sono raccolti in un ZIP.`,
    types: {
      reel:     { label: "Reel",     icon: "🎬", color: "#a855f7" },
      post:     { label: "Post",     icon: "📸", color: "#06b6d4" },
      image:    { label: "Immagine", icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "Carosello",icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "Storia",   icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",     icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "Video",    icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── Spanish ──────────────────────────────────────────────────────────────────
const es: Translations = {
  dir: "ltr",
  header: { admin: "Panel de Administración" },
  hero: {
    badge: "Gratis · Sin registro · Instantáneo",
    titleLine1: "Descarga",
    titleHighlight: "Reels y Publicaciones",
    titleLine2: "de Instagram",
    subtitle: "Elige el tipo de contenido, pega el enlace y descarga en segundos — gratis.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "Publicación" },
      { icon: "🖼️", label: "Imagen" },
      { icon: "🎞️", label: "Carrusel" },
    ],
  },
  howTo: {
    heading: "3 pasos sencillos",
    subheading: "Sin instalación. Funciona directamente en tu navegador.",
    steps: [
      { step: "1", label: "Copia el enlace", desc: "Copia el enlace del reel o la publicación de Instagram." },
      { step: "2", label: "Pégalo",          desc: "Pega el enlace en el cuadro de arriba y haz clic en Descargar." },
      { step: "3", label: "¡Descarga!",      desc: "Espera unos segundos — tu archivo estará listo." },
    ],
  },
  features: {
    heading: "¿Por qué JazzGhost?",
    items: [
      { icon: "fast",    title: "Ultra rápido",      desc: "Descarga directa en la mayor calidad disponible, sin límites de velocidad.", delay: "anim-delay-100" },
      { icon: "formats", title: "Todos los formatos",desc: "Reels, publicaciones, imágenes, carruseles — los soportamos todos.",       delay: "anim-delay-200" },
      { icon: "private", title: "Privado",           desc: "Los archivos nunca se almacenan permanentemente. Eliminados tras la descarga.", delay: "anim-delay-300" },
      { icon: "free",    title: "Completamente gratis",desc: "Sin registro ni pago necesario para descargas diarias.",                 delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Hecho con ❤️ por Jonah Sabri" },
  download: {
    placeholder: "Pega aquí un enlace de reel o publicación de Instagram...",
    button: "Descargar",
    fetchPreview: "Ver vista previa",
    fetchingPreview: "Cargando vista previa…",
    downloadNow: "Descargar ahora",
    tryAnother: "← Intentar con otro enlace",
    tip: "Compatible con Reel · Publicación · Imagen · Carrusel",
    errorInvalidUrl: "El enlace debe ser de Instagram (instagram.com).",
    errorTypeMismatch: "Este enlace no parece ser un {type}. Por favor selecciona el tipo correcto.",
    errorServer: "Error al enviar la solicitud.",
    errorConnection: "Error de conexión con el servidor.",
    errorRateLimit: (limit) => `Has alcanzado tu límite diario de ${limit} descargas. Inténtalo mañana.`,
    typeLabels: { reel: "Reel", post: "Publicación", carousel: "Carrusel", story: "Historia", all: "Cualquiera" },
  },
  steps: {
    step1: "Analizando enlace",
    step2: "Descargando media",
    step3: "Preparando archivo",
  },
  progress: {
    steps: [
      { label: "Recibir enlace",   icon: "🔗", desc: "Analizando enlace" },
      { label: "Procesar archivo", icon: "⚙️", desc: "Descargando contenido" },
      { label: "Listo",            icon: "✅", desc: "Entregando archivo" },
    ],
    analyzing:   "Analizando enlace...",
    downloading: "Descargando archivo...",
    processing:  "Procesando...",
    ready:       "🎉 ¡Listo para descargar!",
    preparing:   "Preparando...",
  },
  preview: {
    readyToDownload: "Listo para descargar",
    downloadVideo:   "Descargar video",
    downloadImage:   "Descargar imagen",
    downloadZip:     (n) => `Descargar ZIP (${n} archivos)`,
    downloadIndividual: "Individual",
    slideLabel:      (i) => `Diapositiva ${i + 1}`,
    image: "Imagen",
    video: "Video",
    copyLink: "Copiar enlace",
    copied:   "¡Copiado!",
    anotherLink: "← Descargar otro enlace",
    zipInfo:  (n) => `Los ${n} archivos están empaquetados en un ZIP.`,
    types: {
      reel:     { label: "Reel",       icon: "🎬", color: "#a855f7" },
      post:     { label: "Publicación", icon: "📸", color: "#06b6d4" },
      image:    { label: "Imagen",     icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "Carrusel",   icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "Historia",   icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",       icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "Video",      icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── Turkish ──────────────────────────────────────────────────────────────────
const tr: Translations = {
  dir: "ltr",
  header: { admin: "Yönetici Paneli" },
  hero: {
    badge: "Ücretsiz · Kayıt gerektirmez · Anında",
    titleLine1: "İndir",
    titleHighlight: "Reels ve Gönderiler",
    titleLine2: "Instagram'dan",
    subtitle: "İçerik türünü seç, bağlantıyı yapıştır ve saniyeler içinde indir — ücretsiz.",
    supported: [
      { icon: "🎬", label: "Reel" },
      { icon: "📸", label: "Gönderi" },
      { icon: "🖼️", label: "Görsel" },
      { icon: "🎞️", label: "Carousel" },
    ],
  },
  howTo: {
    heading: "3 Kolay Adım",
    subheading: "Kurulum gerekmez. Doğrudan tarayıcınızda çalışır.",
    steps: [
      { step: "1", label: "Bağlantıyı kopyala", desc: "Instagram'dan reel veya gönderinin bağlantısını kopyalayın." },
      { step: "2", label: "Yapıştır",            desc: "Bağlantıyı yukarıdaki kutuya yapıştırın ve İndir'e tıklayın." },
      { step: "3", label: "İndir!",              desc: "Birkaç saniye bekleyin — dosyanız hazır olacak." },
    ],
  },
  features: {
    heading: "Neden JazzGhost?",
    items: [
      { icon: "fast",    title: "Ultra Hızlı",       desc: "Hız limiti olmaksızın mevcut en yüksek kalitede doğrudan indirme.", delay: "anim-delay-100" },
      { icon: "formats", title: "Tüm Formatlar",     desc: "Reels, gönderiler, görseller, carousel'lar — hepsini destekliyoruz.", delay: "anim-delay-200" },
      { icon: "private", title: "Gizli",             desc: "Dosyalar hiçbir zaman kalıcı olarak saklanmaz. İndirmeden sonra silinir.", delay: "anim-delay-300" },
      { icon: "free",    title: "Tamamen Ücretsiz",  desc: "Günlük indirmeler için kayıt veya ödeme gerekmez.", delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "Jonah Sabri tarafından ❤️ ile yapıldı" },
  download: {
    placeholder: "Buraya bir Instagram reel veya gönderi bağlantısı yapıştırın...",
    button: "İndir",
    fetchPreview: "Önizleme Al",
    fetchingPreview: "Önizleme yükleniyor…",
    downloadNow: "Şimdi İndir",
    tryAnother: "← Başka bir bağlantı dene",
    tip: "Reel · Gönderi · Görsel · Carousel destekler",
    errorInvalidUrl: "Bağlantı Instagram'dan (instagram.com) olmalıdır.",
    errorTypeMismatch: "Bu bağlantı bir {type} gibi görünmüyor. Doğru türü seçin.",
    errorServer: "İstek gönderilirken hata oluştu.",
    errorConnection: "Sunucuyla bağlantı hatası.",
    errorRateLimit: (limit) => `Günlük ${limit} indirme limitinize ulaştınız. Lütfen yarın tekrar deneyin.`,
    typeLabels: { reel: "Reel", post: "Gönderi", carousel: "Carousel", story: "Hikaye", all: "Herhangi" },
  },
  steps: {
    step1: "Bağlantı analiz ediliyor",
    step2: "Medya indiriliyor",
    step3: "Dosya hazırlanıyor",
  },
  progress: {
    steps: [
      { label: "Bağlantı al",    icon: "🔗", desc: "Bağlantı analiz ediliyor" },
      { label: "Dosyayı işle",   icon: "⚙️", desc: "İçerik indiriliyor" },
      { label: "Hazır",          icon: "✅", desc: "Dosya teslim ediliyor" },
    ],
    analyzing:   "Bağlantı analiz ediliyor...",
    downloading: "Dosya indiriliyor...",
    processing:  "İşleniyor...",
    ready:       "🎉 İndirmeye hazır!",
    preparing:   "Hazırlanıyor...",
  },
  preview: {
    readyToDownload: "İndirmeye hazır",
    downloadVideo:   "Videoyu İndir",
    downloadImage:   "Görseli İndir",
    downloadZip:     (n) => `ZIP İndir (${n} dosya)`,
    downloadIndividual: "Bireysel",
    slideLabel:      (i) => `Slayt ${i + 1}`,
    image: "Görsel",
    video: "Video",
    copyLink: "Bağlantıyı kopyala",
    copied:   "Kopyalandı!",
    anotherLink: "← Başka bir bağlantı indir",
    zipInfo:  (n) => `Tüm ${n} dosya bir ZIP'te paketlendi.`,
    types: {
      reel:     { label: "Reel",     icon: "🎬", color: "#a855f7" },
      post:     { label: "Gönderi",  icon: "📸", color: "#06b6d4" },
      image:    { label: "Görsel",   icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "Carousel", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "Hikaye",   icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",     icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "Video",    icon: "🎥",  color: "#7c3aed" },
    },
  },
};

// ─── Arabic ───────────────────────────────────────────────────────────────────
const ar: Translations = {
  dir: "rtl",
  header: { admin: "لوحة الإدارة" },
  hero: {
    badge: "مجاني · بدون تسجيل · فوري",
    titleLine1: "تحميل",
    titleHighlight: "ريلز والمنشورات",
    titleLine2: "من إنستاغرام",
    subtitle: "اختر نوع المحتوى، الصق الرابط وحمّل في ثوانٍ — مجاناً.",
    supported: [
      { icon: "🎬", label: "ريل" },
      { icon: "📸", label: "منشور" },
      { icon: "🖼️", label: "صورة" },
      { icon: "🎞️", label: "كاروسيل" },
    ],
  },
  howTo: {
    heading: "٣ خطوات بسيطة",
    subheading: "لا حاجة للتثبيت. يعمل مباشرةً في متصفحك.",
    steps: [
      { step: "١", label: "انسخ الرابط", desc: "انسخ رابط الريل أو المنشور من إنستاغرام." },
      { step: "٢", label: "الصقه",       desc: "الصق الرابط في المربع أعلاه وانقر على تحميل." },
      { step: "٣", label: "حمّل!",       desc: "انتظر بضع ثوانٍ — ملفك سيكون جاهزاً." },
    ],
  },
  features: {
    heading: "لماذا JazzGhost؟",
    items: [
      { icon: "fast",    title: "فائق السرعة",   desc: "تحميل مباشر بأعلى جودة متاحة، بدون حدود للسرعة.", delay: "anim-delay-100" },
      { icon: "formats", title: "جميع الصيغ",    desc: "ريلز، منشورات، صور، كاروسيل — ندعم الجميع.",    delay: "anim-delay-200" },
      { icon: "private", title: "خاص",            desc: "الملفات لا تُحفظ نهائياً. تُحذف بعد التحميل.",   delay: "anim-delay-300" },
      { icon: "free",    title: "مجاني تماماً",  desc: "لا حاجة للتسجيل أو الدفع للتحميلات اليومية.",   delay: "anim-delay-400" },
    ],
  },
  footer: { madeWith: "صُنع بـ ❤️ من قِبل Jonah Sabri" },
  download: {
    placeholder: "الصق هنا رابط ريل أو منشور إنستاغرام...",
    button: "تحميل",
    fetchPreview: "الحصول على معاينة",
    fetchingPreview: "جارٍ تحميل المعاينة…",
    downloadNow: "تحميل الآن",
    tryAnother: "← تجربة رابط آخر",
    tip: "يدعم ريل · منشور · صورة · كاروسيل",
    errorInvalidUrl: "يجب أن يكون الرابط من إنستاغرام (instagram.com).",
    errorTypeMismatch: "هذا الرابط لا يبدو {type}. يرجى اختيار النوع الصحيح.",
    errorServer: "خطأ في إرسال الطلب.",
    errorConnection: "خطأ في الاتصال بالخادم.",
    errorRateLimit: (limit) => `لقد وصلت إلى حدك اليومي وهو ${limit} تحميلات. يرجى المحاولة غداً.`,
    typeLabels: { reel: "ريل", post: "منشور", carousel: "كاروسيل", story: "قصة", all: "أي نوع" },
  },
  steps: {
    step1: "تحليل الرابط",
    step2: "تحميل الوسائط",
    step3: "تجهيز الملف",
  },
  progress: {
    steps: [
      { label: "استلام الرابط",  icon: "🔗", desc: "تحليل الرابط" },
      { label: "معالجة الملف",  icon: "⚙️", desc: "تحميل المحتوى" },
      { label: "جاهز",           icon: "✅", desc: "تسليم الملف" },
    ],
    analyzing:   "جارٍ تحليل الرابط...",
    downloading: "جارٍ تحميل الملف...",
    processing:  "جارٍ المعالجة...",
    ready:       "🎉 جاهز للتحميل!",
    preparing:   "جارٍ التجهيز...",
  },
  preview: {
    readyToDownload: "جاهز للتحميل",
    downloadVideo:   "تحميل الفيديو",
    downloadImage:   "تحميل الصورة",
    downloadZip:     (n) => `تحميل ZIP (${n} ملفات)`,
    downloadIndividual: "فردي",
    slideLabel:      (i) => `شريحة ${i + 1}`,
    image: "صورة",
    video: "فيديو",
    copyLink: "نسخ الرابط",
    copied:   "تم النسخ!",
    anotherLink: "← تحميل رابط آخر",
    zipInfo:  (n) => `جميع الـ${n} ملفات مجمّعة في ZIP.`,
    types: {
      reel:     { label: "ريل",      icon: "🎬", color: "#a855f7" },
      post:     { label: "منشور",    icon: "📸", color: "#06b6d4" },
      image:    { label: "صورة",     icon: "🖼️",  color: "#22d3ee" },
      carousel: { label: "كاروسيل", icon: "🎞️",  color: "#8b5cf6" },
      story:    { label: "قصة",      icon: "⭕",   color: "#f472b6" },
      igtv:     { label: "IGTV",     icon: "📺",  color: "#7c3aed" },
      unknown:  { label: "فيديو",    icon: "🎥",  color: "#7c3aed" },
    },
  },
};

export const translations: Record<Lang, Translations> = {
  en, pt, fa, de, fr, ja, nl, sv, no, da, it, es, tr, ar,
};
