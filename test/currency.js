'use strict';

var should = require('should');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var CurrencyController = require('../lib/currency');

describe('Currency', function() {

  var galactrumData = [
    {
        "id": "galactrum", 
        "name": "Galactrum", 
        "symbol": "ORE", 
        "rank": "1314", 
        "price_usd": "0.1369563055", 
        "price_btc": "0.00003310", 
        "24h_volume_usd": "491.114597223", 
        "market_cap_usd": "360806.0", 
        "available_supply": "2634461.0", 
        "total_supply": "3354461.0", 
        "max_supply": null, 
        "percent_change_1h": "0.01", 
        "percent_change_24h": "-0.85", 
        "percent_change_7d": "-10.2", 
        "last_updated": "1543734259"
    }
  ];
  it('will make live request to coinmarketcap', function(done) {
    var currency = new CurrencyController({});
    var req = {};
    var res = {
      jsonp: function(response) {
        response.status.should.equal(200);
        should.exist(response.data.ore_usd);
        (typeof response.data.ore_usd).should.equal('number');
        should.exist(response.data.ore_btc);
        (typeof response.data.ore_btc).should.equal('number');
        should.exist(response.data.btc_usd);
        (typeof response.data.btc_usd).should.equal('number');
        done();
      }
    };
    currency.index(req, res);
  });

  it('will retrieve a fresh value', function(done) {
    var TestCurrencyController = proxyquire('../lib/currency', {
      request: sinon.stub().callsArgWith(1, null, {statusCode: 200}, JSON.stringify(galactrumData))
    });
    var node = {
      log: {
        error: sinon.stub()
      }
    };
    var currency = new TestCurrencyController({node: node});
    currency.exchange_rates = {
      ore_usd: 0.1369563055,
      btc_usd: 682.93,
      ore_btc: 0.01388998
    };
    currency.timestamp = Date.now() - 61000 * CurrencyController.DEFAULT_CURRENCY_DELAY;
    var req = {};
    var res = {
      jsonp: function(response) {
        response.status.should.equal(200);
        should.exist(response.data.ore_usd);
        response.data.ore_usd.should.equal(0.1369563055);
        done();
      }
    };
    currency.index(req, res);
  });

  it('will log an error from request', function(done) {
    var TestCurrencyController = proxyquire('../lib/currency', {
      request: sinon.stub().callsArgWith(1, new Error('test'))
    });
    var node = {
      log: {
        error: sinon.stub()
      }
    };
    var currency = new TestCurrencyController({node: node});
    currency.exchange_rates = {
      ore_usd: 9.4858840414,
      btc_usd: 682.93,
      ore_btc: 0.01388998
    };
    currency.timestamp = Date.now() - 65000 * CurrencyController.DEFAULT_CURRENCY_DELAY;
    var req = {};
    var res = {
      jsonp: function(response) {
        response.status.should.equal(200);
        should.exist(response.data);
        response.data.ore_usd.should.equal(9.4858840414);
        node.log.error.callCount.should.equal(2);
        done();
      }
    };
    currency.index(req, res);
  });

  it('will retrieve a cached value', function(done) {
    var request = sinon.stub();
    var TestCurrencyController = proxyquire('../lib/currency', {
      request: request
    });
    var node = {
      log: {
        error: sinon.stub()
      }
    };
    var currency = new TestCurrencyController({node: node});
    currency.exchange_rates = {
      ore_usd: 9.4858840414,
      btc_usd: 682.93,
      ore_btc: 0.01388998
    };
    currency.timestamp = Date.now();
    var req = {};
    var res = {
      jsonp: function(response) {
        response.status.should.equal(200);
        should.exist(response.data.ore_usd);
        response.data.ore_usd.should.equal(9.4858840414);
        request.callCount.should.equal(0);
        done();
      }
    };
    currency.index(req, res);
  });

});
