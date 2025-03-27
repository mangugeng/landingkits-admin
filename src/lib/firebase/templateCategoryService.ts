import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import type { TemplateCategory } from '@/types/template';

const TEMPLATE_CATEGORIES_COLLECTION = 'template_categories';

// Data kategori template default
const DEFAULT_CATEGORIES: Omit<TemplateCategory, 'id'>[] = [
  {
    name: 'Landing Page',
    description: 'Template untuk halaman utama website',
    icon: 'FiHome',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Portfolio',
    description: 'Template untuk menampilkan karya dan portfolio',
    icon: 'FiBriefcase',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Blog',
    description: 'Template untuk website blog dan artikel',
    icon: 'FiFileText',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'E-commerce',
    description: 'Template untuk toko online dan e-commerce',
    icon: 'FiShoppingCart',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Business',
    description: 'Template untuk website bisnis dan perusahaan',
    icon: 'FiBriefcase',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Personal',
    description: 'Template untuk website personal dan resume',
    icon: 'FiUser',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Event',
    description: 'Template untuk website event dan konferensi',
    icon: 'FiCalendar',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Restaurant',
    description: 'Template untuk website restoran dan makanan',
    icon: 'FiCoffee',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Real Estate',
    description: 'Template untuk website properti dan real estate',
    icon: 'FiHome',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Education',
    description: 'Template untuk website pendidikan dan kursus',
    icon: 'FiBook',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const templateCategoryService = {
  // Fungsi untuk membuat kategori default
  async createDefaultCategories() {
    try {
      const existingCategories = await this.getAllCategories();
      const existingNames = new Set(existingCategories.map(cat => cat.name));
      
      if (existingCategories.length === 0) {
        console.log('Creating default categories...');
        for (const category of DEFAULT_CATEGORIES) {
          await this.createCategory(category);
        }
        console.log('Default categories created successfully');
      } else {
        // Cek dan tambahkan kategori yang belum ada
        for (const category of DEFAULT_CATEGORIES) {
          if (!existingNames.has(category.name)) {
            await this.createCategory(category);
          }
        }
      }
    } catch (error) {
      console.error('Error creating default categories:', error);
      throw error;
    }
  },

  async getAllCategories(): Promise<TemplateCategory[]> {
    try {
      const categoriesRef = collection(db, TEMPLATE_CATEGORIES_COLLECTION);
      const q = query(categoriesRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      // Hapus duplikat berdasarkan nama
      const uniqueCategories = new Map();
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!uniqueCategories.has(data.name)) {
          uniqueCategories.set(data.name, {
            id: doc.id,
            ...data
          });
        }
      });
      
      return Array.from(uniqueCategories.values()) as TemplateCategory[];
    } catch (error) {
      console.error('Error fetching template categories:', error);
      throw error;
    }
  },

  async getCategory(id: string): Promise<TemplateCategory | null> {
    try {
      const docRef = doc(db, TEMPLATE_CATEGORIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as TemplateCategory;
      }
      return null;
    } catch (error) {
      console.error('Error getting template category:', error);
      throw error;
    }
  },

  async createCategory(category: Omit<TemplateCategory, 'id'>): Promise<TemplateCategory> {
    try {
      const categoriesRef = collection(db, TEMPLATE_CATEGORIES_COLLECTION);
      const docRef = await addDoc(categoriesRef, {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...category
      };
    } catch (error) {
      console.error('Error creating template category:', error);
      throw error;
    }
  },

  async updateCategory(id: string, category: Partial<TemplateCategory>): Promise<void> {
    try {
      const docRef = doc(db, TEMPLATE_CATEGORIES_COLLECTION, id);
      await updateDoc(docRef, {
        ...category,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating template category:', error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      const docRef = doc(db, TEMPLATE_CATEGORIES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting template category:', error);
      throw error;
    }
  }
}; 