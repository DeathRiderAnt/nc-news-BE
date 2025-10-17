const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.formatDataForSQL = (dataArray, columnList) => {
  return dataArray.map((data) => {return columnList.map((columnName) => {return data[columnName]})})
}

exports.createLookupObj = (arr, key, value) => {
  const lookupObj = {};

  arr.forEach((entry) => {

    const objKey = entry[key]
    const objValue = entry[value]

    lookupObj[objKey] = objValue
  })


  return lookupObj
}

// key = title
//value = id