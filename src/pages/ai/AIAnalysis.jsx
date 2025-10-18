import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AIAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Auth Guard - Kiểm tra đăng nhập và role
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (user && user.role !== 'CUSTOMER') {
      navigate('/unauthorized', { replace: true });
      return;
    }
  }, [user, isAuthenticated, navigate]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Please upload only JPG or PNG files');
      return;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleStartAnalysis = async () => {
    if (selectedFile) {
      setIsAnalyzing(true);
      
      // Simulate AI analysis delay
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate('/ai/seasonal-outfits');
      }, 2000);
    }
  };

  // Loading Overlay
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing your pet's photo...</h3>
          <p className="text-gray-600">Please wait while our AI analyzes your pet's characteristics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-600 to-purple-800 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://cdn.pixabay.com/photo/2018/03/30/07/53/dog-3277415_1280.jpg')"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Unlock Your Pet's Perfect Style
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover the perfect accessories and products for your beloved companion with our AI-powered analysis
            </motion.p>
            <motion.button
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onClick={() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Start Analysis Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload-section" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Upload Your Pet's Photo</h2>
            
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors duration-300 cursor-pointer ${
                dragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-purple-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileInput}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                  <div>
                    <p className="text-2xl font-semibold text-gray-800">Photo Selected!</p>
                    <p className="text-lg text-gray-600">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Camera className="w-20 h-20 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-2xl font-semibold text-gray-800">Drag & drop or click to browse</p>
                    <p className="text-lg text-gray-600">JPG, PNG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Start Analysis Button */}
            <div className="text-center mt-8">
              <button
                onClick={handleStartAnalysis}
                disabled={!selectedFile}
                className={`px-12 py-4 rounded-full font-semibold text-xl transition-all duration-300 ${
                  selectedFile
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedFile ? 'Start Analysis' : 'Select a photo to start'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Logo */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-purple-400">Pawfect Match</h3>
              <p className="text-gray-400 mt-2">Your pet's perfect companion</p>
            </div>
            
            {/* Newsletter */}
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">© 2023 Pawfect Match.</p>
              <p className="text-gray-500 text-xs mt-1">All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
