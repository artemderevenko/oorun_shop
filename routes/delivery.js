const { Router } = require('express')
const Card = require('../models/card')
const router = Router()

router.get('/', async (req, res) => {
  const card = await Card.fetch()

  res.render('delivery', {
    title: 'Доставка',
    isDelivery: true,
    countTotal: card.countTotal || 0
  })
})

module.exports = router