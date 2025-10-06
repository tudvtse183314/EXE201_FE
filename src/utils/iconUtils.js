import { 
  Heart, 
  Shield, 
  Users, 
  Dog, 
  Star, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Award
} from 'lucide-react';

// Icon mapping utility
export const iconMap = {
  Heart,
  Shield,
  Users,
  Dog,
  Star,
  Phone,
  Mail, // Changed from Email to Mail
  MapPin,
  Clock,
  Award
};

// Helper function to get icon component
export const getIcon = (iconName, className = "w-8 h-8") => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in iconMap`);
    return null;
  }
  return <IconComponent className={className} />;
};
