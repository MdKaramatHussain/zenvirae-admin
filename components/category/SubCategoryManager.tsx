'use client';

import { useState } from 'react';
import { INITIAL_CATEGORIES } from '@/constants/categories';
import { INITIAL_SUB_CATEGORIES, SubCategory } from '@/constants/categories';
import EditSubCategoryModal from './EditSubCategoryModal';

export default function SubCategoryManager() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>(INITIAL_SUB_CATEGORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [newSubCategoryEmoji, setNewSubCategoryEmoji] = useState('🏷️');
  const [newParentCategoryId, setNewParentCategoryId] = useState(INITIAL_CATEGORIES[0].id);

  const handleAddSubCategory = () => {
    if (newSubCategoryName.trim()) {
      const newSubCategory: SubCategory = {
        id: String(subCategories.length + 1),
        name: newSubCategoryName,
        parentCategoryId: newParentCategoryId,
        image: newSubCategoryEmoji,
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
        productCount: 0,
      };
      setSubCategories([...subCategories, newSubCategory]);
      setNewSubCategoryName('');
      setNewSubCategoryEmoji('🏷️');
      setShowAddModal(false);
    }
  };

  const handleUpdateSubCategory = (updatedSubCategory: SubCategory) => {
    setSubCategories(
      subCategories.map((subCat) =>
        subCat.id === updatedSubCategory.id ? updatedSubCategory : subCat
      )
    );
    setEditingSubCategory(null);
  };

  const handleToggleActive = (id: string) => {
    setSubCategories(
      subCategories.map((subCat) =>
        subCat.id === id ? { ...subCat, active: !subCat.active } : subCat
      )
    );
  };

  const getParentCategoryName = (categoryId: string) => {
    return INITIAL_CATEGORIES.find((cat) => cat.id === categoryId)?.name || 'Unknown';
  };

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
                  value={newParentCategoryId}
                  onChange={(e) => setNewParentCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {INITIAL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category Name</label>
                <input
                  type="text"
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                  placeholder="Enter sub category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                <input
                  type="text"
                  value={newSubCategoryEmoji}
                  onChange={(e) => setNewSubCategoryEmoji(e.target.value)}
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
        {subCategories.map((subCategory) => (
          <div
            key={subCategory.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{subCategory.image}</div>
              <button
                onClick={() => handleToggleActive(subCategory.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  subCategory.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {subCategory.active ? 'Active' : 'Inactive'}
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{subCategory.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Parent: {getParentCategoryName(subCategory.parentCategoryId)}
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
          </div>
        ))}
      </div>

      {/* Edit Sub Category Modal */}
      {editingSubCategory && (
        <EditSubCategoryModal
          subCategory={editingSubCategory}
          onClose={() => setEditingSubCategory(null)}
          onSave={handleUpdateSubCategory}
        />
      )}
    </div>
  );
}
