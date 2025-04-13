import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [speed, setSpeed] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleWindowMessage = (event) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'HIDE_CONTENT':
          setIsVisible(false);
          break;
        case 'SHOW_CONTENT':
          setIsVisible(true);
          break;
        case 'UPDATE_SPEED':
          setSpeed(payload.speed);
          break;
        case 'UPDATE_FUEL':
          setFuel(payload.fuel);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleWindowMessage);

    return () => {
      window.removeEventListener('message', handleWindowMessage);
    };
  }, []);

  const formatSpeed = (speed) => {
    const speedString = speed.toString().padStart(3, '0');
    const allZeros = speedString === '000';
    const greyFirst = speedString[0] === '0' && !allZeros && speed !== 0;
    const greySecond = speedString[0] === '0' && speedString[1] === '0' && !allZeros && speed !== 0;

    return (
      <>
        <span className={(greyFirst || speed === 0) ? 'greyed-out' : ''}>{speedString[0]}</span>
        <span className={(greySecond || speed === 0) ? 'greyed-out' : ''}>{speedString[1]}</span>
        <span className={speed === 0 ? 'greyed-out' : ''}>{speedString[2]}</span>
      </>
    );
  };

  if (!isVisible) return null;

  return (
    <>
      <div className='speedo_container'>
        <div className='speedo'>
          <div className='speed' id='speedDisplay'>{formatSpeed(speed)}</div>
          <span className='mph'>MPH</span>
          <div className='fuel'>{fuel} fuel</div>
        </div>
      </div>
    </>
  );
}

export default App;
