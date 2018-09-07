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

}
