"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createParser = require("@powerchain/parse-json-bignumber");
const data_entities_1 = require("@powerchain/data-entities");
const bigNumber_1 = require("./bigNumber");
const parser = createParser({
    strict: false,
    isInstance: (bn) => data_entities_1.BigNumber.isBigNumber(bn),
    stringify: (bn) => bn.toFixed(),
    parse: bigNumber_1.toBigNumber,
});
exports.parse = parser.parse;
exports.stringify = parser.stringify;
//# sourceMappingURL=json.js.map