import { useState, useEffect } from 'react';
import { FiX, FiUpload, FiImage, FiCopy, FiCheck } from 'react-icons/fi';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

interface GalleryImage {
  id: string;
  imageUrl: string;
  name: string;
  createdAt: Date;
}

interface ImageGalleryProps {
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

export default function ImageGallery({ onSelect, onClose }: ImageGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      console.log('Fetching images...');
      const querySnapshot = await getDocs(collection(db, 'galleryImages'));
      console.log('Query snapshot:', querySnapshot.docs.length, 'documents found');
      
      const imageList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Document data:', data);
        return {
          id: doc.id,
          imageUrl: data.imageUrl || '',
          name: data.name || '',
          createdAt: data.createdAt?.toDate() || new Date()
        };
      }) as GalleryImage[];
      
      console.log('Processed image list:', imageList);
      
      // Sort by createdAt in descending order (newest first)
      imageList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setImages(imageList);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      console.log('Uploading file:', file.name);
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `gallery/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log('File uploaded, URL:', url);

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'galleryImages'), {
        imageUrl: url,
        name: file.name,
        createdAt: serverTimestamp()
      });

      console.log('Document added with ID:', docRef.id);

      const newImage: GalleryImage = {
        id: docRef.id,
        imageUrl: url,
        name: file.name,
        createdAt: new Date()
      };

      setImages(prev => [newImage, ...prev]);
      onSelect(url);
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Image Gallery</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FiUpload className="mr-2 h-4 w-4" />
              Upload Image
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <FiImage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
              <p className="mt-1 text-sm text-gray-500">Upload an image to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    onSelect(image.imageUrl);
                    onClose();
                  }}
                >
                  <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.imageUrl}
                      alt={image.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        console.error('Error loading image:', image.imageUrl);
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNFNUU1RTUiLz48cGF0aCBkPSJNMjAgMjBMMzAgMzBIMTBMMjAgMjBaTTIwIDEwQzIyLjIxIDEwIDI0IDExLjc5IDI0IDE0QzI0IDE2LjIxIDIyLjIxIDE4IDIwIDE4QzE3Ljc5IDE4IDE2IDE2LjIxIDE2IDE0QzE2IDExLjc5IDE3Ljc5IDEwIDIwIDEwWiIgZmlsbD0iI0NDQ0NDQyIvPjwvc3ZnPg==';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center">
                    <FiImage className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 