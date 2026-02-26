'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import { Loader } from 'lucide-react'
import { RECENT_INFO } from '@/constants/dashboard'
import Link from 'next/link'

export default function DashboardPage() {
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        console.log(data)
        setStatsData(data)
      } catch (error) {
        console.log('error from /dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  const stats = [
    {
      icon: '👥',
      label: 'Total Users',
      value: statsData?.totalUsers || 0,
      trend: '+12%',
      color: 'from-blue-50 to-blue-100 border-blue-200',
      path: '/users',
    },
    {
      icon: '📦',
      label: 'Total Orders',
      value: statsData?.totalOrders || 0,
      trend: '+8%',
      color: 'from-green-50 to-green-100 border-green-200',
      path: '/orders',
    },
    {
      icon: '💰',
      label: 'Total Revenue',
      value: `₹${((statsData?.totalRevenue || 0) / 100000).toFixed(1)}L`,
      trend: '+15%',
      color: 'from-purple-50 to-purple-100 border-purple-200',
      path: '/dashboard',
    },
    {
      icon: '🏷️',
      label: 'Categories',
      value: statsData?.totalCategories || 0,
      trend: '+2%',
      color: 'from-orange-50 to-orange-100 border-orange-200',
      path: '/categories',
    },
    {
      icon: '🎁',
      label: 'Active Offers',
      value: statsData?.totalOffers || 0,
      trend: '+5%',
      color: 'from-pink-50 to-pink-100 border-pink-200',
      path: '/offers',
    },
    {
      icon: '👕',
      label: 'Products',
      value: statsData?.totalProducts || 0,
      trend: '+3%',
      color: 'from-indigo-50 to-indigo-100 border-indigo-200',
      path: '/products',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your business overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Link href={stat.path}
              key={stat.label}>
              <StatCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                trend={stat.trend}
                color={stat.color}
              />
            </Link>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-card rounded-xl shadow-md border border-muted p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {
              RECENT_INFO.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
