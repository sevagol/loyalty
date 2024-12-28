// pages/sign-in.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const SignIn: React.FC = () => {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      setError('');
      const response = await axios.post('/api/auth/signin', { phone, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const { role } = response.data;
        alert(`Signed in successfully as ${role}`);
        if (role === 'owner') {
          router.push('/owner/dashboard');
        } else {
          router.push('/client/loyalty');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Sign-in failed.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>

        <label className="block mb-2 text-gray-700">Phone Number</label>
        <input
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 0501234567"
        />

        <label className="block mb-2 text-gray-700">Password</label>
        <input
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleSignIn}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Sign In
        </button>
      </div>
    </main>
  );
};

export default SignIn;
