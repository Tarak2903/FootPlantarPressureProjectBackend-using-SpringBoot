import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Trash2, Edit, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ userName: '', password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/get');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/admin/${id}`);
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleEditClick = (userToEdit) => {
    setEditingUserId(userToEdit.id);
    setEditForm({ userName: userToEdit.userName, password: '' });
  };

  const handleEditSave = async () => {
    if (!editForm.userName || !editForm.password) {
      toast.error('Please provide both username and a new password');
      return;
    }

    try {
      setSaving(true);
      await api.put(`/admin/${editingUserId}`, editForm);
      toast.success('User updated successfully');
      setEditingUserId(null);
      fetchUsers(); // Refresh the list
    } catch (err) {
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Control Panel</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage staff and administrator accounts.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-red-600" />
            System Users
          </CardTitle>
          <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Username</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{u.id}</td>
                      <td className="px-6 py-4">
                        {editingUserId === u.id ? (
                          <Input
                            value={editForm.userName}
                            onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                            className="h-8 py-1 px-2"
                            placeholder="New Username"
                          />
                        ) : (
                          <div className="font-medium text-gray-900 dark:text-white">{u.userName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingUserId === u.id ? (
                          <Input
                            type="password"
                            value={editForm.password}
                            onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                            className="h-8 py-1 px-2"
                            placeholder="New Password"
                          />
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.role === 'ADMIN' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                          }`}>
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {editingUserId === u.id ? (
                          <>
                            <Button size="sm" onClick={handleEditSave} isLoading={saving}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingUserId(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(u)}
                              className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Delete User"
                              disabled={u.id === user.id} // Prevents deleting oneself if id was known, but mostly just visual
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
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

export default AdminDashboardPage;
