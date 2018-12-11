'use strict';

var _ = require('lodash');
var $ = require('preconditions').singleton();
var sjcl = require('sjcl');
var Stringify = require('json-stable-stringify');

var Constants = require('./constants');
var Defaults = require('./defaults');

function Utils() {};

Utils.SJCL = {};

Utils.encryptMessage = function(message, encryptingKey) {
  var key = sjcl.codec.base64.toBits(encryptingKey);
  return sjcl.encrypt(key, message, _.defaults({
    ks: 128,
    iter: 1,
  }, Utils.SJCL));
};

// Will throw if it can't decrypt
Utils.decryptMessage = function(cyphertextJson, encryptingKey) {
  if (!cyphertextJson) return;

  if (!encryptingKey)
    throw 'No key';

  var key = sjcl.codec.base64.toBits(encryptingKey);
  return sjcl.decrypt(key, cyphertextJson);
};


Utils.decryptMessageNoThrow = function(cyphertextJson, encryptingKey) {
  function isJsonString(str) {
    var r;
    try {
      r=JSON.parse(str);
    } catch (e) {
      return false;
    }
    return r;
  }

  if (!encryptingKey)
    return '<ECANNOTDECRYPT>';

  if (!cyphertextJson)
    return '';

  // no sjcl encrypted json
  var r= isJsonString(cyphertextJson);
  if (!r|| !r.iv || !r.ct) {
    return cyphertextJson;
  }

  try {
    return Utils.decryptMessage(cyphertextJson, encryptingKey);
  } catch (e) {
    return '<ECANNOTDECRYPT>';
  }
};


/* TODO: It would be nice to be compatible with bitcoind signmessage. How
 * the hash is calculated there? */
Utils.hashMessage = function(text, coin) {
  $.checkArgument(text);
  var Bitcore;
  if (coin && coin == 'btc') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'bch') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'safe') {
    Bitcore = require('bitcore-lib-safe-mini');
  } else if (coin && coin == 'btcz') {
    Bitcore = require('bitcore-lib-btcz-mini');
  } else if (coin && coin == 'zcl') {
    Bitcore = require('bitcore-lib-zcl-mini');
  } else if (coin && coin == 'anon') {
    Bitcore = require('bitcore-lib-anon-mini');
  } else if (coin && coin == 'zel') {
    Bitcore = require('bitcore-lib-zel-mini');
  } else if (coin && coin == 'zen') {
    Bitcore = require('bitcore-lib-zen-mini');
  } else if (coin && coin == 'rvn') {
    Bitcore = require('bitcore-lib-rvn-mini');
  } else if (coin && coin == 'ltc') {
    Bitcore = require('bitcore-lib-ltc-mini');
  } else {
    debugger;
  }

  var buf = new Buffer(text);
  var ret = Bitcore.crypto.Hash.sha256sha256(buf);
  ret = new Bitcore.encoding.BufferReader(ret).readReverse();
  return ret;
};


Utils.signMessage = function(text, privKey, coin) {
  $.checkArgument(text);
  var Bitcore;
  if (coin && coin == 'btc') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'bch') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'safe') {
    Bitcore = require('bitcore-lib-safe-mini');
  } else if (coin && coin == 'btcz') {
    Bitcore = require('bitcore-lib-btcz-mini');
  } else if (coin && coin == 'zcl') {
    Bitcore = require('bitcore-lib-zcl-mini');
  } else if (coin && coin == 'anon') {
    Bitcore = require('bitcore-lib-anon-mini');
  } else if (coin && coin == 'zel') {
    Bitcore = require('bitcore-lib-zel-mini');
  } else if (coin && coin == 'zen') {
    Bitcore = require('bitcore-lib-zen-mini');
  } else if (coin && coin == 'rvn') {
    Bitcore = require('bitcore-lib-rvn-mini');
  } else if (coin && coin == 'ltc') {
    Bitcore = require('bitcore-lib-ltc-mini');
  } else {
    debugger;
  }
  var priv = new Bitcore.PrivateKey(privKey);
  var hash = Utils.hashMessage(text, coin);
  return Bitcore.crypto.ECDSA.sign(hash, priv, 'little').toString();
};


