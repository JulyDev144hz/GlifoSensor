var map = L.map('map').setView([-34.6140305,-58.4517207], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let arrayMarkers = []

const getSensors = async () => {

    arrayMarkers.map(marker => {
        map.removeLayer(marker)
    })

    arrayMarkers = []

    let data = await fetch("http://localhost:3000/sensor")
    let json = await data.json()
    json.forEach(s => {
        let marker = L.marker(s.coords)
        marker.addTo(map);
        marker.bindPopup(`<b>${s.name}</b>
        <ul>
        <li>CO2: ${s.co2}</li>
        </ul>
        `)

        arrayMarkers.push(marker)
    });
}

getSensors()
setInterval(() => {
    getSensors()
}, 5000);