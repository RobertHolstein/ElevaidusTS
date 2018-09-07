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
var const_1 = __webpack_require__(/*! ./const/const */ "./src/server/const/const.ts");
var mysql = __webpack_require__(/*! mysql */ "mysql");
var http_1 = __webpack_require__(/*! http */ "http");
var express = __webpack_require__(/*! express */ "express");
var socketIo = __webpack_require__(/*! socket.io */ "socket.io");
var path = __webpack_require__(/*! path */ "path");
var Player_1 = __webpack_require__(/*! ./objects/Player */ "./src/server/objects/Player.ts");
var App = (function () {
    function App() {
        this.dbConfig = {
            host: const_1.CONST.HOST,
            user: const_1.CONST.DBUSER,
            password: const_1.CONST.DBPASSWORD,
            database: const_1.CONST.DATABASE
        };
        this.createApp();
        this.config();
        this.createServer();
        this.Routes();
        this.sockets();
        this.listen();
        this.zones = const_1.CONST.ZONES;
        this.dbConnect();
    }
    App.prototype.createApp = function () {
        this.app = express();
    };
    App.prototype.config = function () {
        this.port = process.env.PORT || 4001;
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
                socket.emit('messageFromBackend', 'testing connectivity from backend');
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
                if (!signUpInfo.username || !signUpInfo.password) {
                    var error = "no username and or password given";
                    console.log(error);
                    socket.emit('errorFromBackend', error);
                    return;
                }
                var sql = 'SELECT * FROM player WHERE username = ? AND password = ?';
                var query = _this.db.query(sql, [signUpInfo.username, signUpInfo.password], function (err, res) {
                    if (err) {
                        console.log(err);
                        socket.emit('errorFromBackend', err.code);
                    }
                    else if (res.length !== 0) {
                        socket.emit('errorFromBackend', 'this username is already in use');
                    }
                    else {
                        sql = 'INSERT INTO player SET ?';
                        var query_1 = _this.db.query(sql, { username: signUpInfo.username, password: signUpInfo.password }, function (err, res) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                var player = _this.CreatePlayer(socket, { player: { id: res.insertId, username: signUpInfo.username }, isNew: true });
                            }
                        });
                    }
                });
            });
        });
    };
    App.prototype.CreatePlayer = function (socket, playerInfo) {
        var player = new Player_1.Player(this.io, socket, this.db, playerInfo);
    };
    App.prototype.dbConnect = function () {
        var _this = this;
        var db = mysql.createPool(this.dbConfig);
        db.getConnection(function (err) {
            if (err) {
                throw err;
            }
            else {
                console.log("\n\n===============>\t " + const_1.CONST.DATABASE + " database connected\n");
                var sql = "CREATE TABLE IF NOT EXISTS Player(id int AUTO_INCREMENT, username VARCHAR(30), password VARCHAR(255), zone VARCHAR(30), health int, class VARCHAR(30), farming int, mining int, fighting int, healing int, crafting int, PRIMARY KEY (id), UNIQUE KEY username (username))";
                db.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log("\n\n===============>\t " + const_1.CONST.DATABASE + " database tables check\n");
                    }
                });
                _this.db = db;
            }
        });
        db.on('error', function (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log("\n\n===============>\t " + const_1.CONST.DATABASE + " database tables check\n");
                var db = mysql.createPool(_this.dbConfig);
                _this.db = db;
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
    SKILLS: ['farming', 'mining', 'healing', 'fighting', 'crafting'],
    PLAYERCLASSES: [
        { name: 'knight', farming: 0, mining: 0, healing: 5, fighting: 25, crafting: 0 },
        { name: 'farmer', farming: 25, mining: 0, healing: 5, fighting: 0, crafting: 0 },
        { name: 'miner', farming: 5, mining: 20, healing: 0, fighting: 5, crafting: 0 },
        { name: 'priest', farming: 5, mining: 0, healing: 25, fighting: 0, crafting: 5 },
        { name: 'craftsmen', farming: 0, mining: 5, healing: 0, fighting: 0, crafting: 25 }
    ],
    ZONES: [
        { name: 'a1' },
        { name: 'a2' },
        { name: 'a3' },
        { name: 'a4' },
        { name: 'a5' },
        { name: 'b1' },
        { name: 'b2' },
        { name: 'b3' },
        { name: 'b4' },
        { name: 'b5' },
        { name: 'c1' },
        { name: 'c2' },
        { name: 'c3' },
        { name: 'c4' },
        { name: 'c5' },
        { name: 'd1' },
        { name: 'd2' },
        { name: 'd3' },
        { name: 'd4' },
        { name: 'd5' },
        { name: 'e1' },
        { name: 'e2' },
        { name: 'e3' },
        { name: 'e4' },
        { name: 'e5' },
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
var const_1 = __webpack_require__(/*! ../../shared/const */ "./src/shared/const.ts");
var const_2 = __webpack_require__(/*! ../const/const */ "./src/server/const/const.ts");
var Skill_1 = __webpack_require__(/*! ./Skill */ "./src/server/objects/Skill.ts");
var PlayerClass_1 = __webpack_require__(/*! ./PlayerClass */ "./src/server/objects/PlayerClass.ts");
var zones = [];
const_1.SHARED.ZONES.forEach(function (zone) {
    zones[zone] = {};
    zones[zone].players = [];
});
var playerClasses = PlayerClass_1.GetPlayerClasses();
var Player = (function () {
    function Player(io, socket, db, playerInfo) {
        this.io = io;
        this.socket = socket;
        this.Listen();
        this.db = db;
        this.id = playerInfo.player.id;
        this.username = playerInfo.player.username;
        this.skills = Skill_1.GetSkills();
        if (playerInfo.isNew) {
            this.CreateNewPlayer();
        }
        else {
            this.SetPlayerInfo(playerInfo.player);
        }
    }
    Player.prototype.Listen = function () {
        var _this = this;
        this.socket.on('disconnect', function () {
            console.log("\n\n===============>\t client disconnected\n");
            delete zones[_this.zone].players[_this.socket.id];
            _this.socket.to(_this.zone).emit('removePlayer', _this.FrontendPlayerInfo());
        });
    };
    Player.prototype.SetPlayerInfo = function (playerInfo) {
        this.SetSkills(playerInfo);
        this.class = playerInfo.class;
        this.zone = playerInfo.zone;
        this.health = playerInfo.health;
        this.Join();
    };
    Player.prototype.CreateNewPlayer = function () {
        this.GenerateClass();
        this.GenerateSkills();
        this.zone = const_2.CONST.STARTINGZONE;
        this.health = const_2.CONST.STARTINGHEALTH;
        this.saveInDatabase();
        this.Join();
    };
    Player.prototype.Join = function () {
        this.socket.emit('join', this.FrontendPlayerInfo());
        this.JoinNewArea(this.zone, true);
    };
    Player.prototype.JoinNewArea = function (newZone, newlyJoin) {
        if (!newlyJoin) {
            this.socket.leave(this.zone);
            this.socket.to(this.zone).emit('removePlayer', this.FrontendPlayerInfo());
        }
        this.zone = newZone;
        this.socket.join(this.zone);
        var playersInArea = [];
        zones[this.zone].players[this.socket.id] = this.FrontendPlayerInfo();
        for (var p in zones[this.zone].players) {
            playersInArea.push(zones[this.zone].players[p]);
        }
        ;
        this.socket.emit('currentPlayers', playersInArea);
        this.socket.to(this.zone).emit('addPlayer', zones[this.zone].players[this.socket.id]);
    };
    Player.prototype.FrontendPlayerInfo = function () {
        var player = {
            id: this.id,
            username: this.username,
            skills: this.skills,
            class: this.class,
            zone: this.zone,
            health: this.health
        };
        return player;
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
        for (var s = 0; s < this.skills.length; s++) {
            for (var prop in playerInfo) {
                if (prop === this.skills[s].name) {
                    this.skills[s].level = playerInfo[prop];
                    break;
                }
            }
        }
        ;
    };
    Player.prototype.GenerateRandomSkills = function () {
        this.skills.forEach(function (i) {
            i.level = Math.floor(Math.random() * 26);
        });
    };
    Player.prototype.saveInDatabase = function () {
        var _this = this;
        var sql = 'UPDATE player SET zone = ?, health = ?, class = ?, farming = ?, mining = ?, healing = ?, fighting = ?, crafting = ? WHERE id = ?';
        this.db.query(sql, [
            this.zone,
            this.health,
            this.class,
            this.skills.find(function (i) { return i.name === 'farming'; }).level,
            this.skills.find(function (i) { return i.name === 'mining'; }).level,
            this.skills.find(function (i) { return i.name === 'healing'; }).level,
            this.skills.find(function (i) { return i.name === 'fighting'; }).level,
            this.skills.find(function (i) { return i.name === 'crafting'; }).level,
            this.id
        ], function (err, res) {
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


/***/ }),

/***/ "./src/server/objects/PlayerClass.ts":
/*!*******************************************!*\
  !*** ./src/server/objects/PlayerClass.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(/*! ../const/const */ "./src/server/const/const.ts");
var PlayerClass = (function () {
    function PlayerClass(name, skills) {
        this.name = name;
        this.skills = skills;
    }
    return PlayerClass;
}());
exports.PlayerClass = PlayerClass;
function GetPlayerClasses() {
    var playerClasses = new Array();
    const_1.CONST.PLAYERCLASSES.forEach(function (pClass) {
        playerClasses.push(new PlayerClass(pClass.name, [
            { name: 'farming', level: pClass.farming, progress: 0 },
            { name: 'mining', level: pClass.mining, progress: 0 },
            { name: 'healing', level: pClass.healing, progress: 0 },
            { name: 'fighting', level: pClass.fighting, progress: 0 },
            { name: 'crafting', level: pClass.crafting, progress: 0 },
        ]));
    });
    return playerClasses;
}
exports.GetPlayerClasses = GetPlayerClasses;


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
    ZONES: ['a1', 'a2', 'a3', 'a4', 'a5', 'b1', 'b2', 'b3', 'b4', 'b5', 'c1', 'c2', 'c3', 'c4', 'c5', 'd1', 'd2', 'd3', 'd4', 'd5', 'e1', 'e2', 'e3', 'e4', 'e5',],
    ZONESIZE: 128,
    MAPSTARTX: 320,
    MAPSTARTY: 0,
};
function Resize() {
    var canvas = this.game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    }
    else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}
exports.Resize = Resize;
var PlayerInfo = (function () {
    function PlayerInfo() {
    }
    return PlayerInfo;
}());
exports.PlayerInfo = PlayerInfo;


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