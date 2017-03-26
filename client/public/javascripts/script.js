let productApp = angular.module('productsApp', ['ui.router', 'ngFileUpload']);

let isLogined = false;

productApp.controller('headMenuController', function ProductListController($scope, $http, $location) {
    $scope.isMenuShow = function() {
        if (loginCheck() === true) {
            return true;
        }
        else if (loginCheck() === false) {
            return false;
        }
    }
});

function setIsLogined(boolean) {
    isLogined = boolean;
}

function loginCheck() {
    return isLogined;
}

productApp.component('home', {
    // template: '<h1>products11</h1>'
    templateUrl: '/home.html'
});

productApp.component('uploads', {
    //template: '<h1>uploads12</h1>'
    templateUrl: '/uploads.html',

    controller: function($scope, Upload, $http) {

        const ZERO = 0;

        const STATUS_OK = "200";

        const MAX_FILE_SIZE = 20971520;

        const PERCENT_100 = 100;

        const HTTP = "http://"

        let percentage = 0;

        let filesArray = new Array();

        let allFilesArray = new Array();

        let currentPage = ZERO;

        let fileIdStep;

        let isProgressShow = false;

        let pagesArray = new Array();

        let serverHostName;

        let serverUploadsPath;

        function setServerHostName(hostName) {
            serverHostName = hostName;
        }

        this.getHttpConst = function () {
            return HTTP;
        }

        this.getServerHostName = function(){
            return serverHostName;
        };

        function setServerUploadsPath(uploadsPath) {
            serverUploadsPath = uploadsPath;
        }

        this.getUploadsPath = function () {
            return serverUploadsPath;
        };
        // let timerId = setTimeout(setIsProgressBarShow(false), delay[3000]);

        function setAllFilesArray(array) {
            allFilesArray = array;
        }

        function getAllFilesArray() {
            return allFilesArray;
        }

        function getFileIdStep() {
            return fileIdStep;
        }

        function setFileIdStep(file_Id_Step) {
            fileIdStep = file_Id_Step;
        }

        function clearFilesArray() {
            filesArray = [];
            // alert("clear");
        }

        this.getFilesArray = function () {
            return filesArray;
        };

        this.getPercentage = function () {
            return percentage;
        };

        function setIsProgressBarShow(boolean) {
            isProgressShow = boolean;
        }

        function getIsProgressBarShow() {
            return isProgressShow;
        }

        this.hideProgressBar = function () {
            setIsProgressBarShow(false);
        }

        this.isProgressShow = function () {
            if (getIsProgressBarShow() === true){
                return true;
            }
            else {
                return false;
            }
        };

        function setPercentage(value) {
            percentage = value;
        }

        function getCurrentPage() {
            return currentPage;
        }

        function clearPagesArray() {
            pagesArray = [];
        }

        this.getPagesArray = function () {
            return pagesArray;
        };


        function loadTenFiles(file_id_start) {

            $http({
                method: 'GET',
                url: '/api/uploads?params=' + file_id_start,
            }).then(function successCallback(response) {
                clearFilesArray();
                filesArray = angular.fromJson(response.data);
            }, function errorCallback(response) {
                alert("Error");
            });
        }


        this.uploadFiles = function() {
            let upload_files_Array = new Array();
            // for (let i = 0; i < document.getElementById('file').files.length; i++){
            //     let file = document.getElementById('file').files[i];
            //     upload_files_Array.push(file);
            // }
            for (let i = 0; i < document.getElementById('file').files.length; i++){
                if (document.getElementById('file').files[i].size < MAX_FILE_SIZE){
                    let file = document.getElementById('file').files[i];
                    upload_files_Array.push(file);
                }
                else {
                    alert("Max File Size = 20MB");
                }
            }
            for (let i = 0; i < upload_files_Array.length; i++){
                setPercentage(ZERO);
                setIsProgressBarShow(true);
                Upload.upload({
                    url: '/api/uploads',
                    data: {file: upload_files_Array[i]}
                }).then(function (resp) {
                    if (filesArray.length < 10) {
                        filesArray.push(angular.fromJson(resp.data));
                    }
                    else {
                        getPagesCount();
                    }
                }, function (resp) {
                    alert(resp + "Error when upload");
                }, function (evt) {
                    let progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    setPercentage(progressPercentage);
                });
            }
        };

        this.loadFiles = function (file_id_step) {
            getPagesCount();
            getServerParameters();
            setIsProgressBarShow(false);
            $http({
                method: 'GET',
                url: '/api/uploads?params=' + file_id_step,
            }).then(function successCallback(response) {
                clearFilesArray();
                filesArray = angular.fromJson(response.data);
            }, function errorCallback(response) {
                alert("Error");
            });
        };


        this.deleteFile = function (fileId) {
            $http({
                method: 'DELETE',
                url: '/api/uploads/' + fileId
            }).then(function successCallback(response) {
                if(response.status === 200){
                    removeFileFromFilesArray(fileId);
                }
            }, function errorCallback(response) {
                alert("Error");
            });
        };

        function removeFileFromFilesArray(fileId) {
            for (let i = 0; i < filesArray.length; i++){
                if (fileId === filesArray[i]["file_id"]){
                    filesArray.splice(i, 1);
                }
            }
        }

        function getPagesCount() {
            $http({
                method: 'GET',
                url: '/api/pages',
            }).then(function successCallback(response) {
                clearPagesArray();
                pagesArray = angular.fromJson(response.data);
            }, function errorCallback(response) {
                alert("Error");
            });
        }

        function getServerParameters() {
            $http({
                method: 'GET',
                url: '/api/configs',
            }).then(function successCallback(response) {
                setServerHostName(angular.fromJson(response.data).host_name);
                setServerUploadsPath(angular.fromJson(response.data).uploads);
                // alert(angular.fromJson(response.data).host_name);
                // alert(angular.fromJson(response.data).uploads);
            }, function errorCallback(response) {
                alert("Error");
            });
        }
    }
});

