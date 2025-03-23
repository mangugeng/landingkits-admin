'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiPlus, FiEdit2, FiTrash2, FiMail, FiImage, FiExternalLink, FiUser, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface User {
  displayName: string;
  email: string;
  photoURL: string;
}

interface FormField {
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

interface ComponentData {
  type: 'heading' | 'paragraph' | 'image' | 'button' | 'form' | 'testimonial' | 'cta' | 'features' | 'pricing' | 'spacer';
  content?: string;
  props?: any;
}

interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface LandingPage {
  id: string;
  title: string;
  description: string;
  content: ComponentData[];
  userId: string;
  thumbnail: string;
  slug: string;
  status: 'draft' | 'published' | 'banned';
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export default function LandingPage() {
  const userId = "mZYrJ6UbyphfjGBaYICt4t1ZRww2";
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<LandingPage | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    content: ComponentData[];
    userId: string;
    thumbnail: string;
    slug: string;
    status: 'draft' | 'published' | 'banned';
    isFeatured: boolean;
  }>({
    title: '',
    description: '',
    content: [],
    userId: userId,
    thumbnail: '',
    slug: '',
    status: 'draft',
    isFeatured: false
  });

  // Render component based on type
  const renderComponent = (component: ComponentData) => {
    switch (component.type) {
      case 'heading':
        return (
          <h2 className="text-3xl font-bold mb-4">
            {component.content}
          </h2>
        );
      case 'paragraph':
        return (
          <p className="mb-4">
            {component.content}
          </p>
        );
      case 'image':
        return (
          <div className="mb-4">
            <img 
              src={component.props?.src} 
              alt={component.props?.alt || ''} 
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        );
      case 'button':
        return (
          <button 
            className={`px-6 py-2 rounded-lg ${component.props?.style || 'bg-blue-600 text-white'}`}
          >
            {component.content}
          </button>
        );
      case 'form':
        return (
          <div className="mb-4 p-6 bg-gray-50 rounded-lg">
            <form className="space-y-4">
              {(component.props?.formFields as FormField[])?.map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full p-2 border rounded-lg"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type}
                      className="w-full p-2 border rounded-lg"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </form>
          </div>
        );
      case 'testimonial':
        return (
          <div className="mb-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <img 
                src={component.props?.testimonials?.[0]?.avatar} 
                alt={component.props?.testimonials?.[0]?.name} 
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-semibold">{component.props?.testimonials?.[0]?.name}</h4>
                {component.props?.testimonials?.[0]?.role && (
                  <p className="text-sm text-gray-600">{component.props?.testimonials?.[0]?.role}</p>
                )}
              </div>
            </div>
            <p className="text-gray-700">{component.props?.testimonials?.[0]?.content}</p>
          </div>
        );
      case 'cta':
        return (
          <div className="mb-4 p-8 bg-blue-600 text-white rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">{component.content}</h3>
            <button className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100">
              Get Started
            </button>
          </div>
        );
      case 'features':
        return (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.features?.map((feature: { title: string; description: string; icon?: string }, index: number) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow">
                {feature.icon && (
                  <div className="text-4xl mb-4">{feature.icon}</div>
                )}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        );
      case 'pricing':
        return (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.pricingPlans?.map((plan: PricingPlan, index: number) => (
              <div key={index} className={`p-6 rounded-lg ${plan.popular ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white border'}`}>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-4">{plan.price}</p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-center">
                      <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {plan.ctaText}
                </button>
              </div>
            ))}
          </div>
        );
      case 'spacer':
        return (
          <div
            className="w-full"
            style={{ height: `${component.props?.height || 40}px` }}
          />
        );
      default:
        return null;
    }
  };

  // Fetch user data
  const fetchUserData = async (userId: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          displayName: userData.displayName || '',
          email: userData.email || '',
          photoURL: userData.photoURL || ''
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Fetch landing pages
  const fetchLandingPages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'landing_pages'));
      const pages = await Promise.all(querySnapshot.docs.map(async doc => {
        const data = doc.data();
        const userData = await fetchUserData(data.userId);
        
        return {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          content: data.content || [],
          userId: data.userId || userId,
          thumbnail: data.thumbnail || '',
          slug: data.slug || '',
          status: data.status || 'draft',
          isFeatured: Boolean(data.isFeatured),
          user: userData,
          createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : new Date(),
          updatedAt: data.updatedAt ? (data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)) : new Date()
        } as LandingPage;
      }));
      
