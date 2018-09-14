export let CONST = {
    // mySQL database settings
    // mysql://b07173e9b72118:45517a09@us-cdbr-iron-east-01.cleardb.net/heroku_4d115db42117719?reconnect=true
    HOST: 'us-cdbr-iron-east-01.cleardb.net', //'localhost',
    DBUSER:  'b07173e9b72118', //'elevaidus',
    DBPASSWORD: '45517a09', //'mysqlP@$$w0rd',
    DATABASE: 'heroku_4d115db42117719', //'elevaidus',

    // player settings
    STARTINGZONE: 'a1',
    STARTINGHEALTH: 100,

    // skills
    SKILLS: ['farming','mining','healing','fighting','crafting'],

    //classes
    PLAYERCLASSES:[
        {name:'knight',     farming:0,  mining:0,   healing:5,  fighting:25,    crafting:0},
        {name:'farmer',     farming:25, mining:0,   healing:5,  fighting:0,     crafting:0},
        {name:'miner',      farming:5,  mining:20,  healing:0,  fighting:5,     crafting:0},
        {name:'priest',     farming:5,  mining:0,   healing:25, fighting:0,     crafting:5},
        {name:'craftsmen',  farming:0,  mining:5,   healing:0,  fighting:0,     crafting:25}
    ],

    ZONES:[
        { name: 'a1',   x:0,    y:0 },
        { name: 'a2',   x:0,    y:1 },
        { name: 'a3',   x:0,    y:2 },
        { name: 'a4',   x:0,    y:3 },
        { name: 'a5',   x:0,    y:4 },
        { name: 'b1',   x:1,    y:0 },
        { name: 'b2',   x:1,    y:1 },
        { name: 'b3',   x:1,    y:2 },
        { name: 'b4',   x:1,    y:3 },
        { name: 'b5',   x:1,    y:4 },
        { name: 'c1',   x:2,    y:0 },
        { name: 'c2',   x:2,    y:1 },
        { name: 'c3',   x:2,    y:2 },
        { name: 'c4',   x:2,    y:3 },
        { name: 'c5',   x:2,    y:4 },
        { name: 'd1',   x:3,    y:0 },
        { name: 'd2',   x:3,    y:1 },
        { name: 'd3',   x:3,    y:2 },
        { name: 'd4',   x:3,    y:3 },
        { name: 'd5',   x:3,    y:4 },
        { name: 'e1',   x:4,    y:0 },
        { name: 'e2',   x:4,    y:1 },
        { name: 'e3',   x:4,    y:2 },
        { name: 'e4',   x:4,    y:3 },
        { name: 'e5',   x:4,    y:4 },
    ]

}
