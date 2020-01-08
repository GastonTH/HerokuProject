window.onload = init;

//para cuando cree el json, lo guarde
let jsonFile;

//value de la seccion
let seccionFiltro = "";

//desde y hasta para el filtro

let desde = "";
let hasta = "";

//variable de la estrella
let estrella = "✦";

//init
function init() {

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

        cargarEstrellas(falla, iteracion);

        //falla.appendChild(boton);
        document.getElementById("listaFallas").appendChild(falla);


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
    //formulario.setAttribute('method', "post");
    //formulario.setAttribute('action', "submit.php");
    let inputHidden = document.createElement("input");
    inputHidden.setAttribute('type', 'hidden');
    inputHidden.value = iteracionTraida.properties.id;

    formulario.appendChild(inputHidden);

    fallaTraida.appendChild(formulario);

    for (let i = 1; i <= 5; i++) {

        let labelEstrella = document.createElement("label");
        labelEstrella.innerHTML = "✦";
        formulario.appendChild(labelEstrella);

    }


}

function mostrarInfoFalla(e) {

    this.classList.add("hacerGrande");
    console.log(this);

}

function borrarClase(e) {

    this.classList.remove("hacerGrande");

}