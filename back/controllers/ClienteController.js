'use strict'

var Cliente =  require('../models/cliente');
const bcrypt = require('bcrypt')
var jwt = require('../helpers/jwt');

    //llenar el controlador
const registro_cliente = async function(req,res){

    var data = req.body;
    var clientes_arr = [];

    //Verificando el email
    clientes_arr = await Cliente.find({email:data.email});

    //Validar registro
    if(clientes_arr.length == 0){

        //var reg = await Cliente.create(data);
        if(data.password){
            bcrypt.hash(data.password,10,async function(err,hash){
                if(hash){
                    // console.log(hash);
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message:'ErrorServer',data:undefined});
                }
            })
        }else{
            res.status(200).send({message:'No hay una contraseña',data:undefined});
        }

    }else{
        res.status(200).send({message:'El correo ya existe en la base de datos',data:undefined});
    }
}

const login_cliente = async function(req,res){
    var data = req.body;
    var clientes_arr = [];

    //Verificando el email
    clientes_arr = await Cliente.find({email:data.email});

    //Validar registro
    if(clientes_arr.length == 0){
        res.status(200).send({message:'No se encuentra el correo',data:undefined});
    }else{
        //LOGIN
        let user = clientes_arr[0];
        bcrypt.compare(data.password, user.password, async function(error,check){
            if(check){
                res.status(200).send({
                    data:user,
                    token:jwt.createToken(user)
                });
            }else{
                res.status(200).send({message:'La contraseña no coincide',data:undefined});
            }
        });

    }

}

const listar_clientes_filtro_admin = async function(req,res){
    console.log(req.user);
    if(req.user){
        if(req.user.role == 'admin'){
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];

            console.log(tipo);

            if(tipo == null || tipo == 'null'){
              let reg = await Cliente.find();
              res.status(200).send({data:reg});
            }else{
              if(tipo == 'apellidos'){
                let reg = await Cliente.find({apellidos:new RegExp(filtro,'i')});
                res.status(200).send({data:reg});

              }else if(tipo == 'correo'){
                let reg = await Cliente.find({email:new RegExp(filtro,'i')});
                res.status(200).send({data:reg});
              }
            }
        }else{
            res.status(500).send({message:'No tiene permisos para realizar esta accion'});
        }
    }else{
        res.status(500).send({message:'No tiene permisos para realizar esta accion'});
    }
}

const registro_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            var data = req.body;

            bcrypt.hash('123456789',10, async function(err,hash){
                if(hash){
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message:'Hubo un error en el servidor',data:undefined});
                }
            })
        }else{
            res.status(500).send({message:'NoAccess'});
        }
    }else{
        res.status(500).send({message:'NoAccess'});
    }
}

const obtener_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            var id = req.params['id'];

            try {
                var reg = await Cliente.findById({_id:id});

                res.status(200).send({data:reg});
            } catch (error) {
                res.status(200).send({data:undefined});
            }

        }else{
            res.status(500).send({message:'NoAccess'});
        }
    }else{
        res.status(500).send({message:'NoAccess'});
    }
}

const actualizar_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            var id = req.params['id'];
            var data = req.body;

            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                genero: data.genero
            })
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message:'NoAccess'});
        }
    }else{
        res.status(500).send({message:'NoAccess'});
    }
}

const eliminar_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            var id = req.params['id'];

            let reg = await Cliente.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg});

        }else{
            res.status(500).send({message:'NoAccess'});
        }
    }else{
        res.status(500).send({message:'NoAccess'});
    }
}

const obtener_cliente_guest = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        try{
            var reg = await Cliente.findById({_id:id});
            res.status(200).send({data:reg});

        }catch (error){
            res.status(200).send({data:undefined});

        }
    }else{
        res.status(500).send({message:'NoAccess'});
    }
}

const actualizar_perfil_cliente_guest = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var data = req.body;

        console.log(data.password);

        if(data.password){
            console.log('Con contraseña');
            bcrypt.hash(data.password,10,async function(err,hash){
                console.log(hash);
                var reg = await Cliente.findByIdAndUpdate({_id:id},{
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono: data.telefono,
                    f_nacimiento: data.f_nacimiento,
                    dni: data.dni,
                    genero: data.genero,
                    pais: data.pais,
                    password:hash,
                });
                res.status(200).send({data:reg});
            });

        }else{
            console.log('Sin contraseña');
            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                genero: data.genero,
                pais: data.pais
            });
            res.status(200).send({data:reg});
        }



    }else{
        res.status(500).send({message:'NoAccess'});
    }
}

module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest
}
