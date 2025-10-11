import React, { useState, useRef } from 'react';
import { Camera, Upload, X, AlertCircle } from 'lucide-react';

/**
 * UploadSection Component
 * Handles image upload with drag & drop functionality
 */
export default function UploadSection({ 
  onImageUpload, 
  onImageRemove, 
  uploadedImage, 
  isAnalyzing = false,
  className = '' 
}) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setError('');
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, etc.)');
      return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      onImageUpload(imageData, file);
    };
    reader.onerror = () => {
      setError('Failed to read the image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setError('');
    onImageRemove();
  };

  const handleClick = () => {
    if (!isAnalyzing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Upload Your Pet's Photo
      </h3>
      <p className="text-gray-600 mb-6">
        Drop your image here or click to select to get personalized recommendations.
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Upload Area */}
      {!uploadedImage ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200
            ${dragActive 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50'
            }
            ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Camera className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">
            {dragActive ? 'Drop your image here' : 'Drag & drop or click to browse'}
          </p>
          <p className="text-sm text-gray-500">
            Supports JPG, PNG, up to 10MB
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={isAnalyzing}
          />
        </div>
      ) : (
        <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
          {/* Remove Button */}
          <button
            onClick={handleRemoveImage}
            disabled={isAnalyzing}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Image Preview */}
          <img
            src={uploadedImage}
            alt="Uploaded pet"
            className="w-full h-96 object-cover"
          />
          
          {/* Analysis Status */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                <p className="text-gray-700 font-medium">Analyzing your pet...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">📸 Tips for best results:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use good lighting and clear focus</li>
          <li>• Include your pet's full body if possible</li>
          <li>• Avoid blurry or dark images</li>
          <li>• Make sure your pet is clearly visible</li>
        </ul>
      </div>
    </div>
  );
}

