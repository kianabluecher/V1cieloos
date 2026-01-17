-- ============================================
-- CIELO OS Database Schema
-- Complete SQL for Client Accounts & Details
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MAIN CLIENTS TABLE
-- ============================================

CREATE TABLE clients (
    -- Primary fields
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    
    -- Authentication
    email TEXT UNIQUE NOT NULL,
    password TEXT, -- Should be hashed in production
    
    -- Basic information
    name TEXT NOT NULL,
    company_name TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'archived')),
    project_count INTEGER DEFAULT 0,
    last_activity TEXT DEFAULT 'Just created',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);

-- ============================================
-- CLIENT CREDENTIALS (for invitations)
-- ============================================

CREATE TABLE client_credentials (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(client_id)
);

CREATE INDEX idx_client_credentials_client_id ON client_credentials(client_id);

-- ============================================
-- CLIENT SERVICES
-- ============================================

CREATE TABLE client_services (
    id TEXT PRIMARY KEY DEFAULT ('service-' || extract(epoch from now())::bigint::text),
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_client_services_client_id ON client_services(client_id);
CREATE INDEX idx_client_services_status ON client_services(status);

-- ============================================
-- CLIENT CONTRACTS
-- ============================================

CREATE TABLE client_contracts (
    id TEXT PRIMARY KEY DEFAULT ('contract-' || extract(epoch from now())::bigint::text),
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    value DECIMAL(10, 2) DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expired', 'terminated')),
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_client_contracts_client_id ON client_contracts(client_id);
CREATE INDEX idx_client_contracts_status ON client_contracts(status);
CREATE INDEX idx_client_contracts_dates ON client_contracts(start_date, end_date);

-- ============================================
-- CLIENT COMMENTS / NOTES
-- ============================================

CREATE TABLE client_comments (
    id TEXT PRIMARY KEY DEFAULT ('comment-' || extract(epoch from now())::bigint::text),
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id TEXT REFERENCES client_comments(id) ON DELETE CASCADE,
    images JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_client_comments_client_id ON client_comments(client_id);
CREATE INDEX idx_client_comments_parent_id ON client_comments(parent_id);
CREATE INDEX idx_client_comments_created_at ON client_comments(created_at DESC);

-- ============================================
-- CLIENT ASSETS / FILES
-- ============================================

CREATE TABLE client_assets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'file' or 'link'
    file_type TEXT, -- MIME type for files
    size INTEGER, -- File size in bytes
    url TEXT NOT NULL,
    channel_id TEXT DEFAULT 'general',
    uploaded_by TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_client_assets_client_id ON client_assets(client_id);
CREATE INDEX idx_client_assets_channel_id ON client_assets(channel_id);
CREATE INDEX idx_client_assets_type ON client_assets(type);

-- ============================================
-- CLIENT FILE CHANNELS
-- ============================================

CREATE TABLE client_file_channels (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(client_id, name)
);

CREATE INDEX idx_client_file_channels_client_id ON client_file_channels(client_id);

-- ============================================
-- CLIENT PORTAL SETTINGS
-- ============================================

CREATE TABLE client_portal_settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Live Data URLs
    social_media_url TEXT,
    social_media_locked BOOLEAN DEFAULT FALSE,
    brand_web_url TEXT,
    brand_web_locked BOOLEAN DEFAULT FALSE,
    
    -- Analytics Integration
    analytics_url TEXT,
    analytics_api_key TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(client_id)
);

CREATE INDEX idx_client_portal_settings_client_id ON client_portal_settings(client_id);

-- ============================================
-- ACTIVITY LOGS
-- ============================================

CREATE TABLE activity_logs (
    id TEXT PRIMARY KEY DEFAULT ('act-' || extract(epoch from now())::bigint::text),
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('client', 'team', 'management')),
    action TEXT NOT NULL CHECK (action IN ('sign_in', 'sign_out', 'task_viewed', 'task_edited', 'task_created', 'file_uploaded', 'client_viewed')),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_user_type ON activity_logs(user_type);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp DESC);

-- ============================================
-- TASKS (Project Management)
-- ============================================

CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'on_hold')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tasks_client_id ON tasks(client_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- ============================================
-- QUOTES / INVOICES
-- ============================================

CREATE TABLE quotes (
    id TEXT PRIMARY KEY DEFAULT ('quote-' || extract(epoch from now())::bigint::text),
    customer_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_company TEXT,
    customer_phone TEXT,
    
    -- Quote details
    quote_number TEXT UNIQUE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'expired')),
    
    -- Line items
    items JSONB DEFAULT '[]'::JSONB,
    
    -- Totals
    subtotal DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    
    -- Additional info
    notes TEXT,
    terms TEXT,
    valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_quotes_customer_email ON quotes(customer_email);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_quote_number ON quotes(quote_number);

