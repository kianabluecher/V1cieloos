import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { 
  RefreshCw, 
  Search, 
  Download,
  Filter,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface CRMRecord {
  id: string;
  [key: string]: any;
}

interface CRMData {
  records: CRMRecord[];
  headers: string[];
  lastSync: string;
}

export function CRMPage() {
  const [crmData, setCrmData] = useState<CRMData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState<CRMRecord[]>([]);

  useEffect(() => {
    testConnection();
    loadCachedData();
  }, []);

  useEffect(() => {
    if (crmData) {
      filterRecords();
    }
  }, [searchTerm, crmData]);

  const testConnection = async () => {
    try {
      const healthResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c3abf285/health`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        }
      );
      const healthData = await healthResponse.json();
      console.log('Health check:', healthData);

      const routesResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c3abf285/routes`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        }
      );
      const routesData = await routesResponse.json();
      console.log('Available routes:', routesData);
    } catch (error) {
      console.error('Server connection test failed:', error);
    }
  };

  const loadCachedData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c3abf285/crm/cached`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', await response.text());
        // If no cached data, try syncing immediately
        await syncWithGoogleSheets();
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        setCrmData(result);
        setFilteredRecords(result.data);
      } else {
        // If no cached data, try syncing immediately
        await syncWithGoogleSheets();
      }
    } catch (error) {
      console.error('Error loading cached CRM data:', error);
      // Try syncing as fallback
      try {
        await syncWithGoogleSheets();
      } catch (syncError) {
        console.error('Error syncing after cache load failed:', syncError);
        toast.error('Failed to load CRM data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const syncWithGoogleSheets = async () => {
    try {
      setIsSyncing(true);
      toast.info('Syncing with Google Sheets...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c3abf285/crm/google-sheets`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Response is not JSON:', textResponse);
        toast.error('Server error: Invalid response format');
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        setCrmData(result);
        setFilteredRecords(result.data);
        toast.success('Successfully synced with Google Sheets');
      } else {
        console.error('Sync error:', result);
        toast.error(result.error || 'Failed to sync with Google Sheets');
      }
    } catch (error: any) {
      console.error('Error syncing with Google Sheets:', error);
      toast.error(`Failed to sync: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const filterRecords = () => {
    if (!crmData) return;
    
    if (!searchTerm.trim()) {
      setFilteredRecords(crmData.data);
      return;
    }

    const filtered = crmData.data.filter(record => {
      return Object.values(record).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredRecords(filtered);
  };

  const exportToCSV = () => {
    if (!crmData || !crmData.data.length) {
      toast.error('No data to export');
      return;
    }

    const headers = crmData.headers;
    const csvContent = [
      headers.join(','),
      ...crmData.data.map(record => 
        headers.map(header => {
          const value = record[header] || '';
          // Escape commas and quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const getStatsFromData = () => {
    if (!crmData || !crmData.data.length) {
      return { total: 0, active: 0, revenue: 0 };
    }

    const records = crmData.data;
    
    // Try to find relevant columns for stats
    const statusColumn = crmData.headers.find(h => 
      h.toLowerCase().includes('status')
    );
    const revenueColumn = crmData.headers.find(h => 
      h.toLowerCase().includes('revenue') || 
      h.toLowerCase().includes('value') ||
      h.toLowerCase().includes('amount')
    );

    const active = statusColumn 
      ? records.filter(r => 
          String(r[statusColumn]).toLowerCase().includes('active') ||
          String(r[statusColumn]).toLowerCase().includes('open')
        ).length 
      : 0;

    const revenue = revenueColumn 
      ? records.reduce((sum, r) => {
          const value = parseFloat(String(r[revenueColumn]).replace(/[^0-9.-]+/g, ''));
          return sum + (isNaN(value) ? 0 : value);
        }, 0)
      : 0;

    return {
      total: records.length,
      active,
      revenue
    };
  };

  const stats = getStatsFromData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-accent" />
        <span className="ml-2 text-white">Loading CRM data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white">CRM Dashboard</h3>
          <p className="text-sm text-text-secondary mt-1">
            Live data from Google Sheets
            {crmData?.lastSync && (
              <span className="ml-2">
                • Last synced: {new Date(crmData.lastSync).toLocaleString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            disabled={!crmData || crmData.data.length === 0}
            className="border-border-subtle text-white hover:bg-cyan-accent/10 hover:text-cyan-accent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            onClick={syncWithGoogleSheets}
            disabled={isSyncing}
            className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-card-bg border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Records</p>
              <p className="text-2xl text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-cyan-accent/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-cyan-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card-bg border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Active</p>
              <p className="text-2xl text-white mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card-bg border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Value</p>
              <p className="text-2xl text-white mt-1">
                ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
          <Input 
            placeholder="Search all fields..." 
            className="pl-9 bg-card-bg border-border-subtle text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="border-border-subtle text-white hover:bg-cyan-accent/10 hover:text-cyan-accent"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Data Table */}
      {!crmData || crmData.data.length === 0 ? (
        <Card className="p-12 bg-card-bg border-border-subtle text-center">
          <AlertCircle className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-white mb-2">No Data Available</h3>
          <p className="text-text-secondary mb-4">
            Click "Sync Now" to load data from Google Sheets
          </p>
          <Button 
            onClick={syncWithGoogleSheets}
            disabled={isSyncing}
            className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync with Google Sheets
          </Button>
        </Card>
      ) : (
        <Card className="bg-card-bg border-border-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg border-b border-border-subtle">
                <tr>
                  {crmData.headers.map((header, index) => (
                    <th 
                      key={index} 
                      className="px-4 py-3 text-left text-xs text-text-secondary uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredRecords.map((record, index) => (
                  <tr 
                    key={record.id} 
                    className="hover:bg-cyan-accent/5 transition-colors"
                  >
                    {crmData.headers.map((header, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        className="px-4 py-3 text-sm text-white"
                      >
                        {record[header] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRecords.length === 0 && searchTerm && (
            <div className="p-8 text-center">
              <p className="text-text-secondary">No results found for "{searchTerm}"</p>
            </div>
          )}
          
          <div className="px-4 py-3 bg-dark-bg border-t border-border-subtle">
            <p className="text-sm text-text-secondary">
              Showing {filteredRecords.length} of {crmData.data.length} records
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}