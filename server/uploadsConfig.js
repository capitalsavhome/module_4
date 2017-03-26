let express = require('express');
const path = require('path');
const fs = require('fs');
const uploadPath = 'server/uploads/';
const multer = require('multer');

let storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        // cb(null, 'server/uploads/')
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, datetimestamp + '-' + file.originalname );
    }
});

let upload = multer({ //multer settings
    storage: storage,
    limits: {fileSize: 20971520}
}).single('file');

module.exports.upload = upload;
module.exports.uploadPath = uploadPath;