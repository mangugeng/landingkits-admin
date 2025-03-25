import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    console.log('Memulai proses upload gambar blog...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;

    console.log('Data yang diterima:', {
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      slug
    });

    if (!file) {
      console.log('Validasi gagal: file tidak ada');
      return NextResponse.json(
        { error: 'File harus diisi' },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Validasi gagal: tipe file tidak didukung');
      return NextResponse.json(
        { error: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP' },
        { status: 400 }
      );
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('Validasi gagal: ukuran file terlalu besar');
      return NextResponse.json(
        { error: 'Ukuran file maksimal 5MB' },
        { status: 400 }
      );
    }

    // Buat nama file unik
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Gunakan folder temp jika slug belum ada
    const folder = slug && slug !== 'temp' ? slug : 'temp';
    const filePath = `blog-images/${folder}/${fileName}`;

    console.log('Membuat referensi storage...', { filePath });

    // Convert File to Buffer
    console.log('Mengkonversi file ke Buffer...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('Buffer size:', buffer.length);

    // Upload ke Firebase Storage
    console.log('Memulai upload ke Firebase Storage...');
    const bucket = adminStorage.bucket();
    console.log('Bucket info:', {
      name: bucket.name,
      exists: bucket.exists
    });
    
    const blob = bucket.file(filePath);
    console.log('Blob info:', {
      name: blob.name,
      exists: blob.exists
    });

    try {
      console.log('Menyimpan file ke storage...');
      await blob.save(buffer, {
        metadata: {
          contentType: file.type,
          metadata: {
            originalName: file.name,
            uploadedBy: 'admin'
          }
        }
      });
      console.log('File berhasil diupload ke storage');

      // Get download URL
      console.log('Mendapatkan download URL...');
      const [url] = await blob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500', // URL berlaku untuk waktu yang lama
      });

      console.log('Upload berhasil:', { url, path: filePath });
      return NextResponse.json({ url, path: filePath });
    } catch (storageError) {
      console.error('Error saat upload ke storage:', {
        error: storageError,
        message: storageError instanceof Error ? storageError.message : 'Unknown error',
        stack: storageError instanceof Error ? storageError.stack : undefined,
        bucket: bucket.name,
        blob: blob.name,
        filePath,
        fileSize: buffer.length,
        contentType: file.type
      });
      throw storageError;
    }
  } catch (error) {
    console.error('Error umum:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });

    // Cek apakah error terkait dengan Firebase Admin
    if (error instanceof Error && error.message.includes('Firebase Admin')) {
      return NextResponse.json(
        { error: 'Konfigurasi Firebase Admin tidak valid. Silakan periksa environment variables.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Gagal mengupload gambar', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 