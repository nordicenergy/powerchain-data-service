"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_entities_1 = require("@powerchain/data-entities");
const maybe_1 = require("folktale/maybe");
const ramda_1 = require("ramda");
const data_1 = require("../../data");
const util_1 = require("../../util");
const maybeOps_1 = require("../../../../utils/fp/maybeOps");
/*
   find rate data from RateLookupTable using the following strategy:
   
   lookup(amountAsset, priceAsset) || ( lookup(amountAsset, waves) / lookup(priceAsset, waves) }
   
   where lookup = getFromTable(asset1, asset2) || 1 / getFromtable(asset2, asset1)
*/
class RateInfoLookup {
    constructor(data) {
        this.lookupTable = this.toLookupTable(data);
    }
    has(pair) {
        return maybeOps_1.isDefined(this.get(pair));
    }
    get(pair) {
        const lookup = (pair, flipped) => this.getFromLookupTable(pair, flipped);
        return lookup(pair, false)
            .orElse(() => lookup(pair, true))
            .orElse(() => maybe_1.of(pair)
            .filter(ramda_1.complement(data_1.pairHasPowerChain))
            .chain(pair => this.lookupThroughPowerChain(pair)));
    }
    toLookupTable(data) {
        return data.reduce((acc, item) => {
            if (!(item.amountAsset in acc)) {
                acc[item.amountAsset] = {};
            }
            acc[item.amountAsset][item.priceAsset] = item.rate;
            return acc;
        }, {});
    }
    getFromLookupTable(pair, flipped) {
        const lookupData = flipped ? data_1.flip(pair) : pair;
        return maybe_1.fromNullable(ramda_1.path([lookupData.amountAsset, lookupData.priceAsset], this.lookupTable))
            .map((rate) => flipped ? util_1.inv(rate).getOrElse(new data_entities_1.BigNumber(0)) : rate)
            .map((rate) => (Object.assign({ rate }, lookupData)));
    }
    lookupThroughPowerChain(pair) {
        return maybeOps_1.map2((info1, info2) => util_1.safeDivide(info1.rate, info2.rate), this.get({
            amountAsset: pair.amountAsset,
            priceAsset: data_1.PowerChainId,
        }), this.get({
            amountAsset: pair.priceAsset,
            priceAsset: data_1.PowerChainId,
        })).map(rate => ({
            amountAsset: pair.amountAsset,
            priceAsset: pair.priceAsset,
            rate: rate.getOrElse(new data_entities_1.BigNumber(0)),
        }));
    }
}
exports.default = RateInfoLookup;
//# sourceMappingURL=RateInfoLookup.js.map