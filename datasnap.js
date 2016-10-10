var iconv = require('iconv-lite');

function route(routeName) {
    return "/datasnap/rest/TServMet/" + routeName;
}

// Formats a database query result to look like a datasnap response
function prepareResult(tableStructure, result) {
    if (result.length==0)
      return {"result":[{"table":[]}]}

    root = extractRowStructure(result[0]);
    root.table = tableStructure;

    for (var i = 0; i < result.length; i++) {
        row = result[i];
        for (var property in row) {
            value = row[property];
            if (value instanceof Buffer)
                root[property].push(iconv.decode(value, 'latin1'))
            else
                root[property].push(row[property]);
        }    
    }

    //console.log(JSON.stringify(root));
    
    return { "result" : [root] };
}

function extractRowStructure(row) {
    var obj = {};
    for (var property in row) {
        if (row.hasOwnProperty(property)) {
            obj[property] = [];
        }
    }
    return obj;
}

module.exports.route = route;
module.exports.prepareResult = prepareResult;

