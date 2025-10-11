import React from 'react';
import { Brain, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserHeader from '../../components/layout/UserHeader';
import { useAIAnalysis } from '../../ai/hooks/useAIAnalysis';
import UploadSection from '../../ai/components/UploadSection';
import AnalysisResults from '../../ai/components/AnalysisResults';
import ProductRecommendations from '../../ai/components/ProductRecommendations';
import HowItWorks from '../../ai/components/HowItWorks';
import Shuffle from '../../components/effects/Shuffle';
import ShinyText from '../../components/effects/ShinyText';
import { AIGradient, PremiumGradient } from '../../components/effects/GradientText';

export default function AIAnalysis() {
  const { user } = useAuth();
  const {
    isAnalyzing,
    analysisResult,
    recommendations,
    error,
    uploadedImage,
    startAnalysis,
    handleImageUpload,
    handleImageRemove,
    clearAnalysis,
    retryAnalysis,
    hasAnalysis,
    hasRecommendations,
    canAnalyze
  } = useAIAnalysis();

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    // TODO: Implement add to cart functionality
  };

  const handleAddToWishlist = (product) => {
    console.log('Add to wishlist:', product);
    // TODO: Implement add to wishlist functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User Header */}
      <UserHeader />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8" />
            <h2 className="text-5xl font-bold">
              <Shuffle
                text="Unlock Your Pet's Perfect Style"
                shuffleDirection="up"
                duration={0.6}
                ease="power3.out"
                stagger={0.05}
                glowColor="#ffffff"
              />
            </h2>
            <AIGradient size="text-3xl" weight="font-bold">
              🤖 AI
            </AIGradient>
          </div>
          
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Our cutting-edge AI analyzes your pet's unique traits to recommend the best accessories, 
            ensuring comfort and joy.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg flex items-center gap-2"
            >
              <ShinyText text="Start Analysis Now" speed={2} className="text-indigo-600" />
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <PremiumGradient size="text-lg" weight="font-bold">
              👑 PREMIUM FEATURE
            </PremiumGradient>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Upload Section */}
          <div id="upload-section">
            <UploadSection
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              uploadedImage={uploadedImage}
              isAnalyzing={isAnalyzing}
            />
            
            {/* Analysis Button */}
            {uploadedImage && !hasAnalysis && (
              <div className="mt-6">
                <button
                  onClick={() => startAnalysis(uploadedImage)}
                  disabled={isAnalyzing}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <Shuffle
                        text="Analyzing Your Pet..."
                        shuffleDirection="left"
                        duration={0.3}
                        ease="power3.out"
                        stagger={0.02}
                        glowColor="#ffffff"
                      />
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      <ShinyText text="Start AI Analysis" speed={2} className="text-white" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
                {uploadedImage && (
                  <button
                    onClick={retryAnalysis}
                    className="mt-2 text-sm text-red-700 underline hover:no-underline"
                  >
                    Try again
                  </button>
                )}
              </div>
            )}
          </div>

          {/* How It Works & Benefits */}
          <div>
            <HowItWorks />
          </div>
        </div>

        {/* Analysis Results */}
        {hasAnalysis && (
          <div className="mb-12">
            <AnalysisResults
              petProfile={analysisResult.petProfile}
              confidence={analysisResult.confidence}
              processingTime={analysisResult.processingTime}
            />
          </div>
        )}

        {/* Product Recommendations */}
        {hasRecommendations && (
          <div className="mb-12">
            <ProductRecommendations
              recommendations={recommendations}
              petProfile={analysisResult?.petProfile}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          </div>
        )}

        {/* Analysis History (Future Feature) */}
        {hasAnalysis && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              <Sparkles className="w-6 h-6 inline-block mr-2 text-indigo-600" />
              Analysis History
            </h3>
            <p className="text-gray-600 mb-4">
              Save and compare your pet's analysis results over time to track changes and improvements.
            </p>
            <div className="flex gap-4">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Save This Analysis
              </button>
              <button className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                View History
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pawfect Match AI</h3>
            <p className="text-gray-600 mb-4">
              Experience the future of pet care with our AI-powered analysis system.
            </p>
            <div className="flex justify-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email for AI updates"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between pt-8 border-t text-sm text-gray-600">
            <div>English</div>
            <div>© 2025 Pawfect Match AI</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">AI Ethics</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

