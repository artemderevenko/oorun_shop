const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const router = Router()
const emailPost = require('../emails/elasticemail')
const keys = require('../keys')
const registerHtml = require('../emails/templates/registerHtml')
const registerText = require('../emails/templates/registerText')

router.get('/login', async (req, res) => {
  try {
    res.render('auth/login', {
      title: 'Авторизація',
      isLogin: true,
      countTotal: req.cartItems || 0,
      error: req.flash('error')
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
      countTotal: req.cartItems || 0,
      error: req.flash('error')
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
    const { email, password } = req.body
    const candidate = await User.findOne({ email })
    req.flash('error', '')

    if (candidate) {
      const isSame = await bcrypt.compare(password, candidate.password)

      if (isSame) {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) {
            throw err
          }
          res.redirect('/')
        })
      } else {
        req.flash('error', 'Невірний пароль')
        res.redirect('/auth/login')
      }

    } else {
      req.flash('error', 'Користувача з такою поштою та паролем не існує')
      res.redirect('/auth/login')
    }

  } catch (e) {
    console.log(e)
  }
})

router.post('/register', async (req, res) => {
  try {
    const { email, name, password, confirm } = req.body
    const candidate = await User.findOne({ email })
    req.flash('error', '')

    if (candidate) {
      req.flash('error', 'Користувач з такою поштою вже існує')
      res.redirect('/auth/register')
    } else if (password !== confirm) {
      req.flash('error', 'Пароль та його повтор відрізняються')
      res.redirect('/auth/register')
    } else {
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: {
          items: []
        }
      })

      await user.save()
      res.redirect('/auth/login')
      
      emailPost(
        keys.EMAIL_FROM, 
        email, 
        'Підтвердження реєстрації', 
        registerHtml(name, keys.BASE_URL), 
        registerText(name, keys.BASE_URL),
      )
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router