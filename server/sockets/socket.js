const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');


const usuarios = new Usuarios();


io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) =>{
        // console.log(data);
        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })
        }
        //unir cliente a una sala
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        //lista de usuarios en la misma sala
        let usuariosSala = usuarios.getPersonasPorSala(data.sala);
        //emitir solo a clientes de la misma sala
        client.broadcast.to(data.sala).emit('listaPersonas', usuariosSala);
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió al chat`) );

        callback(usuariosSala);
    });

    
    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        //emitir mensaje a toda una sala
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    client.on('disconnect', ()=>{
        let personaBorrada = usuarios.borrarPersona(client.id);
        //notificar solo a las salas de la persona que salio
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`) );
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('mensajePrivado', (data) => {
            let persona = usuarios.getPersona(client.id);
            //enviar el mensaje a una persona privado 
            client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

  

});