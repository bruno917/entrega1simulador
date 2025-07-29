let prestamos = [];

function generarTasaAleatoria() {
  const tasa = Math.random() * (1.10 - 0.15) + 0.15;
  return parseFloat(tasa.toFixed(2));
}

function calcularPrestamo(monto, cuotas) {
  const tasa = generarTasaAleatoria();
  const total = monto * (1 + tasa);
  const cuotaMensual = total / cuotas;
  return { total, cuotaMensual, tasa };
}

function guardarPrestamo(prestamo) {
  prestamos.push(prestamo);
  localStorage.setItem("simulaciones", JSON.stringify(prestamos));
}

function cargarPrestamosGuardados() {
  const data = localStorage.getItem("simulaciones");
  if (data) {
    prestamos = JSON.parse(data);
    mostrarSimulaciones();
  }
}

function mostrarResultado({ nombre, monto, cuotas, total, cuotaMensual, tasa }) {
  const contenedor = document.getElementById("resultadoSimulacion");
  contenedor.innerHTML = `
    <div class="resultado">
      <h3>Resumen del Préstamo</h3>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Monto solicitado:</strong> $${monto}</p>
      <p><strong>Cuotas:</strong> ${cuotas}</p>
      <p><strong>Tasa de interés:</strong> ${(tasa * 100).toFixed(2)}%</p>
      <p><strong>Total a pagar:</strong> $${total.toFixed(2)}</p>
      <p><strong>Cuota mensual:</strong> $${cuotaMensual.toFixed(2)}</p>
    </div>
  `;
}

function mostrarSimulaciones() {
  const lista = document.getElementById("listaSimulaciones");
  lista.innerHTML = "";
  prestamos.forEach((p, index) => {
    const item = document.createElement("li");
    item.textContent = `${p.nombre} - $${p.monto} en ${p.cuotas} cuotas de $${p.cuotaMensual.toFixed(2)} (${(p.tasa * 100).toFixed(2)}%)`;
    lista.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarPrestamosGuardados();

  const formulario = document.getElementById("formularioPrestamo");
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const monto = parseFloat(document.getElementById("monto").value);
    const cuotas = parseInt(document.getElementById("cuotas").value);

    if (!nombre || isNaN(monto) || isNaN(cuotas)) return;

    const resultado = calcularPrestamo(monto, cuotas);

    const prestamo = {
      nombre,
      monto,
      cuotas,
      total: resultado.total,
      cuotaMensual: resultado.cuotaMensual,
      tasa: resultado.tasa,
    };

    mostrarResultado(prestamo);
    guardarPrestamo(prestamo);
    mostrarSimulaciones();
    formulario.reset();
  });
});
