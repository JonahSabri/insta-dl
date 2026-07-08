export type Lang = "en" | "pt" | "fa";

export const LANGS: { code: Lang; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English",    flag: "🇬🇧", dir: "ltr" },
  { code: "pt", label: "Português",  flag: "🇧🇷", dir: "ltr" },
  { code: "fa", label: "فارسی",      flag: "🇮🇷", dir: "rtl" },
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

export const translations: Record<Lang, Translations> = { en, pt, fa };
