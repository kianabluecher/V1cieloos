# CIELO OS Quick Start Guide

Welcome to CIELO OS! This guide will help you get started quickly.

---

## 🚀 First Time Setup (5 minutes)

### Step 1: Initialize Demo Data
1. Open the application
2. Look for the **"Seed Data"** button at the bottom of the Hub page
3. Click it and wait for the success message
4. This creates:
   - 1 demo client (Sarah Johnson)
   - 3 demo tasks
   - 3 demo files
   - 2 demo team members
   - 1 client plan
   - AI insights

### Step 2: Set Up Email (Optional)
If you want to send invitation emails:
1. Sign up at [resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Get your API key
3. Go to Supabase → Edge Functions → Manage secrets
4. Add secret: `RESEND_API_KEY` with your key
5. See `RESEND_SETUP.md` for detailed instructions

---

## 👥 Two Views Explained

### Client View (For Clients)
**What clients see and do:**
- View AI-generated insights about their brand
- Upload files and documents
- Create design requests
- Track task progress
- View strategy documents from team
- Access meeting notes and archives

**Navigation:**
- Hub
- Strategy
- Design Requests & Tracking
- Service
- Data Archive

### Team View (For Agency Staff)
**What team members see and do:**
- Manage all clients
- Create and assign manual tasks
- Upload strategy documents for clients
- Manage team members and permissions
- Handle billing and client plans

**Navigation:**
- Clients
- Tasks & Inquiries
- Management

**How to switch:**
Click the "Client View" or "Team View" button in the sidebar.

---

## 📋 Common Workflows

### As a Client

#### Creating a Design Request
1. Go to **Hub** page
2. Click **"New Request"** button
3. Fill in:
   - Title (e.g., "Website Redesign")
   - Description
   - Type (Landing Page, Ad Creative, etc.)
   - Priority
4. Submit
5. Track progress in **Design Requests & Tracking** page

#### Viewing Strategy Documents
1. Go to **Strategy** page
2. Check right panel: "Strategy Documents"
3. Click to download or view documents uploaded by team

#### Updating Brand Information
1. Go to **Hub** page
2. Scroll to "Brand Information" section
3. Edit fields
4. Click "Save Changes"

---

### As a Team Member

#### Creating a New Client
1. Switch to **Team View**
2. Go to **Clients** section
3. Click **"Create New Client"**
4. Fill in:
   - Name: Client's full name
   - Email: Client's email (will receive invitation)
   - Password: Temporary password for client
   - Company: Company name (optional)
5. Click **"Create & Send Invitation"**
6. Client receives branded email with login credentials
7. **Note:** If email fails, check that Resend is configured

#### Creating a Manual Task for Client
1. Switch to **Team View**
2. Go to **Tasks & Inquiries**
3. Select client from dropdown
4. Click **"Create Manual Task"**
5. Fill in:
   - Title (e.g., "Review Q4 Strategy")
   - Description
   - Priority (Low/Medium/High)
   - Due Date
6. Click **"Create Task"**
7. **Important:** Task will appear in client's view immediately

#### Uploading Strategy Document for Client
1. Switch to **Team View**
2. Go to **Clients** section
3. Click on a client row to select them
4. Scroll to "Strategy Documents & Assets"
5. Click **"Upload Document"**
6. Fill in:
   - Title
   - Type (PDF, Link, or Document)
   - Category (Strategy, Report, Analysis)
   - Description
   - File (if PDF/Document) or URL (if Link)
7. Click **"Upload"**
8. Client sees it in their Strategy page

#### Inviting Team Members
1. Switch to **Team View**
2. Go to **Management** section
3. Click **"Team Members"** tab
4. Click **"Invite Team Member"**
5. Fill in:
   - Name
   - Email
   - Role (Admin/Manager/Designer/Strategist)
   - Permissions (check relevant boxes)
6. Click **"Send Invitation"**

#### Managing Client Billing
1. Switch to **Team View**
2. Go to **Management** section
3. Click **"Plans & Billing"** tab
4. Click edit icon on a client plan
5. Update:
   - Plan tier (Starter/Professional/Enterprise)
   - Billing cycle (Monthly/Annual)
   - Amount
   - Status (Active/Trial/Cancelled)
6. Click **"Update Plan"**

---

## 🔍 Quick Tips

### Navigation
- **Switch Views:** Use buttons in sidebar (Client View / Team View)
- **Breadcrumbs:** Top bar shows current location
- **Search:** Most lists have search bars for filtering

### Status Colors
- 🟢 **Green:** Completed/Active
- 🔵 **Cyan:** In Progress/Running
- 🟣 **Violet:** In Review/Waiting
- 🟠 **Orange:** Pending
- ⚪ **Gray:** To Do/Queued/Inactive

### Priority Colors
- 🔴 **Red:** High priority
- 🟠 **Orange:** Medium priority
- 🔵 **Blue:** Low priority

### Keyboard Shortcuts
- **Esc:** Close any dialog
- **Tab:** Navigate form fields
- **Enter:** Submit forms (in most dialogs)

---

## 🐛 Troubleshooting

### "Failed to connect to backend services"
**Solution:**
1. Check browser console for errors
2. Verify Supabase project is active
3. Check Edge Functions are deployed
4. Verify API keys in `/utils/supabase/info.tsx`

### Email invitations not sending
**Solution:**
1. Check if `RESEND_API_KEY` is set in Supabase secrets
2. Verify API key is valid in Resend dashboard
3. Check Edge Function logs for errors
4. Ensure email address is valid
5. See `RESEND_SETUP.md` for detailed setup

### Data not saving
**Solution:**
1. Check browser console for errors
2. Verify network requests in DevTools
3. Check Edge Function logs
4. Try refreshing the page
5. Clear browser cache

### Tasks not appearing in client view
**Solution:**
1. Verify task was created with correct client ID
2. Refresh the page
3. Check browser console for errors
4. Verify client is logged in (if auth is enabled)

### File upload failing
**Solution:**
1. Check file size (must be < 25MB)
2. Verify file type is allowed
3. Check Supabase Storage is configured
4. Review Edge Function logs
5. Try with a smaller file first

---

## 📊 Dashboard Overview

### Client Dashboard (Hub)
- **AI Insights:** 3 cards showing brand analysis
- **Quick Stats:** Open tasks and next meeting
- **Upload Button:** Top-right corner
- **Brand Info:** Editable form below
- **Strategy Preview:** Sample reports
- **File Upload:** Drag-and-drop zone

### Team Dashboard (Clients)
- **Overview Cards:** Active, Pending, Total clients
- **Client Table:** All client information
- **Actions:** Edit, Send invitation
- **Documents Section:** Upload materials for clients

### Team Dashboard (Tasks & Inquiries)
- **Task Stats:** To Do, In Progress, Review, Completed
- **Client Selector:** Choose which client's tasks to view
- **Create Task:** Button to add manual tasks
- **Task Cards:** Status, priority, description

### Team Dashboard (Management)
- **Team Tab:** Add/remove team members
- **Permissions Tab:** Role-based access control
- **Billing Tab:** Client plans and revenue

---

## 🎨 UI Features

### Glass Effect Cards
- Translucent backgrounds with subtle borders
- Smooth hover animations
- Glow effects on interactive elements

### Dark Theme
- Background: Pure black (#0A0A0A)
- Accent: Bright cyan (#A6E0FF)
- Card: Dark gray (#1A1A1A)
- Text: White for primary, gray for secondary

### Responsive Design
- Desktop: Full sidebar, multi-column grids
- Tablet: 2-column grids, collapsible sidebar
- Mobile: Single column, drawer navigation

---

## 📚 Next Steps

### For Clients
1. ✅ Update your brand information
2. ✅ Upload relevant files (brand assets, documents)
3. ✅ Create your first design request
4. ✅ Review strategy documents from team
5. ✅ Check task progress regularly

### For Team Members
1. ✅ Create your first client
2. ✅ Upload a strategy document
3. ✅ Create a manual task for client
4. ✅ Invite team members
5. ✅ Set up client billing plans
6. ✅ Configure Resend for emails (optional)

### For Administrators
1. ✅ Review all features in both views
2. ✅ Set up Resend API key
3. ✅ Invite your team members
4. ✅ Configure client plans
5. ✅ Test email invitations
6. ✅ Review security considerations (see IMPLEMENTATION_SUMMARY.md)
7. ✅ Plan production deployment

---

## 📖 Additional Resources

- **RESEND_SETUP.md** - Email configuration guide
- **TESTING_GUIDE.md** - Comprehensive testing procedures
- **IMPLEMENTATION_SUMMARY.md** - Full technical documentation
- **CIELO_OS_Style_Guide.md** - Design system reference

---

## 💡 Pro Tips

1. **Use Seed Data:** Always initialize demo data first to test features
2. **Check Logs:** Browser console and Supabase logs are your friends
3. **Test Both Views:** Switch between Client and Team views to see integration
4. **Manual Tasks:** Great for custom requests that don't fit standard design types
5. **Document Everything:** Add descriptions to tasks and documents for clarity
6. **Permissions:** Assign appropriate roles when inviting team members
7. **Regular Updates:** Keep task statuses current for better tracking

---

## 🎯 Success Metrics

You'll know the system is working when:
- ✅ Demo data loads successfully
- ✅ You can create and edit clients
- ✅ Tasks appear in both views
- ✅ Documents upload and download
- ✅ Email invitations send (if Resend configured)
- ✅ No console errors during normal use
- ✅ Data persists across page refreshes

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Documentation:**
   - Start with this guide
   - Review TESTING_GUIDE.md for specific scenarios
   - See RESEND_SETUP.md for email issues

2. **Debug Steps:**
   - Open browser console (F12)
   - Check for error messages
   - Review network requests
   - Check Supabase Edge Function logs

3. **Common Solutions:**
   - Refresh the page
   - Clear browser cache
   - Re-seed demo data
   - Verify API configuration
   - Check internet connection

---

## 🚦 Quick Status Check

Run through this checklist:

**Backend:**
- [ ] Supabase project active
- [ ] Edge Functions deployed
- [ ] Demo data seeded
- [ ] API responding (check console)

**Frontend:**
- [ ] Application loads
- [ ] Can switch between views
- [ ] Forms submit successfully
- [ ] Data displays correctly

**Integration:**
- [ ] Tasks sync between views
- [ ] Documents appear in both views
- [ ] Client status updates work
- [ ] Email invitations send (optional)

**All Green?** You're ready to use CIELO OS! 🎉

---

**Need more help?** Check the comprehensive guides in the repository or review browser/server logs for specific error messages.

Happy building with CIELO OS! 🚀
