// definimos el mapa y lo centramos en CABA
var map = L.map("map", {
  center: [-34.6140305, -58.4517207],
  zoom: 12,
  gestureHandling: true,
});

let barrioSeleccionado;

// seleccionamos el div donde va a estar el mapa y la informacion
const todo = document.querySelector(".todo");
const mapa = document.querySelector("#map");
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const sensores = document.getElementById("sensores");
let chartSensors = [];

const ctx = document.getElementById("ChartPromedio");

//Se define la configuracion default de los graficos
const defaultcfg = {
  type: "line",
  data: {
    datasets: [
      {
        label: "Humedad",
        data: [
          { x: "2016-12-25", y: 20 },
          { x: "2016-12-26", y: 10 },
        ],
        tension: 0.4,
      },
      {
        label: "CO2",
        data: [
          { x: "2016-12-25", y: 20 },
          { x: "2016-12-26", y: 15 },
        ],
        tension: 0.4,
      },
      {
        label: "Temperatura",
        data: [
          { x: "2016-12-25", y: 15 },
          { x: "2016-12-26", y: 16 },
        ],
        tension: 0.4,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            fontSize: 10,
          },
        },
      ],
    },
  },
};
let chartPromedio = new Chart(ctx, defaultcfg); //Grafico que muestra la contaminacion promedio de los sensores de un barrio
// [0,1,2,3,4,5,6].map(e=>{
//   humedad.data.datasets[0].data[e] = {x:"2016/12/"+e,y:e*50}

// })
// humedad.update()

//Permite crear barrios con sus datos
class Barrio {
  constructor(name, coords) {
    this.name = name;
    this.coords = coords;
    this.polygon = L.polygon(this.coords);
    this.sensores = [];
    this.historialSensores = [];
  }
}

let barrios = [];

//Permite saber entre que conjunto de coordenadas se encuentra una coordenada especifica
function RayCasting(point, vs) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

  var x = point[0],
    y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

//Recoge la informacion de los barrios, los crea y guarda en el array de barrios.
fetch("/public/barrios.json")
  .then((data) => data.json())
  .then((json) => {
    json.features.forEach((barrio) => {
      let name = barrio.properties.BARRIO;
      let coords = barrio.geometry.coordinates[0][0];
      coords.forEach((coord, index) => {
        coords[index] = [coord[1], coord[0]];
      });

      let newBarrio = new Barrio(name, coords);
      barrios.push(newBarrio);
    });
  });

// Crea una nueva promesa
let loading = new Promise((resolve, reject) => {
  // Agrega un escucha al evento "load" de la ventana
  window.addEventListener("load", (e) => {
    // Inicia un intervalo que llama a la función console.log() cada 100 milisegundos
    let intervalLoading = setInterval(() => {
      console.log("cargando");
      // Si la variable "barrios" tiene una longitud mayor que cero, significa que los barrios han sido cargados con éxito
      if (barrios.length > 0) {
        resolve("Cargo");
        clearInterval(intervalLoading);
      }
    }, 100);
  });
});

