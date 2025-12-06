import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize2, 
  Share,
  ChevronDown,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Download
} from "lucide-react";
import exampleImage from 'figma:asset/c0e649b6cb143e450b5a192cc78ccec20c812e62.png';

export function LatestRecordingWindow() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration] = useState("20:16");
  const [playbackSpeed, setPlaybackSpeed] = useState("1x");
  const [activeTab, setActiveTab] = useState("summary");

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex h-[600px]">
        {/* Video Player Section */}
        <div className="flex-1 bg-black relative">
          {/* Video Area */}
          <div className="w-full h-full flex items-center justify-center relative">
            <img 
              src={exampleImage} 
              alt="Meeting recording" 
              className="w-full h-full object-cover"
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-white/20 h-1 rounded-full">
                  <div className="bg-white h-1 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm">{currentTime} / {duration}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/20 flex items-center gap-1"
                  >
                    {playbackSpeed}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                    <Share className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Additional Controls */}
              <div className="flex items-center justify-between mt-3 text-white text-sm">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 text-xs">
                    🎧 Listen to
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 text-xs">
                    💬 Comment
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 text-xs">
                    ✂️ Create clip
                  </Button>
                </div>
              </div>
              
              {/* Speaker Timeline */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Ankit CIELO Agency</span>
                  <span className="text-gray-400">Spoke: 22% • 5m</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>CIELO Agency Management</span>
                  <span className="text-gray-400">Spoke: 25% • 6m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="w-96 bg-card border-l border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h4>Insights</h4>
            
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
              <TabsList className="grid w-full grid-cols-4 text-xs">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="trackers">Trackers</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="summary" className="p-4 space-y-4 m-0">
                {/* Ask Input */}
                <div className="relative">
                  <Input 
                    placeholder="Ask anything about this meeting"
                    className="glass-card border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                  />
                  <Sparkles className="absolute right-3 top-3 h-4 w-4 text-primary" />
                </div>
                
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>6 sections generated</span>
                  <Download className="h-3 w-3" />
                </div>
                
                {/* Outcome Section */}
                <div className="space-y-3">
                  <h5>Outcome</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ankit from CIELO Agency confirmed that the SCP project is completed and 
                    signed off by the client. Some minor image adjustments pending. They discussed 
                    ongoing tasks related to the search fund, with some items awaiting feedback from 
                    Ruben. Ankit is following up with Enum regarding JIRA tasks and automation. 
                    CIELO Agency Management is working on a presentation for Mast and is open to 
                    discussing additional budget for security measures against hacking for 
                    Specialized. Payments are scheduled to be released by Friday end of the day. Both 
                    parties agreed to keep communication open for any further support needed.
                  </p>
                </div>
                
                {/* Pricing Section */}
                <div className="space-y-3">
                  <h5>Pricing</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In the conversation, there is a mention of needing to get an additional budget 
                    approved for a task related to securing a website from hacking. Ankit from CIELO 
                    Agency indicates that he will estimate the technical team and pass the information 
                    to CIELO Agency Management for further discussion on the budget. This implies a 
                    pricing discussion regarding the budget for the security task, but specific figures 
                    or detailed pricing information are not provided. Therefore, the pricing discussion 
                    can be summarized as follows: Ankit CIELO Agency mentioned the need to secure 
                    a website from hacking and indicated that he would estimate the costs and seek 
                    approval for an additional budget for that task. If you need more specific details or 
                    a different format, please let me know!
                  </p>
                </div>
                
                {/* Feedback */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">Help us improve! Is this summary useful?</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-1">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="transcript" className="p-4 m-0">
                <div className="space-y-4">
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground mb-1">0:00</div>
                    <div><strong>Ankit CIELO Agency:</strong> Good morning everyone, let's get started with our weekly sync...</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground mb-1">0:15</div>
                    <div><strong>CIELO Agency Management:</strong> Thanks Ankit. I wanted to discuss the SCP project status...</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trackers" className="p-4 m-0">
                <div className="space-y-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Project Completed
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Pending Feedback
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Budget Discussion
                  </Badge>
                </div>
              </TabsContent>
              
              <TabsContent value="comments" className="p-4 m-0">
                <div className="text-sm text-muted-foreground">
                  No comments yet. Be the first to add a comment!
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Card>
  );
}