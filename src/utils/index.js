const _ = require('lodash');

const getIntoData = ({ field = [], object = {}}) => {
    return _.pick(object, field);
}

module.exports = {
    getIntoData
}