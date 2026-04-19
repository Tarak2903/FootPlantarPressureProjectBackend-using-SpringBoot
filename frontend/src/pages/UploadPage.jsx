import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { UploadCloud, File, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phoneNumber || !file) {
      toast.error('Please fill all fields and select a file');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    payload.append('phoneNumber', formData.phoneNumber);
    payload.append('file', file);

    setLoading(true);
    try {
      await api.post('/patient', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Data uploaded successfully');
      navigate('/');
    } catch (error) {
      // Errors handled by global interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Upload Patient Data</h1>
        <p className="text-gray-500 mt-1">Submit new plantar pressure analysis files.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Details & File</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />
              <Input
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
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

            <div className="pt-4 flex justify-end">
              <Button type="button" variant="ghost" onClick={() => navigate('/')} className="mr-3">
                Cancel
              </Button>
              <Button type="submit" isLoading={loading}>
                Upload Analysis
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
