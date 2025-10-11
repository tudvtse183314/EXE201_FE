import React, { useState, useEffect } from 'react';

const LoadingWithTimeout = ({ 
  message = 'Processing...', 
  timeout = 30000,
  onTimeout = null,
  showProgress = true 
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => {
        const newElapsed = prev + 1000;
        
        // Show timeout warning at 20 seconds
        if (newElapsed >= 20000 && !showTimeoutWarning) {
          setShowTimeoutWarning(true);
        }
        
        // Call timeout callback at full timeout
        if (newElapsed >= timeout && onTimeout) {
          onTimeout();
        }
        
        return newElapsed;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeout, onTimeout, showTimeoutWarning]);

  const progress = Math.min((elapsed / timeout) * 100, 100);
  const remainingSeconds = Math.max(0, Math.ceil((timeout - elapsed) / 1000));

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
      {/* Loading Spinner */}
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        {showProgress && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-indigo-600">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      {/* Message */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
      
      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full max-w-xs mb-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.round(elapsed / 1000)}s</span>
            <span>{remainingSeconds}s remaining</span>
          </div>
        </div>
      )}

      {/* Timeout Warning */}
      {showTimeoutWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                This is taking longer than usual. The server might be starting up.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="text-center text-sm text-gray-600 mt-4">
        <p>Please don't close this window while processing...</p>
        {elapsed > 10000 && (
          <p className="mt-2 text-xs">
            💡 Tip: Backend services may take longer to start on first request
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingWithTimeout;
