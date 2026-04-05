const prompt = require("prompt-sync")();
const fs = require('fs');

const Empleado = require('./clases.js'); 

const FILE_DATOS = __dirname + '/datos.json';

let datos = {
    credenciales: { usuario: "admin", clave: "1234" },
    empleados: [],
    asistencias: [],
    permisos: []
};

if (fs.existsSync(FILE_DATOS)) {
    let archivoLeido = JSON.parse(fs.readFileSync(FILE_DATOS, 'utf-8'));
    datos.credenciales = archivoLeido.credenciales;
    datos.asistencias = archivoLeido.asistencias;
    datos.permisos = archivoLeido.permisos|| []; 

    if (archivoLeido.empleados) {
        datos.empleados = archivoLeido.empleados.map(
            emp => new Empleado(emp.cedula, emp.nombre, emp.cargo, emp.telefono, emp.correo)
        );
    }
}

function guardarDatos() {
    fs.writeFileSync(FILE_DATOS, JSON.stringify(datos, null, 2));
}

function marcarAsistencia() {
    console.clear();
    console.log("--- MARCAR ASISTENCIA ---\n");
    let cedula = prompt("Ingrese su número de cédula: ");

    let empleadoEncontrado = datos.empleados.find(emp => emp.cedula === cedula);

    if (empleadoEncontrado) {
        let fechaActual = new Date();
        let horaFichaje = fechaActual.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        let fechaFichaje = fechaActual.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });

        let registroHoy = datos.asistencias.find(a => a.cedula === cedula && a.fecha === fechaFichaje);

        if (!registroHoy) {
            let nuevaAsistencia = {
                cedula: empleadoEncontrado.cedula,
                fecha: fechaFichaje,
                horaEntrada: horaFichaje,
                horaSalida: "Pendiente"
            };
            datos.asistencias.push(nuevaAsistencia);
            console.log(`\n¡ENTRADA registrada con éxito!`);
            console.log(`Bienvenido/a, ${empleadoEncontrado.nombre}. Hora: ${horaFichaje}`);
        } else if (registroHoy.horaSalida === "Pendiente") {
            registroHoy.horaSalida = horaFichaje;
            console.log(`\n¡SALIDA registrada con éxito!`);
            console.log(`Hasta luego, ${empleadoEncontrado.nombre}. Hora: ${horaFichaje}`);
        } else {
            console.log(`\nYa has completado tu jornada de hoy, ${empleadoEncontrado.nombre}.`);
            console.log(`Entrada: ${registroHoy.horaEntrada} | Salida: ${registroHoy.horaSalida}`);
        }
        guardarDatos();
    } else {
        console.log("\nError: Cédula no encontrada. Registre al empleado primero.");
    }
    prompt("\nPresione Enter para volver al menú...");
}

function verAsistencia() {
    console.clear();
    let fechaHoy = new Date().toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
    console.log(`---------------------- REPORTE DE ASISTENCIA DEL DÍA: ${fechaHoy} ----------------------`);

    let asistenciasHoy = datos.asistencias.filter(a => a.fecha === fechaHoy);

    if (asistenciasHoy.length === 0) {
        console.log("\nNo hay asistencias registradas para el día de hoy.");
    } else {
        
        console.log("\n" + "ENTRADA".padEnd(12) + " | " + "SALIDA".padEnd(12) + " | " + "CÉDULA".padEnd(12) + " | " + "NOMBRE".padEnd(20) + " | " + "CARGO");
        console.log("-".repeat(87)); 

        for (let i = 0; i < asistenciasHoy.length; i++) {
            let reg = asistenciasHoy[i];
            let datosEmp = datos.empleados.find(emp => emp.cedula === reg.cedula);

            let nombre = datosEmp ? datosEmp.nombre : "Desconocido";
            let cargo = datosEmp ? datosEmp.cargo : "Desconocido";

            let ent = reg.horaEntrada.padEnd(12);
            let sal = reg.horaSalida.padEnd(12);
            let ced = reg.cedula.padEnd(12);
            let nom = nombre.padEnd(20);

            console.log(`${ent} | ${sal} | ${ced} | ${nom} | ${cargo}`);
        }
    }
    console.log("");
    prompt("Presione Enter para volver al menú...");
}

