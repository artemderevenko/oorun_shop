const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const router = Router()
const { validationResult } = require('express-validator')
const emailPost = require('../emails/elasticemail')
const keys = require('../keys')
const registerHtml = require('../emails/templates/registerHtml')
const registerText = require('../emails/templates/registerText')
const resetPasswordHtml = require('../emails/templates/resetPasswordHtml')
const resetPasswordText = require('../emails/templates/resetPasswordText')
const {
  registerValidators,
  loginValidators,
  resetValidators,
  passwordValidators
} = require('../utils/validators')

router.get('/login', async (req, res) => {
  try {
    res.render('auth/login', {
      title: 'Авторизація',
      loginError: '',
      countTotal: req.cartItems || 0,
      success: req.flash('success'),
      sendMessageError: req.flash('sendMessageError'),
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/register', async (req, res) => {
  try {
    res.render('auth/register', {
      title: 'Реєстрація',
      registerError: '',
      countTotal: req.cartItems || 0,
      success: req.flash('success'),
      sendMessageError: req.flash('sendMessageError'),
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
      resetError: '',
      countTotal: req.cartItems || 0,
      success: req.flash('success'),
      sendMessageError: req.flash('sendMessageError'),
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
      passwordError: req.flash('passwordError'),
      success: req.flash('success'),
      userId: user._id.toString(),
      token: req.params.token,
      sendMessageError: req.flash('sendMessageError'),
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/login', loginValidators, async (req, res) => {
  try {
    const { email, password } = req.body
    const candidate = await User.findOne({ email })

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .render('auth/login', {
          title: 'Авторизація',
          countTotal: req.cartItems || 0,
          loginError: errors.array()[0].msg,
          sendMessageError: req.flash('sendMessageError'),
          success: req.flash('success'),
          data: {
            email: email || '',
            password: password || ''
          }
        })
    }

    req.session.user = candidate
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

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { email, name, password, confirm } = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .render('auth/register', {
          title: 'Реєстрація',
          countTotal: req.cartItems || 0,
          registerError: errors.array()[0].msg,
          sendMessageError: req.flash('sendMessageError'),
          success: req.flash('success'),
          data: {
            email: email || '',
            password: password || '',
            confirm: confirm || '',
            name: name || ''
          }
        })
    }

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
  } catch (e) {
    console.log(e)
  }
})

router.post('/reset', resetValidators, (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .render('auth/reset', {
          title: 'Забули пароль?',
          countTotal: req.cartItems || 0,
          resetError: errors.array()[0].msg,
          success: req.flash('success'),
          sendMessageError: req.flash('sendMessageError'),
          data: {
            email: req.body.email || '',
          }
        })
    }

    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        return res.render('auth/reset', {
          title: 'Забули пароль?',
          countTotal: req.cartItems || 0,
          resetError: 'Щось пішло не так. Повторіть спробу пізніше',
          sendMessageError: req.flash('sendMessageError'),
          success: req.flash('success'),
          data: {
            email: req.body.email || '',
          }
        })
      }

      const token = buffer.toString('hex')
      const candidate = await User.findOne({ email: req.body.email })

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
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/password', passwordValidators, async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      req.flash('passwordError', '')
      req.flash('passwordError', errors.array()[0].msg)
      return res
        .status(422)
        .redirect(`/auth/password/${req.body.token}`)
    }

    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() }
    })

    user.password = await bcrypt.hash(req.body.password, 10)
    user.resetToken = undefined
    user.resetTokenExp = undefined
    await user.save()
    req.flash('success', 'Пароль змінено')
    return res.redirect('/auth/login')

  } catch (e) {
    console.log(e)
  }
})

module.exports = router