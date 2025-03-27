'use client';

import { useDrop } from 'react-dnd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { TemplateComponent } from '@/types/template';

interface DropZoneProps {
  component?: TemplateComponent;
  onComponentClick: (component: TemplateComponent) => void;
  onDelete: (component: TemplateComponent) => void;
  onDrop?: (component: TemplateComponent) => void;
  isSelected?: boolean;
  onUpdate?: (component: TemplateComponent) => void;
}

interface DragItem {
  type: string;
  name: string;
  props: Record<string, any>;
}

export default function DropZone({ component, onComponentClick, onDelete, onDrop, isSelected, onUpdate }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: DragItem) => {
      if (onDrop) {
        const newComponent: TemplateComponent = {
          id: `${item.type}-${Date.now()}`,
          type: item.type,
          name: item.name,
          props: item.props
        };
        onDrop(newComponent);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleChange = (path: string, value: any) => {
    if (!component || !onUpdate) return;
    
    const updatedComponent = { ...component };
    const pathArray = path.split('.');
    let current: any = updatedComponent;
    
    // Navigate to the nested property
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }
    
    // Update the value
    current[pathArray[pathArray.length - 1]] = value;
    
    // Update the component
    onUpdate(updatedComponent);
  };

  const renderEmptyDropZone = () => (
    <div
      ref={drop as any}
      className={`flex items-center justify-center min-h-[100px] text-gray-400 border-2 border-dashed rounded-lg p-4 ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <div className="text-center">
        <div className="text-sm mb-1">Drag and drop komponen di sini</div>
        <div className="text-xs text-gray-400">Klik untuk menambahkan komponen</div>
      </div>
    </div>
  );

  if (!component) {
    return renderEmptyDropZone();
  }

  const renderComponent = () => {
    if (!component) return null;

    switch (component.type) {
      case 'text':
        return (
          <div
            style={{
              fontSize: component.props.text.fontSize,
              fontWeight: component.props.text.fontWeight,
              color: component.props.text.color,
              textAlign: component.props.text.alignment
            }}
          >
            {component.props.text.content}
          </div>
        );
      case 'heading':
        const HeadingTag = component.props.heading.level as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            style={{
              fontSize: component.props.heading.fontSize,
              fontWeight: component.props.heading.fontWeight,
              color: component.props.heading.color,
              textAlign: component.props.heading.alignment
            }}
          >
            {component.props.heading.content}
          </HeadingTag>
        );
      case 'paragraph':
        return (
          <p
            style={{
              fontSize: component.props.paragraph.fontSize,
              lineHeight: component.props.paragraph.lineHeight,
              color: component.props.paragraph.color,
              textAlign: component.props.paragraph.alignment
            }}
          >
            {component.props.paragraph.content}
          </p>
        );
      case 'quote':
        return (
          <blockquote
            style={{
              fontSize: component.props.quote.fontSize,
              color: component.props.quote.color,
              textAlign: component.props.quote.alignment,
              fontStyle: component.props.quote.style
            }}
          >
            <p>{component.props.quote.content}</p>
            <cite>{component.props.quote.author}</cite>
          </blockquote>
        );
      case 'button':
        return (
          <button
            style={{
              backgroundColor: component.props.button.backgroundColor,
              color: component.props.button.textColor,
              borderRadius: component.props.button.borderRadius,
              padding: component.props.button.padding
            }}
            onClick={() => window.open(component.props.button.link, '_blank')}
          >
            {component.props.button.text}
          </button>
        );
      case 'input':
        return (
          <input
            type={component.props.input.type}
            placeholder={component.props.input.placeholder}
            style={{
              borderColor: component.props.input.borderColor,
              borderRadius: component.props.input.borderRadius,
              padding: component.props.input.padding,
              width: component.props.input.width
            }}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={component.props.textarea.placeholder}
            rows={component.props.textarea.rows}
            style={{
              borderColor: component.props.textarea.borderColor,
              borderRadius: component.props.textarea.borderRadius,
              padding: component.props.textarea.padding,
              width: component.props.textarea.width
            }}
          />
        );
      case 'select':
        return (
          <select
            style={{
              borderColor: component.props.select.borderColor,
              borderRadius: component.props.select.borderRadius,
              padding: component.props.select.padding,
              width: component.props.select.width
            }}
          >
            <option value="">{component.props.select.placeholder}</option>
            {component.props.select.options.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'container':
        return (
          <div
            ref={drop as any}
            style={{
              padding: component.props.container?.padding || '0px',
              backgroundColor: component.props.container?.backgroundColor || '#ffffff',
              borderRadius: component.props.container?.borderRadius || '0px',
              border: component.props.container?.border || 'none',
              minHeight: '100px'
            }}
            className={`${isOver ? 'border-blue-500 bg-blue-50' : ''}`}
          >
            {component.props.container?.children?.map((child: TemplateComponent, index: number) => (
              <DropZone
                key={index}
                component={child}
                onComponentClick={onComponentClick}
                onDelete={onDelete}
                onDrop={(newComponent) => {
                  const updatedChildren = [...(component.props.container?.children || [])];
                  updatedChildren[index] = newComponent;
                  handleChange('props.container.children', updatedChildren);
                }}
              />
            ))}
            <DropZone
              component={undefined}
              onComponentClick={onComponentClick}
              onDelete={onDelete}
              onDrop={(newComponent) => {
                const updatedChildren = [...(component.props.container?.children || []), newComponent];
                handleChange('props.container.children', updatedChildren);
              }}
            />
          </div>
        );
      case 'grid':
        return (
          <div
            ref={drop as any}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${component.props.grid?.columns || 2}, 1fr)`,
              gap: component.props.grid?.gap || '16px',
              padding: component.props.grid?.padding || '0px',
              backgroundColor: component.props.grid?.backgroundColor || '#ffffff',
              minHeight: '100px'
            }}
            className={`${isOver ? 'border-blue-500 bg-blue-50' : ''}`}
          >
            {component.props.grid?.children?.map((child: TemplateComponent, index: number) => (
              <DropZone
                key={index}
                component={child}
                onComponentClick={onComponentClick}
                onDelete={onDelete}
                onDrop={(newComponent) => {
                  const updatedChildren = [...(component.props.grid?.children || [])];
                  updatedChildren[index] = newComponent;
                  handleChange('props.grid.children', updatedChildren);
                }}
              />
            ))}
            <DropZone
              component={undefined}
              onComponentClick={onComponentClick}
              onDelete={onDelete}
              onDrop={(newComponent) => {
                const updatedChildren = [...(component.props.grid?.children || []), newComponent];
                handleChange('props.grid.children', updatedChildren);
              }}
            />
          </div>
        );
      case 'columns':
        return (
          <div
            ref={drop as any}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${component.props.columns?.count || 2}, 1fr)`,
              gap: component.props.columns?.gap || '16px',
              padding: component.props.columns?.padding || '0px',
              backgroundColor: component.props.columns?.backgroundColor || '#ffffff',
              minHeight: '100px'
            }}
            className={`${isOver ? 'border-blue-500 bg-blue-50' : ''}`}
          >
            {component.props.columns?.children?.map((child: TemplateComponent, index: number) => (
              <DropZone
                key={index}
                component={child}
                onComponentClick={onComponentClick}
                onDelete={onDelete}
                onDrop={(newComponent) => {
                  const updatedChildren = [...(component.props.columns?.children || [])];
                  updatedChildren[index] = newComponent;
                  handleChange('props.columns.children', updatedChildren);
                }}
              />
            ))}
            <DropZone
              component={undefined}
              onComponentClick={onComponentClick}
              onDelete={onDelete}
              onDrop={(newComponent) => {
                const updatedChildren = [...(component.props.columns?.children || []), newComponent];
                handleChange('props.columns.children', updatedChildren);
              }}
            />
          </div>
        );
      case 'spacer':
        return (
          <div
            style={{
              height: component.props.spacer.height,
              backgroundColor: component.props.spacer.backgroundColor
            }}
          />
        );
      case 'list':
        return (
          <ul
            style={{
              fontSize: component.props.list.fontSize || '16px',
              color: component.props.list.color || '#000000',
            }}
          >
            {component.props.list.items.map((item: string, index: number) => (
              <li key={index} style={{ marginBottom: component.props.list.spacing || '8px' }}>
                {item}
              </li>
            ))}
          </ul>
        );
      case 'table':
        return (
          <table className="w-full">
            <thead>
              <tr>
                {component.props.table.headers.map((header: string, index: number) => (
                  <th
                    key={index}
                    style={{
                      backgroundColor: component.props.table.headerBackground || '#F3F4F6',
                      padding: component.props.table.cellPadding || '12px',
                      borderColor: component.props.table.borderColor || '#E5E7EB',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {component.props.table.rows.map((row: string[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: string, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      style={{
                        padding: component.props.table.cellPadding || '12px',
                        borderColor: component.props.table.borderColor || '#E5E7EB',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'timeline':
        return (
          <div className="relative">
            {component.props.timeline.items.map((item: any, index: number) => (
              <div key={index} className="relative pl-8 pb-8">
                <div
                  className="absolute left-0 top-0 w-4 h-4 rounded-full"
                  style={{ backgroundColor: component.props.timeline.dotColor || '#3B82F6' }}
                />
                <div className="absolute left-2 top-4 bottom-0 w-0.5" style={{ backgroundColor: component.props.timeline.lineColor || '#E5E7EB' }} />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <div className="text-sm text-gray-500">{item.date}</div>
                  <p className="mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'card':
        return (
          <div
            style={{
              backgroundColor: component.props.card.backgroundColor || '#FFFFFF',
              borderColor: component.props.card.borderColor || '#E5E7EB',
              borderRadius: component.props.card.borderRadius || '4px',
              padding: component.props.card.padding || '16px',
            }}
            className="border"
          >
            {component.props.card.image && (
              <img
                src={component.props.card.image}
                alt="Card Image"
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
            )}
            <h3 className="text-lg font-semibold mb-2">{component.props.card.title}</h3>
            <p>{component.props.card.content}</p>
          </div>
        );
      case 'alert':
        return (
          <div
            style={{
              backgroundColor: component.props.alert.backgroundColor || '#EFF6FF',
              color: component.props.alert.textColor || '#1E40AF',
              borderColor: component.props.alert.borderColor || '#BFDBFE',
            }}
            className="p-4 rounded-md border"
          >
            {component.props.alert.message}
          </div>
        );
      case 'badge':
        return (
          <span
            style={{
              backgroundColor: component.props.badge.backgroundColor || '#3B82F6',
              color: component.props.badge.textColor || '#FFFFFF',
              borderRadius: component.props.badge.borderRadius || '9999px',
              padding: component.props.badge.padding || '4px 8px',
            }}
          >
            {component.props.badge.text}
          </span>
        );
      case 'divider':
        return (
          <hr
            style={{
              borderColor: component.props.divider.color || '#E5E7EB',
              borderWidth: component.props.divider.thickness || '1px',
              borderStyle: component.props.divider.style || 'solid',
              margin: component.props.divider.margin || '16px 0',
            }}
          />
        );
      case 'code':
        return (
          <pre
            style={{
              backgroundColor: component.props.code.backgroundColor || '#1F2937',
              color: component.props.code.textColor || '#FFFFFF',
              padding: component.props.code.padding || '16px',
              borderRadius: component.props.code.borderRadius || '4px',
            }}
          >
            <code>{component.props.code.content}</code>
          </pre>
        );
      case 'pre':
        return (
          <pre
            style={{
              backgroundColor: component.props.pre.backgroundColor || '#F3F4F6',
              padding: component.props.pre.padding || '16px',
              borderRadius: component.props.pre.borderRadius || '4px',
              fontFamily: component.props.pre.fontFamily || 'monospace',
            }}
          >
            {component.props.pre.content}
          </pre>
        );
      case 'hero':
        return (
          <div
            className="relative min-h-[400px] flex items-center justify-center"
            style={{
              backgroundColor: component.props.backgroundType === 'color' 
                ? component.props.backgroundColor 
                : 'transparent',
              backgroundImage: component.props.backgroundType === 'image'
                ? `url(${component.props.backgroundImage})`
                : component.props.backgroundType === 'gradient'
                ? `linear-gradient(${component.props.gradientAngle}, ${component.props.gradientStart}, ${component.props.gradientEnd})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="container mx-auto px-4 py-8 text-center">
              <h1 className="text-4xl font-bold mb-4">
                {component.props.title || 'Hero Title'}
              </h1>
              <h2 className="text-2xl mb-4">
                {component.props.subtitle || 'Hero Subtitle'}
              </h2>
              <p className="text-lg mb-8">
                {component.props.description || 'Hero Description'}
              </p>
              {component.props.buttonText && (
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {component.props.buttonText}
                </button>
              )}
            </div>
            {component.props.imageUrl && (
              <div className="absolute inset-0 z-0">
                <img
                  src={component.props.imageUrl}
                  alt="Hero Image"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        );
      case 'video':
        return (
          <video
            src={component.props.video.src}
            poster={component.props.video.poster}
            controls={component.props.video.controls}
            autoPlay={component.props.video.autoplay}
            loop={component.props.video.loop}
            muted={component.props.video.muted}
            style={{
              width: component.props.video.width,
              height: component.props.video.height
            }}
          />
        );
      case 'audio':
        return (
          <audio
            src={component.props.audio.src}
            controls={component.props.audio.controls}
            autoPlay={component.props.audio.autoplay}
            loop={component.props.audio.loop}
            muted={component.props.audio.muted}
            preload={component.props.audio.preload}
          />
        );
      case 'svg':
        return (
          <svg
            width={component.props.svg.width}
            height={component.props.svg.height}
            viewBox={component.props.svg.viewBox}
            fill={component.props.svg.fill}
            stroke={component.props.svg.stroke}
            strokeWidth={component.props.svg.strokeWidth}
            strokeLinecap={component.props.svg.strokeLinecap}
            strokeLinejoin={component.props.svg.strokeLinejoin}
          >
            {/* SVG content will be added here */}
          </svg>
        );
      case 'animation':
        return (
          <div
            style={{
              animation: `${component.props.animation.type} ${component.props.animation.duration} ${component.props.animation.timing} ${component.props.animation.delay} ${component.props.animation.iteration} ${component.props.animation.direction}`
            }}
          >
            {/* Animation content will be added here */}
          </div>
        );
      case 'carousel':
        return (
          <div className="relative">
            {component.props.carousel.showArrows && (
              <>
                <button className="absolute left-0 top-1/2 transform -translate-y-1/2">←</button>
                <button className="absolute right-0 top-1/2 transform -translate-y-1/2">→</button>
              </>
            )}
            <div className="overflow-hidden">
              {component.props.carousel.items.map((item: any, index: number) => (
                <div key={index}>{item}</div>
              ))}
            </div>
            {component.props.carousel.showDots && (
              <div className="flex justify-center mt-2">
                {component.props.carousel.items.map((_: any, index: number) => (
                  <button key={index} className="w-2 h-2 mx-1 rounded-full bg-gray-300"></button>
                ))}
              </div>
            )}
          </div>
        );
      case 'gallery':
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${component.props.gallery.columns}, 1fr)`,
              gap: component.props.gallery.gap
            }}
          >
            {component.props.gallery.images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Gallery image ${index + 1}`}
                loading={component.props.gallery.lazyLoad ? 'lazy' : 'eager'}
                className="w-full h-auto"
              />
            ))}
          </div>
        );
      case 'map':
        return (
          <div className="w-full h-[400px] bg-gray-200">
            {/* Map implementation will be added here */}
            <div className="text-center text-gray-500">Map Component</div>
          </div>
        );
      case 'icon':
        return (
          <div
            style={{
              fontSize: component.props.icon.size,
              color: component.props.icon.color,
              strokeWidth: component.props.icon.strokeWidth,
              strokeLinecap: component.props.icon.strokeLinecap,
              strokeLinejoin: component.props.icon.strokeLinejoin,
              animation: component.props.icon.animation.type !== 'none' 
                ? `${component.props.icon.animation.type} ${component.props.icon.animation.duration} ${component.props.icon.animation.delay} ${component.props.icon.animation.iteration}`
                : 'none'
            }}
          >
            {/* Icon content will be added here */}
          </div>
        );
      case 'iconSet':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: component.props.iconSet.layout === 'horizontal' ? 'row' : 'column',
              gap: component.props.iconSet.spacing,
              alignItems: component.props.iconSet.alignment
            }}
          >
            {component.props.iconSet.icons.map((icon: any, index: number) => (
              <div
                key={index}
                style={{
                  fontSize: icon.size,
                  color: icon.color
                }}
              >
                {/* Icon content will be added here */}
              </div>
            ))}
          </div>
        );
      case 'iconButton':
        return (
          <button
            style={{
              backgroundColor: component.props.iconButton.backgroundColor,
              borderColor: component.props.iconButton.borderColor,
              borderRadius: component.props.iconButton.borderRadius,
              padding: component.props.iconButton.padding
            }}
            className="hover:bg-gray-100 transition-colors"
            onClick={() => window.open(component.props.iconButton.onClick, '_blank')}
          >
            <div
              style={{
                fontSize: component.props.iconButton.icon.size,
                color: component.props.iconButton.icon.color
              }}
            >
              {/* Icon content will be added here */}
            </div>
          </button>
        );
      case 'iconLink':
        return (
          <a
            href={component.props.iconLink.href}
            style={{
              color: component.props.iconLink.icon.color,
              textDecoration: component.props.iconLink.underline ? 'underline' : 'none'
            }}
            className="hover:text-blue-600 transition-colors"
          >
            <div
              style={{
                fontSize: component.props.iconLink.icon.size,
                color: component.props.iconLink.icon.color
              }}
            >
              {/* Icon content will be added here */}
            </div>
            <span>{component.props.iconLink.text}</span>
          </a>
        );
      case 'image':
        return (
          <img
            src={component.props.image.src}
            alt={component.props.image.alt}
            style={{
              width: component.props.image.width,
              height: component.props.image.height,
              borderRadius: component.props.image.borderRadius,
              objectFit: component.props.image.objectFit
            }}
          />
        );
      default:
        return <div>Unsupported component type: {component.type}</div>;
    }
  };

  return (
    <div
      ref={drop as any}
      className={`relative group min-h-[100px] border-2 border-dashed rounded-lg p-4 ${
        isOver ? 'border-blue-500 bg-blue-50' : isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onClick={() => onComponentClick(component)}
    >
      <div className="absolute top-2 right-2 hidden group-hover:flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComponentClick(component);
          }}
          className="p-1 bg-white rounded-md shadow-sm hover:bg-gray-50"
        >
          <FiEdit2 className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(component);
          }}
          className="p-1 bg-white rounded-md shadow-sm hover:bg-gray-50"
        >
          <FiTrash2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="min-h-[50px]">
        {renderComponent()}
      </div>
    </div>
  );
} 