'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useAppContext } from './context/Appcontext';
import { Loader2 } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUserData } = useAppContext();

  const adminLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/user/login', {
        phone,
        pass: password,
      });

      localStorage.setItem('userData', JSON.stringify(res.data));
      setUserData(res.data);
      onClose();
      location.replace('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn transition-all duration-300">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-6">Please sign in to continue</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center mb-4">{error}</p>
        )}

        <div className="space-y-4">
          <input
            type="tel"
            pattern="[0-9]{10}"
            maxLength={10}
            inputMode="numeric"
            placeholder="Phone Number"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:underline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={adminLogin}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl flex items-center gap-2 transition disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin w-5 h-5" />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
