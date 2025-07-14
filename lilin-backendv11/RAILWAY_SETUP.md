# Railway Configuration for Data Persistence

## Environment Variables
Add these to your Railway environment:

```
RAILWAY_VOLUME_MOUNT_PATH=/app/data
NODE_ENV=production
PORT=5000
```

## Volume Configuration
1. Go to Railway Dashboard → Your Project → Settings → Volumes
2. Add new volume:
   - **Mount Path**: `/app/data`
   - **Size**: 1GB (minimum)
3. Deploy the application

## Verification
After deployment, check logs for:
```
Data file path: /app/data/data.json
📁 Data saved to file: /app/data/data.json
```

## File Structure in Production
```
/app/
├── dist/                 # Built application
├── data/                 # Persistent volume
│   └── data.json        # Your data file
└── uploads/             # Uploaded files (if persistent)
```

## Data Migration Steps

### 1. Backup Current Data (if any)
```bash
curl https://your-app.railway.app/api/admin/backup \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  > current-backup.json
```

### 2. Deploy with Persistence
1. Push code with FileStorage
2. Configure Railway volume
3. Restart application

### 3. Restore Data (if needed)
```bash
curl -X POST https://your-app.railway.app/api/admin/restore \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d @current-backup.json
```

## Monitoring
Check data persistence:
```bash
# SSH into Railway container (if available)
railway shell

# Check data file
ls -la /app/data/
cat /app/data/data.json | jq '.heroData.title1'
```
