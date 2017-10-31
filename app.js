const express = require('express');
const app = express();

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');

app.get('/', function (req, res) { res.send('Welcome!');});
app.get('/tweets/:lat/:long', require('./controllers/twitterController'));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(app.get('port'), app.get('ip'), function () {

    console.log( "Hada api on " + app.get('ip') + ", server_port " + app.get('port')  );

});
