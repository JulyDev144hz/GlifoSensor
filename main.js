var map = L.map('map').setView([-34.6158238, -58.4332985], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let sensor1 = { x: -34.5608287, y: -58.4936423 }
let sensor2 = { x: -34.5927044, y: -58.4075097 }



var marker = L.marker([sensor1.x, sensor1.y])
marker.addTo(map);
marker.bindPopup("<b>Hola</b><br>Este es el colegio").openPopup();

// setInterval(() => {
//     sensor1.x+=.001
//     console.log(sensor1)
//     marker.setLatLng([sensor1.x, sensor1.y])
// }, 100);


var marker2 = L.marker([sensor2.x, sensor2.y]);

marker2.addTo(map)