'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { LogOut, Loader } from 'lucide-react'
import { toast } from 'sonner'

export function LogoutButton() {
  const { logout, user } = useAuth()
  const [showDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    } finally {
      setIsLoading(false)
      setShowDialog(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant="outline"
        size="sm"
        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You'll need to login again to access the admin
              dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm text-blue-900">
              Logged in as: <strong>{user?.email}</strong>
            </span>
          </div>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                'Logout'
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
