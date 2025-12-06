import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { 
  Calendar, 
  FileText,
  Download,
  Users,
  CheckCircle,
  Clock,
  User,
  Target,
  Briefcase,
  TrendingUp,
  Eye,
  Edit,
  Bot,
  ExternalLink,
  FileDown,
  Link as LinkIcon,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from "../../utils/supabase/client";
import { toast } from "sonner@2.0.3";

const strategySessions = [
  {
    id: 1,
    title: "Q3 Brand Positioning Workshop",
    date: "2024-07-15",
    duration: "2h 30m",
    participants: ["Sarah Johnson", "Mike Chen", "Alex Rodriguez"],
    status: "completed",
    outcomes: ["Updated brand messaging", "Competitive positioning refined", "Target audience personas updated"],
    documents: ["Brand_Guidelines_v2.1.pdf", "Messaging_Framework.docx"]
  },
  {
    id: 2,
    title: "Market Analysis & Strategy Review",
    date: "2024-07-10",
    duration: "1h 45m",
    participants: ["Sarah Johnson", "David Park", "Emily Watson"],
    status: "completed",
    outcomes: ["Market opportunity identified", "Go-to-market strategy defined", "Resource allocation planned"],
    documents: ["Market_Analysis_Report.pdf", "GTM_Strategy_2024.pdf"]
  },
  {
    id: 3,
    title: "Content Strategy Planning Session",
    date: "2024-07-05",
    duration: "3h 15m",
    participants: ["Content Team", "Brand Team", "Marketing Team"],
    status: "completed",
    outcomes: ["Content calendar created", "Brand voice guidelines established", "Content pillars defined"],
    documents: ["Content_Strategy_Q3.pdf", "Brand_Voice_Guide.pdf", "Content_Calendar_Template.xlsx"]
  },
  {
    id: 4,
    title: "Competitive Intelligence Workshop",
    date: "2024-06-28",
    duration: "2h 00m",
    participants: ["Strategy Team", "Sales Team", "Product Team"],
    status: "completed",
    outcomes: ["Competitor analysis updated", "Differentiation strategy refined", "Sales battlecards created"],
    documents: ["Competitive_Analysis_Q2.pdf", "Differentiation_Matrix.xlsx", "Sales_Battlecards.pdf"]
  }
];

const brandDocuments = [
  {
    id: 1,
    title: "Brand Guidelines v2.1",
    type: "Brand Guidelines",
    dateUpdated: "2024-07-16",
    updatedBy: "Sarah Johnson",
    changes: ["Updated logo usage guidelines", "New color palette variations", "Typography specifications refined"],
    status: "published",
    size: "2.4 MB"
  },
  {
    id: 2,
    title: "Messaging Framework",
    type: "Messaging",
    dateUpdated: "2024-07-15",
    updatedBy: "Mike Chen",
    changes: ["Core value propositions updated", "Audience-specific messaging added", "Tone of voice refined"],
    status: "published",
    size: "1.8 MB"
  },
  {
    id: 3,
    title: "Visual Identity System",
    type: "Visual Identity",
    dateUpdated: "2024-07-12",
    updatedBy: "Alex Rodriguez",
    changes: ["Icon library expanded", "Photography guidelines added", "Social media templates updated"],
    status: "published",
    size: "15.2 MB"
  },
  {
    id: 4,
    title: "Brand Voice & Tone Guide",
    type: "Content Guidelines",
    dateUpdated: "2024-07-08",
    updatedBy: "Emily Watson",
    changes: ["Voice personality traits defined", "Tone examples added", "Do's and don'ts updated"],
    status: "published",
    size: "3.1 MB"
  },
  {
    id: 5,
    title: "Market Positioning Document",
    type: "Strategy",
    dateUpdated: "2024-07-05",
    updatedBy: "David Park",
    changes: ["Competitive positioning updated", "Market segments refined", "Value proposition matrix added"],
    status: "published",
    size: "4.7 MB"
  }
];

// Chart data - showing upward trends
const marketPositioningData = [
  { month: 'Apr', marketPosition: 62, overallScore: 68 },
  { month: 'May', marketPosition: 68, overallScore: 74 },
  { month: 'Jun', marketPosition: 75, overallScore: 80 },
  { month: 'Jul', marketPosition: 82, overallScore: 87 },
];

const strategyImpactData = [
  { week: 'W1', brandAwareness: 68, marketShare: 18, engagement: 74 },
  { week: 'W2', brandAwareness: 72, marketShare: 19, engagement: 78 },
  { week: 'W3', brandAwareness: 75, marketShare: 20, engagement: 82 },
  { week: 'W4', brandAwareness: 78, marketShare: 22, engagement: 85 },
];

type UploadedDocument = {
  id: string;
  clientId: string;
  title: string;
  type: "pdf" | "link" | "document";
  url?: string;
  uploadedBy: string;
  uploadedAt: string;
  category: "strategy" | "report" | "analysis" | "other";
  description: string;
};

export function StrategyPage() {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  useEffect(() => {
    loadUploadedDocuments();
  }, []);

  const loadUploadedDocuments = async () => {
    try {
      const response = await api.getStrategy();
      if (response.success && response.data?.documents) {
        setUploadedDocuments(response.data.documents);
      }
    } catch (error) {
      console.error("Error loading uploaded documents:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'published':
        return 'bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20';
      default:
        return 'bg-text-secondary/10 text-text-secondary border-text-secondary/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Brand Guidelines':
        return <Target className="h-4 w-4" />;
      case 'Messaging':
        return <FileText className="h-4 w-4" />;
      case 'Visual Identity':
        return <Eye className="h-4 w-4" />;
      case 'Content Guidelines':
        return <Edit className="h-4 w-4" />;
      case 'Strategy':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "strategy":
        return <FileText className="h-4 w-4 text-cyan-accent" />;
      case "report":
        return <FileText className="h-4 w-4 text-teal" />;
      case "analysis":
        return <FileText className="h-4 w-4 text-violet" />;
      default:
        return <FileText className="h-4 w-4 text-text-secondary" />;
    }
  };

  const handleDownloadDocument = (doc: UploadedDocument) => {
    if (doc.url) {
      window.open(doc.url, "_blank");
      toast.success(`Opening ${doc.title}`);
    } else {
      toast.error("Document URL not available");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white">Strategy Hub</h3>
          <p className="text-text-secondary mt-1">AI-generated insights, specialist-uploaded strategies, and brand tools</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
            4 Sessions Completed
          </Badge>
          <Badge variant="secondary" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20">
            {uploadedDocuments.length} Team Documents
          </Badge>
        </div>
      </div>

      {/* Strategy Content */}
      <div className="space-y-8">

      {/* SPLIT LAYOUT: AI Analytics (Left) & Specialist Documents (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* LEFT SIDE: AI-Generated Reports & Analytics */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-cyan-accent" />
            <div>
              <h4 className="text-white">AI-Generated Reports & Analytics</h4>
              <p className="text-text-secondary text-sm mt-1">
                Automated insights and performance metrics
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-6">
            {/* Market & Overall Positioning Score */}
            <Card className="p-6 glass-card border-border-subtle">
              <div className="mb-4">
                <h5 className="text-white">Market & Overall Positioning Score</h5>
                <p className="text-text-secondary text-sm mt-1">Upward trending positioning metrics over time</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={marketPositioningData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                  <XAxis dataKey="month" stroke="#888888" />
                  <YAxis stroke="#888888" domain={[50, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111111', 
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="marketPosition" 
                    stroke="#A6E0FF" 
                    strokeWidth={3} 
                    name="Market Position"
                    dot={{ fill: '#A6E0FF', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="overallScore" 
                    stroke="#20C997" 
                    strokeWidth={3} 
                    name="Overall Score"
                    dot={{ fill: '#20C997', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* AI Analysis Description */}
              <div className="mt-4 p-3 bg-cyan-accent/5 border border-cyan-accent/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4 text-cyan-accent" />
                  <Badge variant="secondary" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/30 text-xs">
                    Synced with AI
                  </Badge>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Your market positioning has shown remarkable improvement, climbing from 62 to 82 points over the past four months, representing a 32% increase in competitive strength. 
                  The overall strategy score has similarly advanced from 68 to 87 points, indicating successful implementation of brand differentiation initiatives and market penetration tactics. 
                  This upward trajectory suggests your positioning strategy is effectively resonating with target audiences and creating sustainable competitive advantages in your sector.
                </p>
              </div>
            </Card>

            {/* Strategy Impact Metrics */}
            <Card className="p-6 glass-card border-border-subtle">
              <div className="mb-4">
                <h5 className="text-white">Strategy Impact Metrics</h5>
                <p className="text-text-secondary text-sm mt-1">Key performance indicators over the past month</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={strategyImpactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                  <XAxis dataKey="week" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111111', 
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="brandAwareness" 
                    stroke="#A6E0FF" 
                    strokeWidth={2} 
                    name="Brand Awareness (%)"
                    dot={{ fill: '#A6E0FF', strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="marketShare" 
                    stroke="#20C997" 
                    strokeWidth={2} 
                    name="Market Share (%)"
                    dot={{ fill: '#20C997', strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#6F42C1" 
                    strokeWidth={2} 
                    name="Engagement Score"
                    dot={{ fill: '#6F42C1', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* AI Analysis Description */}
              <div className="mt-4 p-3 bg-cyan-accent/5 border border-cyan-accent/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4 text-cyan-accent" />
                  <Badge variant="secondary" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/30 text-xs">
                    Synced with AI
                  </Badge>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  All three strategic KPIs demonstrate consistent positive momentum, with brand awareness increasing 15% from 68% to 78% over the four-week period. 
                  Market share has expanded from 18% to 22%, representing a significant 22% growth that outpaces industry benchmarks for similar timeframes. 
                  The engagement score improvement from 74 to 85 points indicates strong audience connection and validates the effectiveness of recent content strategy implementations and brand messaging refinements.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT SIDE: Specialist-Uploaded Documents & Strategies */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-teal" />
            <div>
              <h4 className="text-white">Specialist Documents & Strategies</h4>
              <p className="text-text-secondary text-sm mt-1">
                Reports and strategies uploaded by your team
              </p>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="space-y-3">
            {uploadedDocuments.length === 0 ? (
              <Card className="p-8 glass-card border-border-subtle text-center">
                <FileText className="h-12 w-12 text-text-secondary mx-auto mb-3 opacity-50" />
                <p className="text-text-secondary">No specialist documents yet</p>
                <p className="text-text-secondary text-sm mt-1">
                  Your team will upload strategy documents and reports here
                </p>
              </Card>
            ) : (
              uploadedDocuments.map((doc) => (
                <Card key={doc.id} className="p-5 glass-card border-border-subtle hover:border-cyan-accent/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {doc.type === "link" ? (
                        <LinkIcon className="h-5 w-5 text-teal" />
                      ) : (
                        getCategoryIcon(doc.category)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-white truncate mb-1">{doc.title}</h5>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="bg-teal/10 text-teal border-teal/20 text-xs">
                              {doc.category}
                            </Badge>
                            <Badge variant="secondary" className="bg-border-subtle/20 text-text-secondary text-xs">
                              {doc.type}
                            </Badge>
                          </div>
                        </div>
                        {doc.type === "link" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                            className="text-text-secondary hover:text-teal flex-shrink-0"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                            className="text-text-secondary hover:text-teal flex-shrink-0"
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                        {doc.description}
                      </p>
                      <div className="flex items-center gap-3 text-text-secondary text-xs">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{doc.uploadedBy}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Info Card */}
          <Card className="p-4 glass-card border-border-subtle bg-teal/5 border-teal/20">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm mb-1">Collaborative Strategy</p>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Your dedicated team uploads curated strategies, reports, and resources to complement AI-generated insights. 
                  These documents include expert analysis, custom recommendations, and specialized content tailored to your brand.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Separator className="bg-border-subtle" />

      {/* Strategy Sessions Completed */}
      <section>
        <div className="mb-6">
          <h4 className="text-white">Strategy Sessions Completed</h4>
          <p className="text-text-secondary text-sm mt-1">Recent strategy workshops and planning sessions</p>
        </div>

        <div className="space-y-4">
          {strategySessions.map((session) => (
            <Card key={session.id} className="p-6 glass-card border-border-subtle">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <h5 className="text-white">{session.title}</h5>
                      <div className="flex items-center gap-4 text-text-secondary text-sm mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(session.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{session.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{session.participants.length} participants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className={getStatusColor(session.status)}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {session.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h6 className="text-white text-sm mb-2">Key Outcomes</h6>
                  <ul className="space-y-1">
                    {session.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2 text-text-secondary text-sm">
                        <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h6 className="text-white text-sm mb-2">Documents Created</h6>
                  <div className="space-y-1">
                    {session.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 text-text-secondary text-sm">
                        <FileText className="h-3 w-3 text-cyan-accent" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border-subtle">
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                  <span>Participants:</span>
                  <div className="flex items-center gap-1">
                    {session.participants.map((participant, index) => (
                      <Badge key={index} variant="secondary" className="bg-border-subtle/20 text-text-secondary text-xs">
                        {participant}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="bg-border-subtle" />

      {/* Updated Brand Documents */}
      <section>
        <div className="mb-6">
          <h4 className="text-white">Updated Brand Documents</h4>
          <p className="text-text-secondary text-sm mt-1">Recently updated brand guidelines and documentation</p>
        </div>

        <div className="space-y-4">
          {brandDocuments.map((doc) => (
            <Card key={doc.id} className="p-6 glass-card border-border-subtle">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
                    {getTypeIcon(doc.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="text-white">{doc.title}</h5>
                      <Badge variant="secondary" className="bg-border-subtle/20 text-text-secondary text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-text-secondary text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Updated {new Date(doc.dateUpdated).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>by {doc.updatedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white hover:bg-card-bg nav-item-glow transition-all duration-300">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h6 className="text-white text-sm mb-2">Recent Changes</h6>
                <ul className="space-y-1">
                  {doc.changes.map((change, index) => (
                    <li key={index} className="flex items-start gap-2 text-text-secondary text-sm">
                      <CheckCircle className="h-3 w-3 text-cyan-accent mt-0.5 flex-shrink-0" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Summary Stats */}
      <Card className="p-6 glass-card border-border-subtle">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Briefcase className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-2xl text-white mb-1">4</p>
            <p className="text-text-secondary text-sm">Strategy Sessions</p>
            <p className="text-green-400 text-xs mt-1">Completed this month</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-cyan-accent" />
            </div>
            <p className="text-2xl text-white mb-1">5</p>
            <p className="text-text-secondary text-sm">Documents Updated</p>
            <p className="text-cyan-accent text-xs mt-1">Published this month</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-2xl text-white mb-1">12</p>
            <p className="text-text-secondary text-sm">Total Session Hours</p>
            <p className="text-orange-500 text-xs mt-1">Invested in strategy</p>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}
