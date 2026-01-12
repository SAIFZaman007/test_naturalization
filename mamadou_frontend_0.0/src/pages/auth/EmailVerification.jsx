import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import authService from '../../api/authService';

const EmailVerification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      // Call send-otp API
      const response = await authService.sendOtp(formData.email);

      if (response.success) {
        // Save email to localStorage
        localStorage.setItem('signupEmail', formData.email);
        toast.success('Verification code sent to your email!');
        navigate('/verify-otp'); // Navigate to OTP verification page
      } else {
        toast.error(response.message || 'Failed to send code');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen w-full flex justify-center items-center p-3 sm:p-5'
      style={{ backgroundColor: '#0D061A' }}
    >
      <div
        className='w-full max-w-[600px] p-6 sm:p-10 md:p-16 lg:p-20 rounded-[20px] backdrop-blur-[200px] inline-flex justify-center items-center gap-2.5'
        style={{ backgroundColor: '#1B0C33' }}
      >
        <div className='flex-1 inline-flex flex-col justify-start items-center gap-12'>
          <div className='self-stretch flex flex-col justify-start items-end gap-7'>
            <div className='self-stretch flex flex-col justify-start items-start gap-11'>
              <div className='self-stretch flex flex-col justify-start items-center gap-3'>
                <div className="self-stretch text-center justify-start text-white text-4xl font-semibold font-['Lato'] leading-[60px]">
                  Gmail Verification
                </div>
                <div className="self-stretch text-center justify-start text-white text-xl font-normal font-['Open_Sans'] leading-loose">
                  Hi! Welcome back, you've been missed
                </div>
              </div>
              <div className='self-stretch flex flex-col justify-start items-start gap-7'>
                <div className='self-stretch flex flex-col justify-start items-start gap-4'>
                  <div className="self-stretch justify-start text-white text-2xl font-semibold font-['Lato'] leading-9">
                    Email
                  </div>
                  <div className='self-stretch px-6 py-3 bg-white/10 rounded-xl inline-flex justify-between items-center'>
                    <input
                      type='email'
                      placeholder='example@gmail.com'
                      {...register('email', { required: 'Email is required' })}
                      className="w-full bg-transparent text-white text-base font-normal font-['Open_Sans'] leading-normal focus:outline-none placeholder:text-white/50"
                    />
                  </div>
                  {errors.email && (
                    <p className='text-red-400 text-sm'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            type='submit'
            disabled={loading}
            className='self-stretch px-6 py-3 bg-violet-600 rounded-[65px] inline-flex justify-center items-center gap-2 hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <div className="text-center justify-start text-white text-base font-semibold font-['Lato'] leading-normal">
              {loading ? 'Sending...' : 'Send Code'}
            </div>
          </button>
          <div className='self-stretch inline-flex justify-center items-center gap-2'>
            <div className="text-center justify-start text-white text-base font-normal font-['Open_Sans'] leading-normal">
              Have an account already?
            </div>
            <button
              onClick={() => navigate('/login')}
              className="text-center justify-start text-violet-600 text-base font-normal font-['Open_Sans'] underline leading-normal hover:text-violet-500"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
