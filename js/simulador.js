let prestamos = [];
let tasas = [];

class Prestamo {
  constructor(nombre, monto, cuotas, tasa) {
    this.nombre = nombre;
    this.monto = monto;
    this.cuotas = cuotas;
    this.tasa = tasa;
    this.total = this.monto * (1 + this.tasa);
    this.cuotaMensual = this.total / this.cuotas;
  }
}

// Cargar tasas desde JSON (silencioso si falla)
async function cargarTasas() {
  try {
    const res = await fetch("data/tasas.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    tasas = await res.json();
  } catch (err) {
    tasas = [
      { minCuotas: 1,  maxCuotas: 12, tasa: 0.20 },
      { minCuotas: 13, maxCuotas: 24, tasa: 0.25 },
      { minCuotas: 25, maxCuotas: 48, tasa: 0.30 },
    ];
    console.log("No se pudo cargar tasas.json. Se usan tasas por defecto.");
  }
}

// Obtener tasa según número de cuotas
function obtenerTasa(cuotas) {
  const rango = tasas.find(t => cuotas >= t.minCuotas && cuotas <= t.maxCuotas);
  return rango ? rango.tasa : 0.20;
}

// Guardar préstamo
function guardarPrestamo(prestamo) {
  prestamos.push(prestamo);
  localStorage.setItem("simulaciones", JSON.stringify(prestamos));

  Swal.fire({
    icon: "success",
    title: "Simulación guardada",
    text: `El préstamo de ${prestamo.nombre} se guardó correctamente.`,
    confirmButtonText: "Aceptar",
  });
}

// Cargar préstamos guardados
function cargarPrestamosGuardados() {
  const data = localStorage.getItem("simulaciones");
  if (data) {
    prestamos = JSON.parse(data);
    mostrarSimulaciones();
  }
}

// Generar opciones dinámicas de cuotas
function generarOpcionesCuotas(min = 3, max = 48) {
  const select = document.getElementById("cuotas");
  if (select.options.length <= 1) {
    for (let i = min; i <= max; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `${i} cuotas`;
      select.appendChild(option);
    }
  }
}

// Mostrar resultado
function mostrarResultado(prestamo) {
  const contenedor = document.getElementById("resultadoSimulacion");
  contenedor.innerHTML = `
    <div class="resultado">
      <h3>Resumen del Préstamo</h3>
      <p><strong>Nombre:</strong> ${prestamo.nombre}</p>
      <p><strong>Monto solicitado:</strong> $${prestamo.monto}</p>
      <p><strong>Cuotas:</strong> ${prestamo.cuotas}</p>
      <p><strong>Tasa de interés:</strong> ${(prestamo.tasa*100).toFixed(2)}%</p>
      <p><strong>Total a pagar:</strong> $${prestamo.total.toFixed(2)}</p>
      <p><strong>Cuota mensual:</strong> $${prestamo.cuotaMensual.toFixed(2)}</p>
    </div>
  `;
}

// Mostrar todas las simulaciones
function mostrarSimulaciones() {
  const lista = document.getElementById("listaSimulaciones");
  lista.innerHTML = "";
  prestamos.forEach(p => {
    const item = document.createElement("li");
    item.textContent = `${p.nombre} - $${p.monto} en ${p.cuotas} cuotas de $${p.cuotaMensual.toFixed(2)} (${(p.tasa*100).toFixed(2)}%)`;
    lista.appendChild(item);
  });
}

// Borrar todas las simulaciones
function borrarSimulaciones() {
  localStorage.removeItem("simulaciones");
  prestamos = [];
  mostrarSimulaciones();
  Swal.fire({
    icon: "success",
    title: "Datos borrados",
    text: "Todas las simulaciones fueron eliminadas.",
    confirmButtonText: "Aceptar",
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  generarOpcionesCuotas();
  await cargarTasas();
  cargarPrestamosGuardados();

  const formulario = document.getElementById("formularioPrestamo");
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const monto = parseFloat(document.getElementById("monto").value);
    const cuotas = parseInt(document.getElementById("cuotas").value, 10);

    if (!nombre || isNaN(monto) || isNaN(cuotas)) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Completá nombre, monto y cuotas.",
      });
      return;
    }

    const tasa = obtenerTasa(cuotas);
    const prestamo = new Prestamo(nombre, monto, cuotas, tasa);

    mostrarResultado(prestamo);
    guardarPrestamo(prestamo);
    mostrarSimulaciones();
    formulario.reset();
  });

  document.getElementById("btnBorrar").addEventListener("click", borrarSimulaciones);
});
