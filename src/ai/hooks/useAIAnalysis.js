import { useState, useCallback } from 'react';
import { aiVisionService } from '../services/aiVision';
import { analysisEngine } from '../services/analysisEngine';

/**
 * Custom hook for AI Analysis functionality
 * Manages the complete AI analysis workflow
 */
export const useAIAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  /**
   * Start AI analysis process
   */
  const startAnalysis = useCallback(async (imageData) => {
    if (!imageData) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setRecommendations([]);

    try {
      console.log('🔍 Starting AI analysis...');
      
      // Step 1: Analyze image with AI Vision Service
      const analysisResponse = await aiVisionService.analyzePetImage(imageData, {
        includeBehavior: true,
        includeHealth: true
      });

      if (!analysisResponse.success) {
        throw new Error('AI analysis failed');
      }

      console.log('🔍 AI analysis completed:', analysisResponse.data);

      // Step 2: Process analysis with Analysis Engine
      const processedProfile = analysisEngine.processAnalysis(analysisResponse.data);
      console.log('🔧 Profile processed:', processedProfile);

      // Step 3: Generate recommendations
      const productRecommendations = analysisEngine.generateRecommendations(processedProfile);
      console.log('🎯 Recommendations generated:', productRecommendations);

      // Step 4: Save analysis (optional)
      try {
        await aiVisionService.saveAnalysis({
          ...analysisResponse.data,
          petProfile: processedProfile,
          recommendations: productRecommendations
        });
      } catch (saveError) {
        console.warn('Failed to save analysis:', saveError);
        // Don't fail the whole process if save fails
      }

      // Update state
      setAnalysisResult({
        petProfile: processedProfile,
        confidence: analysisResponse.data.confidence,
        processingTime: analysisResponse.data.processingTime,
        analysisId: analysisResponse.data.analysisId
      });
      setRecommendations(productRecommendations);

      console.log('✅ AI analysis workflow completed successfully');

    } catch (err) {
      console.error('❌ AI analysis failed:', err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Handle image upload
   */
  const handleImageUpload = useCallback((imageData, file) => {
    setUploadedImage(imageData);
    setError(null);
    setAnalysisResult(null);
    setRecommendations([]);
  }, []);

  /**
   * Remove uploaded image
   */
  const handleImageRemove = useCallback(() => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setRecommendations([]);
    setError(null);
  }, []);

  /**
   * Clear all analysis data
   */
  const clearAnalysis = useCallback(() => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setRecommendations([]);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  /**
   * Retry analysis with current image
   */
  const retryAnalysis = useCallback(() => {
    if (uploadedImage) {
      startAnalysis(uploadedImage);
    }
  }, [uploadedImage, startAnalysis]);

  /**
   * Get analysis history
   */
  const getAnalysisHistory = useCallback(async (userId) => {
    try {
      return await aiVisionService.getAnalysisHistory(userId);
    } catch (err) {
      console.error('Failed to get analysis history:', err);
      return [];
    }
  }, []);

  return {
    // State
    isAnalyzing,
    analysisResult,
    recommendations,
    error,
    uploadedImage,
    
    // Actions
    startAnalysis,
    handleImageUpload,
    handleImageRemove,
    clearAnalysis,
    retryAnalysis,
    getAnalysisHistory,
    
    // Computed
    hasAnalysis: !!analysisResult,
    hasRecommendations: recommendations.length > 0,
    canAnalyze: !!uploadedImage && !isAnalyzing
  };
};

export default useAIAnalysis;

