const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

function allSecrets(data) {
  process.exit()
}

database.raw(
  'INSERT INTO secrets (message, created_at) VALUES (?, ?)',
  ["I open bananasfrom the wrong side", new Date]
)
.then(function() {
  database.raw('SELECT * FROM secrets')
  .then(allSecrets);
});
