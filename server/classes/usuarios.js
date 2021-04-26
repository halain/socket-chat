
class Usuarios {
    constructor(){
        this.personas = [];
    }

    //id= id del socket
    agregarPersona(id, nombre, sala){
        let persona = { id, nombre, sala };
        this.personas.push(persona);
        return this.personas;
    }

    getPersona(id){
        let persona = this.personas.filter(per=>per.id === id)[0];
        return persona;
    }

    getPersonas(){
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personas = this.personas.filter(per => per.sala === sala )
        return personas;
    }

    borrarPersona(id){
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(per => per.id !== id );
        return personaBorrada;
    };

}



module.exports = {
    Usuarios
}