//carga la informacion referente a los barrios al clickear sobre cada uno
let cargarBarrios = async () => {
  let resp = await loading;
  console.log("Barrios cargados");
  getSensors();
  barrios.forEach((barrio) => {
    barrio.polygon.addTo(map);
    barrio.polygon.on("click", (e) => {
      window.location = "#datosSensor";
      try {
        if (barrio.historialSensores.length >= 2) {
          $("#ChartPromedio").removeClass("hidden");
          $("#chartError").addClass("hidden");
          let historialOrdenado = barrio.historialSensores.sort((a, b) => {
            return (
              Date.parse(convertLocaleToDate(a.timeStamp)) -
              Date.parse(convertLocaleToDate(b.timeStamp))
            );
          });
          let promedios = [];
          let reintentar = true;
          let puntosPromedios = [];
          let promedio = [];

          while (reintentar) {
            if (historialOrdenado.length == 0) break;
            promedio = [];
            promedio.push(historialOrdenado[0]);
            historialOrdenado.map((dato) => {
              if (
                DentroDeXMinutos(
                  Date.parse(
                    convertLocaleToDate(historialOrdenado[0].timeStamp)
                  ),
                  Date.parse(convertLocaleToDate(dato.timeStamp)),
                  15
                )
              ) {
                promedio.push(dato);
                reintentar = false;
              } else {
                reintentar = true;
              }
            });

            historialOrdenado = historialOrdenado.filter(
              (el) => !promedio.includes(el)
            );
            puntosPromedios.push(promedio);
          }
          //comprueba que hayan datos suficientes para mostrar un grafico, caso contrario muestra mensaje de error
          if (puntosPromedios.length == 1) {
            $("#ChartPromedio").addClass("hidden");
            $("#chartError").removeClass("hidden");
            $("#chartError").html(`
                No hay suficientes datos para hacer un promedio de ${barrio.name}
              `);
          } else {
            puntosPromedios.map((punto, index) => {
              let humedadTotal = 0;
              let temperaturaTotal = 0;
              let co2Total = 0;
              punto.map((s) => {
                humedadTotal += s.humedad;
                temperaturaTotal += s.temperatura;
                co2Total += s.co2;
              });
              let humedadPromedio = humedadTotal / punto.length;
              let temperaturaPromedio = temperaturaTotal / punto.length;
              let co2Promedio = co2Total / punto.length;
              let time = punto[0].timeStamp;
              //agrega conjuntos de datos al array promedios para calcularlo
              promedios.push({
                humedad: humedadPromedio,
                temperatura: temperaturaPromedio,
                co2: co2Promedio,
                timeStamp: time,
              });
            });
            try {
              chartPromedio.config.data.datasets[0].data = [];
              chartPromedio.config.data.datasets[1].data = [];
              chartPromedio.config.data.datasets[2].data = [];
            } catch (error) {}
            promedios.map((punto, index) => {
              chartPromedio.config.data.datasets[0].data.push({
                x: punto.timeStamp,
                y: punto.humedad,
              });
              chartPromedio.config.data.datasets[1].data.push({
                x: punto.timeStamp,
                y: punto.co2,
              });
              chartPromedio.config.data.datasets[2].data.push({
                x: punto.timeStamp,
                y: punto.temperatura,
              });
            });

            // Limitar a los últimos 10 registros
            if (promedios.length > 10) {
              chartPromedio.config.data.datasets[0].data =
                chartPromedio.config.data.datasets[0].data.slice(-10);
              chartPromedio.config.data.datasets[1].data =
                chartPromedio.config.data.datasets[1].data.slice(-10);
              chartPromedio.config.data.datasets[2].data =
                chartPromedio.config.data.datasets[2].data.slice(-10);
            }
            chartPromedio.update();
          }
        } else if (barrio.historialSensores.length == 1) {
          $("#ChartPromedio").addClass("hidden");
          $("#chartError").removeClass("hidden");
          $("#chartError").html(`
                No hay suficientes datos para hacer un promedio de ${barrio.name}
              `);
        } else {
          $("#ChartPromedio").addClass("hidden");
          $("#chartError").removeClass("hidden");
          $("#chartError").html("No hay datos recopilados de este barrio");
        }
        sensores.innerHTML = "";
        chartSensors = [];
        barrio.sensores.map(async (sns, indx) => {
          let id = sns._id;
          sensores.innerHTML += `
              <div class="sensor">
                <h6>Sensor: ${sns.name}</h6>
                <canvas id="chartSensor${indx + 1}"></canvas>
                <p id="chartError${indx + 1}" class="hidden msgChart"></p>
              </div>`;
          let config = {
            type: "line",
            data: {
              datasets: [
                {
                  label: "Humedad",
                  data: [],
                  tension: 0.4,
                },
                {
                  label: "CO2",
                  data: [],
                  tension: 0.4,
                },
                {
                  label: "Temperatura",
                  data: [],
                  tension: 0.4,
                },
              ],
            },
          };
          config.data.datasets[0].data,
            config.data.datasets[1].data,
            (config.data.datasets[2].data = []);
          temperaturas = [];
          max = 0;
          //muestra los graficos temporales
          fetch("/historySensor/" + id)
            .then((data) => data.json())
            .then((json) => {
              json.map((sensor, index) => {
                config.data.datasets[0].data[index] = {
                  x: sensor.timeStamp,
                  y: sensor.humedad,
                };
                config.data.datasets[1].data[index] = {
                  x: sensor.timeStamp,
                  y: sensor.co2,
                };
                config.data.datasets[2].data[index] = {
                  x: sensor.timeStamp,
                  y: sensor.temperatura,
                };
              });

              let chart = new Chart(
                document.getElementById("chartSensor" + (indx + 1)),
                config
              );

              chartSensors.push({ chart: chart, id: id });
              chart.update();

              if (json.length < 2) {
                $("#chartSensor" + (indx + 1)).addClass("hidden");
                $("#chartError" + (indx + 1)).removeClass("hidden");
                $("#chartError" + (indx + 1)).html(`
                      Humedad : ${json[0].humedad}<br>
                      CO2 : ${json[0].co2}<br>
                      Temperatura : ${json[0].co2}<br>
                    `);
              }
            });
        });
      } catch (error) {
        console.error(error);
      }
    });
    //al pasar el mouse por arriba se ejecuta updateData()
    barrio.polygon.on("mouseover", (e) => {
      barrioSeleccionado = barrio;
      updateBarrio(barrioSeleccionado);
    });
  });
};
const updateBarrio = (barrio) => {
  try {
    let sensoresOrdenados = barrio.historialSensores.sort((a, b) => {
      return (
        Date.parse(convertLocaleToDate(a.timeStamp)) -
        Date.parse(convertLocaleToDate(b.timeStamp))
      );
    });

    updateData(
      barrio.name,
      sensoresOrdenados[sensoresOrdenados.length - 1].temperatura,
      sensoresOrdenados[sensoresOrdenados.length - 1].humedad,
      sensoresOrdenados[sensoresOrdenados.length - 1].co2,
      sensoresOrdenados[sensoresOrdenados.length - 1].timeStamp
    );
  } catch (error) {
    updateData(barrio.name, "?", "?", "?", "sin registro");
  }
};

