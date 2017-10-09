var express = require('express');
var router = express();
var db = require('./db');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var validator = require('express-validator');

router.use(express.static('./node_modules/jquery/dist'));
router.use(express.static('./public/js/'));
router.use(validator());
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json({extended: false}));
router.use(expressSession({secret: 'top secret', resave: false, saveUninitialized: true}));

router.get('/', function(req, res) {
    if(!req.session.login) {
        res.redirect('/login');
        return;
    }
    if(req.session.usertype == 'faculty') {
        res.redirect('/adminhome');
        return;
    }
    var sql = "SELECT * FROM `lecture`";
    db.getData(sql, null, function(result) {
        var data = {'lectures': result };
        res.render('view_userhome',data);
    });
});

router.get('/joinclass:id', function (req, res) {
    if(!req.session.login) {
        res.redirect('/login');
        return;
    }
    if(req.session.usertype == 'faculty') {
        res.redirect('/adminhome');
        return;
    }

    var lectureId = req.params.id.replace(':', '');
    var sql = "SELECT * FROM `lecture` where `id`='"+lectureId+"'";
    db.getData(sql, null, function (lecture) {
        var sql = "SELECT * FROM `topic` where `lectureId`='"+lectureId+"'";
        db.getData(sql, null, function (topics) {
            var data = {'lectures': lecture, 'topics': topics};
            res.render('view_joinclass', data);
        });
    });
});

router.post('/postratting', function (req, res) {
    if(!req.session.login) {
        res.redirect('/login');
        return;
    }
    if(req.session.usertype == 'faculty') {
        res.redirect('/adminhome');
        return;
    }

    var lecturID = req.body.lectureID;
    var topicID = req.body.topicID;
    var value = req.body.value;

    var sql = "select * from ratting where lectureID='"+lecturID+"' and topicID='"+topicID+"' and userID='"+req.session.userid+"'";
    db.getData(sql, null, function (ratting) {
        if(ratting.length > 0) {
            var sql = "UPDATE `ratting` SET `value` = '"+value+"' WHERE `ratting`.`id` = '"+ratting[0].id+"'";
            db.getData(sql, null, function (result) {
                res.json({"updated":true});
                return;
            })
        } else {
            var sql = "insert into `ratting` (lectureID, topicID, value, userID) values ('"+lecturID+"', '"+topicID+"', '"+value+"', '"+req.session.userid+"')";
            db.getData(sql, null, function (result) {
                res.json({"saved":true});
                return;
            });
        }
    });
});


router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
    return;
});

module.exports = router;