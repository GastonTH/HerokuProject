window.onload = init;
//variable que usamos para saber que se ha seleccionado en el select de secciones

let filtroSeccion = "";

//para cuando cree el json, lo guarde
let jsonOriginal;
let jsonFile;

function init() {

    document.getElementsByName("seleccionTamano").forEach(element => element.addEventListener("change", cambio));
    //document.getElementById("selectSeccionFallas").addEventListener("change", cambio);
    descargarJson();

}

function descargarJson() {

    fetch("http://mapas.valencia.es/lanzadera/opendata/Monumentos_falleros/JSON").then(function(response) {

        return archivoJson = response.json();

    }).then(function(jsonDevuelto) {

        jsonFile = jsonDevuelto;

        console.log(jsonDevuelto);

    }).then(cambio);
}


//esta funcion muestra de forma dinamica el cambio de las modalidades
function cambio() {

    console.log(this.value);

    //opcion obligatoria ya que no lo llamo de otra forma XD
    if (this.value == undefined) {

        promesaCreadoraDelTodo("principal");

    } else {

        promesaCreadoraDelTodo(this.value);
    }

}

function promesaCreadoraDelTodo(tamano) {

    document.getElementById("listaFallas").innerHTML = "";

    //const filtro = jsonDevuelto.features.filter(busquedaJson);

    //esto crea el div de la lista de las fallas

    let seccioneSet = new Set;

    jsonFile.features.forEach(iteracion => {
        let falla = document.createElement("div");
        let parrafo = document.createElement("p");
        let imagenP = document.createElement("img");
        let imagenI = document.createElement("img");
        let boton = document.createElement("button");
        //boton.innerHTML = "Ubicacion";
        //boton.addEventListener("click", llamadaUbicacion);
        imagenI.src = iteracion.properties.boceto_i;
        imagenP.src = iteracion.properties.boceto;
        parrafo.innerHTML = iteracion.properties.nombre;

        //creo el array de secciones con el set, que hace que no se repita lo que le pasen

        //secciones.add(iteracion.properties.seccion);

        //aqui añado todo lo creado iterativamente

        if (tamano == "infantil") {
            falla.appendChild(imagenI);

            //console.log("infantil");
        } else if (tamano == "principal") {
            falla.appendChild(imagenP);

            //console.log("principal");
        } else if ("todas") {
            falla.appendChild(imagenP);
            falla.appendChild(imagenI);
            falla.appendChild(imagenI);

            //console.log("infantil");
        }

        falla.appendChild(parrafo);
        falla.appendChild(boton);
        document.getElementById("listaFallas").appendChild(falla);


    });
    //aqui creamos el select

    //console.log(secciones);

    //lo recorremos y le añadimos la opcion

    let opTodas = document.createElement("option");
    opTodas.innerHTML = "Todas";
    document.getElementById("selectSeccionFallas").appendChild(opTodas);

    seccioneSet.forEach(element => {
        let opcion = document.createElement("option");
        opcion.innerHTML = element;
        document.getElementById("selectSeccionFallas").appendChild(opcion);
        //console.log(element);
    });

}