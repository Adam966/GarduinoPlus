let worker = require('./worker');

module.exports = {
  /*
    index(req, res) {
        res.json({
          success: true,
          message: 'Index page'
        });
    },
*/
    plantData(req, res)
    {
      worker.getPlantData(req.body.ArduinoSerial, req.body.Interval, data =>{
        res.status(200).send(data);
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
        if(success){res.status(200).send();}
        else{res.status(403).send();}
      });
    },

    getUserPlants(req, res)
    {
      worker.getUserPlants(req.body.ArduinoSerial, data =>{
        if(data != "Error"){res.status(200).send(data);}
        else{res.status(403).send();}
      });
    }
};