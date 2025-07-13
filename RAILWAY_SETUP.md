# Railway Environment Variables Setup

This document explains how to securely configure Google Analytics credentials in Railway for production deployment.

## Required Environment Variables

For the Analytics Dashboard to work properly, you need to set the following environment variables in Railway:

### 1. GA4_PROPERTY_ID
```
GA4_PROPERTY_ID=496473773
```
- Your Google Analytics 4 Property ID
- Found in Google Analytics > Admin > Property Settings

### 2. GA4_SERVICE_ACCOUNT_EMAIL
```
GA4_SERVICE_ACCOUNT_EMAIL=ga4-report-access@lilinaromaterapi-ga4.iam.gserviceaccount.com
```
- Your Google Cloud service account email
- Created in Google Cloud Console > IAM & Admin > Service Accounts

### 3. GA4_PRIVATE_KEY
```
GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDE3XtOcdupC1WT
Ej01VSjOb5paOPmpFMw8UsTWo6TNHf/+w8toDWe7LQMeSaiMS5sCWI8epcC7Vn4p
TSk6MIkKXEZkShYibnlGH06HF1qN/p8Y91XEs+gPkcvMkW34MakZRUqjevn8HjjR
AB4A0CLUVeyuByhaa35eeJlWXx9nx83opcxGMHkPIpQb1T+901C1Tl0Z8riS2vGZ
pPS3nDwzEnWPHoxF6wQpKgL5BPY8OmbLe5B6T5Ji6PxQmaSIMiqIAUWyL+CB0HvC
Rf+HuY0oEy3+bk8vBKwxYDv6/zMPJciDMtOMldjXSA2az2aLhaEQP9VEwOJ9PKD3
0adw6ubvAgMBAAECggEAF1awixy5b2F+HCjx47Q8WbjmYiLWCkMCcXZYip+s5npT
gocAws2wCgMslvchibxe3JjWIsqAvlTjMQ9KP3FIlddZqwMTe7KAIx2MCDzvCd1x
TBrqap7veIUO1ao6EM4GX44U6qumHksQ7komxG7oaibjn8AOeyW6PgXrG8+8H+fd
VKZxWKcspKKoKBT4+ObL7Vh5YBFk3zN/Cv8ZmrGU74lg1oovi01LMSbx2cU0R9Va
oHjouHQWmMg+ZpnYy+aWN6g46wr4dxtvVBdF69sY2smfLikvl/Uwh9X0ec4VM3H9
9+Y440Jr/bi5AXpOcRx//lwhS5jaDEQNbfHvTxcIYQKBgQDmbTbUKzA0GzwoYV9P
0Vljbd/Rs5wt82wKSeeF49dRfjYC/u5jEMGtbDuaT9pUmrFkqs8s4Zhm26nCM/aF
iSS37DUAOmEgBgcDZBj8VBhvq1BQVT7X714Qx3uOEScQhYKxpiLT/uyibvdWnM0f
u5WtH7O84v+N1/IXkkGoPAn1zwKBgQDatru5jEe+QxV+7hJUW4XxS05+dztxUIYb
u/DhSJn6w/ELhE8hbpj4r5URCpiQsZwrb3RA45D2rotZtyUgSiXgMKpD4LBnv5Vl
VrnWb4wR8UEg+8s5ujrDpNtLhKNuplRgS3P5PoGmCQCTEiFzCHKHGJfWKaM6BMqj
KcfFk8tk4QKBgAR8g+DFpn6dOSKgIrbvIIprDTyL/rJ2VtgscDGPKhYQGwUb6ZBM
NzklLlPm0h1rlaCcIsSA7/KwvDFnyZj3/psGIlIK0PFKrMBIJqRjDsa90yZ9Qmf5
5R72g1VUyCnuL4k97tep0vmmp3IsQ2ImyNdCEsHOuaMNXU1QL68S3C7JAoGBAJvf
jaywaFUV1FUQ8OlEDRKp2/hPm4Kno9xSNlsodez9BmZx1j96ZfUelbt+dLryid1+
4jh4ttDIFrJKz1/S2GmN5VrY4IAgTyXZCDrmZspGyWbrbKvoqIbUkCGjFyL90baL
L80bmiSt18X5LvOfupfDlDrik9z+mzhrx19tdJChAoGAIOh8PMhiM/bvJjfIPE+2
KEWuQ3OGp2c+MMArDCvG9woqTc5o8zmcgTb1hI+3t+RK5ozZM1Y00WVYSEp0knFd
sqAdz39qYrA6P4LjsvRcxzbzo6D1qhILE1atCUSXeeLH4uCtGviU8xnMShgMXCNc
mu24lQ9m73xuh3X+SNgANOY=
-----END PRIVATE KEY-----"
```
- Your service account private key from the JSON credentials file
- **Important**: Use double quotes and include `\n` for line breaks

## How to Set Environment Variables in Railway

1. **Login to Railway**: Go to [railway.app](https://railway.app) and login to your account

2. **Select Your Project**: Click on your deployed backend project

3. **Open Variables Tab**: In the project dashboard, click on the "Variables" tab

4. **Add Environment Variables**: Click "New Variable" and add each of the three variables:
   - Variable Name: `GA4_PROPERTY_ID`
   - Variable Value: `496473773`
   
   - Variable Name: `GA4_SERVICE_ACCOUNT_EMAIL`
   - Variable Value: `ga4-report-access@lilinaromaterapi-ga4.iam.gserviceaccount.com`
   
   - Variable Name: `GA4_PRIVATE_KEY`
   - Variable Value: (paste the entire private key with quotes and \n line breaks)

5. **Deploy**: Railway will automatically redeploy your application with the new environment variables

## Security Benefits

✅ **Secure**: Credentials are stored as environment variables, not in code  
✅ **Git Safe**: No sensitive data committed to repository  
✅ **Production Ready**: Best practice for production deployments  
✅ **Easy Management**: Can be updated without code changes  

## Verification

After setting the environment variables and redeployment:

1. Go to your admin dashboard
2. Navigate to Analytics section
3. You should see a green alert saying "Secure Credentials Loaded"
4. Analytics data should load automatically

## Troubleshooting

If you see "GA Credentials Missing" error:
- Check that all three environment variables are set correctly
- Verify the private key is properly formatted with \n line breaks
- Ensure Railway has finished redeploying after adding variables
- Check Railway logs for any credential loading errors

## Additional Environment Variables (Optional)

You can also set these for enhanced configuration:

```bash
# JWT Secret for admin authentication
JWT_SECRET=your_random_secret_here

# CORS Origins for production domain
CORS_ORIGINS=https://your-domain.com

# Database URL (if using external database)
DATABASE_URL=postgresql://user:pass@host:port/dbname
```
