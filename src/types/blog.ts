export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  status: 'draft' | 'published' | 'archived';
  categories: string[];
  tags: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: number;
}

export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export const BLOG_CATEGORIES = [
  'Tutorial',
  'Tips & Trik',
  'Inspirasi',
  'Berita',
  'Update',
  'Lainnya',
] as const;

export const BLOG_TAGS = [
  'Landing Page',
  'Web Design',
  'UI/UX',
  'Marketing',
  'SEO',
  'Performance',
  'Development',
  'Business',
] as const; 