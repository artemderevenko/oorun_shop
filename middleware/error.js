module.exports = function(req, res, next) {
  res.status(404).render('404', {
    title: 'Сторінка не знайдена',
    sendMessageError: req.flash('sendMessageError'),
    success: req.flash('success'),
    countTotal: req.cartItems || 0,
  })
}