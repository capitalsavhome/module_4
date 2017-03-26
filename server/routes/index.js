let express = require('express');
let router = express.Router();
let fs = require('fs');
const path = require('path');
const uploadsConfig = require("../uploadsConfig");
const model = require("../../models/files_model.js");
const modelUsers = require("../../models/users_model.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.redirect('/');
});

router.get('/home', function(req, res, next) {
  res.redirect('/');
});

router.get('/uploads', function(req, res, next) {
    res.redirect('/');
});

router.get('/tests', function(req, res, next) {
    res.redirect('/');
});

router.get('/accounts', function(req, res, next) {
    res.json({});
});

router.get('/api/uploads', function(req, res) {
    let responseFromModel = model.getFilesFromDb(req.query.params);
    responseFromModel.then(function (result) {
       res.json(result);
    });
});

router.get('/api/pages', function(req, res) {
    let responseFromModel = model.getFilesCount();
    responseFromModel.then(function (result) {
        res.json(result);
    });
});

router.get('/api/configs', function(req, res) {
    let response = {"host_name" : req.headers.host, "uploads" : "/static/"}
    res.json(JSON.stringify(response));
});

router.delete('/api/uploads/:file_id', (req, res, next) => {
    let responseFromModel = model.removeFiles(req.params.file_id);
    responseFromModel.then(function (result) {
        res.status(JSON.parse(result).status_code).send(JSON.parse(result).response_Text);
    });
});

router.post('/api/users',  function (req, res, next) {
    let responseFromModel = modelUsers.loginUser(req.body.login, req.body.passwoxrd);
    responseFromModel.then(function (result) {
        res.status(JSON.parse(result).status_code).send(JSON.parse(result).response_Text);
    });
});

router.post('/api/users/add',  function (req, res, next) {
    let responseFromModel = modelUsers.singUpUser(req.body.login, req.body.password);
    responseFromModel.then(function (result) {
        res.status(JSON.parse(result).status_code).send(JSON.parse(result).response_Text);
    });
});

router.post('/api/uploads',  function (req, res, next) {
    uploadsConfig.upload(req,res,function(err) {
        if (err) {res.status(406).send('Max file size 20MB');}
        else {
            let responseFromModel = model.uploadFileToServer(req.file.originalname, req.file.filename);
            responseFromModel.then(function (result) {
                res.json(result);
            });
        }
    });
});


module.exports = router;
