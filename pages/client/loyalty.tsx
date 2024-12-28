// pages/client/loyalty.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientLayout from '@/components/ClientLayout';

const LoyaltyPage: React.FC = () => {
  const [status, setStatus] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setStatus('');
      const token = localStorage.getItem('token');
      if (!token) {
        return setStatus('No token found. Please sign in.');
      }
      const { data } = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoyaltyPoints(data.loyaltyPoints);
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Could not fetch user info.');
    }
  };

  const handleRequest = async (isFreeCoffee: boolean) => {
    try {
      setStatus('');
      const token = localStorage.getItem('token');
      if (!token) {
        return setStatus('No token found. Please sign in.');
      }

      const { data } = await axios.post(
        '/api/loyalty/requestMark',
        { isFreeCoffee }, // pass flag to server
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(data.message);
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Error requesting');
    }
  };

  const handleRefresh = async () => {
    setStatus('Refreshing...');
    await fetchUserInfo();
    setStatus('Loyalty points refreshed!');
  };

  const isEligibleForFreeCoffee = loyaltyPoints >= 5;

  return (
    <ClientLayout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
        <h1 className="text-2xl font-bold">Loyalty Program</h1>
        <p>Every 6th coffee is free!</p>
        <div>
          <strong>Loyalty Marks: {loyaltyPoints}</strong>
          <p>You need {5 - loyaltyPoints} mark(s) to a free coffee!</p>
        </div>

        {isEligibleForFreeCoffee ? (
          <button
            onClick={() => handleRequest(true)} // free coffee
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Get Free Coffee
          </button>
        ) : (
          <button
            onClick={() => handleRequest(false)} // normal mark
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Request Coffee Mark
          </button>
        )}

        <button
          onClick={handleRefresh}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Refresh My Points
        </button>

        {status && <p className="text-red-500">{status}</p>}
      </div>
    </ClientLayout>
  );
};

export default LoyaltyPage;
