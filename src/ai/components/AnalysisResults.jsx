import React from 'react';
import { Brain, Sparkles, CheckCircle, Clock, Heart, Star } from 'lucide-react';

/**
 * AnalysisResults Component
 * Displays AI analysis results and pet profile
 */
export default function AnalysisResults({ 
  petProfile, 
  confidence, 
  processingTime,
  className = '' 
}) {
  if (!petProfile) return null;

  const getConfidenceColor = (conf) => {
    if (conf >= 90) return 'text-green-600 bg-green-100';
    if (conf >= 75) return 'text-blue-600 bg-blue-100';
    if (conf >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceText = (conf) => {
    if (conf >= 90) return 'Excellent';
    if (conf >= 75) return 'Good';
    if (conf >= 60) return 'Fair';
    return 'Low';
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 animate-fade-in ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-7 h-7 text-indigo-600" />
        <h3 className="text-2xl font-bold text-gray-900">AI Analysis Results</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(confidence)}`}>
          {getConfidenceText(confidence)} ({confidence}%)
        </div>
      </div>

      {/* Processing Info */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>Processed in {Math.round(processingTime / 1000)}s</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Analysis Complete</span>
        </div>
      </div>

      {/* Pet Profile Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
          <p className="text-sm text-indigo-600 font-medium mb-1">Pet Type</p>
          <p className="text-xl font-bold text-gray-900">{petProfile.type}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium mb-1">Breed</p>
          <p className="text-xl font-bold text-gray-900">{petProfile.breed}</p>
        </div>
        
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
          <p className="text-sm text-pink-600 font-medium mb-1">Size</p>
          <p className="text-xl font-bold text-gray-900">{petProfile.size}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium mb-1">Activity Level</p>
          <p className="text-xl font-bold text-gray-900">{petProfile.activity}</p>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Age & Fur Type */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Age Category</span>
            <span className="text-sm font-semibold text-gray-900">{petProfile.age}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Fur Type</span>
            <span className="text-sm font-semibold text-gray-900">{petProfile.furType}</span>
          </div>
        </div>

        {/* Health Assessment */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 mb-3">Health Assessment</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Overall Health</span>
              <span className="font-semibold text-green-600">{petProfile.health?.overall}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Weight Status</span>
              <span className="font-semibold text-gray-900">{petProfile.health?.weight}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Coat Condition</span>
              <span className="font-semibold text-gray-900">{petProfile.health?.coat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-pink-500" />
          <h4 className="font-semibold text-gray-900">Personality Traits</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {petProfile.traits?.map((trait, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
            >
              <Star className="w-3 h-3" />
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h4 className="font-semibold text-gray-900">Analysis Summary</h4>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
          Your {petProfile.type.toLowerCase()} appears to be a {petProfile.breed} with {petProfile.activity.toLowerCase()} 
          activity levels. Based on the analysis, your pet shows {petProfile.traits?.slice(0, 3).join(', ').toLowerCase()} 
          characteristics, making them perfect for {petProfile.activity === 'High' ? 'active' : 'calm'} lifestyle accessories.
        </p>
      </div>
    </div>
  );
}

