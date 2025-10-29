import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { signIn } from '../services/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const user = await signIn(email, password);
      console.log('Logged in:', user.uid);
      // For now, route to onboarding; later, check if already onboarded
      navigate('/onboarding');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-black to-slate-800 min-h-screen text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 rounded-2xl bg-slate-800/50 border border-orange-500/20 shadow-2xl">
        <Link to="/" className="flex items-center justify-center space-x-3 group mb-8">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Bot className="h-8 w-8 text-black" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              SmartStudy
            </span>
            <span className="text-xs text-orange-300">by BIUST Innovation Club</span>
          </div>
        </Link>

        <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
        <p className="text-center text-slate-400 mb-8">Log in to continue your academic journey.</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/70 border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-300"
              placeholder="you@university.ac.bw"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/70 border border-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-orange-600" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-orange-400 hover:text-orange-300">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full flex justify-center py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-400 hover:to-yellow-400">
              Log In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/get-started" className="font-medium text-orange-400 hover:text-orange-300">
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
