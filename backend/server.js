import express from 'express'
import data from './data.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to Mongodb')
  })
  .catch(err => {
    console.log(err.message)
  })

const app = express()

app.get('/api/products/', (req, res) => {
  res.send(data.products)
})

app.get('/api/product/id/:id', (req, res) => {
  const product = data.products.find(x => x._id === req.params.id)
  if (product) res.send(product)
  else res.status(404).send({ message: 'Product not found' })
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server started on ${port}`)
})
