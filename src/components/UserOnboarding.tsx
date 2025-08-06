import React, { useState } from 'react';
import { BookOpen, FileText, Upload, Settings, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { UserService } from '../services/UserService';

interface UserOnboardingProps {
  onComplete: () => void;
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({ onComplete }) => {
  const { userProfile, refreshUserProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      title: 'Welcome to InkWell!',
      description: 'Let\'s get you set up with your new writing workspace.',
      icon: Sparkles,
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Your workspace is ready!</h3>
          <p className="text-gray-600 mb-6">
            We've created your personal folder structure and welcome project. 
            You're all set to start creating amazing content.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-green-50 p-4 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
              <h4 className="font-medium text-green-800">Profile Created</h4>
              <p className="text-sm text-green-600">Your user profile is ready</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 mb-2" />
              <h4 className="font-medium text-blue-800">Folders Ready</h4>
              <p className="text-sm text-blue-600">Personal workspace created</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600 mb-2" />
              <h4 className="font-medium text-purple-800">Welcome Project</h4>
              <p className="text-sm text-purple-600">First project waiting for you</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Your Workspace',
      description: 'Explore your personal InkWell workspace.',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📁 Your Folder Structure</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>📂 projects/ - Your writing projects</div>
              <div>📂 uploads/ - Audio and document uploads</div>
              <div>📂 exports/ - Completed books and audiobooks</div>
              <div>📂 templates/ - Writing templates</div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🎯 What You Can Do</h4>
            <div className="text-sm text-blue-600 space-y-1">
              <div>• Upload audio files for transcription</div>
              <div>• Create and edit writing projects</div>
              <div>• Export completed books</div>
              <div>• Use AI-powered writing tools</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Get Started',
      description: 'Ready to create your first project?',
      icon: Upload,
      content: (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg text-white">
            <Upload className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Creating</h3>
            <p className="text-purple-100">
              Upload your first audio file or start writing from scratch. 
              Your InkWell journey begins now!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              Upload Audio File
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all">
              Start Writing
            </button>
          </div>
        </div>
      )
    }
  ];

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      setIsLoading(true);
      try {
        await UserService.completeOnboarding(userProfile?.id || '');
        await refreshUserProfile();
        onComplete();
      } catch (error) {
        console.error('Error completing onboarding:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await UserService.completeOnboarding(userProfile?.id || '');
      await refreshUserProfile();
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mb-6">
            {currentStepData.description}
          </p>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStepData.content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 font-medium disabled:opacity-50"
          >
            Skip Onboarding
          </button>
          
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Completing...</span>
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding; 