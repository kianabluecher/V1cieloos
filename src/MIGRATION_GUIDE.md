# CIELO OS - Database Migration Guide

## Overview

This guide explains how to migrate from the current **KV Store** implementation to proper **Supabase PostgreSQL tables** for better performance, data integrity, and scalability.

---

## Current Architecture

### KV Store Keys Currently Used:
```
clients                              → Array of all clients
client_credentials_{clientId}        → Individual client credentials
client_services                      → Array of all services
client_contracts                     → Array of all contracts
client_comments                      → Array of all comments
client_assets_{clientId}             → Client-specific assets
client_files_{clientId}              → Client-specific files
file_channels_{clientId}             → Client-specific file channels
client_portal_settings_{clientId}    → Client portal settings
activity_logs                        → Array of activity logs
quotes                               → Array of quotes
customers                            → Array of customers
catalog_items                        → Array of catalog items
```

---

## New Architecture Benefits

### ✅ **Relational Database Tables**
- Foreign key relationships
- Data integrity constraints
- Automatic cascade deletes
- Normalized data structure

### ✅ **Performance**
- Indexed queries (10-100x faster)
- Full-text search capabilities
- Efficient joins
- Query optimization

### ✅ **Security**
- Row Level Security (RLS)
- Per-user data access control
- Audit trails
- Encrypted at rest

### ✅ **Features**
- Automatic timestamp updates
- Materialized views
- Database functions
- Complex aggregations

---

## Migration Steps

### Step 1: Run the SQL Schema

1. Open **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy contents of `/database_schema.sql`
4. Click **Run**
5. Verify all tables were created (check "Table Editor")

### Step 2: Migrate Existing Data (Optional)

If you want to preserve existing KV store data:

```sql
-- Example: Migrate clients from KV to table
INSERT INTO clients (id, name, email, company_name, status, project_count, created_at)
SELECT 
    (value->>'id')::TEXT,
    (value->>'name')::TEXT,
    (value->>'email')::TEXT,
    (value->>'companyName')::TEXT,
    COALESCE((value->>'status')::TEXT, 'active'),
    COALESCE((value->>'projectCount')::INTEGER, 0),
    COALESCE((value->>'createdAt')::TIMESTAMP, NOW())
FROM kv_store_c3abf285
WHERE key = 'clients',
    jsonb_array_elements(CASE WHEN jsonb_typeof(value) = 'array' THEN value ELSE '[]'::jsonb END) AS value
ON CONFLICT (id) DO NOTHING;

-- Similar queries for other tables...
```

### Step 3: Update Server Endpoints

The server code at `/supabase/functions/server/index.tsx` currently uses KV store. You need to update endpoints to use Supabase queries.

#### Before (KV Store):
```typescript
app.get("/make-server-c3abf285/clients", async (c) => {
  const clients = await kv.get('clients') || [];
  return c.json({ success: true, data: clients });
});
```

#### After (Supabase Table):
```typescript
app.get("/make-server-c3abf285/clients", async (c) => {
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
  
  return c.json({ success: true, data: clients });
});
```

### Step 4: Update All Endpoints

Systematically update each endpoint that uses KV store:

#### **Clients Endpoints:**
- `GET /clients` - List all clients
- `POST /clients` - Create new client
- `PUT /clients/:id` - Update client
- `POST /clients/:id/invite` - Send invitation

#### **Client Services:**
- `GET /clients/:clientId/services`
- `POST /clients/:clientId/services`

#### **Client Contracts:**
- `GET /clients/:clientId/contracts`
- `POST /clients/:clientId/contracts`

#### **Client Comments:**
- `GET /clients/:clientId/comments`
- `POST /clients/:clientId/comments`
- `PUT /comments/:commentId`

#### **Client Assets:**
- `GET /clients/:clientId/assets`
- `POST /clients/:clientId/assets`

#### **Client Portal Settings:**
- `GET /clients/:clientId/portal-settings`
- `PUT /clients/:clientId/portal-settings`

#### **Activity Logs:**
- `GET /activity`
- `POST /activity`

### Step 5: Test Each Endpoint

Create a test script to verify all endpoints work:

```typescript
// Test script
const baseUrl = 'https://your-project.supabase.co/functions/v1/make-server-c3abf285';

// Test client creation
const createClient = await fetch(`${baseUrl}/clients`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    name: 'Test Client',
    email: 'test@example.com',
    password: 'test123',
    companyName: 'Test Company'
  })
});

console.log(await createClient.json());

// Test client listing
const getClients = await fetch(`${baseUrl}/clients`, {
  headers: { 'Authorization': 'Bearer YOUR_ANON_KEY' }
});

console.log(await getClients.json());
```

### Step 6: Enable RLS (Row Level Security)

