import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Card } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import {
  Bot,
  Target,
  FileOutput,
  Layers,
  HeadphonesIcon,
  Bell,
  Upload,
  RefreshCw,
  Download,
  Plus,
  TrendingUp,
  Sparkles,
  Calendar,
  CheckSquare,
  Users,
  ChevronLeft,
  ChevronDown,
  Wrench,
  ListTodo,
  Archive,
  FolderOpen,
  Share2,
  Globe,
  LayoutDashboard,
  DollarSign,
  Activity,
  Grid3x3,
  List,
  BarChart3,
  Building2,
  Sun,
  Moon,
} from "lucide-react";
import cieloLogo from "./assets/cielo-logo-new.svg";
import { LoginPage } from "./components/LoginPage";
import { ProfileDropdown } from "./components/ProfileDropdown";
import { ManageProfilePage } from "./components/pages/ManageProfilePage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { ServicePage } from "./components/pages/ServicePage";
import { AgencyDashboardPage } from "./components/pages/AgencyDashboardPage";
import { DesignRequestsPage } from "./components/pages/DesignRequestsPage";
import { TaskManagementPage } from "./components/pages/TaskManagementPage";
import { FilesPage } from "./components/pages/FilesPage";
import { ToolsPage } from "./components/pages/ToolsPage";
import { NotificationsPage } from "./components/pages/NotificationsPage";
import { NewRequestModal } from "./components/NewRequestModal";
import { StrategyPage } from "./components/pages/StrategyPage";
import { DataArchivePage } from "./components/pages/DataArchivePage";
import { StrategySection } from "./components/StrategySection";
import { BrandInformation } from "./components/BrandInformation";
import { FileUpload } from "./components/FileUpload";
import { ClientManagementPage } from "./components/pages/ClientManagementPage";
import { ManagementPage } from "./components/pages/ManagementPage";
import { BillingPage } from "./components/pages/BillingPage";
import { ActivityLogPage } from "./components/pages/ActivityLogPage";
import { TeamToolsManagementPage } from "./components/pages/TeamToolsManagementPage";
import { AttachmentPreviewDialog } from "./components/AttachmentPreviewDialog";
import { AnalyticsPage } from "./components/pages/AnalyticsPage";
import { CRMPage } from "./components/pages/CRMPage";
import { AutomationsPage } from "./components/pages/AutomationsPage";
import { SocialMediaPage } from "./components/pages/SocialMediaPage";
import { BrandWebPage } from "./components/pages/BrandWebPage";
import { LeadGenPage } from "./components/pages/LeadGenPage";
import { AdsPage } from "./components/pages/AdsPage";
import { api } from "./utils/supabase/client";
import { SetupHelper } from "./components/SetupHelper";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeNav, setActiveNav] = useState("hub");
  const [activePage, setActivePage] = useState<"main" | "profile" | "settings" | "service">("main");
  const [viewMode, setViewMode] = useState<"client" | "team" | "management">("client");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [billingSubmenu, setBillingSubmenu] = useState<"invoices" | "quotes" | "addons" | "packages" | null>(null);
  const [companySubmenu, setCompanySubmenu] = useState<"analytics" | "crm" | null>(null);
  const [strategySubmenu, setStrategySubmenu] = useState<"overview" | "social" | "brandweb" | "leadgen" | "ads" | null>(null);
  const [archiveDetailItem, setArchiveDetailItem] = useState<any>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["clients", "billing"]);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isHandlingOAuthCallback, setIsHandlingOAuthCallback] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [currentUser, setCurrentUser] = useState({
    name: "Sarah Johnson",
    email: "sarah@client.com",
    companyName: "ACME Corporation",
    role: "Marketing Director",
    userType: "client" as "client" | "team" | "management",
  });


  // Load initial data and check for saved session
  useEffect(() => {
    handleOAuthCallback();
    seedInitialData();
    checkSavedSession();
    handleInitialRoute();
    loadThemePreference();
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      handleInitialRoute();
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when navigation changes
  useEffect(() => {
    if (isAuthenticated) {
      updateURL();
    }
  }, [activeNav, activePage, viewMode, billingSubmenu, companySubmenu, strategySubmenu, isAuthenticated]);

  const handleInitialRoute = () => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length === 0) return;
    
    const [viewType, page, subpage] = segments;
    
    // Map URL view type to viewMode
    let newViewMode: "client" | "team" | "management" = "client";
    if (viewType === "admin" || viewType === "management") {
      newViewMode = "management";
    } else if (viewType === "team") {
      newViewMode = "team";
    } else if (viewType === "client") {
      newViewMode = "client";
    }
    
    setViewMode(newViewMode);
    
    // Handle page navigation
    if (page) {
      if (page === "profile" || page === "settings" || page === "service") {
        setActivePage(page as any);
      } else {
        setActivePage("main");
        setActiveNav(page);
        
        // Handle submenus
        if (subpage) {
          if (page === "billing") {
            setBillingSubmenu(subpage as any);
          } else if (page === "company") {
            setCompanySubmenu(subpage as any);
          } else if (page === "strategy") {
            setStrategySubmenu(subpage as any);
          }
        }
      }
    }
  };

  const updateURL = () => {
    const viewPrefix = viewMode === "management" ? "admin" : viewMode;
    let url = `/${viewPrefix}`;
    
    if (activePage === "profile" || activePage === "settings" || activePage === "service") {
      url += `/${activePage}`;
    } else {
      url += `/${activeNav}`;
      
      // Add submenu to URL if applicable
      if (activeNav === "billing" && billingSubmenu) {
        url += `/${billingSubmenu}`;
      } else if (activeNav === "company" && companySubmenu) {
        url += `/${companySubmenu}`;
      } else if (activeNav === "strategy" && strategySubmenu) {
        url += `/${strategySubmenu}`;
      }
    }
    
    window.history.pushState({}, '', url);
  };

  const checkSavedSession = () => {
    try {
      const savedSession = localStorage.getItem("cielo_session");
      if (savedSession) {
        const session = JSON.parse(savedSession);
        setCurrentUser(session.user);
        setViewMode(session.viewMode);
        setActiveNav(session.activeNav);
        setIsAuthenticated(true);
        console.log("Session restored from localStorage");
      }
    } catch (error) {
      console.error("Error restoring session:", error);
      localStorage.removeItem("cielo_session");
    }
  };

  // Load theme preference from localStorage
  const loadThemePreference = () => {
    try {
      const savedTheme = localStorage.getItem("cielo_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Default to dark mode
        applyTheme("dark");
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
      applyTheme("dark");
    }
  };

  // Apply theme to document
  const applyTheme = (newTheme: "light" | "dark") => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("cielo_theme", newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  const seedInitialData = async () => {
    try {
      console.log('[App] Initializing demo data...');
      const response = await api.initializeDemoData();
      console.log('[App] Demo data response:', response);
      
      if (response.success) {
        console.log("[App] Demo data initialized successfully");
      } else {
        console.error("[App] Failed to initialize demo data:", response.error);
        console.error("[App] Error details:", response.details);
        
        // Check if this is a table missing error
        const errorDetails = response.details || response.error || '';
        if (errorDetails.includes('kv_store_c3abf285') && errorDetails.includes('does not exist')) {
          console.error('═══════════════════════════════════════════════════════════');
          console.error('⚠️  DATABASE SETUP REQUIRED');
          console.error('═══════════════════════════════════════════════════════════');
          console.error('');
          console.error('The KV store table is missing. Please create it:');
          console.error('');
          console.error('1. Go to: https://supabase.com/dashboard');
          console.error('2. Select your project → SQL Editor → New query');
          console.error('3. Paste and run this SQL:');
          console.error('');
          console.error('   CREATE TABLE public.kv_store_c3abf285 (');
          console.error('     key TEXT PRIMARY KEY,');
          console.error('     value JSONB NOT NULL');
          console.error('   );');
          console.error('');
          console.error('   GRANT ALL ON public.kv_store_c3abf285 TO postgres, service_role, authenticated;');
          console.error('');
          console.error('4. Wait 10 seconds, then refresh this page');
          console.error('');
          console.error('Alternatively, check /create_kv_store_table.sql for the full setup script');
          console.error('═══════════════════════════════════════════════════════════');
          
          // Show visual setup helper
          setSetupError(errorDetails);
          
          toast.error('Database setup required - Follow the on-screen instructions', {
            duration: 10000,
          });
        } else {
          toast.error(`Failed to initialize demo data: ${response.details || response.error}`);
        }
        
        // Don't retry if it's a table missing error (it won't help)
        if (!errorDetails.includes('does not exist')) {
          // Retry once after a short delay for other errors
          setTimeout(async () => {
            try {
              console.log('[App] Retrying demo data initialization...');
              const retryResponse = await api.initializeDemoData();
              if (retryResponse.success) {
                console.log("[App] Demo data initialized on retry");
                toast.success("Demo data initialized successfully");
              } else {
                console.error("[App] Retry also failed:", retryResponse);
              }
            } catch (retryError) {
              console.error("[App] Retry failed:", retryError);
            }
          }, 2000);
        }
      }
    } catch (error) {
      console.error("[App] Error initializing demo data:", error);
      console.error("[App] Error message:", error?.message);
      
      // Check if this is a table missing error
      const errorMessage = error?.message || '';
      if (errorMessage.includes('kv_store_c3abf285') && errorMessage.includes('does not exist')) {
        console.error('═══════════════════════════════════════════════════════════');
        console.error('⚠️  DATABASE SETUP REQUIRED - See instructions above');
        console.error('═══════════════════════════════════════════════════════════');
        
        // Show visual setup helper
        setSetupError(errorMessage);
        
        toast.error('Database setup required - Follow the on-screen instructions', {
          duration: 10000,
        });
      } else {
        toast.error(`Error initializing demo data: ${error?.message || 'Unknown error'}`);
        
        // Retry once after a short delay for other errors
        setTimeout(async () => {
          try {
            console.log('[App] Retrying after exception...');
            await api.initializeDemoData();
            console.log("[App] Demo data initialized on retry");
          } catch (retryError) {
            console.error("[App] Retry failed:", retryError);
          }
        }, 2000);
      }
    }
  };

  const handleOAuthCallback = async () => {
    // Check if we're on the auth callback route
    if (window.location.pathname === '/auth/callback' || window.location.hash) {
      console.log('[OAuth] Detected OAuth callback');
      setIsHandlingOAuthCallback(true);
      
      try {
        const response = await api.handleOAuthCallback();
        
        if (response.success && response.user) {
          const user = response.user;
          console.log('[OAuth] Callback successful, user:', user);
          
          setCurrentUser({
            name: user.name,
            email: user.email,
            companyName: user.companyName || '',
            role: user.role,
            userType: user.userType
          });
          setViewMode(user.userType);
          setIsAuthenticated(true);

          // Save session to localStorage
          const sessionData = {
            user: {
              name: user.name,
              email: user.email,
              companyName: user.companyName || '',
              role: user.role,
              userType: user.userType
            },
            viewMode: user.userType,
            activeNav: user.userType === "management" ? "clients" : user.userType === "team" ? "clients" : "hub",
            timestamp: new Date().toISOString(),
            accessToken: user.accessToken
          };
          localStorage.setItem("cielo_session", JSON.stringify(sessionData));

          // Log login activity to backend
          try {
            await api.logActivity({
              userId: user.email,
              userName: user.name,
              userEmail: user.email,
              userType: user.userType,
              action: "sign_in_google",
              description: `${user.name} signed in to CIELO OS via Google`,
              metadata: { method: 'google_oauth' },
            });
          } catch (error) {
            console.error("Error logging activity:", error);
          }

          toast.success(`Welcome, ${user.name}!`);
          
          // Clean up URL and redirect to dashboard
          const targetNav = user.userType === "management" ? "clients" : user.userType === "team" ? "clients" : "hub";
          setActiveNav(targetNav);
          
          // Replace URL without hash/query params
          window.history.replaceState({}, '', '/');
        } else {
          console.error('[OAuth] Callback failed:', response.error);
          toast.error(`Sign in failed: ${response.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("[OAuth] Error handling OAuth callback:", error);
        toast.error("An error occurred during sign in");
      } finally {
        setIsHandlingOAuthCallback(false);
      }
    }
  };



  const clientNavigationItems = [
    { id: "hub", label: "Hub", icon: Target },
    { id: "strategy", label: "Strategy", icon: FileOutput },
    { id: "design", label: "Design Requests", icon: Layers },
    { id: "archive", label: "Data Archive", icon: Archive },
  ];

  const teamNavigationItems = [
    { id: "clients", label: "Clients", icon: Users },
    { id: "tasks", label: "Design Requests", icon: CheckSquare },
    { id: "task-management", label: "Task Management", icon: ListTodo },
    { id: "files", label: "Files", icon: FolderOpen },
    { id: "tools", label: "Tools", icon: Wrench },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const managementNavigationItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      isExpandable: false
    },
    { 
      id: "company", 
      label: "Company", 
      icon: Building2,
      isExpandable: true,
      subItems: [
        { id: "company-analytics", label: "Analytics", icon: BarChart3 },
        { id: "company-crm", label: "CRM", icon: Users },
      ]
    },
    { 
      id: "clients", 
      label: "Clients", 
      icon: Users,
      isExpandable: true,
      subItems: [
        { id: "clients-list", label: "Client List", icon: Grid3x3 },
        { id: "clients-activity", label: "Client Activity", icon: Activity },
      ]
    },
    { 
      id: "team", 
      label: "Team & Permissions", 
      icon: Users,
      isExpandable: false
    },
    { 
      id: "billing", 
      label: "Billing", 
      icon: DollarSign,
      isExpandable: true,
      subItems: [
        { id: "billing-invoices", label: "Invoices", icon: FileOutput },
        { id: "billing-quotes", label: "Quotes", icon: FileOutput },
        { id: "billing-addons", label: "Add-ons", icon: Plus },
        { id: "billing-packages", label: "Packages", icon: Layers },
      ]
    },
    { 
      id: "files", 
      label: "Files", 
      icon: FolderOpen,
      isExpandable: false
    },
    { 
      id: "activity", 
      label: "Activity Log", 
      icon: Activity,
      isExpandable: false
    },
    { 
      id: "team-tools", 
      label: "Team Tools", 
      icon: Wrench,
      isExpandable: false
    },
    { 
      id: "automations", 
      label: "Automations", 
      icon: Sparkles,
      isExpandable: false,
      badge: "Coming Soon"
    },
  ];

  const navigationItems =
    viewMode === "client"
      ? clientNavigationItems
      : viewMode === "team"
      ? teamNavigationItems
      : managementNavigationItems;

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleLogin = async (email: string, password: string) => {
    let userType: "client" | "team" | "management" = "client";
    let userName = "";
    let userRole = "";
    let companyName = "";

    // Check credentials
    if (email === "admin@cielo.marketing" && password === "admincielo765598") {
      userType = "management";
      userName = "Admin User";
      userRole = "Administrator";
      setActiveNav("clients");
    } else if (email === "john@cielo.marketing" && password === "team123") {
      userType = "team";
      userName = "John Smith";
      userRole = "Brand Strategist";
      setActiveNav("clients");
    } else if (email === "sarah@client.com" && password === "client123") {
      userType = "client";
      userName = "Sarah Johnson";
      userRole = "Marketing Director";
      companyName = "ACME Corporation";
      setActiveNav("hub");
    } else {
      throw new Error("Invalid credentials");
    }

    const user = {
      name: userName,
      email: email,
      companyName: companyName,
      role: userRole,
      userType: userType,
    };

    setCurrentUser(user);
    setViewMode(userType);
    setIsAuthenticated(true);

    // Save session to localStorage (no password protection for management after login)
    const sessionData = {
      user,
      viewMode: userType,
      activeNav: userType === "management" ? "clients" : userType === "team" ? "clients" : "hub",
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cielo_session", JSON.stringify(sessionData));

    // Log login activity to backend
    try {
      await api.logActivity({
        userId: email,
        userName: userName,
        userEmail: email,
        userType: userType,
        action: "sign_in",
        description: `${userName} signed in to CIELO OS`,
        metadata: {},
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }

    toast.success(`Welcome back, ${userName}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser({
      name: "",
      email: "",
      companyName: "",
      role: "",
      userType: "client",
    });
    setActiveNav("hub");
    setActivePage("main");
    
    // Clear saved session
    localStorage.removeItem("cielo_session");
    
    toast.info("You have been logged out");
  };

  const handleSaveProfile = async (data: any) => {
    try {
      setCurrentUser({
        ...currentUser,
        ...data,
      });
      console.log("Profile updated:", data);
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  };

  const getBreadcrumb = () => {
    if (activePage === "profile") {
      return "Personal Information & Security";
    }
    if (activePage === "settings") {
      return "Preferences & Notifications";
    }
    if (activePage === "service") {
      return "Current Service Management";
    }

    if (viewMode === "team") {
      switch (activeNav) {
        case "tasks":
          return "Design Requests";
        case "task-management":
          return "Project Task Management";
        case "tools":
          return "Tools & Resources";
        default:
          return "Manage Clients & Documents";
      }
    }

    if (viewMode === "management") {
      switch (activeNav) {
        case "clients":
          return "Client Management & Invitations";
        case "company":
          if (companySubmenu === "analytics") return "Company - Web Analytics & Insights";
          if (companySubmenu === "crm") return "Company - Customer Relationship Management";
          return "Company Information & Tools";
        case "team":
          return "Team Members & Permissions";
        case "team-tools":
          return "Team Tools & Tutorials Management";
        case "automations":
          return "Workflow Automation Builder";
        case "billing":
          if (billingSubmenu === "invoices") return "Billing - Invoices";
          if (billingSubmenu === "quotes") return "Billing - Quotes & Proposals";
          if (billingSubmenu === "addons") return "Billing - Add Ons";
          if (billingSubmenu === "packages") return "Billing - Packages";
          return "Client Billing & Subscriptions";
        case "activity":
          return "Login & Activity Tracking";
        case "analytics":
          return "Website Performance & Traffic Insights";
        default:
          return "Management Dashboard";
      }
    }

    switch (activeNav) {
      case "hub":
        return "Brand, Market Intelligence & Positioning";
      case "strategy":
        if (strategySubmenu === "social") return "Strategy - Social Media Management";
        if (strategySubmenu === "brandweb") return "Strategy - Brand & Web Assets";
        if (strategySubmenu === "leadgen") return "Strategy - Lead Generation";
        if (strategySubmenu === "ads") return "Strategy - Ads Management";
        return "Strategy Sessions & Brand Documents";
      case "design":
        return "Task Management & Design Requests";
      case "service":
        return "Current Service Management";
      case "archive":
        if (archiveDetailItem) return `Archive - ${archiveDetailItem.title}`;
        return "Data Archive - Notes & Recordings";
      default:
        return "Dashboard";
    }
  };

  const getPageTitle = () => {
    if (activePage === "profile") {
      return "Manage Profile";
    }
    if (activePage === "settings") {
      return "Settings";
    }
    if (activePage === "service") {
      return "Service";
    }

    if (viewMode === "team") {
      switch (activeNav) {
        case "task-management":
          return "Task Management";
        case "files":
          return "Files";
        case "tools":
          return "Tools";
        case "notifications":
          return "Notifications";
        default:
          return "Team Dashboard";
      }
    }

    if (viewMode === "management") {
      switch (activeNav) {
        case "files":
          return "Files";
        case "notifications":
          return "Notifications";
        default:
          return "Management";
      }
    }

    switch (activeNav) {
      case "hub":
        return "Hub";
      case "strategy":
        if (strategySubmenu === "social") return "Social Media";
        if (strategySubmenu === "brandweb") return "Brand & Web";
        if (strategySubmenu === "leadgen") return "Lead Generation";
        if (strategySubmenu === "ads") return "Ads Management";
        return "Strategy";
      case "design":
        return "Design Requests";
      case "archive":
        if (archiveDetailItem) return archiveDetailItem.title;
        return "Data Archive";
      case "service":
        return "Service";
      case "notifications":
        return "Notifications";
      default:
        return "Dashboard";
    }
  };

  const renderMainContent = () => {
    // Handle profile, settings, and service pages
    if (activePage === "profile") {
      return <ManageProfilePage user={currentUser} onSave={handleSaveProfile} />;
    }
    if (activePage === "settings") {
      return <SettingsPage />;
    }
    if (activePage === "service") {
      return <ServicePage />;
    }

    // Management view
    if (viewMode === "management") {
      switch (activeNav) {
        case "company":
          if (companySubmenu === "analytics") return <AnalyticsPage />;
          if (companySubmenu === "crm") return <CRMPage />;
          return <AnalyticsPage />; // Default to analytics
        case "clients":
          return <ClientManagementPage />;
        case "team":
          return <ManagementPage />;
        case "team-tools":
          return <TeamToolsManagementPage />;
        case "automations":
          return <AutomationsPage />;
        case "billing":
          return <BillingPage submenu={billingSubmenu} />;
        case "files":
          return <FilesPage />;
        case "activity":
          return <ActivityLogPage />;
        case "analytics":
          return <AnalyticsPage />;
        case "notifications":
          return <NotificationsPage />;
        default:
          return <ClientManagementPage />;
      }
    }

    // Team view
    if (viewMode === "team") {
      if (activeNav === "task-management") {
        return <TaskManagementPage />;
      }
      if (activeNav === "files") {
        return <FilesPage />;
      }
      if (activeNav === "tools") {
        return <ToolsPage />;
      }
      if (activeNav === "notifications") {
        return <NotificationsPage />;
      }
      return <AgencyDashboardPage activeSection={activeNav} viewMode="team" />;
    }

    // Client view
    switch (activeNav) {
      case "files":
        return <FilesPage />;
      
      case "strategy":
        if (strategySubmenu === "social") {
          return <SocialMediaPage />;
        }
        if (strategySubmenu === "brandweb") {
          return <BrandWebPage />;
        }
        if (strategySubmenu === "leadgen") {
          return <LeadGenPage />;
        }
        if (strategySubmenu === "ads") {
          return <AdsPage />;
        }
        return <StrategyPage />;
      
      case "design":
        return <DesignRequestsPage />;
      
      case "archive":
        if (archiveDetailItem) {
          // Full page view for archive item
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setArchiveDetailItem(null)}
                  className="border-border-subtle text-white hover:bg-card-bg"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Archive
                </Button>
              </div>
              
              <Card className="border-border p-8">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl text-foreground mb-2">{archiveDetailItem.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(archiveDetailItem.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      {archiveDetailItem.type && (
                        <Badge variant="outline" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20">
                          {archiveDetailItem.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="bg-border" />
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {archiveDetailItem.content || archiveDetailItem.description}
                    </div>
                  </div>
                  
                  {archiveDetailItem.transcript && (
                    <>
                      <Separator className="bg-border" />
                      <div>
                        <h3 className="text-xl text-foreground mb-4">Full Transcript</h3>
                        <div className="bg-muted p-6 rounded-lg border border-border">
                          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {archiveDetailItem.transcript}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          );
        }
        return <DataArchivePage viewMode="client" onViewDetail={setArchiveDetailItem} />;
        
      case "hub":
        return (
          <div className="space-y-8">
            {/* Hero Welcome Section */}
            <Card 
              className="relative overflow-hidden border-border bg-card dark:bg-gradient-to-br dark:from-[#1a2332] dark:to-[#0f1419]"
            >
              <div className="absolute top-8 right-8">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border hover:bg-cyan-accent/10 hover:border-cyan-accent"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload new Document
                </Button>
              </div>
              
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                <div className="w-12 h-12 bg-cyan-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <Sparkles className="h-6 w-6 text-cyan-accent" />
                </div>
                
                <h1 className="text-4xl text-foreground mb-4">
                  Hello, {currentUser.name.split(' ')[0] || 'there'}
                </h1>
                
                <p className="text-muted-foreground text-lg max-w-2xl mb-8">
                  Good afternoon! Have a look into your recent insights generated by our agents based on our last strategy sessions and resources.
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <Badge 
                    variant="outline" 
                    className="bg-muted/50 border-border text-foreground px-4 py-2"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    7 Open Tasks
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="bg-muted/50 border-border text-foreground px-4 py-2"
                  >
                    <Calendar className="h-4 w-4 mr-2 text-green-400" />
                    Next: Today 2:30 PM
                  </Badge>
                </div>
                
                <Button 
                  className="bg-cyan-accent hover:bg-cyan-accent/80 text-primary-foreground"
                  onClick={() => {
                    setActiveNav("design");
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </div>
            </Card>



            <Separator className="bg-border" />

            {/* Your Strategy */}
            <section>
              <div className="mb-6">
                <h3 className="text-foreground">Your Strategy</h3>
                <p className="text-muted-foreground mt-1">
                  AI-generated strategy and downloadable reports
                </p>
              </div>

              <StrategySection />
            </section>

            <Separator className="bg-border" />

            {/* Brand Information */}
            <section>
              <div className="mb-6">
                <h3 className="text-foreground">Brand Information</h3>
                <p className="text-muted-foreground mt-1">
                  Update your brand details for better AI recommendations
                </p>
              </div>

              <BrandInformation />
            </section>

            <Separator className="bg-border" />

            {/* Upload Files */}
            <section>
              <div className="mb-6">
                <h3 className="text-foreground">Upload Files</h3>
                <p className="text-muted-foreground mt-1">
                  Share documents, assets, and resources with your AI agents
                </p>
              </div>

              <FileUpload />
            </section>

            {/* Sync Footer Controls */}
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:glow-cyan-soft transition-all duration-300"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:glow-cyan-soft transition-all duration-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={seedInitialData}
                    className="text-muted-foreground hover:text-foreground hover:glow-cyan-soft transition-all duration-300 opacity-30 hover:opacity-100"
                    title="Development: Seed initial data"
                  >
                    Seed Data
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20"
                  >
                    All agents active
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last analysis: 2 hours ago
                  </span>
                </div>
              </div>
            </Card>
          </div>
        );

      case "strategy":
        return <StrategyPage />;

      case "design":
        return <DesignRequestsPage />;

      case "archive":
        return <DataArchivePage viewMode="client" />;

      default:
        return <div>Page not found</div>;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      {/* Setup Helper Modal */}
      <SetupHelper 
        error={setupError || undefined} 
        onDismiss={() => setSetupError(null)} 
      />
      
      <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarCollapsed ? "w-20" : "w-64"
        } bg-background border-r border-border flex flex-col transition-all duration-300 relative`}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-6 z-50 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:border-cyan-accent/30 hover:bg-cyan-accent/5 transition-all duration-300"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${
              isSidebarCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Logo & Project Selector */}
        <div className="p-6 border-b border-border">
          <div
            className={`flex items-center gap-3 mb-4 ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <img 
              src={cieloLogo} 
              alt="CIELO OS Logo" 
              className={isSidebarCollapsed ? "h-10 w-auto object-contain" : "h-12 w-auto object-contain"}
            />
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                {/* Logo text removed */}
              </div>
            )}
          </div>

          {/* View Mode Indicator */}
          {!isSidebarCollapsed && (
            <div className="space-y-2">
              <div
                className={`px-3 py-2 rounded-lg text-xs text-center border ${
                  viewMode === "client"
                    ? "bg-cyan-accent/10 text-cyan-accent border-cyan-accent/30"
                    : viewMode === "team"
                    ? "bg-teal/10 text-teal border-teal/30"
                    : "bg-violet/10 text-violet border-violet/30"
                }`}
              >
                {viewMode === "client"
                  ? "Client View"
                  : viewMode === "team"
                  ? "Team View"
                  : "Management View"}
              </div>
              
              {/* Temporary View Switcher - Will be removed later */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setViewMode("client");
                    setActiveNav("hub");
                    setActivePage("main");
                    toast.info("Switched to Client View");
                  }}
                  className="flex-1 text-xs py-1 h-auto hover:bg-cyan-accent/10 hover:text-cyan-accent"
                >
                  Client
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setViewMode("team");
                    setActiveNav("clients");
                    setActivePage("main");
                    toast.info("Switched to Team View");
                  }}
                  className="flex-1 text-xs py-1 h-auto hover:bg-teal/10 hover:text-teal"
                >
                  Team
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setViewMode("management");
                    setActiveNav("clients");
                    setActivePage("main");
                    toast.info("Switched to Management View");
                  }}
                  className="flex-1 text-xs py-1 h-auto hover:bg-violet/10 hover:text-violet"
                >
                  Admin
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 p-4 ${viewMode === "management" ? "space-y-1" : "space-y-2"}`}>
          {navigationItems.map((item: any) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id && activePage === "main";
            const hasBillingSubmenu = viewMode === "management" && item.id === "billing";
            const hasStrategySubmenu = viewMode === "client" && item.id === "strategy";
            const isExpanded = expandedMenus.includes(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            
            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (viewMode === "management" && hasSubItems) {
                      toggleMenu(item.id);
                    } else {
                      setActiveNav(item.id);
                      setActivePage("main");
                      if (!hasBillingSubmenu) {
                        setBillingSubmenu(null);
                      }
                      if (!hasStrategySubmenu) {
                        setStrategySubmenu(null);
                      }
                    }
                  }}
                  className={viewMode === "management"
                    ? `w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive && !hasSubItems
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`
                    : `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/30 glow-cyan-soft"
                          : "text-muted-foreground hover:text-foreground hover:bg-cyan-accent/5 border border-transparent"
                      } ${isSidebarCollapsed ? "justify-center" : ""}`
                  }
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </div>
                  {!isSidebarCollapsed && viewMode === "management" && (
                    <>
                      {hasSubItems && (
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                      {item.badge && (
                        <Badge 
                          variant="outline" 
                          className="bg-red-500/10 text-red-400 border-red-500/20 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
                
                {/* Management View Hierarchical Submenu */}
                {viewMode === "management" && hasSubItems && isExpanded && !isSidebarCollapsed && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
                    {item.subItems.map((subItem: any) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = 
                        activeNav === item.id && 
                        ((item.id === "billing" && billingSubmenu === subItem.id.replace("billing-", "")) ||
                         (item.id === "company" && companySubmenu === subItem.id.replace("company-", "")) ||
                         (item.id === "clients" && activeNav === "clients"));
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            setActiveNav(item.id);
                            setActivePage("main");
                            if (item.id === "billing") {
                              setBillingSubmenu(subItem.id.replace("billing-", "") as any);
                            }
                            if (item.id === "company") {
                              setCompanySubmenu(subItem.id.replace("company-", "") as any);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                            isSubActive
                              ? "text-foreground bg-muted"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <SubIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {/* Strategy Submenu - Client Only */}
                {hasStrategySubmenu && isActive && !isSidebarCollapsed && (
                  <div className="ml-8 mt-1 space-y-1">
                    <button
                      onClick={() => setStrategySubmenu(null)}
                      className={`w-full text-left px-3 py-1.5 rounded text-sm transition-all ${
                        !strategySubmenu
                          ? "text-cyan-accent bg-cyan-accent/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-cyan-accent/5"
                      }`}
                    >
                      Strategy Overview
                    </button>
                    <button
                      onClick={() => setStrategySubmenu("social")}
                      className={`w-full text-left px-3 py-1.5 rounded text-sm transition-all ${
                        strategySubmenu === "social"
                          ? "text-cyan-accent bg-cyan-accent/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-cyan-accent/5"
                      }`}
                    >
                      Social Media
                    </button>
                    <button
                      onClick={() => setStrategySubmenu("brandweb")}
                      className={`w-full text-left px-3 py-1.5 rounded text-sm transition-all ${
                        strategySubmenu === "brandweb"
                          ? "text-cyan-accent bg-cyan-accent/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-cyan-accent/5"
                      }`}
                    >
                      Brand & Web
                    </button>
                    <button
                      onClick={() => setStrategySubmenu("leadgen")}
                      className={`w-full text-left px-3 py-1.5 rounded text-sm transition-all ${
                        strategySubmenu === "leadgen"
                          ? "text-cyan-accent bg-cyan-accent/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-cyan-accent/5"
                      }`}
                    >
                      Lead Generation
                    </button>
                    <button
                      onClick={() => setStrategySubmenu("ads")}
                      className={`w-full text-left px-3 py-1.5 rounded text-sm transition-all ${
                        strategySubmenu === "ads"
                          ? "text-cyan-accent bg-cyan-accent/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-cyan-accent/5"
                      }`}
                    >
                      Ads Management
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-border">
          <ProfileDropdown
            user={currentUser}
            onManageProfile={() => setActivePage("profile")}
            onSettings={() => setActivePage("settings")}
            onService={viewMode === "client" ? () => setActivePage("service") : undefined}
            onLogout={handleLogout}
            isCollapsed={isSidebarCollapsed}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background border-b border-border">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-foreground">{getPageTitle()}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {getBreadcrumb()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {viewMode === "team" && activeNav === "tasks" && (
                  <NewRequestModal />
                )}
                
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-muted-foreground hover:text-foreground hover:bg-cyan-accent/10 transition-colors"
                  title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                
                {viewMode !== "client" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setActiveNav("notifications");
                      setActivePage("main");
                    }}
                    className="text-muted-foreground hover:text-foreground hover:bg-cyan-accent/10"
                    title="View notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-8">{renderMainContent()}</div>
        </main>
      </div>

      <Toaster />
    </div>
    </>
  );
}