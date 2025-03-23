'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BlogPost, BLOG_STATUS, BLOG_CATEGORIES, BLOG_TAGS } from '@/types/blog';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiDownload, FiEye, FiClock, FiCheck, FiImage, FiCalendar, FiGlobe } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
  });
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    categories: [],
    tags: [],
  });
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, 'blog_posts'));
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Gagal mengambil data blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await updateDoc(doc(db, 'blog_posts', editingPost.id), {
          ...formData,
          categories: formData.categories || [],
          tags: formData.tags || [],
          updatedAt: new Date().toISOString(),
        });
        toast.success('Blog berhasil diperbarui');
      } else {
        const newPost = {
          ...formData,
          slug: formData.title?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
          author: {
            id: 'current-user-id', // TODO: Get from auth
            name: 'Admin', // TODO: Get from auth
            email: 'admin@landingkits.com', // TODO: Get from auth
          },
          views: 0,
          likes: 0,
          comments: 0,
          categories: formData.categories || [],
          tags: formData.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await addDoc(collection(db, 'blog_posts'), newPost);
        toast.success('Blog berhasil ditambahkan');
      }
      setShowAddModal(false);
      setEditingPost(null);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        status: 'draft',
        categories: [],
        tags: [],
      });
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Gagal menyimpan blog');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus blog ini?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'blog_posts', postId));
      toast.success('Blog berhasil dihapus');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Gagal menghapus blog');
    }
  };

  const handleEdit = (post: BlogPost) => {
    router.push(`/dashboard/blog/${post.slug}/edit`);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status === 'all' || post.status === filters.status;
    const matchesCategory = filters.category === 'all' || post.categories.includes(filters.category);
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Manajemen Blog</h1>
          <p className="mt-2 text-sm text-gray-700">
            Kelola konten blog LandingKits
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/dashboard/blog/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Tambah Blog
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-4">
          <div className="flex-1 max-w-lg">
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Cari blog..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">Semua Kategori</option>
              {BLOG_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {post.title}
                  </h3>
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    post.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : post.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status === 'published' ? 'Published' : post.status === 'draft' ? 'Draft' : 'Archived'}
                  </span>
                </div>
                
                <div className="mt-2">
                  {post.featuredImage ? (
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="h-48 w-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-100 rounded-md flex items-center justify-center">
                      <FiImage className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {post.excerpt || 'Tidak ada ringkasan'}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(post.categories) && post.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div>
                    {post.publishedAt && (
                      <div className="flex items-center">
                        <FiCalendar className="mr-1 h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString('id-ID')}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      className="text-blue-600 hover:text-blue-900"
                      title="Preview"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => window.open(`https://www.landingkits.com/blog/${post.slug}`, '_blank')}
                      className="text-green-600 hover:text-green-900"
                      title="Lihat di Website"
                    >
                      <FiGlobe className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Hapus"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingPost ? 'Edit Blog' : 'Tambah Blog Baru'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                    Ringkasan
                  </label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Konten
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogPost['status'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kategori
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.categories?.join(', ') || ''}
                      onChange={(e) => {
                        const categories = e.target.value.split(',').map(category => category.trim()).filter(Boolean);
                        setFormData({ ...formData, categories });
                      }}
                      placeholder="Masukkan kategori dipisahkan dengan koma"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Contoh: teknologi, bisnis, marketing
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.tags?.join(', ') || ''}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                        setFormData({ ...formData, tags });
                      }}
                      placeholder="Masukkan tags dipisahkan dengan koma"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Contoh: teknologi, bisnis, marketing
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                >
                  {editingPost ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPost(null);
                    setFormData({
                      title: '',
                      content: '',
                      excerpt: '',
                      status: 'draft',
                      categories: [],
                      tags: [],
                    });
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 