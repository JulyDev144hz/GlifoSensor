const mongoose = require('mongoose');
const { ReadlineParser } = require('serialport');
var SerialPort = require('serialport').SerialPort;
const url = "mongodb://0.0.0.0:27017/sensor"; // Cambiar a la URL correcta de la base de datos
const portName = 'COM3';
const baudRate = 9600;
// const fetch = require('node-fetch');

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    
    const port = new SerialPort({path: portName, baudRate: baudRate });

    const parser = port.pipe(new ReadlineParser)


    parser.on('data', function(data){
      const datos = data.split(',')
      const temperatura = parseFloat(datos[0])
      const humedad = parseFloat(datos[1])
      console.log(`Humedad: ${temperatura}`)
      console.log(`Temperatura: ${humedad}`)

      // const body = JSON.stringify({ temperatura, humedad });

      // const options = {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Content-Length': Buffer.byteLength(body)
      //   },
      //   body: body
      // };

      // fetch(`http://localhost:3000/sensor/640534da7ab15e4fa0a75f62`, options)
      // .then(response => response.json())
      // .then(data => console.log(data))
      // .catch(error => console.error(error));

      
    })

    parser.on('open', function(){
      console.log('connection is opened')
    })

    port.on('error', function(err){
      console.log(err)
    })

    process.on('SIGINT', function() {
      port.close(function() {
        console.log('Serial port closed');
        mongoose.connection.close(function() {
          console.log('MongoDB connection closed');
          process.exit();
        });
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });
