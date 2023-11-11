const _ = require('lodash');
const { Types } = require('mongoose')

const getInfoData = ({ field = [], object = {}}) => {
    return _.pick(object, field);
}

const getSelectedData = (select=[]) => {
    return Object.fromEntries(select.map(e => [e, 1]))
}

const getUnSelectedData = (select=[]) => {
    return Object.fromEntries(select.map(e => [e, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach( k => {
        if (obj[k] === null) {
            delete obj[k]
        }
    })
    return obj
}

const updateNestedObjectParser = obj => {
    console.log(`[1]::`, obj)
    const final = {}
    Object.keys(obj).forEach( k => {
        if (typeof obj[k] !== 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach( a => {
                final[`${k}.${a}`] = res[a]
            })
        } else {
            final[k] = obj[k]
        }
    })
    console.log(`[2]::`, final)
    return final
}

const convertStringToMongoDbObject = str => {
    return new Types.ObjectId(str)
}

module.exports = {
    getIntoData: getInfoData,
    getSelectedData,
    getUnSelectedData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertStringToMongoDbObject
}