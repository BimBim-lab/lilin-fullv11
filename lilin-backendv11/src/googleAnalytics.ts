import { google } from 'googleapis';

interface GACredentials {
  propertyId: string;
  serviceAccountEmail: string;
  privateKey: string;
}

export class GoogleAnalyticsService {
  private analytics: any;
  private propertyId: string;

  constructor(credentials: GACredentials) {
    this.propertyId = `properties/${credentials.propertyId}`;
    
    // Create JWT auth client
    const auth = new google.auth.JWT({
      email: credentials.serviceAccountEmail,
      key: credentials.privateKey.replace(/\\n/g, '\n'), // Fix newlines in private key
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });

    // Initialize Analytics Data API (GA4)
    this.analytics = google.analyticsdata({ version: 'v1beta', auth });
  }

  async getRealtimeData() {
    try {
      const response = await this.analytics.properties.runRealtimeReport({
        property: this.propertyId,
        requestBody: {
          metrics: [
            { name: 'activeUsers' }
          ]
        }
      });

      return {
        activeUsers: response.data.rows?.[0]?.metricValues?.[0]?.value || 0
      };
    } catch (error) {
      console.error('Error fetching realtime data:', error);
      throw error;
    }
  }

  async getAnalyticsData() {
    try {
      // Get data for the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const formatDate = (date: Date) => date.toISOString().split('T')[0];

      // Main analytics report
      const response = await this.analytics.properties.runReport({
        property: this.propertyId,
        requestBody: {
          dateRanges: [{
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
          }],
          metrics: [
            { name: 'totalUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
            { name: 'newUsers' }
          ]
        }
      });

      // Get today's data
      const todayResponse = await this.analytics.properties.runReport({
        property: this.propertyId,
        requestBody: {
          dateRanges: [{
            startDate: formatDate(endDate),
            endDate: formatDate(endDate)
          }],
          metrics: [
            { name: 'totalUsers' }
          ]
        }
      });

      // Get top pages
      const topPagesResponse = await this.analytics.properties.runReport({
        property: this.propertyId,
        requestBody: {
          dateRanges: [{
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
          }],
          metrics: [
            { name: 'screenPageViews' }
          ],
          dimensions: [
            { name: 'pagePath' }
          ],
          orderBys: [{
            metric: { metricName: 'screenPageViews' },
            desc: true
          }],
          limit: 5
        }
      });

      // Get traffic sources
      const trafficSourcesResponse = await this.analytics.properties.runReport({
        property: this.propertyId,
        requestBody: {
          dateRanges: [{
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
          }],
          metrics: [
            { name: 'totalUsers' }
          ],
          dimensions: [
            { name: 'sessionSource' }
          ],
          orderBys: [{
            metric: { metricName: 'totalUsers' },
            desc: true
          }],
          limit: 5
        }
      });

      // Get device categories
      const deviceResponse = await this.analytics.properties.runReport({
        property: this.propertyId,
        requestBody: {
          dateRanges: [{
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
          }],
          metrics: [
            { name: 'sessions' }
          ],
          dimensions: [
            { name: 'deviceCategory' }
          ]
        }
      });

      // Process and format the data
      const mainRow = response.data.rows?.[0];
      if (!mainRow) {
        throw new Error('No analytics data found for this property');
      }

      const totalUsers = parseInt(mainRow.metricValues[0].value) || 0;
      const totalSessions = parseInt(mainRow.metricValues[1].value) || 0;
      const pageViews = parseInt(mainRow.metricValues[2].value) || 0;
      const bounceRate = parseFloat(mainRow.metricValues[3].value) || 0;
      const avgSessionDuration = parseFloat(mainRow.metricValues[4].value) || 0;
      const newUsers = parseInt(mainRow.metricValues[5].value) || 0;

      const todayUsers = parseInt(todayResponse.data.rows?.[0]?.metricValues?.[0]?.value) || 0;

      // Format top pages
      const topPages = (topPagesResponse.data.rows || []).map((row: any) => ({
        page: row.dimensionValues[0].value,
        views: parseInt(row.metricValues[0].value)
      }));

      // Format traffic sources
      const trafficSources = (trafficSourcesResponse.data.rows || []).map((row: any) => ({
        source: row.dimensionValues[0].value === '(direct)' ? 'Direct' : row.dimensionValues[0].value,
        visitors: parseInt(row.metricValues[0].value)
      }));

      // Format device categories
      const deviceCategories = (deviceResponse.data.rows || []).map((row: any) => ({
        device: row.dimensionValues[0].value,
        sessions: parseInt(row.metricValues[0].value)
      }));

      return {
        totalVisitors: totalUsers,
        todayVisitors: todayUsers,
        totalSessions: totalSessions,
        pageViews: pageViews,
        heroButtonClicks: 0, // This would need custom event tracking in GA4
        topPages,
        avgEngagementTime: avgSessionDuration,
        bounceRate: bounceRate,
        trafficSources,
        deviceCategories,
        newVsReturning: {
          newUsers: newUsers,
          returningUsers: totalUsers - newUsers
        },
        // Additional metrics
        sessionsPerUser: totalSessions > 0 ? (totalSessions / totalUsers).toFixed(2) : 0,
        pagesPerSession: totalSessions > 0 ? (pageViews / totalSessions).toFixed(2) : 0
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }
}
