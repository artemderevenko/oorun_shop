const { Router } = require('express')
const router = Router()
const Card = require('../models/card')
const Product = require('../models/product')

router.get('/', async (req, res) => {
  const products = await Product.getAll()
  const card = await Card.fetch()

  res.render('home', {
    title: 'Головна',
    isHome: true, 
    topProducts: products.filter(item => item.isTop),
    countTotal: card.countTotal || 0
  })
})

module.exports = router