"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const activityLogSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    module: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('ActivityLog', activityLogSchema);
//# sourceMappingURL=ActivityLog.js.map