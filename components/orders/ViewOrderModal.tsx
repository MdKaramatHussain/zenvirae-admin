'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { EditProductModalProps, Product } from '@/interface/common/product.modal'
import { Category, SubCategory } from '@/interface/common/category.models'
import useSWR from 'swr'
const product = {
    name: "Cashmere Sweaters",
    sku: "CS-002",
    category: "Women",
    subCategory: "Dresses",
    material: "Cashmere",
    price: 4500,
    originalPrice: 6000,
    discount: 25,
    stock: 30,
    status: 'active',
    colors: [
        "White",
        "Beige",
        "Black"
    ],
    sizes: [
        "XS",
        "S",
        "M",
        "L"
    ],
    tags: [
        "Luxury",
        "Winter"
    ],
    description: "Soft cashmere sweater for warmth and style",
    createdAt: "2026-02-21T01:13:07.136Z",
    updatedAt: "2026-02-22T05:02:16.947Z",
    image: "",
}
interface ViewOrderModalParams {
    onClose: () => void
}
const fetcher = (url: string) => fetch(url).then((res) => res.json())
export function ViewOrderModal({ onClose }: ViewOrderModalParams) {
    const [formData, setFormData] = useState<Product>({
        name: '',
        sku: '',
        category: '',
        subCategory: '',
        material: '',
        discount: 0,
        status: 'draft',
        colors: [],
        sizes: [],
        tags: [],
        description: '',
        image: '',
    }
    )

    const [colorInput, setColorInput] = useState('')
    const [sizeInput, setSizeInput] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [order, setOrder] = useState<Order | null>(null)
    const id = "699c2d18ba828234cc5ab83b"
    const { data: orderData = [], isLoading } = useSWR(
        `/api/orders/${id}`,
        fetcher,
        { revalidateOnFocus: false }
    )
    console.log(orderData)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'price' || name === 'originalPrice' || name === 'stock' || name === 'discount' ? Number(value) : value,
        }))
    }

    const handleAddColor = () => {
        if (colorInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                colors: [...prev.colors, colorInput.trim()],
            }))
            setColorInput('')
        }
    }

    const handleRemoveColor = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index),
        }))
    }

    const handleAddSize = () => {
        if (sizeInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                sizes: [...prev.sizes, sizeInput.trim()],
            }))
            setSizeInput('')
        }
    }

    const handleRemoveSize = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index),
        }))
    }

    const handleAddTag = () => {
        if (tagInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }))
            setTagInput('')
        }
    }

    const handleRemoveTag = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index),
        }))
    }
    return (
        <>
            {
                isLoading && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Customer</label>
                                <p className="font-semibold">{orderData.customerName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Order Number</label>
                                <p className="font-semibold">{orderData.orderNumber}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-3">Ordered Products</h3>

                            {orderData?.items?.map((item) => (
                                <div
                                    key={item.productId}
                                    className="border rounded-lg p-4 mb-3 bg-muted"
                                >
                                    <p className="font-semibold">{item.name}</p>
                                    <p>Product ID: {item.productId}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ₹{item.price}</p>
                                    <p className="font-semibold">
                                        Subtotal: ₹{item.price * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <p>Total Amount: ₹{orderData.totalAmount}</p>
                            <p>Payment Status: {orderData.paymentStatus}</p>
                            <p>Order Status: {orderData.orderStatus}</p>
                        </div>
                    </>
                )
            }
        </>
    )
}
