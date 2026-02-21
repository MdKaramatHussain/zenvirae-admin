'use client';

import { useState } from 'react';
import { SubCategory } from '@/constants/categories';
import { INITIAL_CATEGORIES } from '@/constants/categories';

interface EditSubCategoryModalProps {
  subCategory: SubCategory;
  onClose: () => void;
  onSave: (subCategory: SubCategory) => void;
}

export default function EditSubCategoryModal({
  subCategory,
  onClose,
  onSave,
}: EditSubCategoryModalProps) {
  const [name, setName] = useState(subCategory.name);
  const [image, setImage] = useState(subCategory.image);
  const [active, setActive] = useState(subCategory.active);
  const [parentCategoryId, setParentCategoryId] = useState(subCategory.parentCategoryId);

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        ...subCategory,
        name,
        image,
        active,
        parentCategoryId,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Sub Category</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
            <select
              value={parentCategoryId}
              onChange={(e) => setParentCategoryId(e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Icon</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            />
            <label className="text-sm font-medium text-gray-700 cursor-pointer">
              Active Sub Category
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
