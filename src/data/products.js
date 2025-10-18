// Mock products data
export const mockProducts = [
  {
    id: 1,
    name: 'Premium Dog Collar',
    price: 29.99,
    category: { name: 'Accessories', id: 'accessories' },
    description: 'Comfortable and durable collar for your furry friend',
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: 'Interactive Dog Toy',
    price: 19.99,
    category: { name: 'Toys', id: 'toys' },
    description: 'Keeps your dog entertained for hours',
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    featured: false
  },
  {
    id: 3,
    name: 'Dog Food Bowl Set',
    price: 24.99,
    category: { name: 'Food & Treats', id: 'food' },
    description: 'Stainless steel bowls for healthy eating',
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    featured: false
  },
  {
    id: 4,
    name: 'Cozy Dog Bed',
    price: 89.99,
    category: { name: 'Beds', id: 'beds' },
    description: 'Ultra-comfortable bed for restful sleep',
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 203,
    inStock: true,
    featured: true
  },
  {
    id: 5,
    name: 'Dog Leash',
    price: 15.99,
    category: { name: 'Accessories', id: 'accessories' },
    description: 'Strong and reliable leash for walks',
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 78,
    inStock: true,
    featured: false
  }
];

export const getProductsByCategory = (categoryName) => {
  return mockProducts.filter(product => product.category.name === categoryName);
};

export const getFeaturedProduct = () => {
  return mockProducts.find(product => product.featured) || mockProducts[0];
};

export const getProductById = (id) => {
  return mockProducts.find(product => product.id === id);
};

export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.name.toLowerCase().includes(lowercaseQuery)
  );
};
