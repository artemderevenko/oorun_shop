const { Schema, model } = require('mongoose')

const cartSchema = new Schema({
  count: {
    type: Number,
    required: true,
    default: 0
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
})

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [cartSchema]
  }
})

userSchema.methods.addToCart = function (product) {
  const items = [...this.cart.items]
  const idx = items.findIndex(p => {
    return p.productId.toString() === product._id.toString()
  })

  if (idx >= 0) {
    items[idx].count = items[idx].count + 1
  } else {
    items.push({
      count: 1,
      productId: product._id
    })
  }

  this.cart = { items }
  return this.save()
}

userSchema.methods.removeFromCart = function (id) {
  const items = [...this.cart.items].filter(p => p.productId.toString() !== id.toString())
  this.cart = { items }
  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}

module.exports = model('User', userSchema)