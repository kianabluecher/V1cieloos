import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  CheckCircle, 
  Clock, 
  Mail, 
  Calendar, 
  MessageCircle, 
  Plus,
  Star,
  Users,
  Palette,
  Code,
  Settings,
  TrendingUp,
  Camera,
  FileText,
  Smartphone,
  Globe,
  BarChart3,
  Zap,
  Database,
  Bot,
  Package
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { defaultAddOnCatalog } from "../../utils/addOnCatalog";

// Plan data
const currentPlan = {
  name: "Growth Plan – SMM + Design",
  status: "Active",
  nextBilling: "August 15, 2024",
  keyPoints: [
    "Complete social media management & content creation",
    "10 professional design tasks per month",
    "2 monthly strategy sessions with expert team",
    "Performance reporting & actionable insights",
    "Dedicated project manager support",
    "Priority response within 24 hours"
  ]
};

// Project Manager data
const projectManager = {
  name: "Sarah Johnson",
  role: "Senior Project Manager",
  email: "sarah.johnson@cielo.com",
  calendlyLink: "https://calendly.com/sarah-johnson",
  avatar: "/api/placeholder/100/100",
  status: "online",
  responseTime: "< 2 hours"
};

// Get category icon component
const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case "creative-marketing":
      return <Palette className="h-5 w-5" />;
    case "design-development":
      return <Code className="h-5 w-5" />;
    case "operations-systems":
      return <Settings className="h-5 w-5" />;
    default:
      return <Package className="h-5 w-5" />;
  }
};

export function ServicePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white">Your Service Dashboard</h3>
          <p className="text-text-secondary mt-1">Manage your plan, connect with your team, and explore additional services</p>
        </div>
        <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Service Active
        </Badge>
      </div>

      {/* Current Plan Overview */}
      <section>
        <div className="mb-6">
          <h4 className="text-white">Current Plan Overview</h4>
          <p className="text-text-secondary text-sm mt-1">Your active subscription package</p>
        </div>

        <Card className="p-6 glass-card border-border-subtle">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-accent/10 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-cyan-accent" />
              </div>
              <div>
                <h5 className="text-white text-xl mb-2">{currentPlan.name}</h5>
                <div className="flex items-center gap-4 text-text-secondary text-sm">
                  <Badge variant="secondary" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20">
                    {currentPlan.status}
                  </Badge>
                  <span>Next billing: {currentPlan.nextBilling}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="border-border-subtle hover:border-cyan-accent text-white nav-item-glow transition-all duration-300">
              <Settings className="h-4 w-4 mr-2" />
              Manage Plan
            </Button>
          </div>

          <div className="bg-card-bg/30 rounded-lg p-6 border border-border-subtle">
            <h6 className="text-white mb-4">What's Included:</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentPlan.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-cyan-accent mt-0.5 flex-shrink-0" />
                  <span className="text-text-secondary text-sm">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <Separator className="bg-border-subtle" />

      {/* Project Manager Contact */}
      <section>
        <div className="mb-6">
          <h4 className="text-white">Project Manager Contact</h4>
          <p className="text-text-secondary text-sm mt-1">Direct access to your dedicated project manager</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Card */}
          <div className="lg:col-span-2">
            <Card className="p-6 glass-card border-border-subtle">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={projectManager.avatar} alt={projectManager.name} />
                    <AvatarFallback className="bg-cyan-accent/10 text-cyan-accent">
                      {projectManager.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-card-bg"></div>
                </div>
                
                <div className="flex-1">
                  <h5 className="text-white text-lg mb-1">{projectManager.name}</h5>
                  <p className="text-text-secondary text-sm mb-2">{projectManager.role}</p>
                  <div className="flex items-center gap-1 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-xs">Online • Response time: {projectManager.responseTime}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="border-border-subtle hover:border-cyan-accent text-white nav-item-glow transition-all duration-300">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" className="border-border-subtle hover:border-cyan-accent text-white nav-item-glow transition-all duration-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Call
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Live Chat Widget */}
          <div className="lg:col-span-1">
            <Card className="p-6 glass-card border-border-subtle h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-cyan-accent" />
                </div>
                <div>
                  <h6 className="text-white">Live Chat</h6>
                  <p className="text-text-secondary text-xs">Get instant support</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="bg-card-bg/50 p-3 rounded-lg">
                  <p className="text-text-secondary text-sm">👋 Hi! I'm here to help with any questions about your service.</p>
                </div>
                <div className="bg-cyan-accent/10 p-3 rounded-lg ml-4">
                  <p className="text-white text-sm">How can I track my design requests?</p>
                </div>
                <div className="bg-card-bg/50 p-3 rounded-lg">
                  <p className="text-text-secondary text-sm">You can track all requests in the Design Requests & Tracking section. Let me know if you need help!</p>
                </div>
              </div>
              
              <Button className="w-full bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Chat
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="bg-border-subtle" />

      {/* Add-On Catalog */}
      <section>
        <div className="mb-6">
          <h4 className="text-white">Add-On Catalog</h4>
          <p className="text-text-secondary text-sm mt-1">Expand your service with additional offerings</p>
        </div>

        <div className="space-y-6">
          {defaultAddOnCatalog.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="p-6 glass-card border-border-subtle">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                  <span className={category.color}>{getCategoryIcon(category.id)}</span>
                </div>
                <h5 className="text-white text-lg">{category.title}</h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.filter(item => item.enabled).map((item, itemIndex) => (
                  <div key={itemIndex} className="p-4 bg-card-bg/30 rounded-lg border border-border-subtle hover:border-cyan-accent/30 transition-all duration-300 nav-item-glow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h6 className="text-white mb-1">{item.title}</h6>
                        <p className="text-text-secondary text-sm mb-2">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-text-secondary text-xs mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.turnaround}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{item.price}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-border-subtle hover:border-cyan-accent text-white nav-item-glow transition-all duration-300">
                        Learn More
                      </Button>
                      <Button size="sm" className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg">
                        <Plus className="h-3 w-3 mr-1" />
                        Request
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions Footer */}
      <Card className="p-4 glass-card border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-border-subtle hover:border-cyan-accent text-white nav-item-glow transition-all duration-300">
              <FileText className="h-4 w-4 mr-2" />
              View Contract
            </Button>
            <Button variant="outline" className="border-border-subtle hover:border-cyan-accent text-white nav-item-glow transition-all duration-300">
              <BarChart3 className="h-4 w-4 mr-2" />
              Usage Reports
            </Button>
            <Button variant="outline" className="border-border-subtle hover:border-cyan-accent text-white nav-item-glow transition-all duration-300">
              <MessageCircle className="h-4 w-4 mr-2" />
              Feedback
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
              <Bot className="h-3 w-3 mr-1" />
              AI Support Available
            </Badge>
            <span className="text-text-secondary text-sm">Last updated: 2 hours ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
}