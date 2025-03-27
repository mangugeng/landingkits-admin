import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { TemplateComponent } from '@/types/component';

class ComponentEditorService {
  private collectionName = 'component_editor';

  async saveComponent(componentData: {
    name: string;
    description: string;
    components: TemplateComponent[];
    slug: string;
  }) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...componentData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving component:', error);
      throw error;
    }
  }

  async getComponents(): Promise<TemplateComponent[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        components: doc.data().components || [],
        slug: doc.data().slug,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('Error getting components:', error);
      throw error;
    }
  }

  async updateComponent(id: string, componentData: Partial<TemplateComponent>) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...componentData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating component:', error);
      throw error;
    }
  }

  async deleteComponent(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting component:', error);
      throw error;
    }
  }

  async getComponentBySlug(slug: string): Promise<TemplateComponent | null> {
    try {
      const q = query(collection(db, this.collectionName), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          components: doc.data().components || [],
          slug: doc.data().slug,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting component by slug:', error);
      throw error;
    }
  }
}

export const componentEditorService = new ComponentEditorService(); 