'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import EditUserModal from './EditUserModal'
import { Search, Edit2, Trash2, Loader } from 'lucide-react'
import { DeleteAlert } from '../common/deleteAlter'
import { fetcher } from '@/lib/utils'

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

export default function UsersManager() {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const { data: users = [], isLoading } = useSWR('/api/users', fetcher, {
    revalidateOnFocus: false,
  })

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      setLoading(true)
      await fetch(`/api/users/${editingUser?._id || editingUser?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      })
      mutate('/api/users')
      setShowModal(false)
    } catch (error) {
      console.log(' Update user error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      setLoading(true)
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
      mutate('/api/users')
    } catch (error) {
      console.log(' Delete user error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (user: User) => {
    const statuses = ['active', 'inactive', 'suspended']
    const currentIndex = statuses.indexOf(user.status)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length] as 'active' | 'inactive' | 'suspended'
    try {
      setLoading(true)
      await fetch(`/api/users/${user._id || user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, status: nextStatus }),
      })
      mutate('/api/users')
    } catch (error) {
      console.log(' Toggle status error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  )

  const totalSpent = users.reduce((sum: number, user: User) => sum + user.totalSpent, 0)
  const avgSpent = users.length > 0 ? Math.round(totalSpent / users.length) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-1">Manage all customer users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-blue-600">Total Users</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{users.length}</p>
            <p className="text-xs text-blue-600 mt-2">
              Active: {users.filter((u: User) => u.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-green-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-900 mt-1">₹{(totalSpent / 100000).toFixed(1)}L</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-purple-600">Average Spending</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">₹{avgSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-2xl">Users Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/30 border-muted"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-muted bg-muted/40">
                    <th className="text-left px-4 py-3 font-semibold text-sm text-foreground">User</th>
                    <th className="text-left px-4 py-3 font-semibold text-sm text-foreground">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-sm text-foreground">Phone</th>
                    <th className="text-center px-4 py-3 font-semibold text-sm text-foreground">Orders</th>
                    <th className="text-right px-4 py-3 font-semibold text-sm text-foreground">Spent</th>
                    <th className="text-center px-4 py-3 font-semibold text-sm text-foreground">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-sm text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: User) => (
                    <tr key={user._id || user.id} className="border-b border-muted hover:bg-muted/30 transition">
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">{user.name}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{user.phone}</td>
                      <td className="px-4 py-4 text-center text-sm text-foreground">{user.totalOrders}</td>
                      <td className="px-4 py-4 text-right font-semibold text-foreground">
                        ₹{user.totalSpent.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'inactive'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingUser(user)
                              setShowModal(true)
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition text-primary hover:text-primary/80"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {/* <button
                            onClick={() => handleDeleteUser(user._id || user.id || '')}
                            className="p-2 hover:bg-muted rounded-lg transition text-destructive hover:text-destructive/80"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button> */}
                          <DeleteAlert
                            id={user.id || user.phone}
                            onConfirm={() => handleDeleteUser(user._id || user.id || '')}
                            css="p-2 hover:bg-muted rounded-lg transition text-destructive hover:text-destructive/80"
                            title="Delete"
                            data={
                              `${user.name} (${user.email})`
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No users found.</p>
              </div>
            )}

            <div className="text-sm text-muted-foreground pt-4">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </CardContent>
      </Card>

      {showModal && editingUser && (
        <EditUserModal user={editingUser} onClose={() => setShowModal(false)} onSave={handleUpdateUser} />
      )}
    </div>
  )
}
