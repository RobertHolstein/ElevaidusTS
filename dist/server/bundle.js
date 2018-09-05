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

Object.defineProperty(exports, "__esModule", { value: true });
console.log("\n\n===============>\t app starting\n");
var const_1 = __webpack_require__(/*! ../shared/const */ "./src/shared/const.ts");
var const_2 = __webpack_require__(/*! ./const/const */ "./src/server/const/const.ts");
var mysql = __webpack_require__(/*! mysql */ "mysql");
var http_1 = __webpack_require__(/*! http */ "http");
var express = __webpack_require__(/*! express */ "express");
var socketIo = __webpack_require__(/*! socket.io */ "socket.io");
var path = __webpack_require__(/*! path */ "path");
var Player_1 = __webpack_require__(/*! ./objects/Player */ "./src/server/objects/Player.ts");
var App = (function () {
    function App() {
        this.dbConfig = {
            host: const_2.CONST.HOST,
            user: const_2.CONST.DBUSER,
            password: const_2.CONST.DBPASSWORD,
            database: const_2.CONST.DATABASE
        };
        this.createApp();
        this.config();
        this.createServer();
        this.Routes();
        this.sockets();
        this.listen();
        this.CreateZones();
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
    App.prototype.CreateZones = function () {
        this.zones = [];
        for (var i = 0; i < const_1.SHARED.ZONELTRS.length; i++) {
            this.zones[i] = [];
            for (var j = 1; j < 6; j++) {
                this.zones[i][j] = { name: "" + const_1.SHARED.ZONELTRS[i] + j.toString() };
            }
        }
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
    };
    App.prototype.dbConnect = function () {
        var _this = this;
        var db = mysql.createConnection(this.dbConfig);
        db.connect(function (err) {
            if (err) {
                throw err;
            }
            else {
                console.log("\n\n===============>\t " + const_2.CONST.DATABASE + " database connected\n");
                var sql = "CREATE TABLE IF NOT EXISTS Player(id int AUTO_INCREMENT, username VARCHAR(30), password VARCHAR(255), zone VARCHAR(30), health int, class VARCHAR(30), farming int, mining int, fighting int, healing int, PRIMARY KEY (id), UNIQUE KEY username (username))";
                db.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log("\n\n===============>\t " + const_2.CONST.DATABASE + " database tables check\n");
                    }
                });
                _this.db = db;
            }
        });
        db.on('error', function (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                db.connect();
            }
            else {
                throw err;
            }
        });
    };
    App.PORT = 8080;
    return App;
}());
exports.App = App;


/***/ }),

/***/ "./src/server/const/const.ts":
/*!***********************************!*\
  !*** ./src/server/const/const.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CONST = {
    HOST: 'us-cdbr-iron-east-01.cleardb.net',
    DBUSER: 'b07173e9b72118',
    DBPASSWORD: '45517a09',
    DATABASE: 'heroku_4d115db42117719',
    STARTINGZONE: 'a1',
    STARTINGHEALTH: 100,
    SKILLS: [
        'farming',
        'mining',
        'healing',
        'fighting'
    ]
};


/***/ }),

/***/ "./src/server/index.ts":
/*!*****************************!*\
  !*** ./src/server/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(/*! ../const/const */ "./src/server/const/const.ts");
