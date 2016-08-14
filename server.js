var express=  require('express'); 
var app = express();
var http =  require('http').Server(app);
var path =  require('path');
var io = require('socket.io')(http);

app.use('/',express.static(path.join(__dirname,'./')));


http.listen(8080, function(e){ 
	console.log("Server is listening on port : 8080 ");});

io.on('connection',function(socket){
	console.log("Connected to client ");
	
	socket.on('disconnect',function(){
		console.log("User disconnected");
	});


	socket.on('chat message',function(data){
		console.log(" >> ",data);
		io.emit('chat message',data);
	});

});


