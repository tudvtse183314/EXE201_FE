import React from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

export default function NewsletterSection({ 
  title = "Pawfect Match",
  subtitle = "Stay up-to-date with our latest products and offers",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  onSubscribe,
  className = ''
}) {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = () => {
    if (email && onSubscribe) {
      onSubscribe(email);
      setEmail('');
    }
  };

  return (
    <section className={`py-16 px-4 bg-gray-50 ${className}`}>
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{subtitle}</p>
        <div className="flex gap-2 max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button onClick={handleSubscribe}>
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
