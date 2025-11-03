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
    price: 2000,
    rating: "",
    sort: "",
  });

  const API_BASE = "http://localhost:5001";
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
    if (savedFilters) setFilters(JSON.parse(savedFilters));

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

  // fetct all
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

  // add to cart
  const addToCart = (productId) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(id => id !== productId));
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

  const value = {
    cart,
    wishlist,
    products,
    searchQuery,
    setSearchQuery,
    user,
    setUser,
    filters,
    setFilters,
    API_BASE,
    addToCart,
    removeFromCart,
    toggleWishlist,
    moveWishlistToCart,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};