var Sql = require('./sql.js');
var Utils = require('./utils.js');
//var Sdk = require('../sdk/bugl-reporter-sdk.js')

var requiredFields = [];// ['program_id', 'custodian', 'contributor', 'item_id', 'action', 'overall_start'];
//var otherFields = ['id', 'text_value', 'number_value', 'timestamp'];

exports.post = function(req, res) {
	
	var dataType = req.params.dataType;
	var successCount = 0;
	var errs = [];

	var itemList;
	if (req.body.constructor == Object) {
		itemList = [req.body];
	}
	else {
		itemList = req.body;
	}
	Sql.insertMulti(dataType, itemList, [], (err) =>{
		if (err) {
			console.error(err);
			Utils.handleResponse(err, null, res, 500);
		}
		else {
			console.log("Inserted", itemList.length);
			Utils.handleResponse(null, {inserted: itemList.length}, res);	

		}
	});
	
	/*
	itemList.forEach(function(record) {
		var validation = Sql.validateRecord(record, requiredFields);
		if (validation.valid) {

			Sql.Crate
				.insert(dataType, validation.record)
				.success((data)=>{
					successCount ++;
				
				})
				.error((err)=>{
					errs.push(err);
				
				});
		}
		else {
			Utils.handleResponse("Invalid record", validation, res, 400);
		}
	});*/

		
		

}

exports.test = function(req, res) {
    var q = req.body.q;
    Sql.Crate.execute ("select * from tweets where text like ? and retweeted=? limit 1", [q, false])
    	.success (function (data){
    		Utils.handleResponse(null, data, res, null);
    	});
}




