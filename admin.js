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

router.get('/', function (req, res) {
    if (!req.session.login) {
        res.redirect('/login');
        return;
    }
    if (req.session.usertype == 'student') {
        res.redirect('/userhome');
        return;
    }
    var sql = "SELECT * FROM `lecture` WHERE facultyId = '" + req.session.university_id + "'";
    db.getData(sql, null, function (result) {
        var data = {'lectures': result};
        res.render('view_adminhome', data);
    });
});

router.get('/lecturedetails:id', function (req, res) {

    if (!req.session.login) {
        res.redirect('/login');
        return;
    }
    if (req.session.usertype == 'student') {
        res.redirect('/userhome');
        return;
    }

    var courseId = req.params.id.replace(':', '');
    var sql = "SELECT * FROM `lecture` where `id`='" + courseId + "'";
    db.getData(sql, null, function (lecture) {
        sql = "SELECT * FROM `topic` where `facultyId`='" + req.session.userid + "' ORDER BY id ASC";
        db.getData(sql, null, function (topics) {
            var data = {'lectures': lecture, 'topics': topics};
            res.render('view_lecturedetails', data);
        });
    });
});

router.post('/lecturedetails:id', function (req, res) {
    if (!req.session.login) {
        res.redirect('/login');
        return;
    }
    if (req.session.usertype == 'student') {
        res.redirect('/userhome');
        return;
    }

    var lectureID = req.body.lectureID;
    var topicName = req.body.topicName;

    var sql = "INSERT INTO `topic` (topicName, lectureId, facultyId) VALUES ('" + topicName + "', '" + lectureID + "', '" + req.session.userid + "')";
    db.getData(sql, null, function (result) {
        res.json({"uploded": "success"});
        return;
    });
});

router.post('/startstoplecture', function (req, res) {
    if (!req.session.login) {
        res.redirect('/login');
        return;
    }
    if (req.session.usertype == 'student') {
        res.redirect('/userhome');
        return;
    }

    if (!req.session.lectureID) {
        req.session.lectureID = req.body.lectureID;
        res.json({"started": "success"});
        return;
    } else {
        req.session.lectureID = null;
        res.json({"stoped": "success"});
    }
});

router.get('/showgraph:id', function (req, res) {
    if (!req.session.login) {
        res.redirect('/login');
        return;
    }
    if (req.session.usertype == 'student') {
        res.redirect('/userhome');
        return;
    }

    if (!req.session.lectureID) {
        res.redirect('/adminhome');
        return;
    }

    var topicID = req.params.id.replace(':', '');
    var lectureID = req.session.lectureID;

    var sql = "SELECT value,COUNT(*) as count FROM ratting WHERE topicID = "+topicID+" AND lectureID = "+lectureID+" GROUP BY value ORDER BY value ASC"
    db.getData(sql, null, function (rattings) {
        var sql = "SELECT * FROM `topic` JOIN lecture on topic.lectureId=lecture.id WHERE topic.id="+topicID;
        db.getData(sql, null, function (topicDetails) {
            var pageData = {"rattings":rattings, "topicDetails": topicDetails};
            res.render("view_topicgraph", pageData);
        });
    });
});

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
    return;
});

module.exports = router;