/**
 * Analysis Engine Service
 * Handles business logic for pet analysis and recommendations
 */

import { mockPetProfiles, mockProductDatabase } from '../mock/aiResponse';

class AnalysisEngine {
  constructor() {
    this.analysisRules = {
      sizeMapping: {
        'small': { weight: '< 20 lbs', height: '< 12 inches' },
        'medium': { weight: '20-60 lbs', height: '12-24 inches' },
        'large': { weight: '60-100 lbs', height: '24-36 inches' },
        'xlarge': { weight: '> 100 lbs', height: '> 36 inches' }
      },
      activityLevels: {
        'low': { description: 'Calm and relaxed', exercise: '< 30 min/day' },
        'moderate': { description: 'Balanced energy', exercise: '30-60 min/day' },
        'high': { description: 'Very active', exercise: '> 60 min/day' },
        'extreme': { description: 'Hyperactive', exercise: '> 2 hours/day' }
      }
    };
  }

  /**
   * Process raw AI analysis into structured pet profile
   * @param {Object} rawAnalysis - Raw AI analysis data
   * @returns {Object} Processed pet profile
   */
  processAnalysis(rawAnalysis) {
    try {
      console.log('🔧 Analysis Engine: Processing raw analysis...');
      
      const profile = {
        id: rawAnalysis.analysisId || `profile_${Date.now()}`,
        type: this.determinePetType(rawAnalysis),
        breed: rawAnalysis.breed || 'Mixed Breed',
        size: this.determineSize(rawAnalysis),
        age: this.determineAge(rawAnalysis),
        furType: rawAnalysis.furType || 'Unknown',
        activity: this.determineActivityLevel(rawAnalysis),
        traits: this.extractTraits(rawAnalysis),
        health: this.assessHealth(rawAnalysis),
        confidence: rawAnalysis.confidence || 0.85,
        timestamp: new Date().toISOString()
      };

      console.log('🔧 Analysis Engine: Profile processed:', profile);
      return profile;
    } catch (error) {
      console.error('🔧 Analysis Engine: Processing failed:', error);
      throw new Error('Failed to process analysis');
    }
  }

  /**
   * Determine pet type from analysis
   */
  determinePetType(analysis) {
    const type = analysis.type?.toLowerCase();
    if (type?.includes('dog') || type?.includes('canine')) return 'Dog';
    if (type?.includes('cat') || type?.includes('feline')) return 'Cat';
    if (type?.includes('bird')) return 'Bird';
    if (type?.includes('rabbit')) return 'Rabbit';
    return 'Unknown';
  }

  /**
   * Determine size category
   */
  determineSize(analysis) {
    const size = analysis.size?.toLowerCase();
    if (size?.includes('small') || size?.includes('tiny')) return 'Small';
    if (size?.includes('medium') || size?.includes('mid')) return 'Medium';
    if (size?.includes('large') || size?.includes('big')) return 'Large';
    if (size?.includes('xlarge') || size?.includes('giant')) return 'XLarge';
    return 'Medium'; // Default
  }

  /**
   * Determine age category
   */
  determineAge(analysis) {
    const age = analysis.age?.toLowerCase();
    if (age?.includes('puppy') || age?.includes('kitten') || age?.includes('young')) return 'Young';
    if (age?.includes('adult') || age?.includes('mature')) return 'Adult';
    if (age?.includes('senior') || age?.includes('old')) return 'Senior';
    return 'Adult'; // Default
  }

  /**
   * Determine activity level
   */
  determineActivityLevel(analysis) {
    const activity = analysis.activity?.toLowerCase();
    if (activity?.includes('low') || activity?.includes('calm')) return 'Low';
    if (activity?.includes('moderate') || activity?.includes('balanced')) return 'Moderate';
    if (activity?.includes('high') || activity?.includes('active')) return 'High';
    if (activity?.includes('extreme') || activity?.includes('hyper')) return 'Extreme';
    return 'Moderate'; // Default
  }

