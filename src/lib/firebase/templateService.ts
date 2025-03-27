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
  serverTimestamp
} from 'firebase/firestore';
import { Template } from '@/types/template';

const TEMPLATES_COLLECTION = 'templates';

class TemplateService {
  private collectionName = TEMPLATES_COLLECTION;

  async getAllTemplates(): Promise<Template[]> {
    try {
      const templatesRef = collection(db, TEMPLATES_COLLECTION);
      const q = query(templatesRef, orderBy('createdAt', 'desc'));
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
      const templatesRef = collection(db, TEMPLATES_COLLECTION);
      const q = query(templatesRef, where('slug', '==', slug));
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
      const templatesRef = collection(db, TEMPLATES_COLLECTION);
      const docRef = await addDoc(templatesRef, {
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
      const docRef = doc(db, TEMPLATES_COLLECTION, id);
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
      const docRef = doc(db, TEMPLATES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
}

export const templateService = new TemplateService(); 