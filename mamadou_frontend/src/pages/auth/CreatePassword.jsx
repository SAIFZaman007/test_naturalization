import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import authService from '../../api/authService';
import { useAuth } from '../../hooks/useAuth';

const CreatePassword = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Get signup data from localStorage
      const signupData = JSON.parse(localStorage.getItem('signupData') || '{}');

      if (!signupData.email || !signupData.password) {
        toast.error('Registration data missing. Please start from beginning.');
        navigate('/signup');
        return;
      }

      // Call register API with username
      const response = await authService.register(
        data.username,
        data.username, // Using username for both fname and lname
        signupData.email,
        signupData.password
      );

      if (response.success && response.data) {
        toast.success('Registration successful!');
        // Clean up localStorage
        localStorage.removeItem('signupData');
        // Save user name
        localStorage.setItem('userName', data.username);
        // Auto login
        login(response.data);
        navigate('/');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
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
        className='w-full max-w-[600px] p-6 sm:p-10 md:p-16 lg:p-20 rounded-[20px] backdrop-blur-[200px] inline-flex justify-start items-center gap-2.5'
        style={{ backgroundColor: '#1B0C33' }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex-1 inline-flex flex-col justify-start items-center gap-12'
        >
          <div className='self-stretch flex flex-col justify-start items-end gap-7'>
            <div className='self-stretch flex flex-col justify-start items-start gap-11'>
              <div className='self-stretch flex flex-col justify-start items-center gap-3'>
                <div className="self-stretch text-center justify-start text-white text-4xl font-semibold font-['Lato'] leading-[60px]">
                  Choose Username
                </div>
                <div className="self-stretch text-center justify-start text-white text-xl font-normal font-['Open_Sans'] leading-loose">
                  Pick a username that represents you
                </div>
              </div>
              <div className='self-stretch flex flex-col justify-start items-start gap-7'>
                {/* Username Input */}
                <div className='self-stretch flex flex-col justify-start items-start gap-4'>
                  <div className="self-stretch justify-start text-white text-2xl font-semibold font-['Lato'] leading-9">
                    Username
                  </div>
                  <input
                    id='username'
                    type='text'
                    placeholder='Enter your username'
                    {...register('username', {
                      required: 'Username is required',
                      minLength: {
                        value: 3,
                        message: 'Username must be at least 3 characters',
                      },
                      maxLength: {
                        value: 20,
                        message: 'Username must be less than 20 characters',
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message:
                          'Username can only contain letters, numbers, and underscores',
                      },
                    })}
                    className="self-stretch px-6 py-3 bg-white/10 rounded-xl text-white text-base font-normal font-['Open_Sans'] leading-normal placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-600"
                  />
                  {errors.username && (
                    <p className='text-red-400 text-sm'>
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            type='submit'
            disabled={loading}
            className='self-stretch px-6 py-3 rounded-[65px] inline-flex justify-center items-center gap-2 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
            style={{ backgroundColor: '#8B5CF6' }}
            onMouseEnter={(e) =>
              !loading && (e.currentTarget.style.backgroundColor = '#7C3AED')
            }
            onMouseLeave={(e) =>
              !loading && (e.currentTarget.style.backgroundColor = '#8B5CF6')
            }
          >
            <div className="text-center justify-start text-white text-base font-semibold font-['Lato'] leading-normal">
              {loading ? 'Creating Account...' : 'Complete Sign up'}
            </div>
          </button>
          <div className='self-stretch inline-flex justify-center items-center gap-2'>
            <div className="text-center justify-start text-white text-base font-normal font-['Open_Sans'] leading-normal">
              Have an account already?
            </div>
            <Link
              to='/login'
              className="text-center justify-start text-violet-600 text-base font-normal font-['Open_Sans'] underline leading-normal hover:text-violet-500"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
