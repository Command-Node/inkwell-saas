import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from './supabase';

const EmailTestComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [testType, setTestType] = useState<'signup' | 'reset' | 'magic'>('signup');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testEmail = async () => {
    if (!email) {
      setResult({ success: false, message: 'Please enter an email address' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let response;
      
      switch (testType) {
        case 'signup':
          response = await supabase.auth.signUp({
            email,
            password: 'testpassword123',
            options: {
              data: {
                full_name: 'Test User',
              },
            },
          });
          break;
        
        case 'reset':
          response = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: process.env.REACT_APP_SITE_URL ? `${process.env.REACT_APP_SITE_URL}/reset-password` : `${window.location.origin}/reset-password`,
          });
          break;
        
        case 'magic':
          response = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: process.env.REACT_APP_REDIRECT_URL || `${window.location.origin}/dashboard`,
            },
          });
          break;
      }

      if (response?.error) {
        setResult({ success: false, message: response.error.message });
      } else {
        setResult({ 
          success: true, 
          message: `Test email sent successfully! Check ${email} for the ${testType} email.` 
        });
      }
    } catch (error) {
      setResult({ success: false, message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-center mb-6">
        <Mail className="w-8 h-8 text-purple-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Email Test Tool</h2>
      </div>

      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Test Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Type
          </label>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="signup">Signup Confirmation</option>
            <option value="reset">Password Reset</option>
            <option value="magic">Magic Link</option>
          </select>
        </div>

        {/* Test Button */}
        <button
          onClick={testEmail}
          disabled={isLoading || !email}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-md font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Test Email
            </>
          )}
        </button>

        {/* Result Display */}
        {result && (
          <div className={`p-4 rounded-md ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              )}
              <p className={`text-sm ${
                result.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.message}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Current Configuration</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Domain:</strong> {process.env.REACT_APP_DOMAIN || 'Not set'}</p>
          <p><strong>Site URL:</strong> {process.env.REACT_APP_SITE_URL || 'Not set'}</p>
          <p><strong>Redirect URL:</strong> {process.env.REACT_APP_REDIRECT_URL || 'Not set'}</p>
          <p><strong>System Email:</strong> {process.env.REACT_APP_SYSTEM_EMAIL || 'Not set'}</p>
        </div>
      </div>
    </div>
  );
};

export default EmailTestComponent; 