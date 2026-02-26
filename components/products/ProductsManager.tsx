'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { PRODUCT_STATUSES } from '@/constants/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditProductModal } from './EditProductModal'
import {
  Trash2,
  Edit2,
  Search,
  Plus,
  Eye,
  EyeOff,
  TrendingUp,
  Loader,
} from 'lucide-react'
import { Product } from '@/interface/common/product.modal'
import { DeleteAlert } from '../common/deleteAlter'
import { fetcher } from '@/lib/utils'



export function ProductsManager() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: products = [], isLoading } = useSWR(
    `/api/products${filterStatus !== 'all' ? `?status=${filterStatus}` : ''}`,
    fetcher,
    { revalidateOnFocus: false }
  )
  //fetching categories
  const { data: categories = [] } = useSWR(
    '/api/categories?status=active',
    fetcher,
    { revalidateOnFocus: false }
  )
  //fetching sub-categories
  const { data: subCategories = [] } = useSWR(
    '/api/sub-categories?status=active',
    fetcher,
    { revalidateOnFocus: false }
  )
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (response.status === 200) {
        mutate('/api/products')
      } else {
        console.log("unable to delete product:", response.status)
      }
    } catch (error) {
      console.log(' Delete error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      setLoading(true)
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct._id || editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        })
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        })
      }
      mutate('/api/products')
      setShowModal(false)
    } catch (error) {
      console.log(' Save error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (product: Product) => {
    const newStatus =
      product.status === 'active'
        ? 'inactive'
        : product.status === 'inactive'
          ? 'draft'
          : 'active'
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, status: newStatus }),
      })
      if (response.status === 200) {
        mutate('/api/products')
      } else {
        console.log("unable to update product status:", response.status)
      }
    } catch (error) {
      console.log('error from handleToggleStatus:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    return PRODUCT_STATUSES.find((s) => s.value === status)?.color || ''
  }
  const stats = {
    total: products.length,
    active: products.filter((p: Product) => p.status === 'active').length,
    inactive: products.filter((p: Product) => p.status === 'inactive').length,
    draft: products.filter((p: Product) => p.status === 'draft').length,
    lowStock: products.filter((p: Product) => (p.stock || 0) < 20).length,
    totalValue: products.reduce((sum: number, p: Product) => sum + (p.price || 0) * (p.stock || 0), 0),
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Products</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">{filterStatus == 'inactive' ? 'Inactive' : filterStatus == 'draft' ? 'Draft' : 'Active'}</p>
                {/* <p className="text-3xl font-bold text-green-900">{stats.active}</p> */}
                <p className="text-3xl font-bold text-green-900">{filterStatus == 'inactive' ? stats.inactive : filterStatus == 'draft' ? stats.draft : stats.active}</p>
              </div>
              <Eye className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Low Stock</p>
                <p className="text-3xl font-bold text-orange-900">
                  {stats.lowStock}
                </p>
              </div>
              <EyeOff className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{(stats.totalValue / 100000).toFixed(1)}L
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-2xl">Products</CardTitle>
          <Button
            onClick={handleAddProduct}
            className="bg-amber-700 hover:bg-amber-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-muted/30 border-muted"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-muted rounded-lg bg-background text-foreground hover:bg-muted/50 transition"
              >
                <option value="all">All Status</option>
                {PRODUCT_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-muted bg-muted/40">
                    <th className="text-left px-4 py-3 font-semibold text-sm text-foreground">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-sm text-foreground">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-sm text-foreground">
                      SKU
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-sm text-foreground">
                      Price
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-sm text-foreground">
                      Stock
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-sm text-foreground">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-sm text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="overflow-y-auto max-h-[5vh]">
                  {
                    loading ? (
                      <tr>
                        <td colSpan={8}>
                          <div className="flex items-center justify-center h-64">
                            <Loader className="w-8 h-8 animate-spin text-primary" />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product: Product, index: number) => (
                        <tr
                          key={index}
                          className="border-b border-muted hover:bg-muted/30 transition"
                        >
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-foreground">
                                {product.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {product.description.substring(0, 30)}...
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-foreground">
                            {product.category} - {product.subCategory}
                          </td>
                          <td className="px-4 py-4 text-sm font-mono text-muted-foreground">
                            {product.sku}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="font-semibold text-foreground">
                              ₹{product.price?.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground line-through">
                              ₹{product.originalPrice?.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${(product.stock || 0) < 20
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-green-100 text-green-800'
                                }`}
                            >
                              {product.stock} pcs
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleToggleStatus(product)}
                              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition ${getStatusColor(
                                product.status
                              )}`}
                            >
                              {PRODUCT_STATUSES.find(
                                (s) => s.value === product.status
                              )?.label}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-2 hover:bg-muted rounded-lg transition text-amber-700 hover:text-amber-900"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {/* <button
                                onClick={() => handleDeleteProduct(product._id as string)}
                                className="p-2 hover:bg-muted rounded-lg transition text-red-600 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button> */}
                              <DeleteAlert
                                id={product.sku}
                                onConfirm={() => handleDeleteProduct(product._id as string)}
                                css="p-2 hover:bg-muted rounded-lg transition text-destructive hover:text-destructive/80"
                                title="Delete"
                                data={
                                  `${product.category} -> ${product.subCategory} -> ${product.name}`
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No products found. Try adjusting your search filters.
                </p>
              </div>
            )}

            <div className="text-sm text-muted-foreground pt-4">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => setShowModal(false)}
          categories={categories}
          subCategories={subCategories}
        />
      )}
    </div>
  )
}
