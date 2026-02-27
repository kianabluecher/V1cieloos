# Client Links & Social Media Feature Documentation

## Overview
This feature allows administrators to manage client website URLs, social media profiles, and custom links. These links can be displayed to clients in their portal or kept internal for team reference only.

---

## Architecture

### Data Storage
- **Key Pattern**: `client_links:{clientId}`
- **Storage**: Supabase KV Store
- **Data Structure**:
```typescript
{
  id: string;              // link-1234567890
  clientId: string;        // client-1234567890
  type: 'website' | 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'github' | 'custom';
  label: string;           // "Company Website" or "Facebook Page"
  url: string;             // "https://facebook.com/companypage"
  isPublic: boolean;       // true = show to client, false = internal only
  createdAt: string;       // ISO date string
  updatedAt?: string;      // ISO date string (when edited)
}
```

### API Endpoints
1. **GET** `/clients/:clientId/links` - Fetch all links for a client
2. **POST** `/clients/:clientId/links` - Add a new link
3. **PUT** `/links/:linkId` - Update an existing link
4. **DELETE** `/links/:linkId` - Delete a link

---

## Admin View (Management)

### Location
- **Management View** → **Client Management** → **Select Client** → **Links Tab**

### Features

#### 1. Link Management Interface
```
┌─────────────────────────────────────────────────────────┐
│ Client Links & Social Media                 [+ Add Link]│
├─────────────────────────────────────────────────────────┤
│ Manage client website, social media, and custom links   │
└─────────────────────────────────────────────────────────┘

┌────────────────────────┐  ┌────────────────────────┐
│ 🌐 Company Website     │  │ 📘 Facebook Page       │
│ https://example.com    │  │ facebook.com/company   │
│ Type: Website          │  │ Type: Facebook         │
│                        │  │ [Internal Only Badge]  │
│ [Edit] [Delete]        │  │ [Edit] [Delete]        │
└────────────────────────┘  └────────────────────────┘
```

#### 2. Add Link Dialog
```
┌─────────────────────────────────────────────┐
│ Add Client Link                        [X]  │
├─────────────────────────────────────────────┤
│ Add a website, social media, or custom link │
│                                              │
│ Link Type:                                   │
│ ┌────────────────────────────────────┐      │
│ │ 🌐 Website                     ▼   │      │
│ └────────────────────────────────────┘      │
│                                              │
│ Label (Optional):                            │
│ ┌────────────────────────────────────┐      │
│ │ e.g., Website                      │      │
│ └────────────────────────────────────┘      │
│ Leave empty to use default: "Website"       │
│                                              │
│ URL:                                         │
│ ┌────────────────────────────────────┐      │
│ │ https://example.com                │      │
│ └────────────────────────────────────┘      │
│                                              │
│ ☑ Show to client (uncheck for internal)     │
│                                              │
│ [Cancel]              [Add Link]            │
└─────────────────────────────────────────────┘
```

#### 3. Supported Link Types
| Type | Icon | Color | Default Label | Example URL |
|------|------|-------|---------------|-------------|
| Website | 🌐 | Blue | Website | https://example.com |
| Facebook | 📘 | Blue | Facebook | https://facebook.com/yourpage |
| Twitter | 🐦 | Sky Blue | Twitter/X | https://twitter.com/yourusername |
| Instagram | 📷 | Pink | Instagram | https://instagram.com/yourusername |
| LinkedIn | 💼 | Dark Blue | LinkedIn | https://linkedin.com/company/yourcompany |
| YouTube | ▶️ | Red | YouTube | https://youtube.com/@yourchannel |
| GitHub | 🔗 | Gray | GitHub | https://github.com/yourusername |
| Custom | 🔗 | Cyan | Custom Link | https://any-url.com |

#### 4. Visibility Control
- **Public Links** (isPublic: true): Displayed to clients in their portal
- **Internal Links** (isPublic: false): Only visible to team members, marked with "Internal Only" badge

---

## Client View (Portal Display)

### Location
- **Client View** → **Hub Dashboard** (Top Section) or **Service Page** (Quick Links Section)

### Display Style - Minimalist SaaS

