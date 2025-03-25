'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiLogOut, FiHome, FiUsers, FiUserPlus, FiFileText, FiShoppingBag, FiPackage, FiTruck, FiDollarSign, FiMessageSquare, FiHelpCircle, FiBarChart2, FiSettings, FiImage } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fungsi untuk mendapatkan judul halaman berdasarkan path
  const getPageTitle = () => {
    const path = pathname.split('/');
    
    // Jika di halaman edit blog
    if (path.includes('edit')) {
      return 'Edit Blog';
    }
    
    // Jika di halaman blog
    if (path.includes('blog')) {
      return 'Blog';
    }
    
    // Jika di halaman dashboard
    if (path.length === 2) {
      return 'Dashboard Admin';
    }
    
    // Jika di halaman settings
    if (path.includes('settings')) {
      return 'Settings';
    }
    
    return 'Dashboard Admin';
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left side - Menu Button & Logo */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
            <div className="ml-4 flex lg:ml-0">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">LandingKits</span>
              </Link>
            </div>
          </div>

          {/* Right side - Page Title & Actions */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">testing:</span>
            <h1 className="hidden lg:block text-lg font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <span className="text-xl font-bold text-indigo-600">LandingKits</span>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-4">
            <div className="px-2 space-y-1">
              <Link
                href="/dashboard"
                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  pathname === '/dashboard'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiHome className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/staff"
                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  pathname.startsWith('/dashboard/staff')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiUsers className="mr-3 h-5 w-5" />
                Staf
              </Link>
              <Link
                href="/dashboard/users"
                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  pathname.startsWith('/dashboard/users')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiUserPlus className="mr-3 h-5 w-5" />
                Pengguna
              </Link>
              <Link
                href="/dashboard/landing"
                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  pathname.startsWith('/dashboard/landing')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiHome className="mr-3 h-5 w-5" />
                Landing Page
              </Link>
              <Link
                href="/dashboard/blog"
                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  pathname.startsWith('/dashboard/blog')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiFileText className="mr-3 h-5 w-5" />
                Blog
              </Link>
              <Link
                href="/dashboard/gallery"
                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  pathname.startsWith('/dashboard/gallery')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiImage className="mr-3 h-5 w-5" />
                Galeri
              </Link>
              <Link
                href="/dashboard/payments"
                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  pathname.startsWith('/dashboard/payments')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiDollarSign className="mr-3 h-5 w-5" />
                Pembayaran
              </Link>
              <Link
                href="/dashboard/messages"
                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  pathname.startsWith('/dashboard/messages')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiMessageSquare className="mr-3 h-5 w-5" />
                Pesan
              </Link>
              <Link
                href="/dashboard/faq"
                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  pathname.startsWith('/dashboard/faq')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiHelpCircle className="mr-3 h-5 w-5" />
                FAQ
              </Link>
              <Link
                href="/dashboard/analytics"
                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  pathname.startsWith('/dashboard/analytics')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiBarChart2 className="mr-3 h-5 w-5" />
                Analitik
              </Link>
              <Link
                href="/dashboard/settings"
                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  pathname.startsWith('/dashboard/settings')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiSettings className="mr-3 h-5 w-5" />
                Pengaturan
              </Link>
              <button
                type="button"
                className="w-full group flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
} 