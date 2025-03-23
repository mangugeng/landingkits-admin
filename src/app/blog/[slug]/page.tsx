'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BlogPost } from '@/types/blog';
import { FiCalendar, FiUser, FiTag, FiFolder, FiArrowLeft } from 'react-icons/fi';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(
          collection(db, 'blog_posts'),
          where('slug', '==', params.slug)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const postData = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
          } as BlogPost;
          setPost(postData);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Blog tidak ditemukan</h1>
          <p className="mt-2 text-gray-600">Maaf, blog yang Anda cari tidak dapat ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/dashboard/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Blog
        </Link>

        <article className="bg-white rounded-lg shadow-sm p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <FiUser className="mr-1 h-4 w-4" />
                {post.author?.name || 'Admin'}
              </div>
            </div>

            {post.featuredImage && (
              <div className="mb-6">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              {post.publishedAt && (
                <div className="flex items-center">
                  <FiCalendar className="mr-1 h-4 w-4" />
                  {format(new Date(post.publishedAt), 'd MMMM yyyy', { locale: id })}
                </div>
              )}
              {post.categories && post.categories.length > 0 && (
                <div className="flex items-center">
                  <FiFolder className="mr-1 h-4 w-4" />
                  {post.categories.join(', ')}
                </div>
              )}
            </div>

            {post.excerpt && (
              <div className="text-lg text-gray-600">
                {post.excerpt}
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <FiTag className="mr-2 h-4 w-4" />
                <span className="font-medium mr-2">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </article>

        <footer className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} LandingKits. All rights reserved.
        </footer>
      </div>
    </div>
  );
} 