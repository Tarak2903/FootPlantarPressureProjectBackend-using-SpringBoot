import React, { useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Key } from 'lucide-react';
import { Button } from '../components/ui/Button';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.userName || 'User'}</h2>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Shield className="h-4 w-4 mr-1 text-gray-400" />
                  Standard User
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="text-sm font-medium text-gray-500 block">Username</label>
                <div className="mt-1 flex items-center text-gray-900">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  {user?.userName || 'N/A'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block">Email</label>
                <div className="mt-1 flex items-center text-gray-900">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  Not provided
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100 mt-6 flex gap-3">
               {/* As per backend, standard users don't have update profile APIs in UserController yet.
                   We mock the disabled button for now. */}
               <Button disabled className="opacity-50 cursor-not-allowed">
                 Update Profile
               </Button>
               <Button variant="ghost">
                 <Key className="w-4 h-4 mr-2" />
                 Change Password
               </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
