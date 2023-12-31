import React, { useEffect, useReducer } from 'react'
import axios from 'axios'
import logger from 'use-reducer-logger'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Product from '../Component/Product'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../Component/LoadingBox'
import MessageBox from '../Component/MessageBox'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...setTimeout, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default function HomeScreen () {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const result = await axios.get('/api/products/')
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message })
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured Produts</h1>
      <div className='products'>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant='danger'>{error}</MessageBox>
        ) : (
          <Row>
            {products?.map(product => (
              <Col key={product._id} sm={6} md={4} lg={3} className='mb-3'>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  )
}
