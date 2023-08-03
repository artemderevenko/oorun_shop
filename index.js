const express = require('express')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const session = require('express-session')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const MongoStore = require('connect-mongodb-session')(session)
const path = require('path')
const mongoose = require('mongoose');
const homeRoutes = require('./routes/home')
const aboutRoutes = require('./routes/about')
const deliveryRoutes = require('./routes/delivery')
const productsRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const MONGODB_URI = "mongodb+srv://oorun84:Schlesser84@oorun.4cq591q.mongodb.net/shop"

const app = express()

// Creates an instance of Handlebars to use as a templating engine
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
})

// Storing sessions in a MongoDB database
const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))

// Convert data from URL-encoded format to JavaScript object
// The extended: true setting specifies that the express.urlencoded middleware will use an extended algorithm to process form data. 
// This algorithm allows processing of complex form data such as nested objects and arrays. 
// Setting extended: false limits it to simpler data processing that does not support nested objects and arrays. 
app.use(express.urlencoded({ extended: true }))


app.use(session({
  secret: 'some code',
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/about', aboutRoutes)
app.use('/delivery', deliveryRoutes)
app.use('/products', productsRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()