# 🚀 Deployment Guide untuk Railway & Vercel

## 📋 **Pre-Deployment Checklist**
- ✅ Environment variables configured
- ✅ Hardcoded URLs replaced with environment variables
- ✅ CORS configuration updated
- ✅ Build scripts ready
- ✅ Database ready

---

## 🛤️ **Backend Deployment ke Railway**

### 1. **Persiapan Repository**
```bash
# Pastikan di folder backend
cd lilin-backendv11

# Commit semua perubahan
git add .
git commit -m "Prepare for Railway deployment"
```

### 2. **Railway Setup**
1. Buka [Railway.app](https://railway.app/)
2. Login dengan GitHub
3. Create New Project → Deploy from GitHub repo
4. Pilih repository `lilin-fullv11`
5. Pilih folder `lilin-backendv11`

### 3. **Environment Variables di Railway**
Tambahkan variables berikut di Railway Dashboard:

```bash
# Database (Railway akan auto-provide jika pakai PostgreSQL service)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Secret (WAJIB GANTI!)
JWT_SECRET=super-secret-jwt-key-production-change-this-now

# Node Environment
NODE_ENV=production

# Frontend URL (isi setelah deploy frontend)
FRONTEND_URL=https://your-app.vercel.app

# Email Configuration (untuk production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. **Railway Database Setup**
1. Add Service → PostgreSQL
2. Copy DATABASE_URL ke environment variables
3. Railway akan auto-connect database

---

## 🌐 **Frontend Deployment ke Vercel**

### 1. **Persiapan Repository**
```bash
# Pastikan di folder frontend
cd lilin-frontendv11

# Commit semua perubahan
git add .
git commit -m "Prepare for Vercel deployment"
```

### 2. **Vercel Setup**
1. Buka [Vercel.com](https://vercel.com/)
2. Login dengan GitHub
3. Import Project → pilih repository `lilin-fullv11`
4. Pilih folder `lilin-frontendv11`
5. Framework Preset: Vite
6. Root Directory: `lilin-frontendv11`

### 3. **Environment Variables di Vercel**
Tambahkan di Vercel Dashboard:

```bash
# API Base URL (isi dengan URL Railway setelah backend deploy)
VITE_API_BASE_URL=https://your-backend.railway.app
```

### 4. **Build Settings Vercel**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## 🔗 **Setelah Deployment**

### 1. **Update URLs**
1. Setelah Railway deploy → copy URL backend
2. Update `VITE_API_BASE_URL` di Vercel dengan URL Railway
3. Update `FRONTEND_URL` di Railway dengan URL Vercel
4. Redeploy frontend di Vercel

### 2. **Update CORS**
Update file `src/index.ts` di backend:
```typescript
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? [
      "https://your-app-name.vercel.app", // Ganti dengan URL Vercel actual
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ]
  : ["http://localhost:5173"];
```

### 3. **Test Deployment**
1. Buka frontend URL di Vercel
2. Test login admin: `admin@weiscandle.com` / `admin123`
3. Test contact form
4. Test analytics dashboard

---

## 🔐 **Security Notes**

### **WAJIB DIUBAH untuk Production:**

1. **JWT Secret**
   ```bash
   # Generate secret baru
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Admin Password**
   ```bash
   # Ganti password di src/routes.ts atau gunakan env var
   ADMIN_EMAIL=admin@weiscandle.com
   ADMIN_PASSWORD_HASH=bcrypt_hash_here
   ```

3. **Email Configuration**
   - Setup Google App Password
   - Atau gunakan SendGrid/Mailgun

4. **Database**
   - Gunakan strong password
   - Enable SSL connections

---

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **CORS Error**
   - Pastikan FRONTEND_URL di Railway benar
   - Check allowedOrigins di backend

2. **Database Connection**
   - Pastikan DATABASE_URL format benar
   - Check firewall/network di Railway

3. **Build Failed**
   - Check Node.js version compatibility
   - Review build logs di Railway/Vercel

4. **Environment Variables**
   - Pastikan semua required vars ada
   - Check case sensitive names

---

## 📝 **Final URLs Structure**
```
Frontend: https://your-app-name.vercel.app
Backend:  https://your-app-name.railway.app
Admin:    https://your-app-name.vercel.app/admin/login
API:      https://your-app-name.railway.app/api
```

**Credentials Admin:**
- Email: `admin@weiscandle.com`
- Password: `admin123`

---

## ✅ **Deploy Checklist**

- [ ] Backend deployed to Railway
- [ ] Database connected dan running
- [ ] Environment variables configured
- [ ] Frontend deployed to Vercel
- [ ] URLs updated di kedua platform
- [ ] CORS configuration correct
- [ ] Admin login working
- [ ] Contact form + email working
- [ ] Analytics dashboard working
- [ ] All hardcoded URLs replaced

**Siap production! 🎉**
