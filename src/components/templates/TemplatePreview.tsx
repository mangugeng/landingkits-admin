'use client';

import { useState } from 'react';
import { Template, TemplateComponent } from '@/types/template';
import Image from 'next/image';

interface TemplatePreviewProps {
  template: Template;
  onClose: () => void;
}

export default function TemplatePreview({ template, onClose }: TemplatePreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const renderComponent = (component: TemplateComponent) => {
    // TODO: Implement component rendering based on type
    return (
      <div key={component.id} className="border p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">{component.type}</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(component.props, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">{template.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 ${
              activeTab === 'preview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 ${
              activeTab === 'code'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Code
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'preview' ? (
            <div>
              <div className="relative h-48 mb-4">
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-gray-600 mb-4">{template.description}</p>
              <div className="space-y-4">
                {template.components.map(renderComponent)}
              </div>
            </div>
          ) : (
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {JSON.stringify(template, null, 2)}
            </pre>
          )}
        </div>

        <div className="p-4 border-t flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => {
              // TODO: Implement template editing
            }}
          >
            Edit Template
          </button>
        </div>
      </div>
    </div>
  );
} 