'use client';

import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

interface ComponentBlock {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'hero' | 'features' | 'pricing' | 'testimonials' | 'cta' | 'footer' | 'stats' | 'team' | 'blog' | 'contact';
}

const componentBlocks: ComponentBlock[] = [
  // Hero Sections
  {
    id: 'hero-1',
    name: 'Hero Section 1',
    description: 'Hero section dengan gambar di sebelah kanan',
    icon: '🎯',
    category: 'hero'
  },
  {
    id: 'hero-2',
    name: 'Hero Section 2',
    description: 'Hero section dengan gambar di sebelah kiri',
    icon: '🎯',
    category: 'hero'
  },
  {
    id: 'hero-3',
    name: 'Hero Section 3',
    description: 'Hero section dengan background gradient',
    icon: '🎯',
    category: 'hero'
  },
  {
    id: 'hero-4',
    name: 'Hero Section 4',
    description: 'Hero section dengan video background',
    icon: '🎯',
    category: 'hero'
  },
  {
    id: 'hero-5',
    name: 'Hero Section 5',
    description: 'Hero section dengan animasi parallax',
    icon: '🎯',
    category: 'hero'
  },

  // Features Sections
  {
    id: 'features-1',
    name: 'Features Grid',
    description: 'Grid layout untuk fitur-fitur produk',
    icon: '⚡',
    category: 'features'
  },
  {
    id: 'features-2',
    name: 'Features List',
    description: 'List layout untuk fitur-fitur produk',
    icon: '⚡',
    category: 'features'
  },
  {
    id: 'features-3',
    name: 'Features Cards',
    description: 'Kartu fitur dengan ikon dan animasi hover',
    icon: '⚡',
    category: 'features'
  },
  {
    id: 'features-4',
    name: 'Features Timeline',
    description: 'Timeline untuk menampilkan fitur-fitur',
    icon: '⚡',
    category: 'features'
  },
  {
    id: 'features-5',
    name: 'Features Comparison',
    description: 'Tabel perbandingan fitur-fitur produk',
    icon: '⚡',
    category: 'features'
  },

  // Pricing Sections
  {
    id: 'pricing-1',
    name: 'Pricing Cards',
    description: 'Kartu harga dengan highlight untuk paket populer',
    icon: '💰',
    category: 'pricing'
  },
  {
    id: 'pricing-2',
    name: 'Pricing Table',
    description: 'Tabel perbandingan harga',
    icon: '💰',
    category: 'pricing'
  },
  {
    id: 'pricing-3',
    name: 'Pricing Toggle',
    description: 'Toggle antara harga bulanan dan tahunan',
    icon: '💰',
    category: 'pricing'
  },
  {
    id: 'pricing-4',
    name: 'Pricing FAQ',
    description: 'FAQ seputar harga dan pembayaran',
    icon: '💰',
    category: 'pricing'
  },
  {
    id: 'pricing-5',
    name: 'Pricing Calculator',
    description: 'Kalkulator harga berdasarkan penggunaan',
    icon: '💰',
    category: 'pricing'
  },

  // Testimonials Sections
  {
    id: 'testimonials-1',
    name: 'Testimonials Grid',
    description: 'Grid layout untuk testimonial pelanggan',
    icon: '💬',
    category: 'testimonials'
  },
  {
    id: 'testimonials-2',
    name: 'Testimonials Carousel',
    description: 'Carousel untuk testimonial pelanggan',
    icon: '💬',
    category: 'testimonials'
  },
  {
    id: 'testimonials-3',
    name: 'Testimonials Cards',
    description: 'Kartu testimonial dengan foto dan rating',
    icon: '💬',
    category: 'testimonials'
  },
  {
    id: 'testimonials-4',
    name: 'Testimonials Video',
    description: 'Testimonial dalam format video',
    icon: '💬',
    category: 'testimonials'
  },
  {
    id: 'testimonials-5',
    name: 'Testimonials Social',
    description: 'Testimonial dari social media',
    icon: '💬',
    category: 'testimonials'
  },

  // CTA Sections
  {
    id: 'cta-1',
    name: 'CTA Simple',
    description: 'Call to action sederhana',
    icon: '🎯',
    category: 'cta'
  },
  {
    id: 'cta-2',
    name: 'CTA With Form',
    description: 'Call to action dengan form pendaftaran',
    icon: '🎯',
    category: 'cta'
  },
  {
    id: 'cta-3',
    name: 'CTA Split',
    description: 'Call to action dengan background split',
    icon: '🎯',
    category: 'cta'
  },
  {
    id: 'cta-4',
    name: 'CTA With Video',
    description: 'Call to action dengan video background',
    icon: '🎯',
    category: 'cta'
  },
  {
    id: 'cta-5',
    name: 'CTA With Countdown',
    description: 'Call to action dengan countdown timer',
    icon: '🎯',
    category: 'cta'
  },

  // Footer Sections
  {
    id: 'footer-1',
    name: 'Footer Simple',
    description: 'Footer sederhana dengan link dan social media',
    icon: '👣',
    category: 'footer'
  },
  {
    id: 'footer-2',
    name: 'Footer Complex',
    description: 'Footer kompleks dengan multiple columns',
    icon: '👣',
    category: 'footer'
  },
  {
    id: 'footer-3',
    name: 'Footer With Newsletter',
    description: 'Footer dengan form newsletter',
    icon: '👣',
    category: 'footer'
  },
  {
    id: 'footer-4',
    name: 'Footer With Map',
    description: 'Footer dengan peta lokasi',
    icon: '👣',
    category: 'footer'
  },
  {
    id: 'footer-5',
    name: 'Footer With Apps',
    description: 'Footer dengan link aplikasi mobile',
    icon: '👣',
    category: 'footer'
  },

  // Additional Sections
  {
    id: 'stats-1',
    name: 'Stats Counter',
    description: 'Statistik dengan animasi counter',
    icon: '📊',
    category: 'stats'
  },
  {
    id: 'stats-2',
    name: 'Stats Cards',
    description: 'Kartu statistik dengan ikon',
    icon: '📊',
    category: 'stats'
  },
  {
    id: 'team-1',
    name: 'Team Grid',
    description: 'Grid layout untuk tim',
    icon: '👥',
    category: 'team'
  },
  {
    id: 'team-2',
    name: 'Team Carousel',
    description: 'Carousel untuk tim',
    icon: '👥',
    category: 'team'
  },
  {
    id: 'blog-1',
    name: 'Blog Grid',
    description: 'Grid layout untuk artikel blog',
    icon: '📝',
    category: 'blog'
  },
  {
    id: 'blog-2',
    name: 'Blog List',
    description: 'List layout untuk artikel blog',
    icon: '📝',
    category: 'blog'
  },
  {
    id: 'contact-1',
    name: 'Contact Form',
    description: 'Form kontak dengan peta',
    icon: '📧',
    category: 'contact'
  },
  {
    id: 'contact-2',
    name: 'Contact Cards',
    description: 'Kartu informasi kontak',
    icon: '📧',
    category: 'contact'
  }
];

interface ComponentBlocksProps {
  onSelectBlock: (block: ComponentBlock) => void;
  selectedBlocks: ComponentBlock[];
}

export default function ComponentBlocks({ onSelectBlock, selectedBlocks }: ComponentBlocksProps) {
  const [selectedCategory, setSelectedCategory] = useState<ComponentBlock['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'hero', 'features', 'pricing', 'testimonials', 'cta', 'footer', 'stats', 'team', 'blog', 'contact'] as const;

  const filteredBlocks = componentBlocks.filter(block => {
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    const matchesSearch = block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isBlockSelected = (blockId: string) => {
    return selectedBlocks.some(block => block.id === blockId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari komponen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlocks.map((block) => (
          <div
            key={block.id}
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              isBlockSelected(block.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
            onClick={() => onSelectBlock(block)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{block.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{block.name}</h3>
                  <p className="text-sm text-gray-500">{block.description}</p>
                </div>
              </div>
              {isBlockSelected(block.id) ? (
                <FiX className="text-red-500 hover:text-red-600" />
              ) : (
                <FiPlus className="text-blue-500 hover:text-blue-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 