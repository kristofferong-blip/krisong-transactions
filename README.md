# KO Transaction Tracker

Web app for personal real estate transaction tracking.

## Stack
- Next.js 15 + TypeScript  
- Supabase (PostgreSQL + Magic Link auth)
- Vercel (hosting)

## Environment Variables (set in Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://qijoajyogxngqdvuynks.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase Legacy API Keys>
SUPABASE_SERVICE_ROLE_KEY=<from Supabase Legacy API Keys>
```

## Auth Setup
After deploying, add your Vercel URL to Supabase Auth → URL Configuration → Redirect URLs