import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { LatestRecordingWindow } from "../LatestRecordingWindow";
import { 
  Search, 
  Filter, 
  FileText, 
  Video, 
  Download, 
  Eye, 
  Calendar,
  Clock,
  Users,
  Archive,
  Database,
  BarChart3
} from "lucide-react";

interface MeetingNote {
  id: string;
  title: string;
  date: string;
  duration: string;
  attendees: string[];
  type: 'strategy' | 'review' | 'planning' | 'presentation';
  hasRecording: boolean;
  summary: string;
  tags: string[];
  content?: string;
  transcript?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: 'strategy' | 'research' | 'creative' | 'reports';
  downloadCount: number;
}

interface DataMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

type DataArchivePageProps = {
  viewMode?: "client" | "team";
  onViewDetail?: (item: any) => void;
};

export function DataArchivePage({ viewMode = "client", onViewDetail }: DataArchivePageProps) {
  const [activeTab, setActiveTab] = useState("meetings");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");

  const meetingNotes: MeetingNote[] = [
    {
      id: "1",
      title: "Brand Strategy Kickoff",
      date: "2024-07-15",
      duration: "1h 30m",
      attendees: ["Sarah Chen", "Marcus Johnson", "David Kim"],
      type: "strategy",
      hasRecording: true,
      summary: "Initial brand discovery session covering company goals, target audience analysis, and competitive landscape review.",
      tags: ["kickoff", "strategy", "discovery"],
      content: `# Brand Strategy Kickoff Session

## Overview
This initial brand discovery session covered company goals, target audience analysis, and competitive landscape review. The team gathered to align on the strategic direction for the brand refresh initiative.

## Key Discussion Points

### Company Goals & Objectives
- Increase brand awareness by 40% in the next 12 months
- Establish thought leadership in the industry
- Modernize brand identity to appeal to younger demographics (25-40 age range)
- Improve brand consistency across all touchpoints

### Target Audience Analysis
Primary Audience:
- Age: 28-42
- Income: $75,000 - $150,000
- Tech-savvy professionals
- Value sustainability and authenticity
- Active on social media platforms

Secondary Audience:
- Age: 45-60
- Decision makers in enterprise companies
- Focus on ROI and proven results

### Competitive Landscape
Key competitors identified:
1. CompetitorA - Strong digital presence, modern aesthetic
2. CompetitorB - Traditional brand, established trust
3. CompetitorC - Innovative positioning, younger appeal

### Next Steps
- Conduct additional market research surveys
- Develop initial brand positioning concepts
- Schedule follow-up creative review session
- Begin competitor social media audit`,
      transcript: `[00:00:12] Sarah Chen: Good morning everyone, thanks for joining today's brand strategy kickoff. I'm excited to dive into this project with you all.

[00:00:20] Marcus Johnson: Thanks Sarah. I've reviewed the brief and I think we have a great opportunity here.

[00:00:25] David Kim: Agreed. The market research data we've gathered is really compelling.

[00:00:30] Sarah Chen: Perfect. Let's start with the company goals. Based on our initial conversations, the primary objective is to increase brand awareness by 40% over the next 12 months. That's ambitious but achievable.

[00:00:45] Marcus Johnson: The key will be modernizing the brand identity while maintaining the trust they've built over the years.

[00:01:02] David Kim: Right. Our research shows their current brand skews older, around 45-60 demographic. But they want to appeal to the 28-42 range without alienating existing customers.

[00:01:18] Sarah Chen: That's the challenge. Let's talk about the target audience in more detail...

[00:15:32] Marcus Johnson: Looking at the competitive landscape, CompetitorA has really nailed the digital presence. Their social media strategy is strong.

[00:15:45] David Kim: But they lack the trust factor. That's where our client has an advantage - 15 years of proven results.

[00:16:00] Sarah Chen: Exactly. We need to bridge that gap. Modern aesthetic, strong digital presence, but leveraging their credibility.

[01:20:15] Sarah Chen: Great session everyone. I'll send out the meeting notes and action items this afternoon. David, can you lead the market research surveys?

[01:20:28] David Kim: Absolutely, I'll have the survey draft ready by end of week.

[01:20:35] Marcus Johnson: And I'll start on some initial brand positioning concepts.

[01:20:40] Sarah Chen: Perfect. Let's reconvene in two weeks for the creative review. Thanks everyone!`
    },
    {
      id: "2", 
      title: "Creative Direction Review",
      date: "2024-07-12",
      duration: "45m",
      attendees: ["Marcus Johnson", "Elena Rodriguez"],
      type: "review",
      hasRecording: true,
      summary: "Review of initial creative concepts and brand identity exploration. Discussed color palettes and typography options.",
      tags: ["creative", "review", "design"],
      content: `# Creative Direction Review

## Session Summary
Review of initial creative concepts and brand identity exploration. The team evaluated three distinct creative directions and narrowed down color palettes and typography options.

## Creative Concepts Presented

### Concept A: Modern Minimalist
- Clean lines and generous white space
- Sans-serif typography (Helvetica Neue, Proxima Nova)
- Color palette: Navy blue (#1A2B4C), Cyan accent (#A6E0FF), White
- Feeling: Professional, trustworthy, contemporary

### Concept B: Bold & Dynamic
- Energetic use of color and movement
- Mix of serif and sans-serif fonts
- Color palette: Deep purple (#6B2D5C), Electric blue (#00D4FF), Orange accent
- Feeling: Innovative, exciting, forward-thinking

### Concept C: Organic & Approachable
- Rounded shapes and warm tones
- Friendly sans-serif typography (Circular, Inter)
- Color palette: Forest green (#2D5B4E), Warm beige (#E8D5C4), Terracotta
- Feeling: Authentic, sustainable, welcoming

## Typography Recommendations
Primary choices:
1. Helvetica Neue - Classic, versatile, highly readable
2. Proxima Nova - Modern, friendly, great for digital
3. Inter - Open-source, optimized for screens

## Next Steps
- Client presentation of top 2 concepts
- Develop full brand guidelines for selected direction
- Begin applying identity to key touchpoints`,
      transcript: `[00:00:05] Marcus Johnson: Hey Elena, thanks for joining. I'm excited to walk through these concepts with you.

[00:00:10] Elena Rodriguez: Of course! I've been looking forward to seeing what you've developed.

[00:00:15] Marcus Johnson: So I've put together three distinct directions based on our strategy session last week. Let me start with Concept A...

[00:05:30] Elena Rodriguez: I really like the modern minimalist approach. It feels professional without being cold.

[00:05:40] Marcus Johnson: That was the goal. The navy blue provides authority while the cyan accent brings in that modern tech feel.

[00:10:22] Elena Rodriguez: What about the bold and dynamic direction? This is interesting but might be too far from their current brand.

[00:10:35] Marcus Johnson: Good point. It's definitely the biggest departure. But some clients want that dramatic shift.

[00:15:10] Marcus Johnson: The organic and approachable concept plays into the sustainability angle.

[00:15:20] Elena Rodriguez: The colors are beautiful, but I wonder if it's too soft for their B2B audience.

[00:20:45] Marcus Johnson: For typography, I'm leaning heavily toward Proxima Nova or Inter. Both are incredibly versatile.

[00:30:15] Elena Rodriguez: I think we present A and B to the client. A is the safe, smart choice. B is the bold vision.

[00:30:25] Marcus Johnson: Agreed. I'll build out full mockups of both for the client presentation next week.`
    },
    {
      id: "3",
      title: "Market Research Presentation",
      date: "2024-07-08", 
      duration: "1h 15m",
      attendees: ["David Kim", "Sarah Chen"],
      type: "presentation",
      hasRecording: false,
      summary: "Comprehensive market analysis presentation covering industry trends, competitor analysis, and opportunity mapping.",
      tags: ["research", "market", "analysis"],
      content: `# Market Research Presentation

## Executive Summary
Comprehensive market analysis covering industry trends, competitor analysis, and opportunity mapping. Research conducted through surveys (n=500), social listening, and competitive audits.

## Industry Trends

### Key Findings
1. Digital-first approach is now table stakes
   - 78% of target audience researches brands online before engaging
   - Social proof and reviews critical to decision-making

2. Authenticity and transparency valued over perfection
   - User-generated content outperforms polished marketing materials
   - Behind-the-scenes content drives engagement

3. Sustainability increasingly important
   - 64% of millennials willing to pay premium for sustainable brands
   - ESG reporting becoming expected, not optional

## Competitor Analysis

### CompetitorA
Strengths:
- Strong digital presence (425K social followers)
- Modern, cohesive brand identity
- Excellent content marketing strategy

Weaknesses:
- Limited thought leadership
- Newer company, less established trust
- Premium pricing may limit market penetration

### CompetitorB
Strengths:
- 20+ years of industry experience
- Strong reputation and trust
- Extensive case studies and proof points

Weaknesses:
- Outdated brand identity
- Weak social media presence
- Not appealing to younger demographics

### CompetitorC
Strengths:
- Innovative positioning
- Appeals to younger audience
- Strong company culture and employer brand

Weaknesses:
- Inconsistent messaging
- Limited service offerings
- Geographic limitations

## Opportunity Map

### White Space Opportunities
1. Bridge the gap between traditional trust and modern appeal
2. Thought leadership in emerging technologies
3. Sustainability-focused positioning in the space
4. Enhanced digital experience and tools

### Recommended Strategic Position
"Trusted innovation partner bringing 15 years of expertise to modern challenges"

## Survey Insights

Sample size: 500 respondents
Target demographic: Business decision-makers, 28-55 years old

Key Statistics:
- 82% value proven track record over trendy branding
- 76% expect seamless digital experience
- 68% research companies on social media before contacting
- 91% prefer brands with clear values and mission

## Recommendations
1. Modernize brand identity while leveraging existing trust
2. Invest in content marketing and thought leadership
3. Develop robust social media strategy
4. Create digital tools and resources for clients
5. Clearly communicate sustainability initiatives`
    },
    {
      id: "4",
      title: "Weekly Planning Session",
      date: "2024-07-05",
      duration: "30m",
      attendees: ["Sarah Chen", "Marcus Johnson", "Elena Rodriguez", "David Kim"],
      type: "planning",
      hasRecording: true,
      summary: "Team planning session for upcoming deliverables and milestone reviews. Assigned tasks and set deadlines.",
      tags: ["planning", "team", "deliverables"]
    }
  ];

  const documents: Document[] = [
    {
      id: "1",
      name: "Brand Strategy Framework v2.pdf",
      type: "pdf",
      size: "3.2 MB",
      uploadDate: "2024-07-14",
      category: "strategy",
      downloadCount: 12
    },
    {
      id: "2",
      name: "Market Research Report.xlsx",
      type: "spreadsheet", 
      size: "5.1 MB",
      uploadDate: "2024-07-10",
      category: "research",
      downloadCount: 8
    },
    {
      id: "3",
      name: "Creative Concepts Presentation.pptx",
      type: "presentation",
      size: "15.7 MB", 
      uploadDate: "2024-07-08",
      category: "creative",
      downloadCount: 15
    },
    {
      id: "4",
      name: "Analytics Dashboard Export.csv",
      type: "csv",
      size: "2.3 MB",
      uploadDate: "2024-07-06",
      category: "reports",
      downloadCount: 5
    }
  ];

  const dataMetrics: DataMetric[] = [
    { label: "Total Documents", value: "47", change: "+5", trend: "up" },
    { label: "Meeting Hours", value: "23.5", change: "+2.5", trend: "up" },
    { label: "Downloads", value: "156", change: "+12", trend: "up" },
    { label: "Archive Size", value: "1.2 GB", change: "+85 MB", trend: "up" }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strategy':
        return 'bg-primary/10 text-primary';
      case 'review':
        return 'bg-orange-500/10 text-orange-500';
      case 'planning':
        return 'bg-[#6F42C1]/10 text-[#6F42C1]';
      case 'presentation':
        return 'bg-[#20C997]/10 text-[#20C997]';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strategy':
        return 'bg-primary/10 text-primary';
      case 'research':
        return 'bg-orange-500/10 text-orange-500';
      case 'creative':
        return 'bg-[#6F42C1]/10 text-[#6F42C1]';
      case 'reports':
        return 'bg-[#20C997]/10 text-[#20C997]';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[rgb(255,255,255)]">Data Archive</h3>
          <p className="text-sm text-muted-foreground mt-1">Meeting notes, documents, and historical data</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Backup
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dataMetrics.map((metric, index) => (
          <Card key={index} className="p-4 hover:card-glow transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl">{metric.value}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-[#20C997]">
                <BarChart3 className="h-4 w-4" />
                {metric.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Latest Recording */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4>Latest Recording</h4>
            <p className="text-sm text-muted-foreground mt-1">Most recent meeting with AI-powered insights</p>
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            Live
          </Badge>
        </div>
        <LatestRecordingWindow />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meetings">Meeting Notes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search meeting notes..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="strategy">Strategy</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Meeting Notes List */}
          <div className="space-y-3">
            {meetingNotes.map((note) => (
              <Card 
                key={note.id} 
                className="p-4 hover:bg-accent/5 transition-colors cursor-pointer"
                onClick={() => onViewDetail && onViewDetail(note)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <h4>{note.title}</h4>
                      <Badge variant="secondary" className={getTypeColor(note.type)}>
                        {note.type}
                      </Badge>
                      {note.hasRecording && (
                        <Badge variant="outline" className="text-xs">
                          <Video className="h-3 w-3 mr-1" />
                          Recorded
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{note.summary}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {note.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {note.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {note.attendees.length} attendees
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewDetail && onViewDetail(note)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search documents..." className="pl-9" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="strategy">Strategy</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-4 hover:bg-accent/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="truncate">{doc.name}</h4>
                        <Badge variant="secondary" className={getCategoryColor(doc.category)}>
                          {doc.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{doc.size}</span>
                        <span>Uploaded {doc.uploadDate}</span>
                        <span>{doc.downloadCount} downloads</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h4 className="mb-4">Archive Analytics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5>Most Accessed Documents</h5>
                <div className="space-y-2">
                  {documents.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 border border-border rounded">
                      <span className="text-sm truncate">{doc.name}</span>
                      <span className="text-xs text-muted-foreground">{doc.downloadCount} downloads</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h5>Recent Activity</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border border-border rounded">
                    <span className="text-sm">Document uploaded</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border border-border rounded">
                    <span className="text-sm">Meeting recorded</span>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border border-border rounded">
                    <span className="text-sm">Archive exported</span>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}