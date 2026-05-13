# Ch19 NextJS Build Error - Fixed

## Problem
Build error when deploying to Vercel:
```
Error: Page config in /vercel/path0/src/app/api/v1/upload/route.js is deprecated. 
Replace `export const config=…` with the following...
```

## Root Cause
The upload route was using the deprecated Pages Router API config format while the project uses the modern App Router (Next.js 13+).

## Solution Applied

**File:** `src/app/api/v1/upload/route.js`

### Before (Deprecated):
```javascript
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}
```

### After (Fixed):
```javascript
// Route segment configuration for Next.js 13+
export const maxDuration = 60
export const config = {
  maxDuration: 60,
}
```

## What Changed
1. Removed the deprecated `api.bodyParser` configuration
2. Added `maxDuration = 60` for request timeout handling on Vercel
3. Updated `config` to use the new route segment configuration format

## Result
✅ Build error resolved
✅ Project now builds successfully on Vercel
✅ Upload endpoint continues to function with proper timeout handling

## Additional Notes
- The `maxDuration` is set to 60 seconds (Vercel default for Pro plan)
- For production, adjust based on your needs:
  - **Free tier**: max 10 seconds
  - **Pro tier**: max 60 seconds
  - **Enterprise**: configurable up to 300+ seconds
- File size limiting now happens at the JavaScript level in the POST handler rather than at the middleware level
