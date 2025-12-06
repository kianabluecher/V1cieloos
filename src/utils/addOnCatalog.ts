// Shared Add-On Catalog Data
// This file defines all add-on services available across the platform

export interface AddOnItem {
  id: string;
  title: string;
  description: string;
  turnaround: string;
  price: string;
  priceValue: number; // Numeric value for editing
  category: string;
  enabled: boolean;
}

export interface AddOnCategory {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  items: AddOnItem[];
}

// Default add-on catalog
export const defaultAddOnCatalog: AddOnCategory[] = [
  {
    id: "creative-marketing",
    title: "Creative & Marketing Add-Ons",
    color: "text-cyan-accent",
    bgColor: "bg-cyan-accent/10",
    items: [
      {
        id: "newsletter-creation",
        title: "Newsletter Creation",
        description: "Professional email newsletter design and setup",
        turnaround: "3-5 business days",
        price: "Starting at $299",
        priceValue: 299,
        category: "creative-marketing",
        enabled: true
      },
      {
        id: "paid-ad-setup",
        title: "Paid Ad Setup",
        description: "Facebook, Google, and LinkedIn advertising campaigns",
        turnaround: "1-2 weeks",
        price: "Starting at $599",
        priceValue: 599,
        category: "creative-marketing",
        enabled: true
      },
      {
        id: "custom-social-campaigns",
        title: "Custom Social Campaigns",
        description: "Targeted social media campaigns for specific goals",
        turnaround: "1-2 weeks",
        price: "Starting at $399",
        priceValue: 399,
        category: "creative-marketing",
        enabled: true
      },
      {
        id: "brand-strategy-refresh",
        title: "Brand Strategy Refresh",
        description: "Complete brand positioning and messaging update",
        turnaround: "2-3 weeks",
        price: "Starting at $999",
        priceValue: 999,
        category: "creative-marketing",
        enabled: true
      }
    ]
  },
  {
    id: "design-development",
    title: "Design & Development Add-Ons",
    color: "text-violet",
    bgColor: "bg-violet/10",
    items: [
      {
        id: "custom-landing-page",
        title: "Custom Landing Page",
        description: "High-converting landing page design and development",
        turnaround: "1-2 weeks",
        price: "Starting at $799",
        priceValue: 799,
        category: "design-development",
        enabled: true
      },
      {
        id: "full-website-development",
        title: "Full Website Development",
        description: "Complete website build with CMS integration",
        turnaround: "4-6 weeks",
        price: "Starting at $2,999",
        priceValue: 2999,
        category: "design-development",
        enabled: true
      },
      {
        id: "visual-brand-pack",
        title: "Visual Brand Pack",
        description: "Complete visual identity system and guidelines",
        turnaround: "2-3 weeks",
        price: "Starting at $1,299",
        priceValue: 1299,
        category: "design-development",
        enabled: true
      },
      {
        id: "photoshoot-direction",
        title: "Photoshoot Direction & Styling",
        description: "Professional photo direction and post-production",
        turnaround: "1-2 weeks",
        price: "Starting at $699",
        priceValue: 699,
        category: "design-development",
        enabled: true
      }
    ]
  },
  {
    id: "operations-systems",
    title: "Operations & Systems Add-Ons",
    color: "text-teal",
    bgColor: "bg-teal/10",
    items: [
      {
        id: "crm-setup",
        title: "CRM Setup",
        description: "Complete CRM system configuration and training",
        turnaround: "1-2 weeks",
        price: "Starting at $599",
        priceValue: 599,
        category: "operations-systems",
        enabled: true
      },
      {
        id: "ai-automation-setup",
        title: "AI Automation Setup",
        description: "Custom AI workflow automation implementation",
        turnaround: "2-3 weeks",
        price: "Starting at $899",
        priceValue: 899,
        category: "operations-systems",
        enabled: true
      },
      {
        id: "reporting-dashboard",
        title: "Reporting Dashboard Buildout",
        description: "Custom analytics dashboard for business insights",
        turnaround: "2-4 weeks",
        price: "Starting at $1,199",
        priceValue: 1199,
        category: "operations-systems",
        enabled: true
      }
    ]
  }
];
