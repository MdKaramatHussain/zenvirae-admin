'use client'

import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Dialog } from '@/components/ui/dialog'

interface OrderItem {
    productId: string
    name: string
    quantity: number
    price: number
    _id?: any
}

interface Order {
    orderNumber: string
    customerName: string
    customerEmail?: string
    customerPhone?: string
    items: OrderItem[]
    totalAmount: number
    paymentStatus: string
    orderStatus: string
    shippingAddress?: string
    createdAt?: any
    updatedAt?: any
}

interface ViewOrderModalParams {
    orderID: string | null
    onClose: () => void
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatDate(d: any) {
    if (!d) return ''
    try {
        const raw = typeof d === 'string' ? d : d?.$date ? d.$date : d
        return new Date(raw).toLocaleString()
    } catch {
        return ''
    }
}

export function ViewOrderModal({ orderID, onClose }: ViewOrderModalParams) {
    const id = orderID
    const { data: orderData, isLoading } = useSWR<Order>(`/api/orders/${id}`, fetcher, {
        revalidateOnFocus: false,
    })

    if (isLoading) {
        return (
            <div className="p-6">
                <p>Loading order...</p>
            </div>
        )
    }

    if (!orderData) {
        return (
            <div className="p-6">
                <p>Order not found.</p>
                <div className="mt-4">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        )
    }

    return (
        <Dialog open={!!orderID} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-6" showCloseButton={true}>
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>Order: {orderData.orderNumber}</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <h3 className="font-medium">Customer</h3>
                        <p className="font-semibold">{orderData.customerName}</p>
                        {orderData.customerEmail && <p className="text-sm">{orderData.customerEmail}</p>}
                        {orderData.customerPhone && <p className="text-sm">{orderData.customerPhone}</p>}
                    </div>

                    <div>
                        <h3 className="font-medium">Shipping</h3>
                        <p className="font-semibold">{orderData.shippingAddress || '—'}</p>
                        <p className="text-sm">Created: {formatDate(orderData.createdAt)}</p>
                        <p className="text-sm">Updated: {formatDate(orderData.updatedAt)}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Items</h3>
                    {orderData.items?.map((item, idx) => (
                        <div key={item._id?.$oid || item._id || idx} className="border rounded-lg p-4 mb-3 bg-muted">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm">Product ID: {item.productId}</p>
                                </div>
                                <div className="text-right">
                                    <p>Qty: {item.quantity}</p>
                                    <p>Price: ₹{item.price}</p>
                                    <p className="font-semibold">Subtotal: ₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between">
                        <p className="font-medium">Total Amount</p>
                        <p className="font-semibold">₹{orderData.totalAmount}</p>
                    </div>
                    <div className="flex justify-between mt-2">
                        <p className="text-sm">Payment Status</p>
                        <p className="text-sm font-medium">{orderData.paymentStatus}</p>
                    </div>
                    <div className="flex justify-between mt-2">
                        <p className="text-sm">Order Status</p>
                        <p className="text-sm font-medium">{orderData.orderStatus}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
