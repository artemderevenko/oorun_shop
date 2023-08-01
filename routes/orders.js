const { Router } = require('express')
const order = require('../models/order')
const Order = require('../models/order')
const router = Router()

router.get('/', async (req, res) => {
  try {
    const orders = await Order
      .find({ 'user.userId': req.user._id })
      .populate('user.userId')

    res.render('orders', {
      title: 'Замовлення',
      isOrders: true,
      countTotal: req.cartItems || 0,
      orders: orders.map(order => ({
        ...order._doc,
        price: order.products.reduce((total, p) => {
          return total += p.count * p.product.price
        }, 0)
      }))
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/', async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.productId')

    const products = user.cart.items.map(item => ({
      count: item.count,
      product: { ...item.productId._doc },
    }))

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      products
    })

    await order.save()
    await req.user.clearCart()

    res.redirect('/orders')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router