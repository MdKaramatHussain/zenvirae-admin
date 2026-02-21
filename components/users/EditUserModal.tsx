'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface User {
  _id?: string
  id?: string
  name: string
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive' | 'suspended'
  totalOrders: number
  totalSpent: number
  joinedDate: string
}

interface EditUserModalProps {
  user: User
  onClose: () => void
  onSave: (user: User) => void
}

export default function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [address, setAddress] = useState(user.address)
  const [status, setStatus] = useState<User['status']>(user.status)

  const handleSave = () => {
    if (name.trim() && email.trim() && phone.trim()) {
      onSave({
        ...user,
        name,
        email,
        phone,
        address,
        status,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-xl shadow-xl max-w-md w-full p-6 border border-muted animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-serif font-bold text-foreground mb-4">User Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-input border-muted"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border-muted"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-input border-muted"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Address</label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              className="bg-input border-muted"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as User['status'])}
              className="w-full px-3 py-2 border border-muted rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Stats</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Orders:</span>
              <span className="font-semibold text-foreground">{user.totalOrders}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Spent:</span>
              <span className="font-semibold text-foreground">₹{user.totalSpent.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t border-muted pt-4 flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
