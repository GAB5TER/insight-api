'use strict';

var should = require('should');
var sinon = require('sinon');
var BlockController = require('../lib/blocks');
var orecore = require('orecore-lib');
var _ = require('lodash');

var blocks = require('./data/blocks.json');

var blockIndexes = {
  '0000000000000afa0c3c0afd450c793a1e300ec84cbe9555166e06132f19a8f7': {
    hash: '0000000000000afa0c3c0afd450c793a1e300ec84cbe9555166e06132f19a8f7',
    chainWork: '0000000000000000000000000000000000000000000000054626b1839ade284a',
    prevHash: '00000000000001a55f3214e9172eb34b20e0bc5bd6b8007f3f149fca2c8991a4',
    nextHash: '000000000001e866a8057cde0c650796cb8a59e0e6038dc31c69d7ca6649627d',
    confirmations: 119,
    height: 533974
  },
  '000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7': {
    hash: '000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7',
    chainWork: '00000000000000000000000000000000000000000000000544ea52e1575ca753',
    prevHash: '00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441',
    confirmations: 119,
    height: 533951
  },
  '00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441': {
    hash: '00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441',
    chainWork: '00000000000000000000000000000000000000000000000544ea52e0575ba752',
    prevHash: '000000000001b9c41e6c4a7b81a068b50cf3f522ee4ac1e942e75ec16e090547',
    height: 533950
  },
  '000000000000000004a118407a4e3556ae2d5e882017e7ce526659d8073f13a4': {
    hash: '000000000000000004a118407a4e3556ae2d5e882017e7ce526659d8073f13a4',
    prevHash: '00000000000000000a9d74a7b527f7b995fc21ceae5aa21087b443469351a362',
    height: 375493
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
  '0000047d24635e347be3aaaeb66c26be94901a2f962feccd4f95090191f208c1':{
    hash: '0000047d24635e347be3aaaeb66c26be94901a2f962feccd4f95090191f208c1',
    chainWork: '0000000000000000000000000000000000000000000000000000000000200011',
    prevHash: '00000bafbc94add76cb75e2ec92894837288a481e5c005f6563d91623bf8bc2c',
    nextHash: '00000c6264fab4ba2d23990396f42a76aa4822f03cbc7634b79f4dfea36fccc2',
    confirmations: 40493,
    height: 1,
    difficulty: 0.0002441371325370145
  },
  1:{
    hash: '0000047d24635e347be3aaaeb66c26be94901a2f962feccd4f95090191f208c1',
    chainWork: '0000000000000000000000000000000000000000000000000000000000200011',
    prevHash: '00000bafbc94add76cb75e2ec92894837288a481e5c005f6563d91623bf8bc2c',
    nextHash: '00000c6264fab4ba2d23990396f42a76aa4822f03cbc7634b79f4dfea36fccc2',
    confirmations: 40493,
    height: 1,
    difficulty: 0.0002441371325370145
  },
  533974: {
    hash: '0000000000000afa0c3c0afd450c793a1e300ec84cbe9555166e06132f19a8f7',
    chainWork: '0000000000000000000000000000000000000000000000054626b1839ade284a',
    prevHash: '00000000000001a55f3214e9172eb34b20e0bc5bd6b8007f3f149fca2c8991a4',
    height: 533974
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
      'isMainChain': true,
      'poolInfo': {}
    };

      debugger;
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
      debugger;
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

    it('block pool info should be correct', function(done) {
      var block = orecore.Block.fromString(blocks['000000000000000004a118407a4e3556ae2d5e882017e7ce526659d8073f13a4']);
      var node = {
        log: sinon.stub(),
        getBlock: sinon.stub().callsArgWith(1, null, block),
        services: {
          galactrumd: {
            getBlockHeader: sinon.stub().callsArgWith(1, null, blockIndexes['000000000000000004a118407a4e3556ae2d5e882017e7ce526659d8073f13a4']),
            isMainChain: sinon.stub().returns(true),
            height: 534092
          }
        }
      };
      var controller = new BlockController({node: node});
      var req = {
        params: {
          blockHash: hash
        }
      };
      var res = {};
      var next = function() {
        should.exist(req.block);
        var block = req.block;
        req.block.poolInfo.poolName.should.equal('Discus Fish');
        req.block.poolInfo.url.should.equal('http://f2pool.com/');
        done();
      };

      var hash = '000000000000000004a118407a4e3556ae2d5e882017e7ce526659d8073f13a4';

      controller.block(req, res, next);
    });

  });

