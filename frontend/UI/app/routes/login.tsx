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
  const { isAuthenticated, login } = useAuth();
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">KandyPack Login</h1>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input 
            type="email" 
            name="email" 
            className="w-full p-2 border border-gray-300 rounded mt-1" 
            defaultValue="admin@kandypack.com" 
            required 
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input 
            type="password" 
            name="password" 
            className="w-full p-2 border border-gray-300 rounded mt-1" 
            defaultValue="password" 
            required 
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}