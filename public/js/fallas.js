window.onload = init;

//para cuando cree el json, lo guarde
let jsonFile;

//value de la seccion
let seccionFiltro = "";

//desde y hasta para el filtro

let desde = "";
let hasta = "";


function init() {

    document.getElementsByName("seleccionTamano").forEach(element => element.addEventListener("change", promesaCreadoraDelTodo));
    document.getElementById("selectSeccionFallas").addEventListener("change", promesaCreadoraDelTodo);
    document.getElementById("desde").addEventListener("input", promesaCreadoraDelTodo);
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
    //console.log(filtroSecciones);
    let filtroAnyo = filtroSecciones.filter(busquedaAnyo);
    //console.log(filtroAnyo);
    //console.log(document.getElementById("desde").value);
    //console.log(document.getElementById("hasta").value);

    filtroSecciones.forEach(iteracion => {

        //------------------------------//
        //aqui se crea la falla como tal//
        //------------------------------//
        let falla = document.createElement("div");
        falla.classList.add("falla");
        //falla.addEventListener("mouseover", mostrarInfoFalla);
        //falla.addEventListener("mouseout", borrarClase);
        let parrafo = document.createElement("p");
        let imagenP = document.createElement("img");
        let imagenI = document.createElement("img");
        //let boton = document.createElement("button");
        //boton.innerHTML = "Ubicacion";
        //boton.addEventListener("click", llamadaUbicacion);
        imagenI.src = iteracion.properties.boceto_i;
        imagenP.src = iteracion.properties.boceto;
        parrafo.innerHTML = iteracion.properties.nombre;

        if (document.getElementsByName("seleccionTamano")[1].checked) {
            falla.appendChild(imagenI);
        } else if (document.getElementsByName("seleccionTamano")[0].checked) {
            falla.appendChild(imagenP);
        }

        falla.appendChild(parrafo);
        //falla.appendChild(boton);
        document.getElementById("listaFallas").appendChild(falla);


    });

}
//esta funcion devuelve true or false si se cumple la condicion
//----------------------AQUI ESTAN LOS FILTROS----------------------------
function busquedaSeccion(iteracion) {

    console.log(seccionFiltro.value);

    if (seccionFiltro.value == "Todas") {
        return true;
    } else {

        if (document.getElementsByName("seleccionTamano")[0].checked) { // principal
            return iteracion.properties.seccion.startsWith(seccionFiltro);
        } else { // infantil
            return iteracion.properties.seccion_i.startsWith(seccionFiltro);
        }
    }
}

function busquedaAnyo(iteracion) {

    let valorDesde = document.getElementById("desde").value;
    let valorHasta = document.getElementById("hasta").value;

    console.log(iteracion.properties.anyo_fundacion_i.startsWith());

    if (document.getElementById("desde").value == '') {
        return true
    } else {

        if (document.getElementsByName("seleccionTamano")[0].checked) { // principal
            return iteracion.properties.anyo_fundacion.startsWith(valorDesde);
        } else { // infantil
            return iteracion.properties.anyo_fundacion_i.startsWith();
        }
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

function mostrarInfoFalla(e) {

    this.classList.add("hacerGrande");
    console.log(this);

}

function borrarClase(e) {

    this.classList.remove("hacerGrande");

}