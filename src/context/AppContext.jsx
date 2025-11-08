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

  const API_BASE = "https://my-shopping-app-backend.vercel.app";
  const location = useLocation();

  useEffect(() => {
    const loadFromStorage = () => {
      const savedUser = localStorage.getItem("user");
      const savedCart = localStorage.getItem("cart");
      const savedWishlist = localStorage.getItem("wishlist");
      const savedFilters = localStorage.getItem("filters");
      
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(Array.isArray(parsedCart) ? parsedCart : []);
        } catch (error) {
          setCart([]);
          localStorage.removeItem("cart");
        }
      } else {
        setCart([]);
      }
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setWishlist(Array.isArray(parsedWishlist) ? parsedWishlist : []);
        } catch (error) {
          setWishlist([]);
          localStorage.removeItem("wishlist");
        }
      } else {
        setWishlist([]);
      }
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters({
          ...parsedFilters,
          price: typeof parsedFilters.price === 'number' ? parsedFilters.price.toString() : parsedFilters.price
        });
      }
    };

    loadFromStorage();
    fetchProducts();

    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        try {
          const newCart = e.newValue ? JSON.parse(e.newValue) : [];
          setCart(Array.isArray(newCart) ? newCart : []);
        } catch (error) {
          setCart([]);
        }
      }
      if (e.key === "wishlist") {
        try {
          const newWishlist = e.newValue ? JSON.parse(e.newValue) : [];
          setWishlist(Array.isArray(newWishlist) ? newWishlist : []);
        } catch (error) {
          setWishlist([]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

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

  const addToCart = (productId, size = "") => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => 
        item.productId === productId && item.size === size
      );
      
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 1) + 1
        };
        return updatedCart;
      } else {
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

  const toggleWishlist = (productId) => {
    setWishlist(prevWishlist => {
      const newWishlist = prevWishlist.includes(productId) 
        ? prevWishlist.filter(id => id !== productId)
        : [...prevWishlist, productId];
      return newWishlist;
    });
  };

  const moveWishlistToCart = (productId) => {
    addToCart(productId);
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

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