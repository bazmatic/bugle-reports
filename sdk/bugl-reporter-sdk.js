var Request = require('request');
var async = require('async');

exports.makeUid = function() {
    return (new Date().getTime()).toString(16) + "-" + (Math.floor(Math.random() * 9999999)).toString(16);
}

exports.Client = function(config) {
    this._host = config.host || '127.0.0.1';
    this._port = config.port || 8714;
    this.headers = {
        'User-Agent': 'Bugl Reporting',
        'Content-Type': 'application/json'
    };
    this.baseUrl = 'http://'+this._host+':'+this._port;
    
    this.createDataType = (name, callback) => {
        Request.post(
            {
                url: this.baseUrl+'/dataType/' + name,
                headers: this.headers,
                json: true,
                body: {
                    "name": name
                }
            },
            callback
        );
    }
    
    this.addRecord = (dataType, data, callback) => {


		if (data.constructor == Array) {
			var lastError = null
			if (data.length > 10) {
				//Break array into segments
				var segments = [];
				while(data.length) {
					segments.push(data.splice(0, 30));
				}
			}
			else {
				segments = [data];
			}
			var self = this;
			var sentCount = 0;
			async.eachLimit(segments, 5,
				function(segment, callback) {
					if (!segment.length) {
						console.log(JSON.stringify(segment));
					}
					self._addRecord(dataType, segment, function(err){

						if (err) {
							console.error(err);
							lastError = err;
						}
						else {
							sentCount += segment.length || 0;
						}
						callback(lastError)
					});
				},
				function(err) {
					callback(lastError, sentCount);
				}
			);

		}
		else {
			this._addRecord(dataType, data, callback);
		}

    }

	this._addRecord = (dataType, data, callback) => {
		var url =  this.baseUrl+'/record/' + dataType;
		//console.log(url);
		Request.post(
			{
				url: url,
				headers: this.headers,
				json: true,
				body: data,
				timeout: 20000
			},
			function(err, res, body) {
				//console.log(body);
				callback(err);
			}
		);
	}

    
    this.createReport = function(id, name, sql, callback) {
		var url = this.baseUrl + '/report';
		var paramCount = sql.split("?").length-1;
		var postData = {
			id: id,
			name: name,
			query: sql,
			param_count: paramCount
		};

        Request.post(
			{
				url: url,
				headers: this.headers,
				json: true,
				body: postData,
				timeout: 20000
			},
			function(err, res, data) {
				callback(err, data);
			}
		);
    },

	this.runReport = function(id, parameterValues, callback) {
		var parameterStr = "";
		var i=0;
		parameterValues.forEach(function(param) {
			if (i>0) parameterStr += ",";
			parameterStr += param;
			i++;
		})
		Request.get(
			{
				url: this.baseUrl+'/run/'+id+'?parameters=' + parameterStr,
				headers: this.headers,
				json: true,
				timeout: 20000
			},
			function(err, res, body)
			{
				callback(err, body);
			}
		)
	}
}