// Dashboard Statistics

// export const DASHBOARD_STATS = {
//   totalActiveUsers: {
//     value: 12543,
//     label: 'Total Active Users',
//     icon: '👥',
//     trend: '+12.5%',
//     color: '#3b82f6',
//   },
//   todaySales: {
//     value: '$24,580',
//     label: "Today's Sales",
//     icon: '💰',
//     trend: '+8.2%',
//     color: '#10b981',
//   },
//   totalOrders: {
//     value: 3847,
//     label: 'Total Orders',
//     icon: '📦',
//     trend: '+5.3%',
//     color: '#f59e0b',
//   },
//   totalRevenue: {
//     value: '$2,453,890',
//     label: 'Total Revenue',
//     icon: '💵',
//     trend: '+15.7%',
//     color: '#e11d48',
//   },
//   activeCategories: {
//     value: 24,
//     label: 'Active Categories',
//     icon: '📂',
//     trend: '+2',
//     color: '#8b5cf6',
//   },
//   activeOffers: {
//     value: 8,
//     label: 'Active Offers',
//     icon: '🎟️',
//     trend: '+1',
//     color: '#06b6d4',
//   },
// };

export const SIDEBAR_MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', href: '/dashboard' },
  { id: 'carousel', label: 'Home Carousel', icon: '🖼️', href: '/carousel' },
  { id: 'products', label: 'Products', icon: '👕', href: '/products' },
  { id: 'categories', label: 'Categories', icon: '📂', href: '/categories' },
  { id: 'sub-categories', label: 'Sub Categories', icon: '🏷️', href: '/sub-categories' },
  { id: 'offers', label: 'Offers / Coupons', icon: '🎟️', href: '/offers' },
  { id: 'orders', label: 'Orders', icon: '📦', href: '/orders' },
  { id: 'users', label: 'Users', icon: '👤', href: '/users' },
  { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings' },
];
export const RECENT_INFO = [
  {
    id: "r-1",
    title: "New Order Placed",
    description: "Order #1234 has been placed by John Doe.",
    timestamp: "2 hours ago",
    icon: "📦",
  },
  {
    id: "r-2",
    title: "New User Registered",
    description: "Sarah Johnson has registered.",
    timestamp: "2 minutes ago",
    icon: "👤",
  },
  {
    id: "r-3",
    title: "New Product Added",
    description: "A new product has been added to the catalog.",
    timestamp: "15 minutes ago",
    icon: "➕",
  },
  {
    id: "r-4",
    title: "Payment Received",
    description: "Payment for order #1234 has been received.",
    timestamp: "10 minutes ago",
    icon: "💰",
  }
]
