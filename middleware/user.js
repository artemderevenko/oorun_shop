const User = require('../models/user')

function calculateCartItems(cart) {
  if (!cart || !cart.items) return 0
  return cart.items.reduce((total, item) => {
    return total += item.count
  }, 0)
}

module.exports = async function(req, res, next) {
  if (!req.session.user) {
    req.cartItems = 0
    return next()
  }

  const user = await User.findById(req.session.user._id)
  const cartItems = calculateCartItems(user.cart)
  req.user = user
  req.cartItems = cartItems

  next()
}