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
      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-800">My Wallet</h1>
        <p className="text-gray-600">Balance: 
          <span className="font-semibold text-xl text-gray-800 ml-2">
            {walletBalance} shekels
          </span>
        </p>

        <div className="bg-gray-50 rounded p-4">
          <label className="block mb-1 text-gray-700">
            Request to Spend:
          </label>
          <input
            type="number"
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            value={spendAmount}
            onChange={(e) => setSpendAmount(Number(e.target.value))}
            placeholder="Enter amount"
          />
          <button
            onClick={handleRequestSpend}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Request Spend
          </button>
        </div>

        <button
          onClick={fetchWalletBalance}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Refresh My Balance
        </button>

        {status && (
          <div className="p-3 rounded bg-red-50 text-red-700 border border-red-200">
            {status}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default WalletPage;
