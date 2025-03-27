'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ComponentEditor as ComponentEditorType } from '@/types/template';
import { componentEditorService } from '@/lib/firebase/componentEditorService';
import ComponentEditor from '@/components/templates/ComponentEditor';

interface EditComponentPageProps {
  params: {
    slug: string;
  };
}

export default function EditComponentPage({ params }: EditComponentPageProps) {
  const router = useRouter();
  const [component, setComponent] = useState<ComponentEditorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const data = await componentEditorService.getComponentBySlug(params.slug);
        if (data) {
          setComponent(data);
        } else {
          setError('Komponen tidak ditemukan');
        }
      } catch (err) {
        console.error('Error loading component:', err);
        setError('Gagal memuat komponen');
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, [params.slug]);

  const handleSave = async (updatedComponent: ComponentEditorType) => {
    try {
      if (component?.id) {
        await componentEditorService.updateComponentEditor(component.id, updatedComponent);
      }
      router.push('/dashboard/component');
    } catch (err) {
      console.error('Error saving component:', err);
      setError('Gagal menyimpan komponen');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/component');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error || 'Komponen tidak ditemukan'}</div>
      </div>
    );
  }

  return (
    <ComponentEditor
      component={component}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
} 