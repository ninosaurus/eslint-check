"use strict";

var https = require('https');

module.exports = function (url, options) {
  return new Promise(function (resolve, reject) {
    var req = https.request(url, options, function (res) {
      var data = '';
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        if (res.statusCode >= 400) {
          var err = new Error("Received status code ".concat(res.statusCode));
          err.response = res;
          err.data = data;
          reject(err);
        } else {
          resolve({
            res: res,
            data: JSON.parse(data)
          });
        }
      });
    }).on('error', reject);

    if (options.body) {
      req.end(JSON.stringify(options.body));
    } else {
      req.end();
    }
  });
};