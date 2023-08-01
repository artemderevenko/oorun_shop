const { Schema, model } = require('mongoose')

const imageSchema = new Schema({
  img: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  imgList: {
    type: [imageSchema],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  dimensions: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  isTop: Boolean
})

module.exports = model('Product', productSchema)