import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_BASE_URL = 'http://localhost:3001';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedCart = localStorage.getItem('cart');

    console.log('AuthContext useEffect - token:', token);
    console.log('AuthContext useEffect - storedUser:', storedUser);
    console.log('AuthContext useEffect - storedCart:', storedCart);

    if (token && storedUser) {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
        console.log('AuthContext - User authenticated:', JSON.parse(storedUser));
      } catch (error) {
        console.error('AuthContext - Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('AuthContext - No token or user found, user not authenticated');
    }

    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
        console.log('AuthContext - Cart loaded from localStorage:', parsedCart);
        console.log('AuthContext - Cart length:', parsedCart.length);
      } catch (error) {
        console.error('AuthContext - Error parsing cart data:', error);
        localStorage.removeItem('cart');
      }
    } else {
      console.log('AuthContext - No cart data found in localStorage');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCart([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  };

  const addToCart = (book) => {
    console.log('addToCart called with book:', book);
    console.log('Current cart before adding:', cart);

    const existingItem = cart.find(item => item.id === book.id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      console.log('Updated cart (existing item):', updatedCart);
    } else {
      const newCart = [...cart, { ...book, quantity: 1 }];
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      console.log('Updated cart (new item):', newCart);
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const value = {
    isAuthenticated,
    user,
    cart,
    login,
    register,
    logout,
    addToCart,
    removeFromCart
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
