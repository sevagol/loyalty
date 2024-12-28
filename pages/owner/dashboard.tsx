// pages/owner/dashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface IMarkRequest {
    _id: string;
    userId: {
      _id: string;
      name: string;
    };
    status: string;
    createdAt: string; // or Date
    type:string
  }
  

interface ISpendRequest {
  _id: string;
  userId: string;
  amount: number;
  status: string;
}

const OwnerDashboard: React.FC = () => {
  const [markRequests, setMarkRequests] = useState<IMarkRequest[]>([]);
  const [spendRequests, setSpendRequests] = useState<ISpendRequest[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchMarkRequests();
    fetchSpendRequests();
  }, []);

  const fetchMarkRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.get<IMarkRequest[]>('/api/loyalty/requestMark', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMarkRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSpendRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.get<ISpendRequest[]>('/api/wallet/spendRequests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpendRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Approve or Reject Mark (combined logic):
  const handleMarkAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return setStatusMessage('No token found');

      // We'll reuse the same "approveMark" route, but with an "action" field
      const { data } = await axios.post(
        '/api/loyalty/approveMark',
        { requestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMessage(data.message);
      // Remove from local state
      setMarkRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (error: any) {
      setStatusMessage(error.response?.data?.error || 'Error approving/rejecting mark');
    }
  };

  const handleActionSpend = async (spendRequestId: string, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return setStatusMessage('No token found');

      const { data } = await axios.post(
        '/api/wallet/approveSpend',
        { spendRequestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMessage(data.message);
      setSpendRequests((prev) => prev.filter((r) => r._id !== spendRequestId));
    } catch (error: any) {
      setStatusMessage(error.response?.data?.error || 'Error processing spend request');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Owner Dashboard
          </h1>
          <p className="text-gray-600">
            Manage loyalty requests and spending approvals here.
          </p>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="rounded-lg bg-green-100 border border-green-200 p-4 text-green-700">
            {statusMessage}
          </div>
        )}

        {/* Mark Requests */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Pending Mark Requests
          </h2>
          {markRequests.length === 0 ? (
            <p className="text-gray-500">No pending mark requests</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {markRequests.map((mr) => (
                <div
                  key={mr._id}
                  className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-500">
                      Request ID: {mr._id}
                    </p>
                    {/* Display user name */}
                    <p className="mt-1 text-base text-gray-700">
                      <span className="font-medium">Name:</span> {mr.userId.name}
                    </p>
                    <p>Type: {mr.type}</p> {/* mark or freeCoffee */}
                    {/* Show timestamp */}
                    <p className="text-sm text-gray-500 mt-1">
                      Created At: {new Date(mr.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Status: {mr.status}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {/* Approve */}
                    <button
                      onClick={() => handleMarkAction(mr._id, 'approve')}
                      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Approve
                    </button>
                    {/* Reject */}
                    <button
                      onClick={() => handleMarkAction(mr._id, 'reject')}
                      className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Spend Requests */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Pending Spend Requests
          </h2>
          {spendRequests.length === 0 ? (
            <p className="text-gray-500">No pending spend requests</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spendRequests.map((sr) => (
                <div
                  key={sr._id}
                  className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-500">
                      Request ID: {sr._id}
                    </p>
                    <p className="mt-1 text-base text-gray-700">
                      <span className="font-medium">User ID:</span> {sr.userId}
                    </p>
                    <p className="text-base text-gray-700 mt-1">
                      <span className="font-medium">Amount:</span> {sr.amount}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Status: {sr.status}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleActionSpend(sr._id, 'approve')}
                      className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve Spend
                    </button>
                    <button
                      onClick={() => handleActionSpend(sr._id, 'reject')}
                      className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject Spend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default OwnerDashboard;
