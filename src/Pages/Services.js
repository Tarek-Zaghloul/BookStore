const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Book Recommendations',
      description: 'Get personalized book recommendations based on your reading preferences and interests.',
      icon: '📚'
    },
    {
      id: 2,
      title: 'Author Events',
      description: 'Join virtual and in-person events with your favorite authors for exclusive insights and discussions.',
      icon: '🎤'
    },
    {
      id: 3,
      title: 'Reading Clubs',
      description: 'Participate in online reading clubs and discussion groups to connect with fellow book lovers.',
      icon: '👥'
    },
    {
      id: 4,
      title: 'Book Reviews',
      description: 'Access detailed book reviews and ratings from our community of readers.',
      icon: '⭐'
    },
    {
      id: 5,
      title: 'Reading Challenges',
      description: 'Take part in monthly reading challenges to discover new genres and authors.',
      icon: '🎯'
    },
    {
      id: 6,
      title: 'Book Care Tips',
      description: 'Learn how to properly care for your books and maintain your personal library.',
      icon: '🛠️'
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Our Services</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
        Discover the various services we offer to enhance your reading experience
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {services.map(service => (
          <div
            key={service.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '15px' }}>
              {service.icon}
            </div>
            <h3 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>
              {service.title}
            </h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '30px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h2 style={{ marginBottom: '15px', color: '#333' }}>Ready to Get Started?</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Join our community of book lovers and discover new worlds through reading.
        </p>
        <button
          onClick={() => window.location.href = '/catalog'}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Browse Our Catalog
        </button>
      </div>
    </div>
  );
};

export default Services;
