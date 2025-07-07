let prestamos = [];

function generarTasaAleatoria() {
  const tasa = Math.random() * (1.10 - 0.15) + 0.15;
return parseFloat(tasa.toFixed(2));
}

function pedirDatos() {
const nombre = prompt("Ingrese su nombre:");
const monto = parseFloat(prompt("¿Cuánto dinero desea solicitar?"));
const cuotas = parseInt(prompt("¿En cuántas cuotas desea pagar? (3, 6, 12)"));
return { nombre, monto, cuotas };
}

function calcularPrestamo(monto, cuotas) {
const tasa = generarTasaAleatoria();
  const total = monto * (1 + tasa);
const cuotaMensual = total / cuotas;
return { total, cuotaMensual, tasa };
}

function mostrarResumen(nombre, monto, cuotas, total, cuotaMensual, tasa) {
alert(
    "Resumen de tu préstamo:\n\n" +
    "Nombre: " + nombre + "\n" +
    "Monto solicitado: $" + monto + "\n" +
    "Cuotas: " + cuotas + "\n" +
    "Tasa de interés: " + (tasa * 100).toFixed(2) + "%\n" +
    "Total a pagar: $" + total.toFixed(2) + "\n" +
    "Cuota mensual: $" + cuotaMensual.toFixed(2)
);
}

function simuladorPrestamo() {
const datos = pedirDatos();
const resultado = calcularPrestamo(datos.monto, datos.cuotas);

mostrarResumen(
    datos.nombre,
    datos.monto,
    datos.cuotas,
    resultado.total,
    resultado.cuotaMensual,
    resultado.tasa
);

const confirmar = confirm("¿Desea guardar esta simulación?");
if (confirmar) {
    prestamos.push({
    nombre: datos.nombre,
    monto: datos.monto,
    cuotas: datos.cuotas,
    total: resultado.total,
    cuotaMensual: resultado.cuotaMensual,
    tasa: resultado.tasa
    });
    console.log("Simulación guardada:", prestamos);
} else {
    alert("No se guardó la simulación.");
}
}
