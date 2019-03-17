var $ = require('preconditions').singleton();
/* var Bitcore = require('bitcore-lib');
var Bitcore_ = {
  btc: Bitcore,
  bch: require('bitcore-lib-cash'),
}; */

var BitcorePayPro = require('bitcore-payment-protocol');
var PayPro = {};

PayPro._nodeRequest = function(opts, cb) {
  opts.agent = false;
  var http = opts.httpNode || (opts.proto === 'http' ? require("http") : require("https"));

  var fn = opts.method == 'POST' ? 'post' : 'get';

  http[fn](opts, function(res) {
    var data = []; // List of Buffer objects


    if (res.statusCode != 200)
      return cb(new Error('HTTP Request Error: '  + res.statusCode + ' ' + res.statusMessage + ' ' +  ( data ? data : '' )  ));

    res.on("data", function(chunk) {
      data.push(chunk); // Append Buffer object
    });
    res.on("end", function() {
      data = Buffer.concat(data); // Make one large Buffer of it
      return cb(null, data);
    });
  });
};

PayPro._browserRequest = function(opts, cb) {
  var method = (opts.method || 'GET').toUpperCase();
  var url = opts.url;
  var req = opts;

  req.headers = req.headers || {};
  req.body = req.body || req.data || '';

  var xhr = opts.xhr || new XMLHttpRequest();
  xhr.open(method, url, true);

  Object.keys(req.headers).forEach(function(key) {
    var val = req.headers[key];
    if (key === 'Content-Length') return;
    if (key === 'Content-Transfer-Encoding') return;
    xhr.setRequestHeader(key, val);
  });
  xhr.responseType = 'arraybuffer';

  xhr.onload = function(event) {
    var response = xhr.response;
    if (xhr.status == 200) {
      return cb(null, new Uint8Array(response));
    } else {
      return cb('HTTP Request Error: '  + xhr.status + ' ' + xhr.statusText + ' ' + response ? response : '');
    }
  };

  xhr.onerror = function(event) {
    var status;
    if (xhr.status === 0 || !xhr.statusText) {
      status = 'HTTP Request Error';
    } else {
      status = xhr.statusText;
    }
    return cb(new Error(status));
  };

  if (req.body) {
    xhr.send(req.body);
  } else {
    xhr.send(null);
  }
};

