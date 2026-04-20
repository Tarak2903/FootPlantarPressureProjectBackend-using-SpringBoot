import React, { useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 border-b border-gray-100 dark:border-slate-700 pb-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.userName || 'User'}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <Shield className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                  Standard User
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block">Email</label>
                <div className="mt-1 flex items-center text-gray-900 dark:text-white">
                  <Mail className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                  {user?.email || user?.userName || 'N/A'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block">Role</label>
                <div className="mt-1 flex items-center text-gray-900 dark:text-white">
                  <Shield className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                  {user?.role || 'STAFF'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