  /**
   * Extract personality traits
   */
  extractTraits(analysis) {
    const traits = analysis.traits || [];
    const commonTraits = [
      'Friendly', 'Energetic', 'Playful', 'Calm', 'Independent',
      'Affectionate', 'Intelligent', 'Loyal', 'Curious', 'Gentle'
    ];
    
    // If no traits provided, generate based on type and activity
    if (traits.length === 0) {
      const type = this.determinePetType(analysis);
      const activity = this.determineActivityLevel(analysis);
      
      if (type === 'Dog') {
        if (activity === 'High') return ['Energetic', 'Playful', 'Friendly'];
        if (activity === 'Low') return ['Calm', 'Gentle', 'Loyal'];
        return ['Friendly', 'Loyal', 'Intelligent'];
      } else if (type === 'Cat') {
        if (activity === 'High') return ['Curious', 'Playful', 'Independent'];
        if (activity === 'Low') return ['Calm', 'Gentle', 'Affectionate'];
        return ['Independent', 'Curious', 'Affectionate'];
      }
    }
    
    return traits.slice(0, 5); // Limit to 5 traits
  }

  /**
   * Assess health indicators
   */
  assessHealth(analysis) {
    return {
      overall: analysis.health?.overall || 'Good',
      weight: analysis.health?.weight || 'Normal',
      coat: analysis.health?.coat || 'Healthy',
      eyes: analysis.health?.eyes || 'Clear',
      energy: analysis.health?.energy || 'Normal'
    };
  }

  /**
   * Generate product recommendations based on pet profile
   * @param {Object} petProfile - Processed pet profile
   * @returns {Array} Product recommendations
   */
  generateRecommendations(petProfile) {
    try {
      console.log('🔧 Analysis Engine: Generating recommendations for:', petProfile);
      
      const recommendations = [];
      const productDB = mockProductDatabase;
      
      // Filter products based on pet characteristics
      const relevantProducts = productDB.filter(product => {
        return this.isProductRelevant(product, petProfile);
      });
      
      // Score and sort products
      const scoredProducts = relevantProducts.map(product => ({
        ...product,
        matchScore: this.calculateMatchScore(product, petProfile),
        reason: this.generateRecommendationReason(product, petProfile)
      }));
      
      // Sort by match score and take top recommendations
      const topRecommendations = scoredProducts
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 8);
      
      console.log('🔧 Analysis Engine: Generated recommendations:', topRecommendations);
      return topRecommendations;
    } catch (error) {
      console.error('🔧 Analysis Engine: Recommendation generation failed:', error);
      return [];
    }
  }

  /**
   * Check if product is relevant for pet
   */
  isProductRelevant(product, petProfile) {
    // Size compatibility
    if (product.sizeRestriction) {
      const petSize = petProfile.size.toLowerCase();
      if (!product.sizeRestriction.includes(petSize)) {
        return false;
      }
    }
    
    // Type compatibility
    if (product.petType && product.petType !== petProfile.type) {
      return false;
    }
    
    // Age compatibility
    if (product.ageRestriction) {
      const petAge = petProfile.age.toLowerCase();
      if (!product.ageRestriction.includes(petAge)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Calculate match score for product
   */
  calculateMatchScore(product, petProfile) {
    let score = 50; // Base score
    
    // Size match bonus
    if (product.sizeRestriction?.includes(petProfile.size.toLowerCase())) {
      score += 20;
    }
    
    // Type match bonus
    if (product.petType === petProfile.type) {
      score += 15;
    }
    
    // Activity level match
    if (product.activityLevel === petProfile.activity) {
      score += 15;
    }
    
    // Trait compatibility
    if (product.traits) {
      const matchingTraits = product.traits.filter(trait => 
        petProfile.traits.includes(trait)
      );
      score += matchingTraits.length * 5;
    }
    
    // Age match
    if (product.ageRestriction?.includes(petProfile.age.toLowerCase())) {
      score += 10;
    }
    
    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Generate recommendation reason
   */
  generateRecommendationReason(product, petProfile) {
    const reasons = [];
    
    if (product.sizeRestriction?.includes(petProfile.size.toLowerCase())) {
      reasons.push(`Perfect size for ${petProfile.size.toLowerCase()} pets`);
    }
    
    if (product.activityLevel === petProfile.activity) {
      reasons.push(`Matches ${petProfile.activity.toLowerCase()} activity level`);
    }
    
    if (product.petType === petProfile.type) {
      reasons.push(`Specially designed for ${petProfile.type.toLowerCase()}s`);
    }
    
    if (product.traits) {
      const matchingTraits = product.traits.filter(trait => 
        petProfile.traits.includes(trait)
      );
      if (matchingTraits.length > 0) {
        reasons.push(`Suits ${matchingTraits.join(', ').toLowerCase()} personality`);
      }
    }
    
    return reasons.length > 0 ? reasons.join('. ') : 'Great match for your pet';
  }
}

// Create singleton instance
export const analysisEngine = new AnalysisEngine();
export default analysisEngine;

