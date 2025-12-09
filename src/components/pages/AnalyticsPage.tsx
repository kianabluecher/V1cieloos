import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  Users, 
  Eye, 
  MousePointerClick, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Globe,
  Monitor,
  Smartphone,
  RefreshCw,
  BarChart3,
  Activity
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For now, use demo data immediately
    // TODO: Implement TWIPLA API integration
    setAnalytics(getDemoAnalytics());
    setLoading(false);
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement TWIPLA API integration
      // For now, just use demo data
      setAnalytics(getDemoAnalytics());
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to load analytics data');
      
      // Use demo data for now
      setAnalytics(getDemoAnalytics());
    } finally {
      setLoading(false);
    }
  };

  // Demo data for development
  const getDemoAnalytics = () => ({
    summary: {
      totalVisitors: 12543,
      pageViews: 45821,
      avgSessionDuration: '3m 42s',
      bounceRate: 42.3,
      visitorsTrend: 12.5,
      pageViewsTrend: 8.3,
      sessionTrend: -2.1,
      bounceTrend: -5.2,
    },
    trafficSources: [
      { name: 'Direct', value: 4523, percentage: 36 },
      { name: 'Organic Search', value: 3756, percentage: 30 },
      { name: 'Social Media', value: 2508, percentage: 20 },
      { name: 'Referral', value: 1256, percentage: 10 },
      { name: 'Email', value: 500, percentage: 4 },
    ],
    deviceBreakdown: [
      { name: 'Desktop', value: 7526, percentage: 60 },
      { name: 'Mobile', value: 3761, percentage: 30 },
      { name: 'Tablet', value: 1256, percentage: 10 },
    ],
    topPages: [
      { path: '/', views: 8543, avgTime: '2m 15s' },
      { path: '/products', views: 5621, avgTime: '3m 42s' },
      { path: '/about', views: 3456, avgTime: '1m 58s' },
      { path: '/contact', views: 2187, avgTime: '1m 12s' },
      { path: '/blog', views: 1842, avgTime: '4m 23s' },
    ],
    weeklyData: [
      { day: 'Mon', visitors: 1823, pageViews: 6534 },
      { day: 'Tue', visitors: 1945, pageViews: 7123 },
      { day: 'Wed', visitors: 2156, pageViews: 7845 },
      { day: 'Thu', visitors: 1987, pageViews: 7234 },
      { day: 'Fri', visitors: 2234, pageViews: 8123 },
      { day: 'Sat', visitors: 1654, pageViews: 5432 },
      { day: 'Sun', visitors: 744, pageViews: 3530 },
    ],
  });

  const COLORS = ['#A6E0FF', '#4A90E2', '#7B68EE', '#9370DB', '#BA55D3'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-cyan-accent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <Card className="border-border-subtle p-8">
        <div className="text-center">
          <Activity className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-white mb-2">Failed to Load Analytics</h3>
          <p className="text-text-secondary mb-4">{error}</p>
          <Button 
            onClick={fetchAnalytics}
            className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const data = analytics || getDemoAnalytics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white mb-1">Web Analytics</h1>
          <p className="text-text-secondary">Real-time website performance insights powered by TWIPLA</p>
        </div>
        <Button 
          onClick={fetchAnalytics}
          variant="outline"
          className="border-border-subtle text-white hover:bg-cyan-accent/10"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border-subtle p-6" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-accent" />
              <span className="text-sm text-text-secondary">Total Visitors</span>
            </div>
            {data.summary.visitorsTrend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="text-3xl text-white mb-1">{data.summary.totalVisitors.toLocaleString()}</div>
          <div className={`text-sm ${data.summary.visitorsTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.summary.visitorsTrend > 0 ? '+' : ''}{data.summary.visitorsTrend}% vs last period
          </div>
        </Card>

        <Card className="border-border-subtle p-6" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-cyan-accent" />
              <span className="text-sm text-text-secondary">Page Views</span>
            </div>
            {data.summary.pageViewsTrend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="text-3xl text-white mb-1">{data.summary.pageViews.toLocaleString()}</div>
          <div className={`text-sm ${data.summary.pageViewsTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.summary.pageViewsTrend > 0 ? '+' : ''}{data.summary.pageViewsTrend}% vs last period
          </div>
        </Card>

        <Card className="border-border-subtle p-6" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-accent" />
              <span className="text-sm text-text-secondary">Avg. Session</span>
            </div>
            {data.summary.sessionTrend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="text-3xl text-white mb-1">{data.summary.avgSessionDuration}</div>
          <div className={`text-sm ${data.summary.sessionTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.summary.sessionTrend > 0 ? '+' : ''}{data.summary.sessionTrend}% vs last period
          </div>
        </Card>

        <Card className="border-border-subtle p-6" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-5 w-5 text-cyan-accent" />
              <span className="text-sm text-text-secondary">Bounce Rate</span>
            </div>
            {data.summary.bounceTrend < 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="text-3xl text-white mb-1">{data.summary.bounceRate}%</div>
          <div className={`text-sm ${data.summary.bounceTrend < 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.summary.bounceTrend > 0 ? '+' : ''}{data.summary.bounceTrend}% vs last period
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Traffic Chart */}
        <Card className="border-border-subtle p-6" style={{ backgroundColor: '#1A1A1A' }}>
          <h3 className="text-white mb-4">Weekly Traffic Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="day" stroke="#808080" />
              <YAxis stroke="#808080" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0A0A0B', border: '1px solid #2A2A2A' }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#A6E0FF" 
                strokeWidth={2}
                name="Visitors"
              />
              <Line 
                type="monotone" 
                dataKey="pageViews" 
                stroke="#4A90E2" 
                strokeWidth={2}
                name="Page Views"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Traffic Sources */}
        <Card className="border-border-subtle p-6" style={{ backgroundColor: '#1A1A1A' }}>
          <h3 className="text-white mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.trafficSources}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.trafficSources.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0A0A0B', border: '1px solid #2A2A2A' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Device Breakdown & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card className="border-border-subtle p-6" style={{ backgroundColor: '#1A1A1A' }}>
          <h3 className="text-white mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            {data.deviceBreakdown.map((device: any, index: number) => (
              <div key={device.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {device.name === 'Desktop' && <Monitor className="h-4 w-4 text-cyan-accent" />}
                    {device.name === 'Mobile' && <Smartphone className="h-4 w-4 text-cyan-accent" />}
                    {device.name === 'Tablet' && <Globe className="h-4 w-4 text-cyan-accent" />}
                    <span className="text-white">{device.name}</span>
                  </div>
                  <span className="text-text-secondary">{device.value.toLocaleString()} ({device.percentage}%)</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${device.percentage}%`,
                      backgroundColor: COLORS[index]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Pages */}
        <Card className="border-border-subtle p-6" style={{ backgroundColor: '#1A1A1A' }}>
          <h3 className="text-white mb-4">Top Pages</h3>
          <div className="space-y-3">
            {data.topPages.map((page: any, index: number) => (
              <div key={page.path} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg border border-border-subtle">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20 text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-white">{page.path}</span>
                  </div>
                  <div className="text-xs text-text-secondary">Avg. Time: {page.avgTime}</div>
                </div>
                <div className="text-right">
                  <div className="text-white">{page.views.toLocaleString()}</div>
                  <div className="text-xs text-text-secondary">views</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="border-border-subtle p-4 bg-cyan-accent/5">
        <div className="flex items-start gap-3">
          <BarChart3 className="h-5 w-5 text-cyan-accent flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white mb-1">Powered by TWIPLA</h4>
            <p className="text-sm text-text-secondary">
              Analytics data is sourced from TWIPLA (Visitor Analytics). Data updates in real-time and provides comprehensive insights into your website performance.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}