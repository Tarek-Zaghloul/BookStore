const Home = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>
        Welcome to BookStore
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
        Discover your next favorite book from our extensive collection
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3 style={{ color: '#007bff', marginBottom: '10px' }}>📚 Extensive Collection</h3>
          <p>Thousands of books across all genres and categories</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3 style={{ color: '#007bff', marginBottom: '10px' }}>🚚 Fast Delivery</h3>
          <p>Quick and reliable shipping to your doorstep</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3 style={{ color: '#007bff', marginBottom: '10px' }}>💳 Secure Payment</h3>
          <p>Safe and secure checkout process</p>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <a
          href="/catalog"
          style={{
            display: 'inline-block',
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Browse Our Catalog
        </a>
      </div>

      <div style={{ marginTop: '60px', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Why Choose BookStore?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <h4>Quality Books</h4>
            <p>We source only the highest quality books from trusted publishers</p>
          </div>
          <div>
            <h4>Expert Curation</h4>
            <p>Our team carefully selects each book for our collection</p>
          </div>
          <div>
            <h4>Community</h4>
            <p>Join a community of book lovers and share your reading experiences</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
