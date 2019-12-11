window.onload = init;

//para cuando cree el json, lo guarde
let jsonFile;

function init() {

    document.getElementById("botonIniciadorDelTodo");

    promesaCreadoraDeTodo();

}

function promesaCreadoraDeTodo() {

    let secciones = new Set;

    fetch("http://mapas.valencia.es/lanzadera/opendata/Monumentos_falleros/JSON")
        .then(function(response) {
            return archivoJson = response.json();
        })
        .then(function(jsonDevuelto) {

            console.log(jsonDevuelto);

            jsonFile = jsonDevuelto;

            //esto crea el div de la lista de las fallas
            jsonDevuelto.features.forEach(iteracion => {
                let falla = document.createElement("div");
                let parrafo = document.createElement("p");
                let imagen = document.createElement("img");
                let boton = document.createElement("button");
                boton.innerHTML = "Ubicacion";
                //boton.addEventListener("click", llamadaUbicacion);
                imagen.src = iteracion.properties.boceto;
                parrafo.innerHTML = iteracion.properties.nombre;

                //creo el array de secciones con el set, que hace que no se repita lo que le pasen

                secciones.add(iteracion.properties.seccion);


                //aqui añado todo lo creado iterativamente
                falla.appendChild(imagen);
                falla.appendChild(parrafo);
                falla.appendChild(boton);
                document.getElementById("listaFallas").appendChild(falla);

            });


            console.log(secciones);

            secciones.forEach(element => {
                console.log(element);
            });


        });

    //aqui creamos el select

    //document.getElementById("selectFallas");

}

function llamadaUbicacion() {

    console.log("ubicacion xD");
}