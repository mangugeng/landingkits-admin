'use client';

import { useState } from 'react';
import { TemplateComponent } from '@/types/template';
import { FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface ComponentPropertiesProps {
  component: TemplateComponent;
  onSave: (component: TemplateComponent) => void;
  onCancel: () => void;
}

export default function ComponentProperties({ component, onSave, onCancel }: ComponentPropertiesProps) {
  const [editedComponent, setEditedComponent] = useState<TemplateComponent>(component);

  const handleChange = (path: string, value: any) => {
    const updatedComponent = { ...component };
    const pathArray = path.split('.');
    let current: any = updatedComponent;
    
    // Navigate to the nested property
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }
    
    // Update the value
    current[pathArray[pathArray.length - 1]] = value;
    
    // Update the component immediately
    onSave(updatedComponent);
  };

  const handleSave = () => {
    try {
      onSave(editedComponent);
      toast.success('Perubahan berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan perubahan');
      console.error('Error saving changes:', error);
    }
  };

  const renderPropertyEditor = () => {
    switch (component.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={component.props.text.content}
                onChange={(e) => handleChange('props.text.content', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Font Size</label>
              <input
                type="text"
                value={component.props.text.fontSize}
                onChange={(e) => handleChange('props.text.fontSize', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Font Weight</label>
              <select
                value={component.props.text.fontWeight}
                onChange={(e) => handleChange('props.text.fontWeight', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="semibold">Semibold</option>
                <option value="bold">Bold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="color"
                value={component.props.text.color}
                onChange={(e) => handleChange('props.text.color', e.target.value)}
                className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alignment</label>
              <select
                value={component.props.text.alignment}
                onChange={(e) => handleChange('props.text.alignment', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Text</label>
              <input
                type="text"
                value={component.props.button.text}
                onChange={(e) => handleChange('props.button.text', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Background Color</label>
              <input
                type="color"
                value={component.props.button.backgroundColor}
                onChange={(e) => handleChange('props.button.backgroundColor', e.target.value)}
                className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Text Color</label>
              <input
                type="color"
                value={component.props.button.textColor}
                onChange={(e) => handleChange('props.button.textColor', e.target.value)}
                className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius</label>
              <input
                type="text"
                value={component.props.button.borderRadius}
                onChange={(e) => handleChange('props.button.borderRadius', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding</label>
              <input
                type="text"
                value={component.props.button.padding}
                onChange={(e) => handleChange('props.button.padding', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <input
                type="text"
                value={component.props.button.link}
                onChange={(e) => handleChange('props.button.link', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
              <input
                type="text"
                value={component.props.image?.src || ''}
                onChange={(e) => handleChange('props.image.src', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alt Text</label>
              <input
                type="text"
                value={component.props.image?.alt || ''}
                onChange={(e) => handleChange('props.image.alt', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lebar</label>
              <input
                type="text"
                value={component.props.image?.width || '100%'}
                onChange={(e) => handleChange('props.image.width', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tinggi</label>
              <input
                type="text"
                value={component.props.image?.height || 'auto'}
                onChange={(e) => handleChange('props.image.height', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius</label>
              <input
                type="text"
                value={component.props.image?.borderRadius || '0'}
                onChange={(e) => handleChange('props.image.borderRadius', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Object Fit</label>
              <select
                value={component.props.image?.objectFit || 'cover'}
                onChange={(e) => handleChange('props.image.objectFit', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
                <option value="none">None</option>
                <option value="scale-down">Scale Down</option>
              </select>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={component.props.title || ''}
                onChange={(e) => handleChange('props.title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subtitle</label>
              <input
                type="text"
                value={component.props.subtitle || ''}
                onChange={(e) => handleChange('props.subtitle', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={component.props.description || ''}
                onChange={(e) => handleChange('props.description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Button Text</label>
              <input
                type="text"
                value={component.props.buttonText || ''}
                onChange={(e) => handleChange('props.buttonText', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Button Link</label>
              <input
                type="text"
                value={component.props.buttonLink || ''}
                onChange={(e) => handleChange('props.buttonLink', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                value={component.props.imageUrl || ''}
                onChange={(e) => handleChange('props.imageUrl', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Background Type</label>
              <select
                value={component.props.backgroundType || 'color'}
                onChange={(e) => handleChange('props.backgroundType', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="color">Color</option>
                <option value="image">Image</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>
            {component.props.backgroundType === 'color' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Background Color</label>
                <input
                  type="color"
                  value={component.props.backgroundColor || '#ffffff'}
                  onChange={(e) => handleChange('props.backgroundColor', e.target.value)}
                  className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
            {component.props.backgroundType === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Background Image</label>
                <input
                  type="text"
                  value={component.props.backgroundImage || ''}
                  onChange={(e) => handleChange('props.backgroundImage', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            )}
            {component.props.backgroundType === 'gradient' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gradient Start Color</label>
                  <input
                    type="color"
                    value={component.props.gradientStart || '#ffffff'}
                    onChange={(e) => handleChange('props.gradientStart', e.target.value)}
                    className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gradient End Color</label>
                  <input
                    type="color"
                    value={component.props.gradientEnd || '#000000'}
                    onChange={(e) => handleChange('props.gradientEnd', e.target.value)}
                    className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gradient Angle</label>
                  <input
                    type="text"
                    value={component.props.gradientAngle || '90deg'}
                    onChange={(e) => handleChange('props.gradientAngle', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'container':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding</label>
              <input
                type="text"
                value={component.props.container?.padding || '0px'}
                onChange={(e) => handleChange('props.container.padding', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: 16px atau 1rem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Background Color</label>
              <input
                type="color"
                value={component.props.container?.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('props.container.backgroundColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius</label>
              <input
                type="text"
                value={component.props.container?.borderRadius || '0px'}
                onChange={(e) => handleChange('props.container.borderRadius', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: 8px atau 1rem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border</label>
              <input
                type="text"
                value={component.props.container?.border || 'none'}
                onChange={(e) => handleChange('props.container.border', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: 1px solid #e5e7eb"
              />
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Jumlah Kolom</label>
              <input
                type="number"
                value={component.props.grid?.columns || 2}
                onChange={(e) => handleChange('props.grid.columns', parseInt(e.target.value))}
                min="1"
                max="12"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jarak Antar Item</label>
              <input
                type="text"
                value={component.props.grid?.gap || '16px'}
                onChange={(e) => handleChange('props.grid.gap', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: 16px atau 1rem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding</label>
              <input
                type="text"
                value={component.props.grid?.padding || '0px'}
                onChange={(e) => handleChange('props.grid.padding', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: 16px atau 1rem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Background Color</label>
              <input
                type="color"
                value={component.props.grid?.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('props.grid.backgroundColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'columns':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Jumlah Kolom</label>
              <input
                type="number"
                value={component.props.columns?.count || 2}
                onChange={(e) => handleChange('props.columns.count', parseInt(e.target.value))}
                min="1"
                max="6"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jarak Antar Kolom</label>
              <input
                type="text"
                value={component.props.columns?.gap || '16px'}
                onChange={(e) => handleChange('props.columns.gap', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: 16px atau 1rem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding</label>
              <input
                type="text"
                value={component.props.columns?.padding || '0px'}
                onChange={(e) => handleChange('props.columns.padding', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: 16px atau 1rem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Background Color</label>
              <input
                type="color"
                value={component.props.columns?.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('props.columns.backgroundColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'spacer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tinggi</label>
              <input
                type="text"
                value={component.props.spacer?.height || '32px'}
                onChange={(e) => handleChange('props.spacer.height', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: 32px atau 2rem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Background Color</label>
              <input
                type="color"
                value={component.props.spacer?.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('props.spacer.backgroundColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={component.props.heading.content}
                onChange={(e) => handleChange('props.heading.content', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <select
                value={component.props.heading.level}
                onChange={(e) => handleChange('props.heading.level', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Font Size</label>
              <input
                type="text"
                value={component.props.heading.fontSize}
                onChange={(e) => handleChange('props.heading.fontSize', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Font Weight</label>
              <select
                value={component.props.heading.fontWeight}
                onChange={(e) => handleChange('props.heading.fontWeight', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="semibold">Semibold</option>
                <option value="bold">Bold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="color"
                value={component.props.heading.color}
                onChange={(e) => handleChange('props.heading.color', e.target.value)}
                className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alignment</label>
              <select
                value={component.props.heading.alignment}
                onChange={(e) => handleChange('props.heading.alignment', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={component.props.paragraph.content}
                onChange={(e) => handleChange('props.paragraph.content', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Font Size</label>
              <input
                type="text"
                value={component.props.paragraph.fontSize}
                onChange={(e) => handleChange('props.paragraph.fontSize', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Line Height</label>
              <input
                type="text"
                value={component.props.paragraph.lineHeight}
                onChange={(e) => handleChange('props.paragraph.lineHeight', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="color"
                value={component.props.paragraph.color}
                onChange={(e) => handleChange('props.paragraph.color', e.target.value)}
                className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alignment</label>
              <select
                value={component.props.paragraph.alignment}
                onChange={(e) => handleChange('props.paragraph.alignment', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={component.props.quote.content}
                onChange={(e) => handleChange('props.quote.content', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                value={component.props.quote.author}
                onChange={(e) => handleChange('props.quote.author', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Font Size</label>
              <input
                type="text"
                value={component.props.quote.fontSize}
                onChange={(e) => handleChange('props.quote.fontSize', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="color"
                value={component.props.quote.color}
                onChange={(e) => handleChange('props.quote.color', e.target.value)}
                className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alignment</label>
              <select
                value={component.props.quote.alignment}
                onChange={(e) => handleChange('props.quote.alignment', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Style</label>
              <select
                value={component.props.quote.style}
                onChange={(e) => handleChange('props.quote.style', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="italic">Italic</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>
        );

      case 'input':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Placeholder</label>
              <input
                type="text"
                value={component.props.input.placeholder}
                onChange={(e) => handleChange('props.input.placeholder', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={component.props.input.type}
                onChange={(e) => handleChange('props.input.type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="tel">Phone</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Color</label>
              <input
                type="color"
                value={component.props.input.borderColor}
                onChange={(e) => handleChange('props.input.borderColor', e.target.value)}
                className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius</label>
              <input
                type="text"
                value={component.props.input.borderRadius}
                onChange={(e) => handleChange('props.input.borderRadius', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding</label>
              <input
                type="text"
                value={component.props.input.padding}
                onChange={(e) => handleChange('props.input.padding', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Width</label>
              <input
                type="text"
                value={component.props.input.width}
                onChange={(e) => handleChange('props.input.width', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Placeholder</label>
              <input
                type="text"
                value={component.props.textarea.placeholder}
                onChange={(e) => handleChange('props.textarea.placeholder', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rows</label>
              <input
                type="number"
                value={component.props.textarea.rows}
                onChange={(e) => handleChange('props.textarea.rows', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Color</label>
              <input
                type="color"
                value={component.props.textarea.borderColor}
                onChange={(e) => handleChange('props.textarea.borderColor', e.target.value)}
                className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius</label>
              <input
                type="text"
                value={component.props.textarea.borderRadius}
                onChange={(e) => handleChange('props.textarea.borderRadius', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding</label>
              <input
                type="text"
                value={component.props.textarea.padding}
                onChange={(e) => handleChange('props.textarea.padding', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Width</label>
              <input
                type="text"
                value={component.props.textarea.width}
                onChange={(e) => handleChange('props.textarea.width', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Options</label>
              <textarea
                value={component.props.select.options.join('\n')}
                onChange={(e) => handleChange('props.select.options', e.target.value.split('\n'))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={4}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Placeholder</label>
              <input
                type="text"
                value={component.props.select.placeholder}
                onChange={(e) => handleChange('props.select.placeholder', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Color</label>
              <input
                type="color"
                value={component.props.select.borderColor}
                onChange={(e) => handleChange('props.select.borderColor', e.target.value)}
                className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius</label>
              <input
                type="text"
                value={component.props.select.borderRadius}
                onChange={(e) => handleChange('props.select.borderRadius', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding</label>
              <input
                type="text"
                value={component.props.select.padding}
                onChange={(e) => handleChange('props.select.padding', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Width</label>
              <input
                type="text"
                value={component.props.select.width}
                onChange={(e) => handleChange('props.select.width', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">URL Video</label>
              <input
                type="text"
                value={component.props.video?.src || ''}
                onChange={(e) => handleChange('props.video.src', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Poster Image</label>
              <input
                type="text"
                value={component.props.video?.poster || ''}
                onChange={(e) => handleChange('props.video.poster', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lebar</label>
              <input
                type="text"
                value={component.props.video?.width || '100%'}
                onChange={(e) => handleChange('props.video.width', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tinggi</label>
              <input
                type="text"
                value={component.props.video?.height || 'auto'}
                onChange={(e) => handleChange('props.video.height', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Opsi</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.video?.controls || false}
                  onChange={(e) => handleChange('props.video.controls', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Tampilkan Kontrol</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.video?.autoplay || false}
                  onChange={(e) => handleChange('props.video.autoplay', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Autoplay</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.video?.loop || false}
                  onChange={(e) => handleChange('props.video.loop', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Loop</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.video?.muted || false}
                  onChange={(e) => handleChange('props.video.muted', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Muted</label>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">URL Audio</label>
              <input
                type="text"
                value={component.props.audio?.src || ''}
                onChange={(e) => handleChange('props.audio.src', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Opsi</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.audio?.controls || false}
                  onChange={(e) => handleChange('props.audio.controls', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Tampilkan Kontrol</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.audio?.autoplay || false}
                  onChange={(e) => handleChange('props.audio.autoplay', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Autoplay</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.audio?.loop || false}
                  onChange={(e) => handleChange('props.audio.loop', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Loop</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.audio?.muted || false}
                  onChange={(e) => handleChange('props.audio.muted', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Muted</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preload</label>
              <select
                value={component.props.audio?.preload || 'metadata'}
                onChange={(e) => handleChange('props.audio.preload', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="none">None</option>
                <option value="metadata">Metadata</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        );

      case 'svg':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lebar</label>
              <input
                type="text"
                value={component.props.svg?.width || ''}
                onChange={(e) => handleChange('props.svg.width', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tinggi</label>
              <input
                type="text"
                value={component.props.svg?.height || ''}
                onChange={(e) => handleChange('props.svg.height', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ViewBox</label>
              <input
                type="text"
                value={component.props.svg?.viewBox || ''}
                onChange={(e) => handleChange('props.svg.viewBox', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fill</label>
              <input
                type="text"
                value={component.props.svg?.fill || ''}
                onChange={(e) => handleChange('props.svg.fill', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stroke</label>
              <input
                type="text"
                value={component.props.svg?.stroke || ''}
                onChange={(e) => handleChange('props.svg.stroke', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stroke Width</label>
              <input
                type="text"
                value={component.props.svg?.strokeWidth || ''}
                onChange={(e) => handleChange('props.svg.strokeWidth', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stroke Linecap</label>
              <select
                value={component.props.svg?.strokeLinecap || 'butt'}
                onChange={(e) => handleChange('props.svg.strokeLinecap', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="butt">Butt</option>
                <option value="round">Round</option>
                <option value="square">Square</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stroke Linejoin</label>
              <select
                value={component.props.svg?.strokeLinejoin || 'miter'}
                onChange={(e) => handleChange('props.svg.strokeLinejoin', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="miter">Miter</option>
                <option value="round">Round</option>
                <option value="bevel">Bevel</option>
              </select>
            </div>
          </div>
        );

      case 'animation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipe Animasi</label>
              <select
                value={component.props.animation?.type || 'fade'}
                onChange={(e) => handleChange('props.animation.type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="bounce">Bounce</option>
                <option value="spin">Spin</option>
                <option value="pulse">Pulse</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Durasi</label>
              <input
                type="text"
                value={component.props.animation?.duration || '1s'}
                onChange={(e) => handleChange('props.animation.duration', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Timing Function</label>
              <select
                value={component.props.animation?.timing || 'ease'}
                onChange={(e) => handleChange('props.animation.timing', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="linear">Linear</option>
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Delay</label>
              <input
                type="text"
                value={component.props.animation?.delay || '0s'}
                onChange={(e) => handleChange('props.animation.delay', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Iterasi</label>
              <input
                type="text"
                value={component.props.animation?.iteration || '1'}
                onChange={(e) => handleChange('props.animation.iteration', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Arah</label>
              <select
                value={component.props.animation?.direction || 'normal'}
                onChange={(e) => handleChange('props.animation.direction', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="normal">Normal</option>
                <option value="reverse">Reverse</option>
                <option value="alternate">Alternate</option>
                <option value="alternate-reverse">Alternate Reverse</option>
              </select>
            </div>
          </div>
        );

      case 'carousel':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Items</label>
              <textarea
                value={component.props.carousel?.items?.join('\n') || ''}
                onChange={(e) => handleChange('props.carousel.items', e.target.value.split('\n'))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Opsi</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.carousel?.showArrows || false}
                  onChange={(e) => handleChange('props.carousel.showArrows', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Tampilkan Panah</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.carousel?.showDots || false}
                  onChange={(e) => handleChange('props.carousel.showDots', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Tampilkan Dots</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.carousel?.autoplay || false}
                  onChange={(e) => handleChange('props.carousel.autoplay', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Autoplay</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.carousel?.infinite || false}
                  onChange={(e) => handleChange('props.carousel.infinite', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Infinite</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Interval (ms)</label>
              <input
                type="number"
                value={component.props.carousel?.interval || 3000}
                onChange={(e) => handleChange('props.carousel.interval', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gambar</label>
              <textarea
                value={component.props.gallery?.images?.join('\n') || ''}
                onChange={(e) => handleChange('props.gallery.images', e.target.value.split('\n'))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={4}
                placeholder="Masukkan URL gambar, satu per baris"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jumlah Kolom</label>
              <select
                value={component.props.gallery?.columns || 3}
                onChange={(e) => handleChange('props.gallery.columns', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value={1}>1 Kolom</option>
                <option value={2}>2 Kolom</option>
                <option value={3}>3 Kolom</option>
                <option value={4}>4 Kolom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jarak Antar Gambar (px)</label>
              <input
                type="number"
                value={component.props.gallery?.gap || 16}
                onChange={(e) => handleChange('props.gallery.gap', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Opsi</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.gallery?.lightbox || false}
                  onChange={(e) => handleChange('props.gallery.lightbox', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Lightbox</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.gallery?.lazyLoad || false}
                  onChange={(e) => handleChange('props.gallery.lazyLoad', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Lazy Loading</label>
              </div>
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">API Key</label>
              <input
                type="password"
                value={component.props.map?.apiKey || ''}
                onChange={(e) => handleChange('props.map.apiKey', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Masukkan Google Maps API Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                step="any"
                value={component.props.map?.center?.lat || 0}
                onChange={(e) => handleChange('props.map.center.lat', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                step="any"
                value={component.props.map?.center?.lng || 0}
                onChange={(e) => handleChange('props.map.center.lng', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zoom Level</label>
              <input
                type="number"
                min="0"
                max="21"
                value={component.props.map?.zoom || 12}
                onChange={(e) => handleChange('props.map.zoom', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tinggi Peta (px)</label>
              <input
                type="number"
                value={component.props.map?.height || 400}
                onChange={(e) => handleChange('props.map.height', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Kontrol</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.map?.showZoom || true}
                  onChange={(e) => handleChange('props.map.showZoom', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Tampilkan Zoom</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.map?.showStreetView || false}
                  onChange={(e) => handleChange('props.map.showStreetView', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Tampilkan Street View</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.map?.showMapType || false}
                  onChange={(e) => handleChange('props.map.showMapType', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Tampilkan Tipe Peta</label>
              </div>
            </div>
          </div>
        );

      case 'icon':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Icon</label>
              <input
                type="text"
                value={component.props.icon?.name || ''}
                onChange={(e) => handleChange('props.icon.name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: FiHome, FiUser, dll"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ukuran (px)</label>
              <input
                type="number"
                value={component.props.icon?.size || 24}
                onChange={(e) => handleChange('props.icon.size', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna</label>
              <input
                type="color"
                value={component.props.icon?.color || '#000000'}
                onChange={(e) => handleChange('props.icon.color', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ketebalan Garis</label>
              <input
                type="number"
                min="1"
                max="3"
                step="0.1"
                value={component.props.icon?.strokeWidth || 2}
                onChange={(e) => handleChange('props.icon.strokeWidth', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ujung Garis</label>
              <select
                value={component.props.icon?.strokeLinecap || 'round'}
                onChange={(e) => handleChange('props.icon.strokeLinecap', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="butt">Butt</option>
                <option value="round">Round</option>
                <option value="square">Square</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pertemuan Garis</label>
              <select
                value={component.props.icon?.strokeLinejoin || 'round'}
                onChange={(e) => handleChange('props.icon.strokeLinejoin', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="miter">Miter</option>
                <option value="round">Round</option>
                <option value="bevel">Bevel</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Animasi</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.icon?.animate || false}
                  onChange={(e) => handleChange('props.icon.animate', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Aktifkan Animasi</label>
              </div>
              {component.props.icon?.animate && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipe Animasi</label>
                    <select
                      value={component.props.icon?.animationType || 'spin'}
                      onChange={(e) => handleChange('props.icon.animationType', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="spin">Spin</option>
                      <option value="pulse">Pulse</option>
                      <option value="bounce">Bounce</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Durasi (s)</label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={component.props.icon?.animationDuration || 1}
                      onChange={(e) => handleChange('props.icon.animationDuration', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'iconSet':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Icons</label>
              <textarea
                value={component.props.iconSet?.icons?.join('\n') || ''}
                onChange={(e) => handleChange('props.iconSet.icons', e.target.value.split('\n'))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={4}
                placeholder="Masukkan nama icon, satu per baris"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Layout</label>
              <select
                value={component.props.iconSet?.layout || 'grid'}
                onChange={(e) => handleChange('props.iconSet.layout', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="grid">Grid</option>
                <option value="flex">Flex</option>
                <option value="list">List</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jumlah Kolom (Grid)</label>
              <input
                type="number"
                min="1"
                max="6"
                value={component.props.iconSet?.columns || 3}
                onChange={(e) => handleChange('props.iconSet.columns', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jarak Antar Icon (px)</label>
              <input
                type="number"
                value={component.props.iconSet?.gap || 16}
                onChange={(e) => handleChange('props.iconSet.gap', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ukuran Icon (px)</label>
              <input
                type="number"
                value={component.props.iconSet?.size || 24}
                onChange={(e) => handleChange('props.iconSet.size', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna</label>
              <input
                type="color"
                value={component.props.iconSet?.color || '#000000'}
                onChange={(e) => handleChange('props.iconSet.color', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Perataan</label>
              <select
                value={component.props.iconSet?.align || 'center'}
                onChange={(e) => handleChange('props.iconSet.align', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="left">Kiri</option>
                <option value="center">Tengah</option>
                <option value="right">Kanan</option>
              </select>
            </div>
          </div>
        );

      case 'iconButton':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Icon</label>
              <input
                type="text"
                value={component.props.iconButton?.name || ''}
                onChange={(e) => handleChange('props.iconButton.name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: FiHome, FiUser, dll"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ukuran Icon (px)</label>
              <input
                type="number"
                value={component.props.iconButton?.size || 24}
                onChange={(e) => handleChange('props.iconButton.size', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Icon</label>
              <input
                type="color"
                value={component.props.iconButton?.color || '#000000'}
                onChange={(e) => handleChange('props.iconButton.color', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Background</label>
              <input
                type="color"
                value={component.props.iconButton?.bgColor || '#ffffff'}
                onChange={(e) => handleChange('props.iconButton.bgColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Border</label>
              <input
                type="color"
                value={component.props.iconButton?.borderColor || '#e5e7eb'}
                onChange={(e) => handleChange('props.iconButton.borderColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius (px)</label>
              <input
                type="number"
                value={component.props.iconButton?.borderRadius || 8}
                onChange={(e) => handleChange('props.iconButton.borderRadius', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding (px)</label>
              <input
                type="number"
                value={component.props.iconButton?.padding || 12}
                onChange={(e) => handleChange('props.iconButton.padding', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Hover</label>
              <input
                type="color"
                value={component.props.iconButton?.hoverColor || '#f3f4f6'}
                onChange={(e) => handleChange('props.iconButton.hoverColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <input
                type="text"
                value={component.props.iconButton?.link || ''}
                onChange={(e) => handleChange('props.iconButton.link', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: /home, https://example.com"
              />
            </div>
          </div>
        );

      case 'iconLink':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Icon</label>
              <input
                type="text"
                value={component.props.iconLink?.name || ''}
                onChange={(e) => handleChange('props.iconLink.name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: FiHome, FiUser, dll"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teks Link</label>
              <input
                type="text"
                value={component.props.iconLink?.text || ''}
                onChange={(e) => handleChange('props.iconLink.text', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: Beranda, Profil"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL</label>
              <input
                type="text"
                value={component.props.iconLink?.url || ''}
                onChange={(e) => handleChange('props.iconLink.url', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Contoh: /home, https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ukuran Icon (px)</label>
              <input
                type="number"
                value={component.props.iconLink?.size || 20}
                onChange={(e) => handleChange('props.iconLink.size', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna</label>
              <input
                type="color"
                value={component.props.iconLink?.color || '#000000'}
                onChange={(e) => handleChange('props.iconLink.color', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jarak Icon & Teks (px)</label>
              <input
                type="number"
                value={component.props.iconLink?.spacing || 8}
                onChange={(e) => handleChange('props.iconLink.spacing', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Opsi</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.iconLink?.underline || false}
                  onChange={(e) => handleChange('props.iconLink.underline', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Garis Bawah</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.iconLink?.newTab || false}
                  onChange={(e) => handleChange('props.iconLink.newTab', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Buka di Tab Baru</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Hover</label>
              <input
                type="color"
                value={component.props.iconLink?.hoverColor || '#4a5568'}
                onChange={(e) => handleChange('props.iconLink.hoverColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Items</label>
              <textarea
                value={component.props.list?.items?.join('\n') || ''}
                onChange={(e) => handleChange('props.list.items', e.target.value.split('\n'))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={4}
                placeholder="Masukkan item, satu per baris"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipe List</label>
              <select
                value={component.props.list?.type || 'bullet'}
                onChange={(e) => handleChange('props.list.type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="bullet">Bullet</option>
                <option value="number">Number</option>
                <option value="roman">Roman</option>
                <option value="alpha">Alpha</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jarak Item (px)</label>
              <input
                type="number"
                value={component.props.list?.spacing || 8}
                onChange={(e) => handleChange('props.list.spacing', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ukuran Font</label>
              <input
                type="text"
                value={component.props.list?.fontSize || '16px'}
                onChange={(e) => handleChange('props.list.fontSize', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Teks</label>
              <input
                type="color"
                value={component.props.list?.color || '#000000'}
                onChange={(e) => handleChange('props.list.color', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Data Tabel</label>
              <textarea
                value={component.props.table?.rows?.map((row: string[]) => row.join(',')).join('\n') || ''}
                onChange={(e) => handleChange('props.table.rows', e.target.value.split('\n').map((row: string) => row.split(',')))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={4}
                placeholder="Masukkan data dengan format: kolom1,kolom2,kolom3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Header</label>
              <textarea
                value={component.props.table?.headers?.join(',') || ''}
                onChange={(e) => handleChange('props.table.headers', e.target.value.split(','))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Masukkan header dengan format: header1,header2,header3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jarak Antar Sel (px)</label>
              <input
                type="number"
                value={component.props.table?.cellPadding || 12}
                onChange={(e) => handleChange('props.table.cellPadding', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Border</label>
              <input
                type="color"
                value={component.props.table?.borderColor || '#e5e7eb'}
                onChange={(e) => handleChange('props.table.borderColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Header</label>
              <input
                type="color"
                value={component.props.table?.headerColor || '#f3f4f6'}
                onChange={(e) => handleChange('props.table.headerColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Teks Header</label>
              <input
                type="color"
                value={component.props.table?.headerTextColor || '#000000'}
                onChange={(e) => handleChange('props.table.headerTextColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Teks</label>
              <input
                type="color"
                value={component.props.table?.textColor || '#000000'}
                onChange={(e) => handleChange('props.table.textColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Striped Rows</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.table?.striped || false}
                  onChange={(e) => handleChange('props.table.striped', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Aktifkan Striped Rows</label>
              </div>
            </div>
            {component.props.table?.striped && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Warna Striped Rows</label>
                <input
                  type="color"
                  value={component.props.table?.stripedColor || '#f9fafb'}
                  onChange={(e) => handleChange('props.table.stripedColor', e.target.value)}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            )}
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Events</label>
              <textarea
                value={component.props.timeline?.items?.map((event: { title: string; date: string; description: string }) => `${event.title}|${event.date}|${event.description}`).join('\n') || ''}
                onChange={(e) => handleChange('props.timeline.items', e.target.value.split('\n').map((event: string) => {
                  const [title, date, description] = event.split('|');
                  return { title, date, description };
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={4}
                placeholder="Format: Judul|Tanggal|Deskripsi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Garis</label>
              <input
                type="color"
                value={component.props.timeline?.lineColor || '#e5e7eb'}
                onChange={(e) => handleChange('props.timeline.lineColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Dot</label>
              <input
                type="color"
                value={component.props.timeline?.dotColor || '#3b82f6'}
                onChange={(e) => handleChange('props.timeline.dotColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ukuran Dot (px)</label>
              <input
                type="number"
                value={component.props.timeline?.dotSize || 12}
                onChange={(e) => handleChange('props.timeline.dotSize', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jarak Event (px)</label>
              <input
                type="number"
                value={component.props.timeline?.spacing || 24}
                onChange={(e) => handleChange('props.timeline.spacing', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Teks</label>
              <input
                type="color"
                value={component.props.timeline?.textColor || '#000000'}
                onChange={(e) => handleChange('props.timeline.textColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Tanggal</label>
              <input
                type="color"
                value={component.props.timeline?.dateColor || '#6b7280'}
                onChange={(e) => handleChange('props.timeline.dateColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Judul</label>
              <input
                type="text"
                value={component.props.card?.title || ''}
                onChange={(e) => handleChange('props.card.title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Konten</label>
              <textarea
                value={component.props.card?.content || ''}
                onChange={(e) => handleChange('props.card.content', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gambar</label>
              <input
                type="text"
                value={component.props.card?.image || ''}
                onChange={(e) => handleChange('props.card.image', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="URL gambar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Background</label>
              <input
                type="color"
                value={component.props.card?.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('props.card.backgroundColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Border</label>
              <input
                type="color"
                value={component.props.card?.borderColor || '#e5e7eb'}
                onChange={(e) => handleChange('props.card.borderColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius (px)</label>
              <input
                type="number"
                value={component.props.card?.borderRadius || 8}
                onChange={(e) => handleChange('props.card.borderRadius', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding (px)</label>
              <input
                type="number"
                value={component.props.card?.padding || 16}
                onChange={(e) => handleChange('props.card.padding', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shadow</label>
              <select
                value={component.props.card?.shadow || 'none'}
                onChange={(e) => handleChange('props.card.shadow', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>
          </div>
        );

      case 'alert':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pesan</label>
              <textarea
                value={component.props.alert?.message || ''}
                onChange={(e) => handleChange('props.alert.message', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipe</label>
              <select
                value={component.props.alert?.type || 'info'}
                onChange={(e) => handleChange('props.alert.type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius (px)</label>
              <input
                type="number"
                value={component.props.alert?.borderRadius || 8}
                onChange={(e) => handleChange('props.alert.borderRadius', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding (px)</label>
              <input
                type="number"
                value={component.props.alert?.padding || 16}
                onChange={(e) => handleChange('props.alert.padding', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Opsi</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.alert?.dismissible || false}
                  onChange={(e) => handleChange('props.alert.dismissible', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Dapat Ditutup</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.alert?.showIcon || true}
                  onChange={(e) => handleChange('props.alert.showIcon', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Tampilkan Icon</label>
              </div>
            </div>
          </div>
        );

      case 'badge':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Teks</label>
              <input
                type="text"
                value={component.props.badge?.text || ''}
                onChange={(e) => handleChange('props.badge.text', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipe</label>
              <select
                value={component.props.badge?.type || 'primary'}
                onChange={(e) => handleChange('props.badge.type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="info">Info</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ukuran</label>
              <select
                value={component.props.badge?.size || 'md'}
                onChange={(e) => handleChange('props.badge.size', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius (px)</label>
              <input
                type="number"
                value={component.props.badge?.borderRadius || 4}
                onChange={(e) => handleChange('props.badge.borderRadius', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding (px)</label>
              <input
                type="number"
                value={component.props.badge?.padding || 8}
                onChange={(e) => handleChange('props.badge.padding', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Opsi</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.badge?.pill || false}
                  onChange={(e) => handleChange('props.badge.pill', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Pill Style</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.badge?.outline || false}
                  onChange={(e) => handleChange('props.badge.outline', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Outline Style</label>
              </div>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipe</label>
              <select
                value={component.props.divider?.type || 'solid'}
                onChange={(e) => handleChange('props.divider.type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna</label>
              <input
                type="color"
                value={component.props.divider?.color || '#e5e7eb'}
                onChange={(e) => handleChange('props.divider.color', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ketebalan (px)</label>
              <input
                type="number"
                value={component.props.divider?.thickness || 1}
                onChange={(e) => handleChange('props.divider.thickness', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Margin (px)</label>
              <input
                type="number"
                value={component.props.divider?.margin || 16}
                onChange={(e) => handleChange('props.divider.margin', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teks</label>
              <input
                type="text"
                value={component.props.divider?.text || ''}
                onChange={(e) => handleChange('props.divider.text', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Opsional: teks di tengah divider"
              />
            </div>
            {component.props.divider?.text && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Warna Teks</label>
                <input
                  type="color"
                  value={component.props.divider?.textColor || '#6b7280'}
                  onChange={(e) => handleChange('props.divider.textColor', e.target.value)}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            )}
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kode</label>
              <textarea
                value={component.props.code?.content || ''}
                onChange={(e) => handleChange('props.code.content', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bahasa</label>
              <select
                value={component.props.code?.language || 'plaintext'}
                onChange={(e) => handleChange('props.code.language', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="plaintext">Plain Text</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Background</label>
              <input
                type="color"
                value={component.props.code?.backgroundColor || '#1f2937'}
                onChange={(e) => handleChange('props.code.backgroundColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Teks</label>
              <input
                type="color"
                value={component.props.code?.textColor || '#f3f4f6'}
                onChange={(e) => handleChange('props.code.textColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius (px)</label>
              <input
                type="number"
                value={component.props.code?.borderRadius || 8}
                onChange={(e) => handleChange('props.code.borderRadius', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding (px)</label>
              <input
                type="number"
                value={component.props.code?.padding || 16}
                onChange={(e) => handleChange('props.code.padding', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Opsi</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.code?.showLineNumbers || false}
                  onChange={(e) => handleChange('props.code.showLineNumbers', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Tampilkan Nomor Baris</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.code?.copyable || false}
                  onChange={(e) => handleChange('props.code.copyable', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Dapat Disalin</label>
              </div>
            </div>
          </div>
        );

      case 'preformatted':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Konten</label>
              <textarea
                value={component.props.preformatted?.content || ''}
                onChange={(e) => handleChange('props.preformatted.content', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Background</label>
              <input
                type="color"
                value={component.props.preformatted?.backgroundColor || '#f3f4f6'}
                onChange={(e) => handleChange('props.preformatted.backgroundColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warna Teks</label>
              <input
                type="color"
                value={component.props.preformatted?.textColor || '#000000'}
                onChange={(e) => handleChange('props.preformatted.textColor', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Border Radius (px)</label>
              <input
                type="number"
                value={component.props.preformatted?.borderRadius || 8}
                onChange={(e) => handleChange('props.preformatted.borderRadius', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Padding (px)</label>
              <input
                type="number"
                value={component.props.preformatted?.padding || 16}
                onChange={(e) => handleChange('props.preformatted.padding', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Margin (px)</label>
              <input
                type="number"
                value={component.props.preformatted?.margin || 16}
                onChange={(e) => handleChange('props.preformatted.margin', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500">
            Properti untuk tipe komponen ini belum tersedia
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {renderPropertyEditor()}
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <span className="flex items-center">
            <FiX className="w-4 h-4 mr-2" />
            Cancel
          </span>
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="flex items-center">
            <FiSave className="w-4 h-4 mr-2" />
            Save Changes
          </span>
        </button>
      </div>
    </div>
  );
} 