```
┌─────────────────────────────────────────────────────────┐
│ Quick Links                                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│ │ 🌐 Website   │  │ 📘 Facebook  │  │ 🐦 Twitter   │  │
│ │              │  │              │  │              │  │
│ │ example.com  │  │ /yourpage    │  │ @company     │  │
│ └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│ ┌──────────────┐  ┌──────────────┐                     │
│ │ 💼 LinkedIn  │  │ 📷 Instagram │                     │
│ │              │  │              │                     │
│ │ /company/... │  │ @yourhandle  │                     │
│ └──────────────┘  └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

### Visual Design Specifications

#### Card Style
- **Background**: `bg-background` with `border-border-subtle`
- **Hover State**: 
  - Border changes to `border-cyan-accent/50`
  - Shadow: `hover:shadow-lg`
  - Icon background: `hover:bg-cyan-accent/10`
  - Label color: `hover:text-cyan-accent`
  - External link icon fades in: `opacity-0 group-hover:opacity-100`

#### Layout
- **Grid**: 2-3 columns on desktop (`md:grid-cols-2 lg:grid-cols-3`)
- **Spacing**: `gap-3` between cards
- **Card Padding**: `p-4`
- **Icon Container**: 
  - Size: `p-2` with `rounded-lg`
  - Background: `bg-muted`
  - Icon size: `h-5 w-5`

#### Typography
- **Label**: `text-sm font-medium text-foreground`
- **URL**: `text-xs text-text-secondary truncate`
- **External Link Icon**: `h-3 w-3` positioned next to label

#### Interaction
- **Clickable**: Entire card is clickable
- **Target**: Opens in new tab (`target="_blank"`)
- **Security**: Includes `rel="noopener noreferrer"`
- **Accessibility**: Proper ARIA labels and keyboard navigation

---

## Implementation Guide

### 1. Add to Client Management Page (Admin View)

```tsx
import { ClientLinksManager } from "../components/ClientLinksManager";

// Inside ClientDetailView or Client Management Page
<TabsContent value="links">
  <ClientLinksManager 
    clientId={selectedClient.id} 
    viewMode="admin" 
  />
</TabsContent>
```

### 2. Add to Client Dashboard (Client View)

```tsx
import { ClientLinksManager } from "../components/ClientLinksManager";

// Inside Client Hub/Dashboard Page
<div className="space-y-6">
  {/* Other dashboard widgets */}
  
  <ClientLinksManager 
    clientId={currentUser.id} 
    viewMode="client" 
  />
</div>
```

### 3. Add to Service Page (Optional)

```tsx
// Service Page - Bottom section for quick access
<Card className="p-6">
  <ClientLinksManager 
    clientId={currentUser.id} 
    viewMode="client" 
  />
</Card>
```

---

## Usage Examples

### Example 1: E-Commerce Client
```javascript
{
  type: 'website',
  label: 'Main Store',
  url: 'https://myshop.com',
  isPublic: true
},
{
  type: 'instagram',
  label: 'Instagram Shop',
  url: 'https://instagram.com/myshop',
  isPublic: true
},
{
  type: 'facebook',
  label: 'Facebook Page',
  url: 'https://facebook.com/myshoppage',
  isPublic: true
},
{
  type: 'custom',
  label: 'Admin Panel',
  url: 'https://admin.myshop.com',
  isPublic: false  // Internal only for team
}
```

### Example 2: SaaS Company
```javascript
{
  type: 'website',
  label: 'Product Site',
  url: 'https://ourproduct.io',
  isPublic: true
},
{
  type: 'linkedin',
  label: 'Company LinkedIn',
  url: 'https://linkedin.com/company/ourproduct',
  isPublic: true
},
{
  type: 'github',
  label: 'Open Source Repo',
  url: 'https://github.com/ourproduct/main',
  isPublic: true
},
{
  type: 'custom',
  label: 'Analytics Dashboard',
  url: 'https://analytics.ourproduct.io',
  isPublic: false  // Internal team access only
}
```

---

## Client View Display Examples

### Example 1: Hub Dashboard (Top Widget)
Perfect for giving clients quick access to their digital properties right when they log in.

```tsx
// ClientDashboard.tsx or HubPage.tsx
export function ClientDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Links - First Thing Clients See */}
      <ClientLinksManager 
        clientId={user.id} 
        viewMode="client" 
      />
      
      {/* Rest of dashboard */}
      <ProjectOverview />
      <RecentActivity />
    </div>
  );
}
```

**Visual Result**:
```
┌─────────────────────────────────────────────┐
│ Welcome back, John! 👋                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Quick Links                                 │
├─────────────────────────────────────────────┤
│ [Website Card] [Facebook Card] [Twitter]    │
│ [LinkedIn] [Instagram]                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Active Projects                             │
│ ...                                         │
```

### Example 2: Service Page (Resources Section)
Ideal for the service/account page where clients manage their subscription and access resources.

```tsx
// ServicePage.tsx
export function ServicePage() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="p-6">
        <h3>Your Plan</h3>
        {/* Plan details */}
      </Card>
      
      {/* Quick Links Section */}
      <Card className="p-6">
        <ClientLinksManager 
          clientId={user.id} 
          viewMode="client" 
        />
      </Card>
      
      {/* Support Section */}
      <Card className="p-6">
        <h3>Support</h3>
        {/* Support details */}
      </Card>
    </div>
  );
}
```

**Visual Result**:
```
┌─────────────────────────────────────────────┐
│ Your Plan: Professional                     │
│ $299/month • Renews Feb 1, 2024            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Quick Links                                 │
│ Access your digital properties              │
├─────────────────────────────────────────────┤
│ [Website] [Social Media Links]              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Support & Contact                           │
│ ...                                         │
```

### Example 3: Dedicated Links Section (Optional Page)
For clients with many digital properties, you could create a dedicated page.

```tsx
// ClientLinksPage.tsx
export function ClientLinksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-foreground mb-1">
          Your Digital Properties
        </h2>
        <p className="text-text-secondary">
          Quick access to all your websites and social media accounts
        </p>
      </div>
      
      <ClientLinksManager 
        clientId={user.id} 
        viewMode="client" 
      />
    </div>
  );
}
```

---

## Best Practices

### For Administrators

1. **Organize by Priority**
   - Add most important links first (usually website, then primary social)
   - Clients see them in the order you add them

2. **Use Clear Labels**
   - "Main Website" instead of just "Website"
   - "Support Portal" instead of "Custom Link"
   - "Instagram Shop" instead of just "Instagram"

3. **Visibility Strategy**
   - Set `isPublic: true` for links clients should access
   - Set `isPublic: false` for internal tracking (admin panels, analytics, etc.)

4. **URL Validation**
   - Always use full URLs with `https://`
   - Test links after adding them
   - Keep URLs up-to-date when clients change platforms

