import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';// this is a hook where it lets access the cart and call the add to cart

const API_BASE_URL = 'http://localhost:3001';//this store the backend in one place wich help for fetching the books in my database

const Catalog = () => {
  const { addToCart, cart } = useAuth();

  console.log('Catalog component - cart:', cart);
  console.log('Catalog component - cart length:', cart.length);//these are used for debuging for when the cart is being updated 
  const [books, setBooks] = useState([]);//this store the books from the backend
  const [loading, setLoading] = useState(true);//this controls the loading screen 
  const [error, setError] = useState(null);//the store the error messages if fetch fails 

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();//this converts json respones to javascript
      setBooks(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };//this pervents app crashes and show an error message

  const handleAddToCart = (book) => {
    addToCart(book);
    alert(`${book.title} added to cart!`);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading books...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error: {error}</h2>
        <button onClick={fetchBooks}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Book Catalog</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {books.map(book => (
          <div key={book.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
            {book.image && (
              <img
                src={`${API_BASE_URL}/uploads/${book.image}`}
                alt={book.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
              />
            )}
            <h3 style={{ margin: '10px 0', fontSize: '18px' }}>{book.title}</h3>
            <p style={{ color: '#666', margin: '5px 0' }}>Author: {book.author}</p>
            <p style={{ color: '#666', margin: '5px 0' }}>Category: {book.category}</p>
            <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>{book.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'green' }}>${book.price}</span>
              <button
                onClick={() => handleAddToCart(book)}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
