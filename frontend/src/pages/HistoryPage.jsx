import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Search, Filter, Eye } from 'lucide-react';
import api from '../services/api';

// Note: Backend does not currently have a "GET all patients" endpoint for regular users.
// We are mocking a list here, or potentially fetching users via Admin api to demonstrate structure.

const HistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mocking records for now since `GET /patient` only fetches a single record by email
    // In a real scenario, we'd call an endpoint like `GET /patient/history`
    const mockRecords = [
      { id: 1, name: 'John Doe', email: 'john@example.com', date: '2023-10-01', lmean: 45.2, rmean: 44.8, avg: 45.0 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', date: '2023-10-05', lmean: 38.5, rmean: 39.1, avg: 38.8 },
      { id: 3, name: 'Robert Johnson', email: 'robert@example.com', date: '2023-10-10', lmean: 50.1, rmean: 48.9, avg: 49.5 },
    ];
    
    setTimeout(() => {
      setRecords(mockRecords);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRecords = records.filter(record => 
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analysis History</h1>
          <p className="text-gray-500 mt-1">View previous plantar pressure records.</p>
        </div>
        <div className="w-full sm:w-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 outline-none transition-shadow"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Patient</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">L-Mean</th>
                  <th className="px-6 py-4 font-medium">R-Mean</th>
                  <th className="px-6 py-4 font-medium">Avg</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Loading history...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No records found matching "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{record.name}</div>
                        <div className="text-gray-500 text-xs">{record.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{record.date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {record.lmean}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          {record.rmean}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {record.avg}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View details">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
