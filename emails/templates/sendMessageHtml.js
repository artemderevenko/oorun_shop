module.exports = function(email, name, message) {
  return `
    <h3>Ім'я користувача: ${name}</h3>
    <h3>Email користувача: ${email}</h3>
    <h3>Повідомлення:</h3>
    <div>${message}</div>
  `
}