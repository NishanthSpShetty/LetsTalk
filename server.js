var express=  require('express'); 
var app = express();
var http =  require('http').Server(app);
var path =  require('path');
var io = require('socket.io')(http);

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//connect to chat database
mongoose.connect('mongodb://localhost/LetsTalk');

var db =  mongoose.connection;

db.on('error', function(){
	console.log('Unable to connect to datbase server...\n Please check your databse server and restart.');
});

//setup schema for chat
var chat_schema = mongoose.Schema({
	date:{type:Date, default:Date.now},
	msg:String,
	username:String,
});

//apply Schema into model

var Chats = mongoose.model('Chats',chat_schema);

app.use('/',express.static(path.join(__dirname,'./')));


http.listen(8080, function(e){ 
	console.log("Server is listening on port : 8080 ");});
 
io.on('connection',function(socket){
	var dbdata;
	console.log("Connected to client ");
	
	socket.on('disconnect',function(){
		console.log("User disconnected");
	});


	socket.on('chat message',function(data){
	
		
		console.log(data);
		console.log(" >> [",data.name,"] : ",data.msg);
		dbdata = new Chats(
				{
					username:data.name,
					msg:data.msg,
				});
		
		dbdata.save(function(err){
			if(err){
				console.log("Something went wrong...sot back we will fix it.");
			}else{
				io.emit('chat message',data.msg);
			}
		});
	});

});


