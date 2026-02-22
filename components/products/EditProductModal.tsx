'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import {EditProductModalProps, Product } from '@/interface/common/product.modal'
import { Category, SubCategory } from '@/interface/common/category.models'

export function EditProductModal({ product, onSave, onClose, categories, subCategories }: EditProductModalProps) {
  const [formData, setFormData] = useState<Product>(
    product || {
      name: '',
      sku: '',
      category: '',
      subCategory: '',
      material: '',
      discount: 0,
      status: 'draft',
      colors: [],
      sizes: [],
      tags: [],
      description: '',
      image: '',
    }
  )

  const [colorInput, setColorInput] = useState('')
  const [sizeInput, setSizeInput] = useState('')
  const [tagInput, setTagInput] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' || name === 'stock' || name === 'discount' ? Number(value) : value,
    }))
  }

  const handleAddColor = () => {
    if (colorInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }))
      setColorInput('')
    }
  }

  const handleRemoveColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }))
  }

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()],
      }))
      setSizeInput('')
    }
  }

  const handleRemoveSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const handleSave = () => {
    if (formData.name && formData.sku && formData.category) {
      onSave(formData)
    } else {
      alert('Please fill in name, SKU, and category')
    }
  }
  //filtering sub-categories based on selected category
  subCategories = subCategories.filter((subCat) => subCat.categoryName === formData.category)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full p-6 border border-muted animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Product name"
                className="bg-input border-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">SKU *</label>
              <Input
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Product SKU"
                className="bg-input border-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-muted rounded-lg bg-input text-foreground"
              >
                <option value="">---Select Category---</option>
                {
                  categories.map((cat: Category, index: number) => (
                    <option key={index} value={cat.name}>{cat.name}</option>
                  ))
                }
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Sub-Category</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-muted rounded-lg bg-input text-foreground"
              >
                {subCategories.length === 0 &&
                  <option value="">---No sub-categories---</option>
                }
                {
                  subCategories.map((subCat: SubCategory) => (
                    <option key={subCat._id} value={subCat.name}>{subCat.name}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Material</label>
              <Input
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="Material"
                className="bg-input border-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-muted rounded-lg bg-input text-foreground"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Price (₹)</label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="bg-input border-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Original Price</label>
              <Input
                name="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="Original price"
                className="bg-input border-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Stock</label>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="Stock"
                className="bg-input border-muted"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Product description"
              rows={3}
              className="w-full px-3 py-2 border border-muted rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Colors</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="Add color"
                className="bg-input border-muted flex-1"
              />
              <Button onClick={handleAddColor} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, index) => (
                <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                  <span className="text-sm text-foreground">{color}</span>
                  <button onClick={() => handleRemoveColor(index)} className="text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Sizes</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                placeholder="Add size"
                className="bg-input border-muted flex-1"
              />
              <Button onClick={handleAddSize} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map((size, index) => (
                <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                  <span className="text-sm text-foreground">{size}</span>
                  <button onClick={() => handleRemoveSize(index)} className="text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                className="bg-input border-muted flex-1"
              />
              <Button onClick={handleAddTag} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                  <span className="text-sm text-foreground">{tag}</span>
                  <button onClick={() => handleRemoveTag(index)} className="text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-muted pt-6 flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              {product ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
