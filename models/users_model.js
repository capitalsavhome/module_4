let Sequelize = require("sequelize");
let sequelize = new Sequelize('postgres://my_admin:sudo12345@localhost:5432/db_files');

const CREATED = 201;
const NOT_ACCEPTABLE = 406;
const OK = 200;

let Users = sequelize.define('users', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    user_email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

sequelize.authenticate().then(function() {
    // console.log('Connect to DB created Users!');
}).catch(function(err) {
    console.log('Connection error Users: ' + err);
});

Users.sync().then(function() {
    // console.log('Success users!');
}).catch(function(err) {
    console.log('Database error: ' + err);
});

let loginUser = function (userEmail, userPassword) {
    return Users.findOne({
        where: {
            user_email: userEmail,
            user_password: userPassword
        }
    }).then(function (response) {
        if (response === null) {
            let functionResponse = {
                "status_code" : NOT_ACCEPTABLE,
                "response_Text" : "Wrong email or password"
            };
            return JSON.stringify(functionResponse);
        }
        else {
            let functionResponse = {
                "status_code" : OK,
                "response_Text" : "Confirmed login"
            };
            return JSON.stringify(functionResponse);
        }
    });
};

let singUpUser = function (userEmail, userPassword) {
    return Users.findOne({
        where: {
            user_email: userEmail
        }
    }).then(function (response) {
        if (response === null){
            return Users.create({
                user_email: userEmail,
                user_password: userPassword
            }).then(function (user) {
                let functionResponse = {
                    "status_code" : CREATED,
                    "response_Text" : "User was created"
                };
                return JSON.stringify(functionResponse);
            });
        }
        else {
            let functionResponse = {
                "status_code" : NOT_ACCEPTABLE,
                "response_Text" : "User already exist"
            };
            return JSON.stringify(functionResponse);
        }

    });
};

module.exports.singUpUser = singUpUser;
module.exports.loginUser = loginUser;

