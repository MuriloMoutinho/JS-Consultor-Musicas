//CSS
var dark = document.querySelector('#dark');
var light = document.querySelector('#light');
var cont = document.querySelector('#container');

function Dark(){
    cont.classList.remove('dlight');
    cont.classList.add('ddark');
    document.body.style.backgroundImage="url('img/wpb.jpg')";
}
function Light(){
    cont.classList.remove('ddark');
    cont.classList.add('dlight');
    document.body.style.backgroundImage="url('img/wp.jpg')";
}
dark.addEventListener("click", Dark);
light.addEventListener("click", Light);


//VARIÁVEIS
var artista = document.querySelector('#inp1');
var data = document.querySelector('#inp2');
var radio = document.querySelector('#album');
var result = document.querySelector("#result");
var submt = document.querySelector("#sub");
var dataatu = new Date();
var ano = dataatu.getFullYear();
const url = "https://api.spotify.com/v1/";

//Dados Da Conta -------
var clientID = "yourClientID";
var secretID = "yourSecretID";
//----------------------

function printbum(album){

    result.innerHTML += `
    <div class="musicas"> 
    <p>${album["items"][i]["name"]}</p> 
    <img src="${album["items"][i]["images"][0]["url"]}"> 
    </div>`
}

//API
//ATUALIZADOR DE TOKEN
fetch('https://accounts.spotify.com/api/token', {
    body: `grant_type=client_credentials`,
    headers: {
      'Authorization': `Basic ${btoa(clientID+':'+secretID)}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  })
  .then(response => response.json())
  .then(token => {
    key = token['access_token'];
    })
  .catch(err => console.log(err))

//REQUISIÇÃO DOS DADOS
function Resultado(){
    if (artista.value.length == 0) {        //VALIDAÇÃO DOS INPUTS
        result.innerHTML='Insira o nome do artista';
    }
    else if(Number(data.value)>ano || Number(data.value)<0){
        result.innerHTML=`Insira uma data válida`;  
    } 

    else {  
        fetch(url+`search?q=${artista.value}&type=artist&limit=1` , {    //REQUISIÇÃO DO ID DO ARTISTA
            method: "GET",
            headers: {
                "Authorization": `Bearer ${key}`
            }})
        .then(response => response.json())
        .then(arts => { 
            
            var id = arts["artists"]["items"][0]["id"];
            var contador = 0;

            if(radio.checked){       //REQUISIÇÃO DOS ÁLBUNS

                fetch(url+`artists/${id}/albums?include_groups=album&limit=50`, {     
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${key}`
                    }})
                .then(response => response.json())
                .then(album => {
             
                    result.innerHTML=`<h3>${arts["artists"]["items"][0]["name"]}</h3>`;
                    for(i=0;album["items"]["length"]>i;i++){        //VALIDAÇÃO DOS ÁLBUNS
                        if(String(data.value)== 0){

                            printbum(album);
                            contador ++

                        } else if(album["items"][i]["release_date"].slice(0,4) == String(data.value)){

                            printbum(album);
                            contador ++

                        }
                    }
                    if(contador==0){result.innerHTML="Sem resultados para essa data"}
                }
                )
            }

            else {            //REQUISIÇÃO DOS SINGLES

                fetch(url+`artists/${id}/albums?include_groups=single&limit=50`, {
                    method: "GET",
                    headers: {
                    "Authorization": `Bearer ${key}`
                }})
                .then(response => response.json())
                .then(album => {

                    result.innerHTML=`<h3>${arts["artists"]["items"][0]["name"]}</h3>`;
                    
                    for(i=0;album["items"]["length"]>i;i++){   //VALIDAÇÃO DOS SINGLES
                        if(String(data.value)== 0){
                        
                            printbum(album);
                            contador ++

                        } else if(album["items"][i]["release_date"].slice(0,4) == String(data.value)){

                            printbum(album);
                            contador ++
                        }
                    }
                    if(contador==0){result.innerHTML="Sem resultados para essa data"}
                }
                )
            }
        })
        .catch(result.innerHTML="Artista não encontrado")
    }
}
submt.addEventListener("click", Resultado);