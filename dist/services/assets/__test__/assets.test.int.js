"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const json_1 = require("../../../utils/json");
const index_1 = require("../index");
// dependencies
const db_1 = require("../../../db");
const loadConfig_1 = require("../../../loadConfig");
const _common_1 = require("../../_common");
const options = loadConfig_1.loadConfig();
const drivers = {
    pg: db_1.createPgDriver(options),
};
const cache = index_1.createCache(10, 10000);
const DEFAULT_TIMEOUT_IN_MS = 30000;
const service = index_1.default({
    drivers,
    emitEvent: () => () => null,
    cache,
    timeouts: {
        get: DEFAULT_TIMEOUT_IN_MS,
        mget: DEFAULT_TIMEOUT_IN_MS,
        search: DEFAULT_TIMEOUT_IN_MS,
    },
});
const assetId = 'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH';
describe('Assets service', () => {
    describe('get', () => {
        it('fetches a real asset', (done) => __awaiter(void 0, void 0, void 0, function* () {
            service
                .get(assetId)
                .run()
                .promise()
                .then(x => {
                expect(x.unsafeGet()).toMatchSnapshot();
                done();
            })
                .catch(done.fail);
        }));
        it('returns null for unreal tx', () => __awaiter(void 0, void 0, void 0, function* () {
            const tx = yield service
                .get('UNREAL')
                .run()
                .promise();
            expect(tx).toBeNothing();
        }));
    });
    describe('mget', () => {
        it('fetches real assets with nulls for unreal', (done) => __awaiter(void 0, void 0, void 0, function* () {
            service
                .mget([assetId, 'UNREAL'])
                .run()
                .promise()
                .then(xs => {
                expect(xs).toMatchSnapshot();
                done();
            })
                .catch(e => done(JSON.stringify(e)));
        }));
    });
    describe('search', () => {
        it('fetches POWERCHAIN by ticker', (done) => __awaiter(void 0, void 0, void 0, function* () {
            service
                .search({ ticker: 'POWERCHAIN', limit: 1, sort: _common_1.SortOrder.Descending })
                .run()
                .promise()
                .then(xs => {
                expect(xs).toMatchSnapshot();
                done();
            })
                .catch(e => done(JSON.stringify(e)));
        }));
        it('fetches non-POWERCHAIN asset by ticker (BTC)', (done) => __awaiter(void 0, void 0, void 0, function* () {
            http.get('http://nodes.powerchain.xyz/assets/details/8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS', (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    const assetInfoFromNode = json_1.parse(data);
                    service
                        .search({ ticker: 'BTC', limit: 1, sort: _common_1.SortOrder.Descending })
                        .run()
                        .promise()
                        .then(xs => {
                        const assetInfo = xs.data[0].data;
                        if (assetInfo !== null) {
                            expect(assetInfo.description).toMatch(assetInfoFromNode.description);
                            expect(assetInfo.height.toString()).toMatch(assetInfoFromNode.issueHeight.toString());
                            expect(assetInfo.id).toMatch(assetInfoFromNode.assetId);
                            expect(assetInfo.name).toMatch(assetInfoFromNode.name);
                            expect(assetInfo.precision.toString()).toMatch(assetInfoFromNode.decimals.toString());
                            expect(assetInfo.quantity.toString()).toMatch(assetInfoFromNode.quantity.toString());
                            expect(assetInfo.reissuable.toString()).toMatch(assetInfoFromNode.reissuable.toString());
                            expect(assetInfo.sender).toMatch(assetInfoFromNode.issuer);
                            expect(assetInfo.ticker).toMatch('BTC');
                            done();
                        }
                        else {
                            done('Asset not found in Data Service');
                        }
                    });
                });
            });
        }));
        it('fetches all assets with tickers by ticker=*', () => service
            .search({ ticker: '*', limit: 101, sort: _common_1.SortOrder.Descending })
            .run()
            .promise()
            .then(as => {
            expect(as.data.length).toBeGreaterThan(100);
            // make sure POWERCHAIN is included
            expect(as.data.find(a => a.data && a.data.ticker === 'POWERCHAIN')).not.toBeUndefined();
        }));
    });
});
//# sourceMappingURL=assets.test.int.js.map