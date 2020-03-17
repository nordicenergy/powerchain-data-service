"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_entities_1 = require("@powerchain/data-entities");
const driver_1 = require("../../db/driver");
const types_1 = require("../../types");
const RateEstimator_1 = require("./RateEstimator");
const RemoteRateRepo_1 = require("./repo/impl/RemoteRateRepo");
var RateCache_1 = require("./repo/impl/RateCache");
exports.RateCacheImpl = RateCache_1.default;
function default_1({ drivers, cache, timeouts, }) {
    const estimator = new RateEstimator_1.default(cache, new RemoteRateRepo_1.default(driver_1.withStatementTimeout(drivers.pg, timeouts.mget)));
    return {
        mget(request) {
            return estimator
                .mget(request)
                .map(data => data.map(item => types_1.rate({
                rate: item.res.fold(() => new data_entities_1.BigNumber(0), it => it.rate),
            }, {
                amountAsset: item.req.amountAsset,
                priceAsset: item.req.priceAsset,
            })))
                .map(types_1.list);
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map