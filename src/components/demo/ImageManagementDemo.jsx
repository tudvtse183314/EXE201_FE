import React from 'react';
import { backgrounds, banners, pets, products } from '../assets/images';
import { Image, Avatar, ProductImage, PetImage, BannerImage } from '../components/common/Image';
import { BackgroundImage, LoginBackground, HeroBackground } from '../components/common/BackgroundImage';

/**
 * Demo component showing how to use the image management system
 * This component demonstrates all the different ways to use images
 */
export default function ImageManagementDemo() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">🖼️ Image Management System Demo</h1>
      
      {/* Background Images Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Background Images</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 rounded-lg overflow-hidden">
            <BackgroundImage 
              imagePath={backgrounds.login}
              overlay="rgba(0,0,0,0.3)"
              className="h-full"
            >
              <div className="flex items-center justify-center text-white font-bold">
                Login Background
              </div>
            </BackgroundImage>
          </div>
          <div className="h-32 rounded-lg overflow-hidden">
            <BackgroundImage 
              imagePath={backgrounds.register}
              overlay="rgba(0,0,0,0.3)"
              className="h-full"
            >
              <div className="flex items-center justify-center text-white font-bold">
                Register Background
              </div>
            </BackgroundImage>
          </div>
        </div>
      </section>

      {/* Image Components Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Image Components</h2>
        
        {/* Basic Images */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Basic Images</h3>
          <div className="grid grid-cols-4 gap-4">
            <Image 
              src={pets.dog1} 
              alt="Dog 1" 
              className="h-24 rounded-lg"
            />
            <Image 
              src={pets.dog2} 
              alt="Dog 2" 
              className="h-24 rounded-lg"
            />
            <Image 
              src={pets.cat1} 
              alt="Cat 1" 
              className="h-24 rounded-lg"
            />
            <Image 
              src={pets.cat2} 
              alt="Cat 2" 
              className="h-24 rounded-lg"
            />
          </div>
        </div>

        {/* Specialized Components */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Specialized Components</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <Avatar 
                src={pets.dog1} 
                alt="User Avatar" 
                size="lg"
              />
              <p className="text-sm mt-2">Avatar</p>
            </div>
            <div className="text-center">
              <PetImage 
                src={pets.cat1} 
                alt="Pet Image"
              />
              <p className="text-sm mt-2">Pet Image</p>
            </div>
            <div className="text-center">
              <ProductImage 
                src={products.collar} 
                alt="Product"
              />
              <p className="text-sm mt-2">Product Image</p>
            </div>
            <div className="text-center">
              <BannerImage 
                src={banners.hero} 
                alt="Banner"
              />
              <p className="text-sm mt-2">Banner Image</p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Code Examples:</h3>
          <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`// Import images
import { backgrounds, pets, products } from '../assets/images';

// Use background image
<BackgroundImage imagePath={backgrounds.login}>
  <div>Content</div>
</BackgroundImage>

// Use basic image
<Image src={pets.dog1} alt="Dog" />

// Use specialized components
<Avatar src={user.avatar} size="lg" />
<ProductImage src={products.collar} />
<PetImage src={pets.dog1} />`}
          </pre>
        </div>
      </section>

      {/* Responsive Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Responsive Images</h2>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Different sizes for different screens:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Image 
              src={pets.dog1} 
              alt="Dog - Mobile" 
              className="h-32 md:h-40 lg:h-48 rounded-lg"
            />
            <Image 
              src={pets.cat1} 
              alt="Cat - Tablet" 
              className="h-32 md:h-40 lg:h-48 rounded-lg"
            />
            <Image 
              src={pets.dog2} 
              alt="Dog - Desktop" 
              className="h-32 md:h-40 lg:h-48 rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
