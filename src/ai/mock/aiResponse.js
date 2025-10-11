/**
 * Mock AI Response Data
 * Simulates backend AI analysis responses for development
 */

// Mock pet profiles for different scenarios
export const mockPetProfiles = [
  {
    type: 'Dog',
    breed: 'Golden Retriever',
    size: 'Large',
    age: 'Adult',
    furType: 'Long',
    activity: 'High',
    traits: ['Friendly', 'Energetic', 'Playful', 'Loyal', 'Intelligent'],
    health: {
      overall: 'Excellent',
      weight: 'Normal',
      coat: 'Shiny',
      eyes: 'Clear',
      energy: 'High'
    }
  },
  {
    type: 'Cat',
    breed: 'British Shorthair',
    size: 'Medium',
    age: 'Adult',
    furType: 'Short',
    activity: 'Moderate',
    traits: ['Calm', 'Independent', 'Affectionate', 'Gentle', 'Curious'],
    health: {
      overall: 'Good',
      weight: 'Normal',
      coat: 'Smooth',
      eyes: 'Clear',
      energy: 'Moderate'
    }
  },
  {
    type: 'Dog',
    breed: 'Poodle',
    size: 'Medium',
    age: 'Young',
    furType: 'Curly',
    activity: 'High',
    traits: ['Intelligent', 'Active', 'Loyal', 'Playful', 'Energetic'],
    health: {
      overall: 'Excellent',
      weight: 'Normal',
      coat: 'Curly',
      eyes: 'Clear',
      energy: 'High'
    }
  },
  {
    type: 'Cat',
    breed: 'Persian',
    size: 'Medium',
    age: 'Senior',
    furType: 'Long',
    activity: 'Low',
    traits: ['Calm', 'Gentle', 'Affectionate', 'Quiet', 'Elegant'],
    health: {
      overall: 'Good',
      weight: 'Normal',
      coat: 'Long',
      eyes: 'Clear',
      energy: 'Low'
    }
  },
  {
    type: 'Dog',
    breed: 'German Shepherd',
    size: 'Large',
    age: 'Adult',
    furType: 'Medium',
    activity: 'Extreme',
    traits: ['Intelligent', 'Loyal', 'Protective', 'Energetic', 'Confident'],
    health: {
      overall: 'Excellent',
      weight: 'Normal',
      coat: 'Thick',
      eyes: 'Alert',
      energy: 'Extreme'
    }
  }
];

// Mock product database
export const mockProductDatabase = [
  // Dog Products
  {
    id: 1,
    name: 'Heavy-Duty Chew Toys',
    category: 'Toys',
    price: 24.99,
    petType: 'Dog',
    sizeRestriction: ['large', 'xlarge'],
    activityLevel: 'High',
    ageRestriction: ['young', 'adult'],
    traits: ['Energetic', 'Playful'],
    description: 'Durable toys perfect for large, energetic dogs'
  },
  {
    id: 2,
    name: 'Large Breed Dog Food',
    category: 'Food',
    price: 58.00,
    petType: 'Dog',
    sizeRestriction: ['large', 'xlarge'],
    activityLevel: 'High',
    ageRestriction: ['adult'],
    traits: ['Energetic'],
    description: 'Specially formulated for large breeds'
  },
  {
    id: 3,
    name: 'Durable Leash & Harness',
    category: 'Accessories',
    price: 35.00,
    petType: 'Dog',
    sizeRestriction: ['large', 'xlarge'],
    activityLevel: 'High',
    ageRestriction: ['young', 'adult'],
    traits: ['Energetic', 'Playful'],
    description: 'Strong and comfortable for big dogs'
  },
  {
    id: 4,
    name: 'Orthopedic Dog Bed',
    category: 'Furniture',
    price: 89.99,
    petType: 'Dog',
    sizeRestriction: ['large', 'xlarge'],
    activityLevel: 'Low',
    ageRestriction: ['senior', 'adult'],
    traits: ['Calm', 'Gentle'],
    description: 'Supports joint health for larger dogs'
  },
  {
    id: 5,
    name: 'Interactive Puzzle Toy',
    category: 'Toys',
    price: 19.99,
    petType: 'Dog',
    sizeRestriction: ['medium', 'large'],
    activityLevel: 'Moderate',
    ageRestriction: ['young', 'adult'],
    traits: ['Intelligent', 'Curious'],
    description: 'Great mental stimulation for smart dogs'
  },
  {
    id: 6,
    name: 'Premium Dog Shampoo',
    category: 'Grooming',
    price: 22.50,
    petType: 'Dog',
    sizeRestriction: ['small', 'medium', 'large'],
    activityLevel: 'Moderate',
    ageRestriction: ['young', 'adult', 'senior'],
    traits: ['Calm'],
    description: 'Ideal for curly fur maintenance'
  },
  {
    id: 7,
    name: 'Training Treats Pack',
    category: 'Food',
    price: 15.99,
    petType: 'Dog',
    sizeRestriction: ['small', 'medium', 'large'],
    activityLevel: 'Moderate',
    ageRestriction: ['young', 'adult'],
    traits: ['Intelligent', 'Loyal'],
    description: 'Essential for intelligent breeds'
  },
  
  // Cat Products
  {
    id: 8,
    name: 'Multi-Level Cat Tree',
    category: 'Furniture',
    price: 79.99,
    petType: 'Cat',
    sizeRestriction: ['medium', 'large'],
    activityLevel: 'Moderate',
    ageRestriction: ['young', 'adult'],
    traits: ['Curious', 'Playful'],
    description: 'Perfect for climbing and resting'
  },
  {
    id: 9,
    name: 'Premium Cat Food',
    category: 'Food',
    price: 42.00,
    petType: 'Cat',
    sizeRestriction: ['small', 'medium', 'large'],
    activityLevel: 'Moderate',
    ageRestriction: ['adult', 'senior'],
    traits: ['Calm', 'Independent'],
    description: 'Balanced nutrition for indoor cats'
  },
  {
    id: 10,
    name: 'Interactive Laser Toy',
    category: 'Toys',
    price: 14.99,
    petType: 'Cat',
    sizeRestriction: ['small', 'medium', 'large'],
    activityLevel: 'Moderate',
    ageRestriction: ['young', 'adult'],
    traits: ['Curious', 'Playful'],
    description: 'Keeps moderate activity cats engaged'
  },
  {
    id: 11,
    name: 'Self-Grooming Brush',
    category: 'Grooming',
    price: 18.50,
    petType: 'Cat',
    sizeRestriction: ['small', 'medium', 'large'],
    activityLevel: 'Low',
    ageRestriction: ['adult', 'senior'],
    traits: ['Calm', 'Gentle'],
    description: 'Great for short-haired cats'
  },
  {
    id: 12,
    name: 'Cozy Cat Bed',
    category: 'Furniture',
    price: 45.99,
    petType: 'Cat',
    sizeRestriction: ['small', 'medium'],
    activityLevel: 'Low',
    ageRestriction: ['senior', 'adult'],
    traits: ['Calm', 'Gentle', 'Affectionate'],
    description: 'Perfect for calm, senior cats'
  }
];

