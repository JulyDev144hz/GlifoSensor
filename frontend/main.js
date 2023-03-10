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
        
        marker.on("click", ()=>{
            updateData(s.name, s.co2)
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

const updateData = (nombre, co2) =>{
    let dataNombre = document.getElementById("name")
    let dataCo2 = document.getElementById("co2")
    dataNombre.innerHTML = nombre
    dataCo2.innerHTML = co2
}


getSensors()
setInterval(() => {
    getSensors()
}, 5000);

