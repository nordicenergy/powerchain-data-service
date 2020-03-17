"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_entities_1 = require("@powerchain/data-entities");
const ramda_1 = require("ramda");
exports.convertPrice = ramda_1.curry((aDecimals, pDecimals, price) => price.multipliedBy(new data_entities_1.BigNumber(10).pow(-8 + aDecimals - pDecimals)));
exports.convertAmount = ramda_1.curry((decimals, amount) => amount.multipliedBy(new data_entities_1.BigNumber(10).pow(-decimals)));
//# sourceMappingURL=satoshi.js.map