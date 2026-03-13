import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../constants/roles';

export interface IAddress {
    address: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone: string;
    addressType: 'Home' | 'Office';
    isDefault: boolean;
}

export interface IUser extends Document {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    phoneNumber?: string;
    profilePicture?: string;
    addresses: IAddress[];
    wishlist: mongoose.Types.ObjectId[];
    otp?: string | null;
    otpExpire?: Date | null;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: [ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
        default: ROLES.USER
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String
    },
    addresses: [
        {
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
            },
            isDefault: {
                type: Boolean,
                default: false
            }
        }
    ],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    otp: {
        type: String,
        default: null
    },
    otpExpire: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) { // Added 'next' parameter for explicit middleware signature
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    if (this.password) {
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password || '');
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
