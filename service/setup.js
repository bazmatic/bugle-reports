 
 var Sql = require('./sql.js');
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

    schemas.forEach((schema)=>{
        Sql.Crate.create(schema).success(function(data) {
            console.log(JSON.stringify(data));
        })
        .error(function(err) {
            console.error(err);
        })      
    });
