const { txExchange } = require('./mocks/tx');
const transformTxInfo = require('../transformTxInfo');

test('transformTxInfo for exchange tx should correctly transform fields', () => {
  expect(transformTxInfo(txExchange)).toMatchSnapshot();
});
