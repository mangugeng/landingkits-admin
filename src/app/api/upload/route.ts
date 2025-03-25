import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    console.log('Memulai proses upload...');

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const categoryId = formData.get('categoryId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const alt = formData.get('alt') as string;

    console.log('Data yang diterima:', {
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      categoryId,
      title,
      description,
      alt
    });

    if (!file || !categoryId) {
      console.log('Validasi gagal: file atau categoryId tidak ada');
      return NextResponse.json(
        { error: 'File dan kategori harus diisi' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${timestamp}_${sanitizedFileName}`;
    const filePath = `gallery/${categoryId}/${uniqueFilename}`;

    console.log('Membuat referensi storage...', { filePath });

    // Convert File to Buffer
    console.log('Mengkonversi file ke Buffer...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create file metadata
    const metadata = {
      contentType: file.type,
      metadata: {
        title,
        description,
        alt,
        uploadedBy: 'admin',
        originalName: file.name,
        categoryId
      }
    };

    // Upload file using Admin SDK
    console.log('Memulai upload ke Firebase Storage...');
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(filePath);

    try {
      await fileRef.save(buffer, metadata);
      console.log('File berhasil diupload ke storage');

      // Get download URL
      console.log('Mendapatkan download URL...');
      const [url] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-01-2500' // URL berlaku untuk waktu yang sangat lama
      });

      console.log('Download URL berhasil didapat:', url);

      return NextResponse.json({
        success: true,
        data: {
          downloadURL: url,
          filename: uniqueFilename,
          originalName: file.name,
          contentType: file.type,
          size: file.size,
          path: filePath,
          title,
          description,
          alt
        }
      });
    } catch (storageError) {
      console.error('Error saat upload ke storage:', {
        error: storageError,
        message: storageError instanceof Error ? storageError.message : 'Unknown error',
        stack: storageError instanceof Error ? storageError.stack : undefined
      });
      throw storageError;
    }
  } catch (error) {
    console.error('Error umum:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { error: 'Gagal mengupload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 