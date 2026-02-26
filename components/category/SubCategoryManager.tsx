'use client';

import { useState } from 'react';
import { INITIAL_CATEGORIES, SubCategoryTemp } from '@/constants/categories';
import EditSubCategoryModal from './EditSubCategoryModal';
import useSWR, { mutate } from 'swr';
import { Category, SubCategory } from '@/interface/common/category.models';
import { redirect } from 'next/navigation';
import { DeleteAlert } from '../common/deleteAlter';

export default function SubCategoryManager() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [newSubCategory, setNewSubCategory] = useState<SubCategory>({
    name: '',
    categoryId: '',
    categoryName: '',
    status: 'active',
    createdAt: '',
    updatedAt: '',
    image: '🏷️',
    productCount: 0,
  });

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data: categories = [] } = useSWR(
    '/api/categories',
    fetcher,
    { revalidateOnFocus: false, }
  )
  const { data: subCategories = [] } = useSWR(
    '/api/sub-categories',
    fetcher,
    { revalidateOnFocus: false, }
  )

  const handleAddSubCategory = async () => {
    if (newSubCategory.name.trim()) {
      const setData: SubCategory = {
        id: String(subCategories.length + 1),
        name: newSubCategory.name,
        categoryId: categories.find((cat: Category) => cat.name === newSubCategory.categoryName)?._id || '',
        categoryName: newSubCategory.categoryName,
        status: newSubCategory.status,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        image: newSubCategory.image,
        productCount: 0,
      };
      const response = await fetch('/api/sub-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setData),
      })
      if (response.status !== 201) {
        console.log('failed to add sub category :( ', response.status)
      }
      console.log(response)
      mutate('/api/sub-categories');
      setNewSubCategory({
        name: '',
        categoryId: '',
        categoryName: '',
        status: 'active',
        createdAt: '',
        updatedAt: '',
        image: '🏷️',
        productCount: 0,
      });
      setShowAddModal(false);
    }
  };

  const handleUpdateSubCategory = async (updatedSubCategory: SubCategory) => {
    const response = await fetch(`/api/sub-categories/${updatedSubCategory._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSubCategory),
    })
    if (response.status !== 200) {
      console.log('error in updating sub category :( ', response.status)
    }
    mutate('/api/sub-categories');
    setEditingSubCategory(null);
  };

  const handleToggleActive = async (id: string) => {
    let subCategory = subCategories.find((subCat: SubCategory) => subCat._id === id);
    if (!subCategory) return;

    subCategory = { ...subCategory, status: subCategory.status === 'active' ? 'inactive' : 'active' };
    const response = await fetch(`/api/sub-categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subCategory),
    })
    if (response.status !== 200) {
      console.log('error in toggling sub category status :( ', response.status)
    }
    mutate('/api/sub-categories');
  };

  const handleDeleteSubCategory = async (id: string) => {
    alert(id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sub Categories</h1>
          <p className="text-gray-600 mt-1">Manage subcategories under main categories</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          + Add Sub Category
        </button>
      </div>

      {/* Add Sub Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Sub Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select
                  value={newSubCategory.categoryName}
                  onChange={(e) => setNewSubCategory({ ...newSubCategory, categoryName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">---Select parent category---</option>
                  {categories.map((cat: SubCategory) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category Name</label>
                <input
                  type="text"
                  value={newSubCategory.name}
                  onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                  placeholder="Enter sub category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                <input
                  type="text"
                  value={newSubCategory.image}
                  onChange={(e) => setNewSubCategory({ ...newSubCategory, image: e.target.value })}
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubCategory}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subCategories.map((subCategory: SubCategory) => (
          <div
            key={subCategory.id || subCategory._id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{subCategory.image}</div>
              <button
                onClick={() => handleToggleActive(subCategory._id || '')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${subCategory.status == 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {subCategory.status === 'active' ? 'Active' : 'Inactive'}
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{subCategory.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Parent: {subCategory.categoryName}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {subCategory.productCount} products
            </p>
            <button
              onClick={() => setEditingSubCategory(subCategory)}
              className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Edit
            </button>
            <DeleteAlert
              id={subCategory.name}
              text='Delete'
              onConfirm={() => handleDeleteSubCategory(subCategory._id || '')}
              css="mt-4 w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors font-medium"
              title="Delete"
              data={
                `${subCategory.image} ${subCategory.name}(${subCategory.categoryName})`
              }
            />
          </div>
        ))}
      </div>

      {/* Edit Sub Category Modal */}
      {editingSubCategory && (
        <EditSubCategoryModal
          subCategory={editingSubCategory}
          onClose={() => setEditingSubCategory(null)}
          onSave={handleUpdateSubCategory}
          categories={categories}
        />
      )}
    </div>
  );
}
