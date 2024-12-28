import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface IMarkRequest {
  _id: string;
  userId: string;
  status: string;
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
      const { data } = await axios.get('/api/loyalty/requestMark', {
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
      // GET pending spend requests
      const { data } = await axios.get('/api/wallet/spendRequests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpendRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveMark = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return setStatusMessage('No token found');
      const { data } = await axios.post(
        '/api/loyalty/approveMark',
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMessage(data.message);
      setMarkRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (error: any) {
      setStatusMessage(error.response?.data?.error || 'Error approving mark');
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
      // Remove the handled request from state
      setSpendRequests((prev) => prev.filter((r) => r._id !== spendRequestId));
    } catch (error: any) {
      setStatusMessage(error.response?.data?.error || 'Error processing spend request');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>

        {/* Status message box */}
        {statusMessage && (
          <div className="p-4 bg-green-100 text-green-700 rounded">
            {statusMessage}
          </div>
        )}

        {/* Mark Requests Section */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Pending Mark Requests</h2>
          {markRequests.length === 0 ? (
            <p className="text-gray-600">No pending mark requests</p>
          ) : (
            <div className="space-y-4">
              {markRequests.map((mr) => (
                <div
                  key={mr._id}
                  className="bg-white border border-gray-200 rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div>
                    <p className="text-gray-800 mb-1">
                      <span className="font-medium">User ID:</span> {mr.userId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {mr.status}
                    </p>
                  </div>
                  <button
                    onClick={() => handleApproveMark(mr._id)}
                    className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                  >
                    Approve Mark
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Spend Requests Section */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Pending Spend Requests</h2>
          {spendRequests.length === 0 ? (
            <p className="text-gray-600">No pending spend requests</p>
          ) : (
            <div className="space-y-4">
              {spendRequests.map((sr) => (
                <div
                  key={sr._id}
                  className="bg-white border border-gray-200 rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div>
                    <p className="text-gray-800 mb-1">
                      <span className="font-medium">User ID:</span> {sr.userId}
                    </p>
                    <p className="text-gray-800 mb-1">
                      <span className="font-medium">Amount:</span> {sr.amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {sr.status}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 space-x-2">
                    <button
                      onClick={() => handleActionSpend(sr._id, 'approve')}
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                    >
                      Approve Spend
                    </button>
                    <button
                      onClick={() => handleActionSpend(sr._id, 'reject')}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
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
