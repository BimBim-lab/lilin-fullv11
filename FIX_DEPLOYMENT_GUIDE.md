# 🚀 Deployment Guide - WeisCandle Full Stack App

## 📦 Yang Sudah Diperbaiki

### Frontend Issues Fixed:
- ✅ Home.tsx - API calls menggunakan API_BASE_URL
- ✅ Blog.tsx - API calls menggunakan API_BASE_URL  
- ✅ BlogPost.tsx - API calls menggunakan API_BASE_URL
- ✅ Workshop.tsx - API calls menggunakan API_BASE_URL
- ✅ SchedulePricing.tsx - API calls menggunakan API_BASE_URL
- ✅ Export.tsx - Sudah benar sebelumnya
- ✅ Contact.tsx - Sudah benar sebelumnya

### Backend Issues Fixed:
- ✅ File Storage - Persistent data dengan data.json
- ✅ Railway-compatible path handling
- ✅ Enhanced logging untuk debugging

## 🔧 Deployment Steps

### 1. Backend Deployment (Railway)

1. **Upload backend code ke Railway**
2. **Set Environment Variables di Railway:**
   ```
   RAILWAY_VOLUME_MOUNT_PATH=/data
   JWT_SECRET=your-secure-jwt-secret-here
   ```
3. **Build Command:** `npm run build`
4. **Start Command:** `npm start`
5. **Copy Railway URL** (contoh: `https://your-app-name.railway.app`)

### 2. Frontend Deployment (Vercel)

1. **Set Environment Variables di Vercel:**
   ```
   VITE_API_BASE_URL=https://your-railway-backend-url.railway.app
   ```
2. **Build Command:** `npm run build`
3. **Install Command:** `npm install`
4. **Output Directory:** `dist`

### 3. Testing Checklist

#### Admin Dashboard Testing:
- [ ] Login di `/admin` dengan `admin@weiscandle.com` / `admin123`
- [ ] Edit Hero Section - ubah title/description
- [ ] Edit Contact Info - ubah phone/address/social media
- [ ] Edit Workshop Packages - ubah price/features
- [ ] Edit Products - tambah/edit produk export
- [ ] Edit Blog Posts - buat artikel baru
- [ ] Verify data tersimpan (refresh halaman admin)

#### User Frontend Testing:
- [ ] Home page - lihat perubahan hero section
- [ ] Contact page - lihat perubahan contact info  
- [ ] Workshop page - lihat perubahan packages
- [ ] Export page - lihat perubahan products
- [ ] Blog page - lihat artikel baru
- [ ] About page - static content (tidak berubah)

#### API Endpoints Testing:
- [ ] GET /api/hero - hero data
- [ ] GET /api/contact-info - contact information
- [ ] GET /api/workshop/packages - workshop packages
- [ ] GET /api/workshop/curriculum - workshop curriculum
- [ ] GET /api/products - export products
- [ ] GET /api/blog - blog posts
- [ ] POST /api/admin/login - admin authentication

## 🐛 Troubleshooting

### Jika Admin Changes Tidak Muncul di User Frontend:

1. **Check Environment Variables:**
   - Pastikan `VITE_API_BASE_URL` di Vercel sudah benar
   - URL harus tanpa trailing slash: `https://domain.com` (BUKAN `https://domain.com/`)

2. **Check Network Tab di Browser:**
   - Buka DevTools > Network
   - Refresh halaman user
   - Pastikan API calls menuju ke Railway URL, bukan localhost

3. **Check Railway Logs:**
   - Lihat apakah API calls sampai ke backend
   - Pastikan data tersimpan dengan message "Data saved to file"

4. **Clear Browser Cache:**
   - Hard refresh halaman (Ctrl+F5)
   - Clear browser cache/cookies

### Jika File Storage Tidak Persist di Railway:

1. **Check Railway Volume:**
   - Pastikan `RAILWAY_VOLUME_MOUNT_PATH=/data` ter-set
   - File akan tersimpan di `/data/data.json`

2. **Alternative: Upgrade to Paid Plan:**
   - Railway free tier terbatas untuk persistence
   - Upgrade untuk guaranteed file persistence

## 📝 Development vs Production

### Development (.env):
```
VITE_API_BASE_URL=http://localhost:5000
```

### Production (.env):  
```
VITE_API_BASE_URL=https://your-railway-backend-url.railway.app
```

## 🔐 Security Notes

- Change JWT_SECRET in production
- Use strong passwords for admin
- Enable HTTPS for all endpoints
- Consider rate limiting for API endpoints

## 📞 Support

Jika masih ada issue setelah deployment:
1. Check Railway backend logs
2. Check Vercel frontend build logs  
3. Check browser DevTools console
4. Verify environment variables
