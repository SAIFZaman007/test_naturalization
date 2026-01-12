import React from 'react';
import { BsFillChatLeftDotsFill } from 'react-icons/bs';

const FeedbackButton = () => {
  const handleClick = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdDf_OZLj5y7JGTj1ItEmI_CLy2KqfQFGP92NaK6Rz-GbJ0ZQ/viewform', '_blank');
  };

  return (
    <div className='fixed right-0 bottom-2 z-50'>
      <div
        onClick={handleClick}
        className='w-12 h-44 relative bg-gradient-to-b from-[#a855f7] via-[#924a8f] to-[#5d3658] rounded-tl-3xl rounded-bl-3xl shadow-[0_10px_40px_rgba(168,85,247,0.6),-4px_0_20px_rgba(0,0,0,0.3),inset_0_2px_10px_rgba(255,255,255,0.2),inset_0_-2px_10px_rgba(0,0,0,0.3)] flex flex-col items-center justify-between py-6 cursor-pointer hover:shadow-[0_15px_50px_rgba(168,85,247,0.8),-4px_0_25px_rgba(0,0,0,0.4),inset_0_2px_12px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 transform hover:-translate-x-1'
        style={{
          transform: 'perspective(1000px) rotateY(-5deg)',
        }}
      >
        {/* 3D Border Effect */}
        <div className='absolute inset-0 rounded-tl-3xl rounded-bl-3xl border-l-2 border-t-2 border-b-2 border-purple-300/20' />

        {/* Feedback Text - Vertical (rotated 90 degrees counter-clockwise) */}
        <div className='flex-1 flex items-center justify-center relative z-10'>
          <span
            className="text-white text-base font-bold font-['Poppins'] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            Feedback 
          </span>
        </div>

        {/* Message Icon - Enhanced 3D icon container */}
        <div className='w-8 h-8 bg-gradient-to-br from-white/30 to-white/10 rounded-lg flex items-center justify-center relative z-10 shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_1px_3px_rgba(255,255,255,0.3)] backdrop-blur-sm border border-white/20'>
          <BsFillChatLeftDotsFill className='w-7 h-7 text-white -rotate-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' />
        </div>
      </div>
    </div>
  );
};

export default FeedbackButton;
