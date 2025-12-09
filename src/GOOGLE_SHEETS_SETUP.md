# 🔧 Google Sheets CRM Integration Setup

## Current Issue

You're seeing this error:
```
Unable to parse range: Sheet1
```

This means the Google Sheet either:
1. ❌ Doesn't have a tab named "Sheet1" 
2. ❌ Isn't publicly accessible
3. ❌ Has a different sheet name

---

## ✅ Quick Fix - Option 1: Rename Your Sheet Tab

The easiest fix is to **rename your Google Sheet tab** to match what the code expects:

1. **Open your Google Sheet**:
   - https://docs.google.com/spreadsheets/d/1G6bNfJs_uA57RU4HOknlWy_KxXvKYvM9i48Ftat90w0/edit

2. **Look at the bottom tabs** - you probably have a tab named something like:
   - "CRM Data" ✅ (this is what I set as the new default)
   - "Customers"
   - "Clients"
   - Or something else

3. **Rename it**:
   - Right-click the tab → **Rename**
   - Change it to: **`CRM Data`**

4. **Make it public**:
   - Click **Share** button (top right)
   - Click "Anyone with the link"
   - Set to **Viewer**
   - Click **Done**

5. **Test**: Go back to your app and click **"Sync Now"**

---

## ✅ Option 2: Configure via Environment Variables

If you want to use a **different sheet name or spreadsheet**, set these in Supabase:

### Step 1: Go to Supabase Edge Function Secrets
```
https://supabase.com/dashboard/project/ykinptyiytyenumlowaa/settings/functions
```

### Step 2: Add These Secrets

| Secret Name | Value | Example |
|-------------|-------|---------|
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Your spreadsheet ID | `1G6bNfJs_uA57RU4HOknlWy_KxXvKYvM9i48Ftat90w0` |
| `GOOGLE_SHEETS_SHEET_NAME` | Your sheet tab name | `Customers` or `CRM Data` |

**How to get the Spreadsheet ID:**

From this URL:
```
https://docs.google.com/spreadsheets/d/1G6bNfJs_uA57RU4HOknlWy_KxXvKYvM9i48Ftat90w0/edit
                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                      This is your Spreadsheet ID
```

**Sheet Name:**
- Look at the **bottom tabs** of your Google Sheet
- Use the **exact name** (case-sensitive!)

---

## 📊 Expected Google Sheet Format

Your sheet should look like this:

| Name | Email | Company | Status | Phone | Revenue | Last Contact |
|------|-------|---------|--------|-------|---------|--------------|
| John Doe | john@example.com | Acme Corp | Active | 555-0100 | $50,000 | 2024-01-15 |
| Jane Smith | jane@example.com | Tech Inc | Active | 555-0101 | $75,000 | 2024-01-16 |

**Important:**
- ✅ First row = Column headers
- ✅ Data starts from row 2
- ✅ Headers can be anything (they'll show in the CRM table)
- ✅ The app will auto-detect columns

---

## 🔐 Permissions Check

Make sure your Google Sheet is accessible:

### Option A: Public Access (Easiest for Testing)
1. Open your Google Sheet
2. Click **Share** → "Anyone with the link"
3. Set permission to **Viewer**

### Option B: Service Account (Production)
If you want private sheets:
1. Create a Google Cloud service account
2. Download the JSON key
3. Share the sheet with the service account email
4. Update your API key to use OAuth instead of API key

---

## 🧪 Test the Connection

After fixing the configuration:

1. **Open your app** → Go to **CRM** page
2. **Click "Sync Now"**
3. **Check console** for logs:
   ```
   Spreadsheet ID: 1G6bNfJs_uA57RU4HOknlWy_KxXvKYvM9i48Ftat90w0
   Sheet Name: CRM Data
   Calling Google Sheets API...
   ✓ Successfully fetched data from Google Sheets
   ```

4. **Success!** Your data should load 🎉

---

## 🆘 Still Not Working?

### Error: "Unable to parse range"
- ✅ Sheet name must **exactly match** (case-sensitive)
- ✅ Try renaming the tab to `CRM Data`

### Error: "Access denied" (403)
- ✅ Make sheet publicly accessible (Share → Anyone with link)

### Error: "Spreadsheet not found" (404)
- ✅ Check the spreadsheet ID is correct
- ✅ Make sure you're not using the old URL

### No Data Showing
- ✅ Make sure row 1 has headers
- ✅ Make sure row 2+ has data
- ✅ Check console for error messages

---

## 🎯 Current Configuration

**Default Settings** (if you don't set environment variables):

```
Spreadsheet ID: 1G6bNfJs_uA57RU4HOknlWy_KxXvKYvM9i48Ftat90w0
Sheet Name: CRM Data
```

**Your Google Sheet URL:**
```
https://docs.google.com/spreadsheets/d/1G6bNfJs_uA57RU4HOknlWy_KxXvKYvM9i48Ftat90w0/edit
```

---

## ✨ What Changed

I updated the server code to:
1. ✅ Changed default sheet name from `Sheet1` → `CRM Data`
2. ✅ Added environment variable support for custom configuration
3. ✅ Added better error messages that tell you exactly what's wrong
4. ✅ Added URL encoding for sheet names with spaces
5. ✅ Added configuration hints in error responses

**Next Steps:**
1. Either rename your sheet tab to "CRM Data"
2. OR set `GOOGLE_SHEETS_SHEET_NAME` environment variable
3. Make sure the sheet is publicly accessible
4. Click "Sync Now" in your app

That's it! 🚀
