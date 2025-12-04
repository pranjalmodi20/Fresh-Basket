import React, { useMemo } from 'react';
import './CartPage.css';

const CartPage = ({ cartItems, onSetCartQuantity, onProceed }) => {
  // Calculate totals
  const calculations = useMemo(() => {
    const itemsTotal = cartItems.reduce(
      (sum, item) => {
        const price = item.product?.price || 0;
        return sum + price * item.quantity;
      },
      0
    );
    const gst = Math.round(itemsTotal * 0.05); // 5% GST
    const handlingCharge = 7;
    const discountSavings = cartItems.reduce((sum, item) => {
      // assuming original price is higher
      return sum + item.quantity * 10; // example discount
    }, 0);
    const grandTotal = itemsTotal + gst + handlingCharge;

    return {
      itemsTotal,
      gst,
      handlingCharge,
      discountSavings,
      grandTotal,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [cartItems]);

  // Debug logging
  React.useEffect(() => {
    console.log('CartPage received cartItems:', cartItems);
    if (cartItems.length > 0) {
      console.log('First cart item structure:', cartItems[0]);
      console.log('First product:', cartItems[0].product);
    }
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Add items from the shop to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Left: Items List */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h1>My Cart</h1>
            <p className="cart-item-count">
              {calculations.itemCount} items
            </p>
          </div>

          {/* Delivery Info */}
          <div className="cart-delivery-info">
            <div className="delivery-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="delivery-details">
              <h3>Delivery in 22 minutes</h3>
              <p>Shipment of {calculations.itemCount} items</p>
            </div>
          </div>

          {/* Cart Items */}
          <div className="cart-items-list">
            {cartItems.map((item) => {
              // Handle both populated and non-populated products
              const product = item.product || {};
              const productId = product._id || item.product;
              const productName = product.name || 'Product';
              const productImage = product.imageUrl || '/placeholder.jpg';
              const productCategory = product.category || 'Unknown';
              const productPrice = product.price || 0;

              return (
                <div key={productId} className="cart-item">
                  <div className="cart-item-image">
                    <img
                      src={productImage}
                      alt={productName}
                    />
                  </div>

                  <div className="cart-item-details">
                    <h4 className="cart-item-name">
                      {productName}
                    </h4>
                    <p className="cart-item-desc">
                      {productCategory}
                    </p>
                    <p className="cart-item-qty">
                      {item.quantity} piece
                      {item.quantity > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="cart-item-price">
                    <p className="price">
                      ₹
                      {Math.round(
                        productPrice * item.quantity
                      )}
                    </p>
                    <p className="original-price">
                      ₹
                      {Math.round(
                        Math.round(productPrice * 1.15) *
                          item.quantity
                      )}
                    </p>
                  </div>

                  <div className="cart-item-quantity">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        onSetCartQuantity(
                          product,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>
                    <span className="qty-value">
                      {item.quantity}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        onSetCartQuantity(
                          product,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cancellation Policy */}
          <div className="cart-policy">
            <h4>Cancellation Policy</h4>
            <ul>
              <li>
                Cancel your order anytime before it's out for
                delivery
              </li>
              <li>
                Refunds will be processed within 24-48 hours
              </li>
              <li>
                Partial cancellations are allowed for orders with
                multiple items
              </li>
              <li>
                No refund will be provided for orders already
                delivered
              </li>
              <li>
                For any issues, contact customer support within
                7 days of delivery
              </li>
              <li>
                Delivery charges are non-refundable for cancelled
                orders
              </li>
              <li>
                All refunds will be credited to the original
                payment method
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Bill Summary */}
        <div className="cart-bill-section">
          <div className="bill-card">
            <div className="bill-savings">
              <p>Your total savings</p>
              <p className="savings-amount">
                ₹{calculations.discountSavings}
              </p>
            </div>

            <div className="bill-divider"></div>

            <div className="bill-details">
              <div className="bill-row">
                <span>Items total</span>
                <span>
                  Saved ₹
                  {Math.round(
                    calculations.discountSavings * 0.8
                  )}
                </span>
              </div>
              <div className="bill-row">
                <span className="label">
                  ₹{calculations.itemsTotal}
                </span>
                <span className="amount">
                  ₹
                  {Math.round(
                    calculations.itemsTotal +
                      calculations.discountSavings * 0.8
                  )}
                </span>
              </div>

              <div className="bill-divider"></div>

              <div className="bill-row">
                <span>Handling charge</span>
                <span>₹{calculations.handlingCharge}</span>
              </div>

              <div className="bill-row">
                <span>Delivery Charges</span>
                <span className="free">FREE</span>
              </div>

              <div className="bill-row">
                <span>GST (5%)</span>
                <span>₹{calculations.gst}</span>
              </div>

              <div className="bill-divider"></div>

              <div className="bill-grand-total">
                <span>Grand total</span>
                <span>₹{calculations.grandTotal}</span>
              </div>

              <div className="bill-savings-footer">
                <p>Your total savings</p>
                <p className="savings-amount">
                  ₹{calculations.discountSavings}
                </p>
              </div>
            </div>

            <button
              className="proceed-btn"
              onClick={onProceed}
            >
              <span className="proceed-amount">
                ₹{calculations.grandTotal}
              </span>
              <span className="proceed-text">Proceed</span>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
