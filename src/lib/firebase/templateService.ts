import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { Template } from '@/types/template';
import { Firestore, CollectionReference } from 'firebase/firestore';

const TEMPLATES_COLLECTION = 'templates';

export class TemplateService {
  private db: Firestore;
  private templatesRef: CollectionReference;

  constructor() {
    this.db = db;
    this.templatesRef = collection(this.db, TEMPLATES_COLLECTION);
  }

  async getAllTemplates(): Promise<Template[]> {
    try {
      const q = query(this.templatesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Template[];
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  async getTemplateBySlug(slug: string): Promise<Template | null> {
    try {
      const q = query(this.templatesRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Template;
    } catch (error) {
      console.error('Error getting template by slug:', error);
      throw error;
    }
  }

  async createTemplate(template: Omit<Template, 'id'>): Promise<Template> {
    try {
      const docRef = await addDoc(this.templatesRef, {
        ...template,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...template
      };
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<void> {
    try {
      const docRef = doc(this.db, TEMPLATES_COLLECTION, id);
      await updateDoc(docRef, {
        ...template,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      const docRef = doc(this.db, TEMPLATES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  async createDefaultCategories() {
    const defaultCategories = [
      {
        id: 'hero',
        name: 'Hero Section',
        description: 'Hero section templates for landing pages',
        icon: 'FiMaximize'
      },
      {
        id: 'features',
        name: 'Features',
        description: 'Feature section templates',
        icon: 'FiGrid'
      },
      {
        id: 'testimonials',
        name: 'Testimonials',
        description: 'Testimonial section templates',
        icon: 'FiMessageSquare'
      },
      {
        id: 'pricing',
        name: 'Pricing',
        description: 'Pricing section templates',
        icon: 'FiDollarSign'
      },
      {
        id: 'contact',
        name: 'Contact',
        description: 'Contact section templates',
        icon: 'FiMail'
      }
    ];

    const batch = writeBatch(this.db);
    defaultCategories.forEach(category => {
      const docRef = doc(this.db, 'templateCategories', category.id);
      batch.set(docRef, category);
    });

    await batch.commit();
  }
}

export const templateService = new TemplateService(); 