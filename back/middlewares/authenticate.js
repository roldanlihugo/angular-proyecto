'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'faqx';

exports.auth = function(req,res,next) {

    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticacion'});
    }

    var token = req.headers.authorization.replace(/[""]+/g,'');

    var segment = token.split('.');

    if(segment.length != 3){
        return res.status(403).send({message: 'El token no es valido'});
    }else{
        try{
            var payload = jwt.decode(token,secret);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'El token ha expirado'});
            }
        }catch (error){
            return res.status(403).send({message: 'El token no es valido'});
        }
    }
    req.user = payload;
    next();
}