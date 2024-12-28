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
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus('No token found. Please sign in.');
        return;
      }
      const { data } = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoyaltyPoints(data.loyaltyPoints);
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Could not fetch user info.');
    }
  };

  const handleRequestMark = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return setStatus('No token found. Please sign in.');
      }

      const { data } = await axios.post(
        '/api/loyalty/requestMark',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(data.message);
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Error requesting mark');
    }
  };

  const handleRefresh = async () => {
    setStatus('Refreshing...');
    await fetchUserInfo();
    setStatus('Loyalty points refreshed!');
  };

  return (
    <ClientLayout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Loyalty Program</h1>
        <p className="text-gray-700 mb-6">Every 6th coffee is free!</p>

        <div className="mb-4">
          <strong className="block text-lg mb-1">
            Current Loyalty Marks: {loyaltyPoints}
          </strong>
          <p className="text-sm text-gray-600">
            You need <strong>{6 - loyaltyPoints}</strong> more mark
            {6 - loyaltyPoints === 1 ? '' : 's'} to get a free coffee!
          </p>
        </div>

        <button
          onClick={handleRequestMark}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-3"
        >
          Request Coffee Mark
        </button>
        <button
          onClick={handleRefresh}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Refresh My Points
        </button>

        <p className="mt-4 text-red-500">{status}</p>
      </div>
    </ClientLayout>
  );
};

export default LoyaltyPage;
