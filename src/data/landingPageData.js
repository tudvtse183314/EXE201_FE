import { Heart, Package, ShoppingCart, Search, Star, Shield } from 'lucide-react';

export const featuresData = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "AI-Powered Matching",
    description: "Our advanced AI analyzes your pet's unique traits and preferences to recommend products they'll love, ensuring a personalized shopping experience."
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: "Personalized Profiles",
    description: "Create detailed profiles for each of your pets, including their breed, age, preferences, and health needs so that we can recommend the perfect products."
  },
  {
    icon: <ShoppingCart className="w-8 h-8" />,
    title: "Seamless Shopping",
    description: "Browse, select, and purchase recommended products directly from our site. Enjoy a smooth, hassle-free shopping experience."
  },
  {
    icon: <Search className="w-8 h-8" />,
    title: "Order Tracking",
    description: "Keep an eye on your pet's new favorite items with real-time tracking from warehouse to your doorstep."
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Curated Collections",
    description: "Explore expertly curated collections of toys, food, beds, and tools, designed for every pet's unique lifestyle."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Quality Guaranteed",
    description: "We partner with trusted brands to ensure all our pet-friendly products meet high standards of safety and quality."
  }
];

export const stepsData = [
  {
    step: "Step 1",
    title: "Create Your Pet's Profile",
    description: "Tell us about your pet's breed, size, age, energy level, and any specific behaviors or preferences. The more details, the better our AI can tailor recommendations just for them.",
    image: "🐕"
  },
  {
    step: "Step 2",
    title: "Receive Personalized Recommendations",
    description: "Our intelligent algorithm analyzes your pet's profile and suggests the best matching toys, and food from our curated selection, all matched perfectly to their needs.",
    image: "📱"
  },
  {
    step: "Step 3",
    title: "Shop with Ease",
    description: "Add your favorite recommended products to your cart and enjoy a seamless checkout experience. Track your orders from our app until they arrive at your doorstep.",
    image: "🛍️"
  }
];

export const testimonialsData = [
  {
    text: "PawfectMatch truly understands what my dog needs! The AI suggestions have been spot-on, and the shopping was a breeze.",
    name: "Sarah K.",
    role: "Dog Owner",
    avatar: "👩"
  },
  {
    text: "Finally, an app that gets it! I was skeptical at first, but the recommendations from Pawfect Match were spot-on. Highly recommend!",
    name: "David L.",
    role: "Cat Owner",
    avatar: "👨"
  },
  {
    text: "I used to spend hours browsing for the right pet products. Now, with all the work for me. The recommendations are incredibly quality and accurate!",
    name: "Jessica T.",
    role: "Multi-Pet Owner",
    avatar: "👩‍🦰"
  },
  {
    text: "The personalized food recommendations changed my dog's life completely. Better, free app is a game-changer for responsible pet ownership!",
    name: "Michael R.",
    role: "Dog Trainer",
    avatar: "👨‍🦱"
  }
];

export const navigationData = [
  { label: 'Home', href: '#' },
  { label: 'Profile', href: '#' },
  { label: 'Shop', href: '#' },
  { label: 'Order', href: '#' },
  { label: 'AI Assistant', href: '#' },
  { label: 'Premium', href: '#' },
  { label: 'Chat', href: '#' }
];

export const footerData = {
  copyright: "© 2025 Pawfect Match",
  links: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Contact', href: '#' }
  ],
  attribution: "Made with ❤️ Visily"
};
