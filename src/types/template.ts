export interface ComponentProps {
  // Text Elements
  text?: {
    content: string;
    fontSize?: string;
    color?: string;
    alignment?: 'left' | 'center' | 'right';
  };
  heading?: {
    content: string;
    fontSize?: string;
    color?: string;
    alignment?: 'left' | 'center' | 'right';
    fontWeight?: string;
  };
  paragraph?: {
    content: string;
    fontSize?: string;
    color?: string;
    alignment?: 'left' | 'center' | 'right';
    lineHeight?: string;
  };
  quote?: {
    content: string;
    author?: string;
    fontSize?: string;
    color?: string;
    alignment?: 'left' | 'center' | 'right';
    style?: 'italic' | 'normal';
  };

  // Interactive Elements
  button?: {
    text: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    padding?: string;
  };
  link?: {
    text: string;
    url: string;
    color?: string;
    fontSize?: string;
    underline?: boolean;
  };
  form?: {
    fields: Array<{
      label: string;
      type: string;
      placeholder?: string;
      required?: boolean;
    }>;
    submitButton: {
      text: string;
      backgroundColor?: string;
      textColor?: string;
    };
  };

  // Media Elements
  image?: {
    src: string;
    alt?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    objectFit?: 'cover' | 'contain' | 'fill';
  };
  video?: {
    src: string;
    poster?: string;
    controls?: boolean;
    autoplay?: boolean;
    width?: string;
    height?: string;
  };
  icon?: {
    name: string;
    size?: string;
    color?: string;
  };

  // Layout Elements
  container?: {
    padding?: string;
    backgroundColor?: string;
    borderRadius?: string;
    border?: string;
    children?: TemplateComponent[];
  };
  grid?: {
    columns: number;
    gap?: string;
    padding?: string;
    backgroundColor?: string;
    children?: TemplateComponent[];
  };
  columns?: {
    count: number;
    gap?: string;
    padding?: string;
    backgroundColor?: string;
    children?: TemplateComponent[];
  };
  spacer?: {
    height?: string;
    backgroundColor?: string;
  };

  // Data Elements
  list?: {
    items: string[];
    fontSize?: string;
    color?: string;
    spacing?: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
    headerBackground?: string;
    cellPadding?: string;
    borderColor?: string;
  };
  timeline?: {
    items: Array<{
      title: string;
      date: string;
      description: string;
    }>;
    dotColor?: string;
    lineColor?: string;
  };

  // UI Elements
  card?: {
    title: string;
    content: string;
    image?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    padding?: string;
  };
  alert?: {
    message: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
  badge?: {
    text: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    padding?: string;
  };
  divider?: {
    color?: string;
    thickness?: string;
    style?: 'solid' | 'dashed' | 'dotted';
    margin?: string;
  };

  // Code Elements
  code?: {
    content: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    borderRadius?: string;
  };
  pre?: {
    content: string;
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
    fontFamily?: string;
  };

  // Hero Section
  hero?: {
    title: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    imageUrl?: string;
    backgroundType?: 'color' | 'image' | 'gradient';
    backgroundColor?: string;
    backgroundImage?: string;
    gradientStart?: string;
    gradientEnd?: string;
    gradientAngle?: string;
  };
}

export interface TemplateComponent {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  children?: TemplateComponent[];
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  components: TemplateComponent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateLayout {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  components: TemplateComponent[];
}

export interface ComponentEditor {
  id: string;
  name: string;
  description: string;
  components: TemplateComponent[];
  slug: string;
  props: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
} 