import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Download, FileText, TrendingUp, ArrowUp } from "lucide-react";

export function StrategySection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Strategy Preview */}
      <div className="lg:col-span-2">
        <Card className="p-6 bg-gradient-to-br from-card to-accent/5 border-border/50 hover:card-glow transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <h4>AI Strategy Preview</h4>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              Based on your brand analysis, we recommend focusing on digital transformation messaging 
              to differentiate from competitors. Key positioning should emphasize innovation, reliability, 
              and customer success. Target messaging should highlight ROI and efficiency gains for 
              mid-market companies.
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <Badge variant="secondary" className="bg-[#20C997]/10 text-[#20C997]">
                Strategy Complete
              </Badge>
              <Badge variant="outline" className="border-primary/20 text-primary">
                Updated 2 hours ago
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Market Score */}
      <div className="space-y-4">
        <Card className="p-6 text-center bg-gradient-to-br from-card to-accent/5 border-border/50 hover:card-glow transition-all duration-300">
          <div className="space-y-3">
            <h4>Market Score</h4>
            <div className="relative">
              <div className="text-3xl text-primary">87</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <ArrowUp className="h-3 w-3 text-[#20C997]" />
                <span className="text-sm text-[#20C997]">+12%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              vs. industry average
            </p>
          </div>
        </Card>

        {/* Download Cards */}
        <div className="space-y-3">
          <Card className="p-4 hover:bg-accent/5 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm">Full Strategy.pdf</p>
                  <p className="text-xs text-muted-foreground">2.3 MB</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="group-hover:glow-blue transition-all duration-300">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-4 hover:bg-accent/5 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#6F42C1]/10 rounded-lg group-hover:bg-[#6F42C1]/20 transition-colors">
                  <TrendingUp className="h-4 w-4 text-[#6F42C1]" />
                </div>
                <div>
                  <p className="text-sm">Visual Report.pdf</p>
                  <p className="text-xs text-muted-foreground">2.7 MB</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="group-hover:glow-violet transition-all duration-300">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}