import { compose, Omit, propEq } from 'ramda';
import { BigNumber } from '@powerchain/data-entities';

import { withStatementTimeout } from '../../../db/driver';
import { CommonServiceDependencies } from '../..';
import { Service, Transaction, transaction, TransactionInfo } from '../../../types';
import { WithLimit, WithSortOrder } from '../../_common';
import { RequestWithCursor } from '../../_common/pagination';
import { getByIdPreset } from '../../presets/pg/getById';
import { mgetByIdsPreset } from '../../presets/pg/mgetByIds';
import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';
import { searchWithPaginationPreset } from '../../presets/pg/searchWithPagination';

import { Cursor, deserialize, serialize } from '../_common/cursor';
import { transformTxInfo } from '../_common/transformTxInfo';
import { CommonFilters, RawTx } from '../_common/types';

import { inputSearch as inputSearchSchema, result as resultSchema } from './schema';
import * as sql from './sql';

type GenesisTxsSearchRequest = RequestWithCursor<
  Omit<CommonFilters, 'sender'> & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    recipient: string;
  }>;

type GenesisTxDbResponse = Omit<RawTx, 'sender'> & {
  amount: BigNumber;
  recipient: string;
};

export type GenesisTxsService = Service<
  string,
  string[],
  GenesisTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
  timeouts,
}: CommonServiceDependencies): GenesisTxsService => {
  return {
    get: getByIdPreset<
      string,
      GenesisTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.genesis.get',
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
      GenesisTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.genesis.mget',
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
      GenesisTxsSearchRequest,
      GenesisTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.genesis.search',
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
