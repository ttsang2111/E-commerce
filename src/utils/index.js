const _ = require('lodash');

const getInfoData = ({ field = [], object = {}}) => {
    return _.pick(object, field);
}

const getSelectedData = (select=[]) => {
    return Object.fromEntries(select.map(e => [e, 1]))
}

const getUnSelectedData = (select=[]) => {
    return Object.fromEntries(select.map(e => [e, 0]))
}

module.exports = {
    getIntoData: getInfoData,
    getSelectedData,
    getUnSelectedData
}