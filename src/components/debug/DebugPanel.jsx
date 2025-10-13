import React, { useState } from 'react';
import LogoTest from './LogoTest';

/**
 * Debug Panel - Only shows in development mode
 * Toggle debug components on/off
 */
export default function DebugPanel() {
  const [showDebug, setShowDebug] = useState(false);
  const [showLogoTest, setShowLogoTest] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors text-sm"
        >
          {showDebug ? '🔧 Hide Debug' : '🔧 Show Debug'}
        </button>
      </div>

      {/* Debug Control Panel */}
      {showDebug && (
        <div className="fixed top-16 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 max-w-xs">
          <h3 className="font-bold text-gray-800 mb-3">Debug Controls</h3>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showLogoTest}
                onChange={(e) => setShowLogoTest(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Logo Test</span>
            </label>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              onClick={() => {
                setShowLogoTest(false);
              }}
              className="w-full bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            >
              Hide All Debug
            </button>
          </div>
        </div>
      )}

      {/* Debug Components */}
      {showLogoTest && <LogoTest />}
    </>
  );
}