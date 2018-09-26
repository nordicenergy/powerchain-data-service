const { compose, reject, isNil } = require('ramda');

const transformTxInfo = require('../common/transformTxInfo');

module.exports = compose(
  reject(isNil),
  transformTxInfo
);
