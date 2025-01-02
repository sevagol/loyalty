// pages/client/loyalty.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientLayout from '@/components/ClientLayout';
import { FiPlus, FiRefreshCcw } from 'react-icons/fi';
import Image from 'next/image';

// Image Imports (PNG)
// Ensure that these paths are correct and that the images exist
import CoffeeCupImg from '@/public/dog.optimized.png'; // Replace with actual path
import FreeCoffeeImg from '@/public/gift.png';
import DogImg from '@/public/dog.optimized.png'; // Ensure this is the correct dog image

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
        { isFreeCoffee },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(data.message);
      alert('Your request has been received!');
      await fetchUserInfo();
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Error requesting');
    }
  };
  
  const handleRefresh = async () => {
    setStatus('Refreshing...');
    await fetchUserInfo();
    setStatus('Loyalty points refreshed!');
  };

  const renderMarkCircles = () => {
    const circles = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = loyaltyPoints >= i;
      const isNext = loyaltyPoints === i - 1;

      circles.push(
        <div
          key={i}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-loyaltyCircleBg flex items-center justify-center shadow-md relative"
        >
          {isFilled ? (
            <>
              {/* Main Icon */}
              <Image
                src={CoffeeCupImg}
                alt="Coffee Cup"
                width={40} // Adjust based on your design
                height={40}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              {/* Centered Dog PNG */}
              <Image
                src={DogImg}
                alt="Dog centered within the loyalty circle"
                width={24} // Adjust based on your design
                height={24}
                className="absolute inset-0 m-auto w-6 h-6 sm:w-8 sm:h-8"
              />
            </>
          ) : isNext ? (
            <button
              className="cursor-pointer flex items-center justify-center w-full h-full focus:outline-none"
              onClick={() => handleRequest(false)}
              title="Request Coffee Mark"
              aria-label="Request Coffee Mark"
            >
              <FiPlus className="text-2xl sm:text-3xl text-[#2c2a26] transform hover:scale-110 transition-transform duration-200" />
            </button>
          ) : (
            <span className="text-gray-400 text-2xl sm:text-3xl">•</span>
          )}
        </div>
      );
    }
    return circles;
  };

  const renderFreeCoffeeCircle = () => {
    const canGetFreeCoffee = loyaltyPoints >= 5;
    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-md relative animate-pulse">
        {canGetFreeCoffee ? (
          <>
            {/* Main Icon */}
            <Image
              src={FreeCoffeeImg}
              alt="Free Coffee"
              width={40} // Adjust based on your design
              height={40}
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
            {/* Centered Dog PNG */}
            
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full opacity-50">
            <Image
              src={FreeCoffeeImg}
              alt="Free Coffee"
              width={40} // Adjust based on your design
              height={40}
              className="w-10 h-10 sm:w-12 sm:h-12 filter grayscale"
            />
            {/* Centered Dog PNG */}
            <Image
              src={DogImg}
              alt="Dog centered within the loyalty circle"
              width={24} // Adjust based on your design
              height={24}
              className="absolute inset-0 m-auto w-6 h-6 sm:w-8 sm:h-8"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <ClientLayout>
      <div className="flex flex-col items-center justify-center w-full h-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-aouar text-[#2c2a26]">Le Brewji</h1>
          <h2 className="text-3xl lg:text-4xl font-BigCaslon text-center mt-2">Loyalty Program</h2>
          <p className="text-center text-gray-600 text-lg sm:text-xl mt-1">Every 6th coffee is free!</p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="absolute top-4 right-4 text-[#2c2a26] hover:text-[#1a1914] focus:outline-none"
          title="Refresh Points"
          aria-label="Refresh Points"
        >
          <FiRefreshCcw className="w-6 h-6 sm:w-8 sm:h-8 transform hover:rotate-180 transition-transform duration-300" />
        </button>

        {/* Loyalty Circles */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 justify-items-center mt-8 w-full max-w-4xl">
          {renderMarkCircles()}
          {renderFreeCoffeeCircle()}
        </div>

        {/* Status Message */}
        {status && <p className="text-red-500 text-center mt-6">{status}</p>}
      </div>
    </ClientLayout>
  );
};

export default LoyaltyPage;