-- ============================================
-- CATALOG ITEMS (Services Catalog)
-- ============================================

CREATE TABLE catalog_items (
    id TEXT PRIMARY KEY DEFAULT ('item-' || extract(epoch from now())::bigint::text),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    sku TEXT UNIQUE,
    category TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_catalog_items_category ON catalog_items(category);
CREATE INDEX idx_catalog_items_sku ON catalog_items(sku);
CREATE INDEX idx_catalog_items_active ON catalog_items(active);

-- ============================================
-- CUSTOMERS (Separate from Clients)
-- ============================================

CREATE TABLE customers (
    id TEXT PRIMARY KEY DEFAULT ('customer-' || extract(epoch from now())::bigint::text),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_services_updated_at BEFORE UPDATE ON client_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_contracts_updated_at BEFORE UPDATE ON client_contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_assets_updated_at BEFORE UPDATE ON client_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_file_channels_updated_at BEFORE UPDATE ON client_file_channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_portal_settings_updated_at BEFORE UPDATE ON client_portal_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_catalog_items_updated_at BEFORE UPDATE ON catalog_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_file_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth setup)

-- Clients can only see their own data
CREATE POLICY "Clients can view own data" ON clients
    FOR SELECT USING (auth.uid()::TEXT = id);

CREATE POLICY "Clients can update own data" ON clients
    FOR UPDATE USING (auth.uid()::TEXT = id);

-- Service role can do everything (for backend operations)
CREATE POLICY "Service role has full access to clients" ON clients
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Similar policies for other tables...
-- (Add more specific policies based on your authentication requirements)

-- ============================================
-- SAMPLE DATA INSERT
-- ============================================

-- Insert sample client
INSERT INTO clients (id, name, email, password, company_name, status, project_count, last_activity)
VALUES 
    ('sarah-client-001', 'Sarah Johnson', 'sarah@client.com', 'password123', 'ACME Corporation', 'active', 3, 'Just now'),
    ('michael-client-002', 'Michael Chen', 'michael@techstartup.io', 'password123', 'TechStartup Inc', 'active', 1, '2 hours ago')
ON CONFLICT (id) DO NOTHING;

-- Insert sample portal settings
INSERT INTO client_portal_settings (client_id, social_media_url, brand_web_url)
VALUES 
    ('sarah-client-001', 'https://share.plannthat.com/b/6f35260f05f20f99c0a9a88dff06ad11/2042127/grid', 'https://docs.google.com/spreadsheets/d/1MI7ynnujHwXN91pBVMdQuUmcvmVMI6Vgx4LxoMD9q6E/edit?usp=sharing')
ON CONFLICT (client_id) DO NOTHING;

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, user_name, user_email, user_type, action, description)
VALUES 
    ('sarah@client.com', 'Sarah Johnson', 'sarah@client.com', 'client', 'sign_in', 'Sarah Johnson signed in to CIELO OS'),
    ('john@cielo.marketing', 'John Smith', 'john@cielo.marketing', 'team', 'task_viewed', 'John Smith viewed task: Design new logo concepts')
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Client overview with service counts
CREATE OR REPLACE VIEW client_overview AS
SELECT 
    c.id,
    c.name,
    c.email,
    c.company_name,
    c.status,
    c.project_count,
    c.last_activity,
    c.created_at,
    COUNT(DISTINCT cs.id) as service_count,
    COUNT(DISTINCT cc.id) as contract_count,
    COUNT(DISTINCT ca.id) as asset_count
