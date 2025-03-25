import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';

console.log('Memulai inisialisasi Firebase Admin...');

// Cek environment variables
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'Ada' : 'Tidak ada');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'Ada' : 'Tidak ada');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'Ada' : 'Tidak ada');
console.log('FIREBASE_STORAGE_BUCKET:', process.env.FIREBASE_STORAGE_BUCKET ? 'Ada' : 'Tidak ada');

// Validasi environment variables
if (!process.env.FIREBASE_PROJECT_ID) throw new Error('FIREBASE_PROJECT_ID tidak ditemukan');
if (!process.env.FIREBASE_CLIENT_EMAIL) throw new Error('FIREBASE_CLIENT_EMAIL tidak ditemukan');
if (!process.env.FIREBASE_PRIVATE_KEY) throw new Error('FIREBASE_PRIVATE_KEY tidak ditemukan');
if (!process.env.FIREBASE_STORAGE_BUCKET) throw new Error('FIREBASE_STORAGE_BUCKET tidak ditemukan');

// Inisialisasi Firebase Admin
const apps = getApps();

if (!apps.length) {
  console.log('Inisialisasi Firebase Admin...');
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      storageBucket: 'gs://landingkits.firebasestorage.app',
    });
    console.log('Firebase Admin berhasil diinisialisasi');
  } catch (error) {
    console.error('Error saat inisialisasi Firebase Admin:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
} else {
  console.log('Firebase Admin sudah diinisialisasi');
}

// Inisialisasi Storage
const storage = getStorage();
console.log('Storage bucket yang digunakan:', storage.bucket().name);

// Test akses bucket
storage.bucket().exists().then(([exists]) => {
  console.log('Bucket exists:', exists);
  if (!exists) {
    console.error('Bucket tidak ditemukan!');
  }
}).catch(error => {
  console.error('Error saat mengecek bucket:', {
    error,
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });
});

export const adminStorage = getStorage();
export const adminDb = getFirestore(); 