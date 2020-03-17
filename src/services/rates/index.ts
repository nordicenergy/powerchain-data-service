import { BigNumber } from '@powerchain/data-entities';
import { withStatementTimeout } from '../../db/driver';
import { AssetIdsPair, list, rate, Rate, RateInfo, RateMgetParams, ServiceMget } from '../../types';
import { RateSerivceCreatorDependencies } from '../../services';
import RateEstimator from './RateEstimator';
import RemoteRateRepo from './repo/impl/RemoteRateRepo';

export { default as RateCacheImpl } from './repo/impl/RateCache';

export type RateWithPairIds = RateInfo & AssetIdsPair;

export default function({
  drivers,
  cache,
  timeouts,
}: RateSerivceCreatorDependencies): ServiceMget<RateMgetParams, Rate> {
  const estimator = new RateEstimator(
    cache,
    new RemoteRateRepo(withStatementTimeout(drivers.pg, timeouts.mget))
  );

  return {
    mget(request: RateMgetParams) {
      return estimator
        .mget(request)
        .map(data =>
          data.map(item =>
            rate(
              {
                rate: item.res.fold(
                  () => new BigNumber(0),
                  it => it.rate
                ),
              },
              {
                amountAsset: item.req.amountAsset,
                priceAsset: item.req.priceAsset,
              }
            )
          )
        )
        .map(list);
    },
  };
}
