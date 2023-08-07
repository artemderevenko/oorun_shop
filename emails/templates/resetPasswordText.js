module.exports = function(url, token) {
  return `
    Забули пароль?

    Якщо ні, то проігноруйте цей лист.
    Інакше перейдіть за посиланням нижче.
    ${url}/auth/password/${token}
  `
}