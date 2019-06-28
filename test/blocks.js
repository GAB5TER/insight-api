'use strict';

var should = require('should');
var sinon = require('sinon');
var BlockController = require('../lib/blocks');
var orecore = require('orecore-lib');
var _ = require('lodash');

var blocks = require('./data/blocks.json');

var blockIndexes = {
  '000000e98b2840bbb6ac4eb7609f95cbf18a0b2204f1f7f25cfae35fe1d4bca3': {
    hash: '000000e98b2840bbb6ac4eb7609f95cbf18a0b2204f1f7f25cfae35fe1d4bca3',
    chainWork: '000000000000000000000000000000000000000000000000000001fd80ffa217',
    prevHash: '000000cb104b6fee080aacd46c1ad2d2f6bb937a385858024ea0e4979f81e4ab',
    confirmations: 53609,
    height: 133951
  },
  '000000cb104b6fee080aacd46c1ad2d2f6bb937a385858024ea0e4979f81e4ab': {
    hash: '000000cb104b6fee080aacd46c1ad2d2f6bb937a385858024ea0e4979f81e4ab',
    chainWork: '000000000000000000000000000000000000000000000000000001fd80bf69e6',
    prevHash: '000003b67208144470b575a6c705a4ba0ccec71684468cf4491be223dda3e08c',
    height: 133950
  },
  '000001be3b569119004d8d2e37e4d18670e8ad8063a0337e00887cf94b9a51ea': {
    hash: '000001be3b569119004d8d2e37e4d18670e8ad8063a0337e00887cf94b9a51ea',
    prevHash: '0000018ce15d8b806b16fef325be18a443be6db2513b79eef5d436b048eb11ce',
    height: 10000,
    difficulty: 0.002238706547879318
  },
  '000001d3e796011e031d82e4196ffe748460d2cc5be10432cfa1258e37bf82ac': {
    hash: '000001d3e796011e031d82e4196ffe748460d2cc5be10432cfa1258e37bf82ac',
    prevHash: '0000016197a844d2cd78fbffa5939b82b459bc6303a337abe221a9f0f7190d3e',
    height: 100000,
    difficulty: 0.001671505577755578
  },
  '000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1': {
    hash: '000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1',
    chainWork: '00000000000000000000000000000000000000000000000000000213720308bc',
    prevHash: '0000017d56db55c776348be0c6d8fd6f3e2e9b7c104b5e81350f65ea371125ee',
    nextHash: '000000c289d419b8dc4a09bebf693e5619fe7ecb07a69863714c6863ad59e7d3',
    confirmations: 37426,
    height: 150000,
    difficulty: 0.001519823874363267
  },
  '00000a8a227b376908341ec1c9e68c9415d2ebde77b376145fb25925247bef5c':{
    hash: '00000a8a227b376908341ec1c9e68c9415d2ebde77b376145fb25925247bef5c',
    chainWork: '0000000000000000000000000000000000000000000000000000000000200011',
    prevHash: '00000c0db74e7ed874ef2ad35c2401352326c1b4c58f5b7a5eaa2c22cac5c353',
    nextHash: '0000031a0bc20ee4a0537f22aa40a0dfc6ed2c44d42c1b853ab63e8d028152b3',
    confirmations: 187559,
    height: 1,
    difficulty: 0.0002441371325370145
  },
  1:{
    hash: '00000a8a227b376908341ec1c9e68c9415d2ebde77b376145fb25925247bef5c',
    chainWork: '0000000000000000000000000000000000000000000000000000000000200011',
    prevHash: '00000c0db74e7ed874ef2ad35c2401352326c1b4c58f5b7a5eaa2c22cac5c353',
    nextHash: '0000031a0bc20ee4a0537f22aa40a0dfc6ed2c44d42c1b853ab63e8d028152b3',
    confirmations: 187559,
    height: 1,
    difficulty: 0.0002441371325370145
  },
  150000: {
    hash: '000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1',
    chainWork: '00000000000000000000000000000000000000000000000000000213720308bc',
    prevHash: '0000017d56db55c776348be0c6d8fd6f3e2e9b7c104b5e81350f65ea371125ee',
    height: 150000
  }
};

