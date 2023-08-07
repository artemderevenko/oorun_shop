module.exports = function(url, token) {
  return `
    <h3>Забули пароль?</h3>
    <div>Якщо ні, то проігноруйте цей лист.</div>
    <div>Інакше перейдіть за посиланням нижче.</div>
    <a href="${url}/auth/password/${token}">${url}/auth/password/${token}</a>
  `
}