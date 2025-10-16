import type { Route } from "./+types/login";
import { useAuth } from "../hooks/useAuth";
import { Form, Navigate } from "react-router";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - KandyPack Logistics" },
  ];
}

export default function LoginRoute() {
  const { isAuthenticated, login, loading } = useAuth();
  const [error, setError] = useState("");

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const success = await login(email, password);
    if (!success) {
      setError("Invalid credentials");
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login clicked");
  };

  const handleGithubLogin = () => {
    // TODO: Implement GitHub OAuth
    console.log("GitHub login clicked");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/loginbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-white text-xl font-semibold mb-2">KandyPack</h1>
            <h2 className="text-white text-3xl font-bold">Admin Login</h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-sm text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input 
                type="email" 
                name="email" 
                placeholder="username@gmail.com"
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-500"
                defaultValue="admin@kandypack.com" 
                required 
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                placeholder="password"
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-500"
                defaultValue="password" 
                required 
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <a 
                href="#" 
                className="text-white text-sm hover:text-pink-300 transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white">or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-sm hover:bg-white border border-white/30 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={handleGithubLogin}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-sm hover:bg-white border border-white/30 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="#181717" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
            </div>
          </form>

          {/* Customer Login Link */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              Not an admin?{' '}
              <a href="/login" className="text-white font-medium hover:underline">
                Customer Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}