// Mock data for products - will be replaced with real API call later
export const mockProducts = [
  // Clothing Products
  {
    id: 1,
    name: 'Natural Pet Odor Eliminator',
    description: 'Eliminates pet odors naturally with plant-based ingredients',
    price: 15.99,
    stock: 50,
    category: {
      id: 1,
      name: 'Cleaning Essentials',
      description: 'Essential cleaning products for pet care'
    },
    badge: '24% off',
    image: 'spray'
  },
  {
    id: 2,
    name: 'Cozy Knit Sweater',
    description: 'Soft and warm sweater for your furry friend',
    price: 28.50,
    stock: 25,
    category: {
      id: 2,
      name: 'Dog Clothing',
      description: 'Comfortable clothing for dogs'
    },
    badge: '20% off',
    image: 'sweater'
  },
  {
    id: 3,
    name: 'Automatic Pet Feeder',
    description: 'Smart feeder with portion control and scheduling',
    price: 45.99,
    stock: 15,
    category: {
      id: 3,
      name: 'Feeding Supplies',
      description: 'Essential feeding equipment'
    },
    badge: '',
    image: 'feeder'
  },
  {
    id: 4,
    name: 'Durable Paw Protectors',
    description: 'Protect your pet\'s paws from harsh surfaces',
    price: 22.00,
    stock: 30,
    category: {
      id: 4,
      name: 'Dog Accessories',
      description: 'Functional accessories for dogs'
    },
    badge: '15% off',
    image: 'shoes'
  },
  {
    id: 5,
    name: 'Cooling Vest',
    description: 'Keep your pet cool during hot weather',
    price: 38.00,
    stock: 20,
    category: {
      id: 2,
      name: 'Dog Clothing',
      description: 'Comfortable clothing for dogs'
    },
    badge: '',
    image: 'vest'
  },

  // Toy Products
  {
    id: 6,
    name: 'Interactive Puzzle Toy',
    description: 'Mental stimulation toy for intelligent pets',
    price: 19.99,
    stock: 40,
    category: {
      id: 5,
      name: 'Toys',
      description: 'Fun and engaging toys for pets'
    },
    badge: '30% off',
    image: 'puzzle'
  },
  {
    id: 7,
    name: 'Indestructible Chew Bone',
    description: 'Durable chew toy for aggressive chewers',
    price: 14.00,
    stock: 35,
    category: {
      id: 5,
      name: 'Toys',
      description: 'Fun and engaging toys for pets'
    },
    badge: '25% off',
    image: 'bone'
  },
  {
    id: 8,
    name: 'Automatic Fetch Ball Set',
    description: 'Self-launching balls for endless fetch fun',
    price: 59.00,
    stock: 12,
    category: {
      id: 5,
      name: 'Toys',
      description: 'Fun and engaging toys for pets'
    },
    badge: '15% off',
    image: 'balls'
  },
  {
    id: 9,
    name: 'Plush Squeaky Buddy',
    description: 'Soft plush toy with squeaker for playtime',
    price: 12.50,
    stock: 45,
    category: {
      id: 5,
      name: 'Toys',
      description: 'Fun and engaging toys for pets'
    },
    badge: '20% off',
    image: 'plush'
  },
  {
    id: 10,
    name: 'Cat Laser Pointer',
    description: 'Interactive laser pointer for cat exercise',
    price: 9.99,
    stock: 60,
    category: {
      id: 5,
      name: 'Toys',
      description: 'Fun and engaging toys for pets'
    },
    badge: '',
    image: 'laser'
  },

  // Food Products
  {
    id: 11,
    name: 'Premium Grain-Free Kibble',
    description: 'High-quality grain-free dog food',
    price: 65.00,
    stock: 25,
    category: {
      id: 6,
      name: 'Food & Treats',
      description: 'Nutritious food and treats for pets'
    },
    badge: '10% off',
    image: 'kibble'
  },
  {
    id: 12,
    name: 'Hypoallergenic Cat Dry Food',
    description: 'Specialized food for cats with allergies',
    price: 48.00,
    stock: 18,
    category: {
      id: 6,
      name: 'Food & Treats',
      description: 'Nutritious food and treats for pets'
    },
    badge: '20% off',
    image: 'catfood'
  },
  {
    id: 13,
    name: 'Dental Health Chews',
    description: 'Promotes dental health while satisfying chew needs',
    price: 18.00,
    stock: 30,
    category: {
      id: 6,
      name: 'Food & Treats',
      description: 'Nutritious food and treats for pets'
    },
    badge: '25% off',
    image: 'chews'
  },
  {
    id: 14,
    name: 'Natural Training Treats',
    description: 'Small, healthy treats perfect for training',
    price: 10.50,
    stock: 50,
    category: {
      id: 6,
      name: 'Food & Treats',
      description: 'Nutritious food and treats for pets'
    },
    badge: '30% off',
    image: 'treats'
  },
  {
    id: 15,
    name: 'Wet Food Variety Pack',
    description: 'Assorted wet food flavors for variety',
    price: 28.00,
    stock: 22,
    category: {
      id: 6,
      name: 'Food & Treats',
      description: 'Nutritious food and treats for pets'
    },
    badge: '',
    image: 'wetfood'
  },

  // Accessories
  {
    id: 16,
    name: 'GPS Pet Tracker Collar',
    description: 'Track your pet\'s location with GPS technology',
    price: 79.99,
    stock: 8,
    category: {
      id: 7,
      name: 'Accessories',
      description: 'Useful accessories for pet care'
    },
    badge: '15% off',
    image: 'tracker'
  },
  {
    id: 17,
    name: 'Automatic Ball Launcher',
    description: 'Automated ball launcher for solo play',
    price: 120.00,
    stock: 5,
    category: {
      id: 7,
      name: 'Accessories',
      description: 'Useful accessories for pet care'
    },
    badge: '10% off',
    image: 'launcher'
  },
  {
    id: 18,
    name: 'Interactive Pet Camera',
    description: 'Monitor and interact with your pet remotely',
    price: 89.00,
    stock: 10,
    category: {
      id: 7,
      name: 'Accessories',
      description: 'Useful accessories for pet care'
    },
    badge: '20% off',
    image: 'camera'
  },
  {
    id: 19,
    name: 'All-Weather Rain Jacket',
    description: 'Waterproof jacket for all weather conditions',
    price: 35.00,
    stock: 20,
    category: {
      id: 7,
      name: 'Accessories',
      description: 'Useful accessories for pet care'
    },
    badge: '25% off',
    image: 'jacket'
  },
  {
    id: 20,
    name: 'De-shedding Grooming Tool',
    description: 'Effective tool for reducing pet shedding',
    price: 41.00,
    stock: 25,
    category: {
      id: 7,
      name: 'Accessories',
      description: 'Useful accessories for pet care'
    },
    badge: '18% off',
    image: 'brush'
  },

  // Recent Products
  {
    id: 21,
    name: 'Luxury Calming Bed',
    description: 'Premium bed with calming properties for anxious pets',
    price: 85.00,
    stock: 12,
    category: {
      id: 8,
      name: 'Bed & Furniture',
      description: 'Comfortable beds and furniture for pets'
    },
    badge: '15% off',
    image: 'bed'
  },
  {
    id: 22,
    name: 'Modern Cat Scratching Post',
    description: 'Sleek scratching post that fits modern decor',
    price: 65.00,
    stock: 15,
    category: {
      id: 8,
      name: 'Bed & Furniture',
      description: 'Comfortable beds and furniture for pets'
    },
    badge: '20% off',
    image: 'scratch'
  },
  {
    id: 23,
    name: 'Eco-Friendly Waste Bags',
    description: 'Biodegradable waste bags for responsible pet care',
    price: 12.00,
    stock: 100,
    category: {
      id: 1,
      name: 'Cleaning Essentials',
      description: 'Essential cleaning products for pet care'
    },
    badge: '30% off',
    image: 'bags'
  },
  {
    id: 24,
    name: 'Waterproof Car Seat Cover',
    description: 'Protect your car seats from pet hair and dirt',
    price: 36.00,
    stock: 18,
    category: {
      id: 9,
      name: 'Travel Accessories',
      description: 'Accessories for traveling with pets'
    },
    badge: '25% off',
    image: 'cover'
  }
];

// Helper function to get products by category
export const getProductsByCategory = (categoryName) => {
  return mockProducts.filter(product => product.category.name === categoryName);
};

// Helper function to get all unique categories
export const getCategories = () => {
  const categories = mockProducts.map(product => product.category);
  return [...new Map(categories.map(cat => [cat.id, cat])).values()];
};

// Helper function to get featured product (first product as hero)
export const getFeaturedProduct = () => {
  return mockProducts[0]; // Smart Pet Feeder Pro
};
