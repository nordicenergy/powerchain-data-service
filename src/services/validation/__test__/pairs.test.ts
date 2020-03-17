import { validatePairs } from '../pairs';

import { PairOrderingServiceImpl } from '../../PairOrderingService';
import { asset, Asset, AssetInfo, list, ServiceMget } from '../../../types';
import { of as taskOf } from 'folktale/concurrency/task';

describe('Pairs validation', () => {
  const MATCHER = 'matcher';
  const POWERCHAIN = 'POWERCHAIN';
  const BTC = 'BTC';

  const pairOrderingService = new PairOrderingServiceImpl({
    [MATCHER]: [BTC, POWERCHAIN],
  });

  const assetsMget: ServiceMget<string[], Asset> = {
    mget: (assetIds: string[]) =>
      taskOf(
        list(
          assetIds.map(aid => {
            switch (aid) {
              case BTC:
              case POWERCHAIN:
                return asset({} as AssetInfo);
              default:
                return asset(null);
            }
          })
        )
      ),
  };

  const validate = validatePairs(assetsMget, pairOrderingService);

  describe('asset order validation', () => {
    it('known matcher, right order, pass', () =>
      expect(
        validate(MATCHER, [{ amountAsset: POWERCHAIN, priceAsset: BTC }])
          .run()
          .promise()
      ).resolves.not.toThrow());

    it('unknown matcher, existing assets, pass', () =>
      expect(
        validate('', [{ amountAsset: POWERCHAIN, priceAsset: BTC }])
          .run()
          .promise()
      ).resolves.not.toThrow());

    it('known matcher, wrong order, fail', () =>
      expect(
        validate(MATCHER, [{ amountAsset: BTC, priceAsset: POWERCHAIN }])
          .run()
          .promise()
      ).rejects.toMatchSnapshot());
  });

  describe('assets existence validation', () => {
    it('non-existing assets, right order, fail', () =>
      expect(
        validate(MATCHER, [{ amountAsset: 'ASSET1', priceAsset: BTC }])
          .run()
          .promise()
      ).rejects.toMatchSnapshot());

    it('non-existing assets, wrong order, fail with ordering error', () =>
      expect(
        validate(MATCHER, [{ amountAsset: 'ASSET1', priceAsset: 'ASSET2' }])
          .run()
          .promise()
      ).rejects.toMatchSnapshot());
  });
});
