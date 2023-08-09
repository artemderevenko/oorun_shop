const { Router } = require('express')
const router = Router()
const Product = require('../models/product')

router.get('/', async (req, res) => {
  try {
    const products = await Product.find()

    res.render('products', {
      title: 'Товари',
      isProducts: true,
      lamps: products.filter(item => item.type === 'lamp'),
      pots: products.filter(item => item.type === 'pot'),
      candles: products.filter(item => item.type === 'candle'),
      diffusers: products.filter(item => item.type === 'diffuser'),
      countTotal: req.cartItems || 0,
      sendMessageError: req.flash('sendMessageError'),
      success: req.flash('success'),
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    res.render('product', {
      title: 'Опис товару',
      isProducts: true,
      product,
      countTotal: req.cartItems || 0,
      sendMessageError: req.flash('sendMessageError'),
      success: req.flash('success'),
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router