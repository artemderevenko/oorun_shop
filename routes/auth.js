const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const router = Router()
const emailPost = require('../emails/elasticemail')
const keys = require('../keys')
const registerHtml = require('../emails/templates/registerHtml')
const registerText = require('../emails/templates/registerText')
const resetPasswordHtml = require('../emails/templates/resetPasswordHtml')
const resetPasswordText = require('../emails/templates/resetPasswordText')
const crypto = require('crypto')

router.get('/login', async (req, res) => {
  try {
    res.render('auth/login', {
      title: 'Авторизація',
      countTotal: req.cartItems || 0,
      error: req.flash('error'),
      success: req.flash('success')
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/register', async (req, res) => {
  try {
    res.render('auth/register', {
      title: 'Реєстрація',
      countTotal: req.cartItems || 0,
      error: req.flash('error'),
      success: req.flash('success')
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

router.get('/reset', async (req, res) => {
  try {
    res.render('auth/reset', {
      title: 'Забули пароль?',
      countTotal: req.cartItems || 0,
      error: req.flash('error'),
      success: req.flash('success')
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/password/:token', async (req, res) => {
  try {
    if (!req.params.token) {
      return res.redirect('/auth/login')
    }

    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() }
    })

    if (!user) {
      return res.redirect('/auth/login')
    }

    res.render('auth/password', {
      title: 'Відновлення паролю',
      countTotal: req.cartItems || 0,
      error: req.flash('error'),
      success: req.flash('success'),
      userId: user._id.toString(),
      token: req.params.token
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
      req.flash('success', 'Новий користувач успішно зареєстрований')
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

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Щось пішло не так. Повторіть спробу пізніше')
        return res.redirect('/auth/reset')
      }

      const token = buffer.toString('hex')
      const candidate = await User.findOne({ email: req.body.email })
      req.flash('error', '')

      if (candidate) {
        candidate.resetToken = token
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000,
        await candidate.save()
        emailPost(
          keys.EMAIL_FROM,
          candidate.email,
          'Відновлення доступу',
          resetPasswordHtml(keys.BASE_URL, token),
          resetPasswordText(keys.BASE_URL, token),
        )
        req.flash('success', 'Лист з інстукцією надіслано на пошту')
        res.redirect('/auth/login')
      } else {
        req.flash('error', 'Такої електронної пошти не існує')
        res.redirect('/auth/reset')
      }
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() }
    })

    if (user) {
      if (req.body.password !== req.body.confirm) {
        req.flash('error', 'Пароль та його повтор відрізняються')
        return res.redirect(`/auth/password/${req.body.token}`)
      }

      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExp = undefined
      await user.save()
      req.flash('success', 'Пароль змінено')
      return res.redirect('/auth/login')
    }
    req.flash('error', 'Токен не дійсний')
    res.redirect('/auth/login')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router