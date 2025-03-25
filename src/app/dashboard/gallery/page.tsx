'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface ImageCategory {
  id: string;
  name: string;
  description: string;
  imageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface GalleryImage {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  alt: string;
  imageUrl: string;
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ImageUpload {
  title: string;
  description: string;
  alt: string;
  categoryId: string;
  file: File | null;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  imageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {title}
                </h3>
                {children}
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<ImageCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ImageCategory | null>(null);
  const [newImage, setNewImage] = useState<ImageUpload>({
    title: '',
    description: '',
    alt: '',
    categoryId: '',
    file: null
  });
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  const fetchImages = async () => {
    try {
      const imagesRef = collection(db, 'galleryImages');
      const imagesSnap = await getDocs(imagesRef);
      const imagesData = imagesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as GalleryImage[];
      setImages(imagesData);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Gagal memuat gambar');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(db, 'imageCategories');
        const categoriesSnap = await getDocs(categoriesRef);
        const categoriesData = categoriesSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            imageCount: data.imageCount || 0,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          };
        }) as ImageCategory[];
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Gagal memuat kategori');
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.description) {
      toast.error('Semua field harus diisi');
      return;
    }

    try {
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        imageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'imageCategories'), categoryData);
      const newCategoryWithId = {
        id: docRef.id,
        ...categoryData
      };

      setCategories(prev => [...prev, newCategoryWithId]);
      setNewCategory({ name: '', description: '' });
      setIsCategoryModalOpen(false);
      toast.success('Kategori berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Gagal menambahkan kategori');
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const categoryRef = doc(db, 'imageCategories', editingCategory.id);
      await updateDoc(categoryRef, {
        name: editingCategory.name,
        description: editingCategory.description
      });

      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ));
      setEditingCategory(null);
      setIsCategoryModalOpen(false);
      toast.success('Kategori berhasil diperbarui');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Gagal memperbarui kategori');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;

    try {
      await deleteDoc(doc(db, 'imageCategories', categoryId));
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast.success('Kategori berhasil dihapus');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Gagal menghapus kategori');
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.file || !newImage.categoryId) {
      toast.error('File gambar dan kategori harus diisi');
      return;
    }

    setIsUploading(true);
    try {
      // Upload gambar ke Firebase Storage
      const file = newImage.file;
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `gallery/${newImage.categoryId}/${fileName}`;

      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
          toast.error('Gagal mengupload gambar');
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Simpan data gambar ke Firestore
            const imageData = {
              categoryId: newImage.categoryId,
              title: newImage.title,
              description: newImage.description,
              alt: newImage.alt,
              imageUrl: downloadURL,
              filename: fileName,
              originalName: file.name,
              contentType: file.type,
              size: file.size,
              path: filePath,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            const docRef = await addDoc(collection(db, 'galleryImages'), imageData);

            // Update jumlah gambar di kategori
            const categoryRef = doc(db, 'imageCategories', newImage.categoryId);
            await updateDoc(categoryRef, {
              imageCount: increment(1)
            });

            // Update state
            setImages(prev => [...prev, { id: docRef.id, ...imageData }]);
            setNewImage({
              title: '',
              description: '',
              alt: '',
              categoryId: '',
              file: null
            });
            setIsUploadModalOpen(false);
            toast.success('Gambar berhasil diupload');
          } catch (error) {
            console.error('Error saving image data:', error);
            toast.error('Gagal menyimpan data gambar');
          }
        }
      );
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      toast.error('Gagal mengupload gambar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (image: GalleryImage) => {
    if (!confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
      return;
    }

    try {
      // Hapus file dari Firebase Storage
      const storageRef = ref(storage, image.path);
      await deleteObject(storageRef);

      // Hapus data dari Firestore
      await deleteDoc(doc(db, 'galleryImages', image.id));

      // Update jumlah gambar di kategori
      const categoryRef = doc(db, 'imageCategories', image.categoryId);
      await updateDoc(categoryRef, {
        imageCount: increment(-1)
      });

      // Update state
      setImages(prev => prev.filter(img => img.id !== image.id));
      toast.success('Gambar berhasil dihapus');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Gagal menghapus gambar');
    }
  };

  const handleEditImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      const imageRef = doc(db, 'galleryImages', editingImage.id);
      await updateDoc(imageRef, {
        title: editingImage.title,
        description: editingImage.description,
        alt: editingImage.alt,
        updatedAt: new Date()
      });

      setImages(images.map(img => 
        img.id === editingImage.id ? editingImage : img
      ));
      setEditingImage(null);
      setIsEditImageModalOpen(false);
      toast.success('Gambar berhasil diperbarui');
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Gagal memperbarui gambar');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Galeri</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setEditingCategory(null);
              setNewCategory({ name: '', description: '' });
              setIsCategoryModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Tambah Kategori
          </button>
          <button
            onClick={() => {
              setNewImage({
                title: '',
                description: '',
                alt: '',
                categoryId: '',
                file: null
              });
              setIsUploadModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upload Gambar
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Filter Kategori
              </h3>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md transition-colors duration-200 ${
                  isEditMode 
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                {isEditMode ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Selesai
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Kategori
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === null
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            {categories.map(category => (
              <div key={category.id} className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
                {isEditMode && (
                  <>
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-1 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                      title="Edit Kategori"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                      title="Hapus Kategori"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Galeri Gambar
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {images
              .filter(image => !selectedCategory || image.categoryId === selectedCategory)
              .map(image => (
                <div key={image.id} className="relative group">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={image.imageUrl}
                      alt={image.alt || image.title}
                      className="h-full w-full object-cover object-center cursor-pointer"
                      onClick={() => {
                        setSelectedImage(image);
                        setIsPreviewModalOpen(true);
                      }}
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-900">{image.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{image.description}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingImage(image);
                        setIsEditImageModalOpen(true);
                      }}
                      className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                      title="Edit Gambar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      title="Hapus Gambar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setSelectedImage(null);
        }}
        title={selectedImage?.title || 'Preview Gambar'}
      >
        {selectedImage && (
          <div className="space-y-4">
            <div className="relative aspect-w-16 aspect-h-9">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.alt || selectedImage.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-gray-900">{selectedImage.title}</h4>
              <p className="text-sm text-gray-500">{selectedImage.description}</p>
              <p className="text-xs text-gray-400">Alt text: {selectedImage.alt}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Image Modal */}
      <Modal
        isOpen={isEditImageModalOpen}
        onClose={() => {
          setIsEditImageModalOpen(false);
          setEditingImage(null);
        }}
        title="Edit Gambar"
      >
        {editingImage && (
          <form onSubmit={handleEditImage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Judul</label>
              <input
                type="text"
                value={editingImage.title}
                onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                value={editingImage.description}
                onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Alt Text</label>
              <input
                type="text"
                value={editingImage.alt}
                onChange={(e) => setEditingImage({ ...editingImage, alt: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
      >
        <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Nama Kategori
            </label>
            <input
              type="text"
              id="categoryName"
              value={editingCategory ? editingCategory.name : newCategory.name}
              onChange={(e) => {
                if (editingCategory) {
                  setEditingCategory({ ...editingCategory, name: e.target.value });
                } else {
                  setNewCategory({ ...newCategory, name: e.target.value });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700">
              Deskripsi
            </label>
            <textarea
              id="categoryDescription"
              value={editingCategory ? editingCategory.description : newCategory.description}
              onChange={(e) => {
                if (editingCategory) {
                  setEditingCategory({ ...editingCategory, description: e.target.value });
                } else {
                  setNewCategory({ ...newCategory, description: e.target.value });
                }
              }}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setNewImage({
            title: '',
            description: '',
            alt: '',
            categoryId: '',
            file: null
          });
        }}
        title="Upload Gambar Baru"
      >
        <form onSubmit={handleImageUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              value={newImage.categoryId}
              onChange={(e) => setNewImage({ ...newImage, categoryId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Judul</label>
            <input
              type="text"
              value={newImage.title}
              onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              value={newImage.description}
              onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Alt Text</label>
            <input
              type="text"
              value={newImage.alt}
              onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">File Gambar</label>
            <input
              type="file"
              onChange={(e) => setNewImage({ ...newImage, file: e.target.files?.[0] || null })}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
              required
            />
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {isUploading ? 'Mengupload...' : 'Upload'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 