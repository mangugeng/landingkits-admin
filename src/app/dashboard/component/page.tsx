'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiEye, FiSearch, FiFilter } from 'react-icons/fi';
import type { ComponentEditor, TemplateComponent } from '@/types/template';
import { componentEditorService } from '@/lib/firebase/componentEditorService';
import DropZone from '@/components/templates/DropZone';
import PreviewComponent from '@/components/templates/PreviewComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ComponentListPage() {
  const router = useRouter();
  const [components, setComponents] = useState<ComponentEditor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewComponent, setPreviewComponent] = useState<ComponentEditor | null>(null);
  const [newComponent, setNewComponent] = useState({
    name: '',
    slug: '',
    description: ''
  });

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    try {
      const data = await componentEditorService.getAllComponents();
      setComponents(data);
    } catch (err) {
      console.error('Error loading components:', err);
      setError('Gagal memuat komponen');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setShowCreateDialog(true);
  };

  const handleCreateClose = () => {
    setShowCreateDialog(false);
    setNewComponent({ name: '', slug: '', description: '' });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generate slug dari nama
      const slug = newComponent.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const component = await componentEditorService.createComponentEditor({
        name: newComponent.name,
        slug: slug,
        description: newComponent.description,
        props: {},
        components: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      handleCreateClose();
      router.push(`/dashboard/component/${slug}/edit`);
    } catch (err) {
      console.error('Error creating component:', err);
      setError('Gagal membuat komponen');
    }
  };

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/component/${slug}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus komponen ini?')) {
      try {
        await componentEditorService.deleteComponent(id);
        loadComponents();
      } catch (err) {
        console.error('Error deleting component:', err);
        setError('Gagal menghapus komponen');
      }
    }
  };

  const handlePreview = (component: ComponentEditor) => {
    setPreviewComponent(component);
    setShowPreviewDialog(true);
  };

  const handlePreviewClose = () => {
    setShowPreviewDialog(false);
    setPreviewComponent(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Komponen Template</h1>
          <p className="text-gray-500">Kelola komponen template untuk landing page</p>
        </div>
        <Button onClick={handleCreateClick}>
          <FiPlus className="mr-2" />
          Tambah Komponen
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari komponen..."
              className="pl-10"
            />
          </div>
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <FiFilter className="mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="text">Teks</SelectItem>
            <SelectItem value="button">Tombol</SelectItem>
            <SelectItem value="image">Gambar</SelectItem>
            <SelectItem value="hero">Hero</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <Card key={component.id}>
            <CardHeader>
              <div>
                <CardTitle className="text-lg">{component.name}</CardTitle>
                <CardDescription>{component.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                {component.components && component.components.length > 0 ? (
                  component.components.map((comp, index) => {
                    // Cek apakah komponen memiliki gambar
                    const imageUrl = comp.props.imageUrl || comp.props.backgroundImage || comp.props.src;
                    if (imageUrl) {
                      return (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={comp.props.alt || 'Preview'}
                          className="w-full h-full object-cover"
                        />
                      );
                    }
                    return null;
                  })
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Tidak ada preview
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Komponen: {component.components?.length || 0}</span>
                </div>
                <div className="flex gap-2 justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FiEye className="mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Preview Komponen</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        {component.components && component.components.length > 0 ? (
                          component.components.map((comp, index) => {
                            // Cek apakah komponen memiliki gambar
                            const imageUrl = comp.props.imageUrl || comp.props.backgroundImage || comp.props.src;
                            if (imageUrl) {
                              return (
                                <div 
                                  key={index} 
                                  className="relative rounded-lg overflow-hidden mb-4" 
                                  style={{ 
                                    minHeight: '200px',
                                    background: comp.props.backgroundType === 'color' ? comp.props.backgroundColor :
                                              comp.props.backgroundType === 'gradient' ? `linear-gradient(${comp.props.gradientAngle || '0deg'}, ${comp.props.gradientStart}, ${comp.props.gradientEnd})` :
                                              'transparent'
                                  }}
                                >
                                  <img 
                                    src={imageUrl} 
                                    alt={comp.props.alt || 'Preview'} 
                                    className="max-w-full h-auto rounded-lg" 
                                    style={{ 
                                      maxHeight: '400px', 
                                      objectFit: 'cover',
                                      width: comp.props.width || '100%',
                                      height: comp.props.height || 'auto'
                                    }}
                                  />
                                </div>
                              );
                            }
                            // Tampilkan konten teks jika ada
                            if (comp.props.content || comp.props.text) {
                              return (
                                <div 
                                  key={index} 
                                  className="p-4 rounded-lg border mb-4"
                                  style={{
                                    background: comp.props.backgroundType === 'color' ? comp.props.backgroundColor :
                                              comp.props.backgroundType === 'gradient' ? `linear-gradient(${comp.props.gradientAngle || '0deg'}, ${comp.props.gradientStart}, ${comp.props.gradientEnd})` :
                                              'white',
                                    textAlign: comp.props.alignment || 'left',
                                    color: comp.props.color || 'inherit',
                                    fontSize: comp.props.fontSize || 'inherit'
                                  }}
                                >
                                  <div className="prose max-w-none">
                                    {comp.props.content || comp.props.text}
                                  </div>
                                </div>
                              );
                            }
                            // Tampilkan judul dan deskripsi jika ada
                            if (comp.props.title || comp.props.description) {
                              return (
                                <div 
                                  key={index} 
                                  className="p-4 rounded-lg border mb-4"
                                  style={{
                                    background: comp.props.backgroundType === 'color' ? comp.props.backgroundColor :
                                              comp.props.backgroundType === 'gradient' ? `linear-gradient(${comp.props.gradientAngle || '0deg'}, ${comp.props.gradientStart}, ${comp.props.gradientEnd})` :
                                              'white'
                                  }}
                                >
                                  {comp.props.title && (
                                    <h3 
                                      className="font-semibold mb-2"
                                      style={{
                                        color: comp.props.color || 'inherit',
                                        fontSize: comp.props.fontSize || '1.25rem',
                                        textAlign: comp.props.alignment || 'left'
                                      }}
                                    >
                                      {comp.props.title}
                                    </h3>
                                  )}
                                  {comp.props.description && (
                                    <p 
                                      style={{
                                        color: comp.props.color || '#4B5563',
                                        fontSize: comp.props.fontSize || '1rem',
                                        textAlign: comp.props.alignment || 'left'
                                      }}
                                    >
                                      {comp.props.description}
                                    </p>
                                  )}
                                </div>
                              );
                            }
                            // Tampilkan komponen default jika tidak ada konten spesifik
                            return (
                              <div key={index} className="mb-4 last:mb-0">
                                <PreviewComponent component={comp} />
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            Tidak ada komponen untuk ditampilkan
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(component.slug)}
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(component.id)}
                  >
                    <FiTrash2 className="mr-2" />
                    Hapus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog Create Component */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Buat Komponen Baru</h2>
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
                  Nama Komponen
                </label>
                <input
                  type="text"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
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
                  value={newComponent.name
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
                  value={newComponent.description}
                  onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
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

      {/* Dialog Preview Component */}
      {showPreviewDialog && previewComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Preview: {previewComponent.name}</h2>
              <button
                onClick={handlePreviewClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              {previewComponent.components?.map((component: TemplateComponent, index: number) => (
                <PreviewComponent key={component.id || index} component={component} />
              ))}
              {(!previewComponent.components || previewComponent.components.length === 0) && (
                <div className="text-gray-500 text-center py-4">
                  Tidak ada komponen untuk ditampilkan
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 