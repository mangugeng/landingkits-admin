'use client';

import { useState, useEffect } from 'react';
import { TemplateCategory } from '@/types/template';
import { templateService } from '@/lib/firebase/templateService';

interface TemplateCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function TemplateCategories({
  selectedCategory,
  onSelectCategory,
}: TemplateCategoriesProps) {
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await templateService.getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => onSelectCategory('all')}
        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
          selectedCategory === 'all'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        All Templates
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
            selectedCategory === category.id
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
} 