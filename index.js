const express = require('express')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const path = require('path')
const mongoose = require('mongoose');
const homeRoutes = require('./routes/home')
const aboutRoutes = require('./routes/about')
const deliveryRoutes = require('./routes/delivery')
const productsRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const User = require('./models/user')
const app = express()

function calculateCartItems(cart) {
  if (!cart || !cart.items) return 0
  return cart.items.reduce((total, item) => {
    return total += item.count
  }, 0)
}

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('64c8e6d737492a026d4020c7')
    const cartItems = calculateCartItems(user.cart)
    req.cartItems = cartItems
    req.user = user
    next()
  } catch (e) {
    console.log(e)
  }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use('/', homeRoutes)
app.use('/about', aboutRoutes)
app.use('/delivery', deliveryRoutes)
app.use('/products', productsRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)

const PORT = process.env.PORT || 3000

async function start() {
  try {
    const url = "mongodb+srv://oorun84:Schlesser84@oorun.4cq591q.mongodb.net/shop"
    await mongoose.connect(url, { useNewUrlParser: true })
    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        email: 'oorun84@gmail.com',
        name: 'Artem',
        cart: {
          items: []
        }
      })
      await user.save()
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()