//  describe('/blocks route', function() {
//
//    var insight = {
//      'blocks': [
//        {
//          'height': 533951,
//          'size': 206,
//          'hash': '000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7',
//          'time': 1440978683,
//          'txlength': 1,
//          'poolInfo': {
//            'poolName': 'AntMiner',
//            'url': 'https://bitmaintech.com/'
//          }
//        },
//        {
//          'height': 533950,
//          'size': 206,
//          'hash': '00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441',
//          'time': 1440977479,
//          'txlength': 1,
//          'poolInfo': {
//            'poolName': 'AntMiner',
//            'url': 'https://bitmaintech.com/'
//          }
//        }
//      ],
//      'length': 2,
//      'pagination': {
//        'current': '2015-08-30',
//        'currentTs': 1440979199,
//        'isToday': false,
//        'more': false,
//        'next': '2015-08-31',
//        'prev': '2015-08-29'
//      }
//    };
//
//    var stub = sinon.stub();
//    stub.onFirstCall().callsArgWith(1, null, new Buffer(blocks['000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7'], 'hex'));
//    stub.onSecondCall().callsArgWith(1, null, new Buffer(blocks['00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441'], 'hex'));
//
//    var hashes = [
//      '00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441',
//      '000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7'
//    ];
//    var node = {
//      log: sinon.stub(),
//      services: {
//        galactrumd: {
//          getRawBlock: stub,
//          getBlockHeader: function(hash, callback) {
//            callback(null, blockIndexes[hash]);
//          },
//          getBlockHashesByTimestamp: sinon.stub().callsArgWith(2, null, hashes)
//        }
//      }
//    };
//
//    it('should have correct data', function(done) {
//      var blocks = new BlockController({node: node});
//
//      var req = {
//        query: {
//          limit: 2,
//          blockDate: '2015-08-30'
//        }
//      };
//
//      var res = {
//        jsonp: function(data) {
//          should(data).eql(insight);
//          done();
//        }
//      };
//
//      blocks.list(req, res);
//    });
//  });
//
//  describe('/block-index/:height route', function() {
//    var node = {
//      log: sinon.stub(),
//      services: {
//        galactrumd: {
//          getBlockHeader: function(height, callback) {
//            callback(null, blockIndexes[height]);
//          }
//        }
//      }
//    };
//
//    it('should have correct data', function(done) {
//      var blocks = new BlockController({node: node});
//
//      var insight = {
//        'blockHash': '000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1'
//      };
//
//      var height = 599999;
//
//      var req = {
//        params: {
//          height: height
//        }
//      };
//      var res = {
//        jsonp: function(data) {
//          should(data).eql(insight);
//          done();
//        }
//      };
//
//      blocks.blockIndex(req, res);
//    });
//  });
//
//  it('reward for block 10000 should be correct', function(done) {
//    var blockHex = "00000020ce11eb48b036d4f5ee793b51b26dbe43a418be25f3fe166b808b5de18c0100007f6e9dcdcd13e6cbcefd78a5a5a08d133552e53985a889812c1141f8e445221389f67a5aaebe011ed8b616000101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff05021027010fffffffff0100e9a43500000000232103a1ed124e77696cd4641fd9a9073436aa2a9241af17d8d418956d0988236fd819ac00000000";
//    var orecoreBlock = orecore.Block.fromBuffer(new Buffer(blockHex, 'hex'));
//
//    var node = {
//      log: sinon.stub(),
//      getBlock: sinon.stub().callsArgWith(1, null, orecoreBlock),
//      services: {
//        galactrumd: {
//          getBlockHeader: sinon.stub().callsArgWith(1, null, blockIndexes['000001be3b569119004d8d2e37e4d18670e8ad8063a0337e00887cf94b9a51ea']),
//          isMainChain: sinon.stub().returns(true),
//          height: 10000
//        }
//      }
//    };
//    var blocks = new BlockController({node: node});
//
//    var cb = function(err, res) {
//      should.exist(res);
//      var reward = res;
//      should(reward).eql('10.00000000');
//      done();
//    };
//
//    blocks.getBlockReward('000001be3b569119004d8d2e37e4d18670e8ad8063a0337e00887cf94b9a51ea', cb); // should return reward for block 100000
//  });
//
//  it('reward for block 100000 should be correct', function(done) {
//    var blockHex = "000000203e0d19f7f0a921e2ab37a30363bc59b4829b93a5fffb78cdd244a897610100000dfee2f0503c4c2619494f0eacb273cc72d9869507e72d83e932167620f9c36723c75b5b4156021e91d004000101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0603a086010109ffffffff0100e9a43500000000232102603fab110394f922367b88f36f1dff7204ed38345b27e1aa846e46afb35965f4ac00000000";
//    var orecoreBlock = orecore.Block.fromBuffer(new Buffer(blockHex, 'hex'));
//
//    var node = {
//      log: sinon.stub(),
//      getBlock: sinon.stub().callsArgWith(1, null, orecoreBlock),
//      services: {
//        galactrumd: {
//          getBlockHeader: sinon.stub().callsArgWith(1, null, blockIndexes['000001d3e796011e031d82e4196ffe748460d2cc5be10432cfa1258e37bf82ac']),
//          isMainChain: sinon.stub().returns(true),
//          height: 100000
//        }
//      }
//    };
//    var blocks = new BlockController({node: node});
//
//    var cb = function(err, res) {
//      should.exist(res);
//      var reward = res;
//      should(reward).eql('10.00000000');
//      done();
//    };
//
//    blocks.getBlockReward('000001d3e796011e031d82e4196ffe748460d2cc5be10432cfa1258e37bf82ac', cb); // should return reward for block 100000
//  });
//
//  it('reward for block 150000 should be correct', function(done) {
//    var blockHex = "00000020ee251137ea650f35815e4b107c9b2e3e6ffdd8c6e08b3476c755db567d0100001bb8ce7a911fa0dbd9438bd41e8bb72f9cb2a2907382aa6977fdff800da2d4a87227bc5bf691021e1fe300000101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0603f049020102ffffffff0100e9a43500000000232103eb076e07933a3db9082191964372ef480d8af2650b4e4c86b9cfb7f1105d5a36ac00000000";
//    var orecoreBlock = orecore.Block.fromBuffer(new Buffer(blockHex, 'hex'));
//
//    var node = {
//      log: sinon.stub(),
//      getBlock: sinon.stub().callsArgWith(1, null, orecoreBlock),
//      services: {
//        galactrumd: {
//          getBlockHeader: sinon.stub().callsArgWith(1, null, blockIndexes['000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1']),
//          isMainChain: sinon.stub().returns(true),
//          height: 150000
//        }
//      }
//    };
//    var blocks = new BlockController({node: node});
//
//    var cb = function(err, res) {
//      should.exist(res);
//      var reward = res;
//      should(reward).eql('10.00000000');
//      done();
//    };
//
//    blocks.getBlockReward('000001b7e6e9754e582b42676da254c3db3edf0fc2a2f2a63a47f63767dd4ae1', cb); // should return difficulty of block 100000
//  });
//});
//
//describe('#getHeaders', function(){
//	describe('/block-headers/:height route', function() {
//		var node = {
//			log: sinon.stub(),
//			services: {
//        galactrumd: {
//					getBlockHeaders: function(blockIdentifier, callback, nbBlock) {
//					  var result = [];
//					  for(var i = 0; i<nbBlock; i++){
//					    result.push(blockIndexes[blockIdentifier])
//            }
//						callback(null, result);
//					}
//				}
//			}
//		};
//		it('should give an array of 25 block headers', function() {
//			var blocks = new BlockController({node: node});
//
//			var insight = {
//        hash: '0000047d24635e347be3aaaeb66c26be94901a2f962feccd4f95090191f208c1',
//        chainWork: '0000000000000000000000000000000000000000000000000000000000200011',
//        prevHash: '00000bafbc94add76cb75e2ec92894837288a481e5c005f6563d91623bf8bc2c',
//        nextHash: '00000c6264fab4ba2d23990396f42a76aa4822f03cbc7634b79f4dfea36fccc2',
//        confirmations: 40493,
//        height: 1,
//        difficulty: 0.0002441371325370145
//    };
//			var req = {
//				params: {
//          blockIdentifier: "0000047d24635e347be3aaaeb66c26be94901a2f962feccd4f95090191f208c1"
//				}
//			};
//			var res = {
//				jsonp: function(data) {
//				  data.should.have.property('headers');
//          data.headers.should.have.length(25);
//					should(data.headers[0]).eql(insight);
//				}
//			};
//
//      blocks.blockHeaders(req, res)
//		});
//	});
//	describe('/block-headers/:height/:nbOfBlock route', function() {
//		var node = {
//			log: sinon.stub(),
//			services: {
//        galactrumd: {
//          getBlockHeaders: function(blockIdentifier, callback, nbBlock) {
//            var result = [];
//            for(var i = 0; i<nbBlock; i++){
//              result.push(blockIndexes[blockIdentifier])
//            }
//            callback(null, result);
//          }
//				}
//			}
//		};
//		it('should give an array of 50 block headers', function() {
//			var blocks = new BlockController({node: node});
//			var insight = {
//        hash: '0000047d24635e347be3aaaeb66c26be94901a2f962feccd4f95090191f208c1',
//        chainWork: '0000000000000000000000000000000000000000000000000000000000200011',
//        prevHash: '00000bafbc94add76cb75e2ec92894837288a481e5c005f6563d91623bf8bc2c',
//        nextHash: '00000c6264fab4ba2d23990396f42a76aa4822f03cbc7634b79f4dfea36fccc2',
//        confirmations: 40493,
//        height: 1,
//        difficulty: 0.0002441371325370145
//			};
//			var height = 533974;
//			var req = {
//				params: {
//					blockIdentifier: "0000047d24635e347be3aaaeb66c26be94901a2f962feccd4f95090191f208c1",
//					nbOfBlock:50
//				}
//			};
//			var res = {
//				jsonp: function(data) {
//          data.should.have.property('headers');
//          data.headers.should.have.length(50);
//          should(data.headers[0]).eql(insight);
//				}
//			};
//
//			blocks.blockHeaders(req, res);
//		});
//	});
});
