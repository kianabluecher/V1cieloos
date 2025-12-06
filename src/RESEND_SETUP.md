# Resend Email Integration Setup

## Overview
CIELO OS uses Resend to send client invitation emails when new clients are created or when you resend invitations.

## Setup Instructions

### 1. Create a Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key
1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "CIELO OS Production")
5. Copy the API key (it starts with `re_`)

### 3. Add API Key to Supabase
1. Open your Supabase project dashboard
2. Go to **Edge Functions** → **Manage secrets**
3. Add a new secret:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (starts with `re_`)
4. Click **Save**

### 4. Configure Sending Domain (Optional but Recommended)

#### For Development/Testing:
- You can use the default `onboarding@resend.dev` email address
- This works immediately but may have limitations

#### For Production:
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the DNS setup instructions to verify your domain
5. Once verified, update the email sender in `/supabase/functions/server/index.tsx`:
   ```typescript
   from: 'CIELO OS <noreply@yourdomain.com>',
   ```

## Testing the Integration

### 1. Create a Test Client
1. Switch to "Team View" in CIELO OS
2. Go to "Clients" section
3. Click "Create New Client"
4. Fill in the form:
   - Client Name: Test User
   - Email: your-email@example.com (use your real email for testing)
   - Password: testpass123
5. Click "Create & Send Invitation"

### 2. Check the Results
- You should see a success message if the email was sent
- Check your inbox for the invitation email
- The email includes:
  - Welcome message
  - Login credentials
  - Link to access the dashboard
  - Next steps

### 3. Troubleshooting
If emails aren't sending:

1. **Check API Key**: Verify `RESEND_API_KEY` is set correctly in Supabase secrets
2. **Check Logs**: View Edge Function logs in Supabase for error messages
3. **Verify Email**: Make sure the recipient email is valid
4. **Domain Verification**: If using custom domain, ensure DNS records are configured
5. **Rate Limits**: Free tier has limits - check your Resend dashboard

## Email Features

### What Gets Sent
When a client is created or invitation is resent, they receive:
- **Subject**: "Welcome to CIELO OS - Your Account is Ready"
- **Content**:
  - Welcome message with client name
  - Login credentials (email & password)
  - Call-to-action button to access dashboard
  - Next steps checklist
  - Dark-themed branded design matching CIELO OS

### Security Notes
⚠️ **Important**: 
- Passwords are currently sent in plain text for demo purposes
- In production, consider using:
  - Password reset links instead of sending passwords
  - Temporary passwords that must be changed on first login
  - OAuth/SSO integration
  - Proper password hashing (bcrypt, argon2)

## API Endpoints Used

- `POST /make-server-6023d608/clients` - Creates new client
- `POST /make-server-6023d608/clients/:id/invite` - Sends invitation email
- Resend API: `POST https://api.resend.com/emails`

## Cost & Limits

### Resend Free Tier:
- 3,000 emails/month
- 100 emails/day
- All email features included

### Resend Pro:
- 50,000 emails/month
- Higher daily limits
- Custom domains
- Priority support

## Support

- Resend Docs: [resend.com/docs](https://resend.com/docs)
- Resend Support: support@resend.com
- CIELO OS: Check server logs in Supabase Edge Functions

## Example Email Preview

The invitation email includes:
- Branded header with CIELO OS logo
- Personalized greeting
- Secure credentials box
- Prominent "Access Your Dashboard" button
- What's Next section with helpful tips
- Professional dark-themed design (#0A0A0A background, #A6E0FF accents)
