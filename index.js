const express = require('express')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const aboutRoutes = require('./routes/about')
const deliveryRoutes = require('./routes/delivery')
const productsRoutes = require('./routes/products')
const cardRoutes = require('./routes/card')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use('/', homeRoutes)
app.use('/about', aboutRoutes)
app.use('/delivery', deliveryRoutes)
app.use('/products', productsRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})