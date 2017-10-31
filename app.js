const express = require('express');
const app = express();

app.get('/tweets/:lat/:long', require('./controllers/twitterController'));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
var port = 8080;
app.listen(port, () => {
  console.log('hada api running '+port+'!');
});
