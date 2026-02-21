'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import EditCategoryModal from './EditCategoryModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Trash2, Loader } from 'lucide-react'

interface Category {
  _id?: string
  id?: string
  name: string
  icon: string
  description: string
  status: 'active' | 'inactive'
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CategoryManager() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryIcon, setNewCategoryIcon] = useState('📂')
  const [loading, setLoading] = useState(false)

  const { data: categories = [], isLoading } = useSWR('/api/categories', fetcher, {
    revalidateOnFocus: false,
  })

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        setLoading(true)
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newCategoryName,
            icon: newCategoryIcon,
            description: '',
            status: 'active',
          }),
        })
        mutate('/api/categories')
        setNewCategoryName('')
        setNewCategoryIcon('📂')
        setShowAddModal(false)
      } catch (error) {
        console.log(' Add category error:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      setLoading(true)
      await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      mutate('/api/categories')
    } catch (error) {
      console.log(' Delete category error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (category: Category) => {
    try {
      setLoading(true)
      const newStatus = category.status === 'active' ? 'inactive' : 'active'
      await fetch(`/api/categories/${category._id || category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...category, status: newStatus }),
      })
      mutate('/api/categories')
    } catch (error) {
      console.log(' Toggle category error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage product categories</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl max-w-md w-full p-6 border border-muted">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4">Add New Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Category Name
                </label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="bg-input border-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Icon</label>
                <Input
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  placeholder="Enter emoji or icon"
                  maxLength={2}
                  className="bg-input border-muted"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCategory}
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Add'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category: Category) => (
          <Card key={category._id || category.id} className="bg-card border-muted hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{category.icon}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteCategory(category._id || category.id || '')}
                    className="p-2 hover:bg-muted rounded-lg transition text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-serif font-bold text-foreground text-lg">{category.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition ${
                    category.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {category.status === 'active' ? 'Active' : 'Inactive'}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-muted">
          <p className="text-muted-foreground text-lg">No categories found. Create one to get started!</p>
        </div>
      )}
    </div>
  )
}
