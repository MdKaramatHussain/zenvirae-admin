// Users Data
export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: UserStatus;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  avatar: string;
}

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '+1 234-567-8900',
    status: 'Active',
    joinDate: '2023-06-15',
    totalOrders: 12,
    totalSpent: 45230,
    avatar: '👨‍💼',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    mobile: '+1 234-567-8901',
    status: 'Active',
    joinDate: '2023-07-20',
    totalOrders: 8,
    totalSpent: 32100,
    avatar: '👩‍💼',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    mobile: '+1 234-567-8902',
    status: 'Active',
    joinDate: '2023-08-10',
    totalOrders: 15,
    totalSpent: 67890,
    avatar: '👨',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    mobile: '+1 234-567-8903',
    status: 'Inactive',
    joinDate: '2023-09-05',
    totalOrders: 3,
    totalSpent: 8500,
    avatar: '👩',
  },
  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    mobile: '+1 234-567-8904',
    status: 'Active',
    joinDate: '2023-10-12',
    totalOrders: 5,
    totalSpent: 19200,
    avatar: '👨‍🦱',
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily@example.com',
    mobile: '+1 234-567-8905',
    status: 'Suspended',
    joinDate: '2023-11-22',
    totalOrders: 2,
    totalSpent: 5600,
    avatar: '👩‍🦰',
  },
];

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  'Active': '#10b981',
  'Inactive': '#f59e0b',
  'Suspended': '#ef4444',
};

export const USER_STATUS_BG_COLORS: Record<UserStatus, string> = {
  'Active': '#d1fae5',
  'Inactive': '#fef3c7',
  'Suspended': '#fee2e2',
};
