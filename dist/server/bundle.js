/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/server/app.ts":
/*!***************************!*\
  !*** ./src/server/app.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
console.log("\n\n===============>\t app starting\n");
var mysql = __webpack_require__(/*! mysql */ "mysql");
var http_1 = __webpack_require__(/*! http */ "http");
var express = __webpack_require__(/*! express */ "express");
var socketIo = __webpack_require__(/*! socket.io */ "socket.io");
var path = __webpack_require__(/*! path */ "path");
var CONSTANTS = __webpack_require__(/*! ./constants/constants */ "./src/server/constants/constants.ts");
var Player_1 = __webpack_require__(/*! ./objects/Player */ "./src/server/objects/Player.ts");
var App = (function () {
    function App() {
        this.dbConfig = {
            host: CONSTANTS.HOST,
            user: CONSTANTS.USER,
            password: CONSTANTS.DBPASSWORD,
            database: ''
        };
        this.createApp();
        this.config();
        this.createServer();
        this.Routes();
        this.sockets();
        this.listen();
        this.dbConnect();
    }
    App.prototype.createApp = function () {
        this.app = express();
    };
    App.prototype.createServer = function () {
        this.server = http_1.createServer(this.app);
    };
    App.prototype.Routes = function () {
        this.app.use(express.static('./dist/client'));
        this.app.get('/', function (req, res) {
            res.sendFile(path.resolve('./dist/client/index.html'));
            ;
        });
        this.app.use("/assets", express.static('./dist/client/assets'));
    };
    App.prototype.config = function () {
        this.port = process.env.PORT || 4001;
    };
    App.prototype.sockets = function () {
        this.io = socketIo.listen(this.server);
        ;
    };
    App.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log("\n\n===============>\t running server on port " + _this.port + "\n");
        });
        this.io.on('connect', function (socket) {
            console.log("\n\n===============>\t connected client on port " + _this.port + "\n");
            socket.on('messageFromFrontend', function (m) {
                console.log("\n\n===============>\t " + m + "\n");
                _this.io.emit('messageFromBackend', 'Hello from the backend!');
            });
            socket.on('signIn', function (signInInfo) {
                var sql = 'SELECT * FROM player WHERE username = ? AND password = ?';
                var query = _this.db.query(sql, [signInInfo.username, signInInfo.password], function (err, res) {
                    if (err) {
                        console.log(err);
                        socket.emit('errorFromBackend', err.code);
                    }
                    else if (res.length === 0) {
                        socket.emit('errorFromBackend', 'username and or password was incorrect');
                    }
                    else {
                        console.log("\n\n===============>\t Player logging in\n");
                        console.log("===============>\t username: " + signInInfo.username + "\n");
                        console.log("===============>\t password: " + signInInfo.password + "\n");
                        _this.CreatePlayer(socket, { player: res[0], isNew: false });
                    }
                });
            });
            socket.on('signUp', function (signUpInfo) {
                var postPlayer = { username: signUpInfo.username, password: signUpInfo.password };
                var sql = 'INSERT INTO player SET ?';
                var query = _this.db.query(sql, postPlayer, function (err, res) {
                    if (err) {
                        console.log(err);
                        if (err.code === 'ER_DUP_ENTRY') {
                            socket.emit('errorFromBackend', 'this username is already in use');
                        }
                        else {
                            socket.emit('errorFromBackend', err.code);
                        }
                    }
                    else {
                        var player = _this.CreatePlayer(socket, { player: { id: res.insertId }, isNew: true });
                    }
                });
            });
            socket.on('disconnect', function () {
                console.log("\n\n===============>\t client disconnected\n");
            });
        });
    };
    App.prototype.CreatePlayer = function (socket, playerInfo) {
        var player = new Player_1.Player(this.io, socket, this.db, playerInfo);
        if (playerInfo.isNew) {
            socket.emit('signedUp', { id: player.id, skills: player.skills, "class": player["class"] });
        }
        else {
            socket.emit('signedIn', { id: player.id, skills: player.skills, "class": player["class"] });
        }
    };
    App.prototype.dbConnect = function () {
        var _this = this;
        var db = mysql.createConnection(this.dbConfig);
        db.connect(function (err) {
            if (err) {
                throw err;
            }
            else {
                console.log("\n\n===============>\t mySQL connected\n");
                var sql_1 = 'CREATE DATABASE IF NOT EXISTS elevaidus';
                db.query(sql_1, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log("\n\n===============>\t database check\n");
                        db.end();
                        _this.dbConfig.database = CONSTANTS.DATABASE;
                        db = mysql.createConnection(_this.dbConfig);
                        db.connect(function (err) {
                            if (err) {
                                throw err;
                            }
                            else {
                                console.log("\n\n===============>\t " + CONSTANTS.DATABASE + " database connected\n");
                                sql_1 = "CREATE TABLE IF NOT EXISTS Player(id int AUTO_INCREMENT, username VARCHAR(30), password VARCHAR(255), class VARCHAR(30), farming int, mining int, fighting int, healing int, PRIMARY KEY (id), UNIQUE KEY username (username))";
                                db.query(sql_1, function (err, result) {
                                    if (err) {
                                        throw err;
                                    }
                                    else {
                                        console.log("\n\n===============>\t " + CONSTANTS.DATABASE + " database tables check\n");
                                    }
                                });
                                _this.db = db;
                            }
                        });
                    }
                });
            }
        });
    };
    App.PORT = 8080;
    return App;
}());
exports.App = App;


