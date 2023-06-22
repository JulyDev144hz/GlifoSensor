var map = L.map("map").setView([-34.6140305, -58.4517207], 12);
const todo = document.querySelector(".todo");
const mapa = document.querySelector("#map");
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let arrayMarkers = [];
let marker;

class Barrio {
  constructor(name, coords) {
    this.name = name;
    this.coords = coords;
    this.polygon = L.polygon(this.coords);
    this.sensores = []
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

$.getJSON("./barrios.geojson.json", (json) => {
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

setInterval(() => {
  barrios.forEach((barrio) => {

    let sumTotal = 0

    barrio.sensores.map(s => sumTotal += s.temperatura)
    if (sumTotal / barrio.sensores.length > 30) {
      barrio.polygon.setStyle({ color: 'red' });
    }

    barrio.polygon.addTo(map)
    barrio.polygon.on("mouseover", (e) => {

      try {
        updateData(barrio.name, barrio.sensores[0].temperatura, barrio.sensores[0].humedad, barrio.sensores[0].updatedAt);

      } catch (error) {
        updateData(barrio.name, 1, 1, "sin registro");

      }
    });
  });
}, 100);



const getSensors = async () => {

  try {
    oldArrayMarkers = arrayMarkers;

    arrayMarkers = [];

    let data = await fetch("http://localhost:3000/sensor");
    let json = await data.json();
    json.forEach((s) => {
      barrios.map(barr => {


        if (RayCasting(s.coords, barr.coords)) {
          if (barr.sensores.find(e => e._id == s._id) == undefined) {
            barr.sensores.push(s)
          }
        } else {
          if (barr.sensores.find(e => e._id == s._id) != undefined) {
            barr.sensores.filter(e => e._id != s._id)
          }
        }

      })
   
    });

    oldArrayMarkers.map((mk) => {
      mk.removeFrom(map);
    });

    oldArrayMarkers = [];
  } catch (error) {
    console.error(error)
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

