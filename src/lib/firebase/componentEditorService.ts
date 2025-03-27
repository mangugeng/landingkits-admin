import { db } from './firebase';
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
  Query,
  CollectionReference,
  serverTimestamp
} from 'firebase/firestore';
import { ComponentEditor, TemplateComponent } from '@/types/template';

const COMPONENTS_COLLECTION = 'components';

interface SaveComponentData {
  name: string;
  description: string;
  components: TemplateComponent[];
  slug: string;
}

export const componentEditorService = {
  // Component Editor operations
  async getComponentEditors(): Promise<ComponentEditor[]> {
    try {
      const q = query(collection(db, COMPONENTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComponentEditor[];
    } catch (error) {
      console.error('Error fetching component editors:', error);
      throw error;
    }
  },

  async getComponentEditor(id: string): Promise<ComponentEditor | null> {
    try {
      const docRef = doc(db, COMPONENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as ComponentEditor;
      }
      return null;
    } catch (error) {
      console.error('Error fetching component editor:', error);
      throw error;
    }
  },

  async getAllComponents(): Promise<ComponentEditor[]> {
    try {
      const componentsRef = collection(db, 'components');
      const querySnapshot = await getDocs(componentsRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComponentEditor[];
    } catch (error) {
      console.error('Error getting all components:', error);
      throw error;
    }
  },

  async getComponentBySlug(slug: string): Promise<ComponentEditor | null> {
    if (!slug) {
      throw new Error('Slug tidak boleh kosong');
    }

    try {
      const componentsRef = collection(db, 'components');
      const q = query(componentsRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as ComponentEditor;
    } catch (error) {
      console.error('Error getting component by slug:', error);
      throw error;
    }
  },

  async createComponentEditor(component: Omit<ComponentEditor, 'id'>): Promise<ComponentEditor> {
    try {
      const componentsRef = collection(db, 'components');
      const docRef = await addDoc(componentsRef, {
        ...component,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...component
      };
    } catch (error) {
      console.error('Error creating component:', error);
      throw error;
    }
  },

  async updateComponentEditor(id: string, component: Partial<ComponentEditor>): Promise<void> {
    try {
      const docRef = doc(db, 'components', id);
      await updateDoc(docRef, {
        ...component,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating component:', error);
      throw error;
    }
  },

  async deleteComponentEditor(id: string): Promise<void> {
    try {
      const docRef = doc(db, COMPONENTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting component editor:', error);
      throw error;
    }
  },

  async saveComponent(componentData: SaveComponentData): Promise<void> {
    try {
      const componentsRef = collection(db, COMPONENTS_COLLECTION);
      const q = query(componentsRef, where('slug', '==', componentData.slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        await updateDoc(doc.ref, {
          name: componentData.name,
          description: componentData.description,
          components: componentData.components,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(componentsRef, {
          name: componentData.name,
          description: componentData.description,
          components: componentData.components,
          slug: componentData.slug,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error saving component:', error);
      throw error;
    }
  },

  async deleteComponent(id: string): Promise<void> {
    try {
      const docRef = doc(db, COMPONENTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting component:', error);
      throw error;
    }
  }
}; 