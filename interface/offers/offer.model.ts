// Offers/Coupons Data
interface Offer {
    id: string;
    _id?: string;
    code: string;
    description: string;
    discountType: 'flat' | 'percentage';
    discountValue: number | null;
    startDate: string;
    validUntil: string;
    status: 'active' | 'inactive';
    applicableCategories?: string[];
    minOrderValue?: number;
    usedCount: number;
    maxUses: number;
}