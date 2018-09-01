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
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/Constants/constants.ts":
/*!***************************************!*\
  !*** ./server/Constants/constants.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.HOST = 'localhost';
exports.USER = 'elevaidus';
exports.DBPASSWORD = 'mysqlP@$$w0rd';
exports.DATABASE = 'elevaidus';


/***/ }),

/***/ "./server/app.ts":
/*!***********************!*\
  !*** ./server/app.ts ***!
  \***********************/
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
var CONSTANTS = __webpack_require__(/*! ./Constants/constants */ "./server/Constants/constants.ts");
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
        this.app.get('/', function (req, res) {
            res.sendFile(path.resolve('./dist/client/index.html'));
        });
        this.app.use(express.static('./dist/client'));
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

/***/ "./server/index.ts":
/*!*************************!*\
  !*** ./server/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var app_1 = __webpack_require__(/*! ./app */ "./server/app.ts");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL0NvbnN0YW50cy9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJteXNxbFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb2NrZXQuaW9cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ0xhO0FBQ2I7QUFDQTtBQUNBLFlBQVksbUJBQU8sQ0FBQyxvQkFBTztBQUMzQixhQUFhLG1CQUFPLENBQUMsa0JBQU07QUFDM0IsY0FBYyxtQkFBTyxDQUFDLHdCQUFTO0FBQy9CLGVBQWUsbUJBQU8sQ0FBQyw0QkFBVztBQUNsQyxXQUFXLG1CQUFPLENBQUMsa0JBQU07QUFDekIsZ0JBQWdCLG1CQUFPLENBQUMsOERBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQSx5QkFBeUI7QUFDekI7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7QUN6R2E7QUFDYjtBQUNBLFlBQVksbUJBQU8sQ0FBQyw4QkFBTztBQUMzQjs7Ozs7Ozs7Ozs7O0FDSEEsb0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsc0MiLCJmaWxlIjoiLi9zZXJ2ZXIvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zZXJ2ZXIvaW5kZXgudHNcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5IT1NUID0gJ2xvY2FsaG9zdCc7XHJcbmV4cG9ydHMuVVNFUiA9ICdlbGV2YWlkdXMnO1xyXG5leHBvcnRzLkRCUEFTU1dPUkQgPSAnbXlzcWxQQCQkdzByZCc7XHJcbmV4cG9ydHMuREFUQUJBU0UgPSAnZWxldmFpZHVzJztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmNvbnNvbGUubG9nKFwiXFxuXFxuPT09PT09PT09PT09PT09PlxcdCBhcHAgc3RhcnRpbmdcXG5cIik7XHJcbnZhciBteXNxbCA9IHJlcXVpcmUoXCJteXNxbFwiKTtcclxudmFyIGh0dHBfMSA9IHJlcXVpcmUoXCJodHRwXCIpO1xyXG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xyXG52YXIgc29ja2V0SW8gPSByZXF1aXJlKFwic29ja2V0LmlvXCIpO1xyXG52YXIgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG52YXIgQ09OU1RBTlRTID0gcmVxdWlyZShcIi4vQ29uc3RhbnRzL2NvbnN0YW50c1wiKTtcclxudmFyIEFwcCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBBcHAoKSB7XHJcbiAgICAgICAgdGhpcy5kYkNvbmZpZyA9IHtcclxuICAgICAgICAgICAgaG9zdDogQ09OU1RBTlRTLkhPU1QsXHJcbiAgICAgICAgICAgIHVzZXI6IENPTlNUQU5UUy5VU0VSLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogQ09OU1RBTlRTLkRCUEFTU1dPUkQsXHJcbiAgICAgICAgICAgIGRhdGFiYXNlOiAnJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jcmVhdGVBcHAoKTtcclxuICAgICAgICB0aGlzLmNvbmZpZygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlU2VydmVyKCk7XHJcbiAgICAgICAgdGhpcy5Sb3V0ZXMoKTtcclxuICAgICAgICB0aGlzLnNvY2tldHMoKTtcclxuICAgICAgICB0aGlzLmxpc3RlbigpO1xyXG4gICAgICAgIHRoaXMuZGJDb25uZWN0KCk7XHJcbiAgICB9XHJcbiAgICBBcHAucHJvdG90eXBlLmNyZWF0ZUFwcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmFwcCA9IGV4cHJlc3MoKTtcclxuICAgIH07XHJcbiAgICBBcHAucHJvdG90eXBlLmNyZWF0ZVNlcnZlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnNlcnZlciA9IGh0dHBfMS5jcmVhdGVTZXJ2ZXIodGhpcy5hcHApO1xyXG4gICAgfTtcclxuICAgIEFwcC5wcm90b3R5cGUuUm91dGVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYXBwLmdldCgnLycsIGZ1bmN0aW9uIChyZXEsIHJlcykge1xyXG4gICAgICAgICAgICByZXMuc2VuZEZpbGUocGF0aC5yZXNvbHZlKCcuL2Rpc3QvY2xpZW50L2luZGV4Lmh0bWwnKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hcHAudXNlKGV4cHJlc3Muc3RhdGljKCcuL2Rpc3QvY2xpZW50JykpO1xyXG4gICAgfTtcclxuICAgIEFwcC5wcm90b3R5cGUuY29uZmlnID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgNDAwMTtcclxuICAgIH07XHJcbiAgICBBcHAucHJvdG90eXBlLnNvY2tldHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5pbyA9IHNvY2tldElvLmxpc3Rlbih0aGlzLnNlcnZlcik7XHJcbiAgICAgICAgO1xyXG4gICAgfTtcclxuICAgIEFwcC5wcm90b3R5cGUubGlzdGVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zZXJ2ZXIubGlzdGVuKHRoaXMucG9ydCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblxcbj09PT09PT09PT09PT09PT5cXHQgcnVubmluZyBzZXJ2ZXIgb24gcG9ydCBcIiArIF90aGlzLnBvcnQgKyBcIlxcblwiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmlvLm9uKCdjb25uZWN0JywgZnVuY3Rpb24gKHNvY2tldCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblxcbj09PT09PT09PT09PT09PT5cXHQgY29ubmVjdGVkIGNsaWVudCBvbiBwb3J0IFwiICsgX3RoaXMucG9ydCArIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICBzb2NrZXQub24oJ21lc3NhZ2VGcm9tRnJvbnRlbmQnLCBmdW5jdGlvbiAobSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IFwiICsgbSArIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuaW8uZW1pdCgnbWVzc2FnZUZyb21CYWNrZW5kJywgJ0hlbGxvIGZyb20gdGhlIGJhY2tlbmQhJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblxcbj09PT09PT09PT09PT09PT5cXHQgY2xpZW50IGRpc2Nvbm5lY3RlZFxcblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgQXBwLnByb3RvdHlwZS5kYkNvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgZGIgPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHRoaXMuZGJDb25maWcpO1xyXG4gICAgICAgIGRiLmNvbm5lY3QoZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblxcbj09PT09PT09PT09PT09PT5cXHQgbXlTUUwgY29ubmVjdGVkXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNxbF8xID0gJ0NSRUFURSBEQVRBQkFTRSBJRiBOT1QgRVhJU1RTIGVsZXZhaWR1cyc7XHJcbiAgICAgICAgICAgICAgICBkYi5xdWVyeShzcWxfMSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblxcbj09PT09PT09PT09PT09PT5cXHQgZGF0YWJhc2UgY2hlY2tcXG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmVuZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5kYkNvbmZpZy5kYXRhYmFzZSA9IENPTlNUQU5UUy5EQVRBQkFTRTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIgPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKF90aGlzLmRiQ29uZmlnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIuY29ubmVjdChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cXG49PT09PT09PT09PT09PT0+XFx0IFwiICsgQ09OU1RBTlRTLkRBVEFCQVNFICsgXCIgZGF0YWJhc2UgY29ubmVjdGVkXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNxbF8xID0gXCJDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBQbGF5ZXIoaWQgaW50IEFVVE9fSU5DUkVNRU5ULCBlbWFpbCBWQVJDSEFSKDI1NSksIHVzZXJuYW1lIFZBUkNIQVIoMzApLCBwYXNzd29yZCBWQVJDSEFSKDI1NSksIFBSSU1BUlkgS0VZIChpZCksIFVOSVFVRSBLRVkgZW1haWwgKGVtYWlsKSlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYi5xdWVyeShzcWxfMSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuPT09PT09PT09PT09PT09PlxcdCBcIiArIENPTlNUQU5UUy5EQVRBQkFTRSArIFwiIGRhdGFiYXNlIHRhYmxlcyBjaGVja1xcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGIgPSBkYjtcclxuICAgIH07XHJcbiAgICBBcHAuUE9SVCA9IDgwODA7XHJcbiAgICByZXR1cm4gQXBwO1xyXG59KCkpO1xyXG5leHBvcnRzLkFwcCA9IEFwcDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbnZhciBhcHBfMSA9IHJlcXVpcmUoXCIuL2FwcFwiKTtcclxudmFyIGFwcCA9IG5ldyBhcHBfMS5BcHAoKTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm15c3FsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=