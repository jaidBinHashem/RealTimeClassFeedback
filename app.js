var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Socketio = require('socket.io');
var login = require('./login');
var adminhome = require('./admin');
var userhome = require('./user');

app.set('view engine', 'ejs');

app.use(express.static('./node_modules/jquery/dist'));
app.use(express.static('./public/js/'));

app.use('/',login);
app.use('/adminhome', adminhome);
app.use('/userhome', userhome);


var server = app.listen(1993, function() {
	console.log('server started at port 1993');
});


var io = Socketio(server);

io.sockets.on('connection', function (socket) {
	console.log('Connected [ID: ' + socket.id + ']');

    socket.on('send data', function(data){

    	console.log(data.lectureID);

        // var q = "INSERT INTO `chathistory`(`userid`, `message`, `time`) VALUES ("+data.user+",'"+data.message+"','"+msgtime+"')";
        // db.getData(q, null, function(result){
        //
        // });
        //
        //
        // var q = "SELECT * FROM users where id='"+data.user+"'";
        // db.getData(q, null, function(result){
        //     var newdata = {'message':data.message ,
        //         'photo' : result[0].photo,
        //         'fullname': result[0].fullaname,
        //         'time'  : msgtime
        //     };
        //
        //     io.sockets.emit('incoming data', newdata);
        // });

    });
});