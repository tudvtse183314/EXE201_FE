import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, CheckCircle, ArrowRight, Mail } from 'lucide-react';

export default function AIAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

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

  const handleStartAnalysis = () => {
    if (selectedFile) {
      alert('AI Analysis started! (This is a demo)');
      // Here you would typically send the file to your AI analysis API
    }
  };

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
              onClick={() => document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' })}
            >
              Start Analysis Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="main-content" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Side - Upload Photo */}
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Your Pet's Photo</h2>
              
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-300 ${
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
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Photo Selected!</p>
                      <p className="text-sm text-gray-600">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Drag & drop or click to browse</p>
                      <p className="text-sm text-gray-600">JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Start Analysis Button */}
              <button
                onClick={handleStartAnalysis}
                disabled={!selectedFile}
                className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  selectedFile
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedFile ? 'Start Analysis' : 'Select a photo to start'}
              </button>
            </motion.div>

            {/* Right Side - Info Cards */}
            <div className="space-y-6">
              
              {/* How It Works Card */}
              <motion.div 
                className="bg-white p-6 rounded-2xl shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: <Upload className="w-6 h-6" />,
                      title: "Upload Photo",
                      description: "Upload a clear photo of your pet"
                    },
                    {
                      icon: <ArrowRight className="w-6 h-6" />,
                      title: "AI Analysis",
                      description: "Our AI analyzes your pet's characteristics"
                    },
                    {
                      icon: <CheckCircle className="w-6 h-6" />,
                      title: "Get Results",
                      description: "Receive personalized product recommendations"
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{step.title}</h4>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Benefits Card */}
              <motion.div 
                className="bg-white p-6 rounded-2xl shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Benefits of AI Analysis</h3>
                <ul className="space-y-3">
                  {[
                    "Precision Matching - Get products that perfectly fit your pet's needs",
                    "Save Time & Money - No more trial and error with wrong purchases",
                    "Happier Pets - Products that your pet will actually love and use"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
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
                <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Subscribe</span>
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