productApp.component('login', {
    // template: '<h1>products11</h1>'
    templateUrl: '/login.html',
    controller: function($scope, $http) {

        const CREATED = 201;
        const NOT_ACCEPTABLE = 406;
        const OK = 200;

        let loginResponse = "Please singIn or singUp";

        this.getLoginResponse = function () {
            return loginResponse;
        };

        function setLoginResponse(response_from_server) {
            loginResponse = response_from_server;
        }


        this.loginUser = function () {
            let login = this.userEmailSingIn;
            let password = this.userPasswordSingIn;
            $http({
                method: 'POST',
                url: '/api/users',
                data: {"login": login, "password": password}
            }).then(function successCallback(response) {
                if (response.status === OK) {
                    setLoginResponse("WELCOME");
                    setIsLogined(true);
                }
            }, function errorCallback(response) {
                // alert(response.status);
                if (response.status === NOT_ACCEPTABLE) {
                    setLoginResponse(response.data);
                }
            });
        };

        this.singUpUser = function () {
            let login = this.userEmailSingUp;
            let password = this.userPasswordSingUp;
            $http({
                method: 'POST',
                url: '/api/users/add',
                data: {"login": login, "password": password}
            }).then(function successCallback(response) {
                if (response.status === CREATED){
                    setLoginResponse(response.data);
                }
            }, function errorCallback(response) {
                if (response.status === NOT_ACCEPTABLE) {
                    setLoginResponse(response.data);
                }
            });
        }

        this.showSingOut = function () {
            if (isLogined) {
                return true;
            }
            else {
                return false;
            }
        }

        this.showSingIn = function () {
            if (!isLogined) {
                return true;
            }
            else {
                return false;
            }
        }

        this.singOut = function () {
            setIsLogined(false);
        }
    }
});

productApp.config(function($stateProvider, $locationProvider) {
    // $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);

    let productsState = {
        name: 'home',
        url: '/home',
        component: 'home',
    };

    let uploadsState = {
        name: 'uploads',
        url: '/uploads',
        component: 'uploads',

    };

    let removeState = {
        name: 'remove',
        url: '/user/add',
        controller: function () {

        }

    };

    let testsState = {
        name: 'tests',
        url: '/tests',
        views: {
            'testsTop': {
                templateUrl: 'test.html',
            },
            'testMiddle': {
                template: '<h1>Test Middle</h1>'
            },
            'testBottom': {
                template: '<h1>Test Bottom</h1>'
            }
        }
    };

    let loginState = {
        name: 'login',
        url: '/login',
        component: 'login',
    };

    $stateProvider.state(productsState);
    $stateProvider.state(uploadsState);
    $stateProvider.state(testsState);
    $stateProvider.state(removeState);
    $stateProvider.state(loginState);
});

productApp.run(['$state', function ($state) {
    $state.transitionTo('login');
}]);