Utils.verifyMessage = function(text, signature, pubKey, coin) {
  $.checkArgument(text);
  $.checkArgument(pubKey);

  if (!signature)
    return false;
  var Bitcore;
  if (coin && coin == 'btc') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'bch') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'safe') {
    Bitcore = require('bitcore-lib-safe-mini');
  } else if (coin && coin == 'btcz') {
    Bitcore = require('bitcore-lib-btcz-mini');
  } else if (coin && coin == 'zcl') {
    Bitcore = require('bitcore-lib-zcl-mini');
  } else if (coin && coin == 'anon') {
    Bitcore = require('bitcore-lib-anon-mini');
  } else if (coin && coin == 'zel') {
    Bitcore = require('bitcore-lib-zel-mini');
  } else if (coin && coin == 'zen') {
    Bitcore = require('bitcore-lib-zen-mini');
  } else if (coin && coin == 'rvn') {
    Bitcore = require('bitcore-lib-rvn-mini');
  } else if (coin && coin == 'ltc') {
    Bitcore = require('bitcore-lib-ltc-mini');
  } else {
    debugger;
  }

  var pub = new Bitcore.PublicKey(pubKey);
  var hash = Utils.hashMessage(text, coin);

  try {
    var sig = new Bitcore.crypto.Signature.fromString(signature);
    return Bitcore.crypto.ECDSA.verify(hash, sig, pub, 'little');
  } catch (e) {
    return false;
  }
};

Utils.privateKeyToAESKey = function(privKey, coin) {
  var Bitcore;
  if (coin && coin == 'btc') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'bch') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'safe') {
    Bitcore = require('bitcore-lib-safe-mini');
  } else if (coin && coin == 'btcz') {
    Bitcore = require('bitcore-lib-btcz-mini');
  } else if (coin && coin == 'zcl') {
    Bitcore = require('bitcore-lib-zcl-mini');
  } else if (coin && coin == 'anon') {
    Bitcore = require('bitcore-lib-anon-mini');
  } else if (coin && coin == 'zel') {
    Bitcore = require('bitcore-lib-zel-mini');
  } else if (coin && coin == 'zen') {
    Bitcore = require('bitcore-lib-zen-mini');
  } else if (coin && coin == 'rvn') {
    Bitcore = require('bitcore-lib-rvn-mini');
  } else if (coin && coin == 'ltc') {
    Bitcore = require('bitcore-lib-ltc-mini');
  } else {
    debugger;
  }
  $.checkArgument(Bitcore.PrivateKey.isValid(privKey), 'The private key received is invalid');
  var pk = Bitcore.PrivateKey.fromString(privKey);
  return Bitcore.crypto.Hash.sha256(pk.toBuffer()).slice(0, 16).toString('base64');
};

Utils.getCopayerHash = function(name, xPubKey, requestPubKey) {
  return [name, xPubKey, requestPubKey].join('|');
};

Utils.getProposalHash = function(proposalHeader) {
  function getOldHash(toAddress, amount, message, payProUrl) {
    return [toAddress, amount, (message || ''), (payProUrl || '')].join('|');
  };

  // For backwards compatibility
  if (arguments.length > 1) {
    return getOldHash.apply(this, arguments);
  }

  return Stringify(proposalHeader);
};