function registrarEmpleado() {
    console.clear();
    console.log("--- REGISTRAR NUEVO EMPLEADO ---");
    console.log("(Escriba '0' en cualquier momento para CANCELAR)\n");

    let cedula = "";
    while (cedula.trim() === "") {
        cedula = prompt("Cédula: ");
        if (cedula === "0") { console.log("\nOperación cancelada."); prompt("\nPresione Enter..."); return; }
        if (cedula.trim() === "") console.log("La cédula no puede estar vacía.");
    }
    
    let existe = datos.empleados.find(emp => emp.cedula === cedula);
    if (existe) {
        console.log("\nError: Ya existe un empleado con esa cédula.");
    } else {
        let nombre = "";
        while (nombre.trim() === "") {
            nombre = prompt("Nombre y Apellido: ");
            if (nombre === "0") { console.log("\nOperación cancelada."); prompt("\nPresione Enter..."); return; }
            if (nombre.trim() === "") console.log("El nombre no puede estar vacío.");
        }

        let telefono = prompt("Teléfono (Presione Enter para omitir o '0' para cancelar): ");
        if (telefono === "0") { console.log("\nOperación cancelada."); prompt("\nPresione Enter..."); return; }
        if (telefono.trim() === "") telefono = "No registrado";

        let correo = prompt("Correo electrónico (Presione Enter para omitir o '0' para cancelar): ");
        if (correo === "0") { console.log("\nOperación cancelada."); prompt("\nPresione Enter..."); return; }
        if (correo.trim() === "") correo = "No registrado";

        let cargoElegido = "";
        while (cargoElegido === "") {
            console.log("\n1. Obrero | 2. Docente | 3. Administrativo");
            let opcCargo = prompt("Seleccione el cargo (1-3) o '0' para cancelar: ");
            if (opcCargo === "0") { console.log("\nOperación cancelada."); prompt("\nPresione Enter..."); return; }
            else if (opcCargo === "1") cargoElegido = "Obrero";
            else if (opcCargo === "2") cargoElegido = "Docente";
            else if (opcCargo === "3") cargoElegido = "Administrativo";
            else console.log("Opción inválida.");
        }

        let nuevoEmpleadoPOO = new Empleado(cedula, nombre, cargoElegido, telefono, correo);
        datos.empleados.push(nuevoEmpleadoPOO);
        guardarDatos();
        console.log(`\n¡${nuevoEmpleadoPOO.nombre} registrado exitosamente!`);
    }
    prompt("\nPresione Enter para volver al menú...");
}

function modificarEmpleado() {
    console.clear();
    console.log("--- MODIFICAR DATOS DEL EMPLEADO ---\n");
    let cedula = prompt("Ingrese la cédula del empleado a modificar (o '0' para cancelar): ");
    if (cedula === "0") return;

    let emp = datos.empleados.find(e => e.cedula === cedula);
    if (emp) {
        console.log(`\nModificando a: ${emp.nombre} (${emp.cargo})`);
        let nuevoNombre = prompt(`Nuevo Nombre [Actual: ${emp.nombre}]: `);
        if (nuevoNombre.trim() !== "") {
            emp.nombre = nuevoNombre; 
        }
        let nuevoTelefono = prompt(`Nuevo teléfono [Actual: ${emp.telefono}]: `);
        if (nuevoTelefono.trim() !== "") {
            emp.telefono = nuevoTelefono;
        }

        let nuevoCorreo = prompt(`Nuevo correo [Actual: ${emp.correo}]: `);
        if (nuevoCorreo.trim() !== "") {
            emp.correo = nuevoCorreo;
}

    guardarDatos();
        let cambiar = prompt(`¿Cambiar cargo actual (${emp.cargo})? (s/n): `);
        if (cambiar.toLowerCase() === "s") {
            let valido = false;
            while (!valido) {
                let opc = prompt("1. Obrero | 2. Docente | 3. Administrativo -> ");
                if (opc === "1") { emp.cargo = "Obrero"; valido = true; }
                else if (opc === "2") { emp.cargo = "Docente"; valido = true; }
                else if (opc === "3") { emp.cargo = "Administrativo"; valido = true; }
                else console.log("Opción inválida.");
            }
        }
    guardarDatos();
        console.log("\n¡Datos actualizados!");
    } else {
        console.log("\nError: Empleado no encontrado.");
    }
    prompt("\nPresione Enter para volver al menú...");
}

