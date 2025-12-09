# 📊 Supabase Client Table Setup Guide

## Overview
Your CIELO OS application now syncs client data with a Supabase PostgreSQL table. The server automatically tries to use the Supabase table first, then falls back to KV store if unavailable.

---

## 🗄️ SQL Table Creation

Run this SQL in your Supabase SQL Editor to create the `clients` table:

```sql
-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  company_name TEXT,
  status TEXT CHECK (status IN ('active', 'pending', 'inactive', 'archived')) DEFAULT 'pending',
  project_count INTEGER DEFAULT 0,
  last_activity TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to do everything
CREATE POLICY "Service role can do everything"
  ON public.clients
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy to allow authenticated users to read
CREATE POLICY "Authenticated users can read clients"
  ON public.clients
  FOR SELECT
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE public.clients IS 'Client accounts for CIELO OS agency dashboard';
```

---

## 📋 Table Schema

| Column Name    | Data Type    | Nullable | Default   | Description                          |
|----------------|--------------|----------|-----------|--------------------------------------|
| id             | TEXT         | NO       | -         | Primary key (timestamp-based)        |
| name           | TEXT         | NO       | -         | Client full name                     |
| email          | TEXT         | NO       | -         | Client email (unique)                |
| password       | TEXT         | YES      | NULL      | Client password (should be hashed)   |
| company_name   | TEXT         | YES      | NULL      | Company/organization name            |
| status         | TEXT         | NO       | 'pending' | Account status                       |
| project_count  | INTEGER      | NO       | 0         | Number of projects                   |
| last_activity  | TEXT         | YES      | NULL      | Last activity description            |
| created_at     | TIMESTAMPTZ  | NO       | NOW()     | Account creation timestamp           |
| updated_at     | TIMESTAMPTZ  | NO       | NOW()     | Last update timestamp                |

---

## 📝 Sample Data (JSON Format)

### Insert Sample Client

```sql
-- Insert Sarah Johnson (your test client)
INSERT INTO public.clients (
  id, 
  name, 
  email, 
  password, 
  company_name, 
  status, 
  project_count, 
  last_activity, 
  created_at
) VALUES (
  '1733692800000',
  'Sarah Johnson',
  'sarah@example.com',
  'demo123',
  'ACME Corporation',
  'active',
  7,
  '2 hours ago',
  '2024-11-09T12:00:00Z'
);

-- Insert additional test clients
INSERT INTO public.clients (
  id, 
  name, 
  email, 
  password, 
  company_name, 
  status, 
  project_count, 
  last_activity, 
  created_at
) VALUES 
(
  '1733692900000',
  'John Smith',
  'john@techcorp.com',
  'secure123',
  'Tech Corp',
  'pending',
  3,
  '1 day ago',
  '2024-12-01T08:00:00Z'
),
(
  '1733693000000',
  'Emily Davis',
  'emily@startupinc.com',
  'startup2024',
  'Startup Inc',
  'active',
  12,
  '30 minutes ago',
  '2024-10-15T14:30:00Z'
),
(
  '1733693100000',
  'Michael Brown',
  'michael@designco.com',
  'design456',
  'Design Co',
  'inactive',
  5,
  '2 weeks ago',
  '2024-09-20T10:00:00Z'
);
```

### JSON Representation

```json
[
  {
    "id": "1733692800000",
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "password": "demo123",
    "company_name": "ACME Corporation",
    "status": "active",
    "project_count": 7,
    "last_activity": "2 hours ago",
    "created_at": "2024-11-09T12:00:00.000Z",
    "updated_at": "2024-12-09T10:30:00.000Z"
  },
  {
    "id": "1733692900000",
    "name": "John Smith",
    "email": "john@techcorp.com",
    "password": "secure123",
    "company_name": "Tech Corp",
    "status": "pending",
    "project_count": 3,
    "last_activity": "1 day ago",
    "created_at": "2024-12-01T08:00:00.000Z",
    "updated_at": "2024-12-08T15:20:00.000Z"
  },
  {
    "id": "1733693000000",
    "name": "Emily Davis",
    "email": "emily@startupinc.com",
    "password": "startup2024",
    "company_name": "Startup Inc",
    "status": "active",
    "project_count": 12,
    "last_activity": "30 minutes ago",
    "created_at": "2024-10-15T14:30:00.000Z",
    "updated_at": "2024-12-09T11:45:00.000Z"
  },
  {
    "id": "1733693100000",
    "name": "Michael Brown",
    "email": "michael@designco.com",
    "password": "design456",
    "company_name": "Design Co",
    "status": "inactive",
    "project_count": 5,
    "last_activity": "2 weeks ago",
    "created_at": "2024-09-20T10:00:00.000Z",
    "updated_at": "2024-11-25T09:15:00.000Z"
  }
]
```

