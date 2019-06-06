const { plantInfo, plantCare, users } = require('./sequelize')
let database = require('./sequelize');

module.exports = {

    disconnectMatchA(array, socketid, found)
    {
        for(let i=0; i < array.length; i++)
        {
            if( array[i].socketID == socketid)
            {
                found(i);
                break;
            }
        }
        found(-1);
    },

    disconnectMatchW(array, socketid, found)
    {
      for(let i=0; i < array.length; i++)
        {
          for(let j = 0; j<array[i].arduinoSerial.length; j++)
          {
            if(array[i].socketID[j] == socketid)
            {
                found(i);
                break;
            }
          }
        }
        found(-1);
    },

    serialMatchA(array, serial, found)
    {
        for(let i=0; i < array.length; i++)
        {
            if(array[i].arduinoSerial == serial)
            {
                found(i);
                break;
            }
        }
        found(-1);
    },

    serialMatchW(array, serial, found)
    {
        for(let i=0; i < array.length; i++)
        {
          for(let j = 0; j<array[i].arduinoSerial.length; j++)
          {
            if(array[i].arduinoSerial[j] == serial)
            {
                found(i);
                break;
            }
          }
        }
        found(-1);
    },

    dataAvarageByDays(data, rvlaue)
    {
        let rJSON = [];
        data = JSON.parse(data);
        let current = data[0].Date.substr(0, 10);
        let cdate;
        let counter = 0;

        let temperature = 0;
        let airhumidity = 0;
        let soilhumidity = 0;
        let watersurface = 0;
        for(let i = 0; i<data.length; i++)
        {
            cdate = data[i].Date.substr(0, 10);
            if(current == cdate)
            {
                counter++;
                temperature += data[i].Temperature;
                airhumidity += data[i].AirHumidity;
                soilhumidity += data[i].SoilHumidity;
                watersurface += data[i].WaterSurface;
                if(i == data.length-1){pushToArray();}
            }
            else
            {
                pushToArray();
            }
        }
        function pushToArray()
        {
            temperature = Math.round(temperature/counter);
            airhumidity = Math.round(airhumidity/counter);
            soilhumidity = Math.round(soilhumidity/counter);
            watersurface = Math.round(watersurface/counter);

            rJSON.push({"Temperature":temperature, "AirHumidity": airhumidity, "SoilHumidity":soilhumidity, "WaterSurface":watersurface, "Date":current});

            counter = 0;
            current = cdate;
            temperature = 0;
            airhumidity = 0;
            soilhumidity = 0;
            watersurface = 0;
        }
        rvlaue(rJSON);
    },

    writeData(obj)
    {
      console.log("Writing to database");
      //obj = JSON.parse(obj);
      if(isValidJSON(obj))
      {
        writeArduinoData();
      }
      else
      {
        console.log("BAD DATA");
      }

      function writeArduinoData()
      {
        plantInfo.create({
            ArduinoSerial: obj.identification.ArduinoSerial,
            Temp: obj.info.Temp,
            AirHum: obj.info.AirHum,
            SoilHum: obj.info.SoilHum,
            WatSurf: obj.info.WatSurf,
            Date: obj.date.Date
        }).catch(err =>{console.log(err);});
      }

      function isValidJSON(data)
      {
        if(!data.identification.hasOwnProperty('ArduinoSerial'))
        {
          return false;
        }
        if(!data.info.hasOwnProperty('Temp'))
        {
          return false;
        }
        if(!data.info.hasOwnProperty('AirHum'))
        {
          return false;
        }
        if(!data.info.hasOwnProperty('SoilHum'))
        {
          return false;
        }
        if(!data.info.hasOwnProperty('WatSurf'))
        {
          return false;
        }
        if(!data.date.hasOwnProperty('Date'))
        {
          return false;
        }
        return true;
      }
    },

    getPlantData(arduinoSerial, interval, data)
    {
      console.log(interval);

      database.sequelizeconn.query("SELECT Temp, AirHum, SoilHum, WatSurf,  Date FROM plantinfo WHERE ArduinoSerial = :as AND Date > (NOW() - INTERVAL 1 "+ interval + ")",
      { replacements: {as: arduinoSerial}, type: database.sequelizeconn.QueryTypes.SELECT }).then(result => {
            console.log(result);
            data(result);
      }).catch(err =>{console.log(err); data("Error");});
      
    },

    writeMinMax(data, isSuccess) //writes the minimal and maximal values to the database what the webclient sent
    {
      console.log("Writing to database");
      checkIfExists(data.identification.ArduinoSerial, exists =>{
        if(exists)
        {
           updateDataMinMax();
           console.log("Data updated");
        }
        else
        {
           writeDataMinMax();
           console.log("Data writed");
        }
      });

      function checkIfExists(arduinoSerial, exists)
      {
        plantCare.findOne({
            attributes:["ArduinoSerial"],
            where: {
                ArduinoSerial: arduinoSerial
            },
        }).then((res)=>{
            if(JSON.stringify(res) != "null"){exists(true);} else{exists(false);}
        }).catch(err =>{
              exists(false);
            });
      }

      function writeDataMinMax()
      {
        plantCare.create({
            ArduinoSerial: data.identification.ArduinoSerial,
            IDUser: data.identification.IDUser,
            PlantName: data.identification.PlantName,
            TempMin: data.optimalValues.TempMin,
            TempMax: data.optimalValues.TempMax,
            AirHumMin: data.optimalValues.AirHumMin,
            AirHumMax: data.optimalValues.AirHumMax,
            SoilHumMin: data.optimalValues.SoilHumMin,
            SoilHumMax: data.optimalValues.SoilHumMax
        }).catch(err =>{console.log(err); isSuccess(false)});
        isSuccess(true);
      }

      function updateDataMinMax()
      {
        plantCare.update({
            IDUser: data.identification.IDUser,
            PlantName: data.identification.PlantName,
            TempMin: data.optimalValues.TempMin,
            TempMax: data.optimalValues.TempMax,
            AirHumMin: data.optimalValues.AirHumMin,
            AirHumMax: data.optimalValues.AirHumMax,
            SoilHumMin: data.optimalValues.SoilHumMin,
            SoilHumMax: data.optimalValues.SoilHumMax
        }, 
        {
            where:{ArduinoSerial: data.identification.ArduinoSerial}
        }).catch(err =>{console.log(err); isSuccess(false)});
        isSuccess(true);
      }
    },

    getMinMax(arduinoSerial, data) //returns the minimal and maximal values
    {
        plantCare.findAll({
            attributes:["ArduinoSerial", "PlantName", "TempMin", "TempMax", "AirHumMin", "AirHumMax", "SoilHumMin", "SoilHumMax"],
            where: {
                ArduinoSerial: arduinoSerial
            },
        }).then(minmax=>{data(JSON.stringify(minmax));}).catch(err =>{console.log(err); data("Error");});
    },

    getSoilHumidity(arduinoSerial, data)
    {
        plantCare.findAll({
            attributes:["SoilHumMin"],
            where: {
                ArduinoSerial: arduinoSerial
            },
        }).then(shumidity=>{data(JSON.stringify(shumidity));}).catch(err =>{console.log(err); data("Error");});
    },

    registerUser(obj, isSuccess)
    {
      database.sequelizeconn.query("insert into users(Name, Email, Password) values(:name, :mail, sha1(:pass));",
      { replacements: {name: obj.Name, mail: obj.Email, pass: obj.Password}, type: database.sequelizeconn.QueryTypes.INSERT }).then(result => {
            isSuccess(true);
      }).catch(err =>{console.log(err);isSuccess(false);});;
    },

    getUser(obj, data)
    {
      database.sequelizeconn.query("select ID, Name, Email from users where Password = sha1(:pass) AND Email = :mail;",
      { replacements: {pass: obj.Password, mail: obj.Email}, type: database.sequelizeconn.QueryTypes.SELECT }).then(result => {
            if(result.length != 0){data(JSON.stringify(result))} else{data("Error");};
      }).catch(err =>{console.log(err); data("Error");});
    },

    getUserPlants(UserID, data)
    {
      plantCare.findAll({
        attributes:["ArduinoSerial", "PlantName"],
        where: {
            IDUser: UserID
        },
    }).then(plant=>{data(JSON.stringify(plant));}).catch(err =>{console.log(err); data("Error");});
    }
};