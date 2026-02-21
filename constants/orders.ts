// Orders Data
export type OrderStatus = 'Pending' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  amount: number;
  status: OrderStatus;
  date: string;
  items: number;
  paymentMethod: string;
  shippingAddress: string;
}

export const INITIAL_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001234',
    userId: '1',
    userName: 'John Doe',
    amount: 5840,
    status: 'Delivered',
    date: '2024-01-15',
    items: 3,
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Main St, City, Country',
  },
  {
    id: '2',
    orderNumber: 'ORD-001235',
    userId: '2',
    userName: 'Jane Smith',
    amount: 3200,
    status: 'Shipped',
    date: '2024-01-16',
    items: 2,
    paymentMethod: 'Debit Card',
    shippingAddress: '456 Oak Ave, Town, Country',
  },
  {
    id: '3',
    orderNumber: 'ORD-001236',
    userId: '3',
    userName: 'Mike Johnson',
    amount: 7650,
    status: 'Processing',
    date: '2024-01-17',
    items: 5,
    paymentMethod: 'PayPal',
    shippingAddress: '789 Pine Rd, Village, Country',
  },
  {
    id: '4',
    orderNumber: 'ORD-001237',
    userId: '4',
    userName: 'Sarah Williams',
    amount: 2100,
    status: 'Packed',
    date: '2024-01-18',
    items: 1,
    paymentMethod: 'Credit Card',
    shippingAddress: '321 Elm St, Metro, Country',
  },
  {
    id: '5',
    orderNumber: 'ORD-001238',
    userId: '5',
    userName: 'Tom Brown',
    amount: 4500,
    status: 'Pending',
    date: '2024-01-19',
    items: 4,
    paymentMethod: 'Net Banking',
    shippingAddress: '654 Maple Dr, Borough, Country',
  },
];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  'Pending': '#f59e0b',
  'Processing': '#3b82f6',
  'Packed': '#8b5cf6',
  'Shipped': '#06b6d4',
  'Delivered': '#10b981',
  'Cancelled': '#ef4444',
};

export const STATUS_BG_COLORS: Record<OrderStatus, string> = {
  'Pending': '#fef3c7',
  'Processing': '#dbeafe',
  'Packed': '#ede9fe',
  'Shipped': '#cffafe',
  'Delivered': '#d1fae5',
  'Cancelled': '#fee2e2',
};
