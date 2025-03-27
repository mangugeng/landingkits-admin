'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import type { Template, TemplateCategory } from '@/types/template';
import { templateService } from '@/lib/firebase/templateService';
import { templateCategoryService } from '@/lib/firebase/templateCategoryService';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories first
        await templateCategoryService.createDefaultCategories();
        const categoriesData = await templateCategoryService.getAllCategories();
        setCategories(categoriesData);

        // Then load templates
        const templatesData = await templateService.getAllTemplates();
        setTemplates(templatesData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateClick = () => {
    setShowCreateDialog(true);
  };

  const handleCreateClose = () => {
    setShowCreateDialog(false);
    setNewTemplate({
      name: '',
      slug: '',
      description: '',
      categoryId: ''
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generate slug dari nama
      const slug = newTemplate.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const template = await templateService.createTemplate({
        name: newTemplate.name,
        slug: slug,
        description: newTemplate.description,
        categoryId: newTemplate.categoryId,
        components: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      handleCreateClose();
      router.push(`/dashboard/templates/${slug}/edit`);
    } catch (err) {
      console.error('Error creating template:', err);
      setError('Gagal membuat template');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus template ini?')) {
      try {
        await templateService.deleteTemplate(id);
        setTemplates(prev => prev.filter(template => template.id !== id));
      } catch (err) {
        console.error('Error deleting template:', err);
        setError('Gagal menghapus template');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Template</h1>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Buat Template Baru
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
            <p className="text-gray-600 mb-4">{template.description}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => router.push(`/dashboard/templates/${template.slug}/edit`)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(template.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog Create Template */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Buat Template Baru</h2>
              <button
                onClick={handleCreateClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Template
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (otomatis)
                </label>
                <input
                  type="text"
                  value={newTemplate.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={newTemplate.categoryId}
                  onChange={(e) => setNewTemplate({ ...newTemplate, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCreateClose}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Buat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 