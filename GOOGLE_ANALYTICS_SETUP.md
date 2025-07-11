no# Google Analytics Setup untuk Production

## Cara Setup Google Analytics Integration

### 1. Setup Google Analytics 4 (GA4)
1. Buka [Google Analytics](https://analytics.google.com/)
2. Buat property baru untuk website WeisCandle
3. Catat **Property ID** (angka seperti: 123456789)

### 2. Setup Service Account
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Aktifkan **Google Analytics Reporting API**
4. Buat Service Account:
   - Pilih **IAM & Admin** > **Service Accounts**
   - Klik **Create Service Account**
   - Beri nama: `analytics-service-account`
   - Generate private key (JSON format)
5. Download file JSON credentials

### 3. Berikan Akses ke Service Account
1. Kembali ke Google Analytics
2. Pilih property yang dibuat
3. Pergi ke **Admin** > **Property Access Management**
4. Klik **+** dan tambahkan service account email
5. Berikan role **Viewer**

### 4. Install Dependencies
```bash
npm install @google-analytics/data
```

### 5. Environment Variables
Buat file `.env` di root backend:
```env
GA4_PROPERTY_ID=123456789
GA_SERVICE_ACCOUNT_EMAIL=analytics-service-account@project.iam.gserviceaccount.com
GA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...content...qhkiG9w0BAQE\n-----END PRIVATE KEY-----"
```

### 6. Update Backend Code
Uncomment dan sesuaikan kode di `src/routes.ts` pada endpoint `/api/analytics`:

```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }
});

// Example query untuk mendapatkan total users
const [response] = await analyticsDataClient.runReport({
  property: `properties/${process.env.GA4_PROPERTY_ID}`,
  dateRanges: [
    {
      startDate: '30daysAgo',
      endDate: 'today',
    },
  ],
  metrics: [
    {
      name: 'activeUsers',
    },
    {
      name: 'sessions',
    },
    {
      name: 'bounceRate',
    }
  ],
});
```

### 7. Tracking Events di Frontend
Tambahkan Google Analytics tracking di frontend untuk mengukur:
- Hero button clicks
- Page views
- User engagement

```html
<!-- Tambahkan di index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 8. Security Best Practices
- Jangan commit credentials ke git
- Gunakan environment variables
- Rotasi private key secara berkala
- Monitor API usage quota

## Current Implementation
Saat ini menggunakan **mock data** untuk testing. Untuk production:
1. Follow steps di atas
2. Replace mock data dengan real Google Analytics API calls
3. Test dengan real data

## Metrics yang Ditrack
1. Total Visitors (Users)
2. Today's Visitors  
3. Total Sessions
4. Hero Button Clicks (custom event)
5. Top Visited Pages
6. Average Engagement Time
7. Bounce Rate
8. Traffic Sources
9. Device Category  
10. New vs Returning Users