/***/ }),

/***/ "./src/server/constants/constants.ts":
/*!*******************************************!*\
  !*** ./src/server/constants/constants.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.HOST = 'localhost';
exports.USER = 'elevaidus';
exports.DBPASSWORD = 'mysqlP@$$w0rd';
exports.DATABASE = 'elevaidus';


/***/ }),

/***/ "./src/server/index.ts":
/*!*****************************!*\
  !*** ./src/server/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var app_1 = __webpack_require__(/*! ./app */ "./src/server/app.ts");
var app = new app_1.App();


/***/ }),

/***/ "./src/server/objects/Player.ts":
/*!**************************************!*\
  !*** ./src/server/objects/Player.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var classArray = [
    "farmer",
    "knight",
    "priest",
    "miner"
];
var Player = (function () {
    function Player(io, socket, db, playerInfo) {
        this.io = io;
        this.socket = socket;
        this.db = db;
        this.skills = new Skills();
        this.id = playerInfo.player.id;
        if (playerInfo.isNew) {
            this.CreateNewPlayer();
        }
        else {
            this.SetPlayerInfo(playerInfo.player);
        }
    }
    Player.prototype.SetPlayerInfo = function (playerInfo) {
        this.skills.SetSkills(playerInfo);
        this["class"] = playerInfo["class"];
    };
    Player.prototype.CreateNewPlayer = function () {
        this.GenerateClass();
        this.GenerateSkills();
        this.saveInDatabase();
    };
    Player.prototype.GenerateClass = function () {
        var randomNumber = Math.floor(Math.random() * classArray.length);
        this["class"] = classArray[randomNumber];
    };
    ;
    Player.prototype.GenerateSkills = function () {
        this.skills.GenerateRandomSkills();
        if (this["class"] === "farmer") {
            this.skills.farming += 25;
        }
        else if (this["class"] === 'knight') {
            this.skills.fighting += 25;
        }
        else if (this["class"] === 'priest') {
            this.skills.healing += 25;
        }
        else if (this["class"] === 'miner') {
            this.skills.mining += 25;
        }
    };
    Player.prototype.saveInDatabase = function () {
        var _this = this;
        var sql = 'UPDATE player SET class = ?, farming = ?, mining = ?, healing = ?, fighting = ? WHERE id = ?';
        this.db.query(sql, [this["class"], this.skills.farming, this.skills.mining, this.skills.healing, this.skills.fighting, this.id], function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("\n\n===============>\t Player " + _this.id + " updated in database \n");
            }
        });
    };
    Player.prototype.PlayerUpdate = function (data) {
    };
    return Player;
}());
exports.Player = Player;
var Skills = (function () {
    function Skills() {
    }
    Skills.prototype.SetSkills = function (playerInfo) {
        this.farming = playerInfo.farming;
        this.mining = playerInfo.mining;
        this.healing = playerInfo.healing;
        this.fighting = playerInfo.fighting;
    };
    Skills.prototype.GenerateRandomSkills = function () {
        this.farming = Math.floor(Math.random() * 26);
        this.mining = Math.floor(Math.random() * 26);
        this.healing = Math.floor(Math.random() * 26);
        this.fighting = Math.floor(Math.random() * 26);
    };
    return Skills;
}());


/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "mysql":
/*!************************!*\
  !*** external "mysql" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mysql");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map