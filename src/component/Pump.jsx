import React, { useState } from 'react';
import pumpBase from '../assets/Symbol_320003.png';
import pumpHandle from '../assets/Symbol_320001.png';
import pumpWire from '../assets/Symbol_320002.png';

const Pump = ({ onPump, style }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    onPump();
    setTimeout(() => setIsPressed(false), 200); 
  };

  return (
    <div style={{ ...style }}>
      {/* Pump Wire */}
      <img
        src={pumpWire}
        alt="Pump wire"
        style={{
          position: 'absolute',
          top: -180,
          left: -165,
          width: '170px',
          zIndex: 1,
        }}
      />
      
      {/* Pump Base */}
      <img
        src={pumpBase}
        alt="Pump Base"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: -70,
          width: '170px',
          zIndex: 3,
          transition: 'transform 0.2s', 
          transform: isPressed ? 'scaleX(1.06)' : 'scaleX(1)', 
        }}
      />
      
      {/* Pump Handle */}
      <img
        src={pumpHandle}
        alt="Pump Handle"
        style={{
          position: 'absolute',
          bottom: isPressed ? '450px' : '500px', 
          left: '-45px',
          top: isPressed ? '-210px' : '-230px', 
          width: '120px',
          zIndex: 2,
          transition: 'bottom 0.2s, top 0.2s, transform 0.2s',
          transform: isPressed ? 'scaleX(1.2)' : 'scaleX(1)', 
          cursor: 'pointer',
        }}
        onClick={handlePress}
      />
    </div>
  );
};

export default Pump;
