const { Router } = require('express')
const router = Router()
const Product = require('../models/product')
const Card = require('../models/card')

router.get('/', async (req, res) => {
  const products = await Product.getAll()
  const card = await Card.fetch()

  res.render('products', {
    title: 'Товари',
    isProducts: true, 
    lamps: products.filter(item => item.type === 'lamp'),
    pots: products.filter(item => item.type === 'pot'),
    candles: products.filter(item => item.type === 'candle'),
    countTotal: card.countTotal || 0
  })
})

router.get('/:id', async (req, res) => {
  const product = await Product.getById(req.params.id)
  const card = await Card.fetch()

  res.render('product', {
    title: 'Опис товару',
    isProducts: true, 
    product,
    countTotal: card.countTotal || 0
  })
})

module.exports = router