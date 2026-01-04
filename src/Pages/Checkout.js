import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

const Checkout = () => {
  const { cart, removeFromCart, user } = useAuth();
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };//the tofixed(2) ensurs proper money format the reduce sums all item

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressChange = (e) => {
    setBillingAddress({
      ...billingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = () => {
    // Simple validation
    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.name) {
      alert('Please fill in all payment information');
      return;
    }

    if (!billingAddress.address || !billingAddress.city || !billingAddress.zipCode || !billingAddress.country) {
      alert('Please fill in all billing address information');
      return;
    }

    // Here you would typically send the order to the backend
    alert('Order placed successfully! Thank you for your purchase.');
    // Clear cart after successful order
    cart.forEach(item => removeFromCart(item.id));
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>
          Checkout
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Your cart is empty. Add some books to proceed to checkout.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333', textAlign: 'center' }}>
        Checkout
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Order Summary */}
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Order Summary</h3>

          {cart.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.image && (
                  <img
                    src={`http://localhost:8091/uploads/${item.image}`}
                    alt={item.title}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
                  />
                )}
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{item.title}</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Quantity: {item.quantity}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '2px solid #007bff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0 }}>Total: ${calculateTotal()}</h3>
          </div>
        </div>

        {/* Payment and Billing Information */}
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Payment Information</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.cardNumber}
              onChange={handlePaymentChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                marginBottom: '10px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentInfo.expiryDate}
                onChange={handlePaymentChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CVV</label>
              <input
                type="text"
                name="cvv"
                placeholder="123"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name on Card</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={paymentInfo.name}
              onChange={handlePaymentChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <h3 style={{ color: '#007bff', marginBottom: '20px', marginTop: '30px' }}>Billing Address</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address</label>
            <input
              type="text"
              name="address"
              placeholder="123 Main St"
              value={billingAddress.address}
              onChange={handleAddressChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                marginBottom: '10px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City</label>
              <input
                type="text"
                name="city"
                placeholder="New York"
                value={billingAddress.city}
                onChange={handleAddressChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                placeholder="10001"
                value={billingAddress.zipCode}
                onChange={handleAddressChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Country</label>
            <input
              type="text"
              name="country"
              placeholder="United States"
              value={billingAddress.country}
              onChange={handleAddressChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <button
            onClick={handlePlaceOrder}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            Place Order - ${calculateTotal()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
