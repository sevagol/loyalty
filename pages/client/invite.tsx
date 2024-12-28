import React, { useState } from 'react';
import axios from 'axios';
import ClientLayout from '@/components/ClientLayout';

const InvitePage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [inviteCode, setInviteCode] = useState(''); // <-- We'll store the returned code here

  const handleInvite = async () => {
    try {
      // 1. Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        return setStatus('Unauthorized - please sign in first.');
      }

      // 2. Call POST /api/invite (passing the phone + Authorization header)
      const { data } = await axios.post(
        '/api/invite',
        { phone }, // or phone: phone
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 3. The endpoint returns { message, code }, so we set them in our state
      setStatus(data.message);
      if (data.code) {
        setInviteCode(data.code);
      }
    } catch (error: any) {
      // If the server returns { error: '...' } or other issue
      setStatus(error.response?.data?.error || 'Error sending invite');
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Invite Someone</h1>

        <label className="block mb-2 text-gray-700">Phone Number</label>
        <input
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Phone number to invite"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleInvite}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Send Invite
        </button>

        {/* Display status and code, if any */}
        <p className="text-red-500 mt-4">{status}</p>
        {inviteCode && (
          <p className="text-blue-700 mt-2">
            Your invitation code is: <strong>{inviteCode}</strong>
          </p>
        )}
      </div>
    </ClientLayout>
  );
};

export default InvitePage;
