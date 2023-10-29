import React, { useContext, useEffect, useState } from 'react'
import CheckoutSteps from '../Component/CheckoutSteps'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import { useNavigate } from 'react-router-dom'
import { Store } from '../Store'

function PaymentScreen () {
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    cart: { shippingAddress, paymentMethod }
  } = state
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'Paypal'
  )

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping')
    }
  }, [shippingAddress])

  const submitHandler = e => {
    e.preventDefault()
    ctxDispatch({ type: 'SAVE_SHIPPING_METHOD', payload: paymentMethod })
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethodName))
    navigate('/placeorder')
  }
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className='container small-container'>
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className='my-3'>Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className='my-3'>
            <Form.Check
              type='radio'
              id='Paypal'
              label='Paypal'
              value='Paypal'
              checked={paymentMethodName === 'Paypal'}
              onChange={e => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className='my-3'>
            <Form.Check
              type='radio'
              id='Strip'
              label='Strip'
              value='Strip'
              checked={paymentMethodName === 'Strip'}
              onChange={e => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <Button type='submit'>Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default PaymentScreen
