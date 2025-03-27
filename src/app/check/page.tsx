'use client';

import { useEffect, useState } from 'react';
import { templateComponentService } from '@/lib/firebase/templateComponentService';
import type { TemplateComponent } from '@/types/template';

export default function CheckPage() {
  const [component, setComponent] = useState<TemplateComponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkComponent = async () => {
      try {
        console.log('Checking footer component...');
        const footerComponent = await templateComponentService.getComponentBySlug('footer');
        console.log('Footer component result:', footerComponent);
        setComponent(footerComponent);
      } catch (err) {
        console.error('Error checking component:', err);
        setError('Gagal mengecek komponen');
      } finally {
        setLoading(false);
      }
    };

    checkComponent();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Check Component</h1>
      {component ? (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Component Details:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(component, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="text-gray-500">
          Tidak ada komponen footer ditemukan
        </div>
      )}
    </div>
  );
} 