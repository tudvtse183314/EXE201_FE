// src/utils/imageUtils.js
import React from 'react';

// Import ảnh từ thư mục products (chỉ các ảnh còn lại)
import img1 from '../assets/images/products/pexels-enginakyurt-1437465.jpg';
import img2 from '../assets/images/products/pexels-thatguycraig000-1546911.jpg';
import img3 from '../assets/images/products/pexels-nastyasensei-66707-3318215.jpg';
import img4 from '../assets/images/products/pexels-barna-morvai-504241176-19691809.jpg';
import img5 from '../assets/images/products/pexels-d123x-2813361.jpg';
import img6 from '../assets/images/products/pexels-omar-ramadan-1739260-9840724.jpg';
import img7 from '../assets/images/products/pexels-pixabay-160755.jpg';
import img8 from '../assets/images/products/pexels-pixabay-39388.jpg';
import img9 from '../assets/images/products/pexels-joshsorenson-1739093.jpg';

// Danh sách ảnh fallback từ thư mục products
export const productFallbackImages = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9
];

// Lấy ảnh fallback ngẫu nhiên
export const getRandomFallbackImage = () => {
  const randomIndex = Math.floor(Math.random() * productFallbackImages.length);
  return productFallbackImages[randomIndex];
};

// Lấy ảnh fallback theo index (để consistent)
export const getFallbackImageByIndex = (index = 0) => {
  const safeIndex = index % productFallbackImages.length;
  return productFallbackImages[safeIndex];
};

// Component Image với fallback
export const ProductImage = ({ 
  src, 
  alt, 
  style, 
  className,
  fallbackIndex = 0,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(getFallbackImageByIndex(fallbackIndex));
    }
  };

  React.useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      style={style}
      className={className}
      onError={handleError}
    />
  );
};
