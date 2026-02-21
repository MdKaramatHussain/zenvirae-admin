'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EditOrderStatusModal from './EditOrderStatusModal'
import { Search, Edit2, Trash2, Loader } from 'lucide-react'

interface Order {
  _id?: string
  id?: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  orderStatus: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed'
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())
const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'packed', label: 'Packed', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
]

export default function OrdersManager() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: orders = [], isLoading } = useSWR(
    `/api/orders${filterStatus !== 'all' ? `?status=${filterStatus}` : ''}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleDeleteOrder = async (id: string) => {
    try {
      setLoading(true)
      await fetch(`/api/orders/${id}`, { method: 'DELETE' })
      mutate('/api/orders')
    } catch (error) {
      console.log(' Delete order error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setShowModal(true)
  }

  const handleSaveOrder = async (updatedOrder: Order) => {
    try {
      setLoading(true)
      await fetch(`/api/orders/${editingOrder?._id || editingOrder?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder),
      })
      mutate('/api/orders')
      setShowModal(false)
    } catch (error) {
      console.log(' Save order error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    return ORDER_STATUSES.find((s) => s.value === status)?.color || ''
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o: Order) => o.orderStatus === 'pending').length,
    delivered: orders.filter((o: Order) => o.orderStatus === 'delivered').length,
    totalValue: orders.reduce((sum: number, o: Order) => sum + o.totalAmount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Orders</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <span className="text-2xl">📦</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <span className="text-2xl">⏳</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Delivered</p>
                <p className="text-3xl font-bold text-green-900">{stats.delivered}</p>
              </div>
              <span className="text-2xl">✅</span>
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
              <span className="text-2xl">💰</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-2xl">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number or customer..."
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
                {ORDER_STATUSES.map((status) => (
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
                      Order
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-sm text-foreground">
                      Customer
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-sm text-foreground">
                      Amount
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-sm text-foreground">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-sm text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order: Order) => (
                    <tr
                      key={order._id || order.id}
                      className="border-b border-muted hover:bg-muted/30 transition"
                    >
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">{order.orderNumber}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm text-foreground">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="font-semibold text-foreground">₹{order.totalAmount.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                          {ORDER_STATUSES.find((s) => s.value === order.orderStatus)?.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="p-2 hover:bg-muted rounded-lg transition text-primary hover:text-primary/80"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id || order.id || '')}
                            className="p-2 hover:bg-muted rounded-lg transition text-destructive hover:text-destructive/80"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No orders found.</p>
              </div>
            )}

            <div className="text-sm text-muted-foreground pt-4">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        </CardContent>
      </Card>

      {showModal && editingOrder && (
        <EditOrderStatusModal
          order={editingOrder}
          onSave={handleSaveOrder}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
