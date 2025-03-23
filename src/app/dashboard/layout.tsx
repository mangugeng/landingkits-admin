'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiUserPlus,
  FiFileText,
  FiBarChart2,
  FiShoppingBag,
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiMessageSquare,
  FiHelpCircle
} from 'react-icons/fi';
import Navbar from '@/components/dashboard/Navbar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Manajemen Staf', href: '/dashboard/staff', icon: FiUsers },
  { name: 'Manajemen Pengguna', href: '/dashboard/users', icon: FiUserPlus },
  { name: 'Manajemen Blog', href: '/dashboard/blog', icon: FiFileText },
  { name: 'Analitik', href: '/dashboard/analytics', icon: FiBarChart2 },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: FiSettings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow pt-16 bg-white overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-sm font-medium text-gray-500">Menu</span>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                <Link
                  href="/dashboard"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname === '/dashboard'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiHome className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/staff"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname.startsWith('/dashboard/staff')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiUsers className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Staf
                </Link>
                <Link
                  href="/dashboard/users"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname.startsWith('/dashboard/users')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiUserPlus className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Pengguna
                </Link>
                <Link
                  href="/dashboard/landing"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname.startsWith('/dashboard/landing')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiHome className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Landing Page
                </Link>
                <Link
                  href="/dashboard/blog"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname.startsWith('/dashboard/blog')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiFileText className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Blog
                </Link>
                <Link
                  href="/dashboard/payments"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname.startsWith('/dashboard/payments')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiDollarSign className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Pembayaran
                </Link>
                <Link
                  href="/dashboard/messages"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname.startsWith('/dashboard/messages')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiMessageSquare className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Pesan
                </Link>
                <Link
                  href="/dashboard/faq"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname.startsWith('/dashboard/faq')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiHelpCircle className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  FAQ
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname.startsWith('/dashboard/analytics')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiBarChart2 className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Analitik
                </Link>
                <Link
                  href="/dashboard/settings"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname.startsWith('/dashboard/settings')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiSettings className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Pengaturan
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 