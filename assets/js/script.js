// Arreglo donde vamos a guardar todos los personajes obtenidos de la API
let personajesDB = [];

// Referencia al contenedor donde mostraremos los resultados
let contenedorResultados;

// Esta función borra los personajes mostrados anteriormente
function limpiarVista() {
  contenedorResultados.innerHTML = "";
}

// Esta función toma una lista de personajes y crea tarjetas para mostrarlos
function pintarPersonajes(lista) {
  limpiarVista();

  lista.forEach(p => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "col-md-4 mb-4";
    tarjeta.innerHTML = `
      <div class="card h-100 shadow">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text"><strong>Raza:</strong> ${p.race}</p>
          <p class="card-text"><strong>Género:</strong> ${p.gender}</p>
        </div>
      </div>
    `;
    contenedorResultados.appendChild(tarjeta);
  });
}

// Esta función muestra un mensaje de error o información
function mostrarAviso(texto) {
  const aviso = document.getElementById("aviso");
  aviso.innerHTML = `
    <div class="alert alert-warning mt-3 mb-0" role="alert">
      ${texto}
    </div>
  `;
}

// Esta función borra el mensaje de aviso si hay uno
function limpiarAviso() {
  const aviso = document.getElementById("aviso");
  aviso.innerHTML = "";
}

// Esta función obtiene todos los personajes desde la API
async function cargarTodosLosPersonajes() {
  try {
    const resp = await fetch("https://dragonball-api.com/api/characters");
    const data = await resp.json();
    personajesDB = data.items; // Guardamos los personajes en nuestra variable global
    pintarPersonajes(personajesDB); // Mostramos los personajes
  } catch (err) {
    mostrarAviso("Error al obtener los personajes.");
    console.error("Falla al cargar personajes:", err);
  }
}

// Esta función busca personajes según un nombre
async function filtrarPersonajes(nombre) {
  try {
    const resp = await fetch(`https://dragonball-api.com/api/characters?name=${nombre}`);
    const data = await resp.json();

    if (!data.items || data.items.length === 0) {
      mostrarAviso("No se encontraron personajes con ese nombre.");
    } else {
      pintarPersonajes(data.items);
    }
  } catch (err) {
    mostrarAviso("Ocurrió un error al consultar la API.");
    console.error("Falla en búsqueda:", err);
  }
}

// Esperamos que el HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const inputNombre = document.getElementById("campoBusqueda");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnLimpiar = document.getElementById("btnLimpiar");
  contenedorResultados = document.getElementById("zonaResultados");

  // Creamos un contenedor para mostrar mensajes
  let divAviso = document.createElement("div");
  divAviso.id = "aviso";
  btnBuscar.parentNode.parentNode.appendChild(divAviso);

  // Evento al hacer clic en "Buscar"
  btnBuscar.addEventListener("click", () => {
    limpiarAviso();
    const texto = inputNombre.value.trim();

    if (texto === "") {
      mostrarAviso("Por favor, ingresá un nombre para buscar.");
    } else {
      filtrarPersonajes(texto);
    }
  });

  // Evento al hacer clic en "Limpiar"
  btnLimpiar.addEventListener("click", () => {
    limpiarAviso();
    inputNombre.value = "";
    pintarPersonajes(personajesDB); // Muestra todos nuevamente
  });

  // Cargamos los personajes al inicio
  cargarTodosLosPersonajes();
});
