// components/ClientLayout.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

interface ClientLayoutProps {
  children: ReactNode;
}

function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-blue-700 text-white p-4">
        <nav className="flex justify-center gap-8">
          <Link href="/client/loyalty" className="hover:text-gray-200">
            Loyalty
          </Link>
          <Link href="/client/invite" className="hover:text-gray-200">
            Invite
          </Link>
          <Link href="/client/wallet" className="hover:text-gray-200">
            Wallet
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-grow p-4 bg-gray-100">{children}</main>
    </div>
  );
}

export default ClientLayout;
