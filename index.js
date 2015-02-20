var http = require('http'),
  querystring = require('querystring'),
  cheerio = require('cheerio'),
  scoreKungen = "",
  scoreHenke = "";

request = function(params, callback){
  var response = '';
  var req = http.request(params.options, function(res){
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      response += chunk;
    });

    res.on('end', function(err, res) {
      callback(err, response);
    });
  });

  if(params.postData){
    req.write(params.postData);
  }
  req.end();
  req.on('error', function(err){
    console.log('woops... ', err.message);
    callback(err, false);
  });
};

var params = {
  options: {
    host: 'tryggveblom.se',
    port: 80,
    path: '/kriget/',
    method: 'GET'
  }
};

request(params, function(err, response){
  $ = cheerio.load(response),
  scoreKungen = $('#kung').find('span').text();
  scoreHenke = $('#henke').find('span').text();

  var postData = querystring.stringify({
    'speech' : 'Ställningen i kriget är, Henke: ' + scoreHenke + ', Kungen: ' + scoreKungen,
    'lang': 'sv'
  });


  params = {
    options: {
      host: '127.0.0.1',
      port: 8080,
      path: '/api/v1/speak',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    },
    postData: postData
  };

  request(params, function(err, response){
    console.log(err, response);
  });
});