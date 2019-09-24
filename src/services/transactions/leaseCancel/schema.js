const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas')
  .default;

const result = Joi.object().keys({
  ...commonFields,
  lease_id: Joi.string().required(),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    recipient: Joi.string(),
  })
  .required();

module.exports = { result, inputSearch };