// Mock AI Response Generator
export const mockAiResponse = {
  /**
   * Get random mock response
   */
  getRandomResponse() {
    const randomProfile = mockPetProfiles[Math.floor(Math.random() * mockPetProfiles.length)];
    const confidence = 0.75 + Math.random() * 0.2; // 75-95% confidence
    
    return {
      petProfile: randomProfile,
      confidence: Math.round(confidence * 100),
      analysisId: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      processingTime: Math.floor(Math.random() * 3000) + 1000
    };
  },

  /**
   * Get analysis history for user
   */
  getAnalysisHistory(userId) {
    const history = [];
    const numAnalyses = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < numAnalyses; i++) {
      const analysis = this.getRandomResponse();
      analysis.userId = userId;
      analysis.savedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
      history.push(analysis);
    }
    
    return history.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  },

  /**
   * Save analysis results
   */
  saveAnalysis(analysisData) {
    const savedAnalysis = {
      ...analysisData,
      id: `saved_${Date.now()}`,
      savedAt: new Date().toISOString(),
      userId: analysisData.userId || 'current_user'
    };
    
    console.log('💾 Mock AI: Analysis saved:', savedAnalysis);
    return savedAnalysis;
  },

  /**
   * Get product recommendations
   */
  getRecommendations(petProfile) {
    const recommendations = [];
    const productDB = mockProductDatabase;
    
    // Filter and score products
    const relevantProducts = productDB.filter(product => {
      // Size compatibility
      if (product.sizeRestriction && !product.sizeRestriction.includes(petProfile.size.toLowerCase())) {
        return false;
      }
      
      // Type compatibility
      if (product.petType && product.petType !== petProfile.type) {
        return false;
      }
      
      return true;
    });
    
    // Score products
    const scoredProducts = relevantProducts.map(product => {
      let score = 50; // Base score
      
      // Activity level match
      if (product.activityLevel === petProfile.activity) {
        score += 20;
      }
      
      // Trait compatibility
      if (product.traits) {
        const matchingTraits = product.traits.filter(trait => 
          petProfile.traits.includes(trait)
        );
        score += matchingTraits.length * 10;
      }
      
      // Age compatibility
      if (product.ageRestriction && product.ageRestriction.includes(petProfile.age.toLowerCase())) {
        score += 15;
      }
      
      return {
        ...product,
        matchScore: Math.min(score, 100),
        reason: this.generateReason(product, petProfile)
      };
    });
    
    // Return top 8 recommendations
    return scoredProducts
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8);
  },

  /**
   * Generate recommendation reason
   */
  generateReason(product, petProfile) {
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
    
    return reasons.length > 0 ? reasons.join('. ') : 'Great match for your pet';
  }
};

export default mockAiResponse;

