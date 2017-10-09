var express = require('express');
var router = express();
var expressSession = require('express-session');
var db = require('./db');

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json({extended: false}));
router.use(expressSession({secret: 'top secret', resave: false, saveUninitialized: true}));

router.get('/', function(req, res){
	res.redirect('/login');
});

router.get('/login', function(req, res){
	if (req.session.login) {
		if (req.session.usertype == 'admin') {
			res.redirect('/adminhome');
			return;
		} else {
			res.redirect('/userhome');
			return;
		}
	} else {
		res.render('view_login',{"message": ""});
	}
});

router.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;

	var msg = {"message": "Invalid username or password"};

	var q = "SELECT * FROM user where university_id='"+username+"' and password='"+password+"'";
	db.getData(q, null, function(result){
		if(result.length > 0) {
			if(result[0].type == 'faculty') {
				req.session.login = true;
				req.session.university_id = result[0].university_id;
				req.session.userid = result[0].id;
				req.session.lastName = result[0].last_name;
				req.session.usertype = result[0].type;
				res.redirect('/adminhome');
			} else {
                req.session.login = true;
                req.session.university_id = result[0].university_id;
                req.session.userid = result[0].id;
                req.session.lastName = result[0].last_name;
                req.session.usertype = result[0].type;
				res.redirect('/userhome');
			}
		} else {
			res.render('view_login',msg);
		}
	});
});




module.exports = router;