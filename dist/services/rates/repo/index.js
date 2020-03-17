"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const data_entities_1 = require("@powerchain/data-entities");
const data_1 = require("../data");
exports.partitionByPreCount = (cache, pairs, getCacheKey, shouldCache) => {
    const [eq, uneq] = ramda_1.partition(data_1.pairIsSymmetric, pairs);
    const eqRates = eq.map(pair => (Object.assign({ rate: new data_entities_1.BigNumber(1) }, pair)));
    const allPairsToRequest = ramda_1.uniqWith(data_1.pairsEq, ramda_1.chain(it => data_1.generatePossibleRequestItems(it), uneq));
    if (shouldCache) {
        const [cached, uncached] = ramda_1.partition(it => cache.has(getCacheKey(it)), allPairsToRequest);
        const cachedRates = cached.map(pair => ({
            amountAsset: pair.amountAsset,
            priceAsset: pair.priceAsset,
            rate: cache.get(getCacheKey(pair)).getOrElse(new data_entities_1.BigNumber(0)),
        }));
        return {
            preCount: cachedRates.concat(eqRates),
            toBeRequested: uncached,
        };
    }
    else {
        return {
            preCount: eqRates,
            toBeRequested: allPairsToRequest,
        };
    }
};
//# sourceMappingURL=index.js.map