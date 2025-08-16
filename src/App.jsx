import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [speed, setSpeed] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [shakeOffset, setShakeOffset] = useState({ x: 0, y: 0 });

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const maxSpeed = 350;
  const progress = Math.min(speed / maxSpeed, 1) * circumference;
  const borderWidth = 12;
  const borderWidthGap = 5;

  // Handle window messages
  useEffect(() => {
    const handleWindowMessage = (event) => {
      const { type, payload } = event.data;
      switch (type) {
        case "ARMAUI3_HIDE_SPEEDO":
          setIsVisible(false);
          break;
        case "ARMAUI3_SHOW_SPEEDO":
          setIsVisible(true);
          break;
        case "ARMAUI3_UPDATE_SPEEDO":
          setSpeed(payload.speed);
          break;
        default:
          break;
      }
    };
    window.addEventListener("message", handleWindowMessage);
    return () => window.removeEventListener("message", handleWindowMessage);
  }, []);

  // // 🔹 Fake acceleration with deceleration after max speed
  // useEffect(() => {
  //   let currentSpeed = 0;
  //   let interval;

  //   const startDeceleration = () => {
  //     interval = setInterval(() => {
  //       const decrement = Math.floor(Math.random() * (5 - 2 + 1)) + 2; // 2–5 mph per tick
  //       currentSpeed -= decrement;
  //       if (currentSpeed <= 0) {
  //         currentSpeed = 0;
  //         clearInterval(interval);
  //       }
  //       setSpeed(currentSpeed);
  //     }, 50);
  //   };

  //   interval = setInterval(() => {
  //     const increment = Math.floor(Math.random() * (5 - 2 + 1)) + 2; // 2–5 mph per tick
  //     currentSpeed += increment;

  //     if (currentSpeed >= maxSpeed) {
  //       currentSpeed = maxSpeed;
  //       setSpeed(currentSpeed);
  //       clearInterval(interval);

  //       // Pause for 5 seconds at max speed, then decelerate
  //       setTimeout(startDeceleration, 5000);
  //     } else {
  //       setSpeed(currentSpeed);
  //     }
  //   }, 50);

  //   return () => clearInterval(interval);
  // }, []);

  // Dynamic shake effect based on speed
  useEffect(() => {
    let animationFrame;
    const animateShake = () => {
      if (speed > 150) {
        const intensity = (speed - 150) / (maxSpeed - 150); // 0 → 1
        const maxOffset = 5; // px max shake
        const offsetX = (Math.random() * 1 - 1) * maxOffset * intensity;
        const offsetY = (Math.random() * 1 - 1) * maxOffset * intensity;
        setShakeOffset({ x: offsetX, y: offsetY });
      } else {
        setShakeOffset({ x: 0, y: 0 });
      }
      animationFrame = requestAnimationFrame(animateShake);
    };
    animateShake();
    return () => cancelAnimationFrame(animationFrame);
  }, [speed]);

  const getColor = (speed) => {
    const ratio = Math.min(speed / maxSpeed, 1);
    if (ratio < 0.5) {
      const r = Math.floor(115 * (ratio * 2));
      const g = 155;
      return `rgb(${r},${g},0)`;
    } else {
      const r = 155;
      const g = Math.floor(115 * (1 - (ratio - 0.5) * 2));
      return `rgb(${r},${g},0)`;
    }
  };

  const formatSpeed = (speed) => {
    const speedString = speed.toString().padStart(3, "0");
    const allZeros = speedString === "000";
    const greyFirst = speedString[0] === "0" && !allZeros && speed !== 0;
    const greySecond =
      speedString[0] === "0" &&
      speedString[1] === "0" &&
      !allZeros &&
      speed !== 0;
    return (
      <>
        <span className={greyFirst || speed === 0 ? "greyed-out" : ""}>
          {speedString[0]}
        </span>
        <span className={greySecond || speed === 0 ? "greyed-out" : ""}>
          {speedString[1]}
        </span>
        <span className={speed === 0 ? "greyed-out" : ""}>
          {speedString[2]}
        </span>
      </>
    );
  };

  if (!isVisible) return null;

  return (
   <div
  className={`speedo_container ${isVisible ? "visible" : "hidden"}`}
  style={{
    transform: `translate(${shakeOffset.x}px, ${shakeOffset.y}px)`,
  }}
>
      <div
        className="speedo"
        style={{
          transform: `translate(${shakeOffset.x}px, ${shakeOffset.y}px)`,
        }}
      >
        <svg
          className="speedo-circle"
          width="200"
          height="200"
          viewBox="0 0 200 200"
        >
          <defs>
            <radialGradient id="speedo-bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(36,36,36,0.5)" />
              <stop offset="100%" stopColor="rgba(36,36,36,0.1)" />
            </radialGradient>
          </defs>

          {/* Background circle with gradient fill */}
          <circle
            cx="100"
            cy="100"
            r={radius + borderWidth / 2}
            fill="url(#speedo-bg-gradient)"
          />

          {/* Static outer circle */}
          <circle
            className="bg-circle"
            cx="100"
            cy="100"
            r={radius}
            strokeWidth={borderWidth}
            fill="none"
          />

          {/* Progress circle */}
          <circle
            className="progress-circle"
            cx="100"
            cy="100"
            r={radius}
            strokeWidth={borderWidth - borderWidthGap}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            stroke={getColor(speed)}
          />
        </svg>

        <div className="speed-display">
          <div className="speed" id="speedDisplay">
            {formatSpeed(speed)}
          </div>
          <span className="mph">MPH</span>
        </div>
      </div>
    </div>
  );
}

export default App;
