var map = L.map('map').setView([-34.6140305,-58.4517207], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let arrayMarkers = []
let marker 
const getSensors = async () => {
    
    arrayMarkers.map(marker => {
        map.removeLayer(marker)
    })

    arrayMarkers = []

    let data = await fetch("http://localhost:3000/sensor")
    let json = await data.json()
    json.forEach(s => {
        if(s.humedad < 20){

            marker = L.circle(s.coords, {
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.5,
                radius: 500
            })
        }else{
            marker = L.circle(s.coords, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 500
            })
        }
        marker.addTo(map);

        marker.on("click", ()=>{
            updateData(s.name, s.co2, s.temperatura, s.humedad)
            let data = document.querySelector('aside')
            data.style.display = "flex"
            let button = document.querySelector('.closeButton button')
            button.style.display = "flex"

            button.addEventListener('click', ()=>{
                data.style.display = "none"
            })
           
        })
       

        arrayMarkers.push(marker)
    });
}

const updateData = (nombre, co2, temperatura, humedad) =>{
    let dataNombre = document.getElementById("name")
    let dataCo2 = document.getElementById("co2")
    let dataTemperatura = document.getElementById("temp")
    let dataHumedad = document.getElementById('hum')
    dataNombre.innerHTML = nombre
    dataCo2.innerHTML = co2
    dataTemperatura.innerHTML = temperatura
    dataHumedad.innerHTML = humedad
}


getSensors()
setInterval(() => {
    getSensors()
}, 5000);

