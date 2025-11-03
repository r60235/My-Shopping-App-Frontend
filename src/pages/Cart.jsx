import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

export default function Cart() {
  const { cart, products, removeFromCart, toggleWishlist } = useAppContext();
  
  // filter products that are in cart
  const items = products.filter((p) => p && cart.includes(p._id));

  // quantity mapping local state
  const [quantities, setQuantities] = useState(
    items.reduce((acc, it) => ({ ...acc, [it._id]: 1 }), {})
  );

  const inc = (id) => setQuantities((q) => ({ ...q, [id]: (q[id] || 1) + 1 }));
  const dec = (id) =>
    setQuantities((q) => ({ ...q, [id]: q[id] && q[id] > 1 ? q[id] - 1 : 1 }));

  // order totals
  const subtotal = items.reduce((s, p) => s + p.price * (quantities[p._id] || 1), 0);
  const discount = 0; 
  const deliveryCharges = subtotal > 100 ? 0 : 10;
  const total = subtotal - discount + deliveryCharges;

  return (
    <div className="container my-4">
      <h4>Your Cart ({items.length})</h4>
      <div className="row mt-3 g-3">
        <div className="col-md-8">
          {items.map((p) => (
            <div key={p._id} className="card p-3 mb-3">
              <div className="d-flex gap-3 align-items-center">
                {/* product image clickable */}
                <Link to={`/product/${p._id}`} className="text-decoration-none">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    style={{
                      width:120, 
                      height:80, 
                      objectFit:'cover',
                      cursor: 'pointer'
                    }} 
                  />
                </Link>
                
                <div className="flex-grow-1">
                  {/* product name link */}
                  <Link to={`/product/${p._id}`} className="text-decoration-none text-dark">
                    <div className="fw-bold" style={{ cursor: 'pointer' }}>{p.name}</div>
                  </Link>
                  <div className="text-muted">${p.price.toFixed(2)}</div>
                  <div className="text-muted small text-capitalize">{p.category}</div>
                </div>

                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex align-items-center mb-2">
                    <button 
                      className="btn btn-outline-secondary btn-sm" 
                      onClick={() => dec(p._id)}
                    >
                      -
                    </button>
                    <span className="mx-2">{quantities[p._id] || 1}</span>
                    <button 
                      className="btn btn-outline-secondary btn-sm" 
                      onClick={() => inc(p._id)}
                    >
                      +
                    </button>
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm" 
                      onClick={() => toggleWishlist(p._id)}
                    >
                      Move to Wishlist
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm" 
                      onClick={() => removeFromCart(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center mt-4">
              <p>Your cart is empty.</p>
              <Link to="/products/all" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>Order Summary</h5>
            
            <div className="d-flex justify-content-between mb-2">
              <div>Items ({items.length})</div>
              <div>${subtotal.toFixed(2)}</div>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <div>Discount</div>
              <div className="text-success">-${discount.toFixed(2)}</div>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <div>Delivery Charges</div>
              <div>{deliveryCharges === 0 ? 'FREE' : `$${deliveryCharges.toFixed(2)}`}</div>
            </div>
            
            <hr />
            
            <div className="d-flex justify-content-between fw-bold fs-5">
              <div>Total Amount</div>
              <div>${total.toFixed(2)}</div>
            </div>

          

            <button 
              className="btn btn-dark w-100 mt-3" 
              onClick={() => alert("Order placed successfully! (demo)")}
              disabled={items.length === 0}
            >
              {items.length === 0 ? 'Cart is Empty' : 'Place Order'}
            </button>
            
            <Link to="/products/all" className="btn btn-outline-primary w-100 mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}