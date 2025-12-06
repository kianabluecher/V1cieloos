# CIELO OS Automation System Guide

## Overview
The CIELO OS Automation System is a fully functional workflow builder that allows you to create, configure, and execute automated workflows. The first implementation is a Figma-to-Supabase sync automation.

## Features

### ✅ Functional Workflow Builder
- **Visual Canvas**: Drag-and-drop interface with grid background and connection lines
- **Node-Based Design**: Trigger, Action, and Condition nodes with visual indicators
- **Real-Time Configuration**: Click any node to configure its parameters
- **Execution Engine**: Test workflows with live execution logs
- **Status Tracking**: Visual indicators show which nodes are configured

### ✅ Figma → Supabase Sync Automation

#### Workflow Steps:
1. **Trigger**: Figma File Updated/Created
   - Configure polling interval
   - Specify file key (or monitor all files)
   - Choose trigger type (update, create, or manual)

2. **Extract Metadata**
   - Selectable fields: file_name, file_key, last_modified, thumbnail_url, version
   - Custom JSON fields support
   - Automatic field extraction

3. **If/Else Duplicate Check**
   - Check for existing records
   - Configure duplicate detection field (file_key, file_name, or id)
   - Automatic decision routing

4. **Upsert to Supabase**
   - Table name configuration (default: `figma_files_automation`)
   - Operation type: Upsert, Insert, or Update
   - Conflict column specification
   - Optional sync logging

5. **Send Email Notification**
   - Template-based emails with dynamic values
   - Configurable recipient, subject, and body
   - Conditional sending (only on success)
   - Variable substitution: `{{file_name}}`, `{{version}}`, `{{last_modified}}`

### ✅ Configuration System
Each node can be configured with:
- **Trigger Settings**: Polling interval, file filters, trigger conditions
- **Action Parameters**: Field selection, custom data, operation types
- **Condition Logic**: Duplicate detection, custom rules
- **Email Templates**: Dynamic content with variable substitution

### ✅ Execution & Monitoring
- **Test Workflow**: Execute the entire workflow with one click
- **Real-Time Logs**: See each step execute with detailed logging
- **Status Indicators**: Success (✓), Error (❌), Running (⏳)
- **Execution History**: All logs stored with timestamps
- **Error Handling**: Comprehensive error messages and recovery

## Technical Implementation

### Frontend Components
- **AutomationsPage** (`/components/pages/AutomationsPage.tsx`): Main workflow canvas
- **AutomationNodeConfig** (`/components/AutomationNodeConfig.tsx`): Node configuration dialogs
- **Visual Canvas**: SVG connection lines, node positioning, interactive elements

### Backend Integration
- **KV Store API**: RESTful endpoints for data persistence
  - `GET /kv/:key` - Retrieve value
  - `PUT /kv/:key` - Store value
  - `DELETE /kv/:key` - Delete value

### Data Storage
All automation data stored in Supabase KV store with keys:
- `figma_automation_{file_key}` - Synced file metadata
- `figma_automation_log_{timestamp}` - Execution logs
- Node configurations stored in component state (can be persisted)

## Usage Guide

### Creating a New Workflow

1. **Navigate to Automations**
   - Management View → Automations (in sidebar)

2. **Configure Nodes**
   - Click each node to open configuration dialog
   - Fill in required parameters
   - Save configuration (check mark appears when configured)

3. **Test Workflow**
   - Click "Test Workflow" button
   - Watch execution logs in right panel
   - Verify success/error status

### Example: Figma Sync Configuration

#### Step 1: Configure Trigger
```
Trigger Type: Figma File Updated
File Key: (leave empty for all files)
Polling Interval: 5 minutes
```

#### Step 2: Configure Metadata Extraction
```
Fields: ☑ file_name, ☑ file_key, ☑ last_modified, ☑ thumbnail_url, ☑ version
Custom Fields: {"project_id": "123", "team": "design"}
```

#### Step 3: Configure Duplicate Check
```
Condition Type: Check for Duplicates
Duplicate Field: file_key
Behavior: Upsert on duplicate
```

