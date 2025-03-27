'use client';

import type { TemplateComponent } from '@/types/template';
import { useState } from 'react';

interface PreviewComponentProps {
  component: TemplateComponent;
}

export default function PreviewComponent({ component }: PreviewComponentProps) {
  const [imageError, setImageError] = useState(false);

  const renderComponent = () => {
    switch (component.type) {
      case 'text':
        return (
          <div className="w-full p-4">
            <p 
              style={{
                fontSize: component.fontSize || '16px',
                color: component.color || '#000000',
                textAlign: component.alignment || 'left',
                margin: '0',
                lineHeight: '1.5'
              }}
            >
              {component.content || 'Teks kosong'}
            </p>
          </div>
        );
      case 'button':
        return (
          <div className="w-full p-4">
            <button
              className="px-6 py-2 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: component.backgroundColor || '#3B82F6',
                color: component.textColor || '#FFFFFF',
                fontSize: component.fontSize || '16px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {component.text || 'Tombol'}
            </button>
          </div>
        );
      case 'image':
        return (
          <div className="w-full p-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: '200px' }}>
              {!imageError ? (
                <img
                  src={component.src || 'https://placehold.co/400x300/e2e8f0/1e293b?text=Gambar'}
                  alt={component.alt || 'Gambar'}
                  className="max-w-full h-auto rounded-lg"
                  style={{
                    maxHeight: component.maxHeight || '400px',
                    objectFit: 'cover'
                  }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Gagal memuat gambar
                </div>
              )}
            </div>
          </div>
        );
      case 'hero':
        return (
          <div className="w-full p-4">
            <div
              className="relative rounded-lg overflow-hidden"
              style={{
                minHeight: '400px',
                background: component.backgroundType === 'gradient' 
                  ? `linear-gradient(${component.gradientAngle || '45deg'}, ${component.gradientStartColor || '#3B82F6'}, ${component.gradientEndColor || '#1D4ED8'})`
                  : component.backgroundType === 'image'
                  ? `url(${component.imageUrl || 'https://placehold.co/1920x1080/e2e8f0/1e293b?text=Hero+Background'})`
                  : component.backgroundColor || '#F3F4F6',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                textAlign: 'center',
                color: component.textColor || '#FFFFFF'
              }}
            >
              <h1 
                className="text-4xl font-bold mb-4"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
              >
                {component.title || 'Judul Hero'}
              </h1>
              <h2 
                className="text-2xl mb-4"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
              >
                {component.subtitle || 'Subtitle Hero'}
              </h2>
              <p 
                className="text-lg mb-8 max-w-2xl"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
              >
                {component.description || 'Deskripsi hero section yang menarik dan informatif.'}
              </p>
              {component.buttonText && (
                <button
                  className="px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
                  style={{
                    backgroundColor: component.buttonColor || '#FFFFFF',
                    color: component.buttonTextColor || '#3B82F6',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  {component.buttonText}
                </button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {renderComponent()}
    </div>
  );
} 