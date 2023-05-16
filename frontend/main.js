var map = L.map('map').setView([-34.6140305, -58.4517207], 12);
const todo = document.querySelector('.todo')
const mapa = document.querySelector('#map')
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let arrayMarkers = []
let marker

class Barrio{
    constructor(name,coords){
        this.name = name
        this.coords = coords
        this.polygon = L.polygon(this.coords)
    }
}


let barrios = []

$.getJSON("./barrios.geojson.json",json=>{
    
    json.features.forEach(barrio =>{
        let name = barrio.properties.BARRIO
        let coords = barrio.geometry.coordinates[0][0]
        coords.forEach((coord, index)=>{
    
            coords[index]= [coord[1],coord[0]]
        })

        let newBarrio = new Barrio(name,coords)
        barrios.push(newBarrio)

    })
})

setInterval(() => {
    barrios.forEach(barrio=>{
        barrio.polygon.addTo(map)
        barrio.polygon.on("mouseover",e=>{
            updateData(barrio.name,1,1)
        })
    })
}, 100);

const getSensors = async () => {

    oldArrayMarkers = arrayMarkers
    

    arrayMarkers = []






    let data = await fetch("http://localhost:3000/sensor")
    let json = await data.json()
    json.forEach(s => {
        if (s.humedad < 20) {
            marker = L.circle(s.coords, {
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.5,
                radius: 500
            })
        } else {
            marker = L.circle(s.coords, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 500
            })
        }


        
        marker.addTo(map);
        
        marker.on("mouseover", () => {
            
            todo.style.display = "block"
            
            
            
        })
        updateData(s.name, s.temperatura, s.humedad)
        
        
        
        
        
        arrayMarkers.push(marker)


    });

    oldArrayMarkers.map(mk => {
    
    
        // mk.setLatLng(new L.LatLng(mk.getLatLng().lat, mk.getLatLng().lng));
        
        mk.removeFrom(map)
    })
    
    oldArrayMarkers = []

}

const updateData = (nombre, temperatura, humedad) => {
    let dataNombre = document.getElementById("name")
    let dataTemperatura = document.getElementById("temp")
    let dataHumedad = document.getElementById('hum')
    dataNombre.innerHTML = nombre
    dataTemperatura.innerHTML = temperatura
    dataHumedad.innerHTML = humedad
}


getSensors()
setInterval(() => {
    getSensors()
}, 5000)

const xButton = document.querySelector('.xButton')


xButton.addEventListener('click', () => {
    todo.style.display = "none"
})