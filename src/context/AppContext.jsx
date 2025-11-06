import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    price: "any", 
    rating: "",
    sort: "",
  });

  const API_BASE = "https://my-shopping-app-frontend.vercel.app"; 
  const location = useLocation();

  // localStorage initialize
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedCart = localStorage.getItem("cart");
    const savedWishlist = localStorage.getItem("wishlist");
    const savedFilters = localStorage.getItem("filters");
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setFilters({
        ...parsedFilters,
        price: typeof parsedFilters.price === 'number' ? parsedFilters.price.toString() : parsedFilters.price
      });
    }

    // fetch all products 
    fetchProducts();
  }, []);

  // search
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  // save filters
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  // save cart, wishlist when they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // fetch all
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // add to cart with size
  const addToCart = (productId, size = "") => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => 
        item.productId === productId && item.size === size
      );
      
      if (existingItemIndex > -1) {
        // If item already exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 1) + 1
        };
        return updatedCart;
      } else {
        // Add new item with quantity 1
        const cartItem = {
          productId: productId,
          size: size,
          id: `${productId}-${size || "nosize"}`,
          quantity: 1
        };
        return [...prevCart, cartItem];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // wishlist
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const moveWishlistToCart = (productId) => {
    addToCart(productId);
    setWishlist(wishlist.filter(id => id !== productId));
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Calculate total items in cart (sum of all quantities)
  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const value = {
    cart,
    wishlist,
    products,
    searchQuery,
    setSearchQuery,
    user,
    setUser,
    filters,
    setFilters: updateFilters,
    API_BASE,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    moveWishlistToCart,
    fetchProducts,
    getTotalCartItems, 
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};