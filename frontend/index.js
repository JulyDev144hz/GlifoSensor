// const mongoose = require('mongoose');
// const { ReadlineParser } = require('serialport');
// var SerialPort = require('serialport').SerialPort;
// const url = "mongodb://0.0.0.0:27017/sensor"; // Cambiar a la URL correcta de la base de datos
// const portName = 'COM3';
// const baudRate = 9600;
// const Sensor = require('../src/models/sensor')

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connected to MongoDB');
    
//     const port = new SerialPort({path: portName, baudRate: baudRate });

//     const parser = port.pipe(new ReadlineParser)


//     parser.on('data', function(data){
//       const datos = data.split(',')
//       const humedad = parseFloat(datos[0])
//       const temperatura = parseFloat(datos[1])

//       console.log(humedad + " "+ temperatura)
//       if (isNaN(temperatura) || isNaN(humedad)) {
//         console.log('Los datos del sensor no son válidos')
//         return
//       }
      
//       const datardos = { humedad: humedad , temperatura: temperatura}

//       fetch("http://localhost:3000/sensor/64053885ef6a3fdb8ffd6323",
//        {method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(datardos)
//       })
//         .then(response => response.json())
//         .then(data => {
//           console.log(data)
//         })
//         .catch(error => {
//           console.error(error)
//         })
//     })

//     parser.on('open', function(){
//       console.log('connection is opened')
//     })

//     port.on('error', function(err){
//       console.log(err)
//     })

//     process.on('SIGINT', function() {
//       port.close(function() {
//         console.log('Serial port closed');
//         mongoose.connection.close(function() {
//           console.log('MongoDB connection closed');
//           process.exit();
//         });
//       });
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//     });
