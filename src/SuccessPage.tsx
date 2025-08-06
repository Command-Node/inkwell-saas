import React from 'react';
import { Check, Mail, BookOpen, Sparkles } from 'lucide-react';

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-6">
        <div className="bg-white rounded-3xl p-12 shadow-2xl">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="text-white w-10 h-10" />
          </div>
          
          {/* Success Message */}
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Welcome to InkFlow!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your subscription has been activated successfully. You're now ready to transform your voice into bestselling books!
          </p>
          
          {/* Next Steps */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
              <Mail className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Check Your Email</h3>
                <p className="text-gray-600">We've sent you a welcome email with your login details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
              <BookOpen className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Start Creating</h3>
                <p className="text-gray-600">Upload your first voice recording and watch AI transform it into a book</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
              <Sparkles className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">AI-Powered Features</h3>
                <p className="text-gray-600">Access all your subscription features and start publishing</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Go to Dashboard →
            </button>
            
            <button 
              onClick={() => window.location.href = '/upload'}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold border-2 border-purple-200 hover:border-purple-400 transition-all"
            >
              Create Your First Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage; 