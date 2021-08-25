// Se crea la app con express
var express = require("express")
var app = express()
var db = require("./database.js")
var bodyParser = require("body-parser");
var cors = require('cors')


// Parsear Body

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurando Cors
app.use(cors())

// Puerto del servidor
var HTTP_PORT = 8000
// Se inicia el servidor
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// EndPoint de Prueba
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Endpoint que devuelve la lista de ciudades
app.get("/api/ciudades", (req, res, next) => {
    var sql = "select * from ciudad"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

// Endpoint que devuelve la lista de grupos
app.get("/api/grupos", (req, res, next) => {
    var sql = "select * from grupo where disponible = 1"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

// Endpoint que crea un grupo

app.post("/api/grupos/crear", (req, res, next) => {
    var errors=[]

    if (!req.body.nombre){
        errors.push("El campo nombre es obligatorio");
    }

    if (!req.body.profesor){
        errors.push("El campo profesor guia es obligatorio");
    }

    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    var data = {
        nombre: req.body.nombre,
        profesor_guia: req.body.profesor,
        disponible : 1
    }
    var sql ='INSERT INTO grupo (nombre, profesor_guia, disponible) VALUES (?,?,?)'
    var params =[data.nombre, data.profesor_guia, data.disponible]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

// Endpoint que elimina grupos

app.post("/api/grupos/eliminar", (req, res, next) => {

    var errors=[]

    if (!req.body.lista){
        errors.push("Se debe enviar una lista de grupos para eliminar");
    }

    var listId = req.body.lista;
    listId.map((key)=>{
        db.run(
            'DELETE FROM grupo WHERE id = ?',
            key,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
            });
    });

    res.json({
        "message": "success",
    })
});

// Endpoint que devuelve la lista de estudiantes
app.get("/api/estudiantes", (req, res, next) => {
    var sql = "SELECT estudiante.id, estudiante.edad, estudiante.nombre, estudiante.email, estudiante.sexo, estudiante.fecha_nacimiento, grupo.nombre AS grupo, ciudad.nombre as lugar_nacimiento FROM estudiante JOIN grupo ON grupo.id = estudiante.grupo JOIN ciudad ON ciudad.id = estudiante.lugar_nacimiento";
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

// Endpoint que crea un estudiante

app.post("/api/estudiantes/crear", (req, res, next) => {
    var errors=[]

    if (!req.body.nombre){
        errors.push("El campo nombre es obligatorio");
    }

    if (!req.body.sexo){
        errors.push("El campo sexo es obligatorio");
    }

    if (!req.body.edad){
        errors.push("El campo edad es obligatorio");
    }

    if (!req.body.grupo){
        errors.push("El campo grupo es obligatorio");
    }

    if (!req.body.email){
        errors.push("El campo email es obligatorio");
    }

    if (!req.body.lugar_nacimiento){
        errors.push("El campo lugar de naciemiento es obligatorio");
    }

    if (!req.body.fecha_nacimiento){
        errors.push("El campo fecha de nacimiento es obligatorio");
    }

    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    var data = {
        nombre: req.body.nombre,
        edad: req.body.edad,
        sexo: req.body.sexo,
        grupo: req.body.grupo,
        email: req.body.email,
        lugar_nacimiento: req.body.lugar_nacimiento,
        fecha_nacimiento: req.body.fecha_nacimiento
    }
    var sql ='INSERT INTO estudiante (nombre, edad, sexo, grupo, email, lugar_nacimiento, fecha_nacimiento) VALUES (?,?,?,?,?,?,?)'
    var params =[data.nombre, data.edad, data.sexo, data.grupo, data.email, data.lugar_nacimiento, data.fecha_nacimiento]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})


// Endpoint que elimina estudiantes

app.post("/api/estudiantes/eliminar", (req, res, next) => {

    var errors=[]

    if (!req.body.lista){
        errors.push("Se debe enviar una lista de estudiantes para eliminar");
    }

    var listId = req.body.lista;
    listId.map((key)=>{
        db.run(
            'DELETE FROM estudiante WHERE id = ?',
            key,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
            });
    });

    res.json({
        "message": "success",
    })
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});