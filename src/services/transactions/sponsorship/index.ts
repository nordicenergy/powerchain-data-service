import { compose, propEq } from 'ramda';
import { BigNumber } from '@powerchain/data-entities';

import { withStatementTimeout } from '../../../db/driver';
import { CommonServiceDependencies } from '../..';
import { Service, Transaction, transaction, TransactionInfo } from '../../../types';
import { WithLimit, WithSortOrder } from '../../_common';
import { RequestWithCursor } from '../../_common/pagination';
import { getByIdPreset } from '../../presets/pg/getById';
import { mgetByIdsPreset } from '../../presets/pg/mgetByIds';
import { searchWithPaginationPreset } from '../../presets/pg/searchWithPagination';
import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';

import { Cursor, deserialize, serialize } from '../_common/cursor';
import { CommonFilters, RawTx } from '../_common/types';

import { inputSearch as inputSearchSchema, result as resultSchema } from './schema';
import * as sql from './sql';
import * as transformTxInfo from './transformTxInfo';

type SponsorshipTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    assetId: String;
  }>;

type SponsorshipTxDbResponse = RawTx & {
  asset_id: string;
  min_sponsored_asset_fee: BigNumber;
};

export type SponsorshipTxsService = Service<
  string,
  string[],
  SponsorshipTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
  timeouts,
}: CommonServiceDependencies): SponsorshipTxsService => {
  return {
    get: getByIdPreset<
      string,
      SponsorshipTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.sponsorship.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.get),
      emitEvent,
    }),

    mget: mgetByIdsPreset<
      string,
      SponsorshipTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.sponsorship.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.mget),
      emitEvent,
    }),

    search: searchWithPaginationPreset<
      Cursor,
      SponsorshipTxsSearchRequest,
      SponsorshipTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.sponsorship.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: compose(transaction, transformTxInfo),
      cursorSerialization: {
        serialize,
        deserialize,
      },
    })({
      pg: withStatementTimeout(pg, timeouts.search),
      emitEvent,
    }),
  };
};
