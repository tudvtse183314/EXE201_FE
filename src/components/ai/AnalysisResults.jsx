import React from 'react';
import { CheckCircle, Clock, Target } from 'lucide-react';

export default function AnalysisResults({ petProfile, confidence, processingTime }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Analysis Results</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900">Breed</h4>
          <p className="text-gray-600">{petProfile.breed}</p>
        </div>
        
        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900">Size</h4>
          <p className="text-gray-600">{petProfile.size}</p>
        </div>
        
        <div className="text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900">Age</h4>
          <p className="text-gray-600">{petProfile.age}</p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Confidence</span>
          <span className="text-sm font-bold text-gray-900">{(confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${confidence * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Processing time: {processingTime}s
        </p>
      </div>
    </div>
  );
}
