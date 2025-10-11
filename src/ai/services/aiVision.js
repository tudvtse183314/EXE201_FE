/**
 * AI Vision Service
 * Handles image analysis and pet recognition using AI
 */

import { mockAiResponse } from '../mock/aiResponse';
import API_CONFIG from '../../config/api';

class AIVisionService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_AI_API_URL || `${API_CONFIG.BASE_URL}/ai`;
    this.useMock = process.env.NODE_ENV === 'development' || !process.env.REACT_APP_AI_API_URL;
  }

  /**
   * Analyze pet image and extract features
   * @param {File|string} image - Image file or base64 string
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis results
   */
  async analyzePetImage(image, options = {}) {
    try {
      console.log('🔍 AI Vision: Starting pet image analysis...');
      
      if (this.useMock) {
        return await this.mockAnalyzeImage(image, options);
      }

      return await this.realAnalyzeImage(image, options);
    } catch (error) {
      console.error('🔍 AI Vision: Analysis failed:', error);
      throw new Error('Failed to analyze pet image');
    }
  }

  /**
   * Mock analysis for development
   */
  async mockAnalyzeImage(image, options) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    console.log('🔍 AI Vision: Using mock analysis');
    
    // Get mock response based on image or random
    const mockResponse = mockAiResponse.getRandomResponse();
    
    return {
      success: true,
      data: {
        petProfile: mockResponse.petProfile,
        confidence: mockResponse.confidence,
        analysisId: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString(),
        processingTime: Math.floor(Math.random() * 3000) + 1000
      }
    };
  }

  /**
   * Real AI analysis (when backend is available)
   */
  async realAnalyzeImage(image, options) {
    const formData = new FormData();
    
    if (typeof image === 'string') {
      // Convert base64 to blob
      const response = await fetch(image);
      const blob = await response.blob();
      formData.append('image', blob, 'pet-image.jpg');
    } else {
      formData.append('image', image);
    }

    // Add analysis options
    if (options.includeBehavior) {
      formData.append('includeBehavior', 'true');
    }
    if (options.includeHealth) {
      formData.append('includeHealth', 'true');
    }

    const response = await fetch(`${this.baseUrl}/analyze`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`AI analysis failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get analysis history for user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Analysis history
   */
  async getAnalysisHistory(userId) {
    try {
      if (this.useMock) {
        return mockAiResponse.getAnalysisHistory(userId);
      }

      const response = await fetch(`${this.baseUrl}/history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analysis history: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('🔍 AI Vision: Failed to get analysis history:', error);
      return [];
    }
  }

  /**
   * Save analysis results
   * @param {Object} analysisData - Analysis results
   * @returns {Promise<Object>} Saved analysis
   */
  async saveAnalysis(analysisData) {
    try {
      if (this.useMock) {
        return mockAiResponse.saveAnalysis(analysisData);
      }

      const response = await fetch(`${this.baseUrl}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(analysisData)
      });

      if (!response.ok) {
        throw new Error(`Failed to save analysis: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('🔍 AI Vision: Failed to save analysis:', error);
      throw error;
    }
  }

  /**
   * Get product recommendations based on analysis
   * @param {Object} petProfile - Pet profile from analysis
   * @returns {Promise<Array>} Product recommendations
   */
  async getRecommendations(petProfile) {
    try {
      if (this.useMock) {
        return mockAiResponse.getRecommendations(petProfile);
      }

      const response = await fetch(`${this.baseUrl}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(petProfile)
      });

      if (!response.ok) {
        throw new Error(`Failed to get recommendations: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('🔍 AI Vision: Failed to get recommendations:', error);
      return [];
    }
  }
}

// Create singleton instance
export const aiVisionService = new AIVisionService();
export default aiVisionService;

