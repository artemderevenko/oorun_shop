const { Router } = require('express')
const { validationResult } = require('express-validator')
const { sendMessageValidators } = require('../utils/validators')
const emailPost = require('../emails/elasticemail')
const sendMessageHtml = require('../emails/templates/sendMessageHtml')
const sendMessageText = require('../emails/templates/sendMessageText')
const keys = require('../keys')
const router = Router()

router.post('/', sendMessageValidators, async (req, res) => {
  try {
    const { email, name, message } = req.body
    const errors = validationResult(req)
    const previousUrl = req.header('Referer') || '/';

    if (!errors.isEmpty()) {
      req.flash('sendMessageError', '')
      req.flash('sendMessageError', errors.array()[0].msg)
      return res
        .status(422)
        .redirect(previousUrl)
    }

    req.flash('success')
    req.flash('success', 'Повідомлення успішно відправлено')
    res.redirect(previousUrl)

    emailPost(
      keys.EMAIL_FROM,
      keys.EMAIL_ADMIN,
      'Повідомлення від користувача інтернет-магазину OORUN',
      sendMessageHtml(email, name, message),
      sendMessageText(email, name, message),
    )
  } catch (e) {
    console.log(e)
  }
})

module.exports = router