const { Router } = require('express')
const router = Router()
const Product = require('../models/product')

router.get('/', async (req, res) => {
  try {
    const products = await Product.find()

    res.render('home', {
      title: 'Головна',
      isHome: true,
      topProducts: products.filter(item => item.isTop),
      countTotal: req.cartItems || 0
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router