var basicAuth = require('basic-auth');
var express = require('express');
var app = express();

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  console.log(user);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'blu70' && user.pass === '1') {
    return next();
  } else {
    return unauthorized(res);
  };
};

// login
app.get('/datasnap/rest/TServMet/EchoString/ABC/', auth, function (req, res) {
    console.log('Autenticando cliente mobile...');
    res.status(200).send('{"result":["ABC"]}');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//Content-type: text/html; charset=ISO-8859-1
//Pragma: dssession=895936.690184.573389,dssessionexpires=1200000

