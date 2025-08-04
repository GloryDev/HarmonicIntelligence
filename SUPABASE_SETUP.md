# Supabase Setup Guide for Harmonic Intelligence Interface

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be ready

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://your-project-id.supabase.co`)
3. Copy your **anon public** key (starts with `eyJ...`)

## Step 3: Create Environment Variables

Create a file called `.env.local` in your project root with:

```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase credentials.

## Step 4: Create the Database Table

In your Supabase dashboard, go to **SQL Editor** and run:

```sql
CREATE TABLE harmonic_memory (
  id BIGSERIAL PRIMARY KEY,
  x TEXT NOT NULL,
  y TEXT NOT NULL,
  z TEXT NOT NULL,
  score INTEGER NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE harmonic_memory ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for demo purposes)
CREATE POLICY "Allow all operations" ON harmonic_memory
  FOR ALL USING (true);
```

## Step 5: Restart Your React App

After creating the `.env.local` file, restart your React development server:

```bash
npm start
```

## Step 6: Test the Connection

Your Harmonic Intelligence Interface will now show:
- ✅ **Connected to Supabase** - if everything is working
- ⚠ **Using local storage** - if Supabase is not configured
- ❌ **Connection failed** - if there's an error

## Troubleshooting

- Make sure your `.env.local` file is in the project root (same level as `package.json`)
- Restart the React app after changing environment variables
- Check that your Supabase project is active and the table exists
- Verify your API keys are correct

## Current Status

Your app will work with local storage even without Supabase configured, but data won't persist between sessions. 