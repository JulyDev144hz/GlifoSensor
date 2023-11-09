// Muestra la informacion de cada dato contaminante
$("#co2Info").on("click", e => {
    Swal.fire({
        icon: 'info',
        title: 'Dioxido de carbono',
        text: 'El dióxido de carbono es un compuesto químico formado por moléculas que tienen cada una un átomo de carbono unido covalentemente por doble enlace a dos átomos de oxígeno.',
        footer: '<a target="_blank" href="https://es.wikipedia.org/wiki/Di%C3%B3xido_de_carbono">Mas informacion</a>'
    })
})
$("#tempInfo").on("click", e => {
    Swal.fire({
        icon: 'info',
        title: 'Temperatura',
        text: 'La temperatura es una cantidad física que expresa cuantitativamente las percepciones de calor y frío.',
        footer: '<a target="_blank" href="https://es.wikipedia.org/wiki/Temperatura">Mas informacion</a>'
    })

})
$("#humInfo").on("click", e => {
    Swal.fire({
        icon: 'info',
        title: 'Humedad',
        text: 'La humedad es la cantidad de vapor de agua que hay en el aire. Se denomina así al agua que impregna un cuerpo o al vapor presente en la atmósfera, el cual, por condensación, llega a formar las nubes, que ya no están formadas por vapor sino por agua.',
        footer: '<a target="_blank" href="https://es.wikipedia.org/wiki/Humedad">Mas informacion</a>'
    })

})
$("#03Info").on("click", e => {
    Swal.fire({
        icon: 'info',
        title: 'Ozono',
        text: 'El ozono (O3) es una sustancia cuya molécula está compuesta por tres átomos de oxígeno, formada al disociarse los dos átomos que componen el gas oxígeno. ',
        footer: '<a target="_blank" href="https://es.wikipedia.org/wiki/Ozono">Mas informacion</a>'
    })

})
$("#uvInfo").on("click", e => {
    Swal.fire({
        icon: 'info',
        title: 'Radiación Ultravioleta',
        text: 'La radiación ultravioleta (UV) es una forma de radiación no ionizante que es emitida por el sol y fuentes artificiales, como las camas bronceadoras. Aunque ofrece algunos beneficios a las personas, como la producción de vitamina D, también puede causar riesgos para la salud.',
        footer: '<a target="_blank" href="https://www.cdc.gov/spanish/nceh/especiales/radiacionuv/index.html">Mas informacion</a>'
    })

})
$("#so2Info").on("click", e => {
    Swal.fire({
        icon: 'info',
        title: 'Materia Particulada',
        text: 'Son partículas muy pequeñas en el aire que tiene un diámetro de 2.5 micrómetros (aproximadamente 1 diezmilésimo de pulgada) o menos de diámetro.',
        footer: '<a target="_blank" href="https://oehha.ca.gov/calenviroscreen/indicator/pm25#:~:text=%C2%BFQu%C3%A9%20es%20PM%202.5%3F,grosor%20de%20un%20cabello%20humano.">Mas informacion</a>'
    })

})



const types = document.querySelectorAll(".type");

    types.forEach((type) => {
      const div = type.querySelector(".info");

      type.addEventListener("mouseover", () => {
        div.style.display = "block";
      });

      type.addEventListener("mouseout", () => {
        div.style.display = "none";
      });
    });


    