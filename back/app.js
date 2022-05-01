'use strict'

var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 4201;

var cliente_route = require('./routes/cliente');
var admin_route = require('./routes/admin');
const { login_cliente } = require('./controllers/ClienteController');

mongoose.connect('mongodb://127.0.0.1:27017/tienda',{useUnifiedTopology: true, useNewUrlParser: true},(err,resp)=>{
    if(err){
        console.log(err);
    }else{
        app.listen(port,function(){
            console.log('Servidor corriendo en el puerto '+port);
        });
    }
});

//analiza la petición
//analiza objeto json
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json({limit:'50mb', extended:true}));

// separar el back y front para 2 servidores distintos
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api',cliente_route);
app.use('/api',admin_route);
app.use('/api',login_cliente);

module.exports = app;
