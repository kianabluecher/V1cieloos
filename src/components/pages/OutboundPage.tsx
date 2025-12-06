import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Mail, 
  Phone, 
  Building2, 
  User, 
  Calendar, 
  MessageSquare,
  MoreVertical,
  Plus,
  Filter,
  Search,
  TrendingUp,
  UserPlus,
  DollarSign,
  Target,
  Clock,
  Briefcase,
  Users,
  MapPin,
  Award,
  Lightbulb,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: string;
  status: "new" | "contacted" | "booked" | "won";
  source: string;
  addedDate: string;
  lastContact?: string;
  notes?: string;
  respondedBy?: string;
  agentStatus?: "pending" | "in-progress" | "completed";
};

const initialLeads: Lead[] = [
  {
    id: "1",
    name: "Michael Chen",
    company: "TechFlow Solutions",
    email: "michael@techflow.com",
    phone: "+1 (555) 123-4567",
    value: "$45,000",
    status: "new",
    source: "LinkedIn Outbound",
    addedDate: "2024-12-03",
    respondedBy: "Account Manager: Ankit Mittal",
    agentStatus: "pending"
  },
  {
    id: "2",
    name: "Sarah Williams",
    company: "Digital Ventures",
    email: "sarah@digitalventures.com",
    phone: "+1 (555) 234-5678",
    value: "$32,000",
    status: "new",
    source: "Cold Email",
    addedDate: "2024-12-01",
    respondedBy: "Account Manager: Ankit Mittal",
    agentStatus: "pending"
  },
  {
    id: "3",
    name: "James Rodriguez",
    company: "Innovation Labs",
    email: "james@innovationlabs.com",
    phone: "+1 (555) 345-6789",
    value: "$67,500",
    status: "new",
    source: "Direct Outreach",
    addedDate: "2024-11-28",
    respondedBy: "Account Manager: Ankit Mittal",
    agentStatus: "pending"
  },
  {
    id: "4",
    name: "Emily Thompson",
    company: "Growth Marketing Co",
    email: "emily@growthmarketing.com",
    phone: "+1 (555) 456-7890",
    value: "$28,000",
    status: "new",
    source: "LinkedIn Outbound",
    addedDate: "2024-12-02",
    respondedBy: "Account Manager: Ankit Mittal",
    agentStatus: "pending"
  },
  {
    id: "5",
    name: "David Park",
    company: "StartUp Accelerator",
    email: "david@startupaccel.com",
    phone: "+1 (555) 567-8901",
    value: "$52,000",
    status: "new",
    source: "Cold Email",
    addedDate: "2024-11-25",
    respondedBy: "Account Manager: Ankit Mittal",
    agentStatus: "pending"
  },
  {
    id: "6",
    name: "Lisa Anderson",
    company: "BrandBuilders Inc",
    email: "lisa@brandbuilders.com",
    phone: "+1 (555) 678-9012",
    value: "$41,000",
    status: "won",
    source: "Direct Outreach",
    addedDate: "2024-11-30",
    lastContact: "2024-12-04",
    respondedBy: "Account Manager: Ankit Mittal",
    agentStatus: "completed"
  },
  {
    id: "7",
    name: "Robert Martinez",
    company: "Enterprise Solutions",
    email: "robert@enterprise.com",
    phone: "+1 (555) 789-0123",
    value: "$95,000",
    status: "won",
    source: "LinkedIn Outbound",
    addedDate: "2024-11-22",
    lastContact: "2024-12-05",
    respondedBy: "Account Manager: Ankit Mittal",
    agentStatus: "completed"
  },
  {
    id: "8",
    name: "Jennifer Lee",
    company: "Creative Agency",
    email: "jennifer@creativeagency.com",
    phone: "+1 (555) 890-1234",
    value: "$38,000",
    status: "won",
    source: "Cold Email",
    addedDate: "2024-12-04",
    lastContact: "2024-12-03",
    respondedBy: "Account Manager: Ankit Mittal",
    agentStatus: "completed"
  },
];

