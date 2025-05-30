
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
      <div class="card h-100 shadow bg-light">
        <img src="${p.image}" class="card-img-top img-fluid" style="height: 250px; object-fit: contain;" alt="${p.name}">
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


function filtrarPersonajes(nombre) {
  limpiarAviso();
  limpiarVista();

  const nombreBuscado = nombre.toLowerCase();
  const filtrados = personajesDB.filter(p => p.name.toLowerCase().includes(nombreBuscado));

  if (filtrados.length === 0) {
    mostrarAviso("No se encontraron personajes con ese nombre.");
  } else {
    pintarPersonajes(filtrados);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const inputNombre = document.getElementById("campoBusqueda");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnLimpiar = document.getElementById("btnLimpiar");
  contenedorResultados = document.getElementById("zonaResultados");

  
  btnBuscar.addEventListener("click", () => {
    const texto = inputNombre.value.trim();
    if (texto === "") {
      mostrarAviso("Por favor, ingresá un nombre para buscar.");
    } else {
      filtrarPersonajes(texto);
    }
  });

  
  inputNombre.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      btnBuscar.click();
    }
  });

  
  btnLimpiar.addEventListener("click", () => {
    limpiarAviso();
    inputNombre.value = "";
    pintarPersonajes(personajesDB);
  });

  
  cargarTodosLosPersonajes();
});