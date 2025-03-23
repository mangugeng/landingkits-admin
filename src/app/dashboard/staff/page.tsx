'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Staff, STAFF_PERMISSIONS, DEFAULT_PERMISSIONS, PERMISSION_GROUPS, PERMISSION_DESCRIPTIONS } from '@/types/staff';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiDownload, FiActivity } from 'react-icons/fi';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    level: 'all',
    role: 'all',
    status: 'all',
  });
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    email: string;
    name: string;
    role: 'admin' | 'staff';
    level: Staff['level'];
    permissions: string[];
    status: 'active' | 'inactive';
  }>({
    email: '',
    name: '',
    role: 'staff',
    level: 'staff',
    permissions: [],
    status: 'active',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const staffSnapshot = await getDocs(collection(db, 'staff'));
      const staffData = staffSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Staff[];
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Gagal mengambil data staf');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await updateDoc(doc(db, 'staff', editingStaff.id), {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        toast.success('Staf berhasil diperbarui');
      } else {
        await addDoc(collection(db, 'staff'), {
          ...formData,
          permissions: DEFAULT_PERMISSIONS[formData.level],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        toast.success('Staf berhasil ditambahkan');
      }
      setShowAddModal(false);
      setEditingStaff(null);
      setFormData({
        email: '',
        name: '',
        role: 'staff',
        level: 'staff',
        permissions: [],
        status: 'active',
      });
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error('Gagal menyimpan data staf');
    }
  };

  const handleDelete = async (staffId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus staf ini?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'staff', staffId));
      toast.success('Staf berhasil dihapus');
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Gagal menghapus staf');
    }
  };

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData({
      email: staff.email,
      name: staff.name,
      role: staff.role,
      level: staff.level,
      permissions: staff.permissions,
      status: staff.status,
    });
    setShowAddModal(true);
  };

  const handleLevelChange = (level: Staff['level']) => {
    setFormData(prev => ({
      ...prev,
      level,
      permissions: DEFAULT_PERMISSIONS[level],
    }));
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedStaff.length === 0) {
      toast.error('Pilih staf terlebih dahulu');
      return;
    }

    if (action === 'delete' && !confirm('Apakah Anda yakin ingin menghapus staf yang dipilih?')) {
      return;
    }

    try {
      const batch = writeBatch(db);
      selectedStaff.forEach(staffId => {
        const staffRef = doc(db, 'staff', staffId);
        if (action === 'delete') {
          batch.delete(staffRef);
        } else {
          batch.update(staffRef, {
            status: action === 'activate' ? 'active' : 'inactive',
            updatedAt: new Date().toISOString(),
          });
        }
      });
      await batch.commit();
      toast.success(`Staf berhasil ${action === 'delete' ? 'dihapus' : action === 'activate' ? 'diaktifkan' : 'dinonaktifkan'}`);
      setSelectedStaff([]);
      fetchStaff();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Gagal melakukan aksi');
    }
  };

  const filteredStaff = staff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filters.level === 'all' || staff.level === filters.level;
    const matchesRole = filters.role === 'all' || staff.role === filters.role;
    const matchesStatus = filters.status === 'all' || staff.status === filters.status;
    return matchesSearch && matchesLevel && matchesRole && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Nama', 'Email', 'Role', 'Level', 'Status', 'Permissions'];
    const csvContent = [
      headers.join(','),
      ...filteredStaff.map(staff => [
        staff.name,
        staff.email,
        staff.role,
        staff.level,
        staff.status,
        staff.permissions.join(';'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'staff_data.csv';
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Manajemen Staf</h1>
          <p className="mt-2 text-sm text-gray-700">
            Kelola akses staf ke dashboard admin
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-3">
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <FiDownload className="mr-2" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingStaff(null);
              setFormData({
                email: '',
                name: '',
                role: 'staff',
                level: 'staff',
                permissions: [],
                status: 'active',
              });
              setShowAddModal(true);
            }}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <FiPlus className="mr-2" />
            Tambah Staf
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Cari berdasarkan nama atau email..."
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select
            value={filters.level}
            onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
            className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="all">Semua Level</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
          </select>
          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="all">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      {selectedStaff.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-700">
            {selectedStaff.length} staf dipilih
          </span>
          <button
            onClick={() => handleBulkAction('activate')}
            className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            Aktifkan
          </button>
          <button
            onClick={() => handleBulkAction('deactivate')}
            className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
          >
            Nonaktifkan
          </button>
          <button
            onClick={() => handleBulkAction('delete')}
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            Hapus
          </button>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 sm:left-6"
                        checked={selectedStaff.length === filteredStaff.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStaff(filteredStaff.map(s => s.id));
                          } else {
                            setSelectedStaff([]);
                          }
                        }}
                      />
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Nama
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Level
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Permissions
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id}>
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 sm:left-6"
                          checked={selectedStaff.includes(staff.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStaff([...selectedStaff, staff.id]);
                            } else {
                              setSelectedStaff(selectedStaff.filter(id => id !== staff.id));
                            }
                          }}
                        />
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {staff.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {staff.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {staff.role}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${staff.level === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                            staff.level === 'admin' ? 'bg-red-100 text-red-700' :
                            staff.level === 'manager' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'}`}>
                          {staff.level}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${staff.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {staff.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {staff.permissions.map(permission => (
                            <span
                              key={permission}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                              title={PERMISSION_DESCRIPTIONS[permission as keyof typeof PERMISSION_DESCRIPTIONS]}
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(staff)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          title="Edit"
                        >
                          <FiEdit2 className="inline-block" />
                        </button>
                        <button
                          onClick={() => handleDelete(staff.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Hapus"
                        >
                          <FiTrash2 className="inline-block" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-lg font-medium mb-4">
              {editingStaff ? 'Edit Staf' : 'Tambah Staf Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => handleLevelChange(e.target.value as Staff['level'])}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => (
                    <div key={group} className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">{group.replace('_', ' ')}</h3>
                      <div className="space-y-2">
                        {permissions.map(permission => (
                          <label key={permission} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(STAFF_PERMISSIONS[permission as keyof typeof STAFF_PERMISSIONS])}
                              onChange={() => togglePermission(STAFF_PERMISSIONS[permission as keyof typeof STAFF_PERMISSIONS])}
                              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <div className="ml-2">
                              <span className="text-sm text-gray-700">{permission}</span>
                              <p className="text-xs text-gray-500">{PERMISSION_DESCRIPTIONS[permission as keyof typeof PERMISSION_DESCRIPTIONS]}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {editingStaff ? 'Update' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 