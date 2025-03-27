'use client';

import { useState, useEffect } from 'react';
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  FiType, 
  FiSquare, 
  FiCircle, 
  FiImage, 
  FiList, 
  FiGrid, 
  FiLayout, 
  FiCode, 
  FiX, 
  FiSave, 
  FiChevronDown, 
  FiBox, 
  FiMaximize, 
  FiAlignLeft, 
  FiEdit, 
  FiMusic, 
  FiHexagon, 
  FiActivity, 
  FiSliders, 
  FiMap, 
  FiLink, 
  FiClock, 
  FiCreditCard, 
  FiAlertCircle, 
  FiTag, 
  FiMinus, 
  FiTerminal 
} from 'react-icons/fi';
import { TemplateComponent } from '@/types/component';
import type { ComponentEditor as ComponentEditorType } from '@/types/template';
import DropZone from './DropZone';
import ComponentProperties from './ComponentProperties';
import { componentEditorService } from '@/lib/firebase/componentEditorService';

interface ComponentEditorProps {
  component: ComponentEditorType;
  onSave: (component: ComponentEditorType) => void;
  onCancel: () => void;
}

const basicElements = [
  // Layout Elements
  {
    type: 'container',
    name: 'Container',
    props: {
      container: {
        padding: '16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid #E5E7EB'
      }
    }
  },
  {
    type: 'grid',
    name: 'Grid',
    props: {
      grid: {
        columns: 2,
        gap: '16px',
        children: [],
        padding: '16px',
        backgroundColor: '#FFFFFF'
      }
    }
  },
  {
    type: 'columns',
    name: 'Columns',
    props: {
      columns: {
        count: 2,
        gap: '16px',
        children: [],
        padding: '16px',
        backgroundColor: '#FFFFFF'
      }
    }
  },
  {
    type: 'spacer',
    name: 'Spacer',
    props: {
      spacer: {
        height: '32px',
        backgroundColor: 'transparent'
      }
    }
  },
  // Text Elements
  {
    type: 'text',
    name: 'Text',
    props: {
      text: {
        content: 'Text content',
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#000000',
        alignment: 'left'
      }
    }
  },
  {
    type: 'heading',
    name: 'Heading',
    props: {
      heading: {
        content: 'Heading content',
        level: 'h1',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#000000',
        alignment: 'left'
      }
    }
  },
  {
    type: 'paragraph',
    name: 'Paragraph',
    props: {
      paragraph: {
        content: 'Paragraph content',
        fontSize: '16px',
        lineHeight: '1.5',
        color: '#000000',
        alignment: 'left'
      }
    }
  },
  {
    type: 'quote',
    name: 'Quote',
    props: {
      quote: {
        content: 'Quote content',
        author: 'Author name',
        fontSize: '16px',
        color: '#000000',
        alignment: 'left',
        style: 'italic'
      }
    }
  },
  // Interactive Elements
  {
    type: 'button',
    name: 'Button',
    props: {
      button: {
        text: 'Click me',
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        borderRadius: '4px',
        padding: '8px 16px',
        link: '#'
      }
    }
  },
  {
    type: 'input',
    name: 'Input',
    props: {
      input: {
        placeholder: 'Enter text...',
        type: 'text',
        borderColor: '#E5E7EB',
        borderRadius: '4px',
        padding: '8px 12px',
        width: '100%'
      }
    }
  },
  {
    type: 'textarea',
    name: 'Textarea',
    props: {
      textarea: {
        placeholder: 'Enter long text...',
        rows: 4,
        borderColor: '#E5E7EB',
        borderRadius: '4px',
        padding: '8px 12px',
        width: '100%'
      }
    }
  },
  {
    type: 'select',
    name: 'Select',
    props: {
      select: {
        options: ['Option 1', 'Option 2', 'Option 3'],
        placeholder: 'Select an option',
        borderColor: '#E5E7EB',
        borderRadius: '4px',
        padding: '8px 12px',
        width: '100%'
      }
    }
  },
  // Media Elements
  {
    type: 'image',
    name: 'Image',
    props: {
      image: {
        src: '',
        alt: 'Image description',
        width: '100%',
        height: 'auto',
        borderRadius: '4px',
        objectFit: 'cover'
      }
    }
  },
  {
    type: 'icon',
    name: 'Icon',
    props: {
      icon: {
        name: 'star',
        size: '24px',
        color: '#000000',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        animation: {
          type: 'none',
          duration: '1s',
          delay: '0s',
          iteration: 'infinite'
        }
      }
    }
  },
  {
    type: 'iconSet',
    name: 'Icon Set',
    props: {
      iconSet: {
        icons: [
          {
            name: 'star',
            size: '24px',
            color: '#000000'
          },
          {
            name: 'heart',
            size: '24px',
            color: '#000000'
          }
        ],
        layout: 'horizontal',
        spacing: '16px',
        alignment: 'center'
      }
    }
  },
  {
    type: 'iconButton',
    name: 'Icon Button',
    props: {
      iconButton: {
        icon: {
          name: 'star',
          size: '24px',
          color: '#000000'
        },
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        borderRadius: '50%',
        padding: '8px',
        hoverColor: '#F3F4F6',
        onClick: ''
      }
    }
  },
  {
    type: 'iconLink',
    name: 'Icon Link',
    props: {
      iconLink: {
        icon: {
          name: 'star',
          size: '24px',
          color: '#3B82F6'
        },
        text: 'Link Text',
        href: '#',
        underline: false,
        hoverColor: '#2563EB'
      }
    }
  },
  {
    type: 'video',
    name: 'Video',
    props: {
      video: {
        src: '',
        poster: '',
        width: '100%',
        height: 'auto',
        controls: true,
        autoplay: false,
        loop: false,
        muted: false
      }
    }
  },
  {
    type: 'audio',
    name: 'Audio',
    props: {
      audio: {
        src: '',
        controls: true,
        autoplay: false,
        loop: false,
        muted: false,
        preload: 'metadata'
      }
    }
  },
  {
    type: 'svg',
    name: 'SVG',
    props: {
      svg: {
        width: '100%',
        height: 'auto',
        viewBox: '0 0 24 24',
        fill: 'currentColor',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }
    }
  },
  {
    type: 'animation',
    name: 'Animation',
    props: {
      animation: {
        type: 'fade',
        duration: '1s',
        delay: '0s',
        iteration: 'infinite',
        direction: 'alternate',
        timing: 'ease-in-out'
      }
    }
  },
  {
    type: 'carousel',
    name: 'Carousel',
    props: {
      carousel: {
        items: [],
        autoplay: true,
        interval: 5000,
        showArrows: true,
        showDots: true,
        infinite: true
      }
    }
  },
  {
    type: 'gallery',
    name: 'Gallery',
    props: {
      gallery: {
        images: [],
        columns: 3,
        gap: '16px',
        lightbox: true,
        lazyLoad: true
      }
    }
  },
  {
    type: 'map',
    name: 'Map',
    props: {
      map: {
        type: 'google',
        center: { lat: 0, lng: 0 },
        zoom: 13,
        markers: [],
        controls: true,
        style: 'default'
      }
    }
  },
  // Data Elements
  {
    type: 'list',
    name: 'List',
    props: {
      list: {
        items: ['Item 1', 'Item 2', 'Item 3'],
        fontSize: '16px',
        color: '#000000',
        spacing: '8px'
      }
    }
  },
  {
    type: 'table',
    name: 'Table',
    props: {
      table: {
        headers: ['Header 1', 'Header 2', 'Header 3'],
        rows: [
          ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
          ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
        ],
        headerBackground: '#F3F4F6',
        cellPadding: '12px',
        borderColor: '#E5E7EB'
      }
    }
  },
  {
    type: 'timeline',
    name: 'Timeline',
    props: {
      timeline: {
        items: [
          {
            title: 'Event 1',
            date: '2024-01-01',
            description: 'Description of event 1'
          },
          {
            title: 'Event 2',
            date: '2024-02-01',
            description: 'Description of event 2'
          }
        ],
        dotColor: '#3B82F6',
        lineColor: '#E5E7EB'
      }
    }
  },
  // UI Elements
  {
    type: 'card',
    name: 'Card',
    props: {
      card: {
        title: 'Card Title',
        content: 'Card content goes here',
        image: '',
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        borderRadius: '4px',
        padding: '16px'
      }
    }
  },
  {
    type: 'alert',
    name: 'Alert',
    props: {
      alert: {
        message: 'This is an alert message',
        backgroundColor: '#EFF6FF',
        textColor: '#1E40AF',
        borderColor: '#BFDBFE'
      }
    }
  },
  {
    type: 'badge',
    name: 'Badge',
    props: {
      badge: {
        text: 'New',
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        borderRadius: '9999px',
        padding: '4px 8px'
      }
    }
  },
  {
    type: 'divider',
    name: 'Divider',
    props: {
      divider: {
        color: '#E5E7EB',
        thickness: '1px',
        style: 'solid',
        margin: '16px 0'
      }
    }
  },
  // Code Elements
  {
    type: 'code',
    name: 'Code',
    props: {
      code: {
        content: 'const example = "Hello World";',
        backgroundColor: '#1F2937',
        textColor: '#FFFFFF',
        padding: '16px',
        borderRadius: '4px'
      }
    }
  },
  {
    type: 'pre',
    name: 'Preformatted Text',
    props: {
      pre: {
        content: 'This is preformatted text',
        backgroundColor: '#F3F4F6',
        padding: '16px',
        borderRadius: '4px',
        fontFamily: 'monospace'
      }
    }
  }
];

