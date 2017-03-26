let Sequelize = require("sequelize");
let sequelize = new Sequelize('postgres://my_admin:sudo12345@localhost:5432/db_files');
let fs = require("fs");
let uploadsConfig = require("../server/uploadsConfig")//("../uploadsConfig");
const STATUS_OK = 200;


let Files = sequelize.define('file_names', {
    file_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
        // field: 'file_id' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    file_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    file_server_name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

sequelize.authenticate().then(function() {
    // console.log('Connect to DB created!');
}).catch(function(err) {
    console.log('Connection error: ' + err);
});

Files.sync().then(function() {
    // console.log('Success!');
}).catch(function(err) {
    console.log('Database error: ' + err);
});

let uploadFileToServer = function (fileName, fileServerName) {
    return Files.create({
        file_name: fileName,
        file_server_name: fileServerName
    }).then(function (file) {
        let response = {
            file_id: file.getDataValue("file_id"),
            file_name: file.getDataValue("file_name"),
            file_server_name: file.getDataValue("file_server_name")
        };
        return JSON.stringify(response);
    });
};

let getFilesFromDb = function (offset_value) {
    return Files.findAll({
        limit: 10,
        offset: offset_value
    }).then(function (result) {
        return JSON.stringify(result);
    });
};

let removeFiles = function (fileId) {
    return Files.findOne({
        where: {
            file_id: fileId
        }
    }).then(function (response) {
        fs.unlink(uploadsConfig.uploadPath + response.getDataValue("file_server_name"));
        return Files.destroy({
            where: {
                file_id: fileId
            }
        }).then(function (response) {
            let functionResponse = {
                "status_code" : STATUS_OK,
                "response_Text" : "File was deleted"
            };
            return JSON.stringify(functionResponse);
            // return "OK";
        });
    });
};

let getFilesCount = function (hostName) {
    return Files.findAndCountAll({

    })
        .then(function(result) {
            console.log(result.count + "=== count");
            let page = 0;
            let offset = -10;
            let countFilesDiv10 = result.count / 10;

            let jsonArr = [];
            while (true){
                if (countFilesDiv10 >= 1) {
                    page++; offset += 10; countFilesDiv10 -= 1;
                    jsonArr.push({
                        "page" : page,
                        "offset" : offset
                    });
                }
                else if (countFilesDiv10 < 1 && countFilesDiv10 >= 0.1) {
                    page++; offset += 10;
                    jsonArr.push({
                        "page" : page,
                        "offset" : offset
                    });
                    break;
                }
                else {
                    break;
                }
            }
            console.log("jsonArray = " + jsonArr);
            console.log("Json Stringify = " + JSON.stringify(jsonArr));
            return JSON.stringify(jsonArr);
        });
}

module.exports.filesSeqObject = Files;
module.exports.sequelize = sequelize;
// module.exports.testFile = testFile;
module.exports.getFilesFromDb = getFilesFromDb;
module.exports.removeFiles = removeFiles;
module.exports.uploadFileToServer = uploadFileToServer;
module.exports.getFilesCount = getFilesCount;