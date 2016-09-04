
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mysql = require('mysql');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

/*http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});*/

var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "12345678",
	  database: "Chatroom"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var onlookers = 0;
var usernames = [];
//io.sockets.on('connection', routes.vote);
io.on('connection', function(socket) {
    socket.on('new-onlookers', function() {
    	console.log('new-onlookers');
    	socket.username='';
    	socket.userindex=-1;
        onlookers = onlookers+1;
        res=[usernames.length, onlookers];
        socket.emit('system', 'users', res);
        console.log(usernames,onlookers);
    });
    socket.on('new-name', function(data) {
    	console.log('new-name');
    	console.log(data.old,data.new);
    	console.log(usernames);
    	if (usernames.indexOf(data.new) > -1) {
    		console.log('used');
            socket.emit('nameexisted');
        } else {
        	if (socket.userindex>-1){
        		socket.username = data.new;
                usernames[socket.userindex] = data.new;
                socket.emit('namesuccess');
                res=[usernames.length, onlookers, data.old, socket.username, new Date().getTime()];
                io.sockets.emit('system', 'change', res);
                //io.sockets.emit('system', 'change', socket.username, usernames.length, onlookers, data.old); 
        	}else{
        		onlookers = onlookers-1;
        		socket.userindex = usernames.length;
                socket.username = data.new;
                usernames.push(data.new);
                socket.emit('namesuccess');
                res=[usernames.length, onlookers, socket.username, new Date().getTime()];
                io.sockets.emit('system', 'join', res);
                //io.sockets.emit('system', 'join', socket.username, usernames.length, onlookers ); 
        	}
        };
        console.log(usernames,onlookers);
    });
    socket.on('disconnect', function(data) {
    	setTimeout(function () {
    		console.log('disconnect');
        	if (socket.userindex!=-1){
        		usernames.splice(socket.userindex, 1);
        		res=[usernames.length, onlookers, socket.username, new Date().getTime()];
                socket.broadcast.emit('system', 'leave', res);
        	    //socket.broadcast.emit('system', 'leave', socket.username, usernames.length, onlookers);
        	}else
        		onlookers = onlookers-1;
        	console.log(usernames,onlookers);
       }, 100);
    });
    socket.on('msg', function(msg) {
    	console.log('msg');
    	d=new Date();
    	res=[usernames.length, onlookers, socket.username, d.getTime(), msg];
    	io.sockets.emit('system', 'msg', res);
    	var msgdata = {
    		User:res[2],
    		Time:d.getTime(),
    		Msg:res[4],
    	}
    	con.query('INSERT INTO ChatData SET ?', msgdata, function(err,res){
    	  if(err) throw err;
    	  console.log('Msg add success!');
    	});
    	console.log(usernames,onlookers);
    	//socket.broadcast.emit('system', 'msg', res);
    	//socket.broadcast.emit()
    });
    socket.on('more',function(data){
    	var time=data.Time;
    	console.log(data.Time);
    	con.query("SELECT * FROM ChatData where Time<'"+data.Time+"' order by Time DESC limit 10",function(err,rows){
    		  if(err) throw err;
    		  //console.log('Data received from Db:\n');
    		  //console.log(rows);
    		  res=[usernames.length, onlookers, rows];
    		  socket.emit('system', 'more', res);
    		});
    	console.log(usernames,onlookers);
    })
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
