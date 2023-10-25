import data from './data'

function App () {
  return (
    <div className='App'>
      <header className='App-header'>
        <a href='/'>Amazona</a>
      </header>
      <main>
        <h1>Featured Produts</h1>
        <div className='products'>
          {data.products.map(product => (
            <div className='product' key={product._id}>
              <a href={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} />
              </a>
              <div className='product-info'>
                <a href={`/product/${product._id}`}>
                  <p>{product.name}</p>
                </a>
                <p>
                  <strong>${product.price}</strong>
                </p>
                <button>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
