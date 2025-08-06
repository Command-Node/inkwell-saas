import React from 'react';
import { X, ArrowLeft, Heart } from 'lucide-react';

const CancelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-6">
        <div className="bg-white rounded-3xl p-12 shadow-2xl">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <X className="text-white w-10 h-10" />
          </div>
          
          {/* Cancel Message */}
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Payment Cancelled
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            No worries! You can try again anytime. We'd love to help you transform your voice into bestselling books.
          </p>
          
          {/* Why Choose InkFlow */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
              <Heart className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">No Risk, All Reward</h3>
                <p className="text-gray-600">Cancel anytime, no long-term commitments</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">AI-Powered Creation</h3>
                <p className="text-gray-600">Transform hours of work into minutes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg"></div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Professional Publishing</h3>
                <p className="text-gray-600">Publish to Amazon, Apple Books, and more</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Try Again →
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold border-2 border-purple-200 hover:border-purple-400 transition-all flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPage; 