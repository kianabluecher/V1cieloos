# CIELO OS Testing Guide

## Overview
This guide provides comprehensive testing instructions for all CIELO OS features across both Client View and Team View.

---

## Initial Setup

### 1. Seed Demo Data
1. Open the application
2. Switch to **Client View** (if not already there)
3. Navigate to **Hub** page
4. Scroll to bottom and click **"Seed Data"** button
5. Wait for success notification
6. Verify demo data is loaded

### 2. Verify Backend Connection
- Check browser console for "CIELO OS Backend Status" message
- Should show `status: "ok"`
- If not connected, check Supabase Edge Function deployment

---

## CLIENT VIEW TESTING

### Hub Page
**Location:** Client View → Hub

#### Test 1: AI Insights Display
- [ ] Verify 3 AI agent cards are displayed
- [ ] Check confidence scores (94%, 89%, 92%)
- [ ] Verify agent insights text is visible
- [ ] Test "Sync with AI Agents" button
- [ ] Verify "Last analysis" timestamp

#### Test 2: Welcome Section
- [ ] Verify welcome message shows "Hello, Sarah"
- [ ] Check greeting time changes (morning/afternoon/evening)
- [ ] Verify quick overview stats (7 Open Tasks, Next: Today 2:30 PM)
- [ ] Test "Upload new Document" button

#### Test 3: Brand Information
- [ ] Scroll to Brand Information section
- [ ] Verify form fields are populated with demo data
- [ ] Edit company name
- [ ] Click "Save Changes"
- [ ] Verify success toast notification
- [ ] Refresh page and confirm data persists

#### Test 4: File Upload
- [ ] Scroll to Upload Files section
- [ ] Verify 3 demo files are displayed
- [ ] Click "Browse Files" or drag a file
- [ ] Select a test file (PDF, image, or document)
- [ ] Verify upload progress
- [ ] Check success notification
- [ ] Verify new file appears in list
- [ ] Test "Download" button on a file
- [ ] Test "Delete" button on uploaded file

---

### Strategy Page
**Location:** Client View → Strategy

#### Test 1: Split Layout
- [ ] Verify page has two-column layout
- [ ] Left side shows "AI-Generated Content & Reports"
- [ ] Right side shows "Strategy Documents"

#### Test 2: AI-Generated Content (Left Side)
- [ ] Verify AI analysis card is displayed
- [ ] Check sample graphs/charts are visible
- [ ] Test "Export Report" button
- [ ] Verify "Refresh Analysis" button works

#### Test 3: Uploaded Documents (Right Side)
- [ ] Verify "Documents from Team" section
- [ ] Check if documents uploaded by team appear here
- [ ] Test document preview/download
- [ ] Verify document categories (Strategy, Report, Analysis)

---

### Design Requests & Tracking Page
**Location:** Client View → Tasks

#### Test 1: Tasks Display
- [ ] Verify demo tasks are displayed (3 tasks)
- [ ] Check task cards show: title, description, status, priority
- [ ] Verify status badges have correct colors:
  - Queued: gray
  - Running: cyan
  - Waiting: violet
  - Completed: green

#### Test 2: Manual Tasks from Team
- [ ] After team creates a manual task (see Team View testing)
- [ ] Refresh the page
- [ ] Verify new manual task appears in the list
- [ ] Check task shows correct priority badge
- [ ] Verify due date is displayed if set

#### Test 3: Task Filtering & Search
- [ ] Use search bar to filter tasks
- [ ] Test filter by status
- [ ] Test sort by date/priority
- [ ] Click on a task card to view details

#### Test 4: Create New Request
- [ ] Click "New Request" button in Hub or navigation
- [ ] Fill in request form:
  - Title
  - Description
  - Type (select from dropdown)
  - Priority
- [ ] Submit request
- [ ] Verify success notification
- [ ] Check new request appears in list

---

### Service Page
**Location:** Client View → Service

#### Test 1: Service Overview
- [ ] Verify current service plan details
- [ ] Check billing information
- [ ] Verify support contact info

---

### Data Archive Page
**Location:** Client View → Archive

#### Test 1: Meeting Records
- [ ] Verify past meeting notes are displayed
- [ ] Check chronological order
- [ ] Test search functionality
- [ ] Verify download/export options

---

## TEAM VIEW TESTING

