var Sql = require('./sql.js');
var Utils = require('./utils.js');

exports.post = function(req, res) {
    console.log("dataType.post()");
    
    var tableSchema = {
        id: "string primary key"
    };
    /*    program_id: "string",
        custodian: "string", //Who controls this data? Partner ID
        contributor: "string", //User ID
        item_id: "string",
        action: "string", //What did they do with it? Start, finish, earn, etc
        number_value: "float",
        text_value: "string",
        timestamp: "timestamp",
        overall_start: "timestamp" //Overall starting point, used for reporting overall progress. Avoids awkward queries 
    }  */
    var createData = {};
    createData[req.params.name] = tableSchema;
    Sql.Crate.create(createData).success(function(data) {
        Utils.handleResponse(null, data, res);
    })
    .error(function(err) {
        console.error(err);
        Utils.handleResponse(err, null, res, 500);   
    })
}

