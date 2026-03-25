import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    selectedSize?: string;
    selectedShape?: string;
    selectedMaterial?: string;
    selectedFinish?: string; // Keep for legacy compatibility
    image?: string;
    designUrl?: string;
    needsDesign: boolean;
}

export interface IShippingAddress {
    address: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone: string;
    addressType: 'Home' | 'Office';
}

export interface IPaymentInfo {
    id?: string; // Standard transaction ID
    status: string;
    method: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
}

export interface ICouponInfo {
    code: string;
    discount: number;
}

export interface IDeliveryTracking {
    trackingNumber?: string;
    courierName?: string;
    trackingUrl?: string;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentInfo: IPaymentInfo;
    totalAmount: number;
    coupon?: ICouponInfo;
    orderStatus: 'Pending' | 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Rejected';
    deliveryTracking?: IDeliveryTracking;
    deliveredAt?: Date;
}

const orderSchema: Schema<IOrder> = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        selectedSize: { type: String },
        selectedShape: { type: String },
        selectedMaterial: { type: String },
        selectedFinish: { type: String },
        image: { type: String },
        designUrl: { type: String },
        needsDesign: { type: Boolean, default: false }
    }],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
        addressType: { 
            type: String, 
            enum: ['Home', 'Office'], 
            default: 'Home' 
        }
    },
    paymentInfo: {
        id: { type: String },
        status: { type: String, default: 'Pending' },
        method: { type: String, default: 'COD' },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String }
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    coupon: {
        code: String,
        discount: Number
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing',
        enum: ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Rejected'],
        index: true
    },
    deliveryTracking: {
        trackingNumber: { type: String },
        courierName: { type: String },
        trackingUrl: { type: String }
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
