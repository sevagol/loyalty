// pages/client/wallet.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClientLayout from '@/components/ClientLayout';

const WalletPage: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [status, setStatus] = useState('');
  const [spendAmount, setSpendAmount] = useState<number>(0);

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      setStatus('');
      const token = localStorage.getItem('token');
      if (!token) {
        return setStatus('No token found. Please sign in.');
      }
      const { data } = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWalletBalance(data.walletBalance);
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Error fetching wallet balance');
    }
  };

  // Request to spend money from wallet
  const handleRequestSpend = async () => {
    try {
      setStatus('');
      const token = localStorage.getItem('token');
      if (!token) {
        return setStatus('No token found. Please sign in.');
      }

      const amountNum = Number(spendAmount);
      if (!amountNum || amountNum <= 0) {
        return setStatus('Enter a valid spending amount.');
      }

      const { data } = await axios.post(
        '/api/wallet/requestSpend',
        { amount: amountNum },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(`Spending request submitted. Request ID: ${data.requestId}`);
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Error requesting spend');
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">My Wallet</h1>
        <p className="text-lg mb-2">Balance: {walletBalance} shekels</p>

        {/* Spend Form */}
        <div className="mt-4">
          <label className="block mb-1 text-gray-700">
            Spend Amount
          </label>
          <input
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            type="number"
            value={spendAmount}
            onChange={(e) => setSpendAmount(Number(e.target.value))}
            placeholder="Enter amount to spend"
          />
          <button
            onClick={handleRequestSpend}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Request Spend
          </button>
        </div>

        {/* Status */}
        {status && <p className="text-red-500 mt-4">{status}</p>}
      </div>
    </ClientLayout>
  );
};

export default WalletPage;