Configure access policies in Supabase:

```sql
-- Example: Clients can only see their own data
CREATE POLICY "Users can view own client data" ON clients
    FOR SELECT
    USING (auth.email() = email);

-- Example: Team members can view all clients
CREATE POLICY "Team can view all clients" ON clients
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.user_id = auth.uid()
        )
    );
```

---

## Quick Reference: Endpoint Updates

### Example 1: Get Client by ID

**Before (KV):**
```typescript
app.get("/make-server-c3abf285/clients/:id", async (c) => {
  const clientId = c.req.param('id');
  const clients = await kv.get('clients') || [];
  const client = clients.find((c: any) => c.id === clientId);
  
  if (!client) {
    return c.json({ success: false, error: 'Client not found' }, 404);
  }
  
  return c.json({ success: true, data: client });
});
```

**After (Supabase):**
```typescript
app.get("/make-server-c3abf285/clients/:id", async (c) => {
  const clientId = c.req.param('id');
  
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();
  
  if (error || !client) {
    return c.json({ success: false, error: 'Client not found' }, 404);
  }
  
  return c.json({ success: true, data: client });
});
```

### Example 2: Create Client with Related Data

**After (Supabase with Transaction):**
```typescript
app.post("/make-server-c3abf285/clients", async (c) => {
  const body = await c.req.json();
  
  // Insert client
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      name: body.name,
      email: body.email,
      password: body.password, // Hash in production!
      company_name: body.companyName,
      status: 'pending'
    })
    .select()
    .single();
  
  if (clientError) {
    return c.json({ success: false, error: clientError.message }, 500);
  }
  
  // Create default portal settings
  await supabase
    .from('client_portal_settings')
    .insert({
      client_id: client.id,
      social_media_url: '',
      brand_web_url: ''
    });
  
  // Create default file channel
  await supabase
    .from('client_file_channels')
    .insert({
      id: 'general',
      client_id: client.id,
      name: 'General'
    });
  
  return c.json({ success: true, data: client });
});
```

### Example 3: Get Client with Related Data (Joins)

```typescript
app.get("/make-server-c3abf285/clients/:id/overview", async (c) => {
  const clientId = c.req.param('id');
  
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      services:client_services(count),
      contracts:client_contracts(count),
      assets:client_assets(count),
      portal_settings:client_portal_settings(*)
    `)
    .eq('id', clientId)
    .single();
  
  if (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
  
  return c.json({ success: true, data });
});
```

---

## Performance Optimization

### Indexes Already Created:
- Email lookups: `idx_clients_email`
- Status filtering: `idx_clients_status`
- Date sorting: `idx_clients_created_at`
- Foreign key relationships
- Composite indexes for common queries

### Query Optimization Tips:

1. **Use `.select()` with specific columns:**
```typescript
// ❌ Fetches all columns
.select('*')

// ✅ Only fetch needed columns
.select('id, name, email, status')
```

2. **Use `.limit()` for pagination:**
```typescript
.select('*')
.order('created_at', { ascending: false })
.range(0, 9) // First 10 records
```

3. **Use `.count()` for totals:**
```typescript
.select('*', { count: 'exact', head: true })
```

---

## Rollback Plan

If you need to rollback to KV store:

1. Keep KV store code alongside new code temporarily
2. Use feature flags to toggle between implementations
3. Test thoroughly before removing KV code

```typescript
// Example feature flag
const USE_DATABASE = Deno.env.get('USE_DATABASE') === 'true';

if (USE_DATABASE) {
  // Use Supabase tables
  const { data } = await supabase.from('clients').select('*');
} else {
  // Use KV store
  const data = await kv.get('clients');
}
```

---

## Security Checklist

- [ ] Enable Row Level Security on all tables
- [ ] Configure RLS policies for each user role
- [ ] Hash passwords using bcrypt (don't store plain text)
- [ ] Use Supabase Auth for user authentication
- [ ] Set up API key rotation
- [ ] Enable audit logging
- [ ] Configure backup retention
- [ ] Test access control thoroughly

---

## Monitoring & Maintenance

### Database Health Checks:
```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **SQL Editor:** Supabase Dashboard → SQL Editor
- **Table Editor:** Supabase Dashboard → Table Editor
- **Database Logs:** Supabase Dashboard → Logs

---

## Next Steps

1. ✅ Run `/database_schema.sql` in Supabase SQL Editor
2. ⏳ Update server endpoints one by one
3. ⏳ Test each endpoint thoroughly
4. ⏳ Configure RLS policies
5. ⏳ Deploy to production
6. ⏳ Monitor performance
7. ⏳ Remove KV store fallback code

---

**Questions or Issues?**
Check the inline comments in `/database_schema.sql` for detailed explanations.
