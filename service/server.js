var Express = require('express');
var Http = require('http');
var BodyParser = require('body-parser');

var Utils = require('./utils.js');
var Record = require('./record.js');
var DataType = require('./data-type.js');
var Report = require('./report.js');


//=== API
var api = Express();


api.use(BodyParser.json());
api.use(Utils.allowCrossDomain);
api.use(Utils.logRequest);

api.set('port', Utils.PORT);

api.get('/', function(req, res)
{
	res.status(200).send("Bugle Reporter");
});

//Create a new table
api.post('/dataType/:name', DataType.post);

//Post a record
api.post('/record/:dataType', Record.post);

//Create a report
api.post('/report', Report.post);

//Update a report
api.get('/report/:id', Report.get);

//Get a report
api.put('/report/:id', Report.put);

//Run a report
api.get('/run/:id', Report.run);

//=== Start server
Http.createServer(api).listen(Utils.PORT);
console.log("Web service listening on", Utils.PORT);

//Exception safety net
process.on('uncaughtException', function(err) {
	console.log("Unhandled error:", err.stack);
});


