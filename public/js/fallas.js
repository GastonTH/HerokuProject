window.onload = init;

//variable que usaremos para saber que se a seleccionado en el radio
let radioSeleccion = "";

//para cuando cree el json, lo guarde
let jsonOriginal;
let jsonFile;

function init() {

    document.getElementsByName("seleccionTamano").forEach(element => element.addEventListener("change", cambio));
    cambio( /*"todas"*/ );
}

function promesaCreadoraDelTodo(tamano) {

    document.getElementById("listaFallas").innerHTML = "";

    //nos guardamos el tamaño
    radioSeleccion = tamano;

    console.log(radioSeleccion);

    let secciones = new Set;

    fetch("http://mapas.valencia.es/lanzadera/opendata/Monumentos_falleros/JSON")
        .then(function(response) {
            return archivoJson = response.json();
        })
        .then(function(jsonDevuelto) {

            console.log(jsonDevuelto);

            jsonFile = jsonDevuelto;

            //const filtro = jsonDevuelto.features.filter(busquedaJson);

            //esto crea el div de la lista de las fallas

            jsonDevuelto.features.forEach(iteracion => {
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

                secciones.add(iteracion.properties.seccion);

                //aqui añado todo lo creado iterativamente

                if (radioSeleccion == "infantil") {
                    falla.appendChild(imagenI);

                    console.log("infantil");
                } else if (radioSeleccion == "principal") {
                    falla.appendChild(imagenP);

                    console.log("principal");
                } else {
                    falla.appendChild(imagenP);
                    falla.appendChild(imagenI);
                    console.log("todas");
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
            document.getElementById("selectFallas").appendChild(opTodas);

            secciones.forEach(element => {
                let opcion = document.createElement("option");
                opcion.innerHTML = element;
                document.getElementById("selectFallas").appendChild(opcion);
                console.log(element);
            });


        });
}

//esta funcion muestra de forma dinamica el cambio de las modalidades
function cambio() {

    //opcion obligatoria ya que no lo llamo de otra forma XD
    if (this.value == undefined) {

        promesaCreadoraDelTodo("todas");

    } else {

        promesaCreadoraDelTodo(this.value);
    }

}