import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import SignupImage from '/image/signup.png';
import Logo from '/image/logo.png';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Cookies from 'js-cookie';

const SignUp = () => {
  const navigate = useNavigate();

  // Set your API base URL here
  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  // State to capture form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Regular expression for password validation (Capital letter, number, and symbol)
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

  // Function to check if email exists
  const checkEmailExists = async email => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/email?email=${email}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.status === 200) {
        return true; // Email already exists
      }
      return false; // Email doesn't exist
    } catch (error) {
      setError('There was an issue checking your email. Please try again.');
      return true; // Assuming true to prevent proceeding with invalid state
    }
  };

  // Handle normal form submission
  const handleFormSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate password strength
    if (!passwordRegex.test(password)) {
      setError('Password must be more than 6 values.');
      setLoading(false);
      return;
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setError('Email already exists.');
      setLoading(false);
      return;
    }

    // Store email and password in secure cookies
    Cookies.set('email', email, { secure: true, sameSite: 'Strict' });
    Cookies.set('password', password, { secure: true, sameSite: 'Strict' });

    // Log the values
    console.log('Email from cookies:', email);
    console.log('Password from cookies:', password);

    // Navigate to next page to complete other details
    navigate('/verification');
  };

  // Handle Google sign-up
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'GET',
        credentials: 'include', // Include credentials if needed
      });

      if (response.ok) {
        navigate('/verification');
      } else {
        setError('Google sign-up failed.');
      }
    } catch (err) {
      setError('Google sign-up error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className="">
      <div className="mb-6 flex items-center shadow-md py-4 lg:px-8 px-4">
        <Link className="flex items-center" to="/">
          <img src={Logo} alt="Logo" className="h-8 w-8" />
          <span className="ml-2 lg:text-xl text-sm lg:font-bold text-gray-800">
            Timeless Planner
          </span>
        </Link>
      </div>

      <div className="lg:px-36 px-8 lg:py-2 py-8 mb-4">
        <h2 className="lg:text-4xl text-2xl font-semibold lg:mb-12 mb-8 text-center">
          Sign up to get started
        </h2>

        <div className="flex flex-row-reverse justify-between items-center space-x-12">
          <div className="w-full">
            <button
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 w-full mb-4 hover:text-lg"
              disabled={loading}
            >
              <FcGoogle className="mr-2 w-8 h-8" />
              Continue with Google
            </button>

            <div className="flex items-center justify-center mb-4">
              <span className="border-b w-1/4 lg:w-1/3"></span>
              <span className="text-gray-500 px-2">Sign up with</span>
              <span className="border-b w-1/4 lg:w-1/3"></span>
            </div>

            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <FloatingLabelInput
                label="Email"
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <div className="relative">
                <FloatingLabelInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'} // Dynamically change input type
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />

                {/* Icon for toggling password visibility */}
                <span
                  className="absolute right-3 top-4 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} className="text-slate-600" />
                  ) : (
                    <FaEye size={20} className="text-slate-600" />
                  )}
                </span>
              </div>
              <button
                type="submit"
                className="bg-primary text-black font-semibold py-2 px-4 w-full hover:bg-transparent hover:border hover:border-primary hover:text-primary transition duration-300"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </form>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            <p className="lg:text-left text-center text-gray-700 mt-4">
              Already signed up?{' '}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Go to login
              </Link>
            </p>
          </div>

          <div className="hidden lg:block w-full hover">
            <img
              src={SignupImage}
              alt="Sign up illustration"
              className="w-3/4 h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
