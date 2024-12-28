// pages/client/invite.tsx
import React, { useState } from 'react';
import axios from 'axios';
import ClientLayout from '@/components/ClientLayout';

const InvitePage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleInvite = async () => {
    try {
      setStatus('');
      const token = localStorage.getItem('token');
      if (!token) {
        return setStatus('Unauthorized - please sign in first.');
      }
      const { data } = await axios.post(
        '/api/invite',
        { phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(data.message || 'Invite code generated!');
      if (data.code) {
        setInviteCode(data.code);
      }
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Error sending invite');
    }
  };

  return (
    <ClientLayout>
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-extrabold text-gray-800">Invite Someone</h1>
        <p className="text-gray-600">
          Generate an invite code to share with your friends so they can sign up!
        </p>

        <label className="block text-gray-700">Phone Number to Invite</label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="text"
          placeholder="e.g. 0501234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleInvite}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Send Invite
        </button>

        {status && (
          <div className="p-3 rounded bg-blue-50 text-blue-700 border border-blue-200">
            {status}
          </div>
        )}

        {inviteCode && (
          <div className="p-3 rounded bg-green-50 text-green-700 border border-green-200">
            Invite Code: <strong>{inviteCode}</strong>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default InvitePage;
