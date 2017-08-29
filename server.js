var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Secret Box'
app.locals.secrets = {
  wowowow: 'I am a banana'
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(request, response) {
  response.send(app.locals.title)
})

app.get('/api/secrets/:id', function(request, response){
  var id = request.params.id
  database.raw("SELECT * FROM secrets WHERE id=?", [id])
  .then(function(data){
    if (data.rowCount == 0) { return response.sendStatus(404) }

    response.json(data.rows[0])
  })
})

app.post('/api/secrets', function(request, response){
  var id = Date.now()
  var message = request.body.message

  if (!message) {
    return response.status(422).send({ error: "No message property provided!"})
  }

  database.raw(
    'INSERT INTO secrets (message, created_at) VALUES (?, ?) RETURNING id, message',
    [message, new Date]
  )
  .then(function(data){
    response.status(201).json({ data.rows[0].id, data.rows[0].message })
  })
})

if(!module.parent) {
  app.listen(app.get('port'), function() {
    console.log(app.locals.title + " is running on " + app.get('port') + ".")
  })
}

module.exports = app
