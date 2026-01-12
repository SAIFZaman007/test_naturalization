import React from 'react';

export const Button = ({
  children,
  type = 'submit',
  onClick,
  variant = 'primary',
}) => {
  const baseStyle =
    "w-full px-6 py-3 rounded-[65px] flex justify-center items-center gap-2 text-base font-semibold font-['Lato'] transition-opacity duration-200";

  const variants = {
    primary: 'bg-violet-600 text-white hover:bg-violet-700',
    google: 'bg-white text-gray-800 shadow-lg hover:bg-gray-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};
