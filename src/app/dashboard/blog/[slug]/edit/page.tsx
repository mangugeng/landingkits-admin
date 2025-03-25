'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface BlogPost {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export default function EditBlogPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    excerpt: string;
    status: 'draft' | 'published';
    featuredImage: string;
  }>({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    featuredImage: ''
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Cari blog berdasarkan slug
        const blogRef = collection(db, 'blog_posts');
        const q = query(blogRef, where('slug', '==', params.slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data() as BlogPost;
          setPost(data);
          setFormData({
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            status: data.status,
            featuredImage: data.featuredImage || ''
          });
        } else {
          toast.error('Blog tidak ditemukan');
          router.push('/dashboard/blog');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Gagal memuat post');
        router.push('/dashboard/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Memulai upload gambar:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      slug: params.slug
    });

    setUploading(true);
    setUploadProgress(0);
    try {
      // Upload gambar ke Firebase Storage
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `blog-images/${params.slug}/${fileName}`;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    try {
      // Cari dokumen berdasarkan slug
      const blogRef = collection(db, 'blog_posts');
      const q = query(blogRef, where('slug', '==', params.slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        await updateDoc(doc.ref, {
          ...formData,
          updatedAt: new Date()
        });

        toast.success('Blog berhasil diperbarui');
        router.push('/dashboard/blog');
      } else {
        toast.error('Blog tidak ditemukan');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Gagal memperbarui post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Judul
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
              Gambar Utama
            </label>
            <input
              type="file"
              id="featuredImage"
              onChange={handleImageUpload}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
              disabled={uploading}
            />
            {uploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Uploading: {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
            {formData.featuredImage && (
              <div className="mt-2">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="h-32 w-auto object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard/blog')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 