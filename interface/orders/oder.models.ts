
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