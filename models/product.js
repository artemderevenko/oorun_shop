const uuid = require('uuid')
const fs = require('fs')
const path = require('path')

class Product {
  constructor(
    title,
    price,
    description,
    img,
    colors,
    dimensions,
    weight,
    type,
    imgList,
    isTop
  ) {
    this.id = uuid.v4()
    this.title = title
    this.price = price
    this.img = img
    this.imgList = imgList
    this.description = description
    this.colors = colors
    this.dimensions = dimensions
    this.type = type
    this.weight = weight
    this.isTop = isTop
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      img: this.img,
      imgList: this.imgList,
      description: this.description,
      colors: this.colors,
      dimensions: this.dimensions,
      type: this.type,
      weight: this.weight,
      isTop: this.isTop
    }
  }

  async save() {
    const products = await Product.getAll()
    products.push(this.toJSON())

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'products.json'),
        JSON.stringify(products),
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'products.json'),
        'utf-8',
        (err, content) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(content))
          }
        }
      )
    })
  }

  static async getById(id) {
    const products = await Product.getAll()
    return products.find(product => product.id === id)
  }
}

module.exports = Product