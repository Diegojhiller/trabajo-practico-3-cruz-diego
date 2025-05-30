
let personajesDB = [];

let contenedorResultados;
function limpiarVista() {
  contenedorResultados.innerHTML = "";
}

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

function mostrarAviso(texto) {
  const aviso = document.getElementById("aviso");
  aviso.innerHTML = `
    <div class="alert alert-warning mt-3 mb-0" role="alert">
      ${texto}
    </div>
  `;
}

function limpiarAviso() {
  const aviso = document.getElementById("aviso");
  aviso.innerHTML = "";
}

async function cargarTodosLosPersonajes() {
  try {
    const resp = await fetch("https://dragonball-api.com/api/characters");
    const data = await resp.json();
    personajesDB = data.items;
    pintarPersonajes(personajesDB);
  } catch (err) {
    mostrarAviso("Error al obtener los personajes.");
    console.error("Falla al cargar personajes:", err);
  }
}


async function filtrarPersonajes(nombre) {
  try {
    const resp = await fetch(`https://dragonball-api.com/api/characters?name=${nombre}`);
    const data = await resp.json();

    if (!data.items || data.items.length === 0) {
      mostrarAviso("No se encontraron personajes con ese nombre, Insecto.");
    } else {
      pintarPersonajes(data.items);
    }
  } catch (err) {
    mostrarAviso("Ocurrió un error al consultar la API.");
    console.error("Falla en búsqueda:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const inputNombre = document.getElementById("campoBusqueda");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnLimpiar = document.getElementById("btnLimpiar");
  contenedorResultados = document.getElementById("zonaResultados");

  let divAviso = document.createElement("div");
  divAviso.id = "aviso";
  btnBuscar.parentNode.parentNode.appendChild(divAviso);

  btnBuscar.addEventListener("click", () => {
    limpiarAviso();
    const texto = inputNombre.value.trim();

    if (texto === "") {
      mostrarAviso("Por favor, ingresá un nombre para buscar.");
    } else {
      filtrarPersonajes(texto);
    }
  });


  btnLimpiar.addEventListener("click", () => {
    limpiarAviso();
    inputNombre.value = "";
    pintarPersonajes(personajesDB); 
  });

  
  cargarTodosLosPersonajes();
});
