const keys = require('../keys')
const ElasticEmail = require('@elasticemail/elasticemail-client')

module.exports = function(from, to, subject, HTMLContent, plainTextContent) {

  const client = ElasticEmail.ApiClient.instance

  /* Generate and use your API key */
  const apikey = client.authentications['apikey']
  apikey.apiKey = keys.ELASTIC_API_KEY

  const emailsApi = new ElasticEmail.EmailsApi()

  const emailData = {
    Recipients: {
      To: [to]
    },
    Content: {
      Body: [
        {
          ContentType: "HTML",
          Charset: "utf-8",
          Content: HTMLContent
        },
        {
          ContentType: "PlainText",
          Charset: "utf-8",
          Content: plainTextContent
        }
      ],
      From: from,
      Subject: subject
    }
  }

  const callback = (error, data, response) => {
    if (error) {
      console.error(error)
    } else {
      console.log('API called successfully.')
      console.log('Email sent.')
    }
  }

  emailsApi.emailsTransactionalPost(emailData, callback)
}