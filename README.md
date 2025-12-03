# My Shopping App

A full-stack e-commerce shopping application where you can browse products, search by category, add items to cart and wishlist, user login, and manage your shopping experience. Built with a React frontend, Express/Node backend and MongoDB database.

---

## Demo Link

[Live Demo](https://my-shopping-app-frontend.vercel.app)  

---

## Login

> **Guest**  
> Username: `guest_user`  
> Password: `guest_pass`

---

## Quick Start

```
git clone https://github.com/r60235/My-Shopping-App-Frontend.git
git clone https://github.com/r60235/My-Shopping-App-Backend.git
cd <your-repo>
npm install
npm run dev      # or `npm start` / `yarn dev`
```

## Technologies

- React JS
- React Router
- React Bootstrap
- React Toastify
- Node.js
- Express
- MongoDB
- Vite

## Demo Video

Watch a walkthrough (5–7 minutes) of all major features of this app:

[Video Link]()

## Features

**Home**
- Displays featured banners and product categories
- Browse new arrivals and summer collections
- Quick navigation to product categories (All, Men, Women, Kids, Electronics)

**Product Listing**
- Filter products by category, price range, and rating
- Sort products by price (low to high, high to low) or rating
- Real-time search functionality
- Responsive product cards with images and pricing

**Product Details**
- View full product information (images, description, pricing, ratings)
- Select product size (for applicable items)
- Add to cart or wishlist
- View related products

**Shopping Cart**
- Add/remove items from cart
- Update product quantities
- View total price calculation
- Persistent cart across sessions

**Wishlist**
- Save favorite products for later
- Move items from wishlist to cart
- Remove items from wishlist
- Persistent wishlist across sessions

**User Profile**
- View and manage user account information
- Access order history
- Update profile settings

**Authentication**
- User signup and login
- Protected routes for cart and profile features
- Session persistence with localStorage

## API Reference

### **GET	/products**
<br>	 List all products<br>	 Sample Response:<br>
```
[{ _id, name, price, category, image, rating, ... }, …]
```

### **GET	/product/:id**
<br>	 	Get details for one product<br>		Sample Response:<br>
```
{ _id, name, description, price, category, image, rating, reviewCount, ... }
```

### **POST	/orders**
<br> 	Create a new order<br>	Sample Response:<br>
```
{ orderId, userEmail, items, totalAmount, deliveryAddress, orderDate, status }
```

### **GET	/orders/:email**
<br>  	Get all orders for a user by email<br> 	 Sample Response:<br> 
```
{ orders: [{ _id, userEmail, items, totalAmount, deliveryAddress, orderDate, status }, ...] }
```

## Contact

For bugs or feature requests, please reach out to rishaabh105@gmail.com
