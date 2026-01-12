import React from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

export const Input = ({
  id,
  label,
  type = 'text',
  register,
  error,
  isPassword = false,
  showPassword,
  setShowPassword,
}) => {
  return (
    <div className='w-full flex flex-col items-start gap-4'>
      <label
        htmlFor={id}
        className="text-white text-2xl font-semibold font-['Lato']"
      >
        {label}
      </label>
      <div className='relative w-full'>
        <input
          id={id}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          {...register(id, { required: `${label} is required` })}
          className="w-full px-6 py-3 bg-white/10 rounded-xl text-white text-base font-['Open_Sans'] placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {isPassword && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 pr-4 flex items-center text-white/70 hover:text-white'
          >
            {showPassword ? (
              <IoEyeOutline size={22} />
            ) : (
              <IoEyeOffOutline size={22} />
            )}
          </button>
        )}
      </div>
      {error && <p className='text-red-400 text-sm mt-1'>{error.message}</p>}
    </div>
  );
};
