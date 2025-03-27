'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ComponentEditor as ComponentEditorType } from '@/types/template';
import { componentEditorService } from '@/lib/firebase/componentEditorService';
import ComponentEditor from '@/components/templates/ComponentEditor';

export default function CreateComponentPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (component: ComponentEditorType) => {
    try {
      setIsSaving(true);
      await componentEditorService.createComponentEditor(component);
      router.push('/dashboard/component');
    } catch (err) {
      console.error('Error saving component:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/component');
  };

  const newComponent: ComponentEditorType = {
    id: '',
    name: 'New Component',
    description: '',
    slug: '',
    components: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return (
    <ComponentEditor
      component={newComponent}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
} 