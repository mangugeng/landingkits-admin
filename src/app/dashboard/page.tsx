'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiUsers, FiSettings, FiFileText, FiBarChart2, FiUserPlus, FiUserCheck, FiLogOut, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { signOut } from 'firebase/auth';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalStaff: number;
  activeStaff: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalStaff: 0,
    activeStaff: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authCookie = Cookies.get('auth');
      if (!authCookie) {
        router.push('/login');
        return;
      }

      try {
        // Verifikasi token dengan Firebase
        const user = auth.currentUser;
        if (!user) {
          Cookies.remove('auth');
          router.push('/login');
          return;
        }

        await fetchStats();
      } catch (error) {
        console.error('Auth error:', error);
        Cookies.remove('auth');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchStats = async () => {
    try {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => doc.data());
      
      // Fetch staff
      const staffSnapshot = await getDocs(collection(db, 'staff'));
      const staff = staffSnapshot.docs.map(doc => doc.data());

      setStats({
        totalUsers: users.length,
        activeUsers: users.filter(user => user.status === 'active').length,
        totalStaff: staff.length,
        activeStaff: staff.filter(member => member.status === 'active').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('auth');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      title: 'Manajemen Staf',
      description: 'Kelola akses dan hak staf',
      icon: FiUsers,
      href: '/dashboard/staff',
      color: 'bg-blue-500',
    },
    {
      title: 'Manajemen Pengguna',
      description: 'Kelola data pengguna website',
      icon: FiUserPlus,
      href: '/dashboard/users',
      color: 'bg-green-500',
    },
    {
      title: 'Manajemen Blog',
      description: 'Kelola konten blog website',
      icon: FiFileText,
      href: '/dashboard/blog',
      color: 'bg-purple-500',
    },
    {
      title: 'Analitik',
      description: 'Lihat statistik dan laporan',
      icon: FiBarChart2,
      href: '/dashboard/analytics',
      color: 'bg-yellow-500',
    },
    {
      title: 'Pengaturan',
      description: 'Konfigurasi sistem dan website',
      icon: FiSettings,
      href: '/dashboard/settings',
      color: 'bg-gray-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="mt-2 text-sm text-gray-600">
              Selamat datang di dashboard admin LandingKits
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FiLogOut className="mr-2 h-5 w-5" />
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Staf
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.totalStaff}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUserCheck className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Staf Aktif
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.activeStaff}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUserPlus className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Pengguna
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.totalUsers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUserCheck className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pengguna Aktif
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.activeUsers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${item.color} p-3 rounded-lg`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="flex items-center">
              <Link
                href="/dashboard/blog"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Buat Blog Baru
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 