### Switch to Team View
1. Click "Team View" button in sidebar
2. Verify navigation changes to show:
   - Clients
   - Tasks & Inquiries
   - Management

---

### Clients Section
**Location:** Team View → Clients

#### Test 1: Client Overview
- [ ] Verify overview cards show:
  - Active Clients count
  - Pending Clients count
  - Total Clients count
- [ ] Check demo client "Sarah Johnson" is displayed

#### Test 2: Create New Client
- [ ] Click "Create New Client" button
- [ ] Fill in form:
  - Name: Test Client
  - Email: test@example.com (use real email for invitation test)
  - Password: testpass123
  - Company: Test Company
- [ ] Click "Create & Send Invitation"
- [ ] Verify success notifications (2 toasts):
  - "Client created successfully"
  - "Invitation email sent" OR "Client created but invitation email failed"
- [ ] Check email inbox for invitation (if Resend is configured)
- [ ] Verify new client appears in table

#### Test 3: Edit Client Profile
- [ ] Click "Edit" (pencil icon) on a client
- [ ] Update client information:
  - Change name
  - Update company
  - Change status (Active/Pending/Inactive)
  - Optionally change password
- [ ] Click "Save Changes"
- [ ] Verify success notification
- [ ] Check updates are reflected in table

#### Test 4: Resend Invitation
- [ ] Click "Mail" icon on a client
- [ ] Verify success/error notification
- [ ] Check email inbox for invitation

#### Test 5: Upload Strategy Document for Client
- [ ] Select a client from table (row will highlight)
- [ ] Scroll to "Strategy Documents & Assets" section
- [ ] Click "Upload Document"
- [ ] Fill in form:
  - Title: Q3 Strategy Report
  - Type: PDF Document (or Link)
  - Category: Strategy
  - Description: Test document
  - File: Select a PDF (or enter URL if Link type)
- [ ] Click "Upload"
- [ ] Verify success notification
- [ ] Check document appears in list
- [ ] Test download and delete buttons

---

### Tasks & Inquiries Section
**Location:** Team View → Tasks & Inquiries

#### Test 1: Task Overview
- [ ] Verify overview cards show counts:
  - To Do
  - In Progress
  - In Review
  - Completed
- [ ] Check demo tasks are displayed (3 tasks)

#### Test 2: Create Manual Task
- [ ] Select a client from dropdown (if available) OR ensure a client is selected
- [ ] Click "Create Manual Task" button
- [ ] Fill in form:
  - Title: Review Q4 Strategy
  - Description: Please review and provide feedback on Q4 strategy document
  - Priority: High
  - Due Date: Select a future date
- [ ] Click "Create Task"
- [ ] Verify success notification
- [ ] Check new task appears in list
- [ ] **Important:** Switch to Client View → Tasks to verify task appears there

#### Test 3: Update Task Status
- [ ] Find a task in the list
- [ ] Use status dropdown on the right
- [ ] Change status (To Do → In Progress → Review → Completed)
- [ ] Verify success notification
- [ ] Check task card updates immediately
- [ ] Verify overview cards update counts

#### Test 4: Search Tasks
- [ ] Use search bar to filter tasks
- [ ] Search by title or description
- [ ] Verify filtering works correctly

---

### Management Section
**Location:** Team View → Management

#### Test 1: Team Members Tab

**View Team:**
- [ ] Click "Team Members" tab
- [ ] Verify demo team members displayed (Alex Designer, Morgan Strategist)
- [ ] Check role badges are color-coded
- [ ] Verify status and join dates

**Invite Team Member:**
- [ ] Click "Invite Team Member" button
- [ ] Fill in form:
  - Name: John Doe
  - Email: john@agency.com
  - Role: Designer
  - Permissions: Check 2-3 permissions
- [ ] Click "Send Invitation"
- [ ] Verify success notification
- [ ] Check new member appears in table with "Pending" status

**Remove Team Member:**
- [ ] Click trash icon on a team member
- [ ] Confirm deletion in alert
- [ ] Verify member is removed from list

#### Test 2: Permissions Tab
- [ ] Click "Permissions" tab
- [ ] Verify 4 role cards are displayed:
  - Admin
  - Manager
  - Designer
  - Strategist
- [ ] Check each role shows appropriate permissions
- [ ] Verify permission checkmarks are displayed

