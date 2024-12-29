// pages/client/loyalty.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientLayout from '@/components/ClientLayout';
import { FiPlus, FiRefreshCcw, FiRefreshCw } from 'react-icons/fi';
import Image from 'next/image';

// Image Imports (PNG)
// Ensure that these paths are correct and that the images exist
import CoffeeCupImg from '@/public/dog.optimized.png';
import FreeCoffeeImg from '@/public/dog.optimized.png';
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
      alert('Your request has been received!'); // Alert added here
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
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-loyaltyCircleBg flex items-center justify-center shadow-md relative"
        >
          {isFilled ? (
            <>
              {/* Main Icon */}
              <Image
                src={CoffeeCupImg}
                alt="Coffee Cup"
                width={32} // Adjust based on your design
                height={32}
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              {/* Centered Dog PNG */}
              <Image
                src={DogImg}
                alt="Dog centered within the loyalty circle"
                width={16} // Adjust based on your design
                height={16}
                className="absolute inset-0 m-auto w-4 h-4 sm:w-6 sm:h-6"
              />
            </>
          ) : isNext ? (
            <button
              className="cursor-pointer flex items-center justify-center w-full h-full focus:outline-none"
              onClick={() => handleRequest(false)}
              title="Request Coffee Mark"
              aria-label="Request Coffee Mark"
            >
              <FiPlus className="text-xl sm:text-2xl text-[#2c2a26] transform hover:scale-110 transition-transform duration-200" />
            </button>
          ) : (
            <span className="text-gray-400 text-xl sm:text-2xl">•</span>
          )}
        </div>
      );
    }
    return circles;
  };

  const renderFreeCoffeeCircle = () => {
    const canGetFreeCoffee = loyaltyPoints >= 5;
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-md relative">
        {canGetFreeCoffee ? (
          <>
            {/* Main Icon */}
            <Image
              src={FreeCoffeeImg}
              alt="Free Coffee"
              width={32} // Adjust based on your design
              height={32}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            {/* Centered Dog PNG */}
            <Image
              src={DogImg}
              alt="Dog centered within the loyalty circle"
              width={16} // Adjust based on your design
              height={16}
              className="absolute inset-0 m-auto w-4 h-4 sm:w-6 sm:h-6"
            />
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full opacity-50">
            <Image
              src={FreeCoffeeImg}
              alt="Free Coffee"
              width={32} // Adjust based on your design
              height={32}
              className="w-8 h-8 sm:w-10 sm:h-10 filter grayscale"
            />
            {/* Centered Dog PNG */}
            <Image
              src={DogImg}
              alt="Dog centered within the loyalty circle"
              width={16} // Adjust based on your design
              height={16}
              className="absolute inset-0 m-auto w-4 h-4 sm:w-6 sm:h-6"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <ClientLayout>
        
      <div className="max-w-md mx-auto bg-[#b0aa9a] p-5 rounded shadow space-y-6">
        {/* Refresh Icon in Top-Right Corner */}
        <button
          onClick={handleRefresh}
          className="absolute top-4 right-4 text-[#2c2a26] hover:text-[#1a1914] focus:outline-none"
          title="Refresh Points"
          aria-label="Refresh Points"
        >
          <FiRefreshCcw className="w-6 h-6 sm:w-8 sm:h-8 transform hover:rotate-180 transition-transform duration-300" />
        </button>
        <h1 className="text-2xl lg:text-3xl font-aouar text-center">Loyalty Program</h1>
        <p className="text-center text-gray-600 text-base sm:text-lg">Every 6th coffee is free!</p>

        {/* <div className="text-center mt-4">
          <strong className="text-xl sm:text-2xl font-aouar">Loyalty Marks: {loyaltyPoints}</strong>
          <p className="text-base sm:text-lg text-gray-500 mt-1">
            {loyaltyPoints < 5
              ? `You need ${5 - loyaltyPoints} more mark(s) to get a free coffee!`
              : 'You are eligible for a free coffee!'}
          </p>
        </div> */}

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 justify-items-center mt-6">
          {renderMarkCircles()}
          {renderFreeCoffeeCircle()}
        </div>

        {status && <p className="text-red-500 text-center mt-4">{status}</p>}
      </div>
    </ClientLayout>
  );
};

export default LoyaltyPage;