var Skill_1 = __webpack_require__(/*! ./Skill */ "./src/server/objects/Skill.ts");
var playerClasses = new Array();
var Player = (function () {
    function Player(io, socket, db, playerInfo) {
        this.io = io;
        this.socket = socket;
        this.db = db;
        this.skills = Skill_1.GetSkills();
        this.id = playerInfo.player.id;
        if (playerInfo.isNew) {
            this.CreateNewPlayer();
        }
        else {
            this.SetPlayerInfo(playerInfo.player);
        }
    }
    Player.prototype.SetPlayerInfo = function (playerInfo) {
        this.SetSkills(playerInfo);
        this.class = playerInfo.class;
        this.zone = playerInfo.zone;
        this.health = playerInfo.health;
        this.socket.emit('signedIn', {
            id: this.id, skills: this.skills, class: this.class, zone: this.zone, health: this.health
        });
    };
    Player.prototype.CreateNewPlayer = function () {
        this.GenerateClass();
        this.GenerateSkills();
        this.zone = const_1.CONST.STARTINGZONE;
        this.health = const_1.CONST.STARTINGHEALTH;
        this.saveInDatabase();
        this.socket.emit('signedUp', {
            id: this.id, skills: this.skills, class: this.class, zone: this.zone, health: this.health
        });
    };
    Player.prototype.GenerateClass = function () {
        var randomNumber = Math.floor(Math.random() * playerClasses.length);
        this.class = playerClasses[randomNumber].name;
    };
    ;
    Player.prototype.GenerateSkills = function () {
        var _this = this;
        this.GenerateRandomSkills();
        var thisPlayerClass = playerClasses.find(function (i) { return i.name === _this.class; });
        thisPlayerClass.skills.forEach(function (i) {
            var skill = _this.skills.find(function (j) { return j.name === i.name; });
            if (skill === undefined) {
                return;
            }
            skill.level += i.level;
        });
    };
    Player.prototype.SetSkills = function (playerInfo) {
        var _loop_1 = function (i) {
            this_1.skills.forEach(function (skill) {
                if (i === skill.name) {
                }
            });
        };
        var this_1 = this;
        for (var i in playerInfo) {
            _loop_1(i);
        }
    };
    Player.prototype.GenerateRandomSkills = function () {
        this.skills.forEach(function (i) {
            i.level = Math.floor(Math.random() * 26);
        });
    };
    Player.prototype.saveInDatabase = function () {
        var _this = this;
        this.db.connect();
        var sql = 'UPDATE player SET zone = ?, health = ?, class = ?, farming = ?, mining = ?, healing = ?, fighting = ? WHERE id = ?';
        this.db.query(sql, [
            this.zone,
            this.health,
            this.class,
            this.skills.find(function (i) { return i.name === 'farming'; }).level,
            this.skills.find(function (i) { return i.name === 'mining'; }).level,
            this.skills.find(function (i) { return i.name === 'healing'; }).level,
            this.skills.find(function (i) { return i.name === 'fighting'; }).level,
            this.id
        ], function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("\n\n===============>\t Player " + _this.id + " updated in database \n");
            }
            _this.db.end();
        });
    };
    Player.prototype.PlayerUpdate = function (data) {
    };
    return Player;
}());
exports.Player = Player;
var PlayerClass = (function () {
    function PlayerClass(name, skills) {
        this.name = name;
        this.skills = skills;
    }
    return PlayerClass;
}());
playerClasses.push(new PlayerClass("miner", [{ name: 'mining', level: 25, progress: 0 }, { name: 'fighting', level: 5, progress: 0 }]));
playerClasses.push(new PlayerClass("farmer", [{ name: 'farming', level: 25, progress: 0 }, { name: 'healing', level: 5, progress: 0 }]));
playerClasses.push(new PlayerClass("priest", [{ name: 'healing', level: 25, progress: 0 }, { name: 'farming', level: 5, progress: 0 }]));
playerClasses.push(new PlayerClass("fighter", [{ name: 'fighting', level: 25, progress: 0 }, { name: 'healing', level: 5, progress: 0 }]));


/***/ }),

/***/ "./src/server/objects/Skill.ts":
/*!*************************************!*\
  !*** ./src/server/objects/Skill.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(/*! ../const/const */ "./src/server/const/const.ts");
var Skill = (function () {
    function Skill(name) {
        this.name = name;
        this.level = 0;
        this.progress = 0;
    }
    return Skill;
}());
exports.Skill = Skill;
function GetSkills() {
    var skills = new Array();
    const_1.CONST.SKILLS.forEach(function (i) {
        skills.push(new Skill(i));
    });
    return skills;
}
exports.GetSkills = GetSkills;


/***/ }),

/***/ "./src/shared/const.ts":
/*!*****************************!*\
  !*** ./src/shared/const.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SHARED = {
    ZONELTRS: ['a', 'b', 'c', 'd', 'e'],
    ZONESIZE: 128,
};


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