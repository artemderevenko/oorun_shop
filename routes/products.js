const { Router } = require('express')
const router = Router()
const Product = require('../models/product')

router.get('/', async (req, res) => {
  try {
    const products = await Product.find()

    res.render('products', {
      title: 'Товари',
      isProducts: true,
      lamps: products.filter(item => item.type === 'lamp'),
      pots: products.filter(item => item.type === 'pot'),
      candles: products.filter(item => item.type === 'candle'),
      countTotal: req.cartItems || 0,
      sendMessageError: req.flash('sendMessageError'),
      success: req.flash('success'),
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    res.render('product', {
      title: 'Опис товару',
      isProducts: true,
      product,
      countTotal: req.cartItems || 0,
      sendMessageError: req.flash('sendMessageError'),
      success: req.flash('success'),
    })
  } catch (e) {
    console.log(e)
  }
})

// Add new product
// router.post('/add', async (req, res) => {
//   const product = new Product({
//     title: "СВІТИЛЬНИК З БЕТОНУ ГОРИЛА",
//     price: 900,
//     img: "/images/products/product_1/lamp-2.png",
//     imgList: [
//       {
//         "img": "/images/products/product_1/lamp-2.png",
//         "title": "Настільна лампа з бетону Горила"
//       },
//       {
//         "img": "/images/products/product_1/lamp-3.png",
//         "title": "Настільна лампа з бетону Горила"
//       },
//       {
//         "img": "/images/products/product_1/lamp-4.png",
//         "title": "Настільна лампа з бетону Горила"
//       }
//     ],
//     description: "Світильник з бетону Горила зроблен в loft стилі з ретро виделкою, кабелем у бавовняної обмотці та лампою Едісона медового кольору. Настільна лампа виготовлена за авторською формою, тому зможе стати цікавим подарунком для себе або близьких людей, які цінують незвичайність і неповторність речей. Світильник добре впишеться в сучасний мінімалізм, арт-деко або індустріальний стиль простору. Зможе стати корисним елементом декору для поціновувачів тваринних мотивів в інтер`єрі. Настільна лампа Горила доступна в декількох кольорах. Виготовлена з бетону, що був армований мікроволокном для додання додаткової міцності. У комплект входять кабель довжиною близько 220 см, ретро лампа Едісона (40 Вт, патрон Е27). З заднього боку світильник має тумблер-перемикач. Характеристики лампи можуть трохи відрізнятися від фото.",
//     color: "grey",
//     dimensions: "19 / 13 / 14",
//     type: "pot",
//     weight: "близько 2 кг.",
//     isTop: true
//   })

//   try {
//     await product.save()
//     console.log('Product was added')
//   } catch (e) {
//     console.log(e)
//   }
// })

module.exports = router