cargarBarrios();

//calcular tiempo
const DentroDeXMinutos = (time1, time2, x) => {
  return time1 <= time2 && time2 <= time1 + x * 60 * 1000;
};

//convertir en formato date
const convertLocaleToDate = (time) => {
  time = time.split(" ");
  time[0] = time[0].split("/");
  time[0] = [time[0][1], time[0][0], time[0][2]].join("/");
  time = time.join(" ");
  return time;
};
//obtener datos de sensores
const getSensors = async () => {
  try {
    let dataHistory = await fetch("/historySensor");
    let jsonHistory = await dataHistory.json();
    // Intenta obtener los datos de los sensores del historial
    chartSensors.map((sensorChart, index) => {
      sensorChart.chart.config.data.datasets[0].data = [];
      sensorChart.chart.config.data.datasets[1].data = [];
      sensorChart.chart.config.data.datasets[2].data = [];
      jsonHistory
        .filter((x) => x.idSensor == sensorChart.id)
        .slice(-10) //solo los ultimos 10 datos
        .map((sensor, index) => {
          sensorChart.chart.config.data.datasets[0].data[index] = {
            x: sensor.timeStamp,
            y: sensor.humedad,
          };
          sensorChart.chart.config.data.datasets[1].data[index] = {
            x: sensor.timeStamp,
            y: sensor.co2,
          };
          sensorChart.chart.config.data.datasets[2].data[index] = {
            x: sensor.timeStamp,
            y: sensor.temperatura,
          };
        });
      // Actualiza el gráfico
      sensorChart.chart.update();
    });

    // Obtiene los datos de los sensores del servidor
    let data = await fetch("/sensor");

    // Convierte los datos a JSON
    let json = await data.json();
    json.forEach((s) => {
      barrios.map((barr) => {
        try {
          if(barr.name == barrioSeleccionado.name){
              updateBarrio(barr)
          }
          
        } catch (error) {
          
        }


        // Verifica si el sensor está dentro del barrio
        if (RayCasting(s.coords, barr.coords)) {
          // Elimina el sensor de la lista de sensores del barrio
          barr.sensores = barr.sensores.filter((e) => e._id != s._id);

          // Elimina el sensor del historial de sensores del barrio
          barr.historialSensores = barr.historialSensores.filter(
            (x) => x.idSensor != s._id
          );
          // Agrega el sensor al historial de sensores del barrio
          jsonHistory
            .filter((x) => x.idSensor == s._id)
            .map((dato) => {
              barr.historialSensores.push(dato);
            });
          // Agrega el sensor a la lista de sensores del barrio
          barr.sensores.push(s);
        } else {
          // Si el sensor estaba en el barrio, lo elimina
          if (barr.sensores.find((e) => e._id == s._id) != undefined) {
            barr.sensores = barr.sensores.filter((e) => e._id != s._id);
          }
        }
      });
    });

    //Esto es para cambiar el color de fondo de los barrios en virtud de la calidad del aire
    barrios.map((barrio) => {
      barrio.polygon.setStyle({ color: "#777" });
      if (barrio.historialSensores.length > 0) {
        barrio.polygon.setStyle({ color: "#009c4c" });
        let sensoresOrdenados = barrio.historialSensores.sort((a, b) => {
          return (
            Date.parse(convertLocaleToDate(a.timeStamp)) -
            Date.parse(convertLocaleToDate(b.timeStamp))
          );
        });
        if (sensoresOrdenados[sensoresOrdenados.length - 1].temperatura >= 20) {
          barrio.polygon.setStyle({ color: "#f88b0d" });
        }
        if (sensoresOrdenados[sensoresOrdenados.length - 1].temperatura >= 25) {
          barrio.polygon.setStyle({ color: "#dd0909" });
        }
        if (sensoresOrdenados[sensoresOrdenados.length - 1].temperatura >= 30) {
          barrio.polygon.setStyle({ color: "#5f105f" });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

//Permite actualizar los datos en el lado izquierdo de la pagina
const updateData = (nombre, temperatura, humedad, co2, actualizado) => {
  let dataNombre = document.getElementById("name");
  let dataco2 = document.getElementById("co2");
  let updatedAt = document.getElementById("updatedAt");
  let dataTemperatura = document.getElementById("temp");
  let dataHumedad = document.getElementById("hum");
  dataNombre.innerHTML = nombre;
  dataco2.innerHTML = co2;
  updatedAt.innerHTML = `Actualizado: ${actualizado}`;
  dataTemperatura.innerHTML = temperatura;
  dataHumedad.innerHTML = humedad;
};

//Ejecuta la funcion getSensor cada 5 segundos para realizar la actualizacion de datos
getSensors();
setInterval(() => {
  getSensors();
}, 5000);