function eliminarEmpleado() {
    console.clear();
    console.log("--- ELIMINAR EMPLEADO ---\n");
    let cedula = prompt("Cédula a eliminar (o '0' para cancelar): ");
    if (cedula === "0") return;

    let indice = datos.empleados.findIndex(emp => emp.cedula === cedula);
    if (indice !== -1) {
        let conf = prompt(`¿SEGURO que desea eliminar a ${datos.empleados[indice].nombre}? (s/n): `);
        if (conf.toLowerCase() === "s") {
            datos.empleados.splice(indice, 1);
            guardarDatos();
            console.log("\n¡Empleado eliminado!");
        } else {
            console.log("\nOperación cancelada.");
        }
    } else {
        console.log("\nError: Cédula no encontrada.");
    }
    prompt("\nPresione Enter para volver al menú...");
}

function verEmpleados() {
    console.clear();
    console.log("-------------------- NÓMINA DE EMPLEADOS ---------------------");
    if (datos.empleados.length === 0) {
        console.log("No hay empleados registrados.");
    } else {
        console.log("\n" + "Nº".padEnd(4) + "| " + "CÉDULA".padEnd(12) + "| " + "NOMBRE".padEnd(25) + "| " + "CARGO");
        console.log("-".repeat(62));

        datos.empleados.forEach((emp, i) => {
            let num = (i + 1).toString().padEnd(4);
            let ced = emp.cedula.padEnd(12);
            let nom = emp.nombre.padEnd(25);
            console.log(`${num}| ${ced}| ${nom}| ${emp.cargo}`);
        });
    }
    prompt("\nPresione Enter para volver al menú...");
}

function registrarPermiso() {
    console.clear();
    console.log("--- REGISTRAR PERMISO ---\n");
    let cedula = prompt("Ingrese la cédula del empleado: ");

    let empleado = datos.empleados.find(emp => emp.cedula === cedula);
    if (!empleado) {
        console.log("Error: Empleado no encontrado.");
        prompt("\nPresione Enter para volver...");
        return;
    }

    console.log(`\nEmpleado seleccionado: ${empleado.nombre} - ${empleado.cargo}`);
    console.log("Tipos de permiso: 1. Médico | 2. Personal | 3. Vacaciones");
    let opcionTipo = prompt("Seleccione el tipo (1/2/3): ");

    let tipo = "";
    if (opcionTipo === "1") tipo = "Médico";
    else if (opcionTipo === "2") tipo = "Personal";
    else if (opcionTipo === "3") tipo = "Vacaciones";
    else {
        console.log("Opción inválida.");
        prompt("\nPresione Enter para cancelar...");
        return;
    }

    let desde = prompt("Desde (Ej: DD/MM/AAAA): ");
    let hasta = prompt("Hasta (Ej: DD/MM/AAAA): ");

    datos.permisos.push({ cedula, nombre: empleado.nombre, tipo, desde, hasta });
    guardarDatos();
    console.log("\n¡Permiso registrado con éxito!");
    prompt("\nPresione Enter para volver...");
}

function verPermisos() {
    console.clear();
    console.log("---------------------------- LISTA DE PERMISOS ----------------------------");
    if (!datos.permisos || datos.permisos.length === 0) {
        console.log("No hay permisos registrados.");
    } else {
        console.log("\n" + "CÉDULA".padEnd(12) + "| " + "NOMBRE".padEnd(20) + "| " + "TIPO".padEnd(12) + "| " + "DESDE".padEnd(12) + "| " + "HASTA");
        console.log("-".repeat(75));

        datos.permisos.forEach(p => {
            let ced = p.cedula.padEnd(12);
            let nom = p.nombre.padEnd(20);
            let tip = p.tipo.padEnd(12);
            let des = p.desde.padEnd(12);
            console.log(`${ced}| ${nom}| ${tip}| ${des}| ${p.hasta}`);
        });
    }
    prompt("\nPresione Enter para volver...");
}

module.exports = {
    datos,
    guardarDatos,
    marcarAsistencia,
    verAsistencia,
    registrarEmpleado,
    modificarEmpleado,
    eliminarEmpleado,
    verEmpleados,
    registrarPermiso,
    verPermisos,
    
};