---

## 🔄 How Data Sync Works

### 1. **Read Operations (GET /clients)**
```
┌─────────────────┐
│  Client Request │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Try Supabase Table      │
│ SELECT * FROM clients   │
└────────┬───────┬────────┘
         │       │
    ✅ Success  ❌ Fail
         │       │
         │       ▼
         │  ┌──────────────┐
         │  │ Use KV Store │
         │  └──────────────┘
         │
         ▼
┌─────────────────────────┐
│ Return Data + Sync to KV│
└─────────────────────────┘
```

### 2. **Write Operations (POST/PUT /clients)**
```
┌─────────────────┐
│  Create/Update  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Try Supabase INSERT/    │
│ UPDATE                  │
└────────┬───────┬────────┘
         │       │
    ✅ Success  ❌ Fail
         │       │
         │       └─► Continue
         │
         ▼
┌─────────────────────────┐
│ Always save to KV Store │
│ (backup/fallback)       │
└─────────────────────────┘
```

---

## 🔍 Verify Sync Status

### Check Server Logs
The server logs will show which storage method is being used:

```bash
# Successful Supabase sync
✅ "Fetched 4 clients from Supabase table"
✅ "Client created in Supabase table: 1733692800000"
✅ "Client updated in Supabase table: 1733692800000"

# Fallback to KV store
⚠️  "Supabase table not available, using KV store"
```

### API Response Format
Every client operation now returns a `syncedToSupabase` flag:

```json
{
  "success": true,
  "data": { /* client data */ },
  "message": "Client created successfully",
  "syncedToSupabase": true
}
```

---

## 🚀 Quick Setup Steps

### Option 1: Create Table in Supabase Dashboard

1. **Go to Supabase Dashboard** → Your Project
2. **Navigate to** SQL Editor
3. **Copy & Paste** the SQL creation script above
4. **Click** "Run"
5. **Verify** table appears in Table Editor

### Option 2: Use Supabase CLI

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push
```

---

## 📊 Status Values Reference

| Status    | Description                          | Use Case                      |
|-----------|--------------------------------------|-------------------------------|
| `active`  | Actively working with agency         | Current paying clients        |
| `pending` | Invitation sent, not yet accepted    | New signups awaiting onboard  |
| `inactive`| Paused or project completed          | Past clients on hold          |
| `archived`| Historical record only               | No longer doing business      |

---

## 🔐 Security Notes

### 1. **Password Storage**
⚠️ **Important:** The current implementation stores passwords in plain text. In production, you should:

```typescript
// Hash passwords before storing
import { hash } from 'bcrypt';

const hashedPassword = await hash(body.password, 10);
```

### 2. **Row Level Security (RLS)**
The table has RLS enabled with policies that:
- Allow service role (backend) full access
- Allow authenticated users read-only access
- Block public/anonymous access

### 3. **API Key Protection**
Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend. Only use it in server-side code.

---

## 🧪 Testing the Integration

### 1. **Create a Test Client**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-c3abf285/clients \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "email": "test@example.com",
    "password": "test123",
    "companyName": "Test Company"
  }'
```

### 2. **Verify in Supabase**
1. Go to Table Editor → `clients`
2. You should see the new record
3. Check `created_at` and `updated_at` timestamps

### 3. **Check KV Store Sync**
The same data should exist in the KV store with key `clients`

---

## 🛠️ Troubleshooting

### Table Not Found Error
```
Error: relation "public.clients" does not exist
```
**Solution:** Run the SQL creation script in Supabase SQL Editor

### Duplicate Email Error
```
Error: duplicate key value violates unique constraint "clients_email_key"
```
**Solution:** Email already exists. Use a different email or update the existing record.

### Permission Denied
```
Error: permission denied for table clients
```
**Solution:** Check RLS policies. Service role should have full access.

### Data Not Syncing
**Check:**
1. Supabase URL and Service Role Key are correct in Edge Function secrets
2. Table name is exactly `clients` (lowercase)
3. Column names match the schema (snake_case)

---

## 📌 Next Steps

1. ✅ Create the `clients` table using the SQL above
2. ✅ Insert sample data or let the app create new clients
3. ✅ Test creating/updating clients in the app
4. ✅ Verify data appears in both Supabase table and works in dashboard
5. 🔄 Optional: Create additional tables for other entities (tasks, comments, etc.)

---

## 💡 Column Mapping

The server automatically maps between camelCase (app) and snake_case (database):

| App (camelCase)    | Database (snake_case) |
|--------------------|-----------------------|
| `companyName`      | `company_name`        |
| `projectCount`     | `project_count`       |
| `lastActivity`     | `last_activity`       |
| `createdAt`        | `created_at`          |
| `updatedAt`        | `updated_at`          |

This ensures compatibility whether you use Supabase table or KV store! 🎉
