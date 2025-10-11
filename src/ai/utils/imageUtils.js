/**
 * Image Utilities
 * Helper functions for image processing and validation
 */

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateImageFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Please select a valid image file (JPG, PNG, WebP)' 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'File size must be less than 10MB' 
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Convert file to base64 data URL
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 data URL
 */
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Resize image to optimal size for AI analysis
 * @param {string} dataURL - Base64 image data
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<string>} Resized image data URL
 */
export const resizeImage = (dataURL, maxWidth = 1024, maxHeight = 1024, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const resizedDataURL = canvas.toDataURL('image/jpeg', quality);
      resolve(resizedDataURL);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataURL;
  });
};

/**
 * Get image dimensions
 * @param {string} dataURL - Base64 image data
 * @returns {Promise<Object>} Image dimensions {width, height}
 */
export const getImageDimensions = (dataURL) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataURL;
  });
};

/**
 * Check if image is suitable for AI analysis
 * @param {string} dataURL - Base64 image data
 * @returns {Promise<Object>} Suitability check result
 */
export const checkImageSuitability = async (dataURL) => {
  try {
    const dimensions = await getImageDimensions(dataURL);
    
    const issues = [];
    const suggestions = [];
    
    // Check minimum dimensions
    if (dimensions.width < 300 || dimensions.height < 300) {
      issues.push('Image too small');
      suggestions.push('Use an image with at least 300x300 pixels');
    }
    
    // Check aspect ratio (very wide or tall images might not be ideal)
    if (dimensions.aspectRatio > 3 || dimensions.aspectRatio < 0.33) {
      issues.push('Unusual aspect ratio');
      suggestions.push('Square or moderately rectangular images work best');
    }
    
    // Check if image is too large (might indicate poor quality)
    if (dimensions.width > 4000 || dimensions.height > 4000) {
      suggestions.push('Consider using a smaller image for faster processing');
    }
    
    return {
      suitable: issues.length === 0,
      issues,
      suggestions,
      dimensions
    };
  } catch (error) {
    return {
      suitable: false,
      issues: ['Failed to analyze image'],
      suggestions: ['Please try a different image'],
      dimensions: null
    };
  }
};

/**
 * Create image thumbnail
 * @param {string} dataURL - Base64 image data
 * @param {number} size - Thumbnail size (square)
 * @returns {Promise<string>} Thumbnail data URL
 */
export const createThumbnail = (dataURL, size = 150) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = size;
      canvas.height = size;
      
      // Calculate crop area to maintain aspect ratio
      const aspectRatio = img.width / img.height;
      let sourceWidth, sourceHeight, sourceX, sourceY;
      
      if (aspectRatio > 1) {
        // Landscape
        sourceHeight = img.height;
        sourceWidth = sourceHeight;
        sourceX = (img.width - sourceWidth) / 2;
        sourceY = 0;
      } else {
        // Portrait or square
        sourceWidth = img.width;
        sourceHeight = sourceWidth;
        sourceX = 0;
        sourceY = (img.height - sourceHeight) / 2;
      }
      
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, size, size
      );
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.onerror = () => reject(new Error('Failed to create thumbnail'));
    img.src = dataURL;
  });
};

export default {
  validateImageFile,
  fileToDataURL,
  resizeImage,
  getImageDimensions,
  checkImageSuitability,
  createThumbnail
};

