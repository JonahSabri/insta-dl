# JazzGhost — Instagram Downloader Platform

پلتفرم دانلود محتوای اینستاگرام با FastAPI + Next.js.

## ساختار پروژه

```
INSTA/
├── backend/          # FastAPI + SQLAlchemy + yt-dlp
├── frontend/         # Next.js 15 + Tailwind CSS
├── docker-compose.yml
└── README.md
```

---

## راه‌اندازی سریع (بدون Docker)

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # ویرایش کنید
uvicorn app.main:app --reload
```

سرور روی `http://localhost:8000` اجرا می‌شود.
مستندات API: `http://localhost:8000/api/docs`

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

سایت روی `http://localhost:3000` اجرا می‌شود.

---

## راه‌اندازی با Docker Compose

```bash
cp backend/.env.example backend/.env
# ویرایش SECRET_KEY، ADMIN_PASSWORD و GUEST_DAILY_LIMIT

docker compose up --build -d
```

---

## متغیرهای محیطی

| متغیر | پیش‌فرض | توضیح |
|---|---|---|
| `DATABASE_URL` | SQLite | آدرس دیتابیس (قابل تغییر به PostgreSQL) |
| `SECRET_KEY` | `dev-...` | کلید رمزنگاری JWT — **حتماً تغییر دهید** |
| `ADMIN_USERNAME` | `admin` | نام کاربری پنل مدیریت |
| `ADMIN_PASSWORD` | `changeme` | رمز عبور پنل مدیریت — **حتماً تغییر دهید** |
| `GUEST_DAILY_LIMIT` | `3` | تعداد دانلود رایگان روزانه |
| `INSTAGRAM_COOKIES_FILE` | خالی | مسیر فایل کوکی برای محتوای نیازمند لاگین |

---

## API Endpoints

| Method | Path | توضیح |
|---|---|---|
| `POST` | `/api/v1/download/analyze` | ارسال لینک و دریافت job_id |
| `GET` | `/api/v1/download/{job_id}/status` | بررسی وضعیت دانلود |
| `GET` | `/api/v1/download/{job_id}/file` | دریافت فایل نهایی |
| `POST` | `/api/admin/auth/login` | ورود ادمین |
| `GET` | `/api/admin/stats` | آمار کلی |
| `GET` | `/api/admin/downloads` | لیست دانلودها |
| `GET/POST` | `/api/admin/banners` | مدیریت بنرها |

---

## فازبندی

- **فاز ۱ (فعلی):** دانلود Reel/پست، rate limiting، پنل ادمین، بنرها
- **فاز ۲:** سیستم کاربر، PWA، دانلود استوری، Grid View
- **فاز ۳:** اشتراک VIP، پرداخت کریپتو، افزونه کروم
- **فاز ۴:** TikTok/YouTube، مانیتورینگ Prometheus/Grafana