#### Test 3: Plans & Billing Tab

**View Overview:**
- [ ] Click "Plans & Billing" tab
- [ ] Verify overview cards show:
  - Monthly Revenue ($2,500)
  - Active Plans (1)
  - Trial Users (0)

**View Client Plans:**
- [ ] Check demo plan for "Sarah Johnson" is displayed
- [ ] Verify plan details:
  - Plan: Professional
  - Billing: Monthly
  - Amount: $2500/mo
  - Status: Active
  - Next Billing Date

**Edit Client Plan:**
- [ ] Click edit (pencil) icon on a plan
- [ ] Update plan details:
  - Change plan tier (Starter/Professional/Enterprise)
  - Change billing cycle (Monthly/Annual)
  - Update amount
  - Change status (Active/Trial/Cancelled)
- [ ] Click "Update Plan"
- [ ] Verify success notification
- [ ] Check updates are reflected in table

---

## CROSS-VIEW INTEGRATION TESTING

### Test 1: Manual Task Flow (Team → Client)
1. **Team View:**
   - Go to Tasks & Inquiries
   - Create a manual task for "Sarah Johnson"
   - Set title: "Test Task from Team"
   - Set priority: High
2. **Client View:**
   - Switch to Client View
   - Go to Design Requests & Tracking
   - Refresh if needed
   - **Verify:** New task appears in client's task list
   - **Verify:** Task shows correct priority and status

### Test 2: Strategy Document Flow (Team → Client)
1. **Team View:**
   - Go to Clients
   - Select "Sarah Johnson"
   - Upload a strategy document
   - Title: "Q3 Marketing Plan"
   - Category: Strategy
2. **Client View:**
   - Switch to Client View
   - Go to Strategy page
   - Check right side panel
   - **Verify:** New document appears in "Documents from Team"
   - **Verify:** Can download or preview document

### Test 3: Client Status Updates
1. **Team View:**
   - Go to Clients
   - Edit "Sarah Johnson"
   - Change status to "Inactive"
   - Save changes
2. **Verify:**
   - Status badge updates in clients table
   - Check if this affects client's access (implementation dependent)

---

## BACKEND API TESTING

### Test API Endpoints via Browser Console

Open browser console (F12) and run these commands:

```javascript
// Test health check
fetch('YOUR_SUPABASE_URL/functions/v1/make-server-6023d608/health', {
  headers: { 'Authorization': 'Bearer YOUR_ANON_KEY' }
}).then(r => r.json()).then(console.log);

// Test get clients
fetch('YOUR_SUPABASE_URL/functions/v1/make-server-6023d608/clients', {
  headers: { 'Authorization': 'Bearer YOUR_ANON_KEY' }
}).then(r => r.json()).then(console.log);

// Test get tasks
fetch('YOUR_SUPABASE_URL/functions/v1/make-server-6023d608/tasks', {
  headers: { 'Authorization': 'Bearer YOUR_ANON_KEY' }
}).then(r => r.json()).then(console.log);

// Test get team members
fetch('YOUR_SUPABASE_URL/functions/v1/make-server-6023d608/team', {
  headers: { 'Authorization': 'Bearer YOUR_ANON_KEY' }
}).then(r => r.json()).then(console.log);

// Test get client plans
fetch('YOUR_SUPABASE_URL/functions/v1/make-server-6023d608/plans', {
  headers: { 'Authorization': 'Bearer YOUR_ANON_KEY' }
}).then(r => r.json()).then(console.log);
```

---

## EMAIL INTEGRATION TESTING

### Prerequisites
- Resend API key configured in Supabase Edge Function secrets
- See `RESEND_SETUP.md` for setup instructions

### Test Client Invitation Email
1. **Team View → Clients:**
   - Create new client with your real email
   - Or click "Resend Invitation" on existing client
2. **Check Email:**
   - Subject: "Welcome to CIELO OS - Your Account is Ready"
   - Verify email contains:
     - Welcome message with client name
     - Login credentials (email & password)
     - "Access Your Dashboard" button
     - Dark-themed design matching CIELO OS
3. **Test Login:** (if authentication is implemented)
   - Use credentials from email
   - Verify can access Client View

---

## RESPONSIVE DESIGN TESTING