Utils.deriveAddress = function(scriptType, publicKeyRing, path, m, network, coin) {
  $.checkArgument(_.includes(_.values(Constants.SCRIPT_TYPES), scriptType));

  coin = coin || 'safe';
//  var bitcore = Bitcore_[coin];
  var CoreHDPubK;
  var CoreAddr;
  if (coin && coin == 'btc') {
    CoreHDPubK = require('bitcore-lib').HDPublicKey;
    CoreAddr = require('bitcore-lib').Address;
  } else if (coin && coin == 'bch') {
    CoreHDPubK = require('bitcore-lib-cash').HDPublicKey;
    CoreAddr = require('bitcore-lib-cash').Address;
  } else if (coin && coin == 'safe') {
    CoreHDPubK = require('bitcore-lib-safe-mini').HDPublicKey;
    CoreAddr = require('bitcore-lib-safe-mini').Address;
  } else if (coin && coin == 'btcz') {
    CoreHDPubK = require('bitcore-lib-btcz-mini').HDPublicKey;
    CoreAddr = require('bitcore-lib-btcz-mini').Address;
  } else if (coin && coin == 'zcl') {
    CoreHDPubK = require('bitcore-lib-zcl-mini').HDPublicKey;
    CoreAddr = require('bitcore-lib-zcl-mini').Address;
  } else if (coin && coin == 'anon') {
    CoreHDPubK = require('bitcore-lib-anon-mini').HDPublicKey;
    CoreAddr = require('bitcore-lib-anon-mini').Address;
  } else if (coin && coin == 'zel') {
    CoreHDPubK = require('bitcore-lib-zel-mini').HDPublicKey;
    CoreAddr = require('bitcore-lib-zel-mini').Address;
  } else if (coin && coin == 'zen') {
    CoreHDPubK = require('bitcore-lib-zen-mini').HDPublicKey;
    CoreAddr = require('bitcore-lib-zen-mini').Address;
  } else if (coin && coin == 'rvn') {
    CoreHDPubK = require('bitcore-lib-rvn-mini').HDPublicKey;
    CoreAddr = require('bitcore-lib-rvn-mini').Address;
  } else if (coin && coin == 'ltc') {
    CoreHDPubK = require('bitcore-lib-ltc-mini').HDPublicKey;
    CoreAddr = require('bitcore-lib-ltc-mini').Address;
  } else {
    debugger;
  }
  var publicKeys = _.map(publicKeyRing, function(item) {
    var xpub = new CoreHDPubK(item.xPubKey);
    return xpub.deriveChild(path).publicKey;
  });

  var bitcoreAddress;
  switch (scriptType) {
    case Constants.SCRIPT_TYPES.P2SH:
      bitcoreAddress = CoreAddr.createMultisig(publicKeys, m, network);
      break;
    case Constants.SCRIPT_TYPES.P2PKH:
      $.checkState(_.isArray(publicKeys) && publicKeys.length == 1);
      bitcoreAddress = CoreAddr.fromPublicKey(publicKeys[0], network);
      break;
  }

  return {
    address: bitcoreAddress.toString(),
    path: path,
    publicKeys: _.invokeMap(publicKeys, 'toString'),
  };
};

Utils.xPubToCopayerId = function(coin, xpub) {
  var str = coin == 'safe' ? xpub : coin + xpub;
  var hash = sjcl.hash.sha256.hash(str);
  return sjcl.codec.hex.fromBits(hash);
};

Utils.signRequestPubKey = function(requestPubKey, xPrivKey, coin) {
  var Bitcore;
  if (coin && coin == 'btc') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'bch') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'safe') {
    Bitcore = require('bitcore-lib-safe-mini');
  } else if (coin && coin == 'btcz') {
    Bitcore = require('bitcore-lib-btcz-mini');
  } else if (coin && coin == 'zcl') {
    Bitcore = require('bitcore-lib-zcl-mini');
  } else if (coin && coin == 'anon') {
    Bitcore = require('bitcore-lib-anon-mini');
  } else if (coin && coin == 'zel') {
    Bitcore = require('bitcore-lib-zel-mini');
  } else if (coin && coin == 'zen') {
    Bitcore = require('bitcore-lib-zen-mini');
  } else if (coin && coin == 'rvn') {
    Bitcore = require('bitcore-lib-rvn-mini');
  } else if (coin && coin == 'ltc') {
    Bitcore = require('bitcore-lib-ltc-mini');
  } else {
    debugger;
  }
  var priv = new Bitcore.HDPrivateKey(xPrivKey).deriveChild(Constants.PATHS.REQUEST_KEY_AUTH).privateKey;
  return Utils.signMessage(requestPubKey, priv, coin);
};

Utils.verifyRequestPubKey = function(requestPubKey, signature, xPubKey, coin) {
  var Bitcore;
  if (coin && coin == 'btc') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'bch') {
    Bitcore = require('bitcore-lib');
  } else if (coin && coin == 'safe') {
    Bitcore = require('bitcore-lib-safe-mini');
  } else if (coin && coin == 'btcz') {
    Bitcore = require('bitcore-lib-btcz-mini');
  } else if (coin && coin == 'zcl') {
    Bitcore = require('bitcore-lib-zcl-mini');
  } else if (coin && coin == 'anon') {
    Bitcore = require('bitcore-lib-anon-mini');
  } else if (coin && coin == 'zel') {
    Bitcore = require('bitcore-lib-zel-mini');
  } else if (coin && coin == 'zen') {
    Bitcore = require('bitcore-lib-zen-mini');
  } else if (coin && coin == 'rvn') {
    Bitcore = require('bitcore-lib-rvn-mini');
  } else if (coin && coin == 'ltc') {
    Bitcore = require('bitcore-lib-ltc-mini');
  } else {
    debugger;
  }
  var pub = (new Bitcore.HDPublicKey(xPubKey)).deriveChild(Constants.PATHS.REQUEST_KEY_AUTH).publicKey;
  return Utils.verifyMessage(requestPubKey, signature, pub.toString(), coin);
};

