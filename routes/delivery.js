const { Router } = require('express')
const router = Router()

router.get('/', async (req, res) => {
  try {
    res.render('delivery', {
      title: 'Доставка',
      isDelivery: true,
      countTotal: req.cartItems || 0
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router