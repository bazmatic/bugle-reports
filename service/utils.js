var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH,FILE');
	res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, X-Requested-With');
	//res.header('Access-Control-Allow-Headers', '*');//'Content-Type,userId,token');

	next();
};
exports.allowCrossDomain = allowCrossDomain;

var logRequest = function(req, res, next) {
	console.log(req.ip, req.originalUrl);
	next();
};
exports.logRequest = logRequest;

function handleResponse(err, data, res, errCode)
{
	if (err)
	{
		if (!errCode)
		{
			errCode = 500;
		}
		res.status(errCode).json({"error": err, "data": data || null});
	}
	else
	{
		if (data)
		{
			if (data.toJSON)
			{
				data = data.toJSON();
			}
			res.status(200).json(data);
		}
		else
		{
			res.status(404).json({"error": "Item not found"});
		}
	}
}
exports.handleResponse = handleResponse;

exports.validateRequest = function(req, res, next) {
	console.log("validateRequest()");
	if (req.headers) {
		if (req.headers['content-type']) {
			if (req.headers['content-type'].indexOf('application/json') > -1) {
				next();

			}
			else {
				handleResponse("Incorrect 'content-type' header. Correct value: 'application/json'", null, res, 400);
			}
		}
		else {
			handleResponse("Missing 'content-type' header. Ensure the request includes header 'content-type: application/json'", null, res, 400);
		}
	}
	else {
		handleResponse("No headers. Ensure the request includes header 'content-type: application/json'", null, res, 400);
	}

}



exports.PORT = 8714;


function underscoreString(s) {
	var result = (s.replace(/\.?([A-Z]+)/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, ""));
	console.log(result);
	return result;
}
exports.underscoreString = underscoreString;

function underscoreObject (obj) {
	var s = JSON.stringify(obj, function (key, value) {
	  if (value && typeof value === 'object') {
	    var replacement = {};
	    for (var k in value) {
	      if (Object.hasOwnProperty.call(value, k)) {
	        replacement[underscoreString(k)] = value[k];
	      }
	    }
	    return replacement;
	  }
	  return value;
	});	
	return JSON.parse(s);
	
}
exports.underscoreObject = underscoreObject;

function traverse(o, func) {
    for (var i in o) {
        
        if (o[i] !== null) {
        	if (typeof(o[i])=="object") {
            	traverse(o[i],func);
        	}
        	else {
        		func.apply(this,[i,o[i]]);  	
        	}
        }
    }
}