describe('Blocks', function() {
  describe('/blocks/:blockHash route', function() {
    var insight = {
      'hash': '000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1',
      'confirmations': 37426,
      'size': 182,
      'height': 150000,
      'version': 536870912,
      'merkleroot': 'a8d4a20d80fffd7769aa827390a2b29c2fb78b1ed48b43d9dba01f917aceb81b',
      'tx': [
        "a8d4a20d80fffd7769aa827390a2b29c2fb78b1ed48b43d9dba01f917aceb81b"
      ],
      'time': 1539057522,
      'nonce': 58143,
      'bits': '1e0291f6',
      'difficulty': 0.001519823874363267,
      'chainwork': '00000000000000000000000000000000000000000000000000000213720308bc',
      'previousblockhash': '0000017d56db55c776348be0c6d8fd6f3e2e9b7c104b5e81350f65ea371125ee',
      'nextblockhash': '000000c289d419b8dc4a09bebf693e5619fe7ecb07a69863714c6863ad59e7d3',
      'reward': '10.00000000',
      'isMainChain': true
    };

    var orecoreBlock = orecore.Block.fromBuffer(new Buffer(blocks['000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1'], 'hex'));

    var node = {
      log: sinon.stub(),
      getBlock: sinon.stub().callsArgWith(1, null, orecoreBlock),
      services: {
        galactrumd: {
          getBlockHeader: sinon.stub().callsArgWith(1, null, blockIndexes['000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1']),
          isMainChain: sinon.stub().returns(true),
          height: 150000
        }
      }
    };

    it('block data should be correct', function(done) {
      var controller = new BlockController({node: node});
      var hash = '000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1';
      var req = {
        params: {
          blockHash: hash
        }
      };
      var res = {};
      var next = function() {
        should.exist(req.block);
        var block = req.block;
        should(block).eql(insight);
        done();
      };
      controller.block(req, res, next);
    });
  });

  describe('/blocks route', function() {

    var insight = {
      'blocks': [
        {
          'height': 133951,
          'size': 182,
          'hash': '000000e98b2840bbb6ac4eb7609f95cbf18a0b2204f1f7f25cfae35fe1d4bca3',
          'time': 1537035861,
          'txlength': 1
        },
        {
          'height': 133950,
          'size': 182,
          'hash': '000000cb104b6fee080aacd46c1ad2d2f6bb937a385858024ea0e4979f81e4ab',
          'time': 1537035801,
          'txlength': 1
        }
      ],
      'length': 2,
      'pagination': {
        'current': '2018-09-15',
        'currentTs': 1537055999,
        'isToday': false,
        'more': false,
        'next': '2018-09-16',
        'prev': '2018-09-14'
      }
    };

    var stub = sinon.stub();
    stub.onFirstCall().callsArgWith(1, null, new Buffer(blocks['000000e98b2840bbb6ac4eb7609f95cbf18a0b2204f1f7f25cfae35fe1d4bca3'], 'hex'));
    stub.onSecondCall().callsArgWith(1, null, new Buffer(blocks['000000cb104b6fee080aacd46c1ad2d2f6bb937a385858024ea0e4979f81e4ab'], 'hex'));

    var hashes = [
      '000000cb104b6fee080aacd46c1ad2d2f6bb937a385858024ea0e4979f81e4ab',
      '000000e98b2840bbb6ac4eb7609f95cbf18a0b2204f1f7f25cfae35fe1d4bca3'
    ];
    var node = {
      log: sinon.stub(),
      services: {
        galactrumd: {
          getRawBlock: stub,
          getBlockHeader: function(hash, callback) {
            callback(null, blockIndexes[hash]);
          },
          getBlockHashesByTimestamp: sinon.stub().callsArgWith(2, null, hashes)
        }
      }
    };

    it('should have correct data', function(done) {
      var blocks = new BlockController({node: node});

      var req = {
        query: {
          limit: 2,
          blockDate: '2018-09-15'
        }
      };

      var res = {
        jsonp: function(data) {
          should(data).eql(insight);
          done();
        }
      };

      blocks.list(req, res);
    });
  });

  describe('/block-index/:height route', function() {
    var node = {
      log: sinon.stub(),
      services: {
        galactrumd: {
          getBlockHeader: function(height, callback) {
            callback(null, blockIndexes[height]);
          }
        }
      }
    };

    it('should have correct data', function(done) {
      var blocks = new BlockController({node: node});

      var insight = {
        'blockHash': '000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1'
      };

      var height = 150000;

      var req = {
        params: {
          height: height
        }
      };
      var res = {
        jsonp: function(data) {
          should(data).eql(insight);
          done();
        }
      };

      blocks.blockIndex(req, res);
    });
  });

  it('reward for block 10000 should be correct', function(done) {
    var blockHex = "00000020ce11eb48b036d4f5ee793b51b26dbe43a418be25f3fe166b808b5de18c0100007f6e9dcdcd13e6cbcefd78a5a5a08d133552e53985a889812c1141f8e445221389f67a5aaebe011ed8b616000101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff05021027010fffffffff0100e9a43500000000232103a1ed124e77696cd4641fd9a9073436aa2a9241af17d8d418956d0988236fd819ac00000000";
    var orecoreBlock = orecore.Block.fromBuffer(new Buffer(blockHex, 'hex'));

    var node = {
      log: sinon.stub(),
      getBlock: sinon.stub().callsArgWith(1, null, orecoreBlock),
      services: {
        galactrumd: {
          getBlockHeader: sinon.stub().callsArgWith(1, null, blockIndexes['000001be3b569119004d8d2e37e4d18670e8ad8063a0337e00887cf94b9a51ea']),
          isMainChain: sinon.stub().returns(true),
          height: 10000
        }
      }
    };
    var blocks = new BlockController({node: node});

    var cb = function(err, res) {
      should.exist(res);
      var reward = res;
      should(reward).eql('10.00000000');
      done();
    };

    blocks.getBlockReward('000001be3b569119004d8d2e37e4d18670e8ad8063a0337e00887cf94b9a51ea', cb); // should return reward for block 100000
  });

  it('reward for block 100000 should be correct', function(done) {
    var blockHex = "000000203e0d19f7f0a921e2ab37a30363bc59b4829b93a5fffb78cdd244a897610100000dfee2f0503c4c2619494f0eacb273cc72d9869507e72d83e932167620f9c36723c75b5b4156021e91d004000101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0603a086010109ffffffff0100e9a43500000000232102603fab110394f922367b88f36f1dff7204ed38345b27e1aa846e46afb35965f4ac00000000";
    var orecoreBlock = orecore.Block.fromBuffer(new Buffer(blockHex, 'hex'));

    var node = {
      log: sinon.stub(),
      getBlock: sinon.stub().callsArgWith(1, null, orecoreBlock),
      services: {
        galactrumd: {
          getBlockHeader: sinon.stub().callsArgWith(1, null, blockIndexes['000001d3e796011e031d82e4196ffe748460d2cc5be10432cfa1258e37bf82ac']),
          isMainChain: sinon.stub().returns(true),
          height: 100000
        }
      }
    };
    var blocks = new BlockController({node: node});

    var cb = function(err, res) {
      should.exist(res);
      var reward = res;
      should(reward).eql('10.00000000');
      done();
    };

    blocks.getBlockReward('000001d3e796011e031d82e4196ffe748460d2cc5be10432cfa1258e37bf82ac', cb); // should return reward for block 100000
  });

  it('reward for block 150000 should be correct', function(done) {
    var blockHex = "00000020ee251137ea650f35815e4b107c9b2e3e6ffdd8c6e08b3476c755db567d0100001bb8ce7a911fa0dbd9438bd41e8bb72f9cb2a2907382aa6977fdff800da2d4a87227bc5bf691021e1fe300000101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0603f049020102ffffffff0100e9a43500000000232103eb076e07933a3db9082191964372ef480d8af2650b4e4c86b9cfb7f1105d5a36ac00000000";
    var orecoreBlock = orecore.Block.fromBuffer(new Buffer(blockHex, 'hex'));

    var node = {
      log: sinon.stub(),
      getBlock: sinon.stub().callsArgWith(1, null, orecoreBlock),
      services: {
        galactrumd: {
          getBlockHeader: sinon.stub().callsArgWith(1, null, blockIndexes['000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1']),
          isMainChain: sinon.stub().returns(true),
          height: 150000
        }
      }
    };
    var blocks = new BlockController({node: node});

    var cb = function(err, res) {
      should.exist(res);
      var reward = res;
      should(reward).eql('10.00000000');
      done();
    };

    blocks.getBlockReward('000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1', cb); // should return difficulty of block 150000
  });
});

