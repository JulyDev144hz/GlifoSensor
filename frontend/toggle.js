const toggle = document.querySelector("#toggle")
const body = document.querySelector('body')

toggle.addEventListener("click", function(){

    body.classList.toggle("dark-theme")
})

const infoButtons = document.querySelectorAll('.masInfo')
const modal = document.querySelector('.modal')
const cerrarModales = document.querySelectorAll('.modal_close')
const modalTitle = document.querySelector('.modalTitle')
const modalDesc = document.querySelector('.modalText')
var infoType = "" 


fetch("http://localhost:3000/info")
    .then(res=>res.json())
    .then(data => {
        for(const button of infoButtons){
            
            button.addEventListener('click', (e)=>{
                
                e.preventDefault()
                modal.classList.add('modal--show')

                switch(button.id){
                    case 'co2Info':
                        infoType = "DIOXIDO DE CARBONO"
                        break;
                    case 'so2Info':
                        infoType = "DIOXIDO DE AZUFRE"
                        break;
                    default:
                        infoType = ''

                }

                const filtrar = data.filter(i => i.title == infoType)

                if(filtrar.length > 0){
                    const { title, descripcion, formula } = filtrar[0];
                    modalTitle.innerHTML = title;
                    modalDesc.innerHTML = descripcion
                }



                modalTitle.innerHTML = title
            })
        }
    })



for(let cerrarModal of cerrarModales){

    cerrarModal.addEventListener('click', (e)=>{
        e.preventDefault()
        modal.classList.remove('modal--show')
    })
}