      setLandingPages(pages);
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      toast.error('Gagal mengambil data landing page');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandingPages();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPage) {
        // Update existing page
        await updateDoc(doc(db, 'landing_pages', editingPage.id), {
          ...formData,
          userId: userId,
          updatedAt: new Date()
        });
        toast.success('Landing page berhasil diperbarui');
      } else {
        // Create new page
        await addDoc(collection(db, 'landing_pages'), {
          ...formData,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success('Landing page berhasil dibuat');
      }
      
      setIsModalOpen(false);
      setFormData({ title: '', description: '', content: [], userId: userId, thumbnail: '', slug: '', status: 'draft', isFeatured: false });
      setEditingPage(null);
      fetchLandingPages();
    } catch (error) {
      console.error('Error saving landing page:', error);
      toast.error('Gagal menyimpan landing page');
    }
  };

  // Handle edit
  const handleEdit = (page: LandingPage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      description: page.description,
      content: page.content,
      userId: userId,
      thumbnail: page.thumbnail,
      slug: page.slug,
      status: page.status,
      isFeatured: page.isFeatured
    });
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus landing page ini?')) {
      try {
        await deleteDoc(doc(db, 'landing_pages', id));
        toast.success('Landing page berhasil dihapus');
        fetchLandingPages();
      } catch (error) {
        console.error('Error deleting landing page:', error);
        toast.error('Gagal menghapus landing page');
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (page: LandingPage, newStatus: 'draft' | 'published' | 'banned') => {
    try {
      await updateDoc(doc(db, 'landing_pages', page.id), {
        status: newStatus,
        updatedAt: new Date()
      });
      toast.success(`Status berhasil diubah menjadi ${newStatus === 'published' ? 'Published' : newStatus === 'banned' ? 'Banned' : 'Draft'}`);
      fetchLandingPages();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Gagal mengubah status');
    }
  };

  // Handle featured change
  const handleFeaturedChange = async (page: LandingPage, isFeatured: boolean) => {
    try {
      await updateDoc(doc(db, 'landing_pages', page.id), {
        isFeatured,
        updatedAt: new Date()
      });
      toast.success(`Landing page ${isFeatured ? 'ditandai' : 'dihapus dari'} unggulan`);
      fetchLandingPages();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Gagal mengubah status unggulan');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Landing Page</h1>
        <button
          onClick={() => {
            setEditingPage(null);
            setFormData({ title: '', description: '', content: [], userId: userId, thumbnail: '', slug: '', status: 'draft', isFeatured: false });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Tambah Landing Page
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        /* Landing Pages Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPages.map((page) => (
            <div key={page.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Preview */}
              <div className="relative h-48 bg-white overflow-hidden">
                <div className="w-full h-full overflow-y-auto">
                  {page.content.map((component, index) => (
                    <div key={index}>
                      {renderComponent(component)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {page.title}
                  </h3>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={page.isFeatured}
                        onChange={(e) => handleFeaturedChange(page, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">Unggulan</span>
                    </label>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {page.description}
                </p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FiUser className="mr-1.5 h-4 w-4" />
                  {page.user?.displayName || 'Nama tidak tersedia'}
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <FiMail className="mr-1.5 h-4 w-4" />
                  {page.user?.email || 'Email tidak tersedia'}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <a
                    href={`https://${page.slug}.landingkits.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    <FiExternalLink className="mr-1.5 h-4 w-4" />
                    Live Preview
                  </a>
                  <div className="flex items-center space-x-2">
                    <select
                      value={page.status}
                      onChange={(e) => handleStatusChange(page, e.target.value as 'draft' | 'published' | 'banned')}
                      className={`px-2 py-1 text-xs font-semibold rounded-md border ${
                        page.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : page.status === 'published'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="banned">Banned</option>
                    </select>
                    <button
                      onClick={() => handleEdit(page)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingPage ? 'Edit Landing Page' : 'Tambah Landing Page'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Judul
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Subdomain
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="nama-subdomain"
                    required
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    .landingkits.com
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <input
                  type="text"
                  id="userId"
                  value={formData.userId}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Konten JSON
                </label>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div>
                    <textarea
                      id="content"
                      value={JSON.stringify(formData.content, null, 2)}
                      onChange={(e) => {
                        try {
                          const newContent = JSON.parse(e.target.value);
                          setFormData({ ...formData, content: newContent });
                        } catch (error) {
                          console.error('Invalid JSON:', error);
                        }
                      }}
                      rows={10}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                      required
                    />
                  </div>
                  <div className="border rounded-md p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                    <div className="space-y-4">
                      {formData.content.map((component, index) => (
                        <div key={index}>
                          {renderComponent(component)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'banned' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                  Tandai sebagai unggulan
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ title: '', description: '', content: [], userId: userId, thumbnail: '', slug: '', status: 'draft', isFeatured: false });
                    setEditingPage(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingPage ? 'Simpan Perubahan' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 