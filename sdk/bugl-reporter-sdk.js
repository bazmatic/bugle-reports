var Request = require('request');

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
        var url =  this.baseUrl+'/record/' + dataType;
        //console.log(url);
         Request.post(
            {
                url: url,
                headers: this.headers,
                json: true,
                body: data
            },
            callback
        );       
    }
    
    this.createReport = function(name, sql, callback) {
        callback();
    }
}