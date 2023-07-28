const {Router} = require('express')
const Card = require('../models/card')
const Product = require('../models/product')
const router = Router()

router.post('/add', async (req, res) => {
  const product = await Product.getById(req.body.id)
  await Card.add(product)
  res.redirect('/card')
})

router.get('/', async (req, res) => {
  const card = await Card.fetch()
  res.render('card', {
    title: 'Кошик',
    isCard: true,
    products: card.products,
    priceTotal: card.priceTotal || 0,
    countTotal: card.countTotal || 0
  })
})

module.exports = router