const { Router } = require('express')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const router = Router()

function mapCartItems(cart) {
  return cart.items.map(item => ({
    ...item.productId._doc,
    count: item.count
  }))
}

function calculatePrice(products) {
  if (!products) return 0
  return products.reduce((total, item) => {
    return total += item.count * item.price
  }, 0)
}

function calculateCount(products) {
  if (!products) return 0
  return products.reduce((total, item) => {
    return total += item.count
  }, 0)
}

router.post('/add', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.body.id)
    await req.user.addToCart(product)
    res.redirect('/cart')
  } catch (e) {
    console.log(e)
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.productId')

    const products = mapCartItems(user.cart)

    res.render('cart', {
      title: 'Кошик',
      isCart: true,
      products: products,
      priceTotal: calculatePrice(products) || 0,
      countTotal: calculateCount(products) || 0
    })
  } catch (e) {
    console.log(e)
  }
})

router.delete('/remove/:id', auth, async (req, res) => {
  try {
    await req.user.removeFromCart(req.params.id)

    const user = await req.user
      .populate('cart.items.productId')

    const products = mapCartItems(user.cart)

    res
      .status(200)
      .json({
        products,
        priceTotal: calculatePrice(products) || 0,
        countTotal: calculateCount(products) || 0,
        csrf: req.csrfToken()
      })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router