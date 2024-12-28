// pages/sign-up.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const SignUp: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'owner'>('client');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (router.query.role === 'owner') {
      setRole('owner');
    } else {
      setRole('client');
    }
  }, [router.query.role]);

  const handleSignUp = async () => {
    try {
      setError('');
      const response = await axios.post('/api/auth/signup', {
        name,
        phone,
        password,
        role,
        code, // <-- Send `code` here, not `invitedBy`.
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        alert(`Welcome! You are now signed up as a ${role}.`);

        if (role === 'owner') {
          router.push('/owner/dashboard');
        } else {
          router.push('/client/loyalty');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Sign-up failed.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-4">
          Sign Up as {role === 'owner' ? 'Cafe Owner' : 'Cafe Client'}
        </h1>

        <label>Name</label>
      <input
        className="w-full mb-4 p-2 border border-gray-300 rounded"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Mark"
      />

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
          placeholder="Your strong password"
        />

        {/* We rename this field to “Referral Code” */}
        <label className="block mb-2 text-gray-700">
          (Optional) Referral Code
        </label>
        <input
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter referral code here"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleSignUp}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </main>
  );
};

export default SignUp;
