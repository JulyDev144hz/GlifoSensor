const axios = require("axios");
//             Boca                           Puerto Madero               San telmo
const ids = ["654383104ee49380dd519bc2", "654383604ee49380dd519bde", "654383bf4ee49380dd519c08",
  //              Constitucion                  Monserrat                   Retiro
  "654384074ee49380dd519c28", "6543843f4ee49380dd519c42", "6543849d4ee49380dd519c6c",
  //              Recoleta                  Balvanera                   Parque Patricios
  "654384ca4ee49380dd519c82", "654384ea4ee49380dd519c93", "6543858d4ee49380dd519ce3",
  //              San Cristobal                  Barracas                   Nueva Pompeya
  "6543852a4ee49380dd519cb0", "6543866c4ee49380dd519d41", "654386904ee49380dd519d53",
  //              Boedo                           Almagro                   Villa crespo 
  "654386b84ee49380dd519d67", "654386da4ee49380dd519d79", "654386f94ee49380dd519d89",
  //              Parque Chacabuco                Flores                   La Paternal 
  "654387374ee49380dd519da5", "6543875d4ee49380dd519db9", "654387eb4ee49380dd519df6",
  //              Villa general mitre        Parque Avellaneda            Floresta 
  "654388274ee49380dd519e12", "654388724ee49380dd519e34", "6543889f4ee49380dd519e4a",
  //              Villa Ortuzar                 Villa Pueyrredon            Agronomia 
  "654388e84ee49380dd519e6c", "6543892c4ee49380dd519e8c", "6543896b4ee49380dd519ea8",
  //              Villa del parque              Villa Devoto                 Villa Santa Rita 
  "654389e24ee49380dd519edc", "65438a154ee49380dd519ef4", "65438a6b4ee49380dd519f1a",
  //              Villa real                    Monte Castro                 Villa Luro 
  "65438ab04ee49380dd519f3a", "65438ad74ee49380dd519f4e", "65438bc54ee49380dd519fb4",
  //              Velez Sarsfield              Versalles                      Liniers
  "65438b584ee49380dd519f86", "65438c904ee49380dd51a00e", "65438c424ee49380dd519feb",
  //              Caballito                       San Nicolas                    Palermo
  "649db2d77fb4018a9a035cca", "649db23a7b26de28b0f4db3e", "649dfc38a5fccda3c3d26ad9",
  //              Parque Chas                    Colegiales                    Belgrano
  "649e3c545932e6186b10721d", "649e3bf65932e6186b1071e3", "649dfc7aa5fccda3c3d26b00",
  //              Villa Urquiza                    Coghlan                    Nuñez
  "649df71d88eb12d846da1d50", "649df9eabc45607a807de045", "654393734ee49380dd51a411",
]

const main = () => {
  try {
    ids.map(id => {
      let humedad = Math.floor(Math.random() * 30);
      let temperatura = Math.floor(Math.random() * 30);
      let co2 = Math.floor(Math.random() * 30);
      axios
        .put(`https://citysensor.glitch.me/sensor/${id}`, {
          name: "demostracion palermo",
          temperatura: temperatura,
          humedad: humedad,
          co2: co2,
        })
        .then((resp) => {
          console.log(resp.data);
        });
    })
  } catch (error) {
    console.error(error);
  }
};

let tiempo = 1000 * 60 * 15

tiempo = 1000 * 30

main();
setInterval(() => {
  main()
}, tiempo);