import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from '../../frontendd/src/Pages/Home.js';
import Register from '../../frontendd/src/Pages/Register.js';
import Login from '../../frontendd/src/Pages/Login.js';
import Catalog from '../../frontendd/src/Pages/Catalog.js';
import Search from '../../frontendd/src/Pages/Search.js';
import Checkout from '../../frontendd/src/Pages/Checkout.js';
import Services from '../../frontendd/src/Pages/Services.js';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Navigation component that shows different links based on auth status
const Navigation = () => {
  const { isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <nav style={{
        backgroundColor: '#007bff',
        padding: '10px 20px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>BookStore</h1>
        <div>Loading...</div>
      </nav>
    );
  }

  return (
    <nav style={{
      backgroundColor: '#007bff',
      padding: '10px 20px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ margin: 0 }}>BookStore</h1>
      <div>
        {isAuthenticated ? (
          <>
            <Link to="/" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Home</Link>
            <Link to="/catalog" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Catalog</Link>
            <Link to="/search" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Search</Link>
            <Link to="/services" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Services</Link>
            <Link to="/checkout" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Checkout</Link>
            <button
              onClick={logout}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '5px 10px',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Register</Link>
            <Link to="/login" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <Navigation />

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/catalog" element={<ProtectedRoute><Catalog /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}



export default App;
