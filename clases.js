class Persona {
   
    #cedula;
    #nombre;
    #telefono;
    #correo;

    constructor(cedula, nombre, telefono="", correo="") {
        this.#cedula = cedula;
        this.#nombre = nombre;
        this.#telefono = telefono;
        this.#correo = correo;
    }

    get cedula() {
        return this.#cedula;
    }

    get nombre() {
        return this.#nombre;
    }
    set nombre(nuevoNombre) {
        if (nuevoNombre.trim() !== "") {
            this.#nombre = nuevoNombre;
        }
    }
    get telefono() {
        return this.#telefono;
    }
    set telefono(nuevoTelefono) {
        if (nuevoTelefono.trim() !== "") {
            this.#telefono = nuevoTelefono;
        }
    }

    get correo() {
        return this.#correo;
    }
    set correo(nuevoCorreo) {
        if (nuevoCorreo.trim() !== "") {
            this.#correo = nuevoCorreo;
        }
    }   
}

class Empleado extends Persona {

    #cargo;

    constructor(cedula, nombre, cargo, telefono="", correo="") {
        
        super(cedula, nombre, telefono, correo);
        this.#cargo = cargo;
    }

    get cargo() {
        return this.#cargo;
    }

    set cargo(nuevoCargo) {
        this.#cargo = nuevoCargo;
    }

    toJSON() {
        return {
            cedula: this.cedula,
            nombre: this.nombre,
            cargo: this.cargo,
            telefono: this.telefono,
            correo: this.correo
        };
    }
}

module.exports = Empleado;