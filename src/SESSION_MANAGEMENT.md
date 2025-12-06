# Session Management Guide

## Overview
CIELO OS now features automatic session persistence that removes the need for repeated authentication, especially for management users.

## How It Works

### 1. **Automatic Session Saving**
When a user logs in, their session is automatically saved to `localStorage`:
- User information (name, email, role, type)
- View mode (client/team/management)
- Active navigation state
- Timestamp

### 2. **Session Restoration**
On page load/refresh, the system automatically:
- Checks for an existing session
- Restores user state if valid session exists
- Logs user back in without requiring credentials

### 3. **Management Access**
For management users specifically:
- **First Login**: Enter credentials once (admin@cielo.marketing / admincielo765598)
- **Management Section**: First access requires password "os765" to unlock features
- **Auto-Unlock**: Once unlocked, the management section stays unlocked for the duration of the session
- **No Re-authentication**: Browser refresh or navigation won't require re-login

### 4. **Logout**
Clicking "Logout" from the profile menu:
- Clears all session data
- Removes localStorage entries
- Returns user to login screen

## User Experience Flow

### Management User
1. Login once with credentials
2. Navigate to management section
3. Enter unlock password "os765" (if first time)
4. Access all management features without interruption
5. Session persists across refreshes and navigation

### Team/Client Users
1. Login once with credentials
2. Full access to respective sections
3. Session persists across refreshes and navigation

## Session Data Structure

```json
{
  "user": {
    "name": "Admin User",
    "email": "admin@cielo.marketing",
    "companyName": "",
    "role": "Administrator",
    "userType": "management"
  },
  "viewMode": "management",
  "activeNav": "overview",
  "managementUnlocked": true,
  "timestamp": "2025-11-03T..."
}
```

## Security Notes

- Sessions are stored in browser localStorage (client-side only)
- Logging out clears all session data
- Management unlock status is tied to session
- Each browser/device maintains separate sessions

## Demo Credentials

**Client View:**
- Email: sarah@client.com
- Password: client123

**Team View:**
- Email: john@cielo.marketing
- Password: team123

**Management View:**
- Email: admin@cielo.marketing
- Password: admincielo765598
- Management Unlock: os765

## Benefits

✅ No repeated password entry  
✅ Seamless navigation experience  
✅ Management features unlocked once per session  
✅ Automatic session restoration  
✅ Improved workflow efficiency  

## Implementation Details

### Files Modified:
- `/App.tsx` - Session save/restore logic
- `/components/pages/ManagementPage.tsx` - Auto-unlock functionality
- `/components/LoginPage.tsx` - Session persistence notice

### Key Functions:
- `checkSavedSession()` - Restores session on mount
- `handleLogin()` - Saves session after successful login
- `handleLogout()` - Clears session data
- `checkManagementSession()` - Auto-unlocks management features