#### Step 4: Configure Database Upsert
```
Table Name: figma_files_automation
Operation: Upsert (Insert or Update)
Conflict Column: file_key
☑ Log successful syncs
```

#### Step 5: Configure Email Notification
```
Recipient: admin@cielo.marketing
Subject: Figma Sync Complete - {{file_name}}
Body: File {{file_name}} (v{{version}}) synced at {{last_modified}}
☑ Only send on successful sync
```

## Workflow Execution Process

### Simulated Execution Flow:
1. ✓ Trigger detects Figma file update
2. ✓ Extract metadata from file
3. ✓ Check database for existing record
4. ✓ Upsert data to Supabase (INSERT or UPDATE)
5. ✓ Log sync operation
6. ✓ Send email notification
7. ✅ Workflow complete

### Actual Data Flow:
```
Figma API → Metadata Extraction → KV Store Check → 
Upsert Operation → Activity Logging → Email Service → Complete
```

## Future Enhancements

### Planned Features:
- [ ] Drag-and-drop node creation
- [ ] Custom node types
- [ ] Workflow scheduling
- [ ] Webhook triggers
- [ ] Multiple workflow support
- [ ] Workflow templates library
- [ ] Advanced error handling with retry logic
- [ ] Real-time execution monitoring dashboard
- [ ] Integration with external services (Slack, Discord, etc.)

### Database Schema
Future enhancement to create dedicated table:
```sql
CREATE TABLE figma_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_key TEXT UNIQUE NOT NULL,
  last_modified TIMESTAMP NOT NULL,
  thumbnail_url TEXT,
  version INTEGER,
  sync_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Reference

### KV Store Endpoints

#### Get Value
```
GET /make-server-6023d608/kv/:key
Authorization: Bearer {publicAnonKey}

Response: { success: true, data: any }
```

#### Set Value
```
PUT /make-server-6023d608/kv/:key
Authorization: Bearer {publicAnonKey}
Content-Type: application/json

Body: { value: any }
Response: { success: true, message: string }
```

#### Delete Value
```
DELETE /make-server-6023d608/kv/:key
Authorization: Bearer {publicAnonKey}

Response: { success: true, message: string }
```

## Troubleshooting

### Common Issues

**Q: Workflow execution fails**
- Ensure all nodes are configured (green check marks)
- Check execution logs for specific error messages
- Verify API connectivity in browser console

**Q: Email not sending**
- Confirm email configuration is complete
- Check "Only send on success" setting
- Verify recipient email address

**Q: Data not persisting**
- Check KV store API connectivity
- Verify Supabase configuration
- Review server logs for errors

## Architecture

### Component Hierarchy
```
AutomationsPage
├── Canvas Area (workflow visualization)
│   ├── Node Components (clickable)
│   └── Connection Lines (SVG)
├── Tools Sidebar (available actions)
└── Execution Logs (real-time monitoring)

AutomationNodeConfig (dialog)
├── Trigger Configuration
├── Action Configuration
└── Condition Configuration
```

### State Management
- Node configurations: Local component state
- Execution logs: State-based log array
- Workflow status: Enum (idle, running, success, error)

### Data Persistence
- Workflow data: Supabase KV Store
- File metadata: Key pattern `figma_automation_{file_key}`
- Execution logs: Key pattern `figma_automation_log_{timestamp}`

## Security

### Best Practices
- API keys stored in environment variables
- Server-side validation of all inputs
- CORS properly configured
- Authorization headers required for all API calls

## Performance

### Optimization Strategies
- Lazy loading of node configurations
- Efficient SVG rendering for connections
- Debounced configuration saves
- Incremental log updates

---

## Quick Start

1. Navigate to Management View → Automations
2. Click on each workflow node to configure
3. Click "Test Workflow" to execute
4. Monitor execution in the right panel
5. Review success/error status

**Status**: ✅ Fully Functional  
**Version**: 1.0  
**Last Updated**: November 2024
