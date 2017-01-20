var Async = require('async');

var Sql = require('./sql.js');
var Utils = require('./utils.js');
var Sdk = require('../sdk/bugl-reporter-sdk.js');

var requiredFields = ['name', 'query', 'parameters'];
var TABLE_NAME = 'bugl_reports';

exports.post = function(req, res) {
	var dataType = req.params.dataType;
	var reportData = req.body;
	var result;
	
    Async.series(
        [
            function _saveRecord(callback) {
                Sql.insertSingle(TABLE_NAME, reportData, requiredFields, (err, data) =>{
                    result = data; 
                    //result.newnrg_report_params = [];
                    callback(err);
                });

            }
            
        ],
        function(err) {
           Utils.handleResponse(err, result, res, 500);
        }
    );

}

exports.put = function(req, res) {


}

exports.get = function(req, res) {
    Sql.getOne(TABLE_NAME, req.params.id, function(err, data) {
        Utils.handleResponse(err, data, res, 500);
    });
}

exports.run = function(req, res) {
    var reportSchema, reportData, result = {}, errCode = 500;
    Async.series([
        function _getReport(callback) {
            Sql.getOne(TABLE_NAME, req.params.id, function(err, data) {
                if (data) {
                    reportSchema = data;
                    
                }
                else {
                    errCode = 404;
                    callback("Report not found");
                    
                }
                callback(err);
            })           
        },
        
        function _runReport(callback) {
            var paramValues = req.query.parameters.split(",");
            console.log("Querying ", reportSchema.query );
            Sql.query(reportSchema.query, paramValues, function(err, data) {
                if (data) {
                    reportData = data;
                }
                callback(err);
            })
        }
    ],
    function(err) {

        if (reportData && reportSchema) {
            result = {
                name: reportSchema.name,
                cols: reportData.cols,
                rows: reportData.rows,
                colTypes: reportData.col_types.map(function(item){
                    if ([6,7,8,9,10,11].indexOf(item)>-1) return "number"
                    else if (item == 4) return "string"
                    else if (item == 100) return "array"
                    else return "object"
                })
            }  
        }

        Utils.handleResponse(err, result, res, errCode);
    });

}


