'use client';

import { useState } from 'react';
import { Template, TemplateComponent } from '@/types/template';

interface TemplateGeneratorProps {
  onClose: () => void;
}

export default function TemplateGenerator({ onClose }: TemplateGeneratorProps) {
  const [template, setTemplate] = useState<Partial<Template>>({
    name: '',
    description: '',
    category: '',
    components: [],
  });
  const [selectedLayout, setSelectedLayout] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // TODO: Implement template generation logic
      // This will involve:
      // 1. Generating components based on selected layout
      // 2. Saving to Firebase
      // 3. Handling success/error states
      
      console.log('Generating template:', template);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onClose();
    } catch (error) {
      console.error('Error generating template:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Generate New Template</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={template.description}
              onChange={(e) => setTemplate({ ...template, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={template.category}
              onChange={(e) => setTemplate({ ...template, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select a category</option>
              <option value="business">Business</option>
              <option value="portfolio">Portfolio</option>
              <option value="ecommerce">E-commerce</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout
            </label>
            <select
              value={selectedLayout}
              onChange={(e) => setSelectedLayout(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select a layout</option>
              <option value="hero-features">Hero + Features</option>
              <option value="hero-pricing">Hero + Pricing</option>
              <option value="hero-testimonials">Hero + Testimonials</option>
              <option value="full-width">Full Width Sections</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 