import { PairOrderingServiceImpl } from '..';
import { empty as nothing, of as just } from 'folktale/maybe';

describe('PairOrderingService', () => {
  const MATCHER = '3PJjwFREg8F9V6Cp9fnUuEwRts6HQQa5nfP';
  const POWERCHAIN = 'POWERCHAIN';
  const BTC = 'BTC';
  const matcherSettings = {
    [MATCHER]: [BTC, POWERCHAIN],
  };
  const service = new PairOrderingServiceImpl(matcherSettings);

  it('should work if both assets are in matcher settings', () => {
    const expected = {
      amountAsset: POWERCHAIN,
      priceAsset: BTC,
    };
    expect(service.getCorrectOrder(MATCHER, [POWERCHAIN, BTC])).toEqual(
      just(expected)
    );

    expect(service.getCorrectOrder(MATCHER, [BTC, POWERCHAIN])).toEqual(
      just(expected)
    );

    expect(service.isCorrectOrder(MATCHER, expected)).toEqual(just(true));

    expect(
      service.isCorrectOrder(MATCHER, {
        amountAsset: BTC,
        priceAsset: POWERCHAIN,
      })
    ).toEqual(just(false));
  });

  it('should work if one of the assets is in matcher settings', () => {
    const ASSET = 'someasset';
    const expected = {
      amountAsset: ASSET,
      priceAsset: POWERCHAIN,
    };
    expect(service.getCorrectOrder(MATCHER, [POWERCHAIN, ASSET])).toEqual(
      just(expected)
    );

    expect(service.getCorrectOrder(MATCHER, [ASSET, POWERCHAIN])).toEqual(
      just(expected)
    );

    expect(service.isCorrectOrder(MATCHER, expected)).toEqual(just(true));

    expect(
      service.isCorrectOrder(MATCHER, {
        amountAsset: POWERCHAIN,
        priceAsset: ASSET,
      })
    ).toEqual(just(false));
  });

  it('should work if neither of the assets is in matcher settings', () => {
    const ASSET1 = 'someasset';
    const ASSET2 = 'someasset2';
    const expected = {
      amountAsset: ASSET1,
      priceAsset: ASSET2,
    };
    expect(service.getCorrectOrder(MATCHER, [ASSET1, ASSET2])).toEqual(
      just(expected)
    );

    expect(service.getCorrectOrder(MATCHER, [ASSET2, ASSET1])).toEqual(
      just(expected)
    );

    expect(service.isCorrectOrder(MATCHER, expected)).toEqual(just(true));

    expect(
      service.isCorrectOrder(MATCHER, {
        amountAsset: ASSET2,
        priceAsset: ASSET1,
      })
    ).toEqual(just(false));
  });

  it('should return Nothing if asking for unknown matcher', () => {
    expect(service.getCorrectOrder('', [POWERCHAIN, BTC])).toEqual(nothing());

    expect(
      service.isCorrectOrder('', { amountAsset: POWERCHAIN, priceAsset: BTC })
    ).toEqual(nothing());
  });
});
