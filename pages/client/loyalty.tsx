// pages/client/loyalty.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientLayout from '@/components/ClientLayout';
import dynamic from 'next/dynamic';
import { FiPlus } from 'react-icons/fi';

// Dynamic import of the Player component with SSR disabled
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

// Importing Lottie JSON animations from the public directory
const coffeeCup = '/lotties/coffeeCup.json';
const freeCoffee = '/lotties/freeCoffee.json';

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

  /**
   * Send request to either get a normal mark or a free coffee.
   */
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
      await fetchUserInfo(); // Refresh points after request
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Error requesting');
    }
  };

  const handleRefresh = async () => {
    setStatus('Refreshing...');
    await fetchUserInfo();
    setStatus('Loyalty points refreshed!');
  };

  /**
   * Render 5 circles for marks
   */
  const renderMarkCircles = () => {
    const circles = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = loyaltyPoints >= i;
      const isNext = loyaltyPoints === i - 1;

      circles.push(
        <div
          key={i}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center shadow-md relative"
        >
          {isFilled ? (
            // CoffeeCup Lottie if user already has this mark
            <Player
              autoplay
              loop
              src={coffeeCup}
              style={{ width: '50px', height: '50px' }}
            />
          ) : isNext ? (
            // Next circle: plus icon to request a new mark
            <div
              className="cursor-pointer flex items-center justify-center w-full h-full"
              onClick={() => handleRequest(false)}
              title="Request Coffee Mark"
              aria-label="Request Coffee Mark"
            >
              <FiPlus className="text-xl sm:text-2xl text-blue-600 transform hover:scale-110 transition-transform duration-200" />
            </div>
          ) : (
            // If it's not filled or next, just empty or placeholder
            <span className="text-gray-400 text-lg sm:text-xl">•</span>
          )}
        </div>
      );
    }
    return circles;
  };

  /**
   * 6th circle: free coffee 
   * - If loyaltyPoints < 5 => grayscale or disabled
   * - If loyaltyPoints >= 5 => active Lottie, clickable to request free coffee
   */
  const renderFreeCoffeeCircle = () => {
    const canGetFreeCoffee = loyaltyPoints >= 5;
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-md relative">
        {canGetFreeCoffee ? (
          <div
            className="cursor-pointer"
            onClick={() => handleRequest(true)}
            title="Get Free Coffee"
            aria-label="Get Free Coffee"
          >
            <Player
              autoplay
              loop
              src={freeCoffee}
              style={{ width: '50px', height: '50px' }}
            />
          </div>
        ) : (
          // Grayscale effect using CSS filter and reduced opacity
          <div className="opacity-50">
            <Player
              autoplay
              loop
              src={freeCoffee}
              style={{ width: '50px', height: '50px', filter: 'grayscale(100%)' }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <ClientLayout>
      <div className="max-w-md mx-auto bg-white p-4 sm:p-6 rounded shadow space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center">Loyalty Program</h1>
        <p className="text-center text-gray-600 text-sm sm:text-base">Every 6th coffee is free!</p>

        <div className="text-center">
          <strong className="text-lg sm:text-xl">Loyalty Marks: {loyaltyPoints}</strong>
          <p className="text-sm sm:text-base text-gray-500">
            {loyaltyPoints < 5
              ? `You need ${5 - loyaltyPoints} more mark(s) to get a free coffee!`
              : 'You are eligible for a free coffee!'}
          </p>
        </div>

        {/* Circles Display */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 justify-items-center">
          {/* Render 5 circles for normal marks */}
          {renderMarkCircles()}
          {/* 6th circle for free coffee */}
          {renderFreeCoffeeCircle()}
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Refresh My Points
        </button>

        {/* Status */}
        {status && <p className="text-red-500 text-center mt-2">{status}</p>}
      </div>
    </ClientLayout>
  );
};

export default LoyaltyPage;
