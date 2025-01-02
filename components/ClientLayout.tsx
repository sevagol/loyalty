// components/ClientLayout.tsx

import React, { ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

export default function ClientLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-r from-[#f0e4d7] to-[#dcd4c0] overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/client/loyalty" className="text-xl font-bold text-gray-800">
            Loyalty Program
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/client/loyalty" className="text-gray-700 hover:text-gray-900">
              Loyalty
            </Link>
            <Link href="/client/invite" className="text-gray-700 hover:text-gray-900">
              Invite
            </Link>
            <Link href="/client/wallet" className="text-gray-700 hover:text-gray-900">
              Wallet
            </Link>
          </nav>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (hidden by default) */}
        <div className="md:hidden" id="mobile-menu">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/client/loyalty" className="block text-gray-700 hover:text-gray-900">
              Loyalty
            </Link>
            <Link href="/client/invite" className="block text-gray-700 hover:text-gray-900">
              Invite
            </Link>
            <Link href="/client/wallet" className="block text-gray-700 hover:text-gray-900">
              Wallet
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
