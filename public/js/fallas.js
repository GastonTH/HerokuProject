window.onload = init;

//para cuando cree el json, lo guarde
let jsonFile;

//value de la seccion
let seccionFiltro = "";

//desde y hasta para el filtro

let desde = "";
let hasta = "";

//variable de la estrella
let numeroEstrellas = "";
let idFallaEnviar = "";

//let si ha puntuado
let puntuadoIp = false;

//json de mongo
let jsonMongo;

//ip del dispositivo que accede
let ip = "";

//init
function init() {

    get_ip();

    document.getElementsByName("seleccionTamano").forEach(element => element.addEventListener("change", promesaCreadoraDelTodo));
    document.getElementById("selectSeccionFallas").addEventListener("change", promesaCreadoraDelTodo);
    document.getElementById("desde").addEventListener("input", promesaCreadoraDelTodo);
    document.getElementById("hasta").addEventListener("input", promesaCreadoraDelTodo);

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

let sec = 0;


//es la funcion que lanza despues de descargar todo el json
function promesaCreadoraDelTodo() {

    cargarMongo();

    //detecta que es todas
    if (document.getElementById("selectSeccionFallas").selectedIndex == -1) {
        sec = 0;
    } else {
        sec = document.getElementById("selectSeccionFallas").selectedIndex;

    }

    console.log(document.getElementById("selectSeccionFallas").selectedIndex);

    //vaciamos primero el div para mejor seleccion
    document.getElementById("listaFallas").innerHTML = "";
    document.getElementById("selectSeccionFallas").innerHTML = "";

    cargarSecciones();

    document.getElementById("selectSeccionFallas").selectedIndex = sec;

    seccionFiltro = document.getElementById("selectSeccionFallas");

    let filtroSecciones = jsonFile.features.filter(busquedaSeccion);
    let filtroAnyo = filtroSecciones.filter(busquedaAnyo);

    filtroAnyo.forEach(iteracion => {

        //------------------------------//
        //aqui se crea la falla como tal//
        //------------------------------//
        let falla = document.createElement("div");
        falla.classList.add("falla");

        falla.dataset.idFalla = iteracion.properties.id;

        //falla.addEventListener("mouseover", mostrarInfoFalla);
        //falla.addEventListener("mouseout", borrarClase);
        let parrafo = document.createElement("p");
        let imagenP = document.createElement("img");
        let imagenI = document.createElement("img");

        imagenI.src = iteracion.properties.boceto_i;
        imagenP.src = iteracion.properties.boceto;
        parrafo.innerHTML = iteracion.properties.nombre;

        if (document.getElementsByName("seleccionTamano")[1].checked) {
            falla.appendChild(imagenI);
        } else if (document.getElementsByName("seleccionTamano")[0].checked) {
            falla.appendChild(imagenP);
        }

        falla.appendChild(parrafo);

        cargarEstrellas(falla, iteracion);

        let boton = document.createElement("button");
        boton.innerHTML = "Enviar";
        boton.addEventListener("click", comprobarEnvio);
        falla.appendChild(boton);
        //ultimo paso
        document.getElementById("listaFallas").appendChild(falla);


    });

}

//funcion que coje la ip
function get_ip() {
    fetch("https://api.ipify.org/?format=jsonp&callback=get_ip").then(res => {
        console.log(res);
    }).then(res => {

        console.log(res);

    });
}


//esta funcion devuelve true or false si se cumple la condicion
//----------------------AQUI ESTAN LOS FILTROS----------------------------
function busquedaSeccion(iteracion) {

    //console.log(seccionFiltro.value);

    if (seccionFiltro.value == "Todas") {

        return true;

    } else {

        if (document.getElementsByName("seleccionTamano")[0].checked) { // principal
            return iteracion.properties.seccion == seccionFiltro.value;
        } else { // infantil
            return iteracion.properties.seccion_i == seccionFiltro.value;
        }
    }
}

function busquedaAnyo(iteracion) {

    let valorDesde = document.getElementById("desde").value;
    let valorHasta = document.getElementById("hasta").value;

    if (valorDesde == '') {
        valorDesde = 0;
    }

    if (valorHasta == '') {
        valorHasta = 9999;
    }

    if (valorDesde == 0 && valorHasta == 9999) {
        return true;
    }

    if (valorDesde <= iteracion.properties.anyo_fundacion && valorHasta >= iteracion.properties.anyo_fundacion) {
        console.log("cumple la condicion");
        return iteracion.properties.anyo_fundacion;
    }
}

//------------------------------------------------------------------------


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

//forma de cargar las estrellas dinamicamente
function cargarEstrellas(fallaTraida, iteracionTraida) {

    let formulario = document.createElement("form");
    formulario.classList.add("calificacion");
    formulario.setAttribute('method', 'POST');
    let inputHidden = document.createElement("input");
    inputHidden.setAttribute('type', 'hidden');
    inputHidden.value = iteracionTraida.properties.id;

    formulario.appendChild(inputHidden);

    let p = document.createElement("p");

    for (let i = 5; i >= 1; i--) {

        let labelEstrella = document.createElement("label");
        labelEstrella.innerHTML = "✦";
        labelEstrella.dataset.estrella = i;
        labelEstrella.addEventListener("click", seleccionEstrella);
        formulario.appendChild(labelEstrella);

    }
    //final
    fallaTraida.appendChild(formulario);

}
/*
function mostrarInfoFalla(e) {

    this.classList.add("hacerGrande");
    console.log(this);

}

function borrarClase(e) {

    this.classList.remove("hacerGrande");

}
*/
function seleccionEstrella(e) {
    let padreDelPadre = this.parentElement.parentElement;
    numeroEstrellas = this.dataset.estrella;
    idFallaEnviar = padreDelPadre.dataset.idFalla;
    this.classList.toggle("pulsado");

    if (padreDelPadre.dataset.idFalla == idFallaEnviar) {
        console.log("se puede enviar el id falla - " + idFallaEnviar + ", numeroEstrellas - " + numeroEstrellas);
    } else {
        console.log("puntua esta falla, no otra");
        //crear un div que diga eso
    }

}


//pequeño paso entes de enviar
function comprobarEnvio(e) {

    let padre = this.parentElement;
    console.log(padre);

    if (padre.dataset.idFalla != idFallaEnviar) {
        alert("comprueba que has votado o puntuado correctamente.");
    }

}
//esta es la llamada que tendra el boton
function valorar(e) {

    //enviar un array de datos

    if (numeroEstrellas == '' || numeroEstrellas == null) {
        numeroEstrellas == 0;
    }

    var url = '/puntuaciones';
    var data = { idFalla: idFallaEnviar, ip: '127.0.0.1', puntuacion: numeroEstrellas }; //idfalla, ip, puntuacion

    fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));

}

function cargarMongo() {

    fetch("/puntuaciones", {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));

}