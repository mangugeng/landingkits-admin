export interface TemplateComponent {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  children?: TemplateComponent[];
}

export interface ComponentEditor {
  id: string;
  name: string;
  description: string;
  components: TemplateComponent[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
} 