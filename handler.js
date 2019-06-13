let worker = require('./worker');

module.exports = {
    plantData(req, res)
    {
      worker.getPlantData(req.body.ArduinoSerial, req.body.Interval, data =>{
        worker.dataAvarageByDays(data, result =>{
          res.status(200).send(result);
        });
      });
    },

    getMinMax(req, res)
    {
      worker.getMinMax(req.body.ArduinoSerial, data =>{
        res.status(200).send(data);
      });
    },

    writeMinMax(req, res)
    {
      worker.writeMinMax(req.body, success =>{
        if(success){res.status(200).send(JSON.stringify(req.body));}
        else{res.status(403).send();}
      });
    },

    getUserPlants(req, res)
    {
      worker.getUserPlants(req.body.IDUser, data =>{
        if(data != "Error"){res.status(200).send(data);}
        else{res.status(403).send();}
      });
    }
};