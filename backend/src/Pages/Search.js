import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const API_BASE_URL = 'http://localhost:3001';

const Search = () => {
  const { addToCart } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = books;

    // First filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(book => book.category_id === parseInt(selectedCategory));
    }

    // Then filter by search term if provided
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  }, [searchTerm, selectedCategory, books]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

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
      <h1>Search Books</h1>

      <div style={{ marginBottom: '30px', maxWidth: '700px', margin: '0 auto 30px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by title, author, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '14px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              outline: 'none'
            }}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '200px',
              padding: '10px',
              fontSize: '14px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              outline: 'none',
              backgroundColor: 'white',
              flexShrink: 0
            }}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <p style={{ marginTop: '10px', color: '#666', textAlign: 'center' }}>
          {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filteredBooks.length === 0 && searchTerm.trim() !== '' ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No books found matching "{searchTerm}"</h3>
          <p>Try different keywords or browse our full catalog.</p>
          <a
            href="/catalog"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Browse All Books
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {filteredBooks.map(book => (
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
      )}
    </div>
  );
};

export default Search;
