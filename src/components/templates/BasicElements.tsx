import { TemplateComponent } from '@/types/template';

interface BasicElementProps {
  component: TemplateComponent;
}

export function TextElement({ component }: BasicElementProps) {
  const props = component.props.text;
  if (!props) return null;
  
  const { content, fontSize, fontWeight, color, alignment } = props;
  return (
    <p style={{ fontSize, fontWeight, color, textAlign: alignment }}>
      {content}
    </p>
  );
}

export function ButtonElement({ component }: BasicElementProps) {
  const props = component.props.button;
  if (!props) return null;
  
  const { text, variant, size, color } = props;
  const baseStyles = {
    padding: size === 'small' ? '0.5rem 1rem' : size === 'medium' ? '0.75rem 1.5rem' : '1rem 2rem',
    backgroundColor: variant === 'primary' ? color : 'transparent',
    color: variant === 'primary' ? 'white' : color,
    border: variant === 'outline' ? `2px solid ${color}` : 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  return (
    <button style={baseStyles}>
      {text}
    </button>
  );
}

export function ImageElement({ component }: BasicElementProps) {
  const props = component.props.image;
  if (!props) return null;
  
  const { src, alt, width, height } = props;
  return (
    <img 
      src={src || 'https://via.placeholder.com/300x200'} 
      alt={alt}
      style={{ width, height }}
    />
  );
}

export function ListElement({ component }: BasicElementProps) {
  const props = component.props.list;
  if (!props) return null;
  
  const { items, type } = props;
  return (
    <ul style={{ listStyleType: type === 'bullet' ? 'disc' : 'decimal' }}>
      {items.map((item: string, index: number) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function GridElement({ component }: BasicElementProps) {
  const props = component.props.grid;
  if (!props) return null;
  
  const { columns, gap, items } = props;
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap
    }}>
      {Array(columns * 2).fill(null).map((_, index) => (
        <div 
          key={index} 
          className="border p-4 min-h-[100px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const draggedData = e.dataTransfer.getData('text/plain');
            if (draggedData) {
              const draggedElement = JSON.parse(draggedData);
              // Handle drop event here
              console.log('Dropped element:', draggedElement);
            }
          }}
        >
          {items?.[index] && renderBasicElement(items[index])}
        </div>
      ))}
    </div>
  );
}

export function ContainerElement({ component }: BasicElementProps) {
  const props = component.props.container;
  if (!props) return null;
  
  const { width, padding, backgroundColor } = props;
  return (
    <div style={{ width, padding, backgroundColor }}>
      Container Content
    </div>
  );
}

export function CodeElement({ component }: BasicElementProps) {
  const props = component.props.code;
  if (!props) return null;
  
  const { content, language, theme } = props;
  return (
    <pre style={{ 
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
      padding: '1rem',
      borderRadius: '0.375rem',
      overflow: 'auto'
    }}>
      <code>{content}</code>
    </pre>
  );
}

export function renderBasicElement(component: TemplateComponent) {
  switch (component.type) {
    case 'text':
      return <TextElement component={component} />;
    case 'button':
      return <ButtonElement component={component} />;
    case 'image':
      return <ImageElement component={component} />;
    case 'list':
      return <ListElement component={component} />;
    case 'grid':
      return <GridElement component={component} />;
    case 'container':
      return <ContainerElement component={component} />;
    case 'code':
      return <CodeElement component={component} />;
    default:
      return null;
  }
} 