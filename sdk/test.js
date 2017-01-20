var Sdk = require('./bugl-reporter-sdk.js');
var client = new Sdk.Client({host:'localhost', port: 8714});
client.createDataType('health', function(err, data) {
    if (err) {
        console.error(err);
    }
    else {
        console.log(JSON.stringify(data));
    }
});
/*
client.addRecord('questionnaire', 
    {
        "program_id": "ltwl",
        "custodian": "partner1",
        "contributor": "baz", 
        "item_id": "favourite_things",
        "action": "start",
        "overall_start": 0
    },
    function(err, data) {
        if (err) {
            console.error(err);
        }
        else {
            console.log(JSON.stringify(data));
        }       
    }
)*/