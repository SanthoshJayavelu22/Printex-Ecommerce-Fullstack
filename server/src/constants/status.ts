export const ORDER_STATUS = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    RETURNED: 'Returned'
} as const;

export const PAYMENT_STATUS = {
    PENDING: 'Pending',
    PAID: 'Paid',
    FAILED: 'Failed',
    REFUNDED: 'Refunded'
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
