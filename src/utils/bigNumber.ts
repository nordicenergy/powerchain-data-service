import { BigNumber } from '@powerchain/data-entities';

export const toBigNumber = (x: BigNumber.Value): BigNumber => new BigNumber(x);