Utils.formatAmount = function(satoshis, unit, opts) {
  $.shouldBeNumber(satoshis);
  $.checkArgument(_.includes(_.keys(Constants.UNITS), unit));

  function clipDecimals(number, decimals) {
    var x = number.toString().split('.');
    var d = (x[1] || '0').substring(0, decimals);
    return parseFloat(x[0] + '.' + d);
  };

  function addSeparators(nStr, thousands, decimal, minDecimals) {
    nStr = nStr.replace('.', decimal);
    var x = nStr.split(decimal);
    var x0 = x[0];
    var x1 = x[1];

    x1 = _.dropRightWhile(x1, function(n, i) {
      return n == '0' && i >= minDecimals;
    }).join('');
    var x2 = x.length > 1 ? decimal + x1 : '';

    x0 = x0.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    return x0 + x2;
  };

  opts = opts || {};

  var u = Constants.UNITS[unit];
  var precision = opts.fullPrecision ? 'full' : 'short';
  var amount = clipDecimals((satoshis / u.toSatoshis), u[precision].maxDecimals).toFixed(u[precision].maxDecimals);
  return addSeparators(amount, opts.thousandsSeparator || ',', opts.decimalSeparator || '.', u[precision].minDecimals);
};

Utils.buildTx = function(txp) {
  var coin = txp.coin || 'safe';

//  var bitcore = Bitcore_[coin];

  var CoreTr;
  if (coin == 'btc') {
    CoreTr = require('bitcore-lib').Transaction;
  } else if (coin == 'bch') {
    CoreTr = require('bitcore-lib-cash').Transaction;
  } else if (coin == 'safe') {
    CoreTr = require('bitcore-lib-safe-mini').Transaction;
  } else if (coin == 'btcz') {
    CoreTr = require('bitcore-lib-btcz-mini').Transaction;
  } else if (coin == 'zcl') {
    CoreTr = require('bitcore-lib-zcl-mini').Transaction;
  } else if (coin == 'anon') {
    CoreTr = require('bitcore-lib-anon-mini').Transaction;
  } else if (coin == 'zel') {
    CoreTr = require('bitcore-lib-zel-mini').Transaction;
  } else if (coin == 'zen') {
    CoreTr = require('bitcore-lib-zen-mini').Transaction;
  } else if (coin == 'rvn') {
    CoreTr = require('bitcore-lib-rvn-mini').Transaction;
  } else if (coin == 'ltc') {
    CoreTr = require('bitcore-lib-zcl-mini').Transaction;
  }

  var t = new CoreTr();

  $.checkState(_.includes(_.values(Constants.SCRIPT_TYPES), txp.addressType));

  switch (txp.addressType) {
    case Constants.SCRIPT_TYPES.P2SH:
      _.each(txp.inputs, function(i) {
        t.from(i, i.publicKeys, txp.requiredSignatures);
      });
      break;
    case Constants.SCRIPT_TYPES.P2PKH:
      t.from(txp.inputs);
      break;
  }

  if (txp.toAddress && txp.amount && !txp.outputs) {
    t.to(txp.toAddress, txp.amount);
  } else if (txp.outputs) {
    _.each(txp.outputs, function(o) {
      $.checkState(o.script || o.toAddress, 'Output should have either toAddress or script specified');
      if (o.script) {
        t.addOutput(new CoreTr.Output({
          script: o.script,
          satoshis: o.amount
        }));
      } else {
        t.to(o.toAddress, o.amount);
      }
    });
  }

  t.fee(txp.fee);
  t.change(txp.changeAddress.address);

  // Shuffle outputs for improved privacy
  if (t.outputs.length > 1) {
    var outputOrder = _.reject(txp.outputOrder, function(order) {
      return order >= t.outputs.length;
    });
    $.checkState(t.outputs.length == outputOrder.length);
    t.sortOutputs(function(outputs) {
      return _.map(outputOrder, function(i) {
        return outputs[i];
      });
    });
  }

  // Validate inputs vs outputs independently of Bitcore
  var totalInputs = _.reduce(txp.inputs, function(memo, i) {
    return +i.satoshis + memo;
  }, 0);
  var totalOutputs = _.reduce(t.outputs, function(memo, o) {
    return +o.satoshis + memo;
  }, 0);

  $.checkState(totalInputs - totalOutputs >= 0);
  $.checkState(totalInputs - totalOutputs <= Defaults.MAX_TX_FEE);

  return t;
};


module.exports = Utils;