const DraggableElement = ({ element }: { element: any }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: {
      type: element.type,
      name: element.name,
      props: element.props
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Fungsi untuk mendapatkan ikon berdasarkan tipe komponen
  const getIcon = (type: string) => {
    switch (type) {
      // Layout Elements
      case 'container':
        return <FiBox className="w-5 h-5" />;
      case 'grid':
        return <FiGrid className="w-5 h-5" />;
      case 'columns':
        return <FiLayout className="w-5 h-5" />;
      case 'spacer':
        return <FiMaximize className="w-5 h-5" />;

      // Text Elements
      case 'text':
        return <FiType className="w-5 h-5" />;
      case 'heading':
        return <FiType className="w-5 h-5" />;
      case 'paragraph':
        return <FiAlignLeft className="w-5 h-5" />;
      case 'quote':
        return <FiType className="w-5 h-5" />;

      // Interactive Elements
      case 'button':
        return <FiSquare className="w-5 h-5" />;
      case 'input':
        return <FiEdit className="w-5 h-5" />;
      case 'textarea':
        return <FiEdit className="w-5 h-5" />;
      case 'select':
        return <FiList className="w-5 h-5" />;

      // Media Elements
      case 'image':
        return <FiImage className="w-5 h-5" />;
      case 'video':
        return <FiImage className="w-5 h-5" />;
      case 'audio':
        return <FiMusic className="w-5 h-5" />;
      case 'svg':
        return <FiHexagon className="w-5 h-5" />;
      case 'animation':
        return <FiActivity className="w-5 h-5" />;
      case 'carousel':
        return <FiSliders className="w-5 h-5" />;
      case 'gallery':
        return <FiGrid className="w-5 h-5" />;
      case 'map':
        return <FiMap className="w-5 h-5" />;

      // Icon Elements
      case 'icon':
        return <FiCircle className="w-5 h-5" />;
      case 'iconSet':
        return <FiGrid className="w-5 h-5" />;
      case 'iconButton':
        return <FiSquare className="w-5 h-5" />;
      case 'iconLink':
        return <FiLink className="w-5 h-5" />;

      // Data Elements
      case 'list':
        return <FiList className="w-5 h-5" />;
      case 'table':
        return <FiGrid className="w-5 h-5" />;
      case 'timeline':
        return <FiClock className="w-5 h-5" />;

      // UI Elements
      case 'card':
        return <FiCreditCard className="w-5 h-5" />;
      case 'alert':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'badge':
        return <FiTag className="w-5 h-5" />;
      case 'divider':
        return <FiMinus className="w-5 h-5" />;

      // Code Elements
      case 'code':
        return <FiCode className="w-5 h-5" />;
      case 'pre':
        return <FiTerminal className="w-5 h-5" />;

      // Hero Section
      case 'hero':
        return <FiLayout className="w-5 h-5" />;

      default:
        return <FiCircle className="w-5 h-5" />;
    }
  };

  return (
    <div
      ref={drag as any}
      className={`flex items-center p-2 border rounded-md cursor-move hover:bg-gray-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {getIcon(element.type)}
      <span className="text-sm text-gray-700 ml-2">{element.name}</span>
    </div>
  );
};

export default function ComponentEditor({ component, onSave, onCancel }: ComponentEditorProps) {
  const [selectedComponent, setSelectedComponent] = useState<TemplateComponent | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [components, setComponents] = useState<TemplateComponent[]>(component.components || []);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    layout: true,
    text: false,
    interactive: false,
    media: false,
    advanced: false
  });

  useEffect(() => {
    // Load components when component prop changes
    setComponents(component.components || []);
  }, [component]);

  const handleDragStart = (element: {
    id: string;
    name: string;
    icon: any;
    type: string;
    props: Record<string, any>;
  }) => {
    const newComponent: TemplateComponent = {
      id: `${element.type}-${Date.now()}`,
      type: element.type,
      name: element.name,
      props: element.props
    };
    setSelectedComponent(newComponent);
  };

  const handleComponentClick = (component: TemplateComponent) => {
    setSelectedComponent(component);
  };

  const handleSaveComponent = (updatedComponent: TemplateComponent) => {
    setComponents(prev =>
      prev.map(comp =>
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    );
  };

  const handleDeleteComponent = (component: TemplateComponent) => {
    const updatedComponents = components.filter(c => c.id !== component.id);
    setComponents(updatedComponents);
  };

  const handleUpdateComponent = (updatedComponent: TemplateComponent) => {
    const updatedComponents = components.map(c => 
      c.id === updatedComponent.id ? updatedComponent : c
    );
    setComponents(updatedComponents);
  };

  const handleDrop = (item: TemplateComponent) => {
    setComponents([...components, item]);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Pastikan komponen yang akan disimpan memiliki struktur yang benar
      const componentToSave: ComponentEditorType = {
        id: component.id || crypto.randomUUID(),
        name: component.name || 'New Component',
        description: component.description || '',
        slug: component.slug || 'new-component',
        components: components,
        createdAt: component.createdAt || new Date(),
        updatedAt: new Date()
      };

      // Simpan komponen berdasarkan slug
      if (component.slug) {
        // Cek apakah komponen dengan slug tersebut sudah ada
        const existingComponent = await componentEditorService.getComponentBySlug(component.slug);
        
        if (existingComponent) {
          // Update komponen yang sudah ada
          await componentEditorService.updateComponentEditor(existingComponent.id, {
            ...componentToSave,
            createdAt: existingComponent.createdAt // Pertahankan tanggal pembuatan asli
          });
        } else {
          // Buat komponen baru
          await componentEditorService.createComponentEditor(componentToSave);
        }
      } else {
        // Buat komponen baru jika belum ada slug
        await componentEditorService.createComponentEditor(componentToSave);
      }

      // Panggil callback onSave
      await onSave(componentToSave);
    } catch (err) {
      console.error('Error saving component:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newState = Object.keys(prev).reduce((acc, key) => ({
        ...acc,
        [key]: key === groupName ? !prev[key] : false
      }), {});
      return newState;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Component Editor</h2>
            <div className="flex space-x-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <FiSave className="w-4 h-4 mr-2" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FiSave className="w-4 h-4 mr-2" />
                    Save Component
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Sidebar - Basic Elements */}
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Elements</h2>
              <div className="space-y-4">
                {/* Layout Group */}
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleGroup('layout')}
                  >
                    <h3 className="font-medium">Layout</h3>
                    <FiChevronDown className={`transform transition-transform duration-200 ${expandedGroups.layout ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`transition-all duration-200 ease-in-out ${expandedGroups.layout ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 space-y-2">
                      {basicElements
                        .filter(el => ['container', 'grid', 'columns', 'spacer'].includes(el.type))
                        .map((el) => (
                          <DraggableElement key={el.type} element={el} />
                        ))}
                    </div>
                  </div>
                </div>

                {/* Text Group */}
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleGroup('text')}
                  >
                    <h3 className="font-medium">Text</h3>
                    <FiChevronDown className={`transform transition-transform duration-200 ${expandedGroups.text ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`transition-all duration-200 ease-in-out ${expandedGroups.text ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 space-y-2">
                      {basicElements
                        .filter(el => ['text', 'heading', 'paragraph', 'quote'].includes(el.type))
                        .map((el) => (
                          <DraggableElement key={el.type} element={el} />
                        ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Group */}
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleGroup('interactive')}
                  >
                    <h3 className="font-medium">Interactive</h3>
                    <FiChevronDown className={`transform transition-transform duration-200 ${expandedGroups.interactive ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`transition-all duration-200 ease-in-out ${expandedGroups.interactive ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 space-y-2">
                      {basicElements
                        .filter(el => ['button', 'input', 'textarea', 'select'].includes(el.type))
                        .map((el) => (
                          <DraggableElement key={el.type} element={el} />
                        ))}
                    </div>
                  </div>
                </div>

                {/* Media Group */}
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleGroup('media')}
                  >
                    <h3 className="font-medium">Media</h3>
                    <FiChevronDown className={`transform transition-transform duration-200 ${expandedGroups.media ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`transition-all duration-200 ease-in-out ${expandedGroups.media ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 space-y-2">
                      {basicElements
                        .filter(el => ['image', 'video', 'audio', 'svg', 'animation', 'carousel', 'gallery', 'map', 'icon', 'iconSet', 'iconButton', 'iconLink'].includes(el.type))
                        .map((el) => (
                          <DraggableElement key={el.type} element={el} />
                        ))}
                    </div>
                  </div>
                </div>

                {/* Advanced Group */}
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleGroup('advanced')}
                  >
                    <h3 className="font-medium">Advanced</h3>
                    <FiChevronDown className={`transform transition-transform duration-200 ${expandedGroups.advanced ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`transition-all duration-200 ease-in-out ${expandedGroups.advanced ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 space-y-2">
                      {basicElements
                        .filter(el => ['list', 'table', 'timeline', 'card', 'alert', 'badge', 'divider', 'code', 'pre', 'hero'].includes(el.type))
                        .map((el) => (
                          <DraggableElement key={el.type} element={el} />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Preview */}
          <div className="flex-1 bg-gray-100 overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      previewMode === 'desktop'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      previewMode === 'mobile'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>
              <div
                className={`bg-white rounded-lg shadow-lg mx-auto ${
                  previewMode === 'mobile' ? 'w-[375px]' : 'w-full'
                }`}
              >
                <div className="p-4">
                  <div className="space-y-4">
                    {components.length === 0 ? (
                      <DropZone
                        component={undefined}
                        onComponentClick={handleComponentClick}
                        onDelete={handleDeleteComponent}
                        onDrop={handleDrop}
                        onUpdate={handleUpdateComponent}
                      />
                    ) : (
                      components.map((comp) => (
                        <DropZone
                          key={comp.id}
                          component={comp}
                          onComponentClick={handleComponentClick}
                          onDelete={handleDeleteComponent}
                          onDrop={handleDrop}
                          onUpdate={handleUpdateComponent}
                          isSelected={selectedComponent?.id === comp.id}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            {selectedComponent ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    Edit {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)}
                  </h3>
                  <button
                    onClick={() => setSelectedComponent(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <ComponentProperties
                  component={selectedComponent}
                  onSave={handleSaveComponent}
                  onCancel={() => setSelectedComponent(null)}
                />
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Pilih komponen untuk mengedit propertinya
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 