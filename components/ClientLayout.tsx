// components/ClientLayout.tsx

import React, { ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

export default function ClientLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/client/loyalty" className="text-xl font-bold text-gray-800">
            Loyalty Program
          </Link>
          <nav className="flex items-center space-x-4">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
