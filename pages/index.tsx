// pages/index.tsx
import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-md shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Welcome to the Loyalty Program!
        </h1>
        <p className="text-gray-700 text-center mb-6">
          Every 6th coffee is free. Earn rewards by inviting friends.
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">New here? Sign Up</h2>
          <p className="text-sm text-gray-600 mb-2">
            Become a cafe client or register as a cafe owner.
          </p>
          <div className="flex gap-4">
            <Link
              href="/sign-up?role=client"
              className="flex-1 bg-indigo-500 text-white text-center py-2 rounded hover:bg-indigo-600"
            >
              Sign Up as Client
            </Link>
            <Link
              href="/sign-up?role=owner"
              className="flex-1 bg-pink-500 text-white text-center py-2 rounded hover:bg-pink-600"
            >
              Sign Up as Owner
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Already have an account?</h2>
          <Link
            href="/sign-in"
            className="block w-full bg-green-500 text-white text-center py-2 rounded hover:bg-green-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
