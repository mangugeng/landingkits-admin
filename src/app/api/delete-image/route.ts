import { NextResponse } from 'next/server';
import { adminStorage, adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { imageId, imagePath } = await request.json();

    if (!imageId || !imagePath) {
      return NextResponse.json(
        { error: 'Image ID and path are required' },
        { status: 400 }
      );
    }

    // Delete from Storage
    const bucket = adminStorage.bucket();
    const file = bucket.file(imagePath);
    await file.delete();

    // Delete from Firestore
    await adminDb.collection('galleryImages').doc(imageId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 