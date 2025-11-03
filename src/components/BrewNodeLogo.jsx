import React from 'react';

const BrewNodeLogo = ({ 
  width = 40, 
  height = 40, 
  color = '#4CAF50',
  showText = false,
  textColor = '#ffffff'
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: showText ? '12px' : '0'
    }}>
      <img
        src="/brewnode-logo.png"
        alt="BrewNode Logo"
        width={width}
        height={height}
        style={{ 
          borderRadius: '50%',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          objectFit: 'cover'
        }}
      />
      
      {showText && (
        <span style={{
          fontSize: `${height * 0.4}px`,
          fontWeight: 'bold',
          color: textColor,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          BrewNode
        </span>
      )}
    </div>
  );
};

export default BrewNodeLogo;