import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiDollarSign, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(formData.email, formData.password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full px-6 relative z-10"
      >
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-primary-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-primary-200 rotate-3 hover:rotate-0 transition-transform duration-500">
              <FiDollarSign className="text-white text-4xl" />
            </div>
          </motion.div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Welcome <span className="text-primary-600">Back</span>
          </h2>
          <p className="text-slate-500 font-medium">
            Manage your finances with precision.
          </p>
        </div>

        {/* Login Form */}
        <div className="card border-none shadow-2xl shadow-slate-200/60 p-10 bg-white/80 backdrop-blur-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="email" className="label text-xs uppercase tracking-widest text-slate-400">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-11 py-4"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="label text-xs uppercase tracking-widest text-slate-400">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-11 py-4"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-4 text-lg shadow-xl shadow-primary-100 flex items-center justify-center space-x-2 group"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              New to FinanceHub?{' '}
              <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Demo Access</p>
          </div>
          <div className="flex justify-between items-center px-1">
            <div>
              <p className="text-white text-xs font-bold">admin@test.com</p>
              <p className="text-slate-500 text-[10px]">Username</p>
            </div>
            <div className="text-right">
              <p className="text-white text-xs font-bold">admin123</p>
              <p className="text-slate-500 text-[10px]">Password</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;