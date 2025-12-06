import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { 
  Bot, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  FileText, 
  Download,
  Eye,
  MoreHorizontal
} from "lucide-react";

interface ChatMessage {
  id: string;
  agent: string;
  message: string;
  timestamp: string;
  type: 'insight' | 'analysis' | 'recommendation';
  confidence?: number;
}

interface GeneratedReport {
  id: string;
  title: string;
  agent: string;
  generatedAt: string;
  size: string;
  type: string;
}

export function AIOutputPage() {
  const chatHistory: ChatMessage[] = [
    {
      id: "1",
      agent: "Brand Developer Agent",
      message: "I've completed the brand positioning analysis. Your current messaging shows 94% alignment with your target audience's values. The key differentiator should focus on innovation and reliability rather than price competition.",
      timestamp: "2 hours ago",
      type: "analysis",
      confidence: 94
    },
    {
      id: "2",
      agent: "Market Intelligence Agent",
      message: "Market analysis indicates a 23% growth opportunity in the mid-market segment. I recommend shifting 40% of marketing budget toward digital transformation messaging to capture this audience.",
      timestamp: "3 hours ago",
      type: "recommendation",
      confidence: 89
    },
    {
      id: "3",
      agent: "Content Strategy Agent",
      message: "Content performance data shows case studies generate 3x more engagement than product features. I suggest creating 2 new case studies focusing on ROI outcomes for similar companies.",
      timestamp: "4 hours ago",
      type: "insight",
      confidence: 92
    },
    {
      id: "4",
      agent: "Brand Developer Agent",
      message: "Competitive analysis complete. Your main competitors are focusing heavily on enterprise features. There's a clear opportunity to dominate the mid-market space with simplified onboarding and transparent pricing.",
      timestamp: "5 hours ago",
      type: "analysis",
      confidence: 87
    }
  ];

  const generatedReports: GeneratedReport[] = [
    {
      id: "1",
      title: "Brand Positioning Deep Dive",
      agent: "Brand Developer Agent",
      generatedAt: "2 hours ago",
      size: "3.2 MB",
      type: "pdf"
    },
    {
      id: "2",
      title: "Market Opportunity Analysis",
      agent: "Market Intelligence Agent", 
      generatedAt: "3 hours ago",
      size: "2.8 MB",
      type: "pdf"
    },
    {
      id: "3",
      title: "Content Performance Report",
      agent: "Content Strategy Agent",
      generatedAt: "4 hours ago",
      size: "1.9 MB",
      type: "pdf"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'insight':
        return 'bg-[#20C997]/10 text-[#20C997]';
      case 'analysis':
        return 'bg-primary/10 text-primary';
      case 'recommendation':
        return 'bg-[#6F42C1]/10 text-[#6F42C1]';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:card-glow transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Insights</p>
              <p className="text-xl">156</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:card-glow transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#20C997]/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-[#20C997]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
              <p className="text-xl">91%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:card-glow transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6F42C1]/10 rounded-lg">
              <FileText className="h-4 w-4 text-[#6F42C1]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reports Generated</p>
              <p className="text-xl">23</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:card-glow transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <p className="text-xl">3</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat History */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <div className="p-4 border-b border-border">
              <h3>Agent Conversation History</h3>
              <p className="text-sm text-muted-foreground mt-1">Real-time insights and analysis from your AI agents</p>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatHistory.map((message) => (
                  <div key={message.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{message.agent}</span>
                          <Badge variant="secondary" className={getTypeColor(message.type)}>
                            {message.type}
                          </Badge>
                          {message.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {message.confidence}% confidence
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {message.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Generated Reports */}
        <div className="space-y-6">
          <Card className="p-4">
            <h4 className="mb-4">Generated Reports</h4>
            <div className="space-y-3">
              {generatedReports.map((report) => (
                <div key={report.id} className="p-3 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{report.title}</p>
                        <p className="text-xs text-muted-foreground">{report.agent}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{report.size}</span>
                        <span>•</span>
                        <span>{report.generatedAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h4 className="mb-4">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start hover:glow-blue transition-all duration-300">
                <MessageSquare className="h-4 w-4 mr-2" />
                Start New Analysis
              </Button>
              <Button variant="outline" className="w-full justify-start hover:glow-teal transition-all duration-300">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start hover:glow-violet transition-all duration-300">
                <TrendingUp className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}