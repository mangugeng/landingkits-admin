'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface Settings {
  // Pengaturan Umum
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;

  // Pengaturan SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;

  // Pengaturan Sosial Media
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;

  // Pengaturan Tampilan
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;

  // Pengaturan Kontak
  phoneNumber: string;
  address: string;
  businessHours: string;

  // Pengaturan Footer
  footerText: string;
  footerLinks: {
    title: string;
    url: string;
  }[];

  // Pengaturan Newsletter
  newsletterEnabled: boolean;
  newsletterTitle: string;
  newsletterDescription: string;

  // Pengaturan Keamanan
  enableRegistration: boolean;
  enableComments: boolean;
  enableContactForm: boolean;
  recaptchaEnabled: boolean;
  recaptchaSiteKey: string;

  // Pengaturan Pembayaran
  paymentEnabled: boolean;
  xenditSettings: {
    enabled: boolean;
    publicKey: string;
    secretKey: string;
    environment: 'sandbox' | 'production';
  };
  currency: string;
  taxRate: number;
  minimumOrder: number;

  // Pengaturan Notifikasi
  emailNotifications: {
    orderConfirmation: boolean;
    paymentReceived: boolean;
    orderShipped: boolean;
    newsletter: boolean;
  };
  smsNotifications: {
    orderConfirmation: boolean;
    paymentReceived: boolean;
    orderShipped: boolean;
  };
  notificationEmail: string;
  notificationPhone: string;

  // Pengaturan Integrasi
  integrations: {
    name: string;
    enabled: boolean;
    apiKey?: string;
    webhookUrl?: string;
  }[];
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    // Pengaturan Umum
    siteName: 'LandingKits',
    siteDescription: 'Platform untuk membuat landing page dengan mudah',
    contactEmail: 'support@landingkits.com',
    maintenanceMode: false,

    // Pengaturan SEO
    metaTitle: 'LandingKits - Platform Landing Page',
    metaDescription: 'Buat landing page profesional dengan mudah menggunakan LandingKits',
    metaKeywords: 'landing page, website, marketing, business',
    googleAnalyticsId: '',

    // Pengaturan Sosial Media
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',

    // Pengaturan Tampilan
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981',
    logoUrl: '',
    faviconUrl: '',

    // Pengaturan Kontak
    phoneNumber: '',
    address: '',
    businessHours: 'Senin - Jumat: 09:00 - 17:00',

    // Pengaturan Footer
    footerText: '© 2024 LandingKits. All rights reserved.',
    footerLinks: [
      { title: 'Tentang Kami', url: '/about' },
      { title: 'Kebijakan Privasi', url: '/privacy' },
      { title: 'Syarat & Ketentuan', url: '/terms' }
    ],

    // Pengaturan Newsletter
    newsletterEnabled: true,
    newsletterTitle: 'Berlangganan Newsletter',
    newsletterDescription: 'Dapatkan update terbaru dan tips seputar landing page',

    // Pengaturan Keamanan
    enableRegistration: true,
    enableComments: true,
    enableContactForm: true,
    recaptchaEnabled: false,
    recaptchaSiteKey: '',

    // Pengaturan Pembayaran
    paymentEnabled: true,
    xenditSettings: {
      enabled: true,
      publicKey: '',
      secretKey: '',
      environment: 'sandbox'
    },
    currency: 'IDR',
    taxRate: 11,
    minimumOrder: 100000,

    // Pengaturan Notifikasi
    emailNotifications: {
      orderConfirmation: true,
      paymentReceived: true,
      orderShipped: true,
      newsletter: true
    },
    smsNotifications: {
      orderConfirmation: false,
      paymentReceived: false,
      orderShipped: false
    },
    notificationEmail: 'notifications@landingkits.com',
    notificationPhone: '',

    // Pengaturan Integrasi
    integrations: [
      { name: 'WhatsApp Business', enabled: false },
      { name: 'Telegram Bot', enabled: false },
      { name: 'Slack', enabled: false }
    ]
  });

  // Debug log untuk melihat state settings
  useEffect(() => {
    console.log('Current settings state:', settings);
    console.log('Xendit settings:', settings.xenditSettings);
  }, [settings]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsRef = doc(db, 'settings', 'general');
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const data = settingsSnap.data() as Settings;
          console.log('Fetched settings data:', data); // Debug log
          // Pastikan semua array dan objek memiliki nilai default
          const updatedSettings = {
            ...data,
            xenditSettings: data.xenditSettings || {
              enabled: true,
              publicKey: '',
              secretKey: '',
              environment: 'sandbox'
            },
            footerLinks: data.footerLinks || [
              { title: 'Tentang Kami', url: '/about' },
              { title: 'Kebijakan Privasi', url: '/privacy' },
              { title: 'Syarat & Ketentuan', url: '/terms' }
            ],
            integrations: data.integrations || [
              { name: 'WhatsApp Business', enabled: false },
              { name: 'Telegram Bot', enabled: false },
              { name: 'Slack', enabled: false }
            ],
            emailNotifications: data.emailNotifications || {
              orderConfirmation: true,
              paymentReceived: true,
              orderShipped: true,
              newsletter: true
            },
            smsNotifications: data.smsNotifications || {
              orderConfirmation: false,
              paymentReceived: false,
              orderShipped: false
            }
          };
          console.log('Updated settings:', updatedSettings); // Debug log
          setSettings(updatedSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Gagal mengambil pengaturan');
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const settingsRef = doc(db, 'settings', 'general');
      await setDoc(settingsRef, settings, { merge: true });
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    }
  };

  return (
    <div className="space-y-6">
      {/* Pengaturan Umum */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Pengaturan Umum
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Pengaturan dasar website Anda
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                  Nama Situs
                </label>
                <input
                  type="text"
                  name="siteName"
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                  Deskripsi Situs
                </label>
                <textarea
                  id="siteDescription"
                  name="siteDescription"
                  rows={3}
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Email Kontak
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="maintenanceMode"
                    name="maintenanceMode"
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                    Mode Pemeliharaan
                  </label>
                  <p className="text-gray-500">
                    Aktifkan untuk menempatkan situs dalam mode pemeliharaan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pengaturan SEO */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Pengaturan SEO
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Optimalkan website Anda untuk mesin pencari
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  id="metaTitle"
                  value={settings.metaTitle}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  rows={3}
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  name="metaKeywords"
                  id="metaKeywords"
                  value={settings.metaKeywords}
                  onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-700">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  name="googleAnalyticsId"
                  id="googleAnalyticsId"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pengaturan Sosial Media */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Sosial Media
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Tautan ke akun sosial media Anda
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div>
                <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700">
                  Facebook URL
                </label>
                <input
                  type="url"
                  name="facebookUrl"
                  id="facebookUrl"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700">
                  Twitter URL
                </label>
                <input
                  type="url"
                  name="twitterUrl"
                  id="twitterUrl"
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700">
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  id="instagramUrl"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  id="linkedinUrl"
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pengaturan Tampilan */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Pengaturan Tampilan
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Sesuaikan tampilan website Anda
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                  Warna Utama
                </label>
                <input
                  type="color"
                  name="primaryColor"
                  id="primaryColor"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="mt-1 block w-full h-10"
                />
              </div>

              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                  Warna Sekunder
                </label>
                <input
                  type="color"
                  name="secondaryColor"
                  id="secondaryColor"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  className="mt-1 block w-full h-10"
                />
              </div>

              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                  URL Logo
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  id="logoUrl"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="faviconUrl" className="block text-sm font-medium text-gray-700">
                  URL Favicon
                </label>
                <input
                  type="url"
                  name="faviconUrl"
                  id="faviconUrl"
                  value={settings.faviconUrl}
                  onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pengaturan Kontak */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Pengaturan Kontak
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Informasi kontak bisnis Anda
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Alamat
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700">
                  Jam Operasional
                </label>
                <input
                  type="text"
                  name="businessHours"
                  id="businessHours"
                  value={settings.businessHours}
                  onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pengaturan Footer */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Pengaturan Footer
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Sesuaikan tampilan footer website
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div>
                <label htmlFor="footerText" className="block text-sm font-medium text-gray-700">
                  Teks Footer
                </label>
                <input
                  type="text"
                  name="footerText"
                  id="footerText"
                  value={settings.footerText}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Link Footer
                </label>
                {(settings.footerLinks || []).map((link, index) => (
                  <div key={index} className="mt-2 flex space-x-2">
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => {
                        const newLinks = [...(settings.footerLinks || [])];
                        newLinks[index].title = e.target.value;
                        setSettings({ ...settings, footerLinks: newLinks });
                      }}
                      placeholder="Judul Link"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...(settings.footerLinks || [])];
                        newLinks[index].url = e.target.value;
                        setSettings({ ...settings, footerLinks: newLinks });
                      }}
                      placeholder="URL"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newLinks = (settings.footerLinks || []).filter((_, i) => i !== index);
                        setSettings({ ...settings, footerLinks: newLinks });
                      }}
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      footerLinks: [...(settings.footerLinks || []), { title: '', url: '' }]
                    });
                  }}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Tambah Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pengaturan Newsletter */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Pengaturan Newsletter
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Konfigurasi form newsletter
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletterEnabled"
                    name="newsletterEnabled"
                    type="checkbox"
                    checked={settings.newsletterEnabled}
                    onChange={(e) => setSettings({ ...settings, newsletterEnabled: e.target.checked })}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newsletterEnabled" className="font-medium text-gray-700">
                    Aktifkan Newsletter
                  </label>
                  <p className="text-gray-500">
                    Tampilkan form newsletter di website
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="newsletterTitle" className="block text-sm font-medium text-gray-700">
                  Judul Newsletter
                </label>
                <input
                  type="text"
                  name="newsletterTitle"
                  id="newsletterTitle"
                  value={settings.newsletterTitle}
                  onChange={(e) => setSettings({ ...settings, newsletterTitle: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="newsletterDescription" className="block text-sm font-medium text-gray-700">
                  Deskripsi Newsletter
                </label>
                <textarea
                  id="newsletterDescription"
                  name="newsletterDescription"
                  rows={3}
                  value={settings.newsletterDescription}
                  onChange={(e) => setSettings({ ...settings, newsletterDescription: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pengaturan Keamanan */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Pengaturan Keamanan
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Konfigurasi keamanan website
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableRegistration"
                    name="enableRegistration"
                    type="checkbox"
                    checked={settings.enableRegistration}
                    onChange={(e) => setSettings({ ...settings, enableRegistration: e.target.checked })}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableRegistration" className="font-medium text-gray-700">
                    Aktifkan Pendaftaran
                  </label>
                  <p className="text-gray-500">
                    Izinkan pengguna baru untuk mendaftar
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableComments"
                    name="enableComments"
                    type="checkbox"
                    checked={settings.enableComments}
                    onChange={(e) => setSettings({ ...settings, enableComments: e.target.checked })}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableComments" className="font-medium text-gray-700">
                    Aktifkan Komentar
                  </label>
                  <p className="text-gray-500">
                    Izinkan pengunjung untuk memberikan komentar
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableContactForm"
                    name="enableContactForm"
                    type="checkbox"
                    checked={settings.enableContactForm}
                    onChange={(e) => setSettings({ ...settings, enableContactForm: e.target.checked })}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableContactForm" className="font-medium text-gray-700">
                    Aktifkan Form Kontak
                  </label>
                  <p className="text-gray-500">
                    Tampilkan form kontak di website
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="recaptchaEnabled"
                    name="recaptchaEnabled"
                    type="checkbox"
                    checked={settings.recaptchaEnabled}
                    onChange={(e) => setSettings({ ...settings, recaptchaEnabled: e.target.checked })}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="recaptchaEnabled" className="font-medium text-gray-700">
                    Aktifkan reCAPTCHA
                  </label>
                  <p className="text-gray-500">
                    Tambahkan verifikasi reCAPTCHA pada form
                  </p>
                </div>
              </div>

              {settings.recaptchaEnabled && (
                <div>
                  <label htmlFor="recaptchaSiteKey" className="block text-sm font-medium text-gray-700">
                    reCAPTCHA Site Key
                  </label>
                  <input
                    type="text"
                    name="recaptchaSiteKey"
                    id="recaptchaSiteKey"
                    value={settings.recaptchaSiteKey}
                    onChange={(e) => setSettings({ ...settings, recaptchaSiteKey: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pengaturan Pembayaran */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Pengaturan Pembayaran
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Konfigurasi pembayaran menggunakan Xendit
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              {/* Toggle Pembayaran */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="paymentEnabled"
                    name="paymentEnabled"
                    type="checkbox"
                    checked={settings.paymentEnabled}
                    onChange={(e) => setSettings({ ...settings, paymentEnabled: e.target.checked })}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="paymentEnabled" className="font-medium text-gray-700">
                    Aktifkan Pembayaran
                  </label>
                  <p className="text-gray-500">
                    Izinkan pembayaran online menggunakan Xendit
                  </p>
                </div>
              </div>

              {/* Pengaturan Xendit */}
              {settings.paymentEnabled && (
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="xenditEnabled"
                        name="xenditEnabled"
                        type="checkbox"
                        checked={settings.xenditSettings.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          xenditSettings: {
                            ...settings.xenditSettings,
                            enabled: e.target.checked
                          }
                        })}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="xenditEnabled" className="font-medium text-gray-700">
                        Aktifkan Xendit
                      </label>
                      <p className="text-gray-500">
                        Gunakan Xendit sebagai gateway pembayaran
                      </p>
                    </div>
                  </div>

                  {settings.xenditSettings.enabled && (
                    <>
                      <div>
                        <label htmlFor="xenditEnvironment" className="block text-sm font-medium text-gray-700">
                          Environment
                        </label>
                        <select
                          id="xenditEnvironment"
                          name="xenditEnvironment"
                          value={settings.xenditSettings.environment}
                          onChange={(e) => setSettings({
                            ...settings,
                            xenditSettings: {
                              ...settings.xenditSettings,
                              environment: e.target.value as 'sandbox' | 'production'
                            }
                          })}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="sandbox">Sandbox (Testing)</option>
                          <option value="production">Production (Live)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="xenditPublicKey" className="block text-sm font-medium text-gray-700">
                          Public Key
                        </label>
                        <input
                          type="text"
                          name="xenditPublicKey"
                          id="xenditPublicKey"
                          value={settings.xenditSettings.publicKey}
                          onChange={(e) => setSettings({
                            ...settings,
                            xenditSettings: {
                              ...settings.xenditSettings,
                              publicKey: e.target.value
                            }
                          })}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="xenditSecretKey" className="block text-sm font-medium text-gray-700">
                          Secret Key
                        </label>
                        <input
                          type="password"
                          name="xenditSecretKey"
                          id="xenditSecretKey"
                          value={settings.xenditSettings.secretKey}
                          onChange={(e) => setSettings({
                            ...settings,
                            xenditSettings: {
                              ...settings.xenditSettings,
                              secretKey: e.target.value
                            }
                          })}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Pengaturan Umum Pembayaran */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Mata Uang
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="IDR">IDR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                    Pajak (%)
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    id="taxRate"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="minimumOrder" className="block text-sm font-medium text-gray-700">
                    Pesanan Minimum
                  </label>
                  <input
                    type="number"
                    name="minimumOrder"
                    id="minimumOrder"
                    value={settings.minimumOrder}
                    onChange={(e) => setSettings({ ...settings, minimumOrder: Number(e.target.value) })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pengaturan Notifikasi */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Pengaturan Notifikasi
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Konfigurasi notifikasi sistem
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notifikasi Email
                </label>
                <div className="space-y-2">
                  {Object.entries(settings.emailNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            emailNotifications: {
                              ...settings.emailNotifications,
                              [key]: e.target.checked
                            }
                          });
                        }}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notifikasi SMS
                </label>
                <div className="space-y-2">
                  {Object.entries(settings.smsNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            smsNotifications: {
                              ...settings.smsNotifications,
                              [key]: e.target.checked
                            }
                          });
                        }}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="notificationEmail" className="block text-sm font-medium text-gray-700">
                    Email Notifikasi
                  </label>
                  <input
                    type="email"
                    name="notificationEmail"
                    id="notificationEmail"
                    value={settings.notificationEmail}
                    onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="notificationPhone" className="block text-sm font-medium text-gray-700">
                    Nomor Telepon Notifikasi
                  </label>
                  <input
                    type="tel"
                    name="notificationPhone"
                    id="notificationPhone"
                    value={settings.notificationPhone}
                    onChange={(e) => setSettings({ ...settings, notificationPhone: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Simpan Semua Pengaturan
        </button>
      </div>
    </div>
  );
} 