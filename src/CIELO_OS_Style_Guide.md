# CIELO OS Design System & Style Guide

## 🎨 Color Palette

### Primary Colors
```css
/* Main Brand Colors */
--cyan-accent: #A6E0FF        /* Primary accent - used for active states, CTAs, highlights */
--dark-bg: #0A0A0A           /* Primary background - pure black */
--card-bg: #111111           /* Card backgrounds - slightly lighter than main bg */

/* Legacy Brand Colors */
--electric-blue: #007BFF      /* Secondary blue accent */
--teal: #20C997              /* Success/positive states */
--violet: #6F42C1            /* Purple accent for variety */
--midnight: #0B0D17          /* Alternative dark background */
--dark-navy: #1A1D29         /* Alternative card background */
```

### Text Colors
```css
--text-primary: #ffffff       /* Primary text - white for high contrast */
--text-secondary: #888888     /* Secondary text - medium gray */
--text-inactive: #666666      /* Inactive/disabled text - darker gray */
--muted-foreground: #888888   /* Muted text elements */
```

### Border & UI Colors
```css
--border: #333333            /* Primary borders */
--border-subtle: #333333     /* Subtle borders for cards */
--input: #1A1A1A            /* Input backgrounds */
--ring: #A6E0FF             /* Focus rings - matches cyan accent */
```

### Semantic Colors
```css
--destructive: #FF6B6B       /* Error/danger states */
--chart-1: #A6E0FF          /* Chart color 1 - cyan */
--chart-2: #20C997          /* Chart color 2 - teal */
--chart-3: #6F42C1          /* Chart color 3 - violet */
--chart-4: #FF6B6B          /* Chart color 4 - red */
--chart-5: #FFD93D          /* Chart color 5 - yellow */
```

## 📏 Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Font Sizes & Weights
```css
--font-size: 14px           /* Base font size */
--font-weight-medium: 500   /* Medium weight for headings, buttons, labels */
--font-weight-normal: 400   /* Normal weight for body text */
```

### Typography Scale
```css
/* Headings */
h1: font-size: var(--text-2xl), font-weight: 500, line-height: 1.4, letter-spacing: -0.025em
h2: font-size: var(--text-xl), font-weight: 500, line-height: 1.4, letter-spacing: -0.025em  
h3: font-size: var(--text-lg), font-weight: 500, line-height: 1.4, letter-spacing: -0.025em
h4: font-size: var(--text-base), font-weight: 500, line-height: 1.4, letter-spacing: -0.025em

/* Body Text */
p: font-size: var(--text-base), font-weight: 400, line-height: 1.5

/* Interactive Elements */
button: font-size: var(--text-base), font-weight: 500, line-height: 1.4, letter-spacing: -0.025em
label: font-size: var(--text-base), font-weight: 500, line-height: 1.4, letter-spacing: -0.025em
input: font-size: var(--text-base), font-weight: 400, line-height: 1.4
```

## 📐 Spacing & Layout

### Border Radius
```css
--radius: 0.625rem          /* Base radius (10px) */
--radius-sm: 6px            /* Small radius */
--radius-md: 8px            /* Medium radius */
--radius-lg: 10px           /* Large radius */
--radius-xl: 14px           /* Extra large radius */
```

### Common Spacing Patterns
```css
/* Common spacing values used throughout */
gap-2: 8px
gap-3: 12px  
gap-4: 16px
gap-6: 24px

p-3: 12px
p-4: 16px
p-6: 24px

space-y-3: 12px vertical spacing
space-y-4: 16px vertical spacing
space-y-6: 24px vertical spacing
```

### Layout Patterns
```css
/* Sidebar Layout */
.sidebar-width: w-64 (256px)
.main-content: flex-1

/* Grid Patterns */
.metrics-grid: grid-cols-1 md:grid-cols-4
.card-grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

## ✨ Visual Effects

### Glow Effects
```css
/* Cyan Glow Variants */
.glow-cyan {
  box-shadow: 0 0 20px rgba(166, 224, 255, 0.4);
}

.glow-cyan-soft {
  box-shadow: 0 0 12px rgba(166, 224, 255, 0.2);
}

.glow-cyan-intense {
  box-shadow: 0 0 30px rgba(166, 224, 255, 0.6);
}

