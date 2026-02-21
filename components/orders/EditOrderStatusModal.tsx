'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

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

interface EditOrderStatusModalProps {
  order: Order
  onClose: () => void
  onSave: (order: Order) => void
}

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'packed', label: 'Packed', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
]

export default function EditOrderStatusModal({ order, onClose, onSave }: EditOrderStatusModalProps) {
  const [newStatus, setNewStatus] = useState<Order['orderStatus']>(order.orderStatus)

  const handleSave = () => {
    onSave({
      ...order,
      orderStatus: newStatus,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-xl shadow-xl max-w-md w-full p-6 border border-muted animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-serif font-bold text-foreground mb-2">Update Order Status</h2>
        <p className="text-sm text-muted-foreground mb-4">Order: {order.orderNumber}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Select New Status</label>
            <div className="space-y-2">
              {ORDER_STATUSES.map((status) => (
                <div key={status.value} className="flex items-center">
                  <input
                    type="radio"
                    id={status.value}
                    name="status"
                    value={status.value}
                    checked={newStatus === status.value}
                    onChange={(e) => setNewStatus(e.target.value as Order['orderStatus'])}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor={status.value} className="ml-3 cursor-pointer flex-1 flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-muted pt-4 flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