describe('#getHeaders', function(){
  describe('/block-headers/:height route', function() {
    var node = {
      log: sinon.stub(),
      services: {
        galactrumd: {
          getBlockHeaders: function(blockIdentifier, callback, nbBlock) {
            var result = [];
            for(var i = 0; i<nbBlock; i++){
              result.push(blockIndexes[blockIdentifier])
            }
            callback(null, result);
          }
        }
      }
    };
    it('should give an array of 25 block headers', function() {
      var blocks = new BlockController({node: node});

      var insight = {
        hash: '00000a8a227b376908341ec1c9e68c9415d2ebde77b376145fb25925247bef5c',
        chainWork: '0000000000000000000000000000000000000000000000000000000000200011',
        prevHash: '00000c0db74e7ed874ef2ad35c2401352326c1b4c58f5b7a5eaa2c22cac5c353',
        nextHash: '0000031a0bc20ee4a0537f22aa40a0dfc6ed2c44d42c1b853ab63e8d028152b3',
        confirmations: 187559,
        height: 1,
        difficulty: 0.0002441371325370145
      };
      var req = {
        params: {
          blockIdentifier: "00000a8a227b376908341ec1c9e68c9415d2ebde77b376145fb25925247bef5c"
        }
      };
      var res = {
        jsonp: function(data) {
          data.should.have.property('headers');
          data.headers.should.have.length(25);
          should(data.headers[0]).eql(insight);
        }
      };

      blocks.blockHeaders(req, res)
    });
  });
  describe('/block-headers/:height/:nbOfBlock route', function() {
    var node = {
      log: sinon.stub(),
      services: {
        galactrumd: {
          getBlockHeaders: function(blockIdentifier, callback, nbBlock) {
            var result = [];
            for(var i = 0; i<nbBlock; i++){
              result.push(blockIndexes[blockIdentifier])
            }
            callback(null, result);
          }
        }
      }
    };
    it('should give an array of 50 block headers', function() {
      var blocks = new BlockController({node: node});
      var insight = {
        hash: '00000a8a227b376908341ec1c9e68c9415d2ebde77b376145fb25925247bef5c',
        chainWork: '0000000000000000000000000000000000000000000000000000000000200011',
        prevHash: '00000c0db74e7ed874ef2ad35c2401352326c1b4c58f5b7a5eaa2c22cac5c353',
        nextHash: '0000031a0bc20ee4a0537f22aa40a0dfc6ed2c44d42c1b853ab63e8d028152b3',
        confirmations: 187559,
        height: 1,
        difficulty: 0.0002441371325370145
      };

      var req = {
        params: {
          blockIdentifier: "00000a8a227b376908341ec1c9e68c9415d2ebde77b376145fb25925247bef5c",
          nbOfBlock:50
        }
      };
      var res = {
        jsonp: function(data) {
          data.should.have.property('headers');
          data.headers.should.have.length(50);
          should(data.headers[0]).eql(insight);
        }
      };

      blocks.blockHeaders(req, res);
    });
  });
});
