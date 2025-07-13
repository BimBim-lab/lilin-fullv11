import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Users, Clock, MousePointer, Eye, Smartphone, Globe, Shield, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface GACredentials {
  propertyId: string;
  serviceAccountEmail: string;
  privateKey: string;
}

interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  totalSessions: number;
  pageViews: number;
  heroButtonClicks: number;
  topPages: Array<{ page: string; views: number }>;
  avgEngagementTime: number;
  bounceRate: number;
  trafficSources: Array<{ source: string; visitors: number }>;
  deviceCategories: Array<{ device: string; sessions: number }>;
  newVsReturning: { newUsers: number; returningUsers: number };
  sessionsPerUser: string | number;
  pagesPerSession: string | number;
  isDemo?: boolean; // Optional flag to indicate demo data
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [credentialsStatus, setCredentialsStatus] = useState<'loading' | 'available' | 'missing'>('loading');
  const [gaCredentials, setGaCredentials] = useState<GACredentials | null>(null);
  const { toast } = useToast();

  // Auto-load credentials status and analytics data on component mount
  useEffect(() => {
    checkCredentialsAndLoadAnalytics();
  }, []);

  const checkCredentialsAndLoadAnalytics = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setCredentialsStatus('missing');
        setIsLoading(false);
        return;
      }

      // Check if GA credentials are available from environment variables
      const response = await fetch(`${API_BASE_URL}/api/ga-credentials`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const savedCredentials = await response.json();
        setGaCredentials({
          propertyId: savedCredentials.propertyId,
          serviceAccountEmail: savedCredentials.serviceAccountEmail,
          privateKey: savedCredentials.privateKey
        });
        setCredentialsStatus('available');
        
        // Auto-fetch analytics data if credentials exist
        await fetchAnalytics();
        
        toast({
          title: "✅ GA Credentials Loaded",
          description: "Analytics data loaded from environment variables",
        });
      } else {
        setCredentialsStatus('missing');
        toast({
          title: "⚠️ GA Credentials Missing",
          description: "Please set environment variables in Railway",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking credentials:', error);
      setCredentialsStatus('missing');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/analytics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
        toast({
          title: "✅ Analytics Updated",
          description: "Data analytics berhasil dimuat",
        });
      } else {
        throw new Error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data analytics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  const formatTime = (time: number | string): string => {
    if (typeof time === 'string') return time;
    const minutes = Math.floor(time / 60);
    const remainingSeconds = Math.floor(time % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your website performance and visitor insights
          </p>
        </div>
        <Button 
          onClick={fetchAnalytics} 
          disabled={isLoading || credentialsStatus !== 'available'}
          className="flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
          Refresh Data
        </Button>
      </div>

      {/* Credentials Status Alert */}
      {credentialsStatus === 'missing' && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">GA Credentials Required</AlertTitle>
          <AlertDescription className="text-amber-700">
            Google Analytics credentials are loaded from Railway environment variables. 
            Please set the following environment variables:
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li><strong>GA4_PROPERTY_ID</strong>: Your Google Analytics Property ID</li>
              <li><strong>GA4_SERVICE_ACCOUNT_EMAIL</strong>: Your service account email</li>
              <li><strong>GA4_PRIVATE_KEY</strong>: Your private key (use \\n for new lines)</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {credentialsStatus === 'available' && gaCredentials && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Secure Credentials Loaded</AlertTitle>
          <AlertDescription className="text-green-700">
            GA credentials loaded securely from environment variables.
            <div className="mt-2 text-sm font-mono bg-green-100 p-2 rounded">
              Property ID: {gaCredentials.propertyId}<br />
              Service Account: {gaCredentials.serviceAccountEmail}
            </div>
            {analyticsData && !analyticsData.isDemo && (
              <div className="mt-2 text-sm text-green-600 font-medium">
                ✅ Displaying real Google Analytics data
              </div>
            )}
            {analyticsData && analyticsData.isDemo && (
              <div className="mt-2 text-sm text-amber-600 font-medium">
                ⚠️ Using demo data (GA API connection issue)
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Analytics Data */}
      {analyticsData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.totalVisitors)}</div>
                <p className="text-xs text-muted-foreground">
                  All time visitors
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.todayVisitors)}</div>
                <p className="text-xs text-muted-foreground">
                  Visitors today
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.totalSessions)}</div>
                <p className="text-xs text-muted-foreground">
                  All sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.pageViews)}</div>
                <p className="text-xs text-muted-foreground">
                  Total page views
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hero Button Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.heroButtonClicks)}</div>
                <p className="text-xs text-muted-foreground">
                  CTA interactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="font-medium text-sm">{page.page}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(page.views)} views
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Avg. Engagement Time</Label>
                    <span className="font-medium">
                      {formatTime(analyticsData.avgEngagementTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Bounce Rate</Label>
                    <span className="font-medium">
                      {formatPercentage(analyticsData.bounceRate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>New Users</Label>
                    <span className="font-medium">
                      {formatNumber(analyticsData.newVsReturning.newUsers)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Returning Users</Label>
                    <span className="font-medium">
                      {formatNumber(analyticsData.newVsReturning.returningUsers)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{source.source}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(source.visitors)} visitors
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Device Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.deviceCategories.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{device.device}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(device.sessions)} sessions
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Loading State */}
      {isLoading && !analyticsData && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading analytics data...</span>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && !analyticsData && credentialsStatus === 'available' && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
            <p className="text-muted-foreground text-center mb-4">
              Click "Refresh Data" to load your analytics information.
            </p>
            <Button onClick={fetchAnalytics} disabled={isLoading}>
              Load Analytics Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
