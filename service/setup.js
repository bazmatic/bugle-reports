 
 var Sql = require('./sql.js');
 exports.run = function() {
    var schemas = [
        {
            "bugl_reports": 
            {
                id: "string primary key",
                name: "string",
                sql: "string"
            }
        }
      
    ];
    console.log("Setting up Crate");
    schemas.forEach((schema)=>{
        Sql.Crate.create(schema).success(function(data) {
            console.log(JSON.stringify(data));
        })
        .error(function(err) {
            console.error(err);
        })      
    });
 }

