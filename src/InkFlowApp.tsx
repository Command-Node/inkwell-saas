import React, { useState, useEffect } from 'react';
import { ChevronDown, Upload, Mic, FileText, Folder, Play, Pause, Download, Star, Check, X, Menu, User, Settings, CreditCard, BarChart3, BookOpen, Users, Zap, Crown, Sparkles, Mail, Lock, Eye, EyeOff, Github, LogOut } from 'lucide-react';
import StripePayment from './StripePayment';
import SuccessPage from './SuccessPage';
import CancelPage from './CancelPage';
import AdminDashboard from './AdminDashboard';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from './supabase';

const InkFlowApp = () => {
  const { user, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Real data state
  const [projects, setProjects] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalBooks: 0,
    completedBooks: 0,
    inProgressBooks: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Add keyboard shortcut for admin access
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + A to access admin
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setCurrentPage('admin');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // For now, use the existing user ID from the database
      const userId = 'de1620fc-35b1-44ad-874b-d7a3f99b49cd';
      
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';
      const response = await fetch(`${apiBaseUrl}/api/dashboard?userId=${userId}`);
      const data = await response.json();
      
      if (data.projects) {
        setProjects(data.projects);
        setDashboardStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      // For now, use the existing user ID
      const userId = 'de1620fc-35b1-44ad-874b-d7a3f99b49cd';
      
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (user && !error) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Load data when dashboard is accessed
  useEffect(() => {
    if (currentPage === 'dashboard') {
      fetchDashboardData();
      fetchUserData();
    }
  }, [currentPage]);

  // Navigation Component
  const Navigation = () => (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-purple-100 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('landing')}>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            InkFlow
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => setCurrentPage('dashboard')} className="text-gray-700 hover:text-purple-600 transition-colors">
            Dashboard
          </button>
          <button onClick={() => setCurrentPage('pricing')} className="text-gray-700 hover:text-purple-600 transition-colors">
            Pricing
          </button>
          <button className="text-gray-700 hover:text-purple-600 transition-colors">
            Marketplace
          </button>
          <button className="text-gray-700 hover:text-purple-600 transition-colors">
            Enterprise
          </button>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm">{user.email}</span>
              <button 
                onClick={signOut}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setCurrentPage('login')} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
            >
              Log In
            </button>
          )}
        </div>

        <button 
          className="md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-purple-100 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            <button 
              onClick={() => {
                setCurrentPage('dashboard');
                setIsMenuOpen(false);
              }} 
              className="block w-full text-left text-gray-700 hover:text-purple-600 transition-colors py-2"
            >
              Dashboard
            </button>
            <button 
              onClick={() => {
                setCurrentPage('pricing');
                setIsMenuOpen(false);
              }} 
              className="block w-full text-left text-gray-700 hover:text-purple-600 transition-colors py-2"
            >
              Pricing
            </button>
            <button className="block w-full text-left text-gray-700 hover:text-purple-600 transition-colors py-2">
              Marketplace
            </button>
            <button className="block w-full text-left text-gray-700 hover:text-purple-600 transition-colors py-2">
              Enterprise
            </button>
            {user ? (
              <div className="space-y-2">
                <div className="text-gray-700 text-sm px-4 py-2">{user.email}</div>
                <button 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-200 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setCurrentPage('login');
                  setIsMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  // Landing Page
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-purple-800 font-medium">AI-Powered Publishing Revolution</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Your 
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent block">
                Voice Into Books
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
              Upload voice recordings, get professionally formatted books. AI handles the writing, editing, and publishing - turning hours of work into minutes.
            </p>
            <div className="text-2xl font-bold text-purple-600 mb-8">
              Your Story, Your Terms
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Creating →
            </button>
            <button 
              onClick={() => setCurrentPage('pricing')}
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all"
            >
              View Pricing
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Mic className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Voice-First Creation</h3>
              <p className="text-gray-600">Simply speak your ideas. Our AI transforms voice recordings into professionally written books with perfect structure and flow.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Complete Creative Control</h3>
              <p className="text-gray-600">Choose your style, genre, and voice. Our AI adapts to your vision while you maintain full creative ownership.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-pink-100">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">One-Click Publishing</h3>
              <p className="text-gray-600">Publish directly to Amazon KDP, Apple Books, Google Play, and more. Print-on-demand ready with professional formatting.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-pink-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-white w-5 h-5" />
                </div>
                <span className="text-2xl font-bold">InkFlow</span>
              </div>
              <p className="text-purple-100 mb-6 max-w-md">
                Transform your voice into professionally formatted books with AI-powered creativity tools. Your story, your terms.
              </p>
              <div className="flex space-x-4">
                <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all">
                  <div className="w-5 h-5 bg-purple-300 rounded"></div>
                </button>
                <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all">
                  <div className="w-5 h-5 bg-purple-300 rounded"></div>
                </button>
                <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all">
                  <div className="w-5 h-5 bg-purple-300 rounded"></div>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-purple-100">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Team Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Publishing Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-purple-100">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-purple-200 text-sm">
              © 2025 InkFlow. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-purple-200 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-purple-200 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-purple-200 hover:text-white text-sm transition-colors">Cookie Policy</a>
              <button 
                onClick={() => setCurrentPage('admin')}
                className="text-purple-200 hover:text-white text-sm transition-colors opacity-30 hover:opacity-100"
                title="Admin Dashboard (Ctrl+Shift+A)"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  // Pricing Page
  const PricingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Choose Your 
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Creative Plan
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From individual creators to enterprise publishers, we have the perfect plan to transform your ideas into bestselling books.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">$20</div>
                <div className="text-gray-500">per month</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>5 books per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>3 revisions per book</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>2 audiobooks</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>2 AI outline credits</span>
                </li>
              </ul>
              
              <StripePayment 
                planId="starter"
                planName="Starter"
                price={2000}
              />
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">$49</div>
                <div className="text-gray-500">per month</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>15 books per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>5 revisions per book</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>7 audiobooks</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>5 AI outline credits</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Marketplace access</span>
                </li>
              </ul>
              
              <StripePayment 
                planId="professional"
                planName="Professional"
                price={4900}
              />
            </div>

            {/* Creator Plan - Popular */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white transform scale-105 shadow-2xl">
              <div className="text-center mb-8">
                <div className="bg-yellow-400 text-purple-800 px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">Creator</h3>
                <div className="text-4xl font-bold mb-2">$79</div>
                <div className="text-purple-100">per month</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-300 mr-3" />
                  <span>30 books per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-300 mr-3" />
                  <span>10 revisions per book</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-300 mr-3" />
                  <span>15 audiobooks</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-300 mr-3" />
                  <span>10 AI outline credits</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-300 mr-3" />
                  <span>Advanced AI agents</span>
                </li>
                <li className="flex items-center">
                  <Crown className="w-5 h-5 text-yellow-300 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <StripePayment 
                planId="creator"
                planName="Creator"
                price={7900}
              />
            </div>

            {/* Publisher Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Publisher</h3>
                <div className="text-4xl font-bold text-pink-600 mb-2">$199</div>
                <div className="text-gray-500">per month</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>80 books per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>12 revisions per book</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>40 audiobooks</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited credits</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>8 team members</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>White-label option</span>
                </li>
              </ul>
              
              <StripePayment 
                planId="publisher"
                planName="Publisher"
                price={19900}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard
  const Dashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Navigation />
      
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back{currentUser ? `, ${currentUser.email.split('@')[0]}` : ''}!
            </h1>
            <p className="text-gray-600">Ready to create your next bestseller?</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Start New Project</h3>
              <p className="mb-6 opacity-90">Upload voice recordings or documents to begin</p>
              <button 
                onClick={() => setCurrentPage('upload')}
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Create Book →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">AI Coaching</h3>
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-gray-600 mb-6">Get personalized writing guidance from our AI agents</p>
              <button className="text-purple-600 font-semibold hover:underline">
                Start Session →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Marketplace</h3>
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-600 mb-6">Browse templates and sell your creations</p>
              <button className="text-purple-600 font-semibold hover:underline">
                Explore →
              </button>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Recent Projects</h3>
              {loading && <div className="text-sm text-gray-500">Loading...</div>}
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading your projects...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        project.status === 'Completed' ? 'bg-gradient-to-r from-green-500 to-blue-500' :
                        project.status === 'In Progress' ? 'bg-gradient-to-r from-purple-500 to-blue-500' :
                        'bg-gradient-to-r from-gray-500 to-blue-500'
                      }`}>
                        {project.status === 'Completed' ? (
                          <Check className="text-white w-6 h-6" />
                        ) : (
                          <BookOpen className="text-white w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{project.title}</h4>
                        <p className="text-sm text-gray-600">
                          {project.status} • {project.progress}% complete
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {project.status !== 'Completed' && (
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full" 
                            style={{width: `${project.progress}%`}}
                          ></div>
                        </div>
                      )}
                      <button className="text-purple-600 hover:text-purple-800">
                        {project.status === 'Completed' ? (
                          <Download className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No projects yet</h4>
                <p className="text-gray-500 mb-4">Start your first book by uploading content</p>
                <button 
                  onClick={() => setCurrentPage('upload')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Create Your First Book
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Upload Page
  const UploadPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation />
      
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Create Your 
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Masterpiece
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your voice recordings, documents, or text. Our AI crew will transform them into a professionally formatted book.
            </p>
          </div>

          {/* Upload Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-purple-200 hover:border-purple-400 transition-all cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Mic className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Voice Recordings</h3>
                <p className="text-gray-600 mb-4">Upload MP3, WAV, or M4A files up to 4 hours</p>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Choose Files
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Text Files</h3>
                <p className="text-gray-600 mb-4">TXT, DOC, or DOCX documents</p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Upload Text
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-pink-200 hover:border-pink-400 transition-all cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Folder className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Documents</h3>
                <p className="text-gray-600 mb-4">PDF files or mixed media folders</p>
                <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Browse Files
                </button>
              </div>
            </div>
          </div>

          {/* AI Agent Selection */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
            <h3 className="text-2xl font-bold mb-6">Choose Your Writing Style</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-purple-200 rounded-xl hover:border-purple-400 transition-all cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
                  <span className="font-semibold">Professional</span>
                </div>
                <p className="text-sm text-gray-600">Business books, guides, and educational content with authoritative tone</p>
              </div>

              <div className="p-4 border border-blue-200 rounded-xl hover:border-blue-400 transition-all cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
                  <span className="font-semibold">Creative</span>
                </div>
                <p className="text-sm text-gray-600">Fiction, memoirs, and storytelling with engaging narrative flow</p>
              </div>

              <div className="p-4 border border-green-200 rounded-xl hover:border-green-400 transition-all cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg"></div>
                  <span className="font-semibold">Conversational</span>
                </div>
                <p className="text-sm text-gray-600">Casual, friendly tone perfect for self-help and personal development</p>
              </div>
            </div>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Sparkles className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">AI Agents Working...</h3>
                <p className="text-gray-600">Your book is being created by our specialized AI crew</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Transcribing audio...</span>
                  <span className="text-green-600 font-semibold">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Analyzing content structure...</span>
                  <span className="text-blue-600 font-semibold">In Progress</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500" style={{width: `${uploadProgress}%`}}></div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <button 
              onClick={async () => {
                setIsProcessing(true);
                setUploadProgress(0);
                
                try {
                  // Create a new project in the database
                  const userId = 'de1620fc-35b1-44ad-874b-d7a3f99b49cd';
                  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';
                  const response = await fetch(`${apiBaseUrl}/api/projects?userId=${userId}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      title: 'New Book Project',
                      writingStyle: 'Professional'
                    }),
                  });
                  
                  if (response.ok) {
                    const newProject = await response.json();
                    console.log('Created new project:', newProject);
                    
                    // Simulate processing progress
                    const interval = setInterval(() => {
                      setUploadProgress(prev => {
                        if (prev >= 100) {
                          clearInterval(interval);
                          setIsProcessing(false);
                          // Refresh dashboard data
                          fetchDashboardData();
                          return 100;
                        }
                        return prev + 10;
                      });
                    }, 500);
                  } else {
                    console.error('Failed to create project');
                    setIsProcessing(false);
                  }
                } catch (error) {
                  console.error('Error creating project:', error);
                  setIsProcessing(false);
                }
              }}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start AI Processing
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Login Page Component
  const LoginPage = () => {
    const { signIn, signInWithGoogle, signInWithGitHub } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const { error } = await signIn(email, password);
        
        if (error) {
          setError(error);
        } else {
          setCurrentPage('dashboard');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    const handleGoogleSignIn = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const { error } = await signInWithGoogle();
        if (error) {
          setError(error);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    const handleGitHubSignIn = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const { error } = await signInWithGitHub();
        if (error) {
          setError(error);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation />
        
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Logo and Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-white w-6 h-6" />
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    InkFlow
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-sm text-purple-600 hover:text-purple-500 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={handleGitHubSignIn}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="text-purple-600 hover:text-purple-500 font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Page Router
  const renderPage = () => {
    switch (currentPage) {
      case 'pricing':
        return <PricingPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <UploadPage />;
      case 'success':
        return <SuccessPage />;
      case 'cancel':
        return <CancelPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'login':
        if (authMode === 'register') {
          return <RegisterPage onBackToLogin={() => setAuthMode('login')} />;
        } else if (authMode === 'forgot') {
          return <ForgotPasswordPage onBackToLogin={() => setAuthMode('login')} />;
        } else {
          return <LoginPage />;
        }
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="font-sans">
      {renderPage()}
    </div>
  );
};

const AppWithAuth = () => {
  return (
    <AuthProvider>
      <InkFlowApp />
    </AuthProvider>
  );
};

export default AppWithAuth; 