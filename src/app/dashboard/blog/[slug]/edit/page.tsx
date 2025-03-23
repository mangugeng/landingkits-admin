'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { BlogPost } from '@/types/blog';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUpload, FiImage } from 'react-icons/fi';
import Link from 'next/link';

export default function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    categories: [],
    tags: [],
  });

  // Fungsi untuk menambahkan log
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Scroll ke bawah terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Cari blog berdasarkan slug
        const blogRef = collection(db, 'blog_posts');
        const q = query(blogRef, where('slug', '==', resolvedParams.slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setFormData(doc.data() as BlogPost);
        } else {
          toast.error('Blog tidak ditemukan');
          router.push('/dashboard/blog');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Gagal mengambil data blog');
        router.push('/dashboard/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [resolvedParams.slug, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    addLog(`Memulai upload file: ${file.name}`);
    addLog(`Ukuran file: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    try {
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        throw new Error('File harus berupa gambar');
      }

      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Ukuran file maksimal 5MB');
      }

      addLog('Validasi file berhasil');

      // Buat nama file unik
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      addLog(`Nama file yang akan diupload: ${fileName}`);

      const storageRef = ref(storage, `blog-images/${fileName}`);

      // Upload file
      addLog('Memulai upload ke Firebase Storage...');
      await uploadBytes(storageRef, file);
      addLog('File berhasil diupload ke Firebase Storage');
      
      // Dapatkan URL download
      addLog('Mendapatkan URL download...');
      const downloadURL = await getDownloadURL(storageRef);
      addLog('URL download berhasil didapatkan');
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        featuredImage: downloadURL
      }));

      addLog('Gambar berhasil ditambahkan ke form');
      toast.success('Gambar berhasil diupload');
    } catch (error) {
      console.error('Error uploading image:', error);
      addLog(`Error: ${error instanceof Error ? error.message : 'Gagal upload gambar'}`);
      toast.error(error instanceof Error ? error.message : 'Gagal upload gambar');
    } finally {
      setUploading(false);
      addLog('Proses upload selesai');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Cari dokumen berdasarkan slug
      const blogRef = collection(db, 'blog_posts');
      const q = query(blogRef, where('slug', '==', resolvedParams.slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const postData = {
          ...formData,
          updatedAt: new Date().toISOString(),
          // Jika status diubah menjadi published, set tanggal publikasi
          publishedAt: formData.status === 'published' 
            ? (formData.publishedAt || new Date().toISOString())
            : formData.status === 'draft' 
              ? null 
              : formData.publishedAt
        };

        await updateDoc(doc.ref, postData);
        toast.success('Blog berhasil diperbarui');
        router.push('/dashboard/blog');
      } else {
        toast.error('Blog tidak ditemukan');
        router.push('/dashboard/blog');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Gagal memperbarui blog');
    }
  };

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
          <div className="flex items-center">
            <Link
              href="/dashboard/blog"
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <FiArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Container 1: Judul, Slug, Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
            </div>
          </div>

          {/* Container 2: Konten Blog */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Konten Blog</h2>
            <div className="space-y-6">
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
                  rows={20}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </div>

          {/* Container 3: Gambar Featured */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Gambar Featured</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Gambar utama yang akan ditampilkan di halaman blog
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear Log
                </button>
                <label
                  htmlFor="imageUpload"
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FiUpload className="mr-2 h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload Gambar'}
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom Kiri: Upload dan Preview */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Gambar
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.featuredImage || ''}
                        onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="https://example.com/image.jpg"
                        readOnly
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featuredImage: '' })}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {formData.featuredImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="relative group">
                      <img
                        src={formData.featuredImage}
                        alt="Preview Featured Image"
                        className="w-full h-48 object-cover rounded-lg shadow-sm border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => window.open(formData.featuredImage, '_blank')}
                          className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition-all duration-200"
                        >
                          Lihat Gambar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Panduan dan Log */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <FiImage className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Panduan Upload</h4>
                      <ul className="mt-2 text-sm text-gray-500 space-y-1">
                        <li>• Format yang didukung: JPG, PNG, GIF</li>
                        <li>• Ukuran maksimal: 5MB</li>
                        <li>• Resolusi yang disarankan: 1200x630px</li>
                        <li>• Gunakan gambar berkualitas tinggi</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-300">Log Upload</h3>
                    <button
                      type="button"
                      onClick={() => setLogs([])}
                      className="text-xs text-gray-400 hover:text-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                  <div
                    ref={terminalRef}
                    className="h-32 overflow-y-auto font-mono text-xs text-gray-300 bg-black rounded p-2"
                  >
                    {logs.map((log, index) => (
                      <div key={index} className="whitespace-pre-wrap">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/dashboard/blog"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 