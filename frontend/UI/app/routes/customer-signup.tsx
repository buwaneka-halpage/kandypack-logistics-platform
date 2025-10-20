import type { Route } from "./+types/customer-signup";
import { useAuth } from "../hooks/useAuth";
import { Form, Navigate } from "react-router";
import { useState } from "react";
import { UserRole } from "../types/roles";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign Up - KandyPack Logistics" },
  ];
}

export default function CustomerSignupRoute() {
  const { isAuthenticated, signup, loading, user } = useAuth();
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D5FEF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If already logged in as customer, redirect to customer home
  if (isAuthenticated && user?.role === UserRole.CUSTOMER) {
    return <Navigate to="/customer/home" replace />;
  }

  // If logged in as staff (not customer), show access denied message
  if (isAuthenticated && user?.role !== UserRole.CUSTOMER) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-sm text-gray-500 mb-6">
            You are currently logged in as staff. Please log out first to create a customer account.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
            <a
              href="/admin/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-md hover:from-orange-600 hover:to-pink-700 transition-colors"
            >
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {};
    
    const username = formData.get("username") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Username validation
    if (!username || username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Full name validation
    if (!fullName || fullName.trim().length < 2) {
      errors.fullName = "Full name is required";
    }

    // Phone validation (Sri Lankan format)
    const phoneRegex = /^\+94[0-9]{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      errors.phone = "Phone must be in format +94XXXXXXXXX";
    }

    // Address validation
    if (!address || address.trim().length < 10) {
      errors.address = "Please provide a complete address (min 10 characters)";
    }

    // Password validation
    if (!password || password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); // Clear previous errors
    setValidationErrors({});
    
    const formData = new FormData(event.currentTarget);

    // Validate form
    if (!validateForm(formData)) {
      return;
    }

    const username = formData.get("username") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const password = formData.get("password") as string;

    const result = await signup({
      customer_user_name: username,
      customer_name: fullName,
      phone_number: phone,
      address: address,
      password: password,
    });

    if (!result.success) {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/loginbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Glassmorphic Signup Card */}
      <div className="w-full max-w-md">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#282F4E] mb-2">
              Kandy<span className="text-[#5D5FEF]">Pack</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Create your customer account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <Form method="post" onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className={`w-full px-4 py-3 border ${validationErrors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#5D5FEF] focus:border-[#5D5FEF] transition-colors bg-white/50 backdrop-blur-sm`}
                placeholder="Choose a username"
              />
              {validationErrors.username && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.username}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                className={`w-full px-4 py-3 border ${validationErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#5D5FEF] focus:border-[#5D5FEF] transition-colors bg-white/50 backdrop-blur-sm`}
                placeholder="Your full name"
              />
              {validationErrors.fullName && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.fullName}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className={`w-full px-4 py-3 border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#5D5FEF] focus:border-[#5D5FEF] transition-colors bg-white/50 backdrop-blur-sm`}
                placeholder="+94712345678"
              />
              {validationErrors.phone && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.phone}</p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                required
                rows={2}
                className={`w-full px-4 py-3 border ${validationErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#5D5FEF] focus:border-[#5D5FEF] transition-colors bg-white/50 backdrop-blur-sm resize-none`}
                placeholder="Your full address"
              />
              {validationErrors.address && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.address}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className={`w-full px-4 py-3 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#5D5FEF] focus:border-[#5D5FEF] transition-colors bg-white/50 backdrop-blur-sm`}
                placeholder="At least 6 characters"
              />
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                className={`w-full px-4 py-3 border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#5D5FEF] focus:border-[#5D5FEF] transition-colors bg-white/50 backdrop-blur-sm`}
                placeholder="Confirm your password"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 mt-1 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-[#5D5FEF] hover:text-[#4a4bc7] font-medium">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#5D5FEF] hover:text-[#4a4bc7] font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-[#5D5FEF] text-white py-3 px-4 rounded-lg hover:bg-[#4a4bc7] focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:ring-offset-2 transition-colors font-medium shadow-lg"
            >
              Create Account
            </button>
          </Form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <a href="/login" className="text-[#5D5FEF] hover:text-[#4a4bc7] font-medium">
                Sign in
              </a>
            </p>
          </div>

          {/* Admin Login Link */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Are you an admin?{' '}
              <a href="/admin" className="text-[#5D5FEF] hover:text-[#4a4bc7] font-medium">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
