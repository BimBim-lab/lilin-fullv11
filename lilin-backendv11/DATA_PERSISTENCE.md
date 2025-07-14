# Data Persistence Guide for WeisCandle

## 🗃️ Current Storage System

The application uses **FileStorage** for persistent data storage:
- **Local Development**: Data saved to `data.json` file
- **Production**: Data persisted in Railway volume mount

## 📁 Data Structure

All application data is stored in a single JSON file:
```json
{
  "users": [],
  "blogPosts": [],
  "contacts": [],
  "heroData": {},
  "contactInfo": {},
  "workshopPackages": [],
  "workshopCurriculum": [],
  "products": [],
  "gallery": [],
  "adminCredentials": {},
  "currentUserId": 1,
  "currentBlogPostId": 1,
  "currentContactId": 1,
  "currentGalleryId": 1
}
```

## 🚀 Deployment Persistence

### Railway Deployment
The app uses Railway's persistent volume mount:
```typescript
const dataDir = process.env.RAILWAY_VOLUME_MOUNT_PATH || process.cwd();
this.dataFile = join(dataDir, 'data.json');
```

**Railway Configuration:**
1. Add persistent volume in Railway dashboard
2. Set mount path: `/app/data`
3. Set environment variable: `RAILWAY_VOLUME_MOUNT_PATH=/app/data`

### Vercel Deployment
⚠️ **Important**: Vercel has read-only filesystem, so file-based storage won't persist.

**For Vercel, you need to:**
1. Use external database (PostgreSQL, MongoDB)
2. Or implement cloud storage (AWS S3, Google Cloud Storage)
3. Or use database services like PlanetScale, Neon, or Supabase

## 🔄 Data Backup & Migration

### Manual Backup
```bash
# Download current data
curl https://your-app.railway.app/api/admin/backup > backup.json

# Upload backup data
curl -X POST https://your-app.railway.app/api/admin/restore \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @backup.json
```

### Automatic Backups
Consider implementing:
1. Daily automatic backups to cloud storage
2. Git-based backups (commit data.json changes)
3. Database replication for high availability

## 🛠️ Development Workflow

### Local Development
1. Make changes in admin dashboard
2. Data automatically saved to `data.json`
3. Commit `data.json` to git (if desired for deployment)

### Production Updates
1. Updates made in production admin panel persist automatically
2. File is saved to Railway persistent volume
3. Data survives app restarts and redeployments

## 📋 Current Data Flow

```
User Updates Dashboard
        ↓
FileStorage.update...()
        ↓
this.saveData()
        ↓
writeFileSync(data.json)
        ↓
✅ Data Persisted
```

## 🚨 Important Notes

1. **data.json is tracked in git** - This ensures initial data is deployed
2. **Uploads directory** - Only structure is tracked, not uploaded files
3. **Environment variables** - Sensitive data (credentials) not saved to file
4. **Railway volumes** - Required for production persistence

## 🔍 Troubleshooting

### Data Not Persisting
1. Check file permissions: `ls -la data.json`
2. Check Railway volume mount: `echo $RAILWAY_VOLUME_MOUNT_PATH`
3. Check logs for save errors: `grep "Error saving" logs`

### Reset to Defaults
```bash
# Delete data file to reset to defaults
rm data.json
# Restart application
```

### Migration to Database
If you need database storage later:
1. Install database ORM (Prisma, Drizzle)
2. Create migration scripts
3. Export current data.json
4. Import to database
5. Switch storage implementation

## 📊 Monitoring Data

Check data status:
```bash
# File size
du -h data.json

# Last modified
stat data.json

# Backup count
ls -la backups/
```

## 🏗️ Future Improvements

Consider implementing:
1. **Database storage** for better scalability
2. **Redis caching** for frequently accessed data
3. **Data validation** before saving
4. **Incremental backups** to reduce file size
5. **Real-time sync** across multiple instances
