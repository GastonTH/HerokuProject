window.onload = init;

//para cuando cree el json, lo guarde
let jsonFile;

//value de la seccion
let seccionFiltro = "";

function init() {

    document.getElementsByName("seleccionTamano").forEach(element => element.addEventListener("change", promesaCreadoraDelTodo));
    document.getElementById("selectSeccionFallas").addEventListener("change", cambiarFallas);
    descargarJson();

}

function descargarJson() {

    fetch("http://mapas.valencia.es/lanzadera/opendata/Monumentos_falleros/JSON").then(function(response) {

        return archivoJson = response.json();

    }).then(function(jsonDevuelto) {

        jsonFile = jsonDevuelto;

        console.log(jsonDevuelto);

    }).then(promesaCreadoraDelTodo);
}

function cambiarFallas() {

    seccionFiltro = this.value;
    document.getElementById("listaFallas").innerHTML = "";

    let filtro = jsonFile.features.filter(busquedaJson);

    filtro.forEach(iteracion => {
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

        //aqui añado todo lo creado iterativamente

        if (document.getElementsByName("seleccionTamano")[1].checked) {
            falla.appendChild(imagenI);
        } else if (document.getElementsByName("seleccionTamano")[0].checked) {
            falla.appendChild(imagenP);
        }

        falla.appendChild(parrafo);
        falla.appendChild(boton);
        document.getElementById("listaFallas").appendChild(falla);
    });

}

function promesaCreadoraDelTodo() {

    document.getElementById("listaFallas").innerHTML = "";
    document.getElementById("selectSeccionFallas").innerHTML = "";

    cargarSecciones();

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

        //aqui añado todo lo creado iterativamente

        if (document.getElementsByName("seleccionTamano")[1].checked) {
            falla.appendChild(imagenI);
        } else if (document.getElementsByName("seleccionTamano")[0].checked) {
            falla.appendChild(imagenP);
        }

        falla.appendChild(parrafo);
        falla.appendChild(boton);
        document.getElementById("listaFallas").appendChild(falla);


    });

}
//esta funcion devuelve true or false si se cumple la condicion
function busquedaJson(iteracion) {

    if (document.getElementsByName("seleccionTamano")[0].checked) { // principal
        return iteracion.properties.seccion.startsWith(seccionFiltro);
    } else { // infantil
        return iteracion.properties.seccion_i.startsWith(seccionFiltro);
    }

}

//esta funcion carga las secciones, distinguiendo si es 
function cargarSecciones() {

    let seccioneSet = new Set;

    jsonFile.features.forEach(iteracion => {

        if (document.getElementsByName("seleccionTamano")[1].checked) { //infantil
            seccioneSet.add(iteracion.properties.seccion_i);

        } else if (document.getElementsByName("seleccionTamano")[0].checked) { //principal
            seccioneSet.add(iteracion.properties.seccion);

        }

    });

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