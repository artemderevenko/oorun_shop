const { Router } = require('express')
const router = Router()

router.get('/', async (req, res) => {
  try {
    res.render('delivery', {
      title: 'Доставка',
      isDelivery: true,
      countTotal: req.cartItems || 0,
      sendMessageError: req.flash('sendMessageError'),
      success: req.flash('success'),
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router