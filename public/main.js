var map = L.map("map").setView([-34.6140305, -58.4517207], 12);
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
};
let chartPromedio = new Chart(ctx, defaultcfg);
// [0,1,2,3,4,5,6].map(e=>{
//   humedad.data.datasets[0].data[e] = {x:"2016/12/"+e,y:e*50}

// })
// humedad.update()

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

fetch("/public/barrios.json").then(data=>data.json()).then( (json) => {
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

setTimeout(() => {
  barrios.forEach((barrio) => {
    let sumTotal = 0;

    barrio.sensores.map((s) => (sumTotal += s.temperatura));

    barrio.polygon.setStyle({ color: "#009c4c" });

    barrio.polygon.addTo(map);
    barrio.polygon.on("click", (e) => {
      window.location = "#datosSensor";
      try {
        if (barrio.historialSensores.length > 1) {
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
            promedio = [];
            promedio.push(historialOrdenado[0]);
            historialOrdenado.map((dato) => {
              if (
                DentroDeXMinutos(
                  Date.parse(
                    convertLocaleToDate(historialOrdenado[0].timeStamp)
                  ),
                  Date.parse(convertLocaleToDate(dato.timeStamp)),
                  2
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
            promedios.push({
              humedad: humedadPromedio,
              temperatura: temperaturaPromedio,
              co2: co2Promedio,
              timeStamp: time,
            });
          });
          promedios.map((punto, index) => {
            chartPromedio.config.data.datasets[0].data[index] = {
              x: punto.timeStamp,
              y: punto.humedad,
            };
            chartPromedio.config.data.datasets[1].data[index] = {
              x: punto.timeStamp,
              y: punto.co2,
            };
            chartPromedio.config.data.datasets[2].data[index] = {
              x: punto.timeStamp,
              y: punto.temperatura,
            };
          });
          chartPromedio.update();
        }else{
          alert('Mostrar Graficos Vacios...')
        }
        sensores.innerHTML = "";
        chartSensors = [];
        barrio.sensores.map(async (sns, indx) => {
          let id = sns._id;
          sensores.innerHTML += `
          <div class="sensor">
            <h6>Sensor: ${sns.name}</h6>
            <canvas id="chartSensor${indx + 1}"></canvas>
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

              // setTimeout(() => {
              let chart = new Chart(
                document.getElementById("chartSensor" + (indx + 1)),
                config
              );

              chartSensors.push({ chart: chart, id: id });
              chart.update();
              // }, 200);
            });
        });
      } catch (error) {
        console.error(error);
      }
    });
    barrio.polygon.on("mouseover", (e) => {
      try {
        updateData(
          barrio.name,
          barrio.sensores[0].temperatura,
          barrio.sensores[0].humedad,
          barrio.sensores[0].updatedAt
        );
      } catch (error) {
        updateData(barrio.name, 1, 1, "sin registro");
      }
    });
  });
}, 100);

const DentroDeXMinutos = (time1, time2, x) => {
  return time1 < time2 && time2 < time1 + x * 60 * 1000;
};

const convertLocaleToDate = (time) => {
  time = time.split(" ");
  time[0] = time[0].split("/");
  time[0] = [time[0][1], time[0][0], time[0][2]].join("/");
  time = time.join(" ");
  return time;
};

const getSensors = async () => {
  try {
    let dataHistory = await fetch("/historySensor");
    let jsonHistory = await dataHistory.json();

    chartSensors.map((sensorChart, index) => {
      sensorChart.chart.config.data.datasets[0].data = [];
      sensorChart.chart.config.data.datasets[1].data = [];
      sensorChart.chart.config.data.datasets[2].data = [];
      jsonHistory
        .filter((x) => x.idSensor == sensorChart.id)
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
      sensorChart.chart.update();
    });

    let data = await fetch("/sensor");
    let json = await data.json();
    json.forEach((s) => {
      barrios.map((barr) => {
        if (RayCasting(s.coords, barr.coords)) {
          // if (barr.sensores.find(e => e._id == s._id) == undefined) {
          barr.sensores = barr.sensores.filter((e) => e._id != s._id);
          barr.historialSensores = barr.historialSensores.filter(
            (x) => x.idSensor != s._id
          );
          jsonHistory
            .filter((x) => x.idSensor == s._id)
            .map((dato) => {
              barr.historialSensores.push(dato);
            });

          barr.sensores.push(s);
          // }
        } else {
          if (barr.sensores.find((e) => e._id == s._id) != undefined) {
            barr.sensores = barr.sensores.filter((e) => e._id != s._id);
          }
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const updateData = (nombre, temperatura, humedad, actualizado) => {
  let dataNombre = document.getElementById("name");
  let updatedAt = document.getElementById("updatedAt");
  let dataTemperatura = document.getElementById("temp");
  let dataHumedad = document.getElementById("hum");
  dataNombre.innerHTML = nombre;
  updatedAt.innerHTML = `Actualizado: ${actualizado}`;
  dataTemperatura.innerHTML = temperatura;
  dataHumedad.innerHTML = humedad;
};

getSensors();
setInterval(() => {
  getSensors();
}, 5000);
