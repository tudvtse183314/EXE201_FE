import React from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function UploadSection({ onImageUpload, onImageRemove, uploadedImage, isAnalyzing }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Pet Photo</h3>
      
      {!uploadedImage ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={isAnalyzing}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </label>
        </div>
      ) : (
        <div className="relative">
          <LazyLoadImage
            src={uploadedImage}
            alt="Uploaded pet"
            className="w-full h-64 object-cover rounded-lg"
            effect="blur"
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
          />
          <button
            onClick={onImageRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            disabled={isAnalyzing}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
