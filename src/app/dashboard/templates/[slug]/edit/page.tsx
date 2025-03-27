'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Template, TemplateCategory, TemplateComponent } from '@/types/template';
import { templateService } from '@/lib/firebase/templateService';
import { templateCategoryService } from '@/lib/firebase/templateCategoryService';
import ComponentSidebar from '@/components/templates/ComponentSidebar';
import DropZone from '@/components/templates/DropZone';
import ComponentProperties from '@/components/templates/ComponentProperties';

export default function EditTemplatePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [category, setCategory] = useState<TemplateCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<TemplateComponent | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load template
        const templateData = await templateService.getTemplateBySlug(params.slug);
        if (!templateData) {
          setError('Template tidak ditemukan');
          return;
        }
        setTemplate(templateData);

        // Load category
        if (templateData.categoryId) {
          const categoryData = await templateCategoryService.getCategory(templateData.categoryId);
          if (categoryData) {
            setCategory(categoryData);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.slug]);

  const handleSave = async () => {
    if (!template) return;

    try {
      await templateService.updateTemplate(template.id, template);
      router.push('/dashboard/templates');
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Gagal menyimpan template');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/templates');
  };

  const handleComponentClick = (component: TemplateComponent) => {
    setSelectedComponent(component);
  };

  const handleComponentDelete = (component: TemplateComponent) => {
    if (!template) return;

    setTemplate({
      ...template,
      components: template.components.filter((c) => c.id !== component.id),
    });
    setSelectedComponent(null);
  };

  const handleDrop = (droppedComponent: any, dropIndex?: number) => {
    if (!template) return;

    // Ambil komponen dari array components yang di-drop
    const newComponents = droppedComponent.components.map((component: any) => ({
      ...component,
      id: `${component.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    // Jika dropIndex tidak didefinisikan, tambahkan di akhir
    if (typeof dropIndex === 'undefined') {
      setTemplate({
        ...template,
        components: [...template.components, ...newComponents],
      });
      return;
    }

    // Sisipkan komponen baru di posisi dropIndex
    const updatedComponents = [...template.components];
    updatedComponents.splice(dropIndex, 0, ...newComponents);

    setTemplate({
      ...template,
      components: updatedComponents,
    });
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

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-gray-600">Template tidak ditemukan</div>
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
                <h1 className="text-2xl font-bold">{template.name}</h1>
                {category && (
                  <div className="text-sm text-gray-600">
                    Kategori: {category.name}
                    {category.description && ` - ${category.description}`}
                  </div>
                )}
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
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {template.components.map((component, index) => (
                  <DropZone
                    key={component.id}
                    component={component}
                    onComponentClick={handleComponentClick}
                    onDelete={handleComponentDelete}
                    onDrop={(droppedComponent) => handleDrop(droppedComponent, index)}
                  />
                ))}
                {/* Satu drop zone di akhir untuk menambah komponen baru */}
                <DropZone
                  onComponentClick={handleComponentClick}
                  onDelete={handleComponentDelete}
                  onDrop={(droppedComponent) => handleDrop(droppedComponent, template.components.length)}
                />
              </div>
            </div>
            {selectedComponent && (
              <div className="w-80 border-l border-gray-200 p-4">
                <ComponentProperties
                  component={selectedComponent}
                  onSave={(updatedComponent) => {
                    if (!template) return;
                    setTemplate({
                      ...template,
                      components: template.components.map((c) =>
                        c.id === updatedComponent.id ? updatedComponent : c
                      ),
                    });
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