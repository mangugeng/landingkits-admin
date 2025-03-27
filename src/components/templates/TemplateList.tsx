'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Template } from '@/types/template';
import { templateService } from '@/lib/firebase/templateService';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSave } from 'react-icons/fi';

interface TemplateListProps {
  category: string;
  onUpdate: () => void;
}

export default function TemplateList({ category, onUpdate }: TemplateListProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingComponent, setEditingComponent] = useState<Template['components'][0] | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [jsonEditor, setJsonEditor] = useState('');
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await templateService.getTemplates(category);
        setTemplates(data);
      } catch (err) {
        setError('Failed to fetch templates');
        console.error('Error fetching templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [category]);

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await templateService.deleteTemplate(templateId);
        onUpdate();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleNewComponent = (template: Template) => {
    setEditingTemplate(template);
    setJsonEditor(JSON.stringify({
      id: `component-${Date.now()}`,
      type: 'hero',
      props: {
        hero: {
          title: '',
          subtitle: '',
          description: '',
          buttonText: '',
          buttonLink: '',
          imageUrl: '',
          backgroundType: 'image'
        }
      },
      children: []
    }, null, 2));
    setShowJsonEditor(true);
  };

  const handleEditComponent = (template: Template, component: Template['components'][0]) => {
    setEditingTemplate(template);
    setEditingComponent(component);
    setJsonEditor(JSON.stringify(component, null, 2));
    setShowJsonEditor(true);
  };

  const handleDeleteComponent = async (template: Template, componentId: string) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        const updatedComponents = template.components.filter(c => c.id !== componentId);
        await templateService.updateTemplate(template.id, {
          components: updatedComponents
        });
        onUpdate();
      } catch (error) {
        console.error('Error deleting component:', error);
      }
    }
  };

  const handleSaveJson = async () => {
    if (!editingTemplate) return;

    try {
      let updatedComponents: Template['components'];
      
      if (editingComponent) {
        // Edit existing component
        const updatedComponent = JSON.parse(jsonEditor);
        updatedComponents = editingTemplate.components.map(c => 
          c.id === editingComponent.id ? updatedComponent : c
        );
      } else {
        // Add new component
        const newComponent = JSON.parse(jsonEditor);
        updatedComponents = [...editingTemplate.components, newComponent];
      }

      await templateService.updateTemplate(editingTemplate.id, {
        components: updatedComponents
      });

      onUpdate();
      setShowJsonEditor(false);
      setEditingComponent(null);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error saving component:', error);
      alert('Invalid JSON format');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No templates found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {templates.map((template) => (
        <div key={template.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-500">{template.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(template.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => handleNewComponent(template)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiPlus className="mr-1 h-4 w-4" />
                New Component
              </button>
            </div>

            {template.components.map((component) => (
              <div key={component.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {component.type.charAt(0).toUpperCase() + component.type.slice(1)} Component
                    </h4>
                    <p className="text-sm text-gray-500">ID: {component.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditComponent(template, component)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteComponent(template, component.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(component.props, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showJsonEditor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {editingComponent ? 'Edit Component' : 'New Component'}
                </h2>
                <button
                  onClick={() => setShowJsonEditor(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <textarea
                  value={jsonEditor}
                  onChange={(e) => setJsonEditor(e.target.value)}
                  rows={20}
                  className="w-full font-mono text-sm p-4 border rounded-md"
                  placeholder="Paste JSON here..."
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowJsonEditor(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveJson}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiSave className="-ml-1 mr-2 h-5 w-5" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 