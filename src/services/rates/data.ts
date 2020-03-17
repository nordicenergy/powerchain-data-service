import { isSymmetric } from './util';
import { AssetIdsPair } from '../../types';

export const PowerChainId: string = 'POWERCHAIN';

export const pairIsSymmetric = isSymmetric((p: AssetIdsPair) => [
  p.amountAsset,
  p.priceAsset,
]);

export const pairHasPowerChain = (pair: AssetIdsPair): boolean =>
  pair.amountAsset === PowerChainId || pair.priceAsset === PowerChainId;

export function flip(pair: AssetIdsPair): AssetIdsPair {
  return {
    amountAsset: pair.priceAsset,
    priceAsset: pair.amountAsset,
  };
}

export const pairsEq = (pair1: AssetIdsPair, pair2: AssetIdsPair): boolean =>
  pair1.amountAsset === pair2.amountAsset &&
  pair1.priceAsset === pair2.priceAsset;

export function generatePossibleRequestItems(
  pair: AssetIdsPair
): AssetIdsPair[] {
  if (pair.amountAsset === PowerChainId || pair.priceAsset === PowerChainId) {
    return [pair, flip(pair)];
  }

  const wavesL: AssetIdsPair = {
    amountAsset: pair.amountAsset,
    priceAsset: PowerChainId,
  };

  const wavesR: AssetIdsPair = {
    amountAsset: pair.priceAsset,
    priceAsset: PowerChainId,
  };

  return [wavesL, flip(wavesL), wavesR, flip(wavesR)];
}
