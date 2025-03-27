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
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import type { TemplateComponent } from '@/types/template';

const COMPONENTS_COLLECTION = 'components';

// Data komponen template default
const DEFAULT_COMPONENTS: Omit<TemplateComponent, 'id'>[] = [
  {
    type: 'hero',
    name: 'Hero Section',
    props: {
      title: 'Welcome to Our Website',
      subtitle: 'We create amazing digital experiences',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      buttonText: 'Get Started',
      buttonLink: '#',
      imageUrl: '/images/hero.jpg',
      backgroundType: 'color',
      backgroundColor: '#ffffff'
    }
  },
  {
    type: 'features',
    name: 'Features Section',
    props: {
      title: 'Our Features',
      subtitle: 'What we offer',
      description: 'Discover our amazing features that will help you succeed.',
      items: [
        {
          title: 'Feature 1',
          description: 'Description of feature 1',
          icon: 'FiStar'
        },
        {
          title: 'Feature 2',
          description: 'Description of feature 2',
          icon: 'FiHeart'
        }
      ]
    }
  }
];

export const templateComponentService = {
  async getAllComponents(): Promise<TemplateComponent[]> {
    try {
      console.log('Fetching components from collection:', COMPONENTS_COLLECTION);
      const componentsRef = collection(db, COMPONENTS_COLLECTION);
      const q = query(componentsRef);
      const querySnapshot = await getDocs(q);
      console.log('Found components:', querySnapshot.size);
      
      const components = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Component data:', data);
        return {
          id: doc.id,
          ...data
        } as TemplateComponent;
      });
      
      return components;
    } catch (error) {
      console.error('Error fetching components:', error);
      throw error;
    }
  },

  async getComponentByType(type: string): Promise<TemplateComponent | null> {
    try {
      const componentsRef = collection(db, COMPONENTS_COLLECTION);
      const q = query(componentsRef, where('type', '==', type));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as TemplateComponent;
    } catch (error) {
      console.error('Error getting component by type:', error);
      throw error;
    }
  },

  async createComponent(component: Omit<TemplateComponent, 'id'>): Promise<TemplateComponent> {
    try {
      const componentsRef = collection(db, COMPONENTS_COLLECTION);
      const docRef = await addDoc(componentsRef, {
        ...component,
        name: component.name || component.type,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...component,
        name: component.name || component.type
      };
    } catch (error) {
      console.error('Error creating component:', error);
      throw error;
    }
  },

  async updateComponent(id: string, component: Partial<TemplateComponent>): Promise<void> {
    try {
      const docRef = doc(db, COMPONENTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...component,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating component:', error);
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
  },

  // Fungsi untuk membuat komponen default
  async createDefaultComponents() {
    try {
      const existingComponents = await this.getAllComponents();
      const existingTypes = new Set(existingComponents.map(comp => comp.type));
      
      if (existingComponents.length === 0) {
        console.log('Creating default components...');
        for (const component of DEFAULT_COMPONENTS) {
          await this.createComponent(component);
        }
        console.log('Default components created successfully');
      } else {
        // Cek dan tambahkan komponen yang belum ada
        for (const component of DEFAULT_COMPONENTS) {
          if (!existingTypes.has(component.type)) {
            await this.createComponent(component);
          }
        }
      }
    } catch (error) {
      console.error('Error creating default components:', error);
      throw error;
    }
  },

  async getComponentBySlug(slug: string): Promise<TemplateComponent | null> {
    try {
      console.log('Fetching component with slug:', slug);
      const componentsRef = collection(db, COMPONENTS_COLLECTION);
      const q = query(componentsRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);

      console.log('Query result size:', querySnapshot.size);

      if (querySnapshot.empty) {
        console.log('No component found with slug:', slug);
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      console.log('Found component data:', data);

      return {
        id: doc.id,
        ...data
      } as TemplateComponent;
    } catch (error) {
      console.error('Error getting component by slug:', error);
      throw error;
    }
  }
}; 