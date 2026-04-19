import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Footprints, Activity, ActivitySquare } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For dashboard, we might want to fetch the latest data for the current user.
    // However, backend requires email to fetch patient data: GET /patient?email=...
    // Let's use a dummy email or try to fetch from profile. 
    // Assuming user context has an email, but we only have username. Let's mock a fetch for demo.
    const fetchLatestData = async () => {
      try {
        setLoading(true);
        // Using a hardcoded email for now, since auth doesn't provide it and we need it for /patient
        const res = await api.get('/patient', { params: { email: 'demo@example.com' } });
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        // Suppress 404/500 errors gracefully in dashboard for demo
        console.log('No recent data found or backend error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestData();
  }, []);

  const chartData = data ? [
    { name: 'Left Foot', value: data.lmean, color: '#3b82f6' },
    { name: 'Right Foot', value: data.rmean, color: '#ef4444' },
    { name: 'Average', value: data.avg, color: '#10b981' }
  ] : [
    { name: 'Left Foot', value: 0, color: '#3b82f6' },
    { name: 'Right Foot', value: 0, color: '#ef4444' },
    { name: 'Average', value: 0, color: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">View the latest plantar pressure analysis results.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Left Mean Pressure</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : (data?.lmean?.toFixed(2) || '0.00')}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Footprints className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Right Mean Pressure</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : (data?.rmean?.toFixed(2) || '0.00')}
                </h3>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Footprints className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Overall Average</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : (data?.avg?.toFixed(2) || '0.00')}
                </h3>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <ActivitySquare className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pressure Distribution Graph</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-80 flex items-center justify-center text-gray-400 animate-pulse">Loading Chart Data...</div>
            ) : data ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                    <Tooltip
                      cursor={{ fill: '#f3f4f6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-gray-500">
                <Activity className="h-12 w-12 text-gray-300 mb-4" />
                <p>No recent data available.</p>
                <p className="text-sm mt-1">Upload new patient data to see visualization.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
