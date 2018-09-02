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
                console.log("\n\n===============>\t Player logging in\n");
                console.log("===============>\t username: " + signInInfo.username + "\n");
                console.log("===============>\t password: " + signInInfo.password + "\n");
                _this.CreatePlayer(socket, true, 1);
            });
            _this.CreatePlayer(socket, true, 1);
            socket.on('disconnect', function () {
                console.log("\n\n===============>\t client disconnected\n");
            });
        });
    };
    App.prototype.CreatePlayer = function (socket, isNew, id) {
        var playerInfo = {
            isNew: isNew,
            id: id
        };
        var player = new Player_1.Player(this.io, socket, this.db, playerInfo);
        socket.emit('signedIn', { skills: player.skills });
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
                                sql_1 = "CREATE TABLE IF NOT EXISTS Player(id int AUTO_INCREMENT, email VARCHAR(255), username VARCHAR(30), password VARCHAR(255), PRIMARY KEY (id), UNIQUE KEY email (email))";
                                db.query(sql_1, function (err, result) {
                                    if (err) {
                                        throw err;
                                    }
                                    else {
                                        console.log("\n\n===============>\t " + CONSTANTS.DATABASE + " database tables check\n");
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        this.db = db;
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
var Player = (function () {
    function Player(io, socket, db, playerInfo) {
        this.io = io;
        this.socket = socket;
        this.db = db;
        this.skills = new Skills();
        if (playerInfo.isNew) {
            this.CreateNewPlayer();
        }
        else {
            this.GetPlayerInfoFromDB(playerInfo.id);
        }
    }
    Player.prototype.GetPlayerInfoFromDB = function (id) {
    };
    Player.prototype.CreateNewPlayer = function () {
        this.GenerateClass();
        this.GenerateSkills();
        this.saveInDatabase();
    };
    Player.prototype.GenerateClass = function () {
        this["class"] = "farmer";
    };
    ;
    Player.prototype.GenerateSkills = function () {
        if (this["class"] === "farmer") {
            this.skills.farming += 25;
        }
        else if (this["class"] === 'knight') {
        }
    };
    Player.prototype.saveInDatabase = function () {
    };
    Player.prototype.PlayerUpdate = function (data) {
    };
    return Player;
}());
exports.Player = Player;
var Skills = (function () {
    function Skills() {
        this.GenerateRandomSkills();
    }
    Skills.prototype.GenerateRandomSkills = function () {
        this.farming = Math.floor(Math.random() * 26);
        this.mining = Math.floor(Math.random() * 26);
        this.healing = Math.floor(Math.random() * 26);
        this.fighting = Math.floor(Math.random() * 26);
        this.trading = Math.floor(Math.random() * 26);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci9hcHAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci9jb25zdGFudHMvY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci9vYmplY3RzL1BsYXllci50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm15c3FsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRmE7QUFDYjtBQUNBO0FBQ0EsWUFBWSxtQkFBTyxDQUFDLG9CQUFPO0FBQzNCLGFBQWEsbUJBQU8sQ0FBQyxrQkFBTTtBQUMzQixjQUFjLG1CQUFPLENBQUMsd0JBQVM7QUFDL0IsZUFBZSxtQkFBTyxDQUFDLDRCQUFXO0FBQ2xDLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixnQkFBZ0IsbUJBQU8sQ0FBQyxrRUFBdUI7QUFDL0MsZUFBZSxtQkFBTyxDQUFDLHdEQUFrQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsd0JBQXdCO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOzs7Ozs7Ozs7Ozs7O0FDM0hhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ0xhO0FBQ2I7QUFDQSxZQUFZLG1CQUFPLENBQUMsa0NBQU87QUFDM0I7Ozs7Ozs7Ozs7Ozs7QUNIYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7O0FDcERELG9DOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHNDIiwiZmlsZSI6Ii4vc2VydmVyL2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3NlcnZlci9pbmRleC50c1wiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5jb25zb2xlLmxvZyhcIlxcblxcbj09PT09PT09PT09PT09PT5cXHQgYXBwIHN0YXJ0aW5nXFxuXCIpO1xyXG52YXIgbXlzcWwgPSByZXF1aXJlKFwibXlzcWxcIik7XHJcbnZhciBodHRwXzEgPSByZXF1aXJlKFwiaHR0cFwiKTtcclxudmFyIGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcclxudmFyIHNvY2tldElvID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTtcclxudmFyIHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcclxudmFyIENPTlNUQU5UUyA9IHJlcXVpcmUoXCIuL2NvbnN0YW50cy9jb25zdGFudHNcIik7XHJcbnZhciBQbGF5ZXJfMSA9IHJlcXVpcmUoXCIuL29iamVjdHMvUGxheWVyXCIpO1xyXG52YXIgQXBwID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEFwcCgpIHtcclxuICAgICAgICB0aGlzLmRiQ29uZmlnID0ge1xyXG4gICAgICAgICAgICBob3N0OiBDT05TVEFOVFMuSE9TVCxcclxuICAgICAgICAgICAgdXNlcjogQ09OU1RBTlRTLlVTRVIsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBDT05TVEFOVFMuREJQQVNTV09SRCxcclxuICAgICAgICAgICAgZGF0YWJhc2U6ICcnXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUFwcCgpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVTZXJ2ZXIoKTtcclxuICAgICAgICB0aGlzLlJvdXRlcygpO1xyXG4gICAgICAgIHRoaXMuc29ja2V0cygpO1xyXG4gICAgICAgIHRoaXMubGlzdGVuKCk7XHJcbiAgICAgICAgdGhpcy5kYkNvbm5lY3QoKTtcclxuICAgIH1cclxuICAgIEFwcC5wcm90b3R5cGUuY3JlYXRlQXBwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYXBwID0gZXhwcmVzcygpO1xyXG4gICAgfTtcclxuICAgIEFwcC5wcm90b3R5cGUuY3JlYXRlU2VydmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc2VydmVyID0gaHR0cF8xLmNyZWF0ZVNlcnZlcih0aGlzLmFwcCk7XHJcbiAgICB9O1xyXG4gICAgQXBwLnByb3RvdHlwZS5Sb3V0ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5hcHAudXNlKGV4cHJlc3Muc3RhdGljKCcuL2Rpc3QvY2xpZW50JykpO1xyXG4gICAgICAgIHRoaXMuYXBwLmdldCgnLycsIGZ1bmN0aW9uIChyZXEsIHJlcykge1xyXG4gICAgICAgICAgICByZXMuc2VuZEZpbGUocGF0aC5yZXNvbHZlKCcuL2Rpc3QvY2xpZW50L2luZGV4Lmh0bWwnKSk7XHJcbiAgICAgICAgICAgIDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFwcC51c2UoXCIvYXNzZXRzXCIsIGV4cHJlc3Muc3RhdGljKCcuL2Rpc3QvY2xpZW50L2Fzc2V0cycpKTtcclxuICAgIH07XHJcbiAgICBBcHAucHJvdG90eXBlLmNvbmZpZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDQwMDE7XHJcbiAgICB9O1xyXG4gICAgQXBwLnByb3RvdHlwZS5zb2NrZXRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuaW8gPSBzb2NrZXRJby5saXN0ZW4odGhpcy5zZXJ2ZXIpO1xyXG4gICAgICAgIDtcclxuICAgIH07XHJcbiAgICBBcHAucHJvdG90eXBlLmxpc3RlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc2VydmVyLmxpc3Rlbih0aGlzLnBvcnQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IHJ1bm5pbmcgc2VydmVyIG9uIHBvcnQgXCIgKyBfdGhpcy5wb3J0ICsgXCJcXG5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pby5vbignY29ubmVjdCcsIGZ1bmN0aW9uIChzb2NrZXQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IGNvbm5lY3RlZCBjbGllbnQgb24gcG9ydCBcIiArIF90aGlzLnBvcnQgKyBcIlxcblwiKTtcclxuICAgICAgICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlRnJvbUZyb250ZW5kJywgZnVuY3Rpb24gKG0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuPT09PT09PT09PT09PT09PlxcdCBcIiArIG0gKyBcIlxcblwiKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmlvLmVtaXQoJ21lc3NhZ2VGcm9tQmFja2VuZCcsICdIZWxsbyBmcm9tIHRoZSBiYWNrZW5kIScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc29ja2V0Lm9uKCdzaWduSW4nLCBmdW5jdGlvbiAoc2lnbkluSW5mbykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IFBsYXllciBsb2dnaW5nIGluXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09PT0+XFx0IHVzZXJuYW1lOiBcIiArIHNpZ25JbkluZm8udXNlcm5hbWUgKyBcIlxcblwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PT09PlxcdCBwYXNzd29yZDogXCIgKyBzaWduSW5JbmZvLnBhc3N3b3JkICsgXCJcXG5cIik7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5DcmVhdGVQbGF5ZXIoc29ja2V0LCB0cnVlLCAxKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIF90aGlzLkNyZWF0ZVBsYXllcihzb2NrZXQsIHRydWUsIDEpO1xyXG4gICAgICAgICAgICBzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblxcbj09PT09PT09PT09PT09PT5cXHQgY2xpZW50IGRpc2Nvbm5lY3RlZFxcblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgQXBwLnByb3RvdHlwZS5DcmVhdGVQbGF5ZXIgPSBmdW5jdGlvbiAoc29ja2V0LCBpc05ldywgaWQpIHtcclxuICAgICAgICB2YXIgcGxheWVySW5mbyA9IHtcclxuICAgICAgICAgICAgaXNOZXc6IGlzTmV3LFxyXG4gICAgICAgICAgICBpZDogaWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBwbGF5ZXIgPSBuZXcgUGxheWVyXzEuUGxheWVyKHRoaXMuaW8sIHNvY2tldCwgdGhpcy5kYiwgcGxheWVySW5mbyk7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoJ3NpZ25lZEluJywgeyBza2lsbHM6IHBsYXllci5za2lsbHMgfSk7XHJcbiAgICB9O1xyXG4gICAgQXBwLnByb3RvdHlwZS5kYkNvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgZGIgPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHRoaXMuZGJDb25maWcpO1xyXG4gICAgICAgIGRiLmNvbm5lY3QoZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblxcbj09PT09PT09PT09PT09PT5cXHQgbXlTUUwgY29ubmVjdGVkXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNxbF8xID0gJ0NSRUFURSBEQVRBQkFTRSBJRiBOT1QgRVhJU1RTIGVsZXZhaWR1cyc7XHJcbiAgICAgICAgICAgICAgICBkYi5xdWVyeShzcWxfMSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblxcbj09PT09PT09PT09PT09PT5cXHQgZGF0YWJhc2UgY2hlY2tcXG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmVuZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5kYkNvbmZpZy5kYXRhYmFzZSA9IENPTlNUQU5UUy5EQVRBQkFTRTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIgPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKF90aGlzLmRiQ29uZmlnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIuY29ubmVjdChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IFwiICsgQ09OU1RBTlRTLkRBVEFCQVNFICsgXCIgZGF0YWJhc2UgY29ubmVjdGVkXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNxbF8xID0gXCJDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBQbGF5ZXIoaWQgaW50IEFVVE9fSU5DUkVNRU5ULCBlbWFpbCBWQVJDSEFSKDI1NSksIHVzZXJuYW1lIFZBUkNIQVIoMzApLCBwYXNzd29yZCBWQVJDSEFSKDI1NSksIFBSSU1BUlkgS0VZIChpZCksIFVOSVFVRSBLRVkgZW1haWwgKGVtYWlsKSlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYi5xdWVyeShzcWxfMSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuPT09PT09PT09PT09PT09PlxcdCBcIiArIENPTlNUQU5UUy5EQVRBQkFTRSArIFwiIGRhdGFiYXNlIHRhYmxlcyBjaGVja1xcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGIgPSBkYjtcclxuICAgIH07XHJcbiAgICBBcHAuUE9SVCA9IDgwODA7XHJcbiAgICByZXR1cm4gQXBwO1xyXG59KCkpO1xyXG5leHBvcnRzLkFwcCA9IEFwcDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMuSE9TVCA9ICdsb2NhbGhvc3QnO1xyXG5leHBvcnRzLlVTRVIgPSAnZWxldmFpZHVzJztcclxuZXhwb3J0cy5EQlBBU1NXT1JEID0gJ215c3FsUEAkJHcwcmQnO1xyXG5leHBvcnRzLkRBVEFCQVNFID0gJ2VsZXZhaWR1cyc7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG52YXIgYXBwXzEgPSByZXF1aXJlKFwiLi9hcHBcIik7XHJcbnZhciBhcHAgPSBuZXcgYXBwXzEuQXBwKCk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG52YXIgUGxheWVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBsYXllcihpbywgc29ja2V0LCBkYiwgcGxheWVySW5mbykge1xyXG4gICAgICAgIHRoaXMuaW8gPSBpbztcclxuICAgICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcclxuICAgICAgICB0aGlzLmRiID0gZGI7XHJcbiAgICAgICAgdGhpcy5za2lsbHMgPSBuZXcgU2tpbGxzKCk7XHJcbiAgICAgICAgaWYgKHBsYXllckluZm8uaXNOZXcpIHtcclxuICAgICAgICAgICAgdGhpcy5DcmVhdGVOZXdQbGF5ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuR2V0UGxheWVySW5mb0Zyb21EQihwbGF5ZXJJbmZvLmlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBQbGF5ZXIucHJvdG90eXBlLkdldFBsYXllckluZm9Gcm9tREIgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIH07XHJcbiAgICBQbGF5ZXIucHJvdG90eXBlLkNyZWF0ZU5ld1BsYXllciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLkdlbmVyYXRlQ2xhc3MoKTtcclxuICAgICAgICB0aGlzLkdlbmVyYXRlU2tpbGxzKCk7XHJcbiAgICAgICAgdGhpcy5zYXZlSW5EYXRhYmFzZSgpO1xyXG4gICAgfTtcclxuICAgIFBsYXllci5wcm90b3R5cGUuR2VuZXJhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzW1wiY2xhc3NcIl0gPSBcImZhcm1lclwiO1xyXG4gICAgfTtcclxuICAgIDtcclxuICAgIFBsYXllci5wcm90b3R5cGUuR2VuZXJhdGVTa2lsbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXNbXCJjbGFzc1wiXSA9PT0gXCJmYXJtZXJcIikge1xyXG4gICAgICAgICAgICB0aGlzLnNraWxscy5mYXJtaW5nICs9IDI1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzW1wiY2xhc3NcIl0gPT09ICdrbmlnaHQnKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBsYXllci5wcm90b3R5cGUuc2F2ZUluRGF0YWJhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB9O1xyXG4gICAgUGxheWVyLnByb3RvdHlwZS5QbGF5ZXJVcGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQbGF5ZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuUGxheWVyID0gUGxheWVyO1xyXG52YXIgU2tpbGxzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFNraWxscygpIHtcclxuICAgICAgICB0aGlzLkdlbmVyYXRlUmFuZG9tU2tpbGxzKCk7XHJcbiAgICB9XHJcbiAgICBTa2lsbHMucHJvdG90eXBlLkdlbmVyYXRlUmFuZG9tU2tpbGxzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZmFybWluZyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI2KTtcclxuICAgICAgICB0aGlzLm1pbmluZyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI2KTtcclxuICAgICAgICB0aGlzLmhlYWxpbmcgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNik7XHJcbiAgICAgICAgdGhpcy5maWdodGluZyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI2KTtcclxuICAgICAgICB0aGlzLnRyYWRpbmcgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNraWxscztcclxufSgpKTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm15c3FsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=