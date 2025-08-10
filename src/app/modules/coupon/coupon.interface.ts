export interface ICoupon {
    code: string;
    discountPercentage: number;
    expiryDate: Date;
    isActive: boolean;
    isDeleted?: boolean;
}
