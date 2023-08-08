module.exports = function(email, name, message) {
  return `
    Ім'я користувача: ${name}
    Email користувача: ${email}
    Повідомлення: ${message} 
  `
}