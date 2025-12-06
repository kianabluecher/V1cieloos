import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Eye,
  MousePointerClick,
  BarChart3,
  Plus,
  Users,
  TrendingDown,
  Activity
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import ad1 from "figma:asset/dc6a05187f0051f4ce2a33afc3b5ddb751f2e7c6.png";
import ad2 from "figma:asset/05b723c1be96518f01dc0a5364cb61bfffa7e114.png";
import ad3 from "figma:asset/e0ab49842594fac8d122138b205e8e9503d7076d.png";

const adCampaigns = [
  {
    id: 1,
    name: "Tesamorelin BOGO Sale",
    image: ad1,
    platform: "Meta Ads",
    status: "active",
    metrics: {
      impressions: 847230,
      clicks: 3421,
      conversions: 156,
      spend: 4235,
      ctr: 0.40,
      cpc: 1.24,
      cpa: 27.15,
      roas: 3.8
    }
  },
  {
    id: 2,
    name: "Derma Filler BOGO Promo",
    image: ad2,
    platform: "Instagram",
    status: "active",
    metrics: {
      impressions: 1234567,
      clicks: 2845,
      conversions: 98,
      spend: 3180,
      ctr: 0.23,
      cpc: 1.12,
      cpa: 32.45,
      roas: 2.9
    }
  },
  {
    id: 3,
    name: "CoolPeel Laser Promo",
    image: ad3,
    platform: "Google Ads",
    status: "active",
    metrics: {
      impressions: 532890,
      clicks: 2156,
      conversions: 88,
      spend: 5085,
      ctr: 0.40,
      cpc: 2.36,
      cpa: 57.78,
      roas: 2.1
    }
  }
];

export function AdsPage() {
  const totalSpend = adCampaigns.reduce((acc, campaign) => acc + campaign.metrics.spend, 0);
  const totalImpressions = adCampaigns.reduce((acc, campaign) => acc + campaign.metrics.impressions, 0);
  const totalClicks = adCampaigns.reduce((acc, campaign) => acc + campaign.metrics.clicks, 0);
  const totalConversions = adCampaigns.reduce((acc, campaign) => acc + campaign.metrics.conversions, 0);
  const avgCTR = (totalClicks / totalImpressions * 100).toFixed(2);
  const avgCPC = (totalSpend / totalClicks).toFixed(2);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white">Advertising Campaign Manager</h3>
          <p className="text-text-secondary mt-1">Track and optimize your paid advertising campaigns</p>
        </div>
        <Button className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Overall Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 glass-card border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-cyan-accent" />
            </div>
            <div>
              <p className="text-2xl text-white">${formatNumber(totalSpend)}</p>
              <p className="text-text-secondary text-sm">Total Spend</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{formatNumber(totalImpressions)}</p>
              <p className="text-text-secondary text-sm">Impressions</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <MousePointerClick className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{formatNumber(totalClicks)}</p>
              <p className="text-text-secondary text-sm">Clicks</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{totalConversions}</p>
              <p className="text-text-secondary text-sm">Conversions</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Campaigns */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white">Active Campaigns</h4>
            <p className="text-text-secondary text-sm">Live advertising campaigns with real-time metrics</p>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
            {adCampaigns.length} Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {adCampaigns.map((campaign) => (
            <Card key={campaign.id} className="glass-card border-border-subtle overflow-hidden">
              {/* Campaign Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-card-bg">
                <ImageWithFallback
                  src={campaign.image}
                  alt={campaign.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 backdrop-blur-sm">
                    Live
                  </Badge>
                </div>
              </div>

              {/* Campaign Info */}
              <div className="p-5 space-y-4">
                <div>
                  <h5 className="text-white mb-1">{campaign.name}</h5>
                  <Badge variant="outline" className="bg-border-subtle/20 text-text-secondary text-xs">
                    {campaign.platform}
                  </Badge>
                </div>

                {/* Key Metrics Row 1 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-blue-400" />
                      <p className="text-text-secondary text-xs">Impressions</p>
                    </div>
                    <p className="text-white">{formatNumber(campaign.metrics.impressions)}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <MousePointerClick className="h-3 w-3 text-purple-400" />
                      <p className="text-text-secondary text-xs">Clicks</p>
                    </div>
                    <p className="text-white">{formatNumber(campaign.metrics.clicks)}</p>
                  </div>
                </div>

                {/* Key Metrics Row 2 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-green-400" />
                      <p className="text-text-secondary text-xs">Conversions</p>
                    </div>
                    <p className="text-white">{campaign.metrics.conversions}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-cyan-accent" />
                      <p className="text-text-secondary text-xs">Spend</p>
                    </div>
                    <p className="text-white">${formatNumber(campaign.metrics.spend)}</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">CTR:</span>
                      <span className="text-white">{campaign.metrics.ctr}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">CPC:</span>
                      <span className="text-white">${campaign.metrics.cpc}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">CPA:</span>
                      <span className="text-white">${campaign.metrics.cpa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">ROAS:</span>
                      <span className="text-green-400">{campaign.metrics.roas}x</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-border-subtle text-white hover:bg-card-bg text-xs h-8"
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    Analytics
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-border-subtle text-white hover:bg-card-bg text-xs h-8"
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 glass-card border-border-subtle">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-cyan-accent" />
            </div>
            <div>
              <h4 className="text-white">Average Performance</h4>
              <p className="text-text-secondary text-sm">Across all campaigns</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Average CTR</span>
              <span className="text-white">{avgCTR}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Average CPC</span>
              <span className="text-white">${avgCPC}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Total Campaigns</span>
              <span className="text-white">{adCampaigns.length}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-card border-border-subtle">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-white">Top Performer</h4>
              <p className="text-text-secondary text-sm">Best ROAS this month</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Campaign</span>
              <span className="text-white">{adCampaigns[0].name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">ROAS</span>
              <span className="text-green-400">{adCampaigns[0].metrics.roas}x</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Conversions</span>
              <span className="text-white">{adCampaigns[0].metrics.conversions}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}