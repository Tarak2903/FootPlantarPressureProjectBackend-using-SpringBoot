import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Footprints, ActivitySquare, Search, UploadCloud, File, X, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'upload'
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search State
  const [searchPhone, setSearchPhone] = useState('');

  // Upload State
  const [uploadData, setUploadData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [file, setFile] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPhone) {
      toast.error('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError(null);
    setPatientData(null);

    try {
      const res = await api.get('/patient', {
        params: { phoneNumber: searchPhone }
      });
      
      if (res.data) {
        setPatientData(res.data);
        toast.success('Patient found');
      } else {
        setError('No patient found with this phone number.');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('No patient found with this phone number.');
      } else {
        setError('An error occurred while fetching patient data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = (e) => {
    const { name, value } = e.target;
    setUploadData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.name || !uploadData.email || !uploadData.phoneNumber || !file) {
      toast.error('Please fill all fields and select a file');
      return;
    }

    const payload = new FormData();
    payload.append('name', uploadData.name);
    payload.append('email', uploadData.email);
    payload.append('phoneNumber', uploadData.phoneNumber);
    payload.append('file', file);

    setLoading(true);
    setError(null);
    setPatientData(null);

    try {
      const res = await api.post('/patient', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Construct a patientDetail response equivalent using the form inputs and the response metrics
      if (res.data) {
        setPatientData({
          name: uploadData.name,
          email: uploadData.email,
          phoneNumber: uploadData.phoneNumber,
          lmean: res.data.lmean,
          rmean: res.data.rmean,
          avg: res.data.avg
        });
        toast.success('Data uploaded and analyzed successfully');
        
        // Reset form
        setUploadData({ name: '', email: '', phoneNumber: '' });
        setFile(null);
      }
    } catch (error) {
      setError('Failed to upload and analyze data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = patientData ? [
    { name: 'Left Foot', value: patientData.lmean, color: '#3b82f6' },
    { name: 'Right Foot', value: patientData.rmean, color: '#ef4444' },
    { name: 'Average', value: patientData.avg, color: '#10b981' }
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Search existing patient records or upload new plantar pressure data.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('search'); setError(null); }}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Search Existing Patient
          </button>
          <button
            onClick={() => { setActiveTab('upload'); setError(null); }}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Upload New Data
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'search' && (
            <form onSubmit={handleSearch} className="flex gap-4 items-end animate-in fade-in duration-300">
              <div className="flex-1 max-w-md">
                <Input
                  label="Phone Number"
                  name="searchPhone"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="Enter patient phone number"
                  className="w-full"
                />
              </div>
              <Button type="submit" isLoading={loading} className="w-32">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          )}

          {activeTab === 'upload' && (
            <form onSubmit={handleUpload} className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={uploadData.name}
                  onChange={handleUploadChange}
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={uploadData.email}
                  onChange={handleUploadChange}
                  placeholder="john@example.com"
                  required
                />
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={uploadData.phoneNumber}
                  onChange={handleUploadChange}
                  placeholder="+1 234 567 890"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Plantar Pressure Data File</label>
                {!file ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors relative">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      accept=".log,.csv,.txt,.json"
                      required
                    />
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="mt-1 text-xs text-gray-500">LOG, CSV, TXT up to 10MB</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-blue-50/50">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                        <File className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" isLoading={loading}>
                  Upload & Analyze
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Operation Failed</h3>
            <div className="mt-1 text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>
      )}

      {!patientData && !error && !loading && (
        <Card className="border-dashed border-2 bg-gray-50/50">
          <CardContent className="p-12 flex flex-col items-center justify-center text-gray-500">
            <ActivitySquare className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600">No Patient Data</p>
            <p className="text-sm mt-1 text-center max-w-sm">Use the search or upload functionality above to load plantar pressure analysis records.</p>
          </CardContent>
        </Card>
      )}

      {patientData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card>
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{patientData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{patientData.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{patientData.phoneNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Left Mean</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{patientData.lmean?.toFixed(2) || '0.00'}</h3>
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
                    <p className="text-sm font-medium text-gray-500">Right Mean</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{patientData.rmean?.toFixed(2) || '0.00'}</h3>
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
                    <p className="text-sm font-medium text-gray-500">Average</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{patientData.avg?.toFixed(2) || '0.00'}</h3>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <ActivitySquare className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pressure Distribution Graph</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={80}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
