const { body } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.registerValidators = [[
  body('email', "Введіть правильну електронну пошту")
    .isEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value })
        if (user) {
          return Promise.reject('Користувач з такою поштою вже існує')
        }
      } catch (e) {
        console.log(e)
      }
    })
    .normalizeEmail(),

  body('password', 'Пароль повинен мати довжину від 8 до 56 символів')
    .isLength({ min: 8, max: 56 })
    .isAlphanumeric()
    .trim(),

  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Пароль та його повтор відрізняються')
      }
      return true
    })
    .trim(),

  body('name', "Ім'я має бути більше 3 символів")
    .isLength({ min: 3 })
    .trim(),
]]

exports.loginValidators = [[
  body('email', "Введіть правильну електронну пошту")
    .isEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value })
        if (!user) {
          return Promise.reject('Користувача з такою поштою чи паролем не існує')
        }
      } catch (e) {
        console.log(e)
      }
    }),

  body('password')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
          const isSame = await bcrypt.compare(value, user.password)

          if (!isSame) {
            return Promise.reject('Невірний пароль')
          }
        } else {
          return Promise.reject('Користувача з такою поштою чи паролем не існує')
        }
      } catch (e) {
        console.log(e)
      }
    })
]]

exports.resetValidators = [[
  body('email', "Введіть правильну електронну пошту")
    .isEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value })
        if (!user) {
          return Promise.reject('Користувача з такою поштою не існує')
        }
      } catch (e) {
        console.log(e)
      }
    }),
]]

exports.passwordValidators = [[
  body('password', 'Пароль повинен мати довжину від 8 до 56 символів')
    .isLength({ min: 8, max: 56 })
    .isAlphanumeric()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({
          _id: req.body.userId,
          resetToken: req.body.token,
          resetTokenExp: { $gt: Date.now() }
        })

        if (!user) {
          return Promise.reject('Токен не дійсний')
        }
      } catch (e) {
        console.log(e)
      }
    })
    .trim(),

  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Пароль та його повтор відрізняються')
      }
      return true
    })
    .trim(),
]]

exports.sendMessageValidators = [[
  body('email', "Введіть правильну електронну пошту")
    .isEmail()
    .normalizeEmail(),

  body('name', "Ім'я має бути більше 3 символів")
    .isLength({ min: 3 })
    .trim(),

  body('message', "Повідомлення має бути більше 3 символів")
    .isLength({ min: 3 })
    .trim(),
]]