FROM clients c
LEFT JOIN client_services cs ON c.id = cs.client_id
LEFT JOIN client_contracts cc ON c.id = cc.client_id
LEFT JOIN client_assets ca ON c.id = ca.client_id
GROUP BY c.id;

-- View: Recent activity by client
CREATE OR REPLACE VIEW client_recent_activity AS
SELECT 
    al.id,
    al.user_id,
    al.user_name,
    al.action,
    al.description,
    al.timestamp,
    c.name as client_name,
    c.company_name
FROM activity_logs al
LEFT JOIN clients c ON al.user_email = c.email
WHERE al.user_type = 'client'
ORDER BY al.timestamp DESC;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON clients TO authenticated;
GRANT SELECT, INSERT ON client_credentials TO authenticated;
GRANT SELECT, INSERT, UPDATE ON client_services TO authenticated;
GRANT SELECT, INSERT, UPDATE ON client_contracts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON client_comments TO authenticated;
GRANT SELECT, INSERT, DELETE ON client_assets TO authenticated;
GRANT SELECT, INSERT ON client_file_channels TO authenticated;
GRANT SELECT, UPDATE ON client_portal_settings TO authenticated;
GRANT SELECT, INSERT ON activity_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE ON quotes TO authenticated;
GRANT SELECT ON catalog_items TO authenticated;
GRANT SELECT ON customers TO authenticated;

-- Grant all permissions to service role (for backend operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_client_services_client_status ON client_services(client_id, status);
CREATE INDEX idx_client_contracts_client_status ON client_contracts(client_id, status);
CREATE INDEX idx_activity_logs_user_timestamp ON activity_logs(user_id, timestamp DESC);
CREATE INDEX idx_tasks_client_status ON tasks(client_id, status);

-- Full-text search indexes (optional, for advanced search)
CREATE INDEX idx_clients_name_search ON clients USING gin(to_tsvector('english', name || ' ' || coalesce(company_name, '')));
CREATE INDEX idx_tasks_search ON tasks USING gin(to_tsvector('english', title || ' ' || coalesce(description, '')));

-- ============================================
-- NOTES
-- ============================================

/*
IMPORTANT MIGRATION NOTES:

1. Your current system uses a KV store (kv_store_c3abf285 table).
   This SQL creates proper relational tables for better performance and querying.

2. To migrate from KV store to these tables:
   - Run this SQL in your Supabase SQL editor
   - Update your server endpoints to query these tables instead of KV store
   - Keep KV store as fallback during transition

3. Key benefits of using these tables:
   - Better performance with indexes
   - Data integrity with foreign keys
   - Automatic timestamp updates
   - Row-level security
   - Advanced querying capabilities
   - Relational data integrity

4. Current KV keys mapped to tables:
   - 'clients' → clients table
   - 'client_credentials_{id}' → client_credentials table
   - 'client_services' → client_services table
   - 'client_contracts' → client_contracts table
   - 'client_comments' → client_comments table
   - 'client_assets_{clientId}' → client_assets table
   - 'client_portal_settings_{clientId}' → client_portal_settings table
   - 'activity_logs' → activity_logs table
   - 'quotes' → quotes table
   - 'catalog_items' → catalog_items table

5. Authentication:
   - Currently the system stores passwords in plain text (see line 727 in server code)
   - For production: Use Supabase Auth or hash passwords with bcrypt
   - Update RLS policies based on your auth implementation

6. File Storage:
   - client_assets table stores metadata
   - Actual files should be in Supabase Storage bucket: 'make-c3abf285-files'
   - URL field should point to storage bucket signed URLs

7. Running this SQL:
   - Go to Supabase Dashboard → SQL Editor
   - Paste this entire file
   - Click "Run"
   - All tables, indexes, and policies will be created
*/
