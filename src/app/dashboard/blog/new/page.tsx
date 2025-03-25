'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUpload, FiImage, FiSave, FiCpu } from 'react-icons/fi';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface BlogPost {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  categories?: string[];
  tags?: string[];
}

export default function NewBlogPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
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

  // Generate slug otomatis dari judul
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Memulai upload gambar:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });

    setUploading(true);
    setUploadProgress(0);
    try {
      // Upload gambar ke Firebase Storage
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `blog-images/temp/${fileName}`;

      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress);
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
          toast.error('Gagal mengupload gambar');
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Upload berhasil:', { downloadURL, filePath });
            setFormData(prev => ({ ...prev, featuredImage: downloadURL }));
            toast.success('Gambar berhasil diupload');
            setUploadProgress(0);
          } catch (error) {
            console.error('Error getting download URL:', error);
            toast.error('Gagal mendapatkan URL gambar');
          }
        }
      );
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      toast.error('Gagal mengupload gambar');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.title) {
      toast.error('Judul harus diisi terlebih dahulu');
      return;
    }

    setGenerating(true);
    addLog('Memulai generate konten dengan DeepSeek...');

    try {
      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          categories: formData.categories,
          tags: formData.tags,
          prompt: `Buatkan artikel blog dengan judul "${formData.title}". 
          ${formData.categories?.length ? `Kategori: ${formData.categories.join(', ')}.` : ''}
          ${formData.tags?.length ? `Tags: ${formData.tags.join(', ')}.` : ''}
          
          Artikel harus mencakup:
          1. Ringkasan singkat (excerpt) yang menarik
          2. Konten utama yang informatif dan terstruktur
          3. Gunakan bahasa yang mudah dipahami
          4. Tambahkan beberapa poin penting
          5. Kesimpulan yang menarik
          
          Format response dalam JSON:
          {
            "excerpt": "ringkasan singkat",
            "content": "konten utama",
            "categories": ["kategori1", "kategori2"],
            "tags": ["tag1", "tag2"]
          }`
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal generate konten');
      }

      const data = await response.json();
      addLog('Menerima respons dari DeepSeek API');

      // Pastikan data yang diterima valid
      if (!data || typeof data !== 'object') {
        throw new Error('Format respons tidak valid');
      }

      // Update form dengan data yang diterima
      const updatedFormData = {
        ...formData,
        excerpt: data.excerpt || '',
        content: data.content || '',
        categories: Array.isArray(data.categories) ? data.categories : formData.categories,
        tags: Array.isArray(data.tags) ? data.tags : formData.tags,
      };

      setFormData(updatedFormData);
      addLog('Konten berhasil digenerate dan dimasukkan ke form');
      toast.success('Konten berhasil digenerate');
    } catch (error) {
      console.error('Error generating content:', error);
      addLog(`Error: ${error instanceof Error ? error.message : 'Gagal generate konten'}`);
      toast.error(error instanceof Error ? error.message : 'Gagal generate konten');
    } finally {
      setGenerating(false);
      addLog('Proses generate selesai');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData: BlogPost = {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as BlogPost;

      await addDoc(collection(db, 'blog_posts'), postData);
      toast.success('Blog berhasil dibuat');
      router.push('/dashboard/blog');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Gagal membuat blog');
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
          </div>
        </div>
      </div>

      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Container 1: Judul, Slug, Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Informasi Dasar</h2>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={generating || !formData.title}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  generating || !formData.title ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FiCpu className="mr-2 h-4 w-4" />
                {generating ? 'Generating...' : 'Generate AI'}
              </button>
            </div>
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
                  value={formData.slug || ''}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  htmlFor="featuredImage"
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FiUpload className="mr-2 h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload Gambar'}
                </label>
                <input
                  type="file"
                  id="featuredImage"
                  onChange={handleImageUpload}
                  accept="image/*"
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
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FiSave className="mr-2 h-4 w-4" />
              Buat Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 