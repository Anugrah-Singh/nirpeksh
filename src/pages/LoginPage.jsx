import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the path the user tried to access before being redirected to login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginUser(email, password);
      // On successful login, redirect to the intended page or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      setError('Login failed. Please check your credentials.'); // Basic error message
      console.error(err); // Keep console log for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f0ff] px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="bg-[#e5e5ff] p-8 rounded shadow-md w-full max-w-sm border border-[#c5c5f5] sm:p-10 md:p-12 lg:p-14">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#2b2b3f] sm:text-3xl md:text-4xl lg:text-5xl">Nirpeksh Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10">
            <label className="block text-[#4a4a5e] text-sm font-bold mb-2 sm:text-base md:text-lg lg:text-xl" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border border-[#c5c5f5] rounded w-full py-2 px-3 text-[#2b2b3f] leading-tight focus:outline-none focus:shadow-outline sm:py-3 sm:px-4 md:py-4 md:px-5 lg:py-5 lg:px-6"
              placeholder="your.email@example.com"
            />
          </div>
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <label className="block text-[#4a4a5e] text-sm font-bold mb-2 sm:text-base md:text-lg lg:text-xl" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border border-[#c5c5f5] rounded w-full py-2 px-3 text-[#2b2b3f] mb-3 leading-tight focus:outline-none focus:shadow-outline sm:py-3 sm:px-4 md:py-4 md:px-5 lg:py-5 lg:px-6"
              placeholder="******************"
            />
          </div>
          {error && <p className="text-[#842029] text-xs italic mb-4 sm:text-sm md:text-base lg:text-lg">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-[#4a4ad7] to-[#6b6bea] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:py-3 sm:px-5 md:py-4 md:px-6 lg:py-5 lg:px-7 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;