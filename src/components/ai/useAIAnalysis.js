import { useState } from 'react';

export const useAIAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const startAnalysis = async (image) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult = {
        petProfile: {
          breed: 'Golden Retriever',
          size: 'Large',
          age: 'Adult',
          temperament: 'Friendly'
        },
        confidence: 0.95,
        processingTime: 2.8
      };
      
      const mockRecommendations = [
        {
          id: 1,
          name: 'Premium Dog Collar',
          price: 29.99,
          category: 'Accessories',
          image: '/api/placeholder/300/300'
        },
        {
          id: 2,
          name: 'Comfortable Dog Bed',
          price: 89.99,
          category: 'Beds',
          image: '/api/placeholder/300/300'
        }
      ];
      
      setAnalysisResult(mockResult);
      setRecommendations(mockRecommendations);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setRecommendations([]);
    setError(null);
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
    setRecommendations([]);
    setError(null);
  };

  const retryAnalysis = () => {
    if (uploadedImage) {
      startAnalysis(uploadedImage);
    }
  };

  return {
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
    hasAnalysis: !!analysisResult,
    hasRecommendations: recommendations.length > 0,
    canAnalyze: !!uploadedImage && !isAnalyzing
  };
};
