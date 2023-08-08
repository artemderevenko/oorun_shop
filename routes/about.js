const { Router } = require('express')
const router = Router()

router.get('/', async (req, res) => {
  try {
    res.render('about', {
      title: 'Про нас',
      isAbout: true,
      countTotal: req.cartItems || 0,
      sendMessageError: req.flash('sendMessageError'),
      success: req.flash('success'),
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router