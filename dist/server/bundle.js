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

/***/ "./src/server/Constants/constants.ts":
/*!*******************************************!*\
  !*** ./src/server/Constants/constants.ts ***!
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
var CONSTANTS = __webpack_require__(/*! ./Constants/constants */ "./src/server/Constants/constants.ts");
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
            socket.on('disconnect', function () {
                console.log("\n\n===============>\t client disconnected\n");
            });
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci9Db25zdGFudHMvY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2ZXIvYXBwLnRzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJteXNxbFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb2NrZXQuaW9cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ0xhO0FBQ2I7QUFDQTtBQUNBLFlBQVksbUJBQU8sQ0FBQyxvQkFBTztBQUMzQixhQUFhLG1CQUFPLENBQUMsa0JBQU07QUFDM0IsY0FBYyxtQkFBTyxDQUFDLHdCQUFTO0FBQy9CLGVBQWUsbUJBQU8sQ0FBQyw0QkFBVztBQUNsQyxXQUFXLG1CQUFPLENBQUMsa0JBQU07QUFDekIsZ0JBQWdCLG1CQUFPLENBQUMsa0VBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOzs7Ozs7Ozs7Ozs7O0FDM0dhO0FBQ2I7QUFDQSxZQUFZLG1CQUFPLENBQUMsa0NBQU87QUFDM0I7Ozs7Ozs7Ozs7OztBQ0hBLG9DOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHNDIiwiZmlsZSI6Ii4vc2VydmVyL2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3NlcnZlci9pbmRleC50c1wiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzLkhPU1QgPSAnbG9jYWxob3N0JztcclxuZXhwb3J0cy5VU0VSID0gJ2VsZXZhaWR1cyc7XHJcbmV4cG9ydHMuREJQQVNTV09SRCA9ICdteXNxbFBAJCR3MHJkJztcclxuZXhwb3J0cy5EQVRBQkFTRSA9ICdlbGV2YWlkdXMnO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IGFwcCBzdGFydGluZ1xcblwiKTtcclxudmFyIG15c3FsID0gcmVxdWlyZShcIm15c3FsXCIpO1xyXG52YXIgaHR0cF8xID0gcmVxdWlyZShcImh0dHBcIik7XHJcbnZhciBleHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XHJcbnZhciBzb2NrZXRJbyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7XHJcbnZhciBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XHJcbnZhciBDT05TVEFOVFMgPSByZXF1aXJlKFwiLi9Db25zdGFudHMvY29uc3RhbnRzXCIpO1xyXG52YXIgQXBwID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEFwcCgpIHtcclxuICAgICAgICB0aGlzLmRiQ29uZmlnID0ge1xyXG4gICAgICAgICAgICBob3N0OiBDT05TVEFOVFMuSE9TVCxcclxuICAgICAgICAgICAgdXNlcjogQ09OU1RBTlRTLlVTRVIsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBDT05TVEFOVFMuREJQQVNTV09SRCxcclxuICAgICAgICAgICAgZGF0YWJhc2U6ICcnXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUFwcCgpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVTZXJ2ZXIoKTtcclxuICAgICAgICB0aGlzLlJvdXRlcygpO1xyXG4gICAgICAgIHRoaXMuc29ja2V0cygpO1xyXG4gICAgICAgIHRoaXMubGlzdGVuKCk7XHJcbiAgICAgICAgdGhpcy5kYkNvbm5lY3QoKTtcclxuICAgIH1cclxuICAgIEFwcC5wcm90b3R5cGUuY3JlYXRlQXBwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYXBwID0gZXhwcmVzcygpO1xyXG4gICAgfTtcclxuICAgIEFwcC5wcm90b3R5cGUuY3JlYXRlU2VydmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc2VydmVyID0gaHR0cF8xLmNyZWF0ZVNlcnZlcih0aGlzLmFwcCk7XHJcbiAgICB9O1xyXG4gICAgQXBwLnByb3RvdHlwZS5Sb3V0ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5hcHAudXNlKGV4cHJlc3Muc3RhdGljKCcuL2Rpc3QvY2xpZW50JykpO1xyXG4gICAgICAgIHRoaXMuYXBwLmdldCgnLycsIGZ1bmN0aW9uIChyZXEsIHJlcykge1xyXG4gICAgICAgICAgICByZXMuc2VuZEZpbGUocGF0aC5yZXNvbHZlKCcuL2Rpc3QvY2xpZW50L2luZGV4Lmh0bWwnKSk7XHJcbiAgICAgICAgICAgIDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFwcC51c2UoXCIvYXNzZXRzXCIsIGV4cHJlc3Muc3RhdGljKCcuL2Rpc3QvY2xpZW50L2Fzc2V0cycpKTtcclxuICAgIH07XHJcbiAgICBBcHAucHJvdG90eXBlLmNvbmZpZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDQwMDE7XHJcbiAgICB9O1xyXG4gICAgQXBwLnByb3RvdHlwZS5zb2NrZXRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuaW8gPSBzb2NrZXRJby5saXN0ZW4odGhpcy5zZXJ2ZXIpO1xyXG4gICAgICAgIDtcclxuICAgIH07XHJcbiAgICBBcHAucHJvdG90eXBlLmxpc3RlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc2VydmVyLmxpc3Rlbih0aGlzLnBvcnQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IHJ1bm5pbmcgc2VydmVyIG9uIHBvcnQgXCIgKyBfdGhpcy5wb3J0ICsgXCJcXG5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pby5vbignY29ubmVjdCcsIGZ1bmN0aW9uIChzb2NrZXQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IGNvbm5lY3RlZCBjbGllbnQgb24gcG9ydCBcIiArIF90aGlzLnBvcnQgKyBcIlxcblwiKTtcclxuICAgICAgICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlRnJvbUZyb250ZW5kJywgZnVuY3Rpb24gKG0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuPT09PT09PT09PT09PT09PlxcdCBcIiArIG0gKyBcIlxcblwiKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmlvLmVtaXQoJ21lc3NhZ2VGcm9tQmFja2VuZCcsICdIZWxsbyBmcm9tIHRoZSBiYWNrZW5kIScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IGNsaWVudCBkaXNjb25uZWN0ZWRcXG5cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIEFwcC5wcm90b3R5cGUuZGJDb25uZWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRiID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih0aGlzLmRiQ29uZmlnKTtcclxuICAgICAgICBkYi5jb25uZWN0KGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IG15U1FMIGNvbm5lY3RlZFxcblwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBzcWxfMSA9ICdDUkVBVEUgREFUQUJBU0UgSUYgTk9UIEVYSVNUUyBlbGV2YWlkdXMnO1xyXG4gICAgICAgICAgICAgICAgZGIucXVlcnkoc3FsXzEsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IGRhdGFiYXNlIGNoZWNrXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYi5lbmQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGJDb25maWcuZGF0YWJhc2UgPSBDT05TVEFOVFMuREFUQUJBU0U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbihfdGhpcy5kYkNvbmZpZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNvbm5lY3QoZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuPT09PT09PT09PT09PT09PlxcdCBcIiArIENPTlNUQU5UUy5EQVRBQkFTRSArIFwiIGRhdGFiYXNlIGNvbm5lY3RlZFxcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcWxfMSA9IFwiQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgUGxheWVyKGlkIGludCBBVVRPX0lOQ1JFTUVOVCwgZW1haWwgVkFSQ0hBUigyNTUpLCB1c2VybmFtZSBWQVJDSEFSKDMwKSwgcGFzc3dvcmQgVkFSQ0hBUigyNTUpLCBQUklNQVJZIEtFWSAoaWQpLCBVTklRVUUgS0VZIGVtYWlsIChlbWFpbCkpXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGIucXVlcnkoc3FsXzEsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblxcbj09PT09PT09PT09PT09PT5cXHQgXCIgKyBDT05TVEFOVFMuREFUQUJBU0UgKyBcIiBkYXRhYmFzZSB0YWJsZXMgY2hlY2tcXG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmRiID0gZGI7XHJcbiAgICB9O1xyXG4gICAgQXBwLlBPUlQgPSA4MDgwO1xyXG4gICAgcmV0dXJuIEFwcDtcclxufSgpKTtcclxuZXhwb3J0cy5BcHAgPSBBcHA7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG52YXIgYXBwXzEgPSByZXF1aXJlKFwiLi9hcHBcIik7XHJcbnZhciBhcHAgPSBuZXcgYXBwXzEuQXBwKCk7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJteXNxbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTsiXSwic291cmNlUm9vdCI6IiJ9