/* Color-specific Glows */
.glow-blue { box-shadow: 0 0 20px rgba(166, 224, 255, 0.3); }
.glow-teal { box-shadow: 0 0 20px rgba(32, 201, 151, 0.3); }
.glow-violet { box-shadow: 0 0 20px rgba(111, 66, 193, 0.3); }

/* Card Glow */
.card-glow {
  box-shadow: 0 4px 20px rgba(166, 224, 255, 0.1);
}
```

### Border Effects
```css
/* Border Glow */
.border-glow {
  border: 1px solid rgba(166, 224, 255, 0.3);
  box-shadow: 0 0 8px rgba(166, 224, 255, 0.2);
}

.border-glow-active {
  border: 1px solid rgba(166, 224, 255, 0.6);
  box-shadow: 0 0 12px rgba(166, 224, 255, 0.3);
}

/* Cyber Borders */
.cyber-border {
  border: 1px solid transparent;
  background: linear-gradient(145deg, #0A0A0A, #111111) padding-box,
              linear-gradient(145deg, rgba(166, 224, 255, 0.2), rgba(166, 224, 255, 0.05)) border-box;
  border-radius: 8px;
}

.cyber-border-active {
  border: 1px solid transparent;
  background: linear-gradient(145deg, #0A0A0A, #111111) padding-box,
              linear-gradient(145deg, rgba(166, 224, 255, 0.6), rgba(166, 224, 255, 0.2)) border-box;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(166, 224, 255, 0.3);
}
```

### Glass Morphism Effects
```css
/* Glass Variants */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-card {
  background: rgba(17, 17, 17, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(166, 224, 255, 0.1);
}

.glass-white {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-frosted {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 24px rgba(255, 255, 255, 0.1), 
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
```

### Backdrop Blur Utilities
```css
.backdrop-blur-xs { backdrop-filter: blur(2px); }
.backdrop-blur-light { backdrop-filter: blur(8px); }
.backdrop-blur-heavy { backdrop-filter: blur(32px); }
.backdrop-blur-ultra { backdrop-filter: blur(40px); }
```

## 🧩 Component Patterns

### Card Styles
```jsx
/* Standard Card */
<Card className="bg-card border-border hover:card-glow transition-all duration-300">

/* Glass Card */
<Card className="glass-card">

/* Glowing Card */
<Card className="bg-card border-glow hover:border-glow-active transition-all duration-300">
```

### Button Styles
```jsx
/* Primary Button */
<Button className="bg-primary text-primary-foreground hover:glow-cyan-soft">

/* Ghost Button */
<Button variant="ghost" className="text-primary hover:bg-primary/10">

/* Outline Button */
<Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
```

### Navigation Items
```jsx
/* Navigation Item with Glow */
<div className="nav-item-glow rounded-lg border border-transparent px-3 py-2 
                hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
```

### Badge Styles
```jsx
/* Status Badges */
<Badge className="bg-primary/10 text-primary">Active</Badge>
<Badge className="bg-teal/10 text-teal">Success</Badge>
<Badge className="bg-violet/10 text-violet">Review</Badge>
<Badge className="bg-orange-500/10 text-orange-500">Pending</Badge>
```

## 🎯 Interactive States

### Hover Effects
```css
/* Standard Hover */
.hover-glow:hover {
  box-shadow: 0 0 15px rgba(166, 224, 255, 0.2);
  border-color: rgba(166, 224, 255, 0.4);
}

/* Navigation Hover */
.nav-item-glow:hover {
  box-shadow: 0 0 15px rgba(166, 224, 255, 0.2);
  border-color: rgba(166, 224, 255, 0.4);
}

/* Card Hover */
.card-hover:hover {
  background: rgba(166, 224, 255, 0.05);
  transform: translateY(-2px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Active States
```css
.nav-item-glow.active {
  box-shadow: 0 0 20px rgba(166, 224, 255, 0.3);
  border-color: rgba(166, 224, 255, 0.6);
  background: rgba(166, 224, 255, 0.05);
}
```

### Focus States
```css
/* Focus Ring */
.focus-ring:focus {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

## 🎨 Gradients

### Background Gradients
```css
/* Hero Gradient */
.hero-gradient {
  background: linear-gradient(135deg, 
    rgba(10, 10, 10, 0.95) 0%, 
    rgba(17, 17, 17, 0.98) 50%, 
    rgba(10, 10, 10, 0.95) 100%);
}

/* Card Gradient */
.card-gradient {
  background: linear-gradient(145deg, #0A0A0A, #111111);
}

/* Border Gradient */
.border-gradient {
  background: linear-gradient(145deg, rgba(166, 224, 255, 0.2), rgba(166, 224, 255, 0.05)) border-box;
}
```

## 🔢 Icons & Symbols

### Icon Library
```jsx
import { 
  Sparkles,      // AI/Magic indicators
  Zap,           // Energy/Power
  TrendingUp,    // Growth/Success
  Eye,           // View/Preview
  Download,      // Download actions
  Upload,        // Upload actions
  Settings,      // Configuration
  Users,         // Team/People
  Calendar,      // Scheduling
  Clock,         // Time
  BarChart3,     // Analytics
  FileText,      // Documents
  Video,         // Media/Recordings
  Search,        // Search functionality
  Filter,        // Filtering
  Archive,       // Storage/Archive
  Database       // Data management
} from "lucide-react";
```

### Icon Sizing
```jsx
/* Standard sizes */
h-3 w-3   // 12px - small inline icons
h-4 w-4   // 16px - standard icons
h-5 w-5   // 20px - larger buttons
h-6 w-6   // 24px - headers/prominent
h-8 w-8   // 32px - large UI elements
```

## 🎮 Animation & Transitions

### Standard Transitions
```css
/* Base Transition */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Hover Transitions */
transition-colors: color, background-color, border-color 0.15s ease-in-out;
transition-transform: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Durations
```css
duration-150  // 150ms - quick feedback
duration-300  // 300ms - standard transitions  
duration-500  // 500ms - slower, more dramatic
```

## 🏗️ Layout Patterns

### Sidebar Layout
```jsx
<div className="flex h-screen bg-dark-bg">
  <aside className="w-64 bg-card border-r border-border">
    {/* Sidebar content */}
  </aside>
  <main className="flex-1 flex flex-col">
    <header className="h-16 border-b border-border">
      {/* Top navigation */}
    </header>
    <div className="flex-1 p-6 overflow-auto">
      {/* Main content */}
    </div>
  </main>
</div>
```

### Grid Layouts
```jsx
/* Metrics Grid */
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">

/* Content Grid */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

/* Two Column Layout */
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
```

### Card Container Patterns
```jsx
/* Standard Card */
<Card className="p-6 bg-card border-border hover:card-glow transition-all duration-300">

/* Compact Card */
<Card className="p-4 bg-card border-border">

/* Hero Card */
<Card className="p-8 bg-gradient-to-br from-card to-card/50 border-glow">
```

## 📱 Responsive Breakpoints

### Tailwind Breakpoints Used
```css
sm: 640px    // Small devices
md: 768px    // Medium devices (tablets)
lg: 1024px   // Large devices (desktops)
xl: 1280px   // Extra large devices
```

### Common Responsive Patterns
```jsx
/* Grid Responsiveness */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

/* Text Responsiveness */
className="text-sm md:text-base lg:text-lg"

/* Spacing Responsiveness */
className="p-4 md:p-6 lg:p-8"

/* Visibility */
className="hidden md:block"
className="block md:hidden"
```

## 🎯 Usage Guidelines

### Do's ✅
- Always use the cyan accent (#A6E0FF) for primary actions and active states
- Maintain pure black (#0A0A0A) background for maximum contrast
- Use glass morphism effects sparingly for key UI elements
- Apply glow effects to interactive elements on hover/focus
- Keep typography weight at 500 for headings and interactive elements
- Use consistent spacing increments (4px, 8px, 12px, 16px, 24px)

### Don'ts ❌
- Don't mix different accent colors in the same interface section
- Avoid using gradients excessively - reserve for hero sections and key cards
- Don't apply glow effects to static content
- Avoid reducing contrast below WCAG AA standards
- Don't use font weights other than 400 (normal) and 500 (medium)
- Avoid inconsistent border radius values

### Accessibility Notes
- All text maintains minimum 4.5:1 contrast ratio against backgrounds
- Focus states are clearly visible with cyan accent outlines
- Interactive elements have minimum 44px touch targets
- Glass effects maintain sufficient contrast for readability

This style guide provides the complete foundation for building consistent CIELO OS interfaces with the sophisticated dark theme, glass morphism effects, and cyan accent color system.