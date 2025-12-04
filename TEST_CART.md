# Testing Cart Functionality

## What I Fixed

1. ✅ Added `getCart()` API endpoint to fetch cart from database
2. ✅ Added logging to see when cart is saved
3. ✅ Frontend now loads cart from database on login
4. ✅ Cart persists across sessions

## How to Test

### 1. Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

You should see logs like:
```
Fresh Basket Server running on port 5001
Connected to MongoDB - Fresh Basket Database
```

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

### 3. Test Cart Persistence

1. **Login** to your account
2. **Add products** to cart
3. Check backend terminal - you should see:
   ```
   Cart saved successfully: { userId: '...', productId: '...', quantity: 1, totalItems: 1 }
   ```
4. **Refresh the page** - cart items should still be there!
5. **Logout and login again** - cart should persist

### 4. Check MongoDB Directly

Go to MongoDB Atlas:
1. Open your cluster
2. Browse Collections
3. Look for `carts` collection
4. You should see documents like:
   ```json
   {
     "_id": "...",
     "user": "user_id_here",
     "items": [
       {
         "product": "product_id_here",
         "quantity": 2
       }
     ],
     "createdAt": "...",
     "updatedAt": "..."
   }
   ```

## API Endpoints

### GET /api/cart
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "_id": "cart_id",
  "user": "user_id",
  "items": [
    {
      "product": {
        "_id": "product_id",
        "name": "Apple",
        "price": 100,
        ...
      },
      "quantity": 2
    }
  ]
}
```

### POST /api/cart
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "productId": "product_id_here",
  "quantity": 2
}
```

**Response:**
```json
{
  "productId": "product_id_here",
  "quantity": 2,
  "cartId": "cart_id_here"
}
```

## Troubleshooting

### Cart not saving?
- Check backend logs for "Cart saved successfully"
- Check if JWT token is valid
- Verify MongoDB connection is active

### Cart not loading on refresh?
- Check browser console for errors
- Verify `loadCart()` is being called
- Check Network tab for `/api/cart` GET request

### Empty cart in MongoDB?
- Make sure you're logged in
- Check if products exist in database
- Verify the productId being sent is valid
