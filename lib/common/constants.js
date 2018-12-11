'use strict';

var Constants = {};

Constants.SCRIPT_TYPES = {
  P2SH: 'P2SH',
  P2PKH: 'P2PKH',
};
Constants.DERIVATION_STRATEGIES = {
  BIP44: 'BIP44',
  BIP45: 'BIP45',
  BIP48: 'BIP48',
};

Constants.PATHS = {
  REQUEST_KEY_BTC: "m/1'/0",
//  REQUEST_KEY_BCH: "m/1'/0",
  REQUEST_KEY_BTCZ: "m/1'/177",
  REQUEST_KEY_ZEL: "m/1'/19167",
  REQUEST_KEY_ZEN: "m/1'/121",
  REQUEST_KEY_LTC: "m/1'/2",
  REQUEST_KEY_ZCL: "m/1'/147",
//  REQUEST_KEY_ANON: "m/1'/0",
  REQUEST_KEY_RVN: "m/1'/175",
  REQUEST_KEY_SAFE: "m/1'/19165",
  TXPROPOSAL_KEY: "m/1'/1",
  REQUEST_KEY_AUTH: "m/2", // relative to BASE
};

Constants.BIP45_SHARED_INDEX = 0x80000000 - 1;

Constants.UNITS = {
  btc: {
    toSatoshis: 100000000,
    full: {
      maxDecimals: 8,
      minDecimals: 8,
    },
    short: {
      maxDecimals: 6,
      minDecimals: 2,
    }
  },
  bch: {
    toSatoshis: 100000000,
    full: {
      maxDecimals: 8,
      minDecimals: 8,
    },
    short: {
      maxDecimals: 6,
      minDecimals: 2,
    }
  },
  safe: {
    toSatoshis: 100000000,
    full: {
      maxDecimals: 8,
      minDecimals: 8,
    },
    short: {
      maxDecimals: 6,
      minDecimals: 2,
    }
  },
  btcz: {
    toSatoshis: 100000000,
    full: {
      maxDecimals: 8,
      minDecimals: 8,
    },
    short: {
      maxDecimals: 6,
      minDecimals: 2,
    }
  },
  zcl: {
    toSatoshis: 100000000,
    full: {
      maxDecimals: 8,
      minDecimals: 8,
    },
    short: {
      maxDecimals: 6,
      minDecimals: 2,
    }
  },
  anon: {
    toSatoshis: 100000000,
    full: {
      maxDecimals: 8,
      minDecimals: 8,
    },
    short: {
      maxDecimals: 6,
      minDecimals: 2,
    }
  },
  zel: {
    toSatoshis: 100000000,
    full: {
      maxDecimals: 8,
      minDecimals: 8,
    },
    short: {
      maxDecimals: 6,
      minDecimals: 2,
    }
  },
  zen: {
    toSatoshis: 100000000,
    full: {
      maxDecimals: 8,
      minDecimals: 8,
    },
    short: {
      maxDecimals: 6,
      minDecimals: 2,
    }
  },
  rvn: {
    toSatoshis: 100000000,
    full: {
      maxDecimals: 8,
      minDecimals: 8,
    },
    short: {
      maxDecimals: 6,
      minDecimals: 2,
    }
  },
  ltc: {
    toSatoshis: 100000000,
    full: {
      maxDecimals: 8,
      minDecimals: 8,
    },
    short: {
      maxDecimals: 6,
      minDecimals: 2,
    }
  },
  bit: {
    toSatoshis: 100,
    full: {
      maxDecimals: 2,
      minDecimals: 2,
    },
    short: {
      maxDecimals: 0,
      minDecimals: 0,
    }
  },
};

module.exports = Constants;
