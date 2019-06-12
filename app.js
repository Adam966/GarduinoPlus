let database = require('./sequelize');
let worker = require('./worker');
let config = require('./config');
let middleware = require('./middleware');
let handler = require('./handler');

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require("body-parser");
let jwt = require('jsonwebtoken');
let cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
console.log("Everything is up");

io.set('origins', '*:*');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    next();
  });  

let arduinoClient = [];
let webClient = [];
let appClient = [];


console.log("Server started");
io.on('connection', socket =>{ 
    console.log("Client connected");

    socket.on('setIdentifierA', data => {

        let clientInfo = new Object();
        clientInfo.socketID = socket.id;
        clientInfo.arduinoSerial = data.ArduinoSerial;
        arduinoClient.push(clientInfo);
    });

    socket.on('setIdentifierW', data => {
        data = JSON.parse(data);
        let clientInfo = new Object();
        clientInfo.socketID = socket.id;
        clientInfo.userID = data.IDUser;
        clientInfo.arduinoSerial = [];
        for(let i = 0; i<data.ArduinoSerial.length; i++)
        {
            clientInfo.arduinoSerial.push(data.ArduinoSerial[i]);
        }
        webClient.push(clientInfo);
    });

    socket.on('setIdentifierApp', data => {

        data = JSON.parse(data);
        worker.serialMatchW(appClient, data.ArduinoSerial[0], result =>{
            if(result > -1)
            {
                if(io.sockets.connected[appClient[result].socketID])
                {
                    console.log("Duplicate found, disconnecting");
                    io.sockets.connected[appClient[result].socketID].disconnect();
                }
                else{pushClient();}
            }
            else
            {
                pushClient();
            }
            console.log(appClient);
        });

        function pushClient()
        {
            let clientInfo = new Object();
            clientInfo.socketID = socket.id;
            clientInfo.userID = data.IDUser;
            clientInfo.arduinoSerial = [];
            for(let i = 0; i<data.ArduinoSerial.length; i++)
            {
                clientInfo.arduinoSerial.push(data.ArduinoSerial[i]);
            }
            appClient.push(clientInfo);
        }
    });

	socket.on('arduinoData', data =>{   
        data = JSON.parse(data);
        worker.writeData(data);
        worker.serialMatchW(webClient, data.ArduinoSerial, result =>{
            if(result > -1)
            {
                console.log("Latest data sent to client");
                io.to(webClient[result].socketID).emit('plantData', data);
            }
        });
        
    });

    socket.on('water', (data) => {
        worker.serialMatchA(arduinoClient, data.ArduinoSerial, result =>{
            if(result > -1)
            {
                console.log("Water the plant");
                io.to(arduinoClient[result].socketID).emit('water');
            }
        });
    });

    socket.on('getSoilHumidity', (data)=>{
        worker.serialMatchA(arduinoClient, data.ArduinoSerial, result =>{
            if(result > -1)
            {
                console.log("SENDINGHUMIDITY");
                worker.getSoilHumidity(data.ArduinoSerial, humData =>{
                    io.to(arduinoClient[result].socketID).emit("humidity", humData);
                });
            }
        });
    });
    
    socket.on('disconnect', ()=>{
        worker.disconnectMatch(webClient, socket.id, result =>{
            if(result > -1)
            {
                webClient.splice(result,1);
                console.log('Web client disconnected');
            }
            else
            {
                worker.disconnectMatch(appClient, socket.id, result =>{
                    if(result > -1)
                    {
                        appClient.splice(result,1);
                        console.log('App Client disconnected');
                    }
                    else
                    {
                        worker.disconnectMatch(arduinoClient, socket.id, result =>{
                            if(result > -1)
                            {
                                arduinoClient.splice(result,1);
                                console.log('Arduino client disconnected');
                            }
                        });  
                    }
                });  
            }
        });
    });
});

app.post('/register', (req, res) =>{
    worker.registerUser(req.body, success =>{
        if(success)
        {
            console.log("User successfully registered");
            res.status(200).send();
        }
        else
        {
            res.status(403).send();
        }
    });
});

app.post('/login', (req, res) =>{
    worker.getUser(req.body, result =>{
        console.log(result);
        if(result != "Error")
        {
            result = JSON.parse(result);
            let token = jwt.sign({Email:result[0].Email},
                config.secret,{ expiresIn: '12h'}
            );
            console.log(token);
            let respObj = {ID: result[0].ID, Name: result[0].Name, Email: result[0].Email, Token:token};
            res.status(200).send(JSON.stringify(respObj));
        }
        else
        {
            console.log("Error Login");
            res.status(403).send();
        }
    });
});

app.post('/plantData', middleware.checkToken, handler.plantData);

app.put('/minmax', middleware.checkToken, handler.writeMinMax);

app.post('/minmax', middleware.checkToken, handler.getMinMax);

app.post('/plants', middleware.checkToken, handler.getUserPlants);

server.listen(1205);