const { Router } = require('express')
const User = require('../models/user')
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

router.get('/logout', async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/auth/login')
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findById('64c8e6d737492a026d4020c7')
    req.session.user = user
    req.session.isAuthenticated = true
    req.session.save(err => {
      if (err) {
        throw err
      }

      res.redirect('/')
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router