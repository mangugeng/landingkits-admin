import { NextResponse } from 'next/server';
import { templateService } from '@/lib/firebase/templateService';

export async function POST() {
  try {
    await templateService.createDefaultCategories();
    return NextResponse.json({ message: 'Default categories created successfully' });
  } catch (error) {
    console.error('Error creating default categories:', error);
    return NextResponse.json({ error: 'Failed to create default categories' }, { status: 500 });
  }
} 