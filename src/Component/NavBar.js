import { Link } from 'react-router-dom';
import './NavBar.css'; // We'll create this for styling

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Bookstore</Link>
      </div>
      <ul className="navbar-nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/catalog">Catalog</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/checkout">Checkout</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
