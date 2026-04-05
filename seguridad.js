const prompt = require("prompt-sync")();
const logica = require('./logica.js');

function iniciarSesion() {
    let accesoConcedido = false;
    while (!accesoConcedido) {
        console.clear();
        console.log("==================================================");
        console.log("    SISTEMA DE SEGURIDAD - C.E.I. SIMON DIAZ");
        console.log("==================================================\n");

        let user = prompt("Usuario: ");
        let pass = prompt("Contraseña: ");

        if (user === logica.datos.credenciales.usuario && pass === logica.datos.credenciales.clave) {
            accesoConcedido = true;
            console.log("\n¡Acceso concedido! Bienvenido/a.");
            prompt("Presione Enter para continuar al menú principal...");
        } else {
            console.log("\nError: Usuario o contraseña incorrectos.");
            prompt("Presione Enter para intentar de nuevo...");
        }
    }
}

function cambiarCredenciales() {
    console.clear();
    console.log("--- CONFIGURACIÓN DE SEGURIDAD ---");
    let passActual = prompt("Contraseña actual: ");

    if (passActual === logica.datos.credenciales.clave) {
        logica.datos.credenciales.usuario = prompt("Nuevo usuario: ");
        logica.datos.credenciales.clave = prompt("Nueva contraseña: ");
        logica.guardarDatos();
        console.log("\n¡Credenciales actualizadas!");
    } else {
        console.log("\nContraseña incorrecta.");
    }
    prompt("\nPresione Enter para volver al menú...");
}

module.exports = {
    iniciarSesion,
    cambiarCredenciales
};