var getHttp = function(opts) {
  var match = opts.url.match(/^((http[s]?):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);

  opts.proto = RegExp.$2;
  opts.host = RegExp.$3;
  opts.path = RegExp.$4 + RegExp.$6;
  if (opts.http) return opts.http;

  var env = opts.env;
  if (!env)
    env = (process && !process.browser) ? 'node' : 'browser';

  return (env == "node") ? PayPro._nodeRequest : http = PayPro._browserRequest;;
};

PayPro.get = function(opts, cb) {
  $.checkArgument(opts && opts.url);

  var http = getHttp(opts);
  var coin = opts.coin || 'safe';
//  var bitcore = Bitcore_[coin];

  var CoreAddrFrScr;
  var CoreScripr;

  if (coin == 'btc') {
    CoreScripr = require('bitcore-lib').Script;
    CoreAddrFrScr = require('bitcore-lib').Address.fromScript;
  } else if (coin == 'bch') {
    CoreScripr = require('bitcore-lib-cash').Script;
    CoreAddrFrScr = require('bitcore-lib-cash').Address.fromScript;
  } else if (coin == 'safe') {
    CoreScripr = require('bitcore-lib-safecoin').Script;
    CoreAddrFrScr = require('bitcore-lib-safecoin').Address.fromScript;
  } else if (coin == 'btcz') {
    CoreScripr = require('bitcore-lib-btcz-mini').Script;
    CoreAddrFrScr = require('bitcore-lib-btcz-mini').Address.fromScript;
  } else if (coin == 'zcl') {
    CoreScripr = require('bitcore-lib-zcl-mini').Script;
    CoreAddrFrScr = require('bitcore-lib-zcl-mini').Address.fromScript;
  } else if (coin == 'rito') {
    CoreScripr = require('bitcore-lib-rito-mini').Script;
    CoreAddrFrScr = require('bitcore-lib-rito-mini').Address.fromScript;
  } else if (coin == 'anon') {
    CoreScripr = require('bitcore-lib-anon-mini').Script;
    CoreAddrFrScr = require('bitcore-lib-anon-mini').Address.fromScript;
  } else if (coin == 'zel') {
    CoreScripr = require('bitcore-lib-zel-mini').Script;
    CoreAddrFrScr = require('bitcore-lib-zel-mini').Address.fromScript;
  } else if (coin == 'zen') {
    CoreScripr = require('bitcore-lib-zen-mini').Script;
    CoreAddrFrScr = require('bitcore-lib-zen-mini').Address.fromScript;
  } else if (coin == 'rvn') {
    CoreScripr = require('bitcore-lib-rvn-mini').Script;
    CoreAddrFrScr = require('bitcore-lib-rvn-mini').Address.fromScript;
  } else if (coin == 'ltc') {
    CoreScripr = require('bitcore-lib-ltc-mini').Script;
    CoreAddrFrScr = require('bitcore-lib-ltc-mini').Address.fromScript;
  }

  var COIN = coin.toUpperCase();
  var PP = new BitcorePayPro(COIN);

  opts.headers = opts.headers || {
    'Accept': BitcorePayPro.LEGACY_PAYMENT[COIN].REQUEST_CONTENT_TYPE,
    'Content-Type': 'application/octet-stream',
  };

  http(opts, function(err, dataBuffer) {
    if (err) return cb(err);
    var request, verified, signature, serializedDetails;
    try {
      var body = BitcorePayPro.PaymentRequest.decode(dataBuffer);
      request = PP.makePaymentRequest(body);
      signature = request.get('signature');
      serializedDetails = request.get('serialized_payment_details');
      // Verify the signature
      verified = request.verify(true);
    } catch (e) {
      return cb(new Error('Could not parse payment protocol' + e));
    }

    // Get the payment details
    var decodedDetails = BitcorePayPro.PaymentDetails.decode(serializedDetails);
    var pd = new BitcorePayPro();
    pd = pd.makePaymentDetails(decodedDetails);

    var outputs = pd.get('outputs');
    if (outputs.length > 1)
      return cb(new Error('Payment Protocol Error: Requests with more that one output are not supported'))

    var output = outputs[0];

    var amount = output.get('amount').toNumber();
    var network = pd.get('network') == 'test' ? 'testnet' : 'livenet';

    // We love payment protocol
    var offset = output.get('script').offset;
    var limit = output.get('script').limit;

    // NOTE: For some reason output.script.buffer
    // is only an ArrayBuffer
    var buffer = new Buffer(new Uint8Array(output.get('script').buffer));
    var scriptBuf = buffer.slice(offset, limit);
    var addr = new CoreAddrFrScr(new CoreScripr(scriptBuf), network);

    var md = pd.get('merchant_data');

    if (md) {
      md = md.toString();
    }

    var ok = verified.verified;
    var caName;

    if (verified.isChain) {
      ok = ok && verified.chainVerified;
    }

    var ret = {
      verified: ok,
      caTrusted: verified.caTrusted,
      caName: verified.caName,
      selfSigned: verified.selfSigned,
      expires: pd.get('expires'),
      memo: pd.get('memo'),
      time: pd.get('time'),
      merchant_data: md,
      toAddress: addr.toString(),
      amount: amount,
      network: network,
      domain: opts.host,
      url: opts.url,
    };

    var requiredFeeRate = pd.get('required_fee_rate');
    if (requiredFeeRate) 
      ret.requiredFeeRate = requiredFeeRate;

    return cb(null, ret);
  });
};


PayPro._getPayProRefundOutputs = function(addrStr, amount, coin) {
  amount = amount.toString(10);

//  var bitcore = Bitcore_[coin];
  var output = new BitcorePayPro.Output();

  var CoreAddr;
  var CoreScripr;

  if (coin == 'btc') {
    CoreAddr = require('bitcore-lib').Address;
    CoreScripr = require('bitcore-lib').Script;
  } else if (coin == 'bch') {
    CoreAddr = require('bitcore-lib-cash').Address;
    CoreScripr = require('bitcore-lib-cash').Script;
  } else if (coin == 'safe') {
    CoreAddr = require('bitcore-lib-safecoin').Address;
    CoreScripr = require('bitcore-lib-safecoin').Script;
  } else if (coin == 'btcz') {
    CoreAddr = require('bitcore-lib-btcz-mini').Address;
    CoreScripr = require('bitcore-lib-btcz-mini').Script;
  } else if (coin == 'zcl') {
    CoreAddr = require('bitcore-lib-zcl-mini').Address;
    CoreScripr = require('bitcore-lib-zcl-mini').Script;
  } else if (coin == 'rito') {
    CoreAddr = require('bitcore-lib-rito-mini').Address;
    CoreScripr = require('bitcore-lib-rito-mini').Script;
  } else if (coin == 'anon') {
    CoreAddr = require('bitcore-lib-anon-mini').Address;
    CoreScripr = require('bitcore-lib-anon-mini').Script;
  } else if (coin == 'zel') {
    CoreAddr = require('bitcore-lib-zel-mini').Address;
    CoreScripr = require('bitcore-lib-zel-mini').Script;
  } else if (coin == 'zen') {
    CoreAddr = require('bitcore-lib-zen-mini').Address;
    CoreScripr = require('bitcore-lib-zen-mini').Script;
  } else if (coin == 'rvn') {
    CoreAddr = require('bitcore-lib-rvn-mini').Address;
    CoreScripr = require('bitcore-lib-rvn-mini').Script;
  } else if (coin == 'ltc') {
    CoreAddr = require('bitcore-lib-ltc-mini').Address;
    CoreScripr = require('bitcore-lib-ltc-mini').Script;
  }



  var addr = new CoreAddr(addrStr);

  var s;
  if (addr.isPayToPublicKeyHash()) {
    s = CoreScripr.buildPublicKeyHashOut(addr);
  } else if (addr.isPayToScriptHash()) {
    s = CoreScripr.buildScriptHashOut(addr);
  } else {
    throw new Error('Unrecognized address type ' + addr.type);
  }

  //  console.log('PayPro refund address set to:', addrStr,s);
  output.set('script', s.toBuffer());
  output.set('amount', amount);
  return [output];
};


PayPro._createPayment = function(merchant_data, rawTx, refundAddr, amountSat, coin) {
  var pay = new BitcorePayPro();
  pay = pay.makePayment();

  if (merchant_data) {
    merchant_data = new Buffer(merchant_data);
    pay.set('merchant_data', merchant_data);
  }

  var txBuf = new Buffer(rawTx, 'hex');
  pay.set('transactions', [txBuf]);

  var refund_outputs = this._getPayProRefundOutputs(refundAddr, amountSat, coin);
  if (refund_outputs)
    pay.set('refund_to', refund_outputs);

  // Unused for now
  // options.memo = '';
  // pay.set('memo', options.memo);

  pay = pay.serialize();
  var buf = new ArrayBuffer(pay.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < pay.length; i++) {
    view[i] = pay[i];
  }

  return view;
};

PayPro.send = function(opts, cb) {
  $.checkArgument(opts.merchant_data)
    .checkArgument(opts.url)
    .checkArgument(opts.rawTx)
    .checkArgument(opts.refundAddr)
    .checkArgument(opts.amountSat);


  var coin = opts.coin || 'safe';
  var COIN = coin.toUpperCase();

  var payment = PayPro._createPayment(opts.merchant_data, opts.rawTx, opts.refundAddr, opts.amountSat, coin);

  var http = getHttp(opts);
  opts.method = 'POST';
  opts.headers = opts.headers || {
    'Accept': BitcorePayPro.LEGACY_PAYMENT[COIN].ACK_CONTENT_TYPE,
    'Content-Type': BitcorePayPro.LEGACY_PAYMENT[COIN].CONTENT_TYPE,
    // 'Content-Type': 'application/octet-stream',
  };
  opts.body = payment;

  http(opts, function(err, rawData) {
    if (err) return cb(err);
    var memo;
    if (rawData) {
      try {
        var data = BitcorePayPro.PaymentACK.decode(rawData);
        var pp = new BitcorePayPro(COIN);
        var ack = pp.makePaymentACK(data);
        memo = ack.get('memo');
      } catch (e) {
        console.log('Could not decode paymentACK');
      };
    }
    return cb(null, rawData, memo);
  });
};

module.exports = PayPro;
