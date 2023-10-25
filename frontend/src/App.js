import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import data from './data'
import HomeScreen from './Screens/HomeScreen'
import ProductScreen from './Screens/ProductScreen'

function App () {
  return (
    <BrowserRouter>
      <div className='App'>
        <header className='App-header'>
          <Link to='/'>Amazona</Link>
        </header>
        <main>
          <Routes>
            <Route path='/product/:_id' element={<ProductScreen />} />
            <Route path='/' element={<HomeScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
