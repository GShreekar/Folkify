import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here - for now just redirect to dashboard
    console.log('Login attempt:', formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a0522d' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md border border-amber-200/50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold folkify-title mb-2">
            Folkify
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-red-600 mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
              Email / Username
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50"
              placeholder="Enter your email or username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-amber-700">
            New here?{' '}
            <Link 
              to="/register" 
              className="text-red-600 hover:text-red-700 font-semibold underline underline-offset-2 hover:underline-offset-4 transition-all duration-200"
            >
              Register as an Artist
            </Link>
          </p>
        </div>

        <div className="absolute -top-4 -left-4 w-8 h-8 bg-amber-400 rounded-full opacity-20"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-red-400 rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

export default Login;
