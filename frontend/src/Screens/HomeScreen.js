import React from 'react'
import data from '../data'
import { Link } from 'react-router-dom'

export default function HomeScreen () {
  return (
    <div>
      <h1>Featured Produts</h1>
      <div className='products'>
        {data.products.map(product => (
          <div className='product' key={product._id}>
            <Link to={`/product/${product._id}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <div className='product-info'>
              <Link to={`/product/${product._id}`}>
                <p>{product.name}</p>
              </Link>
              <p>
                <strong>${product.price}</strong>
              </p>
              <button>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
