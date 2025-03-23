'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { BlogPost } from '@/types/blog';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiZap, FiUpload } from 'react-icons/fi';
import Link from 'next/link';

// Daftar kategori yang tersedia
const AVAILABLE_CATEGORIES = [
  'Teknologi',
  'Bisnis',
  'Pemasaran',
  'Desain',
  'Pengembangan Web',
  'UI/UX',
  'SEO',
  'Analitik',
  'E-commerce',
  'Keamanan',
  'Performa',
  'Mobile',
  'Cloud',
  'AI/ML',
  'Blockchain',
];

// Daftar tags yang tersedia
const AVAILABLE_TAGS = [
  'Web Development',
  'Frontend',
  'Backend',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'PHP',
  'WordPress',
  'UI Design',
  'UX Design',
  'Mobile App',
  'API',
  'Database',
  'Security',
  'Performance',
  'SEO',
  'Analytics',
  'Cloud',
  'DevOps',
  'AI',
  'Machine Learning',
  'Blockchain',
  'E-commerce',
  'Marketing',
  'Business',
  'Startup',
  'Technology',
];

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  // Fungsi untuk mengubah judul menjadi slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Update slug ketika judul berubah
  useEffect(() => {
    if (formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title || '')
      }));
    }
  }, [formData.title]);

  const generateContent = async () => {
    if (!formData.title) {
      toast.error('Judul blog harus diisi terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          categories: formData.categories,
          tags: formData.tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal generate konten');
      }

      setFormData(prev => ({
        ...prev,
        content: data.content,
        excerpt: data.excerpt,
        categories: data.categories || [],
        tags: data.tags || [],
      }));
      toast.success('Konten berhasil digenerate');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal generate konten');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPost = {
        ...formData,
        slug: formData.title?.toLowerCase().replace(/\s+/g, '-'),
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
      router.push('/dashboard/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Gagal menyimpan blog');
    }
  };

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
            <h1 className="text-2xl font-semibold text-gray-900">Tambah Blog Baru</h1>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            Buat konten blog baru untuk LandingKits
          </p>
        </div>
      </div>

      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            {/* Container untuk judul, slug, dan status */}
            <div className="border-b border-gray-200 pb-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Judul Blog
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5"
                      placeholder="Masukkan judul blog"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    Slug URL
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="slug"
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5"
                      placeholder="URL blog akan otomatis terisi"
                      readOnly
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    URL blog akan otomatis terisi sesuai judul. Anda bisa mengubahnya secara manual jika diperlukan.
                  </p>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogPost['status'] })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {formData.status === 'published' && (
                  <div>
                    <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">
                      Tanggal Publikasi
                    </label>
                    <div className="mt-1">
                      <input
                        type="datetime-local"
                        name="publishedAt"
                        id="publishedAt"
                        value={formData.publishedAt}
                        onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={generateContent}
                disabled={loading || !formData.title}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiZap className="mr-2 h-4 w-4" />
                {loading ? 'Generating...' : 'Generate dengan AI'}
              </button>
            </div>

            {/* Container untuk konten utama */}
            <div className="space-y-6">
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                  Ringkasan
                </label>
                <div className="mt-1">
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5"
                    placeholder="Tuliskan ringkasan dalam bentuk paragraf yang menarik dan informatif"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Tuliskan ringkasan dalam bentuk paragraf yang menarik dan informatif. Gunakan bahasa yang jelas dan mudah dipahami.
                </p>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Konten
                </label>
                <div className="mt-1">
                  <textarea
                    id="content"
                    name="content"
                    rows={10}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5"
                    placeholder="Masukkan konten blog"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                  Kategori
                </label>
                <div className="mt-1">
                  <select
                    id="categories"
                    name="categories"
                    multiple
                    value={formData.categories}
                    onChange={(e) => {
                      const categories = Array.from(e.target.selectedOptions, option => option.value);
                      setFormData({ ...formData, categories });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5"
                  >
                    {AVAILABLE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Pilih 3-5 kategori yang relevan dengan topik blog
                </p>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <div className="mt-1">
                  <select
                    id="tags"
                    name="tags"
                    multiple
                    value={formData.tags}
                    onChange={(e) => {
                      const tags = Array.from(e.target.selectedOptions, option => option.value);
                      setFormData({ ...formData, tags });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5"
                  >
                    {AVAILABLE_TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Pilih 5-8 tags yang relevan dengan topik blog
                </p>
              </div>
            </div>

            {/* Gambar Featured di bagian bawah */}
            <div className="border-t border-gray-200 pt-6">
              <div>
                <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
                  Gambar Featured
                </label>
                <div className="mt-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="featuredImage"
                        id="featuredImage"
                        value={formData.featuredImage || ''}
                        onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5"
                        placeholder="URL gambar atau upload gambar baru"
                        readOnly
                      />
                    </div>
                    <div>
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
                  {formData.featuredImage && (
                    <div className="mt-2">
                      <img
                        src={formData.featuredImage}
                        alt="Preview"
                        className="max-w-xs rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Upload gambar atau masukkan URL gambar. Ukuran maksimal 5MB.
                </p>

                {/* Terminal Internal */}
                <div className="mt-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-300">Terminal Upload</h3>
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
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Link
              href="/dashboard/blog"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 