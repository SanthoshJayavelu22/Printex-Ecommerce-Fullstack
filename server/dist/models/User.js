"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const roles_1 = require("../constants/roles");
const userSchema = new mongoose_1.Schema({
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
        enum: [roles_1.ROLES.USER, roles_1.ROLES.ADMIN, roles_1.ROLES.SUPER_ADMIN],
        default: roles_1.ROLES.USER
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
            type: mongoose_1.default.Schema.Types.ObjectId,
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
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    if (this.password) {
        this.password = await bcryptjs_1.default.hash(this.password, salt);
    }
});
// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password || '');
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map