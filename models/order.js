const { Schema, model } = require('mongoose')

const productSchema = new Schema({
  count: {
    type: Number,
    required: true,
  },
  product: {
    type: Object,
    required: true
  },
})

const orderSchema = new Schema({
  products: {
    type: [productSchema],
    required: true
  },
  user: {
    name: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  order_date: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('Order', orderSchema)