5. **Regular Maintenance**
   - Review links quarterly
   - Remove outdated or inactive social profiles
   - Update URLs when clients rebrand

### For Implementation

1. **Theme Support**
   - Component fully supports light/dark mode
   - Uses semantic tokens (`text-foreground`, `bg-background`, etc.)
   - Hover states work in both themes

2. **Responsive Design**
   - Automatically adjusts columns based on screen size
   - Mobile: 1 column
   - Tablet: 2 columns
   - Desktop: 3 columns

3. **Performance**
   - Links load from KV store (fast)
   - No external API calls on display
   - Only public links fetched for client view

4. **Accessibility**
   - Keyboard navigable
   - Screen reader friendly
   - Clear focus states
   - External link indication

---

## Troubleshooting

### Links Not Showing for Client

**Check:**
1. Is `isPublic` set to `true`?
2. Is the correct `clientId` being passed?
3. Are there any links added for this client?

**Solution:**
```typescript
// Verify in browser console
console.log('Client ID:', clientId);
console.log('Links:', await api.getClientLinks(clientId));
```

### Edit Not Working

**Check:**
1. Is the link ID correct?
2. Are you in admin view mode?
3. Check browser console for errors

**Solution:**
```typescript
// The update function needs the full link object
handleUpdateLink(linkId, {
  label: "New Label",
  url: "https://new-url.com",
  isPublic: true
});
```

### Icons Not Displaying

**Check:**
1. Are Lucide React icons installed?
2. Is the link type spelled correctly?

**Solution:**
```bash
# Ensure icons are available
npm install lucide-react
```

---

## Future Enhancements

### Potential Features
1. **Link Analytics**: Track click-through rates
2. **QR Codes**: Generate QR codes for each link
3. **Link Grouping**: Organize into categories (Social, Tools, Resources)
4. **Custom Icons**: Allow upload of custom favicons
5. **Link Validation**: Auto-check if URLs are still valid
6. **Bulk Import**: CSV import for multiple links
7. **Shortened URLs**: Integration with URL shorteners
8. **Link Templates**: Pre-configured link sets by industry

---

## Summary

The Client Links feature provides a clean, professional way to:
- ✅ Store and organize client digital properties
- ✅ Give clients quick access to their websites and social media
- ✅ Maintain internal-only links for team reference
- ✅ Present a modern, minimalist SaaS interface
- ✅ Support full light/dark mode themes
- ✅ Ensure responsive design across all devices

**Admin Experience**: Full CRUD management with visibility control
**Client Experience**: Clean, clickable cards with hover effects and external link indicators
