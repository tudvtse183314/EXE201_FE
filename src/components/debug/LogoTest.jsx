import React from 'react';
import Logo from '../common/Logo';
import SvgLogo from '../common/SvgLogo';
import TextLogo from '../common/TextLogo';
import SimpleLogo from '../common/SimpleLogo';

const LogoTest = () => {
  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
      <h3 className="text-lg font-semibold mb-4">🖼️ Logo Test</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Original Logo</h4>
          <Logo size="medium" variant="default" />
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">SVG Logo</h4>
          <SvgLogo size="medium" variant="default" />
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Text Logo</h4>
          <TextLogo size="medium" variant="default" />
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Simple Logo</h4>
          <SimpleLogo size="medium" variant="default" />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h5 className="text-xs font-medium mb-1">Small</h5>
            <SvgLogo size="small" variant="default" />
          </div>
          <div>
            <h5 className="text-xs font-medium mb-1">Large</h5>
            <SvgLogo size="large" variant="default" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div>
            <h5 className="text-xs font-medium mb-1">Default</h5>
            <SvgLogo size="small" variant="default" />
          </div>
          <div>
            <h5 className="text-xs font-medium mb-1">White</h5>
            <SvgLogo size="small" variant="white" />
          </div>
          <div>
            <h5 className="text-xs font-medium mb-1">Dark</h5>
            <SvgLogo size="small" variant="dark" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoTest;
