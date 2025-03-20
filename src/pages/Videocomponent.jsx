import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/logo.json';

const AnimationComponent = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div style={{ width: 200, height: 200 }}>
      <Lottie options={defaultOptions} />
    </div>
  );
};

export default AnimationComponent;
