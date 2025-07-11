import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Users, Clock, MousePointer, Eye, Smartphone, Globe } from "lucide-react";

interface GACredentials {
  propertyId: string;
  serviceAccountEmail: string;
  privateKey: string;
}

interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  totalSessions: number;
  heroButtonClicks: number;
  topPages: Array<{ page: string; views: number }>;
  avgEngagementTime: number;
  bounceRate: number;
  trafficSources: Array<{ source: string; visitors: number }>;
  deviceCategories: Array<{ device: string; sessions: number }>;
  newVsReturning: { newUsers: number; returningUsers: number };
}

export default function AnalyticsDashboard() {
  const [credentials, setCredentials] = useState<GACredentials>({
    propertyId: "",
    serviceAccountEmail: "",
    privateKey: "",
  });
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCredentialsSet, setIsCredentialsSet] = useState(false);
  const { toast } = useToast();

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.propertyId || !credentials.serviceAccountEmail || !credentials.privateKey) {
      toast({
        title: "Error",
        description: "Semua field kredensial harus diisi",
        variant: "destructive",
      });
      return;
    }

    setIsCredentialsSet(true);
    toast({
      title: "Kredensial Tersimpan",
      description: "Kredensial Google Analytics berhasil disimpan. Sekarang Anda dapat mengambil data analytics.",
    });
  };

  const fetchAnalytics = async () => {
    if (!isCredentialsSet) {
      toast({
        title: "Error",
        description: "Silakan atur kredensial terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalyticsData(data);
      
      toast({
        title: "Berhasil",
        description: "Data analytics berhasil diambil",
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data analytics. Pastikan kredensial benar.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Monitor website performance dengan Google Analytics</p>
      </div>

      {/* Google Analytics Credentials Form */}
      {!isCredentialsSet && (
        <Card>
          <CardHeader>
            <CardTitle>Google Analytics Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <Label htmlFor="propertyId">GA4 Property ID</Label>
                <Input
                  id="propertyId"
                  type="text"
                  placeholder="12345678"
                  value={credentials.propertyId}
                  onChange={(e) => setCredentials(prev => ({ ...prev, propertyId: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="serviceAccountEmail">Service Account Email</Label>
                <Input
                  id="serviceAccountEmail"
                  type="email"
                  placeholder="service-account@project.iam.gserviceaccount.com"
                  value={credentials.serviceAccountEmail}
                  onChange={(e) => setCredentials(prev => ({ ...prev, serviceAccountEmail: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="privateKey">Private Key (JSON format)</Label>
                <Textarea
                  id="privateKey"
                  placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                  rows={4}
                  value={credentials.privateKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, privateKey: e.target.value }))}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Simpan Kredensial
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Analytics Data Fetch Button */}
      {isCredentialsSet && (
        <div className="flex gap-4">
          <Button onClick={fetchAnalytics} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Mengambil Data..." : "Ambil Data Analytics"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setIsCredentialsSet(false);
              setAnalyticsData(null);
            }}
          >
            Ubah Kredensial
          </Button>
        </div>
      )}

      {/* Analytics Data Display */}
      {analyticsData && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.totalVisitors)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.todayVisitors)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.totalSessions)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hero Button Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.heroButtonClicks)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Engagement Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatTime(analyticsData.avgEngagementTime)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analyticsData.bounceRate * 100).toFixed(1)}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New vs Returning</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>New:</span>
                    <span className="font-medium">{formatNumber(analyticsData.newVsReturning.newUsers)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Returning:</span>
                    <span className="font-medium">{formatNumber(analyticsData.newVsReturning.returningUsers)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Visited Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.topPages.map((page, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="font-medium">{page.page}</span>
                    <span className="text-sm text-gray-600">{formatNumber(page.views)} views</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.trafficSources.map((source, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-sm text-gray-600">{formatNumber(source.visitors)} visitors</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Device Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.deviceCategories.map((device, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="font-medium">{device.device}</span>
                    <span className="text-sm text-gray-600">{formatNumber(device.sessions)} sessions</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
