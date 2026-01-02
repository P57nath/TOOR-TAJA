````markdown
# Complete Postman API Testing Checklist

## Base Configuration
- **Base URL:** `http://localhost:5010`
- **Header:** `Content-Type: application/json`
- **Auth:** `Authorization: Bearer <access_token>` for protected routes
---

## 1. Health Check
### GET /products
```
GET http://localhost:5010/products
```
Expected: Empty list or existing products
---

## 2. Auth Flow - Buyer
### 2.1 Register Buyer
```
POST http://localhost:5010/auth/register
Content-Type: application/json
{
  "email": "buyer1@demo.com",
  "password": "StrongPass1",
  "role": "BUYER",
  "buyerProfile": {
    "fullName": "Buyer One",
    "phone": "01700000000"
  }
}
```
### 2.2 Login Buyer
```
POST http://localhost:5010/auth/login
Content-Type: application/json
{
  "email": "buyer1@demo.com",
  "password": "StrongPass1"
}
```
**Action:** Save `access_token` and `refresh_token`

### 2.3 Refresh Token
```
POST http://localhost:5010/auth/refresh
Content-Type: application/json
{
  "refreshToken": "<refresh_token>"
}
```

### 2.4 Logout
```
POST http://localhost:5010/auth/logout
Authorization: Bearer <access_token>
```

### 2.5 Forgot Password (Magic Link)
```
POST http://localhost:5010/auth/password/forgot
Content-Type: application/json
{
  "email": "buyer1@demo.com"
}
```
Expected: Always returns success message.

### 2.6 Reset Password (Magic Link)
```
POST http://localhost:5010/auth/password/reset
Content-Type: application/json
{
  "token": "<token_from_email_link>",
  "password": "NewStrongPass1"
}
```
Expected: Password reset success message.
---
---

## 3. Seller Onboarding
### 3.1 Register Seller
```
POST http://localhost:5010/auth/register
Content-Type: application/json
{
  "email": "seller1@demo.com",
  "password": "StrongPass1",
  "role": "SELLER",
  "sellerProfile": {
    "storeName": "FreshMart"
  }
}
```
### 3.2 Login Seller (Will be forbidden until approved)
```
POST http://localhost:5010/auth/login
Content-Type: application/json
{
  "email": "seller1@demo.com",
  "password": "StrongPass1"
}
```
Expected: Forbidden error (inactive account)
---

## 4. Admin Onboarding
### 4.1 Register Admin (only if ALLOW_ADMIN_SIGNUP=true)
```
POST http://localhost:5010/auth/register
Content-Type: application/json
{
  "email": "admin1@demo.com",
  "password": "StrongPass1",
  "role": "ADMIN",
  "adminProfile": {
    "displayName": "Platform Admin"
  }
}
```
### 4.2 Login Admin
```
POST http://localhost:5010/auth/login
Content-Type: application/json
{
  "email": "admin1@demo.com",
  "password": "StrongPass1"
}
```
**Action:** Save admin `access_token`
---

## 5. Admin APIs
### 5.1 Dashboard
```
GET http://localhost:5010/admin/dashboard
Authorization: Bearer <admin_access_token>
```
### 5.2 List Pending Sellers
```
GET http://localhost:5010/admin/sellers?status=pending
Authorization: Bearer <admin_access_token>
```
**Action:** Copy seller profile ID from response

### 5.3 Approve Seller
```
PATCH http://localhost:5010/admin/sellers/:id/approve
Authorization: Bearer <admin_access_token>
```
Replace `:id` with seller profile ID

### 5.4 Create Category
```
POST http://localhost:5010/admin/categories
Authorization: Bearer <admin_access_token>
Content-Type: application/json
{
  "name": "Fruits"
}
```

### 5.5 Delete Category
```
DELETE http://localhost:5010/admin/categories/:id
Authorization: Bearer <admin_access_token>
```
Replace `:id` with category ID

### 5.6 List All Orders
```
GET http://localhost:5010/admin/orders
Authorization: Bearer <admin_access_token>
```

### 5.7 List Disputes
```
GET http://localhost:5010/admin/disputes
Authorization: Bearer <admin_access_token>
```

### 5.8 Resolve Dispute
```
PATCH http://localhost:5010/admin/disputes/:id/resolve
Authorization: Bearer <admin_access_token>
Content-Type: application/json
{
  "resolutionNote": "Refund issued"
}
```
Replace `:id` with dispute ID
---

