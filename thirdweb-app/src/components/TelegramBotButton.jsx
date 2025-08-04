import React from 'react';
import Lottie from 'lottie-react';
import okrrxQNR5A from '../../../animation/okrrxQNR5A.json';

const TelegramBotButton = () => {
  return (
    <div className="fixed right-4 bottom-4 z-50 animate-bounce">
      <a 
        href="https://t.me/xcrunch_bot" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Join our Telegram Bot"
      >
        <Lottie 
          animationData={okrrxQNR5A} 
          loop={true} 
          autoplay={true} 
          className="h-48 w-48 rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
        />
      </a>
    </div>
  );
};

export default TelegramBotButton; 