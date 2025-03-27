'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { TemplateComponent } from '@/types/template';
import { templateComponentService } from '@/lib/firebase/templateComponentService';
import ComponentSidebar from '@/components/templates/ComponentSidebar';
import DropZone from '@/components/templates/DropZone';
import ComponentProperties from '@/components/templates/ComponentProperties';

export default function EditHeroTemplatePage() {
  const router = useRouter();
  const [component, setComponent] = useState<TemplateComponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<TemplateComponent | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        // Pastikan komponen default sudah dibuat
        await templateComponentService.createDefaultComponents();
        
        // Ambil komponen hero
        const data = await templateComponentService.getComponentByType('hero');
        if (!data) {
          setError('Komponen hero tidak ditemukan');
          return;
        }
        setComponent(data);
      } catch (err) {
        console.error('Error loading component:', err);
        setError('Gagal memuat komponen');
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, []);

  const handleSave = async () => {
    if (!component) return;

    try {
      await templateComponentService.updateComponent(component.id, component);
      router.push('/dashboard/templates');
    } catch (err) {
      console.error('Error saving component:', err);
      setError('Gagal menyimpan komponen');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/templates');
  };

  const handleComponentClick = (component: TemplateComponent) => {
    setSelectedComponent(component);
  };

  const handleComponentDelete = (component: TemplateComponent) => {
    if (!component) return;
    setSelectedComponent(null);
  };

  const handleDrop = (droppedComponent: TemplateComponent) => {
    if (!component) return;
    setComponent(droppedComponent);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-gray-600">Komponen tidak ditemukan</div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <ComponentSidebar onComponentClick={handleComponentClick} />
        <div className="flex-1 flex flex-col">
          <div className="border-b border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Edit Hero Template</h1>
                <p className="text-sm text-gray-600">Sesuaikan tampilan hero section sesuai kebutuhan</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 flex">
            <div className="flex-1 p-4">
              <DropZone
                component={component}
                onComponentClick={handleComponentClick}
                onDelete={handleComponentDelete}
                onDrop={handleDrop}
              />
            </div>
            {selectedComponent && (
              <div className="w-80 border-l border-gray-200 p-4">
                <ComponentProperties
                  component={selectedComponent}
                  onSave={(updatedComponent) => {
                    setComponent(updatedComponent);
                    setSelectedComponent(null);
                  }}
                  onCancel={() => setSelectedComponent(null)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 