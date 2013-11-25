var mongoose = require('mongoose');



module.exports = function (app){

	mongoose.connect('localhost', 'test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback() {
	  console.log('Connected to DB');
	});

};