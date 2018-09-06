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
    ]

}