## 6. Seller APIs (After Approval)
### 6.1 Login Seller Again
```
POST http://localhost:5010/auth/login
Content-Type: application/json
{
  "email": "seller1@demo.com",
  "password": "StrongPass1"
}
```
**Action:** Save seller `access_token` (should now succeed)

### 6.2 Create Product
```
POST http://localhost:5010/seller/products
Authorization: Bearer <seller_access_token>
Content-Type: application/json
{
  "name": "Banana",
  "price": 12.5,
  "category": "Fruits",
  "description": "Fresh bananas",
  "stock": 50
}
```
**Action:** Save `productId` from response

### 6.3 Update Product
```
PATCH http://localhost:5010/seller/products/:id
Authorization: Bearer <seller_access_token>
Content-Type: application/json
{
  "price": 10.0,
  "description": "Discounted bananas"
}
```
Replace `:id` with product ID

### 6.4 Delete Product
```
DELETE http://localhost:5010/seller/products/:id
Authorization: Bearer <seller_access_token>
```
Replace `:id` with product ID

### 6.5 Add Inventory
```
POST http://localhost:5010/seller/inventory
Authorization: Bearer <seller_access_token>
Content-Type: application/json
{
  "productId": "<productId>",
  "stock": 100
}
```

### 6.6 Update Inventory
```
PATCH http://localhost:5010/seller/inventory/:productId
Authorization: Bearer <seller_access_token>
Content-Type: application/json
{
  "stock": 80
}
```
Replace `:productId` with product ID

### 6.7 List Seller Orders
```
GET http://localhost:5010/seller/orders
Authorization: Bearer <seller_access_token>
```

### 6.8 Update Order Status
```
PATCH http://localhost:5010/seller/orders/:id/status
Authorization: Bearer <seller_access_token>
Content-Type: application/json
{
  "status": "PROCESSING"
}
```
Replace `:id` with order ID
---

## 7. Buyer APIs
### 7.1 Public Products (No Auth)
```
GET http://localhost:5010/products
```

### 7.2 Get Single Product (No Auth)
```
GET http://localhost:5010/products/:id
```
Replace `:id` with product ID

### 7.3 Add to Cart
```
POST http://localhost:5010/cart
Authorization: Bearer <buyer_access_token>
Content-Type: application/json
{
  "productId": "<productId>",
  "quantity": 2
}
```

### 7.4 Update Cart Item
```
PATCH http://localhost:5010/cart/items/:id
Authorization: Bearer <buyer_access_token>
Content-Type: application/json
{
  "quantity": 3
}
```
Replace `:id` with cart item ID

### 7.5 Delete Cart Item
```
DELETE http://localhost:5010/cart/items/:id
Authorization: Bearer <buyer_access_token>
```
Replace `:id` with cart item ID

### 7.6 Create Order
```
POST http://localhost:5010/orders
Authorization: Bearer <buyer_access_token>
Content-Type: application/json
{
  "items": [
    {
      "productId": "<productId>",
      "quantity": 2
    }
  ],
  "addressId": "addr_1"
}
```
**Action:** Save `orderId` from response

### 7.7 List My Orders
```
GET http://localhost:5010/orders/my
Authorization: Bearer <buyer_access_token>
```

### 7.8 Create Review (After order delivery)
```
POST http://localhost:5010/reviews
Authorization: Bearer <buyer_access_token>
Content-Type: application/json
{
  "productId": "<productId>",
  "orderItemId": <orderItemId>,
  "rating": 5,
  "comment": "Great quality!"
}
```

### 7.9 Create Dispute (Only for DELIVERED orders)
```
POST http://localhost:5010/disputes
Authorization: Bearer <buyer_access_token>
Content-Type: application/json
{
  "orderId": "<orderId>",
  "reason": "Damaged product"
}
```
---

## Testing Order
1. Health check → Verify API is running
2. Register & login buyer → Get buyer token
3. Register seller → Create seller account
4. Register & login admin → Get admin token
5. Admin approves seller → Enable seller account
6. Admin creates category → Setup product categories
7. Seller login (retry) → Now should succeed
8. Seller creates product → Add products to catalog
9. Buyer adds to cart → Test cart functionality
10. Buyer creates order → Place order
11. Seller updates order status → Process order
12. Buyer creates review → After delivery
13. Buyer creates dispute → If issues occur
14. Admin resolves dispute → Handle disputes
---

## Notes
- Replace all `<access_token>`, `<refresh_token>`, `<productId>`, `:id` placeholders with actual values from responses
- Save tokens and IDs after each step for subsequent requests
- Test flows in sequence for proper dependency handling
- Check response status codes and error messages for validation
````