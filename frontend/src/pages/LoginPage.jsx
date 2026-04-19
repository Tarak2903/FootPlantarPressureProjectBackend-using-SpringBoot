import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STAFF');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const success = await login(userName, password, role);
    setLoading(false);

    if (success) {
      toast.success('Logged in successfully');
      navigate('/');
    } else {
      // Error handled by interceptor or fallback if network error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
            <Activity className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your plantar pressure dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setRole('STAFF')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'STAFF' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'ADMIN' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Administrator
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div>
              <Button type="submit" className="w-full py-2.5 text-base" isLoading={loading}>
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
