/* =========================================
   SELECCIÓN DE ELEMENTOS DEL DOM
   ========================================= */

const inputTarea = document.querySelector('#input-nueva-tarea');
const botonAgregar = document.querySelector('#btn-agregar');
const listaTareas = document.querySelector('#lista-contenedor');
const contadorPendientes = document.querySelector('#contador-tareas');
const mensajeError = document.querySelector('#msj-error');

/* =========================================
   FUNCIONES DE VALIDACIÓN
   ========================================= */

function esEntradaValida(texto) {
  // trim() elimina los espacios en blanco de los extremos
  return texto.trim() !== '';
}

/* =========================================
   FUNCIONES DE RENDERIZADO / DOM
   ========================================= */

function crearElementoTarea(texto) {
  const elementoLi = document.createElement('li');
  elementoLi.classList.add('tarea');

  const textoSpan = document.createElement('span');
  textoSpan.classList.add('texto-tarea');
  textoSpan.textContent = texto; // Seguro frente a XSS, a diferencia de innerHTML

  const botonEliminar = document.createElement('button');
  botonEliminar.classList.add('boton-eliminar');
  botonEliminar.setAttribute('aria-label', 'Eliminar tarea');
  
  // Icono SVG para eliminar, usamos innerHTML solo para un string estático y seguro
  botonEliminar.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 6L6 18M6 6l12 12"></path>
    </svg>
  `;

  elementoLi.append(textoSpan, botonEliminar);
  return elementoLi;
}

function actualizarContador() {
  // Selecciona todas las tareas que no tienen la clase completada
  const tareasPendientes = document.querySelectorAll('.tarea:not(.completada)');
  contadorPendientes.textContent = tareasPendientes.length;
}

function mostrarError() {
  inputTarea.classList.add('error-borde');
  mensajeError.classList.remove('oculto');
  
  // Remover la clase de animación para que se pueda volver a aplicar si es necesario
  setTimeout(() => {
    inputTarea.classList.remove('error-borde');
  }, 400); 
}

function ocultarError() {
  inputTarea.classList.remove('error-borde');
  mensajeError.classList.add('oculto');
}

/* =========================================
   LÓGICA PRINCIPAL
   ========================================= */

function agregarTarea() {
  const textoTarea = inputTarea.value;

  if (!esEntradaValida(textoTarea)) {
    mostrarError();
    return;
  }

  ocultarError();

  const nuevaTareaNodo = crearElementoTarea(textoTarea.trim());
  listaTareas.append(nuevaTareaNodo);

  // Limpiar el input después de agregar exitosamente
  inputTarea.value = '';
  inputTarea.focus();

  actualizarContador();
}

function manejarClicEnLista(evento) {
  const elementoClickeado = evento.target;
  const tareaNodo = elementoClickeado.closest('.tarea');

  // Si no se hizo clic dentro de una tarea, no hacer nada
  if (!tareaNodo) return;

  // Si se hizo clic en el botón eliminar
  if (elementoClickeado.closest('.boton-eliminar')) {
    eliminarTarea(tareaNodo);
    return;
  }

  // De lo contrario, se hizo clic en la tarea para completarla
  marcarCompletada(tareaNodo);
}

function eliminarTarea(elementoTarea) {
  elementoTarea.remove();
  actualizarContador();
}

function marcarCompletada(elementoTarea) {
  elementoTarea.classList.toggle('completada');
  actualizarContador();
}

/* =========================================
   INICIALIZACIÓN Y EVENTOS
   ========================================= */

// Evento para el botón de agregar
botonAgregar.addEventListener('click', agregarTarea);

// Evento para presionar la tecla Enter en el input
inputTarea.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    agregarTarea();
  }
});

// Evento para ocultar error dinámicamente al empezar a escribir
inputTarea.addEventListener('input', ocultarError);

// Delegación de eventos para la lista de tareas (maneja clic en completada y eliminar)
listaTareas.addEventListener('click', manejarClicEnLista);

// Actualizar el contador inicial
actualizarContador();