const statusConfig = {
  new: { label: "New Leads", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  contacted: { label: "Contacted", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  booked: { label: "Booked", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  won: { label: "Won", color: "bg-green-500/10 text-green-400 border-green-500/20" },
};

const personas = [
  {
    id: 1,
    name: "Tech-Forward CMO",
    title: "Chief Marketing Officer",
    company: "SaaS & Tech Companies",
    demographics: {
      ageRange: "35-50",
      location: "Urban Tech Hubs (SF, NYC, Austin)",
      companySize: "50-500 employees"
    },
    characteristics: [
      "Data-driven decision maker",
      "Early adopter of marketing technology",
      "Focused on measurable ROI",
      "Values strategic partnerships"
    ],
    painPoints: [
      "Struggling to unify brand messaging across channels",
      "Needs to prove marketing ROI to board",
      "Overwhelmed by martech stack complexity",
      "Difficulty scaling with limited resources"
    ],
    goals: [
      "Increase brand awareness by 40% in 12 months",
      "Streamline marketing operations",
      "Build a cohesive brand identity",
      "Generate qualified pipeline"
    ]
  },
  {
    id: 2,
    name: "Growth-Minded Founder",
    title: "CEO / Founder",
    company: "Early-Stage Startups",
    demographics: {
      ageRange: "28-45",
      location: "Major Metropolitan Areas",
      companySize: "10-50 employees"
    },
    characteristics: [
      "Visionary and ambitious",
      "Wears multiple hats",
      "Limited marketing budget",
      "Seeks strategic guidance"
    ],
    painPoints: [
      "No clear brand positioning in market",
      "DIY marketing not delivering results",
      "Competitors outpacing in market share",
      "Fundraising requires stronger brand presence"
    ],
    goals: [
      "Establish strong market positioning",
      "Attract Series A funding",
      "Build brand credibility",
      "Accelerate customer acquisition"
    ]
  },
  {
    id: 3,
    name: "Enterprise Marketing Director",
    title: "Marketing Director",
    company: "Established Enterprises",
    demographics: {
      ageRange: "40-55",
      location: "National/Global",
      companySize: "500+ employees"
    },
    characteristics: [
      "Process-oriented and strategic",
      "Manages large teams",
      "Budget conscious with approval processes",
      "Long-term relationship focus"
    ],
    painPoints: [
      "Legacy brand needs modernization",
      "Siloed teams creating inconsistent messaging",
      "Slow approval processes hindering agility",
      "Need to compete with nimble startups"
    ],
    goals: [
      "Modernize brand without losing equity",
      "Create unified brand guidelines",
      "Improve cross-team collaboration",
      "Maintain competitive edge"
    ]
  }
];

const companyProfile = {
  name: "CIELO Marketing",
  positioning: "AI-Enhanced Brand Agency",
  tagline: "White-Glove Consulting Meets High-End SaaS",
  summary: "We combine strategic brand consulting with AI-powered tools to deliver exceptional results for ambitious companies. Our unique approach blends expert human guidance with intelligent automation, enabling clients to build powerful brands that drive measurable growth.",
  valueProposition: "Unlike traditional agencies that bill hourly or pure SaaS platforms that leave you alone, we offer the perfect hybrid: strategic partnership with powerful technology at a predictable monthly investment.",
  targetMarket: "B2B SaaS companies, tech startups, and innovation-driven enterprises seeking to establish or elevate their brand positioning in competitive markets."
};

const messagingFramework = {
  coreMessage: "Build a Brand That Drives Growth",
  supportingMessages: [
    "Strategic Brand Positioning: Position your brand to win in competitive markets",
    "AI-Powered Insights: Data-driven recommendations that accelerate decision-making",
    "White-Glove Service: Dedicated team providing expert guidance every step",
    "Scalable Solutions: Technology and systems that grow with your business"
  ],
  differentiators: [
    "Hybrid model: Strategic consulting + powerful SaaS platform",
    "Predictable pricing: Monthly subscription vs. unpredictable agency retainers",
    "AI-enhanced: Faster insights, better recommendations, smarter execution",
    "Proven results: 40% average increase in brand awareness within 12 months"
  ]
};

export function OutboundPage() {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState("");

  const moveLeadToStatus = (leadId: string, newStatus: Lead["status"]) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  const getLeadsByStatus = (status: Lead["status"]) => {
    return leads.filter(lead => lead.status === status);
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = leads.reduce((acc, lead) => {
    const value = parseInt(lead.value.replace(/[$,]/g, ""));
    return acc + value;
  }, 0);

  const LeadCard = ({ lead }: { lead: Lead }) => {
    const getAgentStatusColor = (status?: string) => {
      switch (status) {
        case "completed":
          return "bg-green-500/10 text-green-400 border-green-500/20";
        case "in-progress":
          return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        case "pending":
          return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        default:
          return "bg-border-subtle/20 text-text-secondary";
      }
    };

    const getAgentStatusLabel = (status?: string) => {
      switch (status) {
        case "completed":
          return "Completed";
        case "in-progress":
          return "In Progress";
        case "pending":
          return "Pending";
        default:
          return "Not Assigned";
      }
    };

    return (
      <Card className="p-4 glass-card border-border-subtle hover:border-cyan-accent/30 transition-all duration-300 cursor-pointer mb-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="text-white truncate">{lead.name}</h5>
                {lead.status === "new" && (
                  <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-xs px-1.5 py-0">
                    NEW
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-text-secondary text-xs">
                <Building2 className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{lead.company}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                  <MoreVertical className="h-4 w-4 text-text-secondary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card-bg border-border-subtle">
                <DropdownMenuItem className="text-white hover:bg-cyan-accent/10">
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-cyan-accent/10">
                  Edit Lead
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-cyan-accent/10">
                  Add Note
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-text-secondary text-xs">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-xs">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{lead.phone}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle space-y-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-1">
                <span className="text-text-secondary text-xs">Estimated Value</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="text-green-400">{lead.value}</span>
              </div>
            </div>

            <Badge variant="outline" className="text-xs bg-border-subtle/20 text-text-secondary w-fit">
              {lead.source}
            </Badge>

            <div className="flex items-center gap-1 text-text-secondary text-xs">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>Added: {new Date(lead.addedDate).toLocaleDateString()}</span>
            </div>

            {lead.lastContact && (
              <div className="flex items-center gap-1 text-text-secondary text-xs">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>Last: {new Date(lead.lastContact).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {lead.respondedBy && (
            <div className="pt-2 border-t border-border-subtle space-y-2">
              <div className="flex items-center gap-1 text-text-secondary text-xs">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{lead.respondedBy}</span>
              </div>
              <Badge 
                variant="outline" 
                className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs px-2 py-0.5 w-fit"
              >
                Replied by Agent
              </Badge>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const PipelineContent = () => (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 glass-card border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-cyan-accent" />
            </div>
            <div>
              <p className="text-2xl text-white">{leads.length}</p>
              <p className="text-text-secondary text-sm">Total Leads</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">${(totalValue / 1000).toFixed(0)}K</p>
              <p className="text-text-secondary text-sm">Pipeline Value</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{getLeadsByStatus("booked").length}</p>
              <p className="text-text-secondary text-sm">Booked</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{getLeadsByStatus("won").length}</p>
              <p className="text-text-secondary text-sm">Won</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search leads by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card-bg border-border-subtle text-white"
            />
          </div>
          <Button variant="outline" className="border-border-subtle text-white hover:bg-card-bg">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {(Object.keys(statusConfig) as Lead["status"][]).map((status) => {
          const statusLeads = searchQuery 
            ? filteredLeads.filter(lead => lead.status === status)
            : getLeadsByStatus(status);
          const config = statusConfig[status];

          return (
            <div key={status} className="min-w-[280px]">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className={config.color}>
                  {config.label} ({statusLeads.length})
                </Badge>
              </div>

              <div className="space-y-0">
                {statusLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
                
                {statusLeads.length === 0 && (
                  <Card className="p-6 glass-card border-border-subtle border-dashed text-center">
                    <p className="text-text-secondary text-sm">No leads</p>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ICPMessagingContent = () => (
    <div className="space-y-6">
      {/* Company Profile */}
      <Card className="p-6 glass-card border-border-subtle">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-cyan-accent" />
          </div>
          <div>
            <h4 className="text-white">{companyProfile.name}</h4>
            <p className="text-text-secondary text-sm">{companyProfile.positioning}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-cyan-accent text-sm mb-2">Tagline</p>
            <p className="text-white">{companyProfile.tagline}</p>
          </div>
          
          <Separator className="bg-border-subtle" />
          
          <div>
            <p className="text-cyan-accent text-sm mb-2">Company Summary</p>
            <p className="text-text-secondary text-sm leading-relaxed">{companyProfile.summary}</p>
          </div>
          
          <div>
            <p className="text-cyan-accent text-sm mb-2">Value Proposition</p>
            <p className="text-text-secondary text-sm leading-relaxed">{companyProfile.valueProposition}</p>
          </div>
          
          <div>
            <p className="text-cyan-accent text-sm mb-2">Target Market</p>
            <p className="text-text-secondary text-sm leading-relaxed">{companyProfile.targetMarket}</p>
          </div>
        </div>
      </Card>

      {/* Messaging Framework */}
      <Card className="p-6 glass-card border-border-subtle">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-purple-400" />
          </div>
          <h4 className="text-white">Messaging Framework</h4>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-purple-400 text-sm mb-2">Core Message</p>
            <p className="text-white text-lg">{messagingFramework.coreMessage}</p>
          </div>

          <Separator className="bg-border-subtle" />

          <div>
            <p className="text-purple-400 text-sm mb-3">Supporting Messages</p>
            <div className="space-y-2">
              {messagingFramework.supportingMessages.map((message, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-accent mt-0.5 flex-shrink-0" />
                  <p className="text-text-secondary text-sm">{message}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border-subtle" />

          <div>
            <p className="text-purple-400 text-sm mb-3">Key Differentiators</p>
            <div className="space-y-2">
              {messagingFramework.differentiators.map((diff, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-text-secondary text-sm">{diff}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ICP Personas */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h4 className="text-white">Ideal Customer Personas</h4>
            <p className="text-text-secondary text-sm">Target audience profiles and characteristics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {personas.map((persona) => (
            <Card key={persona.id} className="p-5 glass-card border-border-subtle">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <h5 className="text-white">{persona.name}</h5>
                      <p className="text-text-secondary text-xs">{persona.title}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-border-subtle/20 text-text-secondary text-xs">
                    {persona.company}
                  </Badge>
                </div>

                <Separator className="bg-border-subtle" />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-3 w-3 text-cyan-accent" />
                    <p className="text-cyan-accent text-xs">Demographics</p>
                  </div>
                  <div className="space-y-1 text-xs text-text-secondary">
                    <p>Age: {persona.demographics.ageRange}</p>
                    <p>Location: {persona.demographics.location}</p>
                    <p>Company: {persona.demographics.companySize}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-3 w-3 text-purple-400" />
                    <p className="text-purple-400 text-xs">Characteristics</p>
                  </div>
                  <ul className="space-y-1">
                    {persona.characteristics.map((char, idx) => (
                      <li key={idx} className="text-xs text-text-secondary flex items-start gap-1">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-3 w-3 text-red-400" />
                    <p className="text-red-400 text-xs">Pain Points</p>
                  </div>
                  <ul className="space-y-1">
                    {persona.painPoints.map((pain, idx) => (
                      <li key={idx} className="text-xs text-text-secondary flex items-start gap-1">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{pain}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-3 w-3 text-green-400" />
                    <p className="text-green-400 text-xs">Goals</p>
                  </div>
                  <ul className="space-y-1">
                    {persona.goals.map((goal, idx) => (
                      <li key={idx} className="text-xs text-text-secondary flex items-start gap-1">
                        <span className="text-green-400 mt-0.5">•</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header with Breadcrumb */}
      <div className="bg-dark-bg border-b border-border-subtle -mx-8 -mt-6 px-8 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
              <span>Strategy</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-cyan-accent">Outbound</span>
            </div>
            <h2 className="text-white">Outbound Lead Generation</h2>
            <p className="text-sm text-text-secondary mt-1">
              Manage your outbound pipeline and review messaging strategy
            </p>
          </div>
          <Button 
            variant="outline" 
            className="border-cyan-accent/30 text-cyan-accent hover:bg-cyan-accent/10 bg-cyan-accent/5"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Set a Strategy Call to Review
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card-bg border border-border-subtle">
          <TabsTrigger 
            value="pipeline" 
            className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
          >
            Pipeline
          </TabsTrigger>
          <TabsTrigger 
            value="icp-messaging"
            className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
          >
            ICP & Messaging
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-6">
          <PipelineContent />
        </TabsContent>

        <TabsContent value="icp-messaging" className="mt-6">
          <ICPMessagingContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}