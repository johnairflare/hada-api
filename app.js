const express = require('express');
const app = express();

app.get('/tweets/:lat/:long', require('./controllers/twitterController'));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});