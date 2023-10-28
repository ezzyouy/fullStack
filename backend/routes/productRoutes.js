import express from 'express'
import Product from '../models/ProductModel.js'

const productRouter = express.Router()

productRouter.get('/', async (req, res) => {
  const products = await Product.find()
  res.send(products)
})
productRouter.get('/id/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) res.send(product)
  else res.status(404).send({ message: 'Product not found' })
})

export default productRouter