### Desktop (1920x1080)
- [ ] Verify layout is full-width
- [ ] Check sidebar is fixed
- [ ] Verify all cards are displayed in grid

### Tablet (768x1024)
- [ ] Verify grid collapses to 2 columns
- [ ] Check sidebar remains functional
- [ ] Test all dialogs fit screen

### Mobile (375x667)
- [ ] Verify grid becomes single column
- [ ] Check sidebar converts to drawer/menu
- [ ] Test forms are scrollable
- [ ] Verify buttons are touch-friendly

---

## PERFORMANCE TESTING

### Load Times
- [ ] Initial page load < 3 seconds
- [ ] API requests < 1 second
- [ ] File uploads show progress
- [ ] No layout shift during loading

### Data Handling
- [ ] Test with 50+ tasks
- [ ] Test with 20+ clients
- [ ] Test large file uploads (up to 25MB)
- [ ] Verify search/filter performance

---

## ERROR HANDLING TESTING

### Network Errors
- [ ] Disconnect internet
- [ ] Try to save data
- [ ] Verify error toast appears
- [ ] Reconnect and verify retry works

### Validation Errors
- [ ] Try to create client without email
- [ ] Try to upload document without title
- [ ] Try to create task without description
- [ ] Verify error messages are clear

### Edge Cases
- [ ] Try to delete last client
- [ ] Try to upload 100MB file
- [ ] Try to use invalid email format
- [ ] Try to create duplicate email addresses

---

## ACCESSIBILITY TESTING

### Keyboard Navigation
- [ ] Tab through all forms
- [ ] Press Enter to submit
- [ ] Press Escape to close dialogs
- [ ] Verify focus indicators visible

### Screen Reader
- [ ] Test with screen reader enabled
- [ ] Verify labels are announced
- [ ] Check ARIA attributes
- [ ] Verify image alt text

---

## SECURITY TESTING

### Data Validation
- [ ] Test SQL injection in inputs
- [ ] Test XSS in text fields
- [ ] Verify file type restrictions
- [ ] Check file size limits

### Authentication (if implemented)
- [ ] Verify unauthorized access blocked
- [ ] Test session expiration
- [ ] Verify role-based access control
- [ ] Test password requirements

---

## KNOWN LIMITATIONS

1. **Email Sending:**
   - Requires Resend API key configuration
   - Uses default sender address in development
   - May have rate limits on free tier

2. **File Storage:**
   - Files stored in Supabase Storage (if available)
   - Falls back to metadata-only storage
   - 25MB file size limit

3. **Authentication:**
   - Password sent in plain text in invitation email (demo only)
   - Should implement password reset flow for production
   - Consider OAuth/SSO for production

4. **Real-time Updates:**
   - No websocket connection
   - Requires manual refresh to see updates
   - Consider Supabase Realtime for production

---

## TESTING CHECKLIST SUMMARY

### Client View (10 tests)
- [ ] Hub page functionality
- [ ] AI insights display
- [ ] Brand information CRUD
- [ ] File upload/download
- [ ] Strategy page layout
- [ ] Tasks display
- [ ] Manual tasks from team
- [ ] Service page
- [ ] Archive page
- [ ] New request creation

### Team View (12 tests)
- [ ] Client overview
- [ ] Create new client
- [ ] Edit client profile
- [ ] Resend invitation
- [ ] Upload strategy document
- [ ] Task overview
- [ ] Create manual task
- [ ] Update task status
- [ ] Team member management
- [ ] Permissions display
- [ ] Client plans overview
- [ ] Edit client plan

### Integration (3 tests)
- [ ] Manual task flow (Team → Client)
- [ ] Strategy document flow (Team → Client)
- [ ] Client status updates

### System (5 tests)
- [ ] Backend API endpoints
- [ ] Email integration
- [ ] Responsive design
- [ ] Performance
- [ ] Error handling

---

## REPORTING BUGS

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser console errors
5. Screenshots if applicable
6. Browser and OS version

---

## SUCCESS CRITERIA

All features are considered working if:
- ✅ All CRUD operations succeed
- ✅ Data persists across page refreshes
- ✅ Cross-view integration works
- ✅ Email invitations send (with Resend configured)
- ✅ No console errors during normal usage
- ✅ UI is responsive on all devices
- ✅ Loading states and error messages are clear
