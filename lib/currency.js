'use strict';

var request = require('request');

function CurrencyController(options) {
  this.node = options.node;
  var refresh = options.currencyRefresh || CurrencyController.DEFAULT_CURRENCY_DELAY;
  this.currencyDelay = refresh * 60000;
  this.exchange_rates = {
    ore_usd: 0.00,
    btc_usd: 0.00,
    ore_btc: 0.00
  };
  this.timestamp = Date.now();
}

CurrencyController.DEFAULT_CURRENCY_DELAY = 10;

CurrencyController.prototype.index = function(req, res) {
  var self = this;
  var currentTime = Date.now();
  if (self.exchange_rates.ore_usd === 0.00 || currentTime >= (self.timestamp + self.currencyDelay)) {
    self.timestamp = currentTime;
    request('https://api.coinmarketcap.com/v1/ticker/bitcoin/', function(err, response, body) {
      if (err) {
        self.node.log.error(err);
      }
      if (!err && response.statusCode === 200) {
        var response = JSON.parse(body);
        self.exchange_rates.btc_usd = Number(response[0].price_usd);
      }
    });
    request('https://api.coinmarketcap.com/v1/ticker/galactrum/', function(err, response, body) {
      if (err) {
        self.node.log.error(err);
      }
      if (!err && response.statusCode === 200) {
        var response = JSON.parse(body);
        self.exchange_rates.ore_usd = Number(response[0].price_usd);
        self.exchange_rates.ore_btc = Number(response[0].price_btc);
        self.exchange_rates.bitstamp = response[0].price_usd; // backwards compatibility
      }
      res.jsonp({
        status: 200,
        data: self.exchange_rates
      });
    });
  } else {
    res.jsonp({
      status: 200,
      data: self.exchange_rates
    });
  }

};

module.exports = CurrencyController;
