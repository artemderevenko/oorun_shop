const { Router } = require('express')
const router = Router()

router.get('/login', async (req, res) => {
  try {
    res.render('auth/login', {
      title: 'Авторизація',
      isLogin: true,
      countTotal: req.cartItems || 0
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/register', async (req, res) => {
  try {
    res.render('auth/register', {
      title: 'Реєстрація',
      isRegister: true,
      countTotal: req.cartItems || 0
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router