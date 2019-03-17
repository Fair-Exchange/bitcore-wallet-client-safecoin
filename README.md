# bitcore-wallet-client-safecoin

Client library for [bitcore-wallet-service-safecoin](https://github.com/fair-exchange/bitcore-wallet-service-safecoin).

## Description

This package communicates with BWS [Bitcore wallet service safecoin](https://github.com/fair-exchange/bitcore-wallet-service-safecoin) using the REST API. All REST endpoints are wrapped as simple async methods. All relevant responses from BWS are checked independently by the peers, thus the importance of using this library when talking to a third party BWS instance.

See [Bitcore-wallet](https://github.com/bitpay/bitcore-wallet) for a simple CLI wallet implementation that relays on BWS and uses bitcore-wallet-client-safecoin.

## Get Started

You can start using bitcore-wallet-client-safecoin by running `npm install bitcore-wallet-client-safecoin` from your console.

The MIT License

Copyright (c) 2018-2019 Safecoin. Safecoin is the registered trademark of Jeffrey Galloway.

Copyright (c) 2015 BitPay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.