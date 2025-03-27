'use client';

import { useState, useEffect } from 'react';
import { FiType, FiImage, FiSquare, FiLayout } from 'react-icons/fi';
import { useDrag } from 'react-dnd';
import type { TemplateComponent } from '@/types/template';
import { templateComponentService } from '@/lib/firebase/templateComponentService';

interface ComponentSidebarProps {
  onComponentClick: (component: TemplateComponent) => void;
}

function DraggableComponent({ component }: { component: any }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: {
      // Menggunakan format yang sama dengan database
      components: [
        {
          id: `component-${Date.now()}`,
          type: component.components?.[0]?.type || 'text',
          props: {
            // Ambil props dari komponen pertama
            ...component.components?.[0]?.props,
            // Jika ada nested text object, gunakan propertinya
            ...(component.components?.[0]?.props?.text || {})
          },
          children: []
        }
      ],
      // Tambahkan metadata lain yang mungkin diperlukan
      name: component.name,
      slug: component.slug,
      description: component.description
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Fungsi untuk mendapatkan display name komponen
  const getDisplayName = () => {
    return component.name || 'Component';
  };

  // Fungsi untuk mendapatkan tipe komponen
  const getComponentType = () => {
    return component.components?.[0]?.type || 'text';
  };

  return (
    <div
      ref={drag as any}
      className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-move transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {getComponentIcon(getComponentType())}
      <span>{getDisplayName()}</span>
    </div>
  );
}

function getComponentIcon(type: string | undefined) {
  if (!type) return <FiSquare className="w-5 h-5" />;
  
  switch (type.toLowerCase()) {
    case 'text':
      return <FiType className="w-5 h-5" />;
    case 'image':
      return <FiImage className="w-5 h-5" />;
    case 'button':
      return <FiSquare className="w-5 h-5" />;
    case 'hero':
      return <FiLayout className="w-5 h-5" />;
    default:
      return <FiSquare className="w-5 h-5" />;
  }
}

export default function ComponentSidebar({ onComponentClick }: ComponentSidebarProps) {
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        console.log('Loading components...');
        const data = await templateComponentService.getAllComponents();
        console.log('Loaded components:', data);
        setComponents(data);
      } catch (err) {
        console.error('Error loading components:', err);
        setError('Gagal memuat komponen');
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, []);

  if (loading) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Komponen</h2>
      <div className="space-y-2">
        {components.length === 0 ? (
          <div className="text-gray-500">Tidak ada komponen tersedia</div>
        ) : (
          components.map((component) => (
            <DraggableComponent key={component.id} component={component} />
          ))
        )}
      </div>
    </div>
  );
} 