# Postman API Testing Guide & Dummy Data

This guide contains the endpoints and example data for testing your new backend features.

> [!NOTE] 
> Replace `{{URL}}` with `http://localhost:5000/api` (or your actual server URL).
> For protected routes, you must include the JWT token in the `Authorization` header as `Bearer <token>`.

---

## 1. Authentication & Profile
| Action | Method | Endpoint |
| :--- | :--- | :--- |
| Register | POST | `{{URL}}/auth/register` |
| Login | POST | `{{URL}}/auth/login` |
| Get My Profile | GET | `{{URL}}/auth/me` |
| Update Profile | PUT | `{{URL}}/auth/updateprofile` |
| Add Address | POST | `{{URL}}/auth/address` |

### Dummy Data: Register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Dummy Data: Add Address
```json
{
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "phone": "9876543210",
  "addressType": "Home"
}
```

---

## 2. Product & Category Management
| Action | Method | Endpoint |
| :--- | :--- | :--- |
| Create Category | POST | `{{URL}}/categories` |
| Get All Categories | GET | `{{URL}}/categories` |
| Get All Products | GET | `{{URL}}/products?page=1&limit=10` |
| Search Products | GET | `{{URL}}/products?name=Sticker` |
| Filter by Price | GET | `{{URL}}/products?pricePerUnit[gte]=100` |
| Add Review | POST | `{{URL}}/products/:productId/reviews` |

### Dummy Data: Create Category (Admin Only)
```json
{
  "name": "Wall Stickers",
  "description": "Premium vinyl wall stickers for interior design.",
  "subCategories": ["Floral", "Abstract", "Kids"]
}
```

### Dummy Data: Add Product (Admin Only)
> [!IMPORTANT]
> This requires `multipart/form-data`. Fields: `name`, `description`, `category` (ID), `pricePerUnit`, `stock`, `mainImage` (File).

---

## 3. Orders & Checkout
| Action | Method | Endpoint |
| :--- | :--- | :--- |
| Checkout (COD) | POST | `{{URL}}/orders` |
| Checkout (Razorpay) | POST | `{{URL}}/orders` |
| Get My Orders | GET | `{{URL}}/orders/myorders` |

### Dummy Data: Checkout (COD)
```json
{
  "shippingAddress": {
    "address": "123 Main St",
    "city": "Mumbai",
    "postalCode": "400001",
    "country": "India",
    "phone": "9876543210"
  },
  "paymentMethod": "COD",
  "couponCode": "SUMMER10"
}
```

### Dummy Data: Checkout (Razorpay)
```json
{
  "shippingAddress": { ... },
  "paymentMethod": "Razorpay"
}
```
*Note: This will return a `razorpayOrder` object containing an `id` that the frontend uses to open the Razorpay payment modal.*

---

## 4. Admin Analytics
| Action | Method | Endpoint |
| :--- | :--- | :--- |
| Dashboard Stats | GET | `{{URL}}/admin/stats` |
| Low Stock Alert | GET | `{{URL}}/admin/low-stock` |

---

## 5. Coupon System
| Action | Method | Endpoint |
| :--- | :--- | :--- |
| Create Coupon | POST | *(I can add a route for this if needed)* |

### Dummy Data: Create Coupon (Direct DB or via Admin Route)
```json
{
  "code": "SUMMER10",
  "discountType": "percentage",
  "discountValue": 10,
  "minPurchase": 500,
  "expiresAt": "2026-12-31T23:59:59Z"
}
```
