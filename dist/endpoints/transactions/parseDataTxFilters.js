"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const data_entities_1 = require("@powerchain/data-entities");
const parseDate_1 = require("../../utils/parseDate");
const parseBool_1 = require("../utils/parseBool");
const parseArrayQuery_1 = require("../utils/parseArrayQuery");
function parseValue(type, value) {
    if (type === undefined || value === undefined)
        return undefined;
    if (type === 'boolean')
        return parseBool_1.parseBool(value);
    else if (type === 'integer')
        return new data_entities_1.BigNumber(value);
    else
        return value;
}
exports.parseFilters = ({ ids, timeStart, // No default value for timestart, other way - bad for desc pagination
timeEnd, sender, limit = '100', sort = 'desc', key, type, value, after, }) => ramda_1.reject(ramda_1.isNil, {
    ids: ids && parseArrayQuery_1.parseArrayQuery(ids),
    timeStart: timeStart && parseDate_1.parseDate(timeStart).getOrElse(new Date(timeStart)),
    timeEnd: timeEnd && parseDate_1.parseDate(timeEnd).getOrElse(new Date(timeEnd)),
    limit: parseInt(limit),
    sort,
    sender,
    key,
    type,
    value: parseValue(type, value),
    after,
});
//# sourceMappingURL=parseDataTxFilters.js.map