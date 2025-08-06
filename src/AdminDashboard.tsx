import React, { useState, useEffect } from 'react';
import { ArrowLeft, Database, Activity, AlertTriangle, Zap, Users, FileText, CreditCard } from 'lucide-react';
import { supabase } from './supabase';

interface User {
  id: string;
  email: string;
  subscription_plan: string;
  subscription_status: string;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [realData, setRealData] = useState<{
    users: User[];
    projects: Project[];
    subscriptions: Subscription[];
  }>({ users: [], projects: [], subscriptions: [] });
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockWebhookEvents = [
    { id: 1, event: 'payment.succeeded', amount: '$49.00', timestamp: '2025-08-04 16:30:00', status: 'processed' },
    { id: 2, event: 'payment.failed', amount: '$20.00', timestamp: '2025-08-04 16:25:00', status: 'failed' },
    { id: 3, event: 'subscription.created', amount: '$79.00', timestamp: '2025-08-04 16:20:00', status: 'processed' },
  ];

  const mockApiTests = [
    { endpoint: '/api/dashboard', method: 'GET', status: '200 OK', responseTime: '45ms' },
    { endpoint: '/api/projects', method: 'POST', status: '201 Created', responseTime: '120ms' },
    { endpoint: '/api/upload', method: 'POST', status: '200 OK', responseTime: '89ms' },
  ];

  const mockErrors = [
    { id: 1, error: 'StripeInvalidRequestError - Not a valid URL', timestamp: '2025-08-04 16:15:00', severity: 'high' },
    { id: 2, error: 'Database connection timeout', timestamp: '2025-08-04 16:10:00', severity: 'medium' },
  ];

  const fetchRealData = async () => {
    setLoading(true);
    try {
      const [usersResponse, projectsResponse, subscriptionsResponse] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('subscriptions').select('*')
      ]);

      setRealData({
        users: usersResponse.data || [],
        projects: projectsResponse.data || [],
        subscriptions: subscriptionsResponse.data || []
      });
    } catch (error) {
      console.error('Error fetching real data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  const runApiTest = async (endpoint: string, method: string) => {
    try {
      const response = await fetch(`http://localhost:5002${endpoint}`, { method });
      return `${response.status} ${response.statusText}`;
    } catch (error) {
      return 'Connection failed';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>← Back to InkFlow</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              TEST MODE ACTIVE
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'webhooks', label: 'Stripe Webhooks', icon: Zap },
              { id: 'api', label: 'API Testing', icon: Database },
              { id: 'database', label: 'Database', icon: Database },
              { id: 'errors', label: 'Error Logs', icon: AlertTriangle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'overview' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">System Overview</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{realData.users.length}</p>
                        <p className="text-sm text-gray-600">Total Users</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">{realData.projects.length}</p>
                        <p className="text-sm text-gray-600">Total Projects</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold">{realData.subscriptions.length}</p>
                        <p className="text-sm text-gray-600">Active Subscriptions</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-8 h-8 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold">{mockErrors.length}</p>
                        <p className="text-sm text-gray-600">Recent Errors</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'webhooks' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Stripe Webhook Events</h2>
                <div className="space-y-4">
                  {mockWebhookEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{event.event}</p>
                        <p className="text-sm text-gray-600">{event.timestamp}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold">{event.amount}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">API Endpoint Testing</h2>
                <div className="space-y-4">
                  {mockApiTests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{test.method} {test.endpoint}</p>
                        <p className="text-sm text-gray-600">Response time: {test.responseTime}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        test.status.startsWith('2') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {test.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Database Viewer</h2>
                  <button 
                    onClick={fetchRealData}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    {loading ? 'Loading...' : 'Refresh Data'}
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Users Table */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Users ({realData.users.length})</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {realData.users.length > 0 ? (
                        <div className="space-y-2">
                          {realData.users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-white rounded">
                              <span className="font-medium">{user.email}</span>
                              <span className="text-sm text-gray-600">{user.subscription_plan}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No users found</p>
                      )}
                    </div>
                  </div>

                  {/* Projects Table */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Projects ({realData.projects.length})</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {realData.projects.length > 0 ? (
                        <div className="space-y-2">
                          {realData.projects.map((project) => (
                            <div key={project.id} className="flex items-center justify-between p-2 bg-white rounded">
                              <span className="font-medium">{project.title}</span>
                              <span className="text-sm text-gray-600">{project.status}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No projects found</p>
                      )}
                    </div>
                  </div>

                  {/* Subscriptions Table */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Subscriptions ({realData.subscriptions.length})</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {realData.subscriptions.length > 0 ? (
                        <div className="space-y-2">
                          {realData.subscriptions.map((subscription) => (
                            <div key={subscription.id} className="flex items-center justify-between p-2 bg-white rounded">
                              <span className="font-medium">{subscription.plan_id}</span>
                              <span className="text-sm text-gray-600">{subscription.status}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No subscriptions found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'errors' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Error Logs</h2>
                <div className="space-y-4">
                  {mockErrors.map((error) => (
                    <div key={error.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-red-800">{error.error}</p>
                        <p className="text-sm text-red-600">{error.timestamp}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        error.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {error.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 