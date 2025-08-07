import React from 'react';
import Image from 'next/image';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <Image

            src={item.productId.image}
            alt={item.productId.name}
            className="img-thumbnail me-3"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <div>
            <h5 className="mb-1">{item.productId.name}</h5>
            <p className="mb-1 text-muted">{item.productId.category}</p>
          </div>
        </div>
      </td>
      <td>${item.productId.price.toFixed(2)}</td>
      <td>
        <div className="input-group" style={{ width: '120px' }}>
          <button
            className="btn btn-outline-secondary"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            className="form-control text-center"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(parseInt(e.target.value))}
            min="1"
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
          >
            +
          </button>
        </div>
      </td>
      <td>${(item.productId.price * item.quantity).toFixed(2)}</td>
      <td>
        <button
          className="btn btn-danger btn-sm"
          onClick={onRemove}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default CartItem;