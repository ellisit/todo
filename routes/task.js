var mysql = require('mysql');


var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todolist"
});




addTask = function(){
	connection.query("SELECT * FROM users WHERE Name ="+email+" AND Password = "+password, function (error, results, fields){
	if (error) throw error;		
	});
};

