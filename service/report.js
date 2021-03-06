var Async = require('async');

var Sql = require('./sql.js');
var Utils = require('./utils.js');
//var Sdk = require('../sdk/bugl-reporter-sdk.js');

var requiredFields = ['name', 'sql', 'parameters'];
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
    Sql.updateOne(TABLE_NAME, req.params.id, req.body, function(err, data) {
        Utils.handleResponse(err, data, res, 500);
    })

}

exports.get = function(req, res) {
    Sql.getOne(TABLE_NAME, req.params.id, function(err, data) {
        Utils.handleResponse(err, data, res, 500);
    });
}

exports.run = function(req, res) {
    console.log("report.run");
    var reportSchema, reportData, result = {}, errCode = 500;
    Async.series([
        function _getReport(callback) {
            Sql.getOne(TABLE_NAME, req.params.id, function(err, data) {
                if (err) {
                    callback(err);
                }
                else if (data) {
                    reportSchema = data;
                    callback(err);
                    
                }
                else {
                    errCode = 404;
                    callback("Report not found");
                    
                }
                
            })           
        },
        
        function _runReport(callback) {
            var paramValues = req.query.parameters.split(",");
            reportSchema.sql = reportSchema.sql.replace(/`/g, "'");
             console.log("Querying ", reportSchema.sql );
            Sql.query(reportSchema.sql, paramValues, function(err, data) {
                if (data) {
                    reportData = data;
                }
                callback(err);
            })
        }
    ],
    function(err) {
        if (err) {
            console.error(err);
        }
        else if (reportData && reportSchema) {
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


