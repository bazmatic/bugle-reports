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
	res.status(200).send("newNRG Reporter 0.1");
});

//Create a new table
api.post('/dataType/:name', DataType.post);

//Post a record
api.post('/record/:dataType', Record.post);

//Post a report
api.post('/report', Report.post);
api.put('/report', Report.put);


api.get('/report/:id', Report.get);

api.get('/run/:id', Report.run);

//Start server
Http.createServer(api).listen(Utils.PORT);
console.log("Web service listening on", Utils.PORT);

//Exception safety net
process.on('uncaughtException', function(err) {
	// handle the error safely
	console.log("SAFETY NET", err.stack);
});


