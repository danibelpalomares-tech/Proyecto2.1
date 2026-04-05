const dibujar = require('./modulo.js');
const prompt = require("prompt-sync")();

const logica = require('./logica.js'); 
const seguridad = require('./seguridad.js');

function mostrarMenu() {
    console.clear();
    dibujar(0, 2, "SISTEMA ADMINISTRATIVO DEL CEI SIMON DIAZ");
    dibujar(2, 4, "1. Marcar Asistencia (Entrada / Salida)");
    dibujar(2, 5, "2. Ver Registro de Asistencia del Día");
    dibujar(2, 6, "3. Empleados");
    dibujar(2, 7, "4. Permisos");
    dibujar(2, 8, "5. Cambiar Usuario / Contraseña");
    dibujar(2, 9, "6. Salir");
    
    dibujar(0, 11, ""); 
    let opcion = prompt("Ingrese el número de la opción: ");
    return opcion;
}

function menuEmpleados() {
    let salirEmp = false;
    while (!salirEmp) {
        console.clear();
        console.log("------ SUBMENÚ EMPLEADOS ------\n");
        console.log("1. Ver Lista de Empleados");
        console.log("2. Registrar Nuevo Empleado");
        console.log("3. Modificar Datos del Empleado");
        console.log("4. Eliminar Empleado");
        console.log("5. Volver al menú principal");
        console.log("");
        let opcEmp = prompt("Ingrese opción: ");
        
        switch(opcEmp) {
            case "1": logica.verEmpleados(); break;
            case "2": logica.registrarEmpleado(); break;
            case "3": logica.modificarEmpleado(); break;
            case "4": logica.eliminarEmpleado(); break;
            case "5": salirEmp = true; break;
            default: console.log("\nOpción no válida."); prompt("Presione Enter...");
        }
    }
}

function menuPermisos() {
    let salirPerm = false;
    while (!salirPerm) {
        console.clear();
        console.log("----- SUBMENÚ PERMISOS -----\n");
        console.log("1. Ver Lista de Permisos");
        console.log("2. Registrar Permiso");
        console.log("3. Volver al menú principal");
        console.log("");
        let opcPerm = prompt("Ingrese opción: ");
        
        switch(opcPerm) {
            case "1": logica.verPermisos(); break;
            case "2": logica.registrarPermiso(); break;
            case "3": salirPerm = true; break;
            default: console.log("\nOpción no válida."); prompt("Presione Enter...");
        }
    }
}
function iniciarSistema() {

    seguridad.iniciarSesion();

    let salir = false;
    while (!salir) {
        let opcionElegida = mostrarMenu();

    switch (opcionElegida) {
        case "1":
            logica.marcarAsistencia();
            break;
        case "2":
            logica.verAsistencia();
            break;
        case "3":
            menuEmpleados();
            break;
        case "4":
            menuPermisos();
            break;
        case "5":
            seguridad.cambiarCredenciales();
            break;
        case "6":
            salir = true;
            console.clear();
            console.log("Guardando datos... Cerrando el sistema del C.E.I. Simón Díaz. ¡Hasta pronto!");
            break;
            default:
            console.log("\nOpción no válida. Por favor, intente de nuevo.");
            prompt("Presione Enter para continuar...");
            break;
        }
    }
}

iniciarSistema();