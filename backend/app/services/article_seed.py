"""Default SEO articles for JazzGhost Instagram downloader."""

from __future__ import annotations

import json

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.article import Article

LANGS = [
    "en", "pt", "fa", "de", "fr", "ja", "nl", "sv", "no", "da", "it", "es", "tr", "ar",
]


def _t(
    en: tuple[str, str, str],
    fa: tuple[str, str, str],
    others: dict[str, tuple[str, str, str]] | None = None,
) -> dict[str, dict[str, str]]:
    """Build translations dict. Missing langs fall back to English."""
    out: dict[str, dict[str, str]] = {
        "en": {"title": en[0], "excerpt": en[1], "content": en[2]},
        "fa": {"title": fa[0], "excerpt": fa[1], "content": fa[2]},
    }
    if others:
        for code, vals in others.items():
            out[code] = {"title": vals[0], "excerpt": vals[1], "content": vals[2]}
    for lang in LANGS:
        if lang not in out:
            out[lang] = out["en"]
    return out


def _body(*paragraphs: str) -> str:
    return "\n\n".join(p.strip() for p in paragraphs if p.strip())


SEED_ARTICLES: list[dict] = [
    {
        "slug": "how-to-download-instagram-reels",
        "keywords": "download instagram reels, instagram reels downloader, save reels, jazzghost",
        "translations": _t(
            (
                "How to Download Instagram Reels in HD (2026 Guide)",
                "Learn the fastest way to download Instagram Reels in high quality without an app.",
                _body(
                    "Instagram Reels are short videos that often disappear from your feed — but with JazzGhost you can save them in seconds.",
                    "Copy the Reel link from Instagram (Share → Copy link). Both /reel/ and /reels/ URLs work.",
                    "Open JazzGhost, choose Reel, paste the link, preview the video, then download in HD.",
                    "No login, no extension, and no watermark. Perfect for creators who need offline copies for inspiration or archives.",
                ),
            ),
            (
                "چگونه ریلز اینستاگرام را با کیفیت HD دانلود کنیم (راهنمای ۱۴۰۵)",
                "سریع‌ترین روش دانلود ریلز اینستاگرام بدون نصب اپلیکیشن.",
                _body(
                    "ریلزهای اینستاگرام کوتاه‌اند و ممکن است بعداً پیدا کردنشان سخت شود — با JazzGhost در چند ثانیه ذخیره می‌کنید.",
                    "لینک ریلز را از اینستاگرام کپی کنید (اشتراک‌گذاری → کپی لینک). هر دو فرم /reel/ و /reels/ پشتیبانی می‌شود.",
                    "در JazzGhost نوع «ریلز» را انتخاب کنید، لینک را بچسبانید، پیش‌نمایش بگیرید و با کیفیت HD دانلود کنید.",
                    "بدون ورود، بدون افزونه و بدون واترمارک — مناسب آرشیو و الهام‌گیری.",
                ),
            ),
            {
                "pt": (
                    "Como baixar Reels do Instagram em HD",
                    "A forma mais rápida de baixar Reels sem instalar app.",
                    _body(
                        "Com o JazzGhost você salva Reels do Instagram em segundos e em alta qualidade.",
                        "Copie o link do Reel (Compartilhar → Copiar link). Funciona com /reel/ e /reels/.",
                        "Cole o link no JazzGhost, veja o preview e baixe em HD — sem login e sem marca d'água.",
                    ),
                ),
                "es": (
                    "Cómo descargar Reels de Instagram en HD",
                    "La forma más rápida de guardar Reels sin instalar apps.",
                    _body(
                        "Con JazzGhost puedes guardar Reels de Instagram en segundos y en alta calidad.",
                        "Copia el enlace del Reel. Funciona con /reel/ y /reels/.",
                        "Pégalo en JazzGhost, previsualiza y descarga en HD sin iniciar sesión.",
                    ),
                ),
                "tr": (
                    "Instagram Reels nasıl HD indirilir",
                    "Uygulama kurmadan Reels indirmmenin en hızlı yolu.",
                    _body(
                        "JazzGhost ile Instagram Reels videolarını saniyeler içinde HD kalitede kaydedin.",
                        "Reel bağlantısını kopyalayın (/reel/ ve /reels/ desteklenir).",
                        "JazzGhost'a yapıştırın, önizleyin ve filigransız indirin.",
                    ),
                ),
                "ar": (
                    "كيفية تحميل ريلز إنستغرام بجودة HD",
                    "أسرع طريقة لحفظ الريلز دون تثبيت تطبيق.",
                    _body(
                        "مع JazzGhost يمكنك حفظ ريلز إنستغرام خلال ثوانٍ وبجودة عالية.",
                        "انسخ رابط الريل — يدعم /reel/ و /reels/.",
                        "الصق الرابط في JazzGhost، معاينة ثم تحميل بدون تسجيل دخول.",
                    ),
                ),
                "de": (
                    "Instagram Reels in HD herunterladen",
                    "Der schnellste Weg, Reels ohne App zu speichern.",
                    _body(
                        "Mit JazzGhost speicherst du Instagram Reels in Sekunden in HD.",
                        "Kopiere den Reel-Link (/reel/ und /reels/ werden unterstützt).",
                        "Einfügen, Vorschau prüfen und ohne Login herunterladen.",
                    ),
                ),
                "fr": (
                    "Comment télécharger des Reels Instagram en HD",
                    "La méthode la plus rapide sans installer d'application.",
                    _body(
                        "Avec JazzGhost, enregistrez les Reels Instagram en quelques secondes en HD.",
                        "Copiez le lien du Reel (/reel/ et /reels/ pris en charge).",
                        "Collez-le, prévisualisez et téléchargez sans connexion.",
                    ),
                ),
            },
        ),
    },
    {
        "slug": "instagram-post-downloader",
        "keywords": "download instagram post, save instagram photo, instagram post downloader",
        "translations": _t(
            (
                "Download Instagram Posts & Photos Free",
                "Save any public Instagram post or photo in original quality with JazzGhost.",
                _body(
                    "Need a photo from a public Instagram post? JazzGhost downloads single images and posts without quality loss.",
                    "Copy the post URL (instagram.com/p/...), select Post, paste, and download.",
                    "Ideal for mood boards, references, and offline viewing — always free, no account required.",
                ),
            ),
            (
                "دانلود پست و عکس اینستاگرام رایگان",
                "هر پست یا عکس عمومی اینستاگرام را با کیفیت اصلی ذخیره کنید.",
                _body(
                    "با JazzGhost می‌توانید پست‌ها و عکس‌های عمومی اینستاگرام را بدون افت کیفیت دانلود کنید.",
                    "لینک پست (instagram.com/p/...) را کپی کنید، نوع «پست» را بزنید و دانلود کنید.",
                    "مناسب مرجع تصویری و مشاهده آفلاین — کاملاً رایگان و بدون ثبت‌نام.",
                ),
            ),
        ),
    },
    {
        "slug": "instagram-carousel-download",
        "keywords": "instagram carousel downloader, download multiple photos instagram, album download",
        "translations": _t(
            (
                "Download Instagram Carousels as ZIP",
                "Save every slide from an Instagram carousel album in one click.",
                _body(
                    "Carousel posts contain multiple photos or videos. JazzGhost detects all slides and packs them into a ZIP.",
                    "Paste a /p/ link, choose Carousel (or Any), preview, then download the full set.",
                    "You can also download individual slides when you only need one image.",
                ),
            ),
            (
                "دانلود کاروسل اینستاگرام به‌صورت ZIP",
                "همه اسلایدهای یک آلبوم کاروسل را با یک کلیک ذخیره کنید.",
                _body(
                    "پست‌های کاروسل چند عکس یا ویدیو دارند. JazzGhost همه اسلایدها را شناسایی و در ZIP قرار می‌دهد.",
                    "لینک /p/ را بچسبانید، «کاروسل» یا «همه» را انتخاب کنید و کل مجموعه را دانلود کنید.",
                    "در صورت نیاز می‌توانید فقط یک اسلاید را جداگانه بگیرید.",
                ),
            ),
        ),
    },
    {
        "slug": "download-instagram-stories",
        "keywords": "download instagram stories, save story anonymously, story downloader",
        "translations": _t(
            (
                "Download Instagram Stories Anonymously",
                "Save public Instagram Stories before they expire — privately and fast.",
                _body(
                    "Stories disappear after 24 hours. JazzGhost lets you download public stories while they are still online.",
                    "Copy the story link from Instagram, select Story, paste, and download.",
                    "Your download happens on our servers — you do not need to log in to Instagram on JazzGhost.",
                ),
            ),
            (
                "دانلود استوری اینستاگرام به‌صورت ناشناس",
                "استوری‌های عمومی را قبل از انقضا سریع و خصوصی ذخیره کنید.",
                _body(
                    "استوری بعد از ۲۴ ساعت حذف می‌شود. با JazzGhost استوری‌های عمومی را تا وقتی آنلاین‌اند دانلود کنید.",
                    "لینک استوری را کپی کنید، نوع «استوری» را انتخاب و دانلود کنید.",
                    "دانلود روی سرور ما انجام می‌شود و نیازی به ورود به اینستاگرام در JazzGhost نیست.",
                ),
            ),
        ),
    },
    {
        "slug": "reel-vs-reels-link",
        "keywords": "instagram reel link, /reels/ url, reel url format",
        "translations": _t(
            (
                "Instagram /reel/ vs /reels/ Links — Both Work",
                "Why some downloaders fail on /reels/ URLs and how JazzGhost handles both.",
                _body(
                    "Instagram sometimes shares Reels as instagram.com/reel/CODE and sometimes as instagram.com/reels/CODE.",
                    "Older tools only accept the singular /reel/ path and reject valid links.",
                    "JazzGhost accepts both formats in the Reel tab and in Any mode, so you never get a false “not a reel” error.",
                ),
            ),
            (
                "تفاوت لینک /reel/ و /reels/ اینستاگرام",
                "چرا بعضی دانلودرها لینک /reels/ را رد می‌کنند و JazzGhost هر دو را می‌پذیرد.",
                _body(
                    "اینستاگرام گاهی لینک ریلز را به‌صورت /reel/ و گاهی /reels/ می‌سازد.",
                    "ابزارهای قدیمی فقط /reel/ را قبول می‌کنند و لینک معتبر را خطا می‌دهند.",
                    "JazzGhost در تب ریلز و حالت «همه» هر دو فرمت را پشتیبانی می‌کند.",
                ),
            ),
        ),
    },
    {
        "slug": "best-free-instagram-downloader",
        "keywords": "best free instagram downloader, jazzghost, online ig saver",
        "translations": _t(
            (
                "Best Free Instagram Downloader Online (JazzGhost)",
                "Compare what matters: speed, HD quality, privacy, and no sign-up.",
                _body(
                    "Most “free” downloaders force ads, apps, or accounts. JazzGhost stays in the browser.",
                    "You get Reels, posts, carousels, and stories with preview before download.",
                    "Files are temporary and not kept permanently — built for privacy-minded users.",
                ),
            ),
            (
                "بهترین دانلودر رایگان اینستاگرام آنلاین (JazzGhost)",
                "معیارهای مهم: سرعت، کیفیت HD، حریم خصوصی و بدون ثبت‌نام.",
                _body(
                    "خیلی از دانلودرهای «رایگان» تبلیغ، اپ یا اکانت اجباری دارند. JazzGhost داخل مرورگر کار می‌کند.",
                    "ریلز، پست، کاروسل و استوری را با پیش‌نمایش قبل از دانلود می‌گیرید.",
                    "فایل‌ها موقتی‌اند و برای همیشه ذخیره نمی‌شوند.",
                ),
            ),
        ),
    },
    {
        "slug": "save-instagram-video-without-app",
        "keywords": "save instagram video without app, browser instagram downloader",
        "translations": _t(
            (
                "Save Instagram Videos Without Installing an App",
                "Use JazzGhost in any browser on phone or desktop — no APK, no extension.",
                _body(
                    "Installing random Instagram saver apps is risky. JazzGhost works as a website.",
                    "Open the site, paste the link, and download MP4 or images directly.",
                    "Works on iOS Safari, Android Chrome, and desktop browsers.",
                ),
            ),
            (
                "ذخیره ویدیوی اینستاگرام بدون نصب اپ",
                "JazzGhost را در هر مرورگر موبایل یا دسکتاپ استفاده کنید — بدون APK و افزونه.",
                _body(
                    "نصب اپ‌های ناشناس ذخیره‌کننده اینستاگرام ریسک دارد. JazzGhost یک وب‌سایت است.",
                    "سایت را باز کنید، لینک را بچسبانید و مستقیم MP4 یا عکس بگیرید.",
                    "روی Safari آی‌اواس، کروم اندروید و مرورگرهای دسکتاپ کار می‌کند.",
                ),
            ),
        ),
    },
    {
        "slug": "instagram-hd-quality-download",
        "keywords": "instagram hd download, highest quality reel, 1080p instagram",
        "translations": _t(
            (
                "Download Instagram Videos in Highest Available Quality",
                "How JazzGhost picks the best stream so your Reels stay sharp.",
                _body(
                    "Instagram serves multiple qualities. JazzGhost requests the highest available stream.",
                    "Always use the original share link — shortened or third-party links can reduce quality.",
                    "Preview first to confirm the media looks right before you save the file.",
                ),
            ),
            (
                "دانلود ویدیوی اینستاگرام با بالاترین کیفیت موجود",
                "JazzGhost بهترین استریم را انتخاب می‌کند تا ریلز تیز بماند.",
                _body(
                    "اینستاگرام چند کیفیت ارائه می‌دهد. JazzGhost بالاترین استریم موجود را می‌گیرد.",
                    "همیشه از لینک اصلی اشتراک‌گذاری استفاده کنید.",
                    "قبل از ذخیره، پیش‌نمایش را چک کنید.",
                ),
            ),
        ),
    },
    {
        "slug": "download-private-instagram-content",
        "keywords": "private instagram download, cookies instagram downloader",
        "translations": _t(
            (
                "Can You Download Private Instagram Content?",
                "What works for public posts vs private accounts — and how cookies help.",
                _body(
                    "Public Reels and posts download instantly. Private content needs authorized access.",
                    "Site admins can configure Instagram cookies or credentials for restricted media.",
                    "Never share your password with untrusted third-party apps. Prefer cookies you export yourself.",
                ),
            ),
            (
                "آیا می‌توان محتوای خصوصی اینستاگرام را دانلود کرد؟",
                "تفاوت پست عمومی و اکانت خصوصی — و نقش کوکی.",
                _body(
                    "ریلز و پست‌های عمومی فوری دانلود می‌شوند. محتوای خصوصی نیاز به دسترسی مجاز دارد.",
                    "ادمین سایت می‌تواند کوکی یا اعتبارنامه اینستاگرام را برای رسانه محدود تنظیم کند.",
                    "رمز عبور را به اپ‌های ناشناس ندهید؛ ترجیحاً کوکی خودتان را export کنید.",
                ),
            ),
        ),
    },
    {
        "slug": "instagram-reels-for-creators",
        "keywords": "save reels for creators, content research instagram, remix reels",
        "translations": _t(
            (
                "Why Creators Save Reels Offline with JazzGhost",
                "Archive trends, study editing styles, and keep references without screenshots.",
                _body(
                    "Creators often save competitor Reels for research — pacing, hooks, and captions.",
                    "JazzGhost gives a clean MP4 you can scrub frame-by-frame in any editor.",
                    "Respect copyright: use downloads for learning and fair use, not reposting without credit.",
                ),
            ),
            (
                "چرا کریتورها ریلز را با JazzGhost آفلاین ذخیره می‌کنند",
                "آرشیو ترندها، بررسی ادیت و نگه‌داشتن مرجع بدون اسکرین‌شات.",
                _body(
                    "کریتورها ریلز رقبا را برای ریسرچ — ریتم، هوک و کپشن — ذخیره می‌کنند.",
                    "JazzGhost یک MP4 تمیز می‌دهد که در هر ادیتوری فریم‌به‌فریم قابل بررسی است.",
                    "حق نشر را رعایت کنید: برای یادگیری استفاده کنید، نه بازنشر بدون اعتبار.",
                ),
            ),
        ),
    },
    {
        "slug": "mobile-instagram-download-guide",
        "keywords": "download reels on iphone, android instagram saver, mobile guide",
        "translations": _t(
            (
                "Download Instagram Reels on iPhone & Android",
                "Step-by-step mobile guide using Safari or Chrome with JazzGhost.",
                _body(
                    "On Instagram app: open the Reel → Share → Copy link.",
                    "Switch to Safari/Chrome, open JazzGhost, paste the link, tap Get Preview, then Download.",
                    "On iPhone, use the share sheet to Save Video to Photos. On Android, files go to Downloads.",
                ),
            ),
            (
                "دانلود ریلز اینستاگرام روی آیفون و اندروید",
                "راهنمای گام‌به‌گام موبایل با Safari یا Chrome و JazzGhost.",
                _body(
                    "در اپ اینستاگرام: ریلز را باز کنید → اشتراک‌گذاری → کپی لینک.",
                    "به مرورگر بروید، JazzGhost را باز کنید، لینک را بچسبانید، پیش‌نمایش و دانلود.",
                    "در آیفون از Share Sheet ویدیو را در Photos ذخیره کنید؛ در اندروید فایل به Downloads می‌رود.",
                ),
            ),
        ),
    },
    {
        "slug": "instagram-audio-from-reels",
        "keywords": "extract audio from instagram reel, download reel sound",
        "translations": _t(
            (
                "Get Audio from Instagram Reels",
                "Download the Reel video first, then extract audio with free tools.",
                _body(
                    "JazzGhost downloads the full Reel video (picture + sound) in one MP4.",
                    "To isolate audio, open the file in CapCut, VLC, or any free converter and export MP3/M4A.",
                    "Always check music licensing before reusing trending sounds commercially.",
                ),
            ),
            (
                "استخراج صدا از ریلز اینستاگرام",
                "ابتدا ویدیوی ریلز را دانلود کنید، سپس صدا را با ابزار رایگان جدا کنید.",
                _body(
                    "JazzGhost کل ریلز (تصویر + صدا) را در یک MP4 می‌گیرد.",
                    "برای جدا کردن صدا از CapCut، VLC یا مبدل رایگان استفاده و MP3/M4A خروجی بگیرید.",
                    "قبل از استفاده تجاری از آهنگ‌های ترند، لایسنس را چک کنید.",
                ),
            ),
        ),
    },
    {
        "slug": "fix-instagram-download-errors",
        "keywords": "instagram download failed, link not working, jazzghost troubleshooting",
        "translations": _t(
            (
                "Fix Common Instagram Download Errors",
                "Link invalid, rate limit, private media — quick fixes that actually work.",
                _body(
                    "Invalid URL: make sure the link contains instagram.com and is not truncated.",
                    "Type mismatch: select Reel for /reel/ or /reels/, Post for /p/, Story for /stories/.",
                    "Rate limit: JazzGhost may limit daily free downloads — try again tomorrow or ask the admin.",
                    "Private or login wall: the site may need fresh cookies configured by the administrator.",
                ),
            ),
            (
                "رفع خطاهای رایج دانلود اینستاگرام",
                "لینک نامعتبر، محدودیت روزانه، محتوای خصوصی — راه‌حل‌های عملی.",
                _body(
                    "لینک نامعتبر: مطمئن شوید لینک شامل instagram.com است و ناقص کپی نشده.",
                    "عدم تطابق نوع: برای /reel/ یا /reels/ ریلز، برای /p/ پست، برای /stories/ استوری را انتخاب کنید.",
                    "محدودیت روزانه: ممکن است سقف دانلود رایگان پر شده باشد.",
                    "محتوای خصوصی: ادمین باید کوکی تازه تنظیم کند.",
                ),
            ),
        ),
    },
    {
        "slug": "instagram-downloader-privacy",
        "keywords": "instagram downloader privacy, safe ig saver, no login downloader",
        "translations": _t(
            (
                "Is an Online Instagram Downloader Safe?",
                "How JazzGhost approaches privacy: no Instagram login required for public media.",
                _body(
                    "Avoid sites that ask for your Instagram password in the browser form as a guest.",
                    "JazzGhost downloads public media without forcing you to sign in as a user.",
                    "Temporary files are cleaned after delivery. Prefer HTTPS and official site bookmarks.",
                ),
            ),
            (
                "آیا دانلودر آنلاین اینستاگرام امن است؟",
                "رویکرد JazzGhost به حریم خصوصی: برای رسانه عمومی نیازی به ورود اینستاگرام نیست.",
                _body(
                    "از سایت‌هایی که به‌عنوان مهمان رمز اینستاگرام می‌خواهند دوری کنید.",
                    "JazzGhost رسانه عمومی را بدون اجبار به ثبت‌نام کاربر دانلود می‌کند.",
                    "فایل‌های موقت بعد از تحویل پاک می‌شوند. از HTTPS و بوکمارک رسمی استفاده کنید.",
                ),
            ),
        ),
    },
    {
        "slug": "batch-save-instagram-links",
        "keywords": "save multiple instagram links, workflow download reels",
        "translations": _t(
            (
                "Efficient Workflow: Saving Many Instagram Links",
                "Tips for collecting Reels and posts quickly during research sessions.",
                _body(
                    "Keep a notes app with pasted Instagram URLs, then process them one by one in JazzGhost.",
                    "Use the Any tab if you mix Reels, posts, and carousels in the same list.",
                    "Preview each item so you do not download the wrong media from a mistyped link.",
                ),
            ),
            (
                "گردش‌کار سریع برای ذخیره چند لینک اینستاگرام",
                "نکاتی برای جمع‌آوری ریلز و پست هنگام ریسرچ.",
                _body(
                    "لینک‌ها را در نت‌پد جمع کنید و یکی‌یکی در JazzGhost پردازش کنید.",
                    "اگر ریلز، پست و کاروسل مخلوط است از تب «همه» استفاده کنید.",
                    "همیشه پیش‌نمایش بگیرید تا رسانه اشتباه دانلود نشود.",
                ),
            ),
        ),
    },
    {
        "slug": "instagram-igtv-and-long-videos",
        "keywords": "download igtv, long instagram video download",
        "translations": _t(
            (
                "Download Long Instagram Videos & Legacy IGTV",
                "JazzGhost handles longer video posts the same way as Reels — paste and save.",
                _body(
                    "Long-form Instagram videos still share via standard Instagram links.",
                    "Paste the URL into JazzGhost (Any or Reel/Post depending on the path) and wait for processing.",
                    "Larger files take a few more seconds; keep the tab open until the download button appears.",
                ),
            ),
            (
                "دانلود ویدیوهای بلند اینستاگرام و IGTV قدیمی",
                "ویدیوهای بلند مثل ریلز با چسباندن لینک ذخیره می‌شوند.",
                _body(
                    "ویدیوهای بلند هنوز با لینک استاندارد اینستاگرام اشتراک‌گذاری می‌شوند.",
                    "لینک را در JazzGhost بچسبانید و منتظر پردازش بمانید.",
                    "فایل‌های بزرگ‌تر کمی بیشتر طول می‌کشد؛ تب را تا ظهور دکمه دانلود باز نگه دارید.",
                ),
            ),
        ),
    },
    {
        "slug": "use-jazzghost-pwa",
        "keywords": "jazzghost pwa, install instagram downloader, add to home screen",
        "translations": _t(
            (
                "Install JazzGhost as a PWA on Your Phone",
                "Add JazzGhost to your home screen for one-tap access like an app.",
                _body(
                    "JazzGhost supports Progressive Web App install prompts on compatible browsers.",
                    "On Android Chrome: menu → Install app / Add to Home screen.",
                    "On iPhone Safari: Share → Add to Home Screen. Then paste links without hunting bookmarks.",
                ),
            ),
            (
                "نصب JazzGhost به‌صورت PWA روی گوشی",
                "JazzGhost را به صفحه اصلی اضافه کنید تا مثل اپ یک‌ضرب باز شود.",
                _body(
                    "JazzGhost روی مرورگرهای سازگار اعلان نصب PWA دارد.",
                    "در کروم اندروید: منو → Install app / Add to Home screen.",
                    "در Safari آیفون: Share → Add to Home Screen.",
                ),
            ),
        ),
    },
    {
        "slug": "instagram-download-for-education",
        "keywords": "download instagram for education, classroom social media",
        "translations": _t(
            (
                "Using Instagram Downloads for Education & Training",
                "How teachers and coaches can archive public demos legally and practically.",
                _body(
                    "Public educational Reels are useful offline in workshops with poor connectivity.",
                    "Download with JazzGhost, store locally, and credit the original creator when presenting.",
                    "Do not redistribute copyrighted material as your own course content.",
                ),
            ),
            (
                "استفاده از دانلود اینستاگرام برای آموزش",
                "معلمان و کوچ‌ها چگونه دموهای عمومی را آرشیو کنند.",
                _body(
                    "ریلز آموزشی عمومی برای کارگاه‌های بدون اینترنت پایدار مفید است.",
                    "با JazzGhost دانلود کنید، محلی ذخیره کنید و هنگام ارائه به سازنده اعتبار دهید.",
                    "محتوای دارای حق نشر را به‌عنوان دوره خودتان بازنشر نکنید.",
                ),
            ),
        ),
    },
    {
        "slug": "multilingual-instagram-downloader",
        "keywords": "instagram downloader persian, portuguese, arabic, turkish",
        "translations": _t(
            (
                "JazzGhost Speaks Your Language",
                "Use the Instagram downloader UI in English, فارسی, Português, العربية, Türkçe, and more.",
                _body(
                    "Switch language from the header — the whole interface updates instantly.",
                    "Articles and guides are also available per language so SEO and UX stay local.",
                    "Supported locales include EN, PT, FA, DE, FR, JA, NL, SV, NO, DA, IT, ES, TR, and AR.",
                ),
            ),
            (
                "JazzGhost به زبان شما صحبت می‌کند",
                "رابط دانلودر اینستاگرام را به فارسی، انگلیسی، پرتغالی، عربی، ترکی و بیشتر استفاده کنید.",
                _body(
                    "از هدر زبان را عوض کنید — کل رابط فوری به‌روز می‌شود.",
                    "مقالات و راهنماها هم به‌ازای هر زبان در دسترس‌اند.",
                    "زبان‌های پشتیبانی‌شده: EN، PT، FA، DE، FR، JA، NL، SV، NO، DA، IT، ES، TR و AR.",
                ),
            ),
        ),
    },
    {
        "slug": "jazzghost-quick-start",
        "keywords": "jazzghost tutorial, how to use jazzghost, instagram saver guide",
        "translations": _t(
            (
                "JazzGhost Quick Start: Paste, Preview, Download",
                "A 60-second tutorial for first-time users of the Instagram downloader.",
                _body(
                    "Step 1 — Copy any public Instagram Reel, post, carousel, or story link.",
                    "Step 2 — Pick the matching type (or Any) and paste into the box.",
                    "Step 3 — Get Preview to confirm the media, then Download Now.",
                    "That is it. Bookmark JazzGhost and you are ready whenever a Reel is worth saving.",
                ),
            ),
            (
                "شروع سریع JazzGhost: بچسبان، پیش‌نمایش، دانلود",
                "آموزش ۶۰ ثانیه‌ای برای اولین استفاده از دانلودر اینستاگرام.",
                _body(
                    "گام ۱ — لینک عمومی ریلز، پست، کاروسل یا استوری را کپی کنید.",
                    "گام ۲ — نوع مناسب (یا همه) را انتخاب و لینک را بچسبانید.",
                    "گام ۳ — پیش‌نمایش بگیرید و سپس دانلود کنید.",
                    "تمام. JazzGhost را بوکمارک کنید تا هر وقت ریلزی ارزش ذخیره داشت آماده باشید.",
                ),
            ),
        ),
    },
]


async def seed_articles_if_empty(db: AsyncSession) -> int:
    """Insert any missing default articles. Returns inserted count."""
    result = await db.execute(select(Article.slug))
    existing = set(result.scalars().all())
    added = 0

    for item in SEED_ARTICLES:
        if item["slug"] in existing:
            continue
        db.add(
            Article(
                slug=item["slug"],
                keywords=item["keywords"],
                translations=json.dumps(item["translations"], ensure_ascii=False),
                is_published=True,
            )
        )
        added += 1

    if added:
        await